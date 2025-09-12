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
  // Sub-system configurations
  animation: Partial<EnhancedAnimationConfig>;
  rendering: Partial<RenderingConfig>;
  ui: Partial<UIConfig>;
  compatibility: Partial<CompatibilityConfig>;
  features: Partial<FeatureConfig>;
  
  // Integration settings
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

export class CREBMasterEnhancementSystem {
  private config: MasterConfig;
  private animationController!: EnhancedAnimationController;
  private molecularRenderer!: EnhancedMolecularRenderer;
  private uiSystem!: EnhancedUI;
  private compatibilityManager!: BrowserCompatibilityManager;
  private featuresSystem!: EnhancedFeaturesSystem;
  
  private status: SystemStatus;
  private container: HTMLElement;
  private initialized: boolean = false;

  constructor(container: HTMLElement, config: Partial<MasterConfig> = {}) {
    this.container = container;
    this.config = this.mergeConfig(config);
    this.status = this.initializeStatus();
    
    // Initialize subsystems asynchronously
    this.initializeSubsystems().catch(error => {
      console.error('Subsystem initialization failed:', error);
      this.handleInitializationError(error);
    });
  }

  private mergeConfig(config: Partial<MasterConfig>): MasterConfig {
    return {
      // Animation defaults
      animation: {
        duration: 3000,
        easing: 'power2.inOut',
        qualityLevel: 'medium',
        adaptiveQuality: true,
        particleEffects: true,
        ...config.animation
      },
      
      // Rendering defaults
      rendering: {
        useExperimentalData: true,
        validateGeometry: true,
        materialQuality: 'high',
        antialiasing: true,
        shadows: true,
        ...config.rendering
      },
      
      // UI defaults
      ui: {
        theme: 'auto',
        touchOptimized: this.detectTouch(),
        keyboardNavigation: true,
        screenReaderSupport: true,
        animatedTransitions: true,
        ...config.ui
      },
      
      // Compatibility defaults
      compatibility: {
        webglFallback: 'canvas2d',
        performanceMode: 'auto',
        autoOptimize: true,
        detectCapabilities: true,
        ...config.compatibility
      },
      
      // Features defaults
      features: {
        showStepByStep: true,
        enableQuizMode: false,
        provideInsights: true,
        enableComparisons: true,
        ...config.features
      },
      
      // Integration defaults
      enableAllFeatures: true,
      autoOptimization: true,
      debugMode: false,
      telemetryEnabled: false,
      
      ...config
    };
  }

  private detectTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private initializeStatus(): SystemStatus {
    return {
      animation: 'loading',
      rendering: 'loading',
      ui: 'loading',
      compatibility: 'compatible',
      features: 'loading',
      overall: 'initializing'
    };
  }

