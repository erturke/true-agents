# TRUE-AGENTS REFERENCE DOCUMENT

> **For Claude Code AI Assistant**
>
> This document is the SINGLE SOURCE OF TRUTH for understanding and executing the true-agents multi-agent system. When the user references true-agents, agents, or parallel execution, read this document first.

---

## 🎯 WHAT IS TRUE-AGENTS?

true-agents is a **persona-based multi-agent orchestration framework** that enables:
- 9 specialized personas (4 CORE + 5 SPECIALIST)
- Parallel execution of multiple agents
- Dynamic persona creation at runtime
- Project-based task tracking
- CLI tool for terminal execution

### Key Principle
**Each persona is a specialist** with specific triggers, domain knowledge, and communication protocols. They work together through visible conversation logs.

---

## 📋 PERSONA REFERENCE

### CORE Personas (Always Active)

| Persona | Icon | ID | Trigger Words | Role |
|---------|-----|----|---------------|------|
| SENTINEL | 🛡️ | `sentinel` | verify, validate, final check | Independent verification, evidence-focused |
| REFEREE | 🎯 | `referee` | decide, approve, judge | Final scoring (1-10), decision maker |
| RECORDER | 📋 | `recorder` | checkpoint, state, log | Goal persistence, checkpoint system |
| AUDITOR | 🔍 | `auditor` | gate, check, validate | Quality gate, reality validator |

### SPECIALIST Personas (On-Demand)

| Persona | Icon | ID | Trigger Words | Role |
|---------|-----|----|---------------|------|
| ARCHITECT | 🏗️ | `architect` | write, create, implement, fix, code, build | Builder & implementer |
| EXPLORER | 🌐 | `explorer` | research, find, best practice, learn, search | Researcher, finds best practices |
| ANALYST | 🔬 | `analyst` | analyze, SQL, data, trend, statistics | Data analyst |
| TEST | 🧪 | `test` | test, verify, check | Verifier, test writer |
| ARCHAEOLOGIST | 🏛️ | `archaeologist` | understand, explain, read, interpret | Code analyst, structure analyzer |

### Persona Communication Flow

```
USER TASK
    ↓
ANALYSIS → Select personas based on trigger words
    ↓
PARALLEL START (if eligible)
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

## 🚀 EXECUTION METHODS

### Method 1: Terminal CLI (Primary)

```bash
# Basic usage
npx tsx true-agents/src/cli.ts "task description"

# With specific persona
npx tsx true-agents/src/cli.ts --persona architect "Implement OAuth login"

# Parallel execution (MULTIPLE AGENTS)
npx tsx true-agents/src/cli.ts --parallel \
  "Research React 19 best practices" \
  "Analyze current codebase" \
  "Write implementation plan"

# With thinking level
npx tsx true-agents/src/cli.ts --thinking think-hard "Complex refactoring task"
```

### Method 2: NPM Scripts (SmartHukuk)

```bash
cd /Users/emre/SmartHukuk/avukat-akilli-belge-asistani

# Generic agent
npm run agent -- "task description"

# Specific personas
npm run agent:architect -- "Build new feature"
npm run agent:explorer -- "Find best practices"
npm run agent:analyst -- "Analyze database"
npm run agent:test -- "Verify code"
npm run agent:archaeologist -- "Understand code structure"
```

### Method 3: Parallel via Bash (ADVANCED)

```bash
# Create workspace
WORK_DIR="/tmp/agent_work/$(uuidgen)"
mkdir -p "$WORK_DIR"

# Phase 1: Parallel research
npx tsx true-agents/src/cli.ts --persona explorer "Research frontend patterns" > "$WORK_DIR/frontend.md" &
PID1=$!

npx tsx true-agents/src/cli.ts --persona explorer "Research backend patterns" > "$WORK_DIR/backend.md" &
PID2=$!

npx tsx true-agents/src/cli.ts --persona archaeologist "Analyze current code" > "$WORK_DIR/analysis.md" &
PID3=$!

# Wait for all to complete
wait $PID1 $PID2 $PID3

