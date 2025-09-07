/**
 * @fileoverview Validation Metrics Dashboard and Performance Monitoring
 *
 * Provides comprehensive performance monitoring and metrics collection
 * for the validation pipeline with real-time dashboard capabilities.
 */
import { EventEmitter } from 'events';
import { ValidationResult } from '../types';
/**
 * Real-time validation metrics and performance data
 */
export interface ValidationPerformanceMetrics {
    /** Total validations performed */
    totalValidations: number;
    /** Successful validations */
    successfulValidations: number;
    /** Failed validations */
    failedValidations: number;
    /** Average validation time in milliseconds */
    averageValidationTime: number;
    /** Peak validation time in milliseconds */
    peakValidationTime: number;
    /** Minimum validation time in milliseconds */
    minValidationTime: number;
    /** Validations per second (current rate) */
    validationsPerSecond: number;
    /** Cache hit rate percentage */
    cacheHitRate: number;
    /** Memory usage for validation operations */
    memoryUsage: MemoryUsageMetrics;
    /** Error distribution by type */
    errorDistribution: Map<string, number>;
    /** Performance percentiles */
    percentiles: PerformancePercentiles;
    /** Validator-specific metrics */
    validatorMetrics: Map<string, ValidatorPerformanceMetrics>;
    /** Time series data for trending */
    timeSeries: TimeSeries[];
}
/**
 * Memory usage metrics
 */
export interface MemoryUsageMetrics {
    /** Current memory usage in MB */
    current: number;
    /** Peak memory usage in MB */
    peak: number;
    /** Average memory usage in MB */
    average: number;
    /** Memory allocation rate */
    allocationRate: number;
}
/**
 * Performance percentile data
 */
export interface PerformancePercentiles {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
}
/**
 * Validator-specific performance metrics
 */
export interface ValidatorPerformanceMetrics {
    /** Validator name */
    name: string;
    /** Number of executions */
    executions: number;
    /** Average execution time */
    averageTime: number;
    /** Success rate percentage */
    successRate: number;
    /** Error count */
    errorCount: number;
    /** Cache hit rate for this validator */
    cacheHitRate: number;
}
/**
 * Time series data point
 */
export interface TimeSeries {
    /** Timestamp */
    timestamp: Date;
    /** Validations per second at this time */
    validationsPerSecond: number;
    /** Average response time at this time */
    averageResponseTime: number;
    /** Error rate at this time */
    errorRate: number;
    /** Memory usage at this time */
    memoryUsage: number;
}
/**
 * Dashboard configuration options
 */
export interface DashboardConfig {
    /** Update interval in milliseconds */
    updateInterval: number;
    /** Maximum time series data points to keep */
    maxTimeSeriesPoints: number;
    /** Whether to enable real-time updates */
    realTimeUpdates: boolean;
    /** Memory monitoring enabled */
    memoryMonitoring: boolean;
    /** Percentile calculation enabled */
    percentileTracking: boolean;
}
/**
 * Validation Metrics Dashboard
 *
 * Provides real-time monitoring and analytics for validation performance
 */
export declare class ValidationMetricsDashboard extends EventEmitter {
    private metrics;
    private config;
    private validationTimes;
    private recentValidations;
    private memorySnapshots;
    private updateTimer?;
    private startTime;
    constructor(config?: Partial<DashboardConfig>);
    /**
     * Record a validation result for metrics tracking
     */
    recordValidation(result: ValidationResult): void;
    /**
     * Get current performance metrics
     */
    getMetrics(): ValidationPerformanceMetrics;
    /**
     * Get metrics for a specific time range
     */
    getMetricsForTimeRange(startTime: Date, endTime: Date): ValidationPerformanceMetrics;
    /**
     * Get real-time dashboard data formatted for display
     */
    getDashboardData(): any;
    /**
     * Reset all metrics
     */
    reset(): void;
    /**
     * Export metrics to JSON
     */
    exportMetrics(): string;
    /**
     * Stop the dashboard and cleanup resources
     */
    stop(): void;
    private initializeMetrics;
    private startRealTimeUpdates;
    private updateTimingMetrics;
    private updateCacheMetrics;
    private recordErrors;
    private updateValidatorMetrics;
    private recordMemoryUsage;
    private updateDerivedMetrics;
    private calculatePercentiles;
    private getPercentile;
    private addTimeSeriesPoint;
    private cleanupOldData;
    private calculateSuccessRate;
    private getTopErrors;
    private calculateMetricsForValidations;
}
/**
 * Global metrics dashboard instance
 */
export declare const globalValidationDashboard: ValidationMetricsDashboard;
/**
 * Create a new metrics dashboard with custom configuration
 */
export declare function createValidationDashboard(config?: Partial<DashboardConfig>): ValidationMetricsDashboard;
/**
 * Utility function to format metrics for console display
 */
export declare function formatMetricsForConsole(metrics: ValidationPerformanceMetrics): string;
//# sourceMappingURL=ValidationMetricsDashboard.d.ts.map