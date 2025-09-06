/**
 * Enhanced Data Integration Examples
 * Comprehensive examples of using the new data management capabilities
 */

import {
  ChemicalDatabaseManager,
  NISTWebBookIntegration,
  DataValidationService,
  CompoundDatabase,
  DatabaseQuery,
  DataExportOptions
} from '../src/index';

// Initialize the enhanced data integration system
console.log('🚀 Enhanced Data Integration Examples\n');

/**
 * Example 1: Basic Database Operations
 */
async function basicDatabaseOperations() {
  console.log('📊 Example 1: Basic Database Operations');
  
  const dbManager = new ChemicalDatabaseManager();
  
  // Get database statistics
  const stats = dbManager.getStatistics();
  console.log(`Database contains ${stats.totalCompounds} compounds`);
  console.log('Source distribution:', stats.sourceCounts);
  console.log('Confidence distribution:', stats.confidenceDistribution);
  
  // Query by formula
  const waterResults = await dbManager.query({ formula: 'H2O' });
  console.log('\nWater compound:', waterResults[0]);
  
  // Query by name (partial match)
  const methanResults = await dbManager.query({ name: 'methane' });
  console.log('Methane search results:', methanResults.length);
  
  console.log('✅ Basic operations completed\n');
}

/**
 * Example 2: Adding Custom Compounds
 */
async function addCustomCompounds() {
  console.log('📝 Example 2: Adding Custom Compounds');
  
  const dbManager = new ChemicalDatabaseManager();
  
  // Add a custom compound with full properties
  const customCompound: Partial<CompoundDatabase> = {
    formula: 'C2H5OH',
    name: 'Ethanol',
    commonName: 'Ethyl alcohol',
    casNumber: '64-17-5',
    smiles: 'CCO',
    molecularWeight: 46.068,
    thermodynamicProperties: {
      deltaHf: -277.7, // kJ/mol
      deltaGf: -174.8, // kJ/mol
      entropy: 160.7,  // J/(mol·K)
      heatCapacity: 65.4, // J/(mol·K)
      temperatureRange: [200, 1000],
      meltingPoint: 159.05, // K
      boilingPoint: 351.44, // K
      vaporPressure: [
        { temperature: 293, pressure: 5865 },
        { temperature: 313, pressure: 13330 },
        { temperature: 333, pressure: 26650 }
      ]
    },
    physicalProperties: {
      density: 789.3, // kg/m³ at 20°C
      viscosity: 0.001074, // Pa·s at 25°C
      refractiveIndex: 1.361,
      solubility: {
        water: 1000000 // Miscible with water
      }
    },
    safetyData: {
      hazardSymbols: ['GHS02', 'GHS07'],
      hazardStatements: ['H225', 'H319', 'H371'],
      precautionaryStatements: ['P210', 'P233', 'P305+P351+P338'],
      flashPoint: 285.15, // K (12°C)
      autoignitionTemperature: 636.15, // K (363°C)
      explosiveLimits: {
        lower: 3.3, // vol%
        upper: 19.0 // vol%
      }
    },
    sources: ['custom', 'literature'],
    confidence: 0.92
  };
  
  const success = await dbManager.addCompound(customCompound);
  console.log('Compound added successfully:', success);
  
  // Verify the compound was added
  const ethanolResults = await dbManager.query({ formula: 'C2H5OH' });
  console.log('Ethanol properties:', ethanolResults[0]?.thermodynamicProperties);
  
  console.log('✅ Custom compound operations completed\n');
}

/**
 * Example 3: NIST WebBook Integration
 */
