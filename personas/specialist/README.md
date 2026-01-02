# personas/specialist/ - SPECIALIST Personas (On-Demand)

## 📁 Overview

SPECIALIST personas are activated based on task requirements. Each is a domain expert with specific capabilities and knowledge.

## 📂 Personas

| File | Icon | Role | Trigger Words |
|------|------|------|---------------|
| `mimar.md` | 🏗️ | MİMAR | build, implement, code, fix, create |
| `kasif.md` | 🌐 | KAŞIF | research, find, search, learn, best practice |
| `analizci.md` | 🔬 | ANALİZCİ | analyze, data, metrics, query, SQL, trend |
| `test.md` | 🧪 | TEST | test, verify, check, validate |
| `arkeolog.md` | 🏛️ | ARKEOLOG | understand, analyze structure, read code |

## 🎯 Selection Logic

```typescript
function selectSpecialist(task: string): Persona {
  const lower = task.toLowerCase();

  if (lower.includes('build') || lower.includes('implement')) return 'mimar';
  if (lower.includes('research') || lower.includes('find')) return 'kasif';
  if (lower.includes('analyze') || lower.includes('data')) return 'analizci';
  if (lower.includes('test') || lower.includes('verify')) return 'test';
  if (lower.includes('understand') || lower.includes('structure')) return 'arkeolog';

  return 'mimar'; // Default
}
```

## 🔄 Workflow Integration

```
┌─────────────────────────────────────────────────────────────┐
│                      TASK ARRIVES                           │
└──────────────┬────────────────────────────────┬──────────────┘
               │                                │
        ┌──────▼────────┐              ┌───────▼────────┐
        │   KAYITCI     │              │  Trigger Word  │
        │ (Analyze Task)│              │     Analysis    │
        └──────┬────────┘              └───────┬────────┘
               │                               │
               └───────────┬───────────────────┘
                           │
                ┌──────────▼────────┐
                │  Activate SPECIALIST│
                │  (Based on trigger)│
                └──────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
   │  MİMAR  │      │   KAŞIF   │     │ ANALİZCİ  │
   │ (Build) │      │ (Research)│     │ (Analyze) │
   └─────────┘      └───────────┘     └───────────┘
```

## 🎨 Persona Details

### 🏗️ MİMAR - Builder
- **Role**: Write code, implement features, fix bugs
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Design patterns, SOLID, architecture
- **Output**: Working code with tests

### 🌐 KAŞIF - Researcher
- **Role**: Find best practices, search documentation, learn
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Reliable sources, search patterns
- **Output**: Research findings with sources

### 🔬 ANALİZCİ - Data Analyst
- **Role**: Analyze data, find patterns, run queries
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: SQL, statistics, metrics
- **Output**: Analysis with recommendations

### 🧪 TEST - Verifier
- **Role**: Run tests, verify implementations
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Testing frameworks, coverage
- **Output**: Test results with before/after

### 🏛️ ARKEOLOG - Code Analyst
- **Role**: Understand code, analyze structure
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Code patterns, architecture
- **Output**: Structure analysis with entry points

## 💡 Usage

```bash
# Auto-detected based on task
npx tsx cli.ts "Implement user login"  # Activates MİMAR
npx tsx cli.ts "Find React best practices"  # Activates KAŞIF

# Explicit selection
npx tsx cli.ts --persona mimar "Fix the bug"
npx tsx cli.ts --persona kasif "Research OAuth"
```

## 📚 See Also

- `../../master.md` - Complete system reference
- `../core/` - Always-active personas
