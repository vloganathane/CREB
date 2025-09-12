/**
 * Browser-compatible CREB-JS entry point
 * This file excludes Node.js-specific functionality to ensure browser compatibility
 */
export { ReactionAnimator } from './visualization/ReactionAnimation';
export { ReactionAnimationEngine } from './animation/ReactionAnimationEngine';
export { ReactionClassifier } from './ai/SimplifiedReactionClassifier';
export { SimplifiedPhysicsEngine as MolecularPhysicsEngine } from './physics/SimplifiedPhysicsEngine';
export { SimplifiedCacheManager as IntelligentCacheManager } from './caching/SimplifiedCacheManager';
export { CREBMasterEnhancementSystem, createEnhancedCREB, EnhancedAnimationController, EnhancedMolecularRenderer, EnhancedUI, BrowserCompatibilityManager, EnhancedFeaturesSystem } from './enhancements';
export { Mol3DWrapper } from './visualization/Mol3DWrapper';
export { PubChemIntegration } from './visualization/PubChemIntegration';
export { RDKitWrapper } from './visualization/RDKitWrapper';
export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';
export { type ChemicalFormula, type ElementSymbol, type BalancedEquationString, type SMILESNotation, type InChINotation, type CASNumber, type ValidElement, type TypedElementCount, type TypedCompound, type TypedReaction, type ReactionType, type PhaseState, isChemicalFormula, isElementSymbol, isBalancedEquation, parseFormula, createChemicalFormula, createElementSymbol, ChemicalFormulaError, EquationBalancingError } from './advancedTypes';
export { EnhancedBalancer } from './enhancedBalancerSimple';
export { EnhancedChemicalEquationBalancer, type EnhancedBalancedEquation, type CompoundInfo } from './enhancedBalancer';
export { Canvas2DRenderer } from './visualization/Canvas2DRenderer';
export { SVGRenderer } from './visualization/SVGRenderer';
export { MolecularVisualization, type MolecularVisualizationConfig, type MolecularStyleOptions, type MoleculeVisualizationData } from './visualization/SimplifiedMolecularVisualization';
import { MolecularVisualization as MolViz } from './visualization/SimplifiedMolecularVisualization';
export type MoleculeForVisualization = {
    elements: string[];
    formula?: string;
};
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
export declare function createMolecularVisualization(container: any, options?: any): MolViz;
export declare class EventEmitter {
    private events;
    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
    removeListener(event: string, listener: Function): this;
    removeAllListeners(event?: string): this;
}
//# sourceMappingURL=index.browser.d.ts.map