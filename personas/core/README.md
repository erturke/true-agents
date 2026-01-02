# personas/core/ - CORE Personas (Always Active)

## 📁 Overview

CORE personas are always active in every TRUE agent session. They provide verification, decision-making, state management, and quality control.

## 📂 Personas

| File | Icon | Role | Key Function |
|------|------|------|--------------|
| `sentinel.md` | 🛡️ | SENTINEL | Independent completion verification - skeptical validator |
| `hakem.md` | 🎯 | HAKEM | Final decision maker - scores 1-10, approves/rejects |
| `kayitci.md` | 📋 | KAYITCI | State manager - checkpoints, goals, markers |
| `denetci.md` | 🔍 | DENETÇİ | Quality gate - runs REALITY_GATES |

## 🔄 CORE Workflow

```
           START
             │
             ▼
    ┌─────────────────┐
    │   KAYITCI       │  ← Inject goal, create checkpoint
    │  (State Init)   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  SPECIALIST     │  ← MİMAR, KAŞIF, etc. do work
    │   (Execute)     │
             │
             ▼
    ┌─────────────────┐
    │   DENETÇİ       │  ← Run REALITY_GATES
    │  (Quality Gate) │
             │
             ▼
    ┌─────────────────┐
    │   SENTINEL      │  ← Verify completion
    │  (Verify)       │
             │
             ▼
    ┌─────────────────┐
    │    HAKEM        │  ← Score 1-10, final decision
    │   (Decide)      │
             │
             ▼
    ┌─────────────────┐
    │   KAYITCI       │  ← Save result, update markers
    │  (Checkpoint)   │
    └─────────────────┘
```

## 🎯 Key Concepts

### SENTINEL - Verification
- Default: INCOMPLETE (skeptical)
- Requires: Evidence for all claims
- Blocks: Completion without proof

### HAKEM - Decision
- Scores: 1-10 scale
- Criteria: Doğruluk, Tamlık, Kalite, Kanıt, Efficiency
- Decision: ONAY, KABUL, TEKRAR, REDDET

### KAYITCI - State
- Tracks: All MARKERs produced
- Injects: GOAL_PERSISTENCE at checkpoints
- Manages: Conversation state

### DENETÇİ - Quality
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

- `../../master.md` - Complete system reference
- `../specialist/` - On-demand personas
