/**
 * Configuration Types for CREB-JS
 *
 * Defines all configuration interfaces and types used throughout the application.
 * This file serves as the single source of truth for configuration structure.
 */
/**
 * Type guard for CREBConfig
 */
export function isCREBConfig(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        'cache' in obj &&
        'performance' in obj &&
        'data' in obj &&
        'logging' in obj);
}
//# sourceMappingURL=types.js.map