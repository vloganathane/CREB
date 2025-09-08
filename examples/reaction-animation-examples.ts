/**
 * Reaction Animation Examples
 * Demonstrates how to use the new reaction animation system in CREB-JS v1.7.0
 */

import { 
  ReactionAnimator, 
  ReactionAnimationConfig,
  ReactionAnimationUtils 
} from '../src/visualization/ReactionAnimation';
import { 
  CREBMolecularIntegration,
  createMolecularVisualization 
} from '../src/visualization/MolecularVisualization';
import { EnergyProfileGenerator } from '../src/thermodynamics/energyProfile';

// Example 1: Basic Reaction Animation
async function basicReactionAnimation() {
  console.log('\n=== Basic Reaction Animation Example ===');
  
  // Create animator with custom configuration
  const animator = new ReactionAnimator({
    duration: 6000,  // 6 seconds
    fps: 30,
    easing: 'ease-in-out',
    showEnergyProfile: true,
    showBondOrders: true,
    style: 'smooth',
    bondColorScheme: 'energy-based'
  });

  // Simple hydrogen + chlorine reaction
  const equation = 'H2 + Cl2 = 2HCl';
  
  try {
    // Create mock energy profile for the reaction
    const mockThermodynamics = {
      deltaH: -184.6,  // Exothermic reaction
      deltaS: 20.0,
      deltaG: -190.6,
      equilibriumConstant: 1e33,
      spontaneity: 'spontaneous' as const,
      temperatureDependence: { range: [298, 500] as [number, number], deltaGvsT: [] },
      conditions: { temperature: 298.15, pressure: 101325 },
      enthalpy: -184.6,
      gibbsFreeEnergy: -190.6,
      isSpontaneous: true
    };

    const generator = new EnergyProfileGenerator();
    const energyProfile = generator.generateProfile(mockThermodynamics);

    // Generate animation frames
    const mockBalanced = {
      equation: '2H2 + Cl2 → 2HCl',
      coefficients: [1, 1, 2],
      reactants: ['H2', 'Cl2'],
      products: ['2HCl']
    };

    const frames = await animator.createAnimationFromEquation(mockBalanced, energyProfile);
    
    console.log(`Generated ${frames.length} animation frames`);
    console.log(`Animation duration: ${animator['config'].duration}ms`);
    console.log('First frame:', frames[0]);
    console.log('Last frame:', frames[frames.length - 1]);

    return animator;
    
  } catch (error) {
    console.error('Error in basic animation:', error);
  }
}

// Example 2: Custom Bond Changes Animation
async function customBondChangesAnimation() {
  console.log('\n=== Custom Bond Changes Animation Example ===');
  
  const animator = new ReactionAnimator({
    duration: 8000,
    fps: 24,
    style: 'spring',
    bondColorScheme: 'order-based'
  });

  // Define specific bond changes for nucleophilic substitution
  const bondChanges = [
    {
      type: 'breaking' as const,
      atoms: ['C', 'Br'] as [string, string],
      bondOrderChange: -1,
      energyContribution: 276  // C-Br bond energy
    },
    {
      type: 'forming' as const,
      atoms: ['C', 'OH'] as [string, string],
      bondOrderChange: 1,
      energyContribution: -358  // C-O bond energy
    }
  ];

  // Create mock molecular structures
  const reactants = [{
    atoms: [
      { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: 0.1 },
      { element: 'Br', position: { x: 1.8, y: 0, z: 0 }, charge: -0.1 },
      { element: 'H', position: { x: -0.6, y: 1.0, z: 0 }, charge: 0 },
      { element: 'H', position: { x: -0.6, y: -0.5, z: 0.9 }, charge: 0 },
      { element: 'H', position: { x: -0.6, y: -0.5, z: -0.9 }, charge: 0 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1, length: 1.8 },
      { atom1: 0, atom2: 2, order: 1, length: 1.1 },
      { atom1: 0, atom2: 3, order: 1, length: 1.1 },
      { atom1: 0, atom2: 4, order: 1, length: 1.1 }
    ],
    properties: { totalEnergy: 0, charge: 0 }
  }];

  const products = [{
    atoms: [
      { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: 0.1 },
      { element: 'O', position: { x: 1.4, y: 0, z: 0 }, charge: -0.2 },
      { element: 'H', position: { x: 1.8, y: 0.8, z: 0 }, charge: 0.1 },
      { element: 'H', position: { x: -0.6, y: 1.0, z: 0 }, charge: 0 },
      { element: 'H', position: { x: -0.6, y: -0.5, z: 0.9 }, charge: 0 },
      { element: 'H', position: { x: -0.6, y: -0.5, z: -0.9 }, charge: 0 }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1, length: 1.4 },
      { atom1: 1, atom2: 2, order: 1, length: 0.96 },
      { atom1: 0, atom2: 3, order: 1, length: 1.1 },
      { atom1: 0, atom2: 4, order: 1, length: 1.1 },
      { atom1: 0, atom2: 5, order: 1, length: 1.1 }
    ],
    properties: { totalEnergy: -82, charge: 0 }
  }];

  // Create custom animation
  const frames = animator.createCustomAnimation(reactants, products, bondChanges);
  
  console.log(`Generated custom animation with ${frames.length} frames`);
  console.log('Bond changes:', bondChanges);
  
  return { animator, frames };
}

