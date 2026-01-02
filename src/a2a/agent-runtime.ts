/**
 * A2A Agent Runtime
 * Spawns Claude Code CLI with piped I/O for A2A communication
 */

import { spawn, ChildProcess } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import type {
  Persona,
  AgentContext,
  AgentOutput,
  AgentResult,
  CLIOptions
} from '../types/a2a.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Persona configuration (same as cli.ts)
interface PersonaConfig {
  id: Persona;
  name: string;
  icon: string;
  trigger: string[];
  thinking: string;
  model: string;
  description: string;
  file: string;
}

const PERSONAS: Record<Persona, PersonaConfig> = {
  // CORE
  sentinel: {
    id: 'sentinel',
    name: 'SENTINEL',
    icon: '🛡️',
    trigger: ['verify', 'validate', 'final check', 'sentinel'],
    thinking: 'ultrathink',
    model: 'opus',
    description: '🛡️ SENTINEL - Independent completion verification',
    file: 'personas/core/sentinel.md'
  },
  referee: {
    id: 'referee',
    name: 'REFEREE',
    icon: '🎯',
    trigger: ['decide', 'approve', 'judge', 'referee'],
    thinking: 'think hard',
    model: 'opus',
    description: '🎯 REFEREE - Final decision maker (1-10 scoring)',
    file: 'personas/core/referee.md'
  },
  recorder: {
    id: 'recorder',
    name: 'RECORDER',
    icon: '📋',
    trigger: ['checkpoint', 'state', 'log', 'save', 'recorder'],
    thinking: 'think',
    model: 'sonnet',
    description: '📋 RECORDER - State & checkpoint manager',
    file: 'personas/core/recorder.md'
  },
  auditor: {
    id: 'auditor',
    name: 'AUDITOR',
    icon: '🔍',
    trigger: ['gate', 'reality', 'validate', 'auditor'],
    thinking: 'think',
    model: 'sonnet',
    description: '🔍 AUDITOR - Quality gate & reality validator',
    file: 'personas/core/auditor.md'
  },

  // SPECIALIST
  architect: {
    id: 'architect',
    name: 'ARCHITECT',
    icon: '🏗️',
    trigger: ['write', 'create', 'implement', 'fix', 'code', 'build', 'architect'],
    thinking: 'think hard',
    model: 'sonnet',
    description: '🏗️ ARCHITECT - Builder & implementer',
    file: 'personas/specialist/architect.md'
  },
  explorer: {
    id: 'explorer',
    name: 'EXPLORER',
    icon: '🌐',
    trigger: ['research', 'find', 'search', 'learn', 'best practice', 'explorer'],
    thinking: 'think',
    model: 'sonnet',
    description: '🌐 EXPLORER - Researcher & explorer',
    file: 'personas/specialist/explorer.md'
  },
  analyst: {
    id: 'analyst',
    name: 'ANALYST',
    icon: '🔬',
    trigger: ['analyze', 'data', 'metrics', 'query', 'sql', 'analyst'],
    thinking: 'think',
    model: 'sonnet',
    description: '🔬 ANALYST - Data analyst',
    file: 'personas/specialist/analyst.md'
  },
  test: {
    id: 'test',
    name: 'TEST',
    icon: '🧪',
    trigger: ['test', 'verify', 'check'],
    thinking: 'think',
    model: 'sonnet',
    description: '🧪 TEST - Verifier & tester',
    file: 'personas/specialist/test.md'
  },
  archaeologist: {
    id: 'archaeologist',
    name: 'ARCHAEOLOGIST',
    icon: '🏛️',
    trigger: ['understand', 'explain', 'read', 'structure', 'archaeologist'],
    thinking: 'think',
    model: 'sonnet',
    description: '🏛️ ARCHAEOLOGIST - Code analyst & archaeologist',
    file: 'personas/specialist/archaeologist.md'
  }
};

/**
 * Load persona prompt from markdown file
 */
function loadPersonaPrompt(persona: Persona): string {
  const config = PERSONAS[persona];
  const fullPath = join(__dirname, '..', '..', config.file);

  try {
    const content = readFileSync(fullPath, 'utf-8');
    return `You are ${config.name}.\n\nRead and follow this persona definition:\n\n${content}`;
  } catch (err) {
    return `You are ${config.name} - ${config.description}.\n\nUse the ${config.id} persona for this task.`;
  }
}

/**
 * Build conversation history from previous outputs
 */
