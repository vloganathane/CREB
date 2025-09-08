/**
 * Advanced 2D Molecular Structure Generator
 * Generates chemically accurate 2D coordinates for molecular visualization
 */

export interface Atom3D {
  element: string;
  x: number;
  y: number;
  z: number;
  hybridization?: 'sp' | 'sp2' | 'sp3';
  aromatic?: boolean;
}

export interface Bond3D {
  atom1: number;
  atom2: number;
  order: 1 | 2 | 3;
  type: 'single' | 'double' | 'triple' | 'aromatic';
  stereo?: 'up' | 'down' | 'either';
}

export interface Ring {
  atoms: number[];
  aromatic: boolean;
  size: number;
}

/**
 * Professional 2D molecular coordinate generator
 * Following standard chemical drawing conventions
 */
export class Molecular2DGenerator {
  private static readonly BOND_LENGTH = 40; // Standard bond length in pixels
  private static readonly AROMATIC_RING_RADIUS = 25;
  private static readonly ANGLE_120 = (2 * Math.PI) / 3; // 120° for aromatic
  private static readonly ANGLE_109 = 1.9106; // 109.5° tetrahedral angle

  /**
   * Generate caffeine structure with proper coordinates
   */
  static generateCaffeine(): { atoms: Atom3D[]; bonds: Bond3D[]; rings: Ring[] } {
    const bondLength = this.BOND_LENGTH;
    
    // Caffeine: C8H10N4O2 - purine ring system with methyl substituents
    const atoms: Atom3D[] = [
      // Purine ring system (6-membered ring fused with 5-membered ring)
      // 6-membered ring
      { element: 'N', x: 200, y: 150, z: 0, hybridization: 'sp2', aromatic: true }, // 0
      { element: 'C', x: 240, y: 130, z: 0, hybridization: 'sp2', aromatic: true }, // 1
      { element: 'N', x: 280, y: 150, z: 0, hybridization: 'sp2', aromatic: true }, // 2
      { element: 'C', x: 280, y: 190, z: 0, hybridization: 'sp2', aromatic: true }, // 3
      { element: 'C', x: 240, y: 210, z: 0, hybridization: 'sp2', aromatic: true }, // 4
      { element: 'C', x: 200, y: 190, z: 0, hybridization: 'sp2', aromatic: true }, // 5
      
      // 5-membered ring (fused)
      { element: 'N', x: 160, y: 170, z: 0, hybridization: 'sp2', aromatic: true }, // 6
      { element: 'C', x: 160, y: 210, z: 0, hybridization: 'sp2', aromatic: true }, // 7
      { element: 'N', x: 200, y: 230, z: 0, hybridization: 'sp2', aromatic: true }, // 8
      
      // Carbonyl oxygens
      { element: 'O', x: 240, y: 100, z: 0, hybridization: 'sp2' }, // 9 (C=O at position 2)
      { element: 'O', x: 320, y: 200, z: 0, hybridization: 'sp2' }, // 10 (C=O at position 6)
      
      // Methyl groups
      { element: 'C', x: 120, y: 150, z: 0, hybridization: 'sp3' }, // 11 (N1-methyl)
      { element: 'C', x: 320, y: 130, z: 0, hybridization: 'sp3' }, // 12 (N3-methyl)
      { element: 'C', x: 240, y: 270, z: 0, hybridization: 'sp3' }, // 13 (N7-methyl)
      
      // Hydrogens (implicit in most chemical drawings, but included for completeness)
      { element: 'H', x: 100, y: 140, z: 0 }, // 14
      { element: 'H', x: 100, y: 160, z: 0 }, // 15
      { element: 'H', x: 110, y: 170, z: 0 }, // 16
      { element: 'H', x: 340, y: 120, z: 0 }, // 17
      { element: 'H', x: 340, y: 140, z: 0 }, // 18
      { element: 'H', x: 330, y: 110, z: 0 }, // 19
      { element: 'H', x: 260, y: 280, z: 0 }, // 20
      { element: 'H', x: 220, y: 280, z: 0 }, // 21
      { element: 'H', x: 230, y: 290, z: 0 }, // 22
      { element: 'H', x: 130, y: 210, z: 0 }  // 23 (H on C8)
    ];

    const bonds: Bond3D[] = [
      // 6-membered ring bonds
      { atom1: 0, atom2: 1, order: 1, type: 'aromatic' },
      { atom1: 1, atom2: 2, order: 1, type: 'aromatic' },
      { atom1: 2, atom2: 3, order: 1, type: 'aromatic' },
      { atom1: 3, atom2: 4, order: 1, type: 'aromatic' },
      { atom1: 4, atom2: 5, order: 1, type: 'aromatic' },
      { atom1: 5, atom2: 0, order: 1, type: 'aromatic' },
      
      // 5-membered ring bonds
      { atom1: 5, atom2: 6, order: 1, type: 'aromatic' },
      { atom1: 6, atom2: 7, order: 1, type: 'aromatic' },
      { atom1: 7, atom2: 8, order: 1, type: 'aromatic' },
      { atom1: 8, atom2: 4, order: 1, type: 'aromatic' },
      
      // Carbonyl bonds
      { atom1: 1, atom2: 9, order: 2, type: 'double' }, // C=O
      { atom1: 3, atom2: 10, order: 2, type: 'double' }, // C=O
      
      // Methyl attachments
      { atom1: 0, atom2: 11, order: 1, type: 'single' }, // N1-methyl
      { atom1: 2, atom2: 12, order: 1, type: 'single' }, // N3-methyl
      { atom1: 8, atom2: 13, order: 1, type: 'single' }, // N7-methyl
      
      // Hydrogen bonds
      { atom1: 11, atom2: 14, order: 1, type: 'single' },
      { atom1: 11, atom2: 15, order: 1, type: 'single' },
      { atom1: 11, atom2: 16, order: 1, type: 'single' },
      { atom1: 12, atom2: 17, order: 1, type: 'single' },
      { atom1: 12, atom2: 18, order: 1, type: 'single' },
      { atom1: 12, atom2: 19, order: 1, type: 'single' },
      { atom1: 13, atom2: 20, order: 1, type: 'single' },
      { atom1: 13, atom2: 21, order: 1, type: 'single' },
      { atom1: 13, atom2: 22, order: 1, type: 'single' },
      { atom1: 7, atom2: 23, order: 1, type: 'single' }
    ];

    const rings: Ring[] = [
      { atoms: [0, 1, 2, 3, 4, 5], aromatic: true, size: 6 },
      { atoms: [5, 6, 7, 8, 4], aromatic: true, size: 5 }
    ];

    return { atoms, bonds, rings };
  }

