# Auto A2A System - Fully Automatic Multi-Agent Workflow

## Objective
Transform the A2A system to be fully automatic with minimal user input:
- **User writes 1-2 sentences** → System handles everything
- **Document references** (@file.md or natural language) → Auto-load and teach agents
- **Auto persona routing** → No manual configuration
- **Optional --a2a flag** → Manual override available

---

## User Requirements Confirmed
1. ✅ Ultra-simple input (1-2 sentences)
2. ✅ Fully automatic multi-agent routing
3. ✅ Document reference support: **Both @ syntax AND natural language**
4. ✅ --a2a flag kept as **optional manual override**

---

## Implementation Plan

### Phase 1: Type Extensions
**File**: `src/types/a2a.ts`

Add new interfaces:
```typescript
// Task analysis result
export interface TaskAnalysis {
  complexity: 'simple' | 'medium' | 'complex';
  domains: string[];
  actionTypes: ActionType[];
  requiresResearch: boolean;
  requiresImplementation: boolean;
  requiresTesting: boolean;
  requiresCodeAnalysis: boolean;
  suggestedPersonas: Persona[];
  reasoning: string;
  confidence: number;
}

// Document reference
export interface DocumentReference {
  type: 'path' | 'url';
  value: string;
  alias?: string;
  startIndex: number;
  endIndex: number;
}

// Loaded document
export interface LoadedDocument {
  reference: DocumentReference;
  content: string;
  summary: string;
  metadata: DocumentMetadata;
  truncated?: boolean;
}

// Auto-detection decision
export interface A2ADecision {
  useA2A: boolean;
  reason: string;
  confidence: number;
  suggestedPersonas?: Persona[];
  fallbackPersona?: Persona;
}
```

Update AgentContext to include documents:
```typescript
export interface AgentContext {
  task: string;
  previousOutputs: AgentOutput[];
  conversationHistory: string;
  userMessages?: string[];
  documents?: LoadedDocument[];  // NEW
}
```

---

### Phase 2: Task Analyzer (NEW FILE)
**File**: `src/a2a/task-analyzer.ts`

```typescript
export class TaskAnalyzer {
  analyze(task: string): TaskAnalysis
  isA2AWorthy(task: string): boolean
}
```

**Features**:
- Multi-dimensional scoring (not just keywords)
- Action type detection: research, implement, fix, analyze, test, refactor, document
- Domain detection: frontend, backend, database, devops, testing
- Complexity calculation: simple/medium/complex
- Smart persona suggestion based on analysis

**Persona Routing Logic**:
```
research + implement    → [explorer, architect, test]
fix + code analysis     → [archaeologist, architect, test]
simple task             → [architect, sentinel]
```

---

### Phase 3: Document Loader (NEW FILE)
**File**: `src/a2a/document-loader.ts`

```typescript
export class DocumentLoader {
  parseReferences(task: string): DocumentReference[]
  loadFromTask(task: string): Promise<LoadedDocument[]>
  formatForPrompt(docs: LoadedDocument[]): string
}
```

**Supported Patterns**:
- `@REFERENCE.md`
- `"use REFERENCE.md as context"`
- `"based on REFERENCE.md"`
- `"REFERENCE.md'den yararlan"`
- `--reference REFERENCE.md`

**Features**:
- Parse task for file references using regex
- Load documents from file system
- Generate summaries for large files (>10KB truncated)
- Format for system prompt injection

---

### Phase 4: Auto Detector (NEW FILE)
**File**: `src/a2a/auto-detector.ts`

```typescript
export class AutoDetector {
  shouldUseA2A(input: string, options: CLIOptions): A2ADecision
}
```

**Decision Logic**:
```
1. Explicit --a2a flag        → A2A mode (confidence: 1.0)
2. Explicit --persona flag    → Single agent (confidence: 1.0)
3. Multiple action types      → A2A mode
4. High complexity            → A2A mode
5. Document references        → A2A mode
6. Simple task                → Single agent
```

---

### Phase 5: Update Agent Runtime
**File**: `src/a2a/agent-runtime.ts`

Modify `buildSystemPrompt()` to include documents:

```typescript
function buildSystemPrompt(persona: Persona, context: AgentContext): string {
  // ... existing code ...

  // NEW: Add document context
  if (context.documents && context.documents.length > 0) {
    prompt += '\n╔════════════════════════════════════════════════════════════╗\n';
    prompt += '║                    REFERENCE DOCUMENTS                   ║\n';
    prompt += '╚════════════════════════════════════════════════════════════╝\n\n';

    for (const doc of context.documents) {
      prompt += `📄 ${doc.reference.value}\n`;
      prompt += `   ${doc.summary}\n\n`;
    }
  }

  // ... rest of function ...
}
```

