/**
 * 3Dmol.js Wrapper for CREB Molecular Visualization
 * Provides unified API for advanced 3D molecular structure visualization
 *
 * Features:
 * - Interactive 3D molecular visualization with WebGL
 * - Multiple rendering styles (ball-and-stick, space-filling, cartoon, etc.)
 * - Animation and transition effects
 * - Chemical property visualization (electrostatic, hydrophobic surfaces)
 * - Multi-molecule scene management
 * - Export capabilities (PNG, WebM, molecular formats)
 * - Event handling for molecular interactions
 */
export interface Mol3DConfig {
    backgroundColor: string;
    width: number;
    height: number;
    antialias: boolean;
    alpha: boolean;
    preserveDrawingBuffer: boolean;
    premultipliedAlpha: boolean;
    camera: CameraConfig;
    lighting: LightingConfig;
    fog: FogConfig;
}
export interface CameraConfig {
    fov: number;
    near: number;
    far: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    target: {
        x: number;
        y: number;
        z: number;
    };
    up: {
        x: number;
        y: number;
        z: number;
    };
}
export interface LightingConfig {
    ambient: string;
    directional: Array<{
        color: string;
        intensity: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
    }>;
}
export interface FogConfig {
    enabled: boolean;
    color: string;
    near: number;
    far: number;
}
export interface Mol3DStyle {
    stick?: StickStyle;
    sphere?: SphereStyle;
    cartoon?: CartoonStyle;
    surface?: SurfaceStyle;
    line?: LineStyle;
    cross?: CrossStyle;
}
export interface StickStyle {
    radius?: number;
    colorscheme?: string;
    colors?: Record<string, string>;
    hidden?: boolean;
    opacity?: number;
}
export interface SphereStyle {
    radius?: number;
    scale?: number;
    colorscheme?: string;
    colors?: Record<string, string>;
    hidden?: boolean;
    opacity?: number;
}
export interface CartoonStyle {
    color?: string;
    style?: 'trace' | 'oval' | 'tube' | 'ribbon' | 'arrow';
    ribbon?: boolean;
    arrows?: boolean;
    tubes?: boolean;
    opacity?: number;
    thickness?: number;
}
export interface SurfaceStyle {
    opacity?: number;
    colorscheme?: string;
    map?: any;
    material?: 'basic' | 'lambert' | 'phong';
    wireframe?: boolean;
    linewidth?: number;
    smooth?: number;
}
export interface LineStyle {
    linewidth?: number;
    colorscheme?: string;
    colors?: Record<string, string>;
    hidden?: boolean;
}
export interface CrossStyle {
    radius?: number;
    scale?: number;
    colorscheme?: string;
    colors?: Record<string, string>;
    hidden?: boolean;
}
export interface Mol3DAtom {
    elem: string;
    x: number;
    y: number;
    z: number;
    serial?: number;
    atom?: string;
    resn?: string;
    chain?: string;
    resi?: number;
    b?: number;
    pdbline?: string;
    bonds?: number[];
    bondOrder?: number[];
    properties?: Record<string, any>;
}
export interface Mol3DMolecule {
    atoms: Mol3DAtom[];
    title?: string;
    format?: 'pdb' | 'sdf' | 'mol2' | 'xyz' | 'cml';
    data?: string;
}
export interface AnimationOptions {
    duration: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    loop?: boolean;
    autoplay?: boolean;
    direction?: 'forward' | 'reverse' | 'alternate';
}
export interface ExportOptions {
    format: 'png' | 'webm' | 'pdb' | 'sdf' | 'mol2';
    width?: number;
    height?: number;
    quality?: number;
    fps?: number;
    duration?: number;
}
export interface InteractionEvent {
    type: 'click' | 'hover' | 'select' | 'drag';
    atom?: Mol3DAtom;
    atoms?: Mol3DAtom[];
    position: {
        x: number;
        y: number;
        z: number;
    };
    screenPosition: {
        x: number;
        y: number;
    };
}
/**
 * 3Dmol.js Wrapper Class
 * Provides simplified access to 3Dmol.js functionality within CREB
 */
