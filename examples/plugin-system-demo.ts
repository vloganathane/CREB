/**
 * CREB-JS Plugin System Integration Demo
 * 
 * Demonstrates the complete plugin system functionality including
 * plugin loading, lifecycle management, extension points, and marketplace integration.
 * 
 * @author Loganathane Virassamy
 * @version 1.7.0
 */

import { Container } from '../src/core/Container';
import { PluginManager, PluginManagerConfig } from '../src/plugins/PluginManager';
import { 
  createCustomBalancerPlugin, 
  createDataProviderPlugin, 
  createSpecializedCalculatorPlugin 
} from '../src/plugins/examples';
import {
  PluginState,
  PluginContext,
  PluginPermission
} from '../src/plugins/types';

/**
 * Main demo function showcasing plugin system capabilities
 */
export async function runPluginSystemDemo(): Promise<void> {
  console.log('🚀 CREB-JS Plugin System Demo Starting...\n');

  // Initialize DI container
  const container = new Container();
  
  // Configure plugin manager
  const config: PluginManagerConfig = {
    pluginDirectory: './plugins',
    maxPlugins: 20,
    healthCheckInterval: 30000, // 30 seconds
    discoveryInterval: 60000, // 1 minute
    enableHotSwap: true,
    enableMarketplace: true,
    marketplaceUrl: 'https://marketplace.creb.js/api/v1',
    securityLevel: 'moderate',
    resourceLimits: {
      maxMemoryPerPlugin: 100 * 1024 * 1024, // 100MB
      maxCpuTimePerPlugin: 5000, // 5 seconds
      maxNetworkRequestsPerMinute: 200
    }
  };

  // Create and initialize plugin manager
  const pluginManager = new PluginManager(container, config);
  
  // Set up event listeners
  setupEventListeners(pluginManager);
  
  try {
    await pluginManager.initialize();
    console.log('✅ Plugin Manager initialized successfully\n');

    // Demo 1: Load and activate plugins
    await demoPluginLifecycle(pluginManager);
    
    // Demo 2: Execute plugin extension points
    await demoExtensionPoints(pluginManager);
    
    // Demo 3: Plugin health monitoring
    await demoHealthMonitoring(pluginManager);
    
    // Demo 4: Hot-swap functionality
    await demoHotSwap(pluginManager);
    
    // Demo 5: Security and permissions
    await demoSecurity(pluginManager);
    
    // Demo 6: Plugin marketplace simulation
    await demoMarketplace();
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    await pluginManager.shutdown();
    console.log('\n🏁 Plugin System Demo Complete');
  }
}

/**
 * Set up event listeners for plugin manager events
 */
function setupEventListeners(pluginManager: PluginManager): void {
  pluginManager.on('plugin-loaded', (plugin) => {
    console.log(`📦 Plugin loaded: ${plugin.metadata.name} v${plugin.metadata.version}`);
  });
  
  pluginManager.on('plugin-activated', (plugin) => {
    console.log(`🟢 Plugin activated: ${plugin.metadata.name}`);
  });
  
  pluginManager.on('plugin-deactivated', (plugin) => {
    console.log(`🟡 Plugin deactivated: ${plugin.metadata.name}`);
  });
  
  pluginManager.on('plugin-unloaded', (pluginId) => {
    console.log(`📤 Plugin unloaded: ${pluginId}`);
  });
  
  pluginManager.on('plugin-error', (error) => {
    console.log(`❌ Plugin error: ${error.pluginId} - ${error.error.message}`);
  });
  
  pluginManager.on('plugin-health-check', (pluginId, status) => {
    const icon = status.healthy ? '💚' : '💔';
    console.log(`${icon} Health check: ${pluginId} - ${status.message}`);
  });
}

/**
 * Demo 1: Plugin lifecycle management
 */
async function demoPluginLifecycle(pluginManager: PluginManager): Promise<void> {
  console.log('🔄 Demo 1: Plugin Lifecycle Management');
  console.log('=====================================\n');

  // Load plugins
  const balancerPlugin = createCustomBalancerPlugin();
  const dataPlugin = createDataProviderPlugin();
  const calcPlugin = createSpecializedCalculatorPlugin();

  await pluginManager.loadPlugin(balancerPlugin);
  await pluginManager.loadPlugin(dataPlugin);
  await pluginManager.loadPlugin(calcPlugin);

  console.log(`📊 Plugins loaded: ${pluginManager.listPlugins().length}`);
  
  // Activate plugins
  await pluginManager.activatePlugin('custom-balancer');
  await pluginManager.activatePlugin('advanced-calculator');
  
  const activePlugins = pluginManager.listPluginsByState(PluginState.Active);
  console.log(`🟢 Active plugins: ${activePlugins.length}`);
  
  // List plugins by context
  const calcPlugins = pluginManager.listPluginsByContext(PluginContext.Calculation);
  const dataPlugins = pluginManager.listPluginsByContext(PluginContext.DataProvider);
  
  console.log(`🧮 Calculation plugins: ${calcPlugins.length}`);
  console.log(`📊 Data provider plugins: ${dataPlugins.length}\n`);
}

