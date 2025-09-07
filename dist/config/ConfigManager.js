/**
 * Configuration Manager for CREB-JS
 *
 * Provides centralized, type-safe configuration management with support for:
 * - Environment variable overrides
 * - Runtime configuration updates
 * - Configuration validation
 * - Hot-reload capability
 * - Schema-based documentation generation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventEmitter } from 'events';
import * as fs from 'fs';
import { defaultConfig, validateConfig, crebConfigSchema, generateSchemaDocumentation } from './schemas/validation';
import { ValidationError, SystemError } from '../core/errors/CREBError';
import { Singleton } from '../core/decorators/Injectable';
/**
 * Configuration Manager class
 * Provides type-safe configuration management with validation and hot-reload
 */
let ConfigManager = class ConfigManager extends EventEmitter {
    constructor(initialConfig) {
        super();
        this.watchers = [];
        this.configHistory = [];
        this.environmentMapping = this.createDefaultEnvironmentMapping();
        this.hotReloadConfig = {
            enabled: false,
            watchFiles: [],
            debounceMs: 1000,
            excludePaths: ['logging.level'] // Exclude critical settings from hot-reload
        };
        // Initialize with default config
        this.config = { ...defaultConfig };
        this.metadata = {
            version: '1.0.0',
            lastModified: new Date(),
            source: {
                type: 'default',
                priority: 1,
                description: 'Default configuration'
            },
            checksum: this.calculateChecksum(this.config)
        };
        // Apply initial config if provided
        if (initialConfig) {
            this.updateConfig(initialConfig);
        }
        // Load from environment variables
        this.loadFromEnvironment();
    }
    /**
     * Get the current configuration
     */
    getConfig() {
        return this.deepFreeze({ ...this.config });
    }
    /**
     * Get a specific configuration value by path
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            }
            else {
                throw new ValidationError(`Configuration path '${path}' not found`, { path, keys, currentKey: key }, { field: 'configPath', value: path, constraint: 'path must exist in configuration' });
            }
        }
        return value;
    }
    /**
     * Set a specific configuration value by path
     */
    set(path, value) {
        const keys = path.split('.');
        const oldValue = this.get(path);
        // Create a deep copy of config for modification
        const newConfig = JSON.parse(JSON.stringify(this.config));
        let current = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        // Validate the change
        const validationResult = this.validateConfiguration(newConfig);
        if (!validationResult.isValid) {
            throw new ValidationError(`Configuration validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`, { path, value, errors: validationResult.errors }, { field: 'configValue', value: value, constraint: 'must pass validation schema' });
        }
        // Apply the change
        this.config = newConfig;
        this.updateMetadata('runtime');
        // Emit change event
        const changeEvent = {
            path,
            oldValue,
            newValue: value,
            timestamp: new Date()
        };
        this.emit('configChanged', changeEvent);
        this.emit(`configChanged:${path}`, changeEvent);
    }
    /**
     * Update configuration with partial changes
     */
    updateConfig(partialConfig) {
        const mergedConfig = this.mergeConfigs(this.config, partialConfig);
        const validationResult = this.validateConfiguration(mergedConfig);
        if (validationResult.isValid) {
            const oldConfig = { ...this.config };
            this.config = mergedConfig;
            this.updateMetadata('runtime');
            this.saveToHistory();
            // Emit change events for each changed property
            this.emitChangeEvents(oldConfig, this.config);
        }
        return validationResult;
    }
    /**
     * Load configuration from file
     */
    async loadFromFile(filePath) {
        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            const fileConfig = JSON.parse(fileContent);
            const result = this.updateConfig(fileConfig);
            if (result.isValid) {
                this.updateMetadata('file');
                // Set up hot-reload if enabled
                if (this.hotReloadConfig.enabled) {
                    this.watchConfigFile(filePath);
                }
            }
            return result;
        }
        catch (error) {
            const configError = new SystemError(`Failed to load config file: ${error instanceof Error ? error.message : 'Unknown error'}`, { filePath, operation: 'loadFromFile' }, { subsystem: 'configuration', resource: 'file-system' });
            return {
                isValid: false,
                errors: [{
                        path: '',
                        message: configError.message,
                        value: filePath
                    }],
                warnings: []
            };
        }
    }
    /**
     * Save configuration to file
     */
    async saveToFile(filePath) {
        const configWithMetadata = {
            ...this.config,
            _metadata: this.metadata
        };
        await fs.promises.writeFile(filePath, JSON.stringify(configWithMetadata, null, 2), 'utf8');
    }
    /**
     * Load configuration from environment variables
     */
    loadFromEnvironment() {
        const envConfig = {};
        for (const [configPath, envVar] of Object.entries(this.environmentMapping)) {
            const envValue = process.env[envVar];
            if (envValue !== undefined) {
                this.setNestedValue(envConfig, configPath, this.parseEnvironmentValue(envValue));
            }
        }
        if (Object.keys(envConfig).length > 0) {
            this.updateConfig(envConfig);
            this.updateMetadata('environment');
        }
    }
    /**
     * Validate current configuration
     */
    validateConfiguration(config = this.config) {
        return validateConfig(config, crebConfigSchema);
    }
    /**
     * Enable hot-reload for configuration files
     */
    enableHotReload(options = {}) {
        this.hotReloadConfig = { ...this.hotReloadConfig, ...options, enabled: true };
    }
    /**
     * Disable hot-reload
     */
    disableHotReload() {
        this.hotReloadConfig.enabled = false;
        this.watchers.forEach(watcher => watcher.close());
        this.watchers = [];
    }
    /**
     * Get configuration metadata
     */
    getMetadata() {
        return Object.freeze({ ...this.metadata });
    }
    /**
     * Get configuration history
     */
    getHistory() {
        return this.configHistory.map(entry => ({
            config: this.deepFreeze({ ...entry.config }),
            timestamp: entry.timestamp
        }));
    }
    /**
     * Reset configuration to defaults
     */
    resetToDefaults() {
        const oldConfig = { ...this.config };
        this.config = { ...defaultConfig };
        this.updateMetadata('default');
        this.emitChangeEvents(oldConfig, this.config);
    }
    /**
     * Generate documentation for current configuration schema
     */
    generateDocumentation() {
        return generateSchemaDocumentation(crebConfigSchema, 'CREB Configuration');
    }
    /**
     * Get configuration as JSON string
     */
    toJSON() {
        return JSON.stringify(this.config, null, 2);
    }
    /**
     * Get configuration summary for debugging
     */
    getSummary() {
        const validation = this.validateConfiguration();
        return `
CREB Configuration Summary
=========================
Version: ${this.metadata.version}
Last Modified: ${this.metadata.lastModified.toISOString()}
Source: ${this.metadata.source.type}
Valid: ${validation.isValid}
Errors: ${validation.errors.length}
Warnings: ${validation.warnings.length}
Hot Reload: ${this.hotReloadConfig.enabled ? 'Enabled' : 'Disabled'}

Current Configuration:
${this.toJSON()}
    `.trim();
    }
    /**
     * Dispose of resources
     */
    dispose() {
        this.disableHotReload();
        this.removeAllListeners();
    }
    // Private methods
    createDefaultEnvironmentMapping() {
        return {
            'cache.maxSize': 'CREB_CACHE_MAX_SIZE',
            'cache.ttl': 'CREB_CACHE_TTL',
            'cache.strategy': 'CREB_CACHE_STRATEGY',
            'performance.enableWasm': 'CREB_ENABLE_WASM',
            'performance.workerThreads': 'CREB_WORKER_THREADS',
            'performance.batchSize': 'CREB_BATCH_SIZE',
            'data.providers': 'CREB_DATA_PROVIDERS',
            'data.syncInterval': 'CREB_SYNC_INTERVAL',
            'data.offlineMode': 'CREB_OFFLINE_MODE',
            'logging.level': 'CREB_LOG_LEVEL',
            'logging.format': 'CREB_LOG_FORMAT',
            'logging.destinations': 'CREB_LOG_DESTINATIONS'
        };
    }
    parseEnvironmentValue(value) {
        // Try to parse as boolean
        if (value.toLowerCase() === 'true')
            return true;
        if (value.toLowerCase() === 'false')
            return false;
        // Try to parse as number
        const numValue = Number(value);
        if (!isNaN(numValue))
            return numValue;
        // Try to parse as JSON array
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                return JSON.parse(value);
            }
            catch {
                // Fall back to comma-separated values
                return value.slice(1, -1).split(',').map(v => v.trim());
            }
        }
        // Return as string
        return value;
    }
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    mergeConfigs(base, partial) {
        const result = { ...base };
        for (const [key, value] of Object.entries(partial)) {
            if (value !== undefined) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    result[key] = {
                        ...base[key],
                        ...value
                    };
                }
                else {
                    result[key] = value;
                }
            }
        }
        return result;
    }
    updateMetadata(sourceType) {
        this.metadata = {
            ...this.metadata,
            lastModified: new Date(),
            source: {
                type: sourceType,
                priority: sourceType === 'environment' ? 3 : sourceType === 'file' ? 2 : 1,
                description: `Configuration loaded from ${sourceType}`
            },
            checksum: this.calculateChecksum(this.config)
        };
    }
    calculateChecksum(config) {
        const str = JSON.stringify(config);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }
    saveToHistory() {
        this.configHistory.push({
            config: { ...this.config },
            timestamp: new Date()
        });
        // Keep only last 10 entries
        if (this.configHistory.length > 10) {
            this.configHistory.shift();
        }
    }
    emitChangeEvents(oldConfig, newConfig) {
        const changes = this.findConfigChanges(oldConfig, newConfig);
        for (const change of changes) {
            this.emit('configChanged', change);
            this.emit(`configChanged:${change.path}`, change);
        }
    }
    findConfigChanges(oldConfig, newConfig, prefix = '') {
        const changes = [];
        for (const [key, newValue] of Object.entries(newConfig)) {
            const path = prefix ? `${prefix}.${key}` : key;
            const oldValue = oldConfig[key];
            if (typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
                changes.push(...this.findConfigChanges(oldValue || {}, newValue, path));
            }
            else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                changes.push({
                    path,
                    oldValue,
                    newValue,
                    timestamp: new Date()
                });
            }
        }
        return changes;
    }
    watchConfigFile(filePath) {
        const watcher = fs.watch(filePath, { persistent: false }, (eventType) => {
            if (eventType === 'change') {
                setTimeout(() => {
                    this.loadFromFile(filePath).catch(error => {
                        this.emit('error', new Error(`Hot-reload failed: ${error.message}`));
                    });
                }, this.hotReloadConfig.debounceMs);
            }
        });
        this.watchers.push(watcher);
    }
    /**
     * Deep freeze an object to make it truly immutable
     */
    deepFreeze(obj) {
        // Get property names
        Object.getOwnPropertyNames(obj).forEach(prop => {
            const value = obj[prop];
            // Freeze properties before freezing self
            if (value && typeof value === 'object') {
                this.deepFreeze(value);
            }
        });
        return Object.freeze(obj);
    }
};
ConfigManager = __decorate([
    Singleton(),
    __metadata("design:paramtypes", [Object])
], ConfigManager);
export { ConfigManager };
/**
 * Singleton configuration manager instance
 */
export const configManager = new ConfigManager();
/**
 * Convenience function to get configuration value
 */
export function getConfig(path) {
    return configManager.get(path);
}
/**
 * Convenience function to set configuration value
 */
export function setConfig(path, value) {
    configManager.set(path, value);
}
/**
 * Convenience function to get full configuration
 */
export function getFullConfig() {
    return configManager.getConfig();
}
//# sourceMappingURL=ConfigManager.js.map