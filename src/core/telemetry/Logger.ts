/**
 * Structured Logger Implementation
 * 
 * Provides structured JSON logging with context propagation, performance metrics,
 * and zero-overhead when disabled.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = 4
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  correlationId?: string;
  module?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LogDestination {
  write(entry: LogEntry): void;
  flush?(): void;
}

export interface LogFilter {
  shouldLog(entry: LogEntry): boolean;
}

export interface LoggerConfig {
  level: LogLevel;
  destinations: LogDestination[];
  filters?: LogFilter[];
  enablePerformance?: boolean;
  module?: string;
}

export class ConsoleDestination implements LogDestination {
  write(entry: LogEntry): void {
    this.writeToConsole(JSON.stringify(entry));
  }

  private writeToConsole(message: string): void {
    try {
      console.log(message);
    } catch (error: any) {
      // Handle EPIPE errors gracefully (broken pipe when output is piped)
      if (error?.code === 'EPIPE') {
        // Silently ignore EPIPE errors to prevent crash
        return;
      }
      // Re-throw other errors
      throw error;
    }
  }
}

export class FileDestination implements LogDestination {
  constructor(private filePath: string) {}

  write(entry: LogEntry): void {
    // Implementation would use fs.appendFile in real scenario
    // For demo purposes, we'll use console with file prefix
    console.log(`[FILE:${this.filePath}] ${JSON.stringify(entry)}`);
  }
}

export class LevelFilter implements LogFilter {
  constructor(private minLevel: LogLevel) {}

  shouldLog(entry: LogEntry): boolean {
    const entryLevel = LogLevel[entry.level as keyof typeof LogLevel];
    return entryLevel >= this.minLevel;
  }
}

export class ModuleFilter implements LogFilter {
  constructor(private modules: string[]) {}

  shouldLog(entry: LogEntry): boolean {
    if (!entry.module) return true;
    return this.modules.includes(entry.module);
  }
}

export class StructuredLogger {
  private static globalLogger: StructuredLogger | null = null;
  private children = new Map<string, StructuredLogger>();

  constructor(private config: LoggerConfig) {}

  static getGlobalLogger(): StructuredLogger {
    if (!StructuredLogger.globalLogger) {
      StructuredLogger.globalLogger = LoggerFactory.createLogger({
        level: LogLevel.INFO,
        destinations: [new ConsoleDestination()]
      });
    }
    return StructuredLogger.globalLogger;
  }

  static setGlobalLogger(logger: StructuredLogger): void {
    StructuredLogger.globalLogger = logger;
  }

  child(module: string, context?: Record<string, any>): StructuredLogger {
    const key = `${module}-${JSON.stringify(context || {})}`;
    
    if (!this.children.has(key)) {
      const childConfig: LoggerConfig = {
        ...this.config,
        module
      };
      
      const child = new StructuredLogger(childConfig);
      child.children = this.children; // Share children map
      this.children.set(key, child);
    }
    
    return this.children.get(key)!;
  }

  debug(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  info(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  warn(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  error(message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>): void {
    let context: Record<string, any> | undefined;
    let errorObj: { name: string; message: string; stack?: string } | undefined;

    if (error instanceof Error) {
      errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (error) {
      context = error;
    }

    const entry = this.createLogEntry(LogLevel.ERROR, message, context, metadata);
    if (errorObj) {
      entry.error = errorObj;
    }

    this.writeEntry(entry);
  }

  performance<T>(operation: string, fn: () => T, context?: Record<string, any>): T {
    if (!this.config.enablePerformance) {
      return fn();
    }

    const startTime = process.hrtime.bigint();
    const start = Date.now();

    try {
      const result = fn();
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      this.info(`Performance: ${operation}`, {
        ...context,
        operation,
        duration_ms: Math.round(duration * 100) / 100,
        timestamp: new Date(start).toISOString()
      }, {
        type: 'performance',
        start_time: start,
        end_time: Date.now()
      });

      return result;
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;

      this.error(`Performance: ${operation} failed`, error instanceof Error ? error : new Error(String(error)), {
        operation,
        duration_ms: Math.round(duration * 100) / 100,
        timestamp: new Date(start).toISOString(),
        type: 'performance_error'
      });

      throw error;
    }
  }

  async performanceAsync<T>(operation: string, fn: () => Promise<T>, context?: Record<string, any>): Promise<T> {
    if (!this.config.enablePerformance) {
      return fn();
    }

    const startTime = process.hrtime.bigint();
    const start = Date.now();

    try {
      const result = await fn();
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;

      this.info(`Performance: ${operation}`, {
        ...context,
        operation,
        duration_ms: Math.round(duration * 100) / 100,
        timestamp: new Date(start).toISOString()
      }, {
        type: 'performance_async',
        start_time: start,
        end_time: Date.now()
      });

      return result;
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;

      this.error(`Performance: ${operation} failed`, error instanceof Error ? error : new Error(String(error)), {
        operation,
        duration_ms: Math.round(duration * 100) / 100,
        timestamp: new Date(start).toISOString(),
        type: 'performance_async_error'
      });

      throw error;
    }
  }

  flush(): void {
    this.config.destinations.forEach(dest => {
      if (dest.flush) {
        dest.flush();
      }
    });
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(level, message, context, metadata);
    this.writeEntry(entry);
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, metadata?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      context,
      metadata,
      module: this.config.module
    };

    // Add correlation ID from context if available
    // This would integrate with Context.ts in a full implementation
    try {
      const { getCurrentContext } = require('./Context');
      const currentContext = getCurrentContext();
      if (currentContext?.correlationId) {
        entry.correlationId = currentContext.correlationId;
      }
    } catch {
      // Context module not available or error - continue without correlation ID
    }

    return entry;
  }

  private writeEntry(entry: LogEntry): void {
    // Apply filters
    if (this.config.filters) {
      for (const filter of this.config.filters) {
        if (!filter.shouldLog(entry)) {
          return;
        }
      }
    }

    // Write to all destinations
    this.config.destinations.forEach(dest => {
      try {
        dest.write(entry);
      } catch (error) {
        // Don't let destination errors crash the application
        console.error('Logger destination error:', error);
      }
    });
  }
}

export class LoggerFactory {
  static createLogger(config: LoggerConfig): StructuredLogger {
    return new StructuredLogger(config);
  }

  static createConsoleLogger(level: LogLevel = LogLevel.INFO): StructuredLogger {
    return new StructuredLogger({
      level,
      destinations: [new ConsoleDestination()],
      filters: [new LevelFilter(level)],
      enablePerformance: true
    });
  }

  static createFileLogger(filePath: string, level: LogLevel = LogLevel.INFO): StructuredLogger {
    return new StructuredLogger({
      level,
      destinations: [new FileDestination(filePath)],
      filters: [new LevelFilter(level)],
      enablePerformance: true
    });
  }

  static createMultiDestinationLogger(
    destinations: LogDestination[],
    level: LogLevel = LogLevel.INFO,
    filters?: LogFilter[]
  ): StructuredLogger {
    return new StructuredLogger({
      level,
      destinations,
      filters: filters || [new LevelFilter(level)],
      enablePerformance: true
    });
  }
}

// Convenience exports
export const logger = StructuredLogger.getGlobalLogger();
export const globalLogger = logger; // Alias for compatibility
export const createLogger = LoggerFactory.createLogger;
export const createConsoleLogger = LoggerFactory.createConsoleLogger;
export const createFileLogger = LoggerFactory.createFileLogger;
export const createMultiDestinationLogger = LoggerFactory.createMultiDestinationLogger;

// Global convenience functions that tests expect
export const debug = (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
  logger.debug(message, context, metadata);

export const info = (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
  logger.info(message, context, metadata);

export const warn = (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => 
  logger.warn(message, context, metadata);

export const error = (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => 
  logger.error(message, error, metadata);

export const fatal = (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => 
  logger.error(message, error, metadata); // Map fatal to error since we don't have fatal level

// Metrics/timer functions that tests expect (delegate to global metrics)
export const startTimer = (name: string, tags?: Record<string, string>) => {
  // Simple timer implementation for compatibility
  const start = process.hrtime.bigint();
  return () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    logger.info(`Timer: ${name}`, undefined, {
      type: 'timer',
      duration_ms: Math.round(duration * 100) / 100,
      tags
    });
    return duration;
  };
};

export const metric = (name: string, value: number, type: string, tags?: Record<string, string>) => {
  logger.info(`Metric: ${name}`, undefined, {
    type: 'metric',
    metric_name: name,
    metric_value: value,
    metric_type: type,
    tags
  });
};
