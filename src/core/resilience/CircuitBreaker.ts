/**
 * Circuit Breaker Pattern Implementation for CREB-JS
 * Prevents cascading failures by monitoring and controlling access to external resources
 */

import { CREBError, ErrorCategory, ErrorSeverity, ExternalAPIError, SystemError } from '../errors/CREBError';

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, rejecting calls
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
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

interface CallRecord {
  timestamp: number;
  success: boolean;
  duration: number;
  error?: any;
}

/**
 * Circuit Breaker implementation for fault tolerance
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private stateChangedAt: Date = new Date();
  private nextAttemptTime?: Date;
  private callHistory: CallRecord[] = [];
  private readonly config: Required<CircuitBreakerConfig>;

  constructor(
    private readonly name: string,
    config: CircuitBreakerConfig
  ) {
    // Default configuration
    const defaultConfig: Required<CircuitBreakerConfig> = {
      failureThreshold: 5,
      failureRate: 50,
      monitoringWindow: 60000, // 1 minute
      timeout: 30000, // 30 seconds
      successThreshold: 3,
      minimumCalls: 10,
      isFailure: (error: any) => true, // All errors count as failures by default
      onStateChange: () => {},
      onCircuitOpen: () => {},
      onCircuitClose: () => {}
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
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.setState(CircuitBreakerState.HALF_OPEN);
      } else {
        throw new ExternalAPIError(
          `Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`,
          this.name,
          {
            circuitBreakerState: this.state,
            nextAttemptTime: this.nextAttemptTime
          },
          {
            rateLimited: false,
            statusCode: 503
          }
        );
      }
    }

    const startTime = Date.now();
    try {
      const result = await fn();
      this.onSuccess(Date.now() - startTime);
      return result;
    } catch (error) {
      this.onFailure(error, Date.now() - startTime);
      throw error;
    }
  }

  /**
   * Execute a synchronous function with circuit breaker protection
   */
  executeSync<T>(fn: () => T): T {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.setState(CircuitBreakerState.HALF_OPEN);
      } else {
        throw new ExternalAPIError(
          `Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`,
          this.name,
          {
            circuitBreakerState: this.state,
            nextAttemptTime: this.nextAttemptTime
          },
          {
            rateLimited: false,
            statusCode: 503
          }
        );
      }
    }

    const startTime = Date.now();
    try {
      const result = fn();
      this.onSuccess(Date.now() - startTime);
      return result;
    } catch (error) {
      this.onFailure(error, Date.now() - startTime);
      throw error;
    }
  }

  /**
   * Get current circuit breaker metrics
   */
  getMetrics(): CircuitBreakerMetrics {
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
  reset(): void {
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
  trip(): void {
    this.setState(CircuitBreakerState.OPEN);
    this.setNextAttemptTime();
    this.config.onCircuitOpen(new Error('Circuit breaker manually tripped'));
  }

  /**
   * Check if the circuit breaker is currently open
   */
  isOpen(): boolean {
    return this.state === CircuitBreakerState.OPEN;
  }

  /**
   * Check if the circuit breaker is currently half-open
   */
  isHalfOpen(): boolean {
    return this.state === CircuitBreakerState.HALF_OPEN;
  }

  /**
   * Check if the circuit breaker is currently closed
   */
  isClosed(): boolean {
    return this.state === CircuitBreakerState.CLOSED;
  }

  private onSuccess(duration: number): void {
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

  private onFailure(error: any, duration: number): void {
    if (this.config.isFailure(error)) {
      this.recordCall(false, duration, error);
      this.failureCount++;
      this.lastFailureTime = new Date();

      if (this.state === CircuitBreakerState.HALF_OPEN) {
        this.setState(CircuitBreakerState.OPEN);
        this.setNextAttemptTime();
        this.config.onCircuitOpen(error);
      } else if (this.state === CircuitBreakerState.CLOSED && this.shouldOpenCircuit()) {
        this.setState(CircuitBreakerState.OPEN);
        this.setNextAttemptTime();
        this.config.onCircuitOpen(error);
      }
    }
  }

  private shouldOpenCircuit(): boolean {
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

  private shouldAttemptReset(): boolean {
    return this.nextAttemptTime ? Date.now() >= this.nextAttemptTime.getTime() : false;
  }

  private setState(newState: CircuitBreakerState): void {
    const previousState = this.state;
    if (previousState !== newState) {
      this.state = newState;
      this.stateChangedAt = new Date();
      
      // Reset counters on state change
      if (newState === CircuitBreakerState.CLOSED) {
        this.failureCount = 0;
        this.successCount = 0;
      } else if (newState === CircuitBreakerState.HALF_OPEN) {
        this.successCount = 0;
      }

      this.config.onStateChange(newState, previousState);
    }
  }

  private setNextAttemptTime(): void {
    this.nextAttemptTime = new Date(Date.now() + this.config.timeout);
  }

  private recordCall(success: boolean, duration: number, error?: any): void {
    const record: CallRecord = {
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

  private getRecentCalls(): CallRecord[] {
    const cutoff = Date.now() - this.config.monitoringWindow;
    return this.callHistory.filter(call => call.timestamp >= cutoff);
  }
}

/**
 * Circuit Breaker Manager for handling multiple circuit breakers
 */
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Create or get a circuit breaker for a service
   */
  getBreaker(name: string, config?: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(name)) {
      if (!config) {
        throw new SystemError(
          `Circuit breaker configuration required for new service: ${name}`,
          { service: name },
          { subsystem: 'CircuitBreakerManager' }
        );
      }
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  /**
   * Remove a circuit breaker
   */
  removeBreaker(name: string): boolean {
    return this.breakers.delete(name);
  }

  /**
   * Get metrics for all circuit breakers
   */
  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    for (const [name, breaker] of this.breakers) {
      metrics[name] = breaker.getMetrics();
    }
    return metrics;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /**
   * Get health status of all services
   */
  getHealthStatus(): {
    healthy: string[];
    degraded: string[];
    failed: string[];
    total: number;
  } {
    const healthy: string[] = [];
    const degraded: string[] = [];
    const failed: string[] = [];

    for (const [name, breaker] of this.breakers) {
      const metrics = breaker.getMetrics();
      
      if (metrics.state === CircuitBreakerState.CLOSED) {
        if (metrics.failureRate < 10) {
          healthy.push(name);
        } else {
          degraded.push(name);
        }
      } else {
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
export function WithCircuitBreaker(name: string, config?: CircuitBreakerConfig) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const breaker = circuitBreakerManager.getBreaker(name, config);
      return breaker.execute(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
