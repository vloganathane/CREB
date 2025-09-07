/**
 * @fileoverview Type definitions for CREB Worker Thread System
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides comprehensive type definitions for the worker thread system,
 * enabling efficient offloading of CPU-intensive chemistry calculations.
 */
import { Worker } from 'worker_threads';
/**
 * Priority levels for task queue management
 */
export declare enum TaskPriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 3
}
/**
 * Task status tracking
 */
export declare enum TaskStatus {
    PENDING = "pending",
    QUEUED = "queued",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    TIMEOUT = "timeout"
}
/**
 * Worker status tracking
 */
export declare enum WorkerStatus {
    IDLE = "idle",
    BUSY = "busy",
    ERROR = "error",
    TERMINATED = "terminated",
    STARTING = "starting"
}
/**
 * Chemistry calculation types
 */
export declare enum CalculationType {
    EQUATION_BALANCING = "equation_balancing",
    THERMODYNAMICS = "thermodynamics",
    STOICHIOMETRY = "stoichiometry",
    BATCH_ANALYSIS = "batch_analysis",
    MATRIX_SOLVING = "matrix_solving",
    COMPOUND_ANALYSIS = "compound_analysis"
}
/**
 * Base task interface for all worker tasks
 */
export interface WorkerTask<TData = any, TResult = any> {
    readonly id: string;
    readonly type: CalculationType;
    readonly data: TData;
    readonly priority: TaskPriority;
    readonly createdAt: Date;
    readonly timeout?: number;
    readonly retryAttempts?: number;
    readonly metadata?: Record<string, any>;
}
/**
 * Task execution context and progress tracking
 */
export interface TaskExecution<TResult = any> {
    readonly taskId: string;
    readonly workerId: string;
    readonly startedAt: Date;
    completedAt?: Date;
    status: TaskStatus;
    result?: TResult;
    error?: WorkerError;
    progress?: number;
    memoryUsage?: number;
    cpuTime?: number;
}
/**
 * Task result wrapper
 */
export interface TaskResult<TResult = any> {
    readonly taskId: string;
    readonly success: boolean;
    readonly result?: TResult;
    readonly error?: WorkerError;
    readonly executionTime: number;
    readonly memoryUsage: number;
    readonly metadata?: Record<string, any>;
}
/**
 * Equation balancing task data
 */
export interface EquationBalancingTask {
    equation: string;
    options?: {
        method?: 'gauss' | 'algebraic' | 'matrix';
        maxIterations?: number;
        tolerance?: number;
    };
}
/**
 * Thermodynamics calculation task data
 */
export interface ThermodynamicsTask {
    compounds: Array<{
        formula: string;
        amount: number;
        state?: 'solid' | 'liquid' | 'gas';
    }>;
    conditions: {
        temperature?: number;
        pressure?: number;
        volume?: number;
    };
    calculations: string[];
}
/**
 * Batch analysis task data
 */
export interface BatchAnalysisTask {
    compounds: string[];
    properties: string[];
    options?: {
        includeIsomers?: boolean;
        includeSpectroscopy?: boolean;
        dataProvider?: string;
    };
}
/**
 * Matrix solving task data
 */
export interface MatrixSolvingTask {
    matrix: number[][];
    vector?: number[];
    method?: 'gaussian' | 'lu' | 'qr' | 'svd';
    options?: {
        tolerance?: number;
        maxIterations?: number;
        pivoting?: boolean;
    };
}
/**
 * Worker instance configuration
 */
export interface WorkerConfig {
    readonly id: string;
    readonly scriptPath: string;
    readonly maxMemory: number;
    readonly maxCpuTime: number;
    readonly idleTimeout: number;
    readonly env?: Record<string, string>;
    readonly execArgv?: string[];
}
/**
 * Worker instance state
 */
export interface WorkerInstance {
    readonly id: string;
    readonly config: WorkerConfig;
    readonly worker: Worker;
    status: WorkerStatus;
    currentTask?: string;
    createdAt: Date;
    lastUsed: Date;
    tasksCompleted: number;
    totalExecutionTime: number;
    currentMemoryUsage: number;
    peakMemoryUsage: number;
    errorCount: number;
    lastError?: WorkerError;
}
/**
 * Worker pool configuration
 */
export interface WorkerPoolConfig {
    readonly minWorkers: number;
    readonly maxWorkers: number;
    readonly idleTimeout: number;
    readonly taskTimeout: number;
    readonly maxRetries: number;
    readonly memoryLimit: number;
    readonly cpuTimeLimit: number;
    readonly loadBalancing: 'round-robin' | 'least-busy' | 'random';
    readonly autoScale: boolean;
    readonly scalingThreshold: number;
}
/**
 * Task queue configuration
 */
export interface TaskQueueConfig {
    readonly maxSize: number;
    readonly priorityLevels: number;
    readonly timeoutCleanupInterval: number;
    readonly persistToDisk: boolean;
    readonly queuePath?: string;
}
/**
 * Queue statistics
 */
export interface QueueStats {
    readonly totalTasks: number;
    readonly pendingTasks: number;
    readonly runningTasks: number;
    readonly completedTasks: number;
    readonly failedTasks: number;
    readonly averageWaitTime: number;
    readonly averageExecutionTime: number;
    readonly throughput: number;
    readonly queueLength: number;
    readonly priorityBreakdown: Record<TaskPriority, number>;
}
/**
 * Worker-specific error types
 */
