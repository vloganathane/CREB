/**
 * 2D Molecular Structure Renderer
 * Canvas-based 2D molecular structure drawing
 */

export interface Canvas2DConfig {
  width: number;
  height: number;
  backgroundColor: string;
  bondColor: string;
  atomColors: Record<string, string>;
  bondWidth: number;
  atomRadius: number;
  fontSize: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Atom2D {
  element: string;
  position: Point2D;
  bonds: number[];
  charge?: number;
}

export interface Bond2D {
  atom1: number;
  atom2: number;
  order: number;
  type: 'single' | 'double' | 'triple' | 'aromatic';
}

export interface Molecule2D {
  atoms: Atom2D[];
  bonds: Bond2D[];
  name?: string;
}

export class Canvas2DRenderer {
  private canvas: any; // HTMLCanvasElement - using any for Node.js compatibility
  private ctx: any; // CanvasRenderingContext2D - using any for Node.js compatibility
  private config: Canvas2DConfig;
  private molecule: Molecule2D | null = null;
  private scale = 1;
  private offset = { x: 0, y: 0 };

  constructor(canvas: any, config: Partial<Canvas2DConfig> = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.config = {
      width: 600,
      height: 400,
      backgroundColor: '#ffffff',
      bondColor: '#333333',
      atomColors: {
        'C': '#000000',
        'H': '#ffffff',
        'O': '#ff0000',
        'N': '#0000ff',
        'S': '#ffff00',
        'P': '#ffa500',
        'Cl': '#00ff00',
        'Br': '#a52a2a',
        'I': '#9400d3'
      },
      bondWidth: 2,
      atomRadius: 15,
      fontSize: 12,
      ...config
    };

    this.setupCanvas();
    this.bindEvents();
  }

  private setupCanvas(): void {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    
    // Only set styles if we're in browser environment
    try {
      if (this.canvas.style) {
        this.canvas.style.border = '1px solid #ccc';
        this.canvas.style.borderRadius = '4px';
      }
    } catch {
      // Ignore style errors in non-browser environments
    }
  }

  private bindEvents(): void {
    // Only bind events if we're in browser environment
    try {
      if (!this.canvas.addEventListener) {
        return;
      }
    } catch {
      return;
    }

    let isMouseDown = false;
    let lastMousePos = { x: 0, y: 0 };

    this.canvas.addEventListener('mousedown', (e: any) => {
      isMouseDown = true;
      lastMousePos = { x: e.clientX, y: e.clientY };
    });

    this.canvas.addEventListener('mousemove', (e: any) => {
      if (isMouseDown) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        this.offset.x += deltaX;
        this.offset.y += deltaY;
        
        lastMousePos = { x: e.clientX, y: e.clientY };
        this.render();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    this.canvas.addEventListener('wheel', (e: any) => {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.scale *= scaleFactor;
      this.render();
    });
  }

  /**
   * Load and render a molecule
   */
  loadMolecule(molecule: Molecule2D): void {
    this.molecule = molecule;
    this.centerMolecule();
    this.render();
  }

  /**
   * Center the molecule in the canvas
   */
  private centerMolecule(): void {
    if (!this.molecule || this.molecule.atoms.length === 0) return;

    // Calculate bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    this.molecule.atoms.forEach(atom => {
      minX = Math.min(minX, atom.position.x);
      maxX = Math.max(maxX, atom.position.x);
      minY = Math.min(minY, atom.position.y);
      maxY = Math.max(maxY, atom.position.y);
    });

    // Calculate center offset
    const molWidth = maxX - minX;
    const molHeight = maxY - minY;
    const molCenterX = (minX + maxX) / 2;
    const molCenterY = (minY + maxY) / 2;

    // Calculate scale to fit molecule
    const scaleX = (this.config.width * 0.8) / molWidth;
    const scaleY = (this.config.height * 0.8) / molHeight;
    this.scale = Math.min(scaleX, scaleY, 1);

    // Center the molecule
    this.offset.x = this.config.width / 2 - molCenterX * this.scale;
    this.offset.y = this.config.height / 2 - molCenterY * this.scale;
  }

  /**
   * Render the current molecule
   */
  render(): void {
    this.clear();
    
    if (!this.molecule) {
      this.renderPlaceholder();
      return;
    }

    this.renderBonds();
    this.renderAtoms();
    this.renderLabels();
  }

  /**
   * Clear the canvas
   */
  private clear(): void {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
  }

  /**
   * Render placeholder when no molecule is loaded
   */
  private renderPlaceholder(): void {
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);

    this.ctx.fillStyle = '#999999';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      '2D Molecular Structure',
      this.config.width / 2,
      this.config.height / 2 - 20
    );

