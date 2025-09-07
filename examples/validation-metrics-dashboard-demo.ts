/**
 * @fileoverview Validation Metrics Dashboard Demo
 * 
 * Demonstrates how to use the validation metrics dashboard
 * for real-time monitoring and performance analysis.
 */

import {
  createValidationPipeline,
  validateChemicalFormula,
  validateThermodynamicProperties
} from '../src/data/validation/index';

import {
  ValidationMetricsDashboard,
  createValidationDashboard,
  globalValidationDashboard,
  formatMetricsForConsole
} from '../src/data/validation/metrics/ValidationMetricsDashboard';

/**
 * Demo: Basic Metrics Dashboard Usage
 */
async function basicMetricsDashboardDemo(): Promise<void> {
  console.log('🔬 Starting Validation Metrics Dashboard Demo...\n');

  // Create a custom dashboard
  const dashboard = createValidationDashboard({
    updateInterval: 500,
    realTimeUpdates: true,
    memoryMonitoring: true,
    percentileTracking: true
  });

  // Set up event listeners
  dashboard.on('metrics:updated', (metrics) => {
    console.log(`📊 Metrics updated - Total validations: ${metrics.totalValidations}`);
  });

  dashboard.on('metrics:realtime', (metrics) => {
    if (metrics.totalValidations % 10 === 0) {
      console.log(`⚡ Real-time update - Rate: ${metrics.validationsPerSecond}/sec`);
    }
  });

  // Create validation pipeline
  const pipeline = createValidationPipeline();

  // Simulate validation workload
  console.log('🧪 Running validation workload...\n');

  const testFormulas = [
    'H2O', 'C6H12O6', 'NaCl', 'CaCO3', 'H2SO4',
    'CH4', 'C2H6', 'C3H8', 'NH3', 'CO2'
  ];

  const testProperties = [
    {
      temperature: 298.15,
      pressure: 1.0,
      enthalpy: -285.8,
      entropy: 69.9,
      heatCapacity: 75.3
    },
    {
      temperature: 373.15,
      pressure: 1.0,
      enthalpy: -241.8,
      entropy: 188.8,
      heatCapacity: 33.6
    }
  ];

  // Run multiple validations
  for (let i = 0; i < 50; i++) {
    const formula = testFormulas[i % testFormulas.length];
    const properties = testProperties[i % testProperties.length];

    try {
      // Validate chemical formula
      const formulaResult = await validateChemicalFormula(formula);
      dashboard.recordValidation(formulaResult);

      // Validate thermodynamic properties
      const propsResult = await validateThermodynamicProperties(properties);
      dashboard.recordValidation(propsResult);

      // Add some delay to simulate real-world usage
      await new Promise(resolve => setTimeout(resolve, 10));

    } catch (error) {
      console.error(`❌ Error validating ${formula}:`, error);
    }
  }

  // Wait for metrics to update
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Display final metrics
  console.log('\n📈 Final Metrics:');
  console.log(formatMetricsForConsole(dashboard.getMetrics()));

  // Display dashboard data
  console.log('\n🎛️ Dashboard Data:');
  console.log(JSON.stringify(dashboard.getDashboardData(), null, 2));

  // Export metrics
  console.log('\n💾 Exported Metrics:');
  const exportedMetrics = dashboard.exportMetrics();
  console.log(exportedMetrics.substring(0, 500) + '...');

  // Cleanup
  dashboard.stop();
  console.log('\n✅ Dashboard demo completed!');
}

/**
 * Demo: Performance Stress Testing with Metrics
 */
