/**
 * Auto Detector
 * Automatically determines when to use A2A multi-agent workflow
 * Makes intelligent decisions based on task complexity and user intent
 */

import type { A2ADecision, Persona, CLIOptions } from '../types/a2a.js';
import { TaskAnalyzer } from './task-analyzer.js';

export class AutoDetector {
  private analyzer: TaskAnalyzer;

  constructor() {
    this.analyzer = new TaskAnalyzer();
  }

  /**
   * Decide if input should use A2A mode
   */
  shouldUseA2A(input: string, options: CLIOptions): A2ADecision {
    // Explicit --a2a flag (manual override)
    if (options.a2a) {
      return {
        useA2A: true,
        reason: 'Explicit --a2a flag',
        confidence: 1.0
      };
    }

    // Explicit --persona flag (single agent mode)
    if (options.persona) {
      return {
        useA2A: false,
        reason: `Single persona requested: ${options.persona}`,
        confidence: 1.0,
        fallbackPersona: options.persona
      };
    }

    // Analyze task for intelligent decision
    const analysis = this.analyzer.analyze(input);

    // Decision criteria
    const hasMultipleActionTypes = analysis.actionTypes.length >= 2;
    const isHighComplexity = analysis.complexity === 'complex';
    const hasMultiplePersonas = analysis.suggestedPersonas.length >= 3;
    const hasDocumentRef = this.analyzer.hasDocumentReference(input);

    // Determine if A2A is beneficial
    let useA2A = false;
    let reason = analysis.reasoning;

    if (hasDocumentRef) {
      useA2A = true;
      reason = `Document reference detected + ${reason}`;
    } else if (hasMultipleActionTypes) {
      useA2A = true;
      reason = `Multiple action types (${analysis.actionTypes.join(', ')}) - ${reason}`;
    } else if (isHighComplexity) {
      useA2A = true;
      reason = `High complexity (${analysis.complexity}) - ${reason}`;
    } else if (hasMultiplePersonas) {
      useA2A = true;
      reason = `Multiple personas required (${analysis.suggestedPersonas.length}) - ${reason}`;
    }

    if (useA2A) {
      return {
        useA2A: true,
        reason,
        confidence: analysis.confidence,
        suggestedPersonas: analysis.suggestedPersonas
      };
    }

    // Simple task - single agent is sufficient
    const singlePersona = this.pickBestSingleAgent(analysis);
    return {
      useA2A: false,
      reason: `Simple task best handled by ${singlePersona}`,
      confidence: 0.8,
      fallbackPersona: singlePersona
    };
  }

  /**
   * Pick best single agent for simple task
   */
  private pickBestSingleAgent(analysis: any): Persona {
    const { actionTypes, suggestedPersonas } = analysis;

    // Priority order for specialist personas
    const priority: Persona[] = [
      'explorer',
      'archaeologist',
      'architect',
      'test',
      'analyst'
    ];

    // Check which specialist is in suggested personas
    for (const p of priority) {
      if (suggestedPersonas.includes(p)) {
        return p;
      }
    }

    // Default to architect
    return 'architect';
  }
}
