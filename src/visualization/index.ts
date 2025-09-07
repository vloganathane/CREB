/**
 * Integration with CREB Core Types and Systems
 */

import type { ElementCount } from '../types';
import { Canvas2DRenderer } from './Canvas2DRenderer';
import { MolecularVisualization, MolecularDataUtils } from './SimplifiedMolecularVisualization';

/**
 * Simple molecule interface for visualization
 */
export interface MoleculeForVisualization {
  elements: string[];
  formula?: string;
}

/**
 * Convert CREB-style molecule to visualization format
 */
export function convertMoleculeToVisualization(molecule: MoleculeForVisualization) {
  const atoms = molecule.elements.map((element: string, index: number) => ({
    element,
    x: Math.random() * 4 - 2, // Random coordinates for now
    y: Math.random() * 4 - 2,
    z: Math.random() * 4 - 2
  }));

  // Simple bond generation based on element count
  const bonds = [];
  for (let i = 0; i < atoms.length - 1; i++) {
    bonds.push({
      atom1: i,
      atom2: i + 1,
      order: 1
    });
  }

  return {
    atoms,
    bonds,
    smiles: molecule.formula || `${molecule.elements.join('')}`
  };
}

/**
 * Create molecular visualization from molecule data
 */
export function createMolecularVisualization(
  container: any,
  molecule: MoleculeForVisualization,
  options?: any
) {
  const config = {
    container,
    width: 600,
    height: 400,
    mode: 'both' as const,
    ...options
  };

  const visualization = new MolecularVisualization(config);
  const moleculeData = convertMoleculeToVisualization(molecule);
  
  visualization.loadMolecule(moleculeData);
  
  return visualization;
}

/**
 * Enhanced visualization utilities for CREB
 */
export class CREBVisualizationUtils {
  /**
   * Create 2D structure from molecule data
   */
  static create2DStructure(molecule: MoleculeForVisualization, canvas?: any) {
    if (!canvas) {
      // Create fallback canvas
      canvas = {
        width: 400,
        height: 300,
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

    const renderer = new Canvas2DRenderer(canvas);
    
    // Convert molecule to 2D format
    const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
    renderer.loadMolecule(molecule2d);
    
    return renderer;
  }

  /**
   * Generate sample molecules for different chemical reactions
   */
  static generateReactionMolecules() {
    return {
      reactants: [
        MolecularDataUtils.generateSampleMolecule('water'),
        MolecularDataUtils.generateSampleMolecule('methane')
      ],
      products: [
        MolecularDataUtils.generateSampleMolecule('benzene')
      ]
    };
  }

  /**
   * Visualize chemical reaction
   */
  static visualizeReaction(
    container: any,
    reactants: MoleculeForVisualization[],
    products: MoleculeForVisualization[]
  ) {
    const visualization = new MolecularVisualization({
      container,
      width: 800,
      height: 400,
      mode: '2d'
    });

    // For now, just show the first reactant
    if (reactants.length > 0) {
      const moleculeData = convertMoleculeToVisualization(reactants[0]);
      visualization.loadMolecule(moleculeData);
    }

    return visualization;
  }

  /**
   * Create molecule from element count data
   */
  static createMoleculeFromElementCount(elementCount: ElementCount): MoleculeForVisualization {
    const elements: string[] = [];
    let formula = '';

    for (const [element, count] of Object.entries(elementCount)) {
      for (let i = 0; i < count; i++) {
        elements.push(element);
      }
      formula += count > 1 ? `${element}${count}` : element;
    }

    return { elements, formula };
  }
}

export { Canvas2DRenderer, MolecularVisualization, MolecularDataUtils };
