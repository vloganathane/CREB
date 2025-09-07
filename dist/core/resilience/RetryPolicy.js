/**
 * Retry Policy Implementation for CREB-JS
 * Provides intelligent retry strategies with exponential backoff, jitter, and rate limiting
 */
import { CREBError, ErrorCategory, ErrorSeverity, ErrorUtils } from '../errors/CREBError';
export var RetryStrategy;
(function (RetryStrategy) {
    RetryStrategy["FIXED_DELAY"] = "FIXED_DELAY";
    RetryStrategy["LINEAR_BACKOFF"] = "LINEAR_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF"] = "EXPONENTIAL_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF_JITTER"] = "EXPONENTIAL_BACKOFF_JITTER";
})(RetryStrategy || (RetryStrategy = {}));
/**
 * Rate limiter to respect API rate limits during retries
 */
export class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    /**
     * Check if a request can be made within rate limits
     */
    canMakeRequest() {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => time > windowStart);
        return this.requests.length < this.maxRequests;
    }
    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest() {
        if (this.canMakeRequest()) {
            return 0;
        }
        const oldestRequest = Math.min(...this.requests);
        const windowStart = Date.now() - this.windowMs;
        return Math.max(0, oldestRequest - windowStart);
    }
    /**
     * Reset the rate limiter
     */
    reset() {
        this.requests = [];
    }
}
/**
 * Retry Policy implementation with intelligent backoff strategies
 */
export class RetryPolicy {
    constructor(config, rateLimiter) {
        // Default configuration with proper typing
        const defaultConfig = {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 30000,
            strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Default retry logic - retry on any error (except for specific non-retryable ones)
                // If it's a CREB error, use its retryable flag
                if (error instanceof CREBError) {
                    return error.isRetryable();
                }
                // For other errors, retry unless they're clearly non-retryable
                const message = error?.message || String(error);
                const nonRetryablePatterns = [
                    /authorization/i,
                    /forbidden/i,
                    /401/,
                    /403/,
                    /404/,
                    /validation/i,
                    /syntax/i
                ];
                return !nonRetryablePatterns.some(pattern => pattern.test(message));
            },
            onRetry: () => { },
            onFailure: () => { },
            onSuccess: () => { }
        };
        this.config = {
            ...defaultConfig,
            ...config
        };
        this.rateLimiter = rateLimiter;
    }
    /**
     * Execute a function with retry logic
     */
    async execute(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        // Global timeout setup
        let globalTimeoutId;
        let globalTimeoutPromise;
        if (this.config.globalTimeout) {
            globalTimeoutPromise = new Promise((_, reject) => {
                globalTimeoutId = setTimeout(() => {
                    reject(new CREBError(`Global timeout of ${this.config.globalTimeout}ms exceeded`, ErrorCategory.TIMEOUT, ErrorSeverity.HIGH, { globalTimeout: this.config.globalTimeout, attempt }));
                }, this.config.globalTimeout);
            });
        }
        try {
            while (attempt <= this.config.maxAttempts) {
                try {
                    // Check rate limits
                    if (this.rateLimiter) {
                        while (!this.rateLimiter.canMakeRequest()) {
                            const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                            if (waitTime > 0) {
                                await this.delay(waitTime);
                            }
                        }
                        this.rateLimiter.recordRequest();
                    }
                    // Execute with timeout if specified
                    let result;
                    if (this.config.attemptTimeout) {
                        const timeoutPromise = this.createTimeoutPromise(this.config.attemptTimeout, attempt);
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        promises.push(timeoutPromise);
                        result = await Promise.race(promises);
                    }
                    else {
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        result = await Promise.race(promises);
                    }
                    // Success!
                    const executionTime = Date.now() - startTime;
                    const metrics = {
                        totalAttempts: attempt,
                        successfulAttempts: 1,
                        failedAttempts: attempt - 1,
                        averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                        totalDelay,
                        executionTime
                    };
                    this.config.onSuccess(result, attempt);
                    return {
                        result,
                        metrics,
                        succeeded: true
                    };
                }
                catch (error) {
                    lastError = error;
                    // Check if we should retry
                    if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                        break;
                    }
                    // Calculate delay for next attempt
                    const delay = this.calculateDelay(attempt);
                    delays.push(delay);
                    totalDelay += delay;
                    this.config.onRetry(error, attempt, delay);
                    // Wait before next attempt
                    await this.delay(delay);
                    attempt++;
                }
            }
            // All retries exhausted
            const executionTime = Date.now() - startTime;
            const metrics = {
                totalAttempts: attempt,
                successfulAttempts: 0,
                failedAttempts: attempt,
                averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                totalDelay,
                lastError,
                executionTime
            };
            this.config.onFailure(lastError, attempt);
            return {
                result: undefined,
                metrics,
                succeeded: false,
                finalError: lastError
            };
        }
        finally {
            if (globalTimeoutId) {
                clearTimeout(globalTimeoutId);
            }
        }
    }
    /**
     * Execute a synchronous function with retry logic
     */
    executeSync(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        while (attempt <= this.config.maxAttempts) {
            try {
                // Check rate limits (blocking)
                if (this.rateLimiter) {
                    while (!this.rateLimiter.canMakeRequest()) {
                        const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                        if (waitTime > 0) {
                            // Synchronous delay (not recommended for production)
                            const start = Date.now();
                            while (Date.now() - start < waitTime) {
                                // Busy wait
                            }
                        }
                    }
                    this.rateLimiter.recordRequest();
                }
                const result = fn();
                // Success!
                const executionTime = Date.now() - startTime;
                const metrics = {
                    totalAttempts: attempt,
                    successfulAttempts: 1,
                    failedAttempts: attempt - 1,
                    averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                    totalDelay,
                    executionTime
                };
                this.config.onSuccess(result, attempt);
                return {
                    result,
                    metrics,
                    succeeded: true
                };
            }
            catch (error) {
                lastError = error;
                // Check if we should retry
                if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                    break;
                }
                // Calculate delay for next attempt
                const delay = this.calculateDelay(attempt);
                delays.push(delay);
                totalDelay += delay;
                this.config.onRetry(error, attempt, delay);
                // Synchronous delay (not recommended for production)
                const start = Date.now();
                while (Date.now() - start < delay) {
                    // Busy wait
                }
                attempt++;
            }
        }
        // All retries exhausted
        const executionTime = Date.now() - startTime;
        const metrics = {
            totalAttempts: attempt,
            successfulAttempts: 0,
            failedAttempts: attempt,
            averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
            totalDelay,
            lastError,
            executionTime
        };
        this.config.onFailure(lastError, attempt);
        return {
            result: undefined,
            metrics,
            succeeded: false,
            finalError: lastError
        };
    }
    calculateDelay(attempt) {
        let delay;
        switch (this.config.strategy) {
            case RetryStrategy.FIXED_DELAY:
                delay = this.config.initialDelay;
                break;
            case RetryStrategy.LINEAR_BACKOFF:
                delay = this.config.initialDelay * attempt;
                break;
            case RetryStrategy.EXPONENTIAL_BACKOFF:
                delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                break;
            case RetryStrategy.EXPONENTIAL_BACKOFF_JITTER:
                const exponentialDelay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                const jitter = exponentialDelay * this.config.jitterFactor * Math.random();
                delay = exponentialDelay + jitter;
                break;
            default:
                delay = this.config.initialDelay;
        }
        // Cap at maximum delay
        return Math.min(delay, this.config.maxDelay);
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    createTimeoutPromise(timeoutMs, attempt) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new CREBError(`Attempt ${attempt} timed out after ${timeoutMs}ms`, ErrorCategory.TIMEOUT, ErrorSeverity.MEDIUM, { attemptTimeout: timeoutMs, attempt }));
            }, timeoutMs);
        });
    }
}
/**
 * Predefined retry policies for common scenarios
 */
