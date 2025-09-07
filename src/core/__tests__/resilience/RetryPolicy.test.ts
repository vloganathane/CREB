/**
 * Comprehensive tests for Retry Policy implementation
 */

import {
  RetryPolicy,
  RetryStrategy,
  RetryPolicies,
  RateLimiter,
  WithRetry,
  createRetryPolicy
} from '../../resilience/RetryPolicy';
import { CREBError, ErrorCategory, ErrorSeverity, NetworkError } from '../../errors/CREBError';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
  });

  afterEach(() => {
    rateLimiter.reset();
  });

  describe('Request Tracking', () => {
    it('should allow requests within rate limit', () => {
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.canMakeRequest()).toBe(true);
        rateLimiter.recordRequest();
      }
    });

    it('should block requests when rate limit is exceeded', () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest();
      }

      expect(rateLimiter.canMakeRequest()).toBe(false);
    });

    it('should reset after time window', (done) => {
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest();
      }

      expect(rateLimiter.canMakeRequest()).toBe(false);

      // Wait for window to pass
      setTimeout(() => {
        expect(rateLimiter.canMakeRequest()).toBe(true);
        done();
      }, 1100);
    });

    it('should calculate correct time until next request', () => {
      // Fill up the rate limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest();
      }

      const timeUntilNext = rateLimiter.getTimeUntilNextRequest();
      expect(timeUntilNext).toBeGreaterThan(0);
      expect(timeUntilNext).toBeLessThanOrEqual(1000);
    });

    it('should reset all requests', () => {
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest();
      }

      expect(rateLimiter.canMakeRequest()).toBe(false);

      rateLimiter.reset();

      expect(rateLimiter.canMakeRequest()).toBe(true);
    });
  });
});

