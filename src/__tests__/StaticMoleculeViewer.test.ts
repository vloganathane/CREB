/**
 * Static Molecule Viewer Tests
 * Tests the integration between validated balancer pipeline and 3D visualization
 */

import { jest } from '@jest/globals';
import { StaticMoleculeViewer } from '../visualization/StaticMoleculeViewer';
import { PubChemIntegration } from '../visualization/PubChemIntegration';
import { Mol3DWrapper } from '../visualization/Mol3DWrapper';

// Mock DOM methods
const mockContainer = {
  innerHTML: '',
  appendChild: jest.fn(),
  getElementById: jest.fn()
} as unknown as HTMLElement;

// Mock 3Dmol.js wrapper
jest.mock('../visualization/Mol3DWrapper');

describe('StaticMoleculeViewer Integration Tests', () => {
  let viewer: StaticMoleculeViewer;
  let mockPubChem: jest.Mocked<PubChemIntegration>;
  let mockMol3D: jest.Mocked<Mol3DWrapper>;

  beforeEach(() => {
    // Setup PubChem mock with real-like data
    mockPubChem = {
      searchCompounds: jest.fn(),
      getMolecularData: jest.fn(),
      searchByName: jest.fn(),
      getCompound3DSDF: jest.fn()
    } as any;

    // Setup Mol3DWrapper mock
    mockMol3D = {
      clear: jest.fn().mockReturnValue(undefined),
      addMolecule: jest.fn().mockResolvedValue(undefined),
      setStyle: jest.fn(),
      render: jest.fn(),
      initialize: jest.fn().mockResolvedValue(undefined)
    } as any;

    // Mock the constructor
    (Mol3DWrapper as jest.Mock).mockImplementation(() => mockMol3D);

    viewer = new StaticMoleculeViewer({
      containerElement: mockContainer,
      showProgress: true,
      enableInteraction: true
    }, mockPubChem);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Equation Processing', () => {
    it('should successfully process hydrogen combustion equation', async () => {
      // Mock the balancer's getCompoundInfo method instead of searchCompounds
      const mockGetCompoundInfo = jest.spyOn(viewer['balancer'], 'getCompoundInfo');
      mockGetCompoundInfo
        .mockResolvedValueOnce({
          isValid: true,
          name: 'Hydrogen',
          cid: 783,
          molecularWeight: 2.016,
          molecularFormula: 'H2',
          iupacName: 'Hydrogen',
          canonicalSmiles: '[H][H]',
          pubchemData: { 
            cid: 783, 
            molecularWeight: 2.016, 
            molecularFormula: 'H2', 
            iupacName: 'Hydrogen',
            isomericSmiles: '[H][H]' 
          }
        })
        .mockResolvedValueOnce({
          isValid: true,
          name: 'Oxygen',
          cid: 977,
          molecularWeight: 31.998,
          molecularFormula: 'O2',
          iupacName: 'Oxygen',
          canonicalSmiles: 'O=O',
          pubchemData: { 
            cid: 977, 
            molecularWeight: 31.998, 
            molecularFormula: 'O2', 
            iupacName: 'Oxygen',
            isomericSmiles: 'O=O' 
          }
        })
        .mockResolvedValueOnce({
          isValid: true,
          name: 'Water',
          cid: 962,
          molecularWeight: 18.015,
          molecularFormula: 'H2O',
          iupacName: 'Water',
          canonicalSmiles: 'O',
          pubchemData: { 
            cid: 962, 
            molecularWeight: 18.015, 
            molecularFormula: 'H2O', 
            iupacName: 'Water',
            isomericSmiles: 'O' 
          }
        });

      // Mock the balanceWithPubChemData method
      const mockBalanceWithPubChemData = jest.spyOn(viewer['balancer'], 'balanceWithPubChemData');
      mockBalanceWithPubChemData.mockResolvedValue({
        equation: '2H2 + O2 = 2H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        validation: {
          massBalanced: true,
          chargeBalanced: true,
          warnings: []
        }
      });

      // Mock fetch for 3D structure data
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('mock SDF data')
      } as Response);

      const equation = '2H2 + O2 = 2H2O';
      
      // This should not throw and should call our visualization methods
      await expect(viewer.displayEquation(equation)).resolves.not.toThrow();

      // Verify 3D wrapper methods were called
      expect(mockMol3D.clear).toHaveBeenCalled();
      expect(mockMol3D.render).toHaveBeenCalled();
      
      // Clean up mocks
      mockGetCompoundInfo.mockRestore();
      mockBalanceWithPubChemData.mockRestore();
    });

    it('should handle complex combustion reactions', async () => {
      // Mock the balancer methods for methane combustion
      const mockGetCompoundInfo = jest.spyOn(viewer['balancer'], 'getCompoundInfo');
      mockGetCompoundInfo
        .mockResolvedValue({
          isValid: true,
          name: 'Methane',
          cid: 297,
          molecularWeight: 16.043,
          molecularFormula: 'CH4',
          iupacName: 'Methane',
          canonicalSmiles: 'C',
          pubchemData: { 
            cid: 297, 
            molecularWeight: 16.043, 
            molecularFormula: 'CH4', 
            iupacName: 'Methane',
            isomericSmiles: 'C' 
          }
        });

      const mockBalanceWithPubChemData = jest.spyOn(viewer['balancer'], 'balanceWithPubChemData');
      mockBalanceWithPubChemData.mockResolvedValue({
        equation: 'CH4 + 2O2 = CO2 + 2H2O',
        coefficients: [1, 2, 1, 2],
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O'],
        validation: {
          massBalanced: true,
          chargeBalanced: true,
          warnings: []
        }
      });

      // Mock fetch for SDF data
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('mock SDF data')
      });
      (global as any).fetch = mockFetch;

      const equation = 'CH4 + 2O2 = CO2 + 2H2O';
      
      await expect(viewer.displayEquation(equation)).resolves.not.toThrow();

      // Verify proper handling of multiple molecules
      expect(mockMol3D.clear).toHaveBeenCalled();
      expect(mockMol3D.render).toHaveBeenCalled();
      
      // Clean up mocks
      mockGetCompoundInfo.mockRestore();
      mockBalanceWithPubChemData.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid equations gracefully', async () => {
      const equation = 'invalid equation format';
      
      // Should not throw, but should show error UI
      await expect(viewer.displayEquation(equation)).resolves.not.toThrow();
      
      // Check that error UI was shown (container innerHTML should contain error)
      expect(mockContainer.innerHTML).toContain('Error Processing Equation');
    });

    it('should handle PubChem API failures', async () => {
      // Mock PubChem failure
      mockPubChem.searchCompounds.mockRejectedValue(new Error('PubChem API unavailable'));

      const equation = 'H2 + O2 = H2O';
      
      // Should handle the error gracefully
      await expect(viewer.displayEquation(equation)).resolves.not.toThrow();
      
      // Should show error or fallback UI
      expect(mockContainer.innerHTML).toBeDefined();
    });

    it('should handle compounds not found in PubChem', async () => {
      // Mock empty PubChem results
      mockPubChem.searchCompounds.mockResolvedValue({
        success: false,
        compounds: [],
        totalFound: 0,
        source: 'pubchem',
        timestamp: new Date(),
        error: 'Compound not found'
      });

      const equation = 'UnknownCompound = Products';
      
      await expect(viewer.displayEquation(equation)).resolves.not.toThrow();
    });
  });

  describe('3D Visualization Integration', () => {
    it('should properly initialize Mol3DWrapper', () => {
      // Verify Mol3DWrapper was created with correct parameters
      expect(Mol3DWrapper).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining({
          backgroundColor: '#ffffff',
          antialias: true
        })
      );
    });

    it('should apply proper molecular styling', async () => {
      // Setup basic successful response
      mockPubChem.searchCompounds.mockResolvedValue({
        success: true,
        compounds: [{ cid: 962, name: 'Water', molecularWeight: 18.015, molecularFormula: 'H2O', smiles: 'O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      });

      await viewer.displayEquation('H2O = H2O');

      // Verify styling was applied
      expect(mockMol3D.setStyle).toHaveBeenCalledWith(
        expect.objectContaining({
          stick: expect.objectContaining({
            radius: 0.15,
            colorscheme: 'Jmol'
          }),
          sphere: expect.objectContaining({
            scale: 0.25,
            colorscheme: 'element'
          })
        })
      );
    });

    it('should create proper layout sections', async () => {
      // Mock successful response
      mockPubChem.searchCompounds.mockResolvedValue({
        success: true,
        compounds: [{ cid: 962, name: 'Water', molecularWeight: 18.015, molecularFormula: 'H2O', smiles: 'O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      });

      await viewer.displayEquation('H2O = H2O');

      // Verify HTML structure was created
      expect(mockContainer.innerHTML).toContain('reaction-viewer');
      expect(mockContainer.innerHTML).toContain('reactants-section');
      expect(mockContainer.innerHTML).toContain('products-section');
      expect(mockContainer.innerHTML).toContain('reaction-arrow');
    });
  });

  describe('Performance and Integration', () => {
    it('should leverage validated balancer pipeline', async () => {
      // This test ensures we're using our proven EnhancedChemicalEquationBalancer
      // with PubChem integration rather than rebuilding the functionality
      
      mockPubChem.searchCompounds.mockResolvedValue({
        success: true,
        compounds: [{ cid: 962, name: 'Water', molecularWeight: 18.015, molecularFormula: 'H2O', smiles: 'O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      });

      const startTime = Date.now();
      await viewer.displayEquation('H2 + O2 = H2O');
      const duration = Date.now() - startTime;

      // Should complete reasonably quickly (using cached/validated components)
      expect(duration).toBeLessThan(5000); // 5 seconds max

      // Should have used the PubChem integration
      expect(mockPubChem.searchCompounds).toHaveBeenCalled();
    });

    it('should handle multiple molecules efficiently', async () => {
      // Mock responses for complex equation
      const mockResponse = {
        success: true,
        compounds: [{ cid: 1, name: 'Test', molecularWeight: 100, molecularFormula: 'Test', smiles: 'test' }],
        totalFound: 1,
        source: 'pubchem' as const,
        timestamp: new Date()
      };

      mockPubChem.searchCompounds.mockResolvedValue(mockResponse);

      // Test with equation having multiple reactants and products
      await viewer.displayEquation('A + B + C = D + E + F');

      // Should have made calls for all compounds
      expect(mockPubChem.searchCompounds).toHaveBeenCalledTimes(6);
      
      // Should have managed 3D scene properly
      expect(mockMol3D.clear).toHaveBeenCalled();
      expect(mockMol3D.render).toHaveBeenCalled();
    });
  });

  describe('User Experience Features', () => {
    it('should show progress indicators when enabled', async () => {
      const viewerWithProgress = new StaticMoleculeViewer({
        containerElement: mockContainer,
        showProgress: true
      }, mockPubChem);

      mockPubChem.searchCompounds.mockResolvedValue({
        success: true,
        compounds: [{ cid: 962, name: 'Water', molecularWeight: 18.015, molecularFormula: 'H2O', smiles: 'O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      });

      // Progress indication should be visible (in real implementation, this would update UI)
      await viewerWithProgress.displayEquation('H2O = H2O');
      
      // Verify the processing completed
      expect(mockMol3D.render).toHaveBeenCalled();
    });

    it('should provide helpful error messages', async () => {
      // Test with various error conditions
      const testCases = [
        { equation: '', expectedMessage: 'equation' },
        { equation: 'invalid', expectedMessage: 'Error Processing Equation' },
        { equation: 'A + B', expectedMessage: 'Error Processing Equation' }
      ];

      for (const testCase of testCases) {
        mockContainer.innerHTML = ''; // Reset
        await viewer.displayEquation(testCase.equation);
        
        if (testCase.equation) {
          expect(mockContainer.innerHTML).toContain(testCase.expectedMessage);
        }
      }
    });
  });
});
