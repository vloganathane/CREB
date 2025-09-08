/**
 * Enhanced Molecular Visualization with RDKit.js, 3Dmol.js, and PubChem Integration
 * Unified API for advanced 2D/3D molecular structure visualization and processing
 * 
 * This module integrates RDKit.js, 3Dmol.js, and PubChem wrappers with the existing CREB
 * visualization system to provide comprehensive molecular visualization capabilities.
 */

import { Canvas2DRenderer, type Molecule2D } from './Canvas2DRenderer';
import { SVGRenderer } from './SVGRenderer';
import { RDKitWrapper, type RDKitMolecule, type MolecularProperties } from './RDKitWrapper';
import { Mol3DWrapper, type Mol3DMolecule, type Mol3DStyle } from './Mol3DWrapper';
import { PubChemIntegration, type PubChemCompound, type CompoundSearchOptions, type PubChemSearchResult } from './PubChemIntegration';

export interface EnhancedVisualizationConfig {
  // 2D Configuration
  canvas2D?: {
    width: number;
    height: number;
    backgroundColor: string;
    interactive: boolean;
  };
  
  // 3D Configuration
  mol3D?: {
    width: number;
    height: number;
    backgroundColor: string;
    style: string;
    interactive: boolean;
  };
  
  // RDKit Configuration
  rdkit?: {
    generateCoords: boolean;
    sanitize: boolean;
    removeHs: boolean;
  };
  
  // Export Configuration
  export?: {
    formats: ('png' | 'jpg' | 'svg' | 'pdb' | 'sdf')[];
    quality: number;
  };
}

export interface MolecularAnalysisResult {
  molecule: RDKitMolecule;
  properties: MolecularProperties;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  visualization: {
    svg2D: string;
    hasCoordinates: boolean;
    canRender3D: boolean;
  };
}

export interface VisualizationExports {
  png2D?: string;
  jpg2D?: string;
  svg2D?: string;
  png3D?: string;
  pdb?: string;
  sdf?: string;
}

/**
 * Enhanced Molecular Visualization Class
 * Combines Canvas2D, RDKit.js, 3Dmol.js, and PubChem for comprehensive molecular visualization
 */
export class EnhancedMolecularVisualization {
  private canvas2DRenderer: Canvas2DRenderer | null = null;
  private svgRenderer: SVGRenderer | null = null;
  private rdkitWrapper: RDKitWrapper;
  private mol3DWrapper: Mol3DWrapper | null = null;
  private pubchemIntegration: PubChemIntegration;
  private config: EnhancedVisualizationConfig;
  private currentMolecule: RDKitMolecule | null = null;
  private currentPubChemCompound: PubChemCompound | null = null;

  constructor(config: Partial<EnhancedVisualizationConfig> = {}) {
    this.config = {
      canvas2D: {
        width: 600,
        height: 400,
        backgroundColor: '#ffffff',
        interactive: true,
        ...config.canvas2D
      },
      mol3D: {
        width: 600,
        height: 400,
        backgroundColor: '#ffffff',
        style: 'ball-and-stick',
        interactive: true,
        ...config.mol3D
      },
      rdkit: {
        generateCoords: true,
        sanitize: true,
        removeHs: true,
        ...config.rdkit
      },
      export: {
        formats: ['png', 'svg'],
        quality: 0.9,
        ...config.export
      }
    };

    this.rdkitWrapper = new RDKitWrapper(this.config.rdkit);
    this.pubchemIntegration = new PubChemIntegration();
  }

  /**
   * Initialize all visualization components
   */
  async initialize(
    canvas2DElement?: HTMLCanvasElement,
    mol3DContainer?: HTMLElement | string
  ): Promise<void> {
    // Initialize RDKit wrapper
    await this.rdkitWrapper.initialize();

    // Initialize 2D Canvas renderer if element provided
    if (canvas2DElement) {
      this.canvas2DRenderer = new Canvas2DRenderer(canvas2DElement, this.config.canvas2D);
      this.svgRenderer = new SVGRenderer(this.config.canvas2D);
    }

    // Initialize 3D viewer if container provided
    if (mol3DContainer) {
      this.mol3DWrapper = new Mol3DWrapper(mol3DContainer, this.config.mol3D);
      await this.mol3DWrapper.initialize();
    }
  }

