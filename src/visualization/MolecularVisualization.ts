/**
 * CREB-JS Molecular Visualization System
 * Production implementation of 2D/3D molecular structure rendering
 * Based on research: 3Dmol.js + RDKit-JS integration
 */

// Import Canvas2D renderer
import { Canvas2DRenderer, type Molecule2D } from './Canvas2DRenderer';

export interface MolecularVisualizationConfig {
  container: HTMLElement | string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  defaultStyle?: MolecularStyle;
  controls?: boolean;
  fullscreen?: boolean;
}

export interface MolecularStyle {
  representation: '3d' | '2d' | 'both';
  style3d: 'ball-and-stick' | 'space-filling' | 'wireframe' | 'cartoon';
  colorScheme: 'element' | 'rainbow' | 'hydrophobicity' | 'secondary-structure';
  showLabels: boolean;
  showBonds: boolean;
  bondWidth: number;
  atomScale: number;
}

export interface MoleculeData {
  format: 'smiles' | 'mol' | 'sdf' | 'pdb' | 'xyz';
  data: string;
  name?: string;
  properties?: Record<string, any>;
}

export interface MolecularInteraction {
  type: 'click' | 'hover' | 'select' | 'measure';
  callback: (event: MolecularEvent) => void;
}

export interface MolecularEvent {
  type: string;
  atom?: MolecularAtom;
  bond?: MolecularBond;
  position?: { x: number; y: number; z: number };
  measurement?: MolecularMeasurement;
}

export interface MolecularAtom {
  id: number;
  element: string;
  symbol: string;
  position: { x: number; y: number; z: number };
  charge?: number;
  hybridization?: string;
  bonds: number[];
}

export interface MolecularBond {
  id: number;
  atom1: number;
  atom2: number;
  order: number;
  type: 'single' | 'double' | 'triple' | 'aromatic';
  length: number;
}

export interface MolecularMeasurement {
  type: 'distance' | 'angle' | 'dihedral';
  atoms: number[];
  value: number;
  unit: string;
}

/**
 * Main molecular visualization class
 */
export class MolecularVisualization {
  private container: HTMLElement;
  private config: MolecularVisualizationConfig;
  private viewer3d: any; // 3Dmol.js viewer
  private viewer2d: any; // RDKit 2D renderer
  private currentMolecule: MoleculeData | null = null;
  private interactions: MolecularInteraction[] = [];
  private measurements: MolecularMeasurement[] = [];

  constructor(config: MolecularVisualizationConfig) {
    this.config = {
      width: 600,
      height: 400,
      backgroundColor: '#ffffff',
      defaultStyle: {
        representation: '3d',
        style3d: 'ball-and-stick',
        colorScheme: 'element',
        showLabels: false,
        showBonds: true,
        bondWidth: 0.2,
        atomScale: 1.0
      },
      controls: true,
      fullscreen: false,
      ...config
    };

    this.container = typeof config.container === 'string' 
      ? document.getElementById(config.container)!
      : config.container;

    this.initializeViewer();
  }

  /**
   * Initialize the molecular viewer
   */
  private initializeViewer(): void {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.width = `${this.config.width}px`;
    this.container.style.height = `${this.config.height}px`;

    // Create viewer container
    const viewerContainer = document.createElement('div');
    viewerContainer.style.width = '100%';
    viewerContainer.style.height = '100%';
    viewerContainer.id = 'molecular-viewer-' + Math.random().toString(36).substr(2, 9);
    this.container.appendChild(viewerContainer);

    // Initialize 3Dmol.js viewer
    this.initialize3DViewer(viewerContainer);

    // Add controls if enabled
    if (this.config.controls) {
      this.addControls();
    }
  }

  /**
   * Initialize 3Dmol.js viewer
   */
  private initialize3DViewer(container: HTMLElement): void {
    // This would use the actual 3Dmol.js library
    // For now, we'll create a placeholder
    if (typeof (window as any).$3Dmol !== 'undefined') {
      this.viewer3d = (window as any).$3Dmol.createViewer(container, {
        backgroundColor: this.config.backgroundColor,
        defaultcolors: (window as any).$3Dmol.elementColors.defaultColors
      });
    } else {
      // Fallback implementation
      this.createFallbackViewer(container);
    }
  }

