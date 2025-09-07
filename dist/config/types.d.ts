/**
 * Configuration Types for CREB-JS
 *
 * Defines all configuration interfaces and types used throughout the application.
 * This file serves as the single source of truth for configuration structure.
 */
/**
 * Cache configuration options
 */
export interface CacheConfig {
    /** Maximum number of items in cache */
    maxSize: number;
    /** Time to live in milliseconds */
    ttl: number;
    /** Cache eviction strategy */
    strategy: 'lru' | 'lfu' | 'fifo';
}
/**
 * Performance configuration options
 */
export interface PerformanceConfig {
    /** Enable WebAssembly acceleration */
    enableWasm: boolean;
    /** Number of worker threads to use */
    workerThreads: number;
    /** Batch size for bulk operations */
    batchSize: number;
}
/**
 * Data provider configuration
 */
export interface DataConfig {
    /** List of data providers to use */
    providers: string[];
    /** Sync interval in milliseconds */
    syncInterval: number;
    /** Enable offline mode */
    offlineMode: boolean;
}
/**
 * Logging configuration
 */
export interface LoggingConfig {
    /** Log level */
    level: 'debug' | 'info' | 'warn' | 'error';
    /** Log format */
    format: 'json' | 'text';
    /** Log destinations */
    destinations: string[];
}
/**
 * Main CREB configuration interface
 */
export interface CREBConfig {
    cache: CacheConfig;
    performance: PerformanceConfig;
    data: DataConfig;
    logging: LoggingConfig;
}
/**
 * Partial configuration for updates
 */
export type PartialCREBConfig = {
    [K in keyof CREBConfig]?: Partial<CREBConfig[K]>;
};
/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
    isValid: boolean;
    errors: ConfigValidationError[];
    warnings: ConfigValidationWarning[];
}
/**
 * Configuration validation error
 */
export interface ConfigValidationError {
    path: string;
    message: string;
    value: unknown;
    expectedType?: string;
}
/**
 * Configuration validation warning
 */
export interface ConfigValidationWarning {
    path: string;
    message: string;
    value: unknown;
    suggestion?: string;
}
/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
    path: string;
    oldValue: unknown;
    newValue: unknown;
    timestamp: Date;
}
/**
 * Configuration environment variables mapping
 */
export interface ConfigEnvironmentMapping {
    [configPath: string]: string;
}
/**
 * Configuration source information
 */
export interface ConfigSource {
    type: 'default' | 'file' | 'environment' | 'runtime';
    priority: number;
    description: string;
}
/**
 * Configuration metadata
 */
export interface ConfigMetadata {
    version: string;
    lastModified: Date;
    source: ConfigSource;
    checksum: string;
}
/**
 * Hot-reload configuration options
 */
export interface HotReloadConfig {
    enabled: boolean;
    watchFiles: string[];
    debounceMs: number;
    excludePaths: string[];
}
/**
 * Type guard for CREBConfig
 */
export declare function isCREBConfig(obj: unknown): obj is CREBConfig;
/**
 * Type for configuration path strings
 */
export type ConfigPath = 'cache.maxSize' | 'cache.ttl' | 'cache.strategy' | 'performance.enableWasm' | 'performance.workerThreads' | 'performance.batchSize' | 'data.providers' | 'data.syncInterval' | 'data.offlineMode' | 'logging.level' | 'logging.format' | 'logging.destinations';
/**
 * Type for getting value type from config path
 */
export type ConfigValueType<T extends ConfigPath> = T extends 'cache.maxSize' ? number : T extends 'cache.ttl' ? number : T extends 'cache.strategy' ? 'lru' | 'lfu' | 'fifo' : T extends 'performance.enableWasm' ? boolean : T extends 'performance.workerThreads' ? number : T extends 'performance.batchSize' ? number : T extends 'data.providers' ? string[] : T extends 'data.syncInterval' ? number : T extends 'data.offlineMode' ? boolean : T extends 'logging.level' ? 'debug' | 'info' | 'warn' | 'error' : T extends 'logging.format' ? 'json' | 'text' : T extends 'logging.destinations' ? string[] : never;
//# sourceMappingURL=types.d.ts.map