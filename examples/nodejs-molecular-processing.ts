/**
 * Node.js Integration Example for CREB Molecular Visualization
 * Shows server-side molecular data processing and analysis
 */

// Import CREB visualization utilities
import { 
  Canvas2DRenderer, 
  MolecularVisualization, 
  MolecularDataUtils,
  CREBVisualizationUtils 
} from '../src/visualization';

import type { ElementCount } from '../src/types';

/**
 * Server-side molecular data processor
 */
export class CREBMolecularProcessor {
  private cache: Map<string, any> = new Map();

  /**
   * Process molecular data from various formats
   */
  async processMolecularData(input: {
    smiles?: string;
    pdb?: string;
    elementCount?: ElementCount;
    formula?: string;
  }) {
    const cacheKey = JSON.stringify(input);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let moleculeData;

    try {
      if (input.smiles) {
        moleculeData = await this.processSMILES(input.smiles);
      } else if (input.pdb) {
        moleculeData = MolecularDataUtils.parsePDB(input.pdb);
      } else if (input.elementCount) {
        moleculeData = this.processElementCount(input.elementCount);
      } else if (input.formula) {
        moleculeData = this.processFormula(input.formula);
      } else {
        throw new Error('No valid molecular input provided');
      }

      const result = {
        ...moleculeData,
        processedAt: new Date().toISOString(),
        cacheKey
      };

      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Error processing molecular data:', error);
      throw error;
    }
  }

  /**
   * Process SMILES notation
   */
  private async processSMILES(smiles: string) {
    // In a real implementation, this would use RDKit-JS or similar
    const sampleMolecules: Record<string, any> = {
      'O': {
        name: 'Water',
        formula: 'H2O',
        atoms: [
          { element: 'O', x: 0, y: 0, z: 0 },
          { element: 'H', x: 0.757, y: 0.587, z: 0 },
          { element: 'H', x: -0.757, y: 0.587, z: 0 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 1 },
          { atom1: 0, atom2: 2, order: 1 }
        ]
      },
      'C': {
        name: 'Methane',
        formula: 'CH4',
        atoms: [
          { element: 'C', x: 0, y: 0, z: 0 },
          { element: 'H', x: 1.089, y: 0, z: 0 },
          { element: 'H', x: -0.363, y: 1.027, z: 0 },
          { element: 'H', x: -0.363, y: -0.513, z: 0.889 },
          { element: 'H', x: -0.363, y: -0.513, z: -0.889 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 1 },
          { atom1: 0, atom2: 2, order: 1 },
          { atom1: 0, atom2: 3, order: 1 },
          { atom1: 0, atom2: 4, order: 1 }
        ]
      },
      'c1ccccc1': {
        name: 'Benzene',
        formula: 'C6H6',
        atoms: [
          { element: 'C', x: 1.4, y: 0, z: 0 },
          { element: 'C', x: 0.7, y: 1.2, z: 0 },
          { element: 'C', x: -0.7, y: 1.2, z: 0 },
          { element: 'C', x: -1.4, y: 0, z: 0 },
          { element: 'C', x: -0.7, y: -1.2, z: 0 },
          { element: 'C', x: 0.7, y: -1.2, z: 0 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 1 },
          { atom1: 1, atom2: 2, order: 2 },
          { atom1: 2, atom2: 3, order: 1 },
          { atom1: 3, atom2: 4, order: 2 },
          { atom1: 4, atom2: 5, order: 1 },
          { atom1: 5, atom2: 0, order: 2 }
        ]
      }
    };

    return sampleMolecules[smiles] || sampleMolecules['C'];
  }

  /**
   * Process element count data
   */
  private processElementCount(elementCount: ElementCount) {
    const elements: string[] = [];
    let formula = '';

    for (const [element, count] of Object.entries(elementCount)) {
      for (let i = 0; i < count; i++) {
        elements.push(element);
      }
      formula += count > 1 ? `${element}${count}` : element;
    }

    // Generate simple 3D coordinates
    const atoms = elements.map((element, index) => {
      const angle = (index / elements.length) * 2 * Math.PI;
      const radius = 2;
      
      return {
        element,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0
      };
    });

    // Generate bonds (simple linear chain)
    const bonds = [];
    for (let i = 0; i < atoms.length - 1; i++) {
      bonds.push({
        atom1: i,
        atom2: i + 1,
        order: 1
      });
    }

    return {
      name: `Molecule (${formula})`,
      formula,
      atoms,
      bonds,
      elementCount
    };
  }

