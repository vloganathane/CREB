/**
 * Static Molecule Viewer - Phase 1 Implementation
 * Connects validated EnhancedChemicalEquationBalancer to Mol3DWrapper
 * for side-by-side reactants/products display
 */

import { EnhancedChemicalEquationBalancer, EnhancedBalancedEquation } from '../enhancedBalancer';
import { Mol3DWrapper } from './Mol3DWrapper';
import { PubChemIntegration } from './PubChemIntegration';
import { CREBError, ErrorCategory, ErrorSeverity } from '../core/errors/CREBError';

export interface StaticViewerOptions {
  containerElement: HTMLElement;
  showProgress?: boolean;
  enableInteraction?: boolean;
  backgroundColor?: string;
}

export interface MoleculeDisplay {
  formula: string;
  name: string;
  mol3dId: string;
  structureData?: string;
  source: 'PubChem' | 'RDKit' | 'Unknown';
  error?: string;
}

export class StaticMoleculeViewer {
  private balancer: EnhancedChemicalEquationBalancer;
  private mol3dWrapper: Mol3DWrapper;
  private pubchemIntegration: PubChemIntegration;
  private container: HTMLElement;
  private options: StaticViewerOptions;

  constructor(options: StaticViewerOptions, pubchemIntegration?: PubChemIntegration) {
    this.options = options;
    this.container = options.containerElement;
    this.pubchemIntegration = pubchemIntegration || new PubChemIntegration();
    this.balancer = new EnhancedChemicalEquationBalancer(this.pubchemIntegration);
    
    // Initialize 3D viewer
    this.mol3dWrapper = new Mol3DWrapper(this.container, {
      backgroundColor: options.backgroundColor || '#ffffff',
      antialias: true,
      enableWebGL: true
    });
  }

  /**
   * Main method: Display equation as side-by-side molecular structures
   */
  async displayEquation(equation: string): Promise<void> {
    try {
      this.showProgress('Analyzing equation...', 10);
      
      // Step 1: Use our validated pipeline to balance and enrich with PubChem data
      const balancedResult = await this.balancer.balanceWithPubChemData(equation);
      
      this.showProgress('Loading 3D structures...', 40);
      
      // Step 2: Load molecular structures for visualization
      const reactantDisplays = await this.loadMolecularStructures(balancedResult.reactants, 'reactant');
      const productDisplays = await this.loadMolecularStructures(balancedResult.products, 'product');
      
      this.showProgress('Rendering 3D visualization...', 80);
      
      // Step 3: Display side-by-side
      await this.renderSideBySide(reactantDisplays, productDisplays, balancedResult);
      
      this.showProgress('Complete!', 100);
      
    } catch (error) {
      this.handleError(error, equation);
    }
  }

