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
import { performance } from 'perf_hooks';
import { 
  Metric, 
  MetricType, 
  PerformanceMetrics, 
  MetricCollector,
  Timestamp,
  createTimestamp,
  CorrelationId,
  PERFORMANCE_THRESHOLDS
} from './types';

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
 * Histogram bucket for distribution metrics
 */
interface HistogramBucket {
  le: number; // Less than or equal to
  count: number;
}

/**
 * Histogram data structure
 */
interface HistogramData {
  buckets: HistogramBucket[];
  sum: number;
  count: number;
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
export class MetricsRegistry extends EventEmitter implements MetricCollector {
  private metrics = new Map<string, MetricValue[]>();
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, HistogramData>();
  private timers = new Map<string, Timer>();
  private readonly maxRetentionSize = 10000;
  private readonly defaultBuckets = [0.1, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1000];

  constructor() {
    super();
    this.setupPeriodicCleanup();
  }

  /**
   * Record a counter metric (monotonically increasing)
   */
  public counter(name: string, value = 1, tags: Record<string, string> = {}): void {
    const currentValue = this.counters.get(name) || 0;
    const newValue = currentValue + value;
    this.counters.set(name, newValue);

    const metric: Metric = {
      name,
      type: 'counter',
      value: newValue,
      tags,
      timestamp: createTimestamp(),
    };

    this.recordMetric(metric);
  }

  /**
   * Record a gauge metric (arbitrary value that can go up or down)
   */
  public gauge(name: string, value: number, tags: Record<string, string> = {}): void {
    this.gauges.set(name, value);

    const metric: Metric = {
      name,
      type: 'gauge',
      value,
      tags,
      timestamp: createTimestamp(),
    };

    this.recordMetric(metric);
  }

  /**
   * Record a histogram metric (distribution of values)
   */
  public histogram(
    name: string, 
    value: number, 
    tags: Record<string, string> = {},
    buckets = this.defaultBuckets
  ): void {
    let histogramData = this.histograms.get(name);
    
    if (!histogramData) {
      histogramData = {
        buckets: buckets.map(le => ({ le, count: 0 })),
        sum: 0,
        count: 0,
      };
      this.histograms.set(name, histogramData);
    }

    // Update histogram
    histogramData.sum += value;
    histogramData.count += 1;

    // Update buckets
    for (const bucket of histogramData.buckets) {
      if (value <= bucket.le) {
        bucket.count += 1;
      }
    }

    const metric: Metric = {
      name,
      type: 'histogram',
      value,
      tags: { ...tags, bucket: 'sample' },
      timestamp: createTimestamp(),
    };

    this.recordMetric(metric);
  }

  /**
   * Start a timer for measuring duration
   */
  public startTimer(name: string, tags: Record<string, string> = {}): Timer {
    const startTime = performance.now();
    
    const timer: Timer = {
      name,
      startTime,
      stop: () => {
        const duration = performance.now() - startTime;
        this.histogram(`${name}_duration_ms`, duration, tags);
        this.timers.delete(name);
        return duration;
      },
      elapsed: () => performance.now() - startTime,
    };

    this.timers.set(name, timer);
    return timer;
  }

  /**
   * Time a synchronous function execution
   */
  public time<T>(name: string, fn: () => T, tags: Record<string, string> = {}): T {
    const timer = this.startTimer(name, tags);
    try {
      const result = fn();
      return result;
    } finally {
      timer.stop();
    }
  }

  /**
   * Time an asynchronous function execution
   */
  public async timeAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    tags: Record<string, string> = {}
  ): Promise<T> {
    const timer = this.startTimer(name, tags);
    try {
      const result = await fn();
      return result;
    } finally {
      timer.stop();
    }
  }

  /**
   * Record custom performance metrics
   */
  public recordPerformanceMetrics(metrics: PerformanceMetrics, tags: Record<string, string> = {}): void {
    if (metrics.duration !== undefined) {
      this.histogram('operation_duration_ms', metrics.duration, tags);
    }
    
    if (metrics.memoryUsage !== undefined) {
      this.gauge('memory_usage_bytes', metrics.memoryUsage, tags);
    }
    
    if (metrics.cpuUsage !== undefined) {
      this.gauge('cpu_usage_percent', metrics.cpuUsage, tags);
    }
    
    if (metrics.operationCount !== undefined) {
      this.counter('operations_total', metrics.operationCount, tags);
    }
    
    if (metrics.cacheHitRatio !== undefined) {
      this.gauge('cache_hit_ratio', metrics.cacheHitRatio, tags);
    }

    // Record custom metrics
    if (metrics.custom) {
      for (const [key, value] of Object.entries(metrics.custom)) {
        this.gauge(`custom_${key}`, value, tags);
      }
    }
  }

