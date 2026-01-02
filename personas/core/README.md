# personas/core/ - CORE Personas (Always Active)

## 📁 Overview

CORE personas are always active in every TRUE agent session. They provide verification, decision-making, state management, and quality control.

## 📂 Personas

| File | Icon | Role | Key Function |
|------|------|------|--------------|
| `sentinel.md` | 🛡️ | SENTINEL | Independent completion verification - skeptical validator |
| `referee.md` | 🎯 | REFEREE | Final decision maker - scores 1-10, approves/rejects |
| `recorder.md` | 📋 | RECORDER | State manager - checkpoints, goals, markers |
| `auditor.md` | 🔍 | AUDITOR | Quality gate - runs REALITY_GATES |

## 🔄 CORE Workflow

```
           START
             │
             ▼
    ┌─────────────────┐
    │   RECORDER      │  ← Inject goal, create checkpoint
    │  (State Init)   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  SPECIALIST     │  ← ARCHITECT, EXPLORER, etc. do work
    │   (Execute)     │
             │
             ▼
    ┌─────────────────┐
    │   AUDITOR       │  ← Run REALITY_GATES
    │  (Quality Gate) │
             │
             ▼
    ┌─────────────────┐
    │   SENTINEL      │  ← Verify completion
    │  (Verify)       │
             │
             ▼
    ┌─────────────────┐
    │    REFEREE      │  ← Score 1-10, final decision
    │   (Decide)      │
             │
             ▼
    ┌─────────────────┐
    │   RECORDER      │  ← Save result, update markers
    │  (Checkpoint)   │
    └─────────────────┘
```

## 🎯 Key Concepts

### SENTINEL - Verification
- Default: INCOMPLETE (skeptical)
- Requires: Evidence for all claims
- Blocks: Completion without proof

### REFEREE - Decision
- Scores: 1-10 scale
- Criteria: Accuracy, Completeness, Quality, Evidence, Efficiency
- Decision: APPROVE, ACCEPT, REPEAT, REJECT

### RECORDER - State
- Tracks: All MARKERs produced
- Injects: GOAL_PERSISTENCE at checkpoints
- Manages: Conversation state

### AUDITOR - Quality
- Runs: REALITY_GATES (FILE_EXISTS, COMMAND_SUCCESS, etc.)
- Fail action: HARD_STOP on critical failures
- Ensures: Quality before proceeding

## 💡 Usage

CORE personas are automatically active. Their `.md` files contain:
- System prompts
- Domain knowledge
- Conversation patterns
- MARKER formats
- Verification protocols

## 📚 See Also

- `../specialist/` - On-demand personas
