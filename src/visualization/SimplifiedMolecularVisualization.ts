/**
 * Simplified Molecular Visualization System
 * Node.js and browser compatible implementation
 */

import { Canvas2DRenderer, type Molecule2D } from './Canvas2DRenderer';

export interface MolecularVisualizationConfig {
  container: any; // HTMLElement or string
  width?: number;
  height?: number;
  mode?: '2d' | '3d' | 'both';
  backgroundColor?: string;
  interactive?: boolean;
}

export interface MolecularStyleOptions {
  style?: 'stick' | 'sphere' | 'wireframe';
  colorScheme?: 'element' | 'rainbow' | 'jmol';
  showLabels?: boolean;
  atomScale?: number;
  bondWidth?: number;
}

export interface MoleculeVisualizationData {
  pdb?: string;
  sdf?: string;
  smiles?: string;
  atoms?: Array<{
    element: string;
    x: number;
    y: number;
    z: number;
  }>;
  bonds?: Array<{
    atom1: number;
    atom2: number;
    order: number;
  }>;
}

/**
 * Main Molecular Visualization Engine
 */
export class MolecularVisualization {
  private container: any;
  private config: MolecularVisualizationConfig;
  private canvas2d?: Canvas2DRenderer;
  private viewer3d?: any;
  private currentMolecule?: MoleculeVisualizationData;
  private styleOptions: MolecularStyleOptions;

  constructor(config: MolecularVisualizationConfig) {
    this.config = {
      width: 600,
      height: 400,
      mode: 'both',
      backgroundColor: '#ffffff',
      interactive: true,
      ...config
    };

    this.styleOptions = {
      style: 'stick',
      colorScheme: 'element',
      showLabels: false,
      atomScale: 1.0,
      bondWidth: 2
    };

    this.initializeContainer();
    this.setupVisualization();
  }

  /**
   * Initialize the visualization container
   */
  private initializeContainer(): void {
    // Handle both string selector and direct element
    if (typeof this.config.container === 'string') {
      // In browser environment, try to find element
      try {
        const element = (globalThis as any)?.document?.getElementById?.(this.config.container);
        this.container = element || this.createFallbackContainer();
      } catch {
        this.container = this.createFallbackContainer();
      }
    } else {
      this.container = this.config.container || this.createFallbackContainer();
    }
  }

  /**
   * Create a fallback container for non-browser environments
   */
  private createFallbackContainer(): any {
    return {
      width: this.config.width || 600,
      height: this.config.height || 400,
      appendChild: () => {},
      innerHTML: '',
      style: {}
    };
  }

  /**
   * Setup the visualization components
   */
  private setupVisualization(): void {
    if (this.config.mode === '2d' || this.config.mode === 'both') {
      this.setup2DVisualization();
    }

    if (this.config.mode === '3d' || this.config.mode === 'both') {
      this.setup3DVisualization();
    }
  }

  /**
   * Setup 2D canvas visualization
   */
  private setup2DVisualization(): void {
    try {
      // Try to create canvas element
      let canvas: any;
      
      if ((globalThis as any)?.document?.createElement) {
        canvas = (globalThis as any).document.createElement('canvas');
        canvas.width = this.config.width || 600;
        canvas.height = this.config.height || 400;
        
        if (this.container.appendChild) {
          this.container.appendChild(canvas);
        }
      } else {
        // Fallback for non-browser environments
        canvas = {
          width: this.config.width || 600,
          height: this.config.height || 400,
          getContext: () => ({
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            lineCap: 'round',
            font: '12px Arial',
            textAlign: 'center',
            textBaseline: 'middle',
            fillRect: () => {},
            fillText: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {},
            setLineDash: () => {}
          }),
          toDataURL: () => 'data:image/png;base64,',
          style: {}
        };
      }

      this.canvas2d = new Canvas2DRenderer(canvas);
    } catch (error) {
      console.warn('Could not initialize 2D visualization:', error);
    }
  }

  /**
   * Setup 3D visualization
   */
  private setup3DVisualization(): void {
    try {
      // Check if 3Dmol.js is available
      if ((globalThis as any)?.$3Dmol) {
        this.initialize3DViewer();
      } else {
        this.initializeFallback3D();
      }
    } catch (error) {
      console.warn('Could not initialize 3D visualization:', error);
      this.initializeFallback3D();
    }
  }

