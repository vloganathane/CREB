/**
 * CREB Enhanced Animation Controller
 *
 * Addresses: Animation Issues, Performance, UI/UX, Browser Compatibility
 * - Advanced timing and transition control
 * - Optimized memory management
 * - Cross-browser compatibility
 * - Enhanced visual effects
 */
export interface EnhancedAnimationConfig {
    duration: number;
    easing: string;
    transitionType: 'smooth' | 'elastic' | 'bounce' | 'stepped';
    frameRate: number;
    particleEffects: boolean;
    glowEffects: boolean;
    trailEffects: boolean;
    bloomIntensity: number;
    qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
    adaptiveQuality: boolean;
    maxParticles: number;
    cullDistance: number;
    webglFallback: boolean;
    mobileOptimizations: boolean;
    memoryThreshold: number;
}
export interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    memoryUsage: number;
    drawCalls: number;
    triangles: number;
    gpuMemory: number;
}
export declare class EnhancedAnimationController {
    private config;
    private scene;
    private camera;
    private renderer;
    private timeline;
    private performanceMonitor;
    private memoryManager;
    private frameRateController;
    private particleSystem;
    private postProcessor;
    private lightingSystem;
    private capabilityDetector;
    private fallbackRenderer;
    constructor(container: HTMLElement, config?: Partial<EnhancedAnimationConfig>);
    private mergeConfig;
    private initializeSystems;
    private setupScene;
    private setupRenderer;
    private setupCamera;
    private setupTimeline;
    private initializeFallbackMode;
    private setupPerformanceMonitoring;
    private detectBrowserCapabilities;
    animateReaction(reactants: MolecularData[], products: MolecularData[], options?: AnimationOptions): Promise<void>;
    private createTransitionSequence;
    private animateBondBreaking;
    private animateTransitionState;
    private animateBondFormation;
    private animateCompletion;
    private animateEnergyProfile;
    private adaptQuality;
    private reduceQuality;
    private increaseQuality;
    private applyQualitySettings;
    private handleMemoryPressure;
    private enableFallbackMode;
    private enableMobileOptimizations;
    private handleAnimationError;
    private showErrorMessage;
    play(): void;
    pause(): void;
    stop(): void;
    setSpeed(speed: number): void;
    getPerformanceMetrics(): PerformanceMetrics;
    dispose(): void;
}
interface MolecularData {
    id: string;
    atoms?: any[];
    bonds?: any[];
    formula?: string;
}
interface AnimationOptions {
    showEnergyProfile?: boolean;
}
export {};
//# sourceMappingURL=EnhancedAnimationController.d.ts.map