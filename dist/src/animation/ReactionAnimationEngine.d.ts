/**
 * CREB Phase 2: Animated Reaction Transition Engine
 *
 * This module provides smooth, physics-based animations between
 * reactant and product molecular states using GSAP and Three.js.
 */
import * as THREE from 'three';
export interface AnimationConfig {
    duration: number;
    easing: string;
    showEnergyProfile: boolean;
    showBondTransitions: boolean;
    particleEffects: boolean;
    audioEnabled: boolean;
}
export interface MolecularTransition {
    startStructure: MolecularData;
    endStructure: MolecularData;
    transitionType: 'formation' | 'breaking' | 'rearrangement';
    energyBarrier: number;
    transitionState?: MolecularData;
}
export interface AnimationFrame {
    timestamp: number;
    molecularStates: MolecularState[];
    energyLevel: number;
    bondChanges: BondChange[];
    atomMovements: AtomMovement[];
}
export interface MolecularState {
    atoms: AtomState[];
    bonds: BondState[];
    overallCharge: number;
    spinMultiplicity: number;
}
export interface AtomState {
    id: string;
    element: string;
    position: THREE.Vector3;
    charge: number;
    hybridization: string;
    color: string;
    radius: number;
}
export interface BondState {
    id: string;
    atom1: string;
    atom2: string;
    order: number;
    length: number;
    strength: number;
    color: string;
}
export interface BondChange {
    type: 'formation' | 'breaking' | 'order_change';
    bondId: string;
    startOrder: number;
    endOrder: number;
    timeline: number[];
}
export interface AtomMovement {
    atomId: string;
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    trajectory: THREE.Vector3[];
    speed: number;
}
export declare class ReactionAnimationEngine {
    private scene;
    private camera;
    private renderer;
    private timeline;
    private config;
    private aiClassifier;
    private physicsEngine;
    private cacheManager;
    private mol3dViewer;
    private mol3dContainer;
    private molecularModels;
    private isPlaying;
    private currentFrame;
    private totalFrames;
    private animationData;
    private atomMeshes;
    private bondMeshes;
    private energyProfileMesh;
    private particleSystem;
    private onProgress?;
    private onComplete?;
    private onFrameUpdate?;
    constructor(container: HTMLElement, config?: Partial<AnimationConfig>);
    private initializeThreeJS;
    private setupLighting;
    private initialize3Dmol;
    private addTestGeometry;
    private addDemo3DMolecules;
    private initializeGSAP;
    /**
     * Create 3Dmol.js molecular models from molecular data
     */
    private createMolecularModels;
    /**
     * Convert CREB molecular data to 3Dmol.js XYZ format
     */
    private convertToMol3DFormat;
    /**
     * Generate fallback XYZ data for simple molecules
     */
    private generateFallbackXYZ;
    /**
     * Animate molecular transformations using both 3Dmol.js and Three.js
     */
    private animateMolecularTransformation;
    /**
     * Render transition effects using Three.js
     */
    private renderTransitionEffects;
    /**
     * Phase 3: AI-Enhanced Animation Creation
     * Uses machine learning to optimize animation parameters
     */
    createAIEnhancedAnimation(reactants: MolecularData[], products: MolecularData[], reactionEquation: string): Promise<void>;
    /**
     * Generate molecular transitions based on AI classification
     */
    private generateMolecularTransitions;
    /**
     * Create animated transition from reactants to products
     */
    createReactionAnimation(reactants: MolecularData[], products: MolecularData[]): Promise<void>;
    /**
     * Calculate molecular transitions between reactants and products
     */
    private calculateMolecularTransitions;
    private determineTransitionType;
    private calculateEnergyBarrier;
    private generateTransitionState;
    /**
     * Generate frame-by-frame animation data
     */
    private generateAnimationFrames;
    private interpolateMolecularState;
    private calculateFrameEnergy;
    private calculateBondChanges;
    private calculateAtomMovements;
    private generateAtomTrajectory;
    /**
     * Build 3D molecular geometries for rendering
     */
    private buildMolecularGeometries;
    private createAtomMesh;
    private createBondMesh;
    /**
     * Create GSAP animation timeline
     */
    private createAnimationTimeline;
    private animateMolecularTransition;
    private animateBondTransitions;
    /**
     * Create energy profile visualization
     */
    private createEnergyProfileVisualization;
    /**
     * Create particle effects for bond breaking/formation
     */
    private createParticleEffects;
    /**
     * Animation control methods
     */
    play(): void;
    pause(): void;
    reset(): void;
    setProgress(progress: number): void;
    /**
     * Event handling
     */
    onProgressUpdate(callback: (progress: number) => void): void;
    onAnimationComplete(callback: () => void): void;
    onFrameChange(callback: (frame: AnimationFrame) => void): void;
    /**
     * Utility methods
     */
    private getAtomColor;
    private getAtomRadius;
    private getBondColor;
    private onTimelineUpdate;
    private handleAnimationComplete;
    private startRenderLoop;
    private startContinuousRender;
    private onWindowResize;
    private clearScene;
    /**
     * Generate substitution reaction transitions
     */
    private generateSubstitutionTransitions;
    /**
     * Generate addition reaction transitions
     */
    private generateAdditionTransitions;
    /**
     * Generate elimination reaction transitions
     */
    private generateEliminationTransitions;
    /**
     * Generate generic reaction transitions
     */
    private generateGenericTransitions;
    /**
     * Cleanup
     */
    dispose(): void;
}
interface MolecularData {
    formula?: string;
    atoms?: Array<{
        id?: string;
        element: string;
        position: {
            x: number;
            y: number;
            z: number;
        };
        charge?: number;
        hybridization?: string;
    }>;
    bonds?: Array<{
        id?: string;
        atom1: string;
        atom2: string;
        order: number;
        length?: number;
        strength?: number;
    }>;
    charge?: number;
    spinMultiplicity?: number;
}
export {};
//# sourceMappingURL=ReactionAnimationEngine.d.ts.map