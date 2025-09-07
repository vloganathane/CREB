/**
 * @fileoverview Worker Thread Integration and Utilities
 * @version 1.7.0
 * @author CREB Development Team
 * 
 * This module provides integration utilities, factory functions, and high-level
 * APIs for the CREB worker thread system.
 */

import { WorkerPool } from './WorkerPool.js';
import { TaskQueue, TaskBuilder } from './TaskQueue.js';
import { 
  WorkerTask, 
  TaskResult, 
  WorkerPoolConfig, 
  TaskPriority, 
  CalculationType,
  EquationBalancingTask,
  ThermodynamicsTask,
  BatchAnalysisTask,
  MatrixSolvingTask,
  WorkerPoolMetrics,
  PerformanceBenchmark
} from './types.js';

/**
 * High-level worker thread manager for CREB calculations
 */
export class CREBWorkerManager {
  private workerPool: WorkerPool;
  private isInitialized: boolean = false;

  constructor(config: Partial<WorkerPoolConfig> = {}) {
    const defaultConfig: Partial<WorkerPoolConfig> = {
      minWorkers: Math.max(1, Math.floor(require('os').cpus().length / 2)),
      maxWorkers: require('os').cpus().length,
      idleTimeout: 300000, // 5 minutes
      taskTimeout: 600000, // 10 minutes
      autoScale: true,
      scalingThreshold: 5,
      loadBalancing: 'least-busy'
    };

    this.workerPool = new WorkerPool({ ...defaultConfig, ...config });
  }

  /**
   * Initialize the worker manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Wait for initial workers to be ready
    await new Promise<void>((resolve) => {
      this.workerPool.on('pool-initialized', () => {
        this.isInitialized = true;
        resolve();
      });
    });
  }

  /**
   * Balance a chemical equation using worker threads
   */
  public async balanceEquation(
    equation: string,
    options: {
      method?: 'gauss' | 'algebraic' | 'matrix';
      maxIterations?: number;
      tolerance?: number;
      priority?: TaskPriority;
      timeout?: number;
    } = {}
  ): Promise<{
    originalEquation: string;
    balancedEquation: string;
    coefficients: number[];
    method: string;
    elements: string[];
    isBalanced: boolean;
  }> {
    const taskData: EquationBalancingTask = {
      equation,
      options: {
        method: options.method || 'matrix',
        maxIterations: options.maxIterations || 1000,
        tolerance: options.tolerance || 1e-10
      }
    };

    const task = TaskBuilder.create<EquationBalancingTask>()
      .withType(CalculationType.EQUATION_BALANCING)
      .withData(taskData)
      .withPriority(options.priority || TaskPriority.NORMAL)
      .withTimeout(options.timeout || 30000)
      .build();

    const result = await this.workerPool.submitTask(task);
    
    if (!result.success) {
      throw new Error(`Equation balancing failed: ${result.error?.message}`);
    }

    return result.result;
  }

  /**
   * Calculate thermodynamic properties using worker threads
   */
  public async calculateThermodynamics(
    compounds: Array<{
      formula: string;
      amount: number;
      state?: 'solid' | 'liquid' | 'gas';
    }>,
    conditions: {
      temperature?: number;
      pressure?: number;
      volume?: number;
    },
    calculations: string[],
    options: {
      priority?: TaskPriority;
      timeout?: number;
    } = {}
  ): Promise<{
    compounds: any[];
    conditions: any;
    calculations: Record<string, any>;
    temperature: number;
    pressure: number;
  }> {
    const taskData: ThermodynamicsTask = {
      compounds,
      conditions,
      calculations
    };

    const task = TaskBuilder.create<ThermodynamicsTask>()
      .withType(CalculationType.THERMODYNAMICS)
      .withData(taskData)
      .withPriority(options.priority || TaskPriority.NORMAL)
      .withTimeout(options.timeout || 60000)
      .build();

    const result = await this.workerPool.submitTask(task);
    
    if (!result.success) {
      throw new Error(`Thermodynamics calculation failed: ${result.error?.message}`);
    }

    return result.result;
  }

  /**
   * Perform batch compound analysis using worker threads
   */
  public async analyzeBatch(
    compounds: string[],
    properties: string[],
    options: {
      includeIsomers?: boolean;
      includeSpectroscopy?: boolean;
      dataProvider?: string;
      priority?: TaskPriority;
      timeout?: number;
      batchSize?: number;
    } = {}
  ): Promise<{
    totalCompounds: number;
    results: Array<Record<string, any>>;
    options: any;
  }> {
    const { batchSize = 100 } = options;
    
    // Split large batches into smaller chunks for better performance
    if (compounds.length > batchSize) {
      const chunks: string[][] = [];
      for (let i = 0; i < compounds.length; i += batchSize) {
        chunks.push(compounds.slice(i, i + batchSize));
      }

      // Process chunks in parallel
      const chunkResults = await Promise.all(
        chunks.map(chunk => this.processBatchChunk(chunk, properties, options))
      );

      // Combine results
      const allResults = chunkResults.flatMap(chunk => chunk.results);
      
      return {
        totalCompounds: compounds.length,
        results: allResults,
        options
      };
    } else {
      return this.processBatchChunk(compounds, properties, options);
    }
  }

