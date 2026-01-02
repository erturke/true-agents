/**
 * A2A Handoff Parser
 * Parses agent output to detect handoffs and extract structured data
 */

import type {
  Persona,
  AgentOutput,
  Handoff
} from '../types/a2a.js';

/**
 * Parse agent output and extract structured information
 */
export class HandoffParser {
  /**
   * Parse agent raw output into structured AgentOutput
   */
  parse(rawOutput: string, persona: Persona): AgentOutput {
    const result: AgentOutput = {
      raw: rawOutput,
      success: true
    };

    // Try to extract MARKER block
    const marker = this.extractMarker(rawOutput);
    if (marker) {
      result.marker = marker;
    }

    // Try to extract HANDOFF block
    const handoff = this.extractHandoff(rawOutput, persona);
    if (handoff) {
      result.handoff = handoff;
    }

    // Check for errors in output
    const error = this.detectError(rawOutput);
    if (error) {
      result.success = false;
      result.error = error;
    }

    return result;
  }

  /**
   * Extract MARKER block from output
   * Format: 🏷️ MARKER: PERSONA-timestamp
   */
  private extractMarker(output: string): AgentOutput['marker'] {
    // Match marker header
    const markerMatch = output.match(/🏷️\s*MARKER:\s*(\w+)-(\d{8}-?\d{6}?)/);
    if (!markerMatch) return undefined;

    const persona = markerMatch[1].toUpperCase() as Persona;
    const timestamp = markerMatch[2];

    // Extract INPUT
    const inputMatch = output.match(/📋\s*INPUT:\s*"([^"]*)"/);
    const input = inputMatch?.[1] || '';

    // Extract ACTION section
    const actionSection = this.extractSection(output, '🔧\s*ACTION', '📤|✅|💬');
    const action = actionSection?.trim() || undefined;

