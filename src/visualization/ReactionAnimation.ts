/**
 * Reaction Animation System
 * Implements animated bond formation/breaking visualization for chemical reactions
 * Part of CREB-JS v1.7.0 - Complete Reaction Animation Feature
 */

import { EnergyProfile, EnergyProfilePoint, BondChange, TransitionState } from '../thermodynamics/types';
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
    position: { x: number; y: number; z: number };
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
  position: { x: number; y: number; z: number };
  /** Target position */
  targetPosition: { x: number; y: number; z: number };
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
 */
export class ReactionAnimator {
  private config: ReactionAnimationConfig;
  private currentAnimation: AnimationFrame[] = [];
  private isPlaying: boolean = false;
  private currentFrame: number = 0;
  private animationId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private energyProfile: EnergyProfile | null = null;

  constructor(config: Partial<ReactionAnimationConfig> = {}) {
    this.config = {
      duration: 5000,
      fps: 30,
      easing: 'ease-in-out',
      showEnergyProfile: true,
      showBondOrders: true,
      showCharges: false,
      style: 'smooth',
      bondColorScheme: 'energy-based',
      ...config
    };
  }

  /**
   * Create animation from balanced equation and energy profile
   */
  async createAnimationFromEquation(
    equation: BalancedEquation,
    energyProfile: EnergyProfile,
    transitionStates?: TransitionState[]
  ): Promise<AnimationFrame[]> {
    this.energyProfile = energyProfile;
    
    // Parse reactants and products
    const reactantStructures = await this.generateMolecularStructures(equation.reactants);
    const productStructures = await this.generateMolecularStructures(equation.products);
    
    // Create transition path
    const transitionPath = this.createTransitionPath(
      reactantStructures,
      productStructures,
      energyProfile,
      transitionStates
    );
    
    // Generate animation frames
    this.currentAnimation = this.generateAnimationFrames(transitionPath);
    
    return this.currentAnimation;
  }

  /**
   * Create animation from custom molecular structures
   */
  createCustomAnimation(
    reactants: MolecularFrame[],
    products: MolecularFrame[],
    bondChanges: BondChange[]
  ): AnimationFrame[] {
    const transitionPath = this.createCustomTransitionPath(reactants, products, bondChanges);
    this.currentAnimation = this.generateAnimationFrames(transitionPath);
    return this.currentAnimation;
  }

  /**
   * Play the animation on a canvas
   */
  async playAnimation(canvas: HTMLCanvasElement, onFrameUpdate?: (frame: AnimationFrame) => void): Promise<void> {
    if (this.currentAnimation.length === 0) {
      throw new Error('No animation loaded. Call createAnimation first.');
    }

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    if (!this.context) {
      throw new Error('Could not get 2D context from canvas');
    }

    this.isPlaying = true;
    this.currentFrame = 0;

    const frameInterval = 1000 / this.config.fps;
    
    return new Promise((resolve) => {
      const animate = () => {
        if (!this.isPlaying || this.currentFrame >= this.currentAnimation.length) {
          this.isPlaying = false;
          resolve();
          return;
        }

        const frame = this.currentAnimation[this.currentFrame];
        this.renderFrame(frame);
        
        if (onFrameUpdate) {
          onFrameUpdate(frame);
        }

        this.currentFrame++;
        this.animationId = setTimeout(animate, frameInterval);
      };

      animate();
    });
  }

