/**
 * @fileoverview Telemetry Module Exports
 * @module @creb/core/telemetry
 * @version 1.0.0
 * @author CREB Team
 * 
 * Main exports for the CREB telemetry system including structured logging,
 * metrics collection, context management, and performance monitoring.
 */

// Type exports
export * from './types';

// Context management
export {
  ContextManager,
  ContextUtils,
  type ContextTrace,
  globalContextManager,
  getCurrentContext,
  getCurrentCorrelationId,
  setContext,
  setCorrelationId,
  runWithContext,
  runWithContextAsync,
  withContext,
} from './Context';

// Metrics and performance
export {
  globalMetrics,
  type MetricStats,
  MetricsRegistry,
  PerformanceProfiler,
  globalProfiler,
  counter,
  gauge,
  histogram,
  time,
  timeAsync,
  Profile,
  startTimer as metricsStartTimer,
} from './Metrics';

// Structured logging
export {
  StructuredLogger,
  LoggerFactory,
  LogLevel,
  ConsoleDestination,
  FileDestination,
  LevelFilter,
  ModuleFilter,
  logger,
  globalLogger,
  debug,
  info,
  warn,
  error,
  fatal,
  startTimer,
  metric,
  createLogger,
  createConsoleLogger,
  createFileLogger,
  createMultiDestinationLogger,
} from './Logger';

// Import for internal use
import { globalLogger, LoggerFactory } from './Logger';
import { 
  counter, 
  gauge, 
  histogram, 
  time, 
  timeAsync 
} from './Metrics';
import { 
  setContext, 
  setCorrelationId, 
  runWithContext, 
  runWithContextAsync 
} from './Context';

/**
 * Telemetry system initialization and configuration
 */
export class TelemetrySystem {
  private static initialized = false;
  private static config: any = null;

  /**
   * Initialize the telemetry system with configuration
   */
  public static initialize(config?: any): void {
    if (TelemetrySystem.initialized) {
      return;
    }

    TelemetrySystem.config = config;
    TelemetrySystem.initialized = true;

    // Initialize subsystems
    globalLogger.info('Telemetry system initialized', {
      operation: 'telemetry_init',
      module: 'telemetry',
    }, {
      config_provided: !!config,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if telemetry system is initialized
   */
  public static isInitialized(): boolean {
    return TelemetrySystem.initialized;
  }

  /**
   * Get current configuration
   */
  public static getConfig(): any {
    return TelemetrySystem.config;
  }

  /**
   * Shutdown telemetry system
   */
  public static async shutdown(): Promise<void> {
    if (!TelemetrySystem.initialized) {
      return;
    }

    globalLogger.info('Telemetry system shutting down', {
      operation: 'telemetry_shutdown',
      module: 'telemetry',
    });

    // Flush all pending logs and metrics
    globalLogger.flush();
    
    TelemetrySystem.initialized = false;
  }
}

/**
 * Default telemetry initialization for quick setup
 */
export const initializeTelemetry = (config?: any) => TelemetrySystem.initialize(config);

/**
 * Quick access to commonly used telemetry functions
 */
export const telemetry = {
  // Logging
  debug: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
    globalLogger.debug(message, context, metadata),
  info: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
    globalLogger.info(message, context, metadata),
  warn: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
    globalLogger.warn(message, context, metadata),
  error: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => 
    globalLogger.error(message, error, metadata),
  fatal: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => 
    globalLogger.error(message, error, metadata), // Map fatal to error
  
  // Metrics
  counter,
  gauge,
  histogram,
  time,
  timeAsync,
  
  // Context
  setContext,
  setCorrelationId,
  runWithContext,
  runWithContextAsync,
  
  // System
  initialize: initializeTelemetry,
  shutdown: TelemetrySystem.shutdown,
  isInitialized: TelemetrySystem.isInitialized,
} as const;
