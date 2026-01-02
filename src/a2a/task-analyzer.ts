/**
 * Task Analyzer
 * Intelligently analyzes tasks to determine complexity, domains, and required personas
 * Replaces simple keyword matching with multi-dimensional analysis
 */

import type {
  TaskAnalysis,
  Persona,
  ActionType
} from '../types/a2a.js';

/**
 * Action patterns with weights for detection
 */
const ACTION_PATTERNS: Record<ActionType, { patterns: string[]; weight: number }> = {
  research: {
    patterns: ['research', 'find', 'explore', 'investigate', 'look into', 'best practice', 'latest', 'discover', 'search for'],
    weight: 1.0
  },
  implement: {
    patterns: ['implement', 'build', 'create', 'add', 'write', 'develop', 'make', 'construct'],
    weight: 1.5
  },
  fix: {
    patterns: ['fix', 'resolve', 'debug', 'solve issue', 'correct', 'repair'],
    weight: 1.3
  },
  analyze: {
    patterns: ['analyze', 'understand', 'explain', 'review', 'examine', 'break down'],
    weight: 0.8
  },
  test: {
    patterns: ['test', 'verify', 'validate', 'check', 'ensure'],
    weight: 0.7
  },
  refactor: {
    patterns: ['refactor', 'clean up', 'reorganize', 'optimize', 'improve', 'restructure'],
    weight: 1.2
  },
  document: {
    patterns: ['document', 'write docs', 'add comments', 'documenting'],
    weight: 0.5
  }
};

/**
 * Domain detection patterns
 */
const DOMAIN_PATTERNS: Record<string, string[]> = {
  frontend: ['react', 'vue', 'angular', 'frontend', 'ui', 'component', 'css', 'html', 'svelte', 'next.js', 'nuxt'],
  backend: ['api', 'server', 'endpoint', 'backend', 'service', 'controller', 'route'],
  database: ['database', 'query', 'sql', 'migration', 'schema', 'orm', 'prisma', 'typeorm'],
  devops: ['deploy', 'ci/cd', 'docker', 'kubernetes', 'pipeline', 'infrastructure'],
  testing: ['test', 'spec', 'mock', 'coverage', 'jest', 'vitest', 'cypress'],
  auth: ['auth', 'authentication', 'authorization', 'login', 'oauth', 'jwt', 'session'],
  async: ['async', 'queue', 'worker', 'job', 'background', 'cron', 'scheduler']
};

/**
 * Complexity indicators
 */
const COMPLEXITY_PATTERNS = {
  multiStep: ['and then', 'after that', 'following', 'subsequently', 'next,'],
  compound: ['multi', 'integrated', 'comprehensive', 'full', 'complete', 'end-to-end'],
  conditional: ['if', 'when', 'depending on', 'based on']
};

export class TaskAnalyzer {
  /**
   * Analyze task and return comprehensive analysis
   */
  analyze(task: string): TaskAnalysis {
    const lower = task.toLowerCase();

    // Detect action types
    const actionTypes = this.detectActionTypes(lower);

    // Detect domains
    const domains = this.detectDomains(lower);

    // Calculate complexity
    const complexity = this.calculateComplexity(task, lower, actionTypes);

    // Determine requirements
    const requiresResearch = actionTypes.includes('research');
    const requiresImplementation = actionTypes.includes('implement') ||
      actionTypes.includes('fix') ||
      actionTypes.includes('refactor');
    const requiresTesting = actionTypes.includes('test') || requiresImplementation;
    const requiresCodeAnalysis = actionTypes.includes('analyze') ||
      actionTypes.includes('fix') ||
      actionTypes.includes('refactor');

    // Suggest personas based on analysis
    const suggestedPersonas = this.suggestPersonas({
      actionTypes,
      domains,
      complexity,
      requiresResearch,
      requiresImplementation,
      requiresTesting,
      requiresCodeAnalysis
    });

    return {
      complexity,
      domains,
      actionTypes,
      requiresResearch,
      requiresImplementation,
      requiresTesting,
      requiresCodeAnalysis,
      suggestedPersonas,
      reasoning: this.buildReasoning(actionTypes, domains, complexity),
      confidence: this.calculateConfidence(actionTypes, domains)
    };
  }

