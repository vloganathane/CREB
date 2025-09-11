/**
 * CREB Phase 3: Intelligent Caching System
 *
 * This module provides multi-level caching for molecular structures and animations
 * with automatic optimization, cache invalidation, and IndexedDB persistence.
 */
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    timestamp: number;
    ttl: number;
    size: number;
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
    maxMemorySize: number;
    maxDiskSize: number;
    defaultTTL: number;
    enableCompression: boolean;
    compressionThreshold: number;
    maxEntries: number;
    evictionStrategy: 'lru' | 'lfu' | 'ttl' | 'hybrid';
    persistenceEnabled: boolean;
    preloadCommonReactions: boolean;
}
/**
 * Multi-level intelligent caching system
 * Provides memory cache, persistent storage, and automatic optimization
 */
export declare class IntelligentCacheManager {
    private memoryCache;
    private accessHistory;
    private db;
    private config;
    private stats;
    private optimizationTimer?;
    private static readonly COMMON_REACTIONS;
    constructor(config?: Partial<CacheConfig>);
    /**
     * Initialize the cache system
     */
    private initialize;
    /**
     * Initialize IndexedDB database
     */
    private initializeDatabase;
    /**
     * Get cached entry with intelligent fallback strategy
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set cached entry with intelligent storage strategy
     */
    set<T>(key: string, value: T, ttl?: number, metadata?: Partial<CacheMetadata>): Promise<void>;
    /**
     * Preload common chemical reactions for instant access
     */
    private preloadCommonReactions;
    /**
     * Intelligent cache optimization
     */
    private startOptimization;
    /**
     * Optimize cache based on usage patterns
     */
    private optimizeCache;
    /**
     * Remove expired entries from all cache levels
     */
    private removeExpiredEntries;
    /**
     * Apply intelligent eviction strategy
     */
    private applyEvictionStrategy;
    /**
     * Compress frequently accessed large entries
     */
    private compressFrequentEntries;
    /**
     * Update cache statistics
     */
    private updateCacheStats;
    /**
     * Helper methods
     */
    private normalizeKey;
    private isExpired;
    private calculateSize;
    private shouldPersist;
    private updateAccessHistory;
    private updateStats;
    private calculateMemoryUsage;
    private calculateDiskUsage;
    private selectLRUEntries;
    private selectLFUEntries;
    private selectTTLEntries;
    private selectHybridEntries;
    private setInMemory;
    private setOnDisk;
    private getFromDisk;
    private compressValue;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Clear specific cache level
     */
    clear(level?: 'memory' | 'disk' | 'all'): Promise<void>;
    /**
     * Dispose cache manager and clean up resources
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=IntelligentCacheManager.d.ts.map