    // Extract OUTPUT
    const outputMatch = output.match(/📤\s*OUTPUT:\s*"([^"]*)"/);
    const mainOutput = outputMatch?.[1] || this.extractSection(output, '📤\s*OUTPUT', '✅|💬');

    // Extract EVIDENCE
    const evidenceSection = this.extractSection(output, '✅\s*EVIDENCE', '$|💬');
    const evidence = evidenceSection?.trim() || undefined;

    return {
      persona,
      timestamp,
      input,
      action,
      output: mainOutput?.trim() || undefined,
      evidence
    };
  }

  /**
   * Extract HANDOFF block from output
   * Format: 💬 HANDOFF: FROM → TO
   */
  private extractHandoff(output: string, currentPersona: Persona): Handoff | undefined {
    // Match handoff header
    const handoffMatch = output.match(/💬\s*HANDOFF:\s*(\w+)\s*→\s*(\w+|\w+\s+\w+|USER|ALL)/i);
    if (!handoffMatch) {
      // Check for implicit handoff (just mentioned next persona)
      return this.detectImplicitHandoff(output, currentPersona);
    }

    const from = handoffMatch[1].toLowerCase() as Persona;
    let to = handoffMatch[2].toLowerCase().replace(/\s+/g, '');

    // Handle "USER" or "ALL" destinations
    if (to === 'user') {
      to = 'user';
    } else if (to === 'all') {
      to = 'all';
    }

    // Extract reason (after 📌)
    const reason = this.extractAfterMarker(output, '📌') || '';

    // Extract context (after 💭)
    const context = this.extractAfterMarker(output, '💭') || '';

    // Extract next steps (after 📦 and before 🎯 or end)
    const nextStepsSection = this.extractSection(output, '📦\s*Next steps', '🎯|$');
    const nextSteps = nextStepsSection
      ?.split('\n')
      .map(s => s.replace(/^[:\s\-\•]+/, '').trim())  // Also strip leading colons
      .filter(s => s.length > 0) || [];

    return {
      from,
      to: to as Persona | 'user' | 'all',
      reason,
      context,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined
    };
  }

  /**
   * Detect implicit handoff (mentioned in text without formal format)
   */
  private detectImplicitHandoff(output: string, currentPersona: Persona): Handoff | undefined {
    const lower = output.toLowerCase();

    // Common phrases that indicate handoff
    const handoffPhrases = [
      { pattern: /handoff\s+to\s+(\w+)/i, priority: 1 },
      { pattern: /pass\s+to\s+(\w+)/i, priority: 1 },
      { pattern: /next:\s*(\w+)/i, priority: 2 },
      { pattern: /→\s*(\w+)/i, priority: 1 },
      { pattern: /sending\s+to\s+(\w+)/i, priority: 2 },
      { pattern: /now\s+(\w+)'s\s+turn/i, priority: 2 },
    ];

    let bestMatch: { persona: string; priority: number } | undefined;

    for (const phrase of handoffPhrases) {
      const match = lower.match(phrase.pattern);
      if (match) {
        const persona = match[1].toLowerCase();
        // Valid persona check
        const validPersonas = ['architect', 'explorer', 'analyst', 'test', 'archaeologist',
                               'sentinel', 'referee', 'recorder', 'auditor'];
        if (validPersonas.includes(persona)) {
          if (!bestMatch || phrase.priority < bestMatch.priority) {
            bestMatch = { persona, priority: phrase.priority };
          }
        }
      }
    }

    if (bestMatch) {
      return {
        from: currentPersona,
        to: bestMatch.persona as Persona,
        reason: 'Implicit handoff detected in output',
        context: output.substring(0, 200) + '...'
      };
    }

    return undefined;
  }

  /**
   * Extract a section between two markers
   * Handles end markers like "🎯|$" where $ means end of string (not line)
   */
  private extractSection(output: string, startMarker: string, endMarker: string): string | undefined {
    const startRegex = new RegExp(startMarker, 'i');
    const startMatch = output.match(startRegex);
    if (!startMatch) return undefined;

    const startIndex = startMatch.index! + startMatch[0].length;
    const afterStart = output.substring(startIndex);

    // Handle end marker - split by | and find first match
    const endOptions = endMarker.split('|').filter(o => o.length > 0);
    let bestEndIndex = -1;

    for (const option of endOptions) {
      if (option === '$') {
        // End of string - only use if no other marker found (fallback)
        if (bestEndIndex === -1) {
          bestEndIndex = afterStart.length;
        }
      } else {
        const regex = new RegExp(option, 'im');
        const idx = afterStart.search(regex);
        if (idx !== -1 && (bestEndIndex === -1 || idx < bestEndIndex)) {
          bestEndIndex = idx;
        }
      }
    }

    if (bestEndIndex === -1) return undefined;

    return afterStart.substring(0, bestEndIndex).trim();
  }

  /**
   * Extract text after a specific marker
   */
  private extractAfterMarker(output: string, marker: string): string | undefined {
    const regex = new RegExp(`${marker}\\s*`, 'i');
    const match = output.match(regex);
    if (!match) return undefined;

    const afterMarker = output.substring(match.index! + match[0].length);

    // Extract until next marker or end
    const nextMarker = afterMarker.match(/[📌💭📦🎯✅🔧📤🏷️💬]/);
    if (nextMarker) {
      return afterMarker.substring(0, nextMarker.index).trim();
    }

    return afterMarker.split('\n')[0].trim();
  }

  /**
   * Detect errors in agent output
   */
  private detectError(output: string): string | undefined {
    const lower = output.toLowerCase();

    // Error indicators
    const errorPatterns = [
      /error:\s*(.+)/i,
      /failed:\s*(.+)/i,
      /cannot\s+(.+)/i,
      /unable\s+to\s+(.+)/i,
      /exception:\s*(.+)/i,
    ];

    for (const pattern of errorPatterns) {
      const match = output.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Check for explicit error markers
    if (lower.includes('❌') || lower.includes('error') || lower.includes('failed')) {
      return 'Error or failure detected in output';
    }

    return undefined;
  }

  /**
   * Determine next persona from handoff
   */
  getNextPersona(handoff: Handoff | undefined): Persona | 'user' | 'all' | undefined {
    if (!handoff) return undefined;
    if (handoff.to === 'user' || handoff.to === 'all') return handoff.to;
    return handoff.to as Persona;
  }

  /**
   * Check if output indicates workflow completion
   */
  isComplete(output: string): boolean {
    const lower = output.toLowerCase();
    const completeIndicators = [
      '✅ complete',
      '✅ done',
      '✅ finished',
      'workflow complete',
      'all done',
      'task complete',
      'implementation complete',
    ];

    for (const indicator of completeIndicators) {
      if (lower.includes(indicator)) {
        // But make sure there's no handoff after it
        const afterIndicator = lower.substring(lower.indexOf(indicator) + indicator.length);
        if (!afterIndicator.includes('handoff') && !afterIndicator.includes('→')) {
          return true;
        }
      }
    }

    // Check for handoff to USER (final step)
    if (/handoff.*→.*user/i.test(output)) {
      return true;
    }

    return false;
  }

  /**
   * Format handoff for display
   */
  formatHandoff(handoff: Handoff): string {
    const toIcon = this.getPersonaIcon(handoff.to);
    const fromIcon = this.getPersonaIcon(handoff.from);

    const lines = [
      `\n${'━'.repeat(80)}`,
      `💬 HANDOFF: ${fromIcon} ${handoff.from.toUpperCase()} → ${toIcon} ${handoff.to.toUpperCase()}`,
      ''
    ];

    if (handoff.reason) {
      lines.push(`   📌 ${handoff.reason}`);
    }

    if (handoff.context) {
      lines.push(`   💭 ${handoff.context.substring(0, 200)}${handoff.context.length > 200 ? '...' : ''}`);
    }

    if (handoff.nextSteps && handoff.nextSteps.length > 0) {
      lines.push('');
      lines.push(`   📦 Next steps:`);
      for (const step of handoff.nextSteps) {
        lines.push(`      • ${step}`);
      }
    }

    lines.push(`\n${'━'.repeat(80)}`);

    return lines.join('\n');
  }

  /**
   * Get persona emoji icon
   */
  private getPersonaIcon(persona: Persona | 'user' | 'all' | string): string {
    const icons: Record<string, string> = {
      sentinel: '🛡️',
      referee: '🎯',
      recorder: '📋',
      auditor: '🔍',
      architect: '🏗️',
      explorer: '🌐',
      analyst: '🔬',
      test: '🧪',
      archaeologist: '🏛️',
      user: '👤',
      all: '📢'
    };
    return icons[persona.toLowerCase()] || '🤖';
  }
}
