/**
 * CREB-JS Molecular Visualization System
 * Production implementation of 2D/3D molecular structure rendering
 * Based on research: 3Dmol.js + RDKit-JS integration
 */
export interface MolecularVisualizationConfig {
    container: HTMLElement | string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    defaultStyle?: MolecularStyle;
    controls?: boolean;
    fullscreen?: boolean;
}
export interface MolecularStyle {
    representation: '3d' | '2d' | 'both';
    style3d: 'ball-and-stick' | 'space-filling' | 'wireframe' | 'cartoon';
    colorScheme: 'element' | 'rainbow' | 'hydrophobicity' | 'secondary-structure';
    showLabels: boolean;
    showBonds: boolean;
    bondWidth: number;
    atomScale: number;
}
export interface MoleculeData {
    format: 'smiles' | 'mol' | 'sdf' | 'pdb' | 'xyz';
    data: string;
    name?: string;
    properties?: Record<string, any>;
}
export interface MolecularInteraction {
    type: 'click' | 'hover' | 'select' | 'measure';
    callback: (event: MolecularEvent) => void;
}
export interface MolecularEvent {
    type: string;
    atom?: MolecularAtom;
    bond?: MolecularBond;
    position?: {
        x: number;
        y: number;
        z: number;
    };
    measurement?: MolecularMeasurement;
}
export interface MolecularAtom {
    id: number;
    element: string;
    symbol: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    charge?: number;
    hybridization?: string;
    bonds: number[];
}
export interface MolecularBond {
    id: number;
    atom1: number;
    atom2: number;
    order: number;
    type: 'single' | 'double' | 'triple' | 'aromatic';
    length: number;
}
export interface MolecularMeasurement {
    type: 'distance' | 'angle' | 'dihedral';
    atoms: number[];
    value: number;
    unit: string;
}
/**
 * Main molecular visualization class
 */
export declare class MolecularVisualization {
    private container;
    private config;
    private viewer3d;
    private viewer2d;
    private currentMolecule;
    private interactions;
    private measurements;
    constructor(config: MolecularVisualizationConfig);
    /**
     * Initialize the molecular viewer
     */
    private initializeViewer;
    /**
     * Initialize 3Dmol.js viewer
     */
    private initialize3DViewer;
    /**
     * Create fallback viewer when 3Dmol.js is not available
     */
    private createFallbackViewer;
    /**
     * Add control panel to the viewer
     */
    private addControls;
    /**
     * Bind events to control panel
     */
    private bindControlEvents;
    /**
     * Load a molecule from various formats
     */
    loadMolecule(molecule: MoleculeData): Promise<void>;
    /**
     * Load molecule from SMILES string
     */
    private loadFromSMILES;
    /**
     * Convert SMILES to 3D coordinates
     */
    private smilesToMol3D;
    /**
     * Load molecule from MOL format
     */
    private loadFromMOL;
    /**
     * Load molecule from PDB format
     */
    private loadFromPDB;
    /**
     * Load molecule from SDF format
     */
    private loadFromSDF;
    /**
     * Load molecule from XYZ format
     */
    private loadFromXYZ;
    /**
     * Show fallback molecule display
     */
    private showFallbackMolecule;
    /**
     * Update visualization style
     */
    updateStyle(style: Partial<MolecularStyle>): void;
    /**
     * Render the current molecule
     */
    render(): void;
    /**
     * Get 3Dmol.js style object
     */
    private getStyleObject;
    /**
     * Reset camera view
     */
    resetView(): void;
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen(): void;
    /**
     * Add interaction handler
     */
    addInteraction(interaction: MolecularInteraction): void;
    /**
     * Bind interaction to viewer
     */
    private bindInteraction;
    /**
     * Measure distance between atoms
     */
    measureDistance(atom1: number, atom2: number): MolecularMeasurement;
    /**
     * Export current view as image
     */
    exportImage(format?: 'png' | 'jpg'): string;
    /**
     * Get molecular information
     */
    getMolecularInfo(): any;
    /**
     * Destroy the viewer and clean up
     */
    destroy(): void;
}
/**
 * Utility function to create a molecular visualization
 */
export declare function createMolecularVisualization(config: MolecularVisualizationConfig): MolecularVisualization;
/**
 * Integration with CREB chemistry calculations
 */
export declare class CREBMolecularIntegration {
    private visualization;
    private container;
    constructor(visualization: MolecularVisualization, container?: HTMLElement);
    /**
     * Visualize molecules from CREB equation
     */
    visualizeFromEquation(equation: string): Promise<void>;
    /**
     * Parse molecules from chemical equation
     */
    private parseMoleculesFromEquation;
    /**
     * Show reaction animation
     */
    animateReaction(equation: string, canvas?: HTMLCanvasElement): Promise<void>;
    /**
     * Create a canvas for animation if none provided
     */
    private createAnimationCanvas;
    /**
     * Create advanced reaction animation with custom parameters
     */
    createAdvancedReactionAnimation(equation: string, options?: {
        canvas?: HTMLCanvasElement;
        duration?: number;
        showEnergyProfile?: boolean;
        bondChanges?: Array<{
            type: 'breaking' | 'forming';
            atoms: [string, string];
            energyContribution: number;
        }>;
        transitionStates?: Array<{
            coordinate: number;
            energy: number;
            description: string;
        }>;
    }): Promise<void>;
    /**
     * Generate a mock molecular frame for animation
     */
    private generateMockMolecularFrame;
}
export default MolecularVisualization;
//# sourceMappingURL=MolecularVisualization.d.ts.map