/**
 * CREB Reaction Kinetics Calculator
 * Core calculator for reaction kinetics analysis
 */
import { ReactionConditions, ArrheniusData, KineticsResult, TemperatureProfile, ReactionClass, CatalystData } from './types';
export declare class ReactionKinetics {
    private static readonly GAS_CONSTANT;
    private static readonly KELVIN_CELSIUS_OFFSET;
    /**
     * Calculate reaction rate constant using Arrhenius equation
     * k = A * exp(-Ea / (R * T))
     */
    static calculateRateConstant(arrhenius: ArrheniusData, temperature: number): number;
    /**
     * Calculate activation energy from rate constants at two temperatures
     * Ea = R * ln(k2/k1) / (1/T1 - 1/T2)
     */
    static calculateActivationEnergy(k1: number, T1: number, k2: number, T2: number): number;
    /**
     * Generate temperature profile for reaction kinetics
     */
    static generateTemperatureProfile(arrhenius: ArrheniusData, tempRange: [number, number], points?: number): TemperatureProfile[];
    /**
     * Determine reaction class from chemical equation
     */
    static classifyReaction(equation: string): ReactionClass;
    /**
     * Calculate half-life for first-order reactions
     * t₁/₂ = ln(2) / k
     */
    static calculateHalfLife(rateConstant: number, order?: number): number;
    /**
     * Estimate pre-exponential factor using transition state theory
     * A ≈ (kB * T / h) * exp(ΔS‡ / R)
     */
    static estimatePreExponentialFactor(temperature: number, entropyOfActivation?: number): number;
    /**
     * Apply catalyst effect to reaction kinetics
     */
    static applyCatalystEffect(baseKinetics: Partial<KineticsResult>, catalyst: CatalystData): Partial<KineticsResult>;
    /**
     * Generate rate law expression
     */
    static generateRateLaw(equation: string, orders: Record<string, number>, rateConstant: number): string;
    /**
     * Comprehensive kinetics analysis
     */
    static analyzeKinetics(equation: string, conditions: ReactionConditions, arrheniusData?: ArrheniusData): KineticsResult;
    /**
     * Estimate Arrhenius parameters for unknown reactions
     */
    private static estimateArrheniusParameters;
}
//# sourceMappingURL=calculator.d.ts.map