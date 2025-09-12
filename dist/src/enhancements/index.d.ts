/**
 * CREB Master Enhancement Integration
 *
 * Integrates all enhancement systems:
 * - Enhanced Animation Controller
 * - Enhanced Molecular Renderer
 * - Enhanced UI System
 * - Browser Compatibility Manager
 * - Enhanced Features System
 */
import { EnhancedAnimationController, EnhancedAnimationConfig } from './EnhancedAnimationController';
import { EnhancedMolecularRenderer, RenderingConfig } from './EnhancedMolecularRenderer';
import { EnhancedUI, UIConfig } from './EnhancedUI';
import { BrowserCompatibilityManager, CompatibilityConfig } from './BrowserCompatibilityManager';
import { EnhancedFeaturesSystem, FeatureConfig } from './EnhancedFeaturesSystem';
export interface MasterConfig {
    animation: Partial<EnhancedAnimationConfig>;
    rendering: Partial<RenderingConfig>;
    ui: Partial<UIConfig>;
    compatibility: Partial<CompatibilityConfig>;
    features: Partial<FeatureConfig>;
    enableAllFeatures: boolean;
    autoOptimization: boolean;
    debugMode: boolean;
    telemetryEnabled: boolean;
}
export interface SystemStatus {
    animation: 'ready' | 'loading' | 'error';
    rendering: 'ready' | 'loading' | 'error';
    ui: 'ready' | 'loading' | 'error';
    compatibility: 'compatible' | 'limited' | 'incompatible';
    features: 'ready' | 'loading' | 'error';
    overall: 'ready' | 'initializing' | 'degraded' | 'error';
}
export interface AnimationRequest {
    equation: string;
    options?: {
        duration?: number;
        quality?: 'low' | 'medium' | 'high' | 'ultra';
        effects?: boolean;
        stepByStep?: boolean;
        exportFormat?: string;
    };
}
export interface AnimationResult {
    success: boolean;
    duration: number;
    quality: string;
    frames: number;
    errors: string[];
    warnings: string[];
    performance: {
        renderTime: number;
        memoryUsed: number;
        fps: number;
    };
}
export declare class CREBMasterEnhancementSystem {
    private config;
    private animationController;
    private molecularRenderer;
    private uiSystem;
    private compatibilityManager;
    private featuresSystem;
    private status;
    private container;
    private initialized;
    constructor(container: HTMLElement, config?: Partial<MasterConfig>);
    private mergeConfig;
    private detectTouch;
    private initializeStatus;
    private initializeSubsystems;
    private optimizeConfigForDevice;
    private setupUIEventHandlers;
    private setupSystemIntegration;
    private setupPerformanceMonitoring;
    private optimizePerformance;
    private reduceQuality;
    private cleanupMemory;
    private setupErrorHandling;
    private handleGlobalError;
    private attemptErrorRecovery;
    private showInitializationComplete;
    private handleInitializationError;
    animateReaction(request: AnimationRequest): Promise<AnimationResult>;
    getSystemStatus(): SystemStatus;
    isReady(): boolean;
    getCapabilities(): any;
    exportAnimation(format: 'gif' | 'mp4' | 'png'): Promise<Blob>;
    importReaction(file: File): Promise<void>;
    dispose(): void;
}
export declare function createEnhancedCREB(container: HTMLElement, config?: Partial<MasterConfig>): CREBMasterEnhancementSystem;
export { EnhancedAnimationController, EnhancedMolecularRenderer, EnhancedUI, BrowserCompatibilityManager, EnhancedFeaturesSystem };
//# sourceMappingURL=index.d.ts.map