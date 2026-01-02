# 📦 Persona Fragments

Reusable fragments for persona creation.

## Available Fragments

| Fragment | Purpose |
|----------|---------|
| `marker-format.md` | Standard MARKER output format |
| `conversation-style.md` | Conversation pattern templates |
| `reasoning-engine.md` | Thinking level guidelines |
| `handoff-format.md` | Handoff protocol format |

## Using Fragments

```markdown
<!-- In your persona definition -->

## 🏷️ MARKER PRODUCTION

{{include: fragments/marker-format.md}}

## 💬 CONVERSATION PATTERNS

{{include: fragments/conversation-style.md}}
```

## Creating New Fragments

1. Create `.md` file in this directory
2. Use `{{include: fragments/your-fragment.md}}` in personas
3. Fragment will be inlined during persona compilation
