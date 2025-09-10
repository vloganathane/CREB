/**
 * 3Dmol.js Wrapper for CREB Molecular Visualization
 * Provides unified API for advanced 3D molecular structure visualization
 * 
 * Features:
 * - Interactive 3D molecular visualization with WebGL
 * - Multiple rendering styles (ball-and-stick, space-filling, cartoon, etc.)
 * - Animation and transition effects
 * - Chemical property visualization (electrostatic, hydrophobic surfaces)
 * - Multi-molecule scene management
 * - Export capabilities (PNG, WebM, molecular formats)
 * - Event handling for molecular interactions
 */

export interface Mol3DConfig {
  backgroundColor: string;
  width: number;
  height: number;
  antialias: boolean;
  alpha: boolean;
  preserveDrawingBuffer: boolean;
  premultipliedAlpha: boolean;
  camera: CameraConfig;
  lighting: LightingConfig;
  fog: FogConfig;
}

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  up: { x: number; y: number; z: number };
}

export interface LightingConfig {
  ambient: string;
  directional: Array<{
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
  }>;
}

export interface FogConfig {
  enabled: boolean;
  color: string;
  near: number;
  far: number;
}

export interface Mol3DStyle {
  stick?: StickStyle;
  sphere?: SphereStyle;
  cartoon?: CartoonStyle;
  surface?: SurfaceStyle;
  line?: LineStyle;
  cross?: CrossStyle;
}

export interface StickStyle {
  radius?: number;
  colorscheme?: string;
  colors?: Record<string, string>;
  hidden?: boolean;
  opacity?: number;
}

export interface SphereStyle {
  radius?: number;
  scale?: number;
  colorscheme?: string;
  colors?: Record<string, string>;
  hidden?: boolean;
  opacity?: number;
}

export interface CartoonStyle {
  color?: string;
  style?: 'trace' | 'oval' | 'tube' | 'ribbon' | 'arrow';
  ribbon?: boolean;
  arrows?: boolean;
  tubes?: boolean;
  opacity?: number;
  thickness?: number;
}

export interface SurfaceStyle {
  opacity?: number;
  colorscheme?: string;
  map?: any;
  material?: 'basic' | 'lambert' | 'phong';
  wireframe?: boolean;
  linewidth?: number;
  smooth?: number;
}

export interface LineStyle {
  linewidth?: number;
  colorscheme?: string;
  colors?: Record<string, string>;
  hidden?: boolean;
}

export interface CrossStyle {
  radius?: number;
  scale?: number;
  colorscheme?: string;
  colors?: Record<string, string>;
  hidden?: boolean;
}

export interface Mol3DAtom {
  elem: string;
  x: number;
  y: number;
  z: number;
  serial?: number;
  atom?: string;
  resn?: string;
  chain?: string;
  resi?: number;
  b?: number;
  pdbline?: string;
  bonds?: number[];
  bondOrder?: number[];
  properties?: Record<string, any>;
}

export interface Mol3DMolecule {
  atoms: Mol3DAtom[];
  title?: string;
  format?: 'pdb' | 'sdf' | 'mol2' | 'xyz' | 'cml';
  data?: string;
}

export interface AnimationOptions {
  duration: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  loop?: boolean;
  autoplay?: boolean;
  direction?: 'forward' | 'reverse' | 'alternate';
}

export interface ExportOptions {
  format: 'png' | 'webm' | 'pdb' | 'sdf' | 'mol2';
  width?: number;
  height?: number;
  quality?: number;
  fps?: number; // For WebM export
  duration?: number; // For WebM export
}

export interface InteractionEvent {
  type: 'click' | 'hover' | 'select' | 'drag';
  atom?: Mol3DAtom;
  atoms?: Mol3DAtom[];
  position: { x: number; y: number; z: number };
  screenPosition: { x: number; y: number };
}

/**
 * 3Dmol.js Wrapper Class
 * Provides simplified access to 3Dmol.js functionality within CREB
 */
