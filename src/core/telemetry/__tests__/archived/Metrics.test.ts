/**
 * @fileoverview Metrics System Tests
 * @module @creb/core/telemetry/__tests__/Metrics.test
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  MetricsRegistry, 
  PerformanceProfiler,
  globalMetrics,
  globalProfiler,
  counter,
  gauge,
  histogram,
  startTimer,
  time,
  timeAsync,
  Profile
} from '../Metrics';
import { Metric, MetricType, PerformanceMetrics } from '../types';

describe('Metrics System', () => {
  let metrics: MetricsRegistry;

  beforeEach(() => {
    metrics = new MetricsRegistry();
  });

  afterEach(() => {
    metrics.reset();
  });

  describe('MetricsRegistry', () => {
    describe('Counter metrics', () => {
      test('should record and increment counter metrics', () => {
        metrics.counter('test_counter', 5);
        metrics.counter('test_counter', 3);
        
        const metric = metrics.getMetric('test_counter');
        expect(metric).toBeDefined();
        expect(metric!.type).toBe('counter');
        expect(metric!.value).toBe(8);
      });

      test('should default to increment by 1', () => {
        metrics.counter('default_counter');
        metrics.counter('default_counter');
        
        const metric = metrics.getMetric('default_counter');
        expect(metric!.value).toBe(2);
      });

      test('should include tags with counter metrics', () => {
        const tags = { service: 'test', version: '1.0' };
        metrics.counter('tagged_counter', 1, tags);
        
        const metric = metrics.getMetric('tagged_counter');
        expect(metric!.tags).toEqual(tags);
      });
    });

    describe('Gauge metrics', () => {
      test('should record gauge metrics', () => {
        metrics.gauge('test_gauge', 42.5);
        
        const metric = metrics.getMetric('test_gauge');
        expect(metric).toBeDefined();
        expect(metric!.type).toBe('gauge');
        expect(metric!.value).toBe(42.5);
      });

      test('should update gauge values', () => {
        metrics.gauge('update_gauge', 10);
        metrics.gauge('update_gauge', 20);
        
        const metric = metrics.getMetric('update_gauge');
        expect(metric!.value).toBe(20);
      });

      test('should handle negative gauge values', () => {
        metrics.gauge('negative_gauge', -15.5);
        
        const metric = metrics.getMetric('negative_gauge');
        expect(metric!.value).toBe(-15.5);
      });
    });

    describe('Histogram metrics', () => {
      test('should record histogram metrics', () => {
        metrics.histogram('test_histogram', 1.5);
        metrics.histogram('test_histogram', 2.5);
        metrics.histogram('test_histogram', 0.5);
        
        const metric = metrics.getMetric('test_histogram');
        expect(metric).toBeDefined();
        expect(metric!.type).toBe('histogram');
      });

      test('should track histogram buckets', async () => {
        const buckets = [1, 2, 5, 10];
        metrics.histogram('bucket_histogram', 0.5, {}, buckets);
        metrics.histogram('bucket_histogram', 1.5, {}, buckets);
        metrics.histogram('bucket_histogram', 7, {}, buckets);
        
        const allMetrics = await metrics.collect();
        const bucketMetrics = allMetrics.filter(m => m.name === 'bucket_histogram_bucket');
        expect(bucketMetrics.length).toBeGreaterThan(0);
      });

      test('should calculate histogram statistics', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        values.forEach(value => {
          metrics.histogram('stats_histogram', value);
        });
        
        const stats = metrics.getMetricStats('stats_histogram');
        expect(stats).toBeDefined();
        expect(stats!.count).toBe(10);
        expect(stats!.min).toBe(1);
        expect(stats!.max).toBe(10);
        expect(stats!.mean).toBe(5.5);
        expect(stats!.median).toBe(5.5);
      });
    });

    describe('Timer functionality', () => {
      test('should create and stop timers', () => {
        const timer = metrics.startTimer('test_timer');
        
        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 10) {
          // Wait for at least 10ms
        }
        
        const duration = timer.stop();
        expect(duration).toBeGreaterThan(0);
      });

      test('should get elapsed time without stopping', () => {
        const timer = metrics.startTimer('elapsed_timer');
        
        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 5) {
          // Wait for at least 5ms
        }
        
        const elapsed = timer.elapsed();
        expect(elapsed).toBeGreaterThan(0);
        
        timer.stop();
      });

      test('should time synchronous functions', () => {
        let executed = false;
        const result = metrics.time('sync_timer', () => {
          executed = true;
          return 'sync_result';
        });
        
        expect(result).toBe('sync_result');
        expect(executed).toBe(true);
      });

      test('should time asynchronous functions', async () => {
        let executed = false;
        const result = await metrics.timeAsync('async_timer', async () => {
          executed = true;
          await new Promise(resolve => setTimeout(resolve, 10));
          return 'async_result';
        });
        
        expect(result).toBe('async_result');
        expect(executed).toBe(true);
      });
    });

    describe('Performance metrics', () => {
      test('should record performance metrics', () => {
        const perfMetrics: PerformanceMetrics = {
          duration: 100,
          memoryUsage: 1024000,
          cpuUsage: 75,
          operationCount: 5,
          cacheHitRatio: 0.85,
          custom: {
            custom_metric: 42,
          },
        };
        
        metrics.recordPerformanceMetrics(perfMetrics, { service: 'test' });
        
        // Check that metrics were recorded
        expect(metrics.getMetric('operation_duration_ms')).toBeDefined();
        expect(metrics.getMetric('memory_usage_bytes')).toBeDefined();
        expect(metrics.getMetric('cpu_usage_percent')).toBeDefined();
        expect(metrics.getMetric('operations_total')).toBeDefined();
        expect(metrics.getMetric('cache_hit_ratio')).toBeDefined();
        expect(metrics.getMetric('custom_custom_metric')).toBeDefined();
      });

      test('should get system metrics', () => {
        const systemMetrics = metrics.getSystemMetrics();
        
        expect(systemMetrics).toBeDefined();
        expect(systemMetrics.memoryUsage).toBeGreaterThan(0);
        expect(systemMetrics.cpuUsage).toBeGreaterThanOrEqual(0);
        expect(systemMetrics.operationCount).toBeGreaterThanOrEqual(0);
        expect(systemMetrics.custom).toBeDefined();
      });

      test('should check performance thresholds', (done) => {
        metrics.on('threshold:exceeded', (event) => {
          expect(event.metric).toBeDefined();
          expect(event.value).toBeDefined();
          expect(event.threshold).toBeDefined();
          done();
        });
        
        // Simulate high memory usage
        metrics.gauge('memory_usage_bytes', 200 * 1024 * 1024); // 200MB
        metrics.checkThresholds();
      });
    });

    describe('Metric collection and management', () => {
      test('should collect all metrics', async () => {
        metrics.counter('test_counter', 5);
        metrics.gauge('test_gauge', 10);
        metrics.histogram('test_histogram', 2.5);
        
        const allMetrics = await metrics.collect();
        expect(allMetrics.length).toBeGreaterThan(0);
        
        const counterMetrics = allMetrics.filter(m => m.name === 'test_counter');
        const gaugeMetrics = allMetrics.filter(m => m.name === 'test_gauge');
        
        expect(counterMetrics.length).toBe(1);
        expect(gaugeMetrics.length).toBe(1);
      });

      test('should get metric history', () => {
        metrics.gauge('history_test', 1);
        metrics.gauge('history_test', 2);
        metrics.gauge('history_test', 3);
        
        const history = metrics.getMetricHistory('history_test');
        expect(history.length).toBe(3);
        expect(history[0].value).toBe(1);
        expect(history[2].value).toBe(3);
      });

      test('should limit metric history', () => {
        metrics.gauge('limited_history', 1);
        metrics.gauge('limited_history', 2);
        metrics.gauge('limited_history', 3);
        
        const limitedHistory = metrics.getMetricHistory('limited_history', 2);
        expect(limitedHistory.length).toBe(2);
        expect(limitedHistory[0].value).toBe(2);
        expect(limitedHistory[1].value).toBe(3);
      });

      test('should reset all metrics', () => {
        metrics.counter('reset_counter', 5);
        metrics.gauge('reset_gauge', 10);
        
        expect(metrics.getMetric('reset_counter')).toBeDefined();
        expect(metrics.getMetric('reset_gauge')).toBeDefined();
        
        metrics.reset();
        
        expect(metrics.getMetric('reset_counter')).toBeUndefined();
        expect(metrics.getMetric('reset_gauge')).toBeUndefined();
      });

      test('should reset specific metrics', () => {
        metrics.counter('specific_counter', 5);
        metrics.gauge('specific_gauge', 10);
        
        expect(metrics.getMetric('specific_counter')).toBeDefined();
        expect(metrics.getMetric('specific_gauge')).toBeDefined();
        
        metrics.resetMetric('specific_counter');
        
        expect(metrics.getMetric('specific_counter')).toBeUndefined();
        expect(metrics.getMetric('specific_gauge')).toBeDefined();
      });
    });

    describe('Event emission', () => {
      test('should emit metric recorded events', (done) => {
        metrics.on('metric:recorded', (metric: Metric) => {
          expect(metric.name).toBe('event_test');
          expect(metric.value).toBe(42);
          done();
        });
        
        metrics.gauge('event_test', 42);
      });

      test('should emit reset events', (done) => {
        metrics.on('metrics:reset', () => {
          done();
        });
        
        metrics.reset();
      });
    });
  });

  describe('PerformanceProfiler', () => {
    let profiler: PerformanceProfiler;

    beforeEach(() => {
      profiler = new PerformanceProfiler(metrics);
    });

    test('should profile synchronous functions', () => {
      let executed = false;
      const result = profiler.profile('sync_profile', () => {
        executed = true;
        return 'profiled_result';
      });
      
      expect(result).toBe('profiled_result');
      expect(executed).toBe(true);
    });

    test('should profile asynchronous functions', async () => {
      let executed = false;
      const result = await profiler.profileAsync('async_profile', async () => {
        executed = true;
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async_profiled_result';
      });
      
      expect(result).toBe('async_profiled_result');
      expect(executed).toBe(true);
    });

    test('should not profile when disabled', () => {
      const disabledProfiler = new PerformanceProfiler(metrics, false);
      
      let executed = false;
      const result = disabledProfiler.profile('disabled_profile', () => {
        executed = true;
        return 'result';
      });
      
      expect(result).toBe('result');
      expect(executed).toBe(true);
      
      // Should not have recorded any metrics
      expect(metrics.getMetric('disabled_profile')).toBeUndefined();
    });

    test('should create profile decorator', () => {
      const decorator = profiler.createProfileDecorator('test_decorator');
      expect(typeof decorator).toBe('function');
    });
  });

  describe('Global metrics functions', () => {
    afterEach(() => {
      globalMetrics.reset();
    });

    test('should work with global counter', () => {
      counter('global_counter', 5);
      
      const metric = globalMetrics.getMetric('global_counter');
      expect(metric).toBeDefined();
      expect(metric!.value).toBe(5);
    });

    test('should work with global gauge', () => {
      gauge('global_gauge', 42);
      
      const metric = globalMetrics.getMetric('global_gauge');
      expect(metric).toBeDefined();
      expect(metric!.value).toBe(42);
    });

    test('should work with global histogram', () => {
      histogram('global_histogram', 2.5);
      
      const metric = globalMetrics.getMetric('global_histogram');
      expect(metric).toBeDefined();
    });

    test('should work with global timer', () => {
      const timer = startTimer('global_timer');
      const duration = timer.stop();
      
      expect(duration).toBeGreaterThan(0);
    });

    test('should work with global time function', () => {
      const result = time('global_time', () => 'timed_result');
      expect(result).toBe('timed_result');
    });

    test('should work with global timeAsync function', async () => {
      const result = await timeAsync('global_time_async', async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
        return 'async_timed_result';
      });
      expect(result).toBe('async_timed_result');
    });
  });

  describe('Statistical calculations', () => {
    test('should calculate percentiles correctly', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      values.forEach(value => {
        metrics.histogram('percentile_test', value);
      });
      
      const stats = metrics.getMetricStats('percentile_test');
      expect(stats).toBeDefined();
      expect(stats!.p95).toBeGreaterThan(stats!.median);
      expect(stats!.p99).toBeGreaterThan(stats!.p95);
    });

    test('should calculate standard deviation', () => {
      // Values with known standard deviation
      const values = [1, 1, 1, 1, 1]; // std dev = 0
      values.forEach(value => {
        metrics.histogram('stddev_test', value);
      });
      
      const stats = metrics.getMetricStats('stddev_test');
      expect(stats).toBeDefined();
      expect(stats!.stdDev).toBe(0);
    });

    test('should handle empty metrics gracefully', () => {
      const stats = metrics.getMetricStats('nonexistent_metric');
      expect(stats).toBeUndefined();
    });
  });

  describe('Memory and cleanup', () => {
    test('should limit retention size', () => {
      // Add more metrics than the retention limit
      for (let i = 0; i < 15000; i++) {
        metrics.gauge('retention_test', i);
      }
      
      const history = metrics.getMetricHistory('retention_test');
      expect(history.length).toBeLessThanOrEqual(10000); // Default max retention
    });

    test('should perform periodic cleanup', (done) => {
      // This test is more complex to implement as it involves time-based cleanup
      // For now, we'll just verify the functionality exists
      expect(typeof metrics['setupPeriodicCleanup']).toBe('function');
      done();
    });
  });

  describe('Error handling', () => {
    test('should handle invalid metric names gracefully', () => {
      expect(() => {
        metrics.counter('', 1);
      }).not.toThrow();
    });

    test('should handle invalid metric values gracefully', () => {
      expect(() => {
        metrics.gauge('test_gauge', NaN);
      }).not.toThrow();
      
      expect(() => {
        metrics.gauge('test_gauge', Infinity);
      }).not.toThrow();
    });

    test('should handle timer errors gracefully', () => {
      const timer = metrics.startTimer('error_timer');
      expect(() => {
        timer.stop();
        timer.stop(); // Stop twice
      }).not.toThrow();
    });
  });
});