/**
 * Demo 2: Execute plugin extension points
 */
async function demoExtensionPoints(pluginManager: PluginManager): Promise<void> {
  console.log('🎯 Demo 2: Extension Points Execution');
  console.log('=====================================\n');

  // Test custom balancer
  const balancerPlugin = pluginManager.getPlugin('custom-balancer');
  if (balancerPlugin) {
    console.log('🧪 Testing advanced equation balancing...');
    const balanceResult = await balancerPlugin.execute('advanced-balance', 'H2 + O2 = H2O');
    
    if (balanceResult.success) {
      console.log('✅ Balancing successful:');
      console.log(`   Equation: ${(balanceResult.data as any)?.balanced}`);
      console.log(`   Confidence: ${((balanceResult.data as any)?.confidence || 0) * 100}%`);
      console.log(`   Execution time: ${balanceResult.executionTime}ms`);
    } else {
      console.log(`❌ Balancing failed: ${balanceResult.error}`);
    }
  }

  // Test calculator
  const calcPlugin = pluginManager.getPlugin('advanced-calculator');
  if (calcPlugin) {
    console.log('\n🧮 Testing equilibrium constant calculation...');
    const eqResult = await calcPlugin.execute('calculate-equilibrium-constant', {
      deltaG: -50.2, // kJ/mol
      temperature: 298.15 // K
    });
    
    if (eqResult.success) {
      console.log('✅ Calculation successful:');
      console.log(`   Equilibrium constant: ${(eqResult.data as number)?.toExponential(3)}`);
      console.log(`   Temperature: ${eqResult.metadata?.temperature}K`);
    } else {
      console.log(`❌ Calculation failed: ${eqResult.error}`);
    }

    console.log('\n⚡ Testing reaction rate calculation...');
    const rateResult = await calcPlugin.execute('calculate-reaction-rate', {
      concentrations: [0.1, 0.05], // M
      rateConstant: 2.5e-3, // M⁻¹s⁻¹
      orders: [1, 2]
    });
    
    if (rateResult.success) {
      console.log('✅ Rate calculation successful:');
      console.log(`   Reaction rate: ${(rateResult.data as any)?.rate?.toExponential(3)} ${(rateResult.data as any)?.units}`);
      console.log(`   Method: ${(rateResult.data as any)?.method}`);
    } else {
      console.log(`❌ Rate calculation failed: ${rateResult.error}`);
    }
  }
  
  console.log();
}

/**
 * Demo 3: Plugin health monitoring
 */