  /**
   * Detect if task is A2A-worthy (multi-agent beneficial)
   */
  isA2AWorthy(task: string): boolean {
    const analysis = this.analyze(task);

    // A2A worthy if:
    // 1. Multiple action types (research + implement)
    // 2. High complexity
    // 3. Requires multiple specialist personas
    const multipleActionTypes = analysis.actionTypes.length >= 2;
    const highComplexity = analysis.complexity === 'complex';
    const multiplePersonas = analysis.suggestedPersonas.length >= 3;
    const hasDocumentReference = this.hasDocumentReference(task);

    return multipleActionTypes || highComplexity || multiplePersonas || hasDocumentReference;
  }

  /**
   * Check if task contains document references
   */
  hasDocumentReference(task: string): boolean {
    const refPatterns = [
      /@[\w\-./]+\.[\w]+/g,
      /use\s+[\w\-./]+\.[\w]+\s+as/gi,
      /based on\s+[\w\-./]+\.[\w]+/gi,
      /reference\s+[\w\-./]+\.[\w]+/gi
    ];

    return refPatterns.some(pattern => pattern.test(task));
  }

  /**
   * Detect action types in task
   */
  private detectActionTypes(task: string): ActionType[] {
    const detected: ActionType[] = [];

    for (const [action, config] of Object.entries(ACTION_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (task.includes(pattern)) {
          detected.push(action as ActionType);
          break;
        }
      }
    }

    return detected.length > 0 ? detected : ['implement']; // Default
  }

  /**
   * Detect technical domains in task
   */
  private detectDomains(task: string): string[] {
    const detected: string[] = [];

    for (const [domain, patterns] of Object.entries(DOMAIN_PATTERNS)) {
      for (const pattern of patterns) {
        if (task.includes(pattern)) {
          detected.push(domain);
          break;
        }
      }
    }

    return detected;
  }

  /**
   * Calculate task complexity
   */
  private calculateComplexity(task: string, lower: string, actions: ActionType[]): 'simple' | 'medium' | 'complex' {
    let score = 0;

    // Base score from action types
    score += actions.length * 2;

    // Task length
    if (task.length > 80) score += 1;
    if (task.length > 150) score += 1;

    // Multi-step phrases
    for (const phrase of COMPLEXITY_PATTERNS.multiStep) {
      if (lower.includes(phrase)) score += 2;
    }

    // Compound words
    for (const indicator of COMPLEXITY_PATTERNS.compound) {
      if (lower.includes(indicator)) score += 1;
    }

    // Multiple clauses (commas, conjunctions)
    const commaCount = (task.match(/,/g) || []).length;
    score += Math.min(commaCount, 2);

    // Document reference adds complexity
    if (this.hasDocumentReference(task)) score += 1;

    if (score >= 6) return 'complex';
    if (score >= 3) return 'medium';
    return 'simple';
  }

  /**
   * Suggest personas based on analysis
   */
  private suggestPersonas(context: {
    actionTypes: ActionType[];
    domains: string[];
    complexity: string;
    requiresResearch: boolean;
    requiresImplementation: boolean;
    requiresTesting: boolean;
    requiresCodeAnalysis: boolean;
  }): Persona[] {
    const personas: Persona[] = [];

    // Analysis phase for complex tasks
    if (context.requiresResearch) {
      personas.push('explorer');
    }

    if (context.requiresCodeAnalysis) {
      personas.push('archaeologist');
    }

    if (context.requiresImplementation) {
      personas.push('architect');
    }

    // Only add 'test' persona if explicitly requested OR task is not simple
    // Simple verification is handled by Sentinel or the Architect themselves
    if (context.actionTypes.includes('test') || (context.requiresTesting && context.complexity !== 'simple')) {
      personas.push('test');
    }

    // Always end with sentinel for verification
    if (personas.length > 0) {
      personas.push('sentinel');
    }

    // Default if nothing detected
    if (personas.length === 0) {
      personas.push('architect', 'sentinel');
    }

    return personas;
  }

  /**
   * Build reasoning explanation
   */
  private buildReasoning(actions: ActionType[], domains: string[], complexity: string): string {
    const parts: string[] = [];

    parts.push(`complexity: ${complexity}`);
    parts.push(`actions: ${actions.join(', ')}`);

    if (domains.length > 0) {
      parts.push(`domains: ${domains.join(', ')}`);
    }

    return parts.join('; ');
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(actions: ActionType[], domains: string[]): number {
    let confidence = 0.5; // Base confidence

    confidence += actions.length * 0.1;
    confidence += domains.length * 0.05;

    return Math.min(confidence, 1.0);
  }
}
