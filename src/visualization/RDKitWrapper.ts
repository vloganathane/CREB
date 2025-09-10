/**
 * RDKit.js Wrapper for CREB Molecular Visualization
 * Provides unified API for advanced molecular structure processing and generation
 * 
 * Features:
 * - SMILES/SMARTS parsing and validation
 * - 2D coordinate generation with RDKit algorithms
 * - Molecular descriptors and properties calculation
 * - Substructure searching and matching
 * - Chemical transformation operations
 * - SVG generation with RDKit's advanced rendering
 */

export interface RDKitMolecule {
  smiles: string;
  molblock?: string;
  atoms: RDKitAtom[];
  bonds: RDKitBond[];
  properties: MolecularProperties;
}

export interface RDKitAtom {
  atomicNum: number;
  symbol: string;
  x: number;
  y: number;
  z?: number;
  charge: number;
  hybridization: string;
  aromantic: boolean;
  inRing: boolean;
}

export interface RDKitBond {
  beginAtomIdx: number;
  endAtomIdx: number;
  bondType: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'AROMATIC';
  isInRing: boolean;
  isConjugated: boolean;
}

export interface MolecularProperties {
  molecularWeight: number;
  logP: number;
  tpsa: number; // Topological Polar Surface Area
  hbd: number;  // Hydrogen Bond Donors
  hba: number;  // Hydrogen Bond Acceptors
  rotatableBonds: number;
  aromaticRings: number;
  aliphaticRings: number;
  formula: string;
  inchi: string;
  inchiKey: string;
}

export interface RDKitConfig {
  kekulize: boolean;
  addCoords: boolean;
  removeHs: boolean;
  sanitize: boolean;
  useCoordGen: boolean;
  width: number;
  height: number;
  offsetx: number;
  offsety: number;
}

export interface SubstructureMatch {
  atomIds: number[];
  bondIds: number[];
  matched: boolean;
}

export interface ChemicalTransformation {
  reactant: string;
  product: string;
  reactionSmarts: string;
}

/**
 * RDKit.js Wrapper Class
 * Provides simplified access to RDKit functionality within CREB
 */
export class RDKitWrapper {
  private rdkit: any = null;
  private initialized = false;
  private config: RDKitConfig;

  constructor(config: Partial<RDKitConfig> = {}) {
    this.config = {
      kekulize: true,
      addCoords: true,
      removeHs: true,
      sanitize: true,
      useCoordGen: true,
      width: 600,
      height: 400,
      offsetx: 0,
      offsety: 0,
      ...config
    };
  }

  /**
   * Initialize RDKit.js library using the official pattern
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Browser environment - use official initRDKitModule
      if (typeof window !== 'undefined') {
        // Check if initRDKitModule is available globally (official method)
        if (typeof (window as any).initRDKitModule === 'function') {
          console.log('Initializing RDKit using official initRDKitModule...');
          this.rdkit = await (window as any).initRDKitModule();
          this.initialized = true;
          console.log('RDKit initialized successfully, version:', this.rdkit.version());
          return;
        }

        // Fallback: check if RDKit is already available globally
        if ((window as any).RDKit) {
          console.log('Using pre-loaded RDKit instance...');
          this.rdkit = (window as any).RDKit;
          this.initialized = true;
          return;
        }

        // Try dynamic import as last resort
        try {
          // Use string-based import to avoid build-time type checking
          const rdkitModule = await import('@' + 'rdkit' + '/' + 'rdkit');
          this.rdkit = await (rdkitModule as any).initRDKitModule();
          this.initialized = true;
          return;
        } catch (importError) {
          console.warn('Dynamic import failed:', importError);
        }

        throw new Error('RDKit.js not available - please ensure RDKit.js is loaded via script tag');
      } else {
        // Node.js environment
        console.warn('RDKit.js not available in Node.js environment. Using fallback implementations.');
        this.rdkit = this.createFallbackRDKit();
        this.initialized = true;
      }
      
      this.initialized = true;
    } catch (error) {
      console.warn('RDKit.js initialization failed:', error);
      this.rdkit = this.createFallbackRDKit();
      this.initialized = true;
    }
  }

  /**
   * Parse SMILES string and generate molecule object
   */
  async parseSMILES(smiles: string): Promise<RDKitMolecule | null> {
    await this.initialize();

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackParseSMILES(smiles);
      }

      const mol = this.rdkit.get_mol(smiles);
      if (!mol || !mol.is_valid()) {
        throw new Error(`Invalid SMILES: ${smiles}`);
      }

      // Generate 2D coordinates
      if (this.config.addCoords) {
        mol.generate_2d_coords();
      }

      // Extract molecule data
      const molData = this.extractMoleculeData(mol);
      
      // Cleanup RDKit object
      mol.delete();

