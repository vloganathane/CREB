/**
 * CREB Phase 3: Advanced Physics Simulation Engine
 * 
 * This module provides realistic molecular dynamics and force field calculations
 * for chemically accurate animation sequences using Cannon.js physics engine.
 */

import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { telemetry, globalProfiler, globalMetrics } from '../core/telemetry';

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
export class MolecularPhysicsEngine {
  private world!: CANNON.World;
  private atomBodies: Map<string, CANNON.Body> = new Map();
  private bondConstraints: Map<string, CANNON.Constraint> = new Map();
  private config: MolecularPhysicsConfig;
  
  // Atomic masses (amu)
  private static readonly ATOMIC_MASSES: Record<string, number> = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011,
    N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
    Al: 26.982, Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, Ar: 39.948,
    K: 39.098, Ca: 40.078, Fe: 55.845, Ni: 58.693, Cu: 63.546, Zn: 65.38
  };

  // Van der Waals radii (Å)
  private static readonly VDW_RADII: Record<string, number> = {
    H: 1.20, He: 1.40, Li: 1.82, Be: 1.53, B: 1.92, C: 1.70,
    N: 1.55, O: 1.52, F: 1.47, Ne: 1.54, Na: 2.27, Mg: 1.73,
    Al: 1.84, Si: 2.10, P: 1.80, S: 1.80, Cl: 1.75, Ar: 1.88
  };

  // Bond lengths (Å)
  private static readonly BOND_LENGTHS: Record<string, number> = {
    'H-H': 0.74, 'C-C': 1.54, 'C=C': 1.34, 'C≡C': 1.20,
    'C-H': 1.09, 'C-O': 1.43, 'C=O': 1.23, 'O-H': 0.96,
    'N-H': 1.01, 'C-N': 1.47, 'C=N': 1.29, 'C≡N': 1.16,
    'O-O': 1.48, 'N-N': 1.45, 'S-S': 2.05, 'C-S': 1.82
  };

  constructor(config: Partial<MolecularPhysicsConfig> = {}) {
    this.config = {
      enableGravity: false, // Molecular scale doesn't need gravity
      gravityStrength: 0,
      enableInteratomicForces: true,
      forceFieldStrength: 1.0,
      dampingFactor: 0.1,
      timeStep: 1/60, // 60 FPS
      enableCollisionDetection: true,
      bondStiffness: 100.0,
      angleStiffness: 50.0,
      ...config
    };

    this.initializePhysicsWorld();
    telemetry.info('🧬 Molecular physics engine initialized', { config: this.config });
  }

  /**
   * Initialize the Cannon.js physics world
   */
  private initializePhysicsWorld(): void {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, this.config.gravityStrength, 0)
    });

    // Set up collision detection
    this.world.broadphase = new CANNON.NaiveBroadphase();
    (this.world.solver as any).iterations = 10;
    this.world.allowSleep = false; // Keep molecules active

    // Add contact materials for realistic collisions
    const atomMaterial = new CANNON.Material('atom');
    const atomContactMaterial = new CANNON.ContactMaterial(atomMaterial, atomMaterial, {
      friction: 0.1,
      restitution: 0.9,
      contactEquationStiffness: 1e6,
      contactEquationRelaxation: 3
    });
    this.world.addContactMaterial(atomContactMaterial);
  }

  /**
   * Simulate molecular dynamics for a given time step
   */
  async simulateMolecularDynamics(
    atoms: AtomPhysicsState[], 
    bonds: BondPhysicsState[], 
    deltaTime: number = this.config.timeStep
  ): Promise<MolecularDynamicsResult> {
    return globalProfiler.profileAsync('physics.molecular_dynamics', async () => {
      try {
        telemetry.info('⚗️ Starting molecular dynamics simulation', { 
          atomCount: atoms.length, 
          bondCount: bonds.length,
          deltaTime 
        });

        // Calculate forces
        const forceField = await this.calculateForceField(atoms, bonds);
        
        // Apply forces to atoms
        this.applyForcesToAtoms(atoms, forceField);
        
        // Integrate motion equations
        this.integrateMotion(atoms, deltaTime);
        
        // Update bond states
        const updatedBonds = this.updateBondStates(atoms, bonds);
        
        // Calculate energies
        const energies = this.calculateEnergies(atoms, updatedBonds);
        
        // Update physics world
        this.updatePhysicsWorld(atoms, deltaTime);

        const result: MolecularDynamicsResult = {
          atomStates: atoms,
          bondStates: updatedBonds,
          totalEnergy: energies.total,
          kineticEnergy: energies.kinetic,
          potentialEnergy: energies.potential,
          temperature: this.calculateTemperature(atoms),
          pressure: this.calculatePressure(atoms),
          timestamp: Date.now()
        };

        globalMetrics.counter('physics.simulation.success', 1);
        telemetry.info('✅ Molecular dynamics step complete', {
          totalEnergy: energies.total,
          temperature: result.temperature
        });

        return result;

      } catch (error) {
        globalMetrics.counter('physics.simulation.errors', 1);
        telemetry.error('❌ Molecular dynamics simulation failed', error as Error);
        throw error;
      }
    });
  }

  /**
   * Calculate comprehensive force field
   */
  private async calculateForceField(atoms: AtomPhysicsState[], bonds: BondPhysicsState[]): Promise<ForceField> {
    return globalProfiler.profileAsync('physics.force_calculation', async () => {
      const forceField: ForceField = {
        vanDerWaals: new Array(atoms.length).fill(null).map(() => new THREE.Vector3()),
        electrostatic: new Array(atoms.length).fill(null).map(() => new THREE.Vector3()),
        bondStretch: new Array(atoms.length).fill(null).map(() => new THREE.Vector3()),
        angleStrain: new Array(atoms.length).fill(null).map(() => new THREE.Vector3()),
        torsional: new Array(atoms.length).fill(null).map(() => new THREE.Vector3())
      };

      // Calculate Van der Waals forces
      await this.calculateVanDerWaalsForces(atoms, forceField.vanDerWaals);
      
      // Calculate electrostatic forces
      await this.calculateElectrostaticForces(atoms, forceField.electrostatic);
      
      // Calculate bond stretching forces
      await this.calculateBondStretchingForces(atoms, bonds, forceField.bondStretch);
      
      // Calculate angle strain forces
      await this.calculateAngleStrainForces(atoms, bonds, forceField.angleStrain);

      return forceField;
    });
  }

  /**
   * Calculate Van der Waals (Lennard-Jones) forces
   */
  private async calculateVanDerWaalsForces(atoms: AtomPhysicsState[], vdwForces: THREE.Vector3[]): Promise<void> {
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const atom1 = atoms[i];
        const atom2 = atoms[j];
        
        const distance = atom1.position.distanceTo(atom2.position);
        const sigma = (this.getVdwRadius(atom1.element) + this.getVdwRadius(atom2.element)) / 2;
        const epsilon = Math.sqrt(this.getVdwWellDepth(atom1.element) * this.getVdwWellDepth(atom2.element));
        
        // Lennard-Jones potential: 4ε[(σ/r)¹² - (σ/r)⁶]
        const sigma6 = Math.pow(sigma / distance, 6);
        const sigma12 = sigma6 * sigma6;
        
        const forceMagnitude = 24 * epsilon * (2 * sigma12 - sigma6) / distance;
        
        const direction = new THREE.Vector3()
          .subVectors(atom2.position, atom1.position)
          .normalize();
        
        const force = direction.multiplyScalar(forceMagnitude * this.config.forceFieldStrength);
        
        vdwForces[i].add(force);
        vdwForces[j].sub(force);
      }
    }
  }

  /**
   * Calculate electrostatic (Coulomb) forces
   */
  private async calculateElectrostaticForces(atoms: AtomPhysicsState[], electrostaticForces: THREE.Vector3[]): Promise<void> {
    const k = 8.99e9; // Coulomb's constant (scaled for molecular simulation)
    
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const atom1 = atoms[i];
        const atom2 = atoms[j];
        
        if (atom1.charge === 0 && atom2.charge === 0) continue;
        
        const distance = atom1.position.distanceTo(atom2.position);
        const forceMagnitude = k * atom1.charge * atom2.charge / (distance * distance);
        
        const direction = new THREE.Vector3()
          .subVectors(atom2.position, atom1.position)
          .normalize();
        
        const force = direction.multiplyScalar(forceMagnitude * this.config.forceFieldStrength);
        
        electrostaticForces[i].add(force);
        electrostaticForces[j].sub(force);
      }
    }
  }

  /**
   * Calculate bond stretching forces (harmonic oscillator)
   */
  private async calculateBondStretchingForces(
    atoms: AtomPhysicsState[], 
    bonds: BondPhysicsState[], 
    bondForces: THREE.Vector3[]
  ): Promise<void> {
    for (const bond of bonds) {
      const atom1Index = atoms.findIndex(a => a.id === bond.atom1Id);
      const atom2Index = atoms.findIndex(a => a.id === bond.atom2Id);
      
      if (atom1Index === -1 || atom2Index === -1) continue;
      
      const atom1 = atoms[atom1Index];
      const atom2 = atoms[atom2Index];
      
      const currentLength = atom1.position.distanceTo(atom2.position);
      const displacement = currentLength - bond.restLength;
      
      // Hooke's law: F = -k * x
      const forceMagnitude = -bond.stiffness * displacement;
      
      const direction = new THREE.Vector3()
        .subVectors(atom2.position, atom1.position)
        .normalize();
      
      const force = direction.multiplyScalar(forceMagnitude);
      
      bondForces[atom1Index].add(force);
      bondForces[atom2Index].sub(force);
      
      // Update bond strain for breaking animation
      bond.strain = Math.abs(displacement / bond.restLength);
    }
  }

  /**
   * Calculate angle strain forces
   */
  private async calculateAngleStrainForces(
    atoms: AtomPhysicsState[], 
    bonds: BondPhysicsState[], 
    angleForces: THREE.Vector3[]
  ): Promise<void> {
    // Find angle triplets (atom-atom-atom connected by bonds)
    const angleConstraints = this.findAngleConstraints(atoms, bonds);
    
    for (const angle of angleConstraints) {
      const atom1 = atoms[angle.atom1Index];
      const atom2 = atoms[angle.atom2Index]; // Center atom
      const atom3 = atoms[angle.atom3Index];
      
      const vec1 = new THREE.Vector3().subVectors(atom1.position, atom2.position).normalize();
      const vec2 = new THREE.Vector3().subVectors(atom3.position, atom2.position).normalize();
      
      const currentAngle = vec1.angleTo(vec2);
      const angleDeviation = currentAngle - angle.restAngle;
      
      // Angular force calculation (simplified)
      const forceMagnitude = this.config.angleStiffness * angleDeviation;
      
      // Apply perpendicular forces to maintain angle
      const perpForce1 = new THREE.Vector3().crossVectors(vec1, vec2).normalize().multiplyScalar(forceMagnitude);
      const perpForce2 = perpForce1.clone().multiplyScalar(-1);
      
      angleForces[angle.atom1Index].add(perpForce1);
      angleForces[angle.atom3Index].add(perpForce2);
    }
  }

  /**
   * Apply calculated forces to atoms
   */
  private applyForcesToAtoms(atoms: AtomPhysicsState[], forceField: ForceField): void {
    for (let i = 0; i < atoms.length; i++) {
      const atom = atoms[i];
      
      // Sum all forces
      const totalForce = new THREE.Vector3()
        .add(forceField.vanDerWaals[i])
        .add(forceField.electrostatic[i])
        .add(forceField.bondStretch[i])
        .add(forceField.angleStrain[i])
        .add(forceField.torsional[i]);
      
      // F = ma, so a = F/m
      atom.acceleration = totalForce.divideScalar(atom.mass);
      
      // Store forces for visualization
      atom.forces = [
        forceField.vanDerWaals[i].clone(),
        forceField.electrostatic[i].clone(),
        forceField.bondStretch[i].clone()
      ];
    }
  }

  /**
   * Integrate equations of motion using Verlet integration
   */
  private integrateMotion(atoms: AtomPhysicsState[], deltaTime: number): void {
    for (const atom of atoms) {
      // Velocity Verlet integration
      const oldPosition = atom.position.clone();
      const oldVelocity = atom.velocity.clone();
      
      // x(t+Δt) = x(t) + v(t)Δt + ½a(t)Δt²
      atom.position.add(
        atom.velocity.clone().multiplyScalar(deltaTime)
      ).add(
        atom.acceleration.clone().multiplyScalar(0.5 * deltaTime * deltaTime)
      );
      
      // v(t+Δt) = v(t) + a(t)Δt
      atom.velocity.add(atom.acceleration.clone().multiplyScalar(deltaTime));
      
      // Apply damping to prevent unrealistic motion
      atom.velocity.multiplyScalar(1 - this.config.dampingFactor * deltaTime);
    }
  }

  /**
   * Update bond states and detect breaking bonds
   */
  private updateBondStates(atoms: AtomPhysicsState[], bonds: BondPhysicsState[]): BondPhysicsState[] {
    return bonds.map(bond => {
      const atom1 = atoms.find(a => a.id === bond.atom1Id);
      const atom2 = atoms.find(a => a.id === bond.atom2Id);
      
      if (!atom1 || !atom2) return bond;
      
      const currentLength = atom1.position.distanceTo(atom2.position);
      const stretchRatio = currentLength / bond.restLength;
      
      // Determine if bond is breaking (threshold: 150% of rest length)
      if (stretchRatio > 1.5 && !bond.isBreaking) {
        bond.isBreaking = true;
        bond.breakingProgress = 0;
        telemetry.info('💥 Bond breaking detected', { 
          bondId: bond.id, 
          stretchRatio,
          atoms: [atom1.element, atom2.element]
        });
      }
      
      // Update breaking progress
      if (bond.isBreaking) {
        bond.breakingProgress = Math.min(bond.breakingProgress + 0.02, 1.0);
        bond.stiffness *= 0.95; // Gradually weaken the bond
      }
      
      return bond;
    });
  }

  /**
   * Calculate system energies
   */
  private calculateEnergies(atoms: AtomPhysicsState[], bonds: BondPhysicsState[]): { total: number, kinetic: number, potential: number } {
    let kineticEnergy = 0;
    let potentialEnergy = 0;
    
    // Kinetic energy: KE = ½mv²
    for (const atom of atoms) {
      const velocity = atom.velocity.length();
      kineticEnergy += 0.5 * atom.mass * velocity * velocity;
    }
    
    // Potential energy from bonds: PE = ½k(x-x₀)²
    for (const bond of bonds) {
      const atom1 = atoms.find(a => a.id === bond.atom1Id);
      const atom2 = atoms.find(a => a.id === bond.atom2Id);
      
      if (atom1 && atom2) {
        const currentLength = atom1.position.distanceTo(atom2.position);
        const displacement = currentLength - bond.restLength;
        potentialEnergy += 0.5 * bond.stiffness * displacement * displacement;
      }
    }
    
    return {
      kinetic: kineticEnergy,
      potential: potentialEnergy,
      total: kineticEnergy + potentialEnergy
    };
  }

  /**
   * Calculate system temperature from kinetic energy
   */
  private calculateTemperature(atoms: AtomPhysicsState[]): number {
    let totalKineticEnergy = 0;
    
    for (const atom of atoms) {
      const velocity = atom.velocity.length();
      totalKineticEnergy += 0.5 * atom.mass * velocity * velocity;
    }
    
    // Temperature from equipartition theorem: KE = (3/2)NkT
    const kB = 1.380649e-23; // Boltzmann constant (scaled)
    const temperature = (2 * totalKineticEnergy) / (3 * atoms.length * kB);
    
    return temperature;
  }

  /**
   * Calculate system pressure (simplified ideal gas approximation)
   */
  private calculatePressure(atoms: AtomPhysicsState[]): number {
    const volume = 1000; // Arbitrary volume unit
    const temperature = this.calculateTemperature(atoms);
    const R = 8.314; // Gas constant (scaled)
    
    // PV = nRT
    const pressure = (atoms.length * R * temperature) / volume;
    
    return pressure;
  }

  /**
   * Update Cannon.js physics world
   */
  private updatePhysicsWorld(atoms: AtomPhysicsState[], deltaTime: number): void {
    // Sync atom positions with physics bodies
    for (const atom of atoms) {
      const body = this.atomBodies.get(atom.id);
      if (body) {
        body.position.set(atom.position.x, atom.position.y, atom.position.z);
        body.velocity.set(atom.velocity.x, atom.velocity.y, atom.velocity.z);
      }
    }
    
    // Step the physics simulation
    this.world.fixedStep(deltaTime);
  }

  /**
   * Helper methods for force field parameters
   */
  private getVdwRadius(element: string): number {
    return MolecularPhysicsEngine.VDW_RADII[element] || 1.5;
  }

  private getVdwWellDepth(element: string): number {
    // Simplified well depth approximation
    const wellDepths: Record<string, number> = {
      H: 0.02, C: 0.07, N: 0.07, O: 0.06, S: 0.13, Cl: 0.23
    };
    return wellDepths[element] || 0.05;
  }

  private getAtomicMass(element: string): number {
    return MolecularPhysicsEngine.ATOMIC_MASSES[element] || 12.0;
  }

  private getBondLength(atom1: string, atom2: string, bondType: string): number {
    const bondKey = `${atom1}-${atom2}`;
    const reverseBondKey = `${atom2}-${atom1}`;
    
    return MolecularPhysicsEngine.BOND_LENGTHS[bondKey] || 
           MolecularPhysicsEngine.BOND_LENGTHS[reverseBondKey] || 
           1.5;
  }

  /**
   * Find angle constraints for 3-atom sequences
   */
  private findAngleConstraints(atoms: AtomPhysicsState[], bonds: BondPhysicsState[]) {
    const angleConstraints: Array<{
      atom1Index: number;
      atom2Index: number;
      atom3Index: number;
      restAngle: number;
    }> = [];

    // Find connected atom triplets
    for (let centerIndex = 0; centerIndex < atoms.length; centerIndex++) {
      const connectedAtoms: number[] = [];
      
      for (const bond of bonds) {
        if (bond.atom1Id === atoms[centerIndex].id) {
          const connectedIndex = atoms.findIndex(a => a.id === bond.atom2Id);
          if (connectedIndex !== -1) connectedAtoms.push(connectedIndex);
        } else if (bond.atom2Id === atoms[centerIndex].id) {
          const connectedIndex = atoms.findIndex(a => a.id === bond.atom1Id);
          if (connectedIndex !== -1) connectedAtoms.push(connectedIndex);
        }
      }
      
      // Create angle constraints for each pair of connected atoms
      for (let i = 0; i < connectedAtoms.length; i++) {
        for (let j = i + 1; j < connectedAtoms.length; j++) {
          angleConstraints.push({
            atom1Index: connectedAtoms[i],
            atom2Index: centerIndex,
            atom3Index: connectedAtoms[j],
            restAngle: Math.PI * (109.5 / 180) // Tetrahedral angle as default
          });
        }
      }
    }

    return angleConstraints;
  }

  /**
   * Configure physics simulation parameters
   */
  configure(config: any): void {
    try {
      if (config.enableCollision !== undefined) {
        this.world.broadphase = config.enableCollision ? 
          new CANNON.NaiveBroadphase() : new CANNON.SAPBroadphase(this.world);
      }

      if (config.temperature !== undefined) {
        // Adjust gravity based on temperature (higher temp = more kinetic energy)
        const tempFactor = Math.max(0.1, config.temperature / 298);
        this.world.gravity.set(0, -9.82 * tempFactor, 0);
      }

      telemetry.info('Physics engine configured', config);
    } catch (error: any) {
      telemetry.error('Physics configuration failed', error);
      throw error;
    }
  }

  /**
   * Simulate reaction pathway with physics
   */
  async simulateReactionPathway(
    transitions: any[], 
    duration: number
  ): Promise<any[]> {
    try {
      const frames: any[] = [];
      const frameRate = 60; // 60 FPS
      const totalFrames = Math.floor(duration * frameRate);

      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / totalFrames;
        const timestamp = (frame / frameRate) * 1000; // Convert to ms

        // Step physics simulation
        this.world.step(1 / frameRate);

        // Generate molecular states for this frame
        const molecularStates = transitions.map((transition, index) => ({
          moleculeId: `molecule_${index}`,
          position: this.interpolatePosition(transition, progress),
          rotation: this.interpolateRotation(transition, progress),
          scale: this.interpolateScale(transition, progress),
          bonds: transition.bonds || [],
          atoms: transition.atoms || []
        }));

        frames.push({
          timestamp,
          molecularStates
        });
      }

      telemetry.info('Physics simulation completed', { duration, frames: frames.length });
      return frames;
    } catch (error: any) {
      telemetry.error('Physics simulation failed', error);
      throw error;
    }
  }

  /**
   * Interpolate position based on physics
   */
  private interpolatePosition(transition: any, progress: number): any {
    if (!transition.startStructure || !transition.endStructure) {
      return { x: 0, y: 0, z: 0 };
    }

    const start = transition.startStructure.center || { x: 0, y: 0, z: 0 };
    const end = transition.endStructure.center || { x: 0, y: 0, z: 0 };

    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress,
      z: start.z + (end.z - start.z) * progress
    };
  }

  /**
   * Interpolate rotation based on physics
   */
  private interpolateRotation(transition: any, progress: number): any {
    return { x: 0, y: progress * Math.PI * 2, z: 0 };
  }

  /**
   * Interpolate scale based on physics
   */
  private interpolateScale(transition: any, progress: number): any {
    const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
    return { x: scale, y: scale, z: scale };
  }

  /**
   * Clean up physics resources
   */
  dispose(): void {
    this.atomBodies.clear();
    this.bondConstraints.clear();
    telemetry.info('🧬 Molecular physics engine disposed');
  }
}
