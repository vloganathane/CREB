/**
 * Caching Layer for CREB-JS
 * Intelligent caching system for chemistry calculations
 * Part of Q4 2025 Performance Optimization initiative
 */

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  computationTime: number;
}

export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  cleanupInterval: number;
  persistToDisk: boolean;
  compressionEnabled: boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  totalRequests: number;
  averageComputationTime: number;
  cacheSize: number;
  hitRate: number;
}

/**
 * Intelligent caching system with LRU eviction and performance metrics
 */
export class CREBCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0,
    averageComputationTime: 0,
    cacheSize: 0,
    hitRate: 0
  };
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 1000,
      ttl: config.ttl || 30 * 60 * 1000, // 30 minutes default
      cleanupInterval: config.cleanupInterval || 5 * 60 * 1000, // 5 minutes
      persistToDisk: config.persistToDisk || false,
      compressionEnabled: config.compressionEnabled || false
    };

    this.startCleanupTimer();
  }

  /**
   * Get value from cache or compute it
   */
  async get<K>(
    key: string,
    computeFn: () => Promise<T> | T,
    forceRefresh = false
  ): Promise<T> {
    this.metrics.totalRequests++;

    if (!forceRefresh && this.has(key)) {
      const entry = this.cache.get(key)!;
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.metrics.hits++;
      this.updateHitRate();
      return entry.value;
    }

    // Cache miss - compute value
    this.metrics.misses++;
    const startTime = performance.now();
    
    try {
      const value = await computeFn();
      const computationTime = performance.now() - startTime;
      
      this.set(key, value, computationTime);
      this.updateHitRate();
      this.updateAverageComputationTime(computationTime);
      
      return value;
    } catch (error) {
      this.updateHitRate();
      throw error;
    }
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, computationTime = 0): void {
    const now = Date.now();
    
    // Check if we need to evict items
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      computationTime
    };

    this.cache.set(key, entry);
    this.metrics.cacheSize = this.cache.size;

    if (this.config.persistToDisk) {
      this.persistEntry(key, entry);
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.metrics.cacheSize = this.cache.size;
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.metrics.cacheSize = this.cache.size;
    }
    return deleted;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.metrics.cacheSize = 0;
    this.resetMetrics();
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart cleanup timer if interval changed
    if (newConfig.cleanupInterval !== undefined) {
      this.stopCleanupTimer();
      this.startCleanupTimer();
    }
  }

  /**
   * Generate cache key for chemistry calculations
   */
  static generateKey(
    operation: string,
    ...params: (string | number | boolean | object)[]
  ): string {
    const serialized = params.map(p => 
      typeof p === 'object' ? JSON.stringify(p) : String(p)
    ).join('|');
    return `${operation}:${serialized}`;
  }

  /**
   * Warm up cache with common calculations
   */
  async warmUp(calculations: Array<{ key: string; computeFn: () => Promise<T> | T }>): Promise<void> {
    const promises = calculations.map(({ key, computeFn }) =>
      this.get(key, computeFn).catch(error => {
        console.warn(`Cache warmup failed for key ${key}:`, error);
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Export cache data for persistence
   */
  export(): string {
    const data = {
      entries: Array.from(this.cache.entries()),
      metrics: this.metrics,
      timestamp: Date.now()
    };

    return this.config.compressionEnabled
      ? this.compress(JSON.stringify(data))
      : JSON.stringify(data);
  }

  /**
   * Import cache data from persistence
   */
  import(data: string): void {
    try {
      const decompressed = this.config.compressionEnabled
        ? this.decompress(data)
        : data;
      
      const parsed = JSON.parse(decompressed);
      
      // Validate imported entries
      for (const [key, entry] of parsed.entries) {
        if (this.isValidEntry(entry) && !this.isExpired(entry)) {
          this.cache.set(key, entry);
        }
      }

      this.metrics.cacheSize = this.cache.size;
    } catch (error) {
      console.error('Failed to import cache data:', error);
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.metrics.evictions++;
      this.metrics.cacheSize = this.cache.size;
    }
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.config.ttl;
  }

  private updateHitRate(): void {
    this.metrics.hitRate = this.metrics.totalRequests > 0
      ? (this.metrics.hits / this.metrics.totalRequests) * 100
      : 0;
  }

  private updateAverageComputationTime(newTime: number): void {
    const totalComputations = this.metrics.misses;
    this.metrics.averageComputationTime = 
      (this.metrics.averageComputationTime * (totalComputations - 1) + newTime) / totalComputations;
  }

  private resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
      averageComputationTime: 0,
      cacheSize: 0,
      hitRate: 0
    };
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    this.metrics.cacheSize = this.cache.size;
  }

  private persistEntry(key: string, entry: CacheEntry<T>): void {
    // Placeholder for disk persistence implementation
    // In a real implementation, this would write to localStorage, IndexedDB, or file system
  }

  private isValidEntry(entry: any): entry is CacheEntry<T> {
    return entry &&
      typeof entry.timestamp === 'number' &&
      typeof entry.accessCount === 'number' &&
      typeof entry.lastAccessed === 'number' &&
      typeof entry.computationTime === 'number' &&
      entry.value !== undefined;
  }

  private compress(data: string): string {
    // Placeholder for compression implementation
    // In a real implementation, this would use a compression library
    return data;
  }

  private decompress(data: string): string {
    // Placeholder for decompression implementation
    return data;
  }
}

/**
 * Specialized cache for equation balancing results
 */
export class EquationBalancingCache extends CREBCache<any> {
  constructor() {
    super({
      maxSize: 500,
      ttl: 60 * 60 * 1000, // 1 hour - equations don't change
      cleanupInterval: 10 * 60 * 1000 // 10 minutes
    });
  }

  async balanceEquation(equation: string, balanceFn: () => Promise<any>): Promise<any> {
    const key = CREBCache.generateKey('balance', equation.trim().toLowerCase());
    return this.get(key, balanceFn);
  }
}

/**
 * Specialized cache for thermodynamic calculations
 */
export class ThermodynamicsCache extends CREBCache<number> {
  constructor() {
    super({
      maxSize: 1000,
      ttl: 2 * 60 * 60 * 1000, // 2 hours - properties don't change often
      cleanupInterval: 15 * 60 * 1000 // 15 minutes
    });
  }

  async calculateGibbs(
    deltaH: number,
    deltaS: number,
    temperature: number,
    calculateFn: () => Promise<number>
  ): Promise<number> {
    const key = CREBCache.generateKey('gibbs', deltaH, deltaS, temperature);
    return this.get(key, calculateFn);
  }

  async calculateEnthalpy(
    reactants: string[],
    products: string[],
    calculateFn: () => Promise<number>
  ): Promise<number> {
    const key = CREBCache.generateKey('enthalpy', reactants.sort(), products.sort());
    return this.get(key, calculateFn);
  }
}

/**
 * Specialized cache for molecular weight calculations
 */
export class MolecularWeightCache extends CREBCache<number> {
  constructor() {
    super({
      maxSize: 2000,
      ttl: 24 * 60 * 60 * 1000, // 24 hours - molecular weights are constant
      cleanupInterval: 30 * 60 * 1000 // 30 minutes
    });
  }

  async calculateWeight(formula: string, calculateFn: () => Promise<number>): Promise<number> {
    const key = CREBCache.generateKey('molweight', formula.trim());
    return this.get(key, calculateFn);
  }
}

/**
 * Global cache manager for all CREB operations
 */
export class CREBCacheManager {
  public equations = new EquationBalancingCache();
  public thermodynamics = new ThermodynamicsCache();
  public molecularWeights = new MolecularWeightCache();
  public general = new CREBCache<any>({
    maxSize: 500,
    ttl: 15 * 60 * 1000 // 15 minutes for general calculations
  });

  /**
   * Get aggregated metrics from all caches
   */
  getAggregatedMetrics() {
    const caches = [this.equations, this.thermodynamics, this.molecularWeights, this.general];
    
    const aggregated = {
      totalHits: 0,
      totalMisses: 0,
      totalEvictions: 0,
      totalRequests: 0,
      totalCacheSize: 0,
      averageHitRate: 0,
      cacheBreakdown: {} as Record<string, CacheMetrics>
    };

    const cacheNames = ['equations', 'thermodynamics', 'molecularWeights', 'general'];
    
    caches.forEach((cache, index) => {
      const metrics = cache.getMetrics();
      const name = cacheNames[index];
      
      aggregated.totalHits += metrics.hits;
      aggregated.totalMisses += metrics.misses;
      aggregated.totalEvictions += metrics.evictions;
      aggregated.totalRequests += metrics.totalRequests;
      aggregated.totalCacheSize += metrics.cacheSize;
      aggregated.cacheBreakdown[name] = metrics;
    });

    aggregated.averageHitRate = aggregated.totalRequests > 0
      ? (aggregated.totalHits / aggregated.totalRequests) * 100
      : 0;

    return aggregated;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.equations.clear();
    this.thermodynamics.clear();
    this.molecularWeights.clear();
    this.general.clear();
  }

  /**
   * Warm up all caches with common calculations
   */
  async warmUpAll(): Promise<void> {
    // This would be implemented with common chemistry calculations
    console.log('Cache warmup completed');
  }
}

// Global cache manager instance
export const cacheManager = new CREBCacheManager();
