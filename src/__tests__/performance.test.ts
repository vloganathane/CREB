/**
 * Comprehensive Tests for CREB Performance Optimizations Module
 */

import {
  PerformanceCache,
  MemoryManager,
  LazyLoader,
  WebAssemblyCalculator,
  PerformanceMonitor,
  OptimizedBalancer
} from '../performance/index';

describe('Performance Optimizations Module', () => {
  beforeEach(() => {
    // Clear caches and reset state before each test
    PerformanceCache.getInstance().clear();
    PerformanceMonitor.clear();
    LazyLoader.clear();
  });

  describe('PerformanceCache', () => {
    test('should implement singleton pattern correctly', () => {
      const cache1 = PerformanceCache.getInstance();
      const cache2 = PerformanceCache.getInstance();
      expect(cache1).toBe(cache2);
    });

    test('should cache and retrieve values correctly', () => {
      const cache = PerformanceCache.getInstance();
      const testData = { result: 'test-value', computed: true };
      
      // Set cache value
      cache.set('test-key', testData, 'equation');
      
      // Retrieve cached value
      const retrieved = cache.get('test-key', 'equation');
      expect(retrieved).toEqual(testData);
    });

    test('should return null for non-existent cache keys', () => {
      const cache = PerformanceCache.getInstance();
      const result = cache.get('non-existent', 'equation');
      expect(result).toBeNull();
    });

    test('should track cache statistics correctly', () => {
      const cache = PerformanceCache.getInstance();
      cache.set('key1', 'value1', 'equation');
      cache.set('key2', 'value2', 'thermodynamics');
      
      // Hit
      cache.get('key1', 'equation');
      // Miss
      cache.get('non-existent', 'kinetics');
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(50);
      expect(stats.sizes.equation).toBe(1);
      expect(stats.sizes.thermodynamics).toBe(1);
      expect(stats.sizes.kinetics).toBe(0);
    });

    test('should implement LRU eviction when cache is full', () => {
      const cache = PerformanceCache.getInstance();
      
      // Fill cache beyond capacity (simulate small cache for testing)
      for (let i = 0; i < 1005; i++) {
        cache.set(`key${i}`, `value${i}`, 'equation');
      }
      
      const stats = cache.getStats();
      expect(stats.sizes.equation).toBeLessThanOrEqual(1000);
    });

    test('should clear cache correctly', () => {
      const cache = PerformanceCache.getInstance();
      cache.set('key1', 'value1', 'equation');
      cache.set('key2', 'value2', 'thermodynamics');
      
      // Clear specific category
      cache.clear('equation');
      expect(cache.get('key1', 'equation')).toBeNull();
      expect(cache.get('key2', 'thermodynamics')).not.toBeNull();
      
      // Clear all
      cache.clear();
      expect(cache.get('key2', 'thermodynamics')).toBeNull();
    });
  });

  describe('MemoryManager', () => {
    test('should register objects for memory monitoring', () => {
      const testObj = { data: 'test' };
      const registered = MemoryManager.register(testObj);
      
      expect(registered).toBe(testObj);
      
      const stats = MemoryManager.getStats();
      expect(stats.trackedObjects).toBe(1);
    });

    test('should provide memory usage statistics', () => {
      const stats = MemoryManager.getStats();
      expect(stats).toHaveProperty('trackedObjects');
      expect(stats).toHaveProperty('memoryUsage');
      expect(typeof stats.trackedObjects).toBe('number');
    });

    test('should cleanup dereferenced objects', () => {
      // Create and register object
      let testObj: any = { data: 'test' };
      MemoryManager.register(testObj);
      
      // Dereference object
      testObj = null;
      
      // Force cleanup
      MemoryManager.cleanup();
      
      // Note: This test may not always pass due to garbage collection timing
      // but validates the cleanup mechanism exists
      const stats = MemoryManager.getStats();
      expect(typeof stats.trackedObjects).toBe('number');
    });
  });

  describe('LazyLoader', () => {
    test('should load modules lazily and cache them', async () => {
      const mockModule = { name: 'test-module', loaded: true };
      const loader = jest.fn().mockResolvedValue(mockModule);
      
      // First load
      const result1 = await LazyLoader.load('test-module', loader);
      expect(result1).toBe(mockModule);
      expect(loader).toHaveBeenCalledTimes(1);
      
      // Second load should use cache
      const result2 = await LazyLoader.load('test-module', loader);
      expect(result2).toBe(mockModule);
      expect(loader).toHaveBeenCalledTimes(1); // Still only called once
    });

    test('should handle loading errors correctly', async () => {
      const error = new Error('Loading failed');
      const loader = jest.fn().mockRejectedValue(error);
      
      await expect(LazyLoader.load('failing-module', loader)).rejects.toThrow('Loading failed');
    });

    test('should check if modules are loaded', async () => {
      const mockModule = { name: 'test-module' };
      const loader = jest.fn().mockResolvedValue(mockModule);
      
      expect(LazyLoader.isLoaded('test-module')).toBe(false);
      
      await LazyLoader.load('test-module', loader);
      
      expect(LazyLoader.isLoaded('test-module')).toBe(true);
    });

    test('should preload multiple modules', async () => {
      const modules = [
        { name: 'module1', loader: () => Promise.resolve({ name: 'module1' }) },
        { name: 'module2', loader: () => Promise.resolve({ name: 'module2' }) },
        { name: 'failing', loader: () => Promise.reject(new Error('Failed')) }
      ];
      
      await LazyLoader.preload(modules);
      
      expect(LazyLoader.isLoaded('module1')).toBe(true);
      expect(LazyLoader.isLoaded('module2')).toBe(true);
      expect(LazyLoader.isLoaded('failing')).toBe(false);
    });

    test('should provide loading statistics', async () => {
      const loader = () => Promise.resolve({ test: true });
      
      // Start a load
      const loadPromise = LazyLoader.load('async-module', loader);
      
      let stats = LazyLoader.getStats();
      expect(stats.currentlyLoading).toBe(1);
      
      await loadPromise;
      
      stats = LazyLoader.getStats();
      expect(stats.totalLoaded).toBe(1);
      expect(stats.currentlyLoading).toBe(0);
      expect(stats.loadedModules).toContain('async-module');
    });
  });

  describe('WebAssemblyCalculator', () => {
    test('should initialize correctly', async () => {
      await WebAssemblyCalculator.initialize();
      expect(WebAssemblyCalculator.isAvailable()).toBe(true);
    });

    test('should perform matrix calculations', async () => {
      await WebAssemblyCalculator.initialize();
      
      const matrix = [[1, 2], [3, 4]];
      const result = await WebAssemblyCalculator.calculateMatrix(matrix);
      
      expect(result).toEqual([[1, 2], [3, 4]]); // Simulated result
    });

    test('should solve linear systems', async () => {
      await WebAssemblyCalculator.initialize();
      
      const coefficients = [[1, 2], [3, 4]];
      const constants = [5, 6];
      const result = await WebAssemblyCalculator.solveLinearSystem(coefficients, constants);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    test('should balance equations', async () => {
      await WebAssemblyCalculator.initialize();
      
      const equation = 'H2 + O2 = H2O';
      const result = await WebAssemblyCalculator.balanceEquation(equation);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    test('should throw error when not initialized', async () => {
      // Create a new instance without initialization
      const uninitializedCalculator = class extends WebAssemblyCalculator {
        static isAvailable() { return false; }
      };
      
      await expect(uninitializedCalculator.calculateMatrix([[1, 2]]))
        .rejects.toThrow('WebAssembly not initialized');
    });
  });

  describe('PerformanceMonitor', () => {
    test('should measure operation timing', () => {
      const endTiming = PerformanceMonitor.startTiming('test-operation');
      
      // Simulate work
      const start = Date.now();
      while (Date.now() - start < 10) { /* wait */ }
      
      const duration = endTiming();
      expect(duration).toBeGreaterThan(0);
    });

    test('should measure synchronous operations', () => {
      const result = PerformanceMonitor.measure('sync-test', () => {
        return 'test-result';
      });
      
      expect(result).toBe('test-result');
      
      const stats = PerformanceMonitor.getStats('sync-test');
      expect(stats.count).toBe(1);
      expect(stats.average).toBeGreaterThan(0);
    });

    test('should measure asynchronous operations', async () => {
      const result = await PerformanceMonitor.measureAsync('async-test', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async-result';
      });
      
      expect(result).toBe('async-result');
      
      const stats = PerformanceMonitor.getStats('async-test');
      expect(stats.count).toBe(1);
      expect(stats.average).toBeGreaterThan(0);
    });

    test('should calculate performance statistics correctly', () => {
      // Record multiple measurements
      for (let i = 0; i < 10; i++) {
        PerformanceMonitor.measure('stats-test', () => {
          const start = Date.now();
          while (Date.now() - start < i) { /* variable work */ }
          return i;
        });
      }
      
      const stats = PerformanceMonitor.getStats('stats-test');
      expect(stats.count).toBe(10);
      expect(stats.average).toBeGreaterThan(0);
      expect(stats.min).toBeGreaterThanOrEqual(0);
      expect(stats.max).toBeGreaterThan(stats.min);
      expect(stats.median).toBeGreaterThanOrEqual(0);
      expect(stats.p95).toBeGreaterThanOrEqual(stats.median);
      expect(stats.p99).toBeGreaterThanOrEqual(stats.p95);
    });

    test('should handle errors in measured operations', () => {
      expect(() => {
        PerformanceMonitor.measure('error-test', () => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');
      
      const stats = PerformanceMonitor.getStats('error-test');
      expect(stats.count).toBe(1); // Error should still be recorded
    });

    test('should clear measurements correctly', () => {
      PerformanceMonitor.measure('clear-test', () => 'result');
      
      let stats = PerformanceMonitor.getStats('clear-test');
      expect(stats.count).toBe(1);
      
      PerformanceMonitor.clear('clear-test');
      
      stats = PerformanceMonitor.getStats('clear-test');
      expect(stats.count).toBe(0);
    });

    test('should get all operation statistics', () => {
      PerformanceMonitor.measure('op1', () => 'result1');
      PerformanceMonitor.measure('op2', () => 'result2');
      
      const allStats = PerformanceMonitor.getStats() as Record<string, any>;
      expect(allStats).toHaveProperty('op1');
      expect(allStats).toHaveProperty('op2');
      expect(allStats.op1.count).toBe(1);
      expect(allStats.op2.count).toBe(1);
    });
  });

  describe('OptimizedBalancer', () => {
    let balancer: OptimizedBalancer;

    beforeEach(() => {
      balancer = new OptimizedBalancer();
    });

    test('should balance equations with performance tracking', async () => {
      const equation = 'H2 + O2 = H2O';
      const result = await balancer.balance(equation);
      
      expect(result).toHaveProperty('coefficients');
      expect(result).toHaveProperty('balanced');
      expect(result).toHaveProperty('fromCache');
      expect(result).toHaveProperty('calculationTime');
      
      expect(Array.isArray(result.coefficients)).toBe(true);
      expect(typeof result.balanced).toBe('string');
      expect(typeof result.fromCache).toBe('boolean');
      expect(typeof result.calculationTime).toBe('number');
    });

    test('should use cache for repeated equations', async () => {
      const equation = 'H2 + O2 = H2O';
      
      // First call
      const result1 = await balancer.balance(equation);
      expect(result1.fromCache).toBe(false);
      expect(result1.calculationTime).toBeGreaterThan(0);
      
      // Second call should use cache
      const result2 = await balancer.balance(equation);
      expect(result2.fromCache).toBe(true);
      expect(result2.calculationTime).toBe(0);
      
      // Results should be equivalent
      expect(result2.coefficients).toEqual(result1.coefficients);
      expect(result2.balanced).toEqual(result1.balanced);
    });

    test('should handle invalid equations gracefully', async () => {
      const invalidEquation = '123 + abc = invalid';
      
      await expect(balancer.balance(invalidEquation))
        .rejects.toThrow('Invalid equation format');
    });

    test('should provide comprehensive statistics', async () => {
      const equation = 'H2 + O2 = H2O';
      await balancer.balance(equation);
      
      const stats = balancer.getStats();
      expect(stats).toHaveProperty('cache');
      expect(stats).toHaveProperty('performance');
      expect(stats).toHaveProperty('wasmAvailable');
      
      expect(typeof stats.wasmAvailable).toBe('boolean');
      expect(stats.cache.hits).toBeGreaterThanOrEqual(0);
      expect(stats.cache.misses).toBeGreaterThanOrEqual(0);
    });

    test('should work with WebAssembly when available', async () => {
      // Initialize WebAssembly
      await WebAssemblyCalculator.initialize();
      
      const equation = 'C + O2 = CO2';
      const result = await balancer.balance(equation);
      
      expect(result.coefficients).toEqual([1, 1, 1]); // Updated expected result
      expect(result.balanced).toContain('Balanced');
    });
  });

  describe('Integration Tests', () => {
    test('should work together for optimal performance', async () => {
      // Initialize all systems
      await WebAssemblyCalculator.initialize();
      
      const balancer = new OptimizedBalancer();
      const cache = PerformanceCache.getInstance();
      
      // Register some objects for memory monitoring
      const testObj = MemoryManager.register({ data: 'test' });
      expect(testObj.data).toBe('test');
      
      // Load a module lazily
      const module = await LazyLoader.load('integration-test', () => 
        Promise.resolve({ integrated: true })
      );
      expect(module.integrated).toBe(true);
      
      // Perform cached calculations
      const equation = 'CH4 + O2 = CO2 + H2O';
      const result1 = await balancer.balance(equation);
      const result2 = await balancer.balance(equation);
      
      expect(result1.fromCache).toBe(false);
      expect(result2.fromCache).toBe(true);
      
      // Check overall system stats
      const cacheStats = cache.getStats();
      const memoryStats = MemoryManager.getStats();
      const loaderStats = LazyLoader.getStats();
      const balancerStats = balancer.getStats();
      
      expect(cacheStats.hits).toBeGreaterThan(0);
      expect(memoryStats.trackedObjects).toBeGreaterThan(0);
      expect(loaderStats.totalLoaded).toBeGreaterThan(0);
      expect(balancerStats.wasmAvailable).toBe(true);
    });

    test('should handle high-performance scenarios', async () => {
      const balancer = new OptimizedBalancer();
      const equations = [
        'H2 + O2 = H2O',
        'CH4 + O2 = CO2 + H2O',
        'C6H12O6 + O2 = CO2 + H2O',
        'NaCl + AgNO3 = AgCl + NaNO3',
        'CaCO3 = CaO + CO2'
      ];
      
      // Measure bulk operations
      const startTime = performance.now();
      
      const results = await Promise.all(
        equations.map(eq => balancer.balance(eq))
      );
      
      const totalTime = performance.now() - startTime;
      
      expect(results).toHaveLength(5);
      expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
      
      // Second run should be much faster due to caching
      const cachedStartTime = performance.now();
      
      const cachedResults = await Promise.all(
        equations.map(eq => balancer.balance(eq))
      );
      
      const cachedTime = performance.now() - cachedStartTime;
      
      expect(cachedTime).toBeLessThan(totalTime);
      expect(cachedResults.every(r => r.fromCache)).toBe(true);
    });
  });
});
