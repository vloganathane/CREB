/**
 * Advanced Cache Implementation for CREB-JS
 *
 * Production-ready cache with TTL, multiple eviction policies, metrics,
 * memory management, and thread safety.
 */
import { IAdvancedCache, AdvancedCacheConfig, CacheResult, CacheStats, CacheMetrics, CacheEventType, CacheEventListener } from './types';
/**
 * Advanced cache implementation with comprehensive features
 */
export declare class AdvancedCache<T = any> implements IAdvancedCache<T> {
    private entries;
    private config;
    private metrics;
    private listeners;
    private insertionCounter;
    private cleanupTimer?;
    private metricsTimer?;
    private mutex;
    constructor(config?: Partial<AdvancedCacheConfig>);
    /**
     * Get value from cache
     */
    get(key: string): Promise<CacheResult<T>>;
    /**
     * Set value in cache
     */
    set(key: string, value: T, ttl?: number): Promise<CacheResult<void>>;
    /**
     * Check if key exists in cache
     */
    has(key: string): Promise<boolean>;
    /**
     * Delete entry from cache
     */
    delete(key: string): Promise<boolean>;
    /**
     * Clear all entries
     */
    clear(): Promise<void>;
    /**
     * Get current cache statistics
     */
    getStats(): CacheStats;
    /**
     * Get detailed metrics
     */
    getMetrics(): CacheMetrics;
    /**
     * Force cleanup of expired entries
     */
    cleanup(): Promise<number>;
    /**
     * Add event listener
     */
    addEventListener(type: CacheEventType, listener: CacheEventListener<T>): void;
    /**
     * Remove event listener
     */
    removeEventListener(type: CacheEventType, listener: CacheEventListener<T>): void;
    /**
     * Get all keys
     */
    keys(): string[];
    /**
     * Get cache size
     */
    size(): number;
    /**
     * Get memory usage in bytes
     */
    memoryUsage(): number;
    /**
     * Check if cache is healthy
     */
    healthCheck(): Promise<{
        healthy: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    /**
     * Shutdown cache and cleanup resources
     */
    shutdown(): void;
    private getInternal;
    private setInternal;
    private deleteInternal;
    private clearInternal;
    private cleanupInternal;
    private evictEntries;
    private evictForMemory;
    private estimateSize;
    private emitEvent;
    private updateMetrics;
    private startCleanupTimer;
    private startMetricsTimer;
}
/**
 * Cache factory for creating configured cache instances
 */
export declare class CacheFactory {
    private static presets;
    /**
     * Create cache with preset configuration
     */
    static create<T = any>(preset: keyof typeof CacheFactory.presets): AdvancedCache<T>;
    static create<T = any>(config: Partial<AdvancedCacheConfig>): AdvancedCache<T>;
    /**
     * Register custom preset
     */
    static registerPreset(name: string, config: Partial<AdvancedCacheConfig>): void;
    /**
     * Get available presets
     */
    static getPresets(): string[];
}
//# sourceMappingURL=AdvancedCache.d.ts.map