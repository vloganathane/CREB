/**
 * 2D Molecular Structure Renderer
 * Canvas-based 2D molecular structure drawing
 */
export interface Canvas2DConfig {
    width: number;
    height: number;
    backgroundColor: string;
    bondColor: string;
    atomColors: Record<string, string>;
    bondWidth: number;
    atomRadius: number;
    fontSize: number;
}
export interface Point2D {
    x: number;
    y: number;
}
export interface Atom2D {
    element: string;
    position: Point2D;
    bonds: number[];
    charge?: number;
}
export interface Bond2D {
    atom1: number;
    atom2: number;
    order: number;
    type: 'single' | 'double' | 'triple' | 'aromatic';
}
export interface Molecule2D {
    atoms: Atom2D[];
    bonds: Bond2D[];
    name?: string;
}
export declare class Canvas2DRenderer {
    private canvas;
    private ctx;
    private config;
    private molecule;
    private scale;
    private offset;
    constructor(canvas: any, config?: Partial<Canvas2DConfig>);
    private setupCanvas;
    private bindEvents;
    /**
     * Load and render a molecule
     */
    loadMolecule(molecule: Molecule2D): void;
    /**
     * Center the molecule in the canvas
     */
    private centerMolecule;
    /**
     * Render the current molecule
     */
    render(): void;
    /**
     * Clear the canvas
     */
    private clear;
    /**
     * Render placeholder when no molecule is loaded
     */
    private renderPlaceholder;
    /**
     * Render molecular bonds
     */
    private renderBonds;
    /**
     * Draw a single bond
     */
    private drawBond;
    /**
     * Draw a single bond line
     */
    private drawSingleBond;
    /**
     * Draw aromatic bond (dashed)
     */
    private drawAromaticBond;
    /**
     * Render atoms
     */
    private renderAtoms;
    /**
     * Draw a single atom
     */
    private drawAtom;
    /**
     * Render atom labels and charges
     */
    private renderLabels;
    /**
     * Transform point from molecule coordinates to canvas coordinates
     */
    private transformPoint;
    /**
     * Convert SMILES to 2D coordinates (simplified)
     */
    static smilesToMolecule2D(smiles: string): Molecule2D;
    /**
     * Export canvas as image
     */
    exportImage(format?: 'png' | 'jpg'): string;
    /**
     * Reset view to default
     */
    resetView(): void;
    /**
     * Set molecule scale
     */
    setScale(scale: number): void;
    /**
     * Get current molecule data
     */
    getMolecule(): Molecule2D | null;
}
export default Canvas2DRenderer;
//# sourceMappingURL=Canvas2DRenderer.d.ts.map