  /**
   * Initialize 3Dmol.js viewer
   */
  private initialize3DViewer(): void {
    try {
      const $3Dmol = (globalThis as any).$3Dmol;
      this.viewer3d = $3Dmol.createViewer(this.container, {
        defaultcolors: $3Dmol.elementColors.defaultColors
      });
    } catch (error) {
      console.warn('Failed to create 3Dmol viewer:', error);
      this.initializeFallback3D();
    }
  }

  /**
   * Initialize fallback 3D visualization
   */
  private initializeFallback3D(): void {
    this.viewer3d = {
      addModel: () => ({ setStyle: () => {}, show: () => {} }),
      setStyle: () => {},
      zoomTo: () => {},
      render: () => {},
      clear: () => {},
      resize: () => {}
    };
  }

  /**
   * Load and display a molecule
   */
  loadMolecule(data: MoleculeVisualizationData): void {
    this.currentMolecule = data;

    if (this.config.mode === '2d' || this.config.mode === 'both') {
      this.render2D(data);
    }

    if (this.config.mode === '3d' || this.config.mode === 'both') {
      this.render3D(data);
    }
  }

  /**
   * Render molecule in 2D
   */
  private render2D(data: MoleculeVisualizationData): void {
    if (!this.canvas2d) return;

    try {
      let molecule2d: Molecule2D;

      if (data.smiles) {
        molecule2d = Canvas2DRenderer.smilesToMolecule2D(data.smiles);
      } else if (data.atoms && data.bonds) {
        molecule2d = {
          atoms: data.atoms.map((atom, i) => ({
            element: atom.element,
            position: { x: atom.x * 50 + 100, y: atom.y * 50 + 100 },
            bonds: data.bonds!
              .filter(bond => bond.atom1 === i || bond.atom2 === i)
              .map((_, j) => j)
          })),
          bonds: data.bonds.map(bond => ({
            atom1: bond.atom1,
            atom2: bond.atom2,
            order: bond.order,
            type: bond.order === 1 ? 'single' : bond.order === 2 ? 'double' : 'triple'
          }))
        };
      } else {
        // Default fallback molecule
        molecule2d = Canvas2DRenderer.smilesToMolecule2D('C');
      }

      this.canvas2d.loadMolecule(molecule2d);
    } catch (error) {
      console.warn('Error rendering 2D molecule:', error);
    }
  }

  /**
   * Render molecule in 3D
   */
  private render3D(data: MoleculeVisualizationData): void {
    if (!this.viewer3d) return;

    try {
      this.viewer3d.clear();

      if (data.pdb) {
        const model = this.viewer3d.addModel(data.pdb, 'pdb');
        model.setStyle({}, { [this.styleOptions.style || 'stick']: {} });
        model.show();
      } else if (data.sdf) {
        const model = this.viewer3d.addModel(data.sdf, 'sdf');
        model.setStyle({}, { [this.styleOptions.style || 'stick']: {} });
        model.show();
      }

      this.viewer3d.zoomTo();
      this.viewer3d.render();
    } catch (error) {
      console.warn('Error rendering 3D molecule:', error);
    }
  }

  /**
   * Update visualization style
   */
  updateStyle(options: Partial<MolecularStyleOptions>): void {
    this.styleOptions = { ...this.styleOptions, ...options };

    if (this.currentMolecule) {
      this.loadMolecule(this.currentMolecule);
    }
  }

  /**
   * Export current visualization as image
   */
  exportImage(format: 'png' | 'jpg' = 'png'): string {
    if (this.canvas2d && (this.config.mode === '2d' || this.config.mode === 'both')) {
      return this.canvas2d.exportImage(format);
    }
    return '';
  }

  /**
   * Reset visualization to default view
   */
  resetView(): void {
    if (this.canvas2d) {
      this.canvas2d.resetView();
    }

    if (this.viewer3d && this.viewer3d.zoomTo) {
      this.viewer3d.zoomTo();
      this.viewer3d.render();
    }
  }