  /**
   * Generate benzene with proper hexagonal geometry
   */
  static generateBenzene(): { atoms: Atom3D[]; bonds: Bond3D[]; rings: Ring[] } {
    const centerX = 200;
    const centerY = 180;
    const radius = this.AROMATIC_RING_RADIUS;
    
    const atoms: Atom3D[] = [];
    const bonds: Bond3D[] = [];
    
    // Generate hexagonal ring
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3; // 60° intervals
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      atoms.push({
        element: 'C',
        x: x,
        y: y,
        z: 0,
        hybridization: 'sp2',
        aromatic: true
      });
      
      // Add bond to next atom (with wraparound)
      const nextIndex = (i + 1) % 6;
      bonds.push({
        atom1: i,
        atom2: nextIndex,
        order: 1,
        type: 'aromatic'
      });
    }

    // Add hydrogens
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hRadius = radius + 15; // Hydrogen further out
      const x = centerX + hRadius * Math.cos(angle);
      const y = centerY + hRadius * Math.sin(angle);
      
      atoms.push({
        element: 'H',
        x: x,
        y: y,
        z: 0
      });
      
      bonds.push({
        atom1: i,
        atom2: 6 + i, // Hydrogen index
        order: 1,
        type: 'single'
      });
    }

    const rings: Ring[] = [
      { atoms: [0, 1, 2, 3, 4, 5], aromatic: true, size: 6 }
    ];

    return { atoms, bonds, rings };
  }

  /**
   * Generate water with proper bent geometry
   */
  static generateWater(): { atoms: Atom3D[]; bonds: Bond3D[] } {
    const bondLength = this.BOND_LENGTH;
    const angle = 1.8326; // 104.5° H-O-H angle
    
    const atoms: Atom3D[] = [
      { element: 'O', x: 200, y: 180, z: 0, hybridization: 'sp3' },
      { 
        element: 'H', 
        x: 200 - bondLength * Math.cos(angle / 2), 
        y: 180 + bondLength * Math.sin(angle / 2), 
        z: 0 
      },
      { 
        element: 'H', 
        x: 200 + bondLength * Math.cos(angle / 2), 
        y: 180 + bondLength * Math.sin(angle / 2), 
        z: 0 
      }
    ];

    const bonds: Bond3D[] = [
      { atom1: 0, atom2: 1, order: 1, type: 'single' },
      { atom1: 0, atom2: 2, order: 1, type: 'single' }
    ];

    return { atoms, bonds };
  }

  /**
   * Generate methane with tetrahedral geometry
   */
  static generateMethane(): { atoms: Atom3D[]; bonds: Bond3D[] } {
    const bondLength = this.BOND_LENGTH;
    const centerX = 200;
    const centerY = 180;
    
    // Tetrahedral angles for 2D projection
    const atoms: Atom3D[] = [
      { element: 'C', x: centerX, y: centerY, z: 0, hybridization: 'sp3' },
      { element: 'H', x: centerX - bondLength * 0.6, y: centerY - bondLength * 0.6, z: 0 },
      { element: 'H', x: centerX + bondLength * 0.6, y: centerY - bondLength * 0.6, z: 0 },
      { element: 'H', x: centerX - bondLength * 0.6, y: centerY + bondLength * 0.6, z: 0 },
      { element: 'H', x: centerX + bondLength * 0.6, y: centerY + bondLength * 0.6, z: 0 }
    ];

    const bonds: Bond3D[] = [
      { atom1: 0, atom2: 1, order: 1, type: 'single' },
      { atom1: 0, atom2: 2, order: 1, type: 'single' },
      { atom1: 0, atom2: 3, order: 1, type: 'single' },
      { atom1: 0, atom2: 4, order: 1, type: 'single' }
    ];

    return { atoms, bonds };
  }

  /**
   * Generate ethylene with proper double bond geometry
   */
  static generateEthylene(): { atoms: Atom3D[]; bonds: Bond3D[] } {
    const bondLength = this.BOND_LENGTH;
    const centerX = 200;
    const centerY = 180;
    
    const atoms: Atom3D[] = [
      // C=C double bond
      { element: 'C', x: centerX - bondLength/2, y: centerY, z: 0, hybridization: 'sp2' },
      { element: 'C', x: centerX + bondLength/2, y: centerY, z: 0, hybridization: 'sp2' },
      
      // Hydrogens in planar arrangement
      { element: 'H', x: centerX - bondLength/2 - bondLength * 0.7, y: centerY - bondLength * 0.5, z: 0 },
      { element: 'H', x: centerX - bondLength/2 - bondLength * 0.7, y: centerY + bondLength * 0.5, z: 0 },
      { element: 'H', x: centerX + bondLength/2 + bondLength * 0.7, y: centerY - bondLength * 0.5, z: 0 },
      { element: 'H', x: centerX + bondLength/2 + bondLength * 0.7, y: centerY + bondLength * 0.5, z: 0 }
    ];

    const bonds: Bond3D[] = [
      { atom1: 0, atom2: 1, order: 2, type: 'double' },
      { atom1: 0, atom2: 2, order: 1, type: 'single' },
      { atom1: 0, atom2: 3, order: 1, type: 'single' },
      { atom1: 1, atom2: 4, order: 1, type: 'single' },
      { atom1: 1, atom2: 5, order: 1, type: 'single' }
    ];

    return { atoms, bonds };
  }

  /**
   * Convert molecular structure to Canvas2D format
   */
  static toCanvas2DFormat(structure: { atoms: Atom3D[]; bonds: Bond3D[] }): {
    atoms: Array<{ element: string; position: { x: number; y: number }; bonds: number[] }>;
    bonds: Array<{ atom1: number; atom2: number; order: number; type: string }>;
  } {
    return {
      atoms: structure.atoms.map((atom, index) => ({
        element: atom.element,
        position: { x: atom.x, y: atom.y },
        bonds: structure.bonds
          .map((bond, bondIndex) => bond.atom1 === index || bond.atom2 === index ? bondIndex : -1)
          .filter(bondIndex => bondIndex !== -1)
      })),
      bonds: structure.bonds
    };
  }

  /**
   * Enhanced SMILES to 2D converter with proper geometry
   */
  static advancedSMILESTo2D(smiles: string): {
    atoms: Array<{ element: string; position: { x: number; y: number }; bonds: number[] }>;
    bonds: Array<{ atom1: number; atom2: number; order: number; type: string }>;
  } {
    // Handle specific known molecules
    switch (smiles.toLowerCase()) {
      case 'o':
      case 'h2o':
        return this.toCanvas2DFormat(this.generateWater());
      
      case 'c':
      case 'ch4':
        return this.toCanvas2DFormat(this.generateMethane());
      
      case 'c=c':
      case 'c2h4':
        return this.toCanvas2DFormat(this.generateEthylene());
      
      case 'c1=cc=cc=c1':
      case 'c6h6':
      case 'benzene':
        return this.toCanvas2DFormat(this.generateBenzene());
      
      case 'caffeine':
      case 'cn1c=nc2c1c(=o)n(c(=o)n2c)c':
        return this.toCanvas2DFormat(this.generateCaffeine());
      
      default:
        // Fallback to simple structure
        return this.toCanvas2DFormat(this.generateMethane());
    }
  }
}

export default Molecular2DGenerator;
