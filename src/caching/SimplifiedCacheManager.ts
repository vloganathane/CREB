/**
 * CREB Phase 3: Simplified Caching Manager
 * Browser-compatible version with localStorage fallback
 */

export interface CacheStats {
  memorySize: number;
  persistentSize: number;
  hitRate: number;
  missRate: number;
  totalRequests: number;
}

/**
 * Simplified Intelligent Cache Manager (Browser Mode)
 * Uses localStorage and memory cache without external dependencies
 */
export class SimplifiedCacheManager {
  private memoryCache: Map<string, { data: any, timestamp: number, ttl?: number }> = new Map();
  private maxMemorySize: number = 100; // Maximum items in memory
  private stats: CacheStats = {
    memorySize: 0,
    persistentSize: 0,
    hitRate: 0,
    missRate: 0,
    totalRequests: 0
  };

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Clear old cache entries on startup
    this.cleanupExpiredEntries();
    console.log('🧠 Simplified Cache Manager initialized (Browser Mode)');
  }

  /**
   * Get item from cache (memory first, then localStorage)
   */
  async get(key: string): Promise<any> {
    this.stats.totalRequests++;

    // Check memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem) {
      // Check if expired
      if (memoryItem.ttl && Date.now() > memoryItem.timestamp + memoryItem.ttl) {
        this.memoryCache.delete(key);
      } else {
        this.recordHit('memory');
        console.log(`💾 Cache hit (memory): ${key}`);
        return memoryItem.data;
      }
    }

    // Check localStorage
    try {
      const persistentItem = localStorage.getItem(`creb_cache_${key}`);
      if (persistentItem) {
        const parsed = JSON.parse(persistentItem);
        
        // Check if expired
        if (parsed.ttl && Date.now() > parsed.timestamp + parsed.ttl) {
          localStorage.removeItem(`creb_cache_${key}`);
        } else {
          // Move to memory cache for faster future access
          this.memoryCache.set(key, {
            data: parsed.data,
            timestamp: parsed.timestamp,
            ttl: parsed.ttl
          });
          
          this.recordHit('persistent');
          console.log(`💽 Cache hit (persistent): ${key}`);
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }

    // Cache miss
    this.recordMiss();
    console.log(`❌ Cache miss: ${key}`);
    return null;
  }

  /**
   * Set item in cache (both memory and localStorage)
   */
  async set(key: string, data: any, ttl?: number): Promise<void> {
    const timestamp = Date.now();
    const cacheItem = { data, timestamp, ttl };

    // Store in memory cache
    this.memoryCache.set(key, cacheItem);
    
    // Enforce memory size limit
    if (this.memoryCache.size > this.maxMemorySize) {
      this.evictOldestMemoryItems();
    }

    // Store in localStorage
    try {
      const serialized = JSON.stringify(cacheItem);
      localStorage.setItem(`creb_cache_${key}`, serialized);
      console.log(`✅ Cache set: ${key} (${serialized.length} bytes)`);
    } catch (error) {
      // localStorage might be full
      console.warn('Error writing to localStorage:', error);
      this.cleanupLocalStorage();
    }

    this.updateStats();
  }

  /**
   * Clear specific cache entry
   */
  async clear(key: string): Promise<void> {
    this.memoryCache.delete(key);
    localStorage.removeItem(`creb_cache_${key}`);
    console.log(`🗑️ Cache cleared: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    
    // Clear all CREB cache entries from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('creb_cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    this.resetStats();
    console.log('🧹 All cache entries cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.memorySize = this.memoryCache.size;
    
    // Count localStorage items
    let persistentCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('creb_cache_')) {
        persistentCount++;
      }
    }
    this.stats.persistentSize = persistentCount;

    // Calculate hit/miss rates
    if (this.stats.totalRequests > 0) {
      const hits = this.stats.totalRequests - (this.stats.totalRequests * this.stats.missRate);
      this.stats.hitRate = hits / this.stats.totalRequests;
    }
  }

  /**
   * Record cache hit
   */
  private recordHit(type: 'memory' | 'persistent'): void {
    // Update hit rate calculation
    const totalHits = this.stats.totalRequests * this.stats.hitRate + 1;
    this.stats.hitRate = totalHits / this.stats.totalRequests;
    this.stats.missRate = 1 - this.stats.hitRate;
  }

  /**
   * Record cache miss
   */
  private recordMiss(): void {
    const totalMisses = this.stats.totalRequests * this.stats.missRate + 1;
    this.stats.missRate = totalMisses / this.stats.totalRequests;
    this.stats.hitRate = 1 - this.stats.missRate;
  }

  /**
   * Reset statistics
   */
  private resetStats(): void {
    this.stats = {
      memorySize: 0,
      persistentSize: 0,
      hitRate: 0,
      missRate: 0,
      totalRequests: 0
    };
  }

  /**
   * Evict oldest items from memory cache
   */
  private evictOldestMemoryItems(): void {
    const sortedEntries = Array.from(this.memoryCache.entries())
      .sort(([,a], [,b]) => a.timestamp - b.timestamp);
    
    // Remove oldest 25% of items
    const toRemove = Math.floor(sortedEntries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete(sortedEntries[i][0]);
    }
    
    console.log(`🧹 Evicted ${toRemove} old items from memory cache`);
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.ttl && now > item.timestamp + item.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage cache
    const expiredKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('creb_cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.ttl && now > item.timestamp + item.ttl) {
            expiredKeys.push(key);
          }
        } catch (error) {
          // Invalid JSON, remove it
          expiredKeys.push(key);
        }
      }
    }

    expiredKeys.forEach(key => localStorage.removeItem(key));
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  /**
   * Clean up localStorage when full
   */
  private cleanupLocalStorage(): void {
    console.log('🧹 localStorage full, cleaning up old CREB cache entries...');
    
    const crebKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('creb_cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          crebKeys.push({ key, timestamp: item.timestamp || 0 });
        } catch (error) {
          crebKeys.push({ key, timestamp: 0 });
        }
      }
    }

    // Sort by timestamp and remove oldest 50%
    crebKeys.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = Math.floor(crebKeys.length * 0.5);
    
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(crebKeys[i].key);
    }
    
    console.log(`🧹 Removed ${toRemove} old cache entries from localStorage`);
  }
}
