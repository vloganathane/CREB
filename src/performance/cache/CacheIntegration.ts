/**
 * Advanced Cache Integration Example for CREB-JS
 * 
 * Demonstrates how to integrate the advanced caching system with existing
 * CREB-JS components and replace the legacy PerformanceCache.
 */

import { AdvancedCache, CacheFactory } from './AdvancedCache';
import { CacheEventType } from './types';

/**
 * Enhanced ThermodynamicsCalculator with advanced caching
 */
export class CachedThermodynamicsCalculator {
  private cache = CacheFactory.create('performance-optimized');
  
  constructor() {
    // Set up cache monitoring
    this.setupCacheMonitoring();
  }

  /**
   * Calculate thermodynamic properties with caching
   */
  async calculateThermodynamics(equation: string, temperature: number, pressure: number): Promise<any> {
    const cacheKey = `thermo_${equation}_${temperature}_${pressure}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached.hit) {
      return cached.value;
    }
    
    // Perform calculation (mock implementation)
    const result = await this.performCalculation(equation, temperature, pressure);
    
    // Cache the result with appropriate TTL
    await this.cache.set(cacheKey, result, this.getTTLForCalculation(result));
    
    return result;
  }

  /**
   * Get cache performance statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Perform health check
   */
  async healthCheck() {
    return this.cache.healthCheck();
  }

  /**
   * Shutdown and cleanup
   */
  shutdown() {
    this.cache.shutdown();
  }

  private async performCalculation(equation: string, temperature: number, pressure: number): Promise<any> {
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      equation,
      temperature,
      pressure,
      enthalpy: Math.random() * 1000,
      entropy: Math.random() * 500,
      gibbs: Math.random() * 800,
      calculatedAt: Date.now()
    };
  }

  private getTTLForCalculation(result: any): number {
    // More complex calculations get longer TTL
    if (result.equation.length > 50) {
      return 3600000; // 1 hour
    } else if (result.equation.length > 20) {
      return 1800000; // 30 minutes
    } else {
      return 600000;  // 10 minutes
    }
  }

  private setupCacheMonitoring() {
    // Monitor cache performance
    this.cache.addEventListener('memory-pressure', (event) => {
      console.warn('Cache memory pressure detected:', event.metadata);
    });

    this.cache.addEventListener('stats-update', () => {
      const stats = this.cache.getStats();
      if (stats.hitRate < 50) {
        console.warn('Low cache hit rate detected:', stats.hitRate);
      }
    });

    // Log eviction events for debugging
    this.cache.addEventListener('eviction', (event) => {
      console.debug('Cache eviction:', {
        key: event.key,
        strategy: event.metadata?.strategy,
        reason: event.metadata?.reason
      });
    });
  }
}

/**
 * Enhanced Chemical Database Manager with advanced caching
 */
export class CachedChemicalDatabase {
  private compoundCache = CacheFactory.create('large');
  private queryCache = CacheFactory.create('medium');
  
  constructor() {
    this.setupCacheOptimization();
  }

  /**
   * Get compound data with intelligent caching
   */
  async getCompound(formula: string): Promise<any> {
    const cached = await this.compoundCache.get(formula);
    if (cached.hit) {
      return cached.value;
    }
    
    // Fetch from database
    const compound = await this.fetchCompoundFromDB(formula);
    
    if (compound) {
      // Cache with TTL based on data freshness requirements
      const ttl = this.isCommonCompound(formula) ? 86400000 : 3600000; // 24h vs 1h
      await this.compoundCache.set(formula, compound, ttl);
    }
    
    return compound;
  }

  /**
   * Search compounds with query result caching
   */
  async searchCompounds(query: string, filters: any = {}): Promise<any[]> {
    const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
    
    const cached = await this.queryCache.get(cacheKey);
    if (cached.hit) {
      return cached.value;
    }
    
    const results = await this.performSearch(query, filters);
    
    // Cache search results for shorter time (more dynamic)
    await this.queryCache.set(cacheKey, results, 300000); // 5 minutes
    
    return results;
  }

  /**
   * Get combined cache statistics
   */
  getCacheReport(): string {
    const compoundStats = this.compoundCache.getStats();
    const queryStats = this.queryCache.getStats();
    
    return `
Cache Performance Report:

Compound Cache:
- Hit Rate: ${compoundStats.hitRate.toFixed(2)}%
- Entries: ${compoundStats.size}
- Memory: ${(compoundStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Query Cache:
- Hit Rate: ${queryStats.hitRate.toFixed(2)}%
- Entries: ${queryStats.size}
- Memory: ${(queryStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Overall Performance:
- Combined Hit Rate: ${((compoundStats.hits + queryStats.hits) / (compoundStats.hits + compoundStats.misses + queryStats.hits + queryStats.misses) * 100).toFixed(2)}%
- Total Memory: ${((compoundStats.memoryUsage + queryStats.memoryUsage) / 1024 / 1024).toFixed(2)} MB
    `.trim();
  }

  /**
   * Optimize cache performance based on usage patterns
   */
  async optimizeCaches(): Promise<void> {
    const compoundMetrics = this.compoundCache.getMetrics();
    const queryMetrics = this.queryCache.getMetrics();
    
    // If compound cache hit rate is low, increase size
    if (compoundMetrics.current.hitRate < 60) {
      console.log('Compound cache performance is low, consider increasing size');
    }
    
    // If memory utilization is high, force cleanup
    if (compoundMetrics.current.memoryUtilization > 85) {
      await this.compoundCache.cleanup();
    }
    
    if (queryMetrics.current.memoryUtilization > 85) {
      await this.queryCache.cleanup();
    }
  }

  shutdown() {
    this.compoundCache.shutdown();
    this.queryCache.shutdown();
  }

  private async fetchCompoundFromDB(formula: string): Promise<any> {
    // Simulate database fetch
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      formula,
      name: `Compound ${formula}`,
      molarMass: Math.random() * 500,
      properties: {
        meltingPoint: Math.random() * 1000,
        boilingPoint: Math.random() * 2000,
        density: Math.random() * 5
      },
      lastUpdated: Date.now()
    };
  }

  private async performSearch(query: string, filters: any): Promise<any[]> {
    // Simulate search operation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const resultCount = Math.floor(Math.random() * 20) + 1;
    const results = [];
    
    for (let i = 0; i < resultCount; i++) {
      results.push({
        formula: `${query}${i}`,
        name: `Result ${i} for ${query}`,
        relevance: Math.random()
      });
    }
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  private isCommonCompound(formula: string): boolean {
    // Common compounds that change rarely
    const common = ['H2O', 'CO2', 'NaCl', 'H2SO4', 'HCl', 'NH3', 'CH4', 'C2H5OH'];
    return common.includes(formula);
  }

  private setupCacheOptimization() {
    // Auto-optimization every 10 minutes
    setInterval(() => {
      this.optimizeCaches().catch(error => {
        console.warn('Cache optimization error:', error);
      });
    }, 600000);
  }
}

/**
 * Cache-aware equation balancer
 */
export class CachedEquationBalancer {
  private cache = CacheFactory.create({
    maxSize: 2000,
    defaultTtl: 7200000, // 2 hours (balanced equations don't change)
    evictionStrategy: 'lfu', // Frequent equations are more valuable
    enableMetrics: true
  });

  async balanceEquation(equation: string): Promise<any> {
    // Normalize equation for consistent caching
    const normalizedEquation = this.normalizeEquation(equation);
    
    const cached = await this.cache.get(normalizedEquation);
    if (cached.hit) {
      return { ...cached.value, fromCache: true };
    }
    
    // Perform balancing
    const result = await this.performBalancing(normalizedEquation);
    
    // Cache successful results
    if (result.success) {
      await this.cache.set(normalizedEquation, result);
    }
    
    return { ...result, fromCache: false };
  }

  /**
   * Get equations that would benefit from precomputation
   */
  getFrequentEquations(minAccess: number = 5): Array<{ equation: string; accessCount: number }> {
    const frequent = [];
    
    // This would require access to cache internals or additional tracking
    // For now, return mock data
    return [
      { equation: 'H2 + O2 = H2O', accessCount: 15 },
      { equation: 'CH4 + O2 = CO2 + H2O', accessCount: 12 },
      { equation: 'C2H5OH + O2 = CO2 + H2O', accessCount: 8 }
    ];
  }

  async precomputeFrequentEquations(): Promise<void> {
    const frequent = this.getFrequentEquations();
    
    for (const { equation } of frequent) {
      const cached = await this.cache.get(equation);
      if (!cached.hit) {
        await this.balanceEquation(equation);
      }
    }
  }

  getPerformanceReport(): string {
    const stats = this.cache.getStats();
    const metrics = this.cache.getMetrics();
    
    return `
Equation Balancer Cache Report:

Performance:
- Hit Rate: ${stats.hitRate.toFixed(2)}%
- Average Response Time: ${stats.averageAccessTime.toFixed(2)}ms
- Cached Equations: ${stats.size}

Trends:
- Hit Rate Trend: ${metrics.trends.hitRateTrend}
- Memory Trend: ${metrics.trends.memoryTrend}
- Latency Trend: ${metrics.trends.latencyTrend}

Recommendations:
${this.generateRecommendations(stats, metrics)}
    `.trim();
  }

  shutdown() {
    this.cache.shutdown();
  }

  private normalizeEquation(equation: string): string {
    // Remove extra spaces and standardize formatting
    return equation
      .replace(/\s+/g, ' ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*\+\s*/g, ' + ')
      .trim();
  }

  private async performBalancing(equation: string): Promise<any> {
    // Simulate equation balancing
    await new Promise(resolve => setTimeout(resolve, 75));
    
    return {
      equation,
      balanced: equation, // Would be actual balanced equation
      coefficients: [1, 1, 1], // Mock coefficients
      success: true,
      method: 'matrix',
      calculatedAt: Date.now()
    };
  }

  private generateRecommendations(stats: any, metrics: any): string {
    const recommendations = [];
    
    if (stats.hitRate < 70) {
      recommendations.push('- Consider increasing cache size for better hit rate');
    }
    
    if (metrics.trends.latencyTrend === 'degrading') {
      recommendations.push('- Monitor for performance bottlenecks');
    }
    
    if (stats.memoryUtilization > 80) {
      recommendations.push('- Consider memory cleanup or size optimization');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- Cache performance is optimal');
    }
    
    return recommendations.join('\n');
  }
}

/**
 * Multi-level cache for hierarchical data
 */
export class MultiLevelCache {
  private l1Cache = CacheFactory.create('small');     // Fast, small cache
  private l2Cache = CacheFactory.create('medium');    // Medium cache
  private l3Cache = CacheFactory.create('large');     // Large, persistent cache
  
  async get(key: string): Promise<any> {
    // Try L1 first (fastest)
    let result = await this.l1Cache.get(key);
    if (result.hit) {
      return { value: result.value, level: 'L1', latency: result.latency };
    }
    
    // Try L2
    result = await this.l2Cache.get(key);
    if (result.hit) {
      // Promote to L1
      await this.l1Cache.set(key, result.value);
      return { value: result.value, level: 'L2', latency: result.latency };
    }
    
    // Try L3
    result = await this.l3Cache.get(key);
    if (result.hit) {
      // Promote to L2 (and potentially L1)
      await this.l2Cache.set(key, result.value);
      return { value: result.value, level: 'L3', latency: result.latency };
    }
    
    return { value: undefined, level: 'MISS', latency: 0 };
  }

  async set(key: string, value: any, level: 'L1' | 'L2' | 'L3' = 'L1'): Promise<void> {
    switch (level) {
      case 'L1':
        await this.l1Cache.set(key, value);
        break;
      case 'L2':
        await this.l2Cache.set(key, value);
        break;
      case 'L3':
        await this.l3Cache.set(key, value);
        break;
    }
  }

  getAggregatedStats() {
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache.getStats();
    const l3Stats = this.l3Cache.getStats();
    
    return {
      l1: l1Stats,
      l2: l2Stats,
      l3: l3Stats,
      combined: {
        totalHits: l1Stats.hits + l2Stats.hits + l3Stats.hits,
        totalMisses: l1Stats.misses + l2Stats.misses + l3Stats.misses,
        totalSize: l1Stats.size + l2Stats.size + l3Stats.size,
        totalMemory: l1Stats.memoryUsage + l2Stats.memoryUsage + l3Stats.memoryUsage
      }
    };
  }

  shutdown() {
    this.l1Cache.shutdown();
    this.l2Cache.shutdown();
    this.l3Cache.shutdown();
  }
}

/**
 * Example usage and migration guide
 */
export function demonstrateAdvancedCaching() {
  console.log('🚀 Advanced Caching System Demo\n');
  
  // Example 1: Replace legacy PerformanceCache
  console.log('1. Creating optimized caches for different use cases:');
  
  const equationCache = CacheFactory.create('performance-optimized');
  const thermodynamicsCache = CacheFactory.create('memory-optimized');
  const compoundCache = CacheFactory.create('large');
  
  console.log('✅ Created specialized caches\n');
  
  // Example 2: Monitor cache performance
  console.log('2. Setting up cache monitoring:');
  
  equationCache.addEventListener('stats-update', () => {
    const stats = equationCache.getStats();
    console.log(`Equation cache hit rate: ${stats.hitRate.toFixed(2)}%`);
  });
  
  console.log('✅ Monitoring configured\n');
  
  // Example 3: Use with existing CREB components
  console.log('3. Integration examples:');
  
  const cachedCalculator = new CachedThermodynamicsCalculator();
  const cachedDatabase = new CachedChemicalDatabase();
  const cachedBalancer = new CachedEquationBalancer();
  
  console.log('✅ Integrated with CREB components\n');
  
  console.log('4. Performance benefits:');
  console.log('- TTL-based expiration prevents stale data');
  console.log('- Multiple eviction strategies optimize for different access patterns');
  console.log('- Comprehensive metrics enable performance monitoring');
  console.log('- Thread-safe operations support concurrent access');
  console.log('- Memory management prevents OOM errors');
  console.log('- Event system enables reactive optimization\n');
  
  // Cleanup
  setTimeout(() => {
    equationCache.shutdown();
    thermodynamicsCache.shutdown();
    compoundCache.shutdown();
    cachedCalculator.shutdown();
    cachedDatabase.shutdown();
    cachedBalancer.shutdown();
    console.log('✅ Demo completed, caches shut down');
  }, 1000);
}

// Export for external use
export { AdvancedCache, CacheFactory } from './AdvancedCache';
export * from './types';
export * from './EvictionPolicies';
export * from './CacheMetrics';