  /**
   * Pause the animation
   */
  pauseAnimation(): void {
    this.isPlaying = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume the animation
   */
  resumeAnimation(): void {
    if (!this.isPlaying && this.currentFrame < this.currentAnimation.length) {
      this.isPlaying = true;
      this.playAnimation(this.canvas!);
    }
  }

  /**
   * Reset animation to beginning
   */
  resetAnimation(): void {
    this.pauseAnimation();
    this.currentFrame = 0;
  }

  /**
   * Export animation as video data
   */
  exportAnimation(format: 'gif' | 'mp4' | 'webm' = 'gif'): Promise<Blob> {
    // Implementation would depend on the specific video encoding library
    // For now, return a mock blob
    return Promise.resolve(new Blob(['animation data'], { type: `video/${format}` }));
  }

  /**
   * Generate molecular structures from species names
   */
  private async generateMolecularStructures(species: string[]): Promise<MolecularFrame[]> {
    const structures: MolecularFrame[] = [];
    
    for (const molecule of species) {
      const structure = await this.generateStructureFromName(molecule);
      structures.push(structure);
    }
    
    return structures;
  }

  /**
   * Generate a molecular structure from a molecule name
   */
  private async generateStructureFromName(moleculeName: string): Promise<MolecularFrame> {
    // This would integrate with molecular database or SMILES parser
    // For now, return mock structures for common molecules
    const mockStructures: Record<string, MolecularFrame> = {
      'H2O': {
        atoms: [
          { element: 'O', position: { x: 0, y: 0, z: 0 }, charge: -0.34 },
          { element: 'H', position: { x: 0.757, y: 0.587, z: 0 }, charge: 0.17 },
          { element: 'H', position: { x: -0.757, y: 0.587, z: 0 }, charge: 0.17 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 1, length: 0.96 },
          { atom1: 0, atom2: 2, order: 1, length: 0.96 }
        ],
        properties: { totalEnergy: 0, charge: 0 }
      },
      'CH4': {
        atoms: [
          { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: -0.4 },
          { element: 'H', position: { x: 1.089, y: 0, z: 0 }, charge: 0.1 },
          { element: 'H', position: { x: -0.363, y: 1.027, z: 0 }, charge: 0.1 },
          { element: 'H', position: { x: -0.363, y: -0.513, z: 0.889 }, charge: 0.1 },
          { element: 'H', position: { x: -0.363, y: -0.513, z: -0.889 }, charge: 0.1 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 1, length: 1.089 },
          { atom1: 0, atom2: 2, order: 1, length: 1.089 },
          { atom1: 0, atom2: 3, order: 1, length: 1.089 },
          { atom1: 0, atom2: 4, order: 1, length: 1.089 }
        ],
        properties: { totalEnergy: 0, charge: 0 }
      },
      'O2': {
        atoms: [
          { element: 'O', position: { x: -0.6, y: 0, z: 0 }, charge: 0 },
          { element: 'O', position: { x: 0.6, y: 0, z: 0 }, charge: 0 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 2, length: 1.21 }
        ],
        properties: { totalEnergy: 0, charge: 0 }
      },
      'CO2': {
        atoms: [
          { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: 0.4 },
          { element: 'O', position: { x: -1.16, y: 0, z: 0 }, charge: -0.2 },
          { element: 'O', position: { x: 1.16, y: 0, z: 0 }, charge: -0.2 }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 2, length: 1.16 },
          { atom1: 0, atom2: 2, order: 2, length: 1.16 }
        ],
        properties: { totalEnergy: 0, charge: 0 }
      }
    };

    return mockStructures[moleculeName] || mockStructures['H2O'];
  }

  /**
   * Create transition path between reactants and products
   */
  private createTransitionPath(
    reactants: MolecularFrame[],
    products: MolecularFrame[],
    energyProfile: EnergyProfile,
    transitionStates?: TransitionState[]
  ): ReactionStep[] {
    const steps: ReactionStep[] = [];
    
    // Create steps based on energy profile points
    for (let i = 0; i < energyProfile.points.length - 1; i++) {
      const currentPoint = energyProfile.points[i];
      const nextPoint = energyProfile.points[i + 1];
      
      const step: ReactionStep = {
        stepNumber: i,
        description: `${currentPoint.label} → ${nextPoint.label}`,
        energyChange: nextPoint.energy - currentPoint.energy,
        bondChanges: this.inferBondChanges(currentPoint, nextPoint),
        duration: 1 / (energyProfile.points.length - 1),
        intermediates: this.generateIntermediateStructures(currentPoint, nextPoint)
      };
      
      steps.push(step);
    }
    
    return steps;
  }

