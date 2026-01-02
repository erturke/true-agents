# @true-agents/core 🦒

> **Welcome to True Agents V11 (Whistling Giraffe)**
> The only Multi-Agent System you'll ever need. Fully autonomous, intelligent, and relentlessly effective.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🦒 "Whistling Giraffe" Auto A2A System
True Agents V11 introduces **Auto A2A (Agent-to-Agent)** mode. You no longer need to manually coordinate agents. The system is smart enough to listen to your request, understand its complexity, read your referenced documents, and deploy the perfect team of AI experts to get the job done.

**Just type:** `"Research the best DB for my app and implement the schema"`
**True Agents will:**
1.  **Detect** complexity (Requires Research + Implementation).
2.  **Deploy** `EXPLORER` to research database options.
3.  **Handoff** findings to `ARCHITECT`.
4.  **Implement** the schema code.
5.  **Verify** with `SENTINEL`.

---

## 🧠 prompt-driven (The "Meta-Agent" Workflow)
The most powerful way to use True Agents V11 is to let your AI assistant (Claude, Cursor, Antigravity) drive the system for you.

**How to do it:**
1.  Open your IDE (VS Code / Cursor).
2.  Add `@AI_AGENT_PROTOCOL.md` to your prompt context.
3.  Ask for what you want.

**Example Prompt:**
> "Read @AI_AGENT_PROTOCOL.md. I want to add a dark mode toggle to the settings page. Execute the necessary agents."

**What happens:**
1.  Your AI reads `AI_AGENT_PROTOCOL.md` and realizes it has permission to run the CLI.
2.  It constructs the command: `npx tsx src/cli.ts "Add dark mode toggle to settings page"`.
3.  It runs the command in your terminal.
4.  The True Agents swarm executes the task.

---

## ⚡ Manual Quick Start

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/erturke/true-agents.git true-agents
cd true-agents

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Run Your First Agent
You don't need to specify flags. Just say what you want.

```bash
# Simple Task (Routes to Single Agent)
npx tsx src/cli.ts "Write a Hello World function in Python"

# Complex Task (Routes to Auto A2A)
npx tsx src/cli.ts "Research the best way to center a div and implement 3 examples"

# Context-Aware Task (Loads Documents)
npx tsx src/cli.ts "Refactor the login logic based on @auth_specs.md"
```

---

## 🤖 The Persona Team
You have a full team of 9 specialists at your disposal. They work for you 24/7.

### 🛡️ CORE (Quality Assurance)
*   **SENTINEL**: The final boss. Verifies everything before completion.
*   **REFEREE**: The judge. Makes difficult decisions and scores outputs (1-10).
*   **RECORDER**: The memory. Manages checkpoints and state.
*   **AUDITOR**: The inspector. Validates quality gates and sanity checks.

### 🏗️ SPECIALIST (The Doers)
*   **ARCHITECT**: The builder. Writes code, designs systems, fixes bugs. (*Your "Senior Dev"*).
*   **EXPLORER**: The researcher. Googles, finds docs, learns new tech. (*Your "Researcher"*).
*   **ANALYST**: The data scientist. Crunches numbers, SQL, logs. (*Your "Data Scientist"*).
*   **TEST**: The QA engineer. Writes and runs tests. (*Your "QA"*).
*   **ARCHAEOLOGIST**: The reader. Reads legacy code and explains it. (*Your "Legacy Expert"*).

---

## 🚀 Advanced Usage

### Manual Overrides
Sometimes you want specific control.

```bash
# Force specific persona
npx tsx src/cli.ts --persona architect "Fix this bug"

# Force Auto A2A mode
npx tsx src/cli.ts --a2a "Do this complex thing"

# Run in Parallel (Swarm Mode)
npx tsx src/cli.ts --parallel "Task A" "Task B" "Task C"
```

### Document Loading
You can give agents context by referencing files.

*   `@filename`: "Read @package.json and tell me the version"
*   `use filename`: "Use README.md to explain the project"
*   `based on filename`: "Refactor based on styleguide.md"

---

## 📚 Documentation
*   **[REFERENCE.md](./REFERENCE.md)**: The Single Source of Truth. Deep dive into every feature.
*   **[MASTER_GUIDE.md](./MASTER_GUIDE.md)**: Detailed architectural guide.
*   **[USAGE.md](./USAGE.md)**: Git integration and project usage.

---

## 📂 Project Structure
```
true-agents/
├── src/
│   ├── cli.ts            # The brain (Entry point)
│   ├── a2a/              # Auto A2A Engine
│   └── personas/         # Persona Definitions
├── master.md             # System Spec
└── REFERENCE.md          # User Manual
```

---

**Ready to build?**
`npx tsx src/cli.ts "Let's build something amazing"`
