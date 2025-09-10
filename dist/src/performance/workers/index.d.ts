/**
 * @fileoverview Worker Thread Integration and Utilities
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides integration utilities, factory functions, and high-level
 * APIs for the CREB worker thread system.
 */
import { WorkerTask, WorkerPoolConfig, TaskPriority, CalculationType, WorkerPoolMetrics, PerformanceBenchmark } from './types.js';
/**
 * High-level worker thread manager for CREB calculations
 */
export declare class CREBWorkerManager {
    private workerPool;
    private isInitialized;
    constructor(config?: Partial<WorkerPoolConfig>);
    /**
     * Initialize the worker manager
     */
    initialize(): Promise<void>;
    /**
     * Balance a chemical equation using worker threads
     */
    balanceEquation(equation: string, options?: {
        method?: 'gauss' | 'algebraic' | 'matrix';
        maxIterations?: number;
        tolerance?: number;
        priority?: TaskPriority;
        timeout?: number;
    }): Promise<{
        originalEquation: string;
        balancedEquation: string;
        coefficients: number[];
        method: string;
        elements: string[];
        isBalanced: boolean;
    }>;
    /**
     * Calculate thermodynamic properties using worker threads
     */
    calculateThermodynamics(compounds: Array<{
        formula: string;
        amount: number;
        state?: 'solid' | 'liquid' | 'gas';
    }>, conditions: {
        temperature?: number;
        pressure?: number;
        volume?: number;
    }, calculations: string[], options?: {
        priority?: TaskPriority;
        timeout?: number;
    }): Promise<{
        compounds: any[];
        conditions: any;
        calculations: Record<string, any>;
        temperature: number;
        pressure: number;
    }>;
    /**
     * Perform batch compound analysis using worker threads
     */
    analyzeBatch(compounds: string[], properties: string[], options?: {
        includeIsomers?: boolean;
        includeSpectroscopy?: boolean;
        dataProvider?: string;
        priority?: TaskPriority;
        timeout?: number;
        batchSize?: number;
    }): Promise<{
        totalCompounds: number;
        results: Array<Record<string, any>>;
        options: any;
    }>;
    /**
     * Solve matrix equation using worker threads
     */
    solveMatrix(matrix: number[][], vector?: number[], options?: {
        method?: 'gaussian' | 'lu' | 'qr' | 'svd';
        tolerance?: number;
        maxIterations?: number;
        pivoting?: boolean;
        priority?: TaskPriority;
        timeout?: number;
    }): Promise<any>;
    /**
     * Get performance metrics for the worker system
     */
    getMetrics(): WorkerPoolMetrics;
    /**
     * Get worker information
     */
    getWorkerInfo(): {
        id: string;
        status: import("./types.js").WorkerStatus;
        uptime: number;
        tasksCompleted: number;
        memoryUsage: number;
        currentTask?: string;
    }[];
    /**
     * Scale the worker pool
     */
    scaleWorkers(targetSize: number): Promise<void>;
    /**
     * Run performance benchmark
     */
    runBenchmark(operation: 'equation_balancing' | 'thermodynamics' | 'matrix_solving' | 'batch_analysis', dataSize: number): Promise<PerformanceBenchmark>;
    /**
     * Gracefully shutdown the worker manager
     */
    shutdown(): Promise<void>;
    private processBatchChunk;
    private benchmarkSingleThread;
    private benchmarkMultiThread;
    private createBenchmarkTasks;
    private calculateMemoryOverhead;
    private calculateOptimalWorkerCount;
}
/**
 * Factory function for creating worker managers
 */
export declare function createWorkerManager(config?: Partial<WorkerPoolConfig>): CREBWorkerManager;
/**
 * Utility function for creating high-priority tasks
 */
export declare function createCriticalTask<TData>(type: CalculationType, data: TData, timeout?: number): WorkerTask<TData>;
/**
 * Utility function for creating batch tasks
 */
export declare function createBatchTasks<TData>(type: CalculationType, dataArray: TData[], priority?: TaskPriority): WorkerTask<TData>[];
/**
 * Performance monitor for worker threads
 */
export declare class WorkerPerformanceMonitor {
    private manager;
    private metrics;
    private monitoringInterval?;
    constructor(manager: CREBWorkerManager);
    /**
     * Start performance monitoring
     */
    startMonitoring(intervalMs?: number): void;
    /**
     * Stop performance monitoring
     */
    stopMonitoring(): void;
    /**
     * Get performance trends
     */
    getTrends(): {
        throughputTrend: number[];
        efficiencyTrend: number[];
        errorRateTrend: number[];
        memoryTrend: number[];
    };
    /**
     * Get performance summary
     */
    getSummary(): {
        current: WorkerPoolMetrics;
        averageThroughput: number;
        averageEfficiency: number;
        peakThroughput: number;
        peakEfficiency: number;
        measurementCount: number;
    } | null;
}
export * from './types.js';
export { WorkerPool } from './WorkerPool.js';
export { TaskQueue, TaskBuilder } from './TaskQueue.js';
//# sourceMappingURL=index.d.ts.map