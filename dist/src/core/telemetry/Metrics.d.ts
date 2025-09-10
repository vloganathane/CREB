/**
 * @fileoverview Performance Metrics Collection and Analysis
 * @module @creb/core/telemetry/Metrics
 * @version 1.0.0
 * @author CREB Team
 *
 * Comprehensive metrics collection system for performance monitoring,
 * automatic metric capture, and telemetry aggregation.
 */
import { EventEmitter } from 'events';
import { Metric, PerformanceMetrics, MetricCollector, Timestamp, CorrelationId } from './types';
/**
 * Timer instance for measuring durations
 */
export interface Timer {
    /** Timer name */
    name: string;
    /** Start timestamp */
    startTime: number;
    /** Stop the timer and record metric */
    stop(): number;
    /** Get elapsed time without stopping */
    elapsed(): number;
}
/**
 * Metric value with metadata
 */
interface MetricValue {
    value: number;
    timestamp: Timestamp;
    tags: Record<string, string>;
    correlationId?: CorrelationId;
}
/**
 * Metrics Registry for storing and managing metrics
 */
export declare class MetricsRegistry extends EventEmitter implements MetricCollector {
    private metrics;
    private counters;
    private gauges;
    private histograms;
    private timers;
    private readonly maxRetentionSize;
    private readonly defaultBuckets;
    constructor();
    /**
     * Record a counter metric (monotonically increasing)
     */
    counter(name: string, value?: number, tags?: Record<string, string>): void;
    /**
     * Record a gauge metric (arbitrary value that can go up or down)
     */
    gauge(name: string, value: number, tags?: Record<string, string>): void;
    /**
     * Record a histogram metric (distribution of values)
     */
    histogram(name: string, value: number, tags?: Record<string, string>, buckets?: number[]): void;
    /**
     * Start a timer for measuring duration
     */
    startTimer(name: string, tags?: Record<string, string>): Timer;
    /**
     * Time a synchronous function execution
     */
    time<T>(name: string, fn: () => T, tags?: Record<string, string>): T;
    /**
     * Time an asynchronous function execution
     */
    timeAsync<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T>;
    /**
     * Record custom performance metrics
     */
    recordPerformanceMetrics(metrics: PerformanceMetrics, tags?: Record<string, string>): void;
    /**
     * Get current metric value
     */
    getMetric(name: string): Metric | undefined;
    /**
     * Get all metrics values for a metric name
     */
    getMetricHistory(name: string, limit?: number): MetricValue[];
    /**
     * Get metric statistics
     */
    getMetricStats(name: string): MetricStats | undefined;
    /**
     * Collect all current metrics
     */
    collect(): Promise<Metric[]>;
    /**
     * Reset all metrics
     */
    reset(): void;
    /**
     * Reset specific metric
     */
    resetMetric(name: string): void;
    /**
     * Get system performance metrics
     */
    getSystemMetrics(): PerformanceMetrics;
    /**
     * Check performance thresholds and emit alerts
     */
    checkThresholds(): void;
    /**
     * Record a metric value internally
     */
    private recordMetric;
    /**
     * Infer metric type from name patterns
     */
    private inferMetricType;
    /**
     * Calculate median value
     */
    private calculateMedian;
    /**
     * Calculate percentile value
     */
    private calculatePercentile;
    /**
     * Calculate standard deviation
     */
    private calculateStandardDeviation;
    /**
     * Setup periodic cleanup of old metrics
     */
    private setupPeriodicCleanup;
}
/**
 * Metric statistics interface
 */
export interface MetricStats {
    count: number;
    min: number;
    max: number;
    mean: number;
    median: number;
    p95: number;
    p99: number;
    stdDev: number;
}
/**
 * Performance profiler for automatic metric capture
 */
export declare class PerformanceProfiler {
    private readonly metrics;
    private readonly enabled;
    constructor(metrics: MetricsRegistry, enabled?: boolean);
    /**
     * Profile a function execution
     */
    profile<T>(name: string, fn: () => T, tags?: Record<string, string>): T;
    /**
     * Profile an async function execution
     */
    profileAsync<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T>;
    /**
     * Create a profiling decorator
     */
    createProfileDecorator(name?: string, tags?: Record<string, string>): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
}
/**
 * Global metrics registry instance
 */
export declare const globalMetrics: MetricsRegistry;
/**
 * Global performance profiler
 */
export declare const globalProfiler: PerformanceProfiler;
/**
 * Convenience functions for metrics
 */
export declare const counter: (name: string, value?: number, tags?: Record<string, string>) => void;
export declare const gauge: (name: string, value: number, tags?: Record<string, string>) => void;
export declare const histogram: (name: string, value: number, tags?: Record<string, string>) => void;
export declare const startTimer: (name: string, tags?: Record<string, string>) => Timer;
export declare const time: <T>(name: string, fn: () => T, tags?: Record<string, string>) => T;
export declare const timeAsync: <T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>) => Promise<T>;
/**
 * Profile decorator for automatic method timing
 */
export declare const Profile: (name?: string, tags?: Record<string, string>) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};
//# sourceMappingURL=Metrics.d.ts.map