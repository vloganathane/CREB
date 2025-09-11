/**
 * CREB Phase 2: Animated Reaction Transition Engine
 * 
 * This module provides smooth, physics-based animations between
 * reactant and product molecular states using GSAP and Three.js.
 */

import { gsap } from 'gsap';
import * as THREE from 'three';
import { ReactionClassifier } from '../ai/ReactionClassifier';
import { MolecularPhysicsEngine } from '../physics/MolecularPhysicsEngine';
import { IntelligentCacheManager } from '../caching/IntelligentCacheManager';

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

export class ReactionAnimationEngine {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private timeline!: gsap.core.Timeline;
  private config: AnimationConfig;
  
  // Phase 3: AI and Physics Integration
  private aiClassifier: ReactionClassifier;
  private physicsEngine: MolecularPhysicsEngine;
  private cacheManager: IntelligentCacheManager;
  
  // Animation state
  private isPlaying: boolean = false;
  private currentFrame: number = 0;
  private totalFrames: number = 0;
  private animationData: AnimationFrame[] = [];
  
  // Visual elements
  private atomMeshes: Map<string, THREE.Mesh> = new Map();
  private bondMeshes: Map<string, THREE.Mesh> = new Map();
  private energyProfileMesh: THREE.Line | null = null;
  private particleSystem: THREE.Points | null = null;
  
  // Event callbacks
  private onProgress?: (progress: number) => void;
  private onComplete?: () => void;
  private onFrameUpdate?: (frame: AnimationFrame) => void;

  constructor(container: HTMLElement, config: Partial<AnimationConfig> = {}) {
    this.config = {
      duration: 3.0,
      easing: 'power2.inOut',
      showEnergyProfile: true,
      showBondTransitions: true,
      particleEffects: true,
      audioEnabled: false,
      ...config
    };

    // Initialize Phase 3 systems
    this.aiClassifier = new ReactionClassifier();
    this.physicsEngine = new MolecularPhysicsEngine();
    this.cacheManager = new IntelligentCacheManager();

    this.initializeThreeJS(container);
    this.initializeGSAP();
  }

