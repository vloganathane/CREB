/**
 * Energy Profile Visualization Examples
 * Demonstrates how to use the new energy profile visualization features in CREB-JS v1.6.0
 */

import { 
  EnergyProfileGenerator, 
  createEnergyProfile, 
  exportEnergyProfile,
  ThermodynamicsCalculator,
  ReactionKinetics
} from '../src/index';

// Example 1: Basic Energy Profile for a Simple Reaction
async function basicEnergyProfileExample() {
  console.log('=== Basic Energy Profile Example ===');
  
  // Create thermodynamics data (this would typically come from ThermodynamicsCalculator)
  const thermodynamics = {
    deltaH: -45.2,      // Exothermic reaction
    deltaS: 28.5,       // Entropy increase
    deltaG: -53.7,      // Spontaneous
    equilibriumConstant: 2.4e9,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: {
      range: [250, 400] as [number, number],
      deltaGvsT: [
        { temperature: 250, deltaG: -48.2 },
        { temperature: 298.15, deltaG: -53.7 },
        { temperature: 350, deltaG: -58.9 }
      ]
    },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -45.2,
    gibbsFreeEnergy: -53.7,
    isSpontaneous: true
  };

  // Generate basic energy profile
  const profile = createEnergyProfile(thermodynamics);
  
  console.log('Energy Profile Summary:');
  console.log(`- Reaction type: ${profile.isExothermic ? 'Exothermic' : 'Endothermic'}`);
  console.log(`- Energy change (ΔE): ${profile.deltaE} kJ/mol`);
  console.log(`- Activation energy: ${profile.activationEnergyForward} kJ/mol`);
  console.log(`- Number of steps: ${profile.steps}`);
  console.log(`- Temperature: ${profile.temperature} K`);
  
  console.log('\nEnergy Points:');
  profile.points.forEach((point, index) => {
    console.log(`  ${index + 1}. ${point.label}: ${point.energy.toFixed(1)} kJ/mol (${point.type})`);
  });

  return profile;
}

// Example 2: Multi-step Reaction with Kinetics Data
async function kineticsEnergyProfileExample() {
  console.log('\n=== Multi-step Kinetics Energy Profile Example ===');
  
  // Mock kinetics data (this would come from ReactionKinetics)
  const kinetics = {
    equation: 'CH3Br + OH- -> CH3OH + Br-',
    rateConstant: 0.045,
    activationEnergy: 85.3,
    reactionOrder: 2,
    mechanism: [
      {
        equation: 'CH3Br + OH- -> [CH3...OH...Br]-',
        type: 'elementary' as const,
        rateConstant: 0.035,
        order: { 'CH3Br': 1, 'OH-': 1 } as Record<string, number>,
        mechanism: 'Nucleophilic attack'
      },
      {
        equation: '[CH3...OH...Br]- -> CH3OH + Br-',
        type: 'rate-determining' as const,
        rateConstant: 0.015,
        order: { 'intermediate': 1 } as Record<string, number>,
        mechanism: 'C-Br bond breaking'
      }
    ],
    temperatureDependence: {
      preExponentialFactor: 8.9e12,
      activationEnergy: 85.3,
      temperatureRange: [273, 373] as [number, number],
      rSquared: 0.987
    },
    rateLaw: 'rate = k[CH3Br][OH-]',
    conditions: {
      temperature: 298.15,
      concentration: { 'CH3Br': 0.1, 'OH-': 0.2 }
    },
    confidence: 0.92,
    dataSource: 'experimental' as const
  };

  const thermodynamics = {
    deltaH: -28.6,
    deltaS: 15.2,
    deltaG: -33.1,
    equilibriumConstant: 7.2e5,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: {
      range: [273, 373] as [number, number],
      deltaGvsT: []
    },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -28.6,
    gibbsFreeEnergy: -33.1,
    isSpontaneous: true
  };

  // Generate profile with kinetics data
  const generator = new EnergyProfileGenerator();
  const profile = generator.generateProfile(thermodynamics, kinetics);
  
  console.log('SN2 Reaction Energy Profile:');
  console.log(`- Mechanism steps: ${profile.steps}`);
  console.log(`- Rate-determining step: ${profile.rateDeterminingStep + 1}`);
  console.log(`- Forward activation energy: ${profile.activationEnergyForward} kJ/mol`);
  console.log(`- Reverse activation energy: ${profile.activationEnergyReverse} kJ/mol`);
  
  console.log('\nMechanism Points:');
  profile.points.forEach((point, index) => {
    const speciesInfo = point.species ? ` [${point.species.join(', ')}]` : '';
    console.log(`  ${point.coordinate.toFixed(2)}: ${point.energy.toFixed(1)} kJ/mol - ${point.label}${speciesInfo}`);
  });

  return profile;
}

