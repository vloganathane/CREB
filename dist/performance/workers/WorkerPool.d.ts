/**
 * @fileoverview Worker Pool Manager for CREB Chemistry Calculations
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides a sophisticated worker pool for managing multiple worker threads,
 * distributing tasks efficiently, and monitoring performance metrics.
 */
import { EventEmitter } from 'events';
import { WorkerPoolConfig, WorkerTask, TaskResult, WorkerStatus, WorkerPoolMetrics, RecoveryConfig } from './types';
/**
 * Advanced worker pool with load balancing and health monitoring
 */
export declare class WorkerPool extends EventEmitter {
    private readonly config;
    private readonly recoveryConfig;
    private readonly workers;
    private readonly taskQueue;
    private readonly activeExecutions;
    private readonly workerScriptPath;
    private isShuttingDown;
    private nextWorkerId;
    private metricsInterval?;
    private healthCheckInterval?;
    private readonly startTime;
    constructor(config?: Partial<WorkerPoolConfig>, recoveryConfig?: Partial<RecoveryConfig>);
    /**
     * Submit a task to the worker pool
     */
    submitTask<TData = any, TResult = any>(task: WorkerTask<TData>): Promise<TaskResult<TResult>>;
    /**
     * Get current pool metrics
     */
    getMetrics(): WorkerPoolMetrics;
    /**
     * Scale the worker pool
     */
    scalePool(targetSize: number): Promise<void>;
    /**
     * Get detailed worker information
     */
    getWorkerInfo(): Array<{
        id: string;
        status: WorkerStatus;
        uptime: number;
        tasksCompleted: number;
        memoryUsage: number;
        currentTask?: string;
    }>;
    /**
     * Gracefully shutdown the worker pool
     */
    shutdown(): Promise<void>;
    private setupEventHandlers;
    private initializeWorkerPool;
    private createWorker;
    private setupWorkerEventHandlers;
    private handleWorkerMessage;
    private handleTaskResult;
    private handleTaskError;
    private handleTaskProgress;
    private handleMemoryWarning;
    private handleHealthCheckResponse;
    private handleWorkerError;
    private handleWorkerExit;
    private processQueuedTasks;
    private hasAvailableWorkers;
    private selectWorker;
    private assignTaskToWorker;
    private shouldScaleUp;
    private restartWorker;
    private terminateWorker;
    private handleTaskTimeout;
    private handleErrorRecovery;
    private calculateThroughput;
    private calculateEfficiency;
    private getWorkerHealth;
    private waitForActiveTasks;
    private startHealthMonitoring;
    private performHealthChecks;
}
//# sourceMappingURL=WorkerPool.d.ts.map