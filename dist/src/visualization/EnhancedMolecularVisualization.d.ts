/**
 * Enhanced Molecular Visualization with RDKit.js, 3Dmol.js, and PubChem Integration
 * Unified API for advanced 2D/3D molecular structure visualization and processing
 *
 * This module integrates RDKit.js, 3Dmol.js, and PubChem wrappers with the existing CREB
 * visualization system to provide comprehensive molecular visualization capabilities.
 */
import { RDKitWrapper, type RDKitMolecule, type MolecularProperties } from './RDKitWrapper';
import { Mol3DWrapper, type Mol3DMolecule, type Mol3DStyle } from './Mol3DWrapper';
import { PubChemIntegration, type PubChemCompound, type CompoundSearchOptions, type PubChemSearchResult } from './PubChemIntegration';
export interface EnhancedVisualizationConfig {
    canvas2D?: {
        width: number;
        height: number;
        backgroundColor: string;
        interactive: boolean;
    };
    mol3D?: {
        width: number;
        height: number;
        backgroundColor: string;
        style: string;
        interactive: boolean;
    };
    rdkit?: {
        generateCoords: boolean;
        sanitize: boolean;
        removeHs: boolean;
    };
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
export declare class EnhancedMolecularVisualization {
    private canvas2DRenderer;
    private svgRenderer;
    private rdkitWrapper;
    private mol3DWrapper;
    private pubchemIntegration;
    private config;
    private currentMolecule;
    private currentPubChemCompound;
    constructor(config?: Partial<EnhancedVisualizationConfig>);
    /**
     * Initialize all visualization components
     */
    initialize(canvas2DElement?: HTMLCanvasElement, mol3DContainer?: HTMLElement | string): Promise<void>;
    /**
     * Load and analyze molecule from SMILES string
     */
    loadMoleculeFromSMILES(smiles: string): Promise<MolecularAnalysisResult>;
    /**
     * Load molecule from molecular data formats (PDB, SDF, MOL2, etc.)
     */
    loadMoleculeFromData(data: string, format?: 'pdb' | 'sdf' | 'mol2' | 'xyz'): Promise<void>;
    /**
     * Search and load molecule from PubChem by compound name
     */
    loadMoleculeFromPubChemName(compoundName: string): Promise<MolecularAnalysisResult | null>;
    /**
     * Load molecule from PubChem by CID
     */
    loadMoleculeFromPubChemCID(cid: number): Promise<MolecularAnalysisResult | null>;
    /**
     * Search PubChem compounds without loading
     */
    searchPubChemCompounds(query: string, options?: CompoundSearchOptions): Promise<PubChemSearchResult>;
    /**
     * Load a compound from PubChem by CID
     */
    loadPubChemCompound(cid: string): Promise<PubChemCompound>;
    /**
     * Analyze a molecule using RDKit
     */
    analyzeMolecule(smiles: string): Promise<MolecularAnalysisResult>;
    /**
     * Export molecule as SVG
     */
    exportSVG(smiles: string, options?: any): Promise<string>;
    /**
     * Export molecular data
     */
    exportMolecularData(smiles: string): Promise<VisualizationExports>;
    /**
     * Get current PubChem compound information
     */
    getCurrentPubChemCompound(): PubChemCompound | null;
    /**
     * Validate PubChem connection
     */
    validatePubChemConnection(): Promise<boolean>;
    /**
     * Update all visualization components with current molecule
     */
    private updateVisualizations;
    /**
     * Set 3D visualization style
     */
    set3DStyle(style: string | Mol3DStyle): void;
    /**
     * Add molecular surface to 3D visualization
     */
    add3DSurface(surfaceType?: 'VDW' | 'SAS' | 'MS' | 'SES', opacity?: number): void;
    /**
     * Perform substructure search and highlight matches
     */
    searchSubstructure(querySmarts: string): Promise<void>;
    /**
     * Export visualizations in multiple formats
     */
    exportAll(): Promise<VisualizationExports>;
    /**
     * Get molecular properties of current molecule
     */
    getMolecularProperties(): MolecularProperties | null;
    /**
     * Apply chemical transformation to current molecule
     */
    applyTransformation(reactionSmarts: string): Promise<string[]>;
    /**
     * Convert RDKit molecule to Canvas2D format
     */
    private convertRDKitToCanvas2D;
    /**
     * Convert RDKit molecule to Mol3D format
     */
    private convertRDKitToMol3D;
    /**
     * Convert molecular data to Canvas2D format
     */
    private convertTo2DMolecule;
    /**
     * Highlight atoms in 2D visualization
     */
    private highlightAtoms2D;
    /**
     * Highlight atoms in 3D visualization
     */
    private highlightAtoms3D;
    /**
     * Map bond type to numerical order
     */
    private mapBondTypeToOrder;
    /**
     * Cleanup resources
     */
    dispose(): void;
}
/**
 * Factory function to create enhanced molecular visualization
 */
export declare function createEnhancedVisualization(config?: Partial<EnhancedVisualizationConfig>): EnhancedMolecularVisualization;
/**
 * Utility functions for enhanced visualization
 */
export declare class EnhancedVisualizationUtils {
    /**
     * Get available molecular file formats
     */
    static getSupportedFormats(): Record<string, string[]>;
    /**
     * Get common chemical transformation patterns
     */
    static getTransformationPatterns(): Record<string, string>;
    /**
     * Get substructure search patterns
     */
    static getSearchPatterns(): Record<string, string>;
    /**
     * Validate visualization configuration
     */
    static validateConfig(config: Partial<EnhancedVisualizationConfig>): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
}
export { RDKitWrapper, Mol3DWrapper, PubChemIntegration };
export type { RDKitMolecule, MolecularProperties, Mol3DMolecule, Mol3DStyle, PubChemCompound, PubChemSearchResult, CompoundSearchOptions };
export default EnhancedMolecularVisualization;
//# sourceMappingURL=EnhancedMolecularVisualization.d.ts.map