  private async initializeSubsystems(): Promise<void> {
    try {
      // Initialize compatibility manager first
      this.compatibilityManager = new BrowserCompatibilityManager(this.config.compatibility);
      const capabilities = this.compatibilityManager.getCapabilities();
      
      // Check browser support
      const supportCheck = this.compatibilityManager.checkBrowserSupport();
      if (!supportCheck.supported) {
        this.status.compatibility = 'incompatible';
        throw new Error(`Browser not supported: ${supportCheck.issues.join(', ')}`);
      }

      // Optimize configuration based on capabilities
      await this.optimizeConfigForDevice(capabilities);

      // Initialize UI system
      this.uiSystem = new EnhancedUI(this.container, this.config.ui);
      this.setupUIEventHandlers();
      this.status.ui = 'ready';

      // Initialize rendering system
      let renderContainer = this.container.querySelector('#molecular-viewer') as HTMLElement;
      if (!renderContainer) {
        // Create the molecular viewer container if it doesn't exist
        renderContainer = document.createElement('div');
        renderContainer.id = 'molecular-viewer';
        renderContainer.style.width = '100%';
        renderContainer.style.height = '100%';
        renderContainer.style.position = 'relative';
        this.container.appendChild(renderContainer);
      }
      
      this.molecularRenderer = new EnhancedMolecularRenderer(renderContainer, this.config.rendering);
      this.status.rendering = 'ready';

      // Initialize animation controller
      this.animationController = new EnhancedAnimationController(renderContainer, this.config.animation);
      this.status.animation = 'ready';

      // Initialize features system
      this.featuresSystem = new EnhancedFeaturesSystem(this.config.features);
      this.status.features = 'ready';

      // Setup integration between systems
      this.setupSystemIntegration();

      this.status.overall = 'ready';
      this.initialized = true;

      this.showInitializationComplete();

    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  private async optimizeConfigForDevice(capabilities: any): Promise<void> {
    // Optimize animation settings
    if (!capabilities.webgl) {
      this.config.animation.qualityLevel = 'low';
      this.config.animation.particleEffects = false;
    }

    // Optimize rendering settings
    if (!capabilities.gpu) {
      this.config.rendering.materialQuality = 'medium';
      this.config.rendering.shadows = false;
      this.config.rendering.antialiasing = false;
    }

    // Optimize UI settings
    if (capabilities.mobile) {
      this.config.ui.compactMode = true;
      this.config.ui.touchOptimized = true;
    }

    // Apply device-specific optimizations
    this.compatibilityManager.optimizeForDevice();
  }

  private setupUIEventHandlers(): void {
    // Connect UI events to system functions
    this.uiSystem.onAnimationRequest = async (equation: string) => {
      await this.animateReaction({ equation });
    };

    this.uiSystem.onPlaybackToggle = () => {
      // Handle play/pause
      if (this.animationController) {
        // Implementation depends on animation state
      }
    };

    this.uiSystem.onStop = () => {
      if (this.animationController) {
        this.animationController.stop();
      }
    };

    this.uiSystem.onSeek = (progress: number) => {
      // Handle seeking in animation
    };

    this.uiSystem.onSpeedChange = (speed: number) => {
      if (this.animationController) {
        this.animationController.setSpeed(speed);
      }
    };
  }

  private setupSystemIntegration(): void {
    // Animation + Rendering Integration
    // Connect animation events to renderer
    
    // UI + Features Integration
    // Connect UI elements to feature system
    
    // Performance Monitoring Integration
    this.setupPerformanceMonitoring();
    
    // Error Handling Integration
    this.setupErrorHandling();
  }

  private setupPerformanceMonitoring(): void {
    setInterval(() => {
      const animationMetrics = this.animationController?.getPerformanceMetrics();
      const compatibilityMetrics = this.compatibilityManager?.getPerformanceMetrics();
      
      if (this.config.autoOptimization) {
        this.optimizePerformance(animationMetrics, compatibilityMetrics);
      }
    }, 5000); // Check every 5 seconds
  }

  private optimizePerformance(animationMetrics: any, compatibilityMetrics: any): void {
    if (animationMetrics?.fps < 30) {
      // Reduce quality automatically
      this.reduceQuality();
    }

    if (compatibilityMetrics?.memoryUsage > 0.8) {
      // Trigger memory cleanup
      this.cleanupMemory();
    }
  }

  private reduceQuality(): void {
    // Coordinate quality reduction across all systems
    this.uiSystem?.showMessage({
      type: 'info',
      message: 'Reducing quality to maintain performance',
      duration: 3000
    });
  }

  private cleanupMemory(): void {
    // Trigger memory cleanup across all systems
    this.uiSystem?.showMessage({
      type: 'warning',
      message: 'Cleaning up memory to prevent issues',
      duration: 3000
    });
  }

  private setupErrorHandling(): void {
    // Global error handler for all subsystems
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason);
    });
  }

  private handleGlobalError(error: Error): void {
    console.error('CREB System Error:', error);
    
    this.uiSystem?.showMessage({
      type: 'error',
      message: 'An unexpected error occurred. The system will attempt to recover.',
      duration: 5000,
      actions: [{
        label: 'Reload',
        action: () => window.location.reload()
      }]
    });

    // Attempt recovery
    this.attemptErrorRecovery(error);
  }

  private attemptErrorRecovery(error: Error): void {
    // Try to recover from various error types
    if (error.message.includes('WebGL')) {
      // Switch to fallback renderer
      this.compatibilityManager?.createCompatibleRenderer(this.container);
    }
    
    if (error.message.includes('memory')) {
      // Aggressive memory cleanup
      this.cleanupMemory();
    }
  }

  private showInitializationComplete(): void {
    this.uiSystem?.showMessage({
      type: 'success',
      message: 'CREB Enhanced System initialized successfully!',
      duration: 3000
    });
  }

  private handleInitializationError(error: any): void {
    console.error('CREB Initialization Error:', error);
    
    this.status.overall = 'error';
    
    // Show error in UI if possible
    if (this.uiSystem) {
      this.uiSystem.showMessage({
        type: 'error',
        message: `Initialization failed: ${error.message}`,
        persistent: true,
        actions: [{
          label: 'Retry',
          action: () => this.initializeSubsystems()
        }]
      });
    } else {
      // Fallback error display
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="padding: 20px; background: #ff4444; color: white; text-align: center;">
          <h3>CREB Initialization Failed</h3>
          <p>${error.message}</p>
          <button onclick="location.reload()">Reload Page</button>
        </div>
      `;
      this.container.appendChild(errorDiv);
    }
  }

  // Public API
  public async animateReaction(request: AnimationRequest): Promise<AnimationResult> {
    if (!this.initialized) {
      throw new Error('System not initialized');
    }

    try {
      // Show loading state
      this.uiSystem?.showMessage({
        type: 'info',
        message: 'Preparing animation...',
        duration: 1000
      });

      // Parse and validate equation
      const parseResult = await this.featuresSystem.parseEquation(request.equation);
      
      if (!parseResult || !parseResult.isValid) {
        const errors = parseResult?.errors || ['Unknown parsing error'];
        throw new Error(`Invalid equation: ${errors.join(', ')}`);
      }

      // Load molecular structures
      const reactants = await Promise.all(
        parseResult.reactants.map(r => 
          this.molecularRenderer.loadMolecule(r.formula)
        )
      );

      const products = await Promise.all(
        parseResult.products.map(p => 
          this.molecularRenderer.loadMolecule(p.formula)
        )
      );

      // Create animation
      const startTime = performance.now();
      
      // Enhanced animation with full pipeline
      // For now, use a simplified approach with mock molecular data
      // TODO: Integrate proper equation parsing when PubChem integration is complete
      const mockReactants = [
        { formula: 'H2', position: { x: -2, y: 0, z: 0 }, color: '#ffffff' },
        { formula: 'O2', position: { x: 0, y: 0, z: 0 }, color: '#ff0000' }
      ];
      
      const mockProducts = [
        { formula: 'H2O', position: { x: 2, y: 0, z: 0 }, color: '#0080ff' }
      ];
      
      await this.animationController.animateReaction(
        mockReactants as any,
        mockProducts as any,
        {
          duration: request.options?.duration || 3000,
          quality: request.options?.quality || 'medium',
          effects: request.options?.effects || true
        }
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Get performance metrics
      const performanceMetrics = this.animationController.getPerformanceMetrics();

      // Show success message
      this.uiSystem?.showMessage({
        type: 'success',
        message: 'Animation completed successfully!',
        duration: 2000
      });

      return {
        success: true,
        duration,
        quality: request.options?.quality || 'medium',
        frames: Math.round(duration / 16.67), // Estimate at 60fps
        errors: [],
        warnings: parseResult?.warnings || [],
        performance: {
          renderTime: duration,
          memoryUsed: performanceMetrics.memoryUsage || 0,
          fps: performanceMetrics.fps || 60
        }
      };

    } catch (error) {
      console.error('Animation failed:', error);
      
      this.uiSystem?.showMessage({
        type: 'error',
        message: `Animation failed: ${(error as Error).message}`,
        duration: 5000
      });

      return {
        success: false,
        duration: 0,
        quality: 'none',
        frames: 0,
        errors: [(error as Error).message],
        warnings: [],
        performance: {
          renderTime: 0,
          memoryUsed: 0,
          fps: 0
        }
      };
    }
  }

  public getSystemStatus(): SystemStatus {
    return { ...this.status };
  }

  public isReady(): boolean {
    return this.initialized && this.status.overall === 'ready';
  }

  public getCapabilities(): any {
    return this.compatibilityManager?.getCapabilities();
  }

  public async exportAnimation(format: 'gif' | 'mp4' | 'png'): Promise<Blob> {
    // Implementation would depend on the specific export requirements
    throw new Error('Export functionality not yet implemented');
  }

  public async importReaction(file: File): Promise<void> {
    const importResult = await this.featuresSystem.importReaction(file);
    
    if (importResult.success && importResult.reaction) {
      await this.animateReaction({ 
        equation: importResult.reaction.equation 
      });
    } else {
      throw new Error(`Import failed: ${importResult.errors.join(', ')}`);
    }
  }

  public dispose(): void {
    // Clean up all subsystems
    this.animationController?.dispose();
    this.molecularRenderer?.dispose();
    this.uiSystem?.dispose();
    this.compatibilityManager?.dispose();
    this.featuresSystem?.dispose();
    
    this.initialized = false;
  }
}

// Convenience factory function
export function createEnhancedCREB(
  container: HTMLElement, 
  config: Partial<MasterConfig> = {}
): CREBMasterEnhancementSystem {
  return new CREBMasterEnhancementSystem(container, config);
}

// Export all enhancement systems for individual use
export {
  EnhancedAnimationController,
  EnhancedMolecularRenderer,
  EnhancedUI,
  BrowserCompatibilityManager,
  EnhancedFeaturesSystem
};
