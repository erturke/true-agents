/**
 * A2A (Agent-to-Agent) Type Definitions
 * Types for multi-agent workflow with dynamic handoff
 */

/**
 * CLI options (shared with cli.ts)
 */
export interface CLIOptions {
  persona?: import('../cli.js').Persona;
  parallel?: boolean;
  a2a?: boolean;
  noInteractive?: boolean;
  thinking?: 'none' | 'think' | 'think-hard' | 'ultrathink';
  model?: 'sonnet' | 'opus';
  directory?: string;
}

/**
 * All available personas
 */
export type Persona =
  | 'sentinel'
  | 'referee'
  | 'recorder'
  | 'auditor'
  | 'architect'
  | 'explorer'
  | 'analyst'
  | 'test'
  | 'archaeologist';

/**
 * Message types for A2A communication
 */
export type MessageType = 'handoff' | 'response' | 'broadcast' | 'error';

/**
 * Handoff direction in conversation
 */
export interface Handoff {
  from: Persona;
  to: Persona | 'user' | 'all';
  reason: string;
  context?: string;
  nextSteps?: string[];
}

/**
 * Parsed agent output with structured data
 */
export interface AgentOutput {
  // Raw output from agent
  raw: string;

  // Parsed handoff info (if any)
  handoff?: Handoff;

  // Marker metadata
  marker?: {
    persona: Persona;
    timestamp: string;
    input: string;
    action?: string;
    output?: string;
    evidence?: string;
  };

  // Success/failure status
  success: boolean;

  // Error if failed
  error?: string;
}

/**
 * Agent execution result
 */
export interface AgentResult {
  persona: Persona;
  output: AgentOutput;
  exitCode: number;
  duration: number;
}

/**
 * Interactive prompt options for user
 */
export type UserAction =
  | 'continue'      // Press Enter to continue
  | 'stop'          // Stop workflow
  | 'pass'          // Pass message to next agent
  | 'retry'         // Retry current agent
  | 'jump';         // Jump to different persona

/**
 * Interactive state for user intervention
 */
export interface InteractivePrompt {
  currentAgent: Persona;
  nextAgent?: Persona;
  result: AgentResult;
  canContinue: boolean;
  canRetry: boolean;
  retryCount: number;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryOnErrors: string[];
  backoffMs: number;
  exponentialBackoff: boolean;
}

/**
 * Workflow configuration
 */
export interface WorkflowConfig {
  task: string;
  personas?: Persona[];           // Optional: force specific personas
  autoDetect: boolean;             // Auto-detect required personas
  interactive: boolean;            // Enable user intervention
  retryConfig: RetryConfig;
  maxDuration: number;             // Max workflow duration in ms
}

/**
 * Workflow execution state
 */
export interface WorkflowState {
  id: string;
  config: WorkflowConfig;
  currentPersonaIndex: number;
  personas: Persona[];
  results: AgentResult[];
  startTime: number;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'stopped';
}

/**
 * Persona detection result
 */
export interface PersonaDetection {
  personas: Persona[];
  reasoning: string;
  confidence: number;
}

/**
 * Agent execution context passed to each agent
 */
export interface AgentContext {
  task: string;
  previousOutputs: AgentOutput[];
  conversationHistory: string;
  userMessages?: string[];
}
