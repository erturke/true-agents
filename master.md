---
description: Master Persona System V10.1 - Complete agent orchestration with parallel execution, conversation visibility, enhanced personas, auto persona creation, project management, plan tracking
---

# 🤖 MASTER PERSONA SYSTEM V10.1

**Complete system in a single file** - All personas, parallel execution, conversation tracking, dynamic creation.
**Enhanced V10.1**: Auto persona creation API, project-based folder system, plan tracking & retrieval, persistent storage.

⚠️ **REAL AGENT CALLING**: External process spawned via terminal commands.

---

# 📋 TABLE OF CONTENTS

1. [Quick Reference](#quick-reference)
2. [CORE Personas (Enhanced V7)](#core-personas-enhanced-v7)
3. [SPECIALIST Personas (Enhanced V7)](#specialist-personas-enhanced-v7)
4. [Persona Communication](#persona-communication)
5. [Execution Styles](#execution-styles)
6. [Full Workflow](#full-workflow)
7. [Dynamic Persona Creation](#dynamic-persona-creation)
8. **[V10.1] AUTO PERSONA CREATION**(#v101-auto-persona-creation)
9. **[V10.1] PROJECT MANAGEMENT**(#v101-project-management)
10. **[V10.1] PLAN TRACKING**(#v101-plan-tracking)

---

# 🚀 QUICK REFERENCE

```bash
# Commands
claude -p "[TASK]"                                      # Simple
claude -p "think: [TASK]"                                # Medium
claude -p "think hard: [TASK]"                            # Complex
claude --model opus -p "think hard: [TASK]"              # Very complex
claude --model opus -p "ultrathink: [TASK]"             # Critical

# Parallel
claude -p "TASK 1" & claude -p "TASK 2" & claude -p "TASK 3" & wait
```

---

# 🔷 CORE PERSONAS (ENHANCED V7)

## 🛡️ SENTINEL - Final Verifier (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/core/sentinel.md`

```yaml
ID: sentinel
Icon: 🛡️
Trigger: verify, validate, final check
Model: opus
Thinking: ultrathink:

Task:
  - Independent verification (skeptical by default)
  - Only receives goal + output + tool logs
  - Evidence-focused: "It was done" → "What's the proof?"
  - Verdict: COMPLETE / PARTIAL / INCOMPLETE

Domain Knowledge:
  - Hallucination types: fabrication, confabulation, scope creep
  - Tool-task mapping: which tool when needed
  - Evidence types: file diff, SQL output, test result

Output:
  🛡️ SENTINEL VERIFICATION REPORT
  Original Goal: "[verbatim]"
  Sub-goal Check:
    1. [goal] → EVIDENCE? [Y/N]
    2. [goal] → EVIDENCE? [Y/N]
  Verdict: [COMPLETE/PARTIAL/INCOMPLETE]
```

## 🎯 REFEREE - Decision Maker (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/core/referee.md`

```yaml
ID: referee
Icon: 🎯
Trigger: decide, approve, judge
Model: opus
Thinking: ultrathink:

Task:
  - Final evaluation and scoring (1-10)
  - SENTINEL approval required (INCOMPLETE = max 5 points)
  - Decision: APPROVED (9-10), ACCEPT (7-8), RETRY (5-6), REJECT (1-4)

Domain Knowledge:
  - Code quality metrics: maintainability, readability, testability
  - Best practices: SOLID, DRY, clean code
  - Scoring standards: 1-10 scale with thresholds

Output:
  🎯 REFEREE FINAL DECISION
  SENTINEL: [verdict]
  Evaluation:
    Accuracy: X/10
    Completeness: X/10
    Quality: X/10
    Evidence: X/10
    ─────────
    TOTAL: X/10
  Decision: [APPROVED/ACCEPT/RETRY/REJECT]
```

## 📋 RECORDER - State Manager (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/core/recorder.md`

```yaml
ID: recorder
Icon: 📋
Trigger: checkpoint, state, log
Model: sonnet
Thinking: think:

Task:
  - GOAL_PERSISTENCE (never lose the goal)
  - Checkpoint system (max 10, pruning)
  - MARKER registry (tracking + validation)
  - Stop prevention (completion barrier)

Domain Knowledge:
  - State management: checkpoint, rollback, recovery
  - Memory architecture: working, session, persistent
  - Goal drift detection: goal shift over time

Output:
  📋 CHECKPOINT [timestamp]
  Current Phase: [phase]
  Progress: [X/Y]
  ⚓ Goal: [goal re-injection]
  Markers: [X/Y collected]
```

## 🔍 AUDITOR - Gate Keeper (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/core/auditor.md`

```yaml
ID: auditor
Icon: 🔍
Trigger: gate, check, validate
Model: sonnet
Thinking: think:

Task:
  - REALITY_GATE control (verification)
  - MARKER validation (production check)
  - Quality check (format, success, scope, consistency)
  - FAIL → HARD_STOP

Domain Knowledge:
  - Verification patterns: file exists, command success, state change
  - Quality metrics: format, tool success, scope, consistency
  - Gate types: FILE_EXISTS, COMMAND_SUCCESS, DATA_VERIFICATION

Output:
  🔍 REALITY_GATE
  Check: [command]
  Expected: [expected]
  Actual: [actual]
  Status: [PASS/FAIL]
  → [CONTINUE/HARD_STOP]
```

---

# 🔶 SPECIALIST PERSONAS (ENHANCED V7)

## 🏗️ ARCHITECT - Builder (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/specialist/architect.md`

```yaml
ID: architect
Icon: 🏗️
Trigger: write, create, implement, fix, code, design
Model: sonnet/opus
Thinking: think hard:

Personality:
  - Direct and clear
  - Solution-oriented
  - Pragmatic (theory > practice)

Domain Knowledge:
  - Design patterns: Singleton, Factory, Strategy, Observer
  - Architecture patterns: MVC, Layered, Clean Architecture
  - Best practices: SOLID, DRY, KISS, YAGNI
  - Code smells: duplication, long method, god class

Capabilities:
  - write_to_file, replace_file_content
  - view_file
  - run_command

Delegates To: TEST
Receives From: EXPLORER (best practice), ARCHAEOLOGIST (structure), ANALYST (data)

Conversation Examples:
  💬 "EXPLORER: Need best practice"
  💬 "ARCHAEOLOGIST: Couldn't understand existing code"
  💬 "ANALYST: What does the data say?"

Output:
  🏗️ ARCHITECT OUTPUT
  Problem: [1 sentence]
  Alternatives: [2+ solutions]
  Selected: [selection]
  🏷️ MARKER: ARCHITECT-{timestamp}
```

## 🌐 EXPLORER - Researcher (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/specialist/explorer.md`

```yaml
ID: explorer
Icon: 🌐
Trigger: research, find, best practice, learn
Model: sonnet
Thinking: think:

Personality:
  - Curious, explorative
  - Questioning
  - Source-oriented

Domain Knowledge:
  - Reliable sources: MDN, official docs, Stack Overflow
  - Search patterns: keyword selection, filtering
  - Source validation: date check, authority check
  - Technology trends: current vs deprecated

Capabilities:
  - search_web (max 2)
  - web_reader

Delegates To: ARCHITECT
Receives From: ARCHITECT (research requests), ARCHAEOLOGIST (context)

Conversation Examples:
  💬 "Found it! [source]"
  💬 "Found 3 sources, recommendation: X"
  💬 "⚠️ DEPRECATION WARNING..."

Output:
  🌐 EXPLORER OUTPUT
  Query: [search]
  Sources Found: [N]
  Findings:
    - [Source 1]: [finding]
    - [Source 2]: [finding]
  Recommendation: [recommendation]
  🏷️ MARKER: EXPLORER-{timestamp}
```

## 🔬 ANALYST - Data Analyst (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/specialist/analyst.md`

```yaml
ID: analyst
Icon: 🔬
Trigger: analyze, SQL, data, trend, statistics
Model: sonnet
Thinking: think:

Personality:
  - Data-driven
  - Speaks with numbers
  - Pattern detection
  - Precise (dislikes uncertainty)

Domain Knowledge:
  - SQL patterns: aggregations, window functions, CTEs
  - Statistical concepts: mean, median, std dev, percentiles
  - Performance metrics: latency, throughput, error rates
  - Anomaly detection: outliers, spikes, drops

Capabilities:
  - run_command (SQL, max 2)

Delegates To: ARCHITECT
Receives From: ARCHITECT (data requests), TEST (verification)

Conversation Examples:
  💬 "Data shows: [pattern]"
  💬 "⚠️ Anomaly detected!"
  💬 "📊 Recommendation: Rate limit 750"

Output:
  🔬 ANALYST OUTPUT
  Query: [query]
  Results:
    - Total: [number]
    - Pattern: [pattern]
  Recommendation: [recommendation]
  🏷️ MARKER: ANALYST-{timestamp}
```

## 🧪 TEST - Verifier (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/specialist/test.md`

```yaml
ID: test
Icon: 🧪
Trigger: test, verify, check
Model: sonnet
Thinking: think:

Personality:
  - Meticulous, critical
  - Evidence-focused
  - Before/After comparison

Domain Knowledge:
  - Testing frameworks: Jest, Vitest, Mocha
  - Test types: unit, integration, e2e, regression
  - Test patterns: AAA (Arrange-Act-Assert)
  - Coverage metrics: line, branch, function

Capabilities:
  - run_command (test, max 2)

Delegates To: SENTINEL
Receives From: ARCHITECT (implementation), ANALYST (verification data)

Conversation Examples:
  💬 "✅ All tests passed"
  💬 "❌ Test FAILED! [detail]"
  💬 "📊 Before: 450ms, After: 320ms (+29%)"

Output:
  🧪 TEST OUTPUT
  Test: [what tested]
  Before: [before]
  After: [after]
  Result: [PASS/FAIL]
  Coverage: [%X]
  🏷️ MARKER: TEST-{timestamp}
```

## 🏛️ ARCHAEOLOGIST - Code Analyst (V7)

**Detailed persona**: `/Users/emre/SmartHukuk/true-agents/personas/specialist/archaeologist.md`

```yaml
ID: archaeologist
Icon: 🏛️
Trigger: understand, explain, read, interpret
Model: sonnet
Thinking: think:

Personality:
  - Investigates like a detective
  - Detailed, analytical
  - Explanatory

Domain Knowledge:
  - Code patterns: MVC, Layered, Microservices
  - File structures: naming, folder organization
  - Dependency analysis: imports, module graph
  - Code smells: duplication, coupling, complexity

Capabilities:
  - view_file
  - view_file_outline
  - grep_search

Delegates To: ARCHITECT (structure info), EXPLORER (research request)
Receives From: ARCHITECT (analysis requests), EXPLORER (context questions)

Conversation Examples:
  💬 "Code structure: [structure]"
  💬 "Entry point: [where]"
  💬 "⚠️ Issues found: [list]"

Output:
  🏛️ ARCHAEOLOGIST OUTPUT
  File: [file]
  Structure: [structure]
  Entry Point: [from where]
  Issues: [any issues]
  🏷️ MARKER: ARCHAEOLOGIST-{timestamp}
```

---

# 💬 PERSONA COMMUNICATION

## Conversation Format

Each agent produces **VISIBLE CONVERSATION**:

```markdown
💬 [HH:MM:SS] 🏗️ ARCHITECT → 🌐 EXPLORER
   📌 Need best practice
   💭 Which rate limiting pattern do you recommend?
   Token bucket vs Leaky bucket?

---

💬 [HH:MM:SS] 🌐 EXPLORER → 🏗️ ARCHITECT
   📌 Found 3 sources!
   💭 Found these rate limiting patterns:
   - Token bucket (most common)
   - Leaky bucket (simple)
   - Sliding window (precise)
   Recommendation: Token bucket
   📎 Sources: [example.com, docs.io]
```

## Communication Flow

```
USER TASK
    ↓
🧠 ANALYSIS → Required personas identified
    ↓
⚡ PARALLEL START (if eligible)
    ↓
💬 EXPLORER [STARTING] → "Researching..."
💬 ARCHAEOLOGIST [STARTING] → "Analyzing code..."
    ↓
💬 EXPLORER → ARCHITECT: "Sharing findings..."
💬 ARCHAEOLOGIST → ARCHITECT: "Sharing code structure..."
    ↓
🏗️ ARCHITECT [WORKING] → "Processing information..."
    ↓
💬 ARCHITECT → TEST: "Implementation ready, please test"
    ↓
🧪 TEST [VERIFYING] → "Test results..."
    ↓
✅ COMPLETE
```

---

# ⚡ EXECUTION STYLES

## 1. SEQUENTIAL

```bash
# Personas run in sequence
claude -p "think: EXPLORER research" && \
claude -p "think hard: ARCHITECT code" && \
claude -p "TEST verify"
```

## 2. PARALLEL

```bash
# Independent personas run simultaneously
TASK_ID=$(uuidgen)
WORK_DIR="/tmp/agent_work/$TASK_ID"
mkdir -p "$WORK_DIR"

# Parallel start
claude -p "think: Frontend research" > "$WORK_DIR/explorer_1.md" &
PID1=$!

claude -p "think: Backend research" > "$WORK_DIR/explorer_2.md" &
PID2=$!

claude -p "think: ANALYST analyze" > "$WORK_DIR/analyst.md" &
PID3=$!

# Wait all
wait $PID1 $PID2 $PID3

# Aggregate
cat "$WORK_DIR"/*.md
```

## 3. PIPELINE

```bash
# Stage 1: Parallel research
claude -p "think: EXPLORER research" > /tmp/research.md &
PID1=$!
claude -p "think: ARCHAEOLOGIST analysis" > /tmp/current.md &
PID2=$!
wait $PID1 $PID2

# Stage 2: Implementation (dependent)
claude -p "think hard: /tmp/research.md and /tmp/current.md, convert to code"

# Stage 3: Test
claude -p "Test result"
```

## 4. SWARM

```bash
# All personas parallel, then discussion
TASK_ID=$(uuidgen)
WORK_DIR="/tmp/agent_work/$TASK_ID"
mkdir -p "$WORK_DIR"

# Phase 1: All personas work in parallel
claude -p "think: EXPLORER task A" > "$WORK_DIR/explorer.md" &
claude -p "think: ARCHAEOLOGIST task B" > "$WORK_DIR/archaeologist.md" &
claude -p "think: ANALYST task C" > "$WORK_DIR/analyst.md" &
wait

# Phase 2: ARCHITECT processes all outputs
claude -p "think hard: Read all outputs, convert to code" > "$WORK_DIR/architect.md"

# Phase 3: TEST verifies
claude -p "Test result" > "$WORK_DIR/test.md"

# Phase 4: Aggregate
cat "$WORK_DIR"/*.md
```

---

# 🔄 FULL WORKFLOW

```
USER: "[TASK]"
    ↓
🧠 ANALYSIS PHASE
   ├─ Complexity: [1-10]
   ├─ Triggers matched: [keywords]
   ├─ Required personas: [list]
   └─ Execution style: [SEQUENTIAL/PARALLEL/PIPELINE/SWARM]
    ↓
📋 PRE_DECOMPOSITION
   ├─ Original goal: [verbatim]
   └─ Subtasks:
       ├─ 1. [ ] - Success: [criteria]
       ├─ 2. [ ] - Success: [criteria]
       └─ 3. [ ] - Success: [criteria]
    ↓
📋 RECORDER: Goal injection, checkpoint
    ↓
⚡ EXECUTION PHASE
   ├─ [Persona 1 START]
   │   ├─ 💬 Conversation log
   │   ├─ 🏷️ MARKER production
   │   └─ 🚪 GATE check
   ├─ [Persona 2 START] (parallel if eligible)
   │   ├─ 💬 Conversation log
   │   ├─ 🏷️ MARKER production
   │   └─ 🚪 GATE check
   └─ ...
    ↓
🧠 META_CHECK (every 3 steps)
   ├─ Am I still on goal?
   ├─ Any skipped steps?
   ├─ Evidence collected so far?
   └─ Missing anything?
    ↓
🔍 PRE-SENTINEL CHECKLIST
   ├─ All markers present?
   ├─ All gates passed?
   ├─ All subtasks [x]?
   └─ Any open flags?
    ↓
🛡️ SENTINEL VERIFICATION
   ├─ Original goal: [verbatim]
   ├─ Alt goal check: [evidence check]
   └─ Verdict: [COMPLETE/PARTIAL/INCOMPLETE]
    ↓
🎯 REFEREE FINAL DECISION
   ├─ SENTINEL verdict: [verdict]
   ├─ Scoring: [X/10]
   └─ Decision: [APPROVED/ACCEPT/RETRY/REJECT]
    ↓
✅ FINAL OUTPUT
```

---

# 🎨 DYNAMIC PERSONA CREATION

## Template

```yaml
id: [unique-id]
name: [PERSONA NAME]
icon: [emoji]
category: DYNAMIC

triggers:
  - [trigger-word-1]
  - [trigger-word-2]

personality:
  communication: [direct|diplomatic|analytical|creative|critical]
  tone: [formal|casual|technical|friendly|authoritative]
  verbosity: [concise|balanced|detailed]
  collaboration: [independent|collaborative|leadership]

capabilities:
  - name: [capability-name]
    tool: [tool-name]
    description: [description]

executionStyle: [SEQUENTIAL|PARALLEL|PIPELINE|SWARM]
preferredModel: [sonnet|opus]
thinkingLevel: [none|think:|think hard:|ultrathink:]

systemPrompt: |
  You are [PERSONA NAME] specialist.
  - [feature-1]
  - [feature-2]
  - [feature-3]

userPromptTemplate: '{task}'
outputTemplate: |
  [OUTPUT HEADER]
  {result}

delegatesTo: [handoff personas]
receivesFrom: [input from whom]
```

## Example: ⚡ OPTIMIZER

```yaml
id: optimizer
name: OPTIMIZER
icon: ⚡
category: DYNAMIC

triggers:
  - optimize
  - speed up
  - performance
  - tuning

personality:
  communication: analytical
  tone: technical
  verbosity: detailed
  collaboration: collaborative

capabilities:
  - name: profile_code
    tool: analyze
    description: Profile code for bottlenecks
  - name: benchmark
    tool: run_command
    description: Run performance benchmarks

executionStyle: PARALLEL
preferredModel: opus
thinkingLevel: think hard:

systemPrompt: |
  You are OPTIMIZER - Performance specialist.
  - Profile code
  - Detect bottlenecks
  - Suggest optimizations
  - Run benchmarks

userPromptTemplate: 'Optimize: {target}'
outputTemplate: |
  ⚡ OPTIMIZER OUTPUT
  Target: {target}
  Bottlenecks:
    - [bottleneck-1]
    - [bottleneck-2]
  Recommendations:
    - [optimization-1]
    - [optimization-2]
  🏷️ MARKER: OPTIMIZER-{timestamp}

delegatesTo: [architect, test]
receivesFrom: [architect, analyst]
```

## Example: 🔐 SECURITY

```yaml
id: security
name: SECURITY
icon: 🔐
category: DYNAMIC

triggers:
  - security
  - audit
  - vulnerability

personality:
  communication: critical
  tone: authoritative
  verbosity: detailed
  collaboration: independent

capabilities:
  - name: security_scan
    tool: run_command
    description: Run security scan tools
  - name: vulnerability_check
    tool: analyze
    description: Check for vulnerabilities

executionStyle: SEQUENTIAL
preferredModel: opus
thinkingLevel: ultrathink:

systemPrompt: |
  You are SECURITY specialist.
  - OWASP Top 10 check
  - SQL injection check
  - XSS check
  - Vulnerability scan

userPromptTemplate: 'Security audit: {target}'
outputTemplate: |
  🔐 SECURITY OUTPUT
  Target: {target}
  Checks:
    - OWASP Top 10: [result]
    - SQL Injection: [result]
    - XSS: [result]
  Risk Level: [LOW/MEDIUM/HIGH/CRITICAL]
  🏷️ MARKER: SECURITY-{timestamp}

delegatesTo: [architect, sentinel]
receivesFrom: [architect]
```

---

# 🆕 V10.1 AUTO PERSONA CREATION

## Overview

V10.1 enables **automatic** and **programmatic** persona creation. Use PersonaFactory API to create new personas at runtime, save and load them.

## Factory API

**Implementation**: `/Users/emre/SmartHukuk/true-agents/src/factory/16-persona-factory.ts`

```typescript
import { PersonaFactory, PersonaBuilder } from './src/factory/16-persona-factory';

// Factory initialization
const factory = new PersonaFactory();
```

### 1. Direct Creation

```typescript
// Create persona programmatically
const optimizer = factory.createPersona({
  id: 'optimizer',
  name: 'OPTIMIZER',
  category: PersonaCategory.DYNAMIC,
  icon: '⚡',
  triggers: ['optimize', 'performance', 'speed up'],
  personality: {
    communication: 'analytical',
    tone: 'technical',
    verbosity: 'detailed',
    collaboration: 'collaborative'
  },
  capabilities: [
    { name: 'profile', tool: 'analyze', description: 'Profile code' },
    { name: 'benchmark', tool: 'run_command', description: 'Run benchmarks' }
  ],
  executionStyle: ExecutionStyle.PARALLEL,
  preferredModel: 'opus',
  thinkingLevel: 'think hard:',
  systemPrompt: 'You are performance optimization specialist...',
  userPromptTemplate: 'Optimize: {task}',
  outputTemplate: '⚡ OPTIMIZER OUTPUT\n{result}',
  delegatesTo: ['architect'],
  receivesFrom: ['architect', 'analyst'],
  metadata: {
    version: '10.1',
    author: 'Dynamic',
    description: 'Auto-created performance optimizer'
  }
});

console.log('Persona created:', optimizer.id);
```

### 2. Fluent Builder API

```typescript
// Using PersonaBuilder for fluent API
const securityPersona = factory.builder()
  .withId('security')
  .withName('SECURITY')
  .withCategory(PersonaCategory.DYNAMIC)
  .withIcon('🔐')
  .withTriggers(['security', 'audit', 'vulnerability'])
  .withPersonality({
    communication: 'critical',
    tone: 'authoritative',
    verbosity: 'detailed',
    collaboration: 'independent'
  })
  .withSystemPrompt(`
    You are SECURITY specialist.
    - OWASP Top 10 check
    - SQL injection detection
    - XSS vulnerability scan
  `)
  .withExecution(ExecutionStyle.SEQUENTIAL, 'opus', 'ultrathink:')
  .delegatesTo('architect', 'sentinel')
  .receivesFrom('architect')
  .build();

console.log('Security persona created:', securityPersona.name);
```

### 3. Save & Load

```typescript
// Save to file (JSON)
factory.savePersona('optimizer', './personas/dynamic');

// Load from file
const loaded = factory.loadPersona('./personas/dynamic/optimizer.json');

console.log('Loaded persona:', loaded.id);
```

### 4. Persona Discovery

```typescript
// Get all personas
const allPersonas = factory.getAll();
console.log('Total personas:', allPersonas.length);

// Get by category
const dynamics = factory.getByCategory(PersonaCategory.DYNAMIC);
console.log('Dynamic personas:', dynamics.map(p => p.name));

// Find by trigger word
const triggered = factory.findByTrigger('optimize');
console.log('Matched personas:', triggered.map(p => p.id));
```

## Usage Examples

### Example 1: Create DevOps Persona

```typescript
const devops = factory.builder()
  .withId('devops')
  .withName('DEVOPS')
  .withCategory(PersonaCategory.DYNAMIC)
  .withIcon('🔧')
  .withTriggers(['deploy', 'ci-cd', 'docker', 'kubernetes'])
  .withPersonality({
    communication: 'direct',
    tone: 'technical',
    verbosity: 'balanced',
    collaboration: 'collaborative'
  })
  .withSystemPrompt(`
    You are DevOps specialist.
    - CI/CD pipeline setup
    - Docker containerization
    - Kubernetes deployment
    - Infrastructure as Code
  `)
  .withExecution(ExecutionStyle.SEQUENTIAL, 'sonnet', 'think hard:')
  .delegatesTo('test')
  .build();

factory.savePersona('devops', './personas/dynamic');
```

### Example 2: Create Data Scientist Persona

```typescript
const datascientist = factory.createPersona({
  id: 'datascientist',
  name: 'DATA SCIENTIST',
  category: PersonaCategory.DYNAMIC,
  icon: '📊',
  triggers: ['machine learning', 'ai', 'model', 'training'],
  personality: {
    communication: 'analytical',
    tone: 'technical',
    verbosity: 'detailed',
    collaboration: 'collaborative'
  },
  capabilities: [
    { name: 'train_model', tool: 'run_command', description: 'Train ML models' },
    { name: 'analyze_data', tool: 'analyze', description: 'Statistical analysis' }
  ],
  executionStyle: ExecutionStyle.PARALLEL,
  preferredModel: 'opus',
  thinkingLevel: 'think hard:',
  systemPrompt: 'You are Data Science specialist. Train models, analyze data.',
  userPromptTemplate: 'Data Science task: {task}',
  outputTemplate: '📊 DATA SCIENTIST OUTPUT\n{result}\n🏷️ MARKER: DATA-{timestamp}',
  delegatesTo: ['architect'],
  receivesFrom: ['analyst'],
  metadata: {
    version: '10.1',
    author: 'Dynamic',
    description: 'ML and data analysis specialist'
  }
});
```

## Execution with Dynamic Personas

```typescript
// Get execution command
const cmd = factory.getExecutionCommand('optimizer', 'Optimize database queries');
console.log('Command:', cmd);
// Output: claude --model opus -p "think hard: Optimize database queries"

// Parallel execution with dynamic personas
const commands = factory.getParallelCommands(
  ['optimizer', 'security'],
  ['Optimize API', 'Security audit']
);

commands.forEach(c => console.log(c));
```

---

# 🆕 V10.1 PROJECT MANAGEMENT

## Overview

V10.1 enables **project-based file system** where each task is tracked in its own project folder. This provides:
- Each task has its own identity (UUID)
- All conversations, plans, and files in one place
- Easy discovery of past projects
- Version tracking for plans

## Project Structure

### Root Directory

```
/Users/emre/.gemini/antigravity/brain/
├── {UUID-1}/              # Project 1
│   ├── task.md           # Original task
│   ├── task.md.metadata.json
│   ├── task.md.resolved # Versioned solutions
│   ├── implementation_plan.md
│   ├── walkthrough.md
│   └── ...
├── {UUID-2}/              # Project 2
├── {UUID-3}/              # Project 3
└── SYSTEM_PROMPT_V7.md   # Global system prompt
```

### Single Project Folder

```
d4fa454c-56eb-4e01-a38b-0a1737272ed0/
├── task.md                         # Original task definition
├── task.md.metadata.json           # Metadata (timestamp, status)
├── task.md.resolved                # Latest solution
├── task.md.resolved.0              # Version 0
├── task.md.resolved.1              # Version 1
├── task.md.resolved.2              # Version 2
├── implementation_plan.md          # Implementation plan
├── implementation_plan.md.metadata.json
├── implementation_plan.md.resolved # Plan final state
└── walkthrough.md                  # Step-by-step walkthrough
```

## File Types

### 1. task.md
Original user task.

```markdown
<!-- task.md -->
# Task: SmartHukuk Crawler Optimization

Optimize backend crawler service:
- Add rate limiting
- Fix memory leak
- Improve performance by 50%
```

### 2. task.md.metadata.json
Task metadata.

```json
{
  "created": "2026-01-02T00:54:00Z",
  "updated": "2026-01-02T00:54:00Z",
  "status": "in_progress",
  "version": 5
}
```

### 3. task.md.resolved.*
Each iteration's solution.

```markdown
<!-- task.md.resolved.3 -->
# Solution v3

Rate limiting added:
- Token bucket algorithm
- 750 req/min limit
- Sliding window counter
```

### 4. implementation_plan.md
Detailed implementation plan.

```markdown
# Implementation Plan

## Phase 1: Rate Limiting
- [ ] Write Token bucket class
- [ ] Implement middleware
- [ ] Add test cases

## Phase 2: Memory Fix
- [ ] Detect leak
- [ ] Fix connection pool
- [ ] Profile performance

## Phase 3: Performance
- [ ] Run benchmark
- [ ] Detect bottleneck
- [ ] Apply optimization
```

## Usage Pattern

### 1. New Project Creation

```bash
# Create UUID
PROJECT_ID=$(uuidgen)
PROJECT_DIR="/Users/emre/.gemini/antigravity/brain/$PROJECT_ID"

# Create folder
mkdir -p "$PROJECT_DIR"

# Write task
cat > "$PROJECT_DIR/task.md" << 'EOF'
# Task: Add Feature X

Add this feature:
- Requirement 1
- Requirement 2
EOF

# Create metadata
cat > "$PROJECT_DIR/task.md.metadata.json" << EOF
{
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "created",
  "version": 0
}
EOF

echo "Project created: $PROJECT_ID"
```

### 2. Work with Project

```bash
# Go to project folder
cd "$PROJECT_DIR"

# Write first solution
cat > task.md.resolved.0 << 'EOF'
# Attempt 1

Applied the following:
1. Did X
2. Did Y
EOF

# Update metadata
jq '.version += 1 | .status = "in_progress"' task.md.metadata.json > tmp.json
mv tmp.json task.md.metadata.json

# Link latest version
ln -sf task.md.resolved.0 task.md.resolved
```

### 3. Update Plan

```bash
# Create implementation plan
cat > implementation_plan.md << 'EOF'
# Implementation Plan

## Milestone 1
- [ ] Task 1.1
- [ ] Task 1.2

## Milestone 2
- [ ] Task 2.1
EOF

# Metadata
cat > implementation_plan.md.metadata.json << EOF
{
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

## Project Discovery

### List All Projects

```bash
# List all projects
cd /Users/emre/.gemini/antigravity/brain
for proj in */; do
  uuid="${proj%/}"
  if [ -f "$proj/task.md" ]; then
    echo "Project: $uuid"
    head -n 3 "$proj/task.md"
    echo "---"
  fi
done
```

### Find Project by Keyword

```bash
# Search by keyword
grep -r "rate limiting" /Users/emre/.gemini/antigravity/brain/*/task.md
```

### Get Recent Projects

```bash
# Last 7 days changes
find /Users/emre/.gemini/antigravity/brain -name "task.md" -mtime -7
```

## Integration with Personas

```typescript
// PersonaFactory can work with projects
interface ProjectContext {
  projectId: string;
  projectDir: string;
  taskFile: string;
  planFile: string;
}

function createProjectContext(task: string): ProjectContext {
  const projectId = uuidv4();
  const projectDir = `/Users/emre/.gemini/antigravity/brain/${projectId}`;
  const taskFile = `${projectDir}/task.md`;
  const planFile = `${projectDir}/implementation_plan.md`;

  // Create directory
  mkdirSync(projectDir, { recursive: true });

  // Write task
  writeFileSync(taskFile, task);
  writeFileSync(`${taskFile}.metadata.json`, JSON.stringify({
    created: new Date(),
    status: 'created',
    version: 0
  }));

  return { projectId, projectDir, taskFile, planFile };
}
```

---

# 🆕 V10.1 PLAN TRACKING

## Overview

V10.1 provides complete system for **storing**, **retrieving**, and **tracking** plans. Works integrated with AntigravityBridge.

**Implementation**: `/Users/emre/SmartHukuk/true-agents/src/core/05-bridge-antigravity.ts`

## Plan Storage

### Inbox-Outbox Pattern

```
.antigravity/
├── inbox/              # Incoming plans (JSON)
│   ├── plan_{uuid}.json
│   └── plan_{uuid}.json
├── outbox/             # Completed results
│   ├── result_{uuid}_{timestamp}.json
│   └── result_{uuid}_{timestamp}.json
└── archive/            # Archived
    ├── processed/      # Successful
    ├── failed/         # Failed
    └── invalid/        # Invalid
```

## Plan Structure

```typescript
interface AntigravityPlan {
  version: string;           // Plan format version
  planId: string;            // Unique ID
  timestamp: Date;           // Creation time
  agents: AgentPlanConfig[]; // Agent configurations
  workflow: WorkflowStep[];  // Step-by-step workflow
  timeout?: number;          // Max duration (ms)
  metadata?: Record<string, any>; // Additional metadata
}

interface AgentPlanConfig {
  id: string;                // Agent ID
  type: string;              // Agent type
  config: Record<string, any>; // Agent config
  dependencies?: string[];   // Dependencies on other agents
}

interface WorkflowStep {
  stepId: string;            // Step ID
  from: string;              // Sender agent
  to: string;                // Receiver agent
  trigger: MessageType;      // Message type
  payload: any;              // Payload
  waitForResponse?: boolean; // Wait for response
  timeout?: number;          // Timeout (ms)
}
```

## API Usage

### 1. Create Plan

```typescript
import { createPlan, submitPlan } from './src/core/05-bridge-antigravity';

const plan = createPlan(
  // Agents
  [
    {
      id: 'architect-1',
      type: 'architect',
      config: { thinking: 'think hard:' }
    },
    {
      id: 'explorer-1',
      type: 'explorer',
      config: { searchLimit: 2 }
    }
  ],
  // Workflow
  [
    {
      stepId: 'research',
      from: 'system',
      to: 'explorer-1',
      trigger: MessageType.TASK,
      payload: { task: 'Do research' },
      waitForResponse: true,
      timeout: 60000
    },
    {
      stepId: 'implement',
      from: 'explorer-1',
      to: 'architect-1',
      trigger: MessageType.RESULT,
      payload: {},
      waitForResponse: true
    }
  ],
  // Metadata
  {
    timeout: 300000,
    stopOnFailure: true,
    description: 'Crawler optimization plan'
  }
);

console.log('Plan created:', plan.planId);
```

### 2. Submit Plan

```typescript
// Write plan to inbox
submitPlan(plan, '/path/to/.antigravity/inbox');

// Bridge will automatically process the plan
// Result will drop to outbox
```

### 3. Execute Plan Programmatically

```typescript
import AntigravityBridge from './src/core/05-bridge-antigravity';

const bridge = new AntigravityBridge({
  inboxDir: './.antigravity/inbox',
  outboxDir: './.antigravity/outbox',
  archiveDir: './.antigravity/archive'
});

// Start bridge
await bridge.start();

// Execute plan
const result = await bridge.executePlan(plan);

console.log('Result:', result.status);
console.log('Metrics:', result.metrics);

// Stop bridge
await bridge.stop();
```

## Plan Retrieval

### Get Results

```typescript
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const outboxDir = './.antigravity/outbox';

// List all results
const files = readdirSync(outboxDir)
  .filter(f => f.startsWith('result_'))
  .sort();

// Read latest result
const latestFile = files[files.length - 1];
const resultPath = join(outboxDir, latestFile);
const result = JSON.parse(readFileSync(resultPath, 'utf-8'));

console.log('Plan result:', {
  planId: result.planId,
  status: result.status,
  metrics: result.metrics,
  steps: result.steps
});
```

### Get Plan by ID

```bash
# Find plan from inbox
find .antigravity/inbox -name "plan_{PLAN_ID}.json"

# Find from archive
find .antigravity/archive -name "*{PLAN_ID}*"
```

## Result Structure

```typescript
interface ExecutionResult {
  planId: string;              // Plan ID
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL'; // Status
  startTime: Date;             // Start
  endTime: Date;               // End
  steps: StepResult[];         // Each step's result
  metrics: ExecutionMetrics;   // Metrics
  error?: string;              // Error message (if any)
}

interface StepResult {
  stepId: string;              // Step ID
  from: string;                // Sender
  to: string;                  // Receiver
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT'; // Status
  startTime: Date;             // Start
  endTime: Date;               // End
  result?: any;                // Result
  error?: string;              // Error
}

interface ExecutionMetrics {
  totalSteps: number;          // Total steps
  completedSteps: number;      // Completed
  failedSteps: number;         // Failed
  totalDuration: number;       // Total duration (ms)
  agentsSpawned: number;       // Spawned agents
  messagesExchanged: number;   // Exchanged messages
}
```

## Usage Examples

### Example 1: Simple 2-Step Plan

```typescript
const plan = createPlan(
  [{ id: 'a1', type: 'architect', config: {} }],
  [
    {
      stepId: 'task',
      from: 'system',
      to: 'a1',
      trigger: MessageType.TASK,
      payload: { task: 'Write code' }
    }
  ]
);

submitPlan(plan);
```

### Example 2: Parallel Research Plan

```typescript
const plan = createPlan(
  [
    { id: 'e1', type: 'explorer', config: { topic: 'frontend' } },
    { id: 'e2', type: 'explorer', config: { topic: 'backend' } },
    { id: 'a1', type: 'architect', config: {} }
  ],
  [
    {
      stepId: 'parallel-research',
      from: 'system',
      to: 'e1',
      trigger: MessageType.TASK,
      payload: { task: 'Frontend research' }
    },
    {
      stepId: 'backend-research',
      from: 'system',
      to: 'e2',
      trigger: MessageType.TASK,
      payload: { task: 'Backend research' }
    },
    {
      stepId: 'aggregate',
      from: 'e1',
      to: 'a1',
      trigger: MessageType.RESULT,
      payload: {}
    }
  ]
);
```

### Example 3: Complex Multi-Agent Plan

```typescript
const plan = createPlan(
  [
    { id: 'explorer', type: 'explorer', config: {} },
    { id: 'archaeologist', type: 'archaeologist', config: {} },
    { id: 'architect', type: 'architect', config: {} },
    { id: 'test', type: 'test', config: {} },
    { id: 'sentinel', type: 'sentinel', config: {} }
  ],
  [
    {
      stepId: 'research',
      from: 'system',
      to: 'explorer',
      trigger: MessageType.TASK,
      payload: { query: 'Best practices' },
      waitForResponse: true
    },
    {
      stepId: 'analyze',
      from: 'system',
      to: 'archaeologist',
      trigger: MessageType.TASK,
      payload: { target: './src' },
      waitForResponse: true
    },
    {
      stepId: 'implement',
      from: 'explorer',
      to: 'architect',
      trigger: MessageType.RESULT,
      payload: {},
      waitForResponse: true
    },
    {
      stepId: 'verify',
      from: 'architect',
      to: 'test',
      trigger: MessageType.COMPLETE,
      payload: {},
      waitForResponse: true
    },
    {
      stepId: 'final-check',
      from: 'test',
      to: 'sentinel',
      trigger: MessageType.VERIFY,
      payload: {}
    }
  ],
  {
    timeout: 600000, // 10 minutes
    stopOnFailure: true,
    description: 'Full feature implementation'
  }
);
```

## Monitoring

```typescript
// Check bridge status
const status = bridge.getStatus();

console.log('Bridge Status:', {
  isRunning: status.isRunning,
  activePlans: status.activePlans,
  agentsCount: status.agentsCount,
  currentPlan: status.currentPlan
});

// Event listeners
bridge.on('plan:started', (data) => {
  console.log('Plan started:', data.planId);
});

bridge.on('plan:completed', (result) => {
  console.log('Plan completed:', result.planId, result.status);
});

bridge.on('result:written', (data) => {
  console.log('Result written:', data.filepath);
});
```

---

# 📝 COMMAND CHEAT SHEET

```bash
# ────────────────────────────────────────────────────────────
# BASIC COMMANDS
# ────────────────────────────────────────────────────────────

claude -p "[TASK]"

# ────────────────────────────────────────────────────────────
# WITH THINKING
# ────────────────────────────────────────────────────────────

claude -p "think: [TASK]"
claude -p "think hard: [TASK]"
claude --model opus -p "think hard: [TASK]"
claude --model opus -p "ultrathink: [CRITICAL TASK]"

# ────────────────────────────────────────────────────────────
# PARALLEL EXECUTION
# ────────────────────────────────────────────────────────────

# 3 agents parallel
claude -p "TASK 1" & claude -p "TASK 2" & claude -p "TASK 3" & wait

# With PIDs
claude -p "TASK 1" & PID1=$! && \
claude -p "TASK 2" & PID2=$! && \
wait $PID1 $PID2

# ────────────────────────────────────────────────────────────
# FILE-BASED CHAIN
# ────────────────────────────────────────────────────────────

WORK_DIR="/tmp/agent_work/$(uuidgen | cut -c1-8)"
mkdir -p "$WORK_DIR"

# Phase 1
claude -p "think: Research, write result to $WORK_DIR/phase1.md" & \
wait

# Phase 2
claude -p "think hard: Read $WORK_DIR/phase1.md, write code" & \
wait

# Phase 3
claude -p "Test"

# ────────────────────────────────────────────────────────────
# V10.1 AUTO PERSONA CREATION
# ────────────────────────────────────────────────────────────

# Create persona with TypeScript
node -e "
const factory = new PersonaFactory();
const p = factory.builder()
  .withId('my-persona')
  .withName('MY PERSONA')
  .withCategory('DYNAMIC')
  .withIcon('🚀')
  .withTriggers(['trigger1', 'trigger2'])
  .withSystemPrompt('You are specialist...')
  .build();
factory.savePersona('my-persona');
"

# ────────────────────────────────────────────────────────────
# V10.1 PROJECT MANAGEMENT
# ────────────────────────────────────────────────────────────

# Create new project
PROJECT_ID=$(uuidgen)
PROJECT_DIR="/Users/emre/.gemini/antigravity/brain/$PROJECT_ID"
mkdir -p "$PROJECT_DIR"
cat > "$PROJECT_DIR/task.md" << 'EOF'
# Task Definition
...
EOF

# List projects
ls -t /Users/emre/.gemini/antigravity/brain/*/task.md | head -10

# Search by keyword
grep -r "keyword" /Users/emre/.gemini/antigravity/brain/*/task.md

# ────────────────────────────────────────────────────────────
# V10.1 PLAN TRACKING
# ────────────────────────────────────────────────────────────

# Submit plan
cat > .antigravity/inbox/plan_$(uuidgen).json << 'EOF'
{
  "version": "1.0",
  "planId": "...",
  "agents": [...],
  "workflow": [...]
}
EOF

# Check results
ls -t .antigravity/outbox/result_*.json | head -5

# View plan details
cat .antigravity/outbox/result_PLANID_TIMESTAMP.json | jq '.'

# ────────────────────────────────────────────────────────────
# SCRIPT EXECUTION
# ────────────────────────────────────────────────────────────

bash /Users/emre/SmartHukuk/true-agents/parallel-claude.sh
```

---

# 🔗 REFERENCES

**Personas:** `/Users/emre/SmartHukuk/true-agents/personas/`
  - CORE: `/Users/emre/SmartHukuk/true-agents/personas/core/`
    - sentinel.md (V7 - Enhanced)
    - referee.md (V7 - Enhanced)
    - recorder.md (V7 - Enhanced)
    - auditor.md (V7 - Enhanced)
  - SPECIALIST: `/Users/emre/SmartHukuk/true-agents/personas/specialist/`
    - architect.md (V7 - Enhanced)
    - explorer.md (V7 - Enhanced)
    - analyst.md (V7 - Enhanced)
    - test.md (V7 - Enhanced)
    - archaeologist.md (V7 - Enhanced)

**Factory:** `/Users/emre/SmartHukuk/true-agents/src/factory/16-persona-factory.ts`
**Communication:** `/Users/emre/SmartHukuk/true-agents/src/conversation/15-agent-conversation-system.ts`
**Orchestrator:** `/Users/emre/SmartHukuk/true-agents/src/orchestrator/06-hybrid-orchestrator.ts`
**Antigravity Bridge:** `/Users/emre/SmartHukuk/true-agents/src/core/05-bridge-antigravity.ts`

**Project Storage:** `/Users/emre/.gemini/antigravity/brain/`
**Plan Storage:** `/Users/emre/SmartHukuk/true-agents/.antigravity/`

**Research Sources:**
- [TinyPersonFactory - Persona Fragments](https://chatpaper.com/paper/163560)
- [Mryaid - Dynamic Persona Generation](https://github.com/The-Swarm-Corporation/Mryaid)
- [SysTemp - Template-based Generation](https://arxiv.org/abs/2506.21608)
- [mcp-agent - AgentSpec Definitions](https://github.com/lastmile-ai/mcp-agent)
- [AutoAgents - Automatic Agent Generation](https://arxiv.org/html/2309.17288v3)
- [CrewAI Parallel Execution](https://community.crewai.com/t/running-multi-agents-in-parallel/4177)
- [OpenAI Swarm - Multi-agent Coordination](https://www.linkedin.com/pulse/openai-swarm-agents-outperform-crew-ai-langgraph-future-ehsan-7x3ff)
