# personas/templates/ - Persona Templates

## 📁 Overview

This directory contains templates and examples for creating new personas.

## 📂 Files

- **`dynamic-persona.md`**: Template for creating a fully defined static persona.
- **`dynamic.md`**: Guide for the Orchestrator to spawn temporary, dynamic personas on-the-fly.

## 💡 How to Create a New Persona

1. Copy `dynamic-persona.md`.
2. Renamed it to `[your-persona].md`.
3. Fill in the details:
   - **Name**: Unique identifier (e.g., `DESIGNER`).
   - **Layer**: `CORE` (always on) or `SPECIALIST` (on-demand).
   - **Trigger**: Keywords that activate this persona.
   - **System Prompt**: Instructions, philosophy, and domain knowledge.
   - **Communication Style**: How the persona talks.

## 💻 Programmatic Usage

```typescript
import { PersonaBuilder } from '../core/PersonaBuilder';

const seoExpert = new PersonaBuilder()
  .withName('SEO')
  .withRole('Search Engine Optimization Specialist')
  .withSystemPrompt('You are an SEO expert...')
  .withTriggers(['seo', 'ranking', 'google'])
  .build();
```
