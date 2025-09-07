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
import { 
  LogContext, 
  CorrelationId, 
  ContextProvider,
  createCorrelationId,
  Timestamp,
  createTimestamp
} from './types';

/**
 * Context storage using Node.js AsyncLocalStorage for automatic propagation
 */
const contextStorage = new AsyncLocalStorage<ContextState>();

/**
 * Internal context state
 */
interface ContextState {
  correlationId: CorrelationId;
  context: LogContext;
  createdAt: Timestamp;
  parentId?: CorrelationId;
}

/**
 * Context Manager class for managing logging context and correlation IDs
 */
export class ContextManager implements ContextProvider {
  private static instance: ContextManager;
  private defaultContext: LogContext;

  private constructor() {
    this.defaultContext = {
      operation: 'unknown',
      module: 'creb',
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  /**
   * Get current context from async storage
   */
  public getContext(): LogContext {
    const state = contextStorage.getStore();
    if (state) {
      return { ...state.context };
    }
    return { ...this.defaultContext };
  }

  /**
   * Set context in current async context
   */
  public setContext(context: Partial<LogContext>): void {
    const current = this.getCurrentState();
    const updatedContext = { ...current.context, ...context };
    
    const newState: ContextState = {
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
  public createChild(context: Partial<LogContext>): ContextProvider {
    const childManager = new ChildContextManager(this, context);
    return childManager;
  }

  /**
   * Clear current context
   */
  public clear(): void {
    contextStorage.run(this.createDefaultState(), () => {
      // Context cleared
    });
  }

  /**
   * Get current correlation ID
   */
  public getCorrelationId(): CorrelationId {
    const state = contextStorage.getStore();
    return state?.correlationId ?? this.generateCorrelationId();
  }

  /**
   * Set correlation ID
   */
  public setCorrelationId(id: CorrelationId): void {
    const current = this.getCurrentState();
    const newState: ContextState = {
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
  public runWithContext<T>(
    context: Partial<LogContext>, 
    fn: () => T,
    correlationId?: CorrelationId
  ): T {
    const currentState = this.getCurrentState();
    const newState: ContextState = {
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
  public async runWithContextAsync<T>(
    context: Partial<LogContext>,
    fn: () => Promise<T>,
    correlationId?: CorrelationId
  ): Promise<T> {
    const currentState = this.getCurrentState();
    const newState: ContextState = {
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
  public getContextTrace(): ContextTrace {
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
  private generateCorrelationId(): CorrelationId {
    return createCorrelationId(`creb-${randomUUID()}`);
  }

  /**
   * Get current state or create default
   */
  private getCurrentState(): ContextState {
    return contextStorage.getStore() ?? this.createDefaultState();
  }

  /**
   * Create default context state
   */
  private createDefaultState(): ContextState {
    return {
      correlationId: this.generateCorrelationId(),
      context: { ...this.defaultContext },
      createdAt: createTimestamp(),
    };
  }

  /**
   * Calculate context depth for tracing
   */
  private calculateDepth(state: ContextState): number {
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
class ChildContextManager implements ContextProvider {
  constructor(
    private parent: ContextManager,
    private childContext: Partial<LogContext>
  ) {}

  public getContext(): LogContext {
    const parentContext = this.parent.getContext();
    return { ...parentContext, ...this.childContext };
  }

  public setContext(context: Partial<LogContext>): void {
    this.childContext = { ...this.childContext, ...context };
  }

  public createChild(context: Partial<LogContext>): ContextProvider {
    const mergedContext = { ...this.childContext, ...context };
    return new ChildContextManager(this.parent, mergedContext);
  }

  public clear(): void {
    this.childContext = {};
  }
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
export class ContextUtils {
  /**
   * Create correlation ID from parts
   */
  public static createCorrelationId(prefix?: string, suffix?: string): CorrelationId {
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
  public static extractCorrelationId(value: string): CorrelationId | null {
    // Simple validation - could be more sophisticated
    if (value && value.length > 0) {
      return createCorrelationId(value);
    }
    return null;
  }

  /**
   * Format correlation ID for display
   */
  public static formatCorrelationId(id: CorrelationId, length = 8): string {
    const idStr = String(id);
    if (idStr.length <= length) {
      return idStr;
    }
    return `${idStr.substring(0, length)}...`;
  }

  /**
   * Merge contexts with precedence
   */
  public static mergeContexts(...contexts: Partial<LogContext>[]): LogContext {
    const merged: LogContext = {
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
  public static validateContext(context: unknown): context is LogContext {
    return (
      typeof context === 'object' &&
      context !== null &&
      'operation' in context &&
      'module' in context &&
      typeof (context as any).operation === 'string' &&
      typeof (context as any).module === 'string'
    );
  }
}

/**
 * Decorator for automatic context propagation
 */
export function withContext(context: Partial<LogContext>) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error('Decorator can only be applied to methods');
    }

    descriptor.value = function (this: any, ...args: any[]) {
      const contextManager = ContextManager.getInstance();
      
      if (originalMethod.constructor.name === 'AsyncFunction') {
        return contextManager.runWithContextAsync(context, async () => {
          return await originalMethod.apply(this, args);
        });
      } else {
        return contextManager.runWithContext(context, () => {
          return originalMethod.apply(this, args);
        });
      }
    } as T;

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
export const getCurrentContext = (): LogContext => globalContextManager.getContext();
export const getCurrentCorrelationId = (): CorrelationId => globalContextManager.getCorrelationId();
export const setContext = (context: Partial<LogContext>): void => globalContextManager.setContext(context);
export const setCorrelationId = (id: CorrelationId): void => globalContextManager.setCorrelationId(id);
export const runWithContext = <T>(
  context: Partial<LogContext>,
  fn: () => T
): T => globalContextManager.runWithContext(context, fn);

export const runWithContextAsync = <T>(
  context: Partial<LogContext>,
  fn: () => Promise<T>
): Promise<T> => globalContextManager.runWithContextAsync(context, fn);
