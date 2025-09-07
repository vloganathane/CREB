/**
 * Circuit Breaker Pattern Implementation for CREB-JS
 * Prevents cascading failures by monitoring and controlling access to external resources
 */
import { ExternalAPIError, SystemError } from '../errors/CREBError';
export var CircuitBreakerState;
(function (CircuitBreakerState) {
    CircuitBreakerState["CLOSED"] = "CLOSED";
    CircuitBreakerState["OPEN"] = "OPEN";
    CircuitBreakerState["HALF_OPEN"] = "HALF_OPEN"; // Testing if service recovered
})(CircuitBreakerState || (CircuitBreakerState = {}));
/**
 * Circuit Breaker implementation for fault tolerance
 */
export class CircuitBreaker {
    constructor(name, config) {
        this.name = name;
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.stateChangedAt = new Date();
        this.callHistory = [];
        // Default configuration
        const defaultConfig = {
            failureThreshold: 5,
            failureRate: 50,
            monitoringWindow: 60000, // 1 minute
            timeout: 30000, // 30 seconds
            successThreshold: 3,
            minimumCalls: 10,
            isFailure: (error) => true, // All errors count as failures by default
            onStateChange: () => { },
            onCircuitOpen: () => { },
            onCircuitClose: () => { }
        };
        // Merge with provided config
        this.config = {
            ...defaultConfig,
            ...config
        };
    }
    /**
     * Execute a function with circuit breaker protection
     */
    async execute(fn) {
        if (this.state === CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = await fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Execute a synchronous function with circuit breaker protection
     */
    executeSync(fn) {
        if (this.state === CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Get current circuit breaker metrics
     */
    getMetrics() {
        const now = Date.now();
        const recentCalls = this.getRecentCalls();
        const totalCalls = recentCalls.length;
        const failures = recentCalls.filter(call => !call.success).length;
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            totalCalls,
            failureRate: totalCalls > 0 ? (failures / totalCalls) * 100 : 0,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            stateChangedAt: this.stateChangedAt,
            timeSinceStateChange: now - this.stateChangedAt.getTime(),
            nextAttemptTime: this.nextAttemptTime
        };
    }
    /**
     * Reset the circuit breaker to closed state
     */
    reset() {
        this.setState(CircuitBreakerState.CLOSED);
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = undefined;
        this.nextAttemptTime = undefined;
        this.callHistory = [];
    }
    /**
     * Force the circuit breaker to open state
     */
    trip() {
        this.setState(CircuitBreakerState.OPEN);
        this.setNextAttemptTime();
        this.config.onCircuitOpen(new Error('Circuit breaker manually tripped'));
    }
    /**
     * Check if the circuit breaker is currently open
     */
    isOpen() {
        return this.state === CircuitBreakerState.OPEN;
    }
    /**
     * Check if the circuit breaker is currently half-open
     */
    isHalfOpen() {
        return this.state === CircuitBreakerState.HALF_OPEN;
    }
    /**
     * Check if the circuit breaker is currently closed
     */
    isClosed() {
        return this.state === CircuitBreakerState.CLOSED;
    }
    onSuccess(duration) {
        this.recordCall(true, duration);
        this.successCount++;
        this.lastSuccessTime = new Date();
        if (this.state === CircuitBreakerState.HALF_OPEN) {
            if (this.successCount >= this.config.successThreshold) {
                this.setState(CircuitBreakerState.CLOSED);
                this.failureCount = 0;
                this.config.onCircuitClose();
            }
        }
    }
    onFailure(error, duration) {
        if (this.config.isFailure(error)) {
            this.recordCall(false, duration, error);
            this.failureCount++;
            this.lastFailureTime = new Date();
            if (this.state === CircuitBreakerState.HALF_OPEN) {
                this.setState(CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
            else if (this.state === CircuitBreakerState.CLOSED && this.shouldOpenCircuit()) {
                this.setState(CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
        }
    }
    shouldOpenCircuit() {
        const recentCalls = this.getRecentCalls();
        // Check if we have minimum number of calls
        if (recentCalls.length < this.config.minimumCalls) {
            return false;
        }
        // Check failure count threshold
        if (this.failureCount >= this.config.failureThreshold) {
            return true;
        }
        // Check failure rate threshold
        const failures = recentCalls.filter(call => !call.success).length;
        const failureRate = (failures / recentCalls.length) * 100;
        return failureRate >= this.config.failureRate;
    }
    shouldAttemptReset() {
        return this.nextAttemptTime ? Date.now() >= this.nextAttemptTime.getTime() : false;
    }
    setState(newState) {
        const previousState = this.state;
        if (previousState !== newState) {
            this.state = newState;
            this.stateChangedAt = new Date();
            // Reset counters on state change
            if (newState === CircuitBreakerState.CLOSED) {
                this.failureCount = 0;
                this.successCount = 0;
            }
            else if (newState === CircuitBreakerState.HALF_OPEN) {
                this.successCount = 0;
            }
            this.config.onStateChange(newState, previousState);
        }
    }
    setNextAttemptTime() {
        this.nextAttemptTime = new Date(Date.now() + this.config.timeout);
    }
    recordCall(success, duration, error) {
        const record = {
            timestamp: Date.now(),
            success,
            duration,
            error
        };
        this.callHistory.push(record);
        // Keep only recent calls within monitoring window
        const cutoff = Date.now() - this.config.monitoringWindow;
        this.callHistory = this.callHistory.filter(call => call.timestamp >= cutoff);
    }
    getRecentCalls() {
        const cutoff = Date.now() - this.config.monitoringWindow;
        return this.callHistory.filter(call => call.timestamp >= cutoff);
    }
}
/**
 * Circuit Breaker Manager for handling multiple circuit breakers
 */
export class CircuitBreakerManager {
    constructor() {
        this.breakers = new Map();
    }
    /**
     * Create or get a circuit breaker for a service
     */
    getBreaker(name, config) {
        if (!this.breakers.has(name)) {
            if (!config) {
                throw new SystemError(`Circuit breaker configuration required for new service: ${name}`, { service: name }, { subsystem: 'CircuitBreakerManager' });
            }
            this.breakers.set(name, new CircuitBreaker(name, config));
        }
        return this.breakers.get(name);
    }
    /**
     * Remove a circuit breaker
     */
    removeBreaker(name) {
        return this.breakers.delete(name);
    }
    /**
     * Get metrics for all circuit breakers
     */
    getAllMetrics() {
        const metrics = {};
        for (const [name, breaker] of this.breakers) {
            metrics[name] = breaker.getMetrics();
        }
        return metrics;
    }
    /**
     * Reset all circuit breakers
     */
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
    /**
     * Get health status of all services
     */
    getHealthStatus() {
        const healthy = [];
        const degraded = [];
        const failed = [];
        for (const [name, breaker] of this.breakers) {
            const metrics = breaker.getMetrics();
            if (metrics.state === CircuitBreakerState.CLOSED) {
                if (metrics.failureRate < 10) {
                    healthy.push(name);
                }
                else {
                    degraded.push(name);
                }
            }
            else {
                failed.push(name);
            }
        }
        return {
            healthy,
            degraded,
            failed,
            total: this.breakers.size
        };
    }
}
// Global circuit breaker manager instance
export const circuitBreakerManager = new CircuitBreakerManager();
/**
 * Decorator for automatic circuit breaker protection
 */
export function WithCircuitBreaker(name, config) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const breaker = circuitBreakerManager.getBreaker(name, config);
            return breaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
}
//# sourceMappingURL=CircuitBreaker.js.map