  /**
   * Load and analyze molecule from SMILES string
   */
  async loadMoleculeFromSMILES(smiles: string): Promise<MolecularAnalysisResult> {
    // Validate SMILES
    const isValid = await this.rdkitWrapper.validateSMILES(smiles);
    if (!isValid) {
      throw new Error(`Invalid SMILES: ${smiles}`);
    }

    // Parse molecule with RDKit
    const molecule = await this.rdkitWrapper.parseSMILES(smiles);
    if (!molecule) {
      throw new Error(`Failed to parse SMILES: ${smiles}`);
    }

    // Calculate molecular properties
    const properties = await this.rdkitWrapper.calculateDescriptors(smiles);

    // Generate 2D SVG representation
    const svg2D = await this.rdkitWrapper.generateSVG(smiles, {
      width: this.config.canvas2D!.width,
      height: this.config.canvas2D!.height
    });

    this.currentMolecule = molecule;

    const result: MolecularAnalysisResult = {
      molecule,
      properties,
      validation: {
        isValid: true,
        errors: [],
        warnings: []
      },
      visualization: {
        svg2D,
        hasCoordinates: molecule.atoms.length > 0,
        canRender3D: molecule.atoms.length > 0 && molecule.atoms.some(a => a.z !== undefined)
      }
    };

    // Load into visualization components
    await this.updateVisualizations(molecule);

    return result;
  }

  /**
   * Load molecule from molecular data formats (PDB, SDF, MOL2, etc.)
   */
  async loadMoleculeFromData(
    data: string,
    format: 'pdb' | 'sdf' | 'mol2' | 'xyz' = 'pdb'
  ): Promise<void> {
    // Load into 3D viewer
    if (this.mol3DWrapper) {
      await this.mol3DWrapper.addMolecule('main', data, format);
    }

    // Convert to 2D if needed for Canvas2D renderer
    if (this.canvas2DRenderer) {
      const molecule2D = this.convertTo2DMolecule(data, format);
      if (molecule2D) {
        this.canvas2DRenderer.loadMolecule(molecule2D);
      }
    }
  }

  /**
   * Search and load molecule from PubChem by compound name
   */
  async loadMoleculeFromPubChemName(compoundName: string): Promise<MolecularAnalysisResult | null> {
    try {
      const molecularData = await this.pubchemIntegration.searchAndGetMolecularData(
        compoundName, 
        { searchType: 'name', includeSynonyms: true, include3D: true }
      );

      if (!molecularData) {
        throw new Error(`Compound "${compoundName}" not found in PubChem database`);
      }

      this.currentPubChemCompound = molecularData.compound;

      // Load molecule using SMILES from PubChem
      if (molecularData.compound.smiles) {
        const result = await this.loadMoleculeFromSMILES(molecularData.compound.smiles);
        
        // Enhance result with PubChem data
        if (result) {
          result.validation.warnings = result.validation.warnings || [];
          result.validation.warnings.push(`Data sourced from PubChem CID ${molecularData.compound.cid}`);
          
          // Update properties with PubChem data
          result.properties = {
            ...result.properties,
            molecularWeight: molecularData.compound.molecularWeight,
            formula: molecularData.compound.molecularFormula
          };
        }

        // Load 3D structure if available
        if (molecularData.structure3D && this.mol3DWrapper) {
          await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure3D, 'sdf');
        } else if (molecularData.structure2D && this.mol3DWrapper) {
          await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure2D, 'sdf');
        }

        return result;
      }

