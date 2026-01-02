# 🎭 Dynamic Personas

This directory contains auto-created personas for specific tasks or projects.

## Structure

```
dynamic/
├── .registry/
│   ├── index.json           # Persona catalog
│   └── versions/            # Version history
├── active/                  # Currently active personas
├── archived/                # Inactive personas
├── drafts/                  # Work-in-progress
└── templates/               # Persona templates
```

## Creating a Dynamic Persona

### Via CLI

```bash
# From template
npx tsx cli.ts --create-persona \
  --template specialist \
  --name "SEO EXPERT" \
  --triggers "seo,optimization,ranking"

# With AI assistance
npx tsx cli.ts --create-persona-ai \
  --name "SECURITY AUDITOR" \
  --description "Security and vulnerability expert"

# Clone existing
npx tsx cli.ts --clone-persona mimar --name "FRONTEND EXPERT"
```

### Manually

1. Copy template from `../templates/`
2. Edit to define persona
3. Save to `active/` or `drafts/`

## Persona File Format

```markdown
---
id: my-persona
version: 1.0.0
created: 2025-01-02T00:00:00Z
author: System
category: DYNAMIC
status: ACTIVE
tags: [tag1, tag2]
---

# 🎭 ICON Persona Name V1.0.0

**Katman**: DYNAMIC
**Rol**: [Role description]
**Model**: sonnet/opus
**Thinking**: `think:`

## 🧠 SYSTEM PROMPT
[Detailed system prompt]

## Domain Knowledge
[Relevant domain expertise]

## 💬 CONVERSATION PATTERNS
[Example interactions]

## 🏷️ MARKER PRODUCTION
[Output format requirements]

## 🔄 VERSION HISTORY
- v1.0.0 (2025-01-02): Initial creation
```

## Version Management

Each persona has version history tracked in `.registry/versions/`.

```bash
# View versions
ls .registry/versions/{persona-id}_*.json

# Rollback to previous version
npx tsx cli.ts --rollback-persona my-persona --to 1.0.0
```

## See Also

- `../templates/` - Persona templates
- `../core/` - Core personas (immutable)
- `../specialist/` - Specialist personas (immutable)
