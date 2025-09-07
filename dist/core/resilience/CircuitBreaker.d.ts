/**
 * Circuit Breaker Pattern Implementation for CREB-JS
 * Prevents cascading failures by monitoring and controlling access to external resources
 */
export declare enum CircuitBreakerState {
    CLOSED = "CLOSED",// Normal operation
    OPEN = "OPEN",// Failing, rejecting calls
    HALF_OPEN = "HALF_OPEN"
}
export interface CircuitBreakerConfig {
    /** Number of failures before opening the circuit */
    failureThreshold: number;
    /** Percentage of failures (0-100) before opening the circuit */
    failureRate: number;
    /** Time window for measuring failures (ms) */
    monitoringWindow: number;
    /** Time to wait before attempting recovery (ms) */
    timeout: number;
    /** Number of successful calls needed to close circuit from half-open */
    successThreshold: number;
    /** Minimum number of calls required before calculating failure rate */
    minimumCalls: number;
    /** Function to determine if an error should count as a failure */
    isFailure?: (error: any) => boolean;
    /** Function called when circuit state changes */
    onStateChange?: (state: CircuitBreakerState, previous: CircuitBreakerState) => void;
    /** Function called when circuit breaker trips */
    onCircuitOpen?: (error: any) => void;
    /** Function called when circuit breaker recovers */
    onCircuitClose?: () => void;
}
export interface CircuitBreakerMetrics {
    state: CircuitBreakerState;
    failureCount: number;
    successCount: number;
    totalCalls: number;
    failureRate: number;
    lastFailureTime?: Date;
    lastSuccessTime?: Date;
    stateChangedAt: Date;
    timeSinceStateChange: number;
    nextAttemptTime?: Date;
}
/**
 * Circuit Breaker implementation for fault tolerance
 */
export declare class CircuitBreaker {
    private readonly name;
    private state;
    private failureCount;
    private successCount;
    private lastFailureTime?;
    private lastSuccessTime?;
    private stateChangedAt;
    private nextAttemptTime?;
    private callHistory;
    private readonly config;
    constructor(name: string, config: CircuitBreakerConfig);
    /**
     * Execute a function with circuit breaker protection
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
    /**
     * Execute a synchronous function with circuit breaker protection
     */
    executeSync<T>(fn: () => T): T;
    /**
     * Get current circuit breaker metrics
     */
    getMetrics(): CircuitBreakerMetrics;
    /**
     * Reset the circuit breaker to closed state
     */
    reset(): void;
    /**
     * Force the circuit breaker to open state
     */
    trip(): void;
    /**
     * Check if the circuit breaker is currently open
     */
    isOpen(): boolean;
    /**
     * Check if the circuit breaker is currently half-open
     */
    isHalfOpen(): boolean;
    /**
     * Check if the circuit breaker is currently closed
     */
    isClosed(): boolean;
    private onSuccess;
    private onFailure;
    private shouldOpenCircuit;
    private shouldAttemptReset;
    private setState;
    private setNextAttemptTime;
    private recordCall;
    private getRecentCalls;
}
/**
 * Circuit Breaker Manager for handling multiple circuit breakers
 */
export declare class CircuitBreakerManager {
    private breakers;
    /**
     * Create or get a circuit breaker for a service
     */
    getBreaker(name: string, config?: CircuitBreakerConfig): CircuitBreaker;
    /**
     * Remove a circuit breaker
     */
    removeBreaker(name: string): boolean;
    /**
     * Get metrics for all circuit breakers
     */
    getAllMetrics(): Record<string, CircuitBreakerMetrics>;
    /**
     * Reset all circuit breakers
     */
    resetAll(): void;
    /**
     * Get health status of all services
     */
    getHealthStatus(): {
        healthy: string[];
        degraded: string[];
        failed: string[];
        total: number;
    };
}
export declare const circuitBreakerManager: CircuitBreakerManager;
/**
 * Decorator for automatic circuit breaker protection
 */
export declare function WithCircuitBreaker(name: string, config?: CircuitBreakerConfig): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=CircuitBreaker.d.ts.map