# Personas

## 📁 Overview

This directory contains the definitions for all **True Agents** personas.

## 📂 Structure

- **`core/`**: Mandatory personas that are always active (Verification, Decision, State).
- **`specialist/`**: On-demand personas for specific tasks (Coding, Research, Analysis).
- **`templates/`**: Templates for creating new personas.

## 🎭 Persona List

### Core Personas (Always Active)

| Name | Layer | Role | Model | Thinking |
|------|-------|------|-------|----------|
| **REFEREE** | CORE | Decide, Judge, Score | Opus | `ultrathink:` |
| **SENTINEL** | CORE | Verify, Gate, Check | Opus | `ultrathink:` |
| **RECORDER** | CORE | State, Memory, Goal | Sonnet | `think:` |
| **AUDITOR** | CORE | Quality, Standards | Sonnet | `think:` |

### Specialist Personas (On-Demand)

| Name | Layer | Role | Model | Thinking |
|------|-------|------|-------|----------|
| **ARCHITECT** | SPECIALIST | Build, Design, Fix | Sonnet | `think hard:` |
| **EXPLORER** | SPECIALIST | Research, Find | Sonnet | `think:` |
| **ANALYST** | SPECIALIST | Data, Metrics | Sonnet | `think:` |
| **TEST** | SPECIALIST | Verify, Validate | Sonnet | `think:` |
| **ARCHAEOLOGIST** | SPECIALIST | Understand, Structure | Sonnet | `think:` |

## 🔄 Selection Logic

The **Orchestrator** selects the appropriate persona based on the user's intent:

1. **New Request** → `RECORDER` initializes state.
2. **Implementation** → `ARCHITECT` builds.
3. **Research Needed** → `EXPLORER` finds info.
4. **Verification** → `SENTINEL` checks completion.
5. **Final Decision** → `REFEREE` approves.

## 📚 Usage

To run a specific persona manually:

```bash
npx tsx cli.ts --persona architect "Create a login page"
npx tsx cli.ts --persona explorer "Find React best practices"
```