  /**
   * Load 3D structures for molecules using our PubChem integration
   */
  private async loadMolecularStructures(
    formulas: string[], 
    type: 'reactant' | 'product'
  ): Promise<MoleculeDisplay[]> {
    const displays: MoleculeDisplay[] = [];
    
    for (let i = 0; i < formulas.length; i++) {
      const formula = formulas[i];
      const mol3dId = `${type}_${i}_${formula}`;
      
      try {
        // Use our validated compound info pipeline
        const compoundInfo = await this.balancer.getCompoundInfo(formula);
        
        if (compoundInfo.isValid && compoundInfo.pubchemData) {
          // Try to get SDF structure from PubChem for 3D rendering
          const structureData = await this.getPubChem3DStructure(compoundInfo.cid!);
          
          displays.push({
            formula,
            name: compoundInfo.name,
            mol3dId,
            structureData,
            source: 'PubChem'
          });
        } else {
          // Handle compounds not found in PubChem
          displays.push({
            formula,
            name: formula,
            mol3dId,
            source: 'Unknown',
            error: compoundInfo.error || 'Structure not available'
          });
        }
      } catch (error) {
        displays.push({
          formula,
          name: formula,
          mol3dId,
          source: 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return displays;
  }

  /**
   * Get 3D SDF structure from PubChem for rendering
   */
  private async getPubChem3DStructure(cid: number): Promise<string | undefined> {
    try {
      // This would use the real PubChem SDF endpoint
      // For now, we'll simulate the structure data request
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`);
      
      if (response.ok) {
        return await response.text();
      }
      
      return undefined;
    } catch (error) {
      console.warn(`Could not fetch 3D structure for CID ${cid}:`, error);
      return undefined;
    }
  }

  /**
   * Render molecules in side-by-side layout: Reactants | → | Products
   */
  private async renderSideBySide(
    reactants: MoleculeDisplay[],
    products: MoleculeDisplay[],
    balancedResult: EnhancedBalancedEquation
  ): Promise<void> {
    // Clear any existing content
    await this.mol3dWrapper.clear();
    
    // Create layout sections
    this.createLayoutSections();
    
    // Render reactants on the left
    await this.renderMoleculeGroup(reactants, 'reactants');
    
    // Render products on the right  
    await this.renderMoleculeGroup(products, 'products');
    
    // Add reaction arrow and equation info
    this.addReactionInfo(balancedResult);
    
    // Apply styling and camera positioning
    this.applyVisualizationStyling();
  }

  /**
   * Render a group of molecules (reactants or products)
   */
  private async renderMoleculeGroup(molecules: MoleculeDisplay[], groupType: string): Promise<void> {
    for (const molecule of molecules) {
      if (molecule.structureData) {
        // Add molecule to 3D scene
        await this.mol3dWrapper.addMolecule(molecule.mol3dId, molecule.structureData, 'sdf');
      } else {
        // Show placeholder for missing structures
        this.addMoleculePlaceholder(molecule, groupType);
      }
    }
  }

  /**
   * Create HTML layout sections for reactants and products
   */
  private createLayoutSections(): void {
    this.container.innerHTML = `
      <div class="reaction-viewer">
        <div class="reactants-section">
          <h3>Reactants</h3>
          <div class="molecules-container" id="reactants-3d"></div>
          <div class="molecule-list" id="reactants-list"></div>
        </div>
        
        <div class="reaction-arrow">
          <div class="arrow">→</div>
          <div class="reaction-info" id="reaction-info"></div>
        </div>
        
        <div class="products-section">
          <h3>Products</h3>
          <div class="molecules-container" id="products-3d"></div>
          <div class="molecule-list" id="products-list"></div>
        </div>
      </div>
    `;
  }

  /**
   * Add reaction information and equation details
   */
  private addReactionInfo(balancedResult: EnhancedBalancedEquation): void {
    const reactionInfo = document.getElementById('reaction-info');
    if (reactionInfo) {
      reactionInfo.innerHTML = `
        <div class="balanced-equation">${balancedResult.equation}</div>
        <div class="coefficients">Coefficients: [${balancedResult.coefficients.join(', ')}]</div>
        ${balancedResult.validation ? `
          <div class="validation">
            <div class="mass-balanced">Mass Balanced: ${balancedResult.validation.massBalanced ? '✅' : '❌'}</div>
            <div class="charge-balanced">Charge Balanced: ${balancedResult.validation.chargeBalanced ? '✅' : '❌'}</div>
          </div>
        ` : ''}
      `;
    }
  }

  /**
   * Add placeholder for molecules without 3D structures
   */
  private addMoleculePlaceholder(molecule: MoleculeDisplay, groupType: string): void {
    const listContainer = document.getElementById(`${groupType}-list`);
    if (listContainer) {
      const placeholder = document.createElement('div');
      placeholder.className = 'molecule-placeholder';
      placeholder.innerHTML = `
        <div class="molecule-name">${molecule.name}</div>
        <div class="molecule-formula">${molecule.formula}</div>
        <div class="error-message">${molecule.error || 'No 3D structure available'}</div>
      `;
      listContainer.appendChild(placeholder);
    }
  }

  /**
   * Apply 3D visualization styling
   */
  private applyVisualizationStyling(): void {
    this.mol3dWrapper.setStyle({
      stick: { 
        radius: 0.15,
        colorscheme: 'Jmol'
      },
      sphere: { 
        scale: 0.25,
        colorscheme: 'element'
      }
    });
    
    this.mol3dWrapper.render();
  }

  /**
   * Show progress indicator
   */
  private showProgress(message: string, percent: number): void {
    if (this.options.showProgress) {
      // Simple progress indication - can be enhanced with proper UI components
      console.log(`Progress: ${percent}% - ${message}`);
    }
  }

  /**
   * Handle errors with user-friendly messages
   */
  private handleError(error: any, equation: string): void {
    const errorMessage = error instanceof CREBError 
      ? error.message 
      : 'An unexpected error occurred while processing the equation.';
    
    this.container.innerHTML = `
      <div class="error-display">
        <h3>❌ Error Processing Equation</h3>
        <div class="equation">Input: "${equation}"</div>
        <div class="error-message">${errorMessage}</div>
        <div class="suggestions">
          <p>Suggestions:</p>
          <ul>
            <li>Check chemical formula spelling</li>
            <li>Ensure equation is properly balanced</li>
            <li>Try simpler compounds (H2O, CO2, CH4)</li>
          </ul>
        </div>
      </div>
    `;
  }
}
