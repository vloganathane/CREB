/**
 * Configuration Management Integration Example
 *
 * This example demonstrates all features of the CREB configuration system:
 * - Type-safe configuration access
 * - Environment variable overrides
 * - Configuration validation
 * - Hot-reload capability
 * - Runtime configuration updates
 * - Event handling
 */
import { ConfigManager, getConfig, setConfig } from './ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
/**
 * Example: Basic Configuration Usage
 */
export function basicConfigurationExample() {
    console.log('=== Basic Configuration Usage ===');
    // Create a new configuration manager
    const configManager = new ConfigManager();
    // Get current configuration
    const config = configManager.getConfig();
    console.log('Default configuration:', JSON.stringify(config, null, 2));
    // Access specific configuration values with type safety
    const cacheSize = getConfig('cache.maxSize');
    const logLevel = getConfig('logging.level');
    const enableWasm = getConfig('performance.enableWasm');
    console.log(`Cache size: ${cacheSize}`);
    console.log(`Log level: ${logLevel}`);
    console.log(`WASM enabled: ${enableWasm}`);
    // Update configuration values
    setConfig('cache.maxSize', 5000);
    setConfig('logging.level', 'debug');
    setConfig('performance.enableWasm', true);
    console.log('Updated cache size:', getConfig('cache.maxSize'));
    console.log('Updated log level:', getConfig('logging.level'));
    console.log('Updated WASM setting:', getConfig('performance.enableWasm'));
    configManager.dispose();
}
/**
 * Example: Environment Variable Integration
 */
export function environmentVariableExample() {
    console.log('\n=== Environment Variable Integration ===');
    // Set environment variables (in a real application, these would be set externally)
    process.env.CREB_CACHE_MAX_SIZE = '10000';
    process.env.CREB_LOG_LEVEL = 'warn';
    process.env.CREB_ENABLE_WASM = 'true';
    process.env.CREB_DATA_PROVIDERS = '["sqlite", "nist", "pubchem"]';
    // Create configuration manager (will automatically load from environment)
    const configManager = new ConfigManager();
    console.log('Configuration loaded from environment variables:');
    console.log(`Cache size: ${configManager.get('cache.maxSize')}`); // 10000
    console.log(`Log level: ${configManager.get('logging.level')}`); // warn
    console.log(`WASM enabled: ${configManager.get('performance.enableWasm')}`); // true
    console.log(`Data providers: ${JSON.stringify(configManager.get('data.providers'))}`);
    // Clean up environment variables
    delete process.env.CREB_CACHE_MAX_SIZE;
    delete process.env.CREB_LOG_LEVEL;
    delete process.env.CREB_ENABLE_WASM;
    delete process.env.CREB_DATA_PROVIDERS;
    configManager.dispose();
}
/**
 * Example: Configuration Validation
 */
export function configurationValidationExample() {
    console.log('\n=== Configuration Validation ===');
    const configManager = new ConfigManager();
    // Valid configuration update
    const validUpdate = {
        cache: {
            maxSize: 8000,
            strategy: 'lfu'
        },
        performance: {
            workerThreads: 8
        }
    };
    const validResult = configManager.updateConfig(validUpdate);
    console.log('Valid configuration update:', validResult.isValid);
    console.log('Errors:', validResult.errors.length);
    // Invalid configuration update
    const invalidUpdate = {
        cache: {
            maxSize: -1, // Invalid: below minimum
            strategy: 'invalid-strategy' // Invalid: not in enum
        },
        performance: {
            enableWasm: 'maybe', // Invalid: not boolean
            workerThreads: 0 // Invalid: below minimum
        }
    };
    const invalidResult = configManager.updateConfig(invalidUpdate);
    console.log('Invalid configuration update:', invalidResult.isValid);
    console.log('Validation errors:');
    invalidResult.errors.forEach(error => {
        console.log(`  - ${error.path}: ${error.message}`);
    });
    configManager.dispose();
}
/**
 * Example: File-based Configuration
 */