export class RetryPolicies {
    /**
     * Conservative retry policy for critical operations
     */
    static conservative() {
        return new RetryPolicy({
            maxAttempts: 2,
            initialDelay: 2000,
            maxDelay: 10000,
            strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1
        });
    }
    /**
     * Aggressive retry policy for non-critical operations
     */
    static aggressive() {
        return new RetryPolicy({
            maxAttempts: 5,
            initialDelay: 500,
            maxDelay: 30000,
            strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.2
        });
    }
    /**
     * Quick retry policy for fast operations
     */
    static quick() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 100,
            maxDelay: 1000,
            strategy: RetryStrategy.LINEAR_BACKOFF,
            backoffMultiplier: 1.5,
            jitterFactor: 0.1
        });
    }
    /**
     * Network-specific retry policy with rate limiting
     */
    static network(maxRequestsPerMinute = 60) {
        const rateLimiter = new RateLimiter(maxRequestsPerMinute, 60000);
        return new RetryPolicy({
            maxAttempts: 4,
            initialDelay: 1000,
            maxDelay: 20000,
            strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.15,
            shouldRetry: (error, attempt) => {
                // Retry on network errors, timeouts, and 5xx status codes
                if (error instanceof CREBError) {
                    return error.isRetryable() && attempt < 4;
                }
                return ErrorUtils.isTransientError(error) && attempt < 4;
            }
        }, rateLimiter);
    }
    /**
     * Database-specific retry policy
     */
    static database() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 500,
            maxDelay: 5000,
            strategy: RetryStrategy.EXPONENTIAL_BACKOFF,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Common database transient errors
                const message = error?.message?.toLowerCase() || '';
                const transientPatterns = [
                    'connection',
                    'timeout',
                    'deadlock',
                    'lock timeout',
                    'temporary failure'
                ];
                return transientPatterns.some(pattern => message.includes(pattern)) && attempt < 3;
            }
        });
    }
}
/**
 * Decorator for automatic retry functionality
 */
export function WithRetry(policy) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await policy.execute(() => originalMethod.apply(this, args));
            if (result.succeeded) {
                return result.result;
            }
            else {
                throw result.finalError;
            }
        };
        return descriptor;
    };
}
/**
 * Utility function to create a retry policy with default settings
 */
export function createRetryPolicy(overrides = {}) {
    return new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
        ...overrides
    });
}
//# sourceMappingURL=RetryPolicy.js.map