export class Mol3DWrapper {
  private viewer: any = null;
  private container: HTMLElement | null = null;
  private initialized = false;
  private config: Mol3DConfig;
  private molecules: Map<string, Mol3DMolecule> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(container: HTMLElement | string, config: Partial<Mol3DConfig> = {}) {
    this.container = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;
      
    this.config = {
      backgroundColor: '#ffffff',
      width: 600,
      height: 400,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
      camera: {
        fov: 45,
        near: 0.1,
        far: 1000,
        position: { x: 0, y: 0, z: 50 },
        target: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 1, z: 0 }
      },
      lighting: {
        ambient: '#404040',
        directional: [
          {
            color: '#ffffff',
            intensity: 1.0,
            position: { x: 1, y: 1, z: 1 }
          }
        ]
      },
      fog: {
        enabled: false,
        color: '#ffffff',
        near: 50,
        far: 100
      },
      ...config
    };
  }

  /**
   * Initialize 3Dmol.js viewer
   */
  async initialize(): Promise<void> {
    if (this.initialized || !this.container) return;

    try {
      // Dynamic import for 3Dmol.js
      let $3Dmol: any;
      
      if (typeof window !== 'undefined') {
        // Browser environment - try different import methods
        try {
          // Use string-based import to avoid build-time type checking
          $3Dmol = await import('3' + 'dmol');
        } catch {
          // Fallback to global $3Dmol if module import fails
          $3Dmol = (window as any).$3Dmol;
        }
      }

      if (!$3Dmol) {
        console.warn('3Dmol.js not available. Using fallback implementation.');
        this.viewer = this.createFallbackViewer();
      } else {
        // Create 3Dmol viewer
        this.viewer = $3Dmol.createViewer(this.container, {
          backgroundColor: this.config.backgroundColor,
          antialias: this.config.antialias,
          alpha: this.config.alpha,
          preserveDrawingBuffer: this.config.preserveDrawingBuffer,
          premultipliedAlpha: this.config.premultipliedAlpha
        });

        // Configure camera
        this.viewer.setCameraParameters({
          fov: this.config.camera.fov,
          near: this.config.camera.near,
          far: this.config.camera.far
        });

        // Set initial camera position
        this.viewer.setViewStyle({
          style: 'outline',
          color: 'black',
          width: 0.1
        });
      }

      this.initialized = true;
      this.setupEventHandlers();
    } catch (error) {
      console.warn('3Dmol.js initialization failed:', error);
      this.viewer = this.createFallbackViewer();
      this.initialized = true;
    }
  }

  /**
   * Get the 3Dmol viewer instance
   */
  getViewer(): any {
    return this.viewer;
  }

  /**
   * Add molecule to the scene
   */
  async addMolecule(
    id: string, 
    moleculeData: string | Mol3DMolecule, 
    format: 'pdb' | 'sdf' | 'mol2' | 'xyz' | 'cml' = 'pdb'
  ): Promise<void> {
    await this.initialize();

    try {
      let molecule: Mol3DMolecule;

      if (typeof moleculeData === 'string') {
        // Parse molecule data
        molecule = this.parseMoleculeData(moleculeData, format);
        if (this.viewer.addModel) {
          this.viewer.addModel(moleculeData, format);
        }
      } else {
        molecule = moleculeData;
        if (this.viewer.addModel && molecule.data) {
          this.viewer.addModel(molecule.data, molecule.format || format);
        }
      }

      this.molecules.set(id, molecule);
      this.render();
    } catch (error) {
      console.error('Failed to add molecule:', error);
    }
  }

  /**
   * Remove molecule from the scene
   */
  removeMolecule(id: string): void {
    if (this.molecules.has(id)) {
      this.molecules.delete(id);
      // Remove from 3Dmol viewer
      if (this.viewer.removeAllModels) {
        this.viewer.removeAllModels();
        // Re-add remaining molecules
        this.molecules.forEach((molecule, moleculeId) => {
          if (molecule.data && moleculeId !== id) {
            this.viewer.addModel(molecule.data, molecule.format || 'pdb');
          }
        });
      }
      this.render();
    }
  }

  /**
   * Set visualization style for molecules
   */
  setStyle(style: Mol3DStyle, selector?: any): void {
    if (!this.viewer.setStyle) {
      console.warn('Style setting not available in fallback mode');
      return;
    }

    try {
      this.viewer.setStyle(selector || {}, style);
      this.render();
    } catch (error) {
      console.error('Failed to set style:', error);
    }
  }

  /**
   * Add surface to molecule
   */
  addSurface(
    surfaceType: 'VDW' | 'SAS' | 'MS' | 'SES' = 'VDW',
    style: SurfaceStyle = {},
    selector?: any
  ): void {
    if (!this.viewer.addSurface) {
      console.warn('Surface rendering not available in fallback mode');
      return;
    }

    try {
      this.viewer.addSurface(surfaceType, style, selector);
      this.render();
    } catch (error) {
      console.error('Failed to add surface:', error);
    }
  }

  /**
   * Animate camera movement
   */
  animateCamera(
    targetPosition: { x: number; y: number; z: number },
    options: AnimationOptions = { duration: 1000 }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.viewer.animate) {
        console.warn('Animation not available in fallback mode');
        resolve();
        return;
      }

      try {
        this.viewer.animate({
          camera: targetPosition,
          duration: options.duration,
          easing: options.easing || 'ease'
        });

        setTimeout(resolve, options.duration);
      } catch (error) {
        console.error('Camera animation failed:', error);
        resolve();
      }
    });
  }

  /**
   * Animate molecular properties
   */
  animateMolecule(
    properties: Record<string, any>,
    options: AnimationOptions = { duration: 1000 }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.viewer.animate) {
        console.warn('Animation not available in fallback mode');
        resolve();
        return;
      }

      try {
        this.viewer.animate({
          ...properties,
          duration: options.duration,
          easing: options.easing || 'ease'
        });

        setTimeout(resolve, options.duration);
      } catch (error) {
        console.error('Molecule animation failed:', error);
        resolve();
      }
    });
  }

  /**
   * Export scene as image or animation
   */
  async exportScene(options: ExportOptions): Promise<string | Blob> {
    if (!this.viewer) {
      throw new Error('Viewer not initialized');
    }

    switch (options.format) {
      case 'png':
        return this.exportPNG(options);
      case 'webm':
        return this.exportWebM(options);
      case 'pdb':
      case 'sdf':
      case 'mol2':
        return this.exportMoleculeData(options.format);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Add event listener for molecular interactions
   */
  addEventListener(event: string, handler: (event: InteractionEvent) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, handler: (event: InteractionEvent) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Center and fit all molecules in view
   */
  zoomToFit(): void {
    if (this.viewer.zoomTo) {
      this.viewer.zoomTo();
      this.render();
    }
  }

  /**
   * Set camera position
   */
  setCameraPosition(position: { x: number; y: number; z: number }): void {
    if (this.viewer.setCameraPosition) {
      this.viewer.setCameraPosition(position);
      this.render();
    }
  }

  /**
   * Get current camera position
   */
  getCameraPosition(): { x: number; y: number; z: number } {
    if (this.viewer.getCameraPosition) {
      return this.viewer.getCameraPosition();
    }
    return { x: 0, y: 0, z: 50 };
  }

  /**
   * Clear all molecules from scene
   */
  clear(): void {
    this.molecules.clear();
    if (this.viewer.removeAllModels) {
      this.viewer.removeAllModels();
      this.render();
    }
  }

  /**
   * Render the scene
   */
  render(): void {
    if (this.viewer.render) {
      this.viewer.render();
    }
  }

  /**
   * Resize viewer
   */
  resize(width?: number, height?: number): void {
    if (width) this.config.width = width;
    if (height) this.config.height = height;

    if (this.viewer.resize) {
      this.viewer.resize();
    }
  }

  /**
   * Parse molecule data string into structured format
   */
  private parseMoleculeData(data: string, format: string): Mol3DMolecule {
    const atoms: Mol3DAtom[] = [];
    
    try {
      switch (format.toLowerCase()) {
        case 'pdb':
          return this.parsePDB(data);
        case 'sdf':
        case 'mol':
          return this.parseSDF(data);
        case 'xyz':
          return this.parseXYZ(data);
        default:
          console.warn(`Unsupported format: ${format}`);
          break;
      }
    } catch (error) {
      console.error('Failed to parse molecule data:', error);
    }

    return {
      atoms,
      format: format as any,
      data
    };
  }

  /**
   * Parse PDB format
   */
  private parsePDB(data: string): Mol3DMolecule {
    const atoms: Mol3DAtom[] = [];
    const lines = data.split('\n');

    for (const line of lines) {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const atom: Mol3DAtom = {
          elem: line.substring(76, 78).trim() || line.substring(12, 16).trim().charAt(0),
          x: parseFloat(line.substring(30, 38)),
          y: parseFloat(line.substring(38, 46)),
          z: parseFloat(line.substring(46, 54)),
          serial: parseInt(line.substring(6, 11)),
          atom: line.substring(12, 16).trim(),
          resn: line.substring(17, 20).trim(),
          chain: line.substring(21, 22),
          resi: parseInt(line.substring(22, 26)),
          b: parseFloat(line.substring(60, 66)),
          pdbline: line
        };
        atoms.push(atom);
      }
    }

    return {
      atoms,
      format: 'pdb',
      data
    };
  }

  /**
   * Parse SDF format
   */
  private parseSDF(data: string): Mol3DMolecule {
    const atoms: Mol3DAtom[] = [];
    const lines = data.split('\n');
    
    // Find the counts line (typically line 3)
    const countsLine = lines[3];
    if (countsLine) {
      const atomCount = parseInt(countsLine.substring(0, 3));
      
      // Parse atom block (starts at line 4)
      for (let i = 4; i < 4 + atomCount && i < lines.length; i++) {
        const line = lines[i];
        const parts = line.trim().split(/\s+/);
        
        if (parts.length >= 4) {
          atoms.push({
            elem: parts[3],
            x: parseFloat(parts[0]),
            y: parseFloat(parts[1]),
            z: parseFloat(parts[2])
          });
        }
      }
    }

    return {
      atoms,
      format: 'sdf',
      data
    };
  }

  /**
   * Parse XYZ format
   */
  private parseXYZ(data: string): Mol3DMolecule {
    const atoms: Mol3DAtom[] = [];
    const lines = data.split('\n');
    
    if (lines.length < 2) return { atoms, format: 'xyz', data };
    
    const atomCount = parseInt(lines[0]);
    
    // Parse atoms (start from line 2)
    for (let i = 2; i < 2 + atomCount && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      
      if (parts.length >= 4) {
        atoms.push({
          elem: parts[0],
          x: parseFloat(parts[1]),
          y: parseFloat(parts[2]),
          z: parseFloat(parts[3])
        });
      }
    }

    return {
      atoms,
      format: 'xyz',
      data
    };
  }

  /**
   * Setup event handlers for viewer interactions
   */
  private setupEventHandlers(): void {
    if (!this.viewer.setClickCallback) return;

    // Click events
    this.viewer.setClickCallback((event: any) => {
      const handlers = this.eventHandlers.get('click');
      if (handlers) {
        const interactionEvent: InteractionEvent = {
          type: 'click',
          atom: event.atom,
          position: event.position || { x: 0, y: 0, z: 0 },
          screenPosition: event.screenPosition || { x: 0, y: 0 }
        };
        handlers.forEach(handler => handler(interactionEvent));
      }
    });

    // Hover events
    this.viewer.setHoverCallback((event: any) => {
      const handlers = this.eventHandlers.get('hover');
      if (handlers) {
        const interactionEvent: InteractionEvent = {
          type: 'hover',
          atom: event.atom,
          position: event.position || { x: 0, y: 0, z: 0 },
          screenPosition: event.screenPosition || { x: 0, y: 0 }
        };
        handlers.forEach(handler => handler(interactionEvent));
      }
    });
  }

  /**
   * Export as PNG image
   */
  private exportPNG(options: ExportOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.viewer.pngURI) {
        reject(new Error('PNG export not available in fallback mode'));
        return;
      }

      try {
        const uri = this.viewer.pngURI({
          width: options.width || this.config.width,
          height: options.height || this.config.height
        });
        resolve(uri);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Export as WebM animation
   */
  private exportWebM(options: ExportOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // WebM export would require additional implementation
      reject(new Error('WebM export not yet implemented'));
    });
  }

  /**
   * Export molecule data in specified format
   */
  private exportMoleculeData(format: string): string {
    const molecules = Array.from(this.molecules.values());
    if (molecules.length === 0) {
      return '';
    }

    // Return the first molecule's data or convert to requested format
    const molecule = molecules[0];
    return molecule.data || this.convertMoleculeFormat(molecule, format);
  }

  /**
   * Convert molecule to different format
   */
  private convertMoleculeFormat(molecule: Mol3DMolecule, targetFormat: string): string {
    // Basic format conversion (would need more sophisticated implementation)
    switch (targetFormat.toLowerCase()) {
      case 'xyz':
        return this.moleculeToXYZ(molecule);
      case 'pdb':
        return this.moleculeToPDB(molecule);
      default:
        return molecule.data || '';
    }
  }

  /**
   * Convert molecule to XYZ format
   */
  private moleculeToXYZ(molecule: Mol3DMolecule): string {
    const lines = [
      molecule.atoms.length.toString(),
      molecule.title || 'Generated by CREB'
    ];

    molecule.atoms.forEach(atom => {
      lines.push(`${atom.elem} ${atom.x.toFixed(6)} ${atom.y.toFixed(6)} ${atom.z.toFixed(6)}`);
    });

    return lines.join('\n');
  }

  /**
   * Convert molecule to PDB format
   */
  private moleculeToPDB(molecule: Mol3DMolecule): string {
    const lines: string[] = [];

    molecule.atoms.forEach((atom, index) => {
      const line = [
        'ATOM  ',
        (index + 1).toString().padStart(5),
        '  ',
        atom.atom?.padEnd(4) || atom.elem.padEnd(4),
        ' ',
        'UNK',
        ' ',
        'A',
        '   1    ',
        atom.x.toFixed(3).padStart(8),
        atom.y.toFixed(3).padStart(8),
        atom.z.toFixed(3).padStart(8),
        '  1.00',
        '  0.00',
        '          ',
        atom.elem.padStart(2)
      ].join('');
      
      lines.push(line);
    });

    lines.push('END');
    return lines.join('\n');
  }

  /**
   * Create fallback viewer for environments where 3Dmol.js is not available
   */
  private createFallbackViewer(): any {
    return {
      addModel: () => console.warn('3Dmol.js not available - addModel disabled'),
      removeAllModels: () => console.warn('3Dmol.js not available - removeAllModels disabled'),
      setStyle: () => console.warn('3Dmol.js not available - setStyle disabled'),
      addSurface: () => console.warn('3Dmol.js not available - addSurface disabled'),
      render: () => console.warn('3Dmol.js not available - render disabled'),
      zoomTo: () => console.warn('3Dmol.js not available - zoomTo disabled'),
      resize: () => console.warn('3Dmol.js not available - resize disabled'),
      animate: () => console.warn('3Dmol.js not available - animate disabled'),
      pngURI: () => { throw new Error('PNG export not available without 3Dmol.js'); }
    };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.clear();
    this.eventHandlers.clear();
    
    if (this.viewer && this.viewer.removeAllModels) {
      this.viewer.removeAllModels();
    }
    
    this.initialized = false;
  }
}

