/**
 * @fileoverview Telemetry Integration Tests
 * @module @creb/core/telemetry/__tests__/Integration.test
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  TelemetrySystem,
  initializeTelemetry,
  telemetry,
  globalLogger,
  globalMetrics,
  globalContextManager
} from '../index';
import { runWithContext, setContext, getCurrentContext } from '../Context';
import { counter, gauge, time, timeAsync } from '../Metrics';
import { info, error, startTimer } from '../Logger';
import { createCorrelationId } from '../types';

describe('Telemetry Integration', () => {
  beforeEach(() => {
    // Reset state
    globalMetrics.reset();
    globalContextManager.clear();
    
    // Mock console to avoid noise
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(async () => {
    await TelemetrySystem.shutdown();
    jest.restoreAllMocks();
  });

  describe('TelemetrySystem', () => {
    test('should initialize and shutdown properly', async () => {
      expect(TelemetrySystem.isInitialized()).toBe(false);
      
      TelemetrySystem.initialize({ test: true });
      expect(TelemetrySystem.isInitialized()).toBe(true);
      expect(TelemetrySystem.getConfig()).toEqual({ test: true });
      
      await TelemetrySystem.shutdown();
      expect(TelemetrySystem.isInitialized()).toBe(false);
    });

    test('should not reinitialize when already initialized', () => {
      TelemetrySystem.initialize({ first: true });
      TelemetrySystem.initialize({ second: true });
      
      expect(TelemetrySystem.getConfig()).toEqual({ first: true });
    });
  });

  describe('Convenience telemetry object', () => {
    test('should provide access to all telemetry functions', () => {
      expect(typeof telemetry.debug).toBe('function');
      expect(typeof telemetry.info).toBe('function');
      expect(typeof telemetry.warn).toBe('function');
      expect(typeof telemetry.error).toBe('function');
      expect(typeof telemetry.fatal).toBe('function');
      
      expect(typeof telemetry.counter).toBe('function');
      expect(typeof telemetry.gauge).toBe('function');
      expect(typeof telemetry.histogram).toBe('function');
      expect(typeof telemetry.time).toBe('function');
      expect(typeof telemetry.timeAsync).toBe('function');
      
      expect(typeof telemetry.setContext).toBe('function');
      expect(typeof telemetry.setCorrelationId).toBe('function');
      expect(typeof telemetry.runWithContext).toBe('function');
      expect(typeof telemetry.runWithContextAsync).toBe('function');
      
      expect(typeof telemetry.initialize).toBe('function');
      expect(typeof telemetry.shutdown).toBe('function');
      expect(typeof telemetry.isInitialized).toBe('function');
    });

    test('should work with telemetry convenience object', () => {
      telemetry.initialize();
      
      telemetry.setContext({ operation: 'integration_test', module: 'telemetry' });
      telemetry.counter('integration_counter', 1);
      telemetry.gauge('integration_gauge', 42);
      telemetry.info('Integration test message');
      
      expect(TelemetrySystem.isInitialized()).toBe(true);
      
      const context = getCurrentContext();
      expect(context.operation).toBe('integration_test');
      
      const metric = globalMetrics.getMetric('integration_counter');
      expect(metric?.value).toBe(1);
    });
  });

  describe('Cross-module integration', () => {
    test('should propagate context across logging and metrics', () => {
      const testContext = {
        operation: 'cross_module_test',
        module: 'integration',
        userId: 'user123',
        requestId: 'req456',
      };

      runWithContext(testContext, () => {
        // Log message should include context
        info('Cross-module test message');
        
        // Metrics should include context tags
        counter('cross_module_counter', 1);
        gauge('cross_module_gauge', 100);
        
        // Timer should work with context
        const stopTimer = startTimer('cross_module_timer');
        stopTimer();
        
        // Verify context is available
        const currentContext = getCurrentContext();
        expect(currentContext).toMatchObject(testContext);
      });
    });

    test('should maintain correlation IDs across operations', () => {
      const correlationId = createCorrelationId('integration-test-123');
      
      runWithContext({ operation: 'correlation_test' }, () => {
        globalContextManager.setCorrelationId(correlationId);
        
        // Log with correlation ID
        info('Message with correlation ID');
        
        // Create child context - should inherit correlation ID
        const childLogger = globalLogger.child({ operation: 'child_operation' });
        expect(childLogger.getCorrelationId()).toBe(correlationId);
        
        // Metrics should work in same context
        counter('correlated_counter', 1);
        
        // Verify correlation ID is maintained
        expect(globalContextManager.getCorrelationId()).toBe(correlationId);
      });
    });

    test('should work with nested contexts', () => {
      const outerContext = { operation: 'outer', module: 'test' };
      const innerContext = { operation: 'inner', userId: 'user123' };
      
      runWithContext(outerContext, () => {
        info('Outer context message');
        counter('outer_counter', 1);
        
        runWithContext(innerContext, () => {
          info('Inner context message');
          gauge('inner_gauge', 50);
          
          const context = getCurrentContext();
          expect(context).toMatchObject({
            operation: 'inner',
            module: 'test',
            userId: 'user123',
          });
        });
        
        // Back to outer context
        const context = getCurrentContext();
        expect(context.operation).toBe('outer');
        expect(context.userId).toBeUndefined();
      });
    });
  });

  describe('Performance integration', () => {
    test('should time functions with logging and metrics', () => {
      const testContext = { operation: 'performance_test', module: 'integration' };
      
      const result = time('integration_timing', () => {
        return runWithContext(testContext, () => {
          info('Function execution started');
          
          // Simulate some work
          let sum = 0;
          for (let i = 0; i < 1000; i++) {
            sum += i;
          }
          
          counter('iterations_completed', 1000);
          gauge('final_sum', sum);
          
          info('Function execution completed', undefined, { result: sum });
          return sum;
        });
      });
      
      expect(result).toBe(499500); // Sum of 0 to 999
      
      const metric = globalMetrics.getMetric('iterations_completed');
      expect(metric?.value).toBe(1000);
    });

    test('should time async functions with context propagation', async () => {
      const testContext = { operation: 'async_performance_test', module: 'integration' };
      
      const result = await timeAsync('async_integration_timing', async () => {
        return await runWithContext(testContext, async () => {
          info('Async function execution started');
          
          // Simulate async work
          await new Promise(resolve => setTimeout(resolve, 10));
          
          counter('async_operations', 1);
          gauge('async_delay_ms', 10);
          
          info('Async function execution completed');
          return 'async_result';
        });
      });
      
      expect(result).toBe('async_result');
      
      const metric = globalMetrics.getMetric('async_operations');
      expect(metric?.value).toBe(1);
    });
  });

  describe('Error handling integration', () => {
    test('should handle errors with full context and metrics', () => {
      const testContext = { operation: 'error_test', module: 'integration' };
      
      expect(() => {
        runWithContext(testContext, () => {
          counter('error_test_attempts', 1);
          
          try {
            throw new Error('Integration test error');
          } catch (err) {
            counter('errors_caught', 1);
            error('Error caught in integration test', err as Error);
            throw err; // Re-throw for test
          }
        });
      }).toThrow('Integration test error');
      
      const attemptsMetric = globalMetrics.getMetric('error_test_attempts');
      const errorsMetric = globalMetrics.getMetric('errors_caught');
      
      expect(attemptsMetric?.value).toBe(1);
      expect(errorsMetric?.value).toBe(1);
    });

    test('should maintain context during error handling', () => {
      const testContext = { operation: 'error_context_test', module: 'integration' };
      let capturedContext: any = null;
      
      try {
        runWithContext(testContext, () => {
          capturedContext = getCurrentContext();
          throw new Error('Context test error');
        });
      } catch (err) {
        // Context should be maintained even after error
        expect(capturedContext).toMatchObject(testContext);
      }
    });
  });

  describe('Real-world usage scenarios', () => {
    test('should support complex request processing scenario', async () => {
      const requestId = 'req-' + Math.random().toString(36).substr(2, 9);
      const userId = 'user-123';
      
      const requestContext = {
        operation: 'process_request',
        module: 'api',
        requestId,
        userId,
      };
      
      const result = await runWithContext(requestContext, async () => {
        info('Request processing started', undefined, { requestId });
        
        const timer = startTimer('request_processing');
        counter('requests_received', 1);
        
        try {
          // Simulate authentication
          await runWithContext({ operation: 'authenticate' }, async () => {
            info('Authenticating user');
            await new Promise(resolve => setTimeout(resolve, 5));
            gauge('auth_duration_ms', 5);
            counter('auth_attempts', 1);
          });
          
          // Simulate data processing
          const processedData = await runWithContext({ operation: 'process_data' }, async () => {
            info('Processing request data');
            await new Promise(resolve => setTimeout(resolve, 10));
            
            counter('data_operations', 3);
            gauge('data_size_bytes', 1024);
            
            return { processed: true, size: 1024 };
          });
          
          // Simulate response preparation
          const response = await runWithContext({ operation: 'prepare_response' }, async () => {
            info('Preparing response');
            gauge('response_size_bytes', 512);
            return { status: 'success', data: processedData };
          });
          
          counter('requests_completed', 1);
          timer();
          
          info('Request processing completed successfully', undefined, { 
            requestId,
            responseSize: 512 
          });
          
          return response;
          
        } catch (err) {
          counter('requests_failed', 1);
          error('Request processing failed', err as Error);
          throw err;
        }
      });
      
      expect(result.status).toBe('success');
      expect(result.data.processed).toBe(true);
      
      // Verify metrics were recorded
      expect(globalMetrics.getMetric('requests_received')?.value).toBe(1);
      expect(globalMetrics.getMetric('requests_completed')?.value).toBe(1);
      expect(globalMetrics.getMetric('auth_attempts')?.value).toBe(1);
      expect(globalMetrics.getMetric('data_operations')?.value).toBe(3);
    });

    test('should support parallel operations with separate contexts', async () => {
      const operations = [
        { id: 'op1', duration: 10, data: 'data1' },
        { id: 'op2', duration: 15, data: 'data2' },
        { id: 'op3', duration: 8, data: 'data3' },
      ];
      
      const results = await Promise.all(
        operations.map(op => 
          runWithContext(
            { 
              operation: 'parallel_op', 
              module: 'worker', 
              data: { operationId: op.id } 
            },
            async () => {
              info(`Starting operation ${op.id}`);
              
              const timer = startTimer(`operation_${op.id}`);
              counter('parallel_operations_started', 1);
              
              await new Promise(resolve => setTimeout(resolve, op.duration));
              
              gauge(`operation_${op.id}_data_size`, op.data.length);
              counter('parallel_operations_completed', 1);
              
              const duration = timer();
              
              info(`Completed operation ${op.id}`, undefined, { 
                duration,
                dataSize: op.data.length 
              });
              
              return { id: op.id, result: op.data.toUpperCase() };
            }
          )
        )
      );
      
      expect(results).toHaveLength(3);
      expect(results[0].result).toBe('DATA1');
      expect(results[1].result).toBe('DATA2');
      expect(results[2].result).toBe('DATA3');
      
      // All operations should have been counted
      expect(globalMetrics.getMetric('parallel_operations_started')?.value).toBe(3);
      expect(globalMetrics.getMetric('parallel_operations_completed')?.value).toBe(3);
    });
  });

  describe('Performance impact', () => {
    test('should have minimal performance overhead', () => {
      const iterations = 1000;
      
      // Measure baseline performance
      const baselineStart = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        const sum = i * 2;
        Math.sqrt(sum);
      }
      const baselineEnd = process.hrtime.bigint();
      const baselineDuration = Number(baselineEnd - baselineStart) / 1000000; // Convert to ms
      
      // Measure with telemetry
      const telemetryStart = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        runWithContext({ 
          operation: 'perf_test', 
          data: { iteration: i } 
        }, () => {
          counter('perf_iterations', 1);
          const sum = i * 2;
          gauge('current_sum', sum);
          Math.sqrt(sum);
        });
      }
      const telemetryEnd = process.hrtime.bigint();
      const telemetryDuration = Number(telemetryEnd - telemetryStart) / 1000000; // Convert to ms
      
      const overhead = (telemetryDuration - baselineDuration) / baselineDuration;
      
      // Overhead should be reasonable (less than 500% for this test)
      expect(overhead).toBeLessThan(5.0);
      
      info('Performance test completed', undefined, {
        iterations,
        baselineDuration,
        telemetryDuration,
        overhead: `${(overhead * 100).toFixed(2)}%`,
      });
    });

    test('should have zero overhead when disabled', () => {
      globalLogger.setEnabled(false);
      
      const iterations = 1000;
      
      const start = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        info('Disabled log message');
        counter('disabled_counter', 1);
      }
      const end = process.hrtime.bigint();
      
      const duration = Number(end - start) / 1000000;
      
      // Should be very fast when disabled
      expect(duration).toBeLessThan(10); // Less than 10ms for 1000 operations
      
      globalLogger.setEnabled(true);
    });
  });
});
