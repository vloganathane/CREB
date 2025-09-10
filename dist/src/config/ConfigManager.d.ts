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
import { CREBConfig, PartialCREBConfig, ConfigValidationResult, ConfigMetadata, HotReloadConfig, ConfigPath, ConfigValueType } from './types';
/**
 * Configuration Manager class
 * Provides type-safe configuration management with validation and hot-reload
 */
export declare class ConfigManager extends EventEmitter {
    private config;
    private metadata;
    private environmentMapping;
    private hotReloadConfig;
    private watchers;
    private readonly configHistory;
    constructor(initialConfig?: PartialCREBConfig);
    /**
     * Get the current configuration
     */
    getConfig(): Readonly<CREBConfig>;
    /**
     * Get a specific configuration value by path
     */
    get<T extends ConfigPath>(path: T): ConfigValueType<T>;
    /**
     * Set a specific configuration value by path
     */
    set<T extends ConfigPath>(path: T, value: ConfigValueType<T>): void;
    /**
     * Update configuration with partial changes
     */
    updateConfig(partialConfig: PartialCREBConfig): ConfigValidationResult;
    /**
     * Load configuration from file
     */
    loadFromFile(filePath: string): Promise<ConfigValidationResult>;
    /**
     * Save configuration to file
     */
    saveToFile(filePath: string): Promise<void>;
    /**
     * Load configuration from environment variables
     */
    loadFromEnvironment(): void;
    /**
     * Validate current configuration
     */
    validateConfiguration(config?: CREBConfig): ConfigValidationResult;
    /**
     * Enable hot-reload for configuration files
     */
    enableHotReload(options?: Partial<HotReloadConfig>): void;
    /**
     * Disable hot-reload
     */
    disableHotReload(): void;
    /**
     * Get configuration metadata
     */
    getMetadata(): Readonly<ConfigMetadata>;
    /**
     * Get configuration history
     */
    getHistory(): ReadonlyArray<{
        config: Readonly<CREBConfig>;
        timestamp: Date;
    }>;
    /**
     * Reset configuration to defaults
     */
    resetToDefaults(): void;
    /**
     * Generate documentation for current configuration schema
     */
    generateDocumentation(): string;
    /**
     * Get configuration as JSON string
     */
    toJSON(): string;
    /**
     * Get configuration summary for debugging
     */
    getSummary(): string;
    /**
     * Dispose of resources
     */
    dispose(): void;
    private createDefaultEnvironmentMapping;
    private parseEnvironmentValue;
    private setNestedValue;
    private mergeConfigs;
    private updateMetadata;
    private calculateChecksum;
    private saveToHistory;
    private emitChangeEvents;
    private findConfigChanges;
    private watchConfigFile;
    /**
     * Deep freeze an object to make it truly immutable
     */
    private deepFreeze;
}
/**
 * Singleton configuration manager instance
 */
export declare const configManager: ConfigManager;
/**
 * Convenience function to get configuration value
 */
export declare function getConfig<T extends ConfigPath>(path: T): ConfigValueType<T>;
/**
 * Convenience function to set configuration value
 */
export declare function setConfig<T extends ConfigPath>(path: T, value: ConfigValueType<T>): void;
/**
 * Convenience function to get full configuration
 */
export declare function getFullConfig(): Readonly<CREBConfig>;
//# sourceMappingURL=ConfigManager.d.ts.map