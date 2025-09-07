/**
 * CREB-JS Plugin Examples
 * 
 * Example plugin implementations demonstrating various plugin patterns
 * and use cases for third-party developers.
 * 
 * @author Loganathane Virassamy
 * @version 1.7.0
 */

import { PluginBuilder } from './Plugin';
import {
  PluginMetadata,
  PluginConfig,
  PluginContext,
  PluginPermission,
  PluginPriority,
  PluginExtensionPoint,
  PluginResult,
  PluginAPIContext,
  PluginInitParams,
  PluginManifest
} from './types';

/**
 * Example 1: Custom Equation Balancing Algorithm Plugin
 * Demonstrates how to extend CREB's equation balancing capabilities
 */
export function createCustomBalancerPlugin(): PluginManifest {
  const metadata: PluginMetadata = {
    id: 'custom-balancer',
    name: 'Advanced Equation Balancer',
    version: '1.0.0',
    description: 'Enhanced equation balancing with AI-powered optimization',
    author: 'CREB Plugin Developer',
    license: 'MIT',
    homepage: 'https://github.com/example/creb-custom-balancer',
    apiVersion: '1.0.0',
    context: [PluginContext.Calculation],
    permissions: [PluginPermission.ReadOnly],
    priority: PluginPriority.High,
    keywords: ['balancing', 'equations', 'chemistry', 'ai'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const config: PluginConfig = {
    enabled: true,
    autoLoad: true,
    settings: {
      useAiOptimization: true,
      maxIterations: 1000,
      precision: 1e-10
    },
    timeouts: {
      initialization: 5000,
      execution: 10000,
      cleanup: 3000
    },
    resources: {
      maxMemory: 50 * 1024 * 1024, // 50MB
      maxCpuTime: 5000,
      maxNetworkRequests: 0 // No network access needed
    }
  };

  const extensionPoints: PluginExtensionPoint[] = [
    {
      name: 'advanced-balance',
      description: 'Balance chemical equations using advanced AI algorithms',
      inputTypes: ['string'],
      outputType: 'object',
      handler: async (equation: string, context: PluginAPIContext): Promise<PluginResult> => {
        try {
          // Validate the equation using built-in utilities
          const sanitizedEquation = context.utils.sanitizeInput(equation);
          
          if (!sanitizedEquation) {
            return {
              success: false,
              error: 'Invalid equation format',
              executionTime: 0
            };
          }

          // Custom balancing algorithm implementation
          const result = await advancedBalance(sanitizedEquation);
          
          return {
            success: true,
            data: {
              balanced: result.equation,
              coefficients: result.coefficients,
              confidence: result.confidence,
              method: 'ai-optimized'
            },
            executionTime: result.executionTime,
            metadata: {
              iterations: result.iterations,
              algorithmVersion: '2.1.0'
            }
          };
        } catch (error) {
          return {
            success: false,
            error: (error as Error).message,
            executionTime: 0
          };
        }
      }
    }
  ];

  return {
    metadata,
    config,
    extensionPoints,
    factory: (params: PluginInitParams) => {
      return PluginBuilder.create()
        .metadata(metadata)
        .addExtensionPoint(extensionPoints[0])
        .onInitialize(async (params) => {
          params.logger.info('Advanced Equation Balancer initialized');
          // Initialize AI models, load configurations, etc.
        })
        .onActivate(async () => {
          console.log('Advanced balancer ready for use');
        })
        .onHealthCheck(() => ({
          healthy: true,
          message: 'AI models loaded and ready',
          metrics: {
            memoryUsage: process.memoryUsage().heapUsed,
            modelAccuracy: 0.98
          },
          timestamp: new Date()
        }))
        .build();
    }
  };
}

/**
 * Example 2: External Data Provider Plugin
 * Demonstrates how to integrate with external chemistry databases
 */
export function createDataProviderPlugin(): PluginManifest {
  const metadata: PluginMetadata = {
    id: 'external-data-provider',
    name: 'ChemSpider Data Provider',
    version: '1.0.0',
    description: 'Fetch compound data from ChemSpider API',
    author: 'CREB Plugin Developer',
    license: 'MIT',
    apiVersion: '1.0.0',
    context: [PluginContext.DataProvider],
    permissions: [PluginPermission.ReadOnly, PluginPermission.NetworkAccess],
    priority: PluginPriority.Normal,
    keywords: ['data', 'chemspider', 'compounds', 'api'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const config: PluginConfig = {
    enabled: true,
    autoLoad: false,
    settings: {
      apiKey: '', // To be configured by user
      baseUrl: 'https://www.chemspider.com/InChI.asmx',
      timeout: 10000,
      cacheResults: true,
      cacheTtl: 3600000 // 1 hour
    },
    timeouts: {
      initialization: 5000,
      execution: 15000,
      cleanup: 3000
    },
    resources: {
      maxMemory: 30 * 1024 * 1024, // 30MB
      maxCpuTime: 2000,
      maxNetworkRequests: 100
    }
  };

  const extensionPoints: PluginExtensionPoint[] = [
    {
      name: 'fetch-compound-data',
      description: 'Fetch compound information from ChemSpider',
      inputTypes: ['string'],
      outputType: 'object',
      handler: async (identifier: string, context: PluginAPIContext): Promise<PluginResult> => {
        try {
          // Check cache first
          const cacheKey = `compound:${identifier}`;
          const cached = await context.storage.get(cacheKey);
          
          if (cached) {
            return {
              success: true,
              data: cached,
              executionTime: 1,
              metadata: { source: 'cache' }
            };
          }

          // Fetch from external API
          const startTime = Date.now();
          const url = `https://www.chemspider.com/Search.asmx/SimpleSearch?query=${encodeURIComponent(identifier)}`;
          
          const response = await context.http.get(url);
          const data = await response.json();
          
          const executionTime = Date.now() - startTime;

          // Cache the result
          await context.storage.set(cacheKey, data);

          return {
            success: true,
            data,
            executionTime,
            metadata: { source: 'chemspider' }
          };
        } catch (error) {
          return {
            success: false,
            error: `Failed to fetch compound data: ${(error as Error).message}`,
            executionTime: 0
          };
        }
      }
    },
    {
      name: 'search-compounds',
      description: 'Search for compounds by name or formula',
      inputTypes: ['string'],
      outputType: 'array',
      handler: async (query: string, context: PluginAPIContext): Promise<PluginResult> => {
        try {
          const sanitizedQuery = context.utils.sanitizeInput(query);
          const startTime = Date.now();
          
          const url = `https://www.chemspider.com/Search.asmx/SimpleSearch?query=${encodeURIComponent(sanitizedQuery)}`;
          const response = await context.http.get(url);
          const results = await response.json() as any[];
          
          const executionTime = Date.now() - startTime;

          return {
            success: true,
            data: results,
            executionTime,
            metadata: {
              query: sanitizedQuery,
              resultCount: Array.isArray(results) ? results.length : 0
            }
          };
        } catch (error) {
          return {
            success: false,
            error: `Search failed: ${(error as Error).message}`,
            executionTime: 0
          };
        }
      }
    }
  ];

  return {
    metadata,
    config,
    extensionPoints,
    factory: (params: PluginInitParams) => {
      return PluginBuilder.create()
        .metadata(metadata)
        .addExtensionPoint(extensionPoints[0])
        .addExtensionPoint(extensionPoints[1])
        .onInitialize(async (params) => {
          const apiKey = params.config.settings.apiKey;
          if (!apiKey) {
            throw new Error('ChemSpider API key is required');
          }
          params.logger.info('ChemSpider data provider initialized');
        })
        .onActivate(async () => {
          console.log('ChemSpider data provider ready');
        })
        .onConfigChange(async (newConfig) => {
          console.log('ChemSpider configuration updated');
        })
        .onHealthCheck(() => ({
          healthy: true,
          message: 'External API connectivity verified',
          timestamp: new Date()
        }))
        .build();
    }
  };
}

/**
 * Example 3: Specialized Calculator Plugin
 * Demonstrates domain-specific chemistry calculations
 */
export function createSpecializedCalculatorPlugin(): PluginManifest {
  const metadata: PluginMetadata = {
    id: 'advanced-calculator',
    name: 'Advanced Chemistry Calculator',
    version: '1.0.0',
    description: 'Specialized calculations for advanced chemistry problems',
    author: 'CREB Plugin Developer',
    license: 'MIT',
    apiVersion: '1.0.0',
    context: [PluginContext.Calculation],
    permissions: [PluginPermission.ReadOnly],
    priority: PluginPriority.High,
    keywords: ['calculations', 'advanced', 'chemistry', 'kinetics', 'thermodynamics'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const config: PluginConfig = {
    enabled: true,
    autoLoad: true,
    settings: {
      precision: 10,
      useSymbolicMath: true,
      enableUnitConversion: true
    },
    timeouts: {
      initialization: 3000,
      execution: 5000,
      cleanup: 2000
    },
    resources: {
      maxMemory: 20 * 1024 * 1024, // 20MB
      maxCpuTime: 3000,
      maxNetworkRequests: 0
    }
  };

  const extensionPoints: PluginExtensionPoint[] = [
    {
      name: 'calculate-equilibrium-constant',
      description: 'Calculate equilibrium constants from thermodynamic data',
      inputTypes: ['object'],
      outputType: 'number',
      handler: async (data: any, context: PluginAPIContext): Promise<PluginResult> => {
        try {
          const { deltaG, temperature = 298.15 } = data;
          const R = 8.314; // Gas constant J/(mol·K)
          
          // K = exp(-ΔG / RT)
          const K = Math.exp(-deltaG * 1000 / (R * temperature));
          
          return {
            success: true,
            data: K,
            executionTime: 1,
            metadata: {
              deltaG,
              temperature,
              units: 'dimensionless'
            }
          };
        } catch (error) {
          return {
            success: false,
            error: `Calculation failed: ${(error as Error).message}`,
            executionTime: 0
          };
        }
      }
    },
    {
      name: 'calculate-reaction-rate',
      description: 'Calculate reaction rates using kinetic data',
      inputTypes: ['object'],
      outputType: 'object',
      handler: async (data: any, context: PluginAPIContext): Promise<PluginResult> => {
        try {
          const { concentrations, rateConstant, orders } = data;
          
          // Rate = k * [A]^m * [B]^n * ...
          let rate = rateConstant;
          
          for (let i = 0; i < concentrations.length; i++) {
            rate *= Math.pow(concentrations[i], orders[i] || 1);
          }
          
          return {
            success: true,
            data: {
              rate,
              units: 'M/s',
              method: 'rate-law'
            },
            executionTime: 2,
            metadata: {
              rateConstant,
              concentrations,
              orders
            }
          };
        } catch (error) {
          return {
            success: false,
            error: `Rate calculation failed: ${(error as Error).message}`,
            executionTime: 0
          };
        }
      }
    }
  ];

  return {
    metadata,
    config,
    extensionPoints,
    factory: (params: PluginInitParams) => {
      return PluginBuilder.create()
        .metadata(metadata)
        .addExtensionPoint(extensionPoints[0])
        .addExtensionPoint(extensionPoints[1])
        .onInitialize(async (params) => {
          params.logger.info('Advanced calculator initialized');
        })
        .onActivate(async () => {
          console.log('Advanced calculator ready for calculations');
        })
        .onHealthCheck(() => ({
          healthy: true,
          message: 'All calculation modules loaded',
          metrics: {
            precision: 10,
            modulesLoaded: 2
          },
          timestamp: new Date()
        }))
        .build();
    }
  };
}

/**
 * Helper function for the custom balancer (mock implementation)
 */
async function advancedBalance(equation: string): Promise<{
  equation: string;
  coefficients: number[];
  confidence: number;
  executionTime: number;
  iterations: number;
}> {
  // Mock AI-powered balancing algorithm
  const startTime = Date.now();
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    equation: 'H2 + O2 → H2O', // Simplified example
    coefficients: [2, 1, 2],
    confidence: 0.95,
    executionTime: Date.now() - startTime,
    iterations: 42
  };
}

/**
 * Plugin marketplace entry examples
 */
export const exampleMarketplaceEntries = [
  {
    metadata: createCustomBalancerPlugin().metadata,
    downloads: 1250,
    rating: 4.8,
    reviews: 23,
    verified: true,
    downloadUrl: 'https://registry.creb.js/plugins/custom-balancer-1.0.0.tgz',
    screenshots: [
      'https://images.creb.js/plugins/custom-balancer/screenshot1.png',
      'https://images.creb.js/plugins/custom-balancer/screenshot2.png'
    ],
    readme: 'Advanced equation balancing with AI optimization...'
  },
  {
    metadata: createDataProviderPlugin().metadata,
    downloads: 890,
    rating: 4.6,
    reviews: 15,
    verified: true,
    downloadUrl: 'https://registry.creb.js/plugins/external-data-provider-1.0.0.tgz',
    screenshots: [
      'https://images.creb.js/plugins/external-data/screenshot1.png'
    ],
    readme: 'Seamless integration with ChemSpider database...'
  },
  {
    metadata: createSpecializedCalculatorPlugin().metadata,
    downloads: 2100,
    rating: 4.9,
    reviews: 42,
    verified: true,
    downloadUrl: 'https://registry.creb.js/plugins/advanced-calculator-1.0.0.tgz',
    screenshots: [
      'https://images.creb.js/plugins/advanced-calc/screenshot1.png',
      'https://images.creb.js/plugins/advanced-calc/screenshot2.png',
      'https://images.creb.js/plugins/advanced-calc/screenshot3.png'
    ],
    readme: 'Professional-grade chemistry calculations for research and education...'
  }
];