async function nistIntegration() {
  console.log('🔬 Example 3: NIST WebBook Integration');
  
  const nistIntegration = new NISTWebBookIntegration();
  
  // Query single compound
  const oxygenData = await nistIntegration.queryCompound('O2', 'formula');
  if (oxygenData) {
    console.log('NIST Oxygen data:');
    console.log('- Formula:', oxygenData.formula);
    console.log('- Name:', oxygenData.name);
    console.log('- Enthalpy of formation:', oxygenData.thermodynamicProperties.deltaHf, 'kJ/mol');
    console.log('- Entropy:', oxygenData.thermodynamicProperties.entropy, 'J/(mol·K)');
    console.log('- Critical temperature:', oxygenData.thermodynamicProperties.criticalTemperature, 'K');
    console.log('- Confidence:', oxygenData.confidence);
  }
  
  // Batch query multiple compounds
  const formulas = ['N2', 'H2', 'CO'];
  const batchResults = await nistIntegration.batchQuery(formulas, 'formula');
  console.log(`\nBatch query results: ${batchResults.length}/${formulas.length} compounds found`);
  
  batchResults.forEach(compound => {
    console.log(`- ${compound.formula} (${compound.name}): ΔHf = ${compound.thermodynamicProperties.deltaHf} kJ/mol`);
  });
  
  // Cache statistics
  const cacheStats = nistIntegration.getCacheStats();
  console.log('\nCache statistics:', cacheStats);
  
  console.log('✅ NIST integration completed\n');
}

/**
 * Example 4: Data Validation
 */
async function dataValidation() {
  console.log('✅ Example 4: Data Validation');
  
  const validator = new DataValidationService();
  
  // Validate a good compound
  const goodCompound: CompoundDatabase = {
    formula: 'NH3',
    name: 'Ammonia',
    molecularWeight: 17.031,
    thermodynamicProperties: {
      deltaHf: -45.9,
      entropy: 192.8,
      heatCapacity: 35.1,
      temperatureRange: [200, 1500],
      meltingPoint: 195.42,
      boilingPoint: 239.82
    },
    physicalProperties: {
      density: 0.73, // kg/m³ at STP
      solubility: {
        water: 470000 // Very soluble
      }
    },
    sources: ['validated'],
    lastUpdated: new Date(),
    confidence: 0.95
  };
  
  const goodResult = validator.validateCompound(goodCompound);
  console.log('Good compound validation:');
  console.log('- Valid:', goodResult.isValid);
  console.log('- Quality score:', goodResult.score);
  console.log('- Errors:', goodResult.errors.length);
  console.log('- Warnings:', goodResult.warnings.length);
  
  // Validate a problematic compound
  const badCompound: CompoundDatabase = {
    formula: 'H2O@#', // Invalid formula
    name: '',         // Missing name
    molecularWeight: -10, // Invalid molecular weight
    thermodynamicProperties: {
      deltaHf: -10000, // Outside reasonable range
      entropy: -50,    // Negative entropy (violates 3rd law)
      heatCapacity: 1000, // Unreasonably high
      temperatureRange: [500, 200], // Invalid range (min > max)
      meltingPoint: 400,
      boilingPoint: 300 // Boiling point < melting point
    },
    physicalProperties: {
      density: -100 // Negative density
    },
    sources: ['unknown'],
    lastUpdated: new Date(),
    confidence: 2.0 // Out of range
  };
  
  const badResult = validator.validateCompound(badCompound);
  console.log('\nProblematic compound validation:');
  console.log('- Valid:', badResult.isValid);
  console.log('- Quality score:', badResult.score);
  console.log('- Critical errors:', badResult.errors.filter(e => e.severity === 'critical').length);
  console.log('- Major errors:', badResult.errors.filter(e => e.severity === 'major').length);
  
  // Show some specific errors
  badResult.errors.slice(0, 3).forEach(error => {
    console.log(`  - ${error.field}: ${error.message}`);
  });
  
  console.log('✅ Data validation completed\n');
}

/**
 * Example 5: Data Import/Export
 */
