/**
 * Configuration Schema Definitions
 *
 * This file contains validation schemas for all configuration types.
 * Schemas are used for runtime validation and documentation generation.
 */
/**
 * Cache configuration schema
 */
export const cacheConfigSchema = {
    maxSize: {
        type: 'number',
        required: true,
        min: 1,
        max: 100000,
        default: 1000,
        description: 'Maximum number of items to store in cache'
    },
    ttl: {
        type: 'number',
        required: true,
        min: 1000,
        max: 86400000, // 24 hours
        default: 300000, // 5 minutes
        description: 'Time to live for cache entries in milliseconds'
    },
    strategy: {
        type: 'string',
        required: true,
        enum: ['lru', 'lfu', 'fifo'],
        default: 'lru',
        description: 'Cache eviction strategy'
    }
};
/**
 * Performance configuration schema
 */
export const performanceConfigSchema = {
    enableWasm: {
        type: 'boolean',
        required: true,
        default: false,
        description: 'Enable WebAssembly acceleration for calculations'
    },
    workerThreads: {
        type: 'number',
        required: true,
        min: 1,
        max: 16,
        default: 4,
        description: 'Number of worker threads for parallel processing'
    },
    batchSize: {
        type: 'number',
        required: true,
        min: 1,
        max: 10000,
        default: 100,
        description: 'Batch size for bulk operations'
    }
};
/**
 * Data configuration schema
 */
export const dataConfigSchema = {
    providers: {
        type: 'array',
        required: true,
        items: {
            type: 'string',
            enum: ['sqlite', 'nist', 'pubchem', 'local']
        },
        default: ['sqlite', 'local'],
        description: 'List of data providers to use'
    },
    syncInterval: {
        type: 'number',
        required: true,
        min: 60000, // 1 minute
        max: 86400000, // 24 hours
        default: 3600000, // 1 hour
        description: 'Data synchronization interval in milliseconds'
    },
    offlineMode: {
        type: 'boolean',
        required: true,
        default: false,
        description: 'Enable offline mode (no network requests)'
    }
};
/**
 * Logging configuration schema
 */
export const loggingConfigSchema = {
    level: {
        type: 'string',
        required: true,
        enum: ['debug', 'info', 'warn', 'error'],
        default: 'info',
        description: 'Minimum log level to output'
    },
    format: {
        type: 'string',
        required: true,
        enum: ['json', 'text'],
        default: 'text',
        description: 'Log output format'
    },
    destinations: {
        type: 'array',
        required: true,
        items: {
            type: 'string',
            enum: ['console', 'file', 'remote']
        },
        default: ['console'],
        description: 'Log output destinations'
    }
};
/**
 * Main CREB configuration schema
 */
export const crebConfigSchema = {
    cache: {
        type: 'object',
        required: true,
        properties: cacheConfigSchema,
        description: 'Cache configuration settings'
    },
    performance: {
        type: 'object',
        required: true,
        properties: performanceConfigSchema,
        description: 'Performance optimization settings'
    },
    data: {
        type: 'object',
        required: true,
        properties: dataConfigSchema,
        description: 'Data provider configuration'
    },
    logging: {
        type: 'object',
        required: true,
        properties: loggingConfigSchema,
        description: 'Logging configuration'
    }
};
/**
 * Default configuration values
 */
export const defaultConfig = {
    cache: {
        maxSize: 1000,
        ttl: 300000, // 5 minutes
        strategy: 'lru'
    },
    performance: {
        enableWasm: false,
        workerThreads: 4,
        batchSize: 100
    },
    data: {
        providers: ['sqlite', 'local'],
        syncInterval: 3600000, // 1 hour
        offlineMode: false
    },
    logging: {
        level: 'info',
        format: 'text',
        destinations: ['console']
    }
};
/**
 * Validate a configuration object against schema
 */
export function validateConfig(config, schema, path = '') {
    const errors = [];
    const warnings = [];
    if (typeof config !== 'object' || config === null) {
        errors.push({
            path,
            message: 'Configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return { isValid: false, errors, warnings };
    }
    const configObj = config;
    // Check required properties
    for (const [key, property] of Object.entries(schema)) {
        const currentPath = path ? `${path}.${key}` : key;
        const value = configObj[key];
        if (property.required && value === undefined) {
            errors.push({
                path: currentPath,
                message: `Required property '${key}' is missing`,
                value: undefined,
                expectedType: property.type
            });
            continue;
        }
        if (value === undefined)
            continue;
        // Type validation
        const typeValid = validateType(value, property, currentPath, errors, warnings);
        if (!typeValid)
            continue;
        // Range validation for numbers
        if (property.type === 'number' && typeof value === 'number') {
            if (property.min !== undefined && value < property.min) {
                errors.push({
                    path: currentPath,
                    message: `Value ${value} is below minimum ${property.min}`,
                    value
                });
            }
            if (property.max !== undefined && value > property.max) {
                errors.push({
                    path: currentPath,
                    message: `Value ${value} is above maximum ${property.max}`,
                    value
                });
            }
        }
        // Enum validation
        if (property.enum && !property.enum.includes(value)) {
            errors.push({
                path: currentPath,
                message: `Value '${value}' is not one of allowed values: ${property.enum.join(', ')}`,
                value,
                expectedType: `enum: ${property.enum.join(' | ')}`
            });
        }
        // Array validation
        if (property.type === 'array' && Array.isArray(value) && property.items) {
            value.forEach((item, index) => {
                const itemPath = `${currentPath}[${index}]`;
                validateType(item, property.items, itemPath, errors, warnings);
                if (property.items.enum && !property.items.enum.includes(item)) {
                    errors.push({
                        path: itemPath,
                        message: `Array item '${item}' is not one of allowed values: ${property.items.enum.join(', ')}`,
                        value: item
                    });
                }
            });
        }
        // Object validation (recursive)
        if (property.type === 'object' && property.properties) {
            const nestedResult = validateConfig(value, property.properties, currentPath);
            errors.push(...nestedResult.errors);
            warnings.push(...nestedResult.warnings);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * Validate value type
 */
function validateType(value, property, path, errors, warnings) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== property.type) {
        errors.push({
            path,
            message: `Expected ${property.type}, got ${actualType}`,
            value,
            expectedType: property.type
        });
        return false;
    }
    return true;
}
/**
 * Generate documentation from schema
 */
export function generateSchemaDocumentation(schema, title) {
    let doc = `# ${title}\n\n`;
    for (const [key, property] of Object.entries(schema)) {
        doc += `## ${key}\n\n`;
        doc += `**Type:** ${property.type}\n`;
        doc += `**Required:** ${property.required ? 'Yes' : 'No'}\n`;
        if (property.default !== undefined) {
            doc += `**Default:** \`${JSON.stringify(property.default)}\`\n`;
        }
        if (property.description) {
            doc += `**Description:** ${property.description}\n`;
        }
        if (property.enum) {
            doc += `**Allowed Values:** ${property.enum.map(v => `\`${v}\``).join(', ')}\n`;
        }
        if (property.min !== undefined || property.max !== undefined) {
            doc += `**Range:** `;
            if (property.min !== undefined)
                doc += `min: ${property.min}`;
            if (property.min !== undefined && property.max !== undefined)
                doc += ', ';
            if (property.max !== undefined)
                doc += `max: ${property.max}`;
            doc += '\n';
        }
        doc += '\n';
    }
    return doc;
}
//# sourceMappingURL=validation.js.map