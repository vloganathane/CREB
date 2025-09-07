/**
 * Advanced Cache Integration Example for CREB-JS
 *
 * Demonstrates how to integrate the advanced caching system with existing
 * CREB-JS components and replace the legacy PerformanceCache.
 */
/**
 * Enhanced ThermodynamicsCalculator with advanced caching
 */
export declare class CachedThermodynamicsCalculator {
    private cache;
    constructor();
    /**
     * Calculate thermodynamic properties with caching
     */
    calculateThermodynamics(equation: string, temperature: number, pressure: number): Promise<any>;
    /**
     * Get cache performance statistics
     */
    getCacheStats(): import("./types").CacheStats;
    /**
     * Perform health check
     */
    healthCheck(): Promise<{
        healthy: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    /**
     * Shutdown and cleanup
     */
    shutdown(): void;
    private performCalculation;
    private getTTLForCalculation;
    private setupCacheMonitoring;
}
/**
 * Enhanced Chemical Database Manager with advanced caching
 */
export declare class CachedChemicalDatabase {
    private compoundCache;
    private queryCache;
    constructor();
    /**
     * Get compound data with intelligent caching
     */
    getCompound(formula: string): Promise<any>;
    /**
     * Search compounds with query result caching
     */
    searchCompounds(query: string, filters?: any): Promise<any[]>;
    /**
     * Get combined cache statistics
     */
    getCacheReport(): string;
    /**
     * Optimize cache performance based on usage patterns
     */
    optimizeCaches(): Promise<void>;
    shutdown(): void;
    private fetchCompoundFromDB;
    private performSearch;
    private isCommonCompound;
    private setupCacheOptimization;
}
/**
 * Cache-aware equation balancer
 */
export declare class CachedEquationBalancer {
    private cache;
    balanceEquation(equation: string): Promise<any>;
    /**
     * Get equations that would benefit from precomputation
     */
    getFrequentEquations(minAccess?: number): Array<{
        equation: string;
        accessCount: number;
    }>;
    precomputeFrequentEquations(): Promise<void>;
    getPerformanceReport(): string;
    shutdown(): void;
    private normalizeEquation;
    private performBalancing;
    private generateRecommendations;
}
/**
 * Multi-level cache for hierarchical data
 */
export declare class MultiLevelCache {
    private l1Cache;
    private l2Cache;
    private l3Cache;
    get(key: string): Promise<any>;
    set(key: string, value: any, level?: 'L1' | 'L2' | 'L3'): Promise<void>;
    getAggregatedStats(): {
        l1: import("./types").CacheStats;
        l2: import("./types").CacheStats;
        l3: import("./types").CacheStats;
        combined: {
            totalHits: number;
            totalMisses: number;
            totalSize: number;
            totalMemory: number;
        };
    };
    shutdown(): void;
}
/**
 * Example usage and migration guide
 */
export declare function demonstrateAdvancedCaching(): void;
export { AdvancedCache, CacheFactory } from './AdvancedCache';
export * from './types';
export * from './EvictionPolicies';
export * from './CacheMetrics';
//# sourceMappingURL=CacheIntegration.d.ts.map