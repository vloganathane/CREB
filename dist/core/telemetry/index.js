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
export { ContextManager, ContextUtils, globalContextManager, getCurrentContext, getCurrentCorrelationId, setContext, setCorrelationId, runWithContext, runWithContextAsync, withContext, } from './Context';
// Metrics and performance
export { globalMetrics, MetricsRegistry, PerformanceProfiler, globalProfiler, counter, gauge, histogram, time, timeAsync, Profile, startTimer as metricsStartTimer, } from './Metrics';
// Structured logging
export { StructuredLogger, LoggerFactory, LogLevel, ConsoleDestination, FileDestination, LevelFilter, ModuleFilter, logger, globalLogger, debug, info, warn, error, fatal, startTimer, metric, createLogger, createConsoleLogger, createFileLogger, createMultiDestinationLogger, } from './Logger';
// Import for internal use
import { globalLogger } from './Logger';
import { counter, gauge, histogram, time, timeAsync } from './Metrics';
import { setContext, setCorrelationId, runWithContext, runWithContextAsync } from './Context';
/**
 * Telemetry system initialization and configuration
 */
export class TelemetrySystem {
    /**
     * Initialize the telemetry system with configuration
     */
    static initialize(config) {
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
    static isInitialized() {
        return TelemetrySystem.initialized;
    }
    /**
     * Get current configuration
     */
    static getConfig() {
        return TelemetrySystem.config;
    }
    /**
     * Shutdown telemetry system
     */
    static async shutdown() {
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
TelemetrySystem.initialized = false;
TelemetrySystem.config = null;
/**
 * Default telemetry initialization for quick setup
 */
export const initializeTelemetry = (config) => TelemetrySystem.initialize(config);
/**
 * Quick access to commonly used telemetry functions
 */
export const telemetry = {
    // Logging
    debug: (message, context, metadata) => globalLogger.debug(message, context, metadata),
    info: (message, context, metadata) => globalLogger.info(message, context, metadata),
    warn: (message, context, metadata) => globalLogger.warn(message, context, metadata),
    error: (message, error, metadata) => globalLogger.error(message, error, metadata),
    fatal: (message, error, metadata) => globalLogger.error(message, error, metadata), // Map fatal to error
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
};
//# sourceMappingURL=index.js.map