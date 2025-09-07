/**
 * Simplified Molecular Visualization System
 * Node.js and browser compatible implementation
 */
export interface MolecularVisualizationConfig {
    container: any;
    width?: number;
    height?: number;
    mode?: '2d' | '3d' | 'both';
    backgroundColor?: string;
    interactive?: boolean;
}
export interface MolecularStyleOptions {
    style?: 'stick' | 'sphere' | 'wireframe';
    colorScheme?: 'element' | 'rainbow' | 'jmol';
    showLabels?: boolean;
    atomScale?: number;
    bondWidth?: number;
}
export interface MoleculeVisualizationData {
    pdb?: string;
    sdf?: string;
    smiles?: string;
    atoms?: Array<{
        element: string;
        x: number;
        y: number;
        z: number;
    }>;
    bonds?: Array<{
        atom1: number;
        atom2: number;
        order: number;
    }>;
}
/**
 * Main Molecular Visualization Engine
 */
export declare class MolecularVisualization {
    private container;
    private config;
    private canvas2d?;
    private viewer3d?;
    private currentMolecule?;
    private styleOptions;
    constructor(config: MolecularVisualizationConfig);
    /**
     * Initialize the visualization container
     */
    private initializeContainer;
    /**
     * Create a fallback container for non-browser environments
     */
    private createFallbackContainer;
    /**
     * Setup the visualization components
     */
    private setupVisualization;
    /**
     * Setup 2D canvas visualization
     */
    private setup2DVisualization;
    /**
     * Setup 3D visualization
     */
    private setup3DVisualization;
    /**
     * Initialize 3Dmol.js viewer
     */
    private initialize3DViewer;
    /**
     * Initialize fallback 3D visualization
     */
    private initializeFallback3D;
    /**
     * Load and display a molecule
     */
    loadMolecule(data: MoleculeVisualizationData): void;
    /**
     * Render molecule in 2D
     */
    private render2D;
    /**
     * Render molecule in 3D
     */
    private render3D;
    /**
     * Update visualization style
     */
    updateStyle(options: Partial<MolecularStyleOptions>): void;
    /**
     * Export current visualization as image
     */
    exportImage(format?: 'png' | 'jpg'): string;
    /**
     * Reset visualization to default view
     */
    resetView(): void;
    /**
     * Resize the visualization
     */
    resize(width: number, height: number): void;
    /**
     * Get current molecule data
     */
    getMolecule(): MoleculeVisualizationData | undefined;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Utility functions for molecular data conversion
 */
export declare class MolecularDataUtils {
    /**
     * Convert PDB string to basic atom/bond data
     */
    static parsePDB(pdbString: string): MoleculeVisualizationData;
    /**
     * Generate sample molecules for testing
     */
    static generateSampleMolecule(type?: 'water' | 'methane' | 'benzene'): MoleculeVisualizationData;
}
export default MolecularVisualization;
//# sourceMappingURL=SimplifiedMolecularVisualization.d.ts.map