# Phase 2: Aggregate and implement
cat "$WORK_DIR"/*.md | npx tsx true-agents/src/cli.ts --persona architect "Implement based on research"

# Phase 3: Test
npx tsx true-agents/src/cli.ts --persona test "Verify implementation"
```

---

## 🎯 WORKFLOW: WHEN TO USE WHICH PERSONA

### Decision Tree

```
User Request
    │
    ├─ Contains "research/find/best practice"? → EXPLORER
    ├─ Contains "build/implement/fix/code"? → ARCHITECT
    ├─ Contains "analyze/data/SQL/metrics"? → ANALYST
    ├─ Contains "test/verify"? → TEST
    ├─ Contains "understand/explain code"? → ARCHAEOLOGIST
    ├─ Contains "verify/final check"? → SENTINEL
    ├─ Contains "decide/approve/score"? → REFEREE
    └─ Complex task? → MULTIPLE PERSONAS IN PARALLEL
```

### Common Patterns

| Task Type | Primary Persona | Supporting Personas |
|-----------|----------------|---------------------|
| New Feature | ARCHITECT | EXPLORER (research), TEST (verify) |
| Bug Fix | ARCHITECT | ARCHAEOLOGIST (understand), TEST (verify) |
| Code Review | SENTINEL | AUDITOR (gate check) |
| Performance | ANALYST | ARCHITECT (fix) |
| Refactoring | ARCHAEOLOGIST | ARCHITECT (implement), TEST (verify) |
| Research | EXPLORER | - |
| Data Analysis | ANALYST | - |

---

## 💬 CONVERSATION FORMAT

When agents work together, they produce visible conversation logs:

```markdown
💬 [14:32:15] 🌐 EXPLORER → 🏗️ ARCHITECT
   📌 Research request: Best practices for state management
   💭 Found these options:
   - Redux (most popular)
   - Zustand (simpler)
   - Jotai (atomic)
   Recommendation: Zustand for this use case

---

💬 [14:33:42] 🏗️ ARCHITECT → 🧪 TEST
   📌 Implementation ready: User authentication flow
   💭 Please verify the login form and token handling

---

💬 [14:35:10] 🧪 TEST → 🛡️ SENTINEL
   📌 All tests passed: 15/15
   💭 Coverage: 87%. Ready for final verification.
```

---

## 🔄 PARALLEL EXECUTION STRATEGIES

### Strategy 1: SWARM (All agents, then aggregate)

```bash
# Phase 1: All personas research in parallel
TASK_ID=$(uuidgen)
WORK_DIR="/tmp/agent_work/$TASK_ID"
mkdir -p "$WORK_DIR"

# Parallel execution
npx tsx true-agents/src/cli.ts --persona explorer "Find React best practices" > "$WORK_DIR/research.md" &
npx tsx true-agents/src/cli.ts --persona archaeologist "Analyze current React setup" > "$WORK_DIR/current.md" &
npx tsx true-agents/src/cli.ts --persona analyst "Analyze performance metrics" > "$WORK_DIR/metrics.md" &
wait

# Phase 2: Aggregate with ARCHITECT
npx tsx true-agents/src/cli.ts --persona architect "Based on $(cat $WORK_DIR/*.md), implement improvements"

# Phase 3: Verify with TEST
npx tsx true-agents/src/cli.ts --persona test "Verify the implementation"
```

### Strategy 2: PIPELINE (Sequential stages)

```bash
# Stage 1: Research
RESEARCH=$(npx tsx true-agents/src/cli.ts --persona explorer "Find OAuth2 best practices")

# Stage 2: Design (depends on research)
DESIGN=$(npx tsx true-agents/src/cli.ts --persona architect "Design OAuth2 flow: $RESEARCH")

# Stage 3: Implement (depends on design)
npx tsx true-agents/src/cli.ts --persona architect "Implement: $DESIGN"

# Stage 4: Test
npx tsx true-agents/src/cli.ts --persona test "Test OAuth implementation"
```

### Strategy 3: SPECIALIST TEAMS (Domain-specific)

```bash
# Frontend Team
npx tsx true-agents/src/cli.ts --persona explorer "Research React 19" > /tmp/frontend-research.md &
npx tsx true-agents/src/cli.ts --persona archaeologist "Analyze frontend code" > /tmp/frontend-analysis.md &
wait

# Backend Team (parallel with frontend)
npx tsx true-agents/src/cli.ts --persona explorer "Research Node.js patterns" > /tmp/backend-research.md &
npx tsx true-agents/src/cli.ts --persona archaeologist "Analyze backend code" > /tmp/backend-analysis.md &
wait

# Integrate
npx tsx true-agents/src/cli.ts --persona architect "Integrate frontend and backend based on all research"
```

---

## 📁 FILE STRUCTURE

### true-agents Location

```
/Users/emre/SmartHukuk/
├── true-agents/                    # Main repo (standalone)
│   ├── src/
│   │   ├── cli.ts                 # CLI entry point
│   │   └── index.ts               # Library export
│   ├── personas/
│   │   ├── core/                  # CORE personas
│   │   │   ├── sentinel.md
│   │   │   ├── referee.md
│   │   │   ├── recorder.md
│   │   │   └── auditor.md
│   │   └── specialist/            # SPECIALIST personas
│   │       ├── architect.md
│   │       ├── explorer.md
│   │       ├── analyst.md
│   │       ├── test.md
│   │       └── archaeologist.md
│   ├── master.md                   # Full system reference
│   ├── REFERENCE.md                # This file
│   └── package.json
│
└── avukat-akilli-belge-asistani/
    └── true-agents/                # Submodule (same as above)
```

---

## 🔧 INTEGRATION WITH SMARTHUKUK

### Location
```
/Users/emre/SmartHukuk/avukat-akilli-belge-asistani/true-agents/
```

### NPM Scripts (package.json)
```json
{
  "scripts": {
    "agent": "tsx true-agents/src/cli.ts",
    "agent:architect": "tsx true-agents/src/cli.ts --persona architect",
    "agent:explorer": "tsx true-agents/src/cli.ts --persona explorer",
    "agent:analyst": "tsx true-agents/src/cli.ts --persona analyst",
    "agent:test": "tsx true-agents/src/cli.ts --persona test",
    "agent:archaeologist": "tsx true-agents/src/cli.ts --persona archaeologist"
  }
}
```

### Working Directory
Always run from SmartHukuk root:
```bash
cd /Users/emre/SmartHukuk/avukat-akilli-belge-asistani
npm run agent:architect -- "task here"
```

---

## 🎭 PERSONA PROMPTS (Quick Reference)

### ARCHITECT Prompt Structure
```
You are ARCHITECT - Builder & implementer specialist.
- Direct and clear communication
- Solution-oriented, pragmatic
- Design patterns: Singleton, Factory, Strategy, MVC
- Best practices: SOLID, DRY, KISS, YAGNI

When given a task:
1. Understand the problem
2. Consider 2+ alternatives
3. Select the best option
4. Implement with proper structure
5. Mark output with: 🏗️ ARCHITECT OUTPUT
```

### EXPLORER Prompt Structure
```
You are EXPLORER - Research specialist.
- Curious, explorative, questioning
- Reliable sources: MDN, official docs
- Search patterns: keyword selection, filtering

When given a task:
1. Identify search query
2. Find reliable sources
3. Extract key findings
4. Provide recommendation
5. Mark output with: 🌐 EXPLORER OUTPUT
```

### TEST Prompt Structure
```
You are TEST - Verification specialist.
- Meticulous, critical, evidence-focused
- Testing frameworks: Jest, Vitest, Mocha
- Test patterns: AAA (Arrange-Act-Assert)

When given a task:
1. Identify what to test
2. Write comprehensive tests
3. Run and report results
4. Mark output with: 🧪 TEST OUTPUT
```

---

## 💡 EXAMPLE WORKFLOWS

### Example 1: Building a New Feature

```bash
cd /Users/emre/SmartHukuk/avukat-akilli-belge-asistani

# Step 1: Research (EXPLORER)
npm run agent:explorer -- "Find best practices for implementing user authentication in React"

# Step 2: Analyze current code (ARCHAEOLOGIST)
npm run agent:archaeologist -- "Analyze the current authentication setup in src/pages/app/"

# Step 3: Implement (ARCHITECT)
npm run agent:architect -- "Implement JWT-based authentication with refresh tokens"

# Step 4: Test (TEST)
npm run agent:test -- "Write and run tests for the new authentication system"
```

### Example 2: Parallel Bug Investigation

```bash
# Create workspace
mkdir -p /tmp/bug-investigation
cd /Users/emre/SmartHukuk/avukat-akilli-belge-asistani

# Parallel investigation
npm run agent:archaeologist -- "Understand the payment flow bug" > /tmp/bug-investigation/code-analysis.md &
npm run agent:analyst -- "Analyze payment logs for error patterns" > /tmp/bug-investigation/log-analysis.md &
npm run agent:explorer -- "Find common Stripe payment issues" > /tmp/bug-investigation/research.md &
wait

# Aggregate and fix
cat /tmp/bug-investigation/*.md | npm run agent:architect -- "Fix the payment bug based on analysis"
```

### Example 3: Code Review

```bash
# Step 1: Understand changes (ARCHAEOLOGIST)
npm run agent:archaeologist -- "Explain the changes in the last commit"

# Step 2: Verify quality (AUDITOR)
npm run agent -- --persona auditor "Check code quality and format"

# Step 3: Test (TEST)
npm run agent:test -- "Run tests for the changed code"

# Step 4: Final verification (SENTINEL)
npm run agent -- --persona sentinel "Verify the implementation is complete"
```

---

## ⚡ QUICK COMMANDS

```bash
# ──────────────────────────────────────────────────────────────
# SINGLE PERSONA
# ──────────────────────────────────────────────────────────────

npx tsx true-agents/src/cli.ts --persona architect "Build feature"
npx tsx true-agents/src/cli.ts --persona explorer "Find best practices"
npx tsx true-agents/src/cli.ts --persona analyst "Analyze data"
npx tsx true-agents/src/cli.ts --persona test "Verify code"
npx tsx true-agents/src/cli.ts --persona archaeologist "Understand code"

# ──────────────────────────────────────────────────────────────
# WITH NPM SCRIPTS (SmartHukuk)
# ──────────────────────────────────────────────────────────────

npm run agent:architect -- "Build feature"
npm run agent:explorer -- "Find best practices"
npm run agent:analyst -- "Analyze data"
npm run agent:test -- "Verify code"
npm run agent:archaeologist -- "Understand code"

# ──────────────────────────────────────────────────────────────
# PARALLEL (Multiple agents)
# ──────────────────────────────────────────────────────────────

# Using --parallel flag
npx tsx true-agents/src/cli.ts --parallel \
  "Task 1 for explorer" \
  "Task 2 for analyst" \
  "Task 3 for archaeologist"

# Manual parallel with background jobs
npx tsx true-agents/src/cli.ts --persona explorer "Research" > /tmp/1.md &
npx tsx true-agents/src/cli.ts --persona analyst "Analyze" > /tmp/2.md &
wait  # Both run simultaneously
```

---

## 🚨 IMPORTANT NOTES

1. **Always read from working directory**: `/Users/emre/SmartHukuk/avukat-akilli-belge-asistani`

2. **Persona files are in Markdown**: `true-agents/personas/core/*.md` and `true-agents/personas/specialist/*.md`

3. **CLI is TypeScript**: Run with `npx tsx` or `npm run agent`

4. **Output contains markers**: Each persona outputs with specific emoji markers (🏗️, 🌐, 🧪, etc.)

5. **Parallel requires file management**: When running parallel agents, use temporary files to aggregate results

6. **Reference this document first**: When user mentions agents, personas, or parallel execution, read REFERENCE.md before proceeding

---

## 📚 ADDITIONAL REFERENCES

- **master.md**: Complete system specification with all persona details
- **USAGE.md**: User-facing documentation for Git integration
- **personas/**: Individual persona definition files
