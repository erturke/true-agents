#!/usr/bin/env tsx
/**
 * TRUE Multi-Agent System - Standalone CLI V12
 *
 * Usage:
 *   npx tsx cli.ts "task description"                    Single agent mode
 *   npx tsx cli.ts --a2a "task description"              A2A workflow mode (NEW)
 *   npx tsx cli.ts --persona architect "fix the bug"     Specific persona
 *   npx tsx cli.ts --parallel "task1" "task2"            Parallel tasks
 *
 * Features:
 * - Auto-detects complexity
 * - A2A mode: Agents talk to each other with dynamic handoff
 * - Interactive: Pause, retry, or intervene during workflow
 * - Executes in parallel when needed
 * - Works from any directory
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';
import type { WorkflowConfig, WorkflowState } from './types/a2a.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ==========================================
// TYPES & CONFIG
// ==========================================

export type Persona = 'sentinel' | 'referee' | 'recorder' | 'auditor' | 'architect' | 'explorer' | 'analyst' | 'test' | 'archaeologist';

interface CLIOptions {
  persona?: Persona;
  parallel?: boolean;
  a2a?: boolean;              // NEW: Enable A2A workflow mode
  noInteractive?: boolean;     // NEW: Disable interactive mode in A2A
  thinking?: 'none' | 'think' | 'think-hard' | 'ultrathink';
  model?: 'sonnet' | 'opus';
  directory?: string;
}

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

// ==========================================
// PERSONA DEFINITIONS (V11 - English)
// ==========================================

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

// ==========================================
// COMPLEXITY ANALYZER
// ==========================================

function analyzeComplexity(task: string): { level: number; thinking: string; model: string } {
  const lower = task.toLowerCase();

  // EXPERT level (6)
  if (lower.includes('architecture') || lower.includes('system design') || lower.includes('refactor')) {
    return { level: 6, thinking: 'think hard', model: 'opus' };
  }

  // VERY_COMPLEX (5)
  if (lower.includes('implement') || lower.includes('build') || lower.includes('create')) {
    return { level: 5, thinking: 'think hard', model: 'sonnet' };
  }

  // COMPLEX (4)
  if (lower.includes('analyze') || lower.includes('research') || lower.includes('find')) {
    return { level: 4, thinking: 'think', model: 'sonnet' };
  }

  // SIMPLE (2)
  return { level: 2, thinking: 'none', model: 'sonnet' };
}

// ==========================================
// PERSONA DETECTION
// ==========================================

function detectPersona(task: string): Persona {
  const lower = task.toLowerCase();

  // Check specialist personas first (more specific)
  for (const [name, config] of Object.entries(PERSONAS)) {
    if (config.id.startsWith('sentinel') || config.id.startsWith('referee') ||
        config.id.startsWith('recorder') || config.id.startsWith('auditor')) {
      continue; // Skip core for now
    }
    for (const trigger of config.trigger) {
      if (lower.includes(trigger)) {
        return name as Persona;
      }
    }
  }

  // Check core personas
  for (const [name, config] of Object.entries(PERSONAS)) {
    for (const trigger of config.trigger) {
      if (lower.includes(trigger)) {
        return name as Persona;
      }
    }
  }

  return 'architect'; // Default
}

// ==========================================
// PERSONA FILE LOADER (Reserved for future use)
// ==========================================

// Function reserved for loading full persona definitions from .md files
// Currently using compact prompts to avoid shell parsing issues
// TODO: Implement proper file-based persona loading with safe argument passing
function loadPersonaPrompt(persona: Persona): string {
  const config = PERSONAS[persona];
  const fullPath = join(__dirname, config.file);

  try {
    const content = readFileSync(fullPath, 'utf-8');
    return `You are ${config.name}. Read and follow this persona definition:\n\n${content}`;
  } catch (err) {
    // Fallback if file doesn't exist
    return `You are ${config.name} - ${config.description}.\n\nUse the ${config.id} persona for this task.`;
  }
}

// ==========================================
// CLAUDE CODE SPAWNER
// ==========================================

function spawnClaude(task: string, options: CLIOptions): Promise<number> {
  return new Promise((resolve) => {
    const detected = detectPersona(task);
    const personaKey = options.persona || detected;
    const config = PERSONAS[personaKey];

    // Safety check
    if (!config) {
      console.error(`❌ Persona not found: ${personaKey}`);
      resolve(1);
      return;
    }

    // Determine thinking level
    let thinking: string;
    if (options.thinking === 'think') {
      thinking = 'think';
    } else if (options.thinking === 'think-hard') {
      thinking = 'think hard';
    } else if (options.thinking === 'ultrathink') {
      thinking = 'ultrathink';
    } else if (options.thinking === 'none') {
      thinking = 'none';
    } else {
      thinking = config.thinking || 'think';
    }

    const model = options.model || config.model || 'sonnet';
    const directory = options.directory || process.cwd();

    // Load persona prompt (available for reference, full content loading in future versions)
    // const personaPrompt = loadPersonaPrompt(personaKey);

    console.log(`\n${config.description}`);
    console.log(`📂 Directory: ${directory}`);
    console.log(`🧠 Thinking: ${thinking || 'none'}`);
    console.log(`🤖 Model: ${model}`);
    console.log(`\n🚀 Executing...\n`);

    // Spawn Claude Code CLI
    // Use environment variable to pass persona prompt (safe from shell parsing)
    const env = {
      ...process.env,
      TRUE_AGENTS_PERSONA: config.name,
      TRUE_AGENTS_THINKING: thinking,
      TRUE_AGENTS_MODE: personaKey
    };

    const args = [
      '--print',
      '--model', model,
      '--system-prompt', `You are ${config.name}. Use ${personaKey} persona. ${thinking} mode.`,
      '--',
      task
    ];

    // Debug: log the exact command
    // console.error('DEBUG: Spawning claude with args:', JSON.stringify(args));

    const child = spawn('claude', args, {
      cwd: directory,
      stdio: 'inherit',
      shell: false,
      env
    });

    child.on('close', (code) => {
      console.log(`\n✅ Exit code: ${code}`);
      resolve(code ?? 0);
    });

    child.on('error', (err) => {
      console.error(`❌ Error: ${err.message}`);
      resolve(1);
    });
  });
}

// ==========================================
// PARALLEL EXECUTION
// ==========================================

async function spawnParallel(tasks: string[], options: CLIOptions): Promise<void> {
  console.log(`\n🔄 Running ${tasks.length} tasks in parallel...\n`);

  const promises = tasks.map((task) => {
    return spawnClaude(task, { ...options, persona: options.persona || detectPersona(task) });
  });

  const results = await Promise.all(promises);
  const failed = results.filter(r => r !== 0).length;

  console.log(`\n📊 Parallel execution complete: ${tasks.length - failed}/${tasks.length} succeeded`);
}

// ==========================================
// CLI MAIN
// ==========================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  // Parse options
  const options: CLIOptions = {};
  let tasks: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--persona') {
      options.persona = args[++i] as Persona;
    } else if (arg === '--parallel') {
      options.parallel = true;
    } else if (arg === '--a2a') {
      options.a2a = true;
    } else if (arg === '--no-interactive') {
      options.noInteractive = true;
    } else if (arg === '--thinking') {
      options.thinking = args[++i] as any;
    } else if (arg === '--model') {
      options.model = args[++i] as 'sonnet' | 'opus';
    } else if (arg === '--directory') {
      options.directory = args[++i];
    } else if (arg.startsWith('-')) {
      console.error(`❌ Unknown option: ${arg}`);
      console.log('Use --help to see available options');
      process.exit(1);
    } else {
      tasks.push(arg);
    }
  }

  if (tasks.length === 0) {
    console.error('❌ No task specified');
    process.exit(1);
  }

  // A2A mode (NEW)
  if (options.a2a) {
    return runA2AWorkflow(tasks.join(' '), options);
  }

  // Parallel mode
  if (options.parallel) {
    await spawnParallel(tasks, options);
    return;
  }

  // Single agent mode (default)
  const code = await spawnClaude(tasks.join(' '), options);
  process.exit(code);
}

/**
 * Run A2A workflow (NEW)
 */
