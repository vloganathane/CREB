/**
 * @fileoverview Advanced Task Queue with Priority Management
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module implements a sophisticated task queue system with priority-based scheduling,
 * timeout management, and persistence capabilities for the CREB worker thread system.
 */
import { EventEmitter } from 'events';
import { WorkerTask, TaskPriority, TaskQueueConfig, QueueStats } from './types';
/**
 * Advanced task queue with priority management and persistence
 */
export declare class TaskQueue extends EventEmitter {
    private readonly config;
    private readonly queues;
    private readonly taskMap;
    private readonly timeouts;
    private stats;
    private readonly startTime;
    private cleanupInterval?;
    private persistenceInterval?;
    constructor(config?: Partial<TaskQueueConfig>);
    /**
     * Enqueue a task with priority-based insertion
     */
    enqueue(task: WorkerTask): Promise<void>;
    /**
     * Dequeue the highest priority task
     */
    dequeue(): WorkerTask | null;
    /**
     * Peek at the next task without removing it
     */
    peek(): WorkerTask | null;
    /**
     * Get task by ID
     */
    getTask(taskId: string): WorkerTask | null;
    /**
     * Remove a specific task from the queue
     */
    removeTask(taskId: string): boolean;
    /**
     * Get tasks by priority
     */
    getTasksByPriority(priority: TaskPriority): WorkerTask[];
    /**
     * Get all pending tasks
     */
    getAllTasks(): WorkerTask[];
    /**
     * Clear all tasks from the queue
     */
    clear(): void;
    /**
     * Get current queue size
     */
    size(): number;
    /**
     * Check if queue is empty
     */
    isEmpty(): boolean;
    /**
     * Check if queue is full
     */
    isFull(): boolean;
    /**
     * Get queue statistics
     */
    getStats(): QueueStats;
    /**
     * Get detailed queue information
     */
    getQueueInfo(): Record<string, any>;
    /**
     * Gracefully shutdown the queue
     */
    shutdown(): Promise<void>;
    /**
     * Load queue from disk (if persistence is enabled)
     */
    loadFromDisk(): Promise<void>;
    private validateTask;
    private handleTaskTimeout;
    private clearTaskTimeout;
    private updateStatsOnEnqueue;
    private updateStatsOnDequeue;
    private updateStatsOnRemoval;
    private calculateMovingAverage;
    private calculateAverageAge;
    private resetStats;
    private setupCleanupInterval;
    private setupPersistence;
    private performCleanup;
    private persistQueue;
}
/**
 * Task builder for fluent task creation
 */
export declare class TaskBuilder<TData = any> {
    private task;
    static create<TData = any>(): TaskBuilder<TData>;
    withId(id: string): TaskBuilder<TData>;
    withType(type: any): TaskBuilder<TData>;
    withData(data: TData): TaskBuilder<TData>;
    withPriority(priority: TaskPriority): TaskBuilder<TData>;
    withTimeout(timeout: number): TaskBuilder<TData>;
    withRetries(retries: number): TaskBuilder<TData>;
    withMetadata(metadata: Record<string, any>): TaskBuilder<TData>;
    build(): WorkerTask<TData>;
}
//# sourceMappingURL=TaskQueue.d.ts.map