/**
 * PubChem-JS Performance Benchmark Demo
 * 
 * This demo tests the performance and caching capabilities of the library.
 * Run with: node demo/benchmark.js
 */

const { Compound, HTTPClient } = require('../dist/index.js');

class PubChemBenchmark {
  constructor() {
    this.results = [];
  }

  async benchmark(name, fn, iterations = 1) {
    console.log(`\n🔬 Running ${name}...`);
    
    const times = [];
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
      
      if (iterations > 1) {
        process.stdout.write(`  Iteration ${i + 1}/${iterations} - ${(end - start).toFixed(2)}ms\r`);
      }
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const result = {
      name,
      avgTime: avgTime.toFixed(2),
      minTime: minTime.toFixed(2),
      maxTime: maxTime.toFixed(2),
      iterations
    };

    this.results.push(result);

    if (iterations === 1) {
      console.log(`✅ Completed in ${avgTime.toFixed(2)}ms`);
    } else {
      console.log(`\n✅ Average: ${avgTime.toFixed(2)}ms (min: ${minTime.toFixed(2)}ms, max: ${maxTime.toFixed(2)}ms)`);
    }

    return result;
  }

  async runSingleCompoundTests() {
    console.log('\n📊 SINGLE COMPOUND BENCHMARKS');
    console.log('=' .repeat(50));

    // Test fetching by CID
    await this.benchmark('Fetch by CID (Benzene)', async () => {
      await Compound.fromCid(241);
    });

    // Test fetching by name
    await this.benchmark('Search by Name (Aspirin)', async () => {
      await Compound.fromName('aspirin');
    });

    // Test fetching by SMILES
    await this.benchmark('Search by SMILES (Water)', async () => {
      await Compound.fromSmiles('O');
    });
  }

  async runCachingTests() {
    console.log('\n🗄️  CACHING PERFORMANCE TESTS');
    console.log('=' .repeat(50));

    // First request (cache miss)
    await this.benchmark('First CID request (cache miss)', async () => {
      await Compound.fromCid(241);
    });

    // Second request (cache hit)
    await this.benchmark('Second CID request (cache hit)', async () => {
      await Compound.fromCid(241);
    });

    // Multiple requests to same CID
    await this.benchmark('Multiple cached requests', async () => {
      await Compound.fromCid(241);
    }, 5);
  }

  async runBatchTests() {
    console.log('\n⚡ BATCH PROCESSING TESTS');
    console.log('=' .repeat(50));

    const testCids = [241, 2244, 1983, 962, 5090]; // Various compounds

    // Sequential requests
    await this.benchmark('5 Sequential CID requests', async () => {
      for (const cid of testCids) {
        await Compound.fromCid(cid);
      }
    });

    // Parallel requests
    await this.benchmark('5 Parallel CID requests', async () => {
      await Promise.all(testCids.map(cid => Compound.fromCid(cid)));
    });

    // Mixed search types
    await this.benchmark('Mixed search types', async () => {
      await Promise.all([
        Compound.fromCid(241),
        Compound.fromName('aspirin'),
        Compound.fromSmiles('CCO'),
      ]);
    });
  }

  async runStressTest() {
    console.log('\n🚀 STRESS TEST');
    console.log('=' .repeat(50));

    const compounds = ['benzene', 'aspirin', 'caffeine', 'ethanol', 'glucose'];
    
    await this.benchmark('10 Name searches', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const compound = compounds[i % compounds.length];
        promises.push(Compound.fromName(compound));
      }
      await Promise.all(promises);
    });
  }

  async testPropertyAccess() {
    console.log('\n🔍 PROPERTY ACCESS PERFORMANCE');
    console.log('=' .repeat(50));

    const compound = await Compound.fromCid(241); // Get benzene

    await this.benchmark('Property access (cached compound)', async () => {
      // Access various properties
      const props = [
        compound.molecularFormula,
        compound.molecularWeight,
        compound.smiles,
        compound.isomericSmiles,
        compound.inchiKey,
        compound.iupacName,
      ];
      return props;
    }, 100);

    await this.benchmark('toDict() conversion', async () => {
      return compound.toDict();
    }, 50);
  }

  printSummary() {
    console.log('\n📈 BENCHMARK SUMMARY');
    console.log('=' .repeat(50));
    
    console.log('| Test Name                      | Avg Time  | Min Time  | Max Time  |');
    console.log('|--------------------------------|-----------|-----------|-----------|');
    
    this.results.forEach(result => {
      const name = result.name.padEnd(30);
      const avg = (result.avgTime + 'ms').padStart(8);
      const min = (result.minTime + 'ms').padStart(8);
      const max = (result.maxTime + 'ms').padStart(8);
      console.log(`| ${name} | ${avg} | ${min} | ${max} |`);
    });

    // Analysis
    console.log('\n🎯 PERFORMANCE INSIGHTS:');
    const fastestTest = this.results.reduce((min, test) => 
      parseFloat(test.avgTime) < parseFloat(min.avgTime) ? test : min
    );
    const slowestTest = this.results.reduce((max, test) => 
      parseFloat(test.avgTime) > parseFloat(max.avgTime) ? test : max
    );

    console.log(`   Fastest: ${fastestTest.name} (${fastestTest.avgTime}ms)`);
    console.log(`   Slowest: ${slowestTest.name} (${slowestTest.avgTime}ms)`);
    
    const cacheTests = this.results.filter(r => r.name.includes('cache'));
    if (cacheTests.length >= 2) {
      const cacheMiss = parseFloat(cacheTests[0].avgTime);
      const cacheHit = parseFloat(cacheTests[1].avgTime);
      const speedup = (cacheMiss / cacheHit).toFixed(1);
      console.log(`   Cache speedup: ${speedup}x faster`);
    }
  }

  async run() {
    console.log('🧪 PubChem-JS Performance Benchmark');
    console.log('Testing library performance and caching...\n');
    console.log('⚠️  This test requires internet connection and may take a few minutes.');
    
    try {
      await this.runSingleCompoundTests();
      await this.runCachingTests();
      await this.runBatchTests();
      await this.runStressTest();
      await this.testPropertyAccess();
      
      this.printSummary();
      
      console.log('\n✅ Benchmark completed successfully!');
      console.log('\n💡 Performance Tips:');
      console.log('   - Use caching to avoid repeated API calls');
      console.log('   - Batch parallel requests when possible');
      console.log('   - CID lookups are fastest (direct database access)');
      console.log('   - Property access is very fast (already parsed)');
      
    } catch (error) {
      console.error('❌ Benchmark failed:', error.message);
      console.error('\n💡 Common issues:');
      console.error('   - Network connection required');
      console.error('   - PubChem API rate limiting');
      console.error('   - Build the package first: npm run build');
      process.exit(1);
    }
  }
}

// Run the benchmark if this file is executed directly
if (require.main === module) {
  const benchmark = new PubChemBenchmark();
  benchmark.run().catch(console.error);
}

module.exports = { PubChemBenchmark };
