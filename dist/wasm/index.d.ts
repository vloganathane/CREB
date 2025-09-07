/**
 * WebAssembly Optimization Module for CREB-JS
 * High-performance computing for critical chemistry calculations
 * Part of Q4 2025 Performance Optimization initiative
 */
export interface CREBWasmModule {
    balanceEquationMatrix(matrix: Float64Array, rows: number, cols: number): Float64Array;
    gaussianElimination(matrix: Float64Array, size: number): Float64Array;
    calculateGibbsFreeEnergy(deltaH: number, deltaS: number, temperature: number): number;
    calculateMolecularWeight(atomicNumbers: Uint8Array, counts: Uint8Array, length: number): number;
    calculateStoichiometry(coefficients: Float64Array, molecularWeights: Float64Array, targetAmount: number, targetIndex: number, length: number): Float64Array;
    malloc(size: number): number;
    free(ptr: number): void;
    memory: WebAssembly.Memory;
}
export declare class CREBWasmManager {
    private module;
    private isLoading;
    private loadPromise;
    constructor();
    /**
     * Load the WebAssembly module
     */
    loadModule(): Promise<CREBWasmModule>;
    /**
     * Check if WebAssembly is supported and module is loaded
     */
    isAvailable(): boolean;
    /**
     * Check if module is currently loading
     */
    isModuleLoading(): boolean;
    /**
     * Get the loaded module
     */
    getModule(): CREBWasmModule | null;
    /**
     * Optimized equation balancing using WebAssembly
     */
    balanceEquationOptimized(matrix: number[][], tolerance?: number): Promise<number[]>;
    /**
     * Optimized thermodynamic calculations
     */
    calculateThermodynamicsOptimized(deltaH: number, deltaS: number, temperature: number): Promise<number>;
    /**
     * Optimized molecular weight calculation
     */
    calculateMolecularWeightOptimized(formula: string): Promise<number>;
    /**
     * Optimized stoichiometric calculations
     */
    calculateStoichiometryOptimized(coefficients: number[], molecularWeights: number[], targetAmount: number, targetIndex: number): Promise<number[]>;
    /**
     * Load WebAssembly module from URL or inline
     */
    private loadWasm;
    /**
     * Create a fallback JavaScript implementation
     */
    private createFallbackModule;
    /**
     * Fallback Gaussian elimination implementation
     */
    private fallbackGaussianElimination;
    /**
     * Parse chemical formula into atomic numbers and counts
     */
    private parseFormula;
    /**
     * Get atomic number for element symbol
     */
    private getAtomicNumber;
    /**
     * Get atomic weight for atomic number
     */
    private getAtomicWeight;
}
export declare const wasmManager: CREBWasmManager;
/**
 * Performance-enhanced equation balancer
 */
export declare class WasmEquationBalancer {
    private fallbackBalancer;
    constructor(fallbackBalancer: any);
    balance(equation: string): Promise<any>;
    private balanceWithWasm;
    private parseEquationToMatrix;
    private solutionToResult;
}
/**
 * Performance monitoring for WebAssembly operations
 */
export declare class WasmPerformanceMonitor {
    private metrics;
    recordWasmCall(duration: number): void;
    recordFallbackCall(duration: number): void;
    getMetrics(): {
        wasmUsagePercent: number;
        averageWasmTime: number;
        averageFallbackTime: number;
        wasmCalls: number;
        fallbackCalls: number;
        totalTime: number;
        wasmTime: number;
        fallbackTime: number;
    };
    reset(): void;
}
export declare const wasmPerformanceMonitor: WasmPerformanceMonitor;
//# sourceMappingURL=index.d.ts.map