      return null;
    } catch (error) {
      console.error('PubChem search failed:', error);
      return null;
    }
  }

  /**
   * Load molecule from PubChem by CID
   */
  async loadMoleculeFromPubChemCID(cid: number): Promise<MolecularAnalysisResult | null> {
    try {
      const molecularData = await this.pubchemIntegration.getMolecularData(cid, true);

      if (!molecularData) {
        throw new Error(`Compound with CID ${cid} not found in PubChem database`);
      }

      this.currentPubChemCompound = molecularData.compound;

      // Load molecule using SMILES from PubChem
      if (molecularData.compound.smiles) {
        const result = await this.loadMoleculeFromSMILES(molecularData.compound.smiles);
        
        // Enhance result with PubChem data
        if (result) {
          result.validation.warnings = result.validation.warnings || [];
          result.validation.warnings.push(`Data sourced from PubChem CID ${cid}`);
          
          // Update properties with PubChem data
          result.properties = {
            ...result.properties,
            molecularWeight: molecularData.compound.molecularWeight,
            formula: molecularData.compound.molecularFormula
          };
        }

        // Load 3D structure if available
        if (molecularData.structure3D && this.mol3DWrapper) {
          await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure3D, 'sdf');
        } else if (molecularData.structure2D && this.mol3DWrapper) {
          await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure2D, 'sdf');
        }

        return result;
      }

      return null;
    } catch (error) {
      console.error('PubChem CID search failed:', error);
      return null;
    }
  }

  /**
   * Search PubChem compounds without loading
   */
  async searchPubChemCompounds(
    query: string, 
    options: CompoundSearchOptions = { searchType: 'name', limit: 10 }
  ): Promise<PubChemSearchResult> {
    return await this.pubchemIntegration.searchCompounds(query, options);
  }

  /**
   * Load a compound from PubChem by CID
   */
  async loadPubChemCompound(cid: string): Promise<PubChemCompound> {
    const cidNumber = parseInt(cid, 10);
    if (isNaN(cidNumber)) {
      throw new Error(`Invalid CID: ${cid}`);
    }
    
    const compound = await this.pubchemIntegration.getCompoundByCid(cidNumber);
    if (!compound) {
      throw new Error(`Compound not found for CID: ${cid}`);
    }
    
    this.currentPubChemCompound = compound;
    return compound;
  }

  /**
   * Analyze a molecule using RDKit
   */
  async analyzeMolecule(smiles: string): Promise<MolecularAnalysisResult> {
    const molecule = await this.rdkitWrapper.parseSMILES(smiles);
    if (!molecule) {
      throw new Error('Failed to parse SMILES');
    }

    this.currentMolecule = molecule;
    
    return {
      molecule,
      properties: molecule.properties,
      validation: {
        isValid: true,
        errors: [],
        warnings: []
      },
      visualization: {
        svg2D: await this.rdkitWrapper.generateSVG(smiles),
        hasCoordinates: molecule.atoms.length > 0,
        canRender3D: molecule.atoms.length > 0
      }
    };
  }

  /**
   * Export molecule as SVG
   */
  async exportSVG(smiles: string, options: any = {}): Promise<string> {
    return await this.rdkitWrapper.generateSVG(smiles, options);
  }

  /**
   * Export molecular data
   */
  async exportMolecularData(smiles: string): Promise<VisualizationExports> {
    const analysis = await this.analyzeMolecule(smiles);
    
    return {
      svg2D: analysis.visualization.svg2D,
      // Other formats could be implemented later
      png2D: undefined,
      jpg2D: undefined,
      png3D: undefined,
      pdb: undefined,
      sdf: undefined
    };
  }

  /**
   * Get current PubChem compound information
   */
  getCurrentPubChemCompound(): PubChemCompound | null {
    return this.currentPubChemCompound;
  }

  /**
   * Validate PubChem connection
   */
  async validatePubChemConnection(): Promise<boolean> {
    return await this.pubchemIntegration.validateConnection();
  }

  /**
   * Update all visualization components with current molecule
   */
  private async updateVisualizations(molecule: RDKitMolecule): Promise<void> {
    // Update 2D Canvas renderer
    if (this.canvas2DRenderer && molecule.atoms.length > 0) {
      const molecule2D = this.convertRDKitToCanvas2D(molecule);
      this.canvas2DRenderer.loadMolecule(molecule2D);
    }

    // Update SVG renderer
    if (this.svgRenderer && molecule.atoms.length > 0) {
      const molecule2D = this.convertRDKitToCanvas2D(molecule);
      this.svgRenderer.loadMolecule(molecule2D);
    }

    // Update 3D viewer
    if (this.mol3DWrapper && molecule.atoms.length > 0) {
      const molecule3D = this.convertRDKitToMol3D(molecule);
      await this.mol3DWrapper.addMolecule('main', molecule3D);
    }
  }

  /**
   * Set 3D visualization style
   */
  set3DStyle(style: string | Mol3DStyle): void {
    if (!this.mol3DWrapper) {
      console.warn('3D viewer not initialized');
      return;
    }

    if (typeof style === 'string') {
      const presetStyles: Record<string, Mol3DStyle> = {
        'ball-and-stick': { stick: { radius: 0.2 }, sphere: { scale: 0.3 } },
        'space-filling': { sphere: { scale: 1.0 } },
        'wireframe': { line: { linewidth: 2 } },
        'cartoon': { cartoon: { style: 'trace' as const } }
      };

      const presetStyle = presetStyles[style];
      if (presetStyle) {
        this.mol3DWrapper.setStyle(presetStyle);
      }
    } else {
      this.mol3DWrapper.setStyle(style);
    }
  }

  /**
   * Add molecular surface to 3D visualization
   */
  add3DSurface(
    surfaceType: 'VDW' | 'SAS' | 'MS' | 'SES' = 'VDW',
    opacity: number = 0.7
  ): void {
    if (!this.mol3DWrapper) {
      console.warn('3D viewer not initialized');
      return;
    }

    this.mol3DWrapper.addSurface(surfaceType, { opacity });
  }

  /**
   * Perform substructure search and highlight matches
   */
  async searchSubstructure(querySmarts: string): Promise<void> {
    if (!this.currentMolecule) {
      throw new Error('No molecule loaded');
    }

    const matches = await this.rdkitWrapper.findSubstructure(
      this.currentMolecule.smiles,
      querySmarts
    );

    if (matches.length > 0) {
      // Highlight matches in 2D visualization
      this.highlightAtoms2D(matches[0].atomIds);
      
      // Highlight matches in 3D visualization
      if (this.mol3DWrapper) {
        this.highlightAtoms3D(matches[0].atomIds);
      }
    }
  }

  /**
   * Export visualizations in multiple formats
   */
  async exportAll(): Promise<VisualizationExports> {
    const exports: VisualizationExports = {};

    // Export 2D visualizations
    if (this.canvas2DRenderer) {
      if (this.config.export!.formats.includes('png')) {
        exports.png2D = this.canvas2DRenderer.exportImage('png');
      }
      if (this.config.export!.formats.includes('jpg')) {
        exports.jpg2D = this.canvas2DRenderer.exportImage('jpg');
      }
      if (this.config.export!.formats.includes('svg')) {
        exports.svg2D = this.canvas2DRenderer.exportImage('svg');
      }
    }

    // Export 3D visualizations
    if (this.mol3DWrapper) {
      if (this.config.export!.formats.includes('png')) {
        try {
          exports.png3D = await this.mol3DWrapper.exportScene({ format: 'png' }) as string;
        } catch (error) {
          console.warn('3D PNG export failed:', error);
        }
      }
      if (this.config.export!.formats.includes('pdb')) {
        try {
          exports.pdb = await this.mol3DWrapper.exportScene({ format: 'pdb' }) as string;
        } catch (error) {
          console.warn('PDB export failed:', error);
        }
      }
      if (this.config.export!.formats.includes('sdf')) {
        try {
          exports.sdf = await this.mol3DWrapper.exportScene({ format: 'sdf' }) as string;
        } catch (error) {
          console.warn('SDF export failed:', error);
        }
      }
    }

    return exports;
  }

  /**
   * Get molecular properties of current molecule
   */
  getMolecularProperties(): MolecularProperties | null {
    return this.currentMolecule?.properties || null;
  }

  /**
   * Apply chemical transformation to current molecule
   */
  async applyTransformation(reactionSmarts: string): Promise<string[]> {
    if (!this.currentMolecule) {
      throw new Error('No molecule loaded');
    }

    return await this.rdkitWrapper.applyTransformation(
      this.currentMolecule.smiles,
      reactionSmarts
    );
  }

  /**
   * Convert RDKit molecule to Canvas2D format
   */
  private convertRDKitToCanvas2D(rdkitMolecule: RDKitMolecule): Molecule2D {
    const atoms = rdkitMolecule.atoms.map((atom, index) => ({
      element: atom.symbol,
      position: { x: atom.x * 20, y: atom.y * 20 }, // Scale coordinates
      bonds: [] as number[],
      charge: atom.charge
    }));

    const bonds = rdkitMolecule.bonds.map(bond => ({
      atom1: bond.beginAtomIdx,
      atom2: bond.endAtomIdx,
      order: this.mapBondTypeToOrder(bond.bondType),
      type: bond.bondType.toLowerCase() as any
    }));

    // Update atom bonds references
    bonds.forEach((bond, bondIndex) => {
      if (atoms[bond.atom1]) {
        atoms[bond.atom1].bonds.push(bondIndex);
      }
      if (atoms[bond.atom2]) {
        atoms[bond.atom2].bonds.push(bondIndex);
      }
    });

    return {
      atoms,
      bonds,
      name: rdkitMolecule.properties.formula
    };
  }

  /**
   * Convert RDKit molecule to Mol3D format
   */
  private convertRDKitToMol3D(rdkitMolecule: RDKitMolecule): Mol3DMolecule {
    const atoms = rdkitMolecule.atoms.map(atom => ({
      elem: atom.symbol,
      x: atom.x,
      y: atom.y,
      z: atom.z || 0
    }));

    return {
      atoms,
      title: rdkitMolecule.properties.formula
    };
  }

  /**
   * Convert molecular data to Canvas2D format
   */
  private convertTo2DMolecule(data: string, format: string): Molecule2D | null {
    // Basic conversion - would need more sophisticated parsing
    // For now, return null and rely on RDKit conversion
    return null;
  }

  /**
   * Highlight atoms in 2D visualization
   */
  private highlightAtoms2D(atomIds: number[]): void {
    // Implementation would depend on Canvas2DRenderer having highlight functionality
    console.log('Highlighting 2D atoms:', atomIds);
  }

  /**
   * Highlight atoms in 3D visualization
   */
  private highlightAtoms3D(atomIds: number[]): void {
    if (!this.mol3DWrapper) return;

    // Create selection and apply highlighting style
    const selector = { atom: atomIds };
    this.mol3DWrapper.setStyle({ sphere: { colors: { 'default': 'red' }, scale: 1.2 } }, selector);
  }

  /**
   * Map bond type to numerical order
   */
  private mapBondTypeToOrder(bondType: string): number {
    switch (bondType.toUpperCase()) {
      case 'SINGLE': return 1;
      case 'DOUBLE': return 2;
      case 'TRIPLE': return 3;
      case 'AROMATIC': return 1.5;
      default: return 1;
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.rdkitWrapper) {
      this.rdkitWrapper.dispose();
    }
    if (this.mol3DWrapper) {
      this.mol3DWrapper.dispose();
    }
    this.currentMolecule = null;
  }
}