async function dataImportExport() {
  console.log('📁 Example 5: Data Import/Export');
  
  const dbManager = new ChemicalDatabaseManager();
  
  // Export current database as JSON
  const jsonExport = dbManager.exportData({
    format: 'json',
    fields: ['formula', 'name', 'molecularWeight', 'thermodynamicProperties.deltaHf'],
    includeMetadata: true
  });
  
  console.log('JSON export sample (first 200 characters):');
  console.log(jsonExport.substring(0, 200) + '...');
  
  // Export as CSV
  const csvExport = dbManager.exportData({
    format: 'csv',
    fields: ['formula', 'name', 'molecularWeight'],
    filter: (compound) => compound.molecularWeight < 100 // Only light compounds
  });
  
  console.log('\nCSV export sample:');
  console.log(csvExport.split('\n').slice(0, 4).join('\n'));
  
  // Import new data from JSON
  const importData = [
    {
      formula: 'C6H12O6',
      name: 'Glucose',
      molecularWeight: 180.156,
      thermodynamicProperties: {
        deltaHf: -1273.3,
        entropy: 212.1,
        heatCapacity: 218.6,
        temperatureRange: [298, 1000]
      }
    },
    {
      formula: 'C12H22O11',
      name: 'Sucrose',
      molecularWeight: 342.297,
      thermodynamicProperties: {
        deltaHf: -2226.1,
        entropy: 360.2,
        heatCapacity: 424.3,
        temperatureRange: [298, 800]
      }
    }
  ];
  
  const importResult = await dbManager.importData(importData, 'json');
  console.log('\nImport results:');
  console.log('- Success:', importResult.success);
  console.log('- Imported:', importResult.imported);
  console.log('- Failed:', importResult.failed);
  
  // Import from CSV
  const csvData = `formula,name,molecular_weight,deltahf,entropy
C8H10,Ethylbenzene,106.165,-12.5,255.2
C10H8,Naphthalene,128.171,75.4,167.4`;
  
  const csvImportResult = await dbManager.importData(csvData, 'csv');
  console.log('\nCSV import results:');
  console.log('- Success:', csvImportResult.success);
  console.log('- Imported:', csvImportResult.imported);
  
  console.log('✅ Import/export operations completed\n');
}

/**
 * Example 6: Advanced Queries and Filtering
 */
async function advancedQueries() {
  console.log('🔍 Example 6: Advanced Queries and Filtering');
  
  const dbManager = new ChemicalDatabaseManager();
  
  // Query with multiple criteria
  const query: DatabaseQuery = {
    includeUncertain: false,
    maxResults: 5
  };
  
  const highConfidenceCompounds = await dbManager.query(query);
  console.log('High confidence compounds:', highConfidenceCompounds.length);
  
  // Export with complex filtering
  const organicCompounds = dbManager.exportData({
    format: 'json',
    filter: (compound) => {
      // Filter for organic compounds (containing carbon)
      return compound.formula.includes('C') && compound.molecularWeight > 20;
    },
    fields: ['formula', 'name', 'molecularWeight']
  });
  
  const organicData = JSON.parse(organicCompounds);
  console.log('Organic compounds found:', organicData.compounds.length);
  
  // Get compounds by source
  const allCompounds = dbManager.getAllCompounds();
  const nistCompounds = allCompounds.filter(c => c.sources.includes('nist'));
  const localCompounds = allCompounds.filter(c => c.sources.includes('local'));
  
  console.log('Compounds by source:');
  console.log('- NIST:', nistCompounds.length);
  console.log('- Local:', localCompounds.length);
  
  console.log('✅ Advanced queries completed\n');
}

/**
 * Example 7: Integration with Thermodynamics
 */
async function thermodynamicsIntegration() {
  console.log('🌡️  Example 7: Integration with Thermodynamics');
  
  const dbManager = new ChemicalDatabaseManager();
  
  // Get enhanced thermodynamic data for a reaction
  const reactants = ['CH4', 'O2'];
  const products = ['CO2', 'H2O'];
  
  console.log('Enhanced thermodynamic data for combustion reaction:');
  console.log('CH4 + 2O2 → CO2 + 2H2O\n');
  
  for (const formula of [...reactants, ...products]) {
    const compounds = await dbManager.query({ formula, maxResults: 1 });
    if (compounds.length > 0) {
      const compound = compounds[0];
      console.log(`${formula} (${compound.name}):`);
      console.log(`  ΔHf = ${compound.thermodynamicProperties.deltaHf} kJ/mol`);
      console.log(`  S° = ${compound.thermodynamicProperties.entropy} J/(mol·K)`);
      console.log(`  Cp = ${compound.thermodynamicProperties.heatCapacity} J/(mol·K)`);
      
      if (compound.thermodynamicProperties.uncertainties) {
        console.log(`  Uncertainty: ±${compound.thermodynamicProperties.uncertainties.deltaHf} kJ/mol`);
      }
      
      if (compound.thermodynamicProperties.criticalTemperature) {
        console.log(`  Critical T: ${compound.thermodynamicProperties.criticalTemperature} K`);
      }
      console.log();
    }
  }
  
  // Use backward compatibility for existing thermodynamics calculator
  const waterProps = await dbManager.getCompound('H2O');
  if (waterProps) {
    console.log('Backward compatible water properties:');
    console.log('- ΔHf:', waterProps.deltaHf, 'kJ/mol');
    console.log('- S°:', waterProps.entropy, 'J/(mol·K)');
    console.log('- Temperature range:', waterProps.temperatureRange);
  }
  
  console.log('✅ Thermodynamics integration completed\n');
}

