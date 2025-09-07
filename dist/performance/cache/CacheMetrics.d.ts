/**
 * Cache Metrics Collection and Analysis for CREB-JS
 *
 * Provides comprehensive metrics collection, analysis, and reporting for cache performance.
 * Includes real-time monitoring, historical analysis, and performance recommendations.
 */
import { CacheStats, CacheMetrics, CacheEvent, CacheEventType } from './types';
/**
 * Real-time cache metrics collector
 */
export declare class CacheMetricsCollector {
    private stats;
    private history;
    private maxHistorySize;
    private eventCounts;
    private accessTimes;
    private maxAccessTimeSamples;
    constructor();
    /**
     * Reset all statistics
     */
    resetStats(): void;
    /**
     * Record a cache event
     */
    recordEvent(event: CacheEvent): void;
    /**
     * Update cache size and memory usage
     */
    updateCacheInfo(size: number, memoryUsage: number, maxMemory: number): void;
    /**
     * Get current statistics
     */
    getStats(): CacheStats;
    /**
     * Get comprehensive metrics with historical data and trends
     */
    getMetrics(): CacheMetrics;
    /**
     * Take a snapshot of current stats for historical tracking
     */
    takeSnapshot(): void;
    /**
     * Get event counts
     */
    getEventCounts(): Map<CacheEventType, number>;
    /**
     * Get access time percentiles
     */
    getAccessTimePercentiles(): {
        p50: number;
        p90: number;
        p95: number;
        p99: number;
    };
    /**
     * Update computed statistics
     */
    private updateComputedStats;
    /**
     * Calculate performance trends
     */
    private calculateTrends;
    /**
     * Calculate peak performance metrics
     */
    private calculatePeaks;
    /**
     * Get percentile value from sorted array
     */
    private getPercentile;
}
/**
 * Cache performance analyzer
 */
export declare class CachePerformanceAnalyzer {
    /**
     * Analyze cache performance and provide recommendations
     */
    static analyze(metrics: CacheMetrics): {
        score: number;
        issues: string[];
        recommendations: string[];
        insights: string[];
    };
    /**
     * Generate performance report
     */
    static generateReport(metrics: CacheMetrics): string;
}
//# sourceMappingURL=CacheMetrics.d.ts.map