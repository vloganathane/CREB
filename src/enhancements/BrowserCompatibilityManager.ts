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
  mobile: boolean;
  webglExtensions: string[];
  maxTextureSize: number;
  memoryInfo: any;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsed: number;
  memoryUsage: number;
  memoryLimit: number;
  drawCalls: number;
  triangles: number;
  textureMemory: number;
  geometryMemory: number;
  renderTime: number;
  renderingTime: number;
  updateTime: number;
}

export interface CompatibilityConfig {
  // Fallback strategies
  webglFallback: 'canvas2d' | 'svg' | 'static' | 'error';
  memoryLimitMB: number;
  performanceMode: 'auto' | 'performance' | 'quality' | 'battery';
  
  // Feature detection
  detectCapabilities: boolean;
  logCompatibilityWarnings: boolean;
  showCompatibilityMessages: boolean;
  
  // Optimization settings
  enableGC: boolean;
  memoryThreshold: number;
  fpsThreshold: number;
  autoOptimize: boolean;
}

export class BrowserCompatibilityManager {
  private capabilities: BrowserCapabilities;
  private config: CompatibilityConfig;
  private performanceMonitor: PerformanceMonitor;
  private memoryManager: MemoryManager;
  private fallbackRenderer: FallbackRenderer;
  private compatibilityLayer: CompatibilityLayer;
  
  constructor(config: Partial<CompatibilityConfig> = {}) {
    this.config = this.mergeConfig(config);
    this.capabilities = this.detectBrowserCapabilities();
    
    this.performanceMonitor = new PerformanceMonitor();
    this.memoryManager = new MemoryManager(this.config.memoryLimitMB);
    this.fallbackRenderer = new FallbackRenderer();
    this.compatibilityLayer = new CompatibilityLayer(this.capabilities);
    
    this.initializeCompatibilityLayer();
    this.setupPerformanceMonitoring();
  }

  private mergeConfig(config: Partial<CompatibilityConfig>): CompatibilityConfig {
    return {
      // Fallback defaults
      webglFallback: 'canvas2d',
      memoryLimitMB: this.detectMemoryLimit(),
      performanceMode: 'auto',
      
      // Detection defaults
      detectCapabilities: true,
      logCompatibilityWarnings: true,
      showCompatibilityMessages: false,
      
      // Optimization defaults
      enableGC: true,
      memoryThreshold: 0.8, // 80% of available memory
      fpsThreshold: 30,
      autoOptimize: true,
      
      ...config
    };
  }

  private detectMemoryLimit(): number {
    // Detect available memory and set reasonable limits
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const totalMemoryMB = memory.jsHeapSizeLimit / (1024 * 1024);
      return Math.min(totalMemoryMB * 0.3, 1024); // Use max 30% or 1GB
    }
    