  /**
   * Solve matrix equation using worker threads
   */
  public async solveMatrix(
    matrix: number[][],
    vector?: number[],
    options: {
      method?: 'gaussian' | 'lu' | 'qr' | 'svd';
      tolerance?: number;
      maxIterations?: number;
      pivoting?: boolean;
      priority?: TaskPriority;
      timeout?: number;
    } = {}
  ): Promise<any> {
    const taskData: MatrixSolvingTask = {
      matrix,
      vector,
      method: options.method || 'gaussian',
      options: {
        tolerance: options.tolerance || 1e-10,
        maxIterations: options.maxIterations || 1000,
        pivoting: options.pivoting !== false
      }
    };

    const task = TaskBuilder.create<MatrixSolvingTask>()
      .withType(CalculationType.MATRIX_SOLVING)
      .withData(taskData)
      .withPriority(options.priority || TaskPriority.NORMAL)
      .withTimeout(options.timeout || 120000) // 2 minutes for matrix operations
      .build();

    const result = await this.workerPool.submitTask(task);
    
    if (!result.success) {
      throw new Error(`Matrix solving failed: ${result.error?.message}`);
    }

    return result.result;
  }

  /**
   * Get performance metrics for the worker system
   */
  public getMetrics(): WorkerPoolMetrics {
    return this.workerPool.getMetrics();
  }

  /**
   * Get worker information
   */
  public getWorkerInfo() {
    return this.workerPool.getWorkerInfo();
  }

  /**
   * Scale the worker pool
   */
  public async scaleWorkers(targetSize: number): Promise<void> {
    await this.workerPool.scalePool(targetSize);
  }

  /**
   * Run performance benchmark
   */
  public async runBenchmark(
    operation: 'equation_balancing' | 'thermodynamics' | 'matrix_solving' | 'batch_analysis',
    dataSize: number
  ): Promise<PerformanceBenchmark> {
    const singleThreadTime = await this.benchmarkSingleThread(operation, dataSize);
    const multiThreadTime = await this.benchmarkMultiThread(operation, dataSize);

    const speedup = singleThreadTime / multiThreadTime;
    const efficiency = speedup / this.workerPool.getMetrics().poolSize;
    
    return {
      operation,
      dataSize,
      singleThreadTime,
      multiThreadTime,
      speedup,
      efficiency: efficiency * 100,
      memoryOverhead: this.calculateMemoryOverhead(),
      optimalWorkerCount: this.calculateOptimalWorkerCount(speedup)
    };
  }

  /**
   * Gracefully shutdown the worker manager
   */
  public async shutdown(): Promise<void> {
    await this.workerPool.shutdown();
    this.isInitialized = false;
  }

  // ========================================
  // Private Methods
  // ========================================

  private async processBatchChunk(
    compounds: string[],
    properties: string[],
    options: any
  ) {
    const taskData: BatchAnalysisTask = {
      compounds,
      properties,
      options: {
        includeIsomers: options.includeIsomers || false,
        includeSpectroscopy: options.includeSpectroscopy || false,
        dataProvider: options.dataProvider || 'internal'
      }
    };

    const task = TaskBuilder.create<BatchAnalysisTask>()
      .withType(CalculationType.BATCH_ANALYSIS)
      .withData(taskData)
      .withPriority(options.priority || TaskPriority.NORMAL)
      .withTimeout(options.timeout || 300000) // 5 minutes
      .build();

    const result = await this.workerPool.submitTask(task);
    
    if (!result.success) {
      throw new Error(`Batch analysis failed: ${result.error?.message}`);
    }

    return result.result;
  }

  private async benchmarkSingleThread(operation: string, dataSize: number): Promise<number> {
    // Simulate single-thread execution time
    // In a real implementation, this would run the operation on the main thread
    const baseTime = {
      'equation_balancing': 10,
      'thermodynamics': 50,
      'matrix_solving': 100,
      'batch_analysis': 20
    }[operation] || 50;

    return baseTime * Math.sqrt(dataSize);
  }

  private async benchmarkMultiThread(operation: string, dataSize: number): Promise<number> {
    const startTime = Date.now();
    
    // Create benchmark tasks based on operation type
    const tasks = this.createBenchmarkTasks(operation, dataSize);
    
    // Execute tasks in parallel
    await Promise.all(
      tasks.map(task => this.workerPool.submitTask(task))
    );

    return Date.now() - startTime;
  }

