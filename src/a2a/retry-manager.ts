/**
 * A2A Retry Manager
 * Handles retry logic with exponential backoff
 */

import type { RetryConfig, AgentResult } from '../types/a2a.js';

export interface RetryAttempt {
  attempt: number;
  timestamp: number;
  error?: string;
  output?: string;
}

/**
 * Retry manager for agent execution
 */
export class RetryManager {
  private config: RetryConfig;
  private attempts: Map<string, RetryAttempt[]>;

  constructor(config?: Partial<RetryConfig>) {
    this.config = {
      maxRetries: 3,
      retryOnErrors: ['timeout', 'network', 'rate limit', 'temporary'],
      backoffMs: 1000,
      exponentialBackoff: true,
      ...config
    };
    this.attempts = new Map();
  }

  /**
   * Execute function with retry logic
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    shouldRetry: (error: Error) => boolean = () => true
  ): Promise<T> {
    const attempts: RetryAttempt[] = [];

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      const startTime = Date.now();

      try {
        const result = await fn();

        // Success - record attempt
        attempts.push({
          attempt,
          timestamp: Date.now()
        });
        this.attempts.set(key, attempts);

        return result;

      } catch (error) {
        const err = error as Error;
        attempts.push({
          attempt,
          timestamp: Date.now(),
          error: err.message
        });

        // Check if we should retry
        if (attempt >= this.config.maxRetries || !this.shouldRetryError(err, shouldRetry)) {
          this.attempts.set(key, attempts);
          throw error;
        }

        // Calculate backoff
        const backoff = this.calculateBackoff(attempt);

        console.log(`⚠️  Retry ${attempt}/${this.config.maxRetries} in ${backoff}ms...`);
        console.log(`   Error: ${err.message}`);

        await this.sleep(backoff);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Determine if error is retryable
   */
  private shouldRetryError(error: Error, customCheck: (error: Error) => boolean): boolean {
    // Custom check first
    if (!customCheck(error)) {
      return false;
    }

    // Built-in error patterns
    const message = error.message.toLowerCase();
    return this.config.retryOnErrors.some(pattern =>
      message.includes(pattern.toLowerCase())
    );
  }

  /**
   * Calculate backoff delay
   */
  private calculateBackoff(attempt: number): number {
    if (this.config.exponentialBackoff) {
      return this.config.backoffMs * Math.pow(2, attempt - 1);
    }
    return this.config.backoffMs;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get retry attempts for a key
   */
  getAttempts(key: string): RetryAttempt[] {
    return this.attempts.get(key) || [];
  }

  /**
   * Clear retry history for a key
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Check if result indicates need for retry
   */
  shouldRetryResult(result: AgentResult): { retry: boolean; reason?: string } {
    // Check for explicit error in output
    if (result.output.error) {
      const errorLower = result.output.error.toLowerCase();
      if (errorLower.includes('timeout') ||
          errorLower.includes('temporary') ||
          errorLower.includes('rate limit')) {
        return { retry: true, reason: result.output.error };
      }
    }

    // Check for failure markers in raw output
    const outputLower = result.output.raw.toLowerCase();
    if (outputLower.includes('temporarily unavailable') ||
        outputLower.includes('try again') ||
        outputLower.includes('rate limited')) {
      return { retry: true, reason: 'Temporary error detected' };
    }

    return { retry: false };
  }

  /**
   * Format retry summary for display
   */
  formatRetrySummary(key: string): string {
    const attempts = this.getAttempts(key);
    if (attempts.length <= 1) {
      return '';
    }

    const lines = [
      `\n${'─'.repeat(60)}`,
      `🔄 Retry History for ${key}`,
      `${'─'.repeat(60)}`
    ];

    for (const attempt of attempts) {
      const status = attempt.error ? `❌ ${attempt.error}` : '✅ Success';
      lines.push(`  Attempt ${attempt.attempt}: ${status}`);
    }

    lines.push(`${'─'.repeat(60)}`);

    return lines.join('\n');
  }
}
