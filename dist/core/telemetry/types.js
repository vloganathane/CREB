/**
 * @fileoverview Telemetry and Logging Type Definitions
 * @module @creb/core/telemetry/types
 * @version 1.0.0
 * @author CREB Team
 *
 * Comprehensive type definitions for structured logging, metrics, and telemetry.
 * Supports correlation IDs, performance tracking, and multi-destination logging.
 */
/**
 * Log level hierarchy for filtering
 */
export const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
};
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
};
/**
 * Type guards for runtime type checking
 */
export const isLogLevel = (value) => {
    return typeof value === 'string' && value in LOG_LEVELS;
};
export const isLogEntry = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'level' in value &&
        'message' in value &&
        'timestamp' in value &&
        'correlationId' in value);
};
export const isMetric = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'type' in value &&
        'value' in value &&
        'timestamp' in value);
};
/**
 * Utility functions for creating branded types
 */
export const createCorrelationId = (id) => id;
export const createTimestamp = (timestamp) => (timestamp ?? Date.now());
/**
 * Default telemetry configuration
 */
export const DEFAULT_TELEMETRY_CONFIG = {
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
//# sourceMappingURL=types.js.map