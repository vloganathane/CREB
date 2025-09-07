/**
 * Cache Metrics Collection and Analysis for CREB-JS
 *
 * Provides comprehensive metrics collection, analysis, and reporting for cache performance.
 * Includes real-time monitoring, historical analysis, and performance recommendations.
 */
/**
 * Real-time cache metrics collector
 */
export class CacheMetricsCollector {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.eventCounts = new Map();
        this.accessTimes = [];
        this.maxAccessTimeSamples = 1000;
        this.resetStats();
    }
    /**
     * Reset all statistics
     */
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            hitRate: 0,
            size: 0,
            memoryUsage: 0,
            memoryUtilization: 0,
            evictions: 0,
            expirations: 0,
            averageAccessTime: 0,
            evictionBreakdown: {
                'lru': 0,
                'lfu': 0,
                'fifo': 0,
                'ttl': 0,
                'random': 0
            },
            lastUpdated: Date.now()
        };
        this.eventCounts.clear();
        this.accessTimes = [];
    }
    /**
     * Record a cache event
     */
    recordEvent(event) {
        const currentCount = this.eventCounts.get(event.type) || 0;
        this.eventCounts.set(event.type, currentCount + 1);
        switch (event.type) {
            case 'hit':
                this.stats.hits++;
                break;
            case 'miss':
                this.stats.misses++;
                break;
            case 'eviction':
                this.stats.evictions++;
                if (event.metadata?.strategy) {
                    this.stats.evictionBreakdown[event.metadata.strategy]++;
                }
                break;
            case 'expiration':
                this.stats.expirations++;
                break;
        }
        // Record access time if available
        if (event.metadata?.latency !== undefined) {
            this.accessTimes.push(event.metadata.latency);
            if (this.accessTimes.length > this.maxAccessTimeSamples) {
                this.accessTimes.shift(); // Remove oldest sample
            }
        }
        this.updateComputedStats();
    }
    /**
     * Update cache size and memory usage
     */
    updateCacheInfo(size, memoryUsage, maxMemory) {
        this.stats.size = size;
        this.stats.memoryUsage = memoryUsage;
        this.stats.memoryUtilization = maxMemory > 0 ? (memoryUsage / maxMemory) * 100 : 0;
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Get current statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get comprehensive metrics with historical data and trends
     */
    getMetrics() {
        const current = this.getStats();
        // Calculate trends
        const trends = this.calculateTrends();
        // Calculate peaks
        const peaks = this.calculatePeaks();
        return {
            current,
            history: [...this.history],
            trends,
            peaks
        };
    }
    /**
     * Take a snapshot of current stats for historical tracking
     */
    takeSnapshot() {
        const snapshot = this.getStats();
        this.history.push(snapshot);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift(); // Remove oldest snapshot
        }
    }
    /**
     * Get event counts
     */
    getEventCounts() {
        return new Map(this.eventCounts);
    }
    /**
     * Get access time percentiles
     */
    getAccessTimePercentiles() {
        if (this.accessTimes.length === 0) {
            return { p50: 0, p90: 0, p95: 0, p99: 0 };
        }
        const sorted = [...this.accessTimes].sort((a, b) => a - b);
        const n = sorted.length;
        return {
            p50: this.getPercentile(sorted, 50),
            p90: this.getPercentile(sorted, 90),
            p95: this.getPercentile(sorted, 95),
            p99: this.getPercentile(sorted, 99)
        };
    }
    /**
     * Update computed statistics
     */
    updateComputedStats() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
        if (this.accessTimes.length > 0) {
            this.stats.averageAccessTime = this.accessTimes.reduce((sum, time) => sum + time, 0) / this.accessTimes.length;
        }
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Calculate performance trends
     */
    calculateTrends() {
        if (this.history.length < 3) {
            return {
                hitRateTrend: 'stable',
                memoryTrend: 'stable',
                latencyTrend: 'stable'
            };
        }
        const recent = this.history.slice(-3);
        // Hit rate trend
        const hitRateChange = recent[2].hitRate - recent[0].hitRate;
        const hitRateTrend = Math.abs(hitRateChange) < 1 ? 'stable' :
            hitRateChange > 0 ? 'improving' : 'declining';
        // Memory trend
        const memoryChange = recent[2].memoryUtilization - recent[0].memoryUtilization;
        const memoryTrend = Math.abs(memoryChange) < 5 ? 'stable' :
            memoryChange > 0 ? 'increasing' : 'decreasing';
        // Latency trend
        const latencyChange = recent[2].averageAccessTime - recent[0].averageAccessTime;
        const latencyTrend = Math.abs(latencyChange) < 0.1 ? 'stable' :
            latencyChange < 0 ? 'improving' : 'degrading';
        return {
            hitRateTrend,
            memoryTrend,
            latencyTrend
        };
    }
    /**
     * Calculate peak performance metrics
     */
    calculatePeaks() {
        if (this.history.length === 0) {
            return {
                maxHitRate: this.stats.hitRate,
                maxMemoryUsage: this.stats.memoryUsage,
                minLatency: this.stats.averageAccessTime
            };
        }
        const allStats = [...this.history, this.stats];
        return {
            maxHitRate: Math.max(...allStats.map(s => s.hitRate)),
            maxMemoryUsage: Math.max(...allStats.map(s => s.memoryUsage)),
            minLatency: Math.min(...allStats.map(s => s.averageAccessTime))
        };
    }
    /**
     * Get percentile value from sorted array
     */
    getPercentile(sorted, percentile) {
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
}
/**
 * Cache performance analyzer
 */
