/**
 * Plugin System Tests
 * 
 * Comprehensive test suite for the CREB-JS plugin system including
 * plugin loading, lifecycle management, security, and error handling.
 * 
 * @author Loganathane Virassamy
 * @version 1.7.0
 */

import { EventEmitter } from 'events';
import { Container } from '../../core/Container';
import { PluginManager, PluginManagerConfig } from '../PluginManager';
import { BasePlugin, SimplePlugin, PluginBuilder } from '../Plugin';
import { PluginAPIContextFactory } from '../APIContext';
import {
  PluginMetadata,
  PluginConfig,
  PluginState,
  PluginContext,
  PluginPermission,
  PluginPriority,
  PluginManifest,
  PluginInitParams,
  PluginResult,
  PluginHealthStatus,
  PluginExtensionPoint
} from '../types';

// Mock logger for testing
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Test plugin implementation
class TestPlugin extends BasePlugin {
  private initializeCalled = false;
  private activateCalled = false;
  private deactivateCalled = false;
  private cleanupCalled = false;

  constructor(metadata: PluginMetadata, extensionPoints: PluginExtensionPoint[] = []) {
    super(metadata, extensionPoints);
  }

  async onInitialize(params: PluginInitParams): Promise<void> {
    this.initializeCalled = true;
    this.logger.info('Test plugin initialized');
  }

  async onActivate(): Promise<void> {
    this.activateCalled = true;
    this.logger.info('Test plugin activated');
  }

  async onDeactivate(): Promise<void> {
    this.deactivateCalled = true;
    this.logger.info('Test plugin deactivated');
  }

  async onCleanup(): Promise<void> {
    this.cleanupCalled = true;
    this.logger.info('Test plugin cleaned up');
  }

  onHealthCheck(): PluginHealthStatus {
    return {
      healthy: true,
      message: 'Test plugin is healthy',
      timestamp: new Date()
    };
  }

  async onConfigChange(newConfig: PluginConfig): Promise<void> {
    this.logger.info('Test plugin configuration changed');
  }

  // Test helper methods
  isInitializeCalled(): boolean { return this.initializeCalled; }
  isActivateCalled(): boolean { return this.activateCalled; }
  isDeactivateCalled(): boolean { return this.deactivateCalled; }
  isCleanupCalled(): boolean { return this.cleanupCalled; }
}