  /**
   * Resize the visualization
   */
  resize(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;

    if (this.viewer3d && this.viewer3d.resize) {
      this.viewer3d.resize();
    }

    // For 2D, would need to recreate canvas
    if (this.canvas2d) {
      this.setup2DVisualization();
      if (this.currentMolecule) {
        this.render2D(this.currentMolecule);
      }
    }
  }

  /**
   * Get current molecule data
   */
  getMolecule(): MoleculeVisualizationData | undefined {
    return this.currentMolecule;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.viewer3d && this.viewer3d.clear) {
      this.viewer3d.clear();
    }
    
    this.canvas2d = undefined;
    this.viewer3d = undefined;
    this.currentMolecule = undefined;
  }
}

/**
 * Utility functions for molecular data conversion
 */
export class MolecularDataUtils {
  /**
   * Convert PDB string to basic atom/bond data
   */
  static parsePDB(pdbString: string): MoleculeVisualizationData {
    const atoms: Array<{ element: string; x: number; y: number; z: number }> = [];
    const bonds: Array<{ atom1: number; atom2: number; order: number }> = [];

    const lines = pdbString.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const element = line.substring(76, 78).trim() || line.substring(12, 16).trim().charAt(0);
        const x = parseFloat(line.substring(30, 38));
        const y = parseFloat(line.substring(38, 46));
        const z = parseFloat(line.substring(46, 54));
        
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          atoms.push({ element, x, y, z });
        }
      }
    }

    // Simple bond detection based on distance
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = atoms[i].x - atoms[j].x;
        const dy = atoms[i].y - atoms[j].y;
        const dz = atoms[i].z - atoms[j].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Typical bond distance thresholds
        if (distance < 2.0) {
          bonds.push({ atom1: i, atom2: j, order: 1 });
        }
      }
    }

    return { pdb: pdbString, atoms, bonds };
  }

  /**
   * Generate sample molecules for testing
   */
  static generateSampleMolecule(type: 'water' | 'methane' | 'benzene' = 'water'): MoleculeVisualizationData {
    switch (type) {
      case 'water':
        return {
          smiles: 'O',
          atoms: [
            { element: 'O', x: 0, y: 0, z: 0 },
            { element: 'H', x: 0.757, y: 0.587, z: 0 },
            { element: 'H', x: -0.757, y: 0.587, z: 0 }
          ],
          bonds: [
            { atom1: 0, atom2: 1, order: 1 },
            { atom1: 0, atom2: 2, order: 1 }
          ]
        };

      case 'methane':
        return {
          smiles: 'C',
          atoms: [
            { element: 'C', x: 0, y: 0, z: 0 },
            { element: 'H', x: 1.089, y: 0, z: 0 },
            { element: 'H', x: -0.363, y: 1.027, z: 0 },
            { element: 'H', x: -0.363, y: -0.513, z: 0.889 },
            { element: 'H', x: -0.363, y: -0.513, z: -0.889 }
          ],
          bonds: [
            { atom1: 0, atom2: 1, order: 1 },
            { atom1: 0, atom2: 2, order: 1 },
            { atom1: 0, atom2: 3, order: 1 },
            { atom1: 0, atom2: 4, order: 1 }
          ]
        };

      case 'benzene':
        return {
          smiles: 'c1ccccc1',
          atoms: [
            { element: 'C', x: 1.4, y: 0, z: 0 },
            { element: 'C', x: 0.7, y: 1.2, z: 0 },
            { element: 'C', x: -0.7, y: 1.2, z: 0 },
            { element: 'C', x: -1.4, y: 0, z: 0 },
            { element: 'C', x: -0.7, y: -1.2, z: 0 },
            { element: 'C', x: 0.7, y: -1.2, z: 0 }
          ],
          bonds: [
            { atom1: 0, atom2: 1, order: 1 },
            { atom1: 1, atom2: 2, order: 2 },
            { atom1: 2, atom2: 3, order: 1 },
            { atom1: 3, atom2: 4, order: 2 },
            { atom1: 4, atom2: 5, order: 1 },
            { atom1: 5, atom2: 0, order: 2 }
          ]
        };

      default:
        return this.generateSampleMolecule('water');
    }
  }
}

export default MolecularVisualization;