// Example 3: Temperature-Dependent Profiles
async function temperatureDependentExample() {
  console.log('\n=== Temperature-Dependent Energy Profiles ===');
  
  const thermodynamics = {
    deltaH: 35.8,  // Endothermic reaction
    deltaS: 42.1,
    deltaG: 23.3,  // Non-spontaneous at room temperature
    equilibriumConstant: 2.1e-5,
    spontaneity: 'non-spontaneous' as const,
    temperatureDependence: {
      range: [298, 500] as [number, number],
      deltaGvsT: []
    },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: 35.8,
    gibbsFreeEnergy: 23.3,
    isSpontaneous: false
  };

  const generator = new EnergyProfileGenerator();
  const temperatures = [298.15, 350, 400, 450, 500];
  
  const profiles = generator.generateTemperatureProfiles(thermodynamics, temperatures);
  
  console.log('Temperature Effects on Energy Profile:');
  profiles.forEach(({ temperature, profile }) => {
    console.log(`\nAt ${temperature} K:`);
    console.log(`  - ΔE: ${profile.deltaE.toFixed(1)} kJ/mol`);
    console.log(`  - Activation Energy: ${profile.activationEnergyForward.toFixed(1)} kJ/mol`);
    console.log(`  - Spontaneous: ${profile.deltaE < 0 ? 'Yes' : 'No'}`);
  });
}

// Example 4: Export for Visualization Libraries
async function visualizationExportExample() {
  console.log('\n=== Visualization Export Examples ===');
  
  // Create a sample profile
  const profile = createEnergyProfile({
    deltaH: -62.4,
    deltaS: 22.8,
    deltaG: -69.2,
    equilibriumConstant: 8.5e11,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: { range: [250, 350] as [number, number], deltaGvsT: [] },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -62.4,
    gibbsFreeEnergy: -69.2,
    isSpontaneous: true
  });

  // Export for Plotly
  const plotlyData = exportEnergyProfile(profile, 'plotly');
  console.log('Plotly Export:');
  console.log(`- Data points: ${plotlyData.data[0].x.length}`);
  console.log(`- Chart type: ${plotlyData.data[0].type}`);
  console.log(`- Has annotations: ${plotlyData.layout.annotations ? 'Yes' : 'No'}`);

  // Export for Chart.js
  const chartData = exportEnergyProfile(profile, 'chartjs');
  console.log('\nChart.js Export:');
  console.log(`- Chart type: ${chartData.type}`);
  console.log(`- Dataset label: ${chartData.data.datasets[0].label}`);
  console.log(`- Data points: ${chartData.data.datasets[0].data.length}`);

  // Export for D3
  const d3Data = exportEnergyProfile(profile, 'd3');
  console.log('\nD3 Export:');
  console.log(`- Nodes: ${d3Data.nodes.length}`);
  console.log(`- Links: ${d3Data.links.length}`);

  // Export as CSV
  const csvData = exportEnergyProfile(profile, 'csv');
  console.log('\nCSV Export (first 3 lines):');
  console.log(csvData.split('\n').slice(0, 3).join('\n'));

  return { plotlyData, chartData, d3Data, csvData };
}

// Example 5: Reaction Coordinate Analysis
async function reactionCoordinateExample() {
  console.log('\n=== Reaction Coordinate Analysis ===');
  
  const generator = new EnergyProfileGenerator();
  
  const reactionTypes = ['SN1', 'SN2', 'E1', 'E2', 'addition'] as const;
  
  reactionTypes.forEach(type => {
    const coordinate = generator.generateReactionCoordinate(type);
    console.log(`\n${type} Reaction:`);
    console.log(`  - Coordinate: ${coordinate.description}`);
    console.log(`  - Units: ${coordinate.units}`);
    console.log(`  - Range: ${coordinate.range[0]} - ${coordinate.range[1]} ${coordinate.units}`);
    console.log(`  - Physical meaning: ${coordinate.physicalMeaning}`);
  });
}