export async function fileBasedConfigurationExample() {
    console.log('\n=== File-based Configuration ===');
    const configManager = new ConfigManager();
    const configFilePath = path.join(__dirname, 'example-config.json');
    // Create a configuration file
    const fileConfig = {
        cache: {
            maxSize: 15000,
            ttl: 900000, // 15 minutes
            strategy: 'fifo'
        },
        performance: {
            enableWasm: true,
            workerThreads: 12,
            batchSize: 500
        },
        data: {
            providers: ['sqlite', 'nist'],
            syncInterval: 1800000, // 30 minutes
            offlineMode: true
        },
        logging: {
            level: 'debug',
            format: 'json',
            destinations: ['console', 'file']
        }
    };
    // Save configuration to file
    await fs.promises.writeFile(configFilePath, JSON.stringify(fileConfig, null, 2));
    console.log('Configuration file created:', configFilePath);
    // Load configuration from file
    const loadResult = await configManager.loadFromFile(configFilePath);
    if (loadResult.isValid) {
        console.log('Configuration loaded successfully from file');
        console.log('Current cache size:', configManager.get('cache.maxSize'));
        console.log('Current worker threads:', configManager.get('performance.workerThreads'));
        console.log('Current offline mode:', configManager.get('data.offlineMode'));
    }
    else {
        console.log('Failed to load configuration from file');
        loadResult.errors.forEach(error => console.log(`Error: ${error.message}`));
    }
    // Save current configuration back to file
    await configManager.saveToFile(configFilePath);
    console.log('Configuration saved to file');
    // Clean up
    try {
        await fs.promises.unlink(configFilePath);
    }
    catch {
        // Ignore cleanup errors
    }
    configManager.dispose();
}
/**
 * Example: Event Handling and Change Tracking
 */
export function eventHandlingExample() {
    console.log('\n=== Event Handling and Change Tracking ===');
    const configManager = new ConfigManager();
    // Set up event listeners
    configManager.on('configChanged', (event) => {
        console.log(`Configuration changed: ${event.path}`);
        console.log(`  Old value: ${JSON.stringify(event.oldValue)}`);
        console.log(`  New value: ${JSON.stringify(event.newValue)}`);
        console.log(`  Timestamp: ${event.timestamp.toISOString()}`);
    });
    // Listen for specific configuration changes
    configManager.on('configChanged:cache.maxSize', (event) => {
        console.log(`Cache size specifically changed from ${event.oldValue} to ${event.newValue}`);
    });
    configManager.on('configChanged:logging.level', (event) => {
        console.log(`Log level specifically changed from ${event.oldValue} to ${event.newValue}`);
    });
    // Make some configuration changes
    console.log('Making configuration changes...');
    configManager.set('cache.maxSize', 7000);
    configManager.set('logging.level', 'error');
    configManager.set('performance.batchSize', 250);
    // Batch update
    configManager.updateConfig({
        data: {
            syncInterval: 2400000,
            offlineMode: true
        }
    });
    configManager.dispose();
}
/**
 * Example: Hot-reload Configuration (Simulated)
 */
export async function hotReloadExample() {
    console.log('\n=== Hot-reload Configuration ===');
    const configManager = new ConfigManager();
    const configFilePath = path.join(__dirname, 'hot-reload-config.json');
    // Enable hot-reload
    configManager.enableHotReload({
        debounceMs: 500,
        excludePaths: ['performance.enableWasm'] // Don't hot-reload critical settings
    });
    // Set up change listener
    configManager.on('configChanged', (event) => {
        console.log(`Hot-reload detected change: ${event.path} = ${JSON.stringify(event.newValue)}`);
    });
    // Create initial config file
    const initialConfig = {
        cache: { maxSize: 3000 },
        logging: { level: 'info' }
    };
    await fs.promises.writeFile(configFilePath, JSON.stringify(initialConfig, null, 2));
    // Load from file
    await configManager.loadFromFile(configFilePath);
    console.log('Initial configuration loaded');
    console.log('Cache size:', configManager.get('cache.maxSize'));
    // Simulate file change (in real usage, this would be external)
    setTimeout(async () => {
        const updatedConfig = {
            cache: { maxSize: 6000 },
            logging: { level: 'debug' }
        };
        await fs.promises.writeFile(configFilePath, JSON.stringify(updatedConfig, null, 2));
        console.log('Configuration file updated externally');
    }, 1000);
    // Wait for hot-reload to trigger
    setTimeout(() => {
        console.log('After hot-reload - Cache size:', configManager.get('cache.maxSize'));
        // Clean up
        configManager.disableHotReload();
        fs.promises.unlink(configFilePath).catch(() => { });
        configManager.dispose();
    }, 2000);
}
/**
 * Example: Configuration Metadata and History
 */
