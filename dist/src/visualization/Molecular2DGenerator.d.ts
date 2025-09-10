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
export declare class Molecular2DGenerator {
    private static readonly BOND_LENGTH;
    private static readonly AROMATIC_RING_RADIUS;
    private static readonly ANGLE_120;
    private static readonly ANGLE_109;
    /**
     * Generate caffeine structure with proper coordinates
     */
    static generateCaffeine(): {
        atoms: Atom3D[];
        bonds: Bond3D[];
        rings: Ring[];
    };
    /**
     * Generate benzene with proper hexagonal geometry
     */
    static generateBenzene(): {
        atoms: Atom3D[];
        bonds: Bond3D[];
        rings: Ring[];
    };
    /**
     * Generate water with proper bent geometry
     */
    static generateWater(): {
        atoms: Atom3D[];
        bonds: Bond3D[];
    };
    /**
     * Generate methane with tetrahedral geometry
     */
    static generateMethane(): {
        atoms: Atom3D[];
        bonds: Bond3D[];
    };
    /**
     * Generate ethylene with proper double bond geometry
     */
    static generateEthylene(): {
        atoms: Atom3D[];
        bonds: Bond3D[];
    };
    /**
     * Convert molecular structure to Canvas2D format
     */
    static toCanvas2DFormat(structure: {
        atoms: Atom3D[];
        bonds: Bond3D[];
    }): {
        atoms: Array<{
            element: string;
            position: {
                x: number;
                y: number;
            };
            bonds: number[];
        }>;
        bonds: Array<{
            atom1: number;
            atom2: number;
            order: number;
            type: string;
        }>;
    };
    /**
     * Enhanced SMILES to 2D converter with proper geometry
     */
    static advancedSMILESTo2D(smiles: string): {
        atoms: Array<{
            element: string;
            position: {
                x: number;
                y: number;
            };
            bonds: number[];
        }>;
        bonds: Array<{
            atom1: number;
            atom2: number;
            order: number;
            type: string;
        }>;
    };
}
export default Molecular2DGenerator;
//# sourceMappingURL=Molecular2DGenerator.d.ts.map