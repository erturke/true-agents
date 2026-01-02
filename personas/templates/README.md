# personas/templates/ - Dynamic Persona Templates

## 📁 Overview

Templates for creating custom personas at runtime. Used by `PersonaFactory` and `PersonaBuilder`.

## 📂 Files

| File | Purpose |
|------|---------|
| `dynamic.md` | Template for dynamic persona creation |
| `dynamic-persona.md` | Alternative template format |

## 🎯 Template Structure

```markdown
---
description: [Persona description]
---

# 🎯 ICON Persona V[version]

**Katman**: DYNAMIC
**Tetikleyici**: [trigger words]
**Model**: sonnet/opus
**Thinking**: [thinking level]

## 🧠 SYSTEM PROMPT
[Your custom system prompt here]

## Domain Knowledge
[Relevant domain expertise]

## 💬 CONVERSATION PATTERNS
[Example interactions]

## 🔍 FRAMEWORK
[Task-specific framework]

## 🏷️ MARKER PRODUCTION
[Output format requirements]
```

## 💡 Creating Custom Personas

### Using PersonaBuilder

```typescript
import { PersonaBuilder } from '../../src/factory/16-persona-factory.js';

const customPersona = new PersonaBuilder()
  .withId('seo-expert')
  .withName('SEO UZMANI')
  .withCategory(PersonaCategory.SPECIALIST)
  .withIcon('🔍')
  .withTrigger(['seo', 'optimization', 'ranking'])
  .withPersonality({
    communication: 'analytical',
    tone: 'technical',
    verbosity: 'detailed',
    collaboration: 'collaborative'
  })
  .withSystemPrompt('Sen SEO uzmanısın....')
  .build();
```

### Using Template File

1. Copy `dynamic.md` to your persona file
2. Fill in the template sections
3. Register with `PersonaFactory`

## 📚 See Also

- `../../src/factory/` - Persona creation code
- `../../master.md` - System reference
