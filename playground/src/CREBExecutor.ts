// Mock CREB-JS implementation for browser compatibility
// TODO: Replace with actual CREB-JS when browser compatibility is resolved
import type { ExecutionResult, VisualizationData, MoleculeData } from './types';

// Mock chemical equation balancer
class MockChemicalEquationBalancer {
  balance(equation: string) {
    // Simple mock implementation
    const cleaned = equation.replace(/\s+/g, ' ').trim();
    
    // Basic H2 + O2 = H2O example
    if (cleaned.includes('H2') && cleaned.includes('O2') && cleaned.includes('H2O')) {
      return {
        equation: '2H2 + O2 = 2H2O',
        coefficients: [2, 1, 2],
        isBalanced: true,
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };
    }
    
    // Basic combustion example
    if (cleaned.includes('CH4') && cleaned.includes('O2')) {
      return {
        equation: 'CH4 + 2O2 = CO2 + 2H2O',
        coefficients: [1, 2, 1, 2],
        isBalanced: true,
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O']
      };
    }
    
    // Default response
    return {
      equation: cleaned,
      coefficients: [1],
      isBalanced: false,
      reactants: [],
      products: []
    };
  }
}

// Mock molecular weight calculator
function mockCalculateMolarWeight(formula: string): number {
  const weights: Record<string, number> = {
    'H2O': 18.015,
    'CO2': 44.009,
    'CH4': 16.043,
    'O2': 31.998,
    'H2': 2.016,
    'C6H12O6': 180.156,
    'NaCl': 58.443,
    'CaCO3': 100.087
  };
  
  return weights[formula] || 0;
}

// Safe execution environment for CREB-JS code
export class CREBExecutor {
  private static instance: CREBExecutor;
  private context: Record<string, unknown>;

  private constructor() {
    this.context = {
      // Mock CREB-JS classes
      ChemicalEquationBalancer: MockChemicalEquationBalancer,
      
      // Mock utilities
      calculateMolarWeight: mockCalculateMolarWeight,
      
      // Helper functions for playground
      console: {
        log: this.captureLog.bind(this),
        error: this.captureError.bind(this),
        warn: this.captureWarn.bind(this),
      },
    };
  }
  }

  public static getInstance(): CREBExecutor {
    if (!CREBExecutor.instance) {
      CREBExecutor.instance = new CREBExecutor();
    }
    return CREBExecutor.instance;
  }

  private outputs: string[] = [];
  private errors: string[] = [];

  private captureLog(...args: unknown[]): void {
    this.outputs.push(args.map(arg => String(arg)).join(' '));
  }

  private captureError(...args: unknown[]): void {
    this.errors.push(args.map(arg => String(arg)).join(' '));
  }

  private captureWarn(...args: unknown[]): void {
    this.outputs.push(`⚠️ ${args.map(arg => String(arg)).join(' ')}`);
  }

  public async executeCode(code: string): Promise<ExecutionResult> {
    this.outputs = [];
    this.errors = [];

    try {
      // Create safe execution context
      const wrappedCode = `
        (function() {
          ${code}
        })();
      `;

      // Use Function constructor for safe evaluation
      const func = new Function(...Object.keys(this.context), wrappedCode);
      const result = func(...Object.values(this.context));

      // Check if result contains visualization data
      const visualData = this.extractVisualizationData(result);

      return {
        success: true,
        result,
        output: this.outputs.join('\n'),
        visualData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        output: this.outputs.join('\n'),
      };
    }
  }

  private extractVisualizationData(result: unknown): VisualizationData | undefined {
    if (!result || typeof result !== 'object') return undefined;

    const data = result as Record<string, unknown>;

    // Check for chemical equation results
    if (data.coefficients && data.equation) {
      return {
        type: 'equation',
        data: data,
        equations: [String(data.equation)],
      };
    }

    // Check for molecular structure data
    if (data.molecules || data.structures) {
      const molecules: MoleculeData[] = [];
      
      if (Array.isArray(data.molecules)) {
        molecules.push(...data.molecules.map((mol: unknown) => ({
          formula: String((mol as Record<string, unknown>)?.formula || ''),
          structure: String((mol as Record<string, unknown>)?.structure || ''),
          name: String((mol as Record<string, unknown>)?.name || ''),
          properties: (mol as Record<string, unknown>)?.properties as Record<string, string | number | boolean> || {},
        })));
      }

      return {
        type: '2d',
        data: data,
        molecules,
      };
    }

    // Check for visualization engine results
    if (data.svg || data.canvas || data.renderData) {
      return {
        type: data.svg ? '2d' : '3d',
        data: data,
      };
    }

    return undefined;
  }

  public getAvailableAPIs(): string[] {
    return Object.keys(this.context).filter(key => typeof this.context[key] === 'function');
  }

  public getAPIDocumentation(apiName: string): string | undefined {
    const api = this.context[apiName];
    if (typeof api === 'function') {
      return `${apiName}: ${api.toString().split('{')[0]}`;
    }
    return undefined;
  }
}

// Singleton instance
export const crebExecutor = CREBExecutor.getInstance();
