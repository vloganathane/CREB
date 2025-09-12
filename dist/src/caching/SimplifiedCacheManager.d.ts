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
export declare class SimplifiedCacheManager {
    private memoryCache;
    private maxMemorySize;
    private stats;
    constructor();
    private initialize;
    /**
     * Get item from cache (memory first, then localStorage)
     */
    get(key: string): Promise<any>;
    /**
     * Set item in cache (both memory and localStorage)
     */
    set(key: string, data: any, ttl?: number): Promise<void>;
    /**
     * Clear specific cache entry
     */
    clear(key: string): Promise<void>;
    /**
     * Clear all cache entries
     */
    clearAll(): Promise<void>;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Update cache statistics
     */
    private updateStats;
    /**
     * Record cache hit
     */
    private recordHit;
    /**
     * Record cache miss
     */
    private recordMiss;
    /**
     * Reset statistics
     */
    private resetStats;
    /**
     * Evict oldest items from memory cache
     */
    private evictOldestMemoryItems;
    /**
     * Clean up expired cache entries
     */
    private cleanupExpiredEntries;
    /**
     * Clean up localStorage when full
     */
    private cleanupLocalStorage;
}
//# sourceMappingURL=SimplifiedCacheManager.d.ts.map