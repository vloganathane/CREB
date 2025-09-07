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

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { 
  CREBConfig, 
  PartialCREBConfig, 
  ConfigValidationResult,
  ConfigChangeEvent,
  ConfigEnvironmentMapping,
  ConfigMetadata,
  HotReloadConfig,
  ConfigPath,
  ConfigValueType
} from './types';
import { 
  defaultConfig, 
  validateConfig, 
  crebConfigSchema,
  generateSchemaDocumentation 
} from './schemas/validation';
import { ValidationError, SystemError } from '../core/errors/CREBError';
import { Singleton } from '../core/decorators/Injectable';

/**
 * Configuration Manager class
 * Provides type-safe configuration management with validation and hot-reload
 */
@Singleton()
export class ConfigManager extends EventEmitter {
  private config: CREBConfig;
  private metadata: ConfigMetadata;
  private environmentMapping: ConfigEnvironmentMapping;
  private hotReloadConfig: HotReloadConfig;
  private watchers: fs.FSWatcher[] = [];
  private readonly configHistory: Array<{ config: CREBConfig; timestamp: Date }> = [];

  constructor(initialConfig?: PartialCREBConfig) {
    super();
    
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
  getConfig(): Readonly<CREBConfig> {
    return this.deepFreeze({ ...this.config });
  }

  /**
   * Get a specific configuration value by path
   */
  get<T extends ConfigPath>(path: T): ConfigValueType<T> {
    const keys = path.split('.') as Array<keyof CREBConfig>;
    let value: any = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        throw new ValidationError(
          `Configuration path '${path}' not found`,
          { path, keys, currentKey: key },
          { field: 'configPath', value: path, constraint: 'path must exist in configuration' }
        );
      }
    }
    
