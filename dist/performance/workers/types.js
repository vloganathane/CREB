/**
 * @fileoverview Type definitions for CREB Worker Thread System
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides comprehensive type definitions for the worker thread system,
 * enabling efficient offloading of CPU-intensive chemistry calculations.
 */
// ========================================
// Core Types and Enums
// ========================================
/**
 * Priority levels for task queue management
 */
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["CRITICAL"] = 3] = "CRITICAL";
})(TaskPriority || (TaskPriority = {}));
/**
 * Task status tracking
 */
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["QUEUED"] = "queued";
    TaskStatus["RUNNING"] = "running";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["TIMEOUT"] = "timeout";
})(TaskStatus || (TaskStatus = {}));
/**
 * Worker status tracking
 */
export var WorkerStatus;
(function (WorkerStatus) {
    WorkerStatus["IDLE"] = "idle";
    WorkerStatus["BUSY"] = "busy";
    WorkerStatus["ERROR"] = "error";
    WorkerStatus["TERMINATED"] = "terminated";
    WorkerStatus["STARTING"] = "starting";
})(WorkerStatus || (WorkerStatus = {}));
/**
 * Chemistry calculation types
 */
export var CalculationType;
(function (CalculationType) {
    CalculationType["EQUATION_BALANCING"] = "equation_balancing";
    CalculationType["THERMODYNAMICS"] = "thermodynamics";
    CalculationType["STOICHIOMETRY"] = "stoichiometry";
    CalculationType["BATCH_ANALYSIS"] = "batch_analysis";
    CalculationType["MATRIX_SOLVING"] = "matrix_solving";
    CalculationType["COMPOUND_ANALYSIS"] = "compound_analysis";
})(CalculationType || (CalculationType = {}));
// ========================================
// Communication Protocols
// ========================================
/**
 * Message types for worker communication
 */
export var MessageType;
(function (MessageType) {
    MessageType["TASK_ASSIGNMENT"] = "task_assignment";
    MessageType["TASK_RESULT"] = "task_result";
    MessageType["TASK_ERROR"] = "task_error";
    MessageType["TASK_PROGRESS"] = "task_progress";
    MessageType["WORKER_READY"] = "worker_ready";
    MessageType["WORKER_SHUTDOWN"] = "worker_shutdown";
    MessageType["HEALTH_CHECK"] = "health_check";
    MessageType["MEMORY_WARNING"] = "memory_warning";
})(MessageType || (MessageType = {}));
// ========================================
// Type Guards and Utilities
// ========================================
/**
 * Type guard for worker tasks
 */
export function isWorkerTask(obj) {
    return (obj &&
        typeof obj.id === 'string' &&
        typeof obj.type === 'string' &&
        obj.data !== undefined &&
        typeof obj.priority === 'number' &&
        obj.createdAt instanceof Date);
}
/**
 * Type guard for task results
 */
export function isTaskResult(obj) {
    return (obj &&
        typeof obj.taskId === 'string' &&
        typeof obj.success === 'boolean' &&
        typeof obj.executionTime === 'number' &&
        typeof obj.memoryUsage === 'number');
}
/**
 * Type guard for worker errors
 */
export function isWorkerError(obj) {
    return (obj &&
        obj instanceof Error &&
        typeof obj.type === 'string' &&
        obj.timestamp instanceof Date);
}
/**
 * Create a branded worker ID
 */
export function createWorkerId(id) {
    return id;
}
/**
 * Create a branded task ID
 */
export function createTaskId(id) {
    return id;
}
/**
 * Create a branded correlation ID
 */
export function createCorrelationId(id) {
    return id;
}
//# sourceMappingURL=types.js.map