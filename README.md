# @true-agents/core

> Persona-based multi-agent orchestration framework with parallel execution, dynamic persona creation, and project management.

[![npm version](https://badge.fury.io/js/%40true-agents%2Fcore.svg)](https://www.npmjs.com/package/@true-agents/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **9 Built-in Personas** - 4 CORE (always active) + 5 SPECIALIST (on-demand)
- **Auto Persona Detection** - Automatically selects the right persona for your task
- **Parallel Execution** - Run multiple agents simultaneously
- **Dynamic Persona Creation** - Create custom personas at runtime
- **Project Management** - UUID-based project tracking with persistent storage
- **CLI Tool** - Standalone command-line interface included

## Installation

```bash
npm install @true-agents/core
```

## Quick Start

### CLI Usage

```bash
# Use the CLI tool
npx @true-agents/core "Implement user authentication"

# Use specific persona
npx @true-agents/core --persona mimar "Fix the bug"

# Run parallel tasks
npx @true-agents/core --parallel "Fix backend" "Update frontend"

# Show help
npx @true-agents/core --help
```

### Programmatic Usage

```typescript
import { TrueCLI, PERSONAS } from '@true-agents/core';

const cli = new TrueCLI();
await cli.run(['status']);

// Get available personas
console.log(PERSONAS);
// { CORE: ['SENTINEL', 'HAKEM', 'KAYITCI', 'DENETÇI'],
//   SPECIALIST: ['MİMAR', 'KAŞIF', 'ANALİZCİ', 'TEST', 'ARKEOLOG'] }
```

## Personas

### CORE Personas (Always Active)

| Persona | Icon | Role |
|---------|------|------|
| SENTINEL | 🛡️ | Independent completion verification |
| HAKEM | 🎯 | Final decision maker (1-10 scoring) |
| KAYITCI | 📋 | State & checkpoint manager |
| DENETÇİ | 🔍 | Quality gate & reality validator |

### SPECIALIST Personas (On-Demand)

| Persona | Icon | Role | Trigger |
|---------|------|------|---------|
| MİMAR | 🏗️ | Builder & implementer | build, implement, code |
| KAŞIF | 🌐 | Researcher | research, find, search |
| ANALİZCİ | 🔬 | Data analyst | analyze, data, metrics |
| TEST | 🧪 | Verifier | test, verify |
| ARKEOLOG | 🏛️ | Code analyst | understand, structure |

## CLI Options

```
Usage: true-agents [options] [task...]

Options:
  --persona <name>    Specific persona (mimar, kasif, analizci, etc.)
  --parallel          Run multiple tasks in parallel
  --thinking <level>  none, think, think-hard, ultrathink
  --model <name>      sonnet, opus
  --directory <path>  Working directory
  --help              Show help
```

## Examples

```bash
# Research task
true-agents --persona kasif "Find React 19 best practices"

# Build task
true-agents --persona mimar "Implement OAuth login"

# Verification
true-agents --persona sentinel "Verify the implementation"

# Parallel execution
true-agents --parallel "Analyze backend" "Analyze frontend" "Test API"
```

## Documentation

- **[master.md](./master.md)** - Complete system reference with all personas
- **[MASTER_GUIDE.md](./MASTER_GUIDE.md)** - Detailed usage guide

## Project Structure

```
true-agents/
├── src/
│   ├── index.ts          # Main export
│   └── cli.ts            # CLI entry point
├── personas/             # Persona definitions
│   ├── core/             # CORE personas
│   ├── specialist/       # SPECIALIST personas
│   ├── dynamic/          # Dynamic persona registry
│   └── templates/        # Persona templates
├── projects/             # Project templates
│   ├── _templates/       # Plan, project, session templates
│   └── templates/        # Web app template
├── master.md             # Complete system reference
├── MASTER_GUIDE.md       # Detailed guide
└── package.json
```

## License

MIT

## Repository

[https://github.com/erturke/true-agents](https://github.com/erturke/true-agents)
