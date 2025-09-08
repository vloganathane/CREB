/**
 * Enhanced Canvas2DRenderer with Real PubChem Integration
 * Replaces mock data with live molecular structures from PubChem database
 */

// Type definitions for molecular structures
export interface Atom {
  element: string;
  x: number;
  y: number;
  charge?: number;
}

export interface Bond {
  from: number;
  to: number;
  order: number;
  type: 'single' | 'double' | 'triple' | 'aromatic';
}

export interface Molecule2D {
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  properties?: {
    pubchemCID?: number;
    source?: string;
    [key: string]: any;
  };
}

export interface PubChemAtom {
  aid: number;
  element: number;
  x: number;
  y: number;
  z?: number;
  charge?: number;
}

export interface PubChemBond {
  aid1: number;
  aid2: number;
  order: number;
}

export interface PubChemRecord {
  atoms: {
    aid: number[];
    element: number[];
    charge?: Array<{ aid: number; value: number }>;
  };
  bonds: {
    aid1: number[];
    aid2: number[];
    order: number[];
  };
  coords?: Array<{
    type: number[];
    aid: number[];
    conformers: Array<{
      x: number[];
      y: number[];
      z?: number[];
    }>;
  }>;
}

export class PubChemCanvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentMolecule: Molecule2D | null = null;
  private scale: number = 1;
  private offset: { x: number; y: number } = { x: 0, y: 0 };
  
  // Element symbol lookup table
  private elementSymbols: { [key: number]: string } = {
    1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O',
    9: 'F', 10: 'Ne', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P',
    16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca', 35: 'Br', 53: 'I'
  };
  
  // Element colors (CPK coloring scheme)
  private elementColors: { [key: string]: string } = {
    'H': '#ffffff', 'C': '#303030', 'N': '#3050f8', 'O': '#ff0d0d',
    'F': '#90e050', 'S': '#ffff30', 'Cl': '#1ff01f', 'Br': '#a62929',
    'I': '#940094', 'P': '#ff8000', 'B': '#ffb5b5', 'Li': '#cc80ff',
    'Na': '#ab5cf2', 'Mg': '#8aff00', 'Al': '#bfa6a6', 'Si': '#f0c8a0',
    'K': '#8f40d4', 'Ca': '#3dff00', 'default': '#cccccc'
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupInteractivity();
  }

  /**
   * Load a compound from PubChem by CID
   */
  async loadCompoundByCID(cid: number): Promise<void> {
    try {
      // Get compound record with 2D coordinates
      const record = await this.fetchPubChemRecord(cid);
      const molecule = this.convertPubChemToMolecule2D(record, cid);
      
      this.loadMolecule(molecule);
      
    } catch (error) {
      console.error(`Failed to load compound CID ${cid}:`, error);
      throw error;
    }
  }

  /**
   * Load a compound by name (searches PubChem first)
   */
  async loadCompoundByName(name: string): Promise<void> {
    try {
      // Search for CID by name
      const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Compound "${name}" not found in PubChem`);
      }
      
      const data = await response.json();
      const cid = data.IdentifierList.CID[0];
      
      await this.loadCompoundByCID(cid);
      
    } catch (error) {
      console.error(`Failed to load compound "${name}":`, error);
      throw error;
    }
  }

  /**
   * Load a compound by SMILES string
   */
  async loadCompoundBySMILES(smiles: string): Promise<void> {
    try {
      // Search for CID by SMILES
      const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/cids/JSON`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`SMILES "${smiles}" not found in PubChem`);
      }
      
      const data = await response.json();
      const cid = data.IdentifierList.CID[0];
      
      await this.loadCompoundByCID(cid);
      
    } catch (error) {
      console.error(`Failed to load SMILES "${smiles}":`, error);
      throw error;
    }
  }

  /**
   * Fetch full compound record from PubChem
   */
  private async fetchPubChemRecord(cid: number): Promise<PubChemRecord> {
    const recordUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/JSON`;
    const response = await fetch(recordUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch compound record for CID ${cid}`);
    }
    
    const data = await response.json();
    const compound = data.PC_Compounds[0];
    
    return {
      atoms: compound.atoms,
      bonds: compound.bonds,
      coords: compound.coords
    };
  }

  /**
   * Convert PubChem record to our Molecule2D format
   */
  private convertPubChemToMolecule2D(record: PubChemRecord, cid: number): Molecule2D {
    // Find 2D coordinates (type 1)
    let coords2D = record.coords?.find(c => c.type.includes(1));
    
    if (!coords2D && record.coords?.length) {
      // Fallback to first available coordinates
      coords2D = record.coords[0];
    }
    
    if (!coords2D) {
      throw new Error('No 2D coordinates available for this compound');
    }
    
    // Convert atoms
    const atoms: Atom[] = record.atoms.aid.map((aid, index) => {
      const elementNumber = record.atoms.element[index];
      const elementSymbol = this.elementSymbols[elementNumber] || 'X';
      
      // Get charge if available
      const chargeEntry = record.atoms.charge?.find(c => c.aid === aid);
      const charge = chargeEntry?.value || 0;
      
      // Get coordinates (scale and center them)
      const conformer = coords2D!.conformers[0];
      const x = conformer.x[index];
      const y = conformer.y[index];
      
      return {
        element: elementSymbol,
        x: x * 30 + 300, // Scale and center for canvas
        y: y * 30 + 200,
        charge
      };
    });
    
    // Convert bonds
    const bonds: Bond[] = record.bonds.aid1.map((aid1, index) => {
      const aid2 = record.bonds.aid2[index];
      const order = record.bonds.order[index];
      
      // Convert AIDs to array indices (PubChem uses 1-based, we use 0-based)
      const from = record.atoms.aid.indexOf(aid1);
      const to = record.atoms.aid.indexOf(aid2);
      
      return {
        from,
        to,
        order,
        type: this.getBondType(order)
      };
    });
    
    return {
      name: `PubChem CID ${cid}`,
      formula: this.calculateMolecularFormula(atoms),
      atoms,
      bonds,
      properties: {
        pubchemCID: cid,
        source: 'PubChem'
      }
    };
  }

  /**
   * Calculate molecular formula from atoms
   */
  private calculateMolecularFormula(atoms: Atom[]): string {
    const elementCounts: { [key: string]: number } = {};
    
    atoms.forEach(atom => {
      elementCounts[atom.element] = (elementCounts[atom.element] || 0) + 1;
    });
    
    // Order: C, H, then alphabetical
    const orderedElements = Object.keys(elementCounts).sort((a, b) => {
      if (a === 'C') return -1;
      if (b === 'C') return 1;
      if (a === 'H') return -1;
      if (b === 'H') return 1;
      return a.localeCompare(b);
    });
    
    return orderedElements.map(element => {
      const count = elementCounts[element];
      return count === 1 ? element : `${element}${count}`;
    }).join('');
  }

  /**
   * Determine bond type from order
   */
  private getBondType(order: number): 'single' | 'double' | 'triple' | 'aromatic' {
    switch (order) {
      case 1: return 'single';
      case 2: return 'double';
      case 3: return 'triple';
      case 4: return 'aromatic'; // PubChem uses 4 for aromatic
      default: return 'single';
    }
  }

  /**
   * Load molecule and render
   */
  loadMolecule(molecule: Molecule2D): void {
    this.currentMolecule = molecule;
    this.centerMolecule();
    this.render();
  }

  /**
   * Center molecule in canvas
   */
  private centerMolecule(): void {
    if (!this.currentMolecule?.atoms.length) return;
    
    const bounds = this.getMoleculeBounds();
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    const canvasCenterX = this.canvas.width / 2;
    const canvasCenterY = this.canvas.height / 2;
    
    this.offset.x = canvasCenterX - centerX;
    this.offset.y = canvasCenterY - centerY;
  }

  /**
   * Get molecule bounding box
   */
  private getMoleculeBounds() {
    if (!this.currentMolecule?.atoms.length) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    this.currentMolecule.atoms.forEach(atom => {
      minX = Math.min(minX, atom.x);
      maxX = Math.max(maxX, atom.x);
      minY = Math.min(minY, atom.y);
      maxY = Math.max(maxY, atom.y);
    });
    
    return { minX, maxX, minY, maxY };
  }

  /**
   * Render the molecule
   */
  render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.currentMolecule) return;
    
    // Draw bonds first (so they appear behind atoms)
    this.renderBonds();
    
    // Draw atoms on top
    this.renderAtoms();
    
    // Draw molecule info
    this.renderMoleculeInfo();
  }

  /**
   * Render bonds
   */
  private renderBonds(): void {
    if (!this.currentMolecule) return;
    
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.currentMolecule.bonds.forEach(bond => {
      const atom1 = this.currentMolecule!.atoms[bond.from];
      const atom2 = this.currentMolecule!.atoms[bond.to];
      
      const x1 = atom1.x * this.scale + this.offset.x;
      const y1 = atom1.y * this.scale + this.offset.y;
      const x2 = atom2.x * this.scale + this.offset.x;
      const y2 = atom2.y * this.scale + this.offset.y;
      
      this.drawBond(x1, y1, x2, y2, bond.type);
    });
  }

  /**
   * Draw a single bond
   */
  private drawBond(x1: number, y1: number, x2: number, y2: number, type: string): void {
    this.ctx.lineWidth = 2;
    
    switch (type) {
      case 'single':
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        break;
        
      case 'double':
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = (-dy / length) * 3;
        const perpY = (dx / length) * 3;
        
        // First line
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + perpX, y1 + perpY);
        this.ctx.lineTo(x2 + perpX, y2 + perpY);
        this.ctx.stroke();
        
        // Second line
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - perpX, y1 - perpY);
        this.ctx.lineTo(x2 - perpX, y2 - perpY);
        this.ctx.stroke();
        break;
        
      case 'triple':
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Parallel lines
        const dx3 = x2 - x1;
        const dy3 = y2 - y1;
        const length3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
        const perpX3 = (-dy3 / length3) * 4;
        const perpY3 = (dx3 / length3) * 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + perpX3, y1 + perpY3);
        this.ctx.lineTo(x2 + perpX3, y2 + perpY3);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - perpX3, y1 - perpY3);
        this.ctx.lineTo(x2 - perpX3, y2 - perpY3);
        this.ctx.stroke();
        break;
        
      case 'aromatic':
        // Solid line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Dashed inner line
        this.ctx.setLineDash([3, 3]);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + (x2-x1)*0.2, y1 + (y2-y1)*0.2);
        this.ctx.lineTo(x1 + (x2-x1)*0.8, y1 + (y2-y1)*0.8);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 2;
        break;
    }
  }

  /**
   * Render atoms
   */
  private renderAtoms(): void {
    if (!this.currentMolecule) return;
    
    this.currentMolecule.atoms.forEach(atom => {
      const x = atom.x * this.scale + this.offset.x;
      const y = atom.y * this.scale + this.offset.y;
      const radius = 15;
      
      // Get atom color
      const color = this.elementColors[atom.element] || this.elementColors.default;
      
      // Draw atom circle
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
      
      // Draw border
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // Draw element label
      this.ctx.fillStyle = this.getContrastColor(color);
      this.ctx.font = 'bold 14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(atom.element, x, y);
      
      // Draw charge if present
      if (atom.charge && atom.charge !== 0) {
        const chargeText = atom.charge > 0 ? `+${atom.charge}` : `${atom.charge}`;
        this.ctx.font = '10px Arial';
        this.ctx.fillText(chargeText, x + 12, y - 12);
      }
    });
  }

  /**
   * Get contrasting color for text
   */
  private getContrastColor(backgroundColor: string): string {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  /**
   * Render molecule information
   */
  private renderMoleculeInfo(): void {
    if (!this.currentMolecule) return;
    
    this.ctx.fillStyle = '#333333';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    
    // Title
    this.ctx.fillText(this.currentMolecule.name, 10, 10);
    
    // Formula
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Formula: ${this.currentMolecule.formula}`, 10, 30);
    
    // Source info
    if (this.currentMolecule.properties?.source) {
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#666666';
      this.ctx.fillText(`Source: ${this.currentMolecule.properties.source}`, 10, 50);
    }
  }

  /**
   * Export as SVG
   */
  exportSVG(): string {
    // Implementation would create SVG string representation
    // This is a placeholder - full implementation would be similar to our existing SVGRenderer
    return '<svg><!-- SVG export implementation --></svg>';
  }

  /**
   * Setup mouse/touch interactivity
   */
  private setupInteractivity(): void {
    let isDragging = false;
    let lastPos = { x: 0, y: 0 };
    
    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastPos = { x: e.clientX, y: e.clientY };
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        this.offset.x += dx;
        this.offset.y += dy;
        lastPos = { x: e.clientX, y: e.clientY };
        this.render();
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.scale *= scaleFactor;
      this.render();
    });
  }

  /**
   * Reset view to original position and scale
   */
  resetView(): void {
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.centerMolecule();
    this.render();
  }
}

// Export for use in other modules
export default PubChemCanvas2DRenderer;
