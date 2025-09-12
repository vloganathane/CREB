import { jest } from '@jest/globals';
import { EnhancedAnimationController } from '../enhancements/EnhancedAnimationController';
import { PubChemIntegration } from '../visualization/PubChemIntegration';
import { EnhancedChemicalEquationBalancer } from '../enhancedBalancer';

// Mock external dependencies for testing
jest.mock('../visualization/PubChemIntegration');

describe('Equation to Animation Workflow Integration Tests', () => {
  let container: HTMLDivElement;
  let animationController: EnhancedAnimationController;
  let mockPubChem: jest.Mocked<PubChemIntegration>;
  let mockMol3D: jest.Mocked<Mol3DWrapper>;
  let balancer: EnhancedChemicalEquationBalancer;

  const mockH2OStructure = `
  Molecule Name
  
  
    3  2  0  0  0  0  0  0  0  0999 V2000
      0.0000    0.0000    0.1173 O   0  0  0  0  0  0  0  0  0  0  0  0
      0.7572    0.0000   -0.4692 H   0  0  0  0  0  0  0  0  0  0  0  0
     -0.7572    0.0000   -0.4692 H   0  0  0  0  0  0  0  0  0  0  0  0
    1  2  1  0  0  0  0
    1  3  1  0  0  0  0
  M  END
  `;

  const mockO2Structure = `
  Molecule Name
  
  
    2  1  0  0  0  0  0  0  0  0999 V2000
      0.0000    0.0000    0.6077 O   0  0  0  0  0  0  0  0  0  0  0  0
      0.0000    0.0000   -0.6077 O   0  0  0  0  0  0  0  0  0  0  0  0
    1  2  2  0  0  0  0
  M  END
  `;

  const mockH2Structure = `
  Molecule Name
  
  
    2  1  0  0  0  0  0  0  0  0999 V2000
      0.0000    0.0000    0.3704 H   0  0  0  0  0  0  0  0  0  0  0  0
      0.0000    0.0000   -0.3704 H   0  0  0  0  0  0  0  0  0  0  0  0
    1  2  1  0  0  0  0
  M  END
  `;

  beforeEach(() => {
    // Create DOM elements for testing
    container = document.createElement('div');
    container.id = 'test-animation-container';
    document.body.appendChild(container);

    // Setup balancer
    balancer = new AdvancedBalancer();

    // Mock PubChem integration
    mockPubChem = {
      searchByName: jest.fn(),
      getCompound3DSDF: jest.fn(),
      getMolecularData: jest.fn(),
      isAvailable: jest.fn().mockReturnValue(true)
    } as any;

    // Mock Mol3D wrapper
    mockMol3D = {
      addMolecule: jest.fn().mockResolvedValue(undefined),
      setStyle: jest.fn(),
      render: jest.fn(),
      clear: jest.fn(),
      animateCamera: jest.fn().mockResolvedValue(undefined),
      addSurface: jest.fn(),
      zoomToFit: jest.fn()
    } as any;

    // Setup animation controller with mocked dependencies
    animationController = new EnhancedAnimationController(container, {
      duration: 2000,
      fps: 30,
      particleEffects: true,
      glowEffects: true
    });

    // Inject mocks
    (animationController as any).pubchemIntegration = mockPubChem;
    (animationController as any).mol3dWrapper = mockMol3D;
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  describe('Complete Workflow Tests', () => {
    test('should execute complete equation to animation workflow', async () => {
      // Step 1: Balance equation
      const equation = 'H2 + O2 = H2O';
      const balancedResult = balancer.balance(equation);
      
      expect(balancedResult.isBalanced).toBe(true);
      expect(balancedResult.equation).toContain('2 H2 + O2 = 2 H2O');

      // Step 2: Mock PubChem responses for molecular structures
      mockPubChem.searchByName
        .mockResolvedValueOnce('962') // H2O CID
        .mockResolvedValueOnce('977') // O2 CID  
        .mockResolvedValueOnce('783'); // H2 CID

      mockPubChem.getCompound3DSDF
        .mockResolvedValueOnce(mockH2OStructure)
        .mockResolvedValueOnce(mockO2Structure)
        .mockResolvedValueOnce(mockH2Structure);

      // Step 3: Execute animation workflow
      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] },
        { id: 'o2', formula: 'O2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      // Step 4: Verify animation execution
      await expect(
        animationController.animateReaction(reactants, products, { 
          showEnergyProfile: true,
          duration: 2000 
        })
      ).resolves.not.toThrow();

      // Step 5: Verify PubChem integration was called
      expect(mockPubChem.searchByName).toHaveBeenCalledWith('H2');
      expect(mockPubChem.searchByName).toHaveBeenCalledWith('O2');
      expect(mockPubChem.getCompound3DSDF).toHaveBeenCalledWith('783'); // H2
      expect(mockPubChem.getCompound3DSDF).toHaveBeenCalledWith('977'); // O2

      // Step 6: Verify 3D visualization was setup
      expect(mockMol3D.clear).toHaveBeenCalled();
      expect(mockMol3D.addMolecule).toHaveBeenCalled();
      expect(mockMol3D.render).toHaveBeenCalled();
    });

    test('should handle workflow with complex organic equation', async () => {
      const equation = 'C6H12O6 + O2 = CO2 + H2O'; // Glucose combustion
      const balancedResult = balancer.balance(equation);
      
      expect(balancedResult.isBalanced).toBe(true);

      // Mock PubChem responses for organic compounds
      mockPubChem.searchByName
        .mockResolvedValueOnce('5793') // Glucose CID
        .mockResolvedValueOnce('977')  // O2 CID
        .mockResolvedValueOnce('280')  // CO2 CID
        .mockResolvedValueOnce('962'); // H2O CID

      mockPubChem.getCompound3DSDF
        .mockResolvedValue('mock SDF structure data');

      const reactants = [
        { id: 'glucose', formula: 'C6H12O6', atoms: [], bonds: [] },
        { id: 'oxygen', formula: 'O2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'co2', formula: 'CO2', atoms: [], bonds: [] },
        { id: 'water', formula: 'H2O', atoms: [], bonds: [] }
      ];

      await expect(
        animationController.animateReaction(reactants, products, { 
          showEnergyProfile: true,
          reactionType: 'combustion' 
        })
      ).resolves.not.toThrow();

      // Verify all compounds were processed
      expect(mockPubChem.searchByName).toHaveBeenCalledTimes(4);
      expect(mockPubChem.getCompound3DSDF).toHaveBeenCalledTimes(4);
    });

    test('should handle PubChem API failures gracefully', async () => {
      // Mock PubChem failure
      mockPubChem.searchByName.mockRejectedValue(new Error('PubChem API unavailable'));

      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      // Should not throw error, but handle gracefully
      await expect(
        animationController.animateReaction(reactants, products)
      ).resolves.not.toThrow();

      // Verify fallback mode was activated
      expect(mockMol3D.clear).toHaveBeenCalled();
    });

    test('should validate animation timing and performance', async () => {
      const startTime = Date.now();
      
      mockPubChem.searchByName.mockResolvedValue('962');
      mockPubChem.getCompound3DSDF.mockResolvedValue(mockH2OStructure);

      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      await animationController.animateReaction(reactants, products, {
        duration: 1000 // 1 second animation
      });

      const executionTime = Date.now() - startTime;
      
      // Animation setup should complete within reasonable time (< 5 seconds)
      expect(executionTime).toBeLessThan(5000);
      
      // Verify performance metrics are available
      const metrics = animationController.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.fps).toBeGreaterThan(0);
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle invalid chemical formulas', async () => {
      const reactants = [
        { id: 'invalid', formula: 'XYZ123', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'water', formula: 'H2O', atoms: [], bonds: [] }
      ];

      mockPubChem.searchByName.mockRejectedValue(new Error('Compound not found'));

      // Should handle gracefully without crashing
      await expect(
        animationController.animateReaction(reactants, products)
      ).resolves.not.toThrow();
    });

    test('should validate required input parameters', async () => {
      // Test with null reactants
      await expect(
        animationController.animateReaction(null as any, [])
      ).rejects.toThrow('Invalid animation data: reactants and products are required');

      // Test with null products  
      await expect(
        animationController.animateReaction([], null as any)
      ).rejects.toThrow('Invalid animation data: reactants and products are required');
    });

    test('should handle 3D visualization failures', async () => {
      mockMol3D.addMolecule.mockRejectedValue(new Error('3D rendering failed'));
      
      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      // Should handle 3D rendering errors gracefully
      await expect(
        animationController.animateReaction(reactants, products)
      ).resolves.not.toThrow();
    });
  });

  describe('Animation Quality Tests', () => {
    test('should maintain consistent frame rate during animation', async () => {
      mockPubChem.searchByName.mockResolvedValue('962');
      mockPubChem.getCompound3DSDF.mockResolvedValue(mockH2OStructure);

      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      await animationController.animateReaction(reactants, products, {
        fps: 60,
        duration: 3000
      });

      const metrics = animationController.getPerformanceMetrics();
      
      // Verify frame rate is within acceptable range
      expect(metrics.fps).toBeGreaterThan(15); // Minimum acceptable FPS
      expect(metrics.fps).toBeLessThanOrEqual(60); // Max requested FPS
    });

    test('should support different animation styles', async () => {
      mockPubChem.searchByName.mockResolvedValue('962');
      mockPubChem.getCompound3DSDF.mockResolvedValue(mockH2OStructure);

      const reactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      
      const products = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      // Test different animation options
      await animationController.animateReaction(reactants, products, {
        animationStyle: 'smooth',
        showEnergyProfile: true,
        particleEffects: true,
        glowEffects: true
      });

      // Verify 3D effects were applied
      expect(mockMol3D.addSurface).toHaveBeenCalled();
      expect(mockMol3D.setStyle).toHaveBeenCalled();
    });
  });
});
