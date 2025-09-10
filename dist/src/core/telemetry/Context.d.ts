/**
 * @fileoverview Context Management and Propagation
 * @module @creb/core/telemetry/Context
 * @version 1.0.0
 * @author CREB Team
 *
 * Provides context propagation for correlation IDs and logging context
 * across async operations and module boundaries.
 */
import { LogContext, CorrelationId, ContextProvider, Timestamp } from './types';
/**
 * Context Manager class for managing logging context and correlation IDs
 */
export declare class ContextManager implements ContextProvider {
    private static instance;
    private defaultContext;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): ContextManager;
    /**
     * Get current context from async storage
     */
    getContext(): LogContext;
    /**
     * Set context in current async context
     */
    setContext(context: Partial<LogContext>): void;
    /**
     * Create child context with inheritance
     */
    createChild(context: Partial<LogContext>): ContextProvider;
    /**
     * Clear current context
     */
    clear(): void;
    /**
     * Get current correlation ID
     */
    getCorrelationId(): CorrelationId;
    /**
     * Set correlation ID
     */
    setCorrelationId(id: CorrelationId): void;
    /**
     * Run function with specific context
     */
    runWithContext<T>(context: Partial<LogContext>, fn: () => T, correlationId?: CorrelationId): T;
    /**
     * Run async function with specific context
     */
    runWithContextAsync<T>(context: Partial<LogContext>, fn: () => Promise<T>, correlationId?: CorrelationId): Promise<T>;
    /**
     * Get context trace (current + parent contexts)
     */
    getContextTrace(): ContextTrace;
    /**
     * Generate new correlation ID
     */
    private generateCorrelationId;
    /**
     * Get current state or create default
     */
    private getCurrentState;
    /**
     * Create default context state
     */
    private createDefaultState;
    /**
     * Calculate context depth for tracing
     */
    private calculateDepth;
}
/**
 * Context trace information
 */
export interface ContextTrace {
    current: CorrelationId;
    parent?: CorrelationId;
    depth: number;
    createdAt: Timestamp;
    context: LogContext;
}
/**
 * Context utilities
 */
export declare class ContextUtils {
    /**
     * Create correlation ID from parts
     */
    static createCorrelationId(prefix?: string, suffix?: string): CorrelationId;
    /**
     * Extract correlation ID from string
     */
    static extractCorrelationId(value: string): CorrelationId | null;
    /**
     * Format correlation ID for display
     */
    static formatCorrelationId(id: CorrelationId, length?: number): string;
    /**
     * Merge contexts with precedence
     */
    static mergeContexts(...contexts: Partial<LogContext>[]): LogContext;
    /**
     * Validate context structure
     */
    static validateContext(context: unknown): context is LogContext;
}
/**
 * Decorator for automatic context propagation
 */
export declare function withContext(context: Partial<LogContext>): <T extends (...args: any[]) => any>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
/**
 * Global context manager instance
 */
export declare const globalContextManager: ContextManager;
/**
 * Convenience functions for common operations
 */
export declare const getCurrentContext: () => LogContext;
export declare const getCurrentCorrelationId: () => CorrelationId;
export declare const setContext: (context: Partial<LogContext>) => void;
export declare const setCorrelationId: (id: CorrelationId) => void;
export declare const runWithContext: <T>(context: Partial<LogContext>, fn: () => T) => T;
export declare const runWithContextAsync: <T>(context: Partial<LogContext>, fn: () => Promise<T>) => Promise<T>;
//# sourceMappingURL=Context.d.ts.map