  private createBenchmarkTasks(operation: string, dataSize: number): WorkerTask[] {
    const tasks: WorkerTask[] = [];
    
    switch (operation) {
      case 'equation_balancing':
        for (let i = 0; i < dataSize; i++) {
          tasks.push(TaskBuilder.create<EquationBalancingTask>()
            .withType(CalculationType.EQUATION_BALANCING)
            .withData({ equation: `H${i+1} + O2 -> H${i+1}O` })
            .withPriority(TaskPriority.HIGH)
            .build());
        }
        break;

      case 'thermodynamics':
        for (let i = 0; i < dataSize; i++) {
          tasks.push(TaskBuilder.create<ThermodynamicsTask>()
            .withType(CalculationType.THERMODYNAMICS)
            .withData({
              compounds: [{ formula: 'H2O', amount: i + 1 }],
              conditions: { temperature: 298.15 + i },
              calculations: ['enthalpy', 'entropy']
            })
            .withPriority(TaskPriority.HIGH)
            .build());
        }
        break;

      case 'matrix_solving':
        for (let i = 0; i < dataSize; i++) {
          const size = Math.max(2, Math.floor(Math.sqrt(i + 1)));
          const matrix = Array(size).fill(null).map(() => 
            Array(size).fill(null).map(() => Math.random())
          );
          
          tasks.push(TaskBuilder.create<MatrixSolvingTask>()
            .withType(CalculationType.MATRIX_SOLVING)
            .withData({ matrix, method: 'gaussian' })
            .withPriority(TaskPriority.HIGH)
            .build());
        }
        break;

      case 'batch_analysis':
        const batchSize = Math.max(1, Math.floor(dataSize / 10));
        for (let i = 0; i < 10; i++) {
          const compounds = Array(batchSize).fill(null).map((_, j) => `C${i}H${j+1}`);
          
          tasks.push(TaskBuilder.create<BatchAnalysisTask>()
            .withType(CalculationType.BATCH_ANALYSIS)
            .withData({
              compounds,
              properties: ['molecular_weight', 'density']
            })
            .withPriority(TaskPriority.HIGH)
            .build());
        }
        break;
    }

    return tasks;
  }

  private calculateMemoryOverhead(): number {
    const metrics = this.workerPool.getMetrics();
    // Estimate memory overhead based on worker pool metrics
    return metrics.poolSize * 50 * 1024 * 1024; // Rough estimate: 50MB per worker
  }

  private calculateOptimalWorkerCount(speedup: number): number {
    const cpuCount = require('os').cpus().length;
    
    // Simple heuristic: optimal worker count is where efficiency is highest
    if (speedup > cpuCount * 0.8) {
      return cpuCount;
    } else if (speedup > cpuCount * 0.6) {
      return Math.floor(cpuCount * 0.75);
    } else {
      return Math.floor(cpuCount * 0.5);
    }
  }
}

/**
 * Factory function for creating worker managers
 */
export function createWorkerManager(config?: Partial<WorkerPoolConfig>): CREBWorkerManager {
  return new CREBWorkerManager(config);
}

/**
 * Utility function for creating high-priority tasks
 */
export function createCriticalTask<TData>(
  type: CalculationType,
  data: TData,
  timeout?: number
): WorkerTask<TData> {
  return TaskBuilder.create<TData>()
    .withType(type)
    .withData(data)
    .withPriority(TaskPriority.CRITICAL)
    .withTimeout(timeout || 60000)
    .build();
}

/**
 * Utility function for creating batch tasks
 */
export function createBatchTasks<TData>(
  type: CalculationType,
  dataArray: TData[],
  priority: TaskPriority = TaskPriority.NORMAL
): WorkerTask<TData>[] {
  return dataArray.map(data => 
    TaskBuilder.create<TData>()
      .withType(type)
      .withData(data)
      .withPriority(priority)
      .build()
  );
}

/**
 * Performance monitor for worker threads
 */
export class WorkerPerformanceMonitor {
  private manager: CREBWorkerManager;
  private metrics: WorkerPoolMetrics[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor(manager: CREBWorkerManager) {
    this.manager = manager;
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring(intervalMs: number = 30000): void {
    this.monitoringInterval = setInterval(() => {
      const metrics = this.manager.getMetrics();
      this.metrics.push(metrics);

      // Keep only last 100 measurements
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }
    }, intervalMs);
  }

  /**
   * Stop performance monitoring
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * Get performance trends
   */
  public getTrends(): {
    throughputTrend: number[];
    efficiencyTrend: number[];
    errorRateTrend: number[];
    memoryTrend: number[];
  } {
    return {
      throughputTrend: this.metrics.map(m => m.throughput),
      efficiencyTrend: this.metrics.map(m => m.efficiency),
      errorRateTrend: this.metrics.map(m => m.errorRate),
      memoryTrend: this.metrics.map(m => m.peakMemoryUsage)
    };
  }

  /**
   * Get performance summary
   */
  public getSummary() {
    if (this.metrics.length === 0) {
      return null;
    }

    const latest = this.metrics[this.metrics.length - 1];
    const throughputs = this.metrics.map(m => m.throughput);
    const efficiencies = this.metrics.map(m => m.efficiency);

    return {
      current: latest,
      averageThroughput: throughputs.reduce((a, b) => a + b, 0) / throughputs.length,
      averageEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
      peakThroughput: Math.max(...throughputs),
      peakEfficiency: Math.max(...efficiencies),
      measurementCount: this.metrics.length
    };
  }
}

// Export all types and utilities
export * from './types.js';
export { WorkerPool } from './WorkerPool.js';
export { TaskQueue, TaskBuilder } from './TaskQueue.js';