// Example 3: Canvas Animation Playback
async function canvasAnimationPlayback() {
  console.log('\n=== Canvas Animation Playback Example ===');
  
  // Create canvas element (in browser environment)
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  
  // Add to DOM if in browser
  if (typeof document !== 'undefined') {
    document.body.appendChild(canvas);
  }

  // Create animator
  const animator = new ReactionAnimator({
    duration: 5000,
    fps: 30,
    showEnergyProfile: true,
    showBondOrders: true
  });

  // Generate animation for combustion reaction
  const equation = 'CH4 + 2O2 = CO2 + 2H2O';
  
  const mockThermodynamics = {
    deltaH: -890.3,  // Highly exothermic
    deltaS: -242.0,
    deltaG: -818.0,
    equilibriumConstant: 1e140,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: { range: [298, 1000] as [number, number], deltaGvsT: [] },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -890.3,
    gibbsFreeEnergy: -818.0,
    isSpontaneous: true
  };

  const generator = new EnergyProfileGenerator();
  const energyProfile = generator.generateProfile(mockThermodynamics);

  const mockBalanced = {
    equation: 'CH4 + 2O2 → CO2 + 2H2O',
    coefficients: [1, 2, 1, 2],
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O']
  };

  await animator.createAnimationFromEquation(mockBalanced, energyProfile);

  // Play animation with progress callback
  console.log('Starting animation playback...');
  
  await animator.playAnimation(canvas, (frame) => {
    if (frame.frameNumber % 30 === 0) {  // Log every second
      console.log(`Frame ${frame.frameNumber}: ${(frame.time * 100).toFixed(1)}% complete, Energy: ${frame.energy.toFixed(1)} kJ/mol`);
    }
  });

  console.log('Animation playback completed!');
  
  return animator;
}

// Example 4: CREB Integration
async function crebIntegrationExample() {
  console.log('\n=== CREB Integration Example ===');
  
  // Create molecular visualization
  const visualization = createMolecularVisualization({
    container: document.createElement('div'),
    width: 800,
    height: 600,
    controls: true
  });

  // Create CREB integration
  const integration = new CREBMolecularIntegration(visualization);

  // Animate a reaction using CREB's equation balancer
  const equation = 'N2 + 3H2 = 2NH3';  // Haber process
  
  try {
    console.log(`Animating reaction: ${equation}`);
    
    // This will balance the equation and create animation
    await integration.animateReaction(equation);
    
    console.log('CREB-integrated animation completed!');
    
  } catch (error) {
    console.error('Error in CREB integration:', error);
  }
}

// Example 5: Advanced Animation with Custom Features
async function advancedAnimationExample() {
  console.log('\n=== Advanced Animation Features Example ===');
  
  // Create advanced configuration
  const config: ReactionAnimationConfig = {
    duration: 12000,  // 12 seconds for detailed animation
    fps: 60,          // High frame rate
    easing: 'ease-in-out',
    showEnergyProfile: true,
    showBondOrders: true,
    showCharges: true,
    style: 'smooth',
    bondColorScheme: 'energy-based'
  };

  const animator = new ReactionAnimator(config);
  
  // Create complex reaction with transition states
  const transitionStates = [
    {
      coordinate: 0.3,
      energy: 85.2,
      description: 'C-Br bond stretching',
      involvedSpecies: ['CH3Br', 'OH-'],
      bondChanges: [{
        type: 'stretching' as const,
        atoms: ['C', 'Br'] as [string, string],
        bondOrderChange: -0.3,
        energyContribution: 25
      }]
    },
    {
      coordinate: 0.5,
      energy: 95.0,
      description: 'Transition state',
      involvedSpecies: ['[CH3...OH...Br]-'],
      bondChanges: [
        {
          type: 'breaking' as const,
          atoms: ['C', 'Br'] as [string, string],
          bondOrderChange: -0.7,
          energyContribution: 60
        },
        {
          type: 'forming' as const,
          atoms: ['C', 'O'] as [string, string],
          bondOrderChange: 0.7,
          energyContribution: -40
        }
      ]
    },
    {
      coordinate: 0.7,
      energy: 45.0,
      description: 'C-O bond forming',
      involvedSpecies: ['CH3OH', 'Br-'],
      bondChanges: [{
        type: 'forming' as const,
        atoms: ['C', 'O'] as [string, string],
        bondOrderChange: 0.3,
        energyContribution: -50
      }]
    }
  ];

  // Mock energy profile with detailed transition states
  const detailedThermodynamics = {
    deltaH: -28.6,
    deltaS: 15.2,
    deltaG: -33.1,
    equilibriumConstant: 7.2e5,
    spontaneity: 'spontaneous' as const,
    temperatureDependence: { range: [273, 373] as [number, number], deltaGvsT: [] },
    conditions: { temperature: 298.15, pressure: 101325 },
    enthalpy: -28.6,
    gibbsFreeEnergy: -33.1,
    isSpontaneous: true
  };

  const generator = new EnergyProfileGenerator();
  const energyProfile = generator.generateProfile(detailedThermodynamics);

  const complexBalanced = {
    equation: 'CH3Br + OH- → CH3OH + Br-',
    coefficients: [1, 1, 1, 1],
    reactants: ['CH3Br', 'OH-'],
    products: ['CH3OH', 'Br-']
  };

  // Generate animation with transition states
  const frames = await animator.createAnimationFromEquation(
    complexBalanced, 
    energyProfile, 
    transitionStates
  );

  console.log(`Generated advanced animation with ${frames.length} frames`);
  console.log(`Transition states: ${transitionStates.length}`);
  console.log('Frame rate:', config.fps, 'fps');
  console.log('Total duration:', config.duration / 1000, 'seconds');

  // Export animation data
  const animationData = ReactionAnimationUtils.exportAnimationData(frames, 'json');
  console.log('Animation data exported (first 500 chars):', animationData.substring(0, 500) + '...');

  return { animator, frames };
}

