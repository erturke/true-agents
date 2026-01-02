/**
 * A2A Interactive Controller
 * Handles user intervention during workflow execution
 */

import readline from 'readline';
import type {
  Persona,
  UserAction,
  InteractivePrompt,
  AgentResult
} from '../types/a2a.js';
import { HandoffParser } from './handoff-parser.js';

export interface UserIntervention {
  action: UserAction;
  message?: string;
  jumpTo?: Persona;
}

/**
 * Interactive controller for A2A workflow
 */
export class InteractiveController {
  private rl?: readline.Interface;
  private parser: HandoffParser;
  private enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
    this.parser = new HandoffParser();

    if (enabled) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
  }

  /**
   * Show handoff and ask user what to do
   */
  async promptIntervention(prompt: InteractivePrompt): Promise<UserIntervention> {
    if (!this.enabled) {
      return { action: 'continue' };
    }

    // Display current status
    this.displayStatus(prompt);

    // Display handoff info
    if (prompt.result.output.handoff) {
      const formatted = this.parser.formatHandoff(prompt.result.output.handoff);
      console.log(formatted);
    }

    // Display options
    return await this.getUserInput(prompt);
  }

  /**
   * Display current workflow status
   */
  private displayStatus(prompt: InteractivePrompt): void {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`🔄 WORKFLOW PAUSED - ${prompt.result.output.handoff?.from.toUpperCase()} → ${prompt.result.output.handoff?.to.toUpperCase()}`);
    console.log(`${'═'.repeat(80)}`);

    if (prompt.result.output.marker) {
      console.log(`   ✅ ${prompt.result.output.marker.output || 'Task completed'}`);
    }

    if (prompt.result.output.error) {
      console.log(`   ⚠️  Error: ${prompt.result.output.error}`);
    }

    if (prompt.retryCount > 0) {
      console.log(`   🔄 Retry attempt: ${prompt.retryCount}`);
    }

    console.log(`   ⏱️  Duration: ${prompt.result.duration}ms`);
    console.log(`${'═'.repeat(80)}\n`);
  }

  /**
   * Get user input for next action
   */
  private async getUserInput(prompt: InteractivePrompt): Promise<UserIntervention> {
    return new Promise((resolve) => {
      console.log('Choose an action:');
      console.log('  [Enter]    Continue to next agent');
      console.log('  s          Stop workflow');
      console.log('  p [msg]    Pass message to next agent');
      if (prompt.canRetry) {
        console.log('  r          Retry current agent');
      }
      console.log('  j [persona] Jump to different persona');
      console.log('');

      this.rl?.question('> ', (input) => {
        const trimmed = input.trim().toLowerCase();
        const parts = trimmed.split(/\s+/);
        const action = parts[0];

        switch (action) {
          case '':
            resolve({ action: 'continue' });
            break;

          case 's':
          case 'stop':
            resolve({ action: 'stop' });
            break;

          case 'p':
          case 'pass':
            const message = parts.slice(1).join(' ');
            resolve({ action: 'pass', message: message || undefined });
            break;

          case 'r':
          case 'retry':
            if (prompt.canRetry) {
              resolve({ action: 'retry' });
            } else {
              console.log('⚠️  Retry not available, continuing...');
              resolve({ action: 'continue' });
            }
            break;

          case 'j':
          case 'jump':
            const persona = parts[1] as Persona;
            if (this.isValidPersona(persona)) {
              resolve({ action: 'jump', jumpTo: persona });
            } else {
              console.log('⚠️  Invalid persona, continuing...');
              resolve({ action: 'continue' });
            }
            break;

          default:
            console.log('⚠️  Unknown action, continuing...');
            resolve({ action: 'continue' });
        }
      });
    });
  }

  /**
   * Check if persona is valid
   */
  private isValidPersona(persona: string): boolean {
    const valid = ['sentinel', 'referee', 'recorder', 'auditor',
                   'architect', 'explorer', 'analyst', 'test', 'archaeologist'];
    return valid.includes(persona);
  }

  /**
   * Ask user for manual intervention when agent is stuck
   */
  async askForHelp(context: string, persona: Persona): Promise<UserIntervention> {
    if (!this.enabled) {
      return { action: 'continue' };
    }

    console.log(`\n${'═'.repeat(80)}`);
    console.log(`⚠️  ${persona.toUpperCase()} IS STUCK`);
    console.log(`${'═'.repeat(80)}`);
    console.log(`\n${context}\n`);

    return new Promise((resolve) => {
      console.log('Choose an action:');
      console.log('  [Enter]    Continue anyway');
      console.log('  s          Stop workflow');
      console.log('  h [hint]   Give hint to agent');
      console.log('  j [persona] Jump to different persona');
      console.log('');

      this.rl?.question('> ', (input) => {
        const trimmed = input.trim().toLowerCase();
        const parts = trimmed.split(/\s+/);
        const action = parts[0];

        switch (action) {
          case '':
            resolve({ action: 'continue' });
            break;

          case 's':
            resolve({ action: 'stop' });
            break;

          case 'h':
            resolve({ action: 'pass', message: parts.slice(1).join(' ') });
            break;

          case 'j':
            const persona = parts[1] as Persona;
            if (this.isValidPersona(persona)) {
              resolve({ action: 'jump', jumpTo: persona });
            } else {
              resolve({ action: 'continue' });
            }
            break;

          default:
            resolve({ action: 'continue' });
        }
      });
    });
  }

  /**
   * Cleanup readline interface
   */
  close(): void {
    this.rl?.close();
  }
}