function buildConversationHistory(context: AgentContext): string {
  if (context.previousOutputs.length === 0) {
    return '';
  }

  const lines: string[] = ['\n╔══════════════════════════════════════════════════════════════════════╗'];
  lines.push('║                    PREVIOUS AGENT CONVERSATION                      ║');
  lines.push('╚══════════════════════════════════════════════════════════════════════╝\n');

  for (const output of context.previousOutputs) {
    if (output.handoff) {
      const h = output.handoff;
      const fromIcon = PERSONAS[h.from]?.icon || '🤖';
      const toIcon = h.to === 'all' ? '📢' : (h.to === 'user' ? '👤' : PERSONAS[h.to as Persona]?.icon || '🤖');

      lines.push(`💬 [${output.marker?.timestamp || '...'}] ${fromIcon} ${h.from.toUpperCase()} → ${toIcon} ${h.to.toUpperCase()}`);
      lines.push(`   📌 ${h.reason}`);
      if (h.context) {
        lines.push(`   💭 ${h.context}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Build system prompt for agent
 */
function buildSystemPrompt(persona: Persona, context: AgentContext): string {
  const config = PERSONAS[persona];
  const personaPrompt = loadPersonaPrompt(persona);
  const conversationHistory = buildConversationHistory(context);

  let prompt = `You are ${config.name}.\n\n`;
  prompt += `${personaPrompt}\n\n`;

  if (conversationHistory) {
    prompt += `${conversationHistory}\n`;
    prompt += `Use the information from previous agents to continue the workflow.\n\n`;
  }

  prompt += `IMPORTANT: When your work is complete, use this EXACT format for your final output:\n\n`;
  prompt += `💬 HANDOFF: ${persona.toUpperCase()} → [NEXT_PERSONA]\n`;
  prompt += `   📌 [reason for handoff]\n`;
  prompt += `   💭 [context summary for next agent]\n`;
  prompt += `\n`;
  prompt += `   📦 Next steps:\n`;
  prompt += `      - [what next agent should do]\n`;
  prompt += `\n`;
  prompt += `   🎯 [instruction to next agent]\n`;

  return prompt;
}

/**
 * Spawn agent with piped I/O
 */
export class AgentRuntime {
  private directory: string;
  private onData?: (data: string, isStderr: boolean) => void;

  constructor(directory?: string, onData?: (data: string, isStderr: boolean) => void) {
    this.directory = directory || process.cwd();
    this.onData = onData;
  }

  /**
   * Execute an agent and return its output
   */
  async execute(
    persona: Persona,
    context: AgentContext,
    options?: CLIOptions
  ): Promise<AgentResult> {
    const startTime = Date.now();
    const config = PERSONAS[persona];

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(persona, context);

    // Build task with context
    let task = context.task;
    if (context.userMessages && context.userMessages.length > 0) {
      task += `\n\n[USER MESSAGES:\n${context.userMessages.join('\n')}\n]`;
    }

    // Environment for Claude CLI
    const env = {
      ...process.env,
      TRUE_AGENTS_PERSONA: config.name,
      TRUE_AGENTS_THINKING: config.thinking,
      TRUE_AGENTS_MODE: persona
    };

    const args = [
      '--print',
      '--model', options?.model || config.model,
      ...(options?.thinking !== 'none' ? ['--thinking', this.mapThinking(options?.thinking || config.thinking)] : []),
      '--system-prompt', systemPrompt,
      '--',
      task
    ];

    // Print agent start
    this.printAgentStart(persona, task);

    // Spawn Claude with piped I/O
    const rawOutput = await this.spawnWithPipe(args, env);

    const duration = Date.now() - startTime;

    // Parse output (will be done by handoff-parser)
    const output: AgentOutput = {
      raw: rawOutput,
      success: true
    };

    return {
      persona,
      output,
      exitCode: 0,
      duration
    };
  }

  /**
   * Spawn Claude CLI and capture output via pipes
   */
  private async spawnWithPipe(args: string[], env: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('claude', args, {
        cwd: this.directory,
        stdio: ['inherit', 'pipe', 'pipe'],  // stdin=inherit, stdout=pipe, stderr=pipe
        shell: false,
        env
      });

      let stdout = '';
      let stderr = '';

      // Stream stdout to terminal and capture
      child.stdout?.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        if (this.onData) {
          this.onData(text, false);
        } else {
          process.stdout.write(text);
        }
      });

      // Stream stderr to terminal and capture
      child.stderr?.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        if (this.onData) {
          this.onData(text, true);
        } else {
          process.stderr.write(text);
        }
      });

      child.on('close', (code) => {
        if (code !== null && code !== 0) {
          reject(new Error(`Claude CLI exited with code ${code}${stderr ? ': ' + stderr : ''}`));
        } else {
          resolve(stdout);
        }
      });

      child.on('error', (err) => {
        reject(new Error(`Failed to spawn Claude CLI: ${err.message}`));
      });
    });
  }

  /**
   * Map thinking level to CLI argument
   */
  private mapThinking(thinking: string): string {
    const t = thinking.toLowerCase().replace(' ', '');
    if (t === 'thinkhard' || t === 'think-hard') return 'think hard';
    if (t === 'ultrathink') return 'ultrathink';
    if (t === 'think' || t === 'none') return t;
    return 'think';
  }

  /**
   * Print agent start message
   */
  private printAgentStart(persona: Persona, task: string) {
    const config = PERSONAS[persona];
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`${config.icon} ${config.name} STARTING`);
    console.log(`${'─'.repeat(80)}`);
    console.log(`📋 Task: ${task.substring(0, 100)}${task.length > 100 ? '...' : ''}`);
    console.log(`🧠 Thinking: ${config.thinking}`);
    console.log(`🤖 Model: ${config.model}`);
    console.log(`${'─'.repeat(80)}\n`);
  }

  /**
   * Get persona config
   */
  getPersonaConfig(persona: Persona): PersonaConfig {
    return PERSONAS[persona];
  }

  /**
   * Get all personas
   */
  getAllPersonas(): Record<Persona, PersonaConfig> {
    return PERSONAS;
  }
}