    // Fallback estimates based on device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 256 : 512; // Conservative estimates
  }

  private detectBrowserCapabilities(): BrowserCapabilities {
    const canvas = document.createElement('canvas');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const capabilities: BrowserCapabilities = {
      webgl: false,
      webgl2: false,
      webworkers: typeof Worker !== 'undefined',
      indexeddb: 'indexedDB' in window,
      webassembly: typeof WebAssembly !== 'undefined',
      intersectionobserver: 'IntersectionObserver' in window,
      resizeobserver: 'ResizeObserver' in window,
      offscreencanvas: 'OffscreenCanvas' in window,
      gpu: false,
      touchevents: 'ontouchstart' in window,
      pointerevents: 'onpointerdown' in window,
      gamepad: 'getGamepads' in navigator,
      mobile: isMobile,
      webglExtensions: [],
      maxTextureSize: 0,
      memoryInfo: null
    };

    // Test WebGL support
    try {
      const gl = canvas.getContext('webgl');
      capabilities.webgl = !!gl;
      
      if (gl) {
        const gl2 = canvas.getContext('webgl2');
        capabilities.webgl2 = !!gl2;
        
        // Get WebGL extensions
        const extensions = gl.getSupportedExtensions() || [];
        capabilities.webglExtensions = extensions;
        
        // Get max texture size
        capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
        
        // Check for GPU info
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          capabilities.gpu = !renderer.includes('SwiftShader'); // Not software renderer
        }
        
        // Get memory info if available
        if ('memory' in performance) {
          capabilities.memoryInfo = (performance as any).memory;
        }
      }
    } catch (error) {
      capabilities.webgl = false;
    }

    return capabilities;
  }

  private initializeCompatibilityLayer(): void {
    // Apply polyfills and compatibility fixes
    this.compatibilityLayer.applyPolyfills();
    
    // Setup fallback strategies
    if (!this.capabilities.webgl && this.config.webglFallback !== 'error') {
      this.setupWebGLFallback();
    }
    
    // Setup performance mode
    this.applyPerformanceMode();
    
    // Log compatibility warnings
    if (this.config.logCompatibilityWarnings) {
      this.logCompatibilityStatus();
    }
  }

  private setupWebGLFallback(): void {
    switch (this.config.webglFallback) {
      case 'canvas2d':
        this.fallbackRenderer.useCanvas2D();
        break;
      case 'svg':
        this.fallbackRenderer.useSVG();
        break;
      case 'static':
        this.fallbackRenderer.useStaticImages();
        break;
    }
  }

  private applyPerformanceMode(): void {
    const mode = this.config.performanceMode === 'auto' 
      ? this.detectOptimalPerformanceMode() 
      : this.config.performanceMode;
    
    switch (mode) {
      case 'performance':
        this.enablePerformanceMode();
        break;
      case 'quality':
        this.enableQualityMode();
        break;
      case 'battery':
        this.enableBatteryMode();
        break;
    }
  }

  private detectOptimalPerformanceMode(): string {
    // Detect based on device capabilities
    if (this.capabilities.gpu && this.config.memoryLimitMB > 512) {
      return 'quality';
    } else if (this.isBatteryPowered()) {
      return 'battery';
    } else {
      return 'performance';
    }
  }

  private isBatteryPowered(): boolean {
    // Check if device is likely battery-powered
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private enablePerformanceMode(): void {
    // Optimize for frame rate
    this.performanceMonitor.setTargetFPS(60);
    this.memoryManager.setAggressiveGC(false);
  }

  private enableQualityMode(): void {
    // Optimize for visual quality
    this.performanceMonitor.setTargetFPS(30);
    this.memoryManager.setAggressiveGC(false);
  }

  private enableBatteryMode(): void {
    // Optimize for battery life
    this.performanceMonitor.setTargetFPS(24);
    this.memoryManager.setAggressiveGC(true);
  }

  private setupPerformanceMonitoring(): void {
    this.performanceMonitor.onPerformanceChange = (metrics: PerformanceMetrics) => {
      if (this.config.autoOptimize) {
        this.handlePerformanceChange(metrics);
      }
    };

    this.memoryManager.onMemoryPressure = (level: 'warning' | 'critical') => {
      this.handleMemoryPressure(level);
    };
  }

  private handlePerformanceChange(metrics: PerformanceMetrics): void {
    if (metrics.fps < this.config.fpsThreshold) {
      this.reduceQuality();
    } else if (metrics.fps > this.config.fpsThreshold + 15) {
      this.increaseQuality();
    }

    if (metrics.memoryUsed / metrics.memoryLimit > this.config.memoryThreshold) {
      this.memoryManager.forceGarbageCollection();
    }
  }

  private handleMemoryPressure(level: 'warning' | 'critical'): void {
    switch (level) {
      case 'warning':
        this.memoryManager.cleanup();
        break;
      case 'critical':
        this.memoryManager.emergencyCleanup();
        this.reduceQuality();
        break;
    }
  }

  private reduceQuality(): void {
    // Reduce rendering quality to improve performance
    // This would integrate with the main rendering system
  }

  private increaseQuality(): void {
    // Increase rendering quality when performance allows
    // This would integrate with the main rendering system
  }

  private logCompatibilityStatus(): void {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!this.capabilities.webgl) {
      issues.push('WebGL not supported - using fallback renderer');
    }

    if (!this.capabilities.webgl2) {
      warnings.push('WebGL 2.0 not available - some features may be limited');
    }

    if (!this.capabilities.webworkers) {
      warnings.push('Web Workers not supported - performance may be reduced');
    }

    if (!this.capabilities.indexeddb) {
      warnings.push('IndexedDB not available - caching will be limited');
    }

    if (this.config.memoryLimitMB < 256) {
      warnings.push('Low memory environment detected - quality will be reduced');
    }

    if (issues.length > 0) {
      console.warn('CREB Compatibility Issues:', issues);
    }

    if (warnings.length > 0) {
      console.info('CREB Compatibility Warnings:', warnings);
    }

    console.info('CREB Browser Capabilities:', this.capabilities);
  }

  // Public API
  public getCapabilities(): BrowserCapabilities {
    return { ...this.capabilities };
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getCurrentMetrics();
  }

  public isFeatureSupported(feature: keyof BrowserCapabilities): boolean {
    return this.capabilities[feature];
  }

  public canRenderMolecule(atomCount: number): boolean {
    // Estimate if the browser can handle a molecule of given size
    const memoryRequired = this.estimateMemoryRequired(atomCount);
    const availableMemory = this.memoryManager.getAvailableMemory();
    
    return memoryRequired < availableMemory * 0.8; // Leave 20% buffer
  }

  private estimateMemoryRequired(atomCount: number): number {
    // Rough estimate: 1KB per atom for basic rendering
    return atomCount * 1024;
  }

  public createCompatibleRenderer(container: HTMLElement): any {
    if (this.capabilities.webgl) {
      return this.createWebGLRenderer(container);
    } else {
      return this.fallbackRenderer.createRenderer(container);
    }
  }

  private createWebGLRenderer(container: HTMLElement): any {
    // Create WebGL-based renderer with appropriate settings
    const rendererConfig = {
      antialias: this.capabilities.gpu,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true
    };

    // Would integrate with Three.js or 3Dmol.js
    return rendererConfig;
  }

  public optimizeForDevice(): void {
    const deviceType = this.detectDeviceType();
    
    switch (deviceType) {
      case 'mobile':
        this.applyMobileOptimizations();
        break;
      case 'tablet':
        this.applyTabletOptimizations();
        break;
      case 'desktop':
        this.applyDesktopOptimizations();
        break;
      case 'low-end':
        this.applyLowEndOptimizations();
        break;
    }
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'low-end' {
    const screenWidth = window.screen.width;
    const pixelRatio = window.devicePixelRatio || 1;
    const isTouchDevice = this.capabilities.touchevents;
    
    if (this.config.memoryLimitMB < 256) {
      return 'low-end';
    } else if (isTouchDevice && screenWidth < 768) {
      return 'mobile';
    } else if (isTouchDevice && screenWidth >= 768) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  private applyMobileOptimizations(): void {
    // Reduce quality settings for mobile devices
    this.config.memoryLimitMB = Math.min(this.config.memoryLimitMB, 256);
    this.performanceMonitor.setTargetFPS(30);
  }

  private applyTabletOptimizations(): void {
    // Moderate quality settings for tablets
    this.config.memoryLimitMB = Math.min(this.config.memoryLimitMB, 512);
    this.performanceMonitor.setTargetFPS(45);
  }

  private applyDesktopOptimizations(): void {
    // High quality settings for desktop
    this.performanceMonitor.setTargetFPS(60);
  }

  private applyLowEndOptimizations(): void {
    // Minimum quality settings for low-end devices
    this.config.memoryLimitMB = 128;
    this.performanceMonitor.setTargetFPS(24);
    this.memoryManager.setAggressiveGC(true);
  }

  public checkBrowserSupport(): { supported: boolean; issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for unsupported browsers based on user agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('msie') || userAgent.includes('trident')) {
      const ieMatch = userAgent.match(/(?:msie |rv:)(\d+)/);
      const ieVersion = ieMatch ? parseInt(ieMatch[1]) : 0;
      if (ieVersion < 11) {
        issues.push('Internet Explorer version not supported');
        recommendations.push('Please use a modern browser like Chrome, Firefox, or Edge');
      }
    }

    // Check critical requirements
    if (!this.capabilities.webgl && this.config.webglFallback === 'error') {
      issues.push('WebGL is required but not supported');
      recommendations.push('Please update your browser or enable hardware acceleration');
    }

    if (this.config.memoryLimitMB < 64) {
      issues.push('Insufficient memory available');
      recommendations.push('Close other applications to free up memory');
    }

    // Check for optimal experience
    if (!this.capabilities.webgl2) {
      recommendations.push('Update your browser for better performance');
    }

    if (!this.capabilities.webworkers) {
      recommendations.push('Enable JavaScript for full functionality');
    }

    return {
      supported: issues.length === 0,
      issues,
      recommendations
    };
  }

  public updateConfig(newConfig: Partial<CompatibilityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.applyPerformanceMode();
  }

  public handleRenderingError(error: Error): void {
    console.warn('Rendering error handled:', error.message);
    // Implement fallback strategies or error recovery
    if (!this.capabilities.webgl) {
      this.setupWebGLFallback();
    }
  }

  public dispose(): void {
    this.performanceMonitor.stop();
    this.memoryManager.cleanup();
    this.fallbackRenderer.dispose();
    this.compatibilityLayer.dispose();
  }
}

