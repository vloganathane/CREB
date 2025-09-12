/**
 * @fileoverview Enhanced Animation Controller Tests
 * @module @creb/enhancements/__tests__/EnhancedAnimationController.test
 * @version 1.0.0
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EnhancedAnimationController, EnhancedAnimationConfig, PerformanceMetrics } from '../EnhancedAnimationController';

// Mock THREE.js
const mockTHREE = {
  Scene: jest.fn().mockImplementation(() => ({
    background: null,
    add: jest.fn(),
    remove: jest.fn()
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    domElement: document.createElement('canvas'),
    render: jest.fn(),
    dispose: jest.fn()
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn()
  })),
  Color: jest.fn().mockImplementation((color) => ({ color }))
};

// Mock GSAP
const mockTimeline = {
  to: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  play: jest.fn().mockReturnThis(),
  pause: jest.fn().mockReturnThis(),
  kill: jest.fn().mockReturnThis(),
  clear: jest.fn().mockReturnThis(),
  stop: jest.fn().mockReturnThis(),
  eventCallback: jest.fn().mockImplementation(function(event, callback) {
    if (event === 'onComplete' && typeof callback === 'function') {
      // Execute the callback immediately for testing
      setTimeout(callback, 0);
    }
    return this;
  }),
  duration: jest.fn().mockReturnValue(3),
  progress: jest.fn().mockReturnValue(0.5),
  totalDuration: jest.fn().mockReturnValue(3),
  isActive: jest.fn().mockReturnValue(true),
  timeScale: jest.fn().mockReturnThis()
};

const mockGSAP = {
  timeline: jest.fn().mockReturnValue(mockTimeline),
  to: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn()
};

// Mock globals
Object.defineProperty(window, 'THREE', {
  value: mockTHREE,
  writable: true
});

Object.defineProperty(window, 'gsap', {
  value: mockGSAP,
  writable: true
});

const mockContainer = {
  style: {},
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  querySelector: jest.fn(),
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

describe('EnhancedAnimationController', () => {
  let controller: EnhancedAnimationController;
  let container: HTMLElement;
  let config: EnhancedAnimationConfig;

  beforeEach(() => {
    container = mockContainer as any;
    config = {
      duration: 3000,
      easing: 'power2.inOut',
      transitionType: 'smooth',
      frameRate: 60,
      particleEffects: true,
      glowEffects: true,
      trailEffects: false,
      bloomIntensity: 1.0,
      qualityLevel: 'medium',
      adaptiveQuality: true,
      maxParticles: 1000,
      cullDistance: 100,
      webglFallback: true,
      mobileOptimizations: true,
      memoryThreshold: 0.8
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    if (controller) {
      controller.dispose();
    }
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      expect(() => {
        controller = new EnhancedAnimationController(container);
      }).not.toThrow();
      expect(controller).toBeDefined();
    });

    test('should initialize with custom config', () => {
      expect(() => {
        controller = new EnhancedAnimationController(container, config);
      }).not.toThrow();
      expect(controller).toBeDefined();
    });

    test('should setup animation timeline', () => {
      controller = new EnhancedAnimationController(container, config);
      expect(mockGSAP.timeline).toHaveBeenCalled();
    });
  });

  describe('Animation Control', () => {
    beforeEach(() => {
      controller = new EnhancedAnimationController(container, config);
    });

    test('should start animation', async () => {
      const mockReactants = [
        { id: 'h2', formula: 'H2', atoms: [], bonds: [] }
      ];
      const mockProducts = [
        { id: 'h2o', formula: 'H2O', atoms: [], bonds: [] }
      ];

      await expect(
        controller.animateReaction(mockReactants, mockProducts, { showEnergyProfile: true })
      ).resolves.not.toThrow();
    });

    test('should play animation', () => {
      expect(() => controller.play()).not.toThrow();
    });

    test('should pause animation', () => {
      expect(() => controller.pause()).not.toThrow();
    });

    test('should stop animation', () => {
      expect(() => controller.stop()).not.toThrow();
    });
  });

  describe('Animation Properties', () => {
    beforeEach(() => {
      controller = new EnhancedAnimationController(container, config);
    });

    test('should set animation speed', () => {
      expect(() => controller.setSpeed(2.0)).not.toThrow();
      expect(() => controller.setSpeed(0.5)).not.toThrow();
    });

    test('should handle invalid speed values gracefully', () => {
      expect(() => controller.setSpeed(-1)).not.toThrow();
      expect(() => controller.setSpeed(0)).not.toThrow();
      expect(() => controller.setSpeed(NaN)).not.toThrow();
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(() => {
      controller = new EnhancedAnimationController(container, config);
    });

    test('should provide performance metrics', () => {
      const metrics = controller.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics.fps).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
      expect(typeof metrics.frameTime).toBe('number');
      expect(typeof metrics.drawCalls).toBe('number');
      expect(typeof metrics.triangles).toBe('number');
      expect(typeof metrics.gpuMemory).toBe('number');
    });

    test('should track frame rate', () => {
      const metrics = controller.getPerformanceMetrics();
      expect(metrics.fps).toBeGreaterThanOrEqual(0);
      expect(metrics.fps).toBeLessThanOrEqual(120); // Reasonable upper bound
    });

    test('should monitor memory usage', () => {
      const metrics = controller.getPerformanceMetrics();
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeLessThanOrEqual(1);
    });
  });

  describe('Resource Management', () => {
    beforeEach(() => {
      controller = new EnhancedAnimationController(container, config);
    });

    test('should dispose resources properly', () => {
      expect(() => controller.dispose()).not.toThrow();
    });

    test('should handle multiple dispose calls gracefully', () => {
      controller.dispose();
      expect(() => controller.dispose()).not.toThrow();
    });

    test('should prevent operations after disposal', () => {
      controller.dispose();
      
      // Operations after disposal should be handled gracefully
      expect(() => controller.play()).not.toThrow();
      expect(() => controller.pause()).not.toThrow();
      expect(() => controller.stop()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      controller = new EnhancedAnimationController(container, config);
    });

    test('should handle missing dependencies gracefully', () => {
      // Temporarily remove THREE
      const originalTHREE = (window as any).THREE;
      delete (window as any).THREE;

      expect(() => {
        new EnhancedAnimationController(container, config);
      }).not.toThrow();

      // Restore THREE
      (window as any).THREE = originalTHREE;
    });

    test('should handle invalid animation data', async () => {
      const invalidReactants = null as any;
      const invalidProducts = undefined as any;

      await expect(
        controller.animateReaction(invalidReactants, invalidProducts, {})
      ).rejects.toThrow();
    });

    test('should handle empty containers gracefully', () => {
      const emptyContainer = { clientWidth: 0, clientHeight: 0, appendChild: jest.fn() };
      
      expect(() => {
        new EnhancedAnimationController(emptyContainer as any, config);
      }).not.toThrow();
    });
  });
});
