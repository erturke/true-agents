# personas/ - Persona Definitions (V7)

## 📁 Overview

All persona definitions for the TRUE Multi-Agent System. Each persona has detailed system prompts, domain knowledge, and conversation patterns.

## 📂 Directory Structure

```
personas/
├── core/            # 4 CORE personas (always active)
│   ├── sentinel.md   # 🛡️ Completion verification
│   ├── hakem.md      # 🎯 Final decision (1-10 scoring)
│   ├── kayitci.md    # 📋 State & checkpoint
│   └── denetci.md    # 🔍 Quality gate
│
├── specialist/      # 5 SPECIALIST personas (on-demand)
│   ├── mimar.md      # 🏗️ Builder & implementer
│   ├── kasif.md      # 🌐 Researcher
│   ├── analizci.md   # 🔬 Data analyst
│   ├── test.md       # 🧪 Verifier
│   └── arkeolog.md   # 🏛️ Code analyst
│
└── templates/       # Dynamic persona templates
    ├── dynamic.md    # Template for custom personas
    └── dynamic-persona.md  # Alternative template
```

## 🎯 Persona Quick Reference

| Persona | Category | Trigger | Model | Thinking |
|---------|----------|---------|-------|----------|
| SENTINEL | CORE | verify, check | Opus | ultrathink: |
| HAKEM | CORE | decide, judge | Opus | think hard: |
| KAYITCI | CORE | checkpoint, state | Sonnet | think: |
| DENETÇİ | CORE | gate, validate | Sonnet | think: |
| MİMAR | SPECIALIST | build, implement | Sonnet | think: |
| KAŞIF | SPECIALIST | research, find | Sonnet | think: |
| ANALİZCİ | SPECIALIST | analyze, data | Sonnet | think: |
| TEST | SPECIALIST | test, verify | Sonnet | think: |
| ARKEOLOG | SPECIALIST | understand, structure | Sonnet | think: |

## 📖 Persona File Structure

Each `.md` file contains:

```markdown
---
description: [Brief description]
---

# 🎯 ICON Persona V7

**Katman**: CORE/SPECIALIST
**Tetikleyici**: [trigger words]
**Model**: sonnet/opus
**Thinking**: [thinking level]

## 🧠 SYSTEM PROMPT
[Persona description and role]

## Domain Knowledge
[Relevant domain expertise]

## 💬 CONVERSATION PATTERNS
[Example interactions]

## 🔍 FRAMEWORK
[Analysis/Testing framework]

## 🏷️ MARKER PRODUCTION
[Output format requirements]
```

## 💡 Using Personas

```bash
# Via CLI (auto-detects persona)
npx tsx cli.ts "Implement user auth"  # Uses MİMAR

# Explicit persona selection
npx tsx cli.ts --persona sentinel "Verify implementation"
```

## 📚 See Also

- `../master.md` - Complete system reference with all personas
- Each subdirectory's README for details
