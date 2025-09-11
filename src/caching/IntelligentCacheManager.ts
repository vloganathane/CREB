/**
 * CREB Phase 3: Intelligent Caching System
 * 
 * This module provides multi-level caching for molecular structures and animations
 * with automatic optimization, cache invalidation, and IndexedDB persistence.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { telemetry, globalProfiler, globalMetrics } from '../core/telemetry';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  size: number; // Size in bytes
  accessCount: number;
  lastAccessed: number;
  metadata: CacheMetadata;
}

export interface CacheMetadata {
  source: 'pubchem' | 'rdkit' | 'animation' | 'computation';
  type: 'molecular-structure' | 'animation-frames' | 'energy-profile' | 'force-field';
  version: string;
  quality: 'low' | 'medium' | 'high';
  compression?: 'gzip' | 'lz4' | 'none';
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  diskUsage: number;
  evictionCount: number;
  lastOptimization: number;
}

export interface CacheConfig {
  maxMemorySize: number; // Maximum memory cache size in bytes
  maxDiskSize: number;   // Maximum IndexedDB size in bytes
  defaultTTL: number;    // Default time to live in milliseconds
  enableCompression: boolean;
  compressionThreshold: number; // Compress entries larger than this size
  maxEntries: number;    // Maximum number of entries per cache level
  evictionStrategy: 'lru' | 'lfu' | 'ttl' | 'hybrid';
  persistenceEnabled: boolean;
  preloadCommonReactions: boolean;
}

interface CacheDB extends DBSchema {
  animations: {
    key: string;
    value: CacheEntry;
  };
  structures: {
    key: string;
    value: CacheEntry;
  };
  metadata: {
    key: string;
    value: any;
  };
}

/**
 * Multi-level intelligent caching system
 * Provides memory cache, persistent storage, and automatic optimization
 */
