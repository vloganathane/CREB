// Molecule parser utilities for chemical equations
export interface MoleculeInfo {
  name: string;
  formula: string;
  cid?: string;
  coefficient?: number;
  isReactant?: boolean;
  isProduct?: boolean;
}

export interface ParsedReaction {
  reactants: MoleculeInfo[];
  products: MoleculeInfo[];
  equation: string;
  isBalanced: boolean;
}

// Common molecule database with PubChem CIDs
const MOLECULE_DATABASE: Record<string, { name: string; cid: string }> = {
  'H2O': { name: 'Water', cid: '962' },
  'H2': { name: 'Hydrogen', cid: '783' },
  'O2': { name: 'Oxygen', cid: '977' },
  'CO2': { name: 'Carbon Dioxide', cid: '280' },
  'CO': { name: 'Carbon Monoxide', cid: '281' },
  'CH4': { name: 'Methane', cid: '297' },
  'NH3': { name: 'Ammonia', cid: '222' },
  'NaCl': { name: 'Sodium Chloride', cid: '5234' },
  'HCl': { name: 'Hydrochloric Acid', cid: '313' },
  'NaOH': { name: 'Sodium Hydroxide', cid: '14798' },
  'Ca(OH)2': { name: 'Calcium Hydroxide', cid: '6093208' },
  'CaCO3': { name: 'Calcium Carbonate', cid: '10112' },
  'C6H12O6': { name: 'Glucose', cid: '5793' },
  'C2H6O': { name: 'Ethanol', cid: '702' },
  'C6H6': { name: 'Benzene', cid: '241' },
  'C8H10N4O2': { name: 'Caffeine', cid: '2519' },
  'C9H8O4': { name: 'Aspirin', cid: '2244' },
  'C2H4': { name: 'Ethylene', cid: '6325' },
  'C3H8': { name: 'Propane', cid: '6334' },
  'C4H10': { name: 'Butane', cid: '7843' },
  'SO2': { name: 'Sulfur Dioxide', cid: '1119' },
  'H2SO4': { name: 'Sulfuric Acid', cid: '1118' },
  'HNO3': { name: 'Nitric Acid', cid: '944' },
  'NO': { name: 'Nitric Oxide', cid: '145068' },
  'NO2': { name: 'Nitrogen Dioxide', cid: '3032552' },
  'N2': { name: 'Nitrogen', cid: '947' },
  'Cl2': { name: 'Chlorine', cid: '24526' },
  'Br2': { name: 'Bromine', cid: '24408' },
  'I2': { name: 'Iodine', cid: '807' },
  'Fe': { name: 'Iron', cid: '23925' },
  'Cu': { name: 'Copper', cid: '23978' },
  'Zn': { name: 'Zinc', cid: '23994' },
  'Al': { name: 'Aluminum', cid: '5359268' },
  'Mg': { name: 'Magnesium', cid: '5462224' },
  'Ca': { name: 'Calcium', cid: '5460341' },
  'Na': { name: 'Sodium', cid: '5360545' },
  'K': { name: 'Potassium', cid: '5462222' },
};

/**
 * Parse a chemical equation and extract molecules
 */
export function parseChemicalEquation(equation: string): ParsedReaction {
  // Clean and normalize the equation
  const cleanEquation = equation
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/=/g, '→')
    .replace(/-->/g, '→')
    .replace(/->/g, '→');

  // Split into reactants and products
  const [reactantSide, productSide] = cleanEquation.split('→');
  
  if (!reactantSide || !productSide) {
    throw new Error('Invalid equation format. Use → or = to separate reactants and products.');
  }

  const reactants = parseMolecules(reactantSide.trim(), true);
  const products = parseMolecules(productSide.trim(), false);

  return {
    reactants,
    products,
    equation: cleanEquation,
    isBalanced: checkBalance(reactants, products),
  };
}

/**
 * Parse molecules from a side of the equation
 */
