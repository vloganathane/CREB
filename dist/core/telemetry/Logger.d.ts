/**
 * Structured Logger Implementation
 *
 * Provides structured JSON logging with context propagation, performance metrics,
 * and zero-overhead when disabled.
 */
export declare enum LogLevel {
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
export declare class ConsoleDestination implements LogDestination {
    write(entry: LogEntry): void;
    private writeToConsole;
}
export declare class FileDestination implements LogDestination {
    private filePath;
    constructor(filePath: string);
    write(entry: LogEntry): void;
}
export declare class LevelFilter implements LogFilter {
    private minLevel;
    constructor(minLevel: LogLevel);
    shouldLog(entry: LogEntry): boolean;
}
export declare class ModuleFilter implements LogFilter {
    private modules;
    constructor(modules: string[]);
    shouldLog(entry: LogEntry): boolean;
}
export declare class StructuredLogger {
    private config;
    private static globalLogger;
    private children;
    constructor(config: LoggerConfig);
    static getGlobalLogger(): StructuredLogger;
    static setGlobalLogger(logger: StructuredLogger): void;
    child(module: string, context?: Record<string, any>): StructuredLogger;
    debug(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void;
    error(message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>): void;
    performance<T>(operation: string, fn: () => T, context?: Record<string, any>): T;
    performanceAsync<T>(operation: string, fn: () => Promise<T>, context?: Record<string, any>): Promise<T>;
    flush(): void;
    private log;
    private createLogEntry;
    private writeEntry;
}
export declare class LoggerFactory {
    static createLogger(config: LoggerConfig): StructuredLogger;
    static createConsoleLogger(level?: LogLevel): StructuredLogger;
    static createFileLogger(filePath: string, level?: LogLevel): StructuredLogger;
    static createMultiDestinationLogger(destinations: LogDestination[], level?: LogLevel, filters?: LogFilter[]): StructuredLogger;
}
export declare const logger: StructuredLogger;
export declare const globalLogger: StructuredLogger;
export declare const createLogger: typeof LoggerFactory.createLogger;
export declare const createConsoleLogger: typeof LoggerFactory.createConsoleLogger;
export declare const createFileLogger: typeof LoggerFactory.createFileLogger;
export declare const createMultiDestinationLogger: typeof LoggerFactory.createMultiDestinationLogger;
export declare const debug: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
export declare const info: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
export declare const warn: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
export declare const error: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => void;
export declare const fatal: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => void;
export declare const startTimer: (name: string, tags?: Record<string, string>) => () => number;
export declare const metric: (name: string, value: number, type: string, tags?: Record<string, string>) => void;
//# sourceMappingURL=Logger.d.ts.map