/**
 * Advanced Data Validation Service
 * Provides comprehensive validation for chemical data integrity
 */
import { CompoundDatabase } from './types';
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    score: number;
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
export declare class DataValidationService {
    private config;
    constructor(config?: Partial<ValidationConfig>);
    /**
     * Validate a complete compound entry
     */
    validateCompound(compound: CompoundDatabase): ValidationResult;
    /**
     * Validate basic compound structure
     */
    private validateBasicStructure;
    /**
     * Validate chemical formula syntax and composition
     */
    private validateFormula;
    /**
     * Validate thermodynamic properties
     */
    private validateThermodynamicProperties;
    /**
     * Validate physical properties
     */
    private validatePhysicalProperties;
    /**
     * Validate safety data
     */
    private validateSafetyData;
    /**
     * Validate cross-property consistency
     */
    private validateConsistency;
    /**
     * Calculate quality score (0-100)
     */
    private calculateQualityScore;
    /**
     * Estimate atom count from formula
     */
    private estimateAtomCount;
    /**
     * Calculate molecular weight from formula
     */
    private calculateMolecularWeight;
    /**
     * Batch validate multiple compounds
     */
    batchValidate(compounds: CompoundDatabase[]): Map<string, ValidationResult>;
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
    };
}
//# sourceMappingURL=DataValidationService.d.ts.map