// Test utilities
function createTestMetadata(overrides: Partial<PluginMetadata> = {}): PluginMetadata {
  return {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    license: 'MIT',
    apiVersion: '1.0.0',
    context: [PluginContext.Calculation],
    permissions: [PluginPermission.ReadOnly],
    priority: PluginPriority.Normal,
    keywords: ['test', 'plugin'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

function createTestConfig(overrides: Partial<PluginConfig> = {}): PluginConfig {
  return {
    enabled: true,
    autoLoad: false,
    settings: {},
    timeouts: {
      initialization: 5000,
      execution: 1000,
      cleanup: 3000
    },
    resources: {
      maxMemory: 100 * 1024 * 1024, // 100MB
      maxCpuTime: 1000,
      maxNetworkRequests: 100
    },
    ...overrides
  };
}

function createTestManifest(
  metadata?: Partial<PluginMetadata>,
  config?: Partial<PluginConfig>
): PluginManifest {
  const testMetadata = createTestMetadata(metadata);
  const testConfig = createTestConfig(config);
  
  return {
    metadata: testMetadata,
    config: testConfig,
    extensionPoints: [],
    factory: (params) => new TestPlugin(testMetadata)
  };
}

function createTestManagerConfig(): PluginManagerConfig {
  return {
    pluginDirectory: '/tmp/test-plugins',
    maxPlugins: 10,
    healthCheckInterval: 0, // Disable for tests
    discoveryInterval: 0, // Disable for tests
    enableHotSwap: true,
    enableMarketplace: false,
    securityLevel: 'moderate',
    resourceLimits: {
      maxMemoryPerPlugin: 100 * 1024 * 1024,
      maxCpuTimePerPlugin: 1000,
      maxNetworkRequestsPerMinute: 100
    }
  };
}

describe('Plugin System', () => {
  let container: Container;
  let pluginManager: PluginManager;
  let config: PluginManagerConfig;

  beforeEach(async () => {
    container = new Container();
    config = createTestManagerConfig();
    pluginManager = new PluginManager(container, config);
    await pluginManager.initialize();
  });

  afterEach(async () => {
    await pluginManager.shutdown();
    jest.clearAllMocks();
  });

  describe('PluginManager', () => {
    test('should initialize successfully', async () => {
      expect(pluginManager).toBeDefined();
      expect(pluginManager.listPlugins()).toHaveLength(0);
    });

    test('should load a plugin successfully', async () => {
      const manifest = createTestManifest();
      
      await pluginManager.loadPlugin(manifest);
      
      const plugins = pluginManager.listPlugins();
      expect(plugins).toHaveLength(1);
      expect(plugins[0].metadata.id).toBe('test-plugin');
      expect(plugins[0].state).toBe(PluginState.Loaded);
    });

    test('should activate a loaded plugin', async () => {
      const manifest = createTestManifest();
      await pluginManager.loadPlugin(manifest);
      
      await pluginManager.activatePlugin('test-plugin');
      
      const plugin = pluginManager.getPlugin('test-plugin') as TestPlugin;
      expect(plugin.state).toBe(PluginState.Active);
      expect(plugin.isActivateCalled()).toBe(true);
    });

    test('should deactivate an active plugin', async () => {
      const manifest = createTestManifest();
      await pluginManager.loadPlugin(manifest);
      await pluginManager.activatePlugin('test-plugin');
      
      await pluginManager.deactivatePlugin('test-plugin');
      
      const plugin = pluginManager.getPlugin('test-plugin') as TestPlugin;
      expect(plugin.state).toBe(PluginState.Inactive);
      expect(plugin.isDeactivateCalled()).toBe(true);
    });

    test('should unload a plugin', async () => {
      const manifest = createTestManifest();
      await pluginManager.loadPlugin(manifest);
      
      await pluginManager.unloadPlugin('test-plugin');
      
      expect(pluginManager.getPlugin('test-plugin')).toBeUndefined();
      expect(pluginManager.listPlugins()).toHaveLength(0);
    });

    test('should auto-load plugins when configured', async () => {
      const manifest = createTestManifest(undefined, { autoLoad: true });
      
      await pluginManager.loadPlugin(manifest);
      
      const plugin = pluginManager.getPlugin('test-plugin');
      expect(plugin?.state).toBe(PluginState.Active);
    });

    test('should enforce plugin limits', async () => {
      config.maxPlugins = 1;
      pluginManager = new PluginManager(container, config);
      await pluginManager.initialize();

      const manifest1 = createTestManifest({ id: 'plugin-1' });
      const manifest2 = createTestManifest({ id: 'plugin-2' });
      
      await pluginManager.loadPlugin(manifest1);
      
      await expect(pluginManager.loadPlugin(manifest2))
        .rejects.toThrow('Maximum plugin limit reached');
    });

    test('should handle plugin loading errors gracefully', async () => {
      const faultyManifest: PluginManifest = {
        metadata: createTestMetadata(),
        config: createTestConfig(),
        extensionPoints: [],
        factory: () => {
          throw new Error('Factory error');
        }
      };
      
      await expect(pluginManager.loadPlugin(faultyManifest))
        .rejects.toThrow('Failed to load plugin test-plugin');
    });

    test('should list plugins by state', async () => {
      const manifest1 = createTestManifest({ id: 'plugin-1' });
      const manifest2 = createTestManifest({ id: 'plugin-2' });
      
      await pluginManager.loadPlugin(manifest1);
      await pluginManager.loadPlugin(manifest2);
      await pluginManager.activatePlugin('plugin-1');
      
      const loadedPlugins = pluginManager.listPluginsByState(PluginState.Loaded);
      const activePlugins = pluginManager.listPluginsByState(PluginState.Active);
      
      expect(loadedPlugins).toHaveLength(1);
      expect(activePlugins).toHaveLength(1);
      expect(activePlugins[0].metadata.id).toBe('plugin-1');
    });

    test('should list plugins by context', async () => {
      const calcManifest = createTestManifest(
        { id: 'calc-plugin', context: [PluginContext.Calculation] }
      );
      const dataManifest = createTestManifest(
        { id: 'data-plugin', context: [PluginContext.DataProvider] }
      );
      
      await pluginManager.loadPlugin(calcManifest);
      await pluginManager.loadPlugin(dataManifest);
      
      const calcPlugins = pluginManager.listPluginsByContext(PluginContext.Calculation);
      const dataPlugins = pluginManager.listPluginsByContext(PluginContext.DataProvider);
      
      expect(calcPlugins).toHaveLength(1);
      expect(dataPlugins).toHaveLength(1);
      expect(calcPlugins[0].metadata.id).toBe('calc-plugin');
      expect(dataPlugins[0].metadata.id).toBe('data-plugin');
    });

    test('should emit events for plugin lifecycle', async () => {
      const loadedSpy = jest.fn();
      const activatedSpy = jest.fn();
      const deactivatedSpy = jest.fn();
      const unloadedSpy = jest.fn();
      
      pluginManager.on('plugin-loaded', loadedSpy);
      pluginManager.on('plugin-activated', activatedSpy);
      pluginManager.on('plugin-deactivated', deactivatedSpy);
      pluginManager.on('plugin-unloaded', unloadedSpy);
      
      const manifest = createTestManifest();
      await pluginManager.loadPlugin(manifest);
      await pluginManager.activatePlugin('test-plugin');
      await pluginManager.deactivatePlugin('test-plugin');
      await pluginManager.unloadPlugin('test-plugin');
      
      expect(loadedSpy).toHaveBeenCalledTimes(1);
      expect(activatedSpy).toHaveBeenCalledTimes(1);
      expect(deactivatedSpy).toHaveBeenCalledTimes(1);
      expect(unloadedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('BasePlugin', () => {
    test('should initialize with metadata', () => {
      const metadata = createTestMetadata();
      const plugin = new TestPlugin(metadata);
      
      expect(plugin.metadata).toEqual(metadata);
      expect(plugin.state).toBe(PluginState.Unloaded);
    });

    test('should handle lifecycle correctly', async () => {
      const metadata = createTestMetadata();
      const config = createTestConfig();
      const plugin = new TestPlugin(metadata);
      
      const apiContext = new PluginAPIContextFactory(container, new EventEmitter(), new Map())
        .create(metadata.id, metadata.permissions, mockLogger);
      
      await plugin.initialize({ metadata, config, apiContext, logger: mockLogger });
      expect(plugin.state).toBe(PluginState.Loaded);
      expect(plugin.isInitializeCalled()).toBe(true);
      
      await plugin.activate();
      expect(plugin.state).toBe(PluginState.Active);
      expect(plugin.isActivateCalled()).toBe(true);
      
      await plugin.deactivate();
      expect(plugin.state).toBe(PluginState.Inactive);
      expect(plugin.isDeactivateCalled()).toBe(true);
      
      await plugin.cleanup();
      expect(plugin.state).toBe(PluginState.Unloaded);
      expect(plugin.isCleanupCalled()).toBe(true);
    });

    test('should provide health status', () => {
      const metadata = createTestMetadata();
      const plugin = new TestPlugin(metadata);
      
      const health = plugin.getHealth();
      expect(health.healthy).toBe(true);
      expect(health.message).toBe('Test plugin is healthy');
    });

    test('should handle configuration updates', async () => {
      const metadata = createTestMetadata();
      const config = createTestConfig();
      const plugin = new TestPlugin(metadata);
      
      const apiContext = new PluginAPIContextFactory(container, new EventEmitter(), new Map())
        .create(metadata.id, metadata.permissions, mockLogger);
      
      await plugin.initialize({ metadata, config, apiContext, logger: mockLogger });
      
      const newConfig = { enabled: false };
      await plugin.updateConfig(newConfig);
      
      expect(plugin.config.enabled).toBe(false);
    });
  });

  describe('PluginBuilder', () => {
    test('should build a simple plugin with fluent API', () => {
      const metadata = createTestMetadata();
      
      const plugin = PluginBuilder.create()
        .metadata(metadata)
        .onInitialize(async () => {})
        .onActivate(async () => {})
        .build();
      
      expect(plugin).toBeInstanceOf(SimplePlugin);
      expect(plugin.metadata).toEqual(metadata);
    });

    test('should build plugin with extension points', () => {
      const metadata = createTestMetadata();
      const extensionPoint: PluginExtensionPoint = {
        name: 'test-calculation',
        description: 'Test calculation',
        inputTypes: ['number'],
        outputType: 'number',
        handler: async (input: number) => ({ success: true, data: input * 2, executionTime: 0 })
      };
      
      const plugin = PluginBuilder.create()
        .metadata(metadata)
        .addExtensionPoint(extensionPoint)
        .build();
      
      expect(plugin.extensionPoints).toHaveLength(1);
      expect(plugin.extensionPoints[0].name).toBe('test-calculation');
    });
  });

  describe('Security and Permissions', () => {
    test('should validate plugin permissions based on security level', async () => {
      config.securityLevel = 'strict';
      pluginManager = new PluginManager(container, config);
      await pluginManager.initialize();
      
      const dangerousManifest = createTestManifest({
        permissions: [PluginPermission.SystemAccess, PluginPermission.NetworkAccess]
      });
      
      await expect(pluginManager.loadPlugin(dangerousManifest))
        .rejects.toThrow('Dangerous permissions not allowed in strict mode');
    });

    test('should allow safe permissions in strict mode', async () => {
      config.securityLevel = 'strict';
      pluginManager = new PluginManager(container, config);
      await pluginManager.initialize();
      
      const safeManifest = createTestManifest({
        permissions: [PluginPermission.ReadOnly]
      });
      
      await expect(pluginManager.loadPlugin(safeManifest))
        .resolves.not.toThrow();
    });
  });

  describe('Extension Points', () => {
    test('should execute extension points successfully', async () => {
      const extensionPoint: PluginExtensionPoint = {
        name: 'multiply',
        description: 'Multiply by 2',
        inputTypes: ['number'],
        outputType: 'number',
        handler: async (input: number) => ({ 
          success: true, 
          data: input * 2, 
          executionTime: 0 
        })
      };
      
      const metadata = createTestMetadata();
      const plugin = new TestPlugin(metadata, [extensionPoint]);
      const config = createTestConfig();
      
      const apiContext = new PluginAPIContextFactory(container, new EventEmitter(), new Map())
        .create(metadata.id, metadata.permissions, mockLogger);
      
      await plugin.initialize({ metadata, config, apiContext, logger: mockLogger });
      await plugin.activate();
      
      const result = await plugin.execute('multiply', 5);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe(10);
    });

    test('should handle extension point errors gracefully', async () => {
      const faultyExtensionPoint: PluginExtensionPoint = {
        name: 'error',
        description: 'Always errors',
        inputTypes: ['any'],
        outputType: 'any',
        handler: async () => {
          throw new Error('Extension error');
        }
      };
      
      const metadata = createTestMetadata();
      const plugin = new TestPlugin(metadata, [faultyExtensionPoint]);
      const config = createTestConfig();
      
      const apiContext = new PluginAPIContextFactory(container, new EventEmitter(), new Map())
        .create(metadata.id, metadata.permissions, mockLogger);
      
      await plugin.initialize({ metadata, config, apiContext, logger: mockLogger });
      await plugin.activate();
      
      const result = await plugin.execute('error', null);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Extension error');
    });
  });

  describe('Hot-swap Functionality', () => {
    test('should support hot-swapping plugins when enabled', async () => {
      const originalManifest = createTestManifest({ version: '1.0.0' });
      const updatedManifest = createTestManifest({ version: '2.0.0' });
      
      await pluginManager.loadPlugin(originalManifest);
      await pluginManager.activatePlugin('test-plugin');
      
      expect(pluginManager.getPlugin('test-plugin')?.metadata.version).toBe('1.0.0');
      
      await pluginManager.hotSwapPlugin('test-plugin', updatedManifest);
      
      expect(pluginManager.getPlugin('test-plugin')?.metadata.version).toBe('2.0.0');
    });

    test('should reject hot-swap when disabled', async () => {
      config.enableHotSwap = false;
      pluginManager = new PluginManager(container, config);
      await pluginManager.initialize();
      
      const originalManifest = createTestManifest({ version: '1.0.0' });
      const updatedManifest = createTestManifest({ version: '2.0.0' });
      
      await pluginManager.loadPlugin(originalManifest);
      
      await expect(pluginManager.hotSwapPlugin('test-plugin', updatedManifest))
        .rejects.toThrow('Hot-swap is disabled');
    });
  });
});

describe('Plugin API Context', () => {
  let container: Container;
  let eventSystem: EventEmitter;
  let storage: Map<string, any>;
  let factory: PluginAPIContextFactory;

  beforeEach(() => {
    container = new Container();
    eventSystem = new EventEmitter();
    storage = new Map();
    factory = new PluginAPIContextFactory(container, eventSystem, storage);
  });

  test('should create secure API context with permissions', () => {
    const permissions = [PluginPermission.ReadOnly];
    const context = factory.create('test-plugin', permissions, mockLogger);
    
    expect(context.version).toBe('1.0.0');
    expect(context.services).toBeDefined();
    expect(context.events).toBeDefined();
    expect(context.storage).toBeDefined();
    expect(context.utils).toBeDefined();
  });

  test('should isolate plugin storage', async () => {
    const context1 = factory.create('plugin-1', [PluginPermission.ReadWrite], mockLogger);
    const context2 = factory.create('plugin-2', [PluginPermission.ReadWrite], mockLogger);
    
    await context1.storage.set('key', 'value1');
    await context2.storage.set('key', 'value2');
    
    const value1 = await context1.storage.get('key');
    const value2 = await context2.storage.get('key');
    
    expect(value1).toBe('value1');
    expect(value2).toBe('value2');
  });

  test('should provide chemistry utilities', () => {
    const context = factory.create('test-plugin', [PluginPermission.ReadOnly], mockLogger);
    
    expect(context.utils.validateFormula('H2O')).toBe(true);
    expect(context.utils.validateFormula('InvalidFormula123')).toBe(false);
    
    const elements = context.utils.parseFormula('H2O');
    expect(elements).toEqual({ H: 2, O: 1 });
    
    const molarWeight = context.utils.calculateMolarWeight('H2O');
    expect(molarWeight).toBeCloseTo(18.015, 1);
  });
});
