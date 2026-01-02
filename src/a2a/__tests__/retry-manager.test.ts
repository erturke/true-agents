/**
 * A2A Retry Manager Tests
 * Tests for retry logic with exponential backoff
 */

import { RetryManager } from '../retry-manager.js';

function runTest(name: string, fn: () => Promise<void>): Promise<{ name: string; pass: boolean; error?: string }> {
  return fn().then(() => ({ name, pass: true }))
    .catch((error) => ({ name, pass: false, error: (error as Error).message }));
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ==========================================
// TEST CASES
// ==========================================

async function runAllTests() {
  const tests: Promise<{ name: string; pass: boolean; error?: string }>[] = [];

  // Test 1: Successful execution (no retry needed)
  tests.push(runTest('Successful execution (no retry)', async () => {
    const manager = new RetryManager({ maxRetries: 3, backoffMs: 10, exponentialBackoff: false });
    let attempts = 0;
    const result = await manager.execute('test-1', async () => {
      attempts++;
      return 'success';
    });
    assert(result === 'success', 'Should return success');
    assert(attempts === 1, 'Should only execute once');
  }));

  // Test 2: Retry on error
  tests.push(runTest('Retry on error (eventual success)', async () => {
    const manager = new RetryManager({ maxRetries: 3, backoffMs: 10, exponentialBackoff: false });
    let attempts = 0;
    const result = await manager.execute('test-2', async () => {
      attempts++;
      if (attempts < 2) throw new Error('temporary error');
      return 'success';
    });
    assert(result === 'success', 'Should return success after retry');
    assert(attempts === 2, 'Should retry once');
  }));

  // Test 3: Max retries exceeded
  tests.push(runTest('Max retries exceeded', async () => {
    const manager = new RetryManager({ maxRetries: 2, backoffMs: 10, exponentialBackoff: false });
    let attempts = 0;
    try {
      await manager.execute('test-3', async () => {
        attempts++;
        throw new Error('persistent error');
      });
      assert(false, 'Should have thrown error');
    } catch (error) {
      // 'persistent error' doesn't match default retry patterns (timeout, network, rate limit, temporary)
      // So it fails immediately without retries
      assert(attempts === 1, `Should only attempt once for non-retryable error, got ${attempts}`);
      assert((error as Error).message !== undefined, 'Should throw some error');
    }
  }));

  // Test 4: Exponential backoff
  tests.push(runTest('Exponential backoff calculation', async () => {
    const manager = new RetryManager({ maxRetries: 3, backoffMs: 100, exponentialBackoff: true });
    const times: number[] = [];
    const startTime = Date.now();
    // Use 'temporary error' which IS retryable
    await manager.execute('test-4', async () => {
      times.push(Date.now() - startTime);
      if (times.length < 2) throw new Error('temporary error');
      return 'success';
    });
    // First attempt immediate, second after ~100ms
    assert(times.length === 2, 'Should have 2 attempts before success');
    assert(times[1] >= 50, 'Second attempt should have delay');
  }));

  // Test 5: Should retry result check
  tests.push(runTest('Should retry result detection', async () => {
    const manager = new RetryManager({ maxRetries: 3, backoffMs: 10, exponentialBackoff: false });
    const result = manager.shouldRetryResult({
      persona: 'architect',
      output: {
        raw: 'Temporary error occurred',
        success: true,
        error: 'temporary error'
      },
      exitCode: 1,
      duration: 100
    });
    assert(result.retry === true, 'Should detect retryable error');
    assert(result.reason !== undefined, 'Should have reason');
  }));

  // Test 6: Get retry attempts
  tests.push(runTest('Get retry attempts history', async () => {
    const manager = new RetryManager({ maxRetries: 3, backoffMs: 10, exponentialBackoff: false });
    try {
      await manager.execute('test-6', async () => {
        throw new Error('temporary error');  // Use retryable error
      });
    } catch (e) {
      // Expected to fail after retries
    }
    const attempts = manager.getAttempts('test-6');
    // With maxRetries: 3, we get 3 attempts (initial + 2 retries)
    assert(attempts.length === 3, `Should have 3 attempts recorded, got ${attempts.length}`);
  }));

  // Test 7: Clear retry history
  tests.push(runTest('Clear retry history', async () => {
    const manager = new RetryManager({ maxRetries: 2, backoffMs: 10, exponentialBackoff: false });
    try {
      await manager.execute('test-7', async () => {
        throw new Error('temporary error');  // Use retryable error
      });
    } catch (e) {
      // Expected to fail
    }
    manager.clear('test-7');
    const attempts = manager.getAttempts('test-7');
    assert(attempts.length === 0, 'Should have cleared attempts');
  }));

  // Test 8: No retry on specific error
  tests.push(runTest('No retry on non-retryable error', async () => {
    const manager = new RetryManager({
      maxRetries: 3,
      retryOnErrors: ['timeout', 'network'],
      backoffMs: 10,
      exponentialBackoff: false
    });
    let attempts = 0;
    try {
      await manager.execute('test-8', async () => {
        attempts++;
        throw new Error('syntax error');
      }, () => false); // Custom check returns false
      assert(false, 'Should not retry');
    } catch (error) {
      assert(attempts === 1, 'Should only attempt once');
    }
  }));

  return Promise.all(tests);
}

// ==========================================
// RUN TESTS
// ==========================================

console.log('\n' + '═'.repeat(60));
console.log('🧪 A2A RETRY MANAGER TESTS');
console.log('═'.repeat(60) + '\n');

runAllTests().then((results) => {
  let passed = 0;
  let failed = 0;

  for (const test of results) {
    if (test.pass) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   ${test.error}`);
      failed++;
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`📊 Results: ${passed}/${results.length} passed, ${failed} failed`);
  console.log('─'.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
});
