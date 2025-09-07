/**
 * Structured Logger Implementation
 *
 * Provides structured JSON logging with context propagation, performance metrics,
 * and zero-overhead when disabled.
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["OFF"] = 4] = "OFF";
})(LogLevel || (LogLevel = {}));
export class ConsoleDestination {
    write(entry) {
        this.writeToConsole(JSON.stringify(entry));
    }
    writeToConsole(message) {
        try {
            console.log(message);
        }
        catch (error) {
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
export class FileDestination {
    constructor(filePath) {
        this.filePath = filePath;
    }
    write(entry) {
        // Implementation would use fs.appendFile in real scenario
        // For demo purposes, we'll use console with file prefix
        console.log(`[FILE:${this.filePath}] ${JSON.stringify(entry)}`);
    }
}
export class LevelFilter {
    constructor(minLevel) {
        this.minLevel = minLevel;
    }
    shouldLog(entry) {
        const entryLevel = LogLevel[entry.level];
        return entryLevel >= this.minLevel;
    }
}
export class ModuleFilter {
    constructor(modules) {
        this.modules = modules;
    }
    shouldLog(entry) {
        if (!entry.module)
            return true;
        return this.modules.includes(entry.module);
    }
}
export class StructuredLogger {
    constructor(config) {
        this.config = config;
        this.children = new Map();
    }
    static getGlobalLogger() {
        if (!StructuredLogger.globalLogger) {
            StructuredLogger.globalLogger = LoggerFactory.createLogger({
                level: LogLevel.INFO,
                destinations: [new ConsoleDestination()]
            });
        }
        return StructuredLogger.globalLogger;
    }
    static setGlobalLogger(logger) {
        StructuredLogger.globalLogger = logger;
    }
    child(module, context) {
        const key = `${module}-${JSON.stringify(context || {})}`;
        if (!this.children.has(key)) {
            const childConfig = {
                ...this.config,
                module
            };
            const child = new StructuredLogger(childConfig);
            child.children = this.children; // Share children map
            this.children.set(key, child);
        }
        return this.children.get(key);
    }
    debug(message, context, metadata) {
        this.log(LogLevel.DEBUG, message, context, metadata);
    }
    info(message, context, metadata) {
        this.log(LogLevel.INFO, message, context, metadata);
    }
    warn(message, context, metadata) {
        this.log(LogLevel.WARN, message, context, metadata);
    }
    error(message, error, metadata) {
        let context;
        let errorObj;
        if (error instanceof Error) {
            errorObj = {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }
        else if (error) {
            context = error;
        }
        const entry = this.createLogEntry(LogLevel.ERROR, message, context, metadata);
        if (errorObj) {
            entry.error = errorObj;
        }
        this.writeEntry(entry);
    }
    performance(operation, fn, context) {
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
        }
        catch (error) {
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
    async performanceAsync(operation, fn, context) {
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
        }
        catch (error) {
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
    flush() {
        this.config.destinations.forEach(dest => {
            if (dest.flush) {
                dest.flush();
            }
        });
    }
    log(level, message, context, metadata) {
        const entry = this.createLogEntry(level, message, context, metadata);
        this.writeEntry(entry);
    }
    createLogEntry(level, message, context, metadata) {
        const entry = {
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
        }
        catch {
            // Context module not available or error - continue without correlation ID
        }
        return entry;
    }
    writeEntry(entry) {
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
            }
            catch (error) {
                // Don't let destination errors crash the application
                console.error('Logger destination error:', error);
            }
        });
    }
}
StructuredLogger.globalLogger = null;
export class LoggerFactory {
    static createLogger(config) {
        return new StructuredLogger(config);
    }
    static createConsoleLogger(level = LogLevel.INFO) {
        return new StructuredLogger({
            level,
            destinations: [new ConsoleDestination()],
            filters: [new LevelFilter(level)],
            enablePerformance: true
        });
    }
    static createFileLogger(filePath, level = LogLevel.INFO) {
        return new StructuredLogger({
            level,
            destinations: [new FileDestination(filePath)],
            filters: [new LevelFilter(level)],
            enablePerformance: true
        });
    }
    static createMultiDestinationLogger(destinations, level = LogLevel.INFO, filters) {
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
export const debug = (message, context, metadata) => logger.debug(message, context, metadata);
export const info = (message, context, metadata) => logger.info(message, context, metadata);
export const warn = (message, context, metadata) => logger.warn(message, context, metadata);
export const error = (message, error, metadata) => logger.error(message, error, metadata);
export const fatal = (message, error, metadata) => logger.error(message, error, metadata); // Map fatal to error since we don't have fatal level
// Metrics/timer functions that tests expect (delegate to global metrics)
export const startTimer = (name, tags) => {
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
export const metric = (name, value, type, tags) => {
    logger.info(`Metric: ${name}`, undefined, {
        type: 'metric',
        metric_name: name,
        metric_value: value,
        metric_type: type,
        tags
    });
};
//# sourceMappingURL=Logger.js.map