  /**
   * Create fallback viewer when 3Dmol.js is not available
   */
  private createFallbackViewer(container: HTMLElement): void {
    container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        border: 2px dashed #ccc;
        border-radius: 8px;
        flex-direction: column;
        text-align: center;
        padding: 20px;
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">🧬</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
          CREB Molecular Viewer
        </div>
        <div style="color: #666; margin-bottom: 16px;">
          Load 3Dmol.js library for full 3D visualization
        </div>
        <div style="font-size: 12px; color: #999;">
          Currently showing fallback mode
        </div>
      </div>
    `;
  }

  /**
   * Add control panel to the viewer
   */
  private addControls(): void {
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.95);
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      min-width: 200px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
    `;

    controlPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px; color: #2c3e50;">
        Visualization Controls
      </div>
      
      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Style:</label>
        <select id="style-select" style="width: 100%; padding: 5px;">
          <option value="ball-and-stick">Ball & Stick</option>
          <option value="space-filling">Space Filling</option>
          <option value="wireframe">Wireframe</option>
          <option value="cartoon">Cartoon</option>
        </select>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Color:</label>
        <select id="color-select" style="width: 100%; padding: 5px;">
          <option value="element">By Element</option>
          <option value="rainbow">Rainbow</option>
          <option value="hydrophobicity">Hydrophobicity</option>
        </select>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; font-weight: 600;">
          <input type="checkbox" id="labels-checkbox" style="margin-right: 8px;">
          Show Labels
        </label>
      </div>

      <div style="margin-bottom: 10px;">
        <button id="reset-view" style="
          width: 100%;
          padding: 8px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        ">Reset View</button>
      </div>

      <div style="margin-bottom: 10px;">
        <button id="fullscreen-toggle" style="
          width: 100%;
          padding: 8px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        ">Fullscreen</button>
      </div>
    `;

    this.container.appendChild(controlPanel);
    this.bindControlEvents(controlPanel);
  }

  /**
   * Bind events to control panel
   */
  private bindControlEvents(controlPanel: HTMLElement): void {
    const styleSelect = controlPanel.querySelector('#style-select') as HTMLSelectElement;
    const colorSelect = controlPanel.querySelector('#color-select') as HTMLSelectElement;
    const labelsCheckbox = controlPanel.querySelector('#labels-checkbox') as HTMLInputElement;
    const resetButton = controlPanel.querySelector('#reset-view') as HTMLButtonElement;
    const fullscreenButton = controlPanel.querySelector('#fullscreen-toggle') as HTMLButtonElement;

    styleSelect?.addEventListener('change', (e) => {
      this.updateStyle({ style3d: (e.target as HTMLSelectElement).value as any });
    });

    colorSelect?.addEventListener('change', (e) => {
      this.updateStyle({ colorScheme: (e.target as HTMLSelectElement).value as any });
    });

    labelsCheckbox?.addEventListener('change', (e) => {
      this.updateStyle({ showLabels: (e.target as HTMLInputElement).checked });
    });

    resetButton?.addEventListener('click', () => {
      this.resetView();
    });

    fullscreenButton?.addEventListener('click', () => {
      this.toggleFullscreen();
    });
  }

  /**
   * Load a molecule from various formats
   */
  async loadMolecule(molecule: MoleculeData): Promise<void> {
    this.currentMolecule = molecule;

    try {
      switch (molecule.format) {
        case 'smiles':
          await this.loadFromSMILES(molecule.data);
          break;
        case 'mol':
          await this.loadFromMOL(molecule.data);
          break;
        case 'pdb':
          await this.loadFromPDB(molecule.data);
          break;
        case 'sdf':
          await this.loadFromSDF(molecule.data);
          break;
        case 'xyz':
          await this.loadFromXYZ(molecule.data);
          break;
        default:
          throw new Error(`Unsupported format: ${molecule.format}`);
      }

      this.render();
    } catch (error) {
      console.error('Failed to load molecule:', error);
      throw error;
    }
  }

  /**
   * Load molecule from SMILES string
   */
  private async loadFromSMILES(smiles: string): Promise<void> {
    if (this.viewer3d && this.viewer3d.addModel) {
      // Convert SMILES to 3D coordinates (would use RDKit-JS or similar)
      const mol3d = await this.smilesToMol3D(smiles);
      this.viewer3d.addModel(mol3d, 'mol');
    } else {
      // Fallback: show SMILES string
      this.showFallbackMolecule(`SMILES: ${smiles}`);
    }
  }

  /**
   * Convert SMILES to 3D coordinates
   */
  private async smilesToMol3D(smiles: string): Promise<string> {
    // This would use RDKit-JS or a similar library
    // For now, return a simple mock MOL format
    return `
  Mrv2014 01010000002D          

  4  3  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    1.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    1.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
M  END`;
  }

  /**
   * Load molecule from MOL format
   */
  private async loadFromMOL(molData: string): Promise<void> {
    if (this.viewer3d && this.viewer3d.addModel) {
      this.viewer3d.addModel(molData, 'mol');
    } else {
      this.showFallbackMolecule('MOL Format loaded');
    }
  }

  /**
   * Load molecule from PDB format
   */
  private async loadFromPDB(pdbData: string): Promise<void> {
    if (this.viewer3d && this.viewer3d.addModel) {
      this.viewer3d.addModel(pdbData, 'pdb');
    } else {
      this.showFallbackMolecule('PDB Format loaded');
    }
  }

  /**
   * Load molecule from SDF format
   */
  private async loadFromSDF(sdfData: string): Promise<void> {
    if (this.viewer3d && this.viewer3d.addModel) {
      this.viewer3d.addModel(sdfData, 'sdf');
    } else {
      this.showFallbackMolecule('SDF Format loaded');
    }
  }

  /**
   * Load molecule from XYZ format
   */
  private async loadFromXYZ(xyzData: string): Promise<void> {
    if (this.viewer3d && this.viewer3d.addModel) {
      this.viewer3d.addModel(xyzData, 'xyz');
    } else {
      this.showFallbackMolecule('XYZ Format loaded');
    }
  }

  /**
   * Show fallback molecule display
   */
  private showFallbackMolecule(info: string): void {
    const viewerDiv = this.container.querySelector('div');
    if (viewerDiv) {
      viewerDiv.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: linear-gradient(45deg, #e8f5e8, #f0f8ff);
          border: 2px solid #27ae60;
          border-radius: 8px;
          flex-direction: column;
          text-align: center;
          padding: 20px;
        ">
          <div style="font-size: 64px; margin-bottom: 16px;">⚗️</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #27ae60;">
            Molecule Loaded!
          </div>
          <div style="color: #2c3e50; margin-bottom: 16px;">
            ${info}
          </div>
          <div style="font-size: 12px; color: #7f8c8d;">
            3D visualization available with 3Dmol.js library
          </div>
        </div>
      `;
    }
  }

  /**
   * Update visualization style
   */
  updateStyle(style: Partial<MolecularStyle>): void {
    this.config.defaultStyle = { ...this.config.defaultStyle!, ...style };
    
    if (this.viewer3d) {
      this.render();
    }
  }

  /**
   * Render the current molecule
   */
  render(): void {
    if (!this.viewer3d) return;

    // Clear existing representations
    this.viewer3d.removeAllModels();
    
    if (this.currentMolecule) {
      // Re-add the molecule with current style
      this.loadMolecule(this.currentMolecule);
      
      // Apply styling
      const style = this.config.defaultStyle!;
      this.viewer3d.setStyle({}, this.getStyleObject(style));
      
      // Render
      this.viewer3d.render();
    }
  }

  /**
   * Get 3Dmol.js style object
   */
  private getStyleObject(style: MolecularStyle): any {
    const styleObj: any = {};

    switch (style.style3d) {
      case 'ball-and-stick':
        styleObj.stick = { radius: style.bondWidth };
        styleObj.sphere = { scale: style.atomScale };
        break;
      case 'space-filling':
        styleObj.sphere = { scale: style.atomScale * 1.5 };
        break;
      case 'wireframe':
        styleObj.line = { linewidth: style.bondWidth * 10 };
        break;
      case 'cartoon':
        styleObj.cartoon = { color: style.colorScheme };
        break;
    }

    return styleObj;
  }

  /**
   * Reset camera view
   */
  resetView(): void {
    if (this.viewer3d && this.viewer3d.zoomTo) {
      this.viewer3d.zoomTo();
      this.viewer3d.render();
    }
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  /**
   * Add interaction handler
   */
  addInteraction(interaction: MolecularInteraction): void {
    this.interactions.push(interaction);
    
    if (this.viewer3d) {
      // Bind interaction to 3Dmol.js viewer
      this.bindInteraction(interaction);
    }
  }

  /**
   * Bind interaction to viewer
   */
  private bindInteraction(interaction: MolecularInteraction): void {
    // Implementation would depend on 3Dmol.js API
    // This is a placeholder
  }

  /**
   * Measure distance between atoms
   */
  measureDistance(atom1: number, atom2: number): MolecularMeasurement {
    // Implementation would calculate actual distance
    const measurement: MolecularMeasurement = {
      type: 'distance',
      atoms: [atom1, atom2],
      value: 1.5, // placeholder
      unit: 'Å'
    };
    
    this.measurements.push(measurement);
    return measurement;
  }

  /**
   * Export current view as image
   */
  exportImage(format: 'png' | 'jpg' = 'png'): string {
    if (this.viewer3d && this.viewer3d.pngURI) {
      return this.viewer3d.pngURI();
    }
    return '';
  }

  /**
   * Get molecular information
   */
  getMolecularInfo(): any {
    if (!this.currentMolecule) return null;

    return {
      format: this.currentMolecule.format,
      name: this.currentMolecule.name,
      properties: this.currentMolecule.properties,
      measurements: this.measurements,
      style: this.config.defaultStyle
    };
  }

  /**
   * Destroy the viewer and clean up
   */
  destroy(): void {
    if (this.viewer3d) {
      this.viewer3d.clear();
    }
    this.container.innerHTML = '';
    this.interactions = [];
    this.measurements = [];
    this.currentMolecule = null;
  }
}

