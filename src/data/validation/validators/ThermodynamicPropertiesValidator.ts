/**
 * @fileoverview Thermodynamic Properties Validator
 * 
 * Validates thermodynamic properties with:
 * - Temperature range validation
 * - Pressure range validation
 * - Enthalpy, entropy, and heat capacity validation
 * - Cross-property consistency checks
 * - Physical property validation
 * 
 * @version 1.0.0
 * @author CREB Team
 */

import {
  ValidationResult,
  ValidationContext,
  ValidatorConfig,
  ValidationSchema,
  ValidationSeverity,
  ValidationError,
  ThermodynamicConfig,
  ThermodynamicProperties
} from '../types';
import { ChemistryValidator } from './BaseValidator';

/**
 * Validator for thermodynamic properties
 */
export class ThermodynamicPropertiesValidator extends ChemistryValidator<ThermodynamicProperties> {
  private readonly thermoConfig: ThermodynamicConfig;

  constructor(
    config: Partial<ValidatorConfig> = {},
    thermoConfig: Partial<ThermodynamicConfig> = {}
  ) {
    super('thermodynamic-properties', config);
    
    this.thermoConfig = {
      temperatureRange: { min: 0, max: 10000 }, // Kelvin
      pressureRange: { min: 0, max: 1e9 }, // Pascal
      enthalpyRange: { min: -10000, max: 10000 }, // kJ/mol
      entropyRange: { min: 0, max: 1000 }, // J/(mol·K)
      heatCapacityRange: { min: 0, max: 1000 }, // J/(mol·K)
      ...thermoConfig
    };
  }

  /**
   * Check if validator can handle the given value
   */
  canValidate(value: any): value is ThermodynamicProperties {
    return typeof value === 'object' && value !== null && (
      'enthalpyFormation' in value ||
      'entropy' in value ||
      'heatCapacity' in value ||
      'gibbsEnergy' in value ||
      'meltingPoint' in value ||
      'boilingPoint' in value ||
      'density' in value ||
      'temperature' in value ||
      'pressure' in value ||
      'enthalpy' in value
    );
  }

