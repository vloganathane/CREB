/**
 * Advanced Cache Types for CREB-JS
 *
 * Defines interfaces and types for the advanced caching system with TTL,
 * multiple eviction policies, metrics, and memory management.
 */
/**
 * Cache eviction strategies
 */
export type EvictionStrategy = 'lru' | 'lfu' | 'fifo' | 'ttl' | 'random';
/**
 * Cache entry with metadata
 */
export interface CacheEntry<T = any> {
    /** The cached value */
    value: T;
    /** Creation timestamp */
    createdAt: number;
    /** Last accessed timestamp */
    lastAccessed: number;
    /** Access frequency counter */
    accessCount: number;
    /** Time to live in milliseconds (0 = no TTL) */
    ttl: number;
    /** Expiration timestamp (createdAt + ttl) */
    expiresAt: number;
    /** Size estimate in bytes */
    sizeBytes: number;
    /** Entry insertion order for FIFO */
    insertionOrder: number;
}
/**
 * Cache configuration options
 */
export interface AdvancedCacheConfig {
    /** Maximum number of entries */
    maxSize: number;
    /** Default TTL in milliseconds (0 = no TTL) */
    defaultTtl: number;
    /** Primary eviction strategy */
    evictionStrategy: EvictionStrategy;
    /** Fallback eviction strategy if primary fails */
    fallbackStrategy?: EvictionStrategy;
    /** Maximum memory usage in bytes (0 = no limit) */
    maxMemoryBytes: number;
    /** Enable metrics collection */
    enableMetrics: boolean;
    /** Metrics collection interval in milliseconds */
    metricsInterval: number;
    /** Enable automatic cleanup of expired entries */
    autoCleanup: boolean;
    /** Cleanup interval in milliseconds */
    cleanupInterval: number;
    /** Thread safety (enables locking mechanisms) */
    threadSafe: boolean;
}
/**
 * Cache operation statistics
 */
export interface CacheStats {
    /** Total cache hits */
    hits: number;
    /** Total cache misses */
    misses: number;
    /** Cache hit rate as percentage */
    hitRate: number;
    /** Total number of entries */
    size: number;
    /** Total memory usage in bytes */
    memoryUsage: number;
    /** Memory usage as percentage of limit */
    memoryUtilization: number;
    /** Number of evictions */
    evictions: number;
    /** Number of expired entries cleaned up */
    expirations: number;
    /** Average access time in milliseconds */
    averageAccessTime: number;
    /** Distribution of eviction strategies used */
    evictionBreakdown: Record<EvictionStrategy, number>;
    /** Timestamp of last statistics update */
    lastUpdated: number;
}
/**
 * Cache performance metrics over time
 */
export interface CacheMetrics {
    /** Current statistics snapshot */
    current: CacheStats;
    /** Historical statistics (last N intervals) */
    history: CacheStats[];
    /** Performance trends */
    trends: {
        hitRateTrend: 'improving' | 'declining' | 'stable';
        memoryTrend: 'increasing' | 'decreasing' | 'stable';
        latencyTrend: 'improving' | 'degrading' | 'stable';
    };
    /** Peak performance metrics */
    peaks: {
        maxHitRate: number;
        maxMemoryUsage: number;
        minLatency: number;
    };
}
/**
 * Cache operation result
 */
export interface CacheResult<T = any> {
    /** Whether the operation was successful */
    success: boolean;
    /** The cached value (if found) */
    value?: T;
    /** Whether this was a cache hit */
    hit: boolean;
    /** Operation latency in milliseconds */
    latency: number;
    /** Error message if operation failed */
    error?: string;
    /** Additional metadata */
    metadata?: {
        strategy?: EvictionStrategy;
        evicted?: boolean;
        expired?: boolean;
        memoryPressure?: boolean;
    };
}
/**
 * Eviction policy interface
 */
export interface EvictionPolicy {
    /** Strategy name */
    readonly strategy: EvictionStrategy;
    /**
     * Select entries to evict
     * @param entries Map of all cache entries
     * @param config Cache configuration
     * @param targetCount Number of entries to evict
     * @returns Array of keys to evict
     */
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    /**
     * Update entry metadata on access
     * @param entry Cache entry to update
     */
    onAccess<T>(entry: CacheEntry<T>): void;
    /**
     * Update entry metadata on insertion
     * @param entry Cache entry to update
     */
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * Cache event types
 */
export type CacheEventType = 'hit' | 'miss' | 'set' | 'delete' | 'eviction' | 'expiration' | 'clear' | 'cleanup' | 'memory-pressure' | 'stats-update';
/**
 * Cache event data
 */
export interface CacheEvent<T = any> {
    /** Event type */
    type: CacheEventType;
    /** Cache key involved */
    key?: string;
    /** Cache value involved */
    value?: T;
    /** Event timestamp */
    timestamp: number;
    /** Event metadata */
    metadata?: {
        strategy?: EvictionStrategy;
        reason?: string;
        latency?: number;
        memoryBefore?: number;
        memoryAfter?: number;
        sizeBefore?: number;
        sizeAfter?: number;
    };
}
/**
 * Cache event listener
 */
export type CacheEventListener<T = any> = (event: CacheEvent<T>) => void;
/**
 * Advanced cache interface
 */
export interface IAdvancedCache<T = any> {
    /** Get value from cache */
    get(key: string): Promise<CacheResult<T>>;
    /** Set value in cache */
    set(key: string, value: T, ttl?: number): Promise<CacheResult<void>>;
    /** Check if key exists in cache */
    has(key: string): Promise<boolean>;
    /** Delete entry from cache */
    delete(key: string): Promise<boolean>;
    /** Clear all entries */
    clear(): Promise<void>;
    /** Get current cache statistics */
    getStats(): CacheStats;
    /** Get detailed metrics */
    getMetrics(): CacheMetrics;
    /** Force cleanup of expired entries */
    cleanup(): Promise<number>;
    /** Add event listener */
    addEventListener(type: CacheEventType, listener: CacheEventListener<T>): void;
    /** Remove event listener */
    removeEventListener(type: CacheEventType, listener: CacheEventListener<T>): void;
    /** Get all keys */
    keys(): string[];
    /** Get cache size */
    size(): number;
    /** Get memory usage in bytes */
    memoryUsage(): number;
    /** Check if cache is healthy */
    healthCheck(): Promise<{
        healthy: boolean;
        issues: string[];
        recommendations: string[];
    }>;
}
/**
 * Cache factory configuration
 */
export interface CacheFactoryConfig {
    /** Default cache configuration */
    defaults: Partial<AdvancedCacheConfig>;
    /** Preset configurations */
    presets: Record<string, Partial<AdvancedCacheConfig>>;
    /** Global metrics collection */
    globalMetrics: boolean;
}
/**
 * Multi-level cache configuration
 */
export interface MultiLevelCacheConfig {
    /** L1 cache (memory) configuration */
    l1: AdvancedCacheConfig;
    /** L2 cache (persistent) configuration */
    l2?: AdvancedCacheConfig;
    /** L3 cache (distributed) configuration */
    l3?: AdvancedCacheConfig;
    /** Promotion/demotion thresholds */
    thresholds: {
        l1ToL2AccessCount: number;
        l2ToL3AccessCount: number;
        promoteOnHit: boolean;
        demoteOnMiss: boolean;
    };
}
//# sourceMappingURL=types.d.ts.map