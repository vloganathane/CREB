/**
 * @fileoverview Worker Thread System Demo
 * @version 1.7.0
 * @author CREB Development Team
 * 
 * This demo showcases the powerful worker thread system capabilities
 * for offloading CPU-intensive chemistry calculations.
 */

import { 
  CREBWorkerManager, 
  createWorkerManager, 
  WorkerPerformanceMonitor,
  TaskPriority,
  CalculationType 
} from '../src/performance/workers/index.js';

/**
 * Demo: Basic Worker Thread Usage
 */
async function demoBasicUsage() {
  console.log('🚀 Demo: Basic Worker Thread Usage');
  console.log('=' .repeat(50));

  // Create and initialize worker manager
  const workerManager = createWorkerManager({
    minWorkers: 2,
    maxWorkers: 4,
    autoScale: true
  });

  await workerManager.initialize();
  console.log('✅ Worker manager initialized');

  try {
    // Demo 1: Equation Balancing
    console.log('\n📝 Balancing chemical equation...');
    const balanceResult = await workerManager.balanceEquation(
      'Fe + O2 -> Fe2O3',
      { 
        method: 'matrix',
        priority: TaskPriority.HIGH 
      }
    );
    
    console.log(`Original: ${balanceResult.originalEquation}`);
    console.log(`Balanced: ${balanceResult.balancedEquation}`);
    console.log(`Method: ${balanceResult.method}`);
    console.log(`Is Balanced: ${balanceResult.isBalanced}`);

    // Demo 2: Thermodynamics Calculation
    console.log('\n🌡️  Calculating thermodynamic properties...');
    const thermoResult = await workerManager.calculateThermodynamics(
      [
        { formula: 'H2O', amount: 1.0, state: 'liquid' },
        { formula: 'H2', amount: 1.0, state: 'gas' },
        { formula: 'O2', amount: 0.5, state: 'gas' }
      ],
      {
        temperature: 298.15,
        pressure: 1.0
      },
      ['enthalpy', 'entropy', 'gibbs'],
      { priority: TaskPriority.NORMAL }
    );

    console.log(`Temperature: ${thermoResult.temperature} K`);
    console.log(`Pressure: ${thermoResult.pressure} atm`);
    console.log('Calculations:');
    Object.entries(thermoResult.calculations).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    // Demo 3: Batch Analysis
    console.log('\n📊 Performing batch compound analysis...');
    const compounds = ['H2O', 'CO2', 'CH4', 'NH3', 'C2H6', 'C6H12O6'];
    const batchResult = await workerManager.analyzeBatch(
      compounds,
      ['molecular_weight', 'density', 'boiling_point'],
      { 
        batchSize: 3,
        priority: TaskPriority.NORMAL 
      }
    );

    console.log(`Total compounds analyzed: ${batchResult.totalCompounds}`);
    batchResult.results.forEach((result, index) => {
      console.log(`${result.formula}:`);
      Object.entries(result.properties).forEach(([prop, value]) => {
        console.log(`  ${prop}: ${value}`);
      });
    });

    // Demo 4: Matrix Solving
    console.log('\n🔢 Solving matrix equation...');
    const matrix = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2]
    ];
    const vector = [8, -11, -3];

    const matrixResult = await workerManager.solveMatrix(
      matrix,
      vector,
      { 
        method: 'gaussian',
        priority: TaskPriority.HIGH 
      }
    );

    console.log('Matrix:', matrix);
    console.log('Vector:', vector);
    console.log('Solution:', matrixResult.solution);

  } finally {
    await workerManager.shutdown();
    console.log('\n✅ Worker manager shutdown complete');
  }
}

/**
 * Demo: Performance Monitoring
 */
