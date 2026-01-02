# personas/specialist/ - SPECIALIST Personas (On-Demand)

## 📁 Overview

SPECIALIST personas are activated based on task requirements. Each is a domain expert with specific capabilities and knowledge.

## 📂 Personas

| File | Icon | Role | Trigger Words |
|------|------|------|---------------|
| `architect.md` | 🏗️ | ARCHITECT | build, implement, code, fix, create |
| `explorer.md` | 🌐 | EXPLORER | research, find, search, learn, best practice |
| `analyst.md` | 🔬 | ANALYST | analyze, data, metrics, query, SQL, trend |
| `test.md` | 🧪 | TEST | test, verify, check, validate |
| `archaeologist.md` | 🏛️ | ARCHAEOLOGIST | understand, analyze structure, read code |

## 🎯 Selection Logic

```typescript
function selectSpecialist(task: string): Persona {
  const lower = task.toLowerCase();

  if (lower.includes('build') || lower.includes('implement')) return 'architect';
  if (lower.includes('research') || lower.includes('find')) return 'explorer';
  if (lower.includes('analyze') || lower.includes('data')) return 'analyst';
  if (lower.includes('test') || lower.includes('verify')) return 'test';
  if (lower.includes('understand') || lower.includes('structure')) return 'archaeologist';

  return 'architect'; // Default
}
```

## 🔄 Workflow Integration

```
┌─────────────────────────────────────────────────────────────┐
│                      TASK ARRIVES                           │
└──────────────┬────────────────────────────────┬──────────────┘
               │                                │
        ┌──────▼────────┐              ┌───────▼────────┐
        │   RECORDER    │              │  Trigger Word  │
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
   │ARCHITECT│      │ EXPLORER  │     │  ANALYST  │
   │ (Build) │      │ (Research)│     │ (Analyze) │
   └─────────┘      └───────────┘     └───────────┘
```

## 🎨 Persona Details

### 🏗️ ARCHITECT - Builder
- **Role**: Write code, implement features, fix bugs
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Design patterns, SOLID, architecture
- **Output**: Working code with tests

### 🌐 EXPLORER - Researcher
- **Role**: Find best practices, search documentation, learn
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Reliable sources, search patterns
- **Output**: Research findings with sources

### 🔬 ANALYST - Data Analyst
- **Role**: Analyze data, find patterns, run queries
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: SQL, statistics, metrics
- **Output**: Analysis with recommendations

### 🧪 TEST - Verifier
- **Role**: Run tests, verify implementations
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Testing frameworks, coverage
- **Output**: Test results with before/after

### 🏛️ ARCHAEOLOGIST - Code Analyst
- **Role**: Understand code, analyze structure
- **Thinking**: `think:` (Sonnet)
- **Domain Knowledge**: Code patterns, architecture
- **Output**: Structure analysis with entry points

## 💡 Usage

```bash
# Auto-detected based on task
npx tsx cli.ts "Implement user login"  # Activates ARCHITECT
npx tsx cli.ts "Find React best practices"  # Activates EXPLORER

# Explicit selection
npx tsx cli.ts --persona architect "Fix the bug"
npx tsx cli.ts --persona explorer "Research OAuth"
```

## 📚 See Also

- `../../master.md` - Complete system reference
- `../core/` - Always-active personas
