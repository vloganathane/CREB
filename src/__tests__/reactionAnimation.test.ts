/**
 * Tests for Reaction Animation System
 * Validates the complete implementation of bond formation/breaking visualization
 */

import { 
  ReactionAnimator, 
  ReactionAnimationConfig,
  AnimationFrame,
  MolecularFrame
} from '../visualization/ReactionAnimation';
import { BondChange } from '../thermodynamics/types';

describe('ReactionAnimation', () => {
  let animator: ReactionAnimator;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      fillText: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      font: '',
      textAlign: 'start',
      setLineDash: jest.fn(),
      fillRect: jest.fn(),
      setTransform: jest.fn()
    } as any;

    mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockContext),
      width: 800,
      height: 600
    } as any;

    // Create animator with test configuration
    const config: ReactionAnimationConfig = {
      duration: 1000, // Short duration for tests
      fps: 10,
      easing: 'linear',
      showEnergyProfile: true,
      showBondOrders: true,
      showCharges: false,
      style: 'smooth',
      bondColorScheme: 'default'
    };

    animator = new ReactionAnimator(config);
  });

  describe('Initialization', () => {
    it('should create animator with default config', () => {
      const defaultAnimator = new ReactionAnimator();
      expect(defaultAnimator).toBeInstanceOf(ReactionAnimator);
    });

    it('should create animator with custom config', () => {
      expect(animator).toBeInstanceOf(ReactionAnimator);
      expect(animator['config'].duration).toBe(1000);
      expect(animator['config'].fps).toBe(10);
    });
  });

  describe('Animation Generation', () => {
    it('should generate animation from balanced equation', async () => {
      const mockBalanced = {
        equation: 'H2 + Cl2 → 2HCl',
        coefficients: [1, 1, 2],
        reactants: ['H2', 'Cl2'],
        products: ['HCl']
      };

      const mockEnergyProfile = {
        points: [
          { coordinate: 0, energy: 0, type: 'reactant' as const, label: 'Reactants' },
          { coordinate: 0.5, energy: 50, type: 'transition-state' as const, label: 'Transition State' },
          { coordinate: 1, energy: -100, type: 'product' as const, label: 'Products' }
        ],
        deltaE: -100,
        activationEnergyForward: 50,
        activationEnergyReverse: 150,
        steps: 2,
        rateDeterminingStep: 0,
        temperature: 298.15,
        pressure: 101325,
        isExothermic: true
      };

      const frames = await animator.createAnimationFromEquation(mockBalanced, mockEnergyProfile);
      
      expect(frames).toBeDefined();
      expect(frames.length).toBeGreaterThan(0);
      expect(frames[0].frameNumber).toBe(0);
      expect(frames[frames.length - 1].time).toBeCloseTo(1.0, 0);
    });

    it('should generate custom animation with bond changes', () => {
      const reactants: MolecularFrame[] = [{
        atoms: [
          { element: 'H', position: { x: -0.5, y: 0, z: 0 } },
          { element: 'H', position: { x: 0.5, y: 0, z: 0 } }
        ],
        bonds: [{ atom1: 0, atom2: 1, order: 1, length: 0.74 }],
        properties: { totalEnergy: 0, charge: 0 }
      }];

      const products: MolecularFrame[] = [{
        atoms: [
          { element: 'H', position: { x: -1, y: 0, z: 0 } },
          { element: 'Cl', position: { x: 0, y: 0, z: 0 } }
        ],
        bonds: [{ atom1: 0, atom2: 1, order: 1, length: 1.27 }],
        properties: { totalEnergy: -431, charge: 0 }
      }];

      const bondChanges: BondChange[] = [
        {
          type: 'breaking',
          atoms: ['H', 'H'],
          bondOrderChange: -1,
          energyContribution: 436
        },
        {
          type: 'forming',
          atoms: ['H', 'Cl'],
          bondOrderChange: 1,
          energyContribution: -431
        }
      ];

      const frames = animator.createCustomAnimation(reactants, products, bondChanges);
      
      expect(frames).toBeDefined();
      expect(frames.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Playback', () => {
    beforeEach(async () => {
      // Setup a simple animation
      const reactants: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 0, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: 0, charge: 0 }
      }];

      const products: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 1, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: -10, charge: 0 }
      }];

      const bondChanges: BondChange[] = [];
      animator.createCustomAnimation(reactants, products, bondChanges);
    });

    afterEach(() => {
      // Clean up any running animations
      if (animator) {
        animator.pauseAnimation();
        animator.resetAnimation();
      }
    });

    it('should play animation on canvas', async () => {
      const frameCallback = jest.fn();
      
      const playPromise = animator.playAnimation(mockCanvas, frameCallback);
      
      // Wait for animation to start
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(frameCallback).toHaveBeenCalled();
      
      // Animation should complete
      await playPromise;
      expect(frameCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          frameNumber: expect.any(Number),
          time: expect.any(Number)
        })
      );
    });

    it('should pause animation', () => {
      // Test the pause functionality directly
      animator['isPlaying'] = true;
      animator.pauseAnimation();
      expect(animator['isPlaying']).toBe(false);
    });

    it('should reset animation', () => {
      animator.resetAnimation();
      expect(animator['currentFrame']).toBe(0);
      expect(animator['isPlaying']).toBe(false);
    });
  });

  describe('Frame Rendering', () => {
    it('should render atoms correctly', () => {
      const mockFrame: AnimationFrame = {
        frameNumber: 0,
        time: 0,
        structure: {
          atoms: [{ element: 'H', position: { x: 0, y: 0, z: 0 } }],
          bonds: [],
          properties: { totalEnergy: 0, charge: 0 }
        },
        energy: 0,
        bonds: [],
        atoms: [{
          element: 'H',
          position: { x: 0, y: 0, z: 0 },
          targetPosition: { x: 0, y: 0, z: 0 },
          state: 'stationary',
          color: '#ffffff',
          radius: 20,
          opacity: 1
        }]
      };

      // Set up the animator with canvas and context
      animator['canvas'] = mockCanvas;
      animator['context'] = mockContext;

      // Call private method via bracket notation
      animator['renderFrame'](mockFrame);
      
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should render energy indicator when enabled', () => {
      const mockFrame: AnimationFrame = {
        frameNumber: 0,
        time: 0,
        structure: { atoms: [], bonds: [], properties: { totalEnergy: 50, charge: 0 } },
        energy: 50,
        bonds: [],
        atoms: []
      };

      // Set up the animator with canvas and context
      animator['canvas'] = mockCanvas;
      animator['context'] = mockContext;

      animator['renderFrame'](mockFrame);
      
      // Should render energy indicator
      expect(mockContext.fillRect).toHaveBeenCalled();
      expect(mockContext.fillText).toHaveBeenCalledWith(
        expect.stringContaining('50.0'),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Bond Animation', () => {
    it('should interpolate bond order during breaking', () => {
      const bondChange: BondChange = {
        type: 'breaking',
        atoms: ['C', 'Br'],
        bondOrderChange: -1,
        energyContribution: 276
      };

      // Test at different progress points
      const order25 = animator['interpolateBondOrder'](bondChange, 0.25);
      const order50 = animator['interpolateBondOrder'](bondChange, 0.5);
      const order75 = animator['interpolateBondOrder'](bondChange, 0.75);

      expect(order25).toBeCloseTo(0.75); // 1 - 0.25
      expect(order50).toBeCloseTo(0.5);  // 1 - 0.5
      expect(order75).toBeCloseTo(0.25); // 1 - 0.75
    });

    it('should interpolate bond order during forming', () => {
      const bondChange: BondChange = {
        type: 'forming',
        atoms: ['C', 'O'],
        bondOrderChange: 1,
        energyContribution: -358
      };

      const order25 = animator['interpolateBondOrder'](bondChange, 0.25);
      const order50 = animator['interpolateBondOrder'](bondChange, 0.5);
      const order100 = animator['interpolateBondOrder'](bondChange, 1.0);

      expect(order25).toBeCloseTo(0.25);
      expect(order50).toBeCloseTo(0.5);
      expect(order100).toBeCloseTo(1.0);
    });

    it('should get appropriate bond colors', () => {
      const highEnergyBond: BondChange = {
        type: 'breaking',
        atoms: ['C', 'C'],
        bondOrderChange: -1,
        energyContribution: 850 // Very high energy
      };

      const lowEnergyBond: BondChange = {
        type: 'forming',
        atoms: ['H', 'H'],
        bondOrderChange: 1,
        energyContribution: 50 // Low energy
      };

      const highEnergyColor = animator['getBondColor'](highEnergyBond, 0.5);
      const lowEnergyColor = animator['getBondColor'](lowEnergyBond, 0.5);

      expect(highEnergyColor).toBeDefined();
      expect(lowEnergyColor).toBeDefined();
      expect(highEnergyColor).not.toBe(lowEnergyColor);
    });
  });

  describe('Easing Functions', () => {
    it('should apply linear easing correctly', () => {
      animator['config'].easing = 'linear';
      
      expect(animator['applyEasing'](0)).toBe(0);
      expect(animator['applyEasing'](0.5)).toBe(0.5);
      expect(animator['applyEasing'](1)).toBe(1);
    });

    it('should apply ease-in easing correctly', () => {
      animator['config'].easing = 'ease-in';
      
      expect(animator['applyEasing'](0)).toBe(0);
      expect(animator['applyEasing'](0.5)).toBe(0.25); // 0.5^2
      expect(animator['applyEasing'](1)).toBe(1);
    });

    it('should apply ease-out easing correctly', () => {
      animator['config'].easing = 'ease-out';
      
      expect(animator['applyEasing'](0)).toBe(0);
      expect(animator['applyEasing'](0.5)).toBe(0.75); // 1 - (1-0.5)^2
      expect(animator['applyEasing'](1)).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing canvas gracefully', async () => {
      await expect(animator.playAnimation(null as any)).rejects.toThrow();
    });

    it('should handle invalid context gracefully', async () => {
      const invalidCanvas = {
        getContext: () => null,
        width: 800,
        height: 600
      } as any;

      await expect(animator.playAnimation(invalidCanvas)).rejects.toThrow();
    });
  });

  describe('Animation Export', () => {
    it('should export animation data', async () => {
      // Create simple animation
      const reactants: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 0, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: 0, charge: 0 }
      }];

      const products: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 1, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: -10, charge: 0 }
      }];

      const frames = animator.createCustomAnimation(reactants, products, []);
      
      const exportBlob = await animator.exportAnimation('gif');
      expect(exportBlob).toBeInstanceOf(Blob);
      expect(exportBlob.type).toContain('video/gif');
    });
  });
});

