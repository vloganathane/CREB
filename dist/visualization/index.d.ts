/**
 * Integration with CREB Core Types and Systems
 * Enhanced with SVG Export Capabilities
 */
import type { ElementCount } from '../types';
import { Canvas2DRenderer } from './Canvas2DRenderer';
import { SVGRenderer } from './SVGRenderer';
import { MolecularVisualization, MolecularDataUtils } from './SimplifiedMolecularVisualization';
/**
 * Simple molecule interface for visualization
 */
export interface MoleculeForVisualization {
    elements: string[];
    formula?: string;
}
/**
 * Convert CREB-style molecule to visualization format
 */
export declare function convertMoleculeToVisualization(molecule: MoleculeForVisualization): {
    atoms: {
        element: string;
        x: number;
        y: number;
        z: number;
    }[];
    bonds: {
        atom1: number;
        atom2: number;
        order: number;
    }[];
    smiles: string;
};
/**
 * Create molecular visualization from molecule data
 */
export declare function createMolecularVisualization(container: any, molecule: MoleculeForVisualization, options?: any): MolecularVisualization;
/**
 * Enhanced visualization utilities for CREB
 */
export declare class CREBVisualizationUtils {
    /**
     * Create 2D structure from molecule data with SVG export support
     */
    static create2DStructure(molecule: MoleculeForVisualization, canvas?: any): Canvas2DRenderer;
    /**
     * Create SVG renderer for molecule
     */
    static createSVGStructure(molecule: MoleculeForVisualization, options?: {
        width?: number;
        height?: number;
        interactive?: boolean;
        backgroundColor?: string;
    }): SVGRenderer;
    /**
     * Export molecule in multiple formats
     */
    static exportMolecule(molecule: MoleculeForVisualization, formats?: ('png' | 'jpg' | 'svg')[], canvas?: any): Record<string, string>;
    /**
     * Generate sample molecules for different chemical reactions
     */
    static generateReactionMolecules(): {
        reactants: import("./SimplifiedMolecularVisualization").MoleculeVisualizationData[];
        products: import("./SimplifiedMolecularVisualization").MoleculeVisualizationData[];
    };
    /**
     * Visualize chemical reaction
     */
    static visualizeReaction(container: any, reactants: MoleculeForVisualization[], products: MoleculeForVisualization[]): MolecularVisualization;
    /**
     * Create molecule from element count data
     */
    static createMoleculeFromElementCount(elementCount: ElementCount): MoleculeForVisualization;
}
export { Canvas2DRenderer, SVGRenderer, MolecularVisualization, MolecularDataUtils };
/**
 * Quick SVG Export Function
 * Convenience function for quick SVG generation
 */
export declare function quickSVGExport(molecule: MoleculeForVisualization, options?: {
    width?: number;
    height?: number;
    interactive?: boolean;
    includeMetadata?: boolean;
}): string;
/**
 * Multi-format Export Function
 * Export molecule in multiple formats simultaneously
 */
export declare function multiFormatExport(molecule: MoleculeForVisualization, canvas?: any, options?: {
    formats?: ('png' | 'jpg' | 'svg')[];
    svgOptions?: {
        interactive?: boolean;
        includeMetadata?: boolean;
        animations?: boolean;
    };
}): Record<string, string>;
/**
 * SVG Export Features and Version
 */
export declare const SVG_FEATURES: {
    readonly INTERACTIVE: true;
    readonly ANIMATIONS: true;
    readonly METADATA: true;
    readonly SCALABLE: true;
    readonly PUBLICATION_READY: true;
};
export declare const VISUALIZATION_VERSION = "1.6.0-svg";
//# sourceMappingURL=index.d.ts.map