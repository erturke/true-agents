# @true-agents/core

> Persona-based multi-agent orchestration framework with parallel execution, dynamic persona creation, and project management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **9 Built-in Personas** - 4 CORE (always active) + 5 SPECIALIST (on-demand)
- **Auto Persona Detection** - Automatically selects the right persona for your task
- **Parallel Execution** - Run multiple agents simultaneously
- **Dynamic Persona Creation** - Create custom personas at runtime
- **Project Management** - UUID-based project tracking with persistent storage
- **CLI Tool** - Standalone command-line interface included

## Installation (Git)

### As Submodule (Recommended)

```bash
git submodule add https://github.com/erturke/true-agents.git libs/true-agents
cd libs/true-agents
npm install
```

### Or Clone Directly

```bash
git clone https://github.com/erturke/true-agents.git
cd true-agents
npm install
```

## Quick Start

```bash
# Run CLI
npx tsx src/cli.ts "Implement user authentication"

# Use specific persona
npx tsx src/cli.ts --persona mimar "Fix the bug"

# Run parallel tasks
npx tsx src/cli.ts --parallel "Fix backend" "Update frontend"

# Show help
npx tsx src/cli.ts --help
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

## Usage in Your Project

### As Submodule

```bash
# Add to your project
git submodule add https://github.com/erturke/true-agents.git libs/true-agents

# Use in your project
cd libs/true-agents
npx tsx src/cli.ts --persona mimar "Implement feature"
```

### Programmatic Usage

```typescript
import { TrueCLI, PERSONAS } from './libs/true-agents/src/index.js';

const cli = new TrueCLI();
await cli.run(['status']);

console.log(PERSONAS);
// { CORE: ['SENTINEL', 'HAKEM', 'KAYITCI', 'DENETÇI'],
//   SPECIALIST: ['MİMAR', 'KAŞIF', 'ANALİZCİ', 'TEST', 'ARKEOLOG'] }
```

### Add Scripts to package.json

```json
{
  "scripts": {
    "agent": "tsx libs/true-agents/src/cli.ts",
    "agent:build": "tsx libs/true-agents/src/cli.ts --persona mimar",
    "agent:research": "tsx libs/true-agents/src/cli.ts --persona kasif"
  }
}
```

## Documentation

- **[USAGE.md](./USAGE.md)** - Comprehensive usage guide with Git integration
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
