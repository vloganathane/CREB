/**
 * Simple Telemetry System Test
 * 
 * Tests the current telemetry implementation for basic functionality
 */

import { describe, test, expect } from '@jest/globals';
import { telemetry, initializeTelemetry, StructuredLogger, LoggerFactory } from '../index';

describe('Telemetry System - Current Implementation', () => {
  test('should initialize telemetry system', () => {
    expect(() => initializeTelemetry()).not.toThrow();
  });

  test('should provide telemetry convenience object', () => {
    expect(typeof telemetry).toBe('object');
    expect(typeof telemetry.debug).toBe('function');
    expect(typeof telemetry.info).toBe('function');
    expect(typeof telemetry.warn).toBe('function');
    expect(typeof telemetry.error).toBe('function');
    expect(typeof telemetry.fatal).toBe('function');
  });

  test('should provide metrics functions', () => {
    expect(typeof telemetry.counter).toBe('function');
    expect(typeof telemetry.gauge).toBe('function');
    expect(typeof telemetry.histogram).toBe('function');
    expect(typeof telemetry.time).toBe('function');
    expect(typeof telemetry.timeAsync).toBe('function');
  });

  test('should allow logging without errors', () => {
    expect(() => {
      telemetry.info('Test message', { test: true });
      telemetry.warn('Warning message', { level: 'warn' });
      telemetry.error('Error message', new Error('Test error'));
    }).not.toThrow();
  });

  test('should allow metrics collection without errors', () => {
    expect(() => {
      telemetry.counter('test_counter');
      telemetry.gauge('test_gauge', 42);
      telemetry.histogram('test_histogram', 100);
    }).not.toThrow();
  });

  test('should provide StructuredLogger class', () => {
    expect(typeof StructuredLogger).toBe('function');
    expect(typeof LoggerFactory).toBe('function');
  });

  test('should create logger instances', () => {
    const logger = LoggerFactory.createConsoleLogger();
    expect(logger).toBeInstanceOf(StructuredLogger);
    
    expect(() => {
      logger.info('Test message');
      logger.error('Test error', new Error('Test'));
    }).not.toThrow();
  });
});