  /**
   * Get current metric value
   */
  public getMetric(name: string): Metric | undefined {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return undefined;
    }

    const latest = values[values.length - 1];
    return {
      name,
      type: this.inferMetricType(name),
      value: latest.value,
      tags: latest.tags,
      timestamp: latest.timestamp,
    };
  }

  /**
   * Get all metrics values for a metric name
   */
  public getMetricHistory(name: string, limit?: number): MetricValue[] {
    const values = this.metrics.get(name) || [];
    return limit ? values.slice(-limit) : [...values];
  }

  /**
   * Get metric statistics
   */
  public getMetricStats(name: string): MetricStats | undefined {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return undefined;
    }

    const numericValues = values.map(v => v.value);
    const sorted = [...numericValues].sort((a, b) => a - b);
    
    return {
      count: values.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
      median: this.calculateMedian(sorted),
      p95: this.calculatePercentile(sorted, 0.95),
      p99: this.calculatePercentile(sorted, 0.99),
      stdDev: this.calculateStandardDeviation(numericValues),
    };
  }

  /**
   * Collect all current metrics
   */
  public async collect(): Promise<Metric[]> {
    const metrics: Metric[] = [];

    // Collect counters
    this.counters.forEach((value, name) => {
      metrics.push({
        name,
        type: 'counter',
        value,
        timestamp: createTimestamp(),
        tags: {},
      });
    });

    // Collect gauges
    this.gauges.forEach((value, name) => {
      metrics.push({
        name,
        type: 'gauge',
        value,
        timestamp: createTimestamp(),
        tags: {},
      });
    });

    // Collect histograms
    this.histograms.forEach((histogram, name) => {
      // Add histogram buckets
      for (const bucket of histogram.buckets) {
        metrics.push({
          name: `${name}_bucket`,
          type: 'histogram',
          value: bucket.count,
          timestamp: createTimestamp(),
          tags: { le: bucket.le.toString() },
        });
      }

      // Add histogram sum and count
      metrics.push({
        name: `${name}_sum`,
        type: 'histogram',
        value: histogram.sum,
        timestamp: createTimestamp(),
        tags: {},
      });

      metrics.push({
        name: `${name}_count`,
        type: 'histogram',
        value: histogram.count,
        timestamp: createTimestamp(),
        tags: {},
      });
    });

    return metrics;
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.metrics.clear();
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timers.clear();
    this.emit('metrics:reset');
  }

  /**
   * Reset specific metric
   */
  public resetMetric(name: string): void {
    this.metrics.delete(name);
    this.counters.delete(name);
    this.gauges.delete(name);
    this.histograms.delete(name);
    this.timers.delete(name);
    this.emit('metrics:reset', name);
  }

  /**
   * Get system performance metrics
   */
  public getSystemMetrics(): PerformanceMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memoryUsage: memoryUsage.heapUsed,
      cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to milliseconds
      operationCount: this.metrics.size,
      custom: {
        heap_total: memoryUsage.heapTotal,
        heap_used: memoryUsage.heapUsed,
        external: memoryUsage.external,
        rss: memoryUsage.rss,
        gc_duration: 0, // Would need to hook into GC events
      },
    };
  }

  /**
   * Check performance thresholds and emit alerts
   */
  public checkThresholds(): void {
    const systemMetrics = this.getSystemMetrics();
    
    if (systemMetrics.memoryUsage && systemMetrics.memoryUsage > PERFORMANCE_THRESHOLDS.HIGH_MEMORY_USAGE) {
      this.emit('threshold:exceeded', {
        metric: 'memory_usage',
        value: systemMetrics.memoryUsage,
        threshold: PERFORMANCE_THRESHOLDS.HIGH_MEMORY_USAGE,
      });
    }

    if (systemMetrics.cpuUsage && systemMetrics.cpuUsage > PERFORMANCE_THRESHOLDS.HIGH_CPU_USAGE) {
      this.emit('threshold:exceeded', {
        metric: 'cpu_usage',
        value: systemMetrics.cpuUsage,
        threshold: PERFORMANCE_THRESHOLDS.HIGH_CPU_USAGE,
      });
    }
  }

  /**
   * Record a metric value internally
   */
  private recordMetric(metric: Metric): void {
    let values = this.metrics.get(metric.name);
    if (!values) {
      values = [];
      this.metrics.set(metric.name, values);
    }

    values.push({
      value: metric.value,
      timestamp: metric.timestamp,
      tags: metric.tags || {},
    });

    // Limit retention size
    if (values.length > this.maxRetentionSize) {
      values.splice(0, values.length - this.maxRetentionSize);
    }

    this.emit('metric:recorded', metric);
  }

  /**
   * Infer metric type from name patterns
   */
  private inferMetricType(name: string): MetricType {
    if (name.includes('_total') || name.includes('_count')) {
      return 'counter';
    }
    if (name.includes('_duration') || name.includes('_bucket')) {
      return 'histogram';
    }
    if (name.includes('_timer')) {
      return 'timer';
    }
    return 'gauge';
  }

  /**
   * Calculate median value
   */
  private calculateMedian(sorted: number[]): number {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calculate percentile value
   */
  private calculatePercentile(sorted: number[], percentile: number): number {
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Setup periodic cleanup of old metrics
   */
  private setupPeriodicCleanup(): void {
    const cleanupInterval = 5 * 60 * 1000; // 5 minutes
    
    setInterval(() => {
      const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour ago
      
      this.metrics.forEach((values, name) => {
        const filtered = values.filter(v => v.timestamp > cutoff);
        if (filtered.length !== values.length) {
          this.metrics.set(name, filtered);
        }
      });
    }, cleanupInterval);
  }
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
export class PerformanceProfiler {
  private readonly metrics: MetricsRegistry;
  private readonly enabled: boolean;

  constructor(metrics: MetricsRegistry, enabled = true) {
    this.metrics = metrics;
    this.enabled = enabled;
  }

  /**
   * Profile a function execution
   */
  public profile<T>(
    name: string,
    fn: () => T,
    tags: Record<string, string> = {}
  ): T {
    if (!this.enabled) {
      return fn();
    }

    return this.metrics.time(name, fn, tags);
  }

  /**
   * Profile an async function execution
   */
  public async profileAsync<T>(
    name: string,
    fn: () => Promise<T>,
    tags: Record<string, string> = {}
  ): Promise<T> {
    if (!this.enabled) {
      return await fn();
    }

    return await this.metrics.timeAsync(name, fn, tags);
  }

  /**
   * Create a profiling decorator
   */
  public createProfileDecorator(name?: string, tags: Record<string, string> = {}) {
    const metrics = this.metrics;
    
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const metricName = name || `${target.constructor.name}.${propertyKey}`;
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        if (originalMethod.constructor.name === 'AsyncFunction') {
          return metrics.timeAsync(metricName, async () => {
            return await originalMethod.apply(this, args);
          }, tags);
        } else {
          return metrics.time(metricName, () => {
            return originalMethod.apply(this, args);
          }, tags);
        }
      };

      return descriptor;
    };
  }
}

/**
 * Global metrics registry instance
 */
export const globalMetrics = new MetricsRegistry();

/**
 * Global performance profiler
 */
export const globalProfiler = new PerformanceProfiler(globalMetrics);

/**
 * Convenience functions for metrics
 */
export const counter = (name: string, value?: number, tags?: Record<string, string>) => 
  globalMetrics.counter(name, value, tags);

export const gauge = (name: string, value: number, tags?: Record<string, string>) => 
  globalMetrics.gauge(name, value, tags);

export const histogram = (name: string, value: number, tags?: Record<string, string>) => 
  globalMetrics.histogram(name, value, tags);

export const startTimer = (name: string, tags?: Record<string, string>) => 
  globalMetrics.startTimer(name, tags);

export const time = <T>(name: string, fn: () => T, tags?: Record<string, string>) => 
  globalMetrics.time(name, fn, tags);

export const timeAsync = <T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>) => 
  globalMetrics.timeAsync(name, fn, tags);

/**
 * Profile decorator for automatic method timing
 */
export const Profile = (name?: string, tags: Record<string, string> = {}) => 
  globalProfiler.createProfileDecorator(name, tags);
