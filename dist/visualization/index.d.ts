/**
 * Integration with CREB Core Types and Systems
 */
import type { ElementCount } from '../types';
import { Canvas2DRenderer } from './Canvas2DRenderer';
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
     * Create 2D structure from molecule data
     */
    static create2DStructure(molecule: MoleculeForVisualization, canvas?: any): Canvas2DRenderer;
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
export { Canvas2DRenderer, MolecularVisualization, MolecularDataUtils };
//# sourceMappingURL=index.d.ts.map