/**
 * Example 8: Batch Processing and Quality Control
 */
async function batchProcessingQC() {
  console.log('⚙️ Example 8: Batch Processing and Quality Control');
  
  const dbManager = new ChemicalDatabaseManager();
  const validator = new DataValidationService();
  
  // Get all compounds for quality assessment
  const allCompounds = dbManager.getAllCompounds();
  console.log(`Processing ${allCompounds.length} compounds for quality control...`);
  
  // Batch validate all compounds
  const validationResults = validator.batchValidate(allCompounds);
  const summary = validator.getValidationSummary(validationResults);
  
  console.log('\nQuality Control Summary:');
  console.log('- Total compounds:', summary.totalCompounds);
  console.log('- Valid compounds:', summary.validCompounds);
  console.log('- Average quality score:', summary.averageScore.toFixed(1));
  console.log('- Critical errors:', summary.criticalErrors);
  console.log('- Major errors:', summary.majorErrors);
  console.log('- Minor errors:', summary.minorErrors);
  console.log('- Warnings:', summary.warnings);
  
  // Identify compounds needing attention
  const problematicCompounds = Array.from(validationResults.entries())
    .filter(([_, result]) => !result.isValid || result.score < 70)
    .map(([formula, result]) => ({ formula, score: result.score, valid: result.isValid }));
  
  if (problematicCompounds.length > 0) {
    console.log('\nCompounds needing attention:');
    problematicCompounds.forEach(({ formula, score, valid }) => {
      console.log(`- ${formula}: Score ${score.toFixed(1)}, Valid: ${valid}`);
    });
  }
  
  // Export quality report
  const qualityReport = {
    timestamp: new Date().toISOString(),
    summary,
    problematicCompounds,
    recommendations: [
      'Review compounds with scores below 70',
      'Verify critical errors immediately',
      'Consider adding uncertainties for NIST-sourced data',
      'Update compound sources and confidence levels'
    ]
  };
  
  console.log('\n📊 Quality report generated');
  console.log('Recommendations:', qualityReport.recommendations.length);
  
  console.log('✅ Batch processing and QC completed\n');
}

// Run all examples
async function runAllExamples() {
  try {
    await basicDatabaseOperations();
    await addCustomCompounds();
    await nistIntegration();
    await dataValidation();
    await dataImportExport();
    await advancedQueries();
    await thermodynamicsIntegration();
    await batchProcessingQC();
    
    console.log('🎉 All Enhanced Data Integration examples completed successfully!');
    console.log('\nThe Enhanced Data Integration system provides:');
    console.log('✓ Comprehensive chemical database management');
    console.log('✓ NIST WebBook integration capabilities');
    console.log('✓ Advanced data validation and quality control');
    console.log('✓ Flexible import/export in multiple formats');
    console.log('✓ Backward compatibility with existing systems');
    console.log('✓ Robust error handling and uncertainty tracking');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export for use in other modules
export {
  basicDatabaseOperations,
  addCustomCompounds,
  nistIntegration,
  dataValidation,
  dataImportExport,
  advancedQueries,
  thermodynamicsIntegration,
  batchProcessingQC,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
