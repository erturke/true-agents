/**
 * A2A Orchestrator
 * Main orchestrator for multi-agent workflow with dynamic handoff
 */

import { randomUUID } from 'crypto';
import type {
  Persona,
  WorkflowConfig,
  WorkflowState,
  AgentContext,
  CLIOptions
} from '../types/a2a.js';
import { AgentRuntime } from './agent-runtime.js';
import { HandoffParser } from './handoff-parser.js';
import { RetryManager } from './retry-manager.js';
import { InteractiveController, UserIntervention } from './interactive.js';
import { TaskAnalyzer } from './task-analyzer.js';

/**
 * Main A2A orchestrator
 */
export class A2AOrchestrator {
  private runtime: AgentRuntime;
  private parser: HandoffParser;
  private retryManager: RetryManager;
  private interactive: InteractiveController;
  private onProgress?: (state: WorkflowState) => void;

  constructor(
    directory?: string,
    interactive: boolean = true,
    onProgress?: (state: WorkflowState) => void
  ) {
    this.runtime = new AgentRuntime(directory, this.streamData.bind(this));
    this.parser = new HandoffParser();
    this.retryManager = new RetryManager({
      maxRetries: 3,
      backoffMs: 1000,
      exponentialBackoff: true
    });
    this.interactive = new InteractiveController(interactive);
    this.onProgress = onProgress;
  }

  /**
   * Execute a workflow
   */
  async execute(config: WorkflowConfig): Promise<WorkflowState> {
    // Define personas if not provided
    let personas = config.personas;
    if (!personas) {
      personas = this.detectPersonas(config.task);
    }

    // Initialize workflow state
    const state: WorkflowState = {
      id: randomUUID(),
      config,
      currentPersonaIndex: 0,
      personas,
      results: [],
      startTime: Date.now(),
      status: 'running'
    };

    // Print workflow start
    this.printWorkflowStart(state);

    try {
      // Execute workflow
      await this.runWorkflow(state);

      // Success
      state.status = 'completed';
      this.printWorkflowComplete(state);

    } catch (error) {
      state.status = 'failed';
      console.error(`\n❌ Workflow failed: ${(error as Error).message}`);

    } finally {
      this.interactive.close();
    }

    return state;
  }

  /**
   * Main workflow loop
   */
  private async runWorkflow(state: WorkflowState): Promise<void> {
    const userMessages: string[] = [];
    let jumpToPersona: Persona | undefined;

    while (this.hasNextAgent(state)) {
      const currentPersona = jumpToPersona || this.getCurrentPersona(state);
      if (!currentPersona) break;

      // Update index if we jumped
      if (jumpToPersona) {
        state.currentPersonaIndex = state.personas.indexOf(jumpToPersona);
        jumpToPersona = undefined;
      }

      // Build agent context
      const context: AgentContext = {
        task: state.config.task,
        previousOutputs: state.results.map(r => r.output),
        conversationHistory: this.buildConversationHistory(state),
        userMessages: userMessages.length > 0 ? userMessages : undefined,
        documents: (state.config as any).documents // Access documents from config
      };

      // Execute agent with retry
      const result = await this.executeAgentWithRetry(currentPersona, context, state);
      state.results.push(result);

      // Parse output for handoff
      const parsed = this.parser.parse(result.output.raw, currentPersona);
      result.output = { ...result.output, ...parsed };

      // Notify progress
      if (this.onProgress) {
        this.onProgress(state);
      }

      // Check for completion
      if (this.parser.isComplete(result.output.raw)) {
        console.log('\n✅ WORKFLOW COMPLETE - No more handoffs needed');
        break;
      }

      // Handle handoff
      const intervention = await this.handleHandoff(result, state);
      userMessages.length = 0; // Clear user messages after use

      // Handle user intervention
      if (intervention.action === 'stop') {
        state.status = 'stopped';
        console.log('\n⏹️  Workflow stopped by user');
        break;
      }

      if (intervention.action === 'retry') {
        // Remove last result and retry
        state.results.pop();
        state.currentPersonaIndex--;
        continue;
      }

      if (intervention.action === 'jump' && intervention.jumpTo) {
        jumpToPersona = intervention.jumpTo;
        continue;
      }

      if (intervention.action === 'pass' && intervention.message) {
        userMessages.push(intervention.message);
      }

      // Move to next agent
      state.currentPersonaIndex++;
    }
  }

  /**
   * Execute agent with retry logic
   */
  private async executeAgentWithRetry(
    persona: Persona,
    context: AgentContext,
    state: WorkflowState
  ): Promise<any> {
    const key = `${state.id}-${persona}`;

    return this.retryManager.execute(key, async () => {
      const result = await this.runtime.execute(persona, context);
      return result;
    });
  }

