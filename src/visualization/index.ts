/**
 * Integration with CREB Core Types and Systems
 * Enhanced with SVG Export Capabilities and Advanced Molecular Visualization
 * Now includes RDKit.js and 3Dmol.js wrappers for comprehensive molecular processing
 */

import type { ElementCount } from '../types';
import { Canvas2DRenderer } from './Canvas2DRenderer';
import { SVGRenderer } from './SVGRenderer';
import { MolecularVisualization, MolecularDataUtils } from './SimplifiedMolecularVisualization';

// Export new enhanced visualization components
export { RDKitWrapper, type RDKitMolecule, type MolecularProperties } from './RDKitWrapper';
export { Mol3DWrapper, type Mol3DMolecule, type Mol3DStyle } from './Mol3DWrapper';
export { PubChemIntegration, type PubChemCompound, type PubChemSearchResult, type CompoundSearchOptions } from './PubChemIntegration';
export { 
  EnhancedMolecularVisualization, 
  createEnhancedVisualization,
  EnhancedVisualizationUtils,
  type EnhancedVisualizationConfig,
  type MolecularAnalysisResult,
  type VisualizationExports
} from './EnhancedMolecularVisualization';

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
   * Create 2D structure from molecule data with SVG export support
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
   * Create SVG renderer for molecule
   */
  static createSVGStructure(
    molecule: MoleculeForVisualization,
    options?: {
      width?: number;
      height?: number;
      interactive?: boolean;
      backgroundColor?: string;
    }
  ) {
    const svgRenderer = new SVGRenderer({
      width: options?.width || 400,
      height: options?.height || 300,
      backgroundColor: options?.backgroundColor || '#ffffff',
      includeInteractivity: options?.interactive || false
    });

    const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
    svgRenderer.loadMolecule(molecule2d);
    
    return svgRenderer;
  }

  /**
   * Export molecule in multiple formats
   */
  static exportMolecule(
    molecule: MoleculeForVisualization,
    formats: ('png' | 'jpg' | 'svg')[] = ['svg'],
    canvas?: any
  ): Record<string, string> {
    return multiFormatExport(molecule, canvas, { formats });
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

export { Canvas2DRenderer, SVGRenderer, MolecularVisualization, MolecularDataUtils };

/**
 * Quick SVG Export Function
 * Convenience function for quick SVG generation
 */
export function quickSVGExport(
  molecule: MoleculeForVisualization,
  options?: {
    width?: number;
    height?: number;
    interactive?: boolean;
    includeMetadata?: boolean;
  }
): string {
  const svgRenderer = new SVGRenderer({
    width: options?.width || 600,
    height: options?.height || 400,
    includeInteractivity: options?.interactive || false
  });

  // Convert CREB molecule to 2D format
  const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
  svgRenderer.loadMolecule(molecule2d);
  
  return svgRenderer.exportSVG({
    interactive: options?.interactive,
    includeMetadata: options?.includeMetadata
  });
}

/**
 * Multi-format Export Function
 * Export molecule in multiple formats simultaneously
 */
export function multiFormatExport(
  molecule: MoleculeForVisualization,
  canvas?: any,
  options?: {
    formats?: ('png' | 'jpg' | 'svg')[];
    svgOptions?: {
      interactive?: boolean;
      includeMetadata?: boolean;
      animations?: boolean;
    };
  }
): Record<string, string> {
  const results: Record<string, string> = {};
  const formats = options?.formats || ['png', 'svg'];

  // Canvas-based exports (PNG, JPG)
  if (canvas && (formats.includes('png') || formats.includes('jpg'))) {
    const canvasRenderer = new Canvas2DRenderer(canvas);
    const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
    canvasRenderer.loadMolecule(molecule2d);

    if (formats.includes('png')) {
      results.png = canvasRenderer.exportImage('png');
    }
    if (formats.includes('jpg')) {
      results.jpg = canvasRenderer.exportImage('jpg');
    }
  }

  // SVG export
  if (formats.includes('svg')) {
    results.svg = quickSVGExport(molecule, {
      interactive: options?.svgOptions?.interactive,
      includeMetadata: options?.svgOptions?.includeMetadata
    });
  }

  return results;
}

/**
 * SVG Export Features and Version
 */
export const SVG_FEATURES = {
  INTERACTIVE: true,
  ANIMATIONS: true,
  METADATA: true,
  SCALABLE: true,
  PUBLICATION_READY: true
} as const;

export const VISUALIZATION_VERSION = '1.6.0-svg';