describe('RetryPolicy', () => {
  describe('Basic Retry Logic', () => {
    it('should succeed on first attempt when operation succeeds', async () => {
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      const successfulOperation = jest.fn().mockResolvedValue('success');

      const result = await policy.execute(successfulOperation);

      expect(result.succeeded).toBe(true);
      expect(result.result).toBe('success');
      expect(result.metrics.totalAttempts).toBe(1);
      expect(result.metrics.successfulAttempts).toBe(1);
      expect(result.metrics.failedAttempts).toBe(0);
      expect(successfulOperation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failures and eventually succeed', async () => {
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 10, // Short delay for testing
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      let attemptCount = 0;
      const eventuallySucessfulOperation = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error(`Failure ${attemptCount}`));
        }
        return Promise.resolve('success');
      });

      const result = await policy.execute(eventuallySucessfulOperation);

      expect(result.succeeded).toBe(true);
      expect(result.result).toBe('success');
      expect(result.metrics.totalAttempts).toBe(3);
      expect(result.metrics.successfulAttempts).toBe(1);
      expect(result.metrics.failedAttempts).toBe(2);
      expect(eventuallySucessfulOperation).toHaveBeenCalledTimes(3);
    });

    it('should exhaust retries and return failure', async () => {
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 10,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      const alwaysFailingOperation = jest.fn().mockRejectedValue(new Error('Always fails'));

      const result = await policy.execute(alwaysFailingOperation);

      expect(result.succeeded).toBe(false);
      expect(result.finalError).toBeInstanceOf(Error);
      expect(result.finalError?.message).toBe('Always fails');
      expect(result.metrics.totalAttempts).toBe(3);
      expect(result.metrics.successfulAttempts).toBe(0);
      expect(result.metrics.failedAttempts).toBe(3);
      expect(alwaysFailingOperation).toHaveBeenCalledTimes(3);
    });
  });

  describe('Retry Strategies', () => {
    it('should implement fixed delay strategy', async () => {
      const onRetry = jest.fn();
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0,
        onRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      await policy.execute(failingOperation);

      expect(onRetry).toHaveBeenCalledTimes(2); // 2 retries after initial failure
      expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1, 100);
      expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2, 100);
    });

    it('should implement linear backoff strategy', async () => {
      const onRetry = jest.fn();
      const policy = new RetryPolicy({
        maxAttempts: 4,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.LINEAR_BACKOFF,
        backoffMultiplier: 1.5,
        jitterFactor: 0,
        onRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      await policy.execute(failingOperation);

      expect(onRetry).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1, 100); // 100 * 1
      expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2, 200); // 100 * 2
      expect(onRetry).toHaveBeenNthCalledWith(3, expect.any(Error), 3, 300); // 100 * 3
    });

    it('should implement exponential backoff strategy', async () => {
      const onRetry = jest.fn();
      const policy = new RetryPolicy({
        maxAttempts: 4,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.EXPONENTIAL_BACKOFF,
        backoffMultiplier: 2,
        jitterFactor: 0,
        onRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      await policy.execute(failingOperation);

      expect(onRetry).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1, 100); // 100 * 2^0
      expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2, 200); // 100 * 2^1
      expect(onRetry).toHaveBeenNthCalledWith(3, expect.any(Error), 3, 400); // 100 * 2^2
    });

    it('should respect maximum delay', async () => {
      const onRetry = jest.fn();
      const policy = new RetryPolicy({
        maxAttempts: 5,
        initialDelay: 100,
        maxDelay: 250, // Cap delay at 250ms
        strategy: RetryStrategy.EXPONENTIAL_BACKOFF,
        backoffMultiplier: 2,
        jitterFactor: 0,
        onRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      await policy.execute(failingOperation);

      expect(onRetry).toHaveBeenCalledTimes(4);
      expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1, 100); // 100
      expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2, 200); // 200
      expect(onRetry).toHaveBeenNthCalledWith(3, expect.any(Error), 3, 250); // 400 capped to 250
      expect(onRetry).toHaveBeenNthCalledWith(4, expect.any(Error), 4, 250); // 800 capped to 250
    });

    it('should add jitter to exponential backoff', async () => {
      const onRetry = jest.fn();
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
        backoffMultiplier: 2,
        jitterFactor: 0.1, // 10% jitter
        onRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      await policy.execute(failingOperation);

      expect(onRetry).toHaveBeenCalledTimes(2);
      
      // First retry should be around 100ms ± 10ms jitter
      const firstDelay = onRetry.mock.calls[0][2];
      expect(firstDelay).toBeGreaterThanOrEqual(100);
      expect(firstDelay).toBeLessThanOrEqual(110);

      // Second retry should be around 200ms ± 20ms jitter
      const secondDelay = onRetry.mock.calls[1][2];
      expect(secondDelay).toBeGreaterThanOrEqual(200);
      expect(secondDelay).toBeLessThanOrEqual(220);
    });
  });

  describe('Custom Retry Logic', () => {
    it('should use custom shouldRetry function', async () => {
      const shouldRetry = jest.fn().mockReturnValue(false); // Never retry
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0,
        shouldRetry
      });

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      const result = await policy.execute(failingOperation);

      expect(result.succeeded).toBe(false);
      expect(result.metrics.totalAttempts).toBe(1); // No retries
      expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 1);
      expect(failingOperation).toHaveBeenCalledTimes(1);
    });

    it('should call callbacks correctly', async () => {
      const onRetry = jest.fn();
      const onFailure = jest.fn();
      const onSuccess = jest.fn();

      const policy = new RetryPolicy({
        maxAttempts: 2,
        initialDelay: 10,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0,
        onRetry,
        onFailure,
        onSuccess
      });

      // Test successful operation
      const successOperation = jest.fn().mockResolvedValue('success');
      await policy.execute(successOperation);

      expect(onSuccess).toHaveBeenCalledWith('success', 1);
      expect(onRetry).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();

      // Reset mocks
      onSuccess.mockClear();
      onRetry.mockClear();
      onFailure.mockClear();

      // Test failing operation
      const failOperation = jest.fn().mockRejectedValue(new Error('Fail'));
      await policy.execute(failOperation);

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onFailure).toHaveBeenCalledWith(expect.any(Error), 2);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Timeouts', () => {
    it('should timeout individual attempts', async () => {
      const policy = new RetryPolicy({
        maxAttempts: 2,
        initialDelay: 10,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0,
        attemptTimeout: 50 // 50ms timeout per attempt
      });

      const slowOperation = jest.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve('success'), 100)); // Takes 100ms
      });

      const result = await policy.execute(slowOperation);

      expect(result.succeeded).toBe(false);
      expect(result.finalError?.message).toContain('timed out');
    });

    it('should timeout globally', async () => {
      const policy = new RetryPolicy({
        maxAttempts: 5,
        initialDelay: 100,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0,
        globalTimeout: 80 // Shorter timeout than operation
      });

      const slowOperation = jest.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve('success'), 100)); // Takes longer than timeout
      });

      const result = await policy.execute(slowOperation);

      expect(result.succeeded).toBe(false);
      expect(result.finalError?.message).toContain('Global timeout');
    });
  });

  describe('Synchronous Operations', () => {
    it('should handle synchronous operations', () => {
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 1, // Very short delay for sync test
        maxDelay: 10,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0
      });

      let attemptCount = 0;
      const eventuallySucessfulOperation = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error(`Failure ${attemptCount}`);
        }
        return 'success';
      });

      const result = policy.executeSync(eventuallySucessfulOperation);

      expect(result.succeeded).toBe(true);
      expect(result.result).toBe('success');
      expect(result.metrics.totalAttempts).toBe(3);
      expect(eventuallySucessfulOperation).toHaveBeenCalledTimes(3);
    });
  });

  describe('Rate Limiting Integration', () => {
    it('should respect rate limits during retries', async () => {
      const rateLimiter = new RateLimiter(2, 1000); // 2 requests per second
      const policy = new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 10,
        maxDelay: 1000,
        strategy: RetryStrategy.FIXED_DELAY,
        backoffMultiplier: 2,
        jitterFactor: 0
      }, rateLimiter);

      const failingOperation = jest.fn().mockRejectedValue(new Error('Fail'));

      const startTime = Date.now();
      await policy.execute(failingOperation);
      const endTime = Date.now();

      // Should take at least 1 second due to rate limiting after 2 attempts
      expect(endTime - startTime).toBeGreaterThan(1000);
      expect(failingOperation).toHaveBeenCalledTimes(3);
    });
  });
});

