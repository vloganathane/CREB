/**
 * Advanced Data Validation Service
 * Provides comprehensive validation for chemical data integrity
 */

import { 
  CompoundDatabase, 
  ExtendedThermodynamicProperties,
  PhysicalProperties,
  SafetyProperties 
} from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100 quality score
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
  suggestedFix?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation: string;
}

export interface ValidationConfig {
  enablePhysicsChecks: boolean;
  enableConsistencyChecks: boolean;
  enableRangeChecks: boolean;
  enableCorrelationChecks: boolean;
  strictMode: boolean;
}

export class DataValidationService {
  private config: ValidationConfig;

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = {
      enablePhysicsChecks: true,
      enableConsistencyChecks: true,
      enableRangeChecks: true,
      enableCorrelationChecks: true,
      strictMode: false,
      ...config
    };
  }

  /**
   * Validate a complete compound entry
   */
  validateCompound(compound: CompoundDatabase): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic structure validation
    errors.push(...this.validateBasicStructure(compound));
    
    // Chemical formula validation
    errors.push(...this.validateFormula(compound.formula));
    
    // Thermodynamic properties validation
    if (compound.thermodynamicProperties) {
      const thermoResult = this.validateThermodynamicProperties(
        compound.thermodynamicProperties,
        compound.formula
      );
      errors.push(...thermoResult.errors);
      warnings.push(...thermoResult.warnings);
    }

    // Physical properties validation
    if (compound.physicalProperties) {
      const physResult = this.validatePhysicalProperties(
        compound.physicalProperties,
        compound.thermodynamicProperties
      );
      errors.push(...physResult.errors);
      warnings.push(...physResult.warnings);
    }

    // Safety data validation
    if (compound.safetyData) {
      errors.push(...this.validateSafetyData(compound.safetyData));
    }

    // Cross-property consistency checks
    if (this.config.enableConsistencyChecks) {
      const consistencyResult = this.validateConsistency(compound);
      errors.push(...consistencyResult.errors);
      warnings.push(...consistencyResult.warnings);
    }

    // Calculate quality score
    const score = this.calculateQualityScore(compound, errors, warnings);

    return {
      isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'major').length === 0,
      errors,
      warnings,
      score
    };
  }

  /**
   * Validate basic compound structure
   */
  private validateBasicStructure(compound: CompoundDatabase): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!compound.formula || compound.formula.trim() === '') {
      errors.push({
        field: 'formula',
        message: 'Chemical formula is required',
        severity: 'critical',
        suggestedFix: 'Provide a valid chemical formula'
      });
    }

    if (!compound.name || compound.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Compound name is required',
        severity: 'major',
        suggestedFix: 'Provide a compound name'
      });
    }

    if (compound.molecularWeight <= 0) {
      errors.push({
        field: 'molecularWeight',
        message: 'Molecular weight must be positive',
        severity: 'critical',
        suggestedFix: 'Calculate molecular weight from formula'
      });
    }

    if (compound.molecularWeight < 0.1 || compound.molecularWeight > 10000) {
      errors.push({
        field: 'molecularWeight',
        message: 'Molecular weight must be between 0.1 and 10000 g/mol',
        severity: 'critical',
        suggestedFix: 'Check molecular weight calculation or formula'
      });
    }

    if (compound.confidence < 0 || compound.confidence > 1) {
      errors.push({
        field: 'confidence',
        message: 'Confidence must be between 0 and 1',
        severity: 'minor',
        suggestedFix: 'Set confidence to 0.8 if uncertain'
      });
    }

    return errors;
  }

  /**
   * Validate chemical formula syntax and composition
   */
  private validateFormula(formula: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!formula) return errors;

    // Check for valid characters (letters, numbers, parentheses)
    if (!/^[A-Za-z0-9()]+$/.test(formula)) {
      errors.push({
        field: 'formula',
        message: 'Formula contains invalid characters',
        severity: 'critical',
        suggestedFix: 'Use only element symbols, numbers, and parentheses'
      });
    }

    // Check balanced parentheses
    let parenCount = 0;
    for (const char of formula) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) {
        errors.push({
          field: 'formula',
          message: 'Unbalanced parentheses in formula',
          severity: 'critical'
        });
        break;
      }
    }
    if (parenCount !== 0) {
      errors.push({
        field: 'formula',
        message: 'Unbalanced parentheses in formula',
        severity: 'critical'
      });
    }

    // Check for valid element symbols
    const elementPattern = /[A-Z][a-z]?/g;
    const elements = formula.match(elementPattern) || [];
    const validElements = new Set([
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

    for (const element of elements) {
      if (!validElements.has(element)) {
        errors.push({
          field: 'formula',
          message: `Invalid element symbol: ${element}`,
          severity: 'critical',
          suggestedFix: 'Check periodic table for correct element symbols'
        });
      }
    }

    return errors;
  }

  /**
   * Validate thermodynamic properties
   */
  private validateThermodynamicProperties(
    props: ExtendedThermodynamicProperties,
    formula: string
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Range checks
    if (this.config.enableRangeChecks) {
      if (props.deltaHf < -5000 || props.deltaHf > 5000) {
        errors.push({
          field: 'thermodynamicProperties.deltaHf',
          message: 'Enthalpy of formation outside reasonable range (-5000 to 5000 kJ/mol)',
          severity: 'major'
        });
      }

      if (props.entropy < 0 || props.entropy > 1000) {
        errors.push({
          field: 'thermodynamicProperties.entropy',
          message: 'Entropy outside reasonable range (0 to 1000 J/(mol·K))',
          severity: 'major'
        });
      }

      if (props.heatCapacity < 0 || props.heatCapacity > 500) {
        errors.push({
          field: 'thermodynamicProperties.heatCapacity',
          message: 'Heat capacity outside reasonable range (0 to 500 J/(mol·K))',
          severity: 'major'
        });
      }
    }

    // Temperature range validation
    if (props.temperatureRange) {
      if (props.temperatureRange[0] >= props.temperatureRange[1]) {
        errors.push({
          field: 'thermodynamicProperties.temperatureRange',
          message: 'Temperature range minimum must be less than maximum',
          severity: 'critical'
        });
      }

      if (props.temperatureRange[0] < 0) {
        errors.push({
          field: 'thermodynamicProperties.temperatureRange',
          message: 'Temperature cannot be below absolute zero',
          severity: 'critical'
        });
      }
    }

    // Physics-based checks
    if (this.config.enablePhysicsChecks) {
      // Third law of thermodynamics: entropy approaches zero at 0K
      if (props.entropy < 0) {
        errors.push({
          field: 'thermodynamicProperties.entropy',
          message: 'Entropy cannot be negative (Third Law of Thermodynamics)',
          severity: 'critical'
        });
      }

      // Check for reasonable heat capacity
      const atomCount = this.estimateAtomCount(formula);
      const expectedCp = atomCount * 20; // Rough estimate: ~20 J/(mol·K) per atom
      
      if (Math.abs(props.heatCapacity - expectedCp) > expectedCp * 0.5) {
        warnings.push({
          field: 'thermodynamicProperties.heatCapacity',
          message: `Heat capacity seems unusual for ${atomCount} atoms`,
          recommendation: `Expected around ${expectedCp.toFixed(1)} J/(mol·K)`
        });
      }
    }

    // Phase transition consistency
    if (props.meltingPoint && props.boilingPoint) {
      if (props.meltingPoint >= props.boilingPoint) {
        errors.push({
          field: 'thermodynamicProperties.meltingPoint',
          message: 'Melting point must be less than boiling point',
          severity: 'major'
        });
      }
    }

    // Critical point validation
    if (props.criticalTemperature && props.boilingPoint) {
      if (props.criticalTemperature <= props.boilingPoint) {
        errors.push({
          field: 'thermodynamicProperties.criticalTemperature',
          message: 'Critical temperature must be greater than boiling point',
          severity: 'major'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate physical properties
   */
  private validatePhysicalProperties(
    props: PhysicalProperties,
    thermoProps?: ExtendedThermodynamicProperties
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Density checks
    if (props.density !== undefined) {
      if (props.density <= 0) {
        errors.push({
          field: 'physicalProperties.density',
          message: 'Density must be positive',
          severity: 'critical'
        });
      }

      if (props.density > 50000) { // Osmium density is ~22,590 kg/m³
        warnings.push({
          field: 'physicalProperties.density',
          message: 'Density seems unusually high',
          recommendation: 'Verify units and measurement conditions'
        });
      }
    }

    // Viscosity checks
    if (props.viscosity !== undefined) {
      if (props.viscosity < 0) {
        errors.push({
          field: 'physicalProperties.viscosity',
          message: 'Viscosity cannot be negative',
          severity: 'critical'
        });
      }
    }

    // Thermal conductivity checks
    if (props.thermalConductivity !== undefined) {
      if (props.thermalConductivity < 0) {
        errors.push({
          field: 'physicalProperties.thermalConductivity',
          message: 'Thermal conductivity cannot be negative',
          severity: 'critical'
        });
      }
    }

    // Refractive index checks
    if (props.refractiveIndex !== undefined) {
      if (props.refractiveIndex < 1) {
        errors.push({
          field: 'physicalProperties.refractiveIndex',
          message: 'Refractive index must be at least 1',
          severity: 'critical'
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate safety data
   */
  private validateSafetyData(safetyData: SafetyProperties): ValidationError[] {
    const errors: ValidationError[] = [];

    // Flash point vs autoignition temperature
    if (safetyData.flashPoint && safetyData.autoignitionTemperature) {
      if (safetyData.flashPoint >= safetyData.autoignitionTemperature) {
        errors.push({
          field: 'safetyData.flashPoint',
          message: 'Flash point must be less than autoignition temperature',
          severity: 'major'
        });
      }
    }

    // Explosive limits
    if (safetyData.explosiveLimits) {
      if (safetyData.explosiveLimits.lower >= safetyData.explosiveLimits.upper) {
        errors.push({
          field: 'safetyData.explosiveLimits',
          message: 'Lower explosive limit must be less than upper limit',
          severity: 'major'
        });
      }

      if (safetyData.explosiveLimits.lower < 0 || safetyData.explosiveLimits.upper > 100) {
        errors.push({
          field: 'safetyData.explosiveLimits',
          message: 'Explosive limits must be between 0 and 100 vol%',
          severity: 'major'
        });
      }
    }

    return errors;
  }

  /**
   * Validate cross-property consistency
   */
  private validateConsistency(
    compound: CompoundDatabase
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const molecular = this.calculateMolecularWeight(compound.formula);
    
    // Molecular weight consistency
    if (Math.abs(compound.molecularWeight - molecular) > 0.1) {
      errors.push({
        field: 'molecularWeight',
        message: `Molecular weight inconsistent with formula (calculated: ${molecular.toFixed(3)})`,
        severity: 'major',
        suggestedFix: `Update to ${molecular.toFixed(3)} g/mol`
      });
    }

    // Source-confidence correlation
    if (compound.sources.includes('nist') && compound.confidence < 0.9) {
      warnings.push({
        field: 'confidence',
        message: 'NIST data typically has high confidence',
        recommendation: 'Consider increasing confidence score'
      });
    }

    return { errors, warnings };
  }

  /**
   * Calculate quality score (0-100)
   */
  private calculateQualityScore(
    compound: CompoundDatabase,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): number {
    let score = 100;

    // Deduct points for errors
    errors.forEach(error => {
      switch (error.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'major':
          score -= 10;
          break;
        case 'minor':
          score -= 5;
          break;
      }
    });

    // Deduct points for warnings
    score -= warnings.length * 2;

    // Bonus points for completeness
    if (compound.thermodynamicProperties.deltaGf !== undefined) score += 2;
    if (compound.thermodynamicProperties.uncertainties) score += 3;
    if (compound.physicalProperties.density !== undefined) score += 2;
    if (compound.safetyData) score += 5;
    if (compound.sources.includes('nist')) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Estimate atom count from formula
   */
  private estimateAtomCount(formula: string): number {
    let count = 0;
    let i = 0;

    while (i < formula.length) {
      if (formula[i] === '(') {
        // Skip to matching closing parenthesis
        let parenCount = 1;
        i++;
        while (i < formula.length && parenCount > 0) {
          if (formula[i] === '(') parenCount++;
          if (formula[i] === ')') parenCount--;
          i++;
        }
        continue;
      }

      if (/[A-Z]/.test(formula[i])) {
        count++;
        i++;
        // Skip lowercase letters
        while (i < formula.length && /[a-z]/.test(formula[i])) {
          i++;
        }
        // Skip numbers
        while (i < formula.length && /\d/.test(formula[i])) {
          i++;
        }
      } else {
        i++;
      }
    }

    return count;
  }

  /**
   * Calculate molecular weight from formula
   */
  private calculateMolecularWeight(formula: string): number {
    const atomicWeights: Record<string, number> = {
      'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
      'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
      'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
      'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
      'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Br': 79.904, 'I': 126.904
    };

    let weight = 0;
    let i = 0;

    while (i < formula.length) {
      // Get element symbol - starts with uppercase letter
      let element = formula[i];
      i++;
      
      // Check for two-letter elements (lowercase letter after uppercase)
      if (i < formula.length && /[a-z]/.test(formula[i])) {
        element += formula[i];
        i++;
      }
      
      // Get count - sequence of digits
      let count = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        count += formula[i];
        i++;
      }
      
      const elementWeight = atomicWeights[element] || 0;
      const elementCount = count ? parseInt(count) : 1;
      weight += elementWeight * elementCount;
    }

    return Math.round(weight * 1000) / 1000;
  }

  /**
   * Batch validate multiple compounds
   */
  batchValidate(compounds: CompoundDatabase[]): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();

    compounds.forEach(compound => {
      const result = this.validateCompound(compound);
      results.set(compound.formula, result);
    });

    return results;
  }

  /**
   * Get validation summary statistics
   */
  getValidationSummary(results: Map<string, ValidationResult>): {
    totalCompounds: number;
    validCompounds: number;
    averageScore: number;
    criticalErrors: number;
    majorErrors: number;
    minorErrors: number;
    warnings: number;
  } {
    let totalCompounds = 0;
    let validCompounds = 0;
    let totalScore = 0;
    let criticalErrors = 0;
    let majorErrors = 0;
    let minorErrors = 0;
    let warnings = 0;

    for (const result of results.values()) {
      totalCompounds++;
      if (result.isValid) validCompounds++;
      totalScore += result.score;
      warnings += result.warnings.length;

      result.errors.forEach(error => {
        switch (error.severity) {
          case 'critical':
            criticalErrors++;
            break;
          case 'major':
            majorErrors++;
            break;
          case 'minor':
            minorErrors++;
            break;
        }
      });
    }

    return {
      totalCompounds,
      validCompounds,
      averageScore: totalCompounds > 0 ? totalScore / totalCompounds : 0,
      criticalErrors,
      majorErrors,
      minorErrors,
      warnings
    };
  }
}