function parseMolecules(side: string, isReactant: boolean): MoleculeInfo[] {
  return side
    .split('+')
    .map(term => term.trim())
    .filter(term => term.length > 0)
    .map(term => {
      // Extract coefficient and formula
      const match = term.match(/^(\d*)\s*([A-Z][^+]*?)$/);
      if (!match) return null;

      const [, coeffStr, formula] = match;
      const coefficient = coeffStr ? parseInt(coeffStr, 10) : 1;
      const normalizedFormula = formula.trim();
      
      const moleculeData = MOLECULE_DATABASE[normalizedFormula];
      
      return {
        name: moleculeData?.name || normalizedFormula,
        formula: normalizedFormula,
        cid: moleculeData?.cid,
        coefficient,
        isReactant,
        isProduct: !isReactant,
      } as MoleculeInfo;
    })
    .filter((mol): mol is MoleculeInfo => mol !== null);
}

/**
 * Simple balance check (counts atoms on each side)
 */
function checkBalance(reactants: MoleculeInfo[], products: MoleculeInfo[]): boolean {
  const reactantAtoms = countAtoms(reactants);
  const productAtoms = countAtoms(products);
  
  // Check if all atoms balance
  const allAtoms = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);
  
  return Array.from(allAtoms).every(atom => 
    (reactantAtoms[atom] || 0) === (productAtoms[atom] || 0)
  );
}

/**
 * Count atoms in molecules (simplified)
 */
function countAtoms(molecules: MoleculeInfo[]): Record<string, number> {
  const atomCounts: Record<string, number> = {};
  
  molecules.forEach(molecule => {
    const { formula, coefficient = 1 } = molecule;
    
    // Simple regex to extract atoms and their counts
    const atomMatches = formula.match(/([A-Z][a-z]?)(\d*)/g) || [];
    
    atomMatches.forEach(atomMatch => {
      const [, element, countStr] = atomMatch.match(/([A-Z][a-z]?)(\d*)/) || [];
      if (element) {
        const count = countStr ? parseInt(countStr, 10) : 1;
        atomCounts[element] = (atomCounts[element] || 0) + (count * coefficient);
      }
    });
  });
  
  return atomCounts;
}

/**
 * Get molecules with PubChem CIDs for 3D visualization
 */
export function getMoleculesForVisualization(parsed: ParsedReaction): MoleculeInfo[] {
  const allMolecules = [...parsed.reactants, ...parsed.products];
  return allMolecules.filter(mol => mol.cid);
}

/**
 * Generate balanced equation suggestion
 */
export function suggestBalancedEquation(equation: string): string | null {
  try {
    const parsed = parseChemicalEquation(equation);
    
    // Simple balancing for common reactions
    const balancingRules: Record<string, string> = {
      'H2 + O2 → H2O': '2H2 + O2 → 2H2O',
      'CH4 + O2 → CO2 + H2O': 'CH4 + 2O2 → CO2 + 2H2O',
      'C2H6 + O2 → CO2 + H2O': '2C2H6 + 7O2 → 4CO2 + 6H2O',
      'N2 + H2 → NH3': 'N2 + 3H2 → 2NH3',
      'CaCO3 → CaO + CO2': 'CaCO3 → CaO + CO2',
      'Na + Cl2 → NaCl': '2Na + Cl2 → 2NaCl',
      'Fe + O2 → Fe2O3': '4Fe + 3O2 → 2Fe2O3',
      'Al + O2 → Al2O3': '4Al + 3O2 → 2Al2O3',
    };
    
    const normalizedInput = parsed.equation
      .replace(/\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return balancingRules[normalizedInput] || null;
  } catch {
    return null;
  }
}

/**
 * Extract all unique molecules from code
 */
export function extractMoleculesFromCode(code: string): MoleculeInfo[] {
  const molecules: MoleculeInfo[] = [];
  const equationRegex = /['"`]([^'"`]*[→=].*?)['"`]/g;
  
  let match;
  while ((match = equationRegex.exec(code)) !== null) {
    try {
      const parsed = parseChemicalEquation(match[1]);
      molecules.push(...parsed.reactants, ...parsed.products);
    } catch {
      // Ignore invalid equations
    }
  }
  
  // Remove duplicates
  const unique = molecules.filter((mol, index, arr) => 
    arr.findIndex(m => m.formula === mol.formula) === index
  );
  
  return unique;
}