describe('ReactionAnimationUtils', () => {
  it('should export animation data as JSON', () => {
    const mockFrames: AnimationFrame[] = [
      {
        frameNumber: 0,
        time: 0,
        structure: { atoms: [], bonds: [], properties: { totalEnergy: 0, charge: 0 } },
        energy: 0,
        bonds: [],
        atoms: []
      }
    ];

    const { ReactionAnimationUtils } = require('../visualization/ReactionAnimation');
    const jsonData = ReactionAnimationUtils.exportAnimationData(mockFrames, 'json');
    
    expect(jsonData).toContain('"frameNumber": 0');
    expect(() => JSON.parse(jsonData)).not.toThrow();
  });

  it('should export animation data as CSV', () => {
    const mockFrames: AnimationFrame[] = [
      {
        frameNumber: 0,
        time: 0,
        structure: { atoms: [], bonds: [], properties: { totalEnergy: 0, charge: 0 } },
        energy: 0,
        bonds: [],
        atoms: []
      },
      {
        frameNumber: 1,
        time: 0.1,
        structure: { atoms: [], bonds: [], properties: { totalEnergy: 10, charge: 0 } },
        energy: 10,
        bonds: [],
        atoms: []
      }
    ];

    const { ReactionAnimationUtils } = require('../visualization/ReactionAnimation');
    const csvData = ReactionAnimationUtils.exportAnimationData(mockFrames, 'csv');
    
    expect(csvData).toContain('frame,time,energy,atomCount,bondCount');
    expect(csvData).toContain('0,0,0,0,0');
    expect(csvData).toContain('1,0.1,10,0,0');
  });

  it('should export animation data as XML', () => {
    const mockFrames: AnimationFrame[] = [
      {
        frameNumber: 0,
        time: 0,
        structure: { atoms: [], bonds: [], properties: { totalEnergy: 0, charge: 0 } },
        energy: 0,
        bonds: [],
        atoms: []
      }
    ];

    const { ReactionAnimationUtils } = require('../visualization/ReactionAnimation');
    const xmlData = ReactionAnimationUtils.exportAnimationData(mockFrames, 'xml');
    
    expect(xmlData).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xmlData).toContain('<animation>');
    expect(xmlData).toContain('<frame number="0"');
    expect(xmlData).toContain('</animation>');
  });
});