async function demoPerformanceMonitoring() {
  console.log('\n\n📈 Demo: Performance Monitoring');
  console.log('=' .repeat(50));

  const workerManager = createWorkerManager({
    minWorkers: 2,
    maxWorkers: 6,
    autoScale: true,
    scalingThreshold: 3
  });

  await workerManager.initialize();

  // Start performance monitoring
  const monitor = new WorkerPerformanceMonitor(workerManager);
  monitor.startMonitoring(1000); // Monitor every second

  try {
    console.log('🏃 Starting intensive workload...');

    // Generate intensive workload
    const tasks: Promise<any>[] = [];
    for (let i = 0; i < 20; i++) {
      tasks.push(
        workerManager.balanceEquation(`C${i+1}H${(i+1)*2} + O2 -> CO2 + H2O`, {
          priority: i % 2 === 0 ? TaskPriority.HIGH : TaskPriority.NORMAL
        })
      );
    }

    // Execute tasks in parallel
    const startTime = Date.now();
    await Promise.all(tasks);
    const totalTime = Date.now() - startTime;

    console.log(`✅ Completed 20 equation balancing tasks in ${totalTime}ms`);

    // Wait a bit for metrics collection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get performance metrics
    const metrics = workerManager.getMetrics();
    console.log('\n📊 Current Performance Metrics:');
    console.log(`Pool Size: ${metrics.poolSize} workers`);
    console.log(`Active Workers: ${metrics.activeWorkers}`);
    console.log(`Idle Workers: ${metrics.idleWorkers}`);
    console.log(`Total Tasks Processed: ${metrics.totalTasksProcessed}`);
    console.log(`Average Task Time: ${metrics.averageTaskTime.toFixed(2)}ms`);
    console.log(`Throughput: ${metrics.throughput.toFixed(2)} tasks/sec`);
    console.log(`Efficiency: ${metrics.efficiency.toFixed(1)}%`);
    console.log(`Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
    console.log(`Peak Memory Usage: ${(metrics.peakMemoryUsage / 1024 / 1024).toFixed(1)}MB`);

    // Get worker health
    console.log('\n🏥 Worker Health Status:');
    metrics.workerHealth.forEach((worker, index) => {
      console.log(`Worker ${index + 1}:`);
      console.log(`  Status: ${worker.status}`);
      console.log(`  Tasks Completed: ${worker.tasksCompleted}`);
      console.log(`  Average Task Time: ${worker.averageTaskTime.toFixed(2)}ms`);
      console.log(`  Memory Usage: ${(worker.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
      console.log(`  Error Count: ${worker.errorCount}`);
      console.log(`  Efficiency: ${worker.efficiency.toFixed(1)}%`);
    });

    // Get performance trends
    monitor.stopMonitoring();
    const trends = monitor.getTrends();
    const summary = monitor.getSummary();

    if (summary) {
      console.log('\n📈 Performance Summary:');
      console.log(`Average Throughput: ${summary.averageThroughput.toFixed(2)} tasks/sec`);
      console.log(`Peak Throughput: ${summary.peakThroughput.toFixed(2)} tasks/sec`);
      console.log(`Average Efficiency: ${summary.averageEfficiency.toFixed(1)}%`);
      console.log(`Peak Efficiency: ${summary.peakEfficiency.toFixed(1)}%`);
      console.log(`Measurements Collected: ${summary.measurementCount}`);
    }

  } finally {
    monitor.stopMonitoring();
    await workerManager.shutdown();
    console.log('\n✅ Performance monitoring demo complete');
  }
}

/**
 * Demo: Scaling and Load Balancing
 */
async function demoScalingAndLoadBalancing() {
  console.log('\n\n⚖️  Demo: Scaling and Load Balancing');
  console.log('=' .repeat(50));

  const workerManager = createWorkerManager({
    minWorkers: 1,
    maxWorkers: 8,
    autoScale: true,
    scalingThreshold: 2,
    loadBalancing: 'least-busy'
  });

  await workerManager.initialize();

  try {
    console.log('📊 Initial worker count:', workerManager.getWorkerInfo().length);

    // Generate varying workload to trigger scaling
    console.log('\n🚀 Generating light workload...');
    await Promise.all([
      workerManager.balanceEquation('H2 + Cl2 -> HCl'),
      workerManager.balanceEquation('Na + H2O -> NaOH + H2')
    ]);

    console.log('Current workers:', workerManager.getWorkerInfo().length);

    console.log('\n🔥 Generating heavy workload...');
    const heavyTasks: Promise<any>[] = [];
    for (let i = 0; i < 10; i++) {
      heavyTasks.push(
        workerManager.calculateThermodynamics(
          [
            { formula: `C${i+1}H${(i+1)*2}`, amount: 1.0 },
            { formula: 'O2', amount: (i+1)*1.5 }
          ],
          { temperature: 298.15 + i*10 },
          ['enthalpy', 'entropy', 'gibbs']
        )
      );
    }

    await Promise.all(heavyTasks);
    console.log('Workers after heavy load:', workerManager.getWorkerInfo().length);

    // Manual scaling demonstration
    console.log('\n📈 Manual scaling to 6 workers...');
    await workerManager.scaleWorkers(6);
    console.log('Workers after manual scaling:', workerManager.getWorkerInfo().length);

    console.log('\n📉 Scaling down to 2 workers...');
    await workerManager.scaleWorkers(2);
    console.log('Workers after scaling down:', workerManager.getWorkerInfo().length);

    // Show worker distribution
    const workerInfo = workerManager.getWorkerInfo();
    console.log('\n👥 Current Worker Status:');
    workerInfo.forEach((worker, index) => {
      console.log(`Worker ${index + 1}: ${worker.status} (${worker.tasksCompleted} tasks completed)`);
    });

  } finally {
    await workerManager.shutdown();
    console.log('\n✅ Scaling and load balancing demo complete');
  }
}

/**
 * Demo: Performance Benchmarking
 */
async function demoBenchmarking() {
  console.log('\n\n⏱️  Demo: Performance Benchmarking');
  console.log('=' .repeat(50));

  const workerManager = createWorkerManager({
    minWorkers: 4,
    maxWorkers: 4,
    autoScale: false
  });

  await workerManager.initialize();

  try {
    console.log('🏁 Running performance benchmarks...');

    // Benchmark different operations
    const operations = [
      'equation_balancing',
      'thermodynamics', 
      'matrix_solving',
      'batch_analysis'
    ] as const;

    for (const operation of operations) {
      console.log(`\n📊 Benchmarking ${operation}...`);
      
      const benchmark = await workerManager.runBenchmark(operation, 10);
      
      console.log(`Operation: ${benchmark.operation}`);
      console.log(`Data Size: ${benchmark.dataSize}`);
      console.log(`Single Thread Time: ${benchmark.singleThreadTime.toFixed(2)}ms`);
      console.log(`Multi Thread Time: ${benchmark.multiThreadTime.toFixed(2)}ms`);
      console.log(`Speedup: ${benchmark.speedup.toFixed(2)}x`);
      console.log(`Efficiency: ${benchmark.efficiency.toFixed(1)}%`);
      console.log(`Memory Overhead: ${(benchmark.memoryOverhead / 1024 / 1024).toFixed(1)}MB`);
      console.log(`Optimal Worker Count: ${benchmark.optimalWorkerCount}`);
    }

  } finally {
    await workerManager.shutdown();
    console.log('\n✅ Benchmarking demo complete');
  }
}

/**
 * Main demo function
 */
async function runWorkerThreadDemo() {
  console.log('🧪 CREB Worker Thread System Demo');
  console.log('🔬 Advanced Chemistry Calculations with Multi-Threading');
  console.log('=' .repeat(60));

  try {
    await demoBasicUsage();
    await demoPerformanceMonitoring();
    await demoScalingAndLoadBalancing();
    await demoBenchmarking();

    console.log('\n\n🎉 All demos completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Basic worker thread operations');
    console.log('✅ Performance monitoring and metrics');
    console.log('✅ Auto-scaling and load balancing');
    console.log('✅ Performance benchmarking');
    console.log('\n🚀 Worker thread system is ready for production use!');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runWorkerThreadDemo().catch(console.error);
}

export { runWorkerThreadDemo };
