/**
 * @fileoverview Simple Tests for Worker Thread System Core Components
 * @version 1.7.0
 * @author CREB Development Team
 */

import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { TaskQueue, TaskBuilder } from '../TaskQueue';
import { 
  TaskPriority, 
  CalculationType, 
  TaskStatus,
  EquationBalancingTask,
  WorkerTask,
  isWorkerTask,
  isTaskResult,
  isWorkerError
} from '../types';

describe('TaskQueue Core Functionality', () => {
  let taskQueue: TaskQueue;

  beforeEach(() => {
    taskQueue = new TaskQueue();
  });

  afterEach(() => {
    taskQueue.clear();
  });

  it('should create a task queue', () => {
    expect(taskQueue).toBeDefined();
    expect(taskQueue.size()).toBe(0);
  });

  it('should handle empty queue', () => {
    expect(taskQueue.dequeue()).toBeNull();
    expect(taskQueue.size()).toBe(0);
  });

  it('should get stats', () => {
    const stats = taskQueue.getStats();
    expect(stats).toBeDefined();
    expect(stats.totalTasks).toBe(0);
    expect(stats.pendingTasks).toBe(0);
  });

  it('should add and dequeue tasks', async () => {
    const task = TaskBuilder.create()
      .withType(CalculationType.EQUATION_BALANCING)
      .withData({ equation: 'H2 + O2 -> H2O' })
      .withPriority(TaskPriority.HIGH)
      .build();

    await taskQueue.enqueue(task);
    expect(taskQueue.size()).toBe(1);

    const dequeuedTask = taskQueue.dequeue();
    expect(dequeuedTask).toBeDefined();
    expect(dequeuedTask?.type).toBe(CalculationType.EQUATION_BALANCING);
  });
});

describe('TaskBuilder', () => {
  it('should build equation balancing task', () => {
    const task = TaskBuilder.create()
      .withType(CalculationType.EQUATION_BALANCING)
      .withData({ equation: 'H2 + O2 -> H2O' })
      .withPriority(TaskPriority.HIGH)
      .withTimeout(5000)
      .build();

    expect(task.type).toBe(CalculationType.EQUATION_BALANCING);
    expect(task.priority).toBe(TaskPriority.HIGH);
    expect(task.timeout).toBe(5000);
    expect(task.data.equation).toBe('H2 + O2 -> H2O');
  });

  it('should build thermodynamics task', () => {
    const task = TaskBuilder.create()
      .withType(CalculationType.THERMODYNAMICS)
      .withData({ temperature: 298, pressure: 1 })
      .withPriority(TaskPriority.NORMAL)
      .build();

    expect(task.type).toBe(CalculationType.THERMODYNAMICS);
    expect(task.priority).toBe(TaskPriority.NORMAL);
    expect(task.data.temperature).toBe(298);
    expect(task.data.pressure).toBe(1);
  });

  it('should generate unique task IDs', () => {
    const task1 = TaskBuilder.create()
      .withType(CalculationType.EQUATION_BALANCING)
      .withData({ equation: 'H2 + O2 -> H2O' })
      .build();
    
    const task2 = TaskBuilder.create()
      .withType(CalculationType.EQUATION_BALANCING)
      .withData({ equation: 'H2 + O2 -> H2O' })
      .build();

    expect(task1.id).not.toBe(task2.id);
  });
});

describe('Type Guards', () => {
  it('should validate worker tasks', () => {
    const task: WorkerTask<EquationBalancingTask> = {
      id: 'test-task',
      type: CalculationType.EQUATION_BALANCING,
      data: { equation: 'H2 + O2 -> H2O' },
      priority: TaskPriority.HIGH,
      createdAt: new Date(),
      timeout: 5000,
    };

    expect(isWorkerTask(task)).toBe(true);
    expect(isWorkerTask({})).toBe(false);
    expect(isWorkerTask(null)).toBe(false);
  });

  it('should validate task results', () => {
    const validResult = {
      taskId: 'task-1',
      success: true,
      result: { balanced: 'H2 + O2 -> H2O' },
      executionTime: 100,
      memoryUsage: 1024
    };

    expect(isTaskResult(validResult)).toBe(true);
    expect(isTaskResult({})).toBe(false);
    expect(isTaskResult(null)).toBe(false);
  });

  it('should validate worker errors', () => {
    const validError = new Error('Calculation failed');
    (validError as any).type = 'CALCULATION_ERROR';
    (validError as any).timestamp = new Date();
    (validError as any).taskId = 'task-1';

    expect(isWorkerError(validError)).toBe(true);
    expect(isWorkerError({})).toBe(false);
    expect(isWorkerError(null)).toBe(false);
  });
});

console.log('✅ Worker Thread System Simple Tests Complete');