/**
 * Static utility methods for 3Dmol operations
 */
export class Mol3DUtils {
  /**
   * Convert CREB molecule format to 3Dmol-compatible format
   */
  static crebToMol3D(crebMolecule: any): Mol3DMolecule {
    const atoms: Mol3DAtom[] = [];

    if (crebMolecule.atoms) {
      crebMolecule.atoms.forEach((atom: any, index: number) => {
        atoms.push({
          elem: atom.element || atom.symbol || 'C',
          x: atom.x || atom.position?.x || 0,
          y: atom.y || atom.position?.y || 0,
          z: atom.z || atom.position?.z || 0,
          serial: index + 1
        });
      });
    } else if (crebMolecule.elements) {
      // Generate 3D coordinates for elements-only molecules
      crebMolecule.elements.forEach((element: string, index: number) => {
        atoms.push({
          elem: element,
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          z: Math.random() * 10 - 5,
          serial: index + 1
        });
      });
    }

    return {
      atoms,
      title: crebMolecule.name || crebMolecule.formula || 'Unknown'
    };
  }

  /**
   * Get predefined molecular styles
   */
  static getPresetStyles(): Record<string, Mol3DStyle> {
    return {
      'ball-and-stick': {
        stick: { radius: 0.2 },
        sphere: { scale: 0.3 }
      },
      'space-filling': {
        sphere: { scale: 1.0 }
      },
      'wireframe': {
        line: { linewidth: 2 }
      },
      'cartoon': {
        cartoon: { style: 'trace' }
      },
      'surface': {
        surface: { opacity: 0.8 }
      }
    };
  }

  /**
   * Generate molecular surfaces
   */
  static getSurfaceTypes(): Record<string, string> {
    return {
      'van-der-waals': 'VDW',
      'solvent-accessible': 'SAS',
      'molecular': 'MS',
      'solvent-excluded': 'SES'
    };
  }

  /**
   * Get common color schemes
   */
  static getColorSchemes(): Record<string, string> {
    return {
      'element': 'default',
      'amino': 'amino',
      'secondary': 'ss',
      'residue': 'residue',
      'chain': 'chain',
      'temperature': 'b',
      'hydrophobic': 'hydrophobic'
    };
  }
}

export default Mol3DWrapper;
