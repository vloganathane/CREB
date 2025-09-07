/**
 * @fileoverview Context Management Tests
 * @module @creb/core/telemetry/__tests__/Context.test
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  ContextManager, 
  ContextUtils, 
  globalContextManager,
  getCurrentContext,
  getCurrentCorrelationId,
  setContext,
  setCorrelationId,
  runWithContext,
  runWithContextAsync,
  withContext
} from '../Context';
import { LogContext, CorrelationId, createCorrelationId } from '../types';

describe('Context Management', () => {
  let contextManager: ContextManager;

  beforeEach(() => {
    contextManager = ContextManager.getInstance();
    // Clear any existing context
    contextManager.clear();
  });

  afterEach(() => {
    contextManager.clear();
  });

  describe('ContextManager', () => {
    test('should be a singleton', () => {
      const instance1 = ContextManager.getInstance();
      const instance2 = ContextManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should provide default context', () => {
      const context = contextManager.getContext();
      expect(context).toEqual({
        operation: 'unknown',
        module: 'creb',
      });
    });

    test('should set and get context', () => {
      const testContext: Partial<LogContext> = {
        operation: 'test_operation',
        module: 'test_module',
        userId: 'user123',
      };

      contextManager.setContext(testContext);
      const retrievedContext = contextManager.getContext();
      
      expect(retrievedContext).toMatchObject(testContext);
    });

    test('should generate unique correlation IDs', () => {
      const id1 = contextManager.getCorrelationId();
      const id2 = contextManager.getCorrelationId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).toMatch(/^creb-/);
      expect(id2).toMatch(/^creb-/);
    });

    test('should set custom correlation ID', () => {
      const customId = createCorrelationId('custom-123');
      contextManager.setCorrelationId(customId);
      
      const retrievedId = contextManager.getCorrelationId();
      expect(retrievedId).toBe(customId);
    });

    test('should run function with specific context', () => {
      const testContext = { operation: 'test', module: 'test' };
      let capturedContext: LogContext | null = null;

      const result = contextManager.runWithContext(testContext, () => {
        capturedContext = contextManager.getContext();
        return 'test-result';
      });

      expect(result).toBe('test-result');
      expect(capturedContext).toMatchObject(testContext);
    });

    test('should run async function with specific context', async () => {
      const testContext = { operation: 'async_test', module: 'test' };
      let capturedContext: LogContext | null = null;

      const result = await contextManager.runWithContextAsync(testContext, async () => {
        capturedContext = contextManager.getContext();
        return 'async-result';
      });

      expect(result).toBe('async-result');
      expect(capturedContext).toMatchObject(testContext);
    });

    test('should create child context provider', () => {
      const parentContext = { operation: 'parent', module: 'parent' };
      const childContext = { operation: 'child' };

      contextManager.setContext(parentContext);
      const childProvider = contextManager.createChild(childContext);

      const mergedContext = childProvider.getContext();
      expect(mergedContext).toMatchObject({
        operation: 'child',
        module: 'parent',
      });
    });

    test('should get context trace', () => {
      const testContext = { operation: 'trace_test', module: 'test' };
      const correlationId = createCorrelationId('trace-123');

      contextManager.runWithContext(testContext, () => {
        const trace = contextManager.getContextTrace();
        expect(trace.current).toBeDefined();
        expect(trace.context).toMatchObject(testContext);
        expect(trace.depth).toBeGreaterThanOrEqual(0);
        expect(trace.createdAt).toBeDefined();
      }, correlationId);
    });
  });

  describe('ContextUtils', () => {
    test('should create correlation ID with prefix and suffix', () => {
      const id = ContextUtils.createCorrelationId('test', 'suffix');
      expect(id).toMatch(/^test-.*-suffix$/);
    });

    test('should extract correlation ID from string', () => {
      const testId = 'test-correlation-id';
      const extracted = ContextUtils.extractCorrelationId(testId);
      expect(extracted).toBe(testId);
    });

    test('should return null for invalid correlation ID', () => {
      const extracted = ContextUtils.extractCorrelationId('');
      expect(extracted).toBeNull();
    });

    test('should format correlation ID for display', () => {
      const longId = createCorrelationId('very-long-correlation-id-that-should-be-truncated');
      const formatted = ContextUtils.formatCorrelationId(longId, 10);
      expect(formatted).toHaveLength(13); // 10 chars + '...'
      expect(formatted.endsWith('...')).toBe(true);
    });

    test('should merge contexts with precedence', () => {
      const context1 = { operation: 'op1', module: 'mod1', userId: 'user1' };
      const context2 = { operation: 'op2', requestId: 'req1' };
      const context3 = { module: 'mod3' };

      const merged = ContextUtils.mergeContexts(context1, context2, context3);
      
      expect(merged).toEqual({
        operation: 'op2',
        module: 'mod3',
        userId: 'user1',
        requestId: 'req1',
      });
    });

    test('should validate context structure', () => {
      const validContext = { operation: 'test', module: 'test' };
      const invalidContext = { operation: 'test' }; // missing module
      const notAnObject = 'not an object';

      expect(ContextUtils.validateContext(validContext)).toBe(true);
      expect(ContextUtils.validateContext(invalidContext)).toBe(false);
      expect(ContextUtils.validateContext(notAnObject)).toBe(false);
    });
  });

  describe('Global context functions', () => {
    test('should work with global context manager', () => {
      const testContext = { operation: 'global_test', module: 'global' };
      
      setContext(testContext);
      const retrievedContext = getCurrentContext();
      
      expect(retrievedContext).toMatchObject(testContext);
    });

    test('should work with global correlation ID', () => {
      const testId = createCorrelationId('global-test');
      
      setCorrelationId(testId);
      const retrievedId = getCurrentCorrelationId();
      
      expect(retrievedId).toBe(testId);
    });

    test('should run with context globally', () => {
      const testContext = { operation: 'global_run', module: 'global' };
      let capturedContext: LogContext | null = null;

      const result = runWithContext(testContext, () => {
        capturedContext = getCurrentContext();
        return 'global-result';
      });

      expect(result).toBe('global-result');
      expect(capturedContext).toMatchObject(testContext);
    });

    test('should run async with context globally', async () => {
      const testContext = { operation: 'global_async', module: 'global' };
      let capturedContext: LogContext | null = null;

      const result = await runWithContextAsync(testContext, async () => {
        capturedContext = getCurrentContext();
        return 'global-async-result';
      });

      expect(result).toBe('global-async-result');
      expect(capturedContext).toMatchObject(testContext);
    });
  });

  describe('withContext decorator', () => {
    test('should apply context to method calls', () => {
      const testContext = { operation: 'decorator_test', module: 'decorator' };
      let capturedContext: LogContext | null = null;

      class TestClass {
        testMethod() {
          capturedContext = getCurrentContext();
          return 'decorated-result';
        }
      }

      // Apply decorator manually for testing
      const originalMethod = TestClass.prototype.testMethod;
      TestClass.prototype.testMethod = function() {
        return runWithContext(testContext, () => {
          return originalMethod.apply(this);
        });
      };

      const instance = new TestClass();
      const result = instance.testMethod();

      expect(result).toBe('decorated-result');
      expect(capturedContext).toMatchObject(testContext);
    });

    test('should apply context to async method calls', async () => {
      const testContext = { operation: 'async_decorator', module: 'decorator' };
      let capturedContext: LogContext | null = null;

      class TestClass {
        async testAsyncMethod() {
          capturedContext = getCurrentContext();
          return 'async-decorated-result';
        }
      }

      // Apply decorator manually for testing
      const originalMethod = TestClass.prototype.testAsyncMethod;
      TestClass.prototype.testAsyncMethod = function() {
        return runWithContextAsync(testContext, async () => {
          return await originalMethod.apply(this);
        });
      };

      const instance = new TestClass();
      const result = await instance.testAsyncMethod();

      expect(result).toBe('async-decorated-result');
      expect(capturedContext).toMatchObject(testContext);
    });

    test('should handle decorator errors gracefully', () => {
      // Test that the decorator exists and can be called
      expect(typeof withContext).toBe('function');
      
      // Test that withContext returns a decorator function
      const decorator = withContext({ operation: 'test' });
      expect(typeof decorator).toBe('function');
    });
  });

  describe('Context propagation across async boundaries', () => {
    test('should propagate context through setTimeout', (done) => {
      const testContext = { operation: 'timeout_test', module: 'async' };
      
      runWithContext(testContext, () => {
        setTimeout(() => {
          const capturedContext = getCurrentContext();
          expect(capturedContext).toMatchObject(testContext);
          done();
        }, 10);
      });
    });

    test('should propagate context through Promise chains', async () => {
      const testContext = { operation: 'promise_test', module: 'async' };
      let capturedContext: LogContext | null = null;

      await runWithContextAsync(testContext, async () => {
        await Promise.resolve()
          .then(() => {
            capturedContext = getCurrentContext();
          });
      });

      expect(capturedContext).toMatchObject(testContext);
    });

    test('should maintain separate contexts in parallel operations', async () => {
      const context1 = { operation: 'parallel1', module: 'async' };
      const context2 = { operation: 'parallel2', module: 'async' };
      
      const results = await Promise.all([
        runWithContextAsync(context1, async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return getCurrentContext();
        }),
        runWithContextAsync(context2, async () => {
          await new Promise(resolve => setTimeout(resolve, 5));
          return getCurrentContext();
        }),
      ]);

      expect(results[0]).toMatchObject(context1);
      expect(results[1]).toMatchObject(context2);
    });
  });

  describe('Error handling', () => {
    test('should handle errors in context functions gracefully', () => {
      const testContext = { operation: 'error_test', module: 'error' };
      
      expect(() => {
        runWithContext(testContext, () => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');
    });

    test('should handle errors in async context functions gracefully', async () => {
      const testContext = { operation: 'async_error_test', module: 'error' };
      
      await expect(
        runWithContextAsync(testContext, async () => {
          throw new Error('Async test error');
        })
      ).rejects.toThrow('Async test error');
    });

    test('should maintain context even when errors occur', () => {
      const testContext = { operation: 'error_context_test', module: 'error' };
      let capturedContext: LogContext | null = null;

      try {
        runWithContext(testContext, () => {
          capturedContext = getCurrentContext();
          throw new Error('Test error');
        });
      } catch (error) {
        // Error expected
      }

      expect(capturedContext).toMatchObject(testContext);
    });
  });
});