export declare class Mol3DWrapper {
    private viewer;
    private container;
    private initialized;
    private config;
    private molecules;
    private eventHandlers;
    constructor(container: HTMLElement | string, config?: Partial<Mol3DConfig>);
    /**
     * Initialize 3Dmol.js viewer
     */
    initialize(): Promise<void>;
    /**
     * Get the 3Dmol viewer instance
     */
    getViewer(): any;
    /**
     * Add molecule to the scene
     */
    addMolecule(id: string, moleculeData: string | Mol3DMolecule, format?: 'pdb' | 'sdf' | 'mol2' | 'xyz' | 'cml'): Promise<void>;
    /**
     * Remove molecule from the scene
     */
    removeMolecule(id: string): void;
    /**
     * Set visualization style for molecules
     */
    setStyle(style: Mol3DStyle, selector?: any): void;
    /**
     * Add surface to molecule
     */
    addSurface(surfaceType?: 'VDW' | 'SAS' | 'MS' | 'SES', style?: SurfaceStyle, selector?: any): void;
    /**
     * Animate camera movement
     */
    animateCamera(targetPosition: {
        x: number;
        y: number;
        z: number;
    }, options?: AnimationOptions): Promise<void>;
    /**
     * Animate molecular properties
     */
    animateMolecule(properties: Record<string, any>, options?: AnimationOptions): Promise<void>;
    /**
     * Export scene as image or animation
     */
    exportScene(options: ExportOptions): Promise<string | Blob>;
    /**
     * Add event listener for molecular interactions
     */
    addEventListener(event: string, handler: (event: InteractionEvent) => void): void;
    /**
     * Remove event listener
     */
    removeEventListener(event: string, handler: (event: InteractionEvent) => void): void;
    /**
     * Center and fit all molecules in view
     */
    zoomToFit(): void;
    /**
     * Set camera position
     */
    setCameraPosition(position: {
        x: number;
        y: number;
        z: number;
    }): void;
    /**
     * Get current camera position
     */
    getCameraPosition(): {
        x: number;
        y: number;
        z: number;
    };
    /**
     * Clear all molecules from scene
     */
    clear(): void;
    /**
     * Render the scene
     */
    render(): void;
    /**
     * Resize viewer
     */
    resize(width?: number, height?: number): void;
    /**
     * Parse molecule data string into structured format
     */
    private parseMoleculeData;
    /**
     * Parse PDB format
     */
    private parsePDB;
    /**
     * Parse SDF format
     */
    private parseSDF;
    /**
     * Parse XYZ format
     */
    private parseXYZ;
    /**
     * Setup event handlers for viewer interactions
     */
    private setupEventHandlers;
    /**
     * Export as PNG image
     */
    private exportPNG;
    /**
     * Export as WebM animation
     */
    private exportWebM;
    /**
     * Export molecule data in specified format
     */
    private exportMoleculeData;
    /**
     * Convert molecule to different format
     */
    private convertMoleculeFormat;
    /**
     * Convert molecule to XYZ format
     */
    private moleculeToXYZ;
    /**
     * Convert molecule to PDB format
     */
    private moleculeToPDB;
    /**
     * Create fallback viewer for environments where 3Dmol.js is not available
     */
    private createFallbackViewer;
    /**
     * Cleanup resources
     */
    dispose(): void;
}
/**
 * Static utility methods for 3Dmol operations
 */
export declare class Mol3DUtils {
    /**
     * Convert CREB molecule format to 3Dmol-compatible format
     */
    static crebToMol3D(crebMolecule: any): Mol3DMolecule;
    /**
     * Get predefined molecular styles
     */
    static getPresetStyles(): Record<string, Mol3DStyle>;
    /**
     * Generate molecular surfaces
     */
    static getSurfaceTypes(): Record<string, string>;
    /**
     * Get common color schemes
     */
    static getColorSchemes(): Record<string, string>;
}
export default Mol3DWrapper;
//# sourceMappingURL=Mol3DWrapper.d.ts.map