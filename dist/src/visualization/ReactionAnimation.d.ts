/**
 * Reaction Animation System
 * Implements animated bond formation/breaking visualization for chemical reactions
 * Part of CREB-JS v1.7.0 - Complete Reaction Animation Feature
 *
 * Integrates with:
 * - RDKit.js for molecular structure processing and SMILES parsing
 * - 3Dmol.js for advanced 3D visualization and animation
 * - PubChem API for compound data retrieval
 */
import { EnergyProfile, BondChange, TransitionState } from '../thermodynamics/types';
import { BalancedEquation } from '../types';
export interface AnimationFrame {
    /** Frame number in animation sequence */
    frameNumber: number;
    /** Time in animation (0-1, where 0 = start, 1 = end) */
    time: number;
    /** Molecular structure at this frame */
    structure: MolecularFrame;
    /** Energy at this frame */
    energy: number;
    /** Bond states at this frame */
    bonds: AnimatedBond[];
    /** Atoms positions at this frame */
    atoms: AnimatedAtom[];
}
export interface MolecularFrame {
    /** Atoms in the molecular system */
    atoms: Array<{
        element: string;
        position: {
            x: number;
            y: number;
            z: number;
        };
        charge?: number;
        radius?: number;
    }>;
    /** Bonds between atoms */
    bonds: Array<{
        atom1: number;
        atom2: number;
        order: number;
        length: number;
        isForming?: boolean;
        isBreaking?: boolean;
    }>;
    /** Overall molecular properties */
    properties: {
        totalEnergy: number;
        dipoleMoment?: number;
        charge: number;
    };
}
export interface AnimatedBond {
    /** Indices of connected atoms */
    atom1: number;
    atom2: number;
    /** Current bond order (can be fractional during animation) */
    order: number;
    /** Target bond order */
    targetOrder: number;
    /** Animation state */
    state: 'forming' | 'breaking' | 'stable' | 'transitioning';
    /** Visual properties */
    color: string;
    opacity: number;
    dashPattern?: number[];
}
export interface AnimatedAtom {
    /** Atomic element */
    element: string;
    /** Current position */
    position: {
        x: number;
        y: number;
        z: number;
    };
    /** Target position */
    targetPosition: {
        x: number;
        y: number;
        z: number;
    };
    /** Animation state */
    state: 'moving' | 'stationary' | 'vibrating';
    /** Visual properties */
    color: string;
    radius: number;
    opacity: number;
}
export interface ReactionAnimationConfig {
    /** Total animation duration in milliseconds */
    duration: number;
    /** Frames per second */
    fps: number;
    /** Animation easing function */
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    /** Show energy profile alongside animation */
    showEnergyProfile: boolean;
    /** Show bond order changes */
    showBondOrders: boolean;
    /** Show atomic charges */
    showCharges: boolean;
    /** Animation style */
    style: 'smooth' | 'stepped' | 'spring';
    /** Color scheme for bonds */
    bondColorScheme: 'default' | 'energy-based' | 'order-based';
}
export interface ReactionStep {
    /** Step number in reaction sequence */
    stepNumber: number;
    /** Description of what happens in this step */
    description: string;
    /** Energy change in this step */
    energyChange: number;
    /** Bond changes occurring */
    bondChanges: BondChange[];
    /** Duration of this step (fraction of total animation) */
    duration: number;
    /** Intermediate structures */
    intermediates?: MolecularFrame[];
}
/**
 * Main class for creating and managing reaction animations
 * Integrates RDKit.js for molecular processing and 3Dmol.js for 3D visualization
 */
