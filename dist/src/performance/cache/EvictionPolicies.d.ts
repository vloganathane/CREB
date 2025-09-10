/**
 * Cache Eviction Policies for CREB-JS
 *
 * Implements various cache eviction strategies including LRU, LFU, FIFO, TTL, and Random.
 * Each policy provides different trade-offs between performance and memory efficiency.
 */
import { EvictionPolicy, EvictionStrategy, CacheEntry, AdvancedCacheConfig } from './types';
/**
 * Least Recently Used (LRU) eviction policy
 * Evicts entries that haven't been accessed for the longest time
 */
export declare class LRUEvictionPolicy implements EvictionPolicy {
    readonly strategy: EvictionStrategy;
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * Least Frequently Used (LFU) eviction policy
 * Evicts entries with the lowest access frequency
 */
export declare class LFUEvictionPolicy implements EvictionPolicy {
    readonly strategy: EvictionStrategy;
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * First In, First Out (FIFO) eviction policy
 * Evicts entries in the order they were inserted
 */
export declare class FIFOEvictionPolicy implements EvictionPolicy {
    readonly strategy: EvictionStrategy;
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * Time To Live (TTL) eviction policy
 * Evicts expired entries first, then falls back to LRU
 */
export declare class TTLEvictionPolicy implements EvictionPolicy {
    readonly strategy: EvictionStrategy;
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * Random eviction policy
 * Evicts random entries (useful for testing and as fallback)
 */
export declare class RandomEvictionPolicy implements EvictionPolicy {
    readonly strategy: EvictionStrategy;
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
}
/**
 * Eviction policy factory
 */
export declare class EvictionPolicyFactory {
    private static policies;
    /**
     * Get eviction policy instance
     */
    static getPolicy(strategy: EvictionStrategy): EvictionPolicy;
    /**
     * Register custom eviction policy
     */
    static registerPolicy(policy: EvictionPolicy): void;
    /**
     * Get all available strategies
     */
    static getAvailableStrategies(): EvictionStrategy[];
}
/**
 * Adaptive eviction policy that switches strategies based on access patterns
 */
export declare class AdaptiveEvictionPolicy implements EvictionPolicy {
    private fallbackStrategy;
    readonly strategy: EvictionStrategy;
    private currentPolicy;
    private performanceHistory;
    private evaluationWindow;
    private operationCount;
    constructor(fallbackStrategy?: EvictionStrategy);
    selectEvictionCandidates<T>(entries: Map<string, CacheEntry<T>>, config: AdvancedCacheConfig, targetCount: number): string[];
    onAccess<T>(entry: CacheEntry<T>): void;
    onInsert<T>(entry: CacheEntry<T>): void;
    /**
     * Evaluate current performance and adapt strategy if needed
     */
    private evaluateAndAdapt;
    /**
     * Get current strategy being used
     */
    getCurrentStrategy(): EvictionStrategy;
}
//# sourceMappingURL=EvictionPolicies.d.ts.map