  /**
   * Handle handoff between agents
   */
  private async handleHandoff(
    result: any,
    state: WorkflowState
  ): Promise<UserIntervention> {
    const handoff = result.output.handoff;

    // If no handoff detected, auto-determine next
    if (!handoff) {
      const nextPersona = this.getNextPersona(state);
      if (!nextPersona) {
        // End of workflow
        return { action: 'stop' };
      }

      // Create implicit handoff
      result.output.handoff = {
        from: result.persona,
        to: nextPersona,
        reason: 'Auto-handoff (next in workflow)'
      };
    }

    // Check if handoff is to USER (workflow complete)
    if (result.output.handoff?.to === 'user') {
      console.log('\n✅ WORKFLOW COMPLETE - Handoff to user');
      return { action: 'stop' };
    }

    // Check if handoff is to ALL (broadcast, end of workflow)
    if (result.output.handoff?.to === 'all') {
      console.log('\n✅ WORKFLOW COMPLETE - Broadcast to all');
      return { action: 'stop' };
    }

    // Interactive prompt
    const nextPersona = result.output.handoff?.to as Persona;
    const canContinue = this.isValidNextStep(result.persona, nextPersona);

    return this.interactive.promptIntervention({
      currentAgent: result.persona,
      nextAgent: nextPersona,
      result,
      canContinue,
      canRetry: true,
      retryCount: this.retryManager.getAttempts(`${state.id}-${result.persona}`).length - 1
    });
  }

  /**
   * Stream data to terminal
   */
  private streamData(data: string, isStderr: boolean): void {
    if (isStderr) {
      process.stderr.write(data);
    } else {
      process.stdout.write(data);
    }
  }

  /**
   * Detect required personas from task
   */
  private detectPersonas(task: string): Persona[] {
    const analyzer = new TaskAnalyzer();
    const analysis = analyzer.analyze(task);

    // Print analysis for visibility
    console.log(`\n🧠 Task Analysis:`);
    console.log(`   Complexity: ${analysis.complexity}`);
    console.log(`   Actions: ${analysis.actionTypes.join(', ')}`);
    console.log(`   Personas: ${analysis.suggestedPersonas.join(' → ')}`);

    return analysis.suggestedPersonas;
  }

  /**
   * Build conversation history for display
   */
  private buildConversationHistory(state: WorkflowState): string {
    if (state.results.length === 0) return '';

    const lines: string[] = [];
    for (const result of state.results) {
      if (result.output.handoff) {
        const h = result.output.handoff;
        const icon = this.runtime.getPersonaConfig(result.persona).icon;
        lines.push(`💬 ${icon} ${result.persona.toUpperCase()} -> ${h.to.toUpperCase()}: ${h.reason}`);
      }
    }
    return lines.join('\n');
  }

  /**
   * Check if there's a next agent
   */
  private hasNextAgent(state: WorkflowState): boolean {
    return state.currentPersonaIndex < state.personas.length;
  }

  /**
   * Get current persona
   */
  private getCurrentPersona(state: WorkflowState): Persona | undefined {
    return state.personas[state.currentPersonaIndex];
  }

  /**
   * Get next persona in sequence
   */
  private getNextPersona(state: WorkflowState): Persona | undefined {
    const nextIndex = state.currentPersonaIndex + 1;
    return state.personas[nextIndex];
  }

  /**
   * Check if next step is valid
   */
  private isValidNextStep(from: Persona, to: Persona): boolean {
    // All personas can handoff to any other persona (flexible)
    return true;
  }

  /**
   * Print workflow start
   */
  private printWorkflowStart(state: WorkflowState): void {
    console.log('\n' + '█'.repeat(80));
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█${' '.repeat(20)}🚀 A2A WORKFLOW STARTING${' '.repeat(38)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█  Task: ${state.config.task.substring(0, 65)}${state.config.task.length > 65 ? '...' : ''}${' '.repeat(78 - 6 - Math.min(state.config.task.length, 68) - 3)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█  Workflow: ${state.personas.join(' -> ').padEnd(69)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log('█' + '█'.repeat(79));
  }

  /**
   * Print workflow completion
   */
  private printWorkflowComplete(state: WorkflowState): void {
    const duration = Date.now() - state.startTime;
    const successCount = state.results.filter(r => r.output.success).length;

    console.log('\n' + '█'.repeat(80));
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█${' '.repeat(20)}✅ WORKFLOW COMPLETE${' '.repeat(42)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log(`█  Duration: ${duration}ms${' '.repeat(67)}█`);
    console.log(`█  Agents: ${state.results.length} executed, ${successCount} successful${' '.repeat(78 - 12 - String(state.results.length).length - String(successCount).length - 14)}█`);
    console.log(`█${' '.repeat(78)}█`);
    console.log('█' + '█'.repeat(79));
  }
}
