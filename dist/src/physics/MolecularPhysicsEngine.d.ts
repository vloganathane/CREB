/**
 * CREB Phase 3: Advanced Physics Simulation Engine
 *
 * This module provides realistic molecular dynamics and force field calculations
 * for chemically accurate animation sequences using Cannon.js physics engine.
 */
import * as THREE from 'three';
export interface MolecularPhysicsConfig {
    enableGravity: boolean;
    gravityStrength: number;
    enableInteratomicForces: boolean;
    forceFieldStrength: number;
    dampingFactor: number;
    timeStep: number;
    enableCollisionDetection: boolean;
    bondStiffness: number;
    angleStiffness: number;
}
export interface AtomPhysicsState {
    id: string;
    element: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
    mass: number;
    charge: number;
    radius: number;
    forces: THREE.Vector3[];
}
export interface BondPhysicsState {
    id: string;
    atom1Id: string;
    atom2Id: string;
    bondType: 'single' | 'double' | 'triple' | 'aromatic';
    restLength: number;
    stiffness: number;
    isBreaking: boolean;
    breakingProgress: number;
    strain: number;
}
export interface MolecularDynamicsResult {
    atomStates: AtomPhysicsState[];
    bondStates: BondPhysicsState[];
    totalEnergy: number;
    kineticEnergy: number;
    potentialEnergy: number;
    temperature: number;
    pressure: number;
    timestamp: number;
}
export interface ForceField {
    vanDerWaals: THREE.Vector3[];
    electrostatic: THREE.Vector3[];
    bondStretch: THREE.Vector3[];
    angleStrain: THREE.Vector3[];
    torsional: THREE.Vector3[];
}
/**
 * Advanced Molecular Physics Engine
 * Provides realistic force field calculations and molecular dynamics simulation
 */
export declare class MolecularPhysicsEngine {
    private world;
    private atomBodies;
    private bondConstraints;
    private config;
    private static readonly ATOMIC_MASSES;
    private static readonly VDW_RADII;
    private static readonly BOND_LENGTHS;
    constructor(config?: Partial<MolecularPhysicsConfig>);
    /**
     * Initialize the Cannon.js physics world
     */
    private initializePhysicsWorld;
    /**
     * Simulate molecular dynamics for a given time step
     */
    simulateMolecularDynamics(atoms: AtomPhysicsState[], bonds: BondPhysicsState[], deltaTime?: number): Promise<MolecularDynamicsResult>;
    /**
     * Calculate comprehensive force field
     */
    private calculateForceField;
    /**
     * Calculate Van der Waals (Lennard-Jones) forces
     */
    private calculateVanDerWaalsForces;
    /**
     * Calculate electrostatic (Coulomb) forces
     */
    private calculateElectrostaticForces;
    /**
     * Calculate bond stretching forces (harmonic oscillator)
     */
    private calculateBondStretchingForces;
    /**
     * Calculate angle strain forces
     */
    private calculateAngleStrainForces;
    /**
     * Apply calculated forces to atoms
     */
    private applyForcesToAtoms;
    /**
     * Integrate equations of motion using Verlet integration
     */
    private integrateMotion;
    /**
     * Update bond states and detect breaking bonds
     */
    private updateBondStates;
    /**
     * Calculate system energies
     */
    private calculateEnergies;
    /**
     * Calculate system temperature from kinetic energy
     */
    private calculateTemperature;
    /**
     * Calculate system pressure (simplified ideal gas approximation)
     */
    private calculatePressure;
    /**
     * Update Cannon.js physics world
     */
    private updatePhysicsWorld;
    /**
     * Helper methods for force field parameters
     */
    private getVdwRadius;
    private getVdwWellDepth;
    private getAtomicMass;
    private getBondLength;
    /**
     * Find angle constraints for 3-atom sequences
     */
    private findAngleConstraints;
    /**
     * Configure physics simulation parameters
     */
    configure(config: any): void;
    /**
     * Simulate reaction pathway with physics
     */
    simulateReactionPathway(transitions: any[], duration: number): Promise<any[]>;
    /**
     * Interpolate position based on physics
     */
    private interpolatePosition;
    /**
     * Interpolate rotation based on physics
     */
    private interpolateRotation;
    /**
     * Interpolate scale based on physics
     */
    private interpolateScale;
    /**
     * Clean up physics resources
     */
    dispose(): void;
}
//# sourceMappingURL=MolecularPhysicsEngine.d.ts.map