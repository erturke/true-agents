#!/usr/bin/env tsx
/**
 * TRUE Multi-Agent System - Standalone CLI V10
 *
 * Usage:
 *   npx tsx cli.ts "task description"
 *   npx tsx cli.ts --persona mimar "fix the bug"
 *   npx tsx cli.ts --parallel
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

const __dirname = dirname(fileURLToPath(import.meta.url));

// ==========================================
// TYPES & CONFIG
// ==========================================

type Persona = 'sentinel' | 'hakem' | 'kayitci' | 'denetci' | 'mimar' | 'kasif' | 'analizci' | 'test' | 'arkeolog';

interface CLIOptions {
  persona?: Persona;
  parallel?: boolean;
  thinking?: 'none' | 'think' | 'think-hard' | 'ultrathink';
  model?: 'sonnet' | 'opus';
  directory?: string;
}

interface PersonaConfig {
  trigger: string[];
  thinking: string;
  model: string;
  description: string;
}

// ==========================================
// PERSONA DEFINITIONS (from master.md)
// ==========================================

const PERSONAS: Record<Persona, PersonaConfig> = {
  sentinel: {
    trigger: ['verify', 'check', 'validate', 'sentinel'],
    thinking: 'ultrathink:',
    model: 'opus',
    description: '🛡️ SENTINEL - Independent completion verification'
  },
  hakem: {
    trigger: ['decide', 'judge', 'score', 'approve', 'hakem'],
    thinking: 'think hard:',
    model: 'opus',
    description: '🎯 HAKEM - Final decision maker (1-10 scoring)'
  },
  kayitci: {
    trigger: ['checkpoint', 'state', 'log', 'save', 'kayitci'],
    thinking: 'think:',
    model: 'sonnet',
    description: '📋 KAYITCI - State & checkpoint manager'
  },
  denetci: {
    trigger: ['gate', 'reality', 'validate', 'denetci'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🔍 DENETÇİ - Quality gate & reality validator'
  },
  mimar: {
    trigger: ['build', 'implement', 'code', 'fix', 'mimar'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🏗️ MİMAR - Builder & implementer'
  },
  kasif: {
    trigger: ['research', 'find', 'search', 'learn', 'kasif'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🌐 KAŞIF - Researcher & explorer'
  },
  analizci: {
    trigger: ['analyze', 'data', 'metrics', 'query', 'analizci'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🔬 ANALİZCİ - Data analyst'
  },
  test: {
    trigger: ['test', 'verify', 'check'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🧪 TEST - Verifier & tester'
  },
  arkeolog: {
    trigger: ['understand', 'analyze', 'structure', 'arkeolog'],
    thinking: 'think:',
    model: 'sonnet',
    description: '🏛️ ARKEOLOG - Code analyst & archaeologist'
  }
};

// ==========================================
// COMPLEXITY ANALYZER
// ==========================================

function analyzeComplexity(task: string): { level: number; thinking: string; model: string } {
  const lower = task.toLowerCase();

  // EXPERT level (6)
  if (lower.includes('architecture') || lower.includes('system design') || lower.includes('refactor')) {
    return { level: 6, thinking: 'think hard:', model: 'opus' };
  }

  // VERY_COMPLEX (5)
  if (lower.includes('implement') || lower.includes('build') || lower.includes('create')) {
    return { level: 5, thinking: 'think hard:', model: 'sonnet' };
  }

  // COMPLEX (4)
  if (lower.includes('analyze') || lower.includes('research') || lower.includes('find')) {
    return { level: 4, thinking: 'think:', model: 'sonnet' };
  }

  // SIMPLE (2)
  return { level: 2, thinking: 'none', model: 'sonnet' };
}

// ==========================================
// PERSONA DETECTION
// ==========================================

function detectPersona(task: string): Persona {
  const lower = task.toLowerCase();

  for (const [name, config] of Object.entries(PERSONAS)) {
    for (const trigger of config.trigger) {
      if (lower.includes(trigger)) {
        return name as Persona;
      }
    }
  }

  return 'mimar'; // Default
}

// ==========================================
// CLAUDE CODE SPAWNER
// ==========================================

function spawnClaude(task: string, options: CLIOptions): Promise<number> {
  return new Promise((resolve) => {
    const detected = detectPersona(task);
    const complexity = analyzeComplexity(task);

    const persona = options.persona || detected;
    const thinking = options.thinking
      ? (options.thinking === 'think' ? 'think:' : options.thinking === 'think-hard' ? 'think hard:' : options.thinking === 'ultrathink' ? 'ultrathink:' : '')
      : PERSONAS[persona].thinking;

    const model = options.model || PERSONAS[persona].model;
    const directory = options.directory || process.cwd();

    // Build persona prompt
    const subdir = persona === 'denetci' ? 'core' : 'specialist';
    const personaPath = join(__dirname, 'personas', subdir, `${persona}.md`);
    const personaPrompt = `Use the persona defined in: ${personaPath}`;

    // Build full prompt
    let fullPrompt = `${personaPrompt}\n\n`;
    fullPrompt += `Thinking: ${thinking}\n`;
    fullPrompt += `Task: ${task}\n`;
    fullPrompt += `\n🏷️ MARKER: ${persona.toUpperCase()}-${Date.now()}`;

    console.log(`\n${PERSONAS[persona].description}`);
    console.log(`📂 Directory: ${directory}`);
    console.log(`🧠 Thinking: ${thinking || 'none'}`);
    console.log(`🤖 Model: ${model}`);
    console.log(`\n🚀 Executing...\n`);

    // Spawn Claude Code CLI
    const args = ['--prompt', fullPrompt];
    if (directory) {
      args.push('--directory', directory);
    }

    const child = spawn('claude', args, {
      cwd: directory,
      stdio: 'inherit'
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
║                    TRUE Multi-Agent System V10                        ║
║                         Standalone CLI                                ║
╚══════════════════════════════════════════════════════════════════════╝

Usage:
  npx tsx cli.ts "task description"                Execute a task
  npx tsx cli.ts --persona mimar "fix bug"         Use specific persona
  npx tsx cli.ts --parallel "task1" "task2"        Run in parallel
  npx tsx cli.ts --thinking think-hard "analyze"   Set thinking level

Options:
  --persona <name>    Specific persona (mimar, kasif, analizci, etc.)
  --parallel          Run multiple tasks in parallel
  --thinking <level>  none, think, think-hard, ultrathink
  --model <name>      sonnet, opus
  --directory <path>  Working directory

Personas:
  CORE (always active):
    sentinel    🛡️  Completion verification
    hakem       🎯  Final decision (1-10 score)
    kayitci     📋  State & checkpoint
    denetci     🔍  Quality gate

  SPECIALIST (on-demand):
    mimar       🏗️  Builder & implementer
    kasif       🌐  Researcher
    analizci    🔬  Data analyst
    test        🧪  Verifier
    arkeolog    🏛️  Code analyst

Examples:
  npx tsx cli.ts "Implement user authentication"
  npx tsx cli.ts --persona kasif "Find React best practices"
  npx tsx cli.ts --parallel "Fix backend bug" "Update frontend"
  npx tsx cli.ts --persona sentinel "Verify implementation"

📚 Documentation: master.md
    `);
}

main().catch(console.error);