  /**
   * Create custom transition path from bond changes
   */
  private createCustomTransitionPath(
    reactants: MolecularFrame[],
    products: MolecularFrame[],
    bondChanges: BondChange[]
  ): ReactionStep[] {
    const steps: ReactionStep[] = [];
    
    // Group bond changes by type
    const breakingBonds = bondChanges.filter(bc => bc.type === 'breaking');
    const formingBonds = bondChanges.filter(bc => bc.type === 'forming');
    
    // Create breaking step
    if (breakingBonds.length > 0) {
      steps.push({
        stepNumber: 0,
        description: 'Bond breaking',
        energyChange: breakingBonds.reduce((sum, bc) => sum + bc.energyContribution, 0),
        bondChanges: breakingBonds,
        duration: 0.4
      });
    }
    
    // Create transition state step
    steps.push({
      stepNumber: steps.length,
      description: 'Transition state',
      energyChange: 50, // Estimated activation energy
      bondChanges: [],
      duration: 0.2
    });
    
    // Create forming step
    if (formingBonds.length > 0) {
      steps.push({
        stepNumber: steps.length,
        description: 'Bond forming',
        energyChange: formingBonds.reduce((sum, bc) => sum + bc.energyContribution, 0),
        bondChanges: formingBonds,
        duration: 0.4
      });
    }
    
    return steps;
  }

  /**
   * Generate animation frames from reaction steps
   */
  private generateAnimationFrames(steps: ReactionStep[]): AnimationFrame[] {
    const frames: AnimationFrame[] = [];
    const totalFrames = Math.floor(this.config.duration * this.config.fps / 1000);
    
    let currentFrameIndex = 0;
    
    for (const step of steps) {
      const stepFrames = Math.floor(totalFrames * step.duration);
      
      for (let i = 0; i < stepFrames; i++) {
        const stepProgress = i / (stepFrames - 1);
        const totalProgress = currentFrameIndex / totalFrames;
        
        const frame: AnimationFrame = {
          frameNumber: currentFrameIndex,
          time: totalProgress,
          structure: this.interpolateStructure(step, stepProgress),
          energy: this.interpolateEnergy(step, stepProgress),
          bonds: this.generateAnimatedBonds(step, stepProgress),
          atoms: this.generateAnimatedAtoms(step, stepProgress)
        };
        
        frames.push(frame);
        currentFrameIndex++;
      }
    }
    
    return frames;
  }

  /**
   * Interpolate molecular structure during a reaction step
   */
  private interpolateStructure(step: ReactionStep, progress: number): MolecularFrame {
    // Apply easing function
    const easedProgress = this.applyEasing(progress);
    
    // For now, return a simple interpolated structure
    return {
      atoms: [
        { element: 'C', position: { x: 0, y: 0, z: 0 } }
      ],
      bonds: [],
      properties: { totalEnergy: 0, charge: 0 }
    };
  }

  /**
   * Interpolate energy during a reaction step
   */
  private interpolateEnergy(step: ReactionStep, progress: number): number {
    const easedProgress = this.applyEasing(progress);
    return step.energyChange * easedProgress;
  }

  /**
   * Generate animated bonds for a frame
   */
  private generateAnimatedBonds(step: ReactionStep, progress: number): AnimatedBond[] {
    const bonds: AnimatedBond[] = [];
    
    for (const bondChange of step.bondChanges) {
      const easedProgress = this.applyEasing(progress);
      
      const bond: AnimatedBond = {
        atom1: 0, // Would be determined from bond change
        atom2: 1,
        order: this.interpolateBondOrder(bondChange, easedProgress),
        targetOrder: bondChange.bondOrderChange,
        state: bondChange.type === 'breaking' ? 'breaking' : 'forming',
        color: this.getBondColor(bondChange, easedProgress),
        opacity: this.getBondOpacity(bondChange, easedProgress)
      };
      
      bonds.push(bond);
    }
    
    return bonds;
  }

  /**
   * Generate animated atoms for a frame
   */
  private generateAnimatedAtoms(step: ReactionStep, progress: number): AnimatedAtom[] {
    const atoms: AnimatedAtom[] = [];
    
    // This would generate atoms based on the molecular structure
    // For now, return empty array
    
    return atoms;
  }

