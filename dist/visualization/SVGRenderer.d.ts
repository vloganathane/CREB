/**
 * SVG Molecular Structure Renderer
 * Vector-based 2D molecular structure export
 */
import { Molecule2D } from './Canvas2DRenderer';
export interface SVGConfig {
    width: number;
    height: number;
    backgroundColor: string;
    atomColors: Record<string, string>;
    bondColor: string;
    bondWidth: number;
    fontSize: number;
    atomRadius: number;
    includeStyles: boolean;
    includeInteractivity: boolean;
}
export interface SVGExportOptions {
    format: 'svg' | 'svg-inline' | 'svg-download';
    filename?: string;
    includeMetadata?: boolean;
    optimizeSize?: boolean;
    interactive?: boolean;
    animations?: boolean;
}
/**
 * SVG-based molecular structure renderer
 */
export declare class SVGRenderer {
    private config;
    private molecule;
    private scale;
    private offset;
    constructor(config?: Partial<SVGConfig>);
    /**
     * Load a molecule for rendering
     */
    loadMolecule(molecule: Molecule2D): void;
    /**
     * Center the molecule in the SVG viewport
     */
    private centerMolecule;
    /**
     * Transform point from molecule coordinates to SVG coordinates
     */
    private transformPoint;
    /**
     * Generate SVG string for the current molecule
     */
    exportSVG(options?: Partial<SVGExportOptions>): string;
    /**
     * Generate SVG header with viewBox and namespaces
     */
    private generateSVGHeader;
    /**
     * Generate CSS styles for the SVG
     */
    private generateStyles;
    /**
     * Generate background rectangle
     */
    private generateBackground;
    /**
     * Generate SVG elements for bonds
     */
    private generateBonds;
    /**
     * Generate SVG for a single bond
     */
    private generateBondSVG;
    /**
     * Generate SVG elements for atoms
     */
    private generateAtoms;
    /**
     * Generate SVG for a single atom
     */
    private generateAtomSVG;
    /**
     * Generate metadata section
     */
    private generateMetadata;
    /**
     * Generate empty SVG for when no molecule is loaded
     */
    private generateEmptySVG;
    /**
     * Get contrasting color for text
     */
    private getContrastingColor;
    /**
     * Export as downloadable SVG file
     */
    exportAsFile(filename?: string, options?: Partial<SVGExportOptions>): void;
    /**
     * Get current molecule data
     */
    getMolecule(): Molecule2D | null;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<SVGConfig>): void;
}
export default SVGRenderer;
//# sourceMappingURL=SVGRenderer.d.ts.map