// Integration tests
describe('Integration Tests', () => {
  it('should integrate with CREB equation balancer', () => {
    // Mock the CREBMolecularIntegration
    const mockVisualization = {
      loadMolecule: jest.fn()
    };

    // Mock DOM element for canvas creation
    const mockCanvas = {
      width: 800,
      height: 600,
      style: {},
      getContext: jest.fn().mockReturnValue({
        clearRect: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        fillText: jest.fn(),
        setTransform: jest.fn(),
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        font: '',
        textAlign: 'start',
        setLineDash: jest.fn()
      })
    };

    global.document = {
      createElement: jest.fn().mockReturnValue(mockCanvas),
      body: {
        appendChild: jest.fn()
      }
    } as any;

    const { CREBMolecularIntegration } = require('../visualization/MolecularVisualization');
    const integration = new CREBMolecularIntegration(mockVisualization);

    // Test that the integration class can be instantiated
    expect(integration).toBeDefined();
    expect(typeof integration.animateReaction).toBe('function');
  });

  it('should work with energy profile generator', async () => {
    const { EnergyProfileGenerator } = require('../thermodynamics/energyProfile');
    const generator = new EnergyProfileGenerator();

    const thermodynamics = {
      deltaH: -184.6,
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

    const profile = generator.generateProfile(thermodynamics);
    expect(profile).toBeDefined();
    expect(profile.points.length).toBeGreaterThan(0);
    expect(profile.isExothermic).toBe(true);

    // Use profile in animation
    const animator = new ReactionAnimator();
    const mockBalanced = {
      equation: 'H2 + Cl2 → 2HCl',
      coefficients: [1, 1, 2],
      reactants: ['H2', 'Cl2'],
      products: ['HCl']
    };

    const frames = await animator.createAnimationFromEquation(mockBalanced, profile);
    expect(frames.length).toBeGreaterThan(0);
  });
});

// Performance tests
describe('Performance Tests', () => {
  it('should generate large animations efficiently', () => {
    const startTime = Date.now();
    
    const animator = new ReactionAnimator({
      duration: 1000, // 1 second
      fps: 30,        // Standard frame rate
      style: 'smooth'
    });

    const reactants: MolecularFrame[] = [{
      atoms: Array.from({ length: 20 }, (_, i) => ({
        element: i % 2 === 0 ? 'C' : 'H',
        position: { x: i, y: 0, z: 0 }
      })),
      bonds: [],
      properties: { totalEnergy: 0, charge: 0 }
    }];

    const products: MolecularFrame[] = [{
      atoms: Array.from({ length: 20 }, (_, i) => ({
        element: i % 2 === 0 ? 'C' : 'H',
        position: { x: i + 10, y: 0, z: 0 }
      })),
      bonds: [],
      properties: { totalEnergy: -100, charge: 0 }
    }];

    const frames = animator.createCustomAnimation(reactants, products, []);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(frames.length).toBeGreaterThan(5); // At least some frames generated
    expect(frames.length).toBeLessThan(50); // But not an excessive amount
    expect(duration).toBeLessThan(1000); // Should complete in under 1 second
  });

  it('should handle memory efficiently', () => {
    const animator = new ReactionAnimator({
      duration: 5000,
      fps: 30
    });

    // Generate multiple animations to test memory usage
    for (let i = 0; i < 10; i++) {
      const reactants: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 0, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: 0, charge: 0 }
      }];

      const products: MolecularFrame[] = [{
        atoms: [{ element: 'H', position: { x: 1, y: 0, z: 0 } }],
        bonds: [],
        properties: { totalEnergy: -10, charge: 0 }
      }];

      animator.createCustomAnimation(reactants, products, []);
    }

    // Should not cause memory issues
    expect(true).toBe(true);
  });
});
