/**
 * @fileoverview Telemetry Module Exports
 * @module @creb/core/telemetry
 * @version 1.0.0
 * @author CREB Team
 *
 * Main exports for the CREB telemetry system including structured logging,
 * metrics collection, context management, and performance monitoring.
 */
export * from './types';
export { ContextManager, ContextUtils, type ContextTrace, globalContextManager, getCurrentContext, getCurrentCorrelationId, setContext, setCorrelationId, runWithContext, runWithContextAsync, withContext, } from './Context';
export { globalMetrics, type MetricStats, MetricsRegistry, PerformanceProfiler, globalProfiler, counter, gauge, histogram, time, timeAsync, Profile, startTimer as metricsStartTimer, } from './Metrics';
export { StructuredLogger, LoggerFactory, LogLevel, ConsoleDestination, FileDestination, LevelFilter, ModuleFilter, logger, globalLogger, debug, info, warn, error, fatal, startTimer, metric, createLogger, createConsoleLogger, createFileLogger, createMultiDestinationLogger, } from './Logger';
/**
 * Telemetry system initialization and configuration
 */
export declare class TelemetrySystem {
    private static initialized;
    private static config;
    /**
     * Initialize the telemetry system with configuration
     */
    static initialize(config?: any): void;
    /**
     * Check if telemetry system is initialized
     */
    static isInitialized(): boolean;
    /**
     * Get current configuration
     */
    static getConfig(): any;
    /**
     * Shutdown telemetry system
     */
    static shutdown(): Promise<void>;
}
/**
 * Default telemetry initialization for quick setup
 */
export declare const initializeTelemetry: (config?: any) => void;
/**
 * Quick access to commonly used telemetry functions
 */
export declare const telemetry: {
    readonly debug: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
    readonly info: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
    readonly warn: (message: string, context?: Record<string, any>, metadata?: Record<string, any>) => void;
    readonly error: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => void;
    readonly fatal: (message: string, error?: Error | Record<string, any>, metadata?: Record<string, any>) => void;
    readonly counter: (name: string, value?: number, tags?: Record<string, string>) => void;
    readonly gauge: (name: string, value: number, tags?: Record<string, string>) => void;
    readonly histogram: (name: string, value: number, tags?: Record<string, string>) => void;
    readonly time: <T>(name: string, fn: () => T, tags?: Record<string, string>) => T;
    readonly timeAsync: <T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>) => Promise<T>;
    readonly setContext: (context: Partial<import("./types").LogContext>) => void;
    readonly setCorrelationId: (id: import("./types").CorrelationId) => void;
    readonly runWithContext: <T>(context: Partial<import("./types").LogContext>, fn: () => T) => T;
    readonly runWithContextAsync: <T>(context: Partial<import("./types").LogContext>, fn: () => Promise<T>) => Promise<T>;
    readonly initialize: (config?: any) => void;
    readonly shutdown: typeof TelemetrySystem.shutdown;
    readonly isInitialized: typeof TelemetrySystem.isInitialized;
};
//# sourceMappingURL=index.d.ts.map