/**
 * @fileoverview Worker Pool Manager for CREB Chemistry Calculations
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides a sophisticated worker pool for managing multiple worker threads,
 * distributing tasks efficiently, and monitoring performance metrics.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WorkerStatus, TaskStatus, MessageType, createWorkerId } from './types';
import { TaskQueue } from './TaskQueue';
import { SystemError, ValidationError } from '../../core/errors/CREBError';
import { Injectable } from '../../core/decorators/Injectable';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Advanced worker pool with load balancing and health monitoring
 */
let WorkerPool = class WorkerPool extends EventEmitter {
    constructor(config = {}, recoveryConfig = {}) {
        super();
        this.isShuttingDown = false;
        this.nextWorkerId = 1;
        this.config = {
            minWorkers: 2,
            maxWorkers: Math.max(4, require('os').cpus().length),
            idleTimeout: 300000, // 5 minutes
            taskTimeout: 300000, // 5 minutes
            maxRetries: 3,
            memoryLimit: 512 * 1024 * 1024, // 512MB
            cpuTimeLimit: 600000, // 10 minutes
            loadBalancing: 'least-busy',
            autoScale: true,
            scalingThreshold: 5,
            ...config
        };
        this.recoveryConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            exponentialBackoff: true,
            restartWorkerOnError: true,
            isolateFailedTasks: true,
            fallbackToMainThread: false,
            ...recoveryConfig
        };
        this.workers = new Map();
        this.activeExecutions = new Map();
        this.startTime = new Date();
        // Initialize task queue
        this.taskQueue = new TaskQueue({
            maxSize: 10000,
            priorityLevels: 4,
            timeoutCleanupInterval: 30000,
            persistToDisk: false
        });
        // Set worker script path
        this.workerScriptPath = join(__dirname, 'ChemistryWorker.js');
        this.setupEventHandlers();
        this.initializeWorkerPool();
        this.startHealthMonitoring();
    }
    /**
     * Submit a task to the worker pool
     */
    async submitTask(task) {
        if (this.isShuttingDown) {
            throw new SystemError('Worker pool is shutting down', { operation: 'submitTask', taskId: task.id, poolState: 'shutting-down' }, { subsystem: 'workers', resource: 'worker-pool' });
        }
        // Add task to queue
        await this.taskQueue.enqueue(task);
        // Try to process immediately if workers are available
        await this.processQueuedTasks();
        // Return a promise that resolves when the task completes
        return new Promise((resolve, reject) => {
            const onTaskCompleted = (result) => {
                if (result.taskId === task.id) {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    resolve(result);
                }
            };
            const onTaskFailed = (error) => {
                if (error.taskId === task.id) {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    reject(error);
                }
            };
            this.on('task-completed', onTaskCompleted);
            this.on('task-failed', onTaskFailed);
            // Set up timeout
            if (task.timeout) {
                setTimeout(() => {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    reject(new Error(`Task ${task.id} timed out after ${task.timeout}ms`));
                }, task.timeout);
            }
        });
    }
    /**
     * Get current pool metrics
     */
    getMetrics() {
        const workers = Array.from(this.workers.values());
        const totalTasks = workers.reduce((sum, w) => sum + w.tasksCompleted, 0);
        const totalExecutionTime = workers.reduce((sum, w) => sum + w.totalExecutionTime, 0);
        const totalErrors = workers.reduce((sum, w) => sum + w.errorCount, 0);
        const peakMemory = Math.max(...workers.map(w => w.peakMemoryUsage), 0);
        return {
            poolSize: this.workers.size,
            activeWorkers: workers.filter(w => w.status === WorkerStatus.BUSY).length,
            idleWorkers: workers.filter(w => w.status === WorkerStatus.IDLE).length,
            totalTasksProcessed: totalTasks,
            averageTaskTime: totalTasks > 0 ? totalExecutionTime / totalTasks : 0,
            peakMemoryUsage: peakMemory,
            totalCpuTime: totalExecutionTime,
            errorRate: totalTasks > 0 ? totalErrors / totalTasks : 0,
            throughput: this.calculateThroughput(),
            efficiency: this.calculateEfficiency(),
            queueHealth: this.taskQueue.getStats(),
            workerHealth: workers.map(w => this.getWorkerHealth(w))
        };
    }
    /**
     * Scale the worker pool
     */
    async scalePool(targetSize) {
        if (targetSize < this.config.minWorkers || targetSize > this.config.maxWorkers) {
            throw new ValidationError(`Target size must be between ${this.config.minWorkers} and ${this.config.maxWorkers}`, { targetSize, minWorkers: this.config.minWorkers, maxWorkers: this.config.maxWorkers }, { field: 'targetSize', value: targetSize, constraint: `must be between ${this.config.minWorkers} and ${this.config.maxWorkers}` });
        }
        const currentSize = this.workers.size;
        if (targetSize > currentSize) {
            // Scale up
            const workersToAdd = targetSize - currentSize;
            await Promise.all(Array.from({ length: workersToAdd }, () => this.createWorker()));
        }
        else if (targetSize < currentSize) {
            // Scale down
            const workersToRemove = currentSize - targetSize;
            const idleWorkers = Array.from(this.workers.values())
                .filter(w => w.status === WorkerStatus.IDLE)
                .slice(0, workersToRemove);
            await Promise.all(idleWorkers.map(w => this.terminateWorker(w.id)));
        }
        this.emit('pool-scaled', currentSize, this.workers.size);
    }
    /**
     * Get detailed worker information
     */
    getWorkerInfo() {
        return Array.from(this.workers.values()).map(worker => ({
            id: worker.id,
            status: worker.status,
            uptime: Date.now() - worker.createdAt.getTime(),
            tasksCompleted: worker.tasksCompleted,
            memoryUsage: worker.currentMemoryUsage,
            currentTask: worker.currentTask
        }));
    }
    /**
     * Gracefully shutdown the worker pool
     */
    async shutdown() {
        if (this.isShuttingDown) {
            return;
        }
        this.isShuttingDown = true;
        // Clear intervals
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        // Wait for active tasks to complete (with timeout)
        const activeTaskIds = Array.from(this.activeExecutions.keys());
        if (activeTaskIds.length > 0) {
            await Promise.race([
                this.waitForActiveTasks(),
                new Promise(resolve => setTimeout(resolve, 30000)) // 30s timeout
            ]);
        }
        // Terminate all workers
        await Promise.all(Array.from(this.workers.keys()).map(workerId => this.terminateWorker(workerId)));
        // Shutdown task queue
        await this.taskQueue.shutdown();
        this.emit('pool-shutdown');
    }
    // ========================================
    // Private Methods
    // ========================================
    setupEventHandlers() {
        this.taskQueue.on('task-enqueued', () => {
            this.processQueuedTasks();
        });
        this.taskQueue.on('task-timeout', (task) => {
            this.handleTaskTimeout(task);
        });
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            this.emit('error', error);
        });
        process.on('unhandledRejection', (reason) => {
            this.emit('error', new Error(`Unhandled rejection: ${reason}`));
        });
    }
    async initializeWorkerPool() {
        // Create minimum number of workers
        const initialWorkers = Array.from({ length: this.config.minWorkers }, () => this.createWorker());
        await Promise.all(initialWorkers);
        this.emit('pool-initialized', this.workers.size);
    }
    async createWorker() {
        const workerId = createWorkerId(`worker_${this.nextWorkerId++}`);
        const config = {
            id: workerId,
            scriptPath: this.workerScriptPath,
            maxMemory: this.config.memoryLimit,
            maxCpuTime: this.config.cpuTimeLimit,
            idleTimeout: this.config.idleTimeout,
            env: Object.fromEntries(Object.entries(process.env).filter(([_, value]) => value !== undefined)),
            execArgv: []
        };
        const worker = new Worker(this.workerScriptPath, {
            workerData: { workerId },
            resourceLimits: {
                maxOldGenerationSizeMb: Math.floor(this.config.memoryLimit / (1024 * 1024)),
                maxYoungGenerationSizeMb: Math.floor(this.config.memoryLimit / (4 * 1024 * 1024))
            }
        });
        const workerInstance = {
            id: workerId,
            config,
            worker,
            status: WorkerStatus.STARTING,
            createdAt: new Date(),
            lastUsed: new Date(),
            tasksCompleted: 0,
            totalExecutionTime: 0,
            currentMemoryUsage: 0,
            peakMemoryUsage: 0,
            errorCount: 0
        };
        this.setupWorkerEventHandlers(workerInstance);
        this.workers.set(workerId, workerInstance);
        this.emit('worker-created', workerInstance);
        return workerInstance;
    }
    setupWorkerEventHandlers(workerInstance) {
        const { worker, id: workerId } = workerInstance;
        worker.on('message', (message) => {
            this.handleWorkerMessage(workerId, message);
        });
        worker.on('error', (error) => {
            this.handleWorkerError(workerId, error);
        });
        worker.on('exit', (code) => {
            this.handleWorkerExit(workerId, code);
        });
    }
    handleWorkerMessage(workerId, message) {
        const worker = this.workers.get(workerId);
        if (!worker)
            return;
        switch (message.type) {
            case MessageType.WORKER_READY:
                worker.status = WorkerStatus.IDLE;
                this.processQueuedTasks();
                break;
            case MessageType.TASK_RESULT:
                this.handleTaskResult(workerId, message);
                break;
            case MessageType.TASK_ERROR:
                this.handleTaskError(workerId, message);
                break;
            case MessageType.TASK_PROGRESS:
                this.handleTaskProgress(workerId, message);
                break;
            case MessageType.MEMORY_WARNING:
                this.handleMemoryWarning(workerId, message);
                break;
            case MessageType.HEALTH_CHECK:
                this.handleHealthCheckResponse(workerId, message);
                break;
        }
    }
    handleTaskResult(workerId, message) {
        const worker = this.workers.get(workerId);
        const taskResult = message.data;
        if (worker && message.taskId) {
            // Update worker stats
            worker.status = WorkerStatus.IDLE;
            worker.currentTask = undefined;
            worker.tasksCompleted++;
            worker.totalExecutionTime += taskResult.executionTime;
            worker.lastUsed = new Date();
            // Update memory usage
            if (taskResult.memoryUsage > worker.peakMemoryUsage) {
                worker.peakMemoryUsage = taskResult.memoryUsage;
            }
            worker.currentMemoryUsage = taskResult.memoryUsage;
            // Remove from active executions
            this.activeExecutions.delete(message.taskId);
            // Emit result
            this.emit('task-completed', taskResult);
            // Process next queued task
            this.processQueuedTasks();
        }
    }
    handleTaskError(workerId, message) {
        const worker = this.workers.get(workerId);
        const error = message.data;
        if (worker && message.taskId) {
            worker.status = WorkerStatus.IDLE;
            worker.currentTask = undefined;
            worker.errorCount++;
            worker.lastError = error;
            // Remove from active executions
            this.activeExecutions.delete(message.taskId);
            // Handle error recovery
            this.handleErrorRecovery(workerId, error);
            // Emit error
            this.emit('task-failed', error);
            // Process next queued task
            this.processQueuedTasks();
        }
    }
    handleTaskProgress(workerId, message) {
        if (message.taskId && this.activeExecutions.has(message.taskId)) {
            const execution = this.activeExecutions.get(message.taskId);
            execution.progress = message.data.progress;
            this.emit('task-progress', message.taskId, message.data.progress);
        }
    }
    handleMemoryWarning(workerId, message) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.currentMemoryUsage = message.data.memoryUsage;
            this.emit('memory-warning', workerId, message.data);
            // Consider terminating worker if memory usage is too high
            if (message.data.memoryUsage > this.config.memoryLimit * 0.9) {
                this.restartWorker(workerId);
            }
        }
    }
    handleHealthCheckResponse(workerId, message) {
        const worker = this.workers.get(workerId);
        if (worker) {
            // Update worker health status
            worker.currentMemoryUsage = message.data.memoryUsage;
            // Additional health processing can be added here
        }
    }
    handleWorkerError(workerId, error) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.status = WorkerStatus.ERROR;
            worker.errorCount++;
            worker.lastError = {
                name: error.name,
                message: error.message,
                type: 'crash',
                workerId,
                timestamp: new Date(),
                stackTrace: error.stack
            };
            // Restart worker if configured to do so
            if (this.recoveryConfig.restartWorkerOnError) {
                this.restartWorker(workerId);
            }
            this.emit('worker-error', worker.lastError);
        }
    }
    handleWorkerExit(workerId, code) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.status = WorkerStatus.TERMINATED;
            // Clean up active tasks
            if (worker.currentTask) {
                this.activeExecutions.delete(worker.currentTask);
            }
            this.emit('worker-terminated', workerId, `Exit code: ${code}`);
            // Replace worker if pool is not shutting down and we're below minimum
            if (!this.isShuttingDown && this.workers.size < this.config.minWorkers) {
                this.createWorker();
            }
        }
    }
    async processQueuedTasks() {
        while (!this.taskQueue.isEmpty() && this.hasAvailableWorkers()) {
            const task = this.taskQueue.dequeue();
            if (task) {
                const worker = this.selectWorker();
                if (worker) {
                    await this.assignTaskToWorker(worker, task);
                }
            }
        }
        // Auto-scale if needed
        if (this.config.autoScale && this.shouldScaleUp()) {
            const targetSize = Math.min(this.workers.size + 1, this.config.maxWorkers);
            await this.scalePool(targetSize);
        }
    }
    hasAvailableWorkers() {
        return Array.from(this.workers.values()).some(worker => worker.status === WorkerStatus.IDLE);
    }
    selectWorker() {
        const availableWorkers = Array.from(this.workers.values())
            .filter(worker => worker.status === WorkerStatus.IDLE);
        if (availableWorkers.length === 0) {
            return null;
        }
        switch (this.config.loadBalancing) {
            case 'round-robin':
                return availableWorkers[0]; // Simple round-robin
            case 'least-busy':
                return availableWorkers.reduce((least, current) => current.tasksCompleted < least.tasksCompleted ? current : least);
            case 'random':
                return availableWorkers[Math.floor(Math.random() * availableWorkers.length)];
            default:
                return availableWorkers[0];
        }
    }
    async assignTaskToWorker(worker, task) {
        worker.status = WorkerStatus.BUSY;
        worker.currentTask = task.id;
        // Track execution
        const execution = {
            taskId: task.id,
            workerId: worker.id,
            startedAt: new Date(),
            status: TaskStatus.RUNNING
        };
        this.activeExecutions.set(task.id, execution);
        // Send task to worker
        worker.worker.postMessage({
            type: MessageType.TASK_ASSIGNMENT,
            taskId: task.id,
            data: task,
            timestamp: new Date()
        });
        this.emit('task-started', execution);
    }
    shouldScaleUp() {
        return (this.taskQueue.size() >= this.config.scalingThreshold &&
            this.workers.size < this.config.maxWorkers);
    }
    async restartWorker(workerId) {
        await this.terminateWorker(workerId);
        await this.createWorker();
    }
    async terminateWorker(workerId) {
        const worker = this.workers.get(workerId);
        if (worker) {
            // Send shutdown message
            worker.worker.postMessage({
                type: MessageType.WORKER_SHUTDOWN,
                data: {},
                timestamp: new Date()
            });
            // Force terminate after timeout
            setTimeout(() => {
                if (!worker.worker.threadId) {
                    worker.worker.terminate();
                }
            }, 5000);
            this.workers.delete(workerId);
            this.emit('worker-terminated', workerId, 'Manual termination');
        }
    }
    handleTaskTimeout(task) {
        const execution = this.activeExecutions.get(task.id);
        if (execution) {
            const worker = this.workers.get(execution.workerId);
            if (worker && worker.currentTask === task.id) {
                worker.status = WorkerStatus.IDLE;
                worker.currentTask = undefined;
            }
            this.activeExecutions.delete(task.id);
            const error = {
                name: 'TaskTimeoutError',
                message: `Task ${task.id} timed out`,
                type: 'timeout',
                taskId: task.id,
                timestamp: new Date()
            };
            this.emit('task-failed', error);
        }
    }
    handleErrorRecovery(workerId, error) {
        if (this.recoveryConfig.restartWorkerOnError && error.type === 'crash') {
            this.restartWorker(workerId);
        }
        // Additional recovery strategies can be implemented here
    }
    calculateThroughput() {
        const uptime = (Date.now() - this.startTime.getTime()) / 1000; // seconds
        const totalTasks = Array.from(this.workers.values())
            .reduce((sum, w) => sum + w.tasksCompleted, 0);
        return uptime > 0 ? totalTasks / uptime : 0;
    }
    calculateEfficiency() {
        const totalWorkers = this.workers.size;
        const busyWorkers = Array.from(this.workers.values())
            .filter(w => w.status === WorkerStatus.BUSY).length;
        return totalWorkers > 0 ? (busyWorkers / totalWorkers) * 100 : 0;
    }
    getWorkerHealth(worker) {
        const uptime = Date.now() - worker.createdAt.getTime();
        const avgTaskTime = worker.tasksCompleted > 0
            ? worker.totalExecutionTime / worker.tasksCompleted
            : 0;
        return {
            workerId: worker.id,
            status: worker.status,
            uptime,
            tasksCompleted: worker.tasksCompleted,
            averageTaskTime: avgTaskTime,
            memoryUsage: worker.currentMemoryUsage,
            cpuUsage: 0, // Would need additional monitoring
            errorCount: worker.errorCount,
            efficiency: worker.tasksCompleted > 0 ?
                (worker.totalExecutionTime / uptime) * 100 : 0,
            lastActivity: worker.lastUsed
        };
    }
    async waitForActiveTasks() {
        return new Promise((resolve) => {
            const checkActiveTasks = () => {
                if (this.activeExecutions.size === 0) {
                    resolve();
                }
                else {
                    setTimeout(checkActiveTasks, 100);
                }
            };
            checkActiveTasks();
        });
    }
    startHealthMonitoring() {
        // Metrics collection
        this.metricsInterval = setInterval(() => {
            const metrics = this.getMetrics();
            this.emit('metrics-updated', metrics);
        }, 30000); // Every 30 seconds
        // Health checks
        this.healthCheckInterval = setInterval(() => {
            this.performHealthChecks();
        }, 60000); // Every minute
    }
    performHealthChecks() {
        for (const worker of this.workers.values()) {
            if (worker.status !== WorkerStatus.TERMINATED) {
                worker.worker.postMessage({
                    type: MessageType.HEALTH_CHECK,
                    data: {},
                    timestamp: new Date()
                });
            }
        }
    }
};
WorkerPool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, Object])
], WorkerPool);
export { WorkerPool };
//# sourceMappingURL=WorkerPool.js.map