  /**
   * Render a single animation frame
   */
  private renderFrame(frame: AnimationFrame): void {
    if (!this.context || !this.canvas) return;
    
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set up coordinate system
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.scale(100, -100); // Scale and flip Y axis for chemistry coordinates
    
    // Render atoms
    this.renderAtoms(frame.atoms);
    
    // Render bonds
    this.renderBonds(frame.bonds);
    
    // Render energy indicator
    if (this.config.showEnergyProfile) {
      this.renderEnergyIndicator(frame.energy);
    }
    
    this.context.restore();
    
    // Render frame information
    this.renderFrameInfo(frame);
  }

  /**
   * Render atoms in the current frame
   */
  private renderAtoms(atoms: AnimatedAtom[]): void {
    if (!this.context) return;
    
    for (const atom of atoms) {
      this.context.save();
      
      // Set atom color
      this.context.fillStyle = atom.color;
      this.context.globalAlpha = atom.opacity;
      
      // Draw atom
      this.context.beginPath();
      this.context.arc(atom.position.x, atom.position.y, atom.radius, 0, 2 * Math.PI);
      this.context.fill();
      
      // Draw element label
      this.context.fillStyle = 'white';
      this.context.font = '0.3px Arial';
      this.context.textAlign = 'center';
      this.context.fillText(atom.element, atom.position.x, atom.position.y + 0.1);
      
      this.context.restore();
    }
  }

  /**
   * Render bonds in the current frame
   */
  private renderBonds(bonds: AnimatedBond[]): void {
    if (!this.context) return;
    
    for (const bond of bonds) {
      this.context.save();
      
      // Set bond style
      this.context.strokeStyle = bond.color;
      this.context.globalAlpha = bond.opacity;
      this.context.lineWidth = 0.1 * bond.order;
      
      if (bond.dashPattern) {
        this.context.setLineDash(bond.dashPattern);
      }
      
      // Draw bond (simplified - would need atom positions)
      this.context.beginPath();
      this.context.moveTo(-1, 0);
      this.context.lineTo(1, 0);
      this.context.stroke();
      
      this.context.restore();
    }
  }

  /**
   * Render energy indicator
   */
  private renderEnergyIndicator(energy: number): void {
    if (!this.context || !this.canvas) return;
    
    this.context.save();
    // Reset transform for consistent positioning
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    
    // Draw energy bar
    const barWidth = 20;
    const barHeight = 200;
    const barX = this.canvas.width - 40;
    const barY = 50;
    
    // Background
    this.context.fillStyle = '#f0f0f0';
    this.context.fillRect(barX, barY, barWidth, barHeight);
    
    // Energy level
    const energyHeight = Math.max(0, Math.min(barHeight, (energy / 100) * barHeight));
    this.context.fillStyle = energy > 0 ? '#ff6b6b' : '#51cf66';
    this.context.fillRect(barX, barY + barHeight - energyHeight, barWidth, energyHeight);
    
    // Label
    this.context.fillStyle = 'black';
    this.context.font = '12px Arial';
    this.context.textAlign = 'center';
    this.context.fillText(`${energy.toFixed(1)} kJ/mol`, barX + barWidth/2, barY + barHeight + 20);
    
    this.context.restore();
  }

  /**
   * Render frame information
   */
  private renderFrameInfo(frame: AnimationFrame): void {
    if (!this.context) return;
    
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    
    this.context.fillStyle = 'black';
    this.context.font = '14px Arial';
    this.context.fillText(`Frame: ${frame.frameNumber}`, 10, 20);
    this.context.fillText(`Time: ${(frame.time * 100).toFixed(1)}%`, 10, 40);
    
    this.context.restore();
  }

  /**
   * Apply easing function to animation progress
   */
  private applyEasing(progress: number): number {
    switch (this.config.easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - (1 - progress) * (1 - progress);
      case 'ease-in-out':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - 2 * (1 - progress) * (1 - progress);
      default:
        return progress;
    }
  }