async function runA2AWorkflow(task: string, options: CLIOptions): Promise<void> {
  // Dynamically import A2A modules (only when needed)
  const a2aPath = join(__dirname, 'a2a', 'orchestrator.js');
  if (!existsSync(a2aPath)) {
    console.error('❌ A2A module not found. Make sure the project is built.');
    console.error('   Run: npm run build');
    process.exit(1);
  }

  const { A2AOrchestrator } = await import(join(__dirname, 'a2a', 'orchestrator.js'));

  const config: WorkflowConfig = {
    task,
    autoDetect: true,
    interactive: !options.noInteractive,
    retryConfig: {
      maxRetries: 3,
      retryOnErrors: ['timeout', 'network', 'temporary'],
      backoffMs: 1000,
      exponentialBackoff: true
    },
    maxDuration: 300000 // 5 minutes max
  };

  const orchestrator = new A2AOrchestrator(
    options.directory,
    config.interactive,
    (state: WorkflowState) => {
      // Progress callback - could be used for UI updates
    }
  );

  const result = await orchestrator.execute(config);

  // Exit with appropriate code
  process.exit(result.status === 'completed' ? 0 : 1);
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                    TRUE Multi-Agent System V12                        ║
║                         Standalone CLI                                ║
║                    🤖 A2A Workflow Enabled                           ║
╚══════════════════════════════════════════════════════════════════════╝

Usage:
  npx tsx cli.ts "task description"                Single agent mode
  npx tsx cli.ts --a2a "task description"          A2A workflow mode 👈 NEW
  npx tsx cli.ts --persona architect "fix bug"     Use specific persona
  npx tsx cli.ts --parallel "task1" "task2"        Run in parallel

Options:
  --a2a               Enable A2A workflow (agents talk to each other)
  --no-interactive    Run A2A without pauses (auto-pilot mode)
  --persona <name>    Specific persona (single agent mode)
  --parallel          Run multiple tasks in parallel
  --thinking <level>  none, think, think-hard, ultrathink
  --model <name>      sonnet, opus
  --directory <path>  Working directory

A2A Mode:
  Agents automatically coordinate based on task:
  • EXPLORER → Research best practices
  • ARCHAEOLOGIST → Analyze existing code
  • ARCHITECT → Implement solution
  • TEST → Verify implementation
  • SENTINEL → Final verification

  Interactive controls during workflow:
  [Enter]    Continue to next agent
  s          Stop workflow
  p [msg]    Pass message to next agent
  r          Retry current agent
  j [persona] Jump to different persona

Personas:
  CORE (quality & orchestration):
    sentinel      🛡️  Completion verification
    referee       🎯  Final decision (1-10 score)
    recorder      📋  State & checkpoint
    auditor       🔍  Quality gate

  SPECIALIST (domain experts):
    architect     🏗️  Builder & implementer
    explorer      🌐  Researcher
    analyst       🔬  Data analyst
    test          🧪  Verifier
    archaeologist 🏛️  Code analyst

Examples:
  # A2A workflow (recommended for complex tasks)
  npx tsx cli.ts --a2a "Implement user authentication"

  # A2A without interaction (auto-pilot)
  npx tsx cli.ts --a2a --no-interactive "Fix the login bug"

  # Single agent
  npx tsx cli.ts --persona explorer "Find React best practices"

  # Parallel tasks
  npx tsx cli.ts --parallel "Fix backend" "Update frontend"

📚 Documentation: master.md, REFERENCE.md
    `);
}

main().catch(console.error);
