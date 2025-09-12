/**
 * CREB Browser Compatibility & Performance Manager
 *
 * Addresses: Browser Compatibility, Performance, Memory Management
 * - Cross-browser compatibility detection and handling
 * - Performance monitoring and optimization
 * - Memory leak prevention
 * - Graceful degradation strategies
 */
export interface BrowserCapabilities {
    webgl: boolean;
    webgl2: boolean;
    webworkers: boolean;
    indexeddb: boolean;
    webassembly: boolean;
    intersectionobserver: boolean;
    resizeobserver: boolean;
    offscreencanvas: boolean;
    gpu: boolean;
    touchevents: boolean;
    pointerevents: boolean;
    gamepad: boolean;
}
export interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    memoryUsed: number;
    memoryLimit: number;
    drawCalls: number;
    triangles: number;
    textureMemory: number;
    geometryMemory: number;
    renderTime: number;
    updateTime: number;
}
export interface CompatibilityConfig {
    webglFallback: 'canvas2d' | 'svg' | 'static' | 'error';
    memoryLimitMB: number;
    performanceMode: 'auto' | 'performance' | 'quality' | 'battery';
    detectCapabilities: boolean;
    logCompatibilityWarnings: boolean;
    showCompatibilityMessages: boolean;
    enableGC: boolean;
    memoryThreshold: number;
    fpsThreshold: number;
    autoOptimize: boolean;
}
export declare class BrowserCompatibilityManager {
    private capabilities;
    private config;
    private performanceMonitor;
    private memoryManager;
    private fallbackRenderer;
    private compatibilityLayer;
    constructor(config?: Partial<CompatibilityConfig>);
    private mergeConfig;
    private detectMemoryLimit;
    private detectBrowserCapabilities;
    private initializeCompatibilityLayer;
    private setupWebGLFallback;
    private applyPerformanceMode;
    private detectOptimalPerformanceMode;
    private isBatteryPowered;
    private enablePerformanceMode;
    private enableQualityMode;
    private enableBatteryMode;
    private setupPerformanceMonitoring;
    private handlePerformanceChange;
    private handleMemoryPressure;
    private reduceQuality;
    private increaseQuality;
    private logCompatibilityStatus;
    getCapabilities(): BrowserCapabilities;
    getPerformanceMetrics(): PerformanceMetrics;
    isFeatureSupported(feature: keyof BrowserCapabilities): boolean;
    canRenderMolecule(atomCount: number): boolean;
    private estimateMemoryRequired;
    createCompatibleRenderer(container: HTMLElement): any;
    private createWebGLRenderer;
    optimizeForDevice(): void;
    private detectDeviceType;
    private applyMobileOptimizations;
    private applyTabletOptimizations;
    private applyDesktopOptimizations;
    private applyLowEndOptimizations;
    checkBrowserSupport(): {
        supported: boolean;
        issues: string[];
        recommendations: string[];
    };
    dispose(): void;
}
//# sourceMappingURL=BrowserCompatibilityManager.d.ts.map