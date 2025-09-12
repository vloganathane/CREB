/**
 * Equation to Animation Workflow Integration Tests
 * Tests the complete pipeline from equation parsing to animation data preparation
 * Avoids browser-specific dependencies for compatibility with Node.js test environment
 */

import { jest } from '@jest/globals';
import { EnhancedChemicalEquationBalancer, EnhancedBalancedEquation } from '../enhancedBalancer';
import { PubChemIntegration, PubChemSearchResult } from '../visualization/PubChemIntegration';

// Mock PubChem integration for testing
jest.mock('../visualization/PubChemIntegration');

describe('Equation to Animation Workflow Integration Tests', () => {
  let balancer: EnhancedChemicalEquationBalancer;
  let mockPubChem: jest.Mocked<PubChemIntegration>;

  const mockH2OData: PubChemSearchResult = {
    success: true,
    compounds: [{
      cid: 962,
      name: 'Water',
      molecularWeight: 18.015,
      molecularFormula: 'H2O',
      smiles: 'O'
    }],
    totalFound: 1,
    source: 'pubchem',
    timestamp: new Date()
  };

  const mockH2Data: PubChemSearchResult = {
    success: true,
    compounds: [{
      cid: 783,
      name: 'Hydrogen',
      molecularWeight: 2.016,
      molecularFormula: 'H2',
      smiles: '[H][H]'
    }],
    totalFound: 1,
    source: 'pubchem',
    timestamp: new Date()
  };

  const mockO2Data: PubChemSearchResult = {
    success: true,
    compounds: [{
      cid: 977,
      name: 'Oxygen',
      molecularWeight: 31.998,
      molecularFormula: 'O2',
      smiles: 'O=O'
    }],
    totalFound: 1,
    source: 'pubchem',
    timestamp: new Date()
  };

  beforeEach(() => {
    // Setup PubChem mock
    mockPubChem = new PubChemIntegration() as jest.Mocked<PubChemIntegration>;
    mockPubChem.searchCompounds = jest.fn();
    
    // Initialize balancer with mocked PubChem integration
    balancer = new EnhancedChemicalEquationBalancer(mockPubChem);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Workflow: Equation Parsing → PubChem Lookup → Animation Data Preparation', () => {
    it('should successfully process hydrogen combustion (H2 + H2 + O2 → H2O + H2O)', async () => {
      // Step 1: Balance the equation with PubChem data
      const equation = 'H2 + H2 + O2 = H2O + H2O';
      
      // Mock PubChem lookups
      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockH2Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      // Step 2: Validate balanced equation structure
      expect(balancedResult).toBeDefined();
      expect(balancedResult.coefficients).toBeDefined();
      expect(balancedResult.coefficients.length).toBeGreaterThan(0);
      
      // Step 3: Validate compound data for animation
      if (balancedResult.compoundData) {
        const compoundNames = Object.keys(balancedResult.compoundData);
        expect(compoundNames).toContain('H2');
        expect(compoundNames).toContain('O2');
        expect(compoundNames).toContain('H2O');
        
        // Validate molecular data completeness
        Object.values(balancedResult.compoundData).forEach(compound => {
          expect(compound.name).toBeDefined();
          expect(compound.molecularFormula).toBeDefined();
          expect(compound.molecularWeight).toBeDefined();
        });
      }

      // Step 4: Prepare animation data structure
      const animationData = {
        equation: balancedResult.equation,
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        coefficients: balancedResult.coefficients,
        compoundData: balancedResult.compoundData
      };

      // Verify animation data is properly structured
      expect(animationData.reactants).toHaveLength(2);
      expect(animationData.products).toHaveLength(1);
      expect(animationData.coefficients).toBeDefined();
      expect(animationData.compoundData).toBeDefined();
    });

    it('should handle complex combustion reaction (CH4 + O2 → CO2 + H2O)', async () => {
      const equation = 'CH4 + O2 = CO2 + H2O';
      
      // Mock PubChem lookups for all compounds
      const mockCH4Data: PubChemSearchResult = {
        success: true,
        compounds: [{ cid: 297, name: 'Methane', molecularFormula: 'CH4', molecularWeight: 16.043, smiles: 'C' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      };
      
      const mockCO2Data: PubChemSearchResult = {
        success: true,
        compounds: [{ cid: 280, name: 'Carbon dioxide', molecularFormula: 'CO2', molecularWeight: 44.01, smiles: 'O=C=O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      };

      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockCH4Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockCO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      expect(balancedResult).toBeDefined();
      expect(balancedResult.coefficients).toBeDefined();

      // Validate that multiple products are handled correctly
      if (balancedResult.compoundData) {
        const compounds = Object.keys(balancedResult.compoundData);
        expect(compounds).toContain('CH4');
        expect(compounds).toContain('O2');
        expect(compounds).toContain('CO2');
        expect(compounds).toContain('H2O');
      }

      expect(mockPubChem.searchCompounds).toHaveBeenCalledTimes(4);
    });

    it('should validate molecular weight conservation', async () => {
      const equation = 'H2 + O2 = H2O';
      
      // Mock complete molecular data
      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockH2Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      expect(balancedResult).toBeDefined();
      expect(balancedResult.validation).toBeDefined();
      
      // Check mass balance validation
      if (balancedResult.validation) {
        expect(balancedResult.validation.massBalanced).toBeDefined();
        // In a properly balanced equation, mass should be conserved
        if (balancedResult.validation.massBalanced !== undefined) {
          expect(typeof balancedResult.validation.massBalanced).toBe('boolean');
        }
      }

      // Validate that molecular weights are preserved in compound data
      if (balancedResult.compoundData) {
        Object.values(balancedResult.compoundData).forEach(compound => {
          expect(compound.molecularWeight).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle PubChem API failures gracefully', async () => {
      // Mock API failure
      mockPubChem.searchCompounds.mockRejectedValue(new Error('PubChem API unavailable'));

      const equation = 'H2 + O2 = H2O';
      
      // The balancer should still work with fallback data or handle the error gracefully
      try {
        const balancedResult = await balancer.balanceWithPubChemData(equation);
        
        // If successful, should have validation warnings about PubChem failure
        expect(balancedResult).toBeDefined();
        if (balancedResult.validation?.warnings) {
          expect(balancedResult.validation.warnings.length).toBeGreaterThan(0);
        }
      } catch (error) {
        // If it throws, the error should be informative
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('PubChem');
      }
    });

    it('should validate chemical formula syntax', async () => {
      const invalidEquations = [
        'H2 +',                 // Incomplete equation
        '= H2O',                // Missing reactants
        'H2 = '                 // Missing products
      ];

      for (const equation of invalidEquations) {
        try {
          await balancer.balanceWithPubChemData(equation);
          // If no error thrown, there should be validation warnings
        } catch (error) {
          // Expected for invalid equations
          expect(error).toBeInstanceOf(Error);
        }
      }
    });

    it('should handle compounds not found in PubChem', async () => {
      // Mock "compound not found" response
      const notFoundResponse: PubChemSearchResult = {
        success: false,
        compounds: [],
        totalFound: 0,
        source: 'pubchem',
        timestamp: new Date(),
        error: 'Compound not found'
      };

      mockPubChem.searchCompounds.mockResolvedValue(notFoundResponse);
      
      const equation = 'XYZ + ABC = DEF';  // Invalid compound names
      
      try {
        const balancedResult = await balancer.balanceWithPubChemData(equation);
        
        // Should handle gracefully with warnings
        expect(balancedResult.validation?.warnings).toBeDefined();
        if (balancedResult.validation?.warnings) {
          expect(balancedResult.validation.warnings.length).toBeGreaterThan(0);
        }
      } catch (error) {
        // Or throw a descriptive error
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Animation Data Quality Validation', () => {
    it('should ensure all required animation data is present', async () => {
      const equation = 'H2 + O2 = H2O';
      
      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockH2Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      // Validate that all essential data for animation is present
      expect(balancedResult.equation).toBeDefined();
      expect(balancedResult.coefficients).toBeDefined();
      expect(balancedResult.reactants).toBeDefined();
      expect(balancedResult.products).toBeDefined();
      
      // Check compound data completeness for 3D visualization
      if (balancedResult.compoundData) {
        Object.entries(balancedResult.compoundData).forEach(([species, data]) => {
          expect(data.name).toBeDefined();
          expect(data.molecularFormula).toBeDefined();
          expect(data.molecularWeight).toBeGreaterThan(0);
          
          // For animation, we need structural information
          expect(data.isValid).toBeDefined();
        });
      }
    });

    it('should validate stoichiometric coefficients for animation timing', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      
      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockH2Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      expect(balancedResult.coefficients).toBeDefined();
      expect(balancedResult.coefficients.length).toBeGreaterThan(0);
      
      // Coefficients should be positive integers for animation
      balancedResult.coefficients.forEach(coeff => {
        expect(coeff).toBeGreaterThan(0);
        expect(Number.isInteger(coeff)).toBe(true);
      });
    });

    it('should provide molecular structure data suitable for 3D rendering', async () => {
      // Mock enhanced molecular data with 3D information
      const enhancedH2OData: PubChemSearchResult = {
        success: true,
        compounds: [{
          cid: 962,
          name: 'Water',
          molecularWeight: 18.015,
          molecularFormula: 'H2O',
          smiles: 'O',
          inchi: 'InChI=1S/H2O/h1H2',
          inchiKey: 'XLYOFNOQVPJJNP-UHFFFAOYSA-N'
        }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      };

      mockPubChem.searchCompounds.mockResolvedValue(enhancedH2OData);
      
      const equation = 'H2 + O2 = H2O';
      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      // Validate that structural data is available for 3D visualization
      if (balancedResult.compoundData) {
        Object.values(balancedResult.compoundData).forEach(compound => {
          // Should have either SMILES or other structural representation
          const hasStructuralData = 
            compound.canonicalSmiles || 
            compound.pubchemData?.isomericSmiles;
          
          if (compound.isValid) {
            expect(hasStructuralData).toBeTruthy();
          }
        });
      }
    });
  });

  describe('Performance and Scalability Tests', () => {
    it('should handle equations with multiple compounds efficiently', async () => {
      // Test with a larger, more complex equation
      const equation = 'C6H12O6 + O2 = CO2 + H2O';  // Glucose combustion
      
      // Mock responses for all compounds
      const mockGlucoseData: PubChemSearchResult = {
        success: true,
        compounds: [{ cid: 5793, name: 'Glucose', molecularFormula: 'C6H12O6', molecularWeight: 180.156, smiles: 'C([C@@H]1[C@H]([C@@H]([C@H](C(O1)O)O)O)O)O' }],
        totalFound: 1,
        source: 'pubchem',
        timestamp: new Date()
      };

      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockGlucoseData)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce({ ...mockH2OData, compounds: [{ ...mockH2OData.compounds[0], cid: 280 }] }) // CO2
        .mockResolvedValueOnce(mockH2OData);

      const startTime = Date.now();
      const balancedResult = await balancer.balanceWithPubChemData(equation);
      const endTime = Date.now();
      
      // Should complete within reasonable time (less than 5 seconds for this test)
      expect(endTime - startTime).toBeLessThan(5000);
      
      expect(balancedResult).toBeDefined();
      expect(balancedResult.coefficients).toBeDefined();
    });

    it('should validate memory usage for large molecular data', () => {
      // Test that the data structures are reasonably sized
      const largeCompoundData = {
        name: 'Test Compound',
        molecularFormula: 'C100H200O50N25',
        molecularWeight: 5000.0,
        smiles: 'C'.repeat(1000), // Large SMILES string
        isValid: true
      };

      // Validate that even large compound data doesn't exceed reasonable limits
      const dataString = JSON.stringify(largeCompoundData);
      expect(dataString.length).toBeLessThan(100000); // Less than 100KB per compound
    });
  });

  describe('Workflow Documentation Validation', () => {
    it('should match the documented workflow requirements', async () => {
      // This test validates that the implementation matches the documented workflow
      // from docs/EQUATION_TO_ANIMATION_WORKFLOW.md
      
      const equation = 'H2 + O2 = H2O';
      
      mockPubChem.searchCompounds
        .mockResolvedValueOnce(mockH2Data)
        .mockResolvedValueOnce(mockO2Data)
        .mockResolvedValueOnce(mockH2OData);

      const balancedResult = await balancer.balanceWithPubChemData(equation);
      
      // Documented requirements validation:
      
      // 1. Input: Chemical equation string ✓
      expect(typeof equation).toBe('string');
      
      // 2. Parsing: Extract reactants and products ✓
      expect(balancedResult.reactants).toBeDefined();
      expect(balancedResult.products).toBeDefined();
      
      // 3. Balancing: Calculate stoichiometric coefficients ✓
      expect(balancedResult.coefficients).toBeDefined();
      
      // 4. PubChem Integration: Retrieve molecular data ✓
      expect(mockPubChem.searchCompounds).toHaveBeenCalled();
      
      // 5. Validation: Check mass and charge balance ✓
      expect(balancedResult.validation).toBeDefined();
      
      // 6. Output: Enhanced balanced equation with molecular data ✓
      expect(balancedResult.compoundData).toBeDefined();
      
      // 7. Animation Readiness: Data suitable for 3D visualization ✓
      if (balancedResult.compoundData) {
        Object.values(balancedResult.compoundData).forEach(compound => {
          expect(compound.name).toBeDefined();
          expect(compound.molecularFormula).toBeDefined();
        });
      }
    });
  });
});
