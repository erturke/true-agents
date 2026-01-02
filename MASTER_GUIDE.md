# TRUE Multi-Agent System - Master Guide
## Hybrid Architecture: TRUE Agents + Antigravity Integration

**Version:** 1.0
**Date:** 2025-01-01
**Author:** Claude Opus 4.5 + Emre
**Status:** Production Ready

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Architecture Comparison](#architecture-comparison)
3. [TRUE Agents Usage](#true-agents-usage)
4. [Antigravity Integration](#antigravity-integration)
5. [Hybrid Architecture](#hybrid-architecture)
6. [SmartHukuk Implementation](#smarthukuk-implementation)
7. [Best Practices](#best-practices)
8. [Quick Start Guide](#quick-start-guide)

---

## 1. SYSTEM OVERVIEW

### What We Have

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HYBRID MULTI-AGENT SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    LAYER 1: COORDINATION                            │   │
│   │         (Antigravity: Strategic Decision Making)                    │   │
│   │                                                                      │   │
│   │   User → Antigravity → High-Level Plan → TRUE Agents               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    LAYER 2: EXECUTION                               │   │
│   │            (TRUE Agents: Autonomous Workers)                       │   │
│   │                                                                      │   │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│   │   │ CRAWLER  │  │ ANALYZER │  │ ENRICHER │  │ VALIDATOR│           │   │
│   │   │  Agent   │  │  Agent   │  │  Agent   │  │  Agent   │           │   │
│   │   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │   │
│   │        │             │             │             │                  │   │
│   │        └─────────────┴─────────────┴─────────────┘                  │   │
│   │                        MessageBus                                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    LAYER 3: PERSISTENCE                             │   │
│   │              (PostgreSQL + Event Log)                               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Separation of Concerns** | Antigravity decides WHAT, TRUE Agents decide HOW |
| **Autonomy** | Agents operate independently with mutual triggering |
| **Event-Driven** | All communication through messages/events |
| **Scalability** | Horizontal scaling through agent spawning |
| **Observability** | Full audit trail of all agent interactions |

---

## 2. ARCHITECTURE COMPARISON

### System Comparison Matrix

| Feature | Antigravity | TRUE Agents | LangGraph | Claude Code |
|---------|-------------|-------------|-----------|-------------|
| **Communication** | Mailbox (file-based) | MessageBus (in-memory/DB) | Graph edges | Tool calls |
| **Execution** | Sequential | Parallel/Async | Cyclic graphs | Subagent parallel |
| **State** | File-based | Persistent (DB) | Graph state | Ephemeral |
| **LLM Backend** | Manual (you) | Configurable | Any LLM | Claude |
| **Best For** | Planning | Execution | Complex workflows | One-shot tasks |
| **Scalability** | Low | High | Medium | Low |
| **Latency** | High (manual) | Low | Medium | Low |

### When to Use Which System

```yaml
Use_Antigravity:
  when: "Complex planning, research, analysis needed"
  examples:
    - System architecture design
    - Research synthesis
    - Strategic planning
    - Code review and analysis

Use_TRUE_Agents:
  when: "Parallel execution, continuous operation needed"
  examples:
    - Multi-source crawling
    - Data processing pipelines
    - Monitoring and alerting
    - Autonomous workflows

Use_LangGraph:
  when: "Complex stateful workflows with cycles"
  examples:
    - Multi-step reasoning
    - Iterative refinement
    - Enterprise workflows

Use_Claude_Code:
  when: "One-shot parallel tasks"
  examples:
    - Code generation
    - Quick analysis
    - File operations
```

---

## 3. TRUE AGENTS USAGE

### Basic Agent Creation

```typescript
// 1. Import base classes
import { TrueAgent, AgentConfig, MessageType, AgentStatus } from './01-core-base.js';
import { InMemoryMessageBus } from './03-core-bus.js';

// 2. Define your agent
class MyAgent extends TrueAgent {
  private processedItems = 0;

  constructor(config: AgentConfig, messageBus?: any) {
    super(config, messageBus);
  }

  // 3. Initialize (called on start)
  protected async initialize(): Promise<void> {
    this.log('MyAgent initialized');
    this.setState('role', 'worker');
  }

  // 4. Cleanup (called on stop)
  protected async cleanup(): Promise<void> {
    this.log(`Processed ${this.processedItems} items`);
  }

  // 5. Handle TRIGGER messages (do work)
  protected async onTrigger(message: any): Promise<void> {
    const task = message.payload;
    this.log(`Processing: ${task.type}`);

    // Do the work
    const result = await this.doWork(task);

    // Send response back
    await this.respond(message, {
      success: true,
      result
    });

    this.processedItems++;
  }

  // 6. Handle QUERY messages (return state)
  protected async onQuery(message: any): Promise<void> {
    if (message.payload.type === 'STATUS') {
      await this.respond(message, {
        status: this.status,
        processed: this.processedItems
      });
    }
  }

  // 7. Handle EVENT messages (react to broadcasts)
  protected async onEvent(message: any): Promise<void> {
    if (message.payload.type === 'EMERGENCY_STOP') {
      await this.stop();
    }
  }

  // 8. Handle RESPONSE messages (if needed)
  protected async onResponse(message: any): Promise<void> {
    this.log(`Got response: ${JSON.stringify(message.payload)}`);
  }

  // Private methods
  private async doWork(task: any): Promise<any> {
    // Your work logic here
    return { data: 'result' };
  }
}

// 9. Use the agent
async function main() {
  const bus = new InMemoryMessageBus();

  const agent = new MyAgent(
    { id: 'my-agent-1', type: 'MyAgent' },
    bus
  );

  await agent.start();

  // Agent is now running and processing messages
}
```

### Message Types

```typescript
// TRIGGER: Do work and respond
await agent.send('target-agent', MessageType.TRIGGER, {
  type: 'PROCESS_DATA',
  data: { ... }
});

// QUERY: Request information
const response = await agent.send('target-agent', MessageType.QUERY, {
  type: 'STATUS'
}, { expectResponse: true, timeout: 5000 });

// EVENT: Broadcast to all
await agent.broadcast(MessageType.EVENT, {
  type: 'WORK_COMPLETE',
  data: { ... }
});
```

### Agent-to-Agent Triggering

```typescript
// Agent A triggers Agent B when done
class ProducerAgent extends TrueAgent {
  protected async onTrigger(message: any): Promise<void> {
    // Do work
    const results = await this.produce();

    // Trigger next agent
    await this.send('consumer-agent-1', MessageType.TRIGGER, {
      type: 'CONSUME',
      payload: results
    });
  }
}

// Agent B consumes and triggers another
class ConsumerAgent extends TrueAgent {
  protected async onTrigger(message: any): Promise<void> {
    // Consume data
    const processed = await this.consume(message.payload);

    // Trigger validator
    await this.send('validator-agent-1', MessageType.TRIGGER, {
      type: 'VALIDATE',
      payload: processed
    });
  }
}
```

### Event-Driven Reactivity

```typescript
class ReactiveAgent extends TrueAgent {
  protected async initialize(): Promise<void> {
    // Subscribe to system events
    this.on('system:pause', () => this.pause());
    this.on('system:resume', () => this.resume());
    this.on('crawler:complete', (data) => this.onCrawlComplete(data));
  }

  private async onCrawlComplete(data: any): Promise<void> {
    // React to crawl completion
    await this.send('analyzer-agent-1', MessageType.TRIGGER, {
      type: 'ANALYZE',
      payload: data.results
    });
  }
}
```

---

## 4. ANTIGRAVITY INTEGRATION

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ANTIGRAVITY INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User Request                                                              │
│       │                                                                      │
│       ▼                                                                      │
│   ┌──────────────┐        ┌──────────────────────────────────────┐         │
│   │ Antigravity  │ ────→  │  Plan: What agents to use             │         │
│   │  (LLM Brain) │        │  - Agent types needed                │         │
│   └──────────────┘        │  - Execution order/priority          │         │
│           │               │  - Configuration for each            │         │
│           │               └──────────────────────────────────────┘         │
│           │                              │                                 │
│           ▼                              ▼                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    BRIDGE LAYER                                     │  │
│   │                  AntigravityBridge.ts                               │  │
│   │                                                                      │  │
│   │   - Parse Antigravity plan                                          │  │
│   │   - Spawn/Configure TRUE agents                                     │  │
│   │   - Monitor execution                                                │  │
│   │   - Report results back to Antigravity                              │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│           │                                                                  │
│           ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    TRUE AGENTS SWARM                                │  │
│   │                                                                      │  │
│   │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │  │
│   │   │Crawler  │→│Analyzer │→│Enricher │→│Validator│                 │  │
│   │   │ Agent   │ │ Agent   │ │ Agent   │ │ Agent   │                 │  │
│   │   └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bridge Implementation

```typescript
// bridge/AntigravityBridge.ts

import { EventEmitter } from 'events';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface AntigravityPlan {
  agents: AgentConfig[];
  workflow: WorkflowStep[];
  timeout?: number;
}

interface WorkflowStep {
  from: string;
  to: string;
  trigger: string;
  payload: any;
}

export class AntigravityBridge extends EventEmitter {
  private inboxDir: string;
  private outboxDir: string;
  private agents: Map<string, TrueAgent> = new Map();

  constructor(inboxDir: string = '.antigravity/inbox', outboxDir: string = '.antigravity/outbox') {
    super();
    this.inboxDir = inboxDir;
    this.outboxDir = outboxDir;
  }

  /**
   * Wait for Antigravity plan in inbox
   */
  async waitForPlan(timeoutMs: number = 300000): Promise<AntigravityPlan | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const files = this.getInboxFiles();
      if (files.length > 0) {
        const planFile = files[0];
        const content = readFileSync(planFile, 'utf-8');
        const plan = JSON.parse(content) as AntigravityPlan;

        // Archive processed plan
        this.archiveFile(planFile, 'processed');

        return plan;
      }
      await this.sleep(1000);
    }

    return null;
  }

  /**
   * Execute Antigravity plan with TRUE agents
   */
  async executePlan(plan: AntigravityPlan, messageBus: MessageBus): Promise<any> {
    const results: any[] = [];

    try {
      // 1. Spawn agents
      for (const config of plan.agents) {
        const agent = this.spawnAgent(config, messageBus);
        this.agents.set(config.id, agent);
        await agent.start();
        this.log(`Started agent: ${config.id}`);
      }

      // 2. Execute workflow steps
      for (const step of plan.workflow) {
        const fromAgent = this.agents.get(step.from);
        if (!fromAgent) {
          throw new Error(`Agent not found: ${step.from}`);
        }

        const result = await fromAgent.send(step.to, MessageType.TRIGGER, step.payload, {
          expectResponse: true,
          timeout: plan.timeout || 60000
        });

        results.push({
          step: `${step.from}→${step.to}`,
          result
        });

        this.log(`Step complete: ${step.from}→${step.to}`);
      }

      // 3. Cleanup
      for (const [id, agent] of this.agents) {
        await agent.stop();
        this.log(`Stopped agent: ${id}`);
      }

      return {
        status: 'SUCCESS',
        results
      };

    } catch (error) {
      // Cleanup on error
      for (const [id, agent] of this.agents) {
        await agent.stop().catch(() => {});
      }

      return {
        status: 'FAILED',
        error: error.message,
        results
      };
    }
  }

  /**
   * Write results to outbox for Antigravity
   */
  reportResults(results: any, requestId: string): void {
    const outFile = join(this.outboxDir, `res_${requestId}.json`);
    writeFileSync(outFile, JSON.stringify(results, null, 2));
    this.log(`Results written to: ${outFile}`);
  }

  private spawnAgent(config: AgentConfig, messageBus: MessageBus): TrueAgent {
    // Factory pattern for agent creation
    switch (config.type) {
      case 'CRAWLER':
        return new CrawlerAgent(config, messageBus);
      case 'ANALYZER':
        return new AnalyzerAgent(config, messageBus);
      case 'ENRICHER':
        return new EnricherAgent(config, messageBus);
      case 'VALIDATOR':
        return new ValidatorAgent(config, messageBus);
      default:
        throw new Error(`Unknown agent type: ${config.type}`);
    }
  }

  private getInboxFiles(): string[] {
    // Get all .txt and .json files from inbox
    const fs = require('fs');
    const files: string[] = [];

    if (!existsSync(this.inboxDir)) return files;

    const entries = fs.readdirSync(this.inboxDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && (entry.name.endsWith('.txt') || entry.name.endsWith('.json'))) {
        files.push(join(this.inboxDir, entry.name));
      }
    }

    return files.sort();
  }

  private archiveFile(file: string, subfolder: string): void {
    const fs = require('fs');
    const archiveDir = join(this.inboxDir, '../archive', subfolder);
    if (!existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    const basename = file.split('/').pop()!;
    fs.renameSync(file, join(archiveDir, basename));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(message: string): void {
    console.log(`[Bridge] ${message}`);
  }
}
```

### Usage Flow

```bash
# 1. Start TRUE Agent bridge
node dist/antigravity-bridge.js

# 2. User asks Antigravity to create a plan
User: "Create a plan to crawl 1000 decisions from all daire types"

# 3. Antigravity generates plan and saves to .antigravity/inbox/plan_001.json
{
  "agents": [
    {"id": "crawler-1", "type": "CRAWLER", "config": {"daireType": "Ceza"}},
    {"id": "crawler-2", "type": "CRAWLER", "config": {"daireType": "Hukuk"}},
    {"id": "analyzer-1", "type": "ANALYZER"}
  ],
  "workflow": [
    {"from": "system", "to": "crawler-1", "trigger": "START", "payload": {...}},
    {"from": "system", "to": "crawler-2", "trigger": "START", "payload": {...}},
    {"from": "crawler-1", "to": "analyzer-1", "trigger": "ON_COMPLETE"},
    {"from": "crawler-2", "to": "analyzer-1", "trigger": "ON_COMPLETE"}
  ]
}

# 4. Bridge reads plan, spawns agents, executes workflow

# 5. Results written to .antigravity/outbox/res_001.json

# 6. Antigravity reads results and provides summary to user
```

---

## 5. HYBRID ARCHITECTURE

### Hybrid Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HYBRID DECISION TREE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User Request                                                               │
│       │                                                                      │
│       ▼                                                                      │
│   ┌───────────────────────┐                                                 │
│   │ Is this a planning    │                                                 │
│   │ or research task?     │                                                 │
│   └───────────┬───────────┘                                                 │
│               │                                                              │
│       ┌───────┴───────┐                                                      │
│       │ YES           │ NO                                                   │
│       ▼               ▼                                                      │
│   ┌──────────┐   ┌──────────────────────────────────────────┐               │
│   │Antigravity│   │ Can TRUE Agents handle this autonomously?│               │
│   │ (Plan)   │   └────────────────────┬─────────────────────┘               │
│   └─────┬────┘                        │                                     │
│         │                      ┌───────┴───────┐                              │
│         │                      │ YES           │ NO                          │
│         │                      ▼               ▼                             │
│         │                  ┌────────┐    ┌──────────┐                        │
│         │                  │TRUE    │    │Claude    │                        │
│         │                  │Agents  │    │Code      │                        │
│         │                  └───┬────┘    └────┬─────┘                        │
│         │                      │              │                               │
│         │                      │              │                               │
│         │          ┌───────────┴──────────────┘                               │
│         │          │                                                          │
│         ▼          ▼                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     RESULT BACK TO USER                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pattern Matrix

| Pattern | Antigravity Role | TRUE Agents Role | Use Case |
|---------|-----------------|------------------|----------|
| **Planner-Executor** | Creates execution plan | Executes plan | Complex workflows |
| **Supervisor** | Monitors progress | Autonomous workers | Continuous operations |
| **Analyst** | Researches decisions | Implements changes | System improvements |
| **Arbitrator** | Resolves conflicts | Independent operation | Multi-agent coordination |

---

## 6. SMARTHUKUK IMPLEMENTATION

### Agent Types for SmartHukuk

```yaml
Domain_Agents:
  CrawlerAgent:
    responsibilities:
      - Web scraping decisions
      - Respecting rate limits
      - Stealth mode operation
    triggers:
      - On schedule (Sentinel)
      - On gap detected (Analyzer)
      - On user request

  AnalyzerAgent:
    responsibilities:
      - Data quality analysis
      - Gap detection
      - Trend analysis
    triggers:
      - On crawl complete
      - On user request

  EnricherAgent:
    responsibilities:
      - Vector embedding
      - Metadata enrichment
      - Similarity matching
    triggers:
      - On new decisions
      - On analysis complete

  ValidatorAgent:
    responsibilities:
      - Data validation
      - Duplicate detection
      - Quality scoring
    triggers:
      - On enrichment complete
      - On schedule

  SentinelAgent:
    responsibilities:
      - Health monitoring
      - Alert generation
      - Recovery triggering
    triggers:
      - On timer (continuous)
      - On agent failure

Control_Agents:
  WatchdogAgent:
    responsibilities:
      - Monitor heartbeats
      - Auto-restart failed agents
      - Escalate issues

  MediatorAgent:
    responsibilities:
      - Resolve resource conflicts
      - Fair scheduling
      - Deadlock detection

  GovernorAgent:
    responsibilities:
      - Resource quotas
      - Rate limiting
      - Cost tracking

  OrchestratorAgent:
    responsibilities:
      - Workflow coordination
      - Agent spawning
      - Result aggregation
```

### SmartHukuk Workflow Example

```typescript
// SmartHukuk workflow: Continuous data collection

// 1. Sentinel detects gap
await sentinelAgent.detectGaps();

// 2. Sentinel triggers Crawler
await crawlerAgent.send('crawler-1', MessageType.TRIGGER, {
  type: 'FILL_GAP',
  target: {
    daireType: 'Ceza',
    dateRange: ['2024-01-01', '2024-01-31']
  }
});

// 3. Crawler completes → triggers Analyzer
// (inside CrawlerAgent)
await this.send('analyzer-1', MessageType.TRIGGER, {
  type: 'ANALYZE_NEW',
  payload: results
});

// 4. Analyzer finds more gaps → triggers Crawler again
// (inside AnalyzerAgent)
if (gaps.length > 0) {
  await this.send('crawler-2', MessageType.TRIGGER, {
    type: 'FILL_GAP',
    target: gaps[0]
  });
}

// 5. Analyzer triggers Enricher
await this.send('enricher-1', MessageType.TRIGGER, {
  type: 'ENRICH',
  payload: analysis.newIds
});

// 6. Enricher triggers Validator
await this.send('validator-1', MessageType.TRIGGER, {
  type: 'VALIDATE',
  payload: enrichmentResults
});

// 7. Validator broadcasts completion
await this.broadcast(MessageType.EVENT, {
  type: 'BATCH_COMPLETE',
  stats: { ... }
});
```

---

## 7. BEST PRACTICES

### Agent Design Principles

```yaml
1. Single_Responsibility:
   - Each agent does ONE thing well
   - Don't create "god agents"
   - Use composition over complexity

2. Loose_Coupling:
   - Agents communicate via messages only
   - No direct dependencies between agents
   - Use events for cross-cutting concerns

3. Fail_Safe:
   - Every agent handles errors gracefully
   - State is persisted between operations
   - Failed operations are retryable

4. Observability:
   - Log all important actions
   - Emit events for monitoring
   - Expose health/status endpoints

5. Resource_Management:
   - Set memory/time limits
   - Clean up resources on stop
   - Don't leak connections
```

### Message Design

```yaml
Message_Best_Practices:
  structure:
    - Use consistent payload schema
    - Include correlation IDs for tracing
    - Add timestamps for debugging

  patterns:
    - TRIGGER: Do work and respond
    - QUERY: Request information
    - EVENT: Broadcast notifications
    - RESPONSE: Reply to TRIGGER/QUERY

  anti_patterns:
    - Don't send large payloads in messages
    - Don't use events for critical operations
    - Don't ignore error responses
```

### Performance Tips

```yaml
Performance:
  parallel_processing:
    - Spawn multiple workers for disjoint tasks
    - Use worker pools for CPU-intensive work
    - Batch small operations

  memory_management:
    - Stream large datasets
    - Don't cache everything
    - Use weak references where appropriate

  database:
    - Use connection pooling
    - Batch writes when possible
    - Create appropriate indexes
```

### Monitoring

```yaml
Monitoring:
  metrics_to_track:
    - Agent uptime/status
    - Message throughput
    - Task completion rate
    - Error rate
    - Resource usage

  alert_conditions:
    - Agent not heartbeat > 2min
    - Error rate > 5%
    - Queue depth > threshold
    - Response time > threshold
```

---

## 8. QUICK START GUIDE

### Installation

```bash
# 1. Navigate to true-agents directory
cd /Users/emre/SmartHukuk/true-agents

# 2. Install dependencies
npm install

# 3. Run basic test
npx tsx 09-test-basic.ts
```

### Create Your First Agent

```bash
# 1. Create new agent file
touch 10-my-agent.ts

# 2. Implement your agent (see examples above)

# 3. Run it
npx tsx 10-my-agent.ts
```

### Integration with SmartHukuk Backend

```bash
# 1. Copy agents to backend
cp -r true-agents /Users/emre/SmartHukuk/backend/src/agents

# 2. Install in backend
cd /Users/emre/SmartHukuk/backend
npm install pg uuid eventemitter3

# 3. Import and use
import { CrawlerAgent } from './agents/07-domain-crawler.js';
```

### Antigravity Integration Setup

```bash
# 1. Create antigravity directories
mkdir -p .antigravity/{inbox,outbox,archive}

# 2. Start bridge
node dist/antigravity-bridge.js

# 3. Create plan in inbox
cat > .antigravity/inbox/plan_001.json << EOF
{
  "agents": [
    {"id": "crawler-1", "type": "CRAWLER"}
  ],
  "workflow": [
    {"from": "system", "to": "crawler-1", "trigger": "START"}
  ]
}
EOF

# 4. Check results in outbox
cat .antigravity/outbox/res_001.json
```

---

## SOURCES

- [Building Production-Ready Multi-Agent Systems](https://www.getmaxim.ai/articles/best-practices-for-building-production-ready-multi-agent-systems/)
- [Developer's Guide to Multi-Agent Patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)
- [Architectures for Multi-Agent Systems](https://galileo.ai/blog/architectures-for-multi-agent-systems)
- [Anthropic's Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Four Design Patterns for Event-Driven Multi-Agent Systems](https://www.confluent.io/blog/event-driven-multi-agent-systems/)
- [LangGraph: Multi-Agent Workflows](https://blog.langchain.com/langgraph-multi-agent-workflows/)
- [Building Multi-Agent Workflows with LangChain](https://www.ema.co/additional-blogs/addition-blogs/multi-agent-workflows-langchain-langgraph)

---

**Document Owner:** SmartHukuk Development Team
**Last Updated:** 2025-01-01
**Status:** Active
