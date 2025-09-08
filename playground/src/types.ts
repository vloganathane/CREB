// Types for the playground
export interface ExecutionResult {
  success: boolean;
  result?: unknown;
  results?: string[];
  error?: string;
  output?: string;
  visualData?: VisualizationData;
}

export interface ChemicalResult {
  equation?: string;
  coefficients?: number[];
  isBalanced?: boolean;
  reactants?: string[];
  products?: string[];
  compoundData?: Record<string, unknown>;
  visualization?: {
    type: '2d' | '3d';
    data: Record<string, unknown>;
  };
}

export interface ExampleCode {
  id: string;
  title: string;
  description: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'balancing' | 'stoichiometry' | 'combustion' | 'aqueous' | 'visualization' | 'demo';
}

export interface VisualizationData {
  type: '2d' | '3d' | 'equation' | 'chart';
  data: Record<string, unknown>;
  molecules?: MoleculeData[];
  equations?: string[];
}

export interface MoleculeData {
  formula: string;
  structure?: string; // SMILES or 3D coordinates
  name?: string;
  properties?: Record<string, string | number | boolean>;
}

export interface APIMethod {
  name: string;
  description: string;
  parameters: Parameter[];
  returnType: string;
  example: string;
  category: 'balancing' | 'visualization' | 'stoichiometry' | 'thermodynamics' | 'utilities';
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string | number | boolean;
}