// Example 6: Real-time Animation Controls
async function realTimeControlsExample() {
  console.log('\n=== Real-time Animation Controls Example ===');
  
  const animator = new ReactionAnimator({
    duration: 10000,
    fps: 30,
    style: 'smooth'
  });

  // Create simple animation
  const bondChanges = [
    {
      type: 'breaking' as const,
      atoms: ['H', 'H'] as [string, string],
      bondOrderChange: -1,
      energyContribution: 436
    },
    {
      type: 'forming' as const,
      atoms: ['H', 'Cl'] as [string, string],
      bondOrderChange: 1,
      energyContribution: -431
    }
  ];

  const mockReactants = [{
    atoms: [
      { element: 'H', position: { x: -0.5, y: 0, z: 0 } },
      { element: 'H', position: { x: 0.5, y: 0, z: 0 } }
    ],
    bonds: [{ atom1: 0, atom2: 1, order: 1, length: 0.74 }],
    properties: { totalEnergy: 0, charge: 0 }
  }];

  const mockProducts = [{
    atoms: [
      { element: 'H', position: { x: -1, y: 0, z: 0 } },
      { element: 'Cl', position: { x: 0, y: 0, z: 0 } }
    ],
    bonds: [{ atom1: 0, atom2: 1, order: 1, length: 1.27 }],
    properties: { totalEnergy: -431, charge: 0 }
  }];

  animator.createCustomAnimation(mockReactants, mockProducts, bondChanges);

  // Simulate real-time controls
  console.log('Simulating animation controls:');
  
  // Mock canvas for this example
  const mockCanvas = {
    getContext: () => ({
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      moveTo: () => {},
      lineTo: () => {}
    }),
    width: 800,
    height: 600
  } as any;

  // Start animation
  const animationPromise = animator.playAnimation(mockCanvas, (frame) => {
    console.log(`Real-time update: Frame ${frame.frameNumber} (${(frame.time * 100).toFixed(1)}%)`);
  });

  // Simulate pause after 2 seconds
  setTimeout(() => {
    console.log('Pausing animation...');
    animator.pauseAnimation();
    
    // Resume after 1 second
    setTimeout(() => {
      console.log('Resuming animation...');
      animator.resumeAnimation();
    }, 1000);
  }, 2000);

  await animationPromise;
  console.log('Real-time controls example completed!');
}

// Main execution function
async function runAllExamples() {
  console.log('🎬 CREB-JS Reaction Animation Examples');
  console.log('=====================================\n');

  try {
    // Run all examples
    await basicReactionAnimation();
    await customBondChangesAnimation();
    
    // Skip canvas examples in Node.js environment
    if (typeof document !== 'undefined') {
      await canvasAnimationPlayback();
      await crebIntegrationExample();
    } else {
      console.log('\n⚠️  Skipping canvas examples (Node.js environment)');
    }
    
    await advancedAnimationExample();
    await realTimeControlsExample();

    console.log('\n✅ All reaction animation examples completed successfully!');
    console.log('\n🎯 Key Features Demonstrated:');
    console.log('- Frame-by-frame animation generation');
    console.log('- Bond formation/breaking visualization');
    console.log('- Energy profile integration');
    console.log('- Canvas-based rendering');
    console.log('- Real-time animation controls');
    console.log('- CREB chemistry integration');
    console.log('- Custom transition states');
    console.log('- Animation export capabilities');

  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use as module
export {
  basicReactionAnimation,
  customBondChangesAnimation,
  canvasAnimationPlayback,
  crebIntegrationExample,
  advancedAnimationExample,
  realTimeControlsExample,
  runAllExamples
};

// Run if called directly
if (require.main === module) {
  runAllExamples();
}
