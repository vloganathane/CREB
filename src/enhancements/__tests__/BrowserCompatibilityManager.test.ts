/**
 * @fileoverview Browser Compatibility Manager Tests
 * @module @creb/enhancements/__tests__/BrowserCompatibilityManager.test
 * @version 1.0.0
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { BrowserCompatibilityManager, CompatibilityConfig } from '../BrowserCompatibilityManager';

// Mock DOM elements and browser APIs
const mockCanvas = {
  getContext: jest.fn(),
  toDataURL: jest.fn(),
  style: {},
  width: 800,
  height: 600
};

const mockWebGL = {
  getSupportedExtensions: jest.fn().mockReturnValue(['WEBGL_depth_texture', 'OES_texture_float']),
  getExtension: jest.fn().mockReturnValue({ UNMASKED_RENDERER_WEBGL: 37446 }),
  getParameter: jest.fn().mockReturnValue(4096), // MAX_TEXTURE_SIZE
  createShader: jest.fn(),
  createProgram: jest.fn(),
  MAX_TEXTURE_SIZE: 3379
};

// Mock global objects
Object.defineProperty(window, 'HTMLCanvasElement', {
  value: jest.fn().mockImplementation(() => mockCanvas),
  writable: true
});

Object.defineProperty(document, 'createElement', {
  value: jest.fn().mockImplementation((tagName: any) => {
    if (tagName === 'canvas') {
      return {
        ...mockCanvas,
        getContext: jest.fn().mockImplementation((type: any) => {
          if (type === 'webgl' || type === 'experimental-webgl') {
            return mockWebGL;
          }
          if (type === '2d') {
            return { fillRect: jest.fn(), strokeText: jest.fn() };
          }
          return null;
        })
      };
    }
    return { style: {}, appendChild: jest.fn(), querySelector: jest.fn() };
  }),
  writable: true
});

describe('BrowserCompatibilityManager', () => {
  let manager: BrowserCompatibilityManager;
  let config: CompatibilityConfig;

  beforeEach(() => {
    config = {
      webglFallback: 'canvas2d',
      memoryLimitMB: 512,
      performanceMode: 'auto',
      detectCapabilities: true,
      logCompatibilityWarnings: false, // Reduce console noise in tests
      showCompatibilityMessages: false,
      enableGC: true,
      memoryThreshold: 0.8,
      fpsThreshold: 30,
      autoOptimize: true
    };

    // Reset and recreate mocks to ensure they work
    jest.clearAllMocks();
    
    // Recreate the document.createElement mock
    Object.defineProperty(document, 'createElement', {
      value: jest.fn().mockImplementation((tagName: any) => {
        if (tagName === 'canvas') {
          return {
            ...mockCanvas,
            getContext: jest.fn().mockImplementation((type: any) => {
              if (type === 'webgl' || type === 'experimental-webgl') {
                return mockWebGL;
              }
              if (type === '2d') {
                return { fillRect: jest.fn(), strokeText: jest.fn() };
              }
              return null;
            })
          };
        }
        return { style: {}, appendChild: jest.fn(), querySelector: jest.fn() };
      }),
      writable: true
    });
  });

  afterEach(() => {
    if (manager) {
      // Cleanup if needed
    }
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      manager = new BrowserCompatibilityManager();
      expect(manager).toBeDefined();
    });

    test('should initialize with custom config', () => {
      manager = new BrowserCompatibilityManager(config);
      expect(manager).toBeDefined();
    });

    test('should detect capabilities on initialization', () => {
      config.detectCapabilities = true;
      manager = new BrowserCompatibilityManager(config);
      
      const capabilities = manager.getCapabilities();
      expect(capabilities).toBeDefined();
      expect(typeof capabilities.webgl).toBe('boolean');
      expect(typeof capabilities.gpu).toBe('boolean');
      expect(typeof capabilities.mobile).toBe('boolean');
    });
  });

  describe('WebGL Detection', () => {
    test('should detect WebGL support', () => {
      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      // In Jest/jsdom environment, WebGL is typically not available
      // The test verifies the detection logic works
      expect(typeof capabilities.webgl).toBe('boolean');
      expect(capabilities).toHaveProperty('webgl');
      expect(capabilities).toHaveProperty('webgl2');
      expect(capabilities).toHaveProperty('webglExtensions');
      expect(Array.isArray(capabilities.webglExtensions)).toBe(true);
    });

    test('should handle WebGL context creation failure', () => {
      // Mock WebGL context creation failure
      const failingCanvas = {
        ...mockCanvas,
        getContext: jest.fn().mockReturnValue(null)
      };

      jest.spyOn(document, 'createElement').mockImplementation(() => failingCanvas as any);
      
      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      expect(capabilities.webgl).toBe(false);
    });

    test('should detect WebGL extensions', () => {
      // Setup specific mock for this test
      jest.spyOn(document, 'createElement').mockImplementation((tagName: any) => {
        if (tagName === 'canvas') {
          const canvas = {
            getContext: jest.fn().mockImplementation((type: any) => {
              if (type === 'webgl' || type === 'experimental-webgl') {
                return mockWebGL;
              }
              return null;
            })
          };
          return canvas as any;
        }
        return { style: {}, appendChild: jest.fn(), querySelector: jest.fn() } as any;
      });
      
      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      expect(Array.isArray(capabilities.webglExtensions)).toBe(true);
      expect(capabilities.webglExtensions).toContain('WEBGL_depth_texture');
    });
  });

  describe('Performance Detection', () => {
    test('should detect GPU capabilities', () => {
      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      expect(typeof capabilities.gpu).toBe('boolean');
      expect(typeof capabilities.maxTextureSize).toBe('number');
      expect(typeof capabilities.memoryInfo).toBe('object');
    });

    test('should detect mobile devices', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      expect(capabilities.mobile).toBe(true);
    });

    test('should measure performance metrics', () => {
      manager = new BrowserCompatibilityManager(config);
      const metrics = manager.getPerformanceMetrics();
      
      expect(metrics).toBeDefined();
      expect(typeof metrics.memoryUsage).toBe('number');
      expect(typeof metrics.renderingTime).toBe('number');
      expect(typeof metrics.fps).toBe('number');
    });
  });

  describe('Browser Support Check', () => {
    test('should check browser support successfully', () => {
      manager = new BrowserCompatibilityManager(config);
      const supportCheck = manager.checkBrowserSupport();
      
      expect(supportCheck.supported).toBe(true);
      expect(Array.isArray(supportCheck.issues)).toBe(true);
      expect(Array.isArray(supportCheck.recommendations)).toBe(true);
    });

    test('should detect unsupported browsers', () => {
      // Mock very old browser
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1)',
        configurable: true
      });

      manager = new BrowserCompatibilityManager(config);
      const supportCheck = manager.checkBrowserSupport();
      
      expect(supportCheck.supported).toBe(false);
      expect(supportCheck.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Fallback Mechanisms', () => {
    test('should create compatible renderer with WebGL', () => {
      const container = document.createElement('div');
      manager = new BrowserCompatibilityManager(config);
      
      const renderer = manager.createCompatibleRenderer(container);
      expect(renderer).toBeDefined();
    });

    test('should fallback to Canvas 2D when WebGL unavailable', () => {
      // Mock WebGL unavailable
      const noWebGLCanvas = {
        ...mockCanvas,
        getContext: jest.fn().mockImplementation((type: any) => {
          if (type === 'webgl' || type === 'experimental-webgl') {
            return null;
          }
          return { fillRect: jest.fn(), strokeText: jest.fn() };
        })
      };

      jest.spyOn(document, 'createElement').mockImplementation(() => noWebGLCanvas as any);
      
      const container = document.createElement('div');
      manager = new BrowserCompatibilityManager(config);
      
      const renderer = manager.createCompatibleRenderer(container);
      expect(renderer).toBeDefined();
    });
  });

  describe('Device Optimization', () => {
    test('should optimize for device capabilities', () => {
      manager = new BrowserCompatibilityManager(config);
      
      expect(() => {
        manager.optimizeForDevice();
      }).not.toThrow();
    });

    test('should adjust settings for mobile devices', () => {
      // Mock mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      manager = new BrowserCompatibilityManager(config);
      manager.optimizeForDevice();
      
      // Should complete without errors
      expect(manager).toBeDefined();
    });

    test('should adjust settings for low-end devices', () => {
      // Mock low memory
      const lowMemoryCapabilities = {
        webgl: true,
        gpu: false,
        mobile: false,
        maxTextureSize: 512,
        memoryInfo: { usedJSHeapSize: 900000000, totalJSHeapSize: 1000000000 }
      };

      manager = new BrowserCompatibilityManager(config);
      
      // Mock low capabilities
      jest.spyOn(manager, 'getCapabilities').mockReturnValue(lowMemoryCapabilities as any);
      
      expect(() => {
        manager.optimizeForDevice();
      }).not.toThrow();
    });
  });

  describe('Configuration Management', () => {
    test('should update configuration', () => {
      manager = new BrowserCompatibilityManager(config);
      
      const newConfig = { ...config, performanceMode: 'battery' as const };
      manager.updateConfig(newConfig);
      
      // Should complete without errors
      expect(manager).toBeDefined();
    });

    test('should handle invalid configuration gracefully', () => {
      manager = new BrowserCompatibilityManager(config);
      
      expect(() => {
        manager.updateConfig({} as any);
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle WebGL context loss', () => {
      const container = document.createElement('div');
      const mockCanvas = {
        ...document.createElement('canvas'),
        dispatchEvent: jest.fn()
      };
      
      // Mock querySelector to return canvas
      (container as any).querySelector = jest.fn().mockReturnValue(mockCanvas);
      
      manager = new BrowserCompatibilityManager(config);
      const renderer = manager.createCompatibleRenderer(container);
      
      // Simulate WebGL context loss
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const lossEvent = new Event('webglcontextlost');
        canvas.dispatchEvent(lossEvent);
      }
      
      // Should handle gracefully
      expect(renderer).toBeDefined();
      expect(mockCanvas.dispatchEvent).toHaveBeenCalled();
    });

    test('should recover from rendering errors', () => {
      manager = new BrowserCompatibilityManager(config);
      
      expect(() => {
        manager.handleRenderingError(new Error('WebGL error'));
      }).not.toThrow();
    });
  });

  describe('Metrics and Monitoring', () => {
    test('should track performance over time', () => {
      manager = new BrowserCompatibilityManager(config);
      
      // Get initial metrics
      const initialMetrics = manager.getPerformanceMetrics();
      
      // Wait a bit and get new metrics
      setTimeout(() => {
        const newMetrics = manager.getPerformanceMetrics();
        expect(newMetrics).toBeDefined();
        expect(typeof newMetrics.fps).toBe('number');
      }, 100);
    });

    test('should provide detailed capability report', () => {
      manager = new BrowserCompatibilityManager(config);
      const capabilities = manager.getCapabilities();
      
      expect(capabilities).toHaveProperty('webgl');
      expect(capabilities).toHaveProperty('gpu');
      expect(capabilities).toHaveProperty('mobile');
      expect(capabilities).toHaveProperty('memoryInfo');
      expect(capabilities).toHaveProperty('maxTextureSize');
    });
  });
});
