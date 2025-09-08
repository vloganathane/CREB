/**
 * Enhanced Canvas2DRenderer with Real PubChem Integration
 * Replaces mock data with live molecular structures from PubChem database
 */
export interface Atom {
    element: string;
    x: number;
    y: number;
    charge?: number;
}
export interface Bond {
    from: number;
    to: number;
    order: number;
    type: 'single' | 'double' | 'triple' | 'aromatic';
}
export interface Molecule2D {
    name: string;
    formula: string;
    atoms: Atom[];
    bonds: Bond[];
    properties?: {
        pubchemCID?: number;
        source?: string;
        [key: string]: any;
    };
}
export interface PubChemAtom {
    aid: number;
    element: number;
    x: number;
    y: number;
    z?: number;
    charge?: number;
}
export interface PubChemBond {
    aid1: number;
    aid2: number;
    order: number;
}
export interface PubChemRecord {
    atoms: {
        aid: number[];
        element: number[];
        charge?: Array<{
            aid: number;
            value: number;
        }>;
    };
    bonds: {
        aid1: number[];
        aid2: number[];
        order: number[];
    };
    coords?: Array<{
        type: number[];
        aid: number[];
        conformers: Array<{
            x: number[];
            y: number[];
            z?: number[];
        }>;
    }>;
}
export declare class PubChemCanvas2DRenderer {
    private canvas;
    private ctx;
    private currentMolecule;
    private scale;
    private offset;
    private elementSymbols;
    private elementColors;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Load a compound from PubChem by CID
     */
    loadCompoundByCID(cid: number): Promise<void>;
    /**
     * Load a compound by name (searches PubChem first)
     */
    loadCompoundByName(name: string): Promise<void>;
    /**
     * Load a compound by SMILES string
     */
    loadCompoundBySMILES(smiles: string): Promise<void>;
    /**
     * Fetch full compound record from PubChem
     */
    private fetchPubChemRecord;
    /**
     * Convert PubChem record to our Molecule2D format
     */
    private convertPubChemToMolecule2D;
    /**
     * Calculate molecular formula from atoms
     */
    private calculateMolecularFormula;
    /**
     * Determine bond type from order
     */
    private getBondType;
    /**
     * Load molecule and render
     */
    loadMolecule(molecule: Molecule2D): void;
    /**
     * Center molecule in canvas
     */
    private centerMolecule;
    /**
     * Get molecule bounding box
     */
    private getMoleculeBounds;
    /**
     * Render the molecule
     */
    render(): void;
    /**
     * Render bonds
     */
    private renderBonds;
    /**
     * Draw a single bond
     */
    private drawBond;
    /**
     * Render atoms
     */
    private renderAtoms;
    /**
     * Get contrasting color for text
     */
    private getContrastColor;
    /**
     * Render molecule information
     */
    private renderMoleculeInfo;
    /**
     * Export as SVG
     */
    exportSVG(): string;
    /**
     * Setup mouse/touch interactivity
     */
    private setupInteractivity;
    /**
     * Reset view to original position and scale
     */
    resetView(): void;
}
export default PubChemCanvas2DRenderer;
//# sourceMappingURL=PubChemCanvas2DRenderer.d.ts.map