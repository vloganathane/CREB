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
import { ValidationResult, ValidationContext, ValidatorConfig, ValidationSchema, ThermodynamicConfig, ThermodynamicProperties } from '../types';
import { ChemistryValidator } from './BaseValidator';
/**
 * Validator for thermodynamic properties
 */
export declare class ThermodynamicPropertiesValidator extends ChemistryValidator<ThermodynamicProperties> {
    private readonly thermoConfig;
    constructor(config?: Partial<ValidatorConfig>, thermoConfig?: Partial<ThermodynamicConfig>);
    /**
     * Check if validator can handle the given value
     */
    canValidate(value: any): value is ThermodynamicProperties;
    /**
     * Validate thermodynamic properties
     */
    validate(value: ThermodynamicProperties, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Validate enthalpy of formation
     */
    private validateEnthalpy;
    /**
     * Validate entropy
     */
    private validateEntropy;
    /**
     * Validate heat capacity
     */
    private validateHeatCapacity;
    /**
     * Validate Gibbs free energy
     */
    private validateGibbsEnergy;
    /**
     * Validate temperature properties
     */
    private validateTemperatures;
    /**
     * Validate density
     */
    private validateDensity;
    /**
     * Validate cross-property consistency
     */
    private validateConsistency;
    /**
     * Create validation schema
     */
    protected createSchema(): ValidationSchema;
    /**
     * Validate temperature values
     */
    private validateTemperature;
    /**
     * Validate pressure values
     */
    private validatePressure;
}
//# sourceMappingURL=ThermodynamicPropertiesValidator.d.ts.map