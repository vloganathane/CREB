/**
 * @fileoverview Chemistry-specific validation rules
 * 
 * Provides specialized validation rules for chemistry data:
 * - Chemical formula validation rules
 * - Molecular weight consistency rules
 * - Stoichiometry validation rules
 * - Chemical property correlation rules
 * 
 * @version 1.0.0
 * @author CREB Team
 */

import {
  ValidationContext,
  RuleResult,
  ValidationSeverity,
  ChemicalCompound
} from '../types';
import { SyncRule, AsyncRule } from './BaseRule';

// ============================================================================
// Chemical Formula Rules
// ============================================================================

/**
 * Rule to validate basic chemical formula format
 */
export class ChemicalFormulaFormatRule extends SyncRule<string> {
  constructor() {
    super(
      'chemical-formula-format',
      'Validate basic chemical formula format',
      { priority: 100, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  protected validateSync(value: string, context: ValidationContext): RuleResult {
    const formula = value.trim();
    
    // Basic chemical formula pattern: Element symbols followed by optional numbers
    const basicPattern = /^[A-Z][a-z]?(\d*[A-Z][a-z]?\d*)*$/;
    
    if (basicPattern.test(formula)) {
      return this.createSuccess({ formula });
    } else {
      return this.createFailure(
        'INVALID_FORMULA_FORMAT',
        `Invalid chemical formula format: ${formula}`,
        context.path,
        ValidationSeverity.ERROR,
        [
          'Use standard chemical notation (e.g., H2O, CaCl2)',
          'Element symbols must start with uppercase letter',
          'Use numbers for atom counts'
        ],
        { formula },
        value
      );
    }
  }
}

/**
 * Rule to validate element symbols in formulas
 */
export class ValidElementSymbolsRule extends SyncRule<string> {
  private readonly validElements = new Set([
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'
  ]);

  constructor() {
    super(
      'valid-element-symbols',
      'Validate that all element symbols in formula are valid',
      { priority: 90, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'string';
  }

  protected validateSync(value: string, context: ValidationContext): RuleResult {
    const formula = value.trim();
    const elementPattern = /[A-Z][a-z]?/g;
    const invalidElements: string[] = [];
    let match;

    while ((match = elementPattern.exec(formula)) !== null) {
      const element = match[0];
      if (!this.validElements.has(element)) {
        invalidElements.push(element);
      }
    }

    if (invalidElements.length === 0) {
      return this.createSuccess({ formula });
    } else {
      return this.createFailure(
        'INVALID_ELEMENT_SYMBOLS',
        `Invalid element symbols found: ${invalidElements.join(', ')}`,
        context.path,
        ValidationSeverity.ERROR,
        [
          'Check periodic table for correct element symbols',
          'Ensure proper capitalization (e.g., Ca not CA)',
          'Remove any non-element symbols'
        ],
        { invalidElements, formula },
        value
      );
    }
  }
}

/**
 * Rule to validate molecular weight consistency
 */
export class MolecularWeightConsistencyRule extends SyncRule<ChemicalCompound> {
  private readonly atomicWeights: Record<string, number> = {
    'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
    'F': 18.998, 'P': 30.974, 'S': 32.06, 'Cl': 35.45,
    'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
    'Zn': 65.38, 'Br': 79.904, 'Ag': 107.868, 'I': 126.90
  };

  constructor() {
    super(
      'molecular-weight-consistency',
      'Validate molecular weight matches formula',
      { priority: 80, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'object' && 
           value !== null && 
           'formula' in value && 
           'molecularWeight' in value &&
           typeof value.formula === 'string' &&
           typeof value.molecularWeight === 'number';
  }

  protected validateSync(value: ChemicalCompound, context: ValidationContext): RuleResult {
    const { formula, molecularWeight } = value;
    
    if (!formula || molecularWeight === undefined) {
      return this.createSuccess({ skipped: 'Missing formula or molecular weight' });
    }

    try {
      const calculatedWeight = this.calculateMolecularWeight(formula);
      const difference = Math.abs(calculatedWeight - molecularWeight);
      const tolerance = Math.max(0.1, calculatedWeight * 0.01); // 1% or 0.1, whichever is larger

      if (difference <= tolerance) {
        return this.createSuccess({ 
          calculated: calculatedWeight, 
          provided: molecularWeight, 
          difference 
        });
      } else {
        return this.createFailure(
          'MOLECULAR_WEIGHT_MISMATCH',
          `Molecular weight mismatch: calculated ${calculatedWeight.toFixed(3)}, provided ${molecularWeight}`,
          context.path,
          ValidationSeverity.ERROR,
          [
            `Verify molecular weight is ${calculatedWeight.toFixed(3)} g/mol`,
            'Check if formula is correct',
            'Consider isotopic composition effects'
          ],
          { 
            calculated: calculatedWeight, 
            provided: molecularWeight, 
            difference,
            tolerance
          },
          value
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.createFailure(
        'MOLECULAR_WEIGHT_CALCULATION_ERROR',
        `Cannot calculate molecular weight: ${errorMessage}`,
        context.path,
        ValidationSeverity.WARNING,
        ['Check formula format', 'Verify all elements are recognized'],
        { error: errorMessage, formula },
        value
      );
    }
  }

  private calculateMolecularWeight(formula: string): number {
    const elementPattern = /([A-Z][a-z]?)(\d*)/g;
    let totalWeight = 0;
    let match;

    while ((match = elementPattern.exec(formula)) !== null) {
      const element = match[1];
      const count = parseInt(match[2] || '1', 10);
      
      const atomicWeight = this.atomicWeights[element];
      if (atomicWeight === undefined) {
        throw new Error(`Atomic weight not available for element: ${element}`);
      }
      
      totalWeight += atomicWeight * count;
    }

    return totalWeight;
  }
}

// ============================================================================
// Safety Data Rules
// ============================================================================

/**
 * Rule to validate GHS classification format
 */
export class GHSClassificationRule extends SyncRule<string[]> {
  private readonly validGHSCodes = new Set([
    'H200', 'H201', 'H202', 'H203', 'H204', 'H205', // Explosives
    'H220', 'H221', 'H222', 'H223', 'H224', 'H225', 'H226', // Flammable
    'H270', 'H271', 'H272', // Oxidizing
    'H280', 'H281', // Gases under pressure
    'H290', // Corrosive to metals
    'H300', 'H301', 'H302', 'H303', 'H304', 'H305', // Acute toxicity
    'H310', 'H311', 'H312', 'H313', 'H314', 'H315', 'H316', 'H317', 'H318', 'H319',
    'H330', 'H331', 'H332', 'H333', 'H334', 'H335', 'H336', 'H340', 'H341', 'H350',
    'H351', 'H360', 'H361', 'H362', 'H370', 'H371', 'H372', 'H373', 'H400', 'H401',
    'H402', 'H410', 'H411', 'H412', 'H413', 'H420'
  ]);

  constructor() {
    super(
      'ghs-classification',
      'Validate GHS hazard classifications',
      { priority: 70, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }

  protected validateSync(value: string[], context: ValidationContext): RuleResult {
    const invalidCodes = value.filter(code => !this.validGHSCodes.has(code));

    if (invalidCodes.length === 0) {
      return this.createSuccess({ validCodes: value });
    } else {
      return this.createFailure(
        'INVALID_GHS_CODES',
        `Invalid GHS classification codes: ${invalidCodes.join(', ')}`,
        context.path,
        ValidationSeverity.ERROR,
        [
          'Use valid GHS hazard codes (H200-H420)',
          'Check the latest GHS classification system',
          'Remove any non-standard codes'
        ],
        { invalidCodes, validCodes: value.filter(code => this.validGHSCodes.has(code)) },
        value
      );
    }
  }
}

/**
 * Rule to validate flash point reasonableness
 */
export class FlashPointValidationRule extends SyncRule<number> {
  constructor() {
    super(
      'flash-point-validation',
      'Validate flash point is within reasonable range',
      { priority: 60, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'number' && isFinite(value);
  }

  protected validateSync(value: number, context: ValidationContext): RuleResult {
    // Flash point should be reasonable (between -200°C and 500°C)
    const minFlashPoint = -200;
    const maxFlashPoint = 500;

    if (value >= minFlashPoint && value <= maxFlashPoint) {
      return this.createSuccess({ flashPoint: value });
    } else {
      const severity = (value < -300 || value > 1000) 
        ? ValidationSeverity.ERROR 
        : ValidationSeverity.WARNING;

      return this.createFailure(
        'UNREASONABLE_FLASH_POINT',
        `Flash point ${value}°C is outside reasonable range [${minFlashPoint}, ${maxFlashPoint}]`,
        context.path,
        severity,
        [
          `Verify flash point is between ${minFlashPoint}°C and ${maxFlashPoint}°C`,
          'Check measurement conditions and methodology',
          'Consider if substance has unusual properties'
        ],
        { value, minFlashPoint, maxFlashPoint },
        value
      );
    }
  }
}

// ============================================================================
// Cross-Property Validation Rules
// ============================================================================

/**
 * Rule to validate boiling point vs melting point relationship
 */
export class PhaseTransitionConsistencyRule extends SyncRule<ChemicalCompound> {
  constructor() {
    super(
      'phase-transition-consistency',
      'Validate melting point is less than boiling point',
      { priority: 50, cacheable: true }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'object' && 
           value !== null && 
           value.thermodynamics &&
           typeof value.thermodynamics.meltingPoint === 'number' &&
           typeof value.thermodynamics.boilingPoint === 'number';
  }

  protected validateSync(value: ChemicalCompound, context: ValidationContext): RuleResult {
    const { meltingPoint, boilingPoint } = value.thermodynamics!;

    if (meltingPoint! < boilingPoint!) {
      return this.createSuccess({ meltingPoint, boilingPoint });
    } else {
      return this.createFailure(
        'INVALID_PHASE_TRANSITION',
        `Melting point (${meltingPoint}K) must be less than boiling point (${boilingPoint}K)`,
        context.path,
        ValidationSeverity.ERROR,
        [
          'Verify temperature measurements',
          'Check pressure conditions for measurements',
          'Ensure values are in same units (Kelvin)'
        ],
        { meltingPoint, boilingPoint },
        value
      );
    }
  }
}

/**
 * Async rule to validate CAS number format and check registry
 */
export class CASNumberValidationRule extends AsyncRule<string> {
  constructor() {
    super(
      'cas-number-validation',
      'Validate CAS registry number format and existence',
      { priority: 40, cacheable: true, timeout: 3000 }
    );
  }

  appliesTo(value: any): boolean {
    return typeof value === 'string' && /^\d{2,7}-\d{2}-\d$/.test(value);
  }

  protected async validateAsync(value: string, context: ValidationContext): Promise<RuleResult> {
    // First validate format
    const formatResult = this.validateCASFormat(value);
    if (!formatResult.passed) {
      return formatResult;
    }

    // Then validate checksum
    const checksumResult = this.validateCASChecksum(value);
    if (!checksumResult.passed) {
      return checksumResult;
    }

    // For demo purposes, we'll just validate format and checksum
    // In a real implementation, you might check against CAS registry
    return this.createSuccess({ 
      casNumber: value, 
      formatValid: true, 
      checksumValid: true 
    });
  }

  private validateCASFormat(casNumber: string): RuleResult {
    const casPattern = /^(\d{2,7})-(\d{2})-(\d)$/;
    const match = casNumber.match(casPattern);

    if (!match) {
      return this.createFailure(
        'INVALID_CAS_FORMAT',
        `Invalid CAS number format: ${casNumber}`,
        [],
        ValidationSeverity.ERROR,
        ['Use format: NNNNNNN-NN-N where N is a digit'],
        { casNumber }
      );
    }

    return this.createSuccess({ casNumber, formatValid: true });
  }

  private validateCASChecksum(casNumber: string): RuleResult {
    const parts = casNumber.split('-');
    const digits = (parts[0] + parts[1]).split('').map(Number);
    const checkDigit = parseInt(parts[2], 10);

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (digits.length - i);
    }

    const calculatedCheck = sum % 10;

    if (calculatedCheck === checkDigit) {
      return this.createSuccess({ 
        casNumber, 
        checksumValid: true, 
        calculatedCheck,
        providedCheck: checkDigit 
      });
    } else {
      return this.createFailure(
        'INVALID_CAS_CHECKSUM',
        `Invalid CAS number checksum: expected ${calculatedCheck}, got ${checkDigit}`,
        [],
        ValidationSeverity.ERROR,
        ['Verify CAS number is correct', 'Check for transcription errors'],
        { 
          casNumber, 
          calculatedCheck, 
          providedCheck: checkDigit 
        }
      );
    }
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create chemical formula format rule
 */
export function createChemicalFormulaFormatRule(): ChemicalFormulaFormatRule {
  return new ChemicalFormulaFormatRule();
}

/**
 * Create valid element symbols rule
 */
export function createValidElementSymbolsRule(): ValidElementSymbolsRule {
  return new ValidElementSymbolsRule();
}

/**
 * Create molecular weight consistency rule
 */
export function createMolecularWeightConsistencyRule(): MolecularWeightConsistencyRule {
  return new MolecularWeightConsistencyRule();
}

/**
 * Create GHS classification rule
 */
export function createGHSClassificationRule(): GHSClassificationRule {
  return new GHSClassificationRule();
}

/**
 * Create flash point validation rule
 */
export function createFlashPointValidationRule(): FlashPointValidationRule {
  return new FlashPointValidationRule();
}

/**
 * Create phase transition consistency rule
 */
export function createPhaseTransitionConsistencyRule(): PhaseTransitionConsistencyRule {
  return new PhaseTransitionConsistencyRule();
}

/**
 * Create CAS number validation rule
 */
export function createCASNumberValidationRule(): CASNumberValidationRule {
  return new CASNumberValidationRule();
}

// ============================================================================
// Pre-built Rule Sets
// ============================================================================

/**
 * Get standard chemical formula validation rules
 */
export function getChemicalFormulaRules() {
  return [
    createChemicalFormulaFormatRule(),
    createValidElementSymbolsRule()
  ];
}

/**
 * Get standard safety data validation rules
 */
export function getSafetyDataRules() {
  return [
    createGHSClassificationRule(),
    createFlashPointValidationRule()
  ];
}

/**
 * Get standard compound validation rules
 */
export function getCompoundValidationRules() {
  return [
    createMolecularWeightConsistencyRule(),
    createPhaseTransitionConsistencyRule(),
    createCASNumberValidationRule()
  ];
}
