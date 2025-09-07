/**
 * AC-001 Advanced Caching Strategy - Quick Start Demo
 * 
 * This demo shows how to use the new advanced caching system in CREB-JS v1.6.0
 */

import { 
  CacheFactory, 
  CachedThermodynamicsCalculator, 
  CachedChemicalDatabase,
  CachedEquationBalancer,
  MultiLevelCache,
  AdvancedCache
} from 'creb-js';

async function demonstrateAdvancedCaching() {
  console.log('🚀 CREB-JS v1.6.0 - Advanced Caching Demo\n');

  // 1. Basic Cache Usage
  console.log('1. Basic Cache Operations:');
  const cache = CacheFactory.create('performance-optimized');
  
  // Store data with TTL
  await cache.set('equation1', { balanced: '2H2 + O2 = 2H2O', coefficients: [2, 1, 2] }, 3600000);
  
  // Retrieve with metrics
  const result = await cache.get('equation1');
  console.log(`   Cache Hit: ${result.hit}, Latency: ${result.latency}ms`);
  console.log(`   Value: ${JSON.stringify(result.value)}\n`);

  // 2. Performance Monitoring
  console.log('2. Performance Monitoring:');
  const stats = cache.getStats();
  console.log(`   Hit Rate: ${(stats.hitRate || 0).toFixed(2)}%`);
  console.log(`   Entries: ${stats.size}`);
  console.log(`   Memory Usage: ${((stats.memoryUsage || 0) / 1024).toFixed(2)} KB\n`);

  // 3. Cached Thermodynamics Calculator
  console.log('3. Cached Thermodynamics Calculator:');
  const thermoCalc = new CachedThermodynamicsCalculator();
  
  console.log('   First calculation (cache miss):');
  const start1 = Date.now();
  const thermo1 = await thermoCalc.calculateThermodynamics('CH4 + 2O2 = CO2 + 2H2O', 298.15, 101325);
  const time1 = Date.now() - start1;
  console.log(`   Time: ${time1}ms, ΔH: ${thermo1.enthalpy.toFixed(2)} kJ/mol`);
  
  console.log('   Second calculation (cache hit):');
  const start2 = Date.now();
  const thermo2 = await thermoCalc.calculateThermodynamics('CH4 + 2O2 = CO2 + 2H2O', 298.15, 101325);
  const time2 = Date.now() - start2;
  console.log(`   Time: ${time2}ms, ΔH: ${thermo2.enthalpy.toFixed(2)} kJ/mol`);
  console.log(`   Speed improvement: ${(time1 / time2).toFixed(1)}x faster\n`);

  // 4. Cached Chemical Database
  console.log('4. Cached Chemical Database:');
  const chemDB = new CachedChemicalDatabase();
  
  const compound = await chemDB.getCompound('H2O');
  console.log(`   Retrieved: ${compound?.name} (${compound?.formula})`);
  console.log(`   Molar Mass: ${compound?.molarMass.toFixed(3)} g/mol\n`);

  // 5. Cached Equation Balancer
  console.log('5. Cached Equation Balancer:');
  const balancer = new CachedEquationBalancer();
  
  const balanced = await balancer.balanceEquation('Fe + O2 = Fe2O3');
  console.log(`   Balanced: ${balanced.balanced}`);
  console.log(`   From Cache: ${balanced.fromCache}\n`);

  // 6. Multi-Level Cache
  console.log('6. Multi-Level Cache Hierarchy:');
  const multiCache = new MultiLevelCache();
  
  // Store in L3 (cold storage)
  await multiCache.set('complex-data', { computed: 'expensive calculation' }, 'L3');
  
  // Access will auto-promote to L2 and L1
  const retrieved = await multiCache.get('complex-data');
  console.log(`   Retrieved from: ${retrieved.level}`);
  console.log(`   Latency: ${retrieved.latency}ms\n`);

  // 7. Custom Cache Configuration
  console.log('7. Custom Cache Configuration:');
  const customCache = new AdvancedCache({
    maxSize: 5000,
    defaultTtl: 1800000, // 30 minutes
    evictionStrategy: 'adaptive',
    enableMetrics: true,
    memoryLimit: 50 * 1024 * 1024 // 50MB
  });

  // Event monitoring
  customCache.addEventListener('memory-pressure', (event) => {
    console.log(`   ⚠️  Memory pressure detected: ${event.metadata?.usage}%`);
  });

  customCache.addEventListener('eviction', (event) => {
    console.log(`   🗑️  Evicted key: ${event.key} (strategy: ${event.metadata?.strategy})`);
  });

  await customCache.set('test-key', 'test-value');
  console.log('   Custom cache configured with adaptive eviction\n');

  // 8. Health Check
  console.log('8. System Health Check:');
  const health = await cache.healthCheck();
  console.log(`   Status: ${health.status}`);
  console.log(`   Uptime: ${(health.uptime / 1000).toFixed(2)}s`);
  console.log(`   Memory Health: ${health.memoryHealth}%\n`);

  // 9. Performance Report
  console.log('9. Performance Report:');
  console.log(balancer.getPerformanceReport());

  // Cleanup
  cache.shutdown();
  thermoCalc.shutdown();
  chemDB.shutdown();
  balancer.shutdown();
  multiCache.shutdown();
  customCache.shutdown();

  console.log('\n✅ Advanced Caching Demo Complete!');
  console.log('📖 See docs/AC-001_IMPLEMENTATION_SUMMARY.md for full documentation');
}

// Run the demo
if (require.main === module) {
  demonstrateAdvancedCaching().catch(console.error);
}

export { demonstrateAdvancedCaching };
