/**
 * @fileoverview Telemetry and Logging Type Definitions
 * @module @creb/core/telemetry/types
 * @version 1.0.0
 * @author CREB Team
 * 
 * Comprehensive type definitions for structured logging, metrics, and telemetry.
 * Supports correlation IDs, performance tracking, and multi-destination logging.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogFormat = 'json' | 'text' | 'structured';
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'timer';

/**
 * Correlation ID for request/operation tracking
 */
export type CorrelationId = string & { readonly _brand: 'CorrelationId' };

/**
 * Timestamp with high precision
 */
export type Timestamp = number & { readonly _brand: 'Timestamp' };

/**
 * Log entry structure for consistent formatting
 */
export interface LogEntry {
  /** Unique log entry identifier */
  id: string;
  /** Log severity level */
  level: LogLevel;
  /** Primary log message */
  message: string;
  /** High-precision timestamp */
  timestamp: Timestamp;
  /** Correlation ID for request tracking */
  correlationId: CorrelationId;
  /** Logger name/category */
  logger: string;
  /** Operation context */
  context: LogContext;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Stack trace for errors */
  stack?: string;
  /** Error information */
  error?: ErrorInfo;
  /** Performance metrics */
  metrics?: PerformanceMetrics;
}

/**
 * Contextual information for log entries
 */
export interface LogContext {
  /** Operation being performed */
  operation: string;
  /** Module/component name */
  module: string;
  /** User/session identifier */
  userId?: string;
  /** Request identifier */
  requestId?: string;
  /** Additional context data */
  data?: Record<string, unknown>;
}

/**
 * Error information structure
 */
export interface ErrorInfo {
  /** Error name/type */
  name: string;
  /** Error message */
  message: string;
  /** Error code */
  code?: string | number;
  /** Stack trace */
  stack?: string;
  /** Inner/cause error */
  cause?: ErrorInfo;
  /** Additional error metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  /** Operation duration in milliseconds */
  duration?: number;
  /** Memory usage in bytes */
  memoryUsage?: number;
  /** CPU usage percentage */
  cpuUsage?: number;
  /** Number of operations */
  operationCount?: number;
  /** Cache hit ratio */
  cacheHitRatio?: number;
  /** Custom metrics */
  custom?: Record<string, number>;
}

/**
 * Metric definition and value
 */
export interface Metric {
  /** Metric name */
  name: string;
  /** Metric type */
  type: MetricType;
  /** Metric value */
  value: number;
  /** Metric tags/labels */
  tags?: Record<string, string>;
  /** Timestamp when metric was recorded */
  timestamp: Timestamp;
  /** Metric unit */
  unit?: string;
  /** Metric description */
  description?: string;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /** Logger name */
  name: string;
  /** Minimum log level */
  level: LogLevel;
  /** Log format */
  format: LogFormat;
  /** Output destinations */
  destinations: LogDestination[];
  /** Enable/disable logging */
  enabled: boolean;
  /** Include stack traces for errors */
  includeStack: boolean;
  /** Include performance metrics */
  includeMetrics: boolean;
  /** Buffer size for batching */
  bufferSize?: number;
  /** Flush interval in milliseconds */
  flushInterval?: number;
}

/**
 * Log destination configuration
 */
export interface LogDestination {
  /** Destination type */
  type: 'console' | 'file' | 'http' | 'custom';
  /** Destination-specific options */
  options: Record<string, unknown>;
  /** Minimum log level for this destination */
  level?: LogLevel;
  /** Custom formatter function */
  formatter?: LogFormatter;
  /** Enable/disable this destination */
  enabled: boolean;
}

/**
 * Log formatter function type
 */
export type LogFormatter = (entry: LogEntry) => string;

/**
 * Log filter function type
 */
export type LogFilter = (entry: LogEntry) => boolean;

/**
 * Metric collector interface
 */
export interface MetricCollector {
  /** Collect and return current metrics */
  collect(): Promise<Metric[]>;
  /** Reset metrics */
  reset(): void;
  /** Get metric by name */
  getMetric(name: string): Metric | undefined;
}

/**
 * Context propagation interface
 */