  /**
   * Validate thermodynamic properties
   */
  async validate(
    value: ThermodynamicProperties,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    try {
      // Validate individual properties
      this.validateTemperature(value, errors, warnings, context.path);
      this.validatePressure(value, errors, warnings, context.path);
      this.validateEnthalpy(value, errors, warnings, context.path);
      this.validateEntropy(value, errors, warnings, context.path);
      this.validateHeatCapacity(value, errors, warnings, context.path);
      this.validateGibbsEnergy(value, errors, warnings, context.path);
      this.validateTemperatures(value, errors, warnings, context.path);
      this.validateDensity(value, errors, warnings, context.path);

      // Cross-property consistency checks
      this.validateConsistency(value, errors, warnings, context.path);

      const duration = Date.now() - startTime;
      const isValid = errors.length === 0;

      return {
        isValid,
        errors,
        warnings,
        metrics: {
          duration,
          rulesExecuted: 7, // Number of validation methods called
          validatorsUsed: 1,
          cacheStats: { hits: 0, misses: 1, hitRate: 0 }
        },
        timestamp: new Date()
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.createFailureResult([
        this.createError(
          'THERMODYNAMIC_VALIDATION_ERROR',
          `Thermodynamic validation failed: ${errorMessage}`,
          context.path,
          ValidationSeverity.ERROR,
          ['Check property values', 'Verify units are correct'],
          { error: errorMessage },
          value
        )
      ], context);
    }
  }

  /**
   * Validate enthalpy of formation
   */
  private validateEnthalpy(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.enthalpyFormation === undefined) {
      return;
    }

    const enthalpy = properties.enthalpyFormation;
    const { min, max } = this.thermoConfig.enthalpyRange;

    if (typeof enthalpy !== 'number' || !isFinite(enthalpy)) {
      errors.push(this.createError(
        'INVALID_ENTHALPY_VALUE',
        'Enthalpy of formation must be a finite number',
        [...path, 'enthalpyFormation'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in kJ/mol'],
        { value: enthalpy }
      ));
      return;
    }

    if (enthalpy < min || enthalpy > max) {
      errors.push(this.createError(
        'ENTHALPY_OUT_OF_RANGE',
        `Enthalpy of formation ${enthalpy} kJ/mol is outside valid range [${min}, ${max}]`,
        [...path, 'enthalpyFormation'],
        ValidationSeverity.ERROR,
        [`Provide value between ${min} and ${max} kJ/mol`],
        { value: enthalpy, min, max }
      ));
    }

    // Warning for extreme values
    if (Math.abs(enthalpy) > 5000) {
      warnings.push(this.createError(
        'EXTREME_ENTHALPY_VALUE',
        `Enthalpy of formation ${enthalpy} kJ/mol is unusually large`,
        [...path, 'enthalpyFormation'],
        ValidationSeverity.WARNING,
        ['Verify the value is correct', 'Check if units are appropriate'],
        { value: enthalpy }
      ));
    }
  }

  /**
   * Validate entropy
   */
  private validateEntropy(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.entropy === undefined) {
      return;
    }

    const entropy = properties.entropy;
    const { min, max } = this.thermoConfig.entropyRange;

    if (typeof entropy !== 'number' || !isFinite(entropy)) {
      errors.push(this.createError(
        'INVALID_ENTROPY_VALUE',
        'Entropy must be a finite number',
        [...path, 'entropy'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in J/(mol·K)'],
        { value: entropy }
      ));
      return;
    }

    if (entropy < min) {
      errors.push(this.createError(
        'NEGATIVE_ENTROPY',
        `Entropy ${entropy} J/(mol·K) cannot be negative`,
        [...path, 'entropy'],
        ValidationSeverity.ERROR,
        ['Entropy must be positive according to the third law of thermodynamics'],
        { value: entropy }
      ));
    }

    if (entropy > max) {
      warnings.push(this.createError(
        'VERY_HIGH_ENTROPY',
        `Entropy ${entropy} J/(mol·K) is unusually high`,
        [...path, 'entropy'],
        ValidationSeverity.WARNING,
        ['Verify the value is correct', 'Check for large molecular complexity'],
        { value: entropy, max }
      ));
    }
  }

  /**
   * Validate heat capacity
   */
  private validateHeatCapacity(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.heatCapacity === undefined) {
      return;
    }

    const cp = properties.heatCapacity;
    const { min, max } = this.thermoConfig.heatCapacityRange;

    if (typeof cp !== 'number' || !isFinite(cp)) {
      errors.push(this.createError(
        'INVALID_HEAT_CAPACITY_VALUE',
        'Heat capacity must be a finite number',
        [...path, 'heatCapacity'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in J/(mol·K)'],
        { value: cp }
      ));
      return;
    }

    if (cp < min) {
      errors.push(this.createError(
        'NEGATIVE_HEAT_CAPACITY',
        `Heat capacity ${cp} J/(mol·K) cannot be negative`,
        [...path, 'heatCapacity'],
        ValidationSeverity.ERROR,
        ['Heat capacity must be positive'],
        { value: cp }
      ));
    }

    if (cp > max) {
      warnings.push(this.createError(
        'VERY_HIGH_HEAT_CAPACITY',
        `Heat capacity ${cp} J/(mol·K) is unusually high`,
        [...path, 'heatCapacity'],
        ValidationSeverity.WARNING,
        ['Verify the value is correct', 'Check molecular complexity'],
        { value: cp, max }
      ));
    }
  }

  /**
   * Validate Gibbs free energy
   */
  private validateGibbsEnergy(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.gibbsEnergy === undefined) {
      return;
    }

    const gibbs = properties.gibbsEnergy;

    if (typeof gibbs !== 'number' || !isFinite(gibbs)) {
      errors.push(this.createError(
        'INVALID_GIBBS_ENERGY_VALUE',
        'Gibbs free energy must be a finite number',
        [...path, 'gibbsEnergy'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in kJ/mol'],
        { value: gibbs }
      ));
      return;
    }

    // Check consistency with enthalpy if both are present
    if (properties.enthalpyFormation !== undefined && properties.entropy !== undefined) {
      const expectedGibbs = properties.enthalpyFormation - (298.15 * properties.entropy / 1000);
      const difference = Math.abs(gibbs - expectedGibbs);
      
      if (difference > 50) { // 50 kJ/mol tolerance
        warnings.push(this.createError(
          'GIBBS_ENERGY_INCONSISTENCY',
          `Gibbs energy may be inconsistent with enthalpy and entropy (difference: ${difference.toFixed(1)} kJ/mol)`,
          [...path, 'gibbsEnergy'],
          ValidationSeverity.WARNING,
          ['Check if all values are at same temperature', 'Verify calculation accuracy'],
          { 
            gibbsProvided: gibbs, 
            gibbsCalculated: expectedGibbs, 
            difference 
          }
        ));
      }
    }
  }

  /**
   * Validate temperature properties
   */
  private validateTemperatures(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    const { meltingPoint, boilingPoint } = properties;
    const { min, max } = this.thermoConfig.temperatureRange;

    // Validate melting point
    if (meltingPoint !== undefined) {
      if (typeof meltingPoint !== 'number' || !isFinite(meltingPoint)) {
        errors.push(this.createError(
          'INVALID_MELTING_POINT',
          'Melting point must be a finite number',
          [...path, 'meltingPoint'],
          ValidationSeverity.ERROR,
          ['Provide a valid temperature in Kelvin'],
          { value: meltingPoint }
        ));
      } else if (meltingPoint < min || meltingPoint > max) {
        errors.push(this.createError(
          'MELTING_POINT_OUT_OF_RANGE',
          `Melting point ${meltingPoint} K is outside valid range [${min}, ${max}]`,
          [...path, 'meltingPoint'],
          ValidationSeverity.ERROR,
          [`Provide temperature between ${min} and ${max} K`],
          { value: meltingPoint, min, max }
        ));
      }
    }

    // Validate boiling point
    if (boilingPoint !== undefined) {
      if (typeof boilingPoint !== 'number' || !isFinite(boilingPoint)) {
        errors.push(this.createError(
          'INVALID_BOILING_POINT',
          'Boiling point must be a finite number',
          [...path, 'boilingPoint'],
          ValidationSeverity.ERROR,
          ['Provide a valid temperature in Kelvin'],
          { value: boilingPoint }
        ));
      } else if (boilingPoint < min || boilingPoint > max) {
        errors.push(this.createError(
          'BOILING_POINT_OUT_OF_RANGE',
          `Boiling point ${boilingPoint} K is outside valid range [${min}, ${max}]`,
          [...path, 'boilingPoint'],
          ValidationSeverity.ERROR,
          [`Provide temperature between ${min} and ${max} K`],
          { value: boilingPoint, min, max }
        ));
      }
    }

    // Validate relationship between melting and boiling points
    if (meltingPoint !== undefined && boilingPoint !== undefined) {
      if (meltingPoint >= boilingPoint) {
        errors.push(this.createError(
          'INVALID_PHASE_TRANSITION',
          `Melting point (${meltingPoint} K) must be less than boiling point (${boilingPoint} K)`,
          path,
          ValidationSeverity.ERROR,
          ['Check temperature values', 'Ensure proper phase transition order'],
          { meltingPoint, boilingPoint }
        ));
      }
    }
  }

  /**
   * Validate density
   */
  private validateDensity(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.density === undefined) {
      return;
    }

    const density = properties.density;

    if (typeof density !== 'number' || !isFinite(density)) {
      errors.push(this.createError(
        'INVALID_DENSITY_VALUE',
        'Density must be a finite number',
        [...path, 'density'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in g/cm³'],
        { value: density }
      ));
      return;
    }

    if (density <= 0) {
      errors.push(this.createError(
        'NEGATIVE_DENSITY',
        `Density ${density} g/cm³ must be positive`,
        [...path, 'density'],
        ValidationSeverity.ERROR,
        ['Density cannot be zero or negative'],
        { value: density }
      ));
    }

    if (density > 25) { // Osmium has highest density ~22.6 g/cm³
      warnings.push(this.createError(
        'EXTREMELY_HIGH_DENSITY',
        `Density ${density} g/cm³ is extremely high`,
        [...path, 'density'],
        ValidationSeverity.WARNING,
        ['Verify the value is correct', 'Check if dealing with compressed material'],
        { value: density }
      ));
    }
  }

  /**
   * Validate cross-property consistency
   */
  private validateConsistency(
    properties: ThermodynamicProperties,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    // Additional consistency checks can be added here
    // For example, checking if entropy correlates with molecular complexity
    
    if (properties.entropy !== undefined && properties.heatCapacity !== undefined) {
      // At room temperature, Cp is typically larger than S for most compounds
      if (properties.heatCapacity < properties.entropy * 0.5) {
        warnings.push(this.createError(
          'UNUSUAL_CP_S_RATIO',
          'Heat capacity seems unusually low compared to entropy',
          path,
          ValidationSeverity.WARNING,
          ['Verify both values are correct', 'Check temperature conditions'],
          { 
            heatCapacity: properties.heatCapacity, 
            entropy: properties.entropy 
          }
        ));
      }
    }
  }

  /**
   * Create validation schema
   */
  protected createSchema(): ValidationSchema {
    return {
      name: this.name,
      version: '1.0.0',
      description: 'Thermodynamic properties validation schema',
      types: ['object'],
      requiredValidators: [],
      optionalValidators: [],
      properties: {
        config: this.thermoConfig,
        supportedProperties: [
          'enthalpyFormation',
          'entropy',
          'heatCapacity',
          'gibbsEnergy',
          'meltingPoint',
          'boilingPoint',
          'density'
        ],
        units: {
          enthalpyFormation: 'kJ/mol',
          entropy: 'J/(mol·K)',
          heatCapacity: 'J/(mol·K)',
          gibbsEnergy: 'kJ/mol',
          meltingPoint: 'K',
          boilingPoint: 'K',
          density: 'g/cm³'
        },
        validationRules: [
          'All values must be finite numbers',
          'Entropy and heat capacity must be positive',
          'Melting point must be less than boiling point',
          'Cross-property consistency checks applied'
        ]
      }
    };
  }

  /**
   * Validate temperature values
   */
  private validateTemperature(
    properties: ThermodynamicProperties | any,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.temperature === undefined) {
      return;
    }

    const temperature = properties.temperature;

    if (typeof temperature !== 'number' || !isFinite(temperature)) {
      errors.push(this.createError(
        'INVALID_TEMPERATURE_VALUE',
        'Temperature must be a finite number',
        [...path, 'temperature'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in Kelvin'],
        { value: temperature }
      ));
      return;
    }

    // Absolute zero check
    if (temperature < 0) {
      errors.push(this.createError(
        'NEGATIVE_TEMPERATURE',
        `Temperature ${temperature} K is below absolute zero`,
        [...path, 'temperature'],
        ValidationSeverity.ERROR,
        ['Temperature cannot be negative in Kelvin scale'],
        { value: temperature }
      ));
    }

    // Extreme temperature check
    if (temperature > 10000) {
      warnings.push(this.createError(
        'EXTREME_TEMPERATURE',
        `Temperature ${temperature} K is extremely high`,
        [...path, 'temperature'],
        ValidationSeverity.WARNING,
        ['Verify the temperature value is correct'],
        { value: temperature }
      ));
    }
  }

  /**
   * Validate pressure values
   */
  private validatePressure(
    properties: ThermodynamicProperties | any,
    errors: ValidationError[],
    warnings: ValidationError[],
    path: string[]
  ): void {
    if (properties.pressure === undefined) {
      return;
    }

    const pressure = properties.pressure;

    if (typeof pressure !== 'number' || !isFinite(pressure)) {
      errors.push(this.createError(
        'INVALID_PRESSURE_VALUE',
        'Pressure must be a finite number',
        [...path, 'pressure'],
        ValidationSeverity.ERROR,
        ['Provide a valid numerical value in Pascal'],
        { value: pressure }
      ));
      return;
    }

    if (pressure < 0) {
      errors.push(this.createError(
        'NEGATIVE_PRESSURE',
        `Pressure ${pressure} Pa cannot be negative`,
        [...path, 'pressure'],
        ValidationSeverity.ERROR,
        ['Pressure must be positive'],
        { value: pressure }
      ));
    }
  }
}