export declare class ReactionAnimator {
    private config;
    private currentAnimation;
    private isPlaying;
    private currentFrame;
    private animationId;
    private canvas;
    private context;
    private energyProfile;
    private rdkitWrapper;
    private mol3dWrapper;
    private viewer3D;
    private moleculeCache;
    constructor(config?: Partial<ReactionAnimationConfig>);
    /**
     * Initialize 3D visualization system
     */
    initialize3DViewer(container: HTMLElement): Promise<void>;
    /**
     * Parse molecule from SMILES using RDKit
     */
    parseSMILES(smiles: string): Promise<any>;
    /**
     * Generate 3D coordinates for a molecule using PubChem SDF data
     */
    generate3DCoordinates(molecule: any): Promise<any>;
    /**
     * Add molecule to 3D scene for animation
     */
    addMoleculeToScene(smiles: string, moleculeId: string): Promise<void>;
    /**
     * Create a simple MOL block from SMILES (fallback method)
     */
    private createMolBlockFromSMILES;
    /**
     * Animate molecular transformation using real 3D structures
     */
    animateMolecularTransformation(reactantSMILES: string[], productSMILES: string[], duration?: number): Promise<void>;
    /**
     * Calculate and display molecular properties during animation
     */
    showMolecularProperties(smiles: string): Promise<any>;
    /**
     * Create animation from balanced equation and energy profile
     */
    createAnimationFromEquation(equation: BalancedEquation, energyProfile: EnergyProfile, transitionStates?: TransitionState[]): Promise<AnimationFrame[]>;
    /**
     * Create animation from custom molecular structures
     */
    createCustomAnimation(reactants: MolecularFrame[], products: MolecularFrame[], bondChanges: BondChange[]): AnimationFrame[];
    /**
     * Play the animation on a canvas
     */
    playAnimation(canvas: HTMLCanvasElement, onFrameUpdate?: (frame: AnimationFrame) => void): Promise<void>;
    /**
     * Pause the animation
     */
    pauseAnimation(): void;
    /**
     * Resume the animation
     */
    resumeAnimation(): void;
    /**
     * Reset animation to beginning
     */
    resetAnimation(): void;
    /**
     * Export animation as video data
     */
    exportAnimation(format?: 'gif' | 'mp4' | 'webm'): Promise<Blob>;
    /**
     * Generate molecular structures from species names
     */
    private generateMolecularStructures;
    /**
     * Generate a molecular structure from a molecule name
     */
    private generateStructureFromName;
    /**
     * Create transition path between reactants and products
     */
    private createTransitionPath;
    /**
     * Create custom transition path from bond changes
     */
    private createCustomTransitionPath;
    /**
     * Generate animation frames from reaction steps
     */
    private generateAnimationFrames;
    /**
     * Interpolate molecular structure during a reaction step
     */
    private interpolateStructure;
    /**
     * Interpolate energy during a reaction step
     */
    private interpolateEnergy;
    /**
     * Generate animated bonds for a frame
     */
    private generateAnimatedBonds;
    /**
     * Generate animated atoms for a frame
     */
    private generateAnimatedAtoms;
    /**
     * Render a single animation frame
     */
    private renderFrame;
    /**
     * Render atoms in the current frame
     */
    private renderAtoms;
    /**
     * Render bonds in the current frame
     */
    private renderBonds;
    /**
     * Render energy indicator
     */
    private renderEnergyIndicator;
    /**
     * Render frame information
     */
    private renderFrameInfo;
    /**
     * Apply easing function to animation progress
     */
    private applyEasing;
    /**
     * Infer bond changes between energy profile points
     */
    private inferBondChanges;
    /**
     * Generate intermediate structures between energy points
     */
    private generateIntermediateStructures;
    /**
     * Interpolate bond order during animation
     */
    private interpolateBondOrder;
    /**
     * Get bond color based on bond change and progress
     */
    private getBondColor;
    /**
     * Get bond opacity based on bond change and progress
     */
    private getBondOpacity;
}
/**
 * Utility functions for reaction animation
 */
export declare class ReactionAnimationUtils {
    /**
     * Create a simple reaction animation from SMILES strings
     */
    static createFromSMILES(reactantSMILES: string[], productSMILES: string[], config?: Partial<ReactionAnimationConfig>): Promise<ReactionAnimator>;
    /**
     * Create reaction animation with custom bond changes
     */
    static createWithBondChanges(bondChanges: BondChange[], config?: Partial<ReactionAnimationConfig>): ReactionAnimator;
    /**
     * Export animation data to various formats
     */
    static exportAnimationData(animation: AnimationFrame[], format: 'json' | 'csv' | 'xml'): string;
    private static animationToCSV;
    private static animationToXML;
}
//# sourceMappingURL=ReactionAnimation.d.ts.map