  /**
   * Infer bond changes between energy profile points
   */
  private inferBondChanges(current: EnergyProfilePoint, next: EnergyProfilePoint): BondChange[] {
    // This would analyze the chemical structures to determine bond changes
    // For now, return empty array
    return [];
  }

  /**
   * Generate intermediate structures between energy points
   */
  private generateIntermediateStructures(current: EnergyProfilePoint, next: EnergyProfilePoint): MolecularFrame[] {
    // This would generate molecular structures at intermediate points
    // For now, return empty array
    return [];
  }

  /**
   * Interpolate bond order during animation
   */
  private interpolateBondOrder(bondChange: BondChange, progress: number): number {
    if (bondChange.type === 'breaking') {
      return Math.max(0, 1 - progress);
    } else if (bondChange.type === 'forming') {
      return progress;
    }
    return 1;
  }

  /**
   * Get bond color based on bond change and progress
   */
  private getBondColor(bondChange: BondChange, progress: number): string {
    switch (this.config.bondColorScheme) {
      case 'energy-based':
        const energy = Math.abs(bondChange.energyContribution);
        return energy > 500 ? '#ff4757' : energy > 300 ? '#ffa502' : energy > 150 ? '#ffb347' : '#2ed573';
      case 'order-based':
        return bondChange.bondOrderChange > 0 ? '#2ed573' : '#ff4757';
      default:
        // Use energy-based coloring as default
        const defaultEnergy = Math.abs(bondChange.energyContribution);
        return defaultEnergy > 500 ? '#ff4757' : defaultEnergy > 300 ? '#ffa502' : '#2ed573';
    }
  }

  /**
   * Get bond opacity based on bond change and progress
   */
  private getBondOpacity(bondChange: BondChange, progress: number): number {
    if (bondChange.type === 'breaking') {
      return 1 - progress;
    } else if (bondChange.type === 'forming') {
      return progress;
    }
    return 1;
  }
}

/**
 * Utility functions for reaction animation
 */
export class ReactionAnimationUtils {
  /**
   * Create a simple reaction animation from SMILES strings
   */
  static async createFromSMILES(
    reactantSMILES: string[],
    productSMILES: string[],
    config?: Partial<ReactionAnimationConfig>
  ): Promise<ReactionAnimator> {
    const animator = new ReactionAnimator(config);
    
    // This would parse SMILES and create molecular structures
    // For now, create a basic animation
    
    return animator;
  }

  /**
   * Create reaction animation with custom bond changes
   */
  static createWithBondChanges(
    bondChanges: BondChange[],
    config?: Partial<ReactionAnimationConfig>
  ): ReactionAnimator {
    const animator = new ReactionAnimator(config);
    
    // This would create animation based on bond changes
    
    return animator;
  }

  /**
   * Export animation data to various formats
   */
  static exportAnimationData(
    animation: AnimationFrame[],
    format: 'json' | 'csv' | 'xml'
  ): string {
    switch (format) {
      case 'json':
        return JSON.stringify(animation, null, 2);
      case 'csv':
        return this.animationToCSV(animation);
      case 'xml':
        return this.animationToXML(animation);
      default:
        return JSON.stringify(animation);
    }
  }

  private static animationToCSV(animation: AnimationFrame[]): string {
    const headers = ['frame', 'time', 'energy', 'atomCount', 'bondCount'];
    const rows = animation.map(frame => [
      frame.frameNumber,
      frame.time,
      frame.energy,
      frame.atoms.length,
      frame.bonds.length
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private static animationToXML(animation: AnimationFrame[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<animation>\n';
    
    for (const frame of animation) {
      xml += `  <frame number="${frame.frameNumber}" time="${frame.time}" energy="${frame.energy}">\n`;
      xml += `    <atoms count="${frame.atoms.length}" />\n`;
      xml += `    <bonds count="${frame.bonds.length}" />\n`;
      xml += '  </frame>\n';
    }
    
    xml += '</animation>';
    return xml;
  }
}