---

### Phase 6: Update Orchestrator
**File**: `src/a2a/orchestrator.ts`

Replace `detectPersonas()` with intelligent analysis:

```typescript
private async analyzeAndRoute(task: string, docs?: LoadedDocument[]): Promise<Persona[]> {
  const analyzer = new TaskAnalyzer();
  const analysis = analyzer.analyze(task);

  // Print analysis to user
  console.log(`\n🧠 Task Analysis:`);
  console.log(`   Complexity: ${analysis.complexity}`);
  console.log(`   Actions: ${analysis.actionTypes.join(', ')}`);
  console.log(`   Personas: ${analysis.suggestedPersonas.join(' → ')}`);

  return analysis.suggestedPersonas;
}
```

Update `execute()` signature to accept documents:
```typescript
async execute(config: EnhancedWorkflowConfig): Promise<WorkflowState>
```

---

### Phase 7: Update CLI
**File**: `src/cli.ts`

Add auto-detection before A2A flag check:

```typescript
// In main() function
import { AutoDetector } from './a2a/auto-detector.js';
import { DocumentLoader } from './a2a/document-loader.js';

// After parsing options
const task = tasks.join(' ');

// Auto-detect workflow mode
const detector = new AutoDetector();
const decision = detector.shouldUseA2A(task, options);

if (decision.useA2A || options.a2a) {
  // Load referenced documents
  const docLoader = new DocumentLoader(options.directory);
  const docs = await docLoader.loadFromTask(task);

  if (docs.length > 0) {
    console.log(`\n📚 Loaded ${docs.length} reference document(s)`);
  }

  return runA2AWorkflow(task, options, docs, decision);
}
```

---

### Phase 8: Tests
**Files**: `src/a2a/__tests__/`

Create new test files:
- `task-analyzer.test.ts` - Test task analysis logic
- `document-loader.test.ts` - Test document parsing and loading
- `auto-detector.test.ts` - Test A2A detection decisions
- `auto-a2a-integration.test.ts` - End-to-end auto workflow tests

---

## Implementation Order

| Step | Component | Files | Priority |
|------|-----------|-------|----------|
| 1 | Type extensions | `src/types/a2a.ts` | High |
| 2 | Task Analyzer | `src/a2a/task-analyzer.ts` | High |
| 3 | Document Loader | `src/a2a/document-loader.ts` | High |
| 4 | Auto Detector | `src/a2a/auto-detector.ts` | High |
| 5 | Update Agent Runtime | `src/a2a/agent-runtime.ts` | Medium |
| 6 | Update Orchestrator | `src/a2a/orchestrator.ts` | Medium |
| 7 | Update CLI | `src/cli.ts` | Medium |
| 8 | Tests | `src/a2a/__tests__/*.ts` | Medium |
| 9 | Documentation | Update REFERENCE.md | Low |

---

## Usage Examples

### Before (Current)
```bash
npx tsx cli.ts --a2a "Implement user authentication"
```

### After (Auto)
```bash
# Simple - auto-detected
npx tsx cli.ts "Implement user authentication"

# With document reference
npx tsx cli.ts "Implement auth based on @REFERENCE.md"

# Natural language reference
npx tsx cli.ts "Use API_GUIDE.md as context to build the endpoint"

# Manual override still works
npx tsx cli.ts --a2a "Simple task"
```

---

## Key Files to Modify

- `src/types/a2a.ts` - Add new interfaces
- `src/a2a/task-analyzer.ts` - NEW
- `src/a2a/document-loader.ts` - NEW
- `src/a2a/auto-detector.ts` - NEW
- `src/a2a/agent-runtime.ts` - Add document context
- `src/a2a/orchestrator.ts` - Replace detectPersonas()
- `src/cli.ts` - Add auto-detection flow

---

## Success Criteria

1. ✅ User can type 1-2 sentences without any flags
2. ✅ System automatically detects if A2A is needed
3. ✅ Document references (@file or natural language) are loaded and injected
4. ✅ Agents receive document context in their system prompts
5. ✅ Persona routing is intelligent based on task analysis
6. ✅ --a2a flag still works as manual override
7. ✅ All tests pass