export function metadataAndHistoryExample() {
    console.log('\n=== Configuration Metadata and History ===');
    const configManager = new ConfigManager();
    // Show initial metadata
    const initialMetadata = configManager.getMetadata();
    console.log('Initial metadata:');
    console.log(`  Version: ${initialMetadata.version}`);
    console.log(`  Source: ${initialMetadata.source.type}`);
    console.log(`  Last modified: ${initialMetadata.lastModified.toISOString()}`);
    console.log(`  Checksum: ${initialMetadata.checksum}`);
    // Make several configuration changes
    configManager.set('cache.maxSize', 4000);
    configManager.set('logging.level', 'warn');
    configManager.updateConfig({
        performance: {
            enableWasm: true,
            workerThreads: 6
        }
    });
    // Show updated metadata
    const updatedMetadata = configManager.getMetadata();
    console.log('\nUpdated metadata:');
    console.log(`  Source: ${updatedMetadata.source.type}`);
    console.log(`  Last modified: ${updatedMetadata.lastModified.toISOString()}`);
    console.log(`  Checksum: ${updatedMetadata.checksum}`);
    // Show configuration history
    const history = configManager.getHistory();
    console.log(`\nConfiguration history (${history.length} entries):`);
    history.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.timestamp.toISOString()}: cache.maxSize = ${entry.config.cache.maxSize}`);
    });
    configManager.dispose();
}
/**
 * Example: Documentation Generation
 */
export function documentationGenerationExample() {
    console.log('\n=== Documentation Generation ===');
    const configManager = new ConfigManager();
    // Generate schema documentation
    const documentation = configManager.generateDocumentation();
    console.log('Generated schema documentation:');
    console.log(documentation.substring(0, 500) + '...');
    // Get configuration summary
    const summary = configManager.getSummary();
    console.log('\nConfiguration summary:');
    console.log(summary);
    configManager.dispose();
}
/**
 * Example: Integration with Application Components
 */
export class ExampleChemistryCalculator {
    constructor(configManager) {
        this.configManager = configManager;
        // Listen for configuration changes that affect this component
        this.configManager.on('configChanged:performance.enableWasm', () => {
            this.reinitializeCalculationEngine();
        });
        this.configManager.on('configChanged:performance.batchSize', () => {
            this.updateBatchProcessing();
        });
    }
    performCalculation() {
        const enableWasm = this.configManager.get('performance.enableWasm');
        const batchSize = this.configManager.get('performance.batchSize');
        const workerThreads = this.configManager.get('performance.workerThreads');
        console.log('Performing calculation with configuration:');
        console.log(`  WASM enabled: ${enableWasm}`);
        console.log(`  Batch size: ${batchSize}`);
        console.log(`  Worker threads: ${workerThreads}`);
        if (enableWasm) {
            console.log('  Using WebAssembly acceleration');
        }
        else {
            console.log('  Using JavaScript implementation');
        }
    }
    reinitializeCalculationEngine() {
        console.log('Reinitializing calculation engine due to WASM setting change');
    }
    updateBatchProcessing() {
        console.log('Updating batch processing configuration');
    }
}
/**
 * Example: Application Integration
 */
export function applicationIntegrationExample() {
    console.log('\n=== Application Integration ===');
    const configManager = new ConfigManager();
    // Initialize application components with configuration
    const calculator = new ExampleChemistryCalculator(configManager);
    // Perform initial calculation
    calculator.performCalculation();
    // Update configuration during runtime
    console.log('\nUpdating configuration...');
    configManager.set('performance.enableWasm', true);
    configManager.set('performance.batchSize', 200);
    configManager.set('performance.workerThreads', 8);
    // Perform calculation with new configuration
    calculator.performCalculation();
    configManager.dispose();
}
/**
 * Run all examples
 */
export async function runAllConfigurationExamples() {
    console.log('🔧 CREB Configuration Management Examples');
    console.log('==========================================\n');
    try {
        basicConfigurationExample();
        environmentVariableExample();
        configurationValidationExample();
        await fileBasedConfigurationExample();
        eventHandlingExample();
        await hotReloadExample();
        metadataAndHistoryExample();
        documentationGenerationExample();
        applicationIntegrationExample();
        console.log('\n✅ All configuration examples completed successfully!');
    }
    catch (error) {
        console.error('\n❌ Error running configuration examples:', error);
    }
}
// Export for potential external usage
export { ConfigManager, getConfig, setConfig } from './ConfigManager';
export * from './types';
//# sourceMappingURL=ConfigurationIntegrationExample.js.map