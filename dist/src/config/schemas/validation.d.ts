/**
 * Configuration Schema Definitions
 *
 * This file contains validation schemas for all configuration types.
 * Schemas are used for runtime validation and documentation generation.
 */
import { CREBConfig, CacheConfig, PerformanceConfig, DataConfig, LoggingConfig, ConfigValidationResult } from '../types';
/**
 * Schema definition interface
 */
interface SchemaProperty {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    enum?: readonly string[];
    items?: SchemaProperty;
    properties?: Record<string, SchemaProperty>;
    default?: unknown;
    description?: string;
}
/**
 * Cache configuration schema
 */
export declare const cacheConfigSchema: Record<keyof CacheConfig, SchemaProperty>;
/**
 * Performance configuration schema
 */
export declare const performanceConfigSchema: Record<keyof PerformanceConfig, SchemaProperty>;
/**
 * Data configuration schema
 */
export declare const dataConfigSchema: Record<keyof DataConfig, SchemaProperty>;
/**
 * Logging configuration schema
 */
export declare const loggingConfigSchema: Record<keyof LoggingConfig, SchemaProperty>;
/**
 * Main CREB configuration schema
 */
export declare const crebConfigSchema: Record<keyof CREBConfig, SchemaProperty>;
/**
 * Default configuration values
 */
export declare const defaultConfig: CREBConfig;
/**
 * Validate a configuration object against schema
 */
export declare function validateConfig(config: unknown, schema: Record<string, SchemaProperty>, path?: string): ConfigValidationResult;
/**
 * Generate documentation from schema
 */
export declare function generateSchemaDocumentation(schema: Record<string, SchemaProperty>, title: string): string;
export {};
//# sourceMappingURL=validation.d.ts.map