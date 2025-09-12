/**
 * CREB Phase 3: Simplified Physics Engine
 * Browser-compatible version without external physics dependencies
 */
/**
 * Simplified Molecular Physics Engine (Browser Mode)
 * Provides physics-based animation without external dependencies
 */
export declare class SimplifiedPhysicsEngine {
    private config;
    private isInitialized;
    constructor();
    private initialize;
    /**
     * Configure physics simulation parameters
     */
    configure(config: any): void;
    /**
     * Simulate reaction pathway with simplified physics
     */
    simulateReactionPathway(transitions: any[], duration: number): Promise<any[]>;
    /**
     * Interpolate position with physics-based motion
     */
    private interpolatePosition;
    /**
     * Physics-based easing function
     */
    private physicsEasing;
    /**
     * Interpolate rotation with angular momentum
     */
    private interpolateRotation;
    /**
     * Interpolate scale with thermal expansion
     */
    private interpolateScale;
    /**
     * Calculate velocity for motion blur effects
     */
    private calculateVelocity;
    /**
     * Apply physics effects like thermal motion
     */
    private applyPhysicsEffects;
    /**
     * Calculate system energy for monitoring
     */
    calculateSystemEnergy(molecularStates: any[]): any;
    /**
     * Reset physics state
     */
    reset(): void;
    /**
     * Alias for simulateReactionPathway - for API compatibility
     */
    simulateReaction(equation: string, options?: any): Promise<any>;
    /**
     * Dispose of physics resources
     */
    dispose(): void;
}
//# sourceMappingURL=SimplifiedPhysicsEngine.d.ts.map