/**
 * Factory function to create enhanced molecular visualization
 */
export function createEnhancedVisualization(
  config: Partial<EnhancedVisualizationConfig> = {}
): EnhancedMolecularVisualization {
  return new EnhancedMolecularVisualization(config);
}

/**
 * Utility functions for enhanced visualization
 */
export class EnhancedVisualizationUtils {
  /**
   * Get available molecular file formats
   */
  static getSupportedFormats(): Record<string, string[]> {
    return {
      '2D': ['svg', 'png', 'jpg'],
      '3D': ['pdb', 'sdf', 'mol2', 'xyz', 'cml', 'png'],
      'input': ['smiles', 'pdb', 'sdf', 'mol2', 'xyz', 'inchi']
    };
  }

  /**
   * Get common chemical transformation patterns
   */
  static getTransformationPatterns(): Record<string, string> {
    return {
      'hydroxylation': '[C:1]>>[C:1]O',
      'methylation': '[N:1]>>[N:1]C',
      'oxidation': '[C:1][OH]>>[C:1]=O',
      'reduction': '[C:1]=[O:2]>>[C:1][OH:2]',
      'halogenation': '[C:1][H]>>[C:1]Cl'
    };
  }

  /**
   * Get substructure search patterns
   */
  static getSearchPatterns(): Record<string, string> {
    return {
      'benzene': 'c1ccccc1',
      'phenol': 'c1ccc(O)cc1',
      'alcohol': '[OH]',
      'ketone': 'C=O',
      'ester': 'C(=O)O',
      'amine': 'N',
      'carboxyl': 'C(=O)O',
      'amide': 'C(=O)N'
    };
  }

  /**
   * Validate visualization configuration
   */
  static validateConfig(config: Partial<EnhancedVisualizationConfig>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (config.canvas2D) {
      if (config.canvas2D.width <= 0 || config.canvas2D.height <= 0) {
        errors.push('Canvas2D dimensions must be positive');
      }
    }

    if (config.mol3D) {
      if (config.mol3D.width <= 0 || config.mol3D.height <= 0) {
        errors.push('Mol3D dimensions must be positive');
      }
    }

    if (config.export?.formats) {
      const validFormats = ['png', 'jpg', 'svg', 'pdb', 'sdf'];
      const invalidFormats = config.export.formats.filter(f => !validFormats.includes(f));
      if (invalidFormats.length > 0) {
        warnings.push(`Unsupported export formats: ${invalidFormats.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Re-export wrapper classes for direct use
export { RDKitWrapper, Mol3DWrapper, PubChemIntegration };
export type { RDKitMolecule, MolecularProperties, Mol3DMolecule, Mol3DStyle, PubChemCompound, PubChemSearchResult, CompoundSearchOptions };

export default EnhancedMolecularVisualization;
