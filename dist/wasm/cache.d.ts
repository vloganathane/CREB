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
    ttl: number;
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
export declare class CREBCache<T> {
    private cache;
    private config;
    private metrics;
    private cleanupTimer;
    constructor(config?: Partial<CacheConfig>);
    /**
     * Get value from cache or compute it
     */
    get<K>(key: string, computeFn: () => Promise<T> | T, forceRefresh?: boolean): Promise<T>;
    /**
     * Set value in cache
     */
    set(key: string, value: T, computationTime?: number): void;
    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean;
    /**
     * Delete entry from cache
     */
    delete(key: string): boolean;
    /**
     * Clear entire cache
     */
    clear(): void;
    /**
     * Get cache metrics
     */
    getMetrics(): CacheMetrics;
    /**
     * Get cache configuration
     */
    getConfig(): CacheConfig;
    /**
     * Update cache configuration
     */
    updateConfig(newConfig: Partial<CacheConfig>): void;
    /**
     * Generate cache key for chemistry calculations
     */
    static generateKey(operation: string, ...params: (string | number | boolean | object)[]): string;
    /**
     * Warm up cache with common calculations
     */
    warmUp(calculations: Array<{
        key: string;
        computeFn: () => Promise<T> | T;
    }>): Promise<void>;
    /**
     * Export cache data for persistence
     */
    export(): string;
    /**
     * Import cache data from persistence
     */
    import(data: string): void;
    private evictLRU;
    private isExpired;
    private updateHitRate;
    private updateAverageComputationTime;
    private resetMetrics;
    private startCleanupTimer;
    private stopCleanupTimer;
    private cleanup;
    private persistEntry;
    private isValidEntry;
    private compress;
    private decompress;
}
/**
 * Specialized cache for equation balancing results
 */
export declare class EquationBalancingCache extends CREBCache<any> {
    constructor();
    balanceEquation(equation: string, balanceFn: () => Promise<any>): Promise<any>;
}
/**
 * Specialized cache for thermodynamic calculations
 */
export declare class ThermodynamicsCache extends CREBCache<number> {
    constructor();
    calculateGibbs(deltaH: number, deltaS: number, temperature: number, calculateFn: () => Promise<number>): Promise<number>;
    calculateEnthalpy(reactants: string[], products: string[], calculateFn: () => Promise<number>): Promise<number>;
}
/**
 * Specialized cache for molecular weight calculations
 */
export declare class MolecularWeightCache extends CREBCache<number> {
    constructor();
    calculateWeight(formula: string, calculateFn: () => Promise<number>): Promise<number>;
}
/**
 * Global cache manager for all CREB operations
 */
export declare class CREBCacheManager {
    equations: EquationBalancingCache;
    thermodynamics: ThermodynamicsCache;
    molecularWeights: MolecularWeightCache;
    general: CREBCache<any>;
    /**
     * Get aggregated metrics from all caches
     */
    getAggregatedMetrics(): {
        totalHits: number;
        totalMisses: number;
        totalEvictions: number;
        totalRequests: number;
        totalCacheSize: number;
        averageHitRate: number;
        cacheBreakdown: Record<string, CacheMetrics>;
    };
    /**
     * Clear all caches
     */
    clearAll(): void;
    /**
     * Warm up all caches with common calculations
     */
    warmUpAll(): Promise<void>;
}
export declare const cacheManager: CREBCacheManager;
//# sourceMappingURL=cache.d.ts.map