export class CachePerformanceAnalyzer {
    /**
     * Analyze cache performance and provide recommendations
     */
    static analyze(metrics) {
        const { current, trends, history } = metrics;
        const issues = [];
        const recommendations = [];
        const insights = [];
        let score = 100;
        // Analyze hit rate
        if (current.hitRate < 50) {
            score -= 30;
            issues.push('Low cache hit rate');
            recommendations.push('Consider increasing cache size or optimizing access patterns');
        }
        else if (current.hitRate < 70) {
            score -= 15;
            issues.push('Moderate cache hit rate');
            recommendations.push('Review cache eviction strategy');
        }
        // Analyze memory utilization
        if (current.memoryUtilization > 90) {
            score -= 20;
            issues.push('High memory utilization');
            recommendations.push('Increase memory limit or improve eviction policy');
        }
        else if (current.memoryUtilization < 30) {
            insights.push('Low memory utilization - cache size could be reduced');
        }
        // Analyze access time
        if (current.averageAccessTime > 5) {
            score -= 15;
            issues.push('High average access time');
            recommendations.push('Check for lock contention or optimize data structures');
        }
        // Analyze trends
        if (trends.hitRateTrend === 'declining') {
            score -= 10;
            issues.push('Declining hit rate trend');
            recommendations.push('Monitor access patterns and consider adaptive caching');
        }
        if (trends.latencyTrend === 'degrading') {
            score -= 10;
            issues.push('Increasing access latency');
            recommendations.push('Profile cache operations for performance bottlenecks');
        }
        // Analyze eviction distribution
        const totalEvictions = Object.values(current.evictionBreakdown).reduce((sum, count) => sum + count, 0);
        if (totalEvictions > 0) {
            const dominantStrategy = Object.entries(current.evictionBreakdown)
                .reduce((max, [strategy, count]) => count > max.count ? { strategy, count } : max, { strategy: '', count: 0 });
            if (dominantStrategy.count / totalEvictions > 0.8) {
                insights.push(`Cache primarily using ${dominantStrategy.strategy} eviction`);
            }
            else {
                insights.push('Cache using mixed eviction strategies - consider adaptive policy');
            }
        }
        // Historical comparison
        if (history.length > 0) {
            const baseline = history[0];
            const hitRateImprovement = current.hitRate - baseline.hitRate;
            if (hitRateImprovement > 10) {
                insights.push('Significant hit rate improvement observed');
            }
            else if (hitRateImprovement < -10) {
                issues.push('Hit rate has declined significantly');
                recommendations.push('Review recent changes to access patterns or cache configuration');
            }
        }
        return {
            score: Math.max(0, score),
            issues,
            recommendations,
            insights
        };
    }
    /**
     * Generate performance report
     */
    static generateReport(metrics) {
        const analysis = this.analyze(metrics);
        const { current } = metrics;
        let report = '# Cache Performance Report\n\n';
        report += `## Overall Score: ${analysis.score}/100\n\n`;
        report += '## Current Statistics\n';
        report += `- Hit Rate: ${current.hitRate.toFixed(2)}%\n`;
        report += `- Cache Size: ${current.size} entries\n`;
        report += `- Memory Usage: ${(current.memoryUsage / 1024 / 1024).toFixed(2)} MB (${current.memoryUtilization.toFixed(1)}%)\n`;
        report += `- Average Access Time: ${current.averageAccessTime.toFixed(2)}ms\n`;
        report += `- Evictions: ${current.evictions}\n`;
        report += `- Expirations: ${current.expirations}\n\n`;
        report += '## Trends\n';
        report += `- Hit Rate: ${metrics.trends.hitRateTrend}\n`;
        report += `- Memory Usage: ${metrics.trends.memoryTrend}\n`;
        report += `- Latency: ${metrics.trends.latencyTrend}\n\n`;
        if (analysis.issues.length > 0) {
            report += '## Issues\n';
            analysis.issues.forEach(issue => {
                report += `- ${issue}\n`;
            });
            report += '\n';
        }
        if (analysis.recommendations.length > 0) {
            report += '## Recommendations\n';
            analysis.recommendations.forEach(rec => {
                report += `- ${rec}\n`;
            });
            report += '\n';
        }
        if (analysis.insights.length > 0) {
            report += '## Insights\n';
            analysis.insights.forEach(insight => {
                report += `- ${insight}\n`;
            });
            report += '\n';
        }
        return report;
    }
}
//# sourceMappingURL=CacheMetrics.js.map