      return molData;
    } catch (error) {
      console.error('SMILES parsing failed:', error);
      return null;
    }
  }

  /**
   * Generate SVG representation of molecule
   */
  async generateSVG(smiles: string, options: Partial<RDKitConfig> = {}): Promise<string> {
    await this.initialize();

    const config = { ...this.config, ...options };

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackGenerateSVG(smiles, config);
      }

      const mol = this.rdkit.get_mol(smiles);
      if (!mol || !mol.is_valid()) {
        throw new Error(`Invalid SMILES: ${smiles}`);
      }

      // Generate SVG
      const svg = mol.get_svg_with_highlights(
        JSON.stringify({
          width: config.width,
          height: config.height,
          offsetx: config.offsetx,
          offsety: config.offsety
        })
      );

      mol.delete();
      return svg;
    } catch (error) {
      console.error('SVG generation failed:', error);
      return this.fallbackGenerateSVG(smiles, config);
    }
  }

  /**
   * Calculate molecular descriptors
   */
  async calculateDescriptors(smiles: string): Promise<MolecularProperties> {
    await this.initialize();

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackCalculateDescriptors(smiles);
      }

      const mol = this.rdkit.get_mol(smiles);
      if (!mol || !mol.is_valid()) {
        throw new Error(`Invalid SMILES: ${smiles}`);
      }

      const descriptors = JSON.parse(mol.get_descriptors());
      const properties: MolecularProperties = {
        molecularWeight: descriptors.amw || 0,
        logP: descriptors.clogp || 0,
        tpsa: descriptors.tpsa || 0,
        hbd: descriptors.lipinskiHBD || 0,
        hba: descriptors.lipinskiHBA || 0,
        rotatableBonds: descriptors.NumRotatableBonds || 0,
        aromaticRings: descriptors.NumAromaticRings || 0,
        aliphaticRings: descriptors.NumAliphaticRings || 0,
        formula: mol.get_molformula() || '',
        inchi: mol.get_inchi() || '',
        inchiKey: mol.get_inchi_key() || ''
      };

      mol.delete();
      return properties;
    } catch (error) {
      console.error('Descriptor calculation failed:', error);
      return this.fallbackCalculateDescriptors(smiles);
    }
  }

  /**
   * Perform substructure search
   */
  async findSubstructure(moleculeSmiles: string, querySmarts: string): Promise<SubstructureMatch[]> {
    await this.initialize();

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackFindSubstructure(moleculeSmiles, querySmarts);
      }

      const mol = this.rdkit.get_mol(moleculeSmiles);
      const query = this.rdkit.get_qmol(querySmarts);

      if (!mol || !mol.is_valid() || !query || !query.is_valid()) {
        throw new Error('Invalid molecule or query structure');
      }

      const matches = JSON.parse(mol.get_substruct_matches(query));
      
      mol.delete();
      query.delete();

      return matches.map((match: any) => ({
        atomIds: match.atoms || [],
        bondIds: match.bonds || [],
        matched: true
      }));
    } catch (error) {
      console.error('Substructure search failed:', error);
      return [];
    }
  }

  /**
   * Apply chemical transformation
   */
  async applyTransformation(smiles: string, reactionSmarts: string): Promise<string[]> {
    await this.initialize();

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackApplyTransformation(smiles, reactionSmarts);
      }

      const mol = this.rdkit.get_mol(smiles);
      const rxn = this.rdkit.get_rxn(reactionSmarts);

      if (!mol || !mol.is_valid() || !rxn || !rxn.is_valid()) {
        throw new Error('Invalid molecule or reaction');
      }

      const products = JSON.parse(rxn.run_reactants([mol]));
      
      mol.delete();
      rxn.delete();

      return products.map((product: any) => product.smiles || '');
    } catch (error) {
      console.error('Chemical transformation failed:', error);
      return [];
    }
  }

  /**
   * Validate SMILES string
   */
  async validateSMILES(smiles: string): Promise<boolean> {
    await this.initialize();

    try {
      if (!this.rdkit.get_mol) {
        return this.fallbackValidateSMILES(smiles);
      }

      const mol = this.rdkit.get_mol(smiles);
      const isValid = mol && mol.is_valid();
      
      if (mol) mol.delete();
      return isValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract detailed molecule data from RDKit molecule object
   */
  private extractMoleculeData(mol: any): RDKitMolecule {
    const molblock = mol.get_molblock();
    const smiles = mol.get_smiles();
    
    // Get atom and bond information
    const atoms: RDKitAtom[] = [];
    const bonds: RDKitBond[] = [];

    try {
      const molData = JSON.parse(mol.get_json());
      
      // Extract atoms
      if (molData.atoms) {
        molData.atoms.forEach((atom: any, index: number) => {
          atoms.push({
            atomicNum: atom.z || 0,
            symbol: atom.l || 'C',
            x: atom.x || 0,
            y: atom.y || 0,
            z: atom.z || 0,
            charge: atom.c || 0,
            hybridization: atom.h || 'sp3',
            aromantic: atom.a || false,
            inRing: atom.r || false
          });
        });
      }

      // Extract bonds
      if (molData.bonds) {
        molData.bonds.forEach((bond: any) => {
          bonds.push({
            beginAtomIdx: bond.b || 0,
            endAtomIdx: bond.e || 0,
            bondType: this.mapBondType(bond.o || 1),
            isInRing: bond.r || false,
            isConjugated: bond.c || false
          });
        });
      }
    } catch (error) {
      console.warn('Failed to extract detailed molecule data:', error);
    }

    return {
      smiles,
      molblock,
      atoms,
      bonds,
      properties: {
        molecularWeight: 0,
        logP: 0,
        tpsa: 0,
        hbd: 0,
        hba: 0,
        rotatableBonds: 0,
        aromaticRings: 0,
        aliphaticRings: 0,
        formula: mol.get_molformula() || '',
        inchi: mol.get_inchi() || '',
        inchiKey: mol.get_inchi_key() || ''
      }
    };
  }

  /**
   * Map RDKit bond order to bond type
   */
  private mapBondType(order: number): 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'AROMATIC' {
    switch (order) {
      case 1: return 'SINGLE';
      case 2: return 'DOUBLE';
      case 3: return 'TRIPLE';
      case 12: return 'AROMATIC';
      default: return 'SINGLE';
    }
  }

  /**
   * Create fallback RDKit implementation for environments where RDKit.js is not available
   */
  private createFallbackRDKit(): any {
    return {
      get_mol: null,
      get_qmol: null,
      get_rxn: null
    };
  }

  /**
   * Fallback implementations for when RDKit.js is not available
   */
  private fallbackParseSMILES(smiles: string): RDKitMolecule {
    // Simple SMILES parsing fallback
    const atomCount = smiles.length; // Simplified
    return {
      smiles,
      atoms: [],
      bonds: [],
      properties: {
        molecularWeight: atomCount * 12, // Rough estimate
        logP: 0,
        tpsa: 0,
        hbd: 0,
        hba: 0,
        rotatableBonds: 0,
        aromaticRings: 0,
        aliphaticRings: 0,
        formula: smiles,
        inchi: '',
        inchiKey: ''
      }
    };
  }

  private fallbackGenerateSVG(smiles: string, config: RDKitConfig): string {
    return `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="${config.width/2}" y="${config.height/2}" text-anchor="middle" font-family="Arial" font-size="16">
        ${smiles}
      </text>
      <text x="${config.width/2}" y="${config.height/2 + 25}" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        (RDKit.js not available - showing SMILES)
      </text>
    </svg>`;
  }

  private fallbackCalculateDescriptors(smiles: string): MolecularProperties {
    return {
      molecularWeight: smiles.length * 12, // Very rough estimate
      logP: 0,
      tpsa: 0,
      hbd: 0,
      hba: 0,
      rotatableBonds: 0,
      aromaticRings: 0,
      aliphaticRings: 0,
      formula: smiles,
      inchi: '',
      inchiKey: ''
    };
  }

  private fallbackFindSubstructure(moleculeSmiles: string, querySmarts: string): SubstructureMatch[] {
    // Simple substring search as fallback
    const matched = moleculeSmiles.includes(querySmarts);
    return matched ? [{ atomIds: [], bondIds: [], matched: true }] : [];
  }

  private fallbackApplyTransformation(smiles: string, reactionSmarts: string): string[] {
    // No transformation capability in fallback
    return [smiles];
  }

  private fallbackValidateSMILES(smiles: string): boolean {
    // Basic validation - check for common SMILES characters
    const smilesPattern = /^[A-Za-z0-9@+\-\[\]()=#:/\\%*.]+$/;
    return smilesPattern.test(smiles) && smiles.length > 0;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    // RDKit.js cleanup if needed
    this.initialized = false;
  }
}

/**
 * Static utility methods for RDKit operations
 */
export class RDKitUtils {
  /**
   * Convert CREB molecule format to RDKit-compatible format
   */
  static crebToRDKit(crebMolecule: any): RDKitMolecule {
    // Implementation for converting CREB format to RDKit format
    return {
      smiles: crebMolecule.formula || '',
      atoms: [],
      bonds: [],
      properties: {
        molecularWeight: 0,
        logP: 0,
        tpsa: 0,
        hbd: 0,
        hba: 0,
        rotatableBonds: 0,
        aromaticRings: 0,
        aliphaticRings: 0,
        formula: crebMolecule.formula || '',
        inchi: '',
        inchiKey: ''
      }
    };
  }

  /**
   * Convert RDKit molecule to CREB format
   */
  static rdkitToCreb(rdkitMolecule: RDKitMolecule): any {
    return {
      formula: rdkitMolecule.properties.formula,
      elements: rdkitMolecule.atoms.map(atom => atom.symbol),
      smiles: rdkitMolecule.smiles,
      molecularWeight: rdkitMolecule.properties.molecularWeight
    };
  }

  /**
   * Generate common chemical patterns for substructure searching
   */
  static getCommonPatterns(): Record<string, string> {
    return {
      benzene: 'c1ccccc1',
      alcohol: '[OH]',
      carbonyl: 'C=O',
      carboxyl: 'C(=O)O',
      amine: 'N',
      ester: 'C(=O)O',
      ether: 'COC',
      alkene: 'C=C',
      alkyne: 'C#C',
      phenol: 'c1ccc(O)cc1'
    };
  }
}

export default RDKitWrapper;