describe('RetryPolicies', () => {
  describe('Predefined Policies', () => {
    it('should create conservative policy', () => {
      const policy = RetryPolicies.conservative();
      expect(policy).toBeInstanceOf(RetryPolicy);
    });

    it('should create aggressive policy', () => {
      const policy = RetryPolicies.aggressive();
      expect(policy).toBeInstanceOf(RetryPolicy);
    });

    it('should create quick policy', () => {
      const policy = RetryPolicies.quick();
      expect(policy).toBeInstanceOf(RetryPolicy);
    });

    it('should create network policy with rate limiting', () => {
      const policy = RetryPolicies.network(30); // 30 requests per minute
      expect(policy).toBeInstanceOf(RetryPolicy);
    });

    it('should create database policy', () => {
      const policy = RetryPolicies.database();
      expect(policy).toBeInstanceOf(RetryPolicy);
    });
  });

  describe('Network Policy Specific Behavior', () => {
    it('should retry on network errors', async () => {
      const policy = RetryPolicies.network();
      
      const networkError = new NetworkError('Connection failed');
      const failThenSucceedOperation = jest.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue('success');

      const result = await policy.execute(failThenSucceedOperation);

      expect(result.succeeded).toBe(true);
      expect(result.result).toBe('success');
      expect(result.metrics.totalAttempts).toBe(2);
    });
  });

  describe('Database Policy Specific Behavior', () => {
    it('should retry on database connection errors', async () => {
      const policy = RetryPolicies.database();
      
      const dbError = new Error('Connection timeout');
      const failThenSucceedOperation = jest.fn()
        .mockRejectedValueOnce(dbError)
        .mockResolvedValue('success');

      const result = await policy.execute(failThenSucceedOperation);

      expect(result.succeeded).toBe(true);
      expect(result.result).toBe('success');
      expect(result.metrics.totalAttempts).toBe(2);
    });

    it('should not retry on non-transient database errors', async () => {
      const policy = RetryPolicies.database();
      
      const validationError = new Error('Invalid SQL syntax');
      const alwaysFailingOperation = jest.fn().mockRejectedValue(validationError);

      const result = await policy.execute(alwaysFailingOperation);

      expect(result.succeeded).toBe(false);
      expect(result.metrics.totalAttempts).toBe(1); // No retries
    });
  });
});

describe('WithRetry Decorator', () => {
  it('should apply retry logic to methods', async () => {
    const policy = new RetryPolicy({
      maxAttempts: 3,
      initialDelay: 10,
      maxDelay: 1000,
      strategy: RetryStrategy.FIXED_DELAY,
      backoffMultiplier: 2,
      jitterFactor: 0
    });

    class TestService {
      private attemptCount = 0;

      async flakyMethod(): Promise<string> {
        this.attemptCount++;
        if (this.attemptCount < 3) {
          throw new Error(`Attempt ${this.attemptCount} failed`);
        }
        return 'success';
      }
    }

    const service = new TestService();
    const decoratedMethod = WithRetry(policy)(service, 'flakyMethod', {
      value: service.flakyMethod.bind(service),
      writable: true,
      enumerable: true,
      configurable: true
    });

    const result = await decoratedMethod.value();
    expect(result).toBe('success');
  });
});

describe('createRetryPolicy Utility', () => {
  it('should create policy with default settings', () => {
    const policy = createRetryPolicy();
    expect(policy).toBeInstanceOf(RetryPolicy);
  });

  it('should create policy with custom overrides', () => {
    const policy = createRetryPolicy({
      maxAttempts: 5,
      initialDelay: 500
    });
    expect(policy).toBeInstanceOf(RetryPolicy);
  });
});

describe('Retry Performance', () => {
  it('should handle high-frequency retry scenarios', async () => {
    const policy = new RetryPolicy({
      maxAttempts: 2,
      initialDelay: 1,
      maxDelay: 10,
      strategy: RetryStrategy.FIXED_DELAY,
      backoffMultiplier: 2,
      jitterFactor: 0
    });

    const operations = Array.from({ length: 100 }, (_, i) => {
      return policy.execute(async () => {
        if (i % 2 === 0) {
          throw new Error(`Failure ${i}`);
        }
        return `Success ${i}`;
      });
    });

    const results = await Promise.all(operations);
    
    const successes = results.filter(r => r.succeeded).length;
    const failures = results.filter(r => !r.succeeded).length;

    expect(successes + failures).toBe(100);
    expect(successes).toBe(50); // Half should succeed immediately
  });

  it('should create retry policies efficiently', () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      createRetryPolicy({
        maxAttempts: i % 5 + 1,
        initialDelay: (i % 10 + 1) * 100
      });
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should create 1000 policies in less than 50ms
    expect(duration).toBeLessThan(50);
  });
});
