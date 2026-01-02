# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **@true-agents/core**, a TypeScript-based multi-agent orchestration framework. It provides a persona-based AI system that coordinates specialized agents to work on complex tasks. The system is designed as a standalone CLI tool that spawns Claude Code CLI processes with appropriate personas.

**Key characteristics:** ES modules, TypeScript strict mode, no runtime dependencies, designed for Git submodule integration.

---

## Development Commands

```bash
# Build
npm run build              # Compile TypeScript to dist/
npm run build:watch        # Watch mode

# Development
npm run dev                # tsx watch on src/index.ts
npm run cli                # Run CLI directly

# Code quality
npm run lint               # ESLint check
npm run lint:fix           # ESLint auto-fix
npm run format             # Prettier format
npm run format:check       # Prettier check

# Testing the CLI
npx tsx src/cli.ts --help
npx tsx src/cli.ts "task description"
npx tsx src/cli.ts --persona architect "fix bug"
npx tsx src/cli.ts --parallel "task1" "task2"
```

---

## Architecture

### Execution Flow

The CLI operates by:
1. Analyzing task complexity and detecting appropriate persona via trigger words
2. Determining model (sonnet/opus) and thinking level (none/think/think-hard/ultrathink)
3. Spawning `claude` CLI as a separate process via `child_process.spawn`
4. Passing persona context via environment variables and `--system-prompt`

### Key Components

| File | Purpose |
|------|---------|
| `src/cli.ts` | Main CLI entry point with persona definitions and spawn logic |
| `src/index.ts` | Library exports (`TrueCLI` class, `VERSION`, `PERSONAS`) |
| `personas/core/` | CORE personas (always active): SENTINEL, REFEREE, RECORDER, AUDITOR |
| `personas/specialist/` | SPECIALIST personas (on-demand): ARCHITECT, EXPLORER, ANALYST, TEST, ARCHAEOLOGIST |
| `personas/dynamic/` | Runtime persona creation registry |
| `projects/` | UUID-based project tracking with templates |

### Persona System

**CORE Personas** - Quality and orchestration:
- **SENTINEL** (verify, validate, final check) - Independent completion verification, opus/ultrathink
- **REFEREE** (decide, approve, judge) - Final decision maker with 1-10 scoring, opus/think-hard
- **RECORDER** (checkpoint, state, log) - State & checkpoint manager, sonnet/think
- **AUDITOR** (gate, reality, validate) - Quality gate & reality validator, sonnet/think

**SPECIALIST Personas** - Domain experts:
- **ARCHITECT** (write, create, implement, fix, code, build) - Builder & implementer, sonnet/think-hard
- **EXPLORER** (research, find, search, learn, best practice) - Researcher, sonnet/think
- **ANALYST** (analyze, data, metrics, query, sql) - Data analyst, sonnet/think
- **TEST** (test, verify, check) - Verifier & tester, sonnet/think
- **ARCHAEOLOGIST** (understand, explain, read, structure) - Code analyst, sonnet/think

### Persona Detection

The `detectPersona()` function in `cli.ts` scans task text for trigger words. Specialist personas are checked first (more specific), then CORE personas. Default is ARCHITECT if no match.

---

## Important Conventions

### Code Style
- **TypeScript**: strict mode, ES2022 target, Node16 modules
- **Prettier**: single quotes, 100 char width, 2 spaces, semicolons, trailing commas (es5)
- **LF** line endings (not CRLF)

### Persona File Loading
The `loadPersonaPrompt()` function exists but is not fully utilized - compact prompts are used instead to avoid shell parsing issues with multi-line system prompts. The full `.md` persona files are available for reference.

### Version Notes
- The codebase was recently localized from Turkish to English
- Some legacy Turkish names may still appear in comments or documentation
- `src/index.ts` exports Turkish persona names (outdated) - `src/cli.ts` is the source of truth for V11 English personas

---

## Reference Documentation

When working with this codebase, consult:
- **REFERENCE.md** - Single source of truth for system usage, persona reference, execution methods
- **master.md** - Complete system specification
- **README.md** - Quick start and installation
- **USAGE.md** - Git integration guide (some Turkish content)

---

## Integration Pattern

This package is designed to be used as a Git submodule in other projects:

```bash
git submodule add https://github.com/erturke/true-agents.git libs/true-agents
cd libs/true-agents && npm install
```

Host projects typically add npm scripts:
```json
{
  "scripts": {
    "agent": "tsx libs/true-agents/src/cli.ts",
    "agent:architect": "tsx libs/true-agents/src/cli.ts --persona architect"
  }
}
```
