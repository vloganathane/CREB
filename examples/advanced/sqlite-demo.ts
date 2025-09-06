/**
 * SQLite Storage Provider Usage Example
 * Demonstrates how to use the SQLite provider for local data management
 */

import { SQLiteStorageProvider } from '../src/data/SQLiteStorageProvider';
import { CompoundDatabase } from '../src/data/types';

async function demonstrateSQLiteUsage() {
  console.log('🗄️ SQLite Storage Provider Demo\n');

  // Initialize the provider
  const provider = new SQLiteStorageProvider({
    databasePath: './chemical_database.db',
    enableWAL: true,
    cacheSize: 10000
  });

  try {
    // Initialize the database
    await provider.initialize();
    console.log('✅ Database initialized');

    // Sample compound data
    const ethanol: CompoundDatabase = {
      formula: 'C2H6O',
      name: 'Ethanol',
      iupacName: 'ethanol',
      casNumber: '64-17-5',
      smiles: 'CCO',
      molecularWeight: 46.07,
      thermodynamicProperties: {
        deltaHf: -277.7, // kJ/mol
        entropy: 160.7, // J/(mol·K)
        heatCapacity: 112.3, // J/(mol·K)
        temperatureRange: [273.15, 373.15],
        meltingPoint: 159.05, // K
        boilingPoint: 351.44, // K
        criticalTemperature: 513.9, // K
        criticalPressure: 6137000, // Pa
        acentricFactor: 0.635
      },
      physicalProperties: {
        density: 789, // kg/m³
        refractiveIndex: 1.361,
        thermalConductivity: 0.167, // W/(m·K)
        solubility: {
          water: 1000000, // fully miscible
          organic: [
            { solvent: 'benzene', solubility: 1000000 },
            { solvent: 'chloroform', solubility: 1000000 }
          ]
        }
      },
      safetyData: {
        hazardSymbols: ['GHS02', 'GHS07'],
        hazardStatements: ['H225', 'H319', 'H371'],
        precautionaryStatements: ['P210', 'P233', 'P305+P351+P338'],
        flashPoint: 286.15, // K
        autoignitionTemperature: 636.15, // K
        explosiveLimits: {
          lower: 3.3, // vol%
          upper: 19.0 // vol%
        }
      },
      sources: ['NIST', 'example'],
      lastUpdated: new Date(),
      confidence: 0.95
    };

    // Store the compound
    console.log('\n📥 Storing compound...');
    const stored = await provider.addCompound(ethanol);
    console.log(`✅ Compound stored: ${stored}`);

    // Retrieve by formula
    console.log('\n🔍 Retrieving compound by formula...');
    const retrieved = await provider.getCompound('C2H6O');
    if (retrieved) {
      console.log(`✅ Found: ${retrieved.name} (${retrieved.formula})`);
      console.log(`   Molecular Weight: ${retrieved.molecularWeight} g/mol`);
      console.log(`   Boiling Point: ${retrieved.thermodynamicProperties.boilingPoint} K`);
    }

    // Search with various criteria
    console.log('\n🔎 Searching compounds...');
    
    // Search by CAS number
    const caResults = await provider.searchCompounds({ casNumber: '64-17-5' });
    console.log(`✅ CAS search results: ${caResults.length} compounds`);

    // Search by name (partial match)
    const nameResults = await provider.searchCompounds({ name: 'ethanol' });
    console.log(`✅ Name search results: ${nameResults.length} compounds`);

    // Add more sample data
    console.log('\n📥 Adding more compounds for demonstration...');
    const compounds = [
      {
        formula: 'H2O',
        name: 'Water',
        iupacName: 'water',
        casNumber: '7732-18-5',
        molecularWeight: 18.015,
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273.15, 373.15],
          meltingPoint: 273.15,
          boilingPoint: 373.15
        },
        physicalProperties: {
          density: 1000,
          refractiveIndex: 1.333
        },
        safetyData: {
          hazardSymbols: [],
          hazardStatements: [],
          precautionaryStatements: []
        },
        sources: ['NIST'],
        lastUpdated: new Date(),
        confidence: 1.0
      },
      {
        formula: 'CH4',
        name: 'Methane',
        iupacName: 'methane',
        casNumber: '74-82-8',
        molecularWeight: 16.043,
        thermodynamicProperties: {
          deltaHf: -74.9,
          entropy: 186.3,
          heatCapacity: 35.7,
          temperatureRange: [90.7, 190.6],
          meltingPoint: 90.7,
          boilingPoint: 111.7
        },
        physicalProperties: {
          density: 0.717 // at boiling point
        },
        safetyData: {
          hazardSymbols: ['GHS02'],
          hazardStatements: ['H220'],
          precautionaryStatements: ['P210']
        },
        sources: ['NIST'],
        lastUpdated: new Date(),
        confidence: 0.98
      }
    ];

    // Import the additional data
    const importResult = await provider.importData(compounds, 'json');
    console.log(`✅ Import result: ${importResult.imported} compounds imported, ${importResult.failed} failed`);

    // Get database statistics
    console.log('\n📊 Database Statistics:');
    const stats = await provider.getStatistics();
    console.log(`   Total compounds: ${stats.totalCompounds}`);
    console.log(`   Storage size: ${stats.storageSize || 'N/A'}`);

    // Demonstrate search capabilities
    console.log('\n🔍 Advanced Search Examples:');
    
    // Get all compounds
    const allCompounds = await provider.getAllCompounds();
    console.log(`✅ Total compounds in database: ${allCompounds.length}`);

    // Search for compounds with specific properties
    console.log('\n📋 Compound Properties:');
    allCompounds.forEach(compound => {
      console.log(`   ${compound.name} (${compound.formula})`);
      console.log(`     MW: ${compound.molecularWeight} g/mol`);
      console.log(`     BP: ${compound.thermodynamicProperties.boilingPoint} K`);
      console.log(`     Sources: ${compound.sources.join(', ')}`);
      console.log('');
    });

    // Optimize database for better performance
    console.log('🔧 Optimizing database...');
    await provider.optimize();
    console.log('✅ Database optimized');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Always close the database connection
    await provider.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Export for use in other modules
export { demonstrateSQLiteUsage };

// Run the demo if this file is executed directly
if (require.main === module) {
  demonstrateSQLiteUsage().catch(console.error);
}