// Example 6: Advanced Profile with Bond Analysis
async function bondAnalysisExample() {
  console.log('\n=== Bond Analysis Example ===');
  
  const generator = new EnergyProfileGenerator();
  
  // Create thermodynamics for a substitution reaction
  const thermodynamics = {
    deltaH: -18.7,
    deltaS: 8.9,
    deltaG: -21.4,
    equilibriumConstant: 9800,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: { range: [298, 350] as [number, number], deltaGvsT: [] },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -18.7,
    gibbsFreeEnergy: -21.4,
    isSpontaneous: true
  };

  // Define bond changes during reaction
  const bondChanges = [
    {
      type: 'breaking' as const,
      atoms: ['C', 'Br'] as [string, string],
      bondOrderChange: -1,
      energyContribution: 276 // C-Br bond energy
    },
    {
      type: 'forming' as const,
      atoms: ['C', 'O'] as [string, string],
      bondOrderChange: 1,
      energyContribution: -358 // C-O bond energy
    }
  ];

  const detailedProfile = generator.generateDetailedProfile(thermodynamics, bondChanges);
  
  console.log('Bond-by-Bond Analysis:');
  console.log(`- Overall energy change: ${detailedProfile.deltaE} kJ/mol`);
  console.log('\nBond Changes:');
  detailedProfile.bondAnalysis.forEach((change, index) => {
    console.log(`  ${index + 1}. ${change.type} ${change.atoms[0]}-${change.atoms[1]} bond:`);
    console.log(`     Energy contribution: ${change.energyContribution > 0 ? '+' : ''}${change.energyContribution} kJ/mol`);
    console.log(`     Bond order change: ${change.bondOrderChange > 0 ? '+' : ''}${change.bondOrderChange}`);
  });

  const totalBondEnergy = bondChanges.reduce((sum, change) => sum + change.energyContribution, 0);
  console.log(`\nNet bond energy change: ${totalBondEnergy} kJ/mol`);
}

// Example 7: Integration with Real Chemistry Calculations
async function realChemistryExample() {
  console.log('\n=== Real Chemistry Integration Example ===');
  
  // Example: Combustion of methane
  const equation = 'CH4 + 2O2 -> CO2 + 2H2O';
  
  // This would typically use the actual ThermodynamicsCalculator
  console.log(`Analyzing: ${equation}`);
  console.log('(In a real application, this would integrate with ThermodynamicsCalculator)');
  
  // Mock realistic data for methane combustion
  const combustionThermo = {
    deltaH: -890.3,  // Highly exothermic
    deltaS: -242.9,  // Entropy decrease (gas -> liquid water)
    deltaG: -818.0,  // Highly spontaneous
    equilibriumConstant: 1e143,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: {
      range: [298, 1000] as [number, number],
      deltaGvsT: [
        { temperature: 298, deltaG: -818.0 },
        { temperature: 500, deltaG: -769.1 },
        { temperature: 1000, deltaG: -575.3 }
      ]
    },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -890.3,
    gibbsFreeEnergy: -818.0,
    isSpontaneous: true
  };

  const profile = createEnergyProfile(combustionThermo, undefined, { 
    temperature: 298.15 
  });
  
  console.log('\nMethane Combustion Energy Profile:');
  console.log(`- Reaction type: Highly ${profile.isExothermic ? 'exothermic' : 'endothermic'}`);
  console.log(`- Energy released: ${Math.abs(profile.deltaE)} kJ/mol`);
  console.log(`- Activation barrier: ${profile.activationEnergyForward} kJ/mol`);
  console.log(`- Energy efficiency: ${(Math.abs(profile.deltaE) / profile.activationEnergyForward * 100).toFixed(1)}%`);

  // Show how this could be exported for a web visualization
  const webData = exportEnergyProfile(profile, 'plotly');
  console.log(`\nReady for web visualization: ${webData.data[0].x.length} data points`);
}

// Run all examples
async function runAllExamples() {
  try {
    await basicEnergyProfileExample();
    await kineticsEnergyProfileExample();
    await temperatureDependentExample();
    await visualizationExportExample();
    await reactionCoordinateExample();
    await bondAnalysisExample();
    await realChemistryExample();
    
    console.log('\n=== All Energy Profile Examples Completed Successfully! ===');
    console.log('\nKey Features Demonstrated:');
    console.log('✓ Basic energy profile generation');
    console.log('✓ Multi-step reaction mechanisms');
    console.log('✓ Temperature-dependent profiles');
    console.log('✓ Export for visualization libraries');
    console.log('✓ Reaction coordinate analysis');
    console.log('✓ Bond-by-bond energy analysis');
    console.log('✓ Integration with thermodynamics');
    
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in other files
export {
  basicEnergyProfileExample,
  kineticsEnergyProfileExample,
  temperatureDependentExample,
  visualizationExportExample,
  reactionCoordinateExample,
  bondAnalysisExample,
  realChemistryExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
