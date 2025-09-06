/**
 * CREB Advanced Kinetics & Analytics Demo
 * Demonstrates the comprehensive kinetics analysis capabilities
 */

import { 
  AdvancedKineticsAnalyzer,
  ReactionKinetics,
  MechanismAnalyzer,
  ReactionSafetyAnalyzer,
  type ReactionConditions,
  type ArrheniusData,
  type MechanismStep
} from '../src/kinetics';

async function demonstrateKineticsAnalysis() {
  console.log('🧪 CREB Advanced Kinetics & Analytics Demo\n');
  console.log('==========================================\n');

  // Example 1: Basic Kinetics Analysis
  console.log('1. Basic Kinetics Analysis');
  console.log('---------------------------');
  
  const equation1 = 'H2 + Cl2 = 2HCl';
  const conditions1: ReactionConditions = {
    temperature: 298, // 25°C
    pressure: 1, // 1 atm
    concentration: {
      H2: 1.0,
      Cl2: 1.0
    }
  };

  try {
    const basicAnalysis = await AdvancedKineticsAnalyzer.analyzeReaction(
      equation1, 
      conditions1,
      {
        includeKinetics: true,
        includeSafety: true
      }
    );

    console.log(`Equation: ${basicAnalysis.equation}`);
    console.log(`Rate constant: ${basicAnalysis.kinetics.rateConstant.toExponential(3)} s⁻¹`);
    console.log(`Activation energy: ${basicAnalysis.kinetics.activationEnergy.toFixed(1)} kJ/mol`);
    console.log(`Reaction order: ${basicAnalysis.kinetics.reactionOrder}`);
    console.log(`Rate law: ${basicAnalysis.kinetics.rateLaw}`);
    console.log(`Safety risk: ${basicAnalysis.safety.overallRiskLevel.toUpperCase()} (score: ${basicAnalysis.safety.riskScore})`);
    console.log(`Required PPE: ${basicAnalysis.safety.requiredPPE.join(', ')}\n`);
    console.log(`Summary:\n${basicAnalysis.summary}\n`);
  } catch (error) {
    console.error('Error in basic analysis:', error);
  }

  // Example 2: Temperature Profile Analysis
  console.log('2. Temperature Profile Analysis');
  console.log('--------------------------------');

  try {
    const temperatureProfile = await AdvancedKineticsAnalyzer.generateTemperatureProfile(
      equation1,
      [250, 400], // 250K to 400K
      conditions1,
      8
    );

    console.log(`Temperature range: ${temperatureProfile.summary.temperatureRangeCelsius[0]}°C to ${temperatureProfile.summary.temperatureRangeCelsius[1]}°C`);
    console.log(`Rate constant range: ${temperatureProfile.summary.rateConstantRange[0].toExponential(2)} to ${temperatureProfile.summary.rateConstantRange[1].toExponential(2)}`);
    console.log(`Average activation energy: ${temperatureProfile.summary.averageActivationEnergy.toFixed(1)} kJ/mol\n`);
    
    console.log('Temperature Profile:');
    temperatureProfile.profile.forEach(point => {
      console.log(`  ${point.temperatureCelsius.toFixed(0)}°C: k = ${point.rateConstant.toExponential(3)} s⁻¹`);
    });
    console.log();
  } catch (error) {
    console.error('Error in temperature profile:', error);
  }

  // Example 3: Mechanism Analysis
  console.log('3. Reaction Mechanism Analysis');
  console.log('-------------------------------');

  const mechanismSteps: MechanismStep[] = [
    {
      stepNumber: 1,
      equation: 'Cl2 = 2Cl',
      type: 'elementary',
      intermediates: ['Cl'],
      rateConstant: 1e-3
    },
    {
      stepNumber: 2,
      equation: 'Cl + H2 = HCl + H',
      type: 'elementary',
      intermediates: ['H'],
      rateConstant: 1e6
    },
    {
      stepNumber: 3,
      equation: 'H + Cl2 = HCl + Cl',
      type: 'elementary',
      intermediates: ['Cl'],
      rateConstant: 1e8
    }
  ];

  try {
    const mechanismAnalysis = MechanismAnalyzer.analyzeMechanism(mechanismSteps, conditions1);
    
    console.log(`Overall reaction: ${mechanismAnalysis.overallReaction}`);
    console.log(`Rate expression: ${mechanismAnalysis.rateExpression}`);
    console.log(`Rate-determining step: Step ${mechanismAnalysis.rateDeterminingStep + 1}`);
    console.log(`Intermediates: ${mechanismAnalysis.intermediates.join(', ')}`);
    console.log(`Catalysts: ${mechanismAnalysis.catalysts.join(', ') || 'None'}`);
    console.log(`Valid approximations: ${mechanismAnalysis.approximations.join(', ')}`);
    console.log(`Mechanism confidence: ${(mechanismAnalysis.confidence * 100).toFixed(1)}%\n`);
  } catch (error) {
    console.error('Error in mechanism analysis:', error);
  }

  // Example 4: Safety Assessment for Hazardous Reaction
  console.log('4. Safety Assessment - Hazardous Reaction');
  console.log('------------------------------------------');

  const hazardousEquation = 'HF + SiO2 = SiF4 + H2O';
  const hazardousConditions: ReactionConditions = {
    temperature: 373, // 100°C
    pressure: 2, // 2 atm
    concentration: {
      HF: 2.0,
      SiO2: 1.0
    }
  };

  try {
    const safetyAssessment = ReactionSafetyAnalyzer.assessReactionSafety(
      hazardousEquation,
      hazardousConditions
    );

    console.log(`Equation: ${safetyAssessment.equation}`);
    console.log(`Overall risk: ${safetyAssessment.overallRiskLevel.toUpperCase()} (score: ${safetyAssessment.riskScore})`);
    console.log(`Containment level: ${safetyAssessment.containmentLevel}`);
    
    console.log('\nHazards identified:');
    if (safetyAssessment.hazards.thermal.length > 0) {
      console.log('  Thermal hazards:');
      safetyAssessment.hazards.thermal.forEach(h => {
        console.log(`    - ${h.type} (${h.severity}): ${h.description}`);
      });
    }
    
    if (safetyAssessment.hazards.chemical.length > 0) {
      console.log('  Chemical hazards:');
      safetyAssessment.hazards.chemical.forEach(h => {
        console.log(`    - ${h.type} (${h.severity}): ${h.description}`);
      });
    }

    console.log(`\nRequired PPE: ${safetyAssessment.requiredPPE.join(', ')}`);
    console.log(`Monitoring parameters: ${safetyAssessment.monitoringParameters.join(', ')}`);
    
    console.log('\nCritical recommendations:');
    const criticalRecs = safetyAssessment.recommendations.filter(r => r.priority === 'critical');
    criticalRecs.forEach(rec => {
      console.log(`  - ${rec.description}: ${rec.implementation}`);
    });
    console.log();
  } catch (error) {
    console.error('Error in safety assessment:', error);
  }

  // Example 5: Pathway Comparison
  console.log('5. Reaction Pathway Comparison');
  console.log('------------------------------');

  const pathways = [
    {
      equation: 'C2H4 + H2O = C2H5OH',
      conditions: {
        temperature: 298,
        pressure: 1,
        concentration: { C2H4: 1.0, H2O: 1.0 }
      }
    },
    {
      equation: 'C2H4 + H2SO4 + H2O = C2H5OH + H2SO4',
      conditions: {
        temperature: 333,
        pressure: 1,
        concentration: { C2H4: 1.0, H2SO4: 0.1, H2O: 10.0 }
      }
    }
  ];

  try {
    const comparison = await AdvancedKineticsAnalyzer.compareReactionPathways(pathways);
    
    console.log('Pathway Analysis Results:');
    console.log(`Recommended pathway: Pathway ${comparison.recommendation.index + 1}`);
    console.log(`Score: ${comparison.recommendation.score.toFixed(1)}/100\n`);
    
    console.log('Pathway Details:');
    comparison.pathways.forEach((pathway, index) => {
      console.log(`  Pathway ${index + 1}: ${pathway.equation}`);
      if (pathway.kinetics) {
        console.log(`    Rate constant: ${pathway.kinetics.rateConstant.toExponential(3)}`);
        console.log(`    Activation energy: ${pathway.kinetics.activationEnergy.toFixed(1)} kJ/mol`);
      }
      if (pathway.safety) {
        console.log(`    Safety risk: ${pathway.safety.overallRiskLevel}`);
      }
    });
    
    console.log(`\n${comparison.comparison}\n`);
  } catch (error) {
    console.error('Error in pathway comparison:', error);
  }

  // Example 6: Advanced Analysis with Literature Data
  console.log('6. Advanced Analysis with Literature Data');
  console.log('-----------------------------------------');

  const literatureEquation = 'N2O5 = N2O4 + 0.5O2';
  const literatureConditions: ReactionConditions = {
    temperature: 273,
    pressure: 1,
    concentration: { N2O5: 1.0 }
  };

  const literatureArrhenius: ArrheniusData = {
    preExponentialFactor: 4.94e13, // s^-1
    activationEnergy: 103.3, // kJ/mol
    temperatureRange: [250, 300],
    rSquared: 0.98
  };

  try {
    const literatureAnalysis = ReactionKinetics.analyzeKinetics(
      literatureEquation,
      literatureConditions,
      literatureArrhenius
    );

    console.log(`Equation: ${literatureAnalysis.equation}`);
    console.log(`Data source: ${literatureAnalysis.dataSource}`);
    console.log(`Confidence: ${(literatureAnalysis.confidence * 100).toFixed(1)}%`);
    console.log(`Rate constant at ${literatureConditions.temperature}K: ${literatureAnalysis.rateConstant.toExponential(3)} s⁻¹`);
    console.log(`Activation energy: ${literatureAnalysis.activationEnergy} kJ/mol`);
    console.log(`Half-life: ${literatureAnalysis.halfLife?.toExponential(2)} s`);
    console.log(`Rate law: ${literatureAnalysis.rateLaw}\n`);
  } catch (error) {
    console.error('Error in literature analysis:', error);
  }

  console.log('==========================================');
  console.log('Demo completed! 🎉');
  console.log('The Advanced Kinetics & Analytics module provides:');
  console.log('• Comprehensive kinetics analysis');
  console.log('• Temperature-dependent profiles');
  console.log('• Reaction mechanism studies');
  console.log('• Safety assessment and hazard analysis');
  console.log('• Pathway comparison and optimization');
  console.log('• Integration with thermodynamic data');
}

// Run the demonstration
if (require.main === module) {
  demonstrateKineticsAnalysis().catch(console.error);
}

export { demonstrateKineticsAnalysis };