async function performanceStressTestDemo(): Promise<void> {
  console.log('\n🚀 Starting Performance Stress Test with Metrics...\n');

  const dashboard = createValidationDashboard({
    updateInterval: 100,
    maxTimeSeriesPoints: 200,
    realTimeUpdates: true
  });

  // Monitor performance during stress test
  dashboard.on('metrics:realtime', (metrics) => {
    if (metrics.validationsPerSecond > 0) {
      console.log(`⚡ Performance: ${metrics.validationsPerSecond}/sec, ` +
                 `Avg: ${metrics.averageValidationTime.toFixed(2)}ms, ` +
                 `P95: ${metrics.percentiles.p95.toFixed(2)}ms`);
    }
  });

  const pipeline = createValidationPipeline();

  // Generate test data
  const testData = [];
  for (let i = 0; i < 1000; i++) {
    testData.push(`C${Math.floor(Math.random() * 20) + 1}H${Math.floor(Math.random() * 40) + 1}O${Math.floor(Math.random() * 10) + 1}`);
  }

  console.log(`🔬 Running stress test with ${testData.length} validations...\n`);

  const startTime = Date.now();

  // Run concurrent validations
  const batchSize = 10;
  for (let i = 0; i < testData.length; i += batchSize) {
    const batch = testData.slice(i, i + batchSize);
    const promises = batch.map(async (formula) => {
      try {
        const result = await validateChemicalFormula(formula);
        dashboard.recordValidation(result);
        return result;
      } catch (error) {
        console.error(`Error validating ${formula}:`, error);
        return null;
      }
    });

    await Promise.all(promises);

    // Brief pause between batches
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log(`\n🏁 Stress test completed in ${totalTime}ms`);

  // Final metrics
  const finalMetrics = dashboard.getMetrics();
  console.log('\n📊 Stress Test Results:');
  console.log(`• Total Validations: ${finalMetrics.totalValidations}`);
  console.log(`• Success Rate: ${((finalMetrics.successfulValidations / finalMetrics.totalValidations) * 100).toFixed(2)}%`);
  console.log(`• Average Time: ${finalMetrics.averageValidationTime.toFixed(2)}ms`);
  console.log(`• Peak Time: ${finalMetrics.peakValidationTime.toFixed(2)}ms`);
  console.log(`• P95 Time: ${finalMetrics.percentiles.p95.toFixed(2)}ms`);
  console.log(`• Throughput: ${(finalMetrics.totalValidations / (totalTime / 1000)).toFixed(2)} validations/sec`);

  dashboard.stop();
}

/**
 * Demo: Real-time Monitoring with Global Dashboard
 */
async function realTimeMonitoringDemo(): Promise<void> {
  console.log('\n📡 Starting Real-time Monitoring Demo...\n');

  // Use global dashboard
  const dashboard = globalValidationDashboard;

  // Set up monitoring
  let updateCount = 0;
  const monitorCallback = (metrics: any) => {
    updateCount++;
    if (updateCount % 5 === 0) {
      console.log(`📈 [${new Date().toISOString()}] ` +
                 `Validations: ${metrics.totalValidations}, ` +
                 `Rate: ${metrics.validationsPerSecond}/sec, ` +
                 `Memory: ${metrics.memoryUsage.current.toFixed(1)}MB`);
    }
  };
  
  dashboard.on('metrics:realtime', monitorCallback);

  // Simulate continuous validation activity
  const pipeline = createValidationPipeline();
  let running = true;

  // Background validation task
  const validationTask = async () => {
    const formulas = ['H2O', 'CO2', 'CH4', 'NH3', 'O2'];
    while (running) {
      const formula = formulas[Math.floor(Math.random() * formulas.length)];
      try {
        const result = await validateChemicalFormula(formula);
        dashboard.recordValidation(result);
      } catch (error) {
        // Handle error silently
      }
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
  };

  // Start background task
  validationTask();

  // Run for 10 seconds
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Stop monitoring
  running = false;
  dashboard.removeListener('metrics:realtime', monitorCallback);

  console.log('\n📊 Real-time Monitoring Summary:');
  const summary = dashboard.getDashboardData();
  console.log(`• Total Updates: ${updateCount}`);
  console.log(`• Final Rate: ${summary.performance.currentRate}/sec`);
  console.log(`• Success Rate: ${summary.summary.successRate.toFixed(2)}%`);
  console.log(`• Memory Peak: ${summary.memory.peak.toFixed(2)}MB`);

  console.log('\n✅ Real-time monitoring demo completed!');
}

/**
 * Demo: Memory Usage Analysis
 */
async function memoryUsageAnalysisDemo(): Promise<void> {
  console.log('\n🧠 Starting Memory Usage Analysis Demo...\n');

  const dashboard = createValidationDashboard({
    updateInterval: 250,
    memoryMonitoring: true
  });

  const pipeline = createValidationPipeline();

  // Create memory pressure by validating large datasets
  console.log('🔬 Creating memory pressure with large validation workload...\n');

  for (let round = 1; round <= 5; round++) {
    console.log(`📊 Round ${round}/5 - Validating 200 formulas...`);

    const promises: Promise<any>[] = [];
    for (let i = 0; i < 200; i++) {
      const complexFormula = `C${i}H${i * 2}O${Math.floor(i / 2)}N${Math.floor(i / 10)}`;
      promises.push(
        validateChemicalFormula(complexFormula).then(result => {
          dashboard.recordValidation(result);
          return result;
        })
      );
    }

    await Promise.all(promises);

    const metrics = dashboard.getMetrics();
    console.log(`  💾 Memory: ${metrics.memoryUsage.current.toFixed(2)}MB ` +
               `(Peak: ${metrics.memoryUsage.peak.toFixed(2)}MB)`);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('  🗑️ Garbage collection triggered');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const finalMetrics = dashboard.getMetrics();
  console.log('\n🧠 Memory Analysis Results:');
  console.log(`• Current Usage: ${finalMetrics.memoryUsage.current.toFixed(2)}MB`);
  console.log(`• Peak Usage: ${finalMetrics.memoryUsage.peak.toFixed(2)}MB`);
  console.log(`• Average Usage: ${finalMetrics.memoryUsage.average.toFixed(2)}MB`);
  console.log(`• Total Validations: ${finalMetrics.totalValidations}`);

  dashboard.stop();
  console.log('\n✅ Memory analysis demo completed!');
}

/**
 * Main demo function
 */
async function runValidationMetricsDemos(): Promise<void> {
  try {
    await basicMetricsDashboardDemo();
    await performanceStressTestDemo();
    await realTimeMonitoringDemo();
    await memoryUsageAnalysisDemo();

    console.log('\n🎉 All validation metrics demos completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run demos if this file is executed directly
if (require.main === module) {
  runValidationMetricsDemos();
}

export {
  runValidationMetricsDemos,
  basicMetricsDashboardDemo,
  performanceStressTestDemo,
  realTimeMonitoringDemo,
  memoryUsageAnalysisDemo
};
