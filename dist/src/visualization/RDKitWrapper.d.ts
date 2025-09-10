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
    tpsa: number;
    hbd: number;
    hba: number;
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
export declare class RDKitWrapper {
    private rdkit;
    private initialized;
    private config;
    constructor(config?: Partial<RDKitConfig>);
    /**
     * Initialize RDKit.js library using the official pattern
     */
    initialize(): Promise<void>;
    /**
     * Parse SMILES string and generate molecule object
     */
    parseSMILES(smiles: string): Promise<RDKitMolecule | null>;
    /**
     * Generate SVG representation of molecule
     */
    generateSVG(smiles: string, options?: Partial<RDKitConfig>): Promise<string>;
    /**
     * Calculate molecular descriptors
     */
    calculateDescriptors(smiles: string): Promise<MolecularProperties>;
    /**
     * Perform substructure search
     */
    findSubstructure(moleculeSmiles: string, querySmarts: string): Promise<SubstructureMatch[]>;
    /**
     * Apply chemical transformation
     */
    applyTransformation(smiles: string, reactionSmarts: string): Promise<string[]>;
    /**
     * Validate SMILES string
     */
    validateSMILES(smiles: string): Promise<boolean>;
    /**
     * Extract detailed molecule data from RDKit molecule object
     */
    private extractMoleculeData;
    /**
     * Map RDKit bond order to bond type
     */
    private mapBondType;
    /**
     * Create fallback RDKit implementation for environments where RDKit.js is not available
     */
    private createFallbackRDKit;
    /**
     * Fallback implementations for when RDKit.js is not available
     */
    private fallbackParseSMILES;
    private fallbackGenerateSVG;
    private fallbackCalculateDescriptors;
    private fallbackFindSubstructure;
    private fallbackApplyTransformation;
    private fallbackValidateSMILES;
    /**
     * Cleanup resources
     */
    dispose(): void;
}
/**
 * Static utility methods for RDKit operations
 */
export declare class RDKitUtils {
    /**
     * Convert CREB molecule format to RDKit-compatible format
     */
    static crebToRDKit(crebMolecule: any): RDKitMolecule;
    /**
     * Convert RDKit molecule to CREB format
     */
    static rdkitToCreb(rdkitMolecule: RDKitMolecule): any;
    /**
     * Generate common chemical patterns for substructure searching
     */
    static getCommonPatterns(): Record<string, string>;
}
export default RDKitWrapper;
//# sourceMappingURL=RDKitWrapper.d.ts.map