export interface WorkerError extends Error {
    readonly type: 'timeout' | 'memory' | 'crash' | 'validation' | 'runtime';
    readonly workerId?: string;
    readonly taskId?: string;
    readonly timestamp: Date;
    readonly memoryUsage?: number;
    readonly cpuTime?: number;
    readonly stackTrace?: string;
    readonly context?: Record<string, any>;
}
/**
 * Recovery strategy configuration
 */
export interface RecoveryConfig {
    readonly maxRetries: number;
    readonly retryDelay: number;
    readonly exponentialBackoff: boolean;
    readonly restartWorkerOnError: boolean;
    readonly isolateFailedTasks: boolean;
    readonly fallbackToMainThread: boolean;
}
/**
 * Worker pool metrics
 */
export interface WorkerPoolMetrics {
    readonly poolSize: number;
    readonly activeWorkers: number;
    readonly idleWorkers: number;
    readonly totalTasksProcessed: number;
    readonly averageTaskTime: number;
    readonly peakMemoryUsage: number;
    readonly totalCpuTime: number;
    readonly errorRate: number;
    readonly throughput: number;
    readonly efficiency: number;
    readonly queueHealth: QueueStats;
    readonly workerHealth: WorkerHealthMetrics[];
}
/**
 * Individual worker health metrics
 */
export interface WorkerHealthMetrics {
    readonly workerId: string;
    readonly status: WorkerStatus;
    readonly uptime: number;
    readonly tasksCompleted: number;
    readonly averageTaskTime: number;
    readonly memoryUsage: number;
    readonly cpuUsage: number;
    readonly errorCount: number;
    readonly efficiency: number;
    readonly lastActivity: Date;
}
/**
 * Worker pool events
 */
export interface WorkerPoolEvents {
    'worker-created': (worker: WorkerInstance) => void;
    'worker-terminated': (workerId: string, reason: string) => void;
    'worker-error': (error: WorkerError) => void;
    'task-queued': (task: WorkerTask) => void;
    'task-started': (execution: TaskExecution) => void;
    'task-completed': (result: TaskResult) => void;
    'task-failed': (error: WorkerError) => void;
    'pool-scaled': (oldSize: number, newSize: number) => void;
    'metrics-updated': (metrics: WorkerPoolMetrics) => void;
}
/**
 * Message types for worker communication
 */
export declare enum MessageType {
    TASK_ASSIGNMENT = "task_assignment",
    TASK_RESULT = "task_result",
    TASK_ERROR = "task_error",
    TASK_PROGRESS = "task_progress",
    WORKER_READY = "worker_ready",
    WORKER_SHUTDOWN = "worker_shutdown",
    HEALTH_CHECK = "health_check",
    MEMORY_WARNING = "memory_warning"
}
/**
 * Worker message interface
 */
export interface WorkerMessage<TData = any> {
    readonly type: MessageType;
    readonly taskId?: string;
    readonly data: TData;
    readonly timestamp: Date;
    readonly correlationId?: string;
}
/**
 * Performance benchmark results
 */
export interface PerformanceBenchmark {
    readonly operation: string;
    readonly dataSize: number;
    readonly singleThreadTime: number;
    readonly multiThreadTime: number;
    readonly speedup: number;
    readonly efficiency: number;
    readonly memoryOverhead: number;
    readonly optimalWorkerCount: number;
}
/**
 * Worker factory configuration
 */
export interface WorkerFactory {
    createWorker(config: WorkerConfig): Promise<WorkerInstance>;
    destroyWorker(workerId: string): Promise<void>;
    validateConfig(config: WorkerConfig): boolean;
    getDefaultConfig(): WorkerConfig;
}
/**
 * Task builder for fluent API
 */
export interface TaskBuilder<TData = any> {
    withId(id: string): TaskBuilder<TData>;
    withType(type: CalculationType): TaskBuilder<TData>;
    withData(data: TData): TaskBuilder<TData>;
    withPriority(priority: TaskPriority): TaskBuilder<TData>;
    withTimeout(timeout: number): TaskBuilder<TData>;
    withRetries(retries: number): TaskBuilder<TData>;
    withMetadata(metadata: Record<string, any>): TaskBuilder<TData>;
    build(): WorkerTask<TData>;
}
/**
 * Type guard for worker tasks
 */
export declare function isWorkerTask(obj: any): obj is WorkerTask;
/**
 * Type guard for task results
 */
export declare function isTaskResult(obj: any): obj is TaskResult;
/**
 * Type guard for worker errors
 */
export declare function isWorkerError(obj: any): obj is WorkerError;
export type WorkerId = string & {
    readonly __brand: 'WorkerId';
};
export type TaskId = string & {
    readonly __brand: 'TaskId';
};
export type CorrelationId = string & {
    readonly __brand: 'CorrelationId';
};
/**
 * Create a branded worker ID
 */
export declare function createWorkerId(id: string): WorkerId;
/**
 * Create a branded task ID
 */
export declare function createTaskId(id: string): TaskId;
/**
 * Create a branded correlation ID
 */
export declare function createCorrelationId(id: string): CorrelationId;
//# sourceMappingURL=types.d.ts.map