export class IntelligentCacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private accessHistory = new Map<string, number[]>();
  private db!: IDBPDatabase<CacheDB>;
  private config: CacheConfig;
  private stats: CacheStats;
  private optimizationTimer?: NodeJS.Timeout;

  // Common reaction patterns for preloading
  private static readonly COMMON_REACTIONS = [
    'CH4 + 2O2 = CO2 + 2H2O',
    '2H2 + O2 = 2H2O', 
    'H2 + Cl2 = 2HCl',
    '2H2O2 = 2H2O + O2',
    'N2 + 3H2 = 2NH3',
    'CaCO3 = CaO + CO2',
    'NaOH + HCl = NaCl + H2O',
    'C6H12O6 + 6O2 = 6CO2 + 6H2O'
  ];

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxMemorySize: 100 * 1024 * 1024, // 100MB
      maxDiskSize: 500 * 1024 * 1024,   // 500MB
      defaultTTL: 24 * 60 * 60 * 1000,  // 24 hours
      enableCompression: true,
      compressionThreshold: 10 * 1024,   // 10KB
      maxEntries: 1000,
      evictionStrategy: 'hybrid',
      persistenceEnabled: true,
      preloadCommonReactions: true,
      ...config
    };

    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      memoryUsage: 0,
      diskUsage: 0,
      evictionCount: 0,
      lastOptimization: Date.now()
    };

    this.initialize();
    telemetry.info('💾 Intelligent cache manager initialized', { config: this.config });
  }

  /**
   * Initialize the cache system
   */
  private async initialize(): Promise<void> {
    try {
      if (this.config.persistenceEnabled) {
        await this.initializeDatabase();
      }

      if (this.config.preloadCommonReactions) {
        await this.preloadCommonReactions();
      }

      // Start automatic optimization
      this.startOptimization();
      
      globalMetrics.counter('cache.initialization.success', 1);
      telemetry.info('✅ Cache system initialized successfully');

    } catch (error) {
      globalMetrics.counter('cache.initialization.errors', 1);
      telemetry.error('❌ Cache initialization failed', error as Error);
      throw error;
    }
  }

  /**
   * Initialize IndexedDB database
   */
  private async initializeDatabase(): Promise<void> {
    this.db = await openDB<CacheDB>('CREB-Cache', 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('animations')) {
          db.createObjectStore('animations');
        }
        if (!db.objectStoreNames.contains('structures')) {
          db.createObjectStore('structures');
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata');
        }
      }
    });

    telemetry.info('💿 IndexedDB initialized for persistent caching');
  }

  /**
   * Get cached entry with intelligent fallback strategy
   */
  async get<T>(key: string): Promise<T | null> {
    return globalProfiler.profileAsync('cache.get', async () => {
      const normalizedKey = this.normalizeKey(key);
      
      try {
        // 1. Try memory cache first (fastest)
        const memoryEntry = this.memoryCache.get(normalizedKey);
        if (memoryEntry && !this.isExpired(memoryEntry)) {
          this.updateAccessHistory(normalizedKey);
          memoryEntry.accessCount++;
          memoryEntry.lastAccessed = Date.now();
          
          globalMetrics.counter('cache.memory.hits', 1);
          telemetry.debug('💨 Memory cache hit', { key: normalizedKey });
          
          return memoryEntry.value as T;
        }

        // 2. Try persistent storage (slower but reliable)
        if (this.config.persistenceEnabled && this.db) {
          const diskEntry = await this.getFromDisk(normalizedKey);
          if (diskEntry && !this.isExpired(diskEntry)) {
            // Promote to memory cache
            await this.setInMemory(normalizedKey, diskEntry.value, diskEntry.ttl, diskEntry.metadata);
            
            globalMetrics.counter('cache.disk.hits', 1);
            telemetry.debug('💿 Disk cache hit', { key: normalizedKey });
            
            return diskEntry.value as T;
          }
        }

        // 3. Cache miss
        globalMetrics.counter('cache.misses', 1);
        telemetry.debug('❌ Cache miss', { key: normalizedKey });
        
        return null;

      } catch (error) {
        globalMetrics.counter('cache.get.errors', 1);
        telemetry.error('❌ Cache get operation failed', error as Error, { key: normalizedKey });
        return null;
      }
    });
  }

  /**
   * Set cached entry with intelligent storage strategy
   */
  async set<T>(
    key: string, 
    value: T, 
    ttl: number = this.config.defaultTTL,
    metadata: Partial<CacheMetadata> = {}
  ): Promise<void> {
    return globalProfiler.profileAsync('cache.set', async () => {
      const normalizedKey = this.normalizeKey(key);
      const size = this.calculateSize(value);
      
      const fullMetadata: CacheMetadata = {
        source: 'computation',
        type: 'molecular-structure',
        version: '1.0.0',
        quality: 'medium',
        compression: 'none',
        ...metadata
      };

      try {
        // Compress large entries if enabled
        let processedValue = value;
        if (this.config.enableCompression && size > this.config.compressionThreshold) {
          processedValue = await this.compressValue(value);
          fullMetadata.compression = 'gzip';
        }

        // Always store in memory cache
        await this.setInMemory(normalizedKey, processedValue, ttl, fullMetadata);

        // Store in persistent storage for important/large data
        if (this.config.persistenceEnabled && this.shouldPersist(size, fullMetadata)) {
          await this.setOnDisk(normalizedKey, processedValue, ttl, fullMetadata);
        }

        // Update statistics
        this.updateStats(size, 'set');
        
        globalMetrics.counter('cache.set.success', 1);
        telemetry.debug('✅ Cache entry stored', { 
          key: normalizedKey, 
          size, 
          metadata: fullMetadata 
        });

      } catch (error) {
        globalMetrics.counter('cache.set.errors', 1);
        telemetry.error('❌ Cache set operation failed', error as Error, { 
          key: normalizedKey, 
          size 
        });
        throw error;
      }
    });
  }

  /**
   * Preload common chemical reactions for instant access
   */
  private async preloadCommonReactions(): Promise<void> {
    telemetry.info('🔄 Starting preload of common reactions');
    
    for (const reaction of IntelligentCacheManager.COMMON_REACTIONS) {
      const key = `preload:${reaction}`;
      
      // Check if already cached
      const existing = await this.get(key);
      if (!existing) {
        // Mark for lazy loading
        await this.set(key, { 
          equation: reaction, 
          preloaded: true, 
          loadedAt: Date.now() 
        }, this.config.defaultTTL * 7, { // 7 days TTL for preloaded content
          source: 'computation',
          type: 'molecular-structure',
          version: '1.0.0',
          quality: 'high'
        });
      }
    }
    
    telemetry.info('✅ Common reactions preloaded');
  }

  /**
   * Intelligent cache optimization
   */
  private startOptimization(): void {
    this.optimizationTimer = setInterval(() => {
      this.optimizeCache();
    }, 5 * 60 * 1000); // Every 5 minutes

    telemetry.info('🔧 Cache optimization scheduler started');
  }

  /**
   * Optimize cache based on usage patterns
   */
  private async optimizeCache(): Promise<void> {
    return globalProfiler.profileAsync('cache.optimization', async () => {
      try {
        telemetry.info('🔧 Starting cache optimization');

        // 1. Remove expired entries
        await this.removeExpiredEntries();

        // 2. Apply eviction strategy if over limits
        await this.applyEvictionStrategy();

        // 3. Compress frequently accessed large entries
        await this.compressFrequentEntries();

        // 4. Update statistics
        await this.updateCacheStats();

        this.stats.lastOptimization = Date.now();
        
        globalMetrics.counter('cache.optimization.success', 1);
        telemetry.info('✅ Cache optimization completed', { 
          stats: this.stats 
        });

      } catch (error) {
        globalMetrics.counter('cache.optimization.errors', 1);
        telemetry.error('❌ Cache optimization failed', error as Error);
      }
    });
  }

  /**
   * Remove expired entries from all cache levels
   */
  private async removeExpiredEntries(): Promise<void> {
    let removedCount = 0;

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        removedCount++;
      }
    }

    // Clean disk cache
    if (this.config.persistenceEnabled && this.db) {
      const tx = this.db.transaction(['animations', 'structures'], 'readwrite');
      
      for (const store of [tx.objectStore('animations'), tx.objectStore('structures')]) {
        const cursor = await store.openCursor();
        while (cursor) {
          const entry = cursor.value as CacheEntry;
          if (this.isExpired(entry)) {
            await cursor.delete();
            removedCount++;
          }
          cursor.continue();
        }
      }
    }

    if (removedCount > 0) {
      telemetry.info('🧹 Removed expired cache entries', { count: removedCount });
    }
  }

  /**
   * Apply intelligent eviction strategy
   */
  private async applyEvictionStrategy(): Promise<void> {
    const memoryUsage = this.calculateMemoryUsage();
    
    if (memoryUsage > this.config.maxMemorySize) {
      const entries = Array.from(this.memoryCache.entries());
      let entriesToEvict: string[] = [];

      switch (this.config.evictionStrategy) {
        case 'lru':
          entriesToEvict = this.selectLRUEntries(entries);
          break;
        case 'lfu':
          entriesToEvict = this.selectLFUEntries(entries);
          break;
        case 'ttl':
          entriesToEvict = this.selectTTLEntries(entries);
          break;
        case 'hybrid':
          entriesToEvict = this.selectHybridEntries(entries);
          break;
      }

      // Evict selected entries
      for (const key of entriesToEvict) {
        this.memoryCache.delete(key);
        this.stats.evictionCount++;
      }

      telemetry.info('🗑️ Evicted cache entries', { 
        strategy: this.config.evictionStrategy,
        count: entriesToEvict.length 
      });
    }
  }

  /**
   * Compress frequently accessed large entries
   */
  private async compressFrequentEntries(): Promise<void> {
    if (!this.config.enableCompression) return;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.size > this.config.compressionThreshold && 
          entry.accessCount > 5 && 
          entry.metadata.compression === 'none') {
        
        try {
          const compressedValue = await this.compressValue(entry.value);
          const newSize = this.calculateSize(compressedValue);
          
          if (newSize < entry.size * 0.8) { // Only compress if >20% reduction
            entry.value = compressedValue;
            entry.size = newSize;
            entry.metadata.compression = 'gzip';
            
            telemetry.debug('🗜️ Compressed cache entry', { 
              key, 
              originalSize: entry.size, 
              compressedSize: newSize 
            });
          }
        } catch (error) {
          telemetry.warn('Failed to compress cache entry', { key, error });
        }
      }
    }
  }

  /**
   * Update cache statistics
   */
  private async updateCacheStats(): Promise<void> {
    this.stats.totalEntries = this.memoryCache.size;
    this.stats.memoryUsage = this.calculateMemoryUsage();
    
    if (this.config.persistenceEnabled && this.db) {
      this.stats.diskUsage = await this.calculateDiskUsage();
    }

    // Calculate hit rates
    const memoryHits = globalMetrics.getMetric('cache.memory.hits')?.value || 0;
    const diskHits = globalMetrics.getMetric('cache.disk.hits')?.value || 0;
    const misses = globalMetrics.getMetric('cache.misses')?.value || 0;
    const totalRequests = memoryHits + diskHits + misses;
    
    if (totalRequests > 0) {
      const hits = memoryHits + diskHits;
      
      this.stats.hitRate = hits / totalRequests;
      this.stats.missRate = 1 - this.stats.hitRate;
    }

    globalMetrics.gauge('cache.memory_usage', this.stats.memoryUsage);
    globalMetrics.gauge('cache.hit_rate', this.stats.hitRate);
  }

  /**
   * Helper methods
   */
  private normalizeKey(key: string): string {
    return key.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9+\-=→]/g, '');
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private calculateSize(value: any): number {
    return JSON.stringify(value).length * 2; // Rough estimate (UTF-16)
  }

  private shouldPersist(size: number, metadata: CacheMetadata): boolean {
    // Persist important or frequently accessed data
    return metadata.quality === 'high' || 
           size > this.config.compressionThreshold ||
           metadata.type === 'animation-frames';
  }

  private updateAccessHistory(key: string): void {
    const history = this.accessHistory.get(key) || [];
    history.push(Date.now());
    
    // Keep only last 10 accesses
    if (history.length > 10) {
      history.shift();
    }
    
    this.accessHistory.set(key, history);
  }

  private updateStats(size: number, operation: 'get' | 'set'): void {
    if (operation === 'set') {
      this.stats.totalSize += size;
    }
  }

  private calculateMemoryUsage(): number {
    let total = 0;
    for (const entry of this.memoryCache.values()) {
      total += entry.size;
    }
    return total;
  }

  private async calculateDiskUsage(): Promise<number> {
    // Simplified disk usage calculation
    return 0; // Would require IndexedDB storage estimation
  }

  private selectLRUEntries(entries: [string, CacheEntry][]): string[] {
    return entries
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      .slice(0, Math.floor(entries.length * 0.1))
      .map(([key]) => key);
  }

  private selectLFUEntries(entries: [string, CacheEntry][]): string[] {
    return entries
      .sort((a, b) => a[1].accessCount - b[1].accessCount)
      .slice(0, Math.floor(entries.length * 0.1))
      .map(([key]) => key);
  }

  private selectTTLEntries(entries: [string, CacheEntry][]): string[] {
    const now = Date.now();
    return entries
      .sort((a, b) => (a[1].timestamp + a[1].ttl) - (b[1].timestamp + b[1].ttl))
      .slice(0, Math.floor(entries.length * 0.1))
      .map(([key]) => key);
  }

  private selectHybridEntries(entries: [string, CacheEntry][]): string[] {
    // Hybrid strategy: combine LRU and LFU with size consideration
    return entries
      .sort((a, b) => {
        const scoreA = a[1].accessCount / Math.log(Date.now() - a[1].lastAccessed + 1) / a[1].size;
        const scoreB = b[1].accessCount / Math.log(Date.now() - b[1].lastAccessed + 1) / b[1].size;
        return scoreA - scoreB;
      })
      .slice(0, Math.floor(entries.length * 0.1))
      .map(([key]) => key);
  }

  private async setInMemory<T>(key: string, value: T, ttl: number, metadata: CacheMetadata): Promise<void> {
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      size: this.calculateSize(value),
      accessCount: 1,
      lastAccessed: Date.now(),
      metadata
    };

    this.memoryCache.set(key, entry);
  }

  private async setOnDisk<T>(key: string, value: T, ttl: number, metadata: CacheMetadata): Promise<void> {
    if (!this.db) return;

    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      size: this.calculateSize(value),
      accessCount: 1,
      lastAccessed: Date.now(),
      metadata
    };

    const storeName = metadata.type === 'animation-frames' ? 'animations' : 'structures';
    await this.db.put(storeName, entry, key);
  }

  private async getFromDisk(key: string): Promise<CacheEntry | null> {
    if (!this.db) return null;

    // Try both stores
    const stores = ['animations', 'structures'] as const;
    
    for (const storeName of stores) {
      const entry = await this.db.get(storeName, key);
      if (entry) return entry;
    }

    return null;
  }

  private async compressValue(value: any): Promise<any> {
    // Simplified compression - in real implementation, use pako.js or similar
    return JSON.stringify(value);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Clear specific cache level
   */
  async clear(level: 'memory' | 'disk' | 'all' = 'all'): Promise<void> {
    if (level === 'memory' || level === 'all') {
      this.memoryCache.clear();
      this.accessHistory.clear();
      telemetry.info('🧹 Memory cache cleared');
    }

    if ((level === 'disk' || level === 'all') && this.config.persistenceEnabled && this.db) {
      const tx = this.db.transaction(['animations', 'structures', 'metadata'], 'readwrite');
      await tx.objectStore('animations').clear();
      await tx.objectStore('structures').clear();
      await tx.objectStore('metadata').clear();
      telemetry.info('🧹 Disk cache cleared');
    }

    await this.updateCacheStats();
  }

  /**
   * Dispose cache manager and clean up resources
   */
  async dispose(): Promise<void> {
    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
    }

    await this.clear('memory');
    
    if (this.db) {
      this.db.close();
    }

    telemetry.info('💾 Cache manager disposed');
  }
}
