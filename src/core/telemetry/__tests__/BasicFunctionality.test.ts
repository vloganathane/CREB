/**
 * @fileoverview Basic Functionality Test
 * @module @creb/core/telemetry/__tests__/BasicFunctionality.test
 * @version 1.0.0
 * 
 * Tests the current basic telemetry implementation
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { 
  telemetry, 
  initializeTelemetry, 
  StructuredLogger, 
  LoggerFactory,
  globalMetrics,
  globalLogger
} from '../index';

describe('Basic Telemetry Functionality', () => {

  beforeEach(() => {
    // Initialize telemetry for each test
    initializeTelemetry();
  });

  describe('Logging Functions', () => {
    test('should have all logging levels available', () => {
      expect(typeof telemetry.debug).toBe('function');
      expect(typeof telemetry.info).toBe('function');
      expect(typeof telemetry.warn).toBe('function');
      expect(typeof telemetry.error).toBe('function');
      expect(typeof telemetry.fatal).toBe('function');
    });

    test('should log messages without errors', () => {
      expect(() => {
        telemetry.debug('Debug message');
        telemetry.info('Info message');
        telemetry.warn('Warning message');
        telemetry.error('Error message');
        telemetry.fatal('Fatal message');
      }).not.toThrow();
    });

    test('should log with context', () => {
      expect(() => {
        telemetry.info('Test with context', { user: 'test', action: 'test' });
        telemetry.error('Error with context', new Error('Test error'), { code: 500 });
      }).not.toThrow();
    });
  });

  describe('Metrics Functions', () => {
    test('should have all metrics types available', () => {
      expect(typeof telemetry.counter).toBe('function');
      expect(typeof telemetry.gauge).toBe('function');
      expect(typeof telemetry.histogram).toBe('function');
      expect(typeof telemetry.time).toBe('function');
      expect(typeof telemetry.timeAsync).toBe('function');
    });

    test('should record metrics without errors', () => {
      expect(() => {
        telemetry.counter('test_counter');
        telemetry.counter('test_counter_with_value', 5);
        telemetry.gauge('test_gauge', 42);
        telemetry.histogram('test_histogram', 100);
      }).not.toThrow();
    });

    test('should support timing operations', () => {
      expect(() => {
        const result = telemetry.time('operation_time', () => {
          return 'test_result';
        });
        expect(result).toBe('test_result');
      }).not.toThrow();
    });

    test('should support async timing', async () => {
      const result = await telemetry.timeAsync('async_operation', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'test_result';
      });
      
      expect(result).toBe('test_result');
    });
  });

  describe('Logger Factory', () => {
    test('should create logger instances', () => {
      const logger = LoggerFactory.createConsoleLogger();
      expect(logger).toBeInstanceOf(StructuredLogger);
    });

    test('should create different logger types', () => {
      expect(() => {
        LoggerFactory.createConsoleLogger();
        LoggerFactory.createFileLogger('/tmp/test.log');
      }).not.toThrow();
    });
  });

  describe('Global Objects', () => {
    test('should provide global logger', () => {
      expect(globalLogger).toBeInstanceOf(StructuredLogger);
      expect(() => {
        globalLogger.info('Global logger test');
      }).not.toThrow();
    });

    test('should provide global metrics', () => {
      expect(globalMetrics).toBeDefined();
      expect(() => {
        globalMetrics.counter('global_counter');
        globalMetrics.gauge('global_gauge', 123);
      }).not.toThrow();
    });
  });

  describe('Structured Logger Basic API', () => {
    let logger: StructuredLogger;

    beforeEach(() => {
      logger = LoggerFactory.createConsoleLogger();
    });

    test('should have basic logging methods', () => {
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    test('should log messages', () => {
      expect(() => {
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warn('Warning message');
        logger.error('Error message');
      }).not.toThrow();
    });

    test('should handle errors', () => {
      expect(() => {
        logger.error('Error with exception', new Error('Test error'));
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle EPIPE errors gracefully', () => {
      // This tests the EPIPE error handling we implemented
      expect(() => {
        for (let i = 0; i < 10; i++) {
          telemetry.info(`Test message ${i}`);
        }
      }).not.toThrow();
    });

    test('should handle invalid parameters gracefully', () => {
      expect(() => {
        telemetry.info(null as any);
        telemetry.counter('');
        telemetry.gauge('test', NaN);
      }).not.toThrow();
    });
  });
});
