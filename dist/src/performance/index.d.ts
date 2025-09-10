/**
 * Performance Optimizations Module for CREB-JS
 * Implements WebAssembly calculations, lazy loading, memory management, and caching
 */
declare class PerformanceCache {
    private static instance;
    private equationCache;
    private thermodynamicsCache;
    private kineticsCache;
    private maxCacheSize;
    private cacheHits;
    private cacheMisses;
    private constructor();
    static getInstance(): PerformanceCache;
    /**
     * Get cached result with automatic cleanup
     */
    get<T>(key: string, category: 'equation' | 'thermodynamics' | 'kinetics'): T | null;
    /**
     * Set cached result with automatic memory management
     */
    set<T>(key: string, value: T, category: 'equation' | 'thermodynamics' | 'kinetics'): void;
    /**
     * Clear specific cache or all caches
     */
    clear(category?: 'equation' | 'thermodynamics' | 'kinetics'): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        hits: number;
        misses: number;
        hitRate: number;
        sizes: {
            equation: number;
            thermodynamics: number;
            kinetics: number;
            total: number;
        };
    };
    private getCache;
}
declare class MemoryManager {
    private static weakRefs;
    private static cleanupInterval;
    /**
     * Register object for memory monitoring
     */
    static register<T extends object>(obj: T): T;
    /**
     * Force garbage collection cleanup
     */
    static cleanup(): void;
    /**
     * Get memory usage statistics
     */
    static getStats(): {
        trackedObjects: number;
        memoryUsage: any;
    };
    private static startCleanup;
    private static getMemoryUsage;
}
declare class LazyLoader {
    private static loadedModules;
    private static loadingPromises;
    /**
     * Lazily load module with caching
     */
    static load<T>(moduleName: string, loader: () => Promise<T>): Promise<T>;
    /**
     * Check if module is loaded
     */
    static isLoaded(moduleName: string): boolean;
    /**
     * Preload modules in background
     */
    static preload(modules: Array<{
        name: string;
        loader: () => Promise<any>;
    }>): Promise<void>;
    /**
     * Get loading statistics
     */
    static getStats(): {
        loadedModules: string[];
        loadingModules: string[];
        totalLoaded: number;
        currentlyLoading: number;
    };
    /**
     * Clear all loaded modules (for testing)
     */
    static clear(): void;
}
declare class WebAssemblyCalculator {
    private static wasmModule;
    private static initialized;
    /**
     * Initialize WebAssembly module
     */
    static initialize(): Promise<void>;
    /**
     * Check if WebAssembly is available
     */
    static isAvailable(): boolean;
    /**
     * Fast matrix operations using WebAssembly
     */
    static calculateMatrix(matrix: number[][]): Promise<number[][]>;
    /**
     * Fast linear system solving
     */
    static solveLinearSystem(coefficients: number[][], constants: number[]): Promise<number[]>;
    /**
     * Fast equation balancing
     */
    static balanceEquation(equation: string): Promise<number[]>;
    private static simulateWasmBalance;
    private static simulateWasmMatrix;
    private static simulateWasmLinear;
}
declare class PerformanceMonitor {
    private static measurements;
    /**
     * Start timing a operation
     */
    static startTiming(operation: string): () => number;
    /**
     * Measure async operation
     */
    static measureAsync<T>(operation: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Measure sync operation
     */
    static measure<T>(operation: string, fn: () => T): T;
    /**
     * Get performance statistics
     */
    static getStats(operation?: string): Record<string, any> | {
        operation: string;
        count: number;
        average?: undefined;
        median?: undefined;
        min?: undefined;
        max?: undefined;
        p95?: undefined;
        p99?: undefined;
    } | {
        operation: string;
        count: number;
        average: number;
        median: number;
        min: number;
        max: number;
        p95: number;
        p99: number;
    };
    /**
     * Clear measurements
     */
    static clear(operation?: string): void;
    private static recordMeasurement;
    private static calculateStats;
}
interface OptimizedBalanceResult {
    coefficients: number[];
    balanced: string;
    fromCache: boolean;
    calculationTime: number;
}
declare class OptimizedBalancer {
    private cache;
    private wasmInitialized;
    constructor();
    private initializeWasm;
    /**
     * High-performance equation balancing with caching and WASM
     */
    balance(equation: string): Promise<OptimizedBalanceResult>;
    /**
     * JavaScript fallback for equation balancing
     */
    private balanceWithJavaScript;
    /**
     * Format balanced equation with coefficients
     */
    private formatBalancedEquation;
    /**
     * Get balancer statistics
     */
    getStats(): {
        cache: import("./cache/types").CacheStats;
        performance: Record<string, any> | {
            operation: string;
            count: number;
            average?: undefined;
            median?: undefined;
            min?: undefined;
            max?: undefined;
            p95?: undefined;
            p99?: undefined;
        } | {
            operation: string;
            count: number;
            average: number;
            median: number;
            min: number;
            max: number;
            p95: number;
            p99: number;
        };
        wasmAvailable: boolean;
    };
}
export { PerformanceCache, MemoryManager, LazyLoader, WebAssemblyCalculator, PerformanceMonitor, OptimizedBalancer };
export { AdvancedCache, CacheFactory, CachedThermodynamicsCalculator, CachedChemicalDatabase, CachedEquationBalancer, MultiLevelCache } from './cache/CacheIntegration';
//# sourceMappingURL=index.d.ts.map