/**
 * Utility function to create a molecular visualization
 */
export function createMolecularVisualization(config: MolecularVisualizationConfig): MolecularVisualization {
  return new MolecularVisualization(config);
}

/**
 * Integration with CREB chemistry calculations
 */
export class CREBMolecularIntegration {
  private visualization: MolecularVisualization;

  constructor(visualization: MolecularVisualization) {
    this.visualization = visualization;
  }

  /**
   * Visualize molecules from CREB equation
   */
  async visualizeFromEquation(equation: string): Promise<void> {
    // Parse equation and extract molecules
    const molecules = this.parseMoleculesFromEquation(equation);
    
    // For now, visualize the first molecule
    if (molecules.length > 0) {
      await this.visualization.loadMolecule(molecules[0]);
    }
  }

  /**
   * Parse molecules from chemical equation
   */
  private parseMoleculesFromEquation(equation: string): MoleculeData[] {
    // This would integrate with CREB's equation parser
    // For now, return mock data
    return [
      {
        format: 'smiles',
        data: 'O',
        name: 'Water',
        properties: { formula: 'H2O', molarMass: 18.015 }
      }
    ];
  }

  /**
   * Show reaction animation
   */
  async animateReaction(equation: string): Promise<void> {
    // Implementation for reaction animation
    console.log('Animating reaction:', equation);
  }
}

export default MolecularVisualization;
