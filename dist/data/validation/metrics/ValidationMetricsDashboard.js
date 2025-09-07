/**
 * @fileoverview Validation Metrics Dashboard and Performance Monitoring
 *
 * Provides comprehensive performance monitoring and metrics collection
 * for the validation pipeline with real-time dashboard capabilities.
 */
import { EventEmitter } from 'events';
/**
 * Validation Metrics Dashboard
 *
 * Provides real-time monitoring and analytics for validation performance
 */
export class ValidationMetricsDashboard extends EventEmitter {
    constructor(config = {}) {
        super();
        this.validationTimes = [];
        this.recentValidations = [];
        this.memorySnapshots = [];
        this.config = {
            updateInterval: 1000,
            maxTimeSeriesPoints: 100,
            realTimeUpdates: true,
            memoryMonitoring: true,
            percentileTracking: true,
            ...config
        };
        this.startTime = new Date();
        this.metrics = this.initializeMetrics();
        if (this.config.realTimeUpdates) {
            this.startRealTimeUpdates();
        }
    }
    /**
     * Record a validation result for metrics tracking
     */
    recordValidation(result) {
        const now = new Date();
        const success = result.isValid;
        const duration = result.metrics.duration;
        // Update basic counters
        this.metrics.totalValidations++;
        if (success) {
            this.metrics.successfulValidations++;
        }
        else {
            this.metrics.failedValidations++;
        }
        // Update timing metrics
        this.validationTimes.push(duration);
        this.recentValidations.push({ timestamp: now, duration, success });
        // Update min/max/average times
        this.updateTimingMetrics(duration);
        // Update cache metrics
        if (result.fromCache) {
            this.updateCacheMetrics();
        }
        // Record error distribution
        if (!success) {
            this.recordErrors(result.errors);
        }
        // Update validator-specific metrics
        this.updateValidatorMetrics(result);
        // Memory monitoring
        if (this.config.memoryMonitoring) {
            this.recordMemoryUsage();
        }
        // Cleanup old data
        this.cleanupOldData();
        // Emit update event
        this.emit('metrics:updated', this.metrics);
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        this.updateDerivedMetrics();
        return { ...this.metrics };
    }
    /**
     * Get metrics for a specific time range
     */
    getMetricsForTimeRange(startTime, endTime) {
        const filteredValidations = this.recentValidations.filter(v => v.timestamp >= startTime && v.timestamp <= endTime);
        const rangeMetrics = this.calculateMetricsForValidations(filteredValidations);
        return rangeMetrics;
    }
    /**
     * Get real-time dashboard data formatted for display
     */
    getDashboardData() {
        const current = this.getMetrics();
        return {
            summary: {
                total: current.totalValidations,
                successful: current.successfulValidations,
                failed: current.failedValidations,
                successRate: this.calculateSuccessRate(),
                avgTime: current.averageValidationTime,
                cacheHitRate: current.cacheHitRate
            },
            performance: {
                currentRate: current.validationsPerSecond,
                avgTime: current.averageValidationTime,
                peakTime: current.peakValidationTime,
                minTime: current.minValidationTime,
                percentiles: current.percentiles
            },
            memory: current.memoryUsage,
            validators: Array.from(current.validatorMetrics.values()),
            timeSeries: current.timeSeries.slice(-20), // Last 20 data points
            errors: this.getTopErrors(10)
        };
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = this.initializeMetrics();
        this.validationTimes = [];
        this.recentValidations = [];
        this.memorySnapshots = [];
        this.startTime = new Date();
        this.emit('metrics:reset');
    }
    /**
     * Export metrics to JSON
     */
    exportMetrics() {
        return JSON.stringify({
            metrics: this.getMetrics(),
            metadata: {
                exportTime: new Date(),
                uptime: Date.now() - this.startTime.getTime(),
                config: this.config
            }
        }, null, 2);
    }
    /**
     * Stop the dashboard and cleanup resources
     */
    stop() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = undefined;
        }
        this.removeAllListeners();
    }
    // ============================================================================
    // Private Methods
    // ============================================================================
    initializeMetrics() {
        return {
            totalValidations: 0,
            successfulValidations: 0,
            failedValidations: 0,
            averageValidationTime: 0,
            peakValidationTime: 0,
            minValidationTime: Infinity,
            validationsPerSecond: 0,
            cacheHitRate: 0,
            memoryUsage: {
                current: 0,
                peak: 0,
                average: 0,
                allocationRate: 0
            },
            errorDistribution: new Map(),
            percentiles: {
                p50: 0,
                p75: 0,
                p90: 0,
                p95: 0,
                p99: 0
            },
            validatorMetrics: new Map(),
            timeSeries: []
        };
    }
    startRealTimeUpdates() {
        this.updateTimer = setInterval(() => {
            this.updateDerivedMetrics();
            this.addTimeSeriesPoint();
            this.emit('metrics:realtime', this.metrics);
        }, this.config.updateInterval);
    }
    updateTimingMetrics(duration) {
        this.metrics.peakValidationTime = Math.max(this.metrics.peakValidationTime, duration);
        this.metrics.minValidationTime = Math.min(this.metrics.minValidationTime, duration);
        // Calculate rolling average
        const sum = this.validationTimes.reduce((a, b) => a + b, 0);
        this.metrics.averageValidationTime = sum / this.validationTimes.length;
    }
    updateCacheMetrics() {
        // Cache hit rate calculation would be based on cache-specific logic
        // This is a simplified version
        const totalWithCache = this.recentValidations.length;
        const cacheHits = this.recentValidations.filter(v => v.duration < this.metrics.averageValidationTime * 0.1).length;
        this.metrics.cacheHitRate = totalWithCache > 0 ? (cacheHits / totalWithCache) * 100 : 0;
    }
    recordErrors(errors) {
        errors.forEach(error => {
            const errorType = error.code || 'UNKNOWN_ERROR';
            const current = this.metrics.errorDistribution.get(errorType) || 0;
            this.metrics.errorDistribution.set(errorType, current + 1);
        });
    }
    updateValidatorMetrics(result) {
        // This would be updated based on which validators were used
        // For now, we'll create a generic entry
        const validatorName = 'default-validator';
        let validatorMetrics = this.metrics.validatorMetrics.get(validatorName);
        if (!validatorMetrics) {
            validatorMetrics = {
                name: validatorName,
                executions: 0,
                averageTime: 0,
                successRate: 0,
                errorCount: 0,
                cacheHitRate: 0
            };
            this.metrics.validatorMetrics.set(validatorName, validatorMetrics);
        }
        validatorMetrics.executions++;
        validatorMetrics.averageTime =
            (validatorMetrics.averageTime * (validatorMetrics.executions - 1) + result.metrics.duration) /
                validatorMetrics.executions;
        if (!result.isValid) {
            validatorMetrics.errorCount++;
        }
        validatorMetrics.successRate =
            ((validatorMetrics.executions - validatorMetrics.errorCount) / validatorMetrics.executions) * 100;
    }
    recordMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memUsage = process.memoryUsage();
            const currentMB = memUsage.heapUsed / 1024 / 1024;
            this.metrics.memoryUsage.current = currentMB;
            this.metrics.memoryUsage.peak = Math.max(this.metrics.memoryUsage.peak, currentMB);
            this.memorySnapshots.push({ timestamp: new Date(), usage: currentMB });
            // Calculate average
            const sum = this.memorySnapshots.reduce((a, b) => a + b.usage, 0);
            this.metrics.memoryUsage.average = sum / this.memorySnapshots.length;
        }
    }
    updateDerivedMetrics() {
        // Update validations per second
        const oneSecondAgo = new Date(Date.now() - 1000);
        const recentCount = this.recentValidations.filter(v => v.timestamp > oneSecondAgo).length;
        this.metrics.validationsPerSecond = recentCount;
        // Update percentiles if enabled
        if (this.config.percentileTracking && this.validationTimes.length > 0) {
            this.calculatePercentiles();
        }
    }
    calculatePercentiles() {
        const sorted = [...this.validationTimes].sort((a, b) => a - b);
        const len = sorted.length;
        this.metrics.percentiles = {
            p50: this.getPercentile(sorted, 0.5),
            p75: this.getPercentile(sorted, 0.75),
            p90: this.getPercentile(sorted, 0.9),
            p95: this.getPercentile(sorted, 0.95),
            p99: this.getPercentile(sorted, 0.99)
        };
    }
    getPercentile(sortedArray, percentile) {
        const index = Math.ceil(sortedArray.length * percentile) - 1;
        return sortedArray[Math.max(0, index)] || 0;
    }
    addTimeSeriesPoint() {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const recentValidations = this.recentValidations.filter(v => v.timestamp > oneMinuteAgo);
        const errorCount = recentValidations.filter(v => !v.success).length;
        const errorRate = recentValidations.length > 0 ? (errorCount / recentValidations.length) * 100 : 0;
        const point = {
            timestamp: now,
            validationsPerSecond: this.metrics.validationsPerSecond,
            averageResponseTime: this.metrics.averageValidationTime,
            errorRate,
            memoryUsage: this.metrics.memoryUsage.current
        };
        this.metrics.timeSeries.push(point);
        // Keep only the last N points
        if (this.metrics.timeSeries.length > this.config.maxTimeSeriesPoints) {
            this.metrics.timeSeries = this.metrics.timeSeries.slice(-this.config.maxTimeSeriesPoints);
        }
    }
    cleanupOldData() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        // Keep only recent validations (last 5 minutes)
        this.recentValidations = this.recentValidations.filter(v => v.timestamp > fiveMinutesAgo);
        // Keep only recent memory snapshots
        this.memorySnapshots = this.memorySnapshots.filter(s => s.timestamp > fiveMinutesAgo);
        // Keep only recent validation times (last 1000 entries)
        if (this.validationTimes.length > 1000) {
            this.validationTimes = this.validationTimes.slice(-1000);
        }
    }
    calculateSuccessRate() {
        return this.metrics.totalValidations > 0 ?
            (this.metrics.successfulValidations / this.metrics.totalValidations) * 100 : 0;
    }
    getTopErrors(count) {
        const totalErrors = Array.from(this.metrics.errorDistribution.values()).reduce((a, b) => a + b, 0);
        return Array.from(this.metrics.errorDistribution.entries())
            .map(([type, count]) => ({
            type,
            count,
            percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, count);
    }
    calculateMetricsForValidations(validations) {
        // Implementation for calculating metrics for a specific set of validations
        // This is a simplified version - full implementation would calculate all metrics
        const total = validations.length;
        const successful = validations.filter(v => v.success).length;
        const failed = total - successful;
        const durations = validations.map(v => v.duration);
        const avgTime = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
        return {
            ...this.initializeMetrics(),
            totalValidations: total,
            successfulValidations: successful,
            failedValidations: failed,
            averageValidationTime: avgTime,
            peakValidationTime: Math.max(...durations, 0),
            minValidationTime: Math.min(...durations, Infinity)
        };
    }
}
/**
 * Global metrics dashboard instance
 */
export const globalValidationDashboard = new ValidationMetricsDashboard();
/**
 * Create a new metrics dashboard with custom configuration
 */
export function createValidationDashboard(config) {
    return new ValidationMetricsDashboard(config);
}
/**
 * Utility function to format metrics for console display
 */
export function formatMetricsForConsole(metrics) {
    const lines = [
        '=== Validation Metrics Dashboard ===',
        `Total Validations: ${metrics.totalValidations}`,
        `Success Rate: ${((metrics.successfulValidations / metrics.totalValidations) * 100).toFixed(2)}%`,
        `Average Time: ${metrics.averageValidationTime.toFixed(2)}ms`,
        `Peak Time: ${metrics.peakValidationTime.toFixed(2)}ms`,
        `Validations/sec: ${metrics.validationsPerSecond}`,
        `Cache Hit Rate: ${metrics.cacheHitRate.toFixed(2)}%`,
        `Memory Usage: ${metrics.memoryUsage.current.toFixed(2)}MB`,
        '================================='
    ];
    return lines.join('\n');
}
//# sourceMappingURL=ValidationMetricsDashboard.js.map