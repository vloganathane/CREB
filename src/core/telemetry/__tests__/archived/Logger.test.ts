/**
 * @fileoverview Logger System Tests
 * @module @creb/core/telemetry/__tests__/Logger.test
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  StructuredLogger,
  LoggerFactory,
  globalLogger,
  debug,
  info,
  warn,
  error,
  fatal,
  startTimer,
  metric
} from '../Logger';
import { 
  LogLevel, 
  LogEntry, 
  LoggerConfig, 
  LogDestination,
  createCorrelationId 
} from '../types';
import { setContext, setCorrelationId } from '../Context';

describe('Logger System', () => {
  let logger: StructuredLogger;
  let logEntries: LogEntry[] = [];

  // Mock console methods to capture output
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    logEntries = [];
    
    // Mock console methods
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    const config: Partial<LoggerConfig> = {
      name: 'test-logger',
      level: 'debug',
      format: 'json',
      destinations: [
        {
          type: 'console',
          options: {},
          enabled: true,
        },
      ],
      enabled: true,
      includeStack: true,
      includeMetrics: true,
      bufferSize: 1, // Immediate writing for tests
    };

    logger = new StructuredLogger(config);
    
    // Capture log entries for testing
    logger.on('log:created', (entry: LogEntry) => {
      logEntries.push(entry);
    });
  });

  afterEach(() => {
    logger.removeAllListeners();
    
    // Restore console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('StructuredLogger', () => {
    describe('Basic logging methods', () => {
      test('should log debug messages', () => {
        logger.debug('Debug message');
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].level).toBe('debug');
        expect(logEntries[0].message).toBe('Debug message');
        expect(logEntries[0].logger).toBe('test-logger');
      });

      test('should log info messages', () => {
        logger.info('Info message');
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].level).toBe('info');
        expect(logEntries[0].message).toBe('Info message');
      });

      test('should log warning messages', () => {
        logger.warn('Warning message');
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].level).toBe('warn');
        expect(logEntries[0].message).toBe('Warning message');
      });

      test('should log error messages', () => {
        const testError = new Error('Test error');
        logger.error('Error message', testError);
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].level).toBe('error');
        expect(logEntries[0].message).toBe('Error message');
        expect(logEntries[0].error).toBeDefined();
        expect(logEntries[0].error!.name).toBe('Error');
        expect(logEntries[0].error!.message).toBe('Test error');
      });

      test('should log fatal messages', () => {
        const testError = new Error('Fatal error');
        logger.fatal('Fatal message', testError);
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].level).toBe('fatal');
        expect(logEntries[0].message).toBe('Fatal message');
        expect(logEntries[0].error).toBeDefined();
      });
    });

    describe('Context and correlation IDs', () => {
      test('should include correlation ID in log entries', () => {
        const testId = createCorrelationId('test-123');
        setCorrelationId(testId);
        
        logger.info('Test message');
        
        expect(logEntries[0].correlationId).toBe(testId);
      });

      test('should include context in log entries', () => {
        const testContext = {
          operation: 'test_operation',
          module: 'test_module',
          userId: 'user123',
        };
        
        setContext(testContext);
        logger.info('Context test');
        
        expect(logEntries[0].context).toMatchObject(testContext);
      });

      test('should merge provided context with current context', () => {
        setContext({ operation: 'base_operation', module: 'base_module' });
        
        logger.info('Merge test', { operation: 'override_operation', requestId: 'req123' });
        
        expect(logEntries[0].context).toMatchObject({
          operation: 'override_operation',
          module: 'base_module',
          requestId: 'req123',
        });
      });

      test('should include metadata in log entries', () => {
        const metadata = {
          userId: 'user123',
          sessionId: 'session456',
          custom: { key: 'value' },
        };
        
        logger.info('Metadata test', undefined, metadata);
        
        expect(logEntries[0].metadata).toEqual(metadata);
      });
    });

    describe('Log levels and filtering', () => {
      test('should respect minimum log level', () => {
        const config: Partial<LoggerConfig> = {
          name: 'level-test',
          level: 'warn',
          destinations: [{ type: 'console', options: {}, enabled: true }],
        };
        
        const levelLogger = new StructuredLogger(config);
        const levelEntries: LogEntry[] = [];
        
        levelLogger.on('log:created', (entry: LogEntry) => {
          levelEntries.push(entry);
        });
        
        levelLogger.debug('Debug message'); // Should be filtered
        levelLogger.info('Info message');   // Should be filtered
        levelLogger.warn('Warn message');   // Should pass
        levelLogger.error('Error message'); // Should pass
        
        expect(levelEntries).toHaveLength(2);
        expect(levelEntries[0].level).toBe('warn');
        expect(levelEntries[1].level).toBe('error');
      });

      test('should not log when disabled', () => {
        logger.setEnabled(false);
        logger.info('Disabled message');
        
        expect(logEntries).toHaveLength(0);
      });

      test('should support custom log filters', () => {
        logger.addFilter((entry) => !entry.message.includes('filtered'));
        
        logger.info('Normal message');
        logger.info('This message should be filtered');
        
        expect(logEntries).toHaveLength(1);
        expect(logEntries[0].message).toBe('Normal message');
      });
    });

    describe('Error serialization', () => {
      test('should serialize basic errors', () => {
        const error = new Error('Basic error');
        logger.error('Error test', error);
        
        const errorInfo = logEntries[0].error!;
        expect(errorInfo.name).toBe('Error');
        expect(errorInfo.message).toBe('Basic error');
        expect(errorInfo.stack).toBeDefined();
      });

      test('should serialize errors with custom properties', () => {
        const error = new Error('Custom error') as any;
        error.code = 'E001';
        error.statusCode = 500;
        
        logger.error('Custom error test', error);
        
        const errorInfo = logEntries[0].error!;
        expect(errorInfo.code).toBe('E001');
        expect(errorInfo.metadata?.statusCode).toBe(500);
      });

      test('should handle error causes', () => {
        const cause = new Error('Root cause');
        const error = new Error('Main error') as any;
        error.cause = cause;
        
        logger.error('Cause test', error);
        
        const errorInfo = logEntries[0].error!;
        expect(errorInfo.cause).toBeDefined();
        expect(errorInfo.cause!.message).toBe('Root cause');
      });

      test('should include stack traces when enabled', () => {
        const error = new Error('Stack test');
        logger.error('Stack test', error);
        
        expect(logEntries[0].stack).toBeDefined();
        expect(logEntries[0].stack).toContain('Stack test');
      });
    });

    describe('Performance metrics integration', () => {
      test('should include performance metrics when enabled', () => {
        logger.info('Metrics test');
        
        expect(logEntries[0].metrics).toBeDefined();
        expect(logEntries[0].metrics!.memoryUsage).toBeGreaterThan(0);
        expect(logEntries[0].metrics!.custom).toBeDefined();
      });

      test('should exclude performance metrics when disabled', () => {
        const config: Partial<LoggerConfig> = {
          name: 'no-metrics',
          includeMetrics: false,
          destinations: [{ type: 'console', options: {}, enabled: true }],
        };
        
        const noMetricsLogger = new StructuredLogger(config);
        const noMetricsEntries: LogEntry[] = [];
        
        noMetricsLogger.on('log:created', (entry: LogEntry) => {
          noMetricsEntries.push(entry);
        });
        
        noMetricsLogger.info('No metrics test');
        
        expect(noMetricsEntries[0].metrics).toBeUndefined();
      });
    });

    describe('Timer functionality', () => {
      test('should create and use timers', () => {
        const stopTimer = logger.startTimer('test_timer');
        
        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 10) {
          // Wait for at least 10ms
        }
        
        const duration = stopTimer();
        expect(duration).toBeGreaterThan(0);
        
        // Should have logged a debug message about timer completion
        const timerEntries = logEntries.filter(entry => 
          entry.message.includes('Timer') && entry.message.includes('completed')
        );
        expect(timerEntries).toHaveLength(1);
      });

      test('should handle disabled timer gracefully', () => {
        logger.setEnabled(false);
        const stopTimer = logger.startTimer('disabled_timer');
        const duration = stopTimer();
        
        expect(duration).toBe(0);
      });
    });

    describe('Metric recording', () => {
      test('should record counter metrics', () => {
        logger.metric('test_counter', 5, 'counter', { tag: 'value' });
        
        // Should have logged a debug message about metric recording
        const metricEntries = logEntries.filter(entry => 
          entry.message.includes('Metric recorded')
        );
        expect(metricEntries).toHaveLength(1);
        expect(metricEntries[0].metadata?.metric_name).toBe('test_counter');
        expect(metricEntries[0].metadata?.metric_type).toBe('counter');
        expect(metricEntries[0].metadata?.metric_value).toBe(5);
      });

      test('should handle different metric types', () => {
        logger.metric('gauge_metric', 42, 'gauge');
        logger.metric('histogram_metric', 2.5, 'histogram');
        logger.metric('timer_metric', 100, 'timer');
        
        const metricEntries = logEntries.filter(entry => 
          entry.message.includes('Metric recorded')
        );
        expect(metricEntries).toHaveLength(3);
      });
    });

    describe('Child loggers', () => {
      test('should create child loggers with inherited context', () => {
        setContext({ operation: 'parent_operation', module: 'parent' });
        
        const childLogger = logger.child({ operation: 'child_operation', userId: 'user123' });
        
        // Cast to StructuredLogger to access event emitter methods for testing
        const structuredChildLogger = childLogger as StructuredLogger;
        const childEntries: LogEntry[] = [];
        
        structuredChildLogger.on('log:created', (entry: LogEntry) => {
          childEntries.push(entry);
        });
        
        childLogger.info('Child message');
        
        expect(childEntries).toHaveLength(1);
        expect(childEntries[0].context).toMatchObject({
          operation: 'child_operation',
          module: 'parent',
          userId: 'user123',
        });
      });

      test('should inherit correlation IDs', () => {
        const parentId = createCorrelationId('parent-123');
        setCorrelationId(parentId);
        
        const childLogger = logger.child({ operation: 'child' });
        expect(childLogger.getCorrelationId()).toBe(parentId);
      });
    });

    describe('Configuration management', () => {
      test('should get current configuration', () => {
        const config = logger.getConfig();
        expect(config.name).toBe('test-logger');
        expect(config.level).toBe('debug');
      });

      test('should update configuration', () => {
        logger.updateConfig({ level: 'warn', enabled: false });
        
        const config = logger.getConfig();
        expect(config.level).toBe('warn');
        expect(config.enabled).toBe(false);
      });

      test('should emit configuration update events', (done) => {
        logger.on('logger:config:updated', (config) => {
          expect(config.level).toBe('error');
          done();
        });
        
        logger.updateConfig({ level: 'error' });
      });
    });

    describe('Buffer and flushing', () => {
      test('should buffer log entries when configured', async () => {
        const bufferedConfig: Partial<LoggerConfig> = {
          name: 'buffered-logger',
          bufferSize: 3,
          destinations: [{ type: 'console', options: {}, enabled: true }],
        };
        
        const bufferedLogger = new StructuredLogger(bufferedConfig);
        
        bufferedLogger.info('Message 1');
        bufferedLogger.info('Message 2');
        
        // Should not have written yet
        expect(console.info).not.toHaveBeenCalled();
        
        bufferedLogger.info('Message 3');
        
        // Should flush after 3 messages
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(console.info).toHaveBeenCalled();
      });

      test('should manually flush buffer', async () => {
        const bufferedConfig: Partial<LoggerConfig> = {
          name: 'manual-flush',
          bufferSize: 10,
          destinations: [{ type: 'console', options: {}, enabled: true }],
        };
        
        const bufferedLogger = new StructuredLogger(bufferedConfig);
        
        bufferedLogger.info('Buffered message');
        expect(console.info).not.toHaveBeenCalled();
        
        await bufferedLogger.flush();
        expect(console.info).toHaveBeenCalled();
      });
    });
  });

  describe('LoggerFactory', () => {
    afterEach(() => {
      // Clean up created loggers
      LoggerFactory.getLoggerNames().forEach(name => {
        LoggerFactory.removeLogger(name);
      });
    });

    test('should create and cache logger instances', () => {
      const logger1 = LoggerFactory.getLogger('test-factory');
      const logger2 = LoggerFactory.getLogger('test-factory');
      
      expect(logger1).toBe(logger2); // Should return same instance
    });

    test('should create different instances for different names', () => {
      const logger1 = LoggerFactory.getLogger('logger1');
      const logger2 = LoggerFactory.getLogger('logger2');
      
      expect(logger1).not.toBe(logger2);
    });

    test('should apply default configuration', () => {
      LoggerFactory.setDefaultConfig({ level: 'warn', format: 'text' });
      
      const logger = LoggerFactory.getLogger('default-config');
      const config = logger.getConfig();
      
      expect(config.level).toBe('warn');
      expect(config.format).toBe('text');
    });

    test('should override default configuration', () => {
      LoggerFactory.setDefaultConfig({ level: 'warn' });
      
      const logger = LoggerFactory.getLogger('override-config', { level: 'debug' });
      const config = logger.getConfig();
      
      expect(config.level).toBe('debug');
    });

    test('should remove logger instances', () => {
      LoggerFactory.getLogger('removable');
      expect(LoggerFactory.getLoggerNames()).toContain('removable');
      
      const removed = LoggerFactory.removeLogger('removable');
      expect(removed).toBe(true);
      expect(LoggerFactory.getLoggerNames()).not.toContain('removable');
    });

    test('should get all logger names', () => {
      LoggerFactory.getLogger('logger1');
      LoggerFactory.getLogger('logger2');
      LoggerFactory.getLogger('logger3');
      
      const names = LoggerFactory.getLoggerNames();
      expect(names).toContain('logger1');
      expect(names).toContain('logger2');
      expect(names).toContain('logger3');
    });

    test('should flush all loggers', async () => {
      const logger1 = LoggerFactory.getLogger('flush1');
      const logger2 = LoggerFactory.getLogger('flush2');
      
      const flushSpy1 = jest.spyOn(logger1, 'flush');
      const flushSpy2 = jest.spyOn(logger2, 'flush');
      
      await LoggerFactory.flushAll();
      
      expect(flushSpy1).toHaveBeenCalled();
      expect(flushSpy2).toHaveBeenCalled();
    });
  });

  describe('Global logger functions', () => {
    afterEach(() => {
      globalLogger.setEnabled(true);
    });

    test('should work with global debug function', () => {
      const logSpy = jest.spyOn(globalLogger, 'debug');
      debug('Global debug message');
      expect(logSpy).toHaveBeenCalledWith('Global debug message', undefined, undefined);
    });

    test('should work with global info function', () => {
      const logSpy = jest.spyOn(globalLogger, 'info');
      info('Global info message');
      expect(logSpy).toHaveBeenCalledWith('Global info message', undefined, undefined);
    });

    test('should work with global warn function', () => {
      const logSpy = jest.spyOn(globalLogger, 'warn');
      warn('Global warn message');
      expect(logSpy).toHaveBeenCalledWith('Global warn message', undefined, undefined);
    });

    test('should work with global error function', () => {
      const logSpy = jest.spyOn(globalLogger, 'error');
      const testError = new Error('Global error');
      error('Global error message', testError);
      expect(logSpy).toHaveBeenCalledWith('Global error message', testError, undefined, undefined);
    });

    test('should work with global fatal function', () => {
      const logSpy = jest.spyOn(globalLogger, 'fatal');
      const testError = new Error('Global fatal error');
      fatal('Global fatal message', testError);
      expect(logSpy).toHaveBeenCalledWith('Global fatal message', testError, undefined, undefined);
    });

    test('should work with global timer function', () => {
      const timerSpy = jest.spyOn(globalLogger, 'startTimer');
      startTimer('global_timer');
      expect(timerSpy).toHaveBeenCalledWith('global_timer');
    });

    test('should work with global metric function', () => {
      const metricSpy = jest.spyOn(globalLogger, 'metric');
      metric('global_metric', 42, 'gauge', { tag: 'value' });
      expect(metricSpy).toHaveBeenCalledWith('global_metric', 42, 'gauge', { tag: 'value' });
    });
  });

  describe('Formatter functions', () => {
    test('should format JSON logs correctly', () => {
      const config: Partial<LoggerConfig> = {
        name: 'json-logger',
        format: 'json',
        destinations: [{ type: 'console', options: {}, enabled: true }],
      };
      
      const jsonLogger = new StructuredLogger(config);
      jsonLogger.info('JSON test');
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/^\{.*\}$/)
      );
    });

    test('should format text logs correctly', () => {
      const config: Partial<LoggerConfig> = {
        name: 'text-logger',
        format: 'text',
        destinations: [{ type: 'console', options: {}, enabled: true }],
      };
      
      const textLogger = new StructuredLogger(config);
      textLogger.info('Text test');
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[INFO\].*Text test/)
      );
    });

    test('should format structured logs correctly', () => {
      const config: Partial<LoggerConfig> = {
        name: 'structured-logger',
        format: 'structured',
        destinations: [{ type: 'console', options: {}, enabled: true }],
      };
      
      const structuredLogger = new StructuredLogger(config);
      structuredLogger.info('Structured test');
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[INFO\].*Structured test/)
      );
    });
  });

  describe('Error handling', () => {
    test('should handle destination errors gracefully', async () => {
      const config: Partial<LoggerConfig> = {
        name: 'error-logger',
        destinations: [
          {
            type: 'custom' as any,
            options: {},
            enabled: true,
          },
        ],
      };
      
      const errorLogger = new StructuredLogger(config);
      let errorEmitted = false;
      
      errorLogger.on('destination:error', () => {
        errorEmitted = true;
      });
      
      errorLogger.info('Error test');
      await errorLogger.flush();
      
      // Should not throw, but might emit error event
      expect(errorEmitted).toBe(false); // No error for unimplemented custom destination
    });

    test('should handle serialization errors gracefully', () => {
      const circularObj: any = {};
      circularObj.self = circularObj;
      
      expect(() => {
        logger.info('Circular test', undefined, { circular: circularObj });
      }).not.toThrow();
    });
  });
});