    this.ctx.font = '14px Arial';
    this.ctx.fillText(
      'Load a molecule to visualize',
      this.config.width / 2,
      this.config.height / 2 + 20
    );
  }

  /**
   * Render molecular bonds
   */
  private renderBonds(): void {
    if (!this.molecule) return;

    this.ctx.strokeStyle = this.config.bondColor;
    this.ctx.lineWidth = this.config.bondWidth;
    this.ctx.lineCap = 'round';

    this.molecule.bonds.forEach(bond => {
      const atom1 = this.molecule!.atoms[bond.atom1];
      const atom2 = this.molecule!.atoms[bond.atom2];

      const pos1 = this.transformPoint(atom1.position);
      const pos2 = this.transformPoint(atom2.position);

      this.drawBond(pos1, pos2, bond);
    });
  }

  /**
   * Draw a single bond
   */
  private drawBond(pos1: Point2D, pos2: Point2D, bond: Bond2D): void {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    // Offset for multiple bonds
    const perpX = -unitY * 3;
    const perpY = unitX * 3;

    switch (bond.order) {
      case 1:
        this.drawSingleBond(pos1, pos2);
        break;
      case 2:
        this.drawSingleBond(
          { x: pos1.x + perpX, y: pos1.y + perpY },
          { x: pos2.x + perpX, y: pos2.y + perpY }
        );
        this.drawSingleBond(
          { x: pos1.x - perpX, y: pos1.y - perpY },
          { x: pos2.x - perpX, y: pos2.y - perpY }
        );
        break;
      case 3:
        this.drawSingleBond(pos1, pos2);
        this.drawSingleBond(
          { x: pos1.x + perpX, y: pos1.y + perpY },
          { x: pos2.x + perpX, y: pos2.y + perpY }
        );
        this.drawSingleBond(
          { x: pos1.x - perpX, y: pos1.y - perpY },
          { x: pos2.x - perpX, y: pos2.y - perpY }
        );
        break;
    }

    if (bond.type === 'aromatic') {
      this.drawAromaticBond(pos1, pos2);
    }
  }

  /**
   * Draw a single bond line
   */
  private drawSingleBond(pos1: Point2D, pos2: Point2D): void {
    this.ctx.beginPath();
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.stroke();
  }

  /**
   * Draw aromatic bond (dashed)
   */
  private drawAromaticBond(pos1: Point2D, pos2: Point2D): void {
    this.ctx.setLineDash([5, 5]);
    this.drawSingleBond(pos1, pos2);
    this.ctx.setLineDash([]);
  }

  /**
   * Render atoms
   */
  private renderAtoms(): void {
    if (!this.molecule) return;

    this.molecule.atoms.forEach((atom, index) => {
      const pos = this.transformPoint(atom.position);
      this.drawAtom(atom, pos, index);
    });
  }

  /**
   * Draw a single atom
   */
  private drawAtom(atom: Atom2D, pos: Point2D, index: number): void {
    const color = this.config.atomColors[atom.element] || '#999999';
    const radius = this.config.atomRadius * this.scale;

    // Draw atom circle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw border
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw element symbol
    this.ctx.fillStyle = atom.element === 'H' ? '#000000' : '#ffffff';
    this.ctx.font = `${this.config.fontSize * this.scale}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(atom.element, pos.x, pos.y);
  }

  /**
   * Render atom labels and charges
   */
  private renderLabels(): void {
    if (!this.molecule) return;

    this.ctx.fillStyle = '#333333';
    this.ctx.font = `${10 * this.scale}px Arial`;

    this.molecule.atoms.forEach((atom, index) => {
      if (atom.charge && atom.charge !== 0) {
        const pos = this.transformPoint(atom.position);
        const chargeText = atom.charge > 0 ? `+${atom.charge}` : `${atom.charge}`;
        
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(
          chargeText,
          pos.x + this.config.atomRadius * this.scale,
          pos.y - this.config.atomRadius * this.scale
        );
      }
    });
  }

  /**
   * Transform point from molecule coordinates to canvas coordinates
   */
  private transformPoint(point: Point2D): Point2D {
    return {
      x: point.x * this.scale + this.offset.x,
      y: point.y * this.scale + this.offset.y
    };
  }

  /**
   * Convert SMILES to 2D coordinates (simplified)
   */
  static smilesToMolecule2D(smiles: string): Molecule2D {
    // This is a very simplified implementation
    // In production, you'd use RDKit-JS or similar
    
    const molecule: Molecule2D = {
      atoms: [],
      bonds: [],
      name: `SMILES: ${smiles}`
    };

    // Simple water molecule example
    if (smiles === 'O') {
      molecule.atoms = [
        { element: 'O', position: { x: 100, y: 100 }, bonds: [0, 1] },
        { element: 'H', position: { x: 80, y: 120 }, bonds: [0] },
        { element: 'H', position: { x: 120, y: 120 }, bonds: [0] }
      ];
      molecule.bonds = [
        { atom1: 0, atom2: 1, order: 1, type: 'single' },
        { atom1: 0, atom2: 2, order: 1, type: 'single' }
      ];
    }
    // Methane example
    else if (smiles === 'C') {
      molecule.atoms = [
        { element: 'C', position: { x: 100, y: 100 }, bonds: [0, 1, 2, 3] },
        { element: 'H', position: { x: 80, y: 80 }, bonds: [0] },
        { element: 'H', position: { x: 120, y: 80 }, bonds: [0] },
        { element: 'H', position: { x: 80, y: 120 }, bonds: [0] },
        { element: 'H', position: { x: 120, y: 120 }, bonds: [0] }
      ];
      molecule.bonds = [
        { atom1: 0, atom2: 1, order: 1, type: 'single' },
        { atom1: 0, atom2: 2, order: 1, type: 'single' },
        { atom1: 0, atom2: 3, order: 1, type: 'single' },
        { atom1: 0, atom2: 4, order: 1, type: 'single' }
      ];
    }
    // Default: single carbon
    else {
      molecule.atoms = [
        { element: 'C', position: { x: 100, y: 100 }, bonds: [] }
      ];
    }

    return molecule;
  }

  /**
   * Export canvas as image
   */
  exportImage(format: 'png' | 'jpg' = 'png'): string {
    return this.canvas.toDataURL(`image/${format}`);
  }

  /**
   * Reset view to default
   */
  resetView(): void {
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.centerMolecule();
    this.render();
  }

  /**
   * Set molecule scale
   */
  setScale(scale: number): void {
    this.scale = Math.max(0.1, Math.min(5, scale));
    this.render();
  }

  /**
   * Get current molecule data
   */
  getMolecule(): Molecule2D | null {
    return this.molecule;
  }
}

export default Canvas2DRenderer;
