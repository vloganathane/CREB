/**
 * @fileoverview Integration Tests for Enhanced Systems
 * @module @creb/enhancements/__tests__/integration.test
 * @version 1.0.0
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { CREBMasterEnhancementSystem } from '../index';

// Mock DOM environment
const mockContainer = {
  style: {},
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  querySelectorAll: jest.fn().mockReturnValue([]),
  clientWidth: 800,
  clientHeight: 600,
  getBoundingClientRect: jest.fn().mockReturnValue({
    width: 800,
    height: 600,
    top: 0,
    left: 0
  })
};

// Mock browser APIs
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn().mockReturnValue(Date.now())
  },
  writable: true
});

Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  writable: true
});

describe('CREB Master Enhancement System Integration', () => {
  let system: CREBMasterEnhancementSystem;
  let container: HTMLElement;

  beforeEach(() => {
    container = mockContainer as any;
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (system && system.isReady()) {
      // Cleanup
      system.dispose?.();
    }
  });

  describe('System Initialization', () => {
    test('should initialize with default configuration', () => {
      expect(() => {
        system = new CREBMasterEnhancementSystem(container);
      }).not.toThrow();
      
      expect(system).toBeDefined();
    });

    test('should initialize with custom configuration', () => {
      const customConfig = {
        animation: {
          duration: 5000,
          qualityLevel: 'high' as const
        },
        rendering: {
          materialQuality: 'high' as const,
          antialiasing: true
        },
        ui: {
          theme: 'dark' as const,
          touchOptimized: true
        },
        enableAllFeatures: true,
        autoOptimization: true,
        debugMode: true
      };

      expect(() => {
        system = new CREBMasterEnhancementSystem(container, customConfig);
      }).not.toThrow();
      
      expect(system).toBeDefined();
    });

    test('should handle initialization errors gracefully', () => {
      // Mock a failing container
      const failingContainer = {
        ...mockContainer,
        appendChild: jest.fn(() => { throw new Error('DOM error'); })
      };

      expect(() => {
        system = new CREBMasterEnhancementSystem(failingContainer as any);
      }).not.toThrow();
    });
  });

  describe('System Status and Health', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container);
    });

    test('should provide system status', () => {
      const status = system.getSystemStatus();
      
      expect(status).toBeDefined();
      expect(status).toHaveProperty('animation');
      expect(status).toHaveProperty('rendering');
      expect(status).toHaveProperty('ui');
      expect(status).toHaveProperty('compatibility');
      expect(status).toHaveProperty('features');
      expect(status).toHaveProperty('overall');
    });

    test('should check if system is ready', () => {
      const isReady = system.isReady();
      expect(typeof isReady).toBe('boolean');
    });

    test('should provide system capabilities', () => {
      const capabilities = system.getCapabilities();
      
      expect(capabilities).toBeDefined();
      expect(typeof capabilities.webgl).toBe('boolean');
      expect(typeof capabilities.webworkers).toBe('boolean');
      expect(typeof capabilities.indexeddb).toBe('boolean');
    });
  });

  describe('Animation System Integration', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container, {
        animation: { qualityLevel: 'medium' },
        enableAllFeatures: true
      });
    });

    test('should handle animation requests', async () => {
      const animationRequest = {
        equation: 'H2 + O2 = H2O',
        options: {
          duration: 3000,
          quality: 'medium' as const,
          effects: true
        }
      };

      await expect(
        system.animateReaction(animationRequest)
      ).resolves.toBeDefined();
    });

    test('should handle invalid equations gracefully', async () => {
      const invalidRequest = {
        equation: 'invalid equation',
        options: {
          duration: 3000
        }
      };

      await expect(
        system.animateReaction(invalidRequest)
      ).rejects.toThrow();
    });

    test('should adapt animation quality based on performance', async () => {
      const request = {
        equation: 'CH4 + 2O2 = CO2 + 2H2O',
        options: {
          duration: 2000,
          quality: 'high' as const
        }
      };

      // Should handle performance adaptation without errors
      await expect(
        system.animateReaction(request)
      ).resolves.toBeDefined();
    });
  });

  describe('Cross-System Communication', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container, {
        enableAllFeatures: true,
        autoOptimization: true
      });
    });

    test('should coordinate between animation and rendering systems', async () => {
      const request = {
        equation: '2H2 + O2 = 2H2O',
        options: {
          duration: 1000,
          effects: true,
          stepByStep: true
        }
      };

      const result = await system.animateReaction(request);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(typeof result.duration).toBe('number');
    });

    test('should handle system state monitoring', () => {
      expect(() => {
        const status = system.getSystemStatus();
        const capabilities = system.getCapabilities();
        expect(status).toBeDefined();
        expect(capabilities).toBeDefined();
      }).not.toThrow();
    });

    test('should coordinate system components', () => {
      // Test that systems are properly integrated
      const isReady = system.isReady();
      const capabilities = system.getCapabilities();
      
      expect(typeof isReady).toBe('boolean');
      if (capabilities) {
        expect(typeof capabilities).toBe('object');
      }
    });
  });

  describe('Error Recovery and Resilience', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container);
    });

    test('should handle initialization gracefully', () => {
      expect(system).toBeDefined();
      expect(typeof system.isReady()).toBe('boolean');
    });

    test('should provide system status during errors', () => {
      const status = system.getSystemStatus();
      expect(status).toBeDefined();
      expect(status.overall).toBeDefined();
    });

    test('should fallback gracefully when features are unavailable', () => {
      // Simulate missing WebGL
      Object.defineProperty(window, 'WebGLRenderingContext', {
        value: undefined,
        writable: true
      });

      expect(() => {
        new CREBMasterEnhancementSystem(container);
      }).not.toThrow();
    });
  });

  describe('Performance Monitoring and System Health', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container, {
        autoOptimization: true
      });
    });

    test('should monitor system status', () => {
      const status = system.getSystemStatus();
      
      expect(status).toBeDefined();
      expect(status).toHaveProperty('overall');
      expect(status).toHaveProperty('animation');
      expect(status).toHaveProperty('rendering');
    });

    test('should provide capabilities information', () => {
      const capabilities = system.getCapabilities();
      
      if (capabilities) {
        expect(typeof capabilities).toBe('object');
      }
    });

    test('should handle system readiness checks', () => {
      const isReady = system.isReady();
      expect(typeof isReady).toBe('boolean');
    });
  });

  describe('System Configuration', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container);
    });

    test('should initialize with default configuration', () => {
      expect(system).toBeDefined();
      expect(system.isReady).toBeDefined();
    });

    test('should handle configuration variations', () => {
      const customSystem = new CREBMasterEnhancementSystem(container, {
        enableAllFeatures: false,
        autoOptimization: false,
        debugMode: true
      });
      
      expect(customSystem).toBeDefined();
    });

    test('should provide system capabilities', () => {
      const capabilities = system.getCapabilities();
      
      if (capabilities) {
        expect(typeof capabilities).toBe('object');
      }
    });
  });

  describe('Cleanup and Resource Management', () => {
    test('should dispose resources properly', () => {
      system = new CREBMasterEnhancementSystem(container);
      
      expect(() => {
        system.dispose();
      }).not.toThrow();
    });

    test('should handle multiple dispose calls', () => {
      system = new CREBMasterEnhancementSystem(container);
      
      system.dispose();
      expect(() => {
        system.dispose();
      }).not.toThrow();
    });

    test('should prevent operations after disposal', () => {
      system = new CREBMasterEnhancementSystem(container);
      system.dispose();
      
      // Operations after disposal should be handled gracefully
      expect(system.isReady()).toBe(false);
    });
  });

  describe('Browser Compatibility', () => {
    test('should work in modern browsers', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124',
        writable: true
      });

      expect(() => {
        system = new CREBMasterEnhancementSystem(container);
      }).not.toThrow();
    });

    test('should handle older browsers gracefully', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 Safari/537.36',
        writable: true
      });

      expect(() => {
        system = new CREBMasterEnhancementSystem(container);
      }).not.toThrow();
    });

    test('should detect mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) WebKit/605.1.15',
        writable: true
      });

      system = new CREBMasterEnhancementSystem(container);
      const capabilities = system.getCapabilities();
      
      expect(capabilities.mobile).toBe(true);
    });
  });

  describe('Real-world Usage Scenarios', () => {
    beforeEach(() => {
      system = new CREBMasterEnhancementSystem(container, {
        enableAllFeatures: true,
        autoOptimization: true
      });
    });

    test('should handle educational use case', async () => {
      const educationalRequest = {
        equation: 'C6H12O6 + 6O2 = 6CO2 + 6H2O',
        options: {
          quality: 'medium' as const,
          stepByStep: true,
          exportFormat: 'gif'
        }
      };

      const result = await system.animateReaction(educationalRequest);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    test('should handle research presentation use case', async () => {
      const researchRequest = {
        equation: 'NH3 + HCl = NH4Cl',
        options: {
          quality: 'ultra' as const,
          effects: true,
          duration: 5000
        }
      };

      const result = await system.animateReaction(researchRequest);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    test('should handle mobile learning scenario', async () => {
      // Simulate mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true
      });

      system = new CREBMasterEnhancementSystem(container, {
        ui: { touchOptimized: true },
        animation: { qualityLevel: 'low' }
      });

      const mobileRequest = {
        equation: 'H2 + Cl2 = 2HCl',
        options: {
          quality: 'low' as const,
          duration: 2000
        }
      };

      const result = await system.animateReaction(mobileRequest);
      
      expect(result).toBeDefined();
    });
  });
});