async function demoHealthMonitoring(pluginManager: PluginManager): Promise<void> {
  console.log('💓 Demo 3: Health Monitoring');
  console.log('============================\n');

  const plugins = pluginManager.listPlugins();
  
  for (const plugin of plugins) {
    const health = plugin.getHealth();
    const icon = health.healthy ? '💚' : '💔';
    
    console.log(`${icon} ${plugin.metadata.name}:`);
    console.log(`   Status: ${health.healthy ? 'Healthy' : 'Unhealthy'}`);
    console.log(`   Message: ${health.message}`);
    
    if (health.metrics) {
      console.log('   Metrics:');
      Object.entries(health.metrics).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`);
      });
    }
    
    console.log(`   Last check: ${health.timestamp.toISOString()}\n`);
  }
}

/**
 * Demo 4: Hot-swap functionality
 */
async function demoHotSwap(pluginManager: PluginManager): Promise<void> {
  console.log('🔄 Demo 4: Hot-Swap Functionality');
  console.log('=================================\n');

  // Create updated version of balancer plugin
  const originalPlugin = pluginManager.getPlugin('custom-balancer');
  console.log(`📦 Original plugin version: ${originalPlugin?.metadata.version}`);

  const originalManifest = createCustomBalancerPlugin();
  const updatedManifest = {
    ...originalManifest,
    metadata: {
      ...originalManifest.metadata,
      version: '2.0.0',
      description: 'Enhanced AI balancer with quantum optimization',
      updatedAt: new Date()
    }
  };

  try {
    console.log('🔄 Performing hot-swap...');
    await pluginManager.hotSwapPlugin('custom-balancer', updatedManifest);
    
    const swappedPlugin = pluginManager.getPlugin('custom-balancer');
    console.log(`✅ Hot-swap successful!`);
    console.log(`📦 New plugin version: ${swappedPlugin?.metadata.version}`);
    console.log(`📝 New description: ${swappedPlugin?.metadata.description}\n`);
  } catch (error) {
    console.log(`❌ Hot-swap failed: ${(error as Error).message}\n`);
  }
}

/**
 * Demo 5: Security and permissions
 */
async function demoSecurity(pluginManager: PluginManager): Promise<void> {
  console.log('🔒 Demo 5: Security and Permissions');
  console.log('===================================\n');

  // Test permission validation
  const dataPlugin = pluginManager.getPlugin('external-data-provider');
  if (dataPlugin) {
    console.log('🔐 Testing permission-based access...');
    console.log(`   Plugin permissions: ${dataPlugin.metadata.permissions.join(', ')}`);
    
    const hasNetworkAccess = dataPlugin.metadata.permissions.includes(PluginPermission.NetworkAccess);
    console.log(`   Network access: ${hasNetworkAccess ? '✅ Allowed' : '❌ Denied'}`);
    
    const hasSystemAccess = dataPlugin.metadata.permissions.includes(PluginPermission.SystemAccess);
    console.log(`   System access: ${hasSystemAccess ? '✅ Allowed' : '❌ Denied'}`);
  }

  // Demonstrate security isolation
  console.log('\n🛡️  Security isolation features:');
  console.log('   ✅ Plugins run in isolated contexts');
  console.log('   ✅ Storage is namespaced per plugin');
  console.log('   ✅ Network requests are rate-limited');
  console.log('   ✅ Permission-based API access');
  console.log('   ✅ Resource usage monitoring\n');
}

/**
 * Demo 6: Plugin marketplace simulation
 */
async function demoMarketplace(): Promise<void> {
  console.log('🏪 Demo 6: Plugin Marketplace');
  console.log('=============================\n');

  // Simulate marketplace browsing
  console.log('🔍 Browsing plugin marketplace...');
  
  const marketplacePlugins = [
    {
      name: 'Advanced Equation Balancer',
      version: '1.0.0',
      downloads: 1250,
      rating: 4.8,
      verified: true,
      category: 'Calculations'
    },
    {
      name: 'ChemSpider Data Provider',
      version: '1.0.0',
      downloads: 890,
      rating: 4.6,
      verified: true,
      category: 'Data Sources'
    },
    {
      name: 'Advanced Chemistry Calculator',
      version: '1.0.0',
      downloads: 2100,
      rating: 4.9,
      verified: true,
      category: 'Calculations'
    }
  ];

  console.log('📦 Available plugins:');
  marketplacePlugins.forEach((plugin, index) => {
    const stars = '⭐'.repeat(Math.floor(plugin.rating));
    const verified = plugin.verified ? '✅' : '❓';
    
    console.log(`   ${index + 1}. ${plugin.name} v${plugin.version} ${verified}`);
    console.log(`      Rating: ${stars} (${plugin.rating}/5)`);
    console.log(`      Downloads: ${plugin.downloads.toLocaleString()}`);
    console.log(`      Category: ${plugin.category}\n`);
  });

  console.log('🎯 Marketplace features:');
  console.log('   ✅ Plugin discovery and search');
  console.log('   ✅ Ratings and reviews system');
  console.log('   ✅ Verified publisher badges');
  console.log('   ✅ Automatic updates');
  console.log('   ✅ Security scanning');
  console.log('   ✅ Dependency management\n');
}

/**
 * Utility function to demonstrate plugin configuration
 */
export function demonstratePluginConfiguration(): void {
  console.log('⚙️  Plugin Configuration Examples');
  console.log('=================================\n');

  console.log('🔧 Basic plugin configuration:');
  console.log(`
{
  "enabled": true,
  "autoLoad": true,
  "settings": {
    "precision": 10,
    "timeout": 5000
  },
  "permissions": ["read-only", "network-access"],
  "resources": {
    "maxMemory": "50MB",
    "maxCpuTime": "5s"
  }
}
`);

  console.log('🔐 Security configuration:');
  console.log(`
{
  "securityLevel": "strict",
  "allowedPermissions": ["read-only"],
  "sandboxing": {
    "isolateStorage": true,
    "rateLimitNetwork": true,
    "monitorResources": true
  }
}
`);

  console.log('🚀 Performance configuration:');
  console.log(`
{
  "enableHotSwap": true,
  "healthCheckInterval": 30000,
  "maxPlugins": 20,
  "resourceLimits": {
    "memoryPerPlugin": "100MB",
    "cpuTimePerPlugin": "5s",
    "networkRequestsPerMinute": 200
  }
}
`);
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runPluginSystemDemo().catch(console.error);
}