  private initializeThreeJS(container: HTMLElement): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    // Renderer setup with optimization
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Lighting setup
    this.setupLighting();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private setupLighting(): void {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point lights for dynamic effects
    const pointLight1 = new THREE.PointLight(0x4080ff, 0.5, 20);
    pointLight1.position.set(-10, 0, 0);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff4080, 0.5, 20);
    pointLight2.position.set(10, 0, 0);
    this.scene.add(pointLight2);
  }

  private initializeGSAP(): void {
    gsap.registerPlugin();
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => this.onTimelineUpdate(),
      onComplete: () => this.onAnimationComplete()
    });
  }

  /**
   * Phase 3: AI-Enhanced Animation Creation
   * Uses machine learning to optimize animation parameters
   */
  async createAIEnhancedAnimation(
    reactants: MolecularData[],
    products: MolecularData[],
    reactionEquation: string
  ): Promise<void> {
    try {
      // Step 1: Use AI to classify reaction type and predict optimal parameters
      const reactionType = await this.aiClassifier.classifyReaction(reactionEquation);
      const optimizedParams = await this.aiClassifier.optimizeAnimationParameters(
        reactionType,
        reactants,
        products
      );

      // Step 2: Check intelligent cache for similar animations
      const cacheKey = `animation:${reactionEquation}:${JSON.stringify(optimizedParams)}`;
      const cachedAnimation = await this.cacheManager.get(cacheKey);
      
      if (cachedAnimation && Array.isArray(cachedAnimation)) {
        this.animationData = cachedAnimation as AnimationFrame[];
        this.totalFrames = cachedAnimation.length;
        return;
      }

      // Step 3: Use physics engine for realistic molecular dynamics
      const physicsConfig = {
        enableCollision: reactionType.characteristics.hasEnergyRelease || reactionType.characteristics.hasGasProduction,
        temperature: optimizedParams.temperature || 298,
        pressure: optimizedParams.pressure || 1,
        solvent: optimizedParams.solvent || 'vacuum'
      };

      this.physicsEngine.configure(physicsConfig);

      // Step 4: Generate physics-based animation frames
      const transitions = this.generateMolecularTransitions(reactants, products, reactionType);
      const animationFrames = await this.physicsEngine.simulateReactionPathway(
        transitions,
        optimizedParams.duration || this.config.duration
      );

      // Step 5: Cache the generated animation
      await this.cacheManager.set(cacheKey, animationFrames);

      this.animationData = animationFrames;
      this.totalFrames = animationFrames.length;

    } catch (error) {
      console.error('AI-enhanced animation creation failed:', error);
      // Fallback to traditional animation
      await this.createReactionAnimation(reactants, products);
    }
  }

  /**
   * Generate molecular transitions based on AI classification
   */
  private generateMolecularTransitions(
    reactants: MolecularData[],
    products: MolecularData[],
    reactionType: any
  ): MolecularTransition[] {
    const transitions: MolecularTransition[] = [];

    // Generate transitions based on reaction mechanism
    switch (reactionType.mechanism) {
      case 'substitution':
        transitions.push(...this.generateSubstitutionTransitions(reactants, products));
        break;
      case 'addition':
        transitions.push(...this.generateAdditionTransitions(reactants, products));
        break;
      case 'elimination':
        transitions.push(...this.generateEliminationTransitions(reactants, products));
        break;
      default:
        transitions.push(...this.generateGenericTransitions(reactants, products));
    }

    return transitions;
  }

  /**
   * Create animated transition from reactants to products
   */
  async createReactionAnimation(
    reactants: MolecularData[],
    products: MolecularData[]
  ): Promise<void> {
    try {
      console.log('🎬 Creating reaction animation...');
      
      // Clear previous animation
      this.clearScene();
      this.timeline.clear();
      
      // Generate transition data
      const transitions = await this.calculateMolecularTransitions(reactants, products);
      
      // Create animation frames
      this.animationData = await this.generateAnimationFrames(transitions);
      this.totalFrames = this.animationData.length;
      
      // Build 3D molecular geometries
      await this.buildMolecularGeometries(reactants, products);
      
      // Create GSAP animation timeline
      this.createAnimationTimeline(transitions);
      
      // Setup energy profile if enabled
      if (this.config.showEnergyProfile) {
        this.createEnergyProfileVisualization(transitions);
      }
      
      // Setup particle effects if enabled
      if (this.config.particleEffects) {
        this.createParticleEffects();
      }
      
      console.log('✅ Animation ready! Frames:', this.totalFrames);
      
    } catch (error) {
      console.error('❌ Animation creation failed:', error);
      throw new Error(`Animation creation failed: ${error.message}`);
    }
  }

  /**
   * Calculate molecular transitions between reactants and products
   */
  private async calculateMolecularTransitions(
    reactants: MolecularData[],
    products: MolecularData[]
  ): Promise<MolecularTransition[]> {
    const transitions: MolecularTransition[] = [];
    
    // For each product, find corresponding reactant transformations
    for (let i = 0; i < Math.max(reactants.length, products.length); i++) {
      const reactant = reactants[i] || reactants[0]; // Use first reactant as fallback
      const product = products[i] || products[0]; // Use first product as fallback
      
      const transition: MolecularTransition = {
        startStructure: reactant,
        endStructure: product,
        transitionType: this.determineTransitionType(reactant, product),
        energyBarrier: this.calculateEnergyBarrier(reactant, product),
        transitionState: await this.generateTransitionState(reactant, product)
      };
      
      transitions.push(transition);
    }
    
    return transitions;
  }

  private determineTransitionType(
    reactant: MolecularData,
    product: MolecularData
  ): 'formation' | 'breaking' | 'rearrangement' {
    // Simple heuristic based on atom count changes
    const reactantAtomCount = reactant.atoms?.length || 0;
    const productAtomCount = product.atoms?.length || 0;
    
    if (reactantAtomCount < productAtomCount) {
      return 'formation';
    } else if (reactantAtomCount > productAtomCount) {
      return 'breaking';
    } else {
      return 'rearrangement';
    }
  }

  private calculateEnergyBarrier(
    reactant: MolecularData,
    product: MolecularData
  ): number {
    // Simplified energy barrier calculation
    // In practice, this would use quantum chemistry calculations
    const baseBarrier = 50; // kJ/mol
    const complexityFactor = (reactant.atoms?.length || 1) * 2;
    return baseBarrier + Math.random() * complexityFactor;
  }

  private async generateTransitionState(
    reactant: MolecularData,
    product: MolecularData
  ): Promise<MolecularData | undefined> {
    // Generate intermediate structure between reactant and product
    // This is a simplified interpolation - real implementation would use
    // advanced computational chemistry methods
    
    if (!reactant.atoms || !product.atoms) {
      return undefined;
    }

    const transitionState: MolecularData = {
      ...reactant,
      atoms: reactant.atoms.map((atom, i) => ({
        ...atom,
        position: {
          x: (atom.position.x + (product.atoms[i]?.position.x || atom.position.x)) / 2,
          y: (atom.position.y + (product.atoms[i]?.position.y || atom.position.y)) / 2,
          z: (atom.position.z + (product.atoms[i]?.position.z || atom.position.z)) / 2
        }
      }))
    };

    return transitionState;
  }

  /**
   * Generate frame-by-frame animation data
   */
  private async generateAnimationFrames(
    transitions: MolecularTransition[]
  ): Promise<AnimationFrame[]> {
    const frames: AnimationFrame[] = [];
    const frameRate = 60; // 60 FPS
    const totalDuration = this.config.duration * 1000; // Convert to ms
    const frameCount = Math.floor((totalDuration / 1000) * frameRate);
    
    for (let frame = 0; frame <= frameCount; frame++) {
      const progress = frame / frameCount;
      const timestamp = (frame / frameRate) * 1000;
      
      // Create molecular state for this frame
      const molecularStates = transitions.map(transition => 
        this.interpolateMolecularState(transition, progress)
      );
      
      // Calculate energy level for this frame
      const energyLevel = this.calculateFrameEnergy(transitions, progress);
      
      // Determine bond changes at this frame
      const bondChanges = this.calculateBondChanges(transitions, progress);
      
      // Calculate atom movements
      const atomMovements = this.calculateAtomMovements(transitions, progress);
      
      frames.push({
        timestamp,
        molecularStates,
        energyLevel,
        bondChanges,
        atomMovements
      });
    }
    
    return frames;
  }

  private interpolateMolecularState(
    transition: MolecularTransition,
    progress: number
  ): MolecularState {
    const start = transition.startStructure;
    const end = transition.endStructure;
    
    // Use easing function for natural motion
    const easedProgress = gsap.parseEase(this.config.easing)(progress);
    
    // Interpolate atom positions
    const atoms: AtomState[] = start.atoms?.map((startAtom, i) => {
      const endAtom = end.atoms?.[i] || startAtom;
      
      return {
        id: startAtom.id || `atom_${i}`,
        element: startAtom.element,
        position: new THREE.Vector3(
          THREE.MathUtils.lerp(startAtom.position.x, endAtom.position.x, easedProgress),
          THREE.MathUtils.lerp(startAtom.position.y, endAtom.position.y, easedProgress),
          THREE.MathUtils.lerp(startAtom.position.z, endAtom.position.z, easedProgress)
        ),
        charge: THREE.MathUtils.lerp(startAtom.charge || 0, endAtom.charge || 0, easedProgress),
        hybridization: startAtom.hybridization || 'sp3',
        color: this.getAtomColor(startAtom.element),
        radius: this.getAtomRadius(startAtom.element)
      };
    }) || [];
    
    // Interpolate bond states
    const bonds: BondState[] = start.bonds?.map((startBond, i) => {
      const endBond = end.bonds?.[i] || startBond;
      
      return {
        id: startBond.id || `bond_${i}`,
        atom1: startBond.atom1,
        atom2: startBond.atom2,
        order: THREE.MathUtils.lerp(startBond.order, endBond.order, easedProgress),
        length: THREE.MathUtils.lerp(startBond.length || 1.5, endBond.length || 1.5, easedProgress),
        strength: THREE.MathUtils.lerp(startBond.strength || 1, endBond.strength || 1, easedProgress),
        color: this.getBondColor(startBond.order)
      };
    }) || [];
    
    return {
      atoms,
      bonds,
      overallCharge: start.charge || 0,
      spinMultiplicity: start.spinMultiplicity || 1
    };
  }

  private calculateFrameEnergy(
    transitions: MolecularTransition[],
    progress: number
  ): number {
    // Calculate energy using a reaction coordinate model
    // Energy increases to barrier height, then decreases to product energy
    
    const maxBarrier = Math.max(...transitions.map(t => t.energyBarrier));
    const barrierPosition = 0.5; // Transition state at 50% progress
    
    if (progress <= barrierPosition) {
      // Rising to transition state
      const localProgress = progress / barrierPosition;
      return maxBarrier * localProgress * localProgress; // Quadratic rise
    } else {
      // Falling to products
      const localProgress = (progress - barrierPosition) / (1 - barrierPosition);
      return maxBarrier * (1 - localProgress * localProgress); // Quadratic fall
    }
  }

  private calculateBondChanges(
    transitions: MolecularTransition[],
    progress: number
  ): BondChange[] {
    const changes: BondChange[] = [];
    
    transitions.forEach(transition => {
      const startBonds = transition.startStructure.bonds || [];
      const endBonds = transition.endStructure.bonds || [];
      
      // Find bonds that change during reaction
      startBonds.forEach((startBond, i) => {
        const endBond = endBonds[i];
        if (endBond && startBond.order !== endBond.order) {
          changes.push({
            type: startBond.order > endBond.order ? 'breaking' : 'formation',
            bondId: startBond.id || `bond_${i}`,
            startOrder: startBond.order,
            endOrder: endBond.order,
            timeline: [0, progress, 1] // Simple timeline
          });
        }
      });
    });
    
    return changes;
  }

  private calculateAtomMovements(
    transitions: MolecularTransition[],
    progress: number
  ): AtomMovement[] {
    const movements: AtomMovement[] = [];
    
    transitions.forEach(transition => {
      const startAtoms = transition.startStructure.atoms || [];
      const endAtoms = transition.endStructure.atoms || [];
      
      startAtoms.forEach((startAtom, i) => {
        const endAtom = endAtoms[i];
        if (endAtom) {
          const startPos = new THREE.Vector3(startAtom.position.x, startAtom.position.y, startAtom.position.z);
          const endPos = new THREE.Vector3(endAtom.position.x, endAtom.position.y, endAtom.position.z);
          const distance = startPos.distanceTo(endPos);
          
          if (distance > 0.1) { // Only track significant movements
            movements.push({
              atomId: startAtom.id || `atom_${i}`,
              startPosition: startPos,
              endPosition: endPos,
              trajectory: this.generateAtomTrajectory(startPos, endPos, transition.transitionState),
              speed: distance / this.config.duration
            });
          }
        }
      });
    });
    
    return movements;
  }

  private generateAtomTrajectory(
    start: THREE.Vector3,
    end: THREE.Vector3,
    transitionState?: MolecularData
  ): THREE.Vector3[] {
    const trajectory: THREE.Vector3[] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      
      // Use quadratic Bezier curve through transition state if available
      if (transitionState?.atoms?.[0]) {
        const control = new THREE.Vector3(
          transitionState.atoms[0].position.x,
          transitionState.atoms[0].position.y,
          transitionState.atoms[0].position.z
        );
        
        const point = new THREE.Vector3();
        point.copy(start).multiplyScalar((1 - t) * (1 - t));
        point.addScaledVector(control, 2 * (1 - t) * t);
        point.addScaledVector(end, t * t);
        
        trajectory.push(point);
      } else {
        // Simple linear interpolation
        const point = new THREE.Vector3();
        point.lerpVectors(start, end, t);
        trajectory.push(point);
      }
    }
    
    return trajectory;
  }

  /**
   * Build 3D molecular geometries for rendering
   */
  private async buildMolecularGeometries(
    reactants: MolecularData[],
    products: MolecularData[]
  ): Promise<void> {
    // Clear existing geometries
    this.atomMeshes.clear();
    this.bondMeshes.clear();
    
    // Create atom geometries
    const allMolecules = [...reactants, ...products];
    
    for (const molecule of allMolecules) {
      if (molecule.atoms) {
        for (const atom of molecule.atoms) {
          await this.createAtomMesh(atom);
        }
      }
      
      if (molecule.bonds) {
        for (const bond of molecule.bonds) {
          await this.createBondMesh(bond, molecule.atoms || []);
        }
      }
    }
  }

  private async createAtomMesh(atom: any): Promise<void> {
    const geometry = new THREE.SphereGeometry(this.getAtomRadius(atom.element), 16, 12);
    const material = new THREE.MeshLambertMaterial({
      color: this.getAtomColor(atom.element),
      transparent: true,
      opacity: 0.9
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(atom.position.x, atom.position.y, atom.position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const atomId = atom.id || `atom_${atom.element}_${Date.now()}`;
    this.atomMeshes.set(atomId, mesh);
    this.scene.add(mesh);
  }

  private async createBondMesh(bond: any, atoms: any[]): Promise<void> {
    const atom1 = atoms.find(a => a.id === bond.atom1 || a.element === bond.atom1);
    const atom2 = atoms.find(a => a.id === bond.atom2 || a.element === bond.atom2);
    
    if (!atom1 || !atom2) return;
    
    const start = new THREE.Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
    const end = new THREE.Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
    const distance = start.distanceTo(end);
    
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, distance, 8);
    const material = new THREE.MeshLambertMaterial({
      color: this.getBondColor(bond.order),
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position and orient the bond
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mesh.position.copy(midpoint);
    mesh.lookAt(end);
    mesh.rotateX(Math.PI / 2);
    
    const bondId = bond.id || `bond_${Date.now()}`;
    this.bondMeshes.set(bondId, mesh);
    this.scene.add(mesh);
  }

  /**
   * Create GSAP animation timeline
   */
  private createAnimationTimeline(transitions: MolecularTransition[]): void {
    this.timeline.clear();
    
    // Animate each molecular transition
    transitions.forEach((transition, index) => {
      this.animateMolecularTransition(transition, index);
    });
    
    // Set total duration
    this.timeline.duration(this.config.duration);
  }

  private animateMolecularTransition(transition: MolecularTransition, index: number): void {
    const startTime = index * 0.1; // Stagger animations slightly
    
    // Animate atom positions
    transition.startStructure.atoms?.forEach((startAtom, atomIndex) => {
      const endAtom = transition.endStructure.atoms?.[atomIndex];
      if (!endAtom) return;
      
      const atomId = startAtom.id || `atom_${atomIndex}`;
      const mesh = this.atomMeshes.get(atomId);
      if (!mesh) return;
      
      this.timeline.to(mesh.position, {
        duration: this.config.duration * 0.8,
        x: endAtom.position.x,
        y: endAtom.position.y,
        z: endAtom.position.z,
        ease: this.config.easing
      }, startTime);
      
      // Animate atom scaling based on charge changes
      if (startAtom.charge !== endAtom.charge) {
        const scaleChange = 1 + (endAtom.charge - startAtom.charge) * 0.1;
        this.timeline.to(mesh.scale, {
          duration: this.config.duration * 0.5,
          x: scaleChange,
          y: scaleChange,
          z: scaleChange,
          ease: 'elastic.out(1, 0.3)'
        }, startTime + this.config.duration * 0.25);
      }
    });
    
    // Animate bond changes
    if (this.config.showBondTransitions) {
      this.animateBondTransitions(transition, startTime);
    }
  }

  private animateBondTransitions(transition: MolecularTransition, startTime: number): void {
    transition.startStructure.bonds?.forEach((startBond, bondIndex) => {
      const endBond = transition.endStructure.bonds?.[bondIndex];
      if (!endBond) return;
      
      const bondId = startBond.id || `bond_${bondIndex}`;
      const mesh = this.bondMeshes.get(bondId);
      if (!mesh) return;
      
      // Animate bond order changes through scaling
      if (startBond.order !== endBond.order) {
        const scaleChange = endBond.order / startBond.order;
        
        if (endBond.order > startBond.order) {
          // Bond formation - grow effect
          this.timeline.from(mesh.scale, {
            duration: this.config.duration * 0.3,
            x: 0.1,
            y: scaleChange,
            z: 0.1,
            ease: 'back.out(1.7)'
          }, startTime + this.config.duration * 0.3);
        } else {
          // Bond breaking - shrink effect
          this.timeline.to(mesh.scale, {
            duration: this.config.duration * 0.3,
            x: 0.1,
            y: scaleChange,
            z: 0.1,
            ease: 'power2.in'
          }, startTime + this.config.duration * 0.5);
        }
      }
    });
  }

  /**
   * Create energy profile visualization
   */
  private createEnergyProfileVisualization(transitions: MolecularTransition[]): void {
    const points: THREE.Vector3[] = [];
    const maxBarrier = Math.max(...transitions.map(t => t.energyBarrier));
    const steps = 100;
    
    // Generate energy curve points
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const energy = this.calculateFrameEnergy(transitions, progress);
      
      // Position curve in 3D space
      const x = (progress - 0.5) * 15; // Spread along x-axis
      const y = (energy / maxBarrier) * 5 - 7; // Scale and position energy
      const z = 8; // Position behind molecules
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // Create line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 3,
      transparent: true,
      opacity: 0.7
    });
    
    this.energyProfileMesh = new THREE.Line(geometry, material);
    this.scene.add(this.energyProfileMesh);
  }

  /**
   * Create particle effects for bond breaking/formation
   */
  private createParticleEffects(): void {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Initialize particle positions
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
    
    // Animate particles
    this.timeline.to(this.particleSystem.rotation, {
      duration: this.config.duration,
      x: Math.PI * 2,
      y: Math.PI,
      ease: 'none'
    }, 0);
  }

  /**
   * Animation control methods
   */
  play(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.timeline.play();
      this.startRenderLoop();
    }
  }

  pause(): void {
    this.isPlaying = false;
    this.timeline.pause();
  }

  reset(): void {
    this.isPlaying = false;
    this.currentFrame = 0;
    this.timeline.progress(0);
    this.timeline.pause();
  }

  setProgress(progress: number): void {
    this.timeline.progress(Math.max(0, Math.min(1, progress)));
    this.currentFrame = Math.floor(progress * this.totalFrames);
  }

  /**
   * Event handling
   */
  onProgressUpdate(callback: (progress: number) => void): void {
    this.onProgress = callback;
  }

  onAnimationComplete(callback: () => void): void {
    this.onComplete = callback;
  }

  onFrameChange(callback: (frame: AnimationFrame) => void): void {
    this.onFrameUpdate = callback;
  }

  /**
   * Utility methods
   */
  private getAtomColor(element: string): number {
    const colors: Record<string, number> = {
      'H': 0xffffff,  // White
      'C': 0x909090,  // Gray
      'N': 0x3050f8,  // Blue
      'O': 0xff0d0d,  // Red
      'F': 0x90e050,  // Green
      'Cl': 0x1ff01f, // Bright green
      'Br': 0xa62929, // Brown
      'I': 0x940094,  // Purple
      'S': 0xffff30,  // Yellow
      'P': 0xff8000,  // Orange
    };
    return colors[element] || 0xffc0cb; // Default pink
  }

  private getAtomRadius(element: string): number {
    const radii: Record<string, number> = {
      'H': 0.31,
      'C': 0.76,
      'N': 0.71,
      'O': 0.66,
      'F': 0.57,
      'Cl': 1.02,
      'Br': 1.20,
      'I': 1.39,
      'S': 1.05,
      'P': 1.07,
    };
    return (radii[element] || 1.0) * 0.3; // Scale down for visualization
  }

  private getBondColor(order: number): number {
    if (order >= 3) return 0xff4444; // Triple bond - red
    if (order >= 2) return 0x4444ff; // Double bond - blue
    return 0x888888; // Single bond - gray
  }

  private onTimelineUpdate(): void {
    const progress = this.timeline.progress();
    const frameIndex = Math.floor(progress * this.totalFrames);
    
    if (frameIndex !== this.currentFrame && this.animationData[frameIndex]) {
      this.currentFrame = frameIndex;
      
      if (this.onProgress) {
        this.onProgress(progress);
      }
      
      if (this.onFrameUpdate) {
        this.onFrameUpdate(this.animationData[frameIndex]);
      }
    }
  }

  private onAnimationComplete(): void {
    this.isPlaying = false;
    
    if (this.onComplete) {
      this.onComplete();
    }
  }

  private startRenderLoop(): void {
    const animate = () => {
      if (this.isPlaying) {
        requestAnimationFrame(animate);
      }
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private onWindowResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private clearScene(): void {
    // Remove all meshes
    this.atomMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    
    this.bondMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    
    if (this.energyProfileMesh) {
      this.scene.remove(this.energyProfileMesh);
      this.energyProfileMesh.geometry.dispose();
      (this.energyProfileMesh.material as THREE.Material).dispose();
    }
    
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      (this.particleSystem.material as THREE.Material).dispose();
    }
    
    this.atomMeshes.clear();
    this.bondMeshes.clear();
  }

  /**
   * Generate substitution reaction transitions
   */
  private generateSubstitutionTransitions(
    reactants: MolecularData[],
    products: MolecularData[]
  ): MolecularTransition[] {
    const transitions: MolecularTransition[] = [];
    
    for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
      transitions.push({
        startStructure: reactants[i],
        endStructure: products[i],
        transitionType: 'rearrangement',
        energyBarrier: 25.0, // kcal/mol typical for substitution
      });
    }
    
    return transitions;
  }

  /**
   * Generate addition reaction transitions
   */
  private generateAdditionTransitions(
    reactants: MolecularData[],
    products: MolecularData[]
  ): MolecularTransition[] {
    const transitions: MolecularTransition[] = [];
    
    for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
      transitions.push({
        startStructure: reactants[i],
        endStructure: products[i],
        transitionType: 'formation',
        energyBarrier: 15.0, // kcal/mol typical for addition
      });
    }
    
    return transitions;
  }

  /**
   * Generate elimination reaction transitions
   */
  private generateEliminationTransitions(
    reactants: MolecularData[],
    products: MolecularData[]
  ): MolecularTransition[] {
    const transitions: MolecularTransition[] = [];
    
    for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
      transitions.push({
        startStructure: reactants[i],
        endStructure: products[i],
        transitionType: 'breaking',
        energyBarrier: 30.0, // kcal/mol typical for elimination
      });
    }
    
    return transitions;
  }

  /**
   * Generate generic reaction transitions
   */
  private generateGenericTransitions(
    reactants: MolecularData[],
    products: MolecularData[]
  ): MolecularTransition[] {
    const transitions: MolecularTransition[] = [];
    
    for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
      transitions.push({
        startStructure: reactants[i],
        endStructure: products[i],
        transitionType: 'rearrangement',
        energyBarrier: 20.0, // kcal/mol generic barrier
      });
    }
    
    return transitions;
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.clearScene();
    this.timeline.kill();
    this.renderer.dispose();
  }
}

// Type definitions for external molecular data
interface MolecularData {
  atoms?: Array<{
    id?: string;
    element: string;
    position: { x: number; y: number; z: number };
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