    return value as ConfigValueType<T>;
  }

  /**
   * Set a specific configuration value by path
   */
  set<T extends ConfigPath>(path: T, value: ConfigValueType<T>): void {
    const keys = path.split('.') as Array<keyof CREBConfig>;
    const oldValue = this.get(path);
    
    // Create a deep copy of config for modification
    const newConfig = JSON.parse(JSON.stringify(this.config)) as CREBConfig;
    
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    // Validate the change
    const validationResult = this.validateConfiguration(newConfig);
    if (!validationResult.isValid) {
      throw new ValidationError(
        `Configuration validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`,
        { path, value, errors: validationResult.errors },
        { field: 'configValue', value: value, constraint: 'must pass validation schema' }
      );
    }
    
    // Apply the change
    this.config = newConfig;
    this.updateMetadata('runtime');
    
    // Emit change event
    const changeEvent: ConfigChangeEvent = {
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
  updateConfig(partialConfig: PartialCREBConfig): ConfigValidationResult {
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
  async loadFromFile(filePath: string): Promise<ConfigValidationResult> {
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const fileConfig = JSON.parse(fileContent) as PartialCREBConfig;
      
      const result = this.updateConfig(fileConfig);
      
      if (result.isValid) {
        this.updateMetadata('file');
        
        // Set up hot-reload if enabled
        if (this.hotReloadConfig.enabled) {
          this.watchConfigFile(filePath);
        }
      }
      
      return result;
    } catch (error) {
      const configError = new SystemError(
        `Failed to load config file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { filePath, operation: 'loadFromFile' },
        { subsystem: 'configuration', resource: 'file-system' }
      );
      
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
  async saveToFile(filePath: string): Promise<void> {
    const configWithMetadata = {
      ...this.config,
      _metadata: this.metadata
    };
    
    await fs.promises.writeFile(
      filePath, 
      JSON.stringify(configWithMetadata, null, 2), 
      'utf8'
    );
  }

  /**
   * Load configuration from environment variables
   */
  loadFromEnvironment(): void {
    const envConfig: any = {};
    
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
  validateConfiguration(config: CREBConfig = this.config): ConfigValidationResult {
    return validateConfig(config, crebConfigSchema);
  }

  /**
   * Enable hot-reload for configuration files
   */
  enableHotReload(options: Partial<HotReloadConfig> = {}): void {
    this.hotReloadConfig = { ...this.hotReloadConfig, ...options, enabled: true };
  }

  /**
   * Disable hot-reload
   */
  disableHotReload(): void {
    this.hotReloadConfig.enabled = false;
    this.watchers.forEach(watcher => watcher.close());
    this.watchers = [];
  }

  /**
   * Get configuration metadata
   */
  getMetadata(): Readonly<ConfigMetadata> {
    return Object.freeze({ ...this.metadata });
  }

  /**
   * Get configuration history
   */
  getHistory(): ReadonlyArray<{ config: Readonly<CREBConfig>; timestamp: Date }> {
    return this.configHistory.map(entry => ({
      config: this.deepFreeze({ ...entry.config }),
      timestamp: entry.timestamp
    }));
  }

  /**
   * Reset configuration to defaults
   */
  resetToDefaults(): void {
    const oldConfig = { ...this.config };
    this.config = { ...defaultConfig };
    this.updateMetadata('default');
    this.emitChangeEvents(oldConfig, this.config);
  }

  /**
   * Generate documentation for current configuration schema
   */
  generateDocumentation(): string {
    return generateSchemaDocumentation(crebConfigSchema, 'CREB Configuration');
  }

  /**
   * Get configuration as JSON string
   */
  toJSON(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Get configuration summary for debugging
   */
  getSummary(): string {
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
  dispose(): void {
    this.disableHotReload();
    this.removeAllListeners();
  }

  // Private methods

  private createDefaultEnvironmentMapping(): ConfigEnvironmentMapping {
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

  private parseEnvironmentValue(value: string): unknown {
    // Try to parse as boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Try to parse as number
    const numValue = Number(value);
    if (!isNaN(numValue)) return numValue;
    
    // Try to parse as JSON array
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value);
      } catch {
        // Fall back to comma-separated values
        return value.slice(1, -1).split(',').map(v => v.trim());
      }
    }
    
    // Return as string
    return value;
  }

  private setNestedValue(obj: any, path: string, value: unknown): void {
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

  private mergeConfigs(base: CREBConfig, partial: PartialCREBConfig): CREBConfig {
    const result = { ...base };
    
    for (const [key, value] of Object.entries(partial)) {
      if (value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          result[key as keyof CREBConfig] = {
            ...base[key as keyof CREBConfig],
            ...value
          } as any;
        } else {
          result[key as keyof CREBConfig] = value as any;
        }
      }
    }
    
    return result;
  }

  private updateMetadata(sourceType: 'default' | 'file' | 'environment' | 'runtime'): void {
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

  private calculateChecksum(config: CREBConfig): string {
    const str = JSON.stringify(config);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private saveToHistory(): void {
    this.configHistory.push({
      config: { ...this.config },
      timestamp: new Date()
    });
    
    // Keep only last 10 entries
    if (this.configHistory.length > 10) {
      this.configHistory.shift();
    }
  }

  private emitChangeEvents(oldConfig: CREBConfig, newConfig: CREBConfig): void {
    const changes = this.findConfigChanges(oldConfig, newConfig);
    
    for (const change of changes) {
      this.emit('configChanged', change);
      this.emit(`configChanged:${change.path}`, change);
    }
  }

  private findConfigChanges(oldConfig: CREBConfig, newConfig: CREBConfig, prefix = ''): ConfigChangeEvent[] {
    const changes: ConfigChangeEvent[] = [];
    
    for (const [key, newValue] of Object.entries(newConfig)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const oldValue = (oldConfig as any)[key];
      
      if (typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
        changes.push(...this.findConfigChanges(oldValue || {}, newValue, path));
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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

  private watchConfigFile(filePath: string): void {
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
  private deepFreeze<T>(obj: T): T {
    // Get property names
    Object.getOwnPropertyNames(obj).forEach(prop => {
      const value = (obj as any)[prop];
      
      // Freeze properties before freezing self
      if (value && typeof value === 'object') {
        this.deepFreeze(value);
      }
    });
    
    return Object.freeze(obj);
  }
}

/**
 * Singleton configuration manager instance
 */
export const configManager = new ConfigManager();

/**
 * Convenience function to get configuration value
 */
export function getConfig<T extends ConfigPath>(path: T): ConfigValueType<T> {
  return configManager.get(path);
}

/**
 * Convenience function to set configuration value
 */
export function setConfig<T extends ConfigPath>(path: T, value: ConfigValueType<T>): void {
  configManager.set(path, value);
}

/**
 * Convenience function to get full configuration
 */
export function getFullConfig(): Readonly<CREBConfig> {
  return configManager.getConfig();
}
