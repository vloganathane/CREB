/**
 * @fileoverview Context Management and Propagation
 * @module @creb/core/telemetry/Context
 * @version 1.0.0
 * @author CREB Team
 *
 * Provides context propagation for correlation IDs and logging context
 * across async operations and module boundaries.
 */
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { createCorrelationId, createTimestamp } from './types';
/**
 * Context storage using Node.js AsyncLocalStorage for automatic propagation
 */
const contextStorage = new AsyncLocalStorage();
/**
 * Context Manager class for managing logging context and correlation IDs
 */
export class ContextManager {
    constructor() {
        this.defaultContext = {
            operation: 'unknown',
            module: 'creb',
        };
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ContextManager.instance) {
            ContextManager.instance = new ContextManager();
        }
        return ContextManager.instance;
    }
    /**
     * Get current context from async storage
     */
    getContext() {
        const state = contextStorage.getStore();
        if (state) {
            return { ...state.context };
        }
        return { ...this.defaultContext };
    }
    /**
     * Set context in current async context
     */
    setContext(context) {
        const current = this.getCurrentState();
        const updatedContext = { ...current.context, ...context };
        const newState = {
            ...current,
            context: updatedContext,
        };
        // Run in new context with updated state
        contextStorage.run(newState, () => {
            // Context is now set for this async scope
        });
    }
    /**
     * Create child context with inheritance
     */
    createChild(context) {
        const childManager = new ChildContextManager(this, context);
        return childManager;
    }
    /**
     * Clear current context
     */
    clear() {
        contextStorage.run(this.createDefaultState(), () => {
            // Context cleared
        });
    }
    /**
     * Get current correlation ID
     */
    getCorrelationId() {
        const state = contextStorage.getStore();
        return state?.correlationId ?? this.generateCorrelationId();
    }
    /**
     * Set correlation ID
     */
    setCorrelationId(id) {
        const current = this.getCurrentState();
        const newState = {
            ...current,
            correlationId: id,
        };
        contextStorage.run(newState, () => {
            // Correlation ID set
        });
    }
    /**
     * Run function with specific context
     */
    runWithContext(context, fn, correlationId) {
        const currentState = this.getCurrentState();
        const newState = {
            correlationId: correlationId ?? this.generateCorrelationId(),
            context: { ...currentState.context, ...context },
            createdAt: createTimestamp(),
            parentId: currentState.correlationId,
        };
        return contextStorage.run(newState, fn);
    }
    /**
     * Run async function with specific context
     */
    async runWithContextAsync(context, fn, correlationId) {
        const currentState = this.getCurrentState();
        const newState = {
            correlationId: correlationId ?? this.generateCorrelationId(),
            context: { ...currentState.context, ...context },
            createdAt: createTimestamp(),
            parentId: currentState.correlationId,
        };
        return contextStorage.run(newState, fn);
    }
    /**
     * Get context trace (current + parent contexts)
     */
    getContextTrace() {
        const current = this.getCurrentState();
        return {
            current: current.correlationId,
            parent: current.parentId,
            depth: this.calculateDepth(current),
            createdAt: current.createdAt,
            context: current.context,
        };
    }
    /**
     * Generate new correlation ID
     */
    generateCorrelationId() {
        return createCorrelationId(`creb-${randomUUID()}`);
    }
    /**
     * Get current state or create default
     */
    getCurrentState() {
        return contextStorage.getStore() ?? this.createDefaultState();
    }
    /**
     * Create default context state
     */
    createDefaultState() {
        return {
            correlationId: this.generateCorrelationId(),
            context: { ...this.defaultContext },
            createdAt: createTimestamp(),
        };
    }
    /**
     * Calculate context depth for tracing
     */
    calculateDepth(state) {
        let depth = 0;
        let current = state;
        // This is a simplified version - in a real implementation,
        // you might want to track this more efficiently
        while (current.parentId && depth < 100) { // Prevent infinite loops
            depth++;
            // In a full implementation, you'd need to track parent states
            break;
        }
        return depth;
    }
}
/**
 * Child context manager for scoped contexts
 */
class ChildContextManager {
    constructor(parent, childContext) {
        this.parent = parent;
        this.childContext = childContext;
    }
    getContext() {
        const parentContext = this.parent.getContext();
        return { ...parentContext, ...this.childContext };
    }
    setContext(context) {
        this.childContext = { ...this.childContext, ...context };
    }
    createChild(context) {
        const mergedContext = { ...this.childContext, ...context };
        return new ChildContextManager(this.parent, mergedContext);
    }
    clear() {
        this.childContext = {};
    }
}
/**
 * Context utilities
 */
export class ContextUtils {
    /**
     * Create correlation ID from parts
     */
    static createCorrelationId(prefix, suffix) {
        const parts = [
            prefix ?? 'creb',
            randomUUID(),
            suffix,
        ].filter(Boolean);
        return createCorrelationId(parts.join('-'));
    }
    /**
     * Extract correlation ID from string
     */
    static extractCorrelationId(value) {
        // Simple validation - could be more sophisticated
        if (value && value.length > 0) {
            return createCorrelationId(value);
        }
        return null;
    }
    /**
     * Format correlation ID for display
     */
    static formatCorrelationId(id, length = 8) {
        const idStr = String(id);
        if (idStr.length <= length) {
            return idStr;
        }
        return `${idStr.substring(0, length)}...`;
    }
    /**
     * Merge contexts with precedence
     */
    static mergeContexts(...contexts) {
        const merged = {
            operation: 'unknown',
            module: 'creb',
        };
        for (const context of contexts) {
            Object.assign(merged, context);
        }
        return merged;
    }
    /**
     * Validate context structure
     */
    static validateContext(context) {
        return (typeof context === 'object' &&
            context !== null &&
            'operation' in context &&
            'module' in context &&
            typeof context.operation === 'string' &&
            typeof context.module === 'string');
    }
}
/**
 * Decorator for automatic context propagation
 */
export function withContext(context) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        if (!originalMethod) {
            throw new Error('Decorator can only be applied to methods');
        }
        descriptor.value = function (...args) {
            const contextManager = ContextManager.getInstance();
            if (originalMethod.constructor.name === 'AsyncFunction') {
                return contextManager.runWithContextAsync(context, async () => {
                    return await originalMethod.apply(this, args);
                });
            }
            else {
                return contextManager.runWithContext(context, () => {
                    return originalMethod.apply(this, args);
                });
            }
        };
        return descriptor;
    };
}
/**
 * Global context manager instance
 */
export const globalContextManager = ContextManager.getInstance();
/**
 * Convenience functions for common operations
 */
export const getCurrentContext = () => globalContextManager.getContext();
export const getCurrentCorrelationId = () => globalContextManager.getCorrelationId();
export const setContext = (context) => globalContextManager.setContext(context);
export const setCorrelationId = (id) => globalContextManager.setCorrelationId(id);
export const runWithContext = (context, fn) => globalContextManager.runWithContext(context, fn);
export const runWithContextAsync = (context, fn) => globalContextManager.runWithContextAsync(context, fn);
//# sourceMappingURL=Context.js.map