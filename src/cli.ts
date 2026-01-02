#!/usr/bin/env tsx
/**
 * TRUE Multi-Agent System - Standalone CLI V11
 *
 * Usage:
 *   npx tsx cli.ts "task description"
 *   npx tsx cli.ts --persona architect "fix the bug"
 *   npx tsx cli.ts --parallel "task1" "task2"
 *
 * Features:
 * - Auto-detects complexity
 * - Spawns appropriate Claude Code CLI agent
 * - Executes in parallel when needed
 * - Works from any directory
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ==========================================
// TYPES & CONFIG
// ==========================================

type Persona = 'sentinel' | 'referee' | 'recorder' | 'auditor' | 'architect' | 'explorer' | 'analyst' | 'test' | 'archaeologist';

interface CLIOptions {
  persona?: Persona;
  parallel?: boolean;
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
// PERSONA FILE LOADER
// ==========================================

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

  const promises = tasks.map((task, i) => {
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
    } else if (arg === '--thinking') {
      options.thinking = args[++i] as any;
    } else if (arg === '--model') {
      options.model = args[++i] as 'sonnet' | 'opus';
    } else if (arg === '--directory') {
      options.directory = args[++i];
    } else if (arg.startsWith('-')) {
      console.error(`❌ Unknown option: ${arg}`);
      process.exit(1);
    } else {
      tasks.push(arg);
    }
  }

  if (tasks.length === 0) {
    console.error('❌ No task specified');
    process.exit(1);
  }

  if (options.parallel) {
    await spawnParallel(tasks, options);
  } else {
    const code = await spawnClaude(tasks.join(' '), options);
    process.exit(code);
  }
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                    TRUE Multi-Agent System V11                        ║
║                         Standalone CLI                                ║
╚══════════════════════════════════════════════════════════════════════╝

Usage:
  npx tsx cli.ts "task description"                Execute a task
  npx tsx cli.ts --persona architect "fix bug"     Use specific persona
  npx tsx cli.ts --parallel "task1" "task2"        Run in parallel
  npx tsx cli.ts --thinking think-hard "analyze"   Set thinking level

Options:
  --persona <name>    Specific persona
  --parallel          Run multiple tasks in parallel
  --thinking <level>  none, think, think-hard, ultrathink
  --model <name>      sonnet, opus
  --directory <path>  Working directory

Personas:
  CORE (always active):
    sentinel      🛡️  Completion verification
    referee       🎯  Final decision (1-10 score)
    recorder      📋  State & checkpoint
    auditor       🔍  Quality gate

  SPECIALIST (on-demand):
    architect     🏗️  Builder & implementer
    explorer      🌐  Researcher
    analyst       🔬  Data analyst
    test          🧪  Verifier
    archaeologist 🏛️  Code analyst

Examples:
  npx tsx cli.ts "Implement user authentication"
  npx tsx cli.ts --persona explorer "Find React best practices"
  npx tsx cli.ts --parallel "Fix backend bug" "Update frontend"
  npx tsx cli.ts --persona sentinel "Verify implementation"

📚 Documentation: master.md, REFERENCE.md
    `);
}

main().catch(console.error);