export interface ContextProvider {
  /** Get current context */
  getContext(): LogContext;
  /** Set context */
  setContext(context: Partial<LogContext>): void;
  /** Create child context */
  createChild(context: Partial<LogContext>): ContextProvider;
  /** Clear context */
  clear(): void;
}

/**
 * Telemetry events
 */
export interface TelemetryEvents {
  /** Log entry created */
  'log:created': LogEntry;
  /** Metric recorded */
  'metric:recorded': Metric;
  /** Context changed */
  'context:changed': LogContext;
  /** Error occurred */
  'error:occurred': ErrorInfo;
  /** Performance measurement */
  'performance:measured': PerformanceMetrics;
}

/**
 * Logger interface
 */
export interface ILogger {
  /** Debug level logging */
  debug(message: string, context?: Partial<LogContext>, metadata?: Record<string, unknown>): void;
  /** Info level logging */
  info(message: string, context?: Partial<LogContext>, metadata?: Record<string, unknown>): void;
  /** Warning level logging */
  warn(message: string, context?: Partial<LogContext>, metadata?: Record<string, unknown>): void;
  /** Error level logging */
  error(message: string, error?: Error, context?: Partial<LogContext>, metadata?: Record<string, unknown>): void;
  /** Fatal level logging */
  fatal(message: string, error?: Error, context?: Partial<LogContext>, metadata?: Record<string, unknown>): void;
  
  /** Start performance timer */
  startTimer(name: string): () => void;
  /** Record metric */
  metric(name: string, value: number, type: MetricType, tags?: Record<string, string>): void;
  
  /** Create child logger with context */
  child(context: Partial<LogContext>): ILogger;
  /** Set correlation ID */
  setCorrelationId(id: CorrelationId): void;
  /** Get current correlation ID */
  getCorrelationId(): CorrelationId | undefined;
}

/**
 * Log level hierarchy for filtering
 */
export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
} as const;

/**
 * Default performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Slow operation threshold in ms */
  SLOW_OPERATION: 1000,
  /** Very slow operation threshold in ms */
  VERY_SLOW_OPERATION: 5000,
  /** High memory usage threshold in bytes */
  HIGH_MEMORY_USAGE: 100 * 1024 * 1024, // 100MB
  /** High CPU usage threshold (percentage) */
  HIGH_CPU_USAGE: 80,
} as const;

/**
 * Telemetry configuration
 */
export interface TelemetryConfig {
  /** Global logger configuration */
  logger: LoggerConfig;
  /** Metrics collection configuration */
  metrics: {
    enabled: boolean;
    collectInterval: number;
    retentionPeriod: number;
  };
  /** Context configuration */
  context: {
    enabled: boolean;
    propagateAcrossAsync: boolean;
  };
  /** Performance monitoring configuration */
  performance: {
    enabled: boolean;
    sampleRate: number;
    thresholds: typeof PERFORMANCE_THRESHOLDS;
  };
}

/**
 * Type guards for runtime type checking
 */
export const isLogLevel = (value: unknown): value is LogLevel => {
  return typeof value === 'string' && value in LOG_LEVELS;
};

export const isLogEntry = (value: unknown): value is LogEntry => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'level' in value &&
    'message' in value &&
    'timestamp' in value &&
    'correlationId' in value
  );
};

export const isMetric = (value: unknown): value is Metric => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'type' in value &&
    'value' in value &&
    'timestamp' in value
  );
};

/**
 * Utility functions for creating branded types
 */
export const createCorrelationId = (id: string): CorrelationId => id as CorrelationId;
export const createTimestamp = (timestamp?: number): Timestamp => (timestamp ?? Date.now()) as Timestamp;

/**
 * Default telemetry configuration
 */
export const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = {
  logger: {
    name: 'creb',
    level: 'info',
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
    bufferSize: 100,
    flushInterval: 1000,
  },
  metrics: {
    enabled: true,
    collectInterval: 10000, // 10 seconds
    retentionPeriod: 3600000, // 1 hour
  },
  context: {
    enabled: true,
    propagateAcrossAsync: true,
  },
  performance: {
    enabled: true,
    sampleRate: 0.1, // 10% sampling
    thresholds: PERFORMANCE_THRESHOLDS,
  },
};