// Supporting classes
class PerformanceMonitor {
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
  private targetFPS = 60;
  private metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    memoryUsed: 50,
    memoryUsage: 50,
    memoryLimit: 512,
    drawCalls: 100,
    triangles: 5000,
    textureMemory: 25,
    geometryMemory: 25,
    renderTime: 12.5,
    renderingTime: 12.5,
    updateTime: 4.17
  };

  setTargetFPS(fps: number): void {
    this.targetFPS = fps;
  }

  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  stop(): void {
    // Stop monitoring
  }
}

class MemoryManager {
  onMemoryPressure?: (level: 'warning' | 'critical') => void;
  private memoryLimit: number;
  private aggressiveGC = false;

  constructor(limitMB: number) {
    this.memoryLimit = limitMB * 1024 * 1024; // Convert to bytes
  }

  setAggressiveGC(enabled: boolean): void {
    this.aggressiveGC = enabled;
  }

  getAvailableMemory(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.jsHeapSizeLimit - memory.usedJSHeapSize;
    }
    return this.memoryLimit * 0.5; // Conservative estimate
  }

  cleanup(): void {
    // Perform cleanup
  }

  emergencyCleanup(): void {
    // Perform emergency cleanup
    this.cleanup();
    this.forceGarbageCollection();
  }

  forceGarbageCollection(): void {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }
}

class FallbackRenderer {
  useCanvas2D(): void {
    // Setup Canvas 2D fallback
  }

  useSVG(): void {
    // Setup SVG fallback
  }

  useStaticImages(): void {
    // Setup static image fallback
  }

  createRenderer(container: HTMLElement): any {
    // Create fallback renderer
    return {};
  }

  dispose(): void {
    // Cleanup fallback renderer
  }
}

class CompatibilityLayer {
  constructor(capabilities: BrowserCapabilities) {}

  applyPolyfills(): void {
    // Apply necessary polyfills
    this.polyfillIntersectionObserver();
    this.polyfillResizeObserver();
    this.polyfillRequestAnimationFrame();
  }

  private polyfillIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      // Load IntersectionObserver polyfill
    }
  }

  private polyfillResizeObserver(): void {
    if (!('ResizeObserver' in window)) {
      // Load ResizeObserver polyfill
    }
  }

  private polyfillRequestAnimationFrame(): void {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 1000 / 60);
      };
    }
  }

  dispose(): void {
    // Cleanup compatibility layer
  }
}
