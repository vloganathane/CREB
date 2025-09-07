/**
 * @fileoverview Advanced Task Queue with Priority Management
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module implements a sophisticated task queue system with priority-based scheduling,
 * timeout management, and persistence capabilities for the CREB worker thread system.
 */
import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { TaskPriority, createTaskId } from './types.js';
/**
 * Advanced task queue with priority management and persistence
 */
export class TaskQueue extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            maxSize: 10000,
            priorityLevels: 4,
            timeoutCleanupInterval: 30000, // 30 seconds
            persistToDisk: false,
            ...config
        };
        // Initialize priority queues
        this.queues = new Map();
        for (let priority = 0; priority < this.config.priorityLevels; priority++) {
            this.queues.set(priority, []);
        }
        this.taskMap = new Map();
        this.timeouts = new Map();
        this.startTime = new Date();
        // Initialize stats
        this.stats = {
            totalTasks: 0,
            pendingTasks: 0,
            runningTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageWaitTime: 0,
            averageExecutionTime: 0,
            throughput: 0,
            queueLength: 0,
            priorityBreakdown: {
                [TaskPriority.LOW]: 0,
                [TaskPriority.NORMAL]: 0,
                [TaskPriority.HIGH]: 0,
                [TaskPriority.CRITICAL]: 0
            }
        };
        this.setupCleanupInterval();
        this.setupPersistence();
    }
    /**
     * Enqueue a task with priority-based insertion
     */
    async enqueue(task) {
        if (this.size() >= this.config.maxSize) {
            throw new Error(`Queue is full (max size: ${this.config.maxSize})`);
        }
        // Validate task
        this.validateTask(task);
        // Add to task map for quick lookup
        this.taskMap.set(task.id, { ...task });
        // Add to priority queue
        const priorityQueue = this.queues.get(task.priority);
        if (!priorityQueue) {
            throw new Error(`Invalid priority level: ${task.priority}`);
        }
        const node = {
            task: { ...task },
            priority: task.priority,
            enqueuedAt: new Date()
        };
        // Insert based on priority and FIFO within priority
        priorityQueue.push(node);
        // Setup timeout if specified
        if (task.timeout && task.timeout > 0) {
            const timeoutId = setTimeout(() => {
                this.handleTaskTimeout(task.id);
            }, task.timeout);
            this.timeouts.set(task.id, timeoutId);
        }
        // Update stats
        this.updateStatsOnEnqueue(task);
        // Emit event
        this.emit('task-enqueued', task);
        // Persist if enabled
        if (this.config.persistToDisk) {
            await this.persistQueue();
        }
    }
    /**
     * Dequeue the highest priority task
     */
    dequeue() {
        // Check priorities from highest to lowest
        for (let priority = TaskPriority.CRITICAL; priority >= TaskPriority.LOW; priority--) {
            const queue = this.queues.get(priority);
            if (queue && queue.length > 0) {
                const node = queue.shift();
                const task = node.task;
                // Clean up timeout
                this.clearTaskTimeout(task.id);
                // Update stats
                this.updateStatsOnDequeue(task, node.enqueuedAt);
                // Emit event
                this.emit('task-dequeued', task);
                return task;
            }
        }
        return null;
    }
    /**
     * Peek at the next task without removing it
     */
    peek() {
        for (let priority = TaskPriority.CRITICAL; priority >= TaskPriority.LOW; priority--) {
            const queue = this.queues.get(priority);
            if (queue && queue.length > 0) {
                return queue[0].task;
            }
        }
        return null;
    }
    /**
     * Get task by ID
     */
    getTask(taskId) {
        return this.taskMap.get(taskId) || null;
    }
    /**
     * Remove a specific task from the queue
     */
    removeTask(taskId) {
        const task = this.taskMap.get(taskId);
        if (!task) {
            return false;
        }
        // Remove from priority queue
        const queue = this.queues.get(task.priority);
        if (queue) {
            const index = queue.findIndex(node => node.task.id === taskId);
            if (index !== -1) {
                queue.splice(index, 1);
            }
        }
        // Clean up
        this.taskMap.delete(taskId);
        this.clearTaskTimeout(taskId);
        // Update stats
        this.updateStatsOnRemoval(task);
        // Emit event
        this.emit('task-removed', task);
        return true;
    }
    /**
     * Get tasks by priority
     */
    getTasksByPriority(priority) {
        const queue = this.queues.get(priority);
        return queue ? queue.map(node => node.task) : [];
    }
    /**
     * Get all pending tasks
     */
    getAllTasks() {
        const allTasks = [];
        for (const queue of this.queues.values()) {
            allTasks.push(...queue.map(node => node.task));
        }
        return allTasks;
    }
    /**
     * Clear all tasks from the queue
     */
    clear() {
        // Clear all timeouts
        for (const timeoutId of this.timeouts.values()) {
            clearTimeout(timeoutId);
        }
        // Clear collections
        for (const queue of this.queues.values()) {
            queue.length = 0;
        }
        this.taskMap.clear();
        this.timeouts.clear();
        // Reset stats
        this.resetStats();
        // Emit event
        this.emit('queue-cleared');
    }
    /**
     * Get current queue size
     */
    size() {
        return this.taskMap.size;
    }
    /**
     * Check if queue is empty
     */
    isEmpty() {
        return this.size() === 0;
    }
    /**
     * Check if queue is full
     */
    isFull() {
        return this.size() >= this.config.maxSize;
    }
    /**
     * Get queue statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get detailed queue information
     */
    getQueueInfo() {
        const info = {
            totalSize: this.size(),
            maxSize: this.config.maxSize,
            utilization: (this.size() / this.config.maxSize) * 100,
            uptime: Date.now() - this.startTime.getTime(),
            priorityQueues: {}
        };
        // Add priority queue details
        for (const [priority, queue] of this.queues.entries()) {
            const priorityName = TaskPriority[priority] || `Priority_${priority}`;
            info.priorityQueues[priorityName] = {
                size: queue.length,
                oldestTask: queue.length > 0 ? queue[0].enqueuedAt : null,
                averageAge: this.calculateAverageAge(queue)
            };
        }
        return info;
    }
    /**
     * Gracefully shutdown the queue
     */
    async shutdown() {
        // Clear intervals
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        if (this.persistenceInterval) {
            clearInterval(this.persistenceInterval);
        }
        // Persist final state if enabled
        if (this.config.persistToDisk && this.size() > 0) {
            await this.persistQueue();
        }
        // Clear all tasks and timeouts
        this.clear();
        // Emit shutdown event
        this.emit('queue-shutdown');
    }
    /**
     * Load queue from disk (if persistence is enabled)
     */
    async loadFromDisk() {
        if (!this.config.persistToDisk || !this.config.queuePath) {
            return;
        }
        try {
            const data = await fs.readFile(this.config.queuePath, 'utf-8');
            const savedTasks = JSON.parse(data);
            // Restore tasks
            for (const task of savedTasks) {
                await this.enqueue({
                    ...task,
                    createdAt: new Date(task.createdAt)
                });
            }
            this.emit('queue-loaded', savedTasks.length);
        }
        catch (error) {
            // File might not exist or be corrupted - that's okay
            this.emit('queue-load-error', error);
        }
    }
    // ========================================
    // Private Methods
    // ========================================
    validateTask(task) {
        if (!task.id || typeof task.id !== 'string') {
            throw new Error('Task must have a valid string ID');
        }
        if (this.taskMap.has(task.id)) {
            throw new Error(`Task with ID ${task.id} already exists`);
        }
        if (task.priority < 0 || task.priority >= this.config.priorityLevels) {
            throw new Error(`Invalid priority: ${task.priority}`);
        }
        if (task.timeout !== undefined && task.timeout < 0) {
            throw new Error('Task timeout must be non-negative');
        }
    }
    handleTaskTimeout(taskId) {
        const task = this.taskMap.get(taskId);
        if (task) {
            this.removeTask(taskId);
            this.stats.failedTasks++;
            this.emit('task-timeout', task);
        }
    }
    clearTaskTimeout(taskId) {
        const timeoutId = this.timeouts.get(taskId);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeouts.delete(taskId);
        }
    }
    updateStatsOnEnqueue(task) {
        this.stats.totalTasks++;
        this.stats.pendingTasks++;
        this.stats.queueLength = this.size();
        this.stats.priorityBreakdown[task.priority]++;
    }
    updateStatsOnDequeue(task, enqueuedAt) {
        this.stats.pendingTasks--;
        this.stats.runningTasks++;
        this.stats.queueLength = this.size();
        // Update average wait time
        const waitTime = Date.now() - enqueuedAt.getTime();
        this.stats.averageWaitTime = this.calculateMovingAverage(this.stats.averageWaitTime, waitTime, this.stats.totalTasks);
        // Update throughput
        const uptimeSeconds = (Date.now() - this.startTime.getTime()) / 1000;
        this.stats.throughput = this.stats.completedTasks / Math.max(uptimeSeconds, 1);
    }
    updateStatsOnRemoval(task) {
        this.stats.pendingTasks--;
        this.stats.queueLength = this.size();
        this.stats.priorityBreakdown[task.priority]--;
    }
    calculateMovingAverage(current, newValue, count) {
        if (count <= 1)
            return newValue;
        return ((current * (count - 1)) + newValue) / count;
    }
    calculateAverageAge(queue) {
        if (queue.length === 0)
            return 0;
        const now = Date.now();
        const totalAge = queue.reduce((sum, node) => {
            return sum + (now - node.enqueuedAt.getTime());
        }, 0);
        return totalAge / queue.length;
    }
    resetStats() {
        Object.assign(this.stats, {
            totalTasks: 0,
            pendingTasks: 0,
            runningTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageWaitTime: 0,
            averageExecutionTime: 0,
            throughput: 0,
            queueLength: 0,
            priorityBreakdown: {
                [TaskPriority.LOW]: 0,
                [TaskPriority.NORMAL]: 0,
                [TaskPriority.HIGH]: 0,
                [TaskPriority.CRITICAL]: 0
            }
        });
    }
    setupCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, this.config.timeoutCleanupInterval);
    }
    setupPersistence() {
        if (this.config.persistToDisk) {
            // Persist every 5 minutes
            this.persistenceInterval = setInterval(() => {
                this.persistQueue().catch(error => {
                    this.emit('persistence-error', error);
                });
            }, 5 * 60 * 1000);
        }
    }
    performCleanup() {
        // Clean up completed timeouts and update stats
        const now = Date.now();
        let cleanedTasks = 0;
        // This is mainly for housekeeping - actual timeout handling
        // is done in handleTaskTimeout
        for (const [taskId, task] of this.taskMap.entries()) {
            if (task.timeout && task.timeout > 0) {
                const age = now - task.createdAt.getTime();
                if (age > task.timeout * 2) { // Clean up very old tasks
                    this.removeTask(taskId);
                    cleanedTasks++;
                }
            }
        }
        if (cleanedTasks > 0) {
            this.emit('cleanup-completed', cleanedTasks);
        }
    }
    async persistQueue() {
        if (!this.config.queuePath) {
            throw new Error('Queue path not configured for persistence');
        }
        try {
            const tasks = this.getAllTasks();
            const data = JSON.stringify(tasks, null, 2);
            await fs.writeFile(this.config.queuePath, data, 'utf-8');
            this.emit('queue-persisted', tasks.length);
        }
        catch (error) {
            this.emit('persistence-error', error);
            throw error;
        }
    }
}
/**
 * Task builder for fluent task creation
 */
export class TaskBuilder {
    constructor() {
        this.task = {};
    }
    static create() {
        return new TaskBuilder();
    }
    withId(id) {
        this.task.id = id;
        return this;
    }
    withType(type) {
        this.task.type = type;
        return this;
    }
    withData(data) {
        this.task.data = data;
        return this;
    }
    withPriority(priority) {
        this.task.priority = priority;
        return this;
    }
    withTimeout(timeout) {
        this.task.timeout = timeout;
        return this;
    }
    withRetries(retries) {
        this.task.retryAttempts = retries;
        return this;
    }
    withMetadata(metadata) {
        this.task.metadata = metadata;
        return this;
    }
    build() {
        // Validate required fields
        if (!this.task.id) {
            this.task.id = createTaskId(`task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }
        if (!this.task.type) {
            throw new Error('Task type is required');
        }
        if (this.task.data === undefined) {
            throw new Error('Task data is required');
        }
        if (this.task.priority === undefined) {
            this.task.priority = TaskPriority.NORMAL;
        }
        if (!this.task.createdAt) {
            this.task.createdAt = new Date();
        }
        return this.task;
    }
}
//# sourceMappingURL=TaskQueue.js.map