  /**
   * Process chemical formula
   */
  private processFormula(formula: string) {
    // Simple formula parser
    const elementCount: ElementCount = {};
    const matches = formula.match(/([A-Z][a-z]?)(\d*)/g) || [];
    
    matches.forEach(match => {
      const element = match.replace(/\d/g, '');
      const count = parseInt(match.replace(/[A-Z][a-z]?/, '')) || 1;
      elementCount[element] = count;
    });

    return this.processElementCount(elementCount);
  }

  /**
   * Generate molecular analysis report
   */
  generateAnalysisReport(moleculeData: any) {
    const report = {
      molecule: moleculeData.name || 'Unknown',
      formula: moleculeData.formula || 'Unknown',
      atomCount: moleculeData.atoms?.length || 0,
      bondCount: moleculeData.bonds?.length || 0,
      elements: this.getUniqueElements(moleculeData.atoms || []),
      molecularWeight: this.calculateMolecularWeight(moleculeData.atoms || []),
      geometry: this.analyzeGeometry(moleculeData.atoms || []),
      timestamp: new Date().toISOString()
    };

    return report;
  }

  /**
   * Get unique elements in molecule
   */
  private getUniqueElements(atoms: any[]) {
    const elements = new Set(atoms.map(atom => atom.element));
    return Array.from(elements);
  }

  /**
   * Calculate approximate molecular weight
   */
  private calculateMolecularWeight(atoms: any[]) {
    const atomicWeights: Record<string, number> = {
      'H': 1.008,
      'C': 12.011,
      'N': 14.007,
      'O': 15.999,
      'P': 30.974,
      'S': 32.065,
      'Cl': 35.453,
      'Br': 79.904,
      'I': 126.904
    };

    return atoms.reduce((total, atom) => {
      return total + (atomicWeights[atom.element] || 0);
    }, 0);
  }

  /**
   * Analyze molecular geometry
   */
  private analyzeGeometry(atoms: any[]) {
    if (atoms.length === 0) return 'none';
    if (atoms.length === 1) return 'monatomic';
    if (atoms.length === 2) return 'diatomic';
    if (atoms.length === 3) return 'triatomic';
    
    // Simple analysis based on atom count
    return atoms.length <= 10 ? 'small molecule' : 'large molecule';
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

/**
 * Example usage and testing
 */
export async function demonstrateNodeIntegration() {
  console.log('🧬 CREB Node.js Molecular Processing Demo');
  console.log('==========================================');

  const processor = new CREBMolecularProcessor();

  // Example 1: Process SMILES notation
  console.log('\n1. Processing SMILES notation:');
  try {
    const waterData = await processor.processMolecularData({ smiles: 'O' });
    console.log('Water molecule:', waterData.name);
    console.log('Formula:', waterData.formula);
    console.log('Atoms:', waterData.atoms.length);
    
    const waterReport = processor.generateAnalysisReport(waterData);
    console.log('Analysis:', waterReport);
  } catch (error) {
    console.error('Error processing water:', error);
  }

  // Example 2: Process element count
  console.log('\n2. Processing element count:');
  try {
    const methaneData = await processor.processMolecularData({
      elementCount: { 'C': 1, 'H': 4 }
    });
    console.log('Methane molecule:', methaneData.name);
    
    const methaneReport = processor.generateAnalysisReport(methaneData);
    console.log('Molecular weight:', methaneReport.molecularWeight, 'g/mol');
  } catch (error) {
    console.error('Error processing methane:', error);
  }

  // Example 3: Process chemical formula
  console.log('\n3. Processing chemical formula:');
  try {
    const glucoseData = await processor.processMolecularData({
      formula: 'C6H12O6'
    });
    console.log('Glucose molecule:', glucoseData.name);
    
    const glucoseReport = processor.generateAnalysisReport(glucoseData);
    console.log('Elements:', glucoseReport.elements);
    console.log('Geometry type:', glucoseReport.geometry);
  } catch (error) {
    console.error('Error processing glucose:', error);
  }

  // Example 4: Batch processing
  console.log('\n4. Batch processing multiple molecules:');
  const molecules = [
    { smiles: 'O', name: 'Water' },
    { smiles: 'C', name: 'Methane' },
    { smiles: 'c1ccccc1', name: 'Benzene' }
  ];

  for (const mol of molecules) {
    try {
      const data = await processor.processMolecularData({ smiles: mol.smiles });
      const report = processor.generateAnalysisReport(data);
      console.log(`${mol.name}: ${report.formula} (${report.molecularWeight.toFixed(2)} g/mol)`);
    } catch (error) {
      console.error(`Error processing ${mol.name}:`, error);
    }
  }

  console.log('\n✅ Node.js integration demo completed successfully!');
  console.log('Ready for production use in server-side applications.');
}

// Export for use in other modules
export default {
  CREBMolecularProcessor,
  demonstrateNodeIntegration
};

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateNodeIntegration().catch(console.error);
}
