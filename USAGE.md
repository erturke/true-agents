# @true-agents/core - Usage Guide (Git Integration)

This guide demonstrates how to use `true-agents` in your projects via **Git**.

## 📦 Installation (Git)

### Method 1: Add as Submodule (Recommended)

Add `true-agents` as a git submodule to your project:

```bash
cd your-project

# Add as submodule
git submodule add https://github.com/erturke/true-agents.git libs/true-agents

# Initialize submodule
git submodule update --init --recursive

# Install dependencies
cd libs/true-agents
npm install
cd ../..
```

### Method 2: Direct Clone

Clone directly into the `libs/` directory of your project:

```bash
cd your-project
mkdir -p libs
cd libs

# Clone true-agents
git clone https://github.com/erturke/true-agents.git

# Install dependencies
cd true-agents
npm install
```

### Method 3: Global Usage

To use system-wide:

```bash
# Clone to user directory
cd ~
git clone https://github.com/erturke/true-agents.git
cd true-agents
npm install

# Add to Path (bash/zsh)
echo 'export PATH="$HOME/true-agents:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🚀 Usage

### CLI Tool (Simplest)

```bash
# Run from true-agents folder
cd libs/true-agents
npx tsx src/cli.ts "Implement user authentication"

# Or if installed globally
true-agents "Implement user authentication"
```

### Auto A2A Mode (Whistling Giraffe)

The system automatically detects complex tasks and documents:

```bash
# Auto-detects need for multi-agent workflow
npx tsx src/cli.ts "Research best DB practices and implement schema"

# Loads referenced document as context
npx tsx src/cli.ts "Update auth logic based on @api_specs.md"
```

### Persona Specific Usage

```bash
cd libs/true-agents

# ARCHITECT for coding
npx tsx src/cli.ts --persona architect "Fix the bug in payment module"

# EXPLORER for research
npx tsx src/cli.ts --persona explorer "Find React 19 best practices"

# Parallel Execution
npx tsx src/cli.ts --parallel "Fix backend" "Update frontend" "Run tests"
```

---

## 💻 IDE Integration (VS Code, Cursor, Antigravity)

Using True Agents in your IDE is extremely simple. You do **not** need complex configurations.

**Prerequisite:** Ensure you have the `claude` CLI installed and authenticated.

### The "Terminal Flow" (Recommended)

Since True Agents V11 (Whistling Giraffe) is fully autonomous, you just need your IDE's terminal.

1.  **Open Terminal** (`Ctrl+` or `Cmd+J`)
2.  **Type your request** with file references:

```bash
# Example: Refactoring a specific file
npx tsx src/cli.ts "Refactor @user_controller.ts to use async/await"
```

**Why this is better:**
*   **Auto Context**: The `@user_controller.ts` reference automatically loads the file content.
*   **Auto Routing**: The system decides if it needs an Architect or Explorer.
*   **No Setup**: Works instantly in VS Code, Cursor, or any editor with a terminal.

### Using with Claude Code

If you use the `claude` CLI directly, you can simply call True Agents as a tool or sub-process:

```bash
# Inside Claude Code session
/run npx tsx src/cli.ts "Analyze @schema.prisma"
```

---

## 📚 Persona Reference

### CORE Personas (Always Active)

| Persona | Usage |
|---------|-------|
| `sentinel` | Result verification, completion check |
| `referee` | Decision making, scoring, approval |
| `recorder` | State tracking, checkpoints |
| `auditor` | Quality control, reality check |

### SPECIALIST Personas (On-Demand)

| Persona | Trigger | Usage |
|---------|---------|-------|
| `architect` | build, implement, code | Coding, implementation |
| `explorer` | research, find, search | Research, best practices |
| `analyst` | analyze, data, metrics | Data analysis, metrics |
| `test` | test, verify | Test writing, verification |
| `archaeologist` | understand, structure | Code analysis, legacy understanding |

---

## 🔄 Updates

To update if using submodule:

```bash
# Update submodule
git submodule update --remote libs/true-agents

# Or go to folder and pull
cd libs/true-agents
git pull origin main
```

---

## 💡 Tips

1.  **Auto Persona Detection**: The system selects the right persona based on your task description.
2.  **Parallel Execution**: Use parallel mode for independent tasks.
3.  **Thinking Levels**: Adjust thinking level based on complexity:
    *   `none` - Simple tasks
    *   `think` - Medium complexity
    *   `think-hard` - Complex tasks
    *   `ultrathink` - Critical tasks
