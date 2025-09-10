/**
 * Retry Policy Implementation for CREB-JS
 * Provides intelligent retry strategies with exponential backoff, jitter, and rate limiting
 */
export declare enum RetryStrategy {
    FIXED_DELAY = "FIXED_DELAY",
    LINEAR_BACKOFF = "LINEAR_BACKOFF",
    EXPONENTIAL_BACKOFF = "EXPONENTIAL_BACKOFF",
    EXPONENTIAL_BACKOFF_JITTER = "EXPONENTIAL_BACKOFF_JITTER"
}
export interface RetryConfig {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Initial delay between retries (ms) */
    initialDelay: number;
    /** Maximum delay between retries (ms) */
    maxDelay: number;
    /** Retry strategy to use */
    strategy: RetryStrategy;
    /** Multiplier for exponential backoff */
    backoffMultiplier: number;
    /** Jitter factor (0-1) for randomizing delays */
    jitterFactor: number;
    /** Function to determine if an error should be retried */
    shouldRetry?: (error: any, attempt: number) => boolean;
    /** Function called before each retry attempt */
    onRetry?: (error: any, attempt: number, delay: number) => void;
    /** Function called when all retries are exhausted */
    onFailure?: (error: any, attempts: number) => void;
    /** Function called when operation succeeds after retries */
    onSuccess?: (result: any, attempts: number) => void;
    /** Timeout for each individual attempt (ms) */
    attemptTimeout?: number;
    /** Global timeout for all attempts (ms) */
    globalTimeout?: number;
}
export interface RetryMetrics {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    averageDelay: number;
    totalDelay: number;
    lastError?: any;
    executionTime: number;
}
export interface RetryResult<T> {
    result: T;
    metrics: RetryMetrics;
    succeeded: boolean;
    finalError?: any;
}
/**
 * Rate limiter to respect API rate limits during retries
 */
export declare class RateLimiter {
    private readonly maxRequests;
    private readonly windowMs;
    private requests;
    constructor(maxRequests: number, windowMs: number);
    /**
     * Check if a request can be made within rate limits
     */
    canMakeRequest(): boolean;
    /**
     * Record a request
     */
    recordRequest(): void;
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest(): number;
    /**
     * Reset the rate limiter
     */
    reset(): void;
}
/**
 * Retry Policy implementation with intelligent backoff strategies
 */
export declare class RetryPolicy {
    private readonly config;
    private rateLimiter?;
    constructor(config: RetryConfig, rateLimiter?: RateLimiter);
    /**
     * Execute a function with retry logic
     */
    execute<T>(fn: () => Promise<T>): Promise<RetryResult<T>>;
    /**
     * Execute a synchronous function with retry logic
     */
    executeSync<T>(fn: () => T): RetryResult<T>;
    private calculateDelay;
    private delay;
    private createTimeoutPromise;
}
/**
 * Predefined retry policies for common scenarios
 */
export declare class RetryPolicies {
    /**
     * Conservative retry policy for critical operations
     */
    static conservative(): RetryPolicy;
    /**
     * Aggressive retry policy for non-critical operations
     */
    static aggressive(): RetryPolicy;
    /**
     * Quick retry policy for fast operations
     */
    static quick(): RetryPolicy;
    /**
     * Network-specific retry policy with rate limiting
     */
    static network(maxRequestsPerMinute?: number): RetryPolicy;
    /**
     * Database-specific retry policy
     */
    static database(): RetryPolicy;
}
/**
 * Decorator for automatic retry functionality
 */
export declare function WithRetry(policy: RetryPolicy): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Utility function to create a retry policy with default settings
 */
export declare function createRetryPolicy(overrides?: Partial<RetryConfig>): RetryPolicy;
//# sourceMappingURL=RetryPolicy.d.ts.map