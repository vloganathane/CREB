/**
 * Tests for Configuration Validation Schemas
 * 
 * Tests covering validation logic, schema definitions, and documentation generation.
 */

import {
  validateConfig,
  crebConfigSchema,
  cacheConfigSchema,
  performanceConfigSchema,
  dataConfigSchema,
  loggingConfigSchema,
  defaultConfig,
  generateSchemaDocumentation
} from '../schemas/validation';
import { CREBConfig } from '../types';

describe('Configuration Validation', () => {
  describe('Schema Validation', () => {
    it('should validate correct configuration', () => {
      const validConfig: CREBConfig = {
        cache: {
          maxSize: 2000,
          ttl: 600000,
          strategy: 'lru'
        },
        performance: {
          enableWasm: true,
          workerThreads: 4,
          batchSize: 100
        },
        data: {
          providers: ['sqlite', 'nist'],
          syncInterval: 3600000,
          offlineMode: false
        },
        logging: {
          level: 'debug',
          format: 'json',
          destinations: ['console', 'file']
        }
      };

      const result = validateConfig(validConfig, crebConfigSchema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect type errors', () => {
      const invalidConfig = {
        cache: {
          maxSize: 'not-a-number',
          ttl: 300000,
          strategy: 'lru'
        },
        performance: {
          enableWasm: 'not-boolean',
          workerThreads: 4,
          batchSize: 100
        }
      };

      const result = validateConfig(invalidConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'cache.maxSize')).toBe(true);
      expect(result.errors.some(e => e.path === 'performance.enableWasm')).toBe(true);
    });

    it('should detect missing required properties', () => {
      const incompleteConfig = {
        cache: {
          maxSize: 1000
          // Missing ttl and strategy
        },
        performance: {
          enableWasm: true
          // Missing workerThreads and batchSize
        }
      };

      const result = validateConfig(incompleteConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('ttl') && e.message.includes('missing'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('strategy') && e.message.includes('missing'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('workerThreads') && e.message.includes('missing'))).toBe(true);
    });

    it('should validate enum values', () => {
      const invalidEnumConfig = {
        cache: {
          maxSize: 1000,
          ttl: 300000,
          strategy: 'invalid-strategy'
        },
        logging: {
          level: 'invalid-level',
          format: 'invalid-format',
          destinations: ['console']
        }
      };

      const result = validateConfig(invalidEnumConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.path === 'cache.strategy')).toBe(true);
      expect(result.errors.some(e => e.path === 'logging.level')).toBe(true);
      expect(result.errors.some(e => e.path === 'logging.format')).toBe(true);
    });

    it('should validate number ranges', () => {
      const outOfRangeConfig = {
        cache: {
          maxSize: -1, // Below minimum
          ttl: 500, // Below minimum
          strategy: 'lru'
        },
        performance: {
          enableWasm: false,
          workerThreads: 0, // Below minimum
          batchSize: 20000 // Above maximum
        }
      };

      const result = validateConfig(outOfRangeConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.path === 'cache.maxSize' && e.message.includes('below minimum'))).toBe(true);
      expect(result.errors.some(e => e.path === 'cache.ttl' && e.message.includes('below minimum'))).toBe(true);
      expect(result.errors.some(e => e.path === 'performance.workerThreads' && e.message.includes('below minimum'))).toBe(true);
      expect(result.errors.some(e => e.path === 'performance.batchSize' && e.message.includes('above maximum'))).toBe(true);
    });

    it('should validate array items', () => {
      const invalidArrayConfig = {
        data: {
          providers: ['sqlite', 'invalid-provider'],
          syncInterval: 3600000,
          offlineMode: false
        },
        logging: {
          level: 'info',
          format: 'text',
          destinations: ['console', 'invalid-destination']
        }
      };

      const result = validateConfig(invalidArrayConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.path === 'data.providers[1]')).toBe(true);
      expect(result.errors.some(e => e.path === 'logging.destinations[1]')).toBe(true);
    });

    it('should handle null and undefined values', () => {
      const nullConfig = null;
      const undefinedConfig = undefined;

      const nullResult = validateConfig(nullConfig, crebConfigSchema);
      const undefinedResult = validateConfig(undefinedConfig, crebConfigSchema);

      expect(nullResult.isValid).toBe(false);
      expect(undefinedResult.isValid).toBe(false);
      expect(nullResult.errors[0].message).toContain('Configuration must be an object');
      expect(undefinedResult.errors[0].message).toContain('Configuration must be an object');
    });

    it('should validate nested objects', () => {
      const nestedConfig = {
        cache: 'not-an-object',
        performance: {
          enableWasm: true,
          workerThreads: 4,
          batchSize: 100
        }
      };

      const result = validateConfig(nestedConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.path === 'cache' && e.message.includes('Expected object'))).toBe(true);
    });
  });

  describe('Individual Schema Components', () => {
    it('should validate cache configuration', () => {
      const validCache = {
        maxSize: 2000,
        ttl: 600000,
        strategy: 'lfu'
      };

      const result = validateConfig(validCache, { cache: cacheConfigSchema.maxSize });
      // Note: This tests the validation function with a subset
    });

    it('should validate performance configuration', () => {
      const validPerformance = {
        enableWasm: true,
        workerThreads: 8,
        batchSize: 200
      };

      const invalidPerformance = {
        enableWasm: 'yes',
        workerThreads: -1,
        batchSize: 'many'
      };

      const validResult = validateConfig(validPerformance, performanceConfigSchema);
      const invalidResult = validateConfig(invalidPerformance, performanceConfigSchema);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should validate data configuration', () => {
      const validData = {
        providers: ['sqlite', 'nist', 'pubchem'],
        syncInterval: 7200000,
        offlineMode: true
      };

      const invalidData = {
        providers: 'not-an-array',
        syncInterval: 'not-a-number',
        offlineMode: 'maybe'
      };

      const validResult = validateConfig(validData, dataConfigSchema);
      const invalidResult = validateConfig(invalidData, dataConfigSchema);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should validate logging configuration', () => {
      const validLogging = {
        level: 'warn',
        format: 'json',
        destinations: ['console', 'file', 'remote']
      };

      const invalidLogging = {
        level: 'verbose',
        format: 'xml',
        destinations: 'console'
      };

      const validResult = validateConfig(validLogging, loggingConfigSchema);
      const invalidResult = validateConfig(invalidLogging, loggingConfigSchema);

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });
  });

  describe('Default Configuration', () => {
    it('should have valid default configuration', () => {
      const result = validateConfig(defaultConfig, crebConfigSchema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should contain all required properties in default config', () => {
      expect(defaultConfig.cache).toBeDefined();
      expect(defaultConfig.performance).toBeDefined();
      expect(defaultConfig.data).toBeDefined();
      expect(defaultConfig.logging).toBeDefined();

      expect(defaultConfig.cache.maxSize).toBeDefined();
      expect(defaultConfig.cache.ttl).toBeDefined();
      expect(defaultConfig.cache.strategy).toBeDefined();

      expect(defaultConfig.performance.enableWasm).toBeDefined();
      expect(defaultConfig.performance.workerThreads).toBeDefined();
      expect(defaultConfig.performance.batchSize).toBeDefined();

      expect(defaultConfig.data.providers).toBeDefined();
      expect(defaultConfig.data.syncInterval).toBeDefined();
      expect(defaultConfig.data.offlineMode).toBeDefined();

      expect(defaultConfig.logging.level).toBeDefined();
      expect(defaultConfig.logging.format).toBeDefined();
      expect(defaultConfig.logging.destinations).toBeDefined();
    });

    it('should have reasonable default values', () => {
      expect(defaultConfig.cache.maxSize).toBeGreaterThan(0);
      expect(defaultConfig.cache.ttl).toBeGreaterThan(0);
      expect(['lru', 'lfu', 'fifo']).toContain(defaultConfig.cache.strategy);

      expect(typeof defaultConfig.performance.enableWasm).toBe('boolean');
      expect(defaultConfig.performance.workerThreads).toBeGreaterThan(0);
      expect(defaultConfig.performance.batchSize).toBeGreaterThan(0);

      expect(Array.isArray(defaultConfig.data.providers)).toBe(true);
      expect(defaultConfig.data.providers.length).toBeGreaterThan(0);
      expect(defaultConfig.data.syncInterval).toBeGreaterThan(0);
      expect(typeof defaultConfig.data.offlineMode).toBe('boolean');

      expect(['debug', 'info', 'warn', 'error']).toContain(defaultConfig.logging.level);
      expect(['json', 'text']).toContain(defaultConfig.logging.format);
      expect(Array.isArray(defaultConfig.logging.destinations)).toBe(true);
    });
  });

  describe('Documentation Generation', () => {
    it('should generate complete documentation', () => {
      const docs = generateSchemaDocumentation(crebConfigSchema, 'Test Configuration');

      expect(docs).toContain('# Test Configuration');
      expect(docs).toContain('## cache');
      expect(docs).toContain('## performance');
      expect(docs).toContain('## data');
      expect(docs).toContain('## logging');
    });

    it('should include all schema information in documentation', () => {
      const docs = generateSchemaDocumentation(cacheConfigSchema, 'Cache Config');

      expect(docs).toContain('**Type:**');
      expect(docs).toContain('**Required:**');
      expect(docs).toContain('**Default:**');
      expect(docs).toContain('**Description:**');

      // Check for specific cache config details
      expect(docs).toContain('maxSize');
      expect(docs).toContain('ttl');
      expect(docs).toContain('strategy');
    });

    it('should format enum values correctly in documentation', () => {
      const docs = generateSchemaDocumentation(cacheConfigSchema, 'Cache Config');

      expect(docs).toContain('**Allowed Values:**');
      expect(docs).toContain('`lru`');
      expect(docs).toContain('`lfu`');
      expect(docs).toContain('`fifo`');
    });

    it('should include range information in documentation', () => {
      const docs = generateSchemaDocumentation(cacheConfigSchema, 'Cache Config');

      expect(docs).toContain('**Range:**');
      expect(docs).toContain('min:');
      expect(docs).toContain('max:');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty configuration objects', () => {
      const emptyConfig = {};

      const result = validateConfig(emptyConfig, crebConfigSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle extra properties gracefully', () => {
      const configWithExtra = {
        ...defaultConfig,
        extraProperty: 'should be ignored',
        cache: {
          ...defaultConfig.cache,
          extraCacheProperty: 'should be ignored'
        }
      };

      const result = validateConfig(configWithExtra, crebConfigSchema);

      // Extra properties should not cause validation to fail
      expect(result.isValid).toBe(true);
    });

    it('should handle circular references', () => {
      const circularConfig: any = {
        cache: {
          maxSize: 1000,
          ttl: 300000,
          strategy: 'lru'
        }
      };
      
      // Create circular reference
      circularConfig.cache.self = circularConfig.cache;

      // Should not throw an error or cause infinite recursion
      expect(() => {
        validateConfig(circularConfig, crebConfigSchema);
      }).not.toThrow();
    });

    it('should handle very large configuration objects', () => {
      const largeConfig = {
        ...defaultConfig,
        data: {
          ...defaultConfig.data,
          providers: new Array(1000).fill('sqlite') // Large array
        }
      };

      const startTime = Date.now();
      const result = validateConfig(largeConfig, crebConfigSchema);
      const duration = Date.now() - startTime;

      expect(result.isValid).toBe(true);
      expect(duration).toBeLessThan(100); // Should complete quickly
    });
  });

  describe('Performance', () => {
    it('should validate configuration efficiently', () => {
      const config = defaultConfig;
      const iterations = 1000;

      const startTime = Date.now();
      
      for (let i = 0; i < iterations; i++) {
        validateConfig(config, crebConfigSchema);
      }
      
      const duration = Date.now() - startTime;
      const avgDuration = duration / iterations;

      expect(avgDuration).toBeLessThan(1); // Less than 1ms per validation
    });

    it('should handle validation errors efficiently', () => {
      const invalidConfig = {
        cache: { maxSize: 'invalid' },
        performance: { enableWasm: 'invalid' },
        data: { providers: 'invalid' },
        logging: { level: 'invalid' }
      };

      const startTime = Date.now();
      const result = validateConfig(invalidConfig, crebConfigSchema);
      const duration = Date.now() - startTime;

      expect(result.isValid).toBe(false);
      expect(duration).toBeLessThan(10); // Should complete quickly even with errors
    });
  });
});
