/**
 * Advanced Cache Tests for CREB-JS
 * 
 * Comprehensive test suite covering all cache functionality including:
 * - Basic operations (get, set, delete, clear)
 * - TTL and expiration
 * - Eviction policies
 * - Metrics and monitoring
 * - Thread safety
 * - Memory management
 */

import { AdvancedCache, CacheFactory } from '../AdvancedCache';
import { EvictionPolicyFactory, LRUEvictionPolicy, LFUEvictionPolicy, FIFOEvictionPolicy, TTLEvictionPolicy } from '../EvictionPolicies';
import { CacheMetricsCollector, CachePerformanceAnalyzer } from '../CacheMetrics';
import { AdvancedCacheConfig, CacheEventType } from '../types';

describe('AdvancedCache', () => {
  let cache: AdvancedCache<string>;

  beforeEach(() => {
    cache = new AdvancedCache<string>({
      maxSize: 10,
      defaultTtl: 1000, // 1 second for testing
      enableMetrics: true,
      autoCleanup: false, // Manual control for testing
      threadSafe: false // Simpler testing
    });
  });

  afterEach(() => {
    cache.shutdown();
  });

  describe('Basic Operations', () => {
    test('should set and get values', async () => {
      const result = await cache.set('key1', 'value1');
      expect(result.success).toBe(true);
      expect(result.hit).toBe(false);

      const getValue = await cache.get('key1');
      expect(getValue.success).toBe(true);
      expect(getValue.hit).toBe(true);
      expect(getValue.value).toBe('value1');
    });

    test('should return miss for non-existent keys', async () => {
      const result = await cache.get('nonexistent');
      expect(result.success).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.value).toBeUndefined();
    });

    test('should check if key exists', async () => {
      await cache.set('key1', 'value1');
      expect(await cache.has('key1')).toBe(true);
      expect(await cache.has('nonexistent')).toBe(false);
    });

    test('should delete entries', async () => {
      await cache.set('key1', 'value1');
      expect(await cache.has('key1')).toBe(true);
      
      const deleted = await cache.delete('key1');
      expect(deleted).toBe(true);
      expect(await cache.has('key1')).toBe(false);
    });

    test('should clear all entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
      
      await cache.clear();
      expect(cache.size()).toBe(0);
    });

    test('should return all keys', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      
      const keys = cache.keys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('TTL and Expiration', () => {
    test('should expire entries after TTL', async () => {
      await cache.set('key1', 'value1', 100); // 100ms TTL
      expect(await cache.has('key1')).toBe(true);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(await cache.has('key1')).toBe(false);
    });

    test('should use default TTL when not specified', async () => {
      await cache.set('key1', 'value1');
      
      // Should still be valid immediately
      expect(await cache.has('key1')).toBe(true);
      
      // Wait longer than default TTL
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(await cache.has('key1')).toBe(false);
    });

    test('should handle zero TTL (no expiration)', async () => {
      const neverExpireCache = new AdvancedCache<string>({ defaultTtl: 0 });
      
      await neverExpireCache.set('key1', 'value1');
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(await neverExpireCache.has('key1')).toBe(true);
      
      neverExpireCache.shutdown();
    });

    test('should cleanup expired entries', async () => {
      await cache.set('key1', 'value1', 50);
      await cache.set('key2', 'value2', 50);
      expect(cache.size()).toBe(2);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const cleanedUp = await cache.cleanup();
      expect(cleanedUp).toBe(2);
      expect(cache.size()).toBe(0);
    });
  });

  describe('Size Limits and Eviction', () => {
    test('should evict entries when size limit is reached', async () => {
      // Fill cache to capacity
      for (let i = 0; i < 10; i++) {
        await cache.set(`key${i}`, `value${i}`);
      }
      expect(cache.size()).toBe(10);
      
      // Adding one more should trigger eviction
      await cache.set('key10', 'value10');
      expect(cache.size()).toBe(10);
      
      // First entry should be evicted (LRU default)
      expect(await cache.has('key0')).toBe(false);
      expect(await cache.has('key10')).toBe(true);
    });

    test('should track memory usage', async () => {
      const initialMemory = cache.memoryUsage();
      expect(initialMemory).toBe(0);
      
      await cache.set('key1', 'small value');
      const afterSet = cache.memoryUsage();
      expect(afterSet).toBeGreaterThan(0);
      
      await cache.delete('key1');
      const afterDelete = cache.memoryUsage();
      expect(afterDelete).toBe(0);
    });
  });

  describe('Metrics and Statistics', () => {
    test('should track hit and miss statistics', async () => {
      await cache.set('key1', 'value1');
      
      // Generate some hits and misses
      await cache.get('key1'); // hit
      await cache.get('key1'); // hit
      await cache.get('nonexistent'); // miss
      await cache.get('nonexistent'); // miss
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(50);
    });

    test('should track cache size and memory', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    test('should provide detailed metrics', async () => {
      await cache.set('key1', 'value1');
      await cache.get('key1');
      
      const metrics = cache.getMetrics();
      expect(metrics.current).toBeDefined();
      expect(metrics.history).toBeDefined();
      expect(metrics.trends).toBeDefined();
      expect(metrics.peaks).toBeDefined();
    });
  });

  describe('Event System', () => {
    test('should emit cache events', async () => {
      const events: Array<{ type: CacheEventType; key?: string }> = [];
      
      cache.addEventListener('set', (event) => {
        events.push({ type: event.type, key: event.key });
      });
      
      cache.addEventListener('hit', (event) => {
        events.push({ type: event.type, key: event.key });
      });
      
      await cache.set('key1', 'value1');
      await cache.get('key1');
      
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual({ type: 'set', key: 'key1' });
      expect(events[1]).toEqual({ type: 'hit', key: 'key1' });
    });

    test('should handle event listener errors gracefully', async () => {
      cache.addEventListener('set', () => {
        throw new Error('Listener error');
      });
      
      // Should not throw
      await expect(cache.set('key1', 'value1')).resolves.toBeDefined();
    });
  });

  describe('Health Check', () => {
    test('should perform health check', async () => {
      const health = await cache.healthCheck();
      expect(health.healthy).toBeDefined();
      expect(health.issues).toBeDefined();
      expect(health.recommendations).toBeDefined();
    });

    test('should identify performance issues', async () => {
      // Create cache with low hit rate
      const testCache = new AdvancedCache<string>({ maxSize: 5 });
      
      // Set some values
      for (let i = 0; i < 5; i++) {
        await testCache.set(`key${i}`, `value${i}`);
      }
      
      // Generate many misses
      for (let i = 5; i < 20; i++) {
        await testCache.get(`key${i}`);
      }
      
      const health = await testCache.healthCheck();
      expect(health.issues.length).toBeGreaterThan(0);
      
      testCache.shutdown();
    });
  });
});

describe('Eviction Policies', () => {
  describe('LRU Policy', () => {
    test('should evict least recently used entries', () => {
      const policy = new LRUEvictionPolicy();
      const entries = new Map();
      
      // Create test entries with different access times
      entries.set('key1', { lastAccessed: 100, accessCount: 1 });
      entries.set('key2', { lastAccessed: 200, accessCount: 1 });
      entries.set('key3', { lastAccessed: 150, accessCount: 1 });
      
      const candidates = policy.selectEvictionCandidates(entries, {} as any, 1);
      expect(candidates).toEqual(['key1']); // Oldest access time
    });
  });

  describe('LFU Policy', () => {
    test('should evict least frequently used entries', () => {
      const policy = new LFUEvictionPolicy();
      const entries = new Map();
      
      // Create test entries with different access counts
      entries.set('key1', { accessCount: 5, lastAccessed: 100 });
      entries.set('key2', { accessCount: 2, lastAccessed: 200 });
      entries.set('key3', { accessCount: 8, lastAccessed: 150 });
      
      const candidates = policy.selectEvictionCandidates(entries, {} as any, 1);
      expect(candidates).toEqual(['key2']); // Lowest access count
    });
  });

  describe('FIFO Policy', () => {
    test('should evict first inserted entries', () => {
      const policy = new FIFOEvictionPolicy();
      const entries = new Map();
      
      // Create test entries with different insertion orders
      entries.set('key1', { insertionOrder: 1 });
      entries.set('key2', { insertionOrder: 3 });
      entries.set('key3', { insertionOrder: 2 });
      
      const candidates = policy.selectEvictionCandidates(entries, {} as any, 1);
      expect(candidates).toEqual(['key1']); // Earliest insertion
    });
  });

  describe('TTL Policy', () => {
    test('should prioritize expired entries', () => {
      const policy = new TTLEvictionPolicy();
      const entries = new Map();
      const now = Date.now();
      
      // Create test entries, some expired
      entries.set('key1', { ttl: 1000, expiresAt: now - 100, lastAccessed: now - 500 }); // Expired
      entries.set('key2', { ttl: 1000, expiresAt: now + 100, lastAccessed: now - 200 }); // Not expired
      entries.set('key3', { ttl: 1000, expiresAt: now - 50, lastAccessed: now - 300 });  // Expired
      
      const candidates = policy.selectEvictionCandidates(entries, {} as any, 2);
      expect(candidates).toContain('key1');
      expect(candidates).toContain('key3');
    });
  });

  describe('Policy Factory', () => {
    test('should get policy instances', () => {
      const lru = EvictionPolicyFactory.getPolicy('lru');
      expect(lru).toBeInstanceOf(LRUEvictionPolicy);
      
      const lfu = EvictionPolicyFactory.getPolicy('lfu');
      expect(lfu).toBeInstanceOf(LFUEvictionPolicy);
    });

    test('should throw for unknown strategies', () => {
      expect(() => {
        EvictionPolicyFactory.getPolicy('unknown' as any);
      }).toThrow('Unknown eviction strategy: unknown');
    });

    test('should list available strategies', () => {
      const strategies = EvictionPolicyFactory.getAvailableStrategies();
      expect(strategies).toContain('lru');
      expect(strategies).toContain('lfu');
      expect(strategies).toContain('fifo');
      expect(strategies).toContain('ttl');
      expect(strategies).toContain('random');
    });
  });
});

describe('Cache Metrics', () => {
  let collector: CacheMetricsCollector;

  beforeEach(() => {
    collector = new CacheMetricsCollector();
  });

  test('should record hit and miss events', () => {
    collector.recordEvent({ type: 'hit', timestamp: Date.now() });
    collector.recordEvent({ type: 'miss', timestamp: Date.now() });
    collector.recordEvent({ type: 'hit', timestamp: Date.now() });
    
    const stats = collector.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBeCloseTo(66.67, 1); // 2/3 * 100, rounded to 1 decimal place
  });

  test('should track access times', () => {
    collector.recordEvent({ 
      type: 'hit', 
      timestamp: Date.now(),
      metadata: { latency: 5.5 }
    });
    collector.recordEvent({ 
      type: 'hit', 
      timestamp: Date.now(),
      metadata: { latency: 3.5 }
    });
    
    const stats = collector.getStats();
    expect(stats.averageAccessTime).toBe(4.5);
  });

  test('should update cache info', () => {
    collector.updateCacheInfo(100, 50000, 100000);
    
    const stats = collector.getStats();
    expect(stats.size).toBe(100);
    expect(stats.memoryUsage).toBe(50000);
    expect(stats.memoryUtilization).toBe(50);
  });

  test('should track eviction breakdown', () => {
    collector.recordEvent({ 
      type: 'eviction', 
      timestamp: Date.now(),
      metadata: { strategy: 'lru' }
    });
    collector.recordEvent({ 
      type: 'eviction', 
      timestamp: Date.now(),
      metadata: { strategy: 'lfu' }
    });
    collector.recordEvent({ 
      type: 'eviction', 
      timestamp: Date.now(),
      metadata: { strategy: 'lru' }
    });
    
    const stats = collector.getStats();
    expect(stats.evictionBreakdown.lru).toBe(2);
    expect(stats.evictionBreakdown.lfu).toBe(1);
  });

  test('should provide access time percentiles', () => {
    // Add various access times
    const times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    times.forEach(time => {
      collector.recordEvent({ 
        type: 'hit', 
        timestamp: Date.now(),
        metadata: { latency: time }
      });
    });
    
    const percentiles = collector.getAccessTimePercentiles();
    expect(percentiles.p50).toBe(5);
    expect(percentiles.p90).toBe(9);
    expect(percentiles.p95).toBe(10);
    expect(percentiles.p99).toBe(10);
  });
});

describe('Performance Analyzer', () => {
  test('should analyze cache performance', () => {
    const metrics = {
      current: {
        hits: 80,
        misses: 20,
        hitRate: 80,
        size: 100,
        memoryUsage: 50000,
        memoryUtilization: 50,
        evictions: 5,
        expirations: 2,
        averageAccessTime: 2.5,
        evictionBreakdown: { lru: 5, lfu: 0, fifo: 0, ttl: 0, random: 0 },
        lastUpdated: Date.now()
      },
      history: [],
      trends: {
        hitRateTrend: 'stable' as const,
        memoryTrend: 'stable' as const,
        latencyTrend: 'stable' as const
      },
      peaks: {
        maxHitRate: 80,
        maxMemoryUsage: 50000,
        minLatency: 2.5
      }
    };
    
    const analysis = CachePerformanceAnalyzer.analyze(metrics);
    expect(analysis.score).toBeGreaterThan(70); // Good performance
    expect(analysis.issues).toBeDefined();
    expect(analysis.recommendations).toBeDefined();
    expect(analysis.insights).toBeDefined();
  });

  test('should identify low hit rate issues', () => {
    const metrics = {
      current: {
        hits: 30,
        misses: 70,
        hitRate: 30,
        size: 100,
        memoryUsage: 50000,
        memoryUtilization: 50,
        evictions: 50,
        expirations: 5,
        averageAccessTime: 2.5,
        evictionBreakdown: { lru: 50, lfu: 0, fifo: 0, ttl: 0, random: 0 },
        lastUpdated: Date.now()
      },
      history: [],
      trends: {
        hitRateTrend: 'declining' as const,
        memoryTrend: 'stable' as const,
        latencyTrend: 'stable' as const
      },
      peaks: {
        maxHitRate: 30,
        maxMemoryUsage: 50000,
        minLatency: 2.5
      }
    };
    
    const analysis = CachePerformanceAnalyzer.analyze(metrics);
    expect(analysis.score).toBeLessThan(70); // Poor performance
    expect(analysis.issues).toContain('Low cache hit rate');
    expect(analysis.issues).toContain('Declining hit rate trend');
  });

  test('should generate performance report', () => {
    const metrics = {
      current: {
        hits: 80,
        misses: 20,
        hitRate: 80,
        size: 100,
        memoryUsage: 50000000, // 50MB
        memoryUtilization: 50,
        evictions: 5,
        expirations: 2,
        averageAccessTime: 2.5,
        evictionBreakdown: { lru: 5, lfu: 0, fifo: 0, ttl: 0, random: 0 },
        lastUpdated: Date.now()
      },
      history: [],
      trends: {
        hitRateTrend: 'improving' as const,
        memoryTrend: 'stable' as const,
        latencyTrend: 'improving' as const
      },
      peaks: {
        maxHitRate: 85,
        maxMemoryUsage: 60000000,
        minLatency: 2.0
      }
    };
    
    const report = CachePerformanceAnalyzer.generateReport(metrics);
    expect(report).toContain('# Cache Performance Report');
    expect(report).toContain('Hit Rate: 80.00%');
    expect(report).toContain('Memory Usage: 47.68 MB');
    expect(report).toContain('improving');
  });
});

describe('Cache Factory', () => {
  test('should create cache with preset configuration', () => {
    const smallCache = CacheFactory.create('small');
    expect(smallCache).toBeInstanceOf(AdvancedCache);
    smallCache.shutdown();
    
    const largeCache = CacheFactory.create('large');
    expect(largeCache).toBeInstanceOf(AdvancedCache);
    largeCache.shutdown();
  });

  test('should create cache with custom configuration', () => {
    const customCache = CacheFactory.create({
      maxSize: 500,
      defaultTtl: 5000,
      evictionStrategy: 'lfu'
    });
    expect(customCache).toBeInstanceOf(AdvancedCache);
    customCache.shutdown();
  });

  test('should register and use custom presets', () => {
    CacheFactory.registerPreset('test', {
      maxSize: 50,
      defaultTtl: 1000
    });
    
    const presets = CacheFactory.getPresets();
    expect(presets).toContain('test');
    
    const testCache = CacheFactory.create('test');
    expect(testCache).toBeInstanceOf(AdvancedCache);
    testCache.shutdown();
  });

  test('should throw for unknown preset', () => {
    expect(() => {
      CacheFactory.create('unknown-preset' as any);
    }).toThrow('Unknown cache preset: unknown-preset');
  });
});

describe('Integration Tests', () => {
  test('should handle high-throughput operations', async () => {
    const cache = new AdvancedCache<number>({
      maxSize: 1000,
      defaultTtl: 5000,
      threadSafe: false // Better performance for this test
    });
    
    // Perform many operations quickly
    const promises: Promise<any>[] = [];
    
    // Set operations
    for (let i = 0; i < 500; i++) {
      promises.push(cache.set(`key${i}`, i));
    }
    
    await Promise.all(promises);
    expect(cache.size()).toBe(500);
    
    // Get operations
    promises.length = 0;
    for (let i = 0; i < 500; i++) {
      promises.push(cache.get(`key${i}`));
    }
    
    const results = await Promise.all(promises);
    const hits = results.filter(r => r.hit).length;
    expect(hits).toBe(500);
    
    const stats = cache.getStats();
    expect(stats.hitRate).toBe(100);
    
    cache.shutdown();
  });

  test('should maintain performance under memory pressure', async () => {
    const cache = new AdvancedCache<string>({
      maxSize: 100,
      maxMemoryBytes: 1024 * 1024, // 1MB limit
      evictionStrategy: 'lru',
      autoCleanup: false
    });
    
    // Fill cache with large values
    for (let i = 0; i < 50; i++) {
      const largeValue = 'x'.repeat(50000); // 50KB each
      await cache.set(`key${i}`, largeValue);
    }
    
    // Should have triggered memory-based eviction
    expect(cache.size()).toBeLessThan(50);
    expect(cache.memoryUsage()).toBeLessThan(1024 * 1024);
    
    const stats = cache.getStats();
    expect(stats.evictions).toBeGreaterThan(0);
    
    cache.shutdown();
  });

  test('should work correctly with different eviction strategies', async () => {
    const strategies = ['lru', 'lfu', 'fifo', 'ttl'] as const;
    
    for (const strategy of strategies) {
      const cache = new AdvancedCache<string>({
        maxSize: 5,
        evictionStrategy: strategy,
        defaultTtl: 10000 // Long TTL for non-TTL strategies
      });
      
      // Fill cache beyond capacity
      for (let i = 0; i < 8; i++) {
        await cache.set(`key${i}`, `value${i}`);
      }
      
      expect(cache.size()).toBe(5);
      
      const stats = cache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
      
      cache.shutdown();
    }
  });
});
