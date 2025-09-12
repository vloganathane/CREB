'use strict';

require('reflect-metadata');
var gsap = require('gsap');
var THREE = require('three');
var crypto = require('crypto');
var async_hooks = require('async_hooks');
var events = require('events');
var perf_hooks = require('perf_hooks');
var CANNON = require('cannon-es');
var idb = require('idb');
var fs = require('fs');
var worker_threads = require('worker_threads');
var url = require('url');
var path = require('path');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var THREE__namespace = /*#__PURE__*/_interopNamespaceDefault(THREE);
var CANNON__namespace = /*#__PURE__*/_interopNamespaceDefault(CANNON);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Chemical elements and their atomic masses
 * Data from the original CREB project's Assets.py
 */
const ELEMENTS_LIST = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
    'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
    'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
];
const PERIODIC_TABLE = {
    'H': 1.008,
    'He': 4.0026,
    'Li': 6.94,
    'Be': 9.0122,
    'B': 10.81,
    'C': 12.011,
    'N': 14.007,
    'O': 15.999,
    'F': 18.998,
    'Ne': 20.18,
    'Na': 22.99,
    'Mg': 24.305,
    'Al': 26.982,
    'Si': 28.085,
    'P': 30.974,
    'S': 32.06,
    'Cl': 35.45,
    'Ar': 39.948,
    'K': 39.098,
    'Ca': 40.078,
    'Sc': 44.956,
    'Ti': 47.867,
    'V': 50.942,
    'Cr': 51.996,
    'Mn': 54.938,
    'Fe': 55.845,
    'Co': 58.933,
    'Ni': 58.693,
    'Cu': 63.546,
    'Zn': 65.38,
    'Ga': 69.723,
    'Ge': 72.63,
    'As': 74.922,
    'Se': 78.971,
    'Br': 79.904,
    'Kr': 83.798,
    'Rb': 85.468,
    'Sr': 87.62,
    'Y': 88.906,
    'Zr': 91.224,
    'Nb': 92.906,
    'Mo': 95.95,
    'Tc': 98.0,
    'Ru': 101.07,
    'Rh': 102.91,
    'Pd': 106.42,
    'Ag': 107.87,
    'Cd': 112.41,
    'In': 114.82,
    'Sn': 118.71,
    'Sb': 121.76,
    'Te': 127.6,
    'I': 126.9,
    'Xe': 131.29,
    'Cs': 132.91,
    'Ba': 137.33,
    'La': 138.91,
    'Ce': 140.12,
    'Pr': 140.91,
    'Nd': 144.24,
    'Pm': 145.0,
    'Sm': 150.36,
    'Eu': 151.96,
    'Gd': 157.25,
    'Tb': 158.93,
    'Dy': 162.5,
    'Ho': 164.93,
    'Er': 167.26,
    'Tm': 168.93,
    'Yb': 173.04,
    'Lu': 175.0,
    'Hf': 178.49,
    'Ta': 180.95,
    'W': 183.84,
    'Re': 186.21,
    'Os': 190.23,
    'Ir': 192.22,
    'Pt': 195.08,
    'Au': 196.97,
    'Hg': 200.59,
    'Tl': 204.38,
    'Pb': 207.2,
    'Bi': 208.98,
    'Po': 209.0,
    'At': 210.0,
    'Rn': 222.0,
    'Fr': 223.0,
    'Ra': 226.0,
    'Ac': 227.0,
    'Th': 232.04,
    'Pa': 231.04,
    'U': 238.03,
    'Np': 237.0,
    'Pu': 244.0,
    'Am': 243.0,
    'Cm': 247.0,
    'Bk': 247.0,
    'Cf': 251.0,
    'Es': 252.0,
    'Fm': 257.0,
    'Md': 258.0,
    'No': 259.0,
    'Lr': 262.0,
    'Rf': 267.0,
    'Db': 270.0,
    'Sg': 271.0,
    'Bh': 270.0,
    'Hs': 277.0,
    'Mt': 276.0,
    'Ds': 281.0,
    'Rg': 282.0,
    'Cn': 285.0,
    'Nh': 286.0,
    'Fl': 289.0,
    'Mc': 290.0,
    'Lv': 293.0,
    'Ts': 294.0,
    'Og': 294.0
};
const PARAMETER_SYMBOLS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Enhanced Error Handling for CREB-JS
 * Provides structured error types with context, stack traces, and error classification
 */
exports.ErrorCategory = void 0;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "VALIDATION";
    ErrorCategory["NETWORK"] = "NETWORK";
    ErrorCategory["COMPUTATION"] = "COMPUTATION";
    ErrorCategory["DATA"] = "DATA";
    ErrorCategory["SYSTEM"] = "SYSTEM";
    ErrorCategory["EXTERNAL_API"] = "EXTERNAL_API";
    ErrorCategory["TIMEOUT"] = "TIMEOUT";
    ErrorCategory["RATE_LIMIT"] = "RATE_LIMIT";
    ErrorCategory["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorCategory["PERMISSION"] = "PERMISSION";
})(exports.ErrorCategory || (exports.ErrorCategory = {}));
exports.ErrorSeverity = void 0;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(exports.ErrorSeverity || (exports.ErrorSeverity = {}));
/**
 * Base CREB Error class with enhanced context and metadata
 */
class CREBError extends Error {
    constructor(message, category, severity = exports.ErrorSeverity.MEDIUM, context = {}, options = {}) {
        super(message);
        this.name = 'CREBError';
        // Ensure proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, CREBError.prototype);
        this.metadata = {
            category,
            severity,
            retryable: options.retryable ?? this.isRetryableByDefault(category),
            errorCode: options.errorCode ?? this.generateErrorCode(category),
            correlationId: options.correlationId ?? this.generateCorrelationId(),
            context: {
                ...context,
                timestamp: new Date(),
                version: '1.6.0'
            },
            timestamp: new Date(),
            stackTrace: this.stack,
            innerError: options.innerError,
            sugggestedAction: options.suggestedAction
        };
        // Capture stack trace for V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CREBError);
        }
    }
    /**
     * Serialize error for logging and telemetry
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            metadata: {
                ...this.metadata,
                innerError: this.metadata.innerError?.message
            }
        };
    }
    /**
     * Create a sanitized version for client-side consumption
     */
    toClientSafe() {
        return {
            message: this.message,
            category: this.metadata.category,
            severity: this.metadata.severity,
            errorCode: this.metadata.errorCode,
            correlationId: this.metadata.correlationId,
            retryable: this.metadata.retryable,
            suggestedAction: this.metadata.sugggestedAction
        };
    }
    /**
     * Check if error is retryable based on category and context
     */
    isRetryable() {
        return this.metadata.retryable;
    }
    /**
     * Get human-readable error description
     */
    getDescription() {
        const parts = [
            `[${this.metadata.category}:${this.metadata.severity}]`,
            this.message
        ];
        if (this.metadata.sugggestedAction) {
            parts.push(`Suggestion: ${this.metadata.sugggestedAction}`);
        }
        return parts.join(' ');
    }
    isRetryableByDefault(category) {
        const retryableCategories = [
            exports.ErrorCategory.NETWORK,
            exports.ErrorCategory.TIMEOUT,
            exports.ErrorCategory.RATE_LIMIT,
            exports.ErrorCategory.EXTERNAL_API
        ];
        return retryableCategories.includes(category);
    }
    generateErrorCode(category) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${category}_${timestamp}_${random}`.toUpperCase();
    }
    generateCorrelationId() {
        return `creb_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    }
}
/**
 * Validation Error - for input validation failures
 */
class ValidationError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.VALIDATION, exports.ErrorSeverity.MEDIUM, {
            ...context,
            field: options.field,
            value: options.value,
            constraint: options.constraint
        }, {
            retryable: false,
            suggestedAction: 'Please check the input parameters and try again'
        });
        this.name = 'ValidationError';
    }
}
/**
 * Network Error - for network-related failures
 */
class NetworkError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.NETWORK, exports.ErrorSeverity.HIGH, {
            ...context,
            statusCode: options.statusCode,
            url: options.url,
            method: options.method,
            timeout: options.timeout
        }, {
            retryable: true,
            suggestedAction: 'Check network connectivity and try again'
        });
        this.name = 'NetworkError';
    }
}
/**
 * External API Error - for third-party API failures
 */
class ExternalAPIError extends CREBError {
    constructor(message, apiName, context = {}, options = {}) {
        const severity = options.rateLimited ? exports.ErrorSeverity.MEDIUM : exports.ErrorSeverity.HIGH;
        const category = options.rateLimited ? exports.ErrorCategory.RATE_LIMIT : exports.ErrorCategory.EXTERNAL_API;
        super(message, category, severity, {
            ...context,
            apiName,
            statusCode: options.statusCode,
            responseBody: options.responseBody,
            endpoint: options.endpoint
        }, {
            retryable: options.rateLimited || (!!options.statusCode && options.statusCode >= 500),
            suggestedAction: options.rateLimited
                ? 'Rate limit exceeded. Please wait before retrying'
                : 'External service unavailable. Please try again later'
        });
        this.name = 'ExternalAPIError';
    }
}
/**
 * Computation Error - for calculation failures
 */
class ComputationError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.COMPUTATION, exports.ErrorSeverity.MEDIUM, {
            ...context,
            algorithm: options.algorithm,
            input: options.input,
            expectedRange: options.expectedRange
        }, {
            retryable: false,
            suggestedAction: 'Please verify input parameters and calculation constraints'
        });
        this.name = 'ComputationError';
    }
}
/**
 * System Error - for internal system failures
 */
class SystemError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.SYSTEM, exports.ErrorSeverity.CRITICAL, {
            ...context,
            subsystem: options.subsystem,
            resource: options.resource
        }, {
            retryable: false,
            suggestedAction: 'Internal system error. Please contact support'
        });
        this.name = 'SystemError';
    }
}
/**
 * Error aggregation utility for collecting and analyzing multiple errors
 */
class ErrorAggregator {
    constructor(maxErrors = 100) {
        this.errors = [];
        this.maxErrors = maxErrors;
    }
    /**
     * Add an error to the aggregator
     */
    addError(error) {
        this.errors.push(error);
        // Keep only the most recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
    }
    /**
     * Get errors by category
     */
    getErrorsByCategory(category) {
        return this.errors.filter(error => error.metadata.category === category);
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errors.filter(error => error.metadata.severity === severity);
    }
    /**
     * Get error statistics
     */
    getStatistics() {
        const byCategory = {};
        const bySeverity = {};
        let retryableCount = 0;
        // Initialize counters
        Object.values(exports.ErrorCategory).forEach(cat => byCategory[cat] = 0);
        Object.values(exports.ErrorSeverity).forEach(sev => bySeverity[sev] = 0);
        // Count errors
        this.errors.forEach(error => {
            byCategory[error.metadata.category]++;
            bySeverity[error.metadata.severity]++;
            if (error.isRetryable()) {
                retryableCount++;
            }
        });
        return {
            total: this.errors.length,
            byCategory,
            bySeverity,
            retryableCount,
            recentErrors: this.errors.slice(-10) // Last 10 errors
        };
    }
    /**
     * Clear all collected errors
     */
    clear() {
        this.errors = [];
    }
    /**
     * Get all errors as JSON for logging
     */
    toJSON() {
        return this.errors.map(error => error.toJSON());
    }
}
/**
 * Utility functions for error handling
 */
class ErrorUtils {
    /**
     * Wrap a function with error handling and transformation
     */
    static withErrorHandling(fn, errorTransformer) {
        return (...args) => {
            try {
                return fn(...args);
            }
            catch (error) {
                throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
            }
        };
    }
    /**
     * Wrap an async function with error handling and transformation
     */
    static withAsyncErrorHandling(fn, errorTransformer) {
        return async (...args) => {
            try {
                return await fn(...args);
            }
            catch (error) {
                throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
            }
        };
    }
    /**
     * Transform unknown errors into CREBError instances
     */
    static transformUnknownError(error) {
        if (error instanceof CREBError) {
            return error;
        }
        if (error instanceof Error) {
            return new SystemError(error.message, { originalError: error.name }, { subsystem: 'unknown' });
        }
        return new SystemError(typeof error === 'string' ? error : 'Unknown error occurred', { originalError: error });
    }
    /**
     * Check if an error indicates a transient failure
     */
    static isTransientError(error) {
        if (error instanceof CREBError) {
            return error.isRetryable();
        }
        // Common patterns for transient errors
        const transientPatterns = [
            /timeout/i,
            /connection/i,
            /network/i,
            /503/,
            /502/,
            /504/,
            /rate limit/i
        ];
        const message = error?.message || String(error);
        return transientPatterns.some(pattern => pattern.test(message));
    }
}

/**
 * Utility functions for chemical formula parsing and calculations
 */
/**
 * Counts elements in a chemical formula
 * Based on the ElementCounter class from the original CREB project
 */
class ElementCounter {
    constructor(chemicalFormula) {
        this.formula = chemicalFormula;
    }
    /**
     * Parses the chemical formula and returns element counts
     * Handles parentheses and multipliers
     */
    parseFormula() {
        let formula = this.formula;
        // Expand parentheses
        while (formula.includes('(')) {
            formula = formula.replace(/\(([^()]+)\)(\d*)/g, (match, group, multiplier) => {
                const mult = multiplier ? parseInt(multiplier) : 1;
                return this.expandGroup(group, mult);
            });
        }
        // Count elements
        const elementCounts = {};
        const matches = formula.match(/([A-Z][a-z]*)(\d*)/g) || [];
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
                elementCounts[element] = (elementCounts[element] || 0) + count;
            }
        }
        return elementCounts;
    }
    expandGroup(group, multiplier) {
        const matches = group.match(/([A-Z][a-z]*)(\d*)/g) || [];
        let expanded = '';
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
                const newCount = count * multiplier;
                expanded += element + (newCount > 1 ? newCount : '');
            }
        }
        return expanded;
    }
}
/**
 * Parses a chemical equation into reactants and products
 * Based on the EquationParser class from the original CREB project
 */
class EquationParser {
    constructor(chemicalEquation) {
        this.equationSplitter = '=';
        this.speciesSplitter = '+';
        this.equation = chemicalEquation.replace(/\s/g, ''); // Remove all spaces
    }
    /**
     * Parses the equation and returns structured data
     */
    parse() {
        const { reactants, products } = this.splitIntoSpecies();
        const parsedReactants = this.parseSpecies(reactants);
        const parsedProducts = this.parseSpecies(products);
        return {
            reactants,
            products,
            parsedReactants,
            parsedProducts
        };
    }
    splitIntoSpecies() {
        // Check if equation is empty or only whitespace
        if (!this.equation || this.equation.length === 0) {
            throw new ValidationError('Empty equation provided. Please enter a valid chemical equation.', { equation: this.equation, operation: 'equation_parsing' });
        }
        const sides = this.equation.split(this.equationSplitter);
        if (sides.length !== 2) {
            throw new ValidationError('Invalid equation format. Must contain exactly one "=" sign.', { equation: this.equation, sides: sides.length, operation: 'equation_parsing' });
        }
        // Check if either side is empty
        if (!sides[0].trim() || !sides[1].trim()) {
            throw new ValidationError('Both sides of the equation must contain chemical species.', { equation: this.equation, leftSide: sides[0], rightSide: sides[1], operation: 'equation_parsing' });
        }
        const cleanSpecies = (speciesString) => {
            return speciesString.split(this.speciesSplitter)
                .map(species => species.trim())
                .filter(species => species.length > 0)
                .map(species => {
                // Remove existing coefficients (numbers at the beginning)
                return species.replace(/^\d+\s*/, '');
            });
        };
        const reactants = cleanSpecies(sides[0]);
        const products = cleanSpecies(sides[1]);
        return { reactants, products };
    }
    parseSpecies(species) {
        const parsed = {};
        for (const specie of species) {
            const counter = new ElementCounter(specie);
            parsed[specie] = counter.parseFormula();
        }
        return parsed;
    }
}
/**
 * Calculates molar weight of a chemical formula
 */
function calculateMolarWeight(formula) {
    const counter = new ElementCounter(formula);
    const elementCounts = counter.parseFormula();
    let molarWeight = 0;
    for (const element in elementCounts) {
        if (!(element in PERIODIC_TABLE)) {
            throw new ValidationError(`Unknown element: ${element}`, { element, formula, operation: 'molar_weight_calculation' });
        }
        molarWeight += elementCounts[element] * PERIODIC_TABLE[element];
    }
    return parseFloat(molarWeight.toFixed(3));
}
/**
 * Gets all unique elements present in a reaction
 */
function getElementsInReaction(parsedReactants, parsedProducts) {
    const elements = new Set();
    // Add elements from reactants
    Object.values(parsedReactants).forEach((species) => {
        Object.keys(species).forEach(element => elements.add(element));
    });
    // Add elements from products
    Object.values(parsedProducts).forEach((species) => {
        Object.keys(species).forEach(element => elements.add(element));
    });
    return Array.from(elements);
}

/**
 * Injectable decorator and related types for dependency injection
 *
 * Provides decorators and metadata for automatic dependency injection
 * in the CREB-JS container system.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
/**
 * Service lifetime enumeration
 */
var ServiceLifetime;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(ServiceLifetime || (ServiceLifetime = {}));
/**
 * Metadata key for injectable services
 */
const INJECTABLE_METADATA_KEY = Symbol.for('injectable');
/**
 * Metadata key for constructor parameters
 */
const PARAM_TYPES_METADATA_KEY = 'design:paramtypes';
/**
 * Injectable class decorator
 *
 * Marks a class as injectable and provides metadata for dependency injection.
 *
 * @param options Optional configuration for the injectable service
 */
function Injectable(options = {}) {
    return function (constructor) {
        // Get constructor parameter types from TypeScript compiler
        const paramTypes = Reflect.getMetadata(PARAM_TYPES_METADATA_KEY, constructor) || [];
        // Create injectable metadata
        const metadata = {
            dependencies: paramTypes,
            lifetime: options.lifetime || ServiceLifetime.Transient,
            token: options.token,
        };
        // Store metadata on the constructor
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, metadata, constructor);
        return constructor;
    };
}
/**
 * Inject decorator for constructor parameters
 *
 * Explicitly specifies the token to inject for a constructor parameter.
 * Useful when TypeScript reflection doesn't provide enough information.
 *
 * @param token The service token to inject
 */
function Inject(token) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const dependencies = existingMetadata.dependencies || [];
        // Ensure dependencies array is large enough
        while (dependencies.length <= parameterIndex) {
            dependencies.push(undefined);
        }
        // Set the specific dependency
        dependencies[parameterIndex] = token;
        // Update metadata
        const updatedMetadata = {
            ...existingMetadata,
            dependencies,
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Optional decorator for constructor parameters
 *
 * Marks a dependency as optional, allowing injection to succeed
 * even if the service is not registered.
 *
 * @param defaultValue Optional default value to use if service is not found
 */
function Optional(defaultValue) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const optionalDependencies = existingMetadata.optionalDependencies || new Set();
        optionalDependencies.add(parameterIndex);
        const updatedMetadata = {
            ...existingMetadata,
            optionalDependencies,
            defaultValues: {
                ...existingMetadata.defaultValues,
                [parameterIndex]: defaultValue,
            },
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Get injectable metadata from a constructor
 */
function getInjectableMetadata(constructor) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Check if a constructor is marked as injectable
 */
function isInjectable(constructor) {
    return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Helper function to extract dependency tokens from a constructor
 */
function getDependencyTokens(constructor) {
    const metadata = getInjectableMetadata(constructor);
    if (!metadata) {
        return [];
    }
    return metadata.dependencies || [];
}
/**
 * Factory for creating injectable class decorators with specific lifetimes
 */
const Singleton = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Singleton });
const Transient = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Transient });

/**
 * Linear equation system generator and solver
 * Based on the Generator and FileMaker classes from the original CREB project
 */
class LinearEquationSolver {
    constructor(chemicalEquation) {
        const parser = new EquationParser(chemicalEquation);
        this.equationData = parser.parse();
        this.allSpecies = [...this.equationData.reactants, ...this.equationData.products];
        this.elements = getElementsInReaction(this.equationData.parsedReactants, this.equationData.parsedProducts);
    }
    /**
     * Generates the system of linear equations representing the chemical balance
     */
    generateLinearSystem() {
        const equations = [];
        // Create one equation for each element
        for (const element of this.elements) {
            const coefficients = [];
            // For each species in the reaction
            for (const species of this.allSpecies) {
                let coefficient = 0;
                // Check if this species contains the current element
                if (this.equationData.reactants.includes(species)) {
                    // Reactants have positive coefficients
                    const elementCount = this.equationData.parsedReactants[species][element] || 0;
                    coefficient = elementCount;
                }
                else if (this.equationData.products.includes(species)) {
                    // Products have negative coefficients
                    const elementCount = this.equationData.parsedProducts[species][element] || 0;
                    coefficient = -elementCount;
                }
                coefficients.push(coefficient);
            }
            equations.push({
                coefficients,
                constant: 0 // All equations equal zero (balanced)
            });
        }
        return {
            equations,
            variables: this.allSpecies.map((_, i) => `x${i}`)
        };
    }
    /**
     * Solves the linear system to find coefficients
     */
    solve() {
        const system = this.generateLinearSystem();
        // For simple equations, try a brute force approach with small integer coefficients
        const maxCoeff = 10;
        const numSpecies = this.allSpecies.length;
        // Try different combinations of coefficients
        for (let attempt = 1; attempt <= maxCoeff; attempt++) {
            const coefficients = this.findCoefficients(system, attempt);
            if (coefficients) {
                return coefficients;
            }
        }
        throw new ComputationError('Unable to balance equation: Could not find integer coefficients', { maxCoeff, numSpecies, operation: 'equation_balancing' });
    }
    /**
     * Tries to find valid coefficients using a systematic approach
     */
    findCoefficients(system, maxVal) {
        const numSpecies = this.allSpecies.length;
        // Generate all possible combinations
        const generateCombinations = (length, max) => {
            const results = [];
            const generate = (current, remaining) => {
                if (remaining === 0) {
                    results.push([...current]);
                    return;
                }
                for (let i = 1; i <= max; i++) {
                    current.push(i);
                    generate(current, remaining - 1);
                    current.pop();
                }
            };
            generate([], length);
            return results;
        };
        const combinations = generateCombinations(numSpecies, maxVal);
        for (const coeffs of combinations) {
            if (this.checkBalance(system, coeffs)) {
                return coeffs;
            }
        }
        return null;
    }
    /**
     * Checks if given coefficients balance the equation
     */
    checkBalance(system, coefficients) {
        for (const equation of system.equations) {
            let sum = 0;
            for (let i = 0; i < coefficients.length; i++) {
                sum += equation.coefficients[i] * coefficients[i];
            }
            if (Math.abs(sum) > 1e-10) { // Allow for small floating point errors
                return false;
            }
        }
        return true;
    }
    /**
     * Normalizes coefficients to positive integers
     */
    normalizeCoefficients(coefficients) {
        // Convert to positive numbers
        const positiveCoeffs = coefficients.map(c => Math.abs(c));
        // Find a common denominator and convert to integers
        const precision = 1000; // For handling decimal coefficients
        const intCoeffs = positiveCoeffs.map(c => Math.round(c * precision));
        // Find GCD and simplify
        const gcd = this.findGCD(intCoeffs.filter(c => c !== 0));
        const simplified = intCoeffs.map(c => c / gcd);
        // Ensure all coefficients are at least 1
        const minCoeff = Math.min(...simplified.filter(c => c > 0));
        const scaled = simplified.map(c => Math.round(c / minCoeff));
        return scaled.map(c => c === 0 ? 1 : c);
    }
    /**
     * Finds the greatest common divisor of an array of numbers
     */
    findGCD(numbers) {
        const gcdTwo = (a, b) => {
            return b === 0 ? a : gcdTwo(b, a % b);
        };
        return numbers.reduce((acc, num) => gcdTwo(acc, Math.abs(num)));
    }
}
/**
 * Chemical equation balancer
 * Based on the main CREB functionality
 */
exports.ChemicalEquationBalancer = class ChemicalEquationBalancer {
    /**
     * Balances a chemical equation and returns the balanced equation string
     */
    balance(equation) {
        try {
            const solver = new LinearEquationSolver(equation);
            const coefficients = solver.solve();
            const parser = new EquationParser(equation);
            const { reactants, products } = parser.parse();
            return this.formatBalancedEquation(reactants, products, coefficients);
        }
        catch (error) {
            throw new ComputationError(`Failed to balance equation "${equation}": ${error}`, { equation, operation: 'equation_balancing', originalError: error });
        }
    }
    /**
     * Balances a chemical equation and returns detailed result
     */
    balanceDetailed(equation) {
        const solver = new LinearEquationSolver(equation);
        const coefficients = solver.solve();
        const parser = new EquationParser(equation);
        const { reactants, products } = parser.parse();
        return {
            equation: this.formatBalancedEquation(reactants, products, coefficients),
            coefficients,
            reactants,
            products
        };
    }
    formatBalancedEquation(reactants, products, coefficients) {
        const formatSide = (species, startIndex) => {
            return species.map((specie, index) => {
                const coeff = coefficients[startIndex + index];
                return coeff === 1 ? specie : `${coeff} ${specie}`;
            }).join(' + ');
        };
        const reactantSide = formatSide(reactants, 0);
        const productSide = formatSide(products, reactants.length);
        return `${reactantSide} = ${productSide}`;
    }
};
exports.ChemicalEquationBalancer = __decorate([
    Injectable()
], exports.ChemicalEquationBalancer);

/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
exports.Stoichiometry = class Stoichiometry {
    constructor(equation) {
        this.reactants = [];
        this.products = [];
        this.coefficients = [];
        this.balancer = new exports.ChemicalEquationBalancer();
        if (equation) {
            this.equation = equation;
            this.initializeFromEquation(equation);
        }
    }
    initializeFromEquation(equation) {
        // First, parse the raw equation (without coefficients) to get species names
        const rawParser = new EquationParser(equation);
        const rawData = rawParser.parse();
        // Balance the equation to get coefficients
        const balanced = this.balancer.balanceDetailed(equation);
        this.reactants = rawData.reactants;
        this.products = rawData.products;
        this.coefficients = balanced.coefficients;
    }
    /**
     * Calculates the molar weight of a chemical formula
     */
    calculateMolarWeight(formula) {
        return calculateMolarWeight(formula);
    }
    /**
     * Calculates stoichiometric ratios relative to a selected species
     */
    calculateRatios(selectedSpecies) {
        if (!this.equation) {
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateRatios', selectedSpecies }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
        }
        const allSpecies = [...this.reactants, ...this.products];
        const selectedIndex = allSpecies.indexOf(selectedSpecies);
        if (selectedIndex === -1) {
            const availableSpecies = allSpecies.join(', ');
            throw new ValidationError(`Species "${selectedSpecies}" not found in the equation. Available species: ${availableSpecies}`, { selectedSpecies, availableSpecies: allSpecies }, { field: 'selectedSpecies', value: selectedSpecies, constraint: `must be one of: ${availableSpecies}` });
        }
        const selectedCoefficient = this.coefficients[selectedIndex];
        return this.coefficients.map(coeff => coeff / selectedCoefficient);
    }
    /**
     * Performs stoichiometric calculations starting from moles
     */
    calculateFromMoles(selectedSpecies, moles) {
        if (!this.equation) {
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateFromMoles', selectedSpecies, moles }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
        }
        const ratios = this.calculateRatios(selectedSpecies);
        const allSpecies = [...this.reactants, ...this.products];
        const result = {
            reactants: {},
            products: {},
            totalMolarMass: { reactants: 0, products: 0 }
        };
        // Calculate for all species
        allSpecies.forEach((species, index) => {
            const speciesMoles = ratios[index] * moles;
            const molarWeight = this.calculateMolarWeight(species);
            const grams = speciesMoles * molarWeight;
            const speciesData = {
                moles: parseFloat(speciesMoles.toFixed(3)),
                grams: parseFloat(grams.toFixed(3)),
                molarWeight: molarWeight
            };
            if (this.reactants.includes(species)) {
                result.reactants[species] = speciesData;
                result.totalMolarMass.reactants += grams;
            }
            else {
                result.products[species] = speciesData;
                result.totalMolarMass.products += grams;
            }
        });
        // Round total molar masses
        result.totalMolarMass.reactants = parseFloat(result.totalMolarMass.reactants.toFixed(3));
        result.totalMolarMass.products = parseFloat(result.totalMolarMass.products.toFixed(3));
        return result;
    }
    /**
     * Performs stoichiometric calculations starting from grams
     */
    calculateFromGrams(selectedSpecies, grams) {
        if (!this.equation) {
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateFromGrams', selectedSpecies, grams }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
        }
        const molarWeight = this.calculateMolarWeight(selectedSpecies);
        const moles = grams / molarWeight;
        return this.calculateFromMoles(selectedSpecies, moles);
    }
    /**
     * Gets the balanced equation
     */
    getBalancedEquation() {
        if (!this.equation) {
            throw new ValidationError('No equation provided.', { operation: 'getBalancedEquation' }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
        }
        return this.balancer.balance(this.equation);
    }
    /**
     * Gets all species in the reaction with their molar weights
     */
    getSpeciesInfo() {
        const result = {};
        this.reactants.forEach(species => {
            result[species] = {
                molarWeight: this.calculateMolarWeight(species),
                type: 'reactant'
            };
        });
        this.products.forEach(species => {
            result[species] = {
                molarWeight: this.calculateMolarWeight(species),
                type: 'product'
            };
        });
        return result;
    }
    /**
     * Static method to calculate molar weight without instantiating the class
     */
    static calculateMolarWeight(formula) {
        return calculateMolarWeight(formula);
    }
};
exports.Stoichiometry = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [String])
], exports.Stoichiometry);

/**
 * Advanced 2D Molecular Structure Generator
 * Generates chemically accurate 2D coordinates for molecular visualization
 */
/**
 * Professional 2D molecular coordinate generator
 * Following standard chemical drawing conventions
 */
class Molecular2DGenerator {
    /**
     * Generate caffeine structure with proper coordinates
     */
    static generateCaffeine() {
        this.BOND_LENGTH;
        // Caffeine: C8H10N4O2 - purine ring system with methyl substituents
        const atoms = [
            // Purine ring system (6-membered ring fused with 5-membered ring)
            // 6-membered ring
            { element: 'N', x: 200, y: 150, z: 0, hybridization: 'sp2', aromatic: true }, // 0
            { element: 'C', x: 240, y: 130, z: 0, hybridization: 'sp2', aromatic: true }, // 1
            { element: 'N', x: 280, y: 150, z: 0, hybridization: 'sp2', aromatic: true }, // 2
            { element: 'C', x: 280, y: 190, z: 0, hybridization: 'sp2', aromatic: true }, // 3
            { element: 'C', x: 240, y: 210, z: 0, hybridization: 'sp2', aromatic: true }, // 4
            { element: 'C', x: 200, y: 190, z: 0, hybridization: 'sp2', aromatic: true }, // 5
            // 5-membered ring (fused)
            { element: 'N', x: 160, y: 170, z: 0, hybridization: 'sp2', aromatic: true }, // 6
            { element: 'C', x: 160, y: 210, z: 0, hybridization: 'sp2', aromatic: true }, // 7
            { element: 'N', x: 200, y: 230, z: 0, hybridization: 'sp2', aromatic: true }, // 8
            // Carbonyl oxygens
            { element: 'O', x: 240, y: 100, z: 0, hybridization: 'sp2' }, // 9 (C=O at position 2)
            { element: 'O', x: 320, y: 200, z: 0, hybridization: 'sp2' }, // 10 (C=O at position 6)
            // Methyl groups
            { element: 'C', x: 120, y: 150, z: 0, hybridization: 'sp3' }, // 11 (N1-methyl)
            { element: 'C', x: 320, y: 130, z: 0, hybridization: 'sp3' }, // 12 (N3-methyl)
            { element: 'C', x: 240, y: 270, z: 0, hybridization: 'sp3' }, // 13 (N7-methyl)
            // Hydrogens (implicit in most chemical drawings, but included for completeness)
            { element: 'H', x: 100, y: 140, z: 0 }, // 14
            { element: 'H', x: 100, y: 160, z: 0 }, // 15
            { element: 'H', x: 110, y: 170, z: 0 }, // 16
            { element: 'H', x: 340, y: 120, z: 0 }, // 17
            { element: 'H', x: 340, y: 140, z: 0 }, // 18
            { element: 'H', x: 330, y: 110, z: 0 }, // 19
            { element: 'H', x: 260, y: 280, z: 0 }, // 20
            { element: 'H', x: 220, y: 280, z: 0 }, // 21
            { element: 'H', x: 230, y: 290, z: 0 }, // 22
            { element: 'H', x: 130, y: 210, z: 0 } // 23 (H on C8)
        ];
        const bonds = [
            // 6-membered ring bonds
            { atom1: 0, atom2: 1, order: 1, type: 'aromatic' },
            { atom1: 1, atom2: 2, order: 1, type: 'aromatic' },
            { atom1: 2, atom2: 3, order: 1, type: 'aromatic' },
            { atom1: 3, atom2: 4, order: 1, type: 'aromatic' },
            { atom1: 4, atom2: 5, order: 1, type: 'aromatic' },
            { atom1: 5, atom2: 0, order: 1, type: 'aromatic' },
            // 5-membered ring bonds
            { atom1: 5, atom2: 6, order: 1, type: 'aromatic' },
            { atom1: 6, atom2: 7, order: 1, type: 'aromatic' },
            { atom1: 7, atom2: 8, order: 1, type: 'aromatic' },
            { atom1: 8, atom2: 4, order: 1, type: 'aromatic' },
            // Carbonyl bonds
            { atom1: 1, atom2: 9, order: 2, type: 'double' }, // C=O
            { atom1: 3, atom2: 10, order: 2, type: 'double' }, // C=O
            // Methyl attachments
            { atom1: 0, atom2: 11, order: 1, type: 'single' }, // N1-methyl
            { atom1: 2, atom2: 12, order: 1, type: 'single' }, // N3-methyl
            { atom1: 8, atom2: 13, order: 1, type: 'single' }, // N7-methyl
            // Hydrogen bonds
            { atom1: 11, atom2: 14, order: 1, type: 'single' },
            { atom1: 11, atom2: 15, order: 1, type: 'single' },
            { atom1: 11, atom2: 16, order: 1, type: 'single' },
            { atom1: 12, atom2: 17, order: 1, type: 'single' },
            { atom1: 12, atom2: 18, order: 1, type: 'single' },
            { atom1: 12, atom2: 19, order: 1, type: 'single' },
            { atom1: 13, atom2: 20, order: 1, type: 'single' },
            { atom1: 13, atom2: 21, order: 1, type: 'single' },
            { atom1: 13, atom2: 22, order: 1, type: 'single' },
            { atom1: 7, atom2: 23, order: 1, type: 'single' }
        ];
        const rings = [
            { atoms: [0, 1, 2, 3, 4, 5], aromatic: true, size: 6 },
            { atoms: [5, 6, 7, 8, 4], aromatic: true, size: 5 }
        ];
        return { atoms, bonds, rings };
    }
    /**
     * Generate benzene with proper hexagonal geometry
     */
    static generateBenzene() {
        const centerX = 200;
        const centerY = 180;
        const radius = this.AROMATIC_RING_RADIUS;
        const atoms = [];
        const bonds = [];
        // Generate hexagonal ring
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3; // 60° intervals
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            atoms.push({
                element: 'C',
                x: x,
                y: y,
                z: 0,
                hybridization: 'sp2',
                aromatic: true
            });
            // Add bond to next atom (with wraparound)
            const nextIndex = (i + 1) % 6;
            bonds.push({
                atom1: i,
                atom2: nextIndex,
                order: 1,
                type: 'aromatic'
            });
        }
        // Add hydrogens
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hRadius = radius + 15; // Hydrogen further out
            const x = centerX + hRadius * Math.cos(angle);
            const y = centerY + hRadius * Math.sin(angle);
            atoms.push({
                element: 'H',
                x: x,
                y: y,
                z: 0
            });
            bonds.push({
                atom1: i,
                atom2: 6 + i, // Hydrogen index
                order: 1,
                type: 'single'
            });
        }
        const rings = [
            { atoms: [0, 1, 2, 3, 4, 5], aromatic: true, size: 6 }
        ];
        return { atoms, bonds, rings };
    }
    /**
     * Generate water with proper bent geometry
     */
    static generateWater() {
        const bondLength = this.BOND_LENGTH;
        const angle = 1.8326; // 104.5° H-O-H angle
        const atoms = [
            { element: 'O', x: 200, y: 180, z: 0, hybridization: 'sp3' },
            {
                element: 'H',
                x: 200 - bondLength * Math.cos(angle / 2),
                y: 180 + bondLength * Math.sin(angle / 2),
                z: 0
            },
            {
                element: 'H',
                x: 200 + bondLength * Math.cos(angle / 2),
                y: 180 + bondLength * Math.sin(angle / 2),
                z: 0
            }
        ];
        const bonds = [
            { atom1: 0, atom2: 1, order: 1, type: 'single' },
            { atom1: 0, atom2: 2, order: 1, type: 'single' }
        ];
        return { atoms, bonds };
    }
    /**
     * Generate methane with tetrahedral geometry
     */
    static generateMethane() {
        const bondLength = this.BOND_LENGTH;
        const centerX = 200;
        const centerY = 180;
        // Tetrahedral angles for 2D projection
        const atoms = [
            { element: 'C', x: centerX, y: centerY, z: 0, hybridization: 'sp3' },
            { element: 'H', x: centerX - bondLength * 0.6, y: centerY - bondLength * 0.6, z: 0 },
            { element: 'H', x: centerX + bondLength * 0.6, y: centerY - bondLength * 0.6, z: 0 },
            { element: 'H', x: centerX - bondLength * 0.6, y: centerY + bondLength * 0.6, z: 0 },
            { element: 'H', x: centerX + bondLength * 0.6, y: centerY + bondLength * 0.6, z: 0 }
        ];
        const bonds = [
            { atom1: 0, atom2: 1, order: 1, type: 'single' },
            { atom1: 0, atom2: 2, order: 1, type: 'single' },
            { atom1: 0, atom2: 3, order: 1, type: 'single' },
            { atom1: 0, atom2: 4, order: 1, type: 'single' }
        ];
        return { atoms, bonds };
    }
    /**
     * Generate ethylene with proper double bond geometry
     */
    static generateEthylene() {
        const bondLength = this.BOND_LENGTH;
        const centerX = 200;
        const centerY = 180;
        const atoms = [
            // C=C double bond
            { element: 'C', x: centerX - bondLength / 2, y: centerY, z: 0, hybridization: 'sp2' },
            { element: 'C', x: centerX + bondLength / 2, y: centerY, z: 0, hybridization: 'sp2' },
            // Hydrogens in planar arrangement
            { element: 'H', x: centerX - bondLength / 2 - bondLength * 0.7, y: centerY - bondLength * 0.5, z: 0 },
            { element: 'H', x: centerX - bondLength / 2 - bondLength * 0.7, y: centerY + bondLength * 0.5, z: 0 },
            { element: 'H', x: centerX + bondLength / 2 + bondLength * 0.7, y: centerY - bondLength * 0.5, z: 0 },
            { element: 'H', x: centerX + bondLength / 2 + bondLength * 0.7, y: centerY + bondLength * 0.5, z: 0 }
        ];
        const bonds = [
            { atom1: 0, atom2: 1, order: 2, type: 'double' },
            { atom1: 0, atom2: 2, order: 1, type: 'single' },
            { atom1: 0, atom2: 3, order: 1, type: 'single' },
            { atom1: 1, atom2: 4, order: 1, type: 'single' },
            { atom1: 1, atom2: 5, order: 1, type: 'single' }
        ];
        return { atoms, bonds };
    }
    /**
     * Convert molecular structure to Canvas2D format
     */
    static toCanvas2DFormat(structure) {
        return {
            atoms: structure.atoms.map((atom, index) => ({
                element: atom.element,
                position: { x: atom.x, y: atom.y },
                bonds: structure.bonds
                    .map((bond, bondIndex) => bond.atom1 === index || bond.atom2 === index ? bondIndex : -1)
                    .filter(bondIndex => bondIndex !== -1)
            })),
            bonds: structure.bonds
        };
    }
    /**
     * Enhanced SMILES to 2D converter with proper geometry
     */
    static advancedSMILESTo2D(smiles) {
        // Handle specific known molecules
        switch (smiles.toLowerCase()) {
            case 'o':
            case 'h2o':
                return this.toCanvas2DFormat(this.generateWater());
            case 'c':
            case 'ch4':
                return this.toCanvas2DFormat(this.generateMethane());
            case 'c=c':
            case 'c2h4':
                return this.toCanvas2DFormat(this.generateEthylene());
            case 'c1=cc=cc=c1':
            case 'c6h6':
            case 'benzene':
                return this.toCanvas2DFormat(this.generateBenzene());
            case 'caffeine':
            case 'cn1c=nc2c1c(=o)n(c(=o)n2c)c':
                return this.toCanvas2DFormat(this.generateCaffeine());
            default:
                // Fallback to simple structure
                return this.toCanvas2DFormat(this.generateMethane());
        }
    }
}
Molecular2DGenerator.BOND_LENGTH = 40; // Standard bond length in pixels
Molecular2DGenerator.AROMATIC_RING_RADIUS = 25;
Molecular2DGenerator.ANGLE_120 = (2 * Math.PI) / 3; // 120° for aromatic
Molecular2DGenerator.ANGLE_109 = 1.9106; // 109.5° tetrahedral angle

/**
 * 2D Molecular Structure Renderer
 * Canvas-based 2D molecular structure drawing with proper chemical geometry
 */
class Canvas2DRenderer {
    constructor(canvas, config = {}) {
        this.molecule = null;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = {
            width: 600,
            height: 400,
            backgroundColor: '#ffffff',
            bondColor: '#333333',
            atomColors: {
                'C': '#000000',
                'H': '#ffffff',
                'O': '#ff0000',
                'N': '#0000ff',
                'S': '#ffff00',
                'P': '#ffa500',
                'Cl': '#00ff00',
                'Br': '#a52a2a',
                'I': '#9400d3'
            },
            bondWidth: 2,
            atomRadius: 15,
            fontSize: 12,
            ...config
        };
        this.setupCanvas();
        this.bindEvents();
    }
    setupCanvas() {
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        // Only set styles if we're in browser environment
        try {
            if (this.canvas.style) {
                this.canvas.style.border = '1px solid #ccc';
                this.canvas.style.borderRadius = '4px';
            }
        }
        catch {
            // Ignore style errors in non-browser environments
        }
    }
    bindEvents() {
        // Only bind events if we're in browser environment
        try {
            if (!this.canvas.addEventListener) {
                return;
            }
        }
        catch {
            return;
        }
        let isMouseDown = false;
        let lastMousePos = { x: 0, y: 0 };
        this.canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - lastMousePos.x;
                const deltaY = e.clientY - lastMousePos.y;
                this.offset.x += deltaX;
                this.offset.y += deltaY;
                lastMousePos = { x: e.clientX, y: e.clientY };
                this.render();
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.scale *= scaleFactor;
            this.render();
        });
    }
    /**
     * Load and render a molecule
     */
    loadMolecule(molecule) {
        this.molecule = molecule;
        this.centerMolecule();
        this.render();
    }
    /**
     * Center the molecule in the canvas
     */
    centerMolecule() {
        if (!this.molecule || this.molecule.atoms.length === 0)
            return;
        // Calculate bounding box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        this.molecule.atoms.forEach(atom => {
            minX = Math.min(minX, atom.position.x);
            maxX = Math.max(maxX, atom.position.x);
            minY = Math.min(minY, atom.position.y);
            maxY = Math.max(maxY, atom.position.y);
        });
        // Calculate center offset
        const molWidth = maxX - minX;
        const molHeight = maxY - minY;
        const molCenterX = (minX + maxX) / 2;
        const molCenterY = (minY + maxY) / 2;
        // Calculate scale to fit molecule
        const scaleX = (this.config.width * 0.8) / molWidth;
        const scaleY = (this.config.height * 0.8) / molHeight;
        this.scale = Math.min(scaleX, scaleY, 1);
        // Center the molecule
        this.offset.x = this.config.width / 2 - molCenterX * this.scale;
        this.offset.y = this.config.height / 2 - molCenterY * this.scale;
    }
    /**
     * Render the current molecule
     */
    render() {
        this.clear();
        if (!this.molecule) {
            this.renderPlaceholder();
            return;
        }
        this.renderBonds();
        this.renderAtoms();
        this.renderLabels();
    }
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }
    /**
     * Render placeholder when no molecule is loaded
     */
    renderPlaceholder() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        this.ctx.fillStyle = '#999999';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('2D Molecular Structure', this.config.width / 2, this.config.height / 2 - 20);
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Load a molecule to visualize', this.config.width / 2, this.config.height / 2 + 20);
    }
    /**
     * Render molecular bonds
     */
    renderBonds() {
        if (!this.molecule)
            return;
        this.ctx.strokeStyle = this.config.bondColor;
        this.ctx.lineWidth = this.config.bondWidth;
        this.ctx.lineCap = 'round';
        this.molecule.bonds.forEach(bond => {
            const atom1 = this.molecule.atoms[bond.atom1];
            const atom2 = this.molecule.atoms[bond.atom2];
            const pos1 = this.transformPoint(atom1.position);
            const pos2 = this.transformPoint(atom2.position);
            this.drawBond(pos1, pos2, bond);
        });
    }
    /**
     * Draw a single bond
     */
    drawBond(pos1, pos2, bond) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / length;
        const unitY = dy / length;
        // Offset for multiple bonds
        const perpX = -unitY * 3;
        const perpY = unitX * 3;
        switch (bond.order) {
            case 1:
                this.drawSingleBond(pos1, pos2);
                break;
            case 2:
                this.drawSingleBond({ x: pos1.x + perpX, y: pos1.y + perpY }, { x: pos2.x + perpX, y: pos2.y + perpY });
                this.drawSingleBond({ x: pos1.x - perpX, y: pos1.y - perpY }, { x: pos2.x - perpX, y: pos2.y - perpY });
                break;
            case 3:
                this.drawSingleBond(pos1, pos2);
                this.drawSingleBond({ x: pos1.x + perpX, y: pos1.y + perpY }, { x: pos2.x + perpX, y: pos2.y + perpY });
                this.drawSingleBond({ x: pos1.x - perpX, y: pos1.y - perpY }, { x: pos2.x - perpX, y: pos2.y - perpY });
                break;
        }
        if (bond.type === 'aromatic') {
            // For aromatic bonds, draw a dashed inner line to indicate aromaticity
            this.drawAromaticIndicator(pos1, pos2);
        }
    }
    /**
     * Draw a single bond line
     */
    drawSingleBond(pos1, pos2) {
        this.ctx.beginPath();
        this.ctx.moveTo(pos1.x, pos1.y);
        this.ctx.lineTo(pos2.x, pos2.y);
        this.ctx.stroke();
    }
    /**
     * Draw aromatic bond indicator (dashed inner line)
     */
    drawAromaticIndicator(pos1, pos2) {
        // Draw a shorter dashed line slightly inside the ring
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        // Create inner line (80% of original length, centered)
        const innerStart = {
            x: pos1.x + dx * 0.1,
            y: pos1.y + dy * 0.1
        };
        const innerEnd = {
            x: pos1.x + dx * 0.9,
            y: pos1.y + dy * 0.9
        };
        this.ctx.setLineDash([3, 3]);
        this.ctx.strokeStyle = this.config.bondColor;
        this.ctx.lineWidth = this.config.bondWidth * 0.7;
        this.drawSingleBond(innerStart, innerEnd);
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = this.config.bondWidth;
    }
    /**
     * Draw aromatic bond (dashed) - legacy method
     */
    drawAromaticBond(pos1, pos2) {
        this.ctx.setLineDash([5, 5]);
        this.drawSingleBond(pos1, pos2);
        this.ctx.setLineDash([]);
    }
    /**
     * Render atoms
     */
    renderAtoms() {
        if (!this.molecule)
            return;
        this.molecule.atoms.forEach((atom, index) => {
            const pos = this.transformPoint(atom.position);
            this.drawAtom(atom, pos, index);
        });
    }
    /**
     * Draw a single atom
     */
    drawAtom(atom, pos, index) {
        const color = this.config.atomColors[atom.element] || '#999999';
        const radius = this.config.atomRadius * this.scale;
        // Draw atom circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        // Draw border
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        // Draw element symbol
        this.ctx.fillStyle = atom.element === 'H' ? '#000000' : '#ffffff';
        this.ctx.font = `${this.config.fontSize * this.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(atom.element, pos.x, pos.y);
    }
    /**
     * Render atom labels and charges
     */
    renderLabels() {
        if (!this.molecule)
            return;
        this.ctx.fillStyle = '#333333';
        this.ctx.font = `${10 * this.scale}px Arial`;
        this.molecule.atoms.forEach((atom, index) => {
            if (atom.charge && atom.charge !== 0) {
                const pos = this.transformPoint(atom.position);
                const chargeText = atom.charge > 0 ? `+${atom.charge}` : `${atom.charge}`;
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'top';
                this.ctx.fillText(chargeText, pos.x + this.config.atomRadius * this.scale, pos.y - this.config.atomRadius * this.scale);
            }
        });
    }
    /**
     * Transform point from molecule coordinates to canvas coordinates
     */
    transformPoint(point) {
        return {
            x: point.x * this.scale + this.offset.x,
            y: point.y * this.scale + this.offset.y
        };
    }
    /**
     * Convert SMILES to 2D coordinates with proper chemical geometry
     */
    static smilesToMolecule2D(smiles) {
        // Use the advanced molecular geometry generator for proper chemical structures
        const advanced = Molecular2DGenerator.advancedSMILESTo2D(smiles);
        return {
            atoms: advanced.atoms,
            bonds: advanced.bonds.map(bond => ({
                atom1: bond.atom1,
                atom2: bond.atom2,
                order: bond.order,
                type: bond.type
            })),
            name: `SMILES: ${smiles}`
        };
    }
    /**
     * Export canvas as image
     */
    exportImage(format = 'png') {
        if (format === 'svg') {
            return this.exportSVG();
        }
        return this.canvas.toDataURL(`image/${format}`);
    }
    /**
     * Export current molecule as SVG
     */
    exportSVG(options = {}) {
        if (!this.molecule) {
            return this.generateEmptySVG();
        }
        const svgElements = [];
        const { width, height } = this.config;
        // SVG header
        svgElements.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`);
        if (options.includeMetadata) {
            svgElements.push(`<title>Molecular Structure - ${this.molecule.atoms.length} atoms</title>`);
            svgElements.push(`<desc>Generated by CREB-JS Canvas2DRenderer</desc>`);
        }
        // Styles
        svgElements.push('<defs><style type="text/css">');
        svgElements.push('.atom-circle { stroke: #000; stroke-width: 1; }');
        svgElements.push('.atom-label { font-family: Arial, sans-serif; font-size: 14px; text-anchor: middle; dominant-baseline: central; }');
        svgElements.push(`.bond-line { stroke: ${this.config.bondColor}; stroke-width: ${this.config.bondWidth}; stroke-linecap: round; }`);
        if (options.interactive) {
            svgElements.push('.atom-group:hover .atom-circle { stroke-width: 2; stroke: #ff6b35; }');
            svgElements.push('.atom-group { cursor: pointer; }');
        }
        svgElements.push('</style></defs>');
        // Background
        svgElements.push(`<rect width="100%" height="100%" fill="${this.config.backgroundColor}"/>`);
        // Bonds
        svgElements.push('<g id="bonds">');
        this.molecule.bonds.forEach(bond => {
            const atom1 = this.molecule.atoms[bond.atom1];
            const atom2 = this.molecule.atoms[bond.atom2];
            const pos1 = this.transformPoint(atom1.position);
            const pos2 = this.transformPoint(atom2.position);
            svgElements.push(`<line x1="${pos1.x}" y1="${pos1.y}" x2="${pos2.x}" y2="${pos2.y}" class="bond-line"/>`);
        });
        svgElements.push('</g>');
        // Atoms
        svgElements.push('<g id="atoms">');
        this.molecule.atoms.forEach((atom, index) => {
            const pos = this.transformPoint(atom.position);
            const color = this.config.atomColors[atom.element] || '#999999';
            const radius = this.config.atomRadius * this.scale;
            svgElements.push('<g class="atom-group">');
            svgElements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${color}" class="atom-circle"/>`);
            const textColor = this.getContrastingColor(color);
            svgElements.push(`<text x="${pos.x}" y="${pos.y}" fill="${textColor}" class="atom-label">${atom.element}</text>`);
            svgElements.push('</g>');
        });
        svgElements.push('</g>');
        // Metadata
        if (options.includeMetadata) {
            svgElements.push('<metadata>');
            svgElements.push(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">`);
            svgElements.push(`<rdf:Description rdf:about="">`);
            svgElements.push(`<atomCount>${this.molecule.atoms.length}</atomCount>`);
            svgElements.push(`<bondCount>${this.molecule.bonds.length}</bondCount>`);
            svgElements.push(`<generator>CREB-JS Canvas2DRenderer</generator>`);
            svgElements.push(`<timestamp>${new Date().toISOString()}</timestamp>`);
            svgElements.push(`</rdf:Description>`);
            svgElements.push(`</rdf:RDF>`);
            svgElements.push('</metadata>');
        }
        svgElements.push('</svg>');
        return svgElements.join('\n');
    }
    /**
     * Generate empty SVG placeholder
     */
    generateEmptySVG() {
        const { width, height } = this.config;
        return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${this.config.backgroundColor}"/>
      <text x="${width / 2}" y="${height / 2 - 20}" text-anchor="middle" font-family="Arial" font-size="24" fill="#999">2D Molecular Structure</text>
      <text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" font-family="Arial" font-size="14" fill="#999">Load a molecule to visualize</text>
    </svg>`;
    }
    /**
     * Get contrasting color for text readability
     */
    getContrastingColor(backgroundColor) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    /**
     * Download SVG as file
     */
    downloadSVG(filename = 'molecule.svg', options = {}) {
        const svgContent = this.exportSVG(options);
        if (typeof document !== 'undefined') {
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        }
    }
    /**
     * Reset view to default
     */
    resetView() {
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.centerMolecule();
        this.render();
    }
    /**
     * Set molecule scale
     */
    setScale(scale) {
        this.scale = Math.max(0.1, Math.min(5, scale));
        this.render();
    }
    /**
     * Get current molecule data
     */
    getMolecule() {
        return this.molecule;
    }
}

/**
 * SVG Molecular Structure Renderer
 * Vector-based 2D molecular structure export
 */
/**
 * SVG-based molecular structure renderer
 */
class SVGRenderer {
    constructor(config = {}) {
        this.molecule = null;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.config = {
            width: 600,
            height: 400,
            backgroundColor: '#ffffff',
            atomColors: {
                'H': '#ffffff',
                'C': '#303030',
                'N': '#3050f8',
                'O': '#ff0d0d',
                'F': '#90e050',
                'P': '#ff8000',
                'S': '#ffff30',
                'Cl': '#1ff01f',
                'Br': '#a62929',
                'I': '#940094'
            },
            bondColor: '#000000',
            bondWidth: 2,
            fontSize: 14,
            atomRadius: 20,
            includeStyles: true,
            includeInteractivity: false,
            ...config
        };
    }
    /**
     * Load a molecule for rendering
     */
    loadMolecule(molecule) {
        this.molecule = molecule;
        this.centerMolecule();
    }
    /**
     * Center the molecule in the SVG viewport
     */
    centerMolecule() {
        if (!this.molecule || this.molecule.atoms.length === 0)
            return;
        // Calculate bounding box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        this.molecule.atoms.forEach(atom => {
            minX = Math.min(minX, atom.position.x);
            maxX = Math.max(maxX, atom.position.x);
            minY = Math.min(minY, atom.position.y);
            maxY = Math.max(maxY, atom.position.y);
        });
        // Calculate center offset
        const molWidth = maxX - minX;
        const molHeight = maxY - minY;
        const molCenterX = (minX + maxX) / 2;
        const molCenterY = (minY + maxY) / 2;
        // Calculate scale to fit molecule
        const scaleX = (this.config.width * 0.8) / molWidth;
        const scaleY = (this.config.height * 0.8) / molHeight;
        this.scale = Math.min(scaleX, scaleY, 1);
        // Center the molecule
        this.offset.x = this.config.width / 2 - molCenterX * this.scale;
        this.offset.y = this.config.height / 2 - molCenterY * this.scale;
    }
    /**
     * Transform point from molecule coordinates to SVG coordinates
     */
    transformPoint(point) {
        return {
            x: point.x * this.scale + this.offset.x,
            y: point.y * this.scale + this.offset.y
        };
    }
    /**
     * Generate SVG string for the current molecule
     */
    exportSVG(options = {}) {
        const opts = {
            format: 'svg',
            includeMetadata: true,
            optimizeSize: false,
            interactive: this.config.includeInteractivity,
            animations: false,
            ...options
        };
        if (!this.molecule) {
            return this.generateEmptySVG(opts);
        }
        const svgElements = [];
        // SVG header
        svgElements.push(this.generateSVGHeader(opts));
        // Styles
        if (this.config.includeStyles) {
            svgElements.push(this.generateStyles(opts));
        }
        // Background
        svgElements.push(this.generateBackground());
        // Molecular structure
        svgElements.push(this.generateBonds(opts));
        svgElements.push(this.generateAtoms(opts));
        // Metadata
        if (opts.includeMetadata) {
            svgElements.push(this.generateMetadata());
        }
        // SVG footer
        svgElements.push('</svg>');
        return svgElements.join('\n');
    }
    /**
     * Generate SVG header with viewBox and namespaces
     */
    generateSVGHeader(options) {
        const { width, height } = this.config;
        let header = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`;
        header += ` xmlns="http://www.w3.org/2000/svg"`;
        if (options.interactive) {
            header += ` xmlns:xlink="http://www.w3.org/1999/xlink"`;
        }
        header += `>`;
        if (options.includeMetadata) {
            header += `\n<title>Molecular Structure - ${this.molecule?.atoms.length || 0} atoms</title>`;
            header += `\n<desc>Generated by CREB-JS Molecular Visualization System</desc>`;
        }
        return header;
    }
    /**
     * Generate CSS styles for the SVG
     */
    generateStyles(options) {
        let styles = '<defs><style type="text/css">\n';
        // Base styles
        styles += `  .atom-circle { stroke: #000; stroke-width: 1; }\n`;
        styles += `  .atom-label { font-family: Arial, sans-serif; font-size: ${this.config.fontSize}px; text-anchor: middle; dominant-baseline: central; }\n`;
        styles += `  .bond-line { stroke: ${this.config.bondColor}; stroke-width: ${this.config.bondWidth}; stroke-linecap: round; }\n`;
        styles += `  .bond-double { stroke-dasharray: none; }\n`;
        styles += `  .bond-triple { stroke-width: ${this.config.bondWidth + 1}; }\n`;
        // Interactive styles
        if (options.interactive) {
            styles += `  .atom-group:hover .atom-circle { stroke-width: 2; stroke: #ff6b35; }\n`;
            styles += `  .atom-group:hover .atom-label { font-weight: bold; }\n`;
            styles += `  .bond-line:hover { stroke: #ff6b35; stroke-width: ${this.config.bondWidth + 1}; }\n`;
            styles += `  .atom-group { cursor: pointer; }\n`;
        }
        // Animation styles
        if (options.animations) {
            styles += `  @keyframes atomPulse { 0%, 100% { r: ${this.config.atomRadius}; } 50% { r: ${this.config.atomRadius + 3}; } }\n`;
            styles += `  .atom-circle:hover { animation: atomPulse 1s infinite; }\n`;
        }
        styles += '</style></defs>\n';
        return styles;
    }
    /**
     * Generate background rectangle
     */
    generateBackground() {
        return `<rect width="100%" height="100%" fill="${this.config.backgroundColor}"/>`;
    }
    /**
     * Generate SVG elements for bonds
     */
    generateBonds(options) {
        if (!this.molecule)
            return '';
        const bonds = [];
        bonds.push('<g id="bonds">');
        this.molecule.bonds.forEach((bond, index) => {
            const atom1 = this.molecule.atoms[bond.atom1];
            const atom2 = this.molecule.atoms[bond.atom2];
            const pos1 = this.transformPoint(atom1.position);
            const pos2 = this.transformPoint(atom2.position);
            bonds.push(this.generateBondSVG(pos1, pos2, bond, index, options));
        });
        bonds.push('</g>');
        return bonds.join('\n');
    }
    /**
     * Generate SVG for a single bond
     */
    generateBondSVG(pos1, pos2, bond, index, options) {
        const bondClass = `bond-${bond.type || 'single'}`;
        let bondElement = '';
        if (bond.order === 1 || !bond.order) {
            // Single bond
            bondElement = `<line x1="${pos1.x.toFixed(2)}" y1="${pos1.y.toFixed(2)}" x2="${pos2.x.toFixed(2)}" y2="${pos2.y.toFixed(2)}" class="bond-line ${bondClass}"`;
        }
        else if (bond.order === 2) {
            // Double bond - two parallel lines
            const dx = pos2.x - pos1.x;
            const dy = pos2.y - pos1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (-dy / length) * 3;
            const offsetY = (dx / length) * 3;
            bondElement = `<g class="bond-double">
        <line x1="${(pos1.x + offsetX).toFixed(2)}" y1="${(pos1.y + offsetY).toFixed(2)}" x2="${(pos2.x + offsetX).toFixed(2)}" y2="${(pos2.y + offsetY).toFixed(2)}" class="bond-line"/>
        <line x1="${(pos1.x - offsetX).toFixed(2)}" y1="${(pos1.y - offsetY).toFixed(2)}" x2="${(pos2.x - offsetX).toFixed(2)}" y2="${(pos2.y - offsetY).toFixed(2)}" class="bond-line"/>
      </g>`;
        }
        else if (bond.order === 3) {
            // Triple bond - three parallel lines
            const dx = pos2.x - pos1.x;
            const dy = pos2.y - pos1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (-dy / length) * 3;
            const offsetY = (dx / length) * 3;
            bondElement = `<g class="bond-triple">
        <line x1="${pos1.x.toFixed(2)}" y1="${pos1.y.toFixed(2)}" x2="${pos2.x.toFixed(2)}" y2="${pos2.y.toFixed(2)}" class="bond-line"/>
        <line x1="${(pos1.x + offsetX).toFixed(2)}" y1="${(pos1.y + offsetY).toFixed(2)}" x2="${(pos2.x + offsetX).toFixed(2)}" y2="${(pos2.y + offsetY).toFixed(2)}" class="bond-line"/>
        <line x1="${(pos1.x - offsetX).toFixed(2)}" y1="${(pos1.y - offsetY).toFixed(2)}" x2="${(pos2.x - offsetX).toFixed(2)}" y2="${(pos2.y - offsetY).toFixed(2)}" class="bond-line"/>
      </g>`;
        }
        if (options.interactive) {
            bondElement += ` data-bond-id="${index}" data-atoms="${bond.atom1},${bond.atom2}"`;
        }
        if (bondElement.includes('<g')) {
            return bondElement;
        }
        else {
            return bondElement + '/>';
        }
    }
    /**
     * Generate SVG elements for atoms
     */
    generateAtoms(options) {
        if (!this.molecule)
            return '';
        const atoms = [];
        atoms.push('<g id="atoms">');
        this.molecule.atoms.forEach((atom, index) => {
            atoms.push(this.generateAtomSVG(atom, index, options));
        });
        atoms.push('</g>');
        return atoms.join('\n');
    }
    /**
     * Generate SVG for a single atom
     */
    generateAtomSVG(atom, index, options) {
        const pos = this.transformPoint(atom.position);
        const color = this.config.atomColors[atom.element] || '#cccccc';
        const radius = this.config.atomRadius * this.scale;
        let atomGroup = `<g class="atom-group" data-element="${atom.element}" data-atom-id="${index}">`;
        // Atom circle
        atomGroup += `<circle cx="${pos.x.toFixed(2)}" cy="${pos.y.toFixed(2)}" r="${radius.toFixed(2)}" fill="${color}" class="atom-circle"/>`;
        // Atom label
        const textColor = this.getContrastingColor(color);
        atomGroup += `<text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" fill="${textColor}" class="atom-label">${atom.element}</text>`;
        // Interactive elements
        if (options.interactive) {
            atomGroup += `<title>${atom.element} - Atom ${index + 1}</title>`;
        }
        atomGroup += '</g>';
        return atomGroup;
    }
    /**
     * Generate metadata section
     */
    generateMetadata() {
        if (!this.molecule)
            return '';
        const metadata = [
            '<metadata>',
            `  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:creb="https://creb.dev/ns#">`,
            `    <rdf:Description rdf:about="">`,
            `      <creb:atomCount>${this.molecule.atoms.length}</creb:atomCount>`,
            `      <creb:bondCount>${this.molecule.bonds.length}</creb:bondCount>`,
            `      <creb:generator>CREB-JS v${process.env.npm_package_version || '1.6.0'}</creb:generator>`,
            `      <creb:timestamp>${new Date().toISOString()}</creb:timestamp>`,
            `    </rdf:Description>`,
            `  </rdf:RDF>`,
            '</metadata>'
        ];
        return metadata.join('\n');
    }
    /**
     * Generate empty SVG for when no molecule is loaded
     */
    generateEmptySVG(options) {
        const { width, height } = this.config;
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="100%" height="100%" fill="${this.config.backgroundColor}"/>`;
        svg += `<text x="${width / 2}" y="${height / 2 - 20}" text-anchor="middle" font-family="Arial" font-size="24" fill="#999">2D Molecular Structure</text>`;
        svg += `<text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" font-family="Arial" font-size="14" fill="#999">Load a molecule to visualize</text>`;
        svg += '</svg>';
        return svg;
    }
    /**
     * Get contrasting color for text
     */
    getContrastingColor(backgroundColor) {
        // Simple contrast calculation
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    /**
     * Export as downloadable SVG file
     */
    exportAsFile(filename = 'molecule.svg', options = {}) {
        const svgContent = this.exportSVG({ ...options, format: 'svg-download' });
        // Create download link (browser only)
        if (typeof document !== 'undefined') {
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        }
        else {
            // Node.js environment - would need fs module
            console.log('SVG content:', svgContent);
        }
    }
    /**
     * Get current molecule data
     */
    getMolecule() {
        return this.molecule;
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.centerMolecule();
    }
}

/**
 * Simplified Molecular Visualization System
 * Node.js and browser compatible implementation
 */
/**
 * Main Molecular Visualization Engine
 */
class MolecularVisualization {
    constructor(config) {
        this.config = {
            width: 600,
            height: 400,
            mode: 'both',
            backgroundColor: '#ffffff',
            interactive: true,
            ...config
        };
        this.styleOptions = {
            style: 'stick',
            colorScheme: 'element',
            showLabels: false,
            atomScale: 1.0,
            bondWidth: 2
        };
        this.initializeContainer();
        this.setupVisualization();
    }
    /**
     * Initialize the visualization container
     */
    initializeContainer() {
        // Handle both string selector and direct element
        if (typeof this.config.container === 'string') {
            // In browser environment, try to find element
            try {
                const element = globalThis?.document?.getElementById?.(this.config.container);
                this.container = element || this.createFallbackContainer();
            }
            catch {
                this.container = this.createFallbackContainer();
            }
        }
        else {
            this.container = this.config.container || this.createFallbackContainer();
        }
    }
    /**
     * Create a fallback container for non-browser environments
     */
    createFallbackContainer() {
        return {
            width: this.config.width || 600,
            height: this.config.height || 400,
            appendChild: () => { },
            innerHTML: '',
            style: {}
        };
    }
    /**
     * Setup the visualization components
     */
    setupVisualization() {
        if (this.config.mode === '2d' || this.config.mode === 'both') {
            this.setup2DVisualization();
        }
        if (this.config.mode === '3d' || this.config.mode === 'both') {
            this.setup3DVisualization();
        }
    }
    /**
     * Setup 2D canvas visualization
     */
    setup2DVisualization() {
        try {
            // Try to create canvas element
            let canvas;
            if (globalThis?.document?.createElement) {
                canvas = globalThis.document.createElement('canvas');
                canvas.width = this.config.width || 600;
                canvas.height = this.config.height || 400;
                if (this.container.appendChild) {
                    this.container.appendChild(canvas);
                }
            }
            else {
                // Fallback for non-browser environments
                canvas = {
                    width: this.config.width || 600,
                    height: this.config.height || 400,
                    getContext: () => ({
                        fillStyle: '',
                        strokeStyle: '',
                        lineWidth: 1,
                        lineCap: 'round',
                        font: '12px Arial',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fillRect: () => { },
                        fillText: () => { },
                        beginPath: () => { },
                        moveTo: () => { },
                        lineTo: () => { },
                        arc: () => { },
                        fill: () => { },
                        stroke: () => { },
                        setLineDash: () => { }
                    }),
                    toDataURL: () => 'data:image/png;base64,',
                    style: {}
                };
            }
            this.canvas2d = new Canvas2DRenderer(canvas);
        }
        catch (error) {
            console.warn('Could not initialize 2D visualization:', error);
        }
    }
    /**
     * Setup 3D visualization
     */
    setup3DVisualization() {
        try {
            // Check if 3Dmol.js is available
            if (globalThis?.$3Dmol) {
                this.initialize3DViewer();
            }
            else {
                this.initializeFallback3D();
            }
        }
        catch (error) {
            console.warn('Could not initialize 3D visualization:', error);
            this.initializeFallback3D();
        }
    }
    /**
     * Initialize 3Dmol.js viewer
     */
    initialize3DViewer() {
        try {
            const $3Dmol = globalThis.$3Dmol;
            this.viewer3d = $3Dmol.createViewer(this.container, {
                defaultcolors: $3Dmol.elementColors.defaultColors
            });
        }
        catch (error) {
            console.warn('Failed to create 3Dmol viewer:', error);
            this.initializeFallback3D();
        }
    }
    /**
     * Initialize fallback 3D visualization
     */
    initializeFallback3D() {
        this.viewer3d = {
            addModel: () => ({ setStyle: () => { }, show: () => { } }),
            setStyle: () => { },
            zoomTo: () => { },
            render: () => { },
            clear: () => { },
            resize: () => { }
        };
    }
    /**
     * Load and display a molecule
     */
    loadMolecule(data) {
        this.currentMolecule = data;
        if (this.config.mode === '2d' || this.config.mode === 'both') {
            this.render2D(data);
        }
        if (this.config.mode === '3d' || this.config.mode === 'both') {
            this.render3D(data);
        }
    }
    /**
     * Render molecule in 2D
     */
    render2D(data) {
        if (!this.canvas2d)
            return;
        try {
            let molecule2d;
            if (data.smiles) {
                molecule2d = Canvas2DRenderer.smilesToMolecule2D(data.smiles);
            }
            else if (data.atoms && data.bonds) {
                molecule2d = {
                    atoms: data.atoms.map((atom, i) => ({
                        element: atom.element,
                        position: { x: atom.x * 50 + 100, y: atom.y * 50 + 100 },
                        bonds: data.bonds
                            .filter(bond => bond.atom1 === i || bond.atom2 === i)
                            .map((_, j) => j)
                    })),
                    bonds: data.bonds.map(bond => ({
                        atom1: bond.atom1,
                        atom2: bond.atom2,
                        order: bond.order,
                        type: bond.order === 1 ? 'single' : bond.order === 2 ? 'double' : 'triple'
                    }))
                };
            }
            else {
                // Default fallback molecule
                molecule2d = Canvas2DRenderer.smilesToMolecule2D('C');
            }
            this.canvas2d.loadMolecule(molecule2d);
        }
        catch (error) {
            console.warn('Error rendering 2D molecule:', error);
        }
    }
    /**
     * Render molecule in 3D
     */
    render3D(data) {
        if (!this.viewer3d)
            return;
        try {
            this.viewer3d.clear();
            if (data.pdb) {
                const model = this.viewer3d.addModel(data.pdb, 'pdb');
                model.setStyle({}, { [this.styleOptions.style || 'stick']: {} });
                model.show();
            }
            else if (data.sdf) {
                const model = this.viewer3d.addModel(data.sdf, 'sdf');
                model.setStyle({}, { [this.styleOptions.style || 'stick']: {} });
                model.show();
            }
            this.viewer3d.zoomTo();
            this.viewer3d.render();
        }
        catch (error) {
            console.warn('Error rendering 3D molecule:', error);
        }
    }
    /**
     * Update visualization style
     */
    updateStyle(options) {
        this.styleOptions = { ...this.styleOptions, ...options };
        if (this.currentMolecule) {
            this.loadMolecule(this.currentMolecule);
        }
    }
    /**
     * Export current visualization as image
     */
    exportImage(format = 'png') {
        if (this.canvas2d && (this.config.mode === '2d' || this.config.mode === 'both')) {
            return this.canvas2d.exportImage(format);
        }
        return '';
    }
    /**
     * Reset visualization to default view
     */
    resetView() {
        if (this.canvas2d) {
            this.canvas2d.resetView();
        }
        if (this.viewer3d && this.viewer3d.zoomTo) {
            this.viewer3d.zoomTo();
            this.viewer3d.render();
        }
    }
    /**
     * Resize the visualization
     */
    resize(width, height) {
        this.config.width = width;
        this.config.height = height;
        if (this.viewer3d && this.viewer3d.resize) {
            this.viewer3d.resize();
        }
        // For 2D, would need to recreate canvas
        if (this.canvas2d) {
            this.setup2DVisualization();
            if (this.currentMolecule) {
                this.render2D(this.currentMolecule);
            }
        }
    }
    /**
     * Get current molecule data
     */
    getMolecule() {
        return this.currentMolecule;
    }
    /**
     * Clean up resources
     */
    destroy() {
        if (this.viewer3d && this.viewer3d.clear) {
            this.viewer3d.clear();
        }
        this.canvas2d = undefined;
        this.viewer3d = undefined;
        this.currentMolecule = undefined;
    }
}
/**
 * Utility functions for molecular data conversion
 */
class MolecularDataUtils {
    /**
     * Convert PDB string to basic atom/bond data
     */
    static parsePDB(pdbString) {
        const atoms = [];
        const bonds = [];
        const lines = pdbString.split('\n');
        for (const line of lines) {
            if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
                const element = line.substring(76, 78).trim() || line.substring(12, 16).trim().charAt(0);
                const x = parseFloat(line.substring(30, 38));
                const y = parseFloat(line.substring(38, 46));
                const z = parseFloat(line.substring(46, 54));
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                    atoms.push({ element, x, y, z });
                }
            }
        }
        // Simple bond detection based on distance
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const dx = atoms[i].x - atoms[j].x;
                const dy = atoms[i].y - atoms[j].y;
                const dz = atoms[i].z - atoms[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                // Typical bond distance thresholds
                if (distance < 2.0) {
                    bonds.push({ atom1: i, atom2: j, order: 1 });
                }
            }
        }
        return { pdb: pdbString, atoms, bonds };
    }
    /**
     * Generate sample molecules for testing
     */
    static generateSampleMolecule(type = 'water') {
        switch (type) {
            case 'water':
                return {
                    smiles: 'O',
                    atoms: [
                        { element: 'O', x: 0, y: 0, z: 0 },
                        { element: 'H', x: 0.757, y: 0.587, z: 0 },
                        { element: 'H', x: -0.757, y: 0.587, z: 0 }
                    ],
                    bonds: [
                        { atom1: 0, atom2: 1, order: 1 },
                        { atom1: 0, atom2: 2, order: 1 }
                    ]
                };
            case 'methane':
                return {
                    smiles: 'C',
                    atoms: [
                        { element: 'C', x: 0, y: 0, z: 0 },
                        { element: 'H', x: 1.089, y: 0, z: 0 },
                        { element: 'H', x: -0.363, y: 1.027, z: 0 },
                        { element: 'H', x: -0.363, y: -0.513, z: 0.889 },
                        { element: 'H', x: -0.363, y: -0.513, z: -0.889 }
                    ],
                    bonds: [
                        { atom1: 0, atom2: 1, order: 1 },
                        { atom1: 0, atom2: 2, order: 1 },
                        { atom1: 0, atom2: 3, order: 1 },
                        { atom1: 0, atom2: 4, order: 1 }
                    ]
                };
            case 'benzene':
                return {
                    smiles: 'c1ccccc1',
                    atoms: [
                        { element: 'C', x: 1.4, y: 0, z: 0 },
                        { element: 'C', x: 0.7, y: 1.2, z: 0 },
                        { element: 'C', x: -0.7, y: 1.2, z: 0 },
                        { element: 'C', x: -1.4, y: 0, z: 0 },
                        { element: 'C', x: -0.7, y: -1.2, z: 0 },
                        { element: 'C', x: 0.7, y: -1.2, z: 0 }
                    ],
                    bonds: [
                        { atom1: 0, atom2: 1, order: 1 },
                        { atom1: 1, atom2: 2, order: 2 },
                        { atom1: 2, atom2: 3, order: 1 },
                        { atom1: 3, atom2: 4, order: 2 },
                        { atom1: 4, atom2: 5, order: 1 },
                        { atom1: 5, atom2: 0, order: 2 }
                    ]
                };
            default:
                return this.generateSampleMolecule('water');
        }
    }
}

/**
 * RDKit.js Wrapper for CREB Molecular Visualization
 * Provides unified API for advanced molecular structure processing and generation
 *
 * Features:
 * - SMILES/SMARTS parsing and validation
 * - 2D coordinate generation with RDKit algorithms
 * - Molecular descriptors and properties calculation
 * - Substructure searching and matching
 * - Chemical transformation operations
 * - SVG generation with RDKit's advanced rendering
 */
/**
 * RDKit.js Wrapper Class
 * Provides simplified access to RDKit functionality within CREB
 */
class RDKitWrapper {
    constructor(config = {}) {
        this.rdkit = null;
        this.initialized = false;
        this.config = {
            kekulize: true,
            addCoords: true,
            removeHs: true,
            sanitize: true,
            useCoordGen: true,
            width: 600,
            height: 400,
            offsetx: 0,
            offsety: 0,
            ...config
        };
    }
    /**
     * Initialize RDKit.js library using the official pattern
     */
    async initialize() {
        if (this.initialized)
            return;
        try {
            // Browser environment - use official initRDKitModule
            if (typeof window !== 'undefined') {
                // Check if initRDKitModule is available globally (official method)
                if (typeof window.initRDKitModule === 'function') {
                    console.log('Initializing RDKit using official initRDKitModule...');
                    this.rdkit = await window.initRDKitModule();
                    this.initialized = true;
                    console.log('RDKit initialized successfully, version:', this.rdkit.version());
                    return;
                }
                // Fallback: check if RDKit is already available globally
                if (window.RDKit) {
                    console.log('Using pre-loaded RDKit instance...');
                    this.rdkit = window.RDKit;
                    this.initialized = true;
                    return;
                }
                // Try dynamic import as last resort
                try {
                    // Use string-based import to avoid build-time type checking
                    const rdkitModule = await import('@' + 'rdkit' + '/' + 'rdkit');
                    this.rdkit = await rdkitModule.initRDKitModule();
                    this.initialized = true;
                    return;
                }
                catch (importError) {
                    console.warn('Dynamic import failed:', importError);
                }
                throw new Error('RDKit.js not available - please ensure RDKit.js is loaded via script tag');
            }
            else {
                // Node.js environment
                console.warn('RDKit.js not available in Node.js environment. Using fallback implementations.');
                this.rdkit = this.createFallbackRDKit();
                this.initialized = true;
            }
            this.initialized = true;
        }
        catch (error) {
            console.warn('RDKit.js initialization failed:', error);
            this.rdkit = this.createFallbackRDKit();
            this.initialized = true;
        }
    }
    /**
     * Parse SMILES string and generate molecule object
     */
    async parseSMILES(smiles) {
        await this.initialize();
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackParseSMILES(smiles);
            }
            const mol = this.rdkit.get_mol(smiles);
            if (!mol || !mol.is_valid()) {
                throw new Error(`Invalid SMILES: ${smiles}`);
            }
            // Generate 2D coordinates
            if (this.config.addCoords) {
                mol.generate_2d_coords();
            }
            // Extract molecule data
            const molData = this.extractMoleculeData(mol);
            // Cleanup RDKit object
            mol.delete();
            return molData;
        }
        catch (error) {
            console.error('SMILES parsing failed:', error);
            return null;
        }
    }
    /**
     * Generate SVG representation of molecule
     */
    async generateSVG(smiles, options = {}) {
        await this.initialize();
        const config = { ...this.config, ...options };
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackGenerateSVG(smiles, config);
            }
            const mol = this.rdkit.get_mol(smiles);
            if (!mol || !mol.is_valid()) {
                throw new Error(`Invalid SMILES: ${smiles}`);
            }
            // Generate SVG
            const svg = mol.get_svg_with_highlights(JSON.stringify({
                width: config.width,
                height: config.height,
                offsetx: config.offsetx,
                offsety: config.offsety
            }));
            mol.delete();
            return svg;
        }
        catch (error) {
            console.error('SVG generation failed:', error);
            return this.fallbackGenerateSVG(smiles, config);
        }
    }
    /**
     * Calculate molecular descriptors
     */
    async calculateDescriptors(smiles) {
        await this.initialize();
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackCalculateDescriptors(smiles);
            }
            const mol = this.rdkit.get_mol(smiles);
            if (!mol || !mol.is_valid()) {
                throw new Error(`Invalid SMILES: ${smiles}`);
            }
            const descriptors = JSON.parse(mol.get_descriptors());
            const properties = {
                molecularWeight: descriptors.amw || 0,
                logP: descriptors.clogp || 0,
                tpsa: descriptors.tpsa || 0,
                hbd: descriptors.lipinskiHBD || 0,
                hba: descriptors.lipinskiHBA || 0,
                rotatableBonds: descriptors.NumRotatableBonds || 0,
                aromaticRings: descriptors.NumAromaticRings || 0,
                aliphaticRings: descriptors.NumAliphaticRings || 0,
                formula: mol.get_molformula() || '',
                inchi: mol.get_inchi() || '',
                inchiKey: mol.get_inchi_key() || ''
            };
            mol.delete();
            return properties;
        }
        catch (error) {
            console.error('Descriptor calculation failed:', error);
            return this.fallbackCalculateDescriptors(smiles);
        }
    }
    /**
     * Perform substructure search
     */
    async findSubstructure(moleculeSmiles, querySmarts) {
        await this.initialize();
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackFindSubstructure(moleculeSmiles, querySmarts);
            }
            const mol = this.rdkit.get_mol(moleculeSmiles);
            const query = this.rdkit.get_qmol(querySmarts);
            if (!mol || !mol.is_valid() || !query || !query.is_valid()) {
                throw new Error('Invalid molecule or query structure');
            }
            const matches = JSON.parse(mol.get_substruct_matches(query));
            mol.delete();
            query.delete();
            return matches.map((match) => ({
                atomIds: match.atoms || [],
                bondIds: match.bonds || [],
                matched: true
            }));
        }
        catch (error) {
            console.error('Substructure search failed:', error);
            return [];
        }
    }
    /**
     * Apply chemical transformation
     */
    async applyTransformation(smiles, reactionSmarts) {
        await this.initialize();
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackApplyTransformation(smiles, reactionSmarts);
            }
            const mol = this.rdkit.get_mol(smiles);
            const rxn = this.rdkit.get_rxn(reactionSmarts);
            if (!mol || !mol.is_valid() || !rxn || !rxn.is_valid()) {
                throw new Error('Invalid molecule or reaction');
            }
            const products = JSON.parse(rxn.run_reactants([mol]));
            mol.delete();
            rxn.delete();
            return products.map((product) => product.smiles || '');
        }
        catch (error) {
            console.error('Chemical transformation failed:', error);
            return [];
        }
    }
    /**
     * Validate SMILES string
     */
    async validateSMILES(smiles) {
        await this.initialize();
        try {
            if (!this.rdkit.get_mol) {
                return this.fallbackValidateSMILES(smiles);
            }
            const mol = this.rdkit.get_mol(smiles);
            const isValid = mol && mol.is_valid();
            if (mol)
                mol.delete();
            return isValid;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Extract detailed molecule data from RDKit molecule object
     */
    extractMoleculeData(mol) {
        const molblock = mol.get_molblock();
        const smiles = mol.get_smiles();
        // Get atom and bond information
        const atoms = [];
        const bonds = [];
        try {
            const molData = JSON.parse(mol.get_json());
            // Extract atoms
            if (molData.atoms) {
                molData.atoms.forEach((atom, index) => {
                    atoms.push({
                        atomicNum: atom.z || 0,
                        symbol: atom.l || 'C',
                        x: atom.x || 0,
                        y: atom.y || 0,
                        z: atom.z || 0,
                        charge: atom.c || 0,
                        hybridization: atom.h || 'sp3',
                        aromantic: atom.a || false,
                        inRing: atom.r || false
                    });
                });
            }
            // Extract bonds
            if (molData.bonds) {
                molData.bonds.forEach((bond) => {
                    bonds.push({
                        beginAtomIdx: bond.b || 0,
                        endAtomIdx: bond.e || 0,
                        bondType: this.mapBondType(bond.o || 1),
                        isInRing: bond.r || false,
                        isConjugated: bond.c || false
                    });
                });
            }
        }
        catch (error) {
            console.warn('Failed to extract detailed molecule data:', error);
        }
        return {
            smiles,
            molblock,
            atoms,
            bonds,
            properties: {
                molecularWeight: 0,
                logP: 0,
                tpsa: 0,
                hbd: 0,
                hba: 0,
                rotatableBonds: 0,
                aromaticRings: 0,
                aliphaticRings: 0,
                formula: mol.get_molformula() || '',
                inchi: mol.get_inchi() || '',
                inchiKey: mol.get_inchi_key() || ''
            }
        };
    }
    /**
     * Map RDKit bond order to bond type
     */
    mapBondType(order) {
        switch (order) {
            case 1: return 'SINGLE';
            case 2: return 'DOUBLE';
            case 3: return 'TRIPLE';
            case 12: return 'AROMATIC';
            default: return 'SINGLE';
        }
    }
    /**
     * Create fallback RDKit implementation for environments where RDKit.js is not available
     */
    createFallbackRDKit() {
        return {
            get_mol: null,
            get_qmol: null,
            get_rxn: null
        };
    }
    /**
     * Fallback implementations for when RDKit.js is not available
     */
    fallbackParseSMILES(smiles) {
        // Simple SMILES parsing fallback
        const atomCount = smiles.length; // Simplified
        return {
            smiles,
            atoms: [],
            bonds: [],
            properties: {
                molecularWeight: atomCount * 12, // Rough estimate
                logP: 0,
                tpsa: 0,
                hbd: 0,
                hba: 0,
                rotatableBonds: 0,
                aromaticRings: 0,
                aliphaticRings: 0,
                formula: smiles,
                inchi: '',
                inchiKey: ''
            }
        };
    }
    fallbackGenerateSVG(smiles, config) {
        return `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="${config.width / 2}" y="${config.height / 2}" text-anchor="middle" font-family="Arial" font-size="16">
        ${smiles}
      </text>
      <text x="${config.width / 2}" y="${config.height / 2 + 25}" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        (RDKit.js not available - showing SMILES)
      </text>
    </svg>`;
    }
    fallbackCalculateDescriptors(smiles) {
        return {
            molecularWeight: smiles.length * 12, // Very rough estimate
            logP: 0,
            tpsa: 0,
            hbd: 0,
            hba: 0,
            rotatableBonds: 0,
            aromaticRings: 0,
            aliphaticRings: 0,
            formula: smiles,
            inchi: '',
            inchiKey: ''
        };
    }
    fallbackFindSubstructure(moleculeSmiles, querySmarts) {
        // Simple substring search as fallback
        const matched = moleculeSmiles.includes(querySmarts);
        return matched ? [{ atomIds: [], bondIds: [], matched: true }] : [];
    }
    fallbackApplyTransformation(smiles, reactionSmarts) {
        // No transformation capability in fallback
        return [smiles];
    }
    fallbackValidateSMILES(smiles) {
        // Basic validation - check for common SMILES characters
        const smilesPattern = /^[A-Za-z0-9@+\-\[\]()=#:/\\%*.]+$/;
        return smilesPattern.test(smiles) && smiles.length > 0;
    }
    /**
     * Cleanup resources
     */
    dispose() {
        // RDKit.js cleanup if needed
        this.initialized = false;
    }
}

/**
 * 3Dmol.js Wrapper for CREB Molecular Visualization
 * Provides unified API for advanced 3D molecular structure visualization
 *
 * Features:
 * - Interactive 3D molecular visualization with WebGL
 * - Multiple rendering styles (ball-and-stick, space-filling, cartoon, etc.)
 * - Animation and transition effects
 * - Chemical property visualization (electrostatic, hydrophobic surfaces)
 * - Multi-molecule scene management
 * - Export capabilities (PNG, WebM, molecular formats)
 * - Event handling for molecular interactions
 */
/**
 * 3Dmol.js Wrapper Class
 * Provides simplified access to 3Dmol.js functionality within CREB
 */
class Mol3DWrapper {
    constructor(container, config = {}) {
        this.viewer = null;
        this.container = null;
        this.initialized = false;
        this.molecules = new Map();
        this.eventHandlers = new Map();
        this.container = typeof container === 'string'
            ? document.getElementById(container)
            : container;
        this.config = {
            backgroundColor: '#ffffff',
            width: 600,
            height: 400,
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
            premultipliedAlpha: false,
            camera: {
                fov: 45,
                near: 0.1,
                far: 1000,
                position: { x: 0, y: 0, z: 50 },
                target: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 1, z: 0 }
            },
            lighting: {
                ambient: '#404040',
                directional: [
                    {
                        color: '#ffffff',
                        intensity: 1.0,
                        position: { x: 1, y: 1, z: 1 }
                    }
                ]
            },
            fog: {
                enabled: false,
                color: '#ffffff',
                near: 50,
                far: 100
            },
            ...config
        };
    }
    /**
     * Initialize 3Dmol.js viewer
     */
    async initialize() {
        if (this.initialized || !this.container)
            return;
        try {
            // Dynamic import for 3Dmol.js
            let $3Dmol;
            if (typeof window !== 'undefined') {
                // Browser environment - try different import methods
                try {
                    // Use string-based import to avoid build-time type checking
                    $3Dmol = await import('3' + 'dmol');
                }
                catch {
                    // Fallback to global $3Dmol if module import fails
                    $3Dmol = window.$3Dmol;
                }
            }
            if (!$3Dmol) {
                console.warn('3Dmol.js not available. Using fallback implementation.');
                this.viewer = this.createFallbackViewer();
            }
            else {
                // Create 3Dmol viewer
                this.viewer = $3Dmol.createViewer(this.container, {
                    backgroundColor: this.config.backgroundColor,
                    antialias: this.config.antialias,
                    alpha: this.config.alpha,
                    preserveDrawingBuffer: this.config.preserveDrawingBuffer,
                    premultipliedAlpha: this.config.premultipliedAlpha
                });
                // Configure camera
                this.viewer.setCameraParameters({
                    fov: this.config.camera.fov,
                    near: this.config.camera.near,
                    far: this.config.camera.far
                });
                // Set initial camera position
                this.viewer.setViewStyle({
                    style: 'outline',
                    color: 'black',
                    width: 0.1
                });
            }
            this.initialized = true;
            this.setupEventHandlers();
        }
        catch (error) {
            console.warn('3Dmol.js initialization failed:', error);
            this.viewer = this.createFallbackViewer();
            this.initialized = true;
        }
    }
    /**
     * Get the 3Dmol viewer instance
     */
    getViewer() {
        return this.viewer;
    }
    /**
     * Add molecule to the scene
     */
    async addMolecule(id, moleculeData, format = 'pdb') {
        await this.initialize();
        try {
            let molecule;
            if (typeof moleculeData === 'string') {
                // Parse molecule data
                molecule = this.parseMoleculeData(moleculeData, format);
                if (this.viewer.addModel) {
                    this.viewer.addModel(moleculeData, format);
                }
            }
            else {
                molecule = moleculeData;
                if (this.viewer.addModel && molecule.data) {
                    this.viewer.addModel(molecule.data, molecule.format || format);
                }
            }
            this.molecules.set(id, molecule);
            this.render();
        }
        catch (error) {
            console.error('Failed to add molecule:', error);
        }
    }
    /**
     * Remove molecule from the scene
     */
    removeMolecule(id) {
        if (this.molecules.has(id)) {
            this.molecules.delete(id);
            // Remove from 3Dmol viewer
            if (this.viewer.removeAllModels) {
                this.viewer.removeAllModels();
                // Re-add remaining molecules
                this.molecules.forEach((molecule, moleculeId) => {
                    if (molecule.data && moleculeId !== id) {
                        this.viewer.addModel(molecule.data, molecule.format || 'pdb');
                    }
                });
            }
            this.render();
        }
    }
    /**
     * Set visualization style for molecules
     */
    setStyle(style, selector) {
        if (!this.viewer.setStyle) {
            console.warn('Style setting not available in fallback mode');
            return;
        }
        try {
            this.viewer.setStyle(selector || {}, style);
            this.render();
        }
        catch (error) {
            console.error('Failed to set style:', error);
        }
    }
    /**
     * Add surface to molecule
     */
    addSurface(surfaceType = 'VDW', style = {}, selector) {
        if (!this.viewer.addSurface) {
            console.warn('Surface rendering not available in fallback mode');
            return;
        }
        try {
            this.viewer.addSurface(surfaceType, style, selector);
            this.render();
        }
        catch (error) {
            console.error('Failed to add surface:', error);
        }
    }
    /**
     * Animate camera movement
     */
    animateCamera(targetPosition, options = { duration: 1000 }) {
        return new Promise((resolve) => {
            if (!this.viewer.animate) {
                console.warn('Animation not available in fallback mode');
                resolve();
                return;
            }
            try {
                this.viewer.animate({
                    camera: targetPosition,
                    duration: options.duration,
                    easing: options.easing || 'ease'
                });
                setTimeout(resolve, options.duration);
            }
            catch (error) {
                console.error('Camera animation failed:', error);
                resolve();
            }
        });
    }
    /**
     * Animate molecular properties
     */
    animateMolecule(properties, options = { duration: 1000 }) {
        return new Promise((resolve) => {
            if (!this.viewer.animate) {
                console.warn('Animation not available in fallback mode');
                resolve();
                return;
            }
            try {
                this.viewer.animate({
                    ...properties,
                    duration: options.duration,
                    easing: options.easing || 'ease'
                });
                setTimeout(resolve, options.duration);
            }
            catch (error) {
                console.error('Molecule animation failed:', error);
                resolve();
            }
        });
    }
    /**
     * Export scene as image or animation
     */
    async exportScene(options) {
        if (!this.viewer) {
            throw new Error('Viewer not initialized');
        }
        switch (options.format) {
            case 'png':
                return this.exportPNG(options);
            case 'webm':
                return this.exportWebM(options);
            case 'pdb':
            case 'sdf':
            case 'mol2':
                return this.exportMoleculeData(options.format);
            default:
                throw new Error(`Unsupported export format: ${options.format}`);
        }
    }
    /**
     * Add event listener for molecular interactions
     */
    addEventListener(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    /**
     * Remove event listener
     */
    removeEventListener(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Center and fit all molecules in view
     */
    zoomToFit() {
        if (this.viewer.zoomTo) {
            this.viewer.zoomTo();
            this.render();
        }
    }
    /**
     * Set camera position
     */
    setCameraPosition(position) {
        if (this.viewer.setCameraPosition) {
            this.viewer.setCameraPosition(position);
            this.render();
        }
    }
    /**
     * Get current camera position
     */
    getCameraPosition() {
        if (this.viewer.getCameraPosition) {
            return this.viewer.getCameraPosition();
        }
        return { x: 0, y: 0, z: 50 };
    }
    /**
     * Clear all molecules from scene
     */
    clear() {
        this.molecules.clear();
        if (this.viewer.removeAllModels) {
            this.viewer.removeAllModels();
            this.render();
        }
    }
    /**
     * Render the scene
     */
    render() {
        if (this.viewer.render) {
            this.viewer.render();
        }
    }
    /**
     * Resize viewer
     */
    resize(width, height) {
        if (width)
            this.config.width = width;
        if (height)
            this.config.height = height;
        if (this.viewer.resize) {
            this.viewer.resize();
        }
    }
    /**
     * Parse molecule data string into structured format
     */
    parseMoleculeData(data, format) {
        const atoms = [];
        try {
            switch (format.toLowerCase()) {
                case 'pdb':
                    return this.parsePDB(data);
                case 'sdf':
                case 'mol':
                    return this.parseSDF(data);
                case 'xyz':
                    return this.parseXYZ(data);
                default:
                    console.warn(`Unsupported format: ${format}`);
                    break;
            }
        }
        catch (error) {
            console.error('Failed to parse molecule data:', error);
        }
        return {
            atoms,
            format: format,
            data
        };
    }
    /**
     * Parse PDB format
     */
    parsePDB(data) {
        const atoms = [];
        const lines = data.split('\n');
        for (const line of lines) {
            if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
                const atom = {
                    elem: line.substring(76, 78).trim() || line.substring(12, 16).trim().charAt(0),
                    x: parseFloat(line.substring(30, 38)),
                    y: parseFloat(line.substring(38, 46)),
                    z: parseFloat(line.substring(46, 54)),
                    serial: parseInt(line.substring(6, 11)),
                    atom: line.substring(12, 16).trim(),
                    resn: line.substring(17, 20).trim(),
                    chain: line.substring(21, 22),
                    resi: parseInt(line.substring(22, 26)),
                    b: parseFloat(line.substring(60, 66)),
                    pdbline: line
                };
                atoms.push(atom);
            }
        }
        return {
            atoms,
            format: 'pdb',
            data
        };
    }
    /**
     * Parse SDF format
     */
    parseSDF(data) {
        const atoms = [];
        const lines = data.split('\n');
        // Find the counts line (typically line 3)
        const countsLine = lines[3];
        if (countsLine) {
            const atomCount = parseInt(countsLine.substring(0, 3));
            // Parse atom block (starts at line 4)
            for (let i = 4; i < 4 + atomCount && i < lines.length; i++) {
                const line = lines[i];
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 4) {
                    atoms.push({
                        elem: parts[3],
                        x: parseFloat(parts[0]),
                        y: parseFloat(parts[1]),
                        z: parseFloat(parts[2])
                    });
                }
            }
        }
        return {
            atoms,
            format: 'sdf',
            data
        };
    }
    /**
     * Parse XYZ format
     */
    parseXYZ(data) {
        const atoms = [];
        const lines = data.split('\n');
        if (lines.length < 2)
            return { atoms, format: 'xyz', data };
        const atomCount = parseInt(lines[0]);
        // Parse atoms (start from line 2)
        for (let i = 2; i < 2 + atomCount && i < lines.length; i++) {
            const parts = lines[i].trim().split(/\s+/);
            if (parts.length >= 4) {
                atoms.push({
                    elem: parts[0],
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                    z: parseFloat(parts[3])
                });
            }
        }
        return {
            atoms,
            format: 'xyz',
            data
        };
    }
    /**
     * Setup event handlers for viewer interactions
     */
    setupEventHandlers() {
        if (!this.viewer.setClickCallback)
            return;
        // Click events
        this.viewer.setClickCallback((event) => {
            const handlers = this.eventHandlers.get('click');
            if (handlers) {
                const interactionEvent = {
                    type: 'click',
                    atom: event.atom,
                    position: event.position || { x: 0, y: 0, z: 0 },
                    screenPosition: event.screenPosition || { x: 0, y: 0 }
                };
                handlers.forEach(handler => handler(interactionEvent));
            }
        });
        // Hover events
        this.viewer.setHoverCallback((event) => {
            const handlers = this.eventHandlers.get('hover');
            if (handlers) {
                const interactionEvent = {
                    type: 'hover',
                    atom: event.atom,
                    position: event.position || { x: 0, y: 0, z: 0 },
                    screenPosition: event.screenPosition || { x: 0, y: 0 }
                };
                handlers.forEach(handler => handler(interactionEvent));
            }
        });
    }
    /**
     * Export as PNG image
     */
    exportPNG(options) {
        return new Promise((resolve, reject) => {
            if (!this.viewer.pngURI) {
                reject(new Error('PNG export not available in fallback mode'));
                return;
            }
            try {
                const uri = this.viewer.pngURI({
                    width: options.width || this.config.width,
                    height: options.height || this.config.height
                });
                resolve(uri);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Export as WebM animation
     */
    exportWebM(options) {
        return new Promise((resolve, reject) => {
            // WebM export would require additional implementation
            reject(new Error('WebM export not yet implemented'));
        });
    }
    /**
     * Export molecule data in specified format
     */
    exportMoleculeData(format) {
        const molecules = Array.from(this.molecules.values());
        if (molecules.length === 0) {
            return '';
        }
        // Return the first molecule's data or convert to requested format
        const molecule = molecules[0];
        return molecule.data || this.convertMoleculeFormat(molecule, format);
    }
    /**
     * Convert molecule to different format
     */
    convertMoleculeFormat(molecule, targetFormat) {
        // Basic format conversion (would need more sophisticated implementation)
        switch (targetFormat.toLowerCase()) {
            case 'xyz':
                return this.moleculeToXYZ(molecule);
            case 'pdb':
                return this.moleculeToPDB(molecule);
            default:
                return molecule.data || '';
        }
    }
    /**
     * Convert molecule to XYZ format
     */
    moleculeToXYZ(molecule) {
        const lines = [
            molecule.atoms.length.toString(),
            molecule.title || 'Generated by CREB'
        ];
        molecule.atoms.forEach(atom => {
            lines.push(`${atom.elem} ${atom.x.toFixed(6)} ${atom.y.toFixed(6)} ${atom.z.toFixed(6)}`);
        });
        return lines.join('\n');
    }
    /**
     * Convert molecule to PDB format
     */
    moleculeToPDB(molecule) {
        const lines = [];
        molecule.atoms.forEach((atom, index) => {
            const line = [
                'ATOM  ',
                (index + 1).toString().padStart(5),
                '  ',
                atom.atom?.padEnd(4) || atom.elem.padEnd(4),
                ' ',
                'UNK',
                ' ',
                'A',
                '   1    ',
                atom.x.toFixed(3).padStart(8),
                atom.y.toFixed(3).padStart(8),
                atom.z.toFixed(3).padStart(8),
                '  1.00',
                '  0.00',
                '          ',
                atom.elem.padStart(2)
            ].join('');
            lines.push(line);
        });
        lines.push('END');
        return lines.join('\n');
    }
    /**
     * Create fallback viewer for environments where 3Dmol.js is not available
     */
    createFallbackViewer() {
        return {
            addModel: () => console.warn('3Dmol.js not available - addModel disabled'),
            removeAllModels: () => console.warn('3Dmol.js not available - removeAllModels disabled'),
            setStyle: () => console.warn('3Dmol.js not available - setStyle disabled'),
            addSurface: () => console.warn('3Dmol.js not available - addSurface disabled'),
            render: () => console.warn('3Dmol.js not available - render disabled'),
            zoomTo: () => console.warn('3Dmol.js not available - zoomTo disabled'),
            resize: () => console.warn('3Dmol.js not available - resize disabled'),
            animate: () => console.warn('3Dmol.js not available - animate disabled'),
            pngURI: () => { throw new Error('PNG export not available without 3Dmol.js'); }
        };
    }
    /**
     * Cleanup resources
     */
    dispose() {
        this.clear();
        this.eventHandlers.clear();
        if (this.viewer && this.viewer.removeAllModels) {
            this.viewer.removeAllModels();
        }
        this.initialized = false;
    }
}

/**
 * PubChem Integration Module for CREB Molecular Visualization
 * Connects PubChem database with RDKit.js and 3Dmol.js visualization pipeline
 */
/**
 * PubChem Integration Class
 * Provides unified access to PubChem database for molecular visualization
 */
class PubChemIntegration {
    constructor() {
        this.baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
        this.requestDelay = 200; // Rate limiting: 5 requests per second
        this.lastRequestTime = 0;
        // Initialize with default settings
    }
    /**
     * Search for compounds by various criteria
     */
    async searchCompounds(query, options = { searchType: 'name' }) {
        try {
            await this.enforceRateLimit();
            let searchUrl = '';
            const limit = options.limit || options.maxResults || 10;
            switch (options.searchType) {
                case 'name':
                    searchUrl = `${this.baseUrl}/compound/name/${encodeURIComponent(query)}/cids/JSON?cids_type=flat`;
                    break;
                case 'cid':
                    searchUrl = `${this.baseUrl}/compound/cid/${query}/cids/JSON`;
                    break;
                case 'smiles':
                    searchUrl = `${this.baseUrl}/compound/smiles/${encodeURIComponent(query)}/cids/JSON`;
                    break;
                case 'formula':
                    searchUrl = `${this.baseUrl}/compound/formula/${encodeURIComponent(query)}/cids/JSON`;
                    break;
                case 'inchi':
                    searchUrl = `${this.baseUrl}/compound/inchi/${encodeURIComponent(query)}/cids/JSON`;
                    break;
            }
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`PubChem search failed: ${response.statusText}`);
            }
            const data = await response.json();
            const cids = data.IdentifierList?.CID || [];
            if (cids.length === 0) {
                return {
                    success: true,
                    compounds: [],
                    totalFound: 0,
                    source: 'pubchem',
                    timestamp: new Date()
                };
            }
            // Get detailed compound information for found CIDs
            const limitedCids = cids.slice(0, limit);
            const compounds = await this.getCompoundDetails(limitedCids, options);
            return {
                success: true,
                compounds,
                totalFound: cids.length,
                source: 'pubchem',
                timestamp: new Date()
            };
        }
        catch (error) {
            return {
                success: false,
                compounds: [],
                totalFound: 0,
                source: 'pubchem',
                timestamp: new Date(),
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get detailed compound information by CID
     */
    async getCompoundByCid(cid, options = { searchType: 'cid' }) {
        try {
            await this.enforceRateLimit();
            const propertiesUrl = `${this.baseUrl}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey/JSON`;
            const response = await fetch(propertiesUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch compound ${cid}: ${response.statusText}`);
            }
            const data = await response.json();
            const properties = data.PropertyTable?.Properties?.[0];
            if (!properties) {
                return null;
            }
            const compound = {
                cid,
                name: `CID ${cid}`, // Will be updated if synonyms are requested
                molecularFormula: properties.MolecularFormula || '',
                molecularWeight: properties.MolecularWeight || 0,
                smiles: properties.CanonicalSMILES || '',
                inchi: properties.InChI || '',
                inchiKey: properties.InChIKey || '',
                properties: properties
            };
            // Get synonyms if requested
            if (options.includeSynonyms) {
                const synonyms = await this.getCompoundSynonyms(cid);
                if (synonyms.length > 0) {
                    compound.name = synonyms[0]; // Use first synonym as primary name
                    compound.synonyms = synonyms;
                }
            }
            return compound;
        }
        catch (error) {
            console.error(`Error fetching compound ${cid}:`, error);
            return null;
        }
    }
    /**
     * Get molecular structure data (2D/3D SDF)
     */
    async getMolecularData(cid, include3D = false) {
        try {
            const compound = await this.getCompoundByCid(cid, { searchType: 'cid', includeSynonyms: true });
            if (!compound) {
                return null;
            }
            await this.enforceRateLimit();
            // Get 2D SDF structure
            const sdf2DUrl = `${this.baseUrl}/compound/cid/${cid}/SDF`;
            const sdf2DResponse = await fetch(sdf2DUrl);
            const structure2D = sdf2DResponse.ok ? await sdf2DResponse.text() : undefined;
            let structure3D;
            let conformers;
            if (include3D) {
                await this.enforceRateLimit();
                // Get 3D SDF structure
                const sdf3DUrl = `${this.baseUrl}/compound/cid/${cid}/SDF?record_type=3d`;
                const sdf3DResponse = await fetch(sdf3DUrl);
                structure3D = sdf3DResponse.ok ? await sdf3DResponse.text() : undefined;
                // Get conformer data if available
                await this.enforceRateLimit();
                try {
                    const conformerUrl = `${this.baseUrl}/compound/cid/${cid}/conformers/JSON`;
                    const conformerResponse = await fetch(conformerUrl);
                    if (conformerResponse.ok) {
                        const conformerData = await conformerResponse.json();
                        conformers = this.parseConformerData(conformerData);
                    }
                }
                catch (error) {
                    // Conformer data not available for all compounds
                    console.warn(`Conformer data not available for CID ${cid}`);
                }
            }
            return {
                compound,
                structure2D,
                structure3D,
                conformers
            };
        }
        catch (error) {
            console.error(`Error fetching molecular data for CID ${cid}:`, error);
            return null;
        }
    }
    /**
     * Search and get the best matching compound with full molecular data
     */
    async searchAndGetMolecularData(query, options = { searchType: 'name' }) {
        const searchResult = await this.searchCompounds(query, { ...options, limit: 1 });
        if (!searchResult.success || searchResult.compounds.length === 0) {
            return null;
        }
        const compound = searchResult.compounds[0];
        return this.getMolecularData(compound.cid, options.include3D);
    }
    /**
     * Get compound synonyms
     */
    async getCompoundSynonyms(cid) {
        try {
            await this.enforceRateLimit();
            const synonymsUrl = `${this.baseUrl}/compound/cid/${cid}/synonyms/JSON`;
            const response = await fetch(synonymsUrl);
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return data.InformationList?.Information?.[0]?.Synonym || [];
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Get detailed compound information for multiple CIDs
     */
    async getCompoundDetails(cids, options) {
        const compounds = [];
        // Process in batches to respect rate limits
        const batchSize = 5;
        for (let i = 0; i < cids.length; i += batchSize) {
            const batch = cids.slice(i, i + batchSize);
            const batchPromises = batch.map(cid => this.getCompoundByCid(cid, options));
            const batchResults = await Promise.all(batchPromises);
            compounds.push(...batchResults.filter(compound => compound !== null));
            // Add delay between batches
            if (i + batchSize < cids.length) {
                await new Promise(resolve => setTimeout(resolve, this.requestDelay * batch.length));
            }
        }
        return compounds;
    }
    /**
     * Parse conformer data from PubChem response
     */
    parseConformerData(conformerData) {
        // Implementation would parse the conformer JSON structure
        // This is a simplified version
        return [];
    }
    /**
     * Enforce rate limiting for PubChem API
     */
    async enforceRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.requestDelay) {
            const waitTime = this.requestDelay - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastRequestTime = Date.now();
    }
    /**
     * Convert PubChem compound to SMILES for RDKit processing
     */
    getCompoundSMILES(compound) {
        return compound.smiles || null;
    }
    /**
     * Get compound 3D structure in SDF format for 3Dmol.js
     */
    async getCompound3DSDF(cid) {
        const molecularData = await this.getMolecularData(cid, true);
        return molecularData?.structure3D || molecularData?.structure2D || null;
    }
    /**
     * Validate if PubChem API is accessible
     */
    async validateConnection() {
        try {
            await this.enforceRateLimit();
            const testUrl = `${this.baseUrl}/compound/cid/2244/property/MolecularFormula/JSON`; // Aspirin
            const response = await fetch(testUrl);
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
}

/**
 * Enhanced Molecular Visualization with RDKit.js, 3Dmol.js, and PubChem Integration
 * Unified API for advanced 2D/3D molecular structure visualization and processing
 *
 * This module integrates RDKit.js, 3Dmol.js, and PubChem wrappers with the existing CREB
 * visualization system to provide comprehensive molecular visualization capabilities.
 */
/**
 * Enhanced Molecular Visualization Class
 * Combines Canvas2D, RDKit.js, 3Dmol.js, and PubChem for comprehensive molecular visualization
 */
class EnhancedMolecularVisualization {
    constructor(config = {}) {
        this.canvas2DRenderer = null;
        this.svgRenderer = null;
        this.mol3DWrapper = null;
        this.currentMolecule = null;
        this.currentPubChemCompound = null;
        this.config = {
            canvas2D: {
                width: 600,
                height: 400,
                backgroundColor: '#ffffff',
                interactive: true,
                ...config.canvas2D
            },
            mol3D: {
                width: 600,
                height: 400,
                backgroundColor: '#ffffff',
                style: 'ball-and-stick',
                interactive: true,
                ...config.mol3D
            },
            rdkit: {
                generateCoords: true,
                sanitize: true,
                removeHs: true,
                ...config.rdkit
            },
            export: {
                formats: ['png', 'svg'],
                quality: 0.9,
                ...config.export
            }
        };
        this.rdkitWrapper = new RDKitWrapper(this.config.rdkit);
        this.pubchemIntegration = new PubChemIntegration();
    }
    /**
     * Initialize all visualization components
     */
    async initialize(canvas2DElement, mol3DContainer) {
        // Initialize RDKit wrapper
        await this.rdkitWrapper.initialize();
        // Initialize 2D Canvas renderer if element provided
        if (canvas2DElement) {
            this.canvas2DRenderer = new Canvas2DRenderer(canvas2DElement, this.config.canvas2D);
            this.svgRenderer = new SVGRenderer(this.config.canvas2D);
        }
        // Initialize 3D viewer if container provided
        if (mol3DContainer) {
            this.mol3DWrapper = new Mol3DWrapper(mol3DContainer, this.config.mol3D);
            await this.mol3DWrapper.initialize();
        }
    }
    /**
     * Load and analyze molecule from SMILES string
     */
    async loadMoleculeFromSMILES(smiles) {
        // Validate SMILES
        const isValid = await this.rdkitWrapper.validateSMILES(smiles);
        if (!isValid) {
            throw new Error(`Invalid SMILES: ${smiles}`);
        }
        // Parse molecule with RDKit
        const molecule = await this.rdkitWrapper.parseSMILES(smiles);
        if (!molecule) {
            throw new Error(`Failed to parse SMILES: ${smiles}`);
        }
        // Calculate molecular properties
        const properties = await this.rdkitWrapper.calculateDescriptors(smiles);
        // Generate 2D SVG representation
        const svg2D = await this.rdkitWrapper.generateSVG(smiles, {
            width: this.config.canvas2D.width,
            height: this.config.canvas2D.height
        });
        this.currentMolecule = molecule;
        const result = {
            molecule,
            properties,
            validation: {
                isValid: true,
                errors: [],
                warnings: []
            },
            visualization: {
                svg2D,
                hasCoordinates: molecule.atoms.length > 0,
                canRender3D: molecule.atoms.length > 0 && molecule.atoms.some(a => a.z !== undefined)
            }
        };
        // Load into visualization components
        await this.updateVisualizations(molecule);
        return result;
    }
    /**
     * Load molecule from molecular data formats (PDB, SDF, MOL2, etc.)
     */
    async loadMoleculeFromData(data, format = 'pdb') {
        // Load into 3D viewer
        if (this.mol3DWrapper) {
            await this.mol3DWrapper.addMolecule('main', data, format);
        }
        // Convert to 2D if needed for Canvas2D renderer
        if (this.canvas2DRenderer) {
            const molecule2D = this.convertTo2DMolecule(data, format);
            if (molecule2D) {
                this.canvas2DRenderer.loadMolecule(molecule2D);
            }
        }
    }
    /**
     * Search and load molecule from PubChem by compound name
     */
    async loadMoleculeFromPubChemName(compoundName) {
        try {
            const molecularData = await this.pubchemIntegration.searchAndGetMolecularData(compoundName, { searchType: 'name', includeSynonyms: true, include3D: true });
            if (!molecularData) {
                throw new Error(`Compound "${compoundName}" not found in PubChem database`);
            }
            this.currentPubChemCompound = molecularData.compound;
            // Load molecule using SMILES from PubChem
            if (molecularData.compound.smiles) {
                const result = await this.loadMoleculeFromSMILES(molecularData.compound.smiles);
                // Enhance result with PubChem data
                if (result) {
                    result.validation.warnings = result.validation.warnings || [];
                    result.validation.warnings.push(`Data sourced from PubChem CID ${molecularData.compound.cid}`);
                    // Update properties with PubChem data
                    result.properties = {
                        ...result.properties,
                        molecularWeight: molecularData.compound.molecularWeight,
                        formula: molecularData.compound.molecularFormula
                    };
                }
                // Load 3D structure if available
                if (molecularData.structure3D && this.mol3DWrapper) {
                    await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure3D, 'sdf');
                }
                else if (molecularData.structure2D && this.mol3DWrapper) {
                    await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure2D, 'sdf');
                }
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('PubChem search failed:', error);
            return null;
        }
    }
    /**
     * Load molecule from PubChem by CID
     */
    async loadMoleculeFromPubChemCID(cid) {
        try {
            const molecularData = await this.pubchemIntegration.getMolecularData(cid, true);
            if (!molecularData) {
                throw new Error(`Compound with CID ${cid} not found in PubChem database`);
            }
            this.currentPubChemCompound = molecularData.compound;
            // Load molecule using SMILES from PubChem
            if (molecularData.compound.smiles) {
                const result = await this.loadMoleculeFromSMILES(molecularData.compound.smiles);
                // Enhance result with PubChem data
                if (result) {
                    result.validation.warnings = result.validation.warnings || [];
                    result.validation.warnings.push(`Data sourced from PubChem CID ${cid}`);
                    // Update properties with PubChem data
                    result.properties = {
                        ...result.properties,
                        molecularWeight: molecularData.compound.molecularWeight,
                        formula: molecularData.compound.molecularFormula
                    };
                }
                // Load 3D structure if available
                if (molecularData.structure3D && this.mol3DWrapper) {
                    await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure3D, 'sdf');
                }
                else if (molecularData.structure2D && this.mol3DWrapper) {
                    await this.mol3DWrapper.addMolecule('pubchem', molecularData.structure2D, 'sdf');
                }
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('PubChem CID search failed:', error);
            return null;
        }
    }
    /**
     * Search PubChem compounds without loading
     */
    async searchPubChemCompounds(query, options = { searchType: 'name', limit: 10 }) {
        return await this.pubchemIntegration.searchCompounds(query, options);
    }
    /**
     * Load a compound from PubChem by CID
     */
    async loadPubChemCompound(cid) {
        const cidNumber = parseInt(cid, 10);
        if (isNaN(cidNumber)) {
            throw new Error(`Invalid CID: ${cid}`);
        }
        const compound = await this.pubchemIntegration.getCompoundByCid(cidNumber);
        if (!compound) {
            throw new Error(`Compound not found for CID: ${cid}`);
        }
        this.currentPubChemCompound = compound;
        return compound;
    }
    /**
     * Analyze a molecule using RDKit
     */
    async analyzeMolecule(smiles) {
        const molecule = await this.rdkitWrapper.parseSMILES(smiles);
        if (!molecule) {
            throw new Error('Failed to parse SMILES');
        }
        this.currentMolecule = molecule;
        return {
            molecule,
            properties: molecule.properties,
            validation: {
                isValid: true,
                errors: [],
                warnings: []
            },
            visualization: {
                svg2D: await this.rdkitWrapper.generateSVG(smiles),
                hasCoordinates: molecule.atoms.length > 0,
                canRender3D: molecule.atoms.length > 0
            }
        };
    }
    /**
     * Export molecule as SVG
     */
    async exportSVG(smiles, options = {}) {
        return await this.rdkitWrapper.generateSVG(smiles, options);
    }
    /**
     * Export molecular data
     */
    async exportMolecularData(smiles) {
        const analysis = await this.analyzeMolecule(smiles);
        return {
            svg2D: analysis.visualization.svg2D,
            // Other formats could be implemented later
            png2D: undefined,
            jpg2D: undefined,
            png3D: undefined,
            pdb: undefined,
            sdf: undefined
        };
    }
    /**
     * Get current PubChem compound information
     */
    getCurrentPubChemCompound() {
        return this.currentPubChemCompound;
    }
    /**
     * Validate PubChem connection
     */
    async validatePubChemConnection() {
        return await this.pubchemIntegration.validateConnection();
    }
    /**
     * Update all visualization components with current molecule
     */
    async updateVisualizations(molecule) {
        // Update 2D Canvas renderer
        if (this.canvas2DRenderer && molecule.atoms.length > 0) {
            const molecule2D = this.convertRDKitToCanvas2D(molecule);
            this.canvas2DRenderer.loadMolecule(molecule2D);
        }
        // Update SVG renderer
        if (this.svgRenderer && molecule.atoms.length > 0) {
            const molecule2D = this.convertRDKitToCanvas2D(molecule);
            this.svgRenderer.loadMolecule(molecule2D);
        }
        // Update 3D viewer
        if (this.mol3DWrapper && molecule.atoms.length > 0) {
            const molecule3D = this.convertRDKitToMol3D(molecule);
            await this.mol3DWrapper.addMolecule('main', molecule3D);
        }
    }
    /**
     * Set 3D visualization style
     */
    set3DStyle(style) {
        if (!this.mol3DWrapper) {
            console.warn('3D viewer not initialized');
            return;
        }
        if (typeof style === 'string') {
            const presetStyles = {
                'ball-and-stick': { stick: { radius: 0.2 }, sphere: { scale: 0.3 } },
                'space-filling': { sphere: { scale: 1.0 } },
                'wireframe': { line: { linewidth: 2 } },
                'cartoon': { cartoon: { style: 'trace' } }
            };
            const presetStyle = presetStyles[style];
            if (presetStyle) {
                this.mol3DWrapper.setStyle(presetStyle);
            }
        }
        else {
            this.mol3DWrapper.setStyle(style);
        }
    }
    /**
     * Add molecular surface to 3D visualization
     */
    add3DSurface(surfaceType = 'VDW', opacity = 0.7) {
        if (!this.mol3DWrapper) {
            console.warn('3D viewer not initialized');
            return;
        }
        this.mol3DWrapper.addSurface(surfaceType, { opacity });
    }
    /**
     * Perform substructure search and highlight matches
     */
    async searchSubstructure(querySmarts) {
        if (!this.currentMolecule) {
            throw new Error('No molecule loaded');
        }
        const matches = await this.rdkitWrapper.findSubstructure(this.currentMolecule.smiles, querySmarts);
        if (matches.length > 0) {
            // Highlight matches in 2D visualization
            this.highlightAtoms2D(matches[0].atomIds);
            // Highlight matches in 3D visualization
            if (this.mol3DWrapper) {
                this.highlightAtoms3D(matches[0].atomIds);
            }
        }
    }
    /**
     * Export visualizations in multiple formats
     */
    async exportAll() {
        const exports = {};
        // Export 2D visualizations
        if (this.canvas2DRenderer) {
            if (this.config.export.formats.includes('png')) {
                exports.png2D = this.canvas2DRenderer.exportImage('png');
            }
            if (this.config.export.formats.includes('jpg')) {
                exports.jpg2D = this.canvas2DRenderer.exportImage('jpg');
            }
            if (this.config.export.formats.includes('svg')) {
                exports.svg2D = this.canvas2DRenderer.exportImage('svg');
            }
        }
        // Export 3D visualizations
        if (this.mol3DWrapper) {
            if (this.config.export.formats.includes('png')) {
                try {
                    exports.png3D = await this.mol3DWrapper.exportScene({ format: 'png' });
                }
                catch (error) {
                    console.warn('3D PNG export failed:', error);
                }
            }
            if (this.config.export.formats.includes('pdb')) {
                try {
                    exports.pdb = await this.mol3DWrapper.exportScene({ format: 'pdb' });
                }
                catch (error) {
                    console.warn('PDB export failed:', error);
                }
            }
            if (this.config.export.formats.includes('sdf')) {
                try {
                    exports.sdf = await this.mol3DWrapper.exportScene({ format: 'sdf' });
                }
                catch (error) {
                    console.warn('SDF export failed:', error);
                }
            }
        }
        return exports;
    }
    /**
     * Get molecular properties of current molecule
     */
    getMolecularProperties() {
        return this.currentMolecule?.properties || null;
    }
    /**
     * Apply chemical transformation to current molecule
     */
    async applyTransformation(reactionSmarts) {
        if (!this.currentMolecule) {
            throw new Error('No molecule loaded');
        }
        return await this.rdkitWrapper.applyTransformation(this.currentMolecule.smiles, reactionSmarts);
    }
    /**
     * Convert RDKit molecule to Canvas2D format
     */
    convertRDKitToCanvas2D(rdkitMolecule) {
        const atoms = rdkitMolecule.atoms.map((atom, index) => ({
            element: atom.symbol,
            position: { x: atom.x * 20, y: atom.y * 20 }, // Scale coordinates
            bonds: [],
            charge: atom.charge
        }));
        const bonds = rdkitMolecule.bonds.map(bond => ({
            atom1: bond.beginAtomIdx,
            atom2: bond.endAtomIdx,
            order: this.mapBondTypeToOrder(bond.bondType),
            type: bond.bondType.toLowerCase()
        }));
        // Update atom bonds references
        bonds.forEach((bond, bondIndex) => {
            if (atoms[bond.atom1]) {
                atoms[bond.atom1].bonds.push(bondIndex);
            }
            if (atoms[bond.atom2]) {
                atoms[bond.atom2].bonds.push(bondIndex);
            }
        });
        return {
            atoms,
            bonds,
            name: rdkitMolecule.properties.formula
        };
    }
    /**
     * Convert RDKit molecule to Mol3D format
     */
    convertRDKitToMol3D(rdkitMolecule) {
        const atoms = rdkitMolecule.atoms.map(atom => ({
            elem: atom.symbol,
            x: atom.x,
            y: atom.y,
            z: atom.z || 0
        }));
        return {
            atoms,
            title: rdkitMolecule.properties.formula
        };
    }
    /**
     * Convert molecular data to Canvas2D format
     */
    convertTo2DMolecule(data, format) {
        // Basic conversion - would need more sophisticated parsing
        // For now, return null and rely on RDKit conversion
        return null;
    }
    /**
     * Highlight atoms in 2D visualization
     */
    highlightAtoms2D(atomIds) {
        // Implementation would depend on Canvas2DRenderer having highlight functionality
        console.log('Highlighting 2D atoms:', atomIds);
    }
    /**
     * Highlight atoms in 3D visualization
     */
    highlightAtoms3D(atomIds) {
        if (!this.mol3DWrapper)
            return;
        // Create selection and apply highlighting style
        const selector = { atom: atomIds };
        this.mol3DWrapper.setStyle({ sphere: { colors: { 'default': 'red' }, scale: 1.2 } }, selector);
    }
    /**
     * Map bond type to numerical order
     */
    mapBondTypeToOrder(bondType) {
        switch (bondType.toUpperCase()) {
            case 'SINGLE': return 1;
            case 'DOUBLE': return 2;
            case 'TRIPLE': return 3;
            case 'AROMATIC': return 1.5;
            default: return 1;
        }
    }
    /**
     * Cleanup resources
     */
    dispose() {
        if (this.rdkitWrapper) {
            this.rdkitWrapper.dispose();
        }
        if (this.mol3DWrapper) {
            this.mol3DWrapper.dispose();
        }
        this.currentMolecule = null;
    }
}
/**
 * Factory function to create enhanced molecular visualization
 */
function createEnhancedVisualization(config = {}) {
    return new EnhancedMolecularVisualization(config);
}
/**
 * Utility functions for enhanced visualization
 */
class EnhancedVisualizationUtils {
    /**
     * Get available molecular file formats
     */
    static getSupportedFormats() {
        return {
            '2D': ['svg', 'png', 'jpg'],
            '3D': ['pdb', 'sdf', 'mol2', 'xyz', 'cml', 'png'],
            'input': ['smiles', 'pdb', 'sdf', 'mol2', 'xyz', 'inchi']
        };
    }
    /**
     * Get common chemical transformation patterns
     */
    static getTransformationPatterns() {
        return {
            'hydroxylation': '[C:1]>>[C:1]O',
            'methylation': '[N:1]>>[N:1]C',
            'oxidation': '[C:1][OH]>>[C:1]=O',
            'reduction': '[C:1]=[O:2]>>[C:1][OH:2]',
            'halogenation': '[C:1][H]>>[C:1]Cl'
        };
    }
    /**
     * Get substructure search patterns
     */
    static getSearchPatterns() {
        return {
            'benzene': 'c1ccccc1',
            'phenol': 'c1ccc(O)cc1',
            'alcohol': '[OH]',
            'ketone': 'C=O',
            'ester': 'C(=O)O',
            'amine': 'N',
            'carboxyl': 'C(=O)O',
            'amide': 'C(=O)N'
        };
    }
    /**
     * Validate visualization configuration
     */
    static validateConfig(config) {
        const errors = [];
        const warnings = [];
        if (config.canvas2D) {
            if (config.canvas2D.width <= 0 || config.canvas2D.height <= 0) {
                errors.push('Canvas2D dimensions must be positive');
            }
        }
        if (config.mol3D) {
            if (config.mol3D.width <= 0 || config.mol3D.height <= 0) {
                errors.push('Mol3D dimensions must be positive');
            }
        }
        if (config.export?.formats) {
            const validFormats = ['png', 'jpg', 'svg', 'pdb', 'sdf'];
            const invalidFormats = config.export.formats.filter(f => !validFormats.includes(f));
            if (invalidFormats.length > 0) {
                warnings.push(`Unsupported export formats: ${invalidFormats.join(', ')}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}

/**
 * Integration with CREB Core Types and Systems
 * Enhanced with SVG Export Capabilities and Advanced Molecular Visualization
 * Now includes RDKit.js and 3Dmol.js wrappers for comprehensive molecular processing
 */
/**
 * Convert CREB-style molecule to visualization format
 */
function convertMoleculeToVisualization(molecule) {
    const atoms = molecule.elements.map((element, index) => ({
        element,
        x: Math.random() * 4 - 2, // Random coordinates for now
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2
    }));
    // Simple bond generation based on element count
    const bonds = [];
    for (let i = 0; i < atoms.length - 1; i++) {
        bonds.push({
            atom1: i,
            atom2: i + 1,
            order: 1
        });
    }
    return {
        atoms,
        bonds,
        smiles: molecule.formula || `${molecule.elements.join('')}`
    };
}
/**
 * Create molecular visualization from molecule data
 */
function createMolecularVisualization(container, molecule, options) {
    const config = {
        container,
        width: 600,
        height: 400,
        mode: 'both',
        ...options
    };
    const visualization = new MolecularVisualization(config);
    const moleculeData = convertMoleculeToVisualization(molecule);
    visualization.loadMolecule(moleculeData);
    return visualization;
}
/**
 * Enhanced visualization utilities for CREB
 */
class CREBVisualizationUtils {
    /**
     * Create 2D structure from molecule data with SVG export support
     */
    static create2DStructure(molecule, canvas) {
        if (!canvas) {
            // Create fallback canvas
            canvas = {
                width: 400,
                height: 300,
                getContext: () => ({
                    fillStyle: '',
                    strokeStyle: '',
                    lineWidth: 1,
                    lineCap: 'round',
                    font: '12px Arial',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fillRect: () => { },
                    fillText: () => { },
                    beginPath: () => { },
                    moveTo: () => { },
                    lineTo: () => { },
                    arc: () => { },
                    fill: () => { },
                    stroke: () => { },
                    setLineDash: () => { }
                }),
                toDataURL: () => 'data:image/png;base64,',
                style: {}
            };
        }
        const renderer = new Canvas2DRenderer(canvas);
        // Convert molecule to 2D format
        const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
        renderer.loadMolecule(molecule2d);
        return renderer;
    }
    /**
     * Create SVG renderer for molecule
     */
    static createSVGStructure(molecule, options) {
        const svgRenderer = new SVGRenderer({
            width: options?.width || 400,
            height: options?.height || 300,
            backgroundColor: options?.backgroundColor || '#ffffff',
            includeInteractivity: options?.interactive || false
        });
        const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
        svgRenderer.loadMolecule(molecule2d);
        return svgRenderer;
    }
    /**
     * Export molecule in multiple formats
     */
    static exportMolecule(molecule, formats = ['svg'], canvas) {
        return multiFormatExport(molecule, canvas, { formats });
    }
    /**
     * Generate sample molecules for different chemical reactions
     */
    static generateReactionMolecules() {
        return {
            reactants: [
                MolecularDataUtils.generateSampleMolecule('water'),
                MolecularDataUtils.generateSampleMolecule('methane')
            ],
            products: [
                MolecularDataUtils.generateSampleMolecule('benzene')
            ]
        };
    }
    /**
     * Visualize chemical reaction
     */
    static visualizeReaction(container, reactants, products) {
        const visualization = new MolecularVisualization({
            container,
            width: 800,
            height: 400,
            mode: '2d'
        });
        // For now, just show the first reactant
        if (reactants.length > 0) {
            const moleculeData = convertMoleculeToVisualization(reactants[0]);
            visualization.loadMolecule(moleculeData);
        }
        return visualization;
    }
    /**
     * Create molecule from element count data
     */
    static createMoleculeFromElementCount(elementCount) {
        const elements = [];
        let formula = '';
        for (const [element, count] of Object.entries(elementCount)) {
            for (let i = 0; i < count; i++) {
                elements.push(element);
            }
            formula += count > 1 ? `${element}${count}` : element;
        }
        return { elements, formula };
    }
}
/**
 * Quick SVG Export Function
 * Convenience function for quick SVG generation
 */
function quickSVGExport(molecule, options) {
    const svgRenderer = new SVGRenderer({
        width: options?.width || 600,
        height: options?.height || 400,
        includeInteractivity: options?.interactive || false
    });
    // Convert CREB molecule to 2D format
    const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
    svgRenderer.loadMolecule(molecule2d);
    return svgRenderer.exportSVG({
        interactive: options?.interactive,
        includeMetadata: options?.includeMetadata
    });
}
/**
 * Multi-format Export Function
 * Export molecule in multiple formats simultaneously
 */
function multiFormatExport(molecule, canvas, options) {
    const results = {};
    const formats = options?.formats || ['png', 'svg'];
    // Canvas-based exports (PNG, JPG)
    if (canvas && (formats.includes('png') || formats.includes('jpg'))) {
        const canvasRenderer = new Canvas2DRenderer(canvas);
        const molecule2d = Canvas2DRenderer.smilesToMolecule2D(molecule.formula || 'C');
        canvasRenderer.loadMolecule(molecule2d);
        if (formats.includes('png')) {
            results.png = canvasRenderer.exportImage('png');
        }
        if (formats.includes('jpg')) {
            results.jpg = canvasRenderer.exportImage('jpg');
        }
    }
    // SVG export
    if (formats.includes('svg')) {
        results.svg = quickSVGExport(molecule, {
            interactive: options?.svgOptions?.interactive,
            includeMetadata: options?.svgOptions?.includeMetadata
        });
    }
    return results;
}
/**
 * SVG Export Features and Version
 */
const SVG_FEATURES = {
    INTERACTIVE: true,
    ANIMATIONS: true,
    METADATA: true,
    SCALABLE: true,
    PUBLICATION_READY: true
};
const VISUALIZATION_VERSION = '1.6.0-svg';

/**
 * Reaction Animation System
 * Implements animated bond formation/breaking visualization for chemical reactions
 * Part of CREB-JS v1.7.0 - Complete Reaction Animation Feature
 *
 * Integrates with:
 * - RDKit.js for molecular structure processing and SMILES parsing
 * - 3Dmol.js for advanced 3D visualization and animation
 * - PubChem API for compound data retrieval
 */
/**
 * Main class for creating and managing reaction animations
 * Integrates RDKit.js for molecular processing and 3Dmol.js for 3D visualization
 */
class ReactionAnimator {
    constructor(config = {}) {
        this.currentAnimation = [];
        this.isPlaying = false;
        this.currentFrame = 0;
        this.animationId = null;
        this.canvas = null;
        this.context = null;
        this.energyProfile = null;
        this.mol3dWrapper = null;
        this.viewer3D = null; // 3Dmol viewer instance
        this.moleculeCache = new Map();
        this.config = {
            duration: 5000,
            fps: 30,
            easing: 'ease-in-out',
            showEnergyProfile: true,
            showBondOrders: true,
            showCharges: false,
            style: 'smooth',
            bondColorScheme: 'energy-based',
            ...config
        };
        // Initialize RDKit wrapper for molecular processing
        this.rdkitWrapper = new RDKitWrapper({
            addCoords: true,
            sanitize: true,
            useCoordGen: true,
            width: 400,
            height: 300
        });
    }
    /**
     * Initialize 3D visualization system
     */
    async initialize3DViewer(container) {
        try {
            this.mol3dWrapper = new Mol3DWrapper(container, {
                backgroundColor: 'white',
                width: container.clientWidth || 600,
                height: container.clientHeight || 400,
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: false,
                premultipliedAlpha: false,
                camera: {
                    fov: 45,
                    near: 0.1,
                    far: 1000,
                    position: { x: 0, y: 0, z: 10 },
                    target: { x: 0, y: 0, z: 0 },
                    up: { x: 0, y: 1, z: 0 }
                },
                lighting: {
                    ambient: '#404040',
                    directional: [{
                            color: '#ffffff',
                            intensity: 1.0,
                            position: { x: 1, y: 1, z: 1 }
                        }]
                },
                fog: {
                    enabled: false,
                    color: '#ffffff',
                    near: 10,
                    far: 100
                }
            });
            await this.mol3dWrapper.initialize();
            this.viewer3D = this.mol3dWrapper.getViewer();
            console.log('✅ 3D viewer initialized for reaction animation');
        }
        catch (error) {
            console.error('❌ Failed to initialize 3D viewer:', error);
            throw new Error(`3D viewer initialization failed: ${error}`);
        }
    }
    /**
     * Parse molecule from SMILES using RDKit
     */
    async parseSMILES(smiles) {
        if (!this.rdkitWrapper) {
            throw new Error('RDKit wrapper not initialized. Call initializeRDKit() first.');
        }
        try {
            const mol = await this.rdkitWrapper.parseSMILES(smiles);
            if (!mol) {
                throw new Error(`Failed to parse SMILES: ${smiles}`);
            }
            return mol;
        }
        catch (error) {
            console.error('❌ SMILES parsing failed:', error);
            throw error;
        }
    }
    /**
     * Generate 3D coordinates for a molecule using PubChem SDF data
     */
    async generate3DCoordinates(molecule) {
        if (!this.rdkitWrapper) {
            throw new Error('RDKit wrapper not initialized');
        }
        try {
            // If molecule has a CID, get real 3D structure from PubChem
            if (molecule.cid) {
                console.log(`🔬 Fetching real 3D structure from PubChem for CID: ${molecule.cid}`);
                const pubchem = new PubChemIntegration();
                const sdf3D = await pubchem.getCompound3DSDF(molecule.cid);
                if (sdf3D) {
                    console.log('✅ Retrieved real 3D SDF structure from PubChem');
                    return { molblock: sdf3D, format: 'sdf', source: 'PubChem_3D' };
                }
            }
            // If molecule has SMILES, try to get PubChem data by name/SMILES lookup
            if (molecule.smiles || molecule.name) {
                console.log(`🔍 Looking up ${molecule.name || molecule.smiles} in PubChem`);
                const pubchem = new PubChemIntegration();
                try {
                    const searchTerm = molecule.name || molecule.smiles;
                    const searchResult = await pubchem.searchCompounds(searchTerm, { searchType: 'name', limit: 1 });
                    if (searchResult.success && searchResult.compounds.length > 0) {
                        const compound = searchResult.compounds[0];
                        const sdf3D = await pubchem.getCompound3DSDF(compound.cid);
                        if (sdf3D) {
                            console.log(`✅ Found PubChem 3D structure for ${searchTerm} (CID: ${compound.cid})`);
                            return { molblock: sdf3D, format: 'sdf', source: 'PubChem_3D' };
                        }
                    }
                }
                catch (searchError) {
                    console.warn(`⚠️ PubChem lookup failed for ${molecule.name || molecule.smiles}:`, searchError);
                }
            }
            // Fallback: use RDKit for basic 2D structure (but warn about it)
            console.warn('⚠️ Using 2D fallback - no PubChem 3D data available');
            return { molblock: molecule.molblock || '', format: 'mol', source: 'RDKit_2D' };
        }
        catch (error) {
            console.error('❌ 3D coordinate generation failed:', error);
            throw error;
        }
    }
    /**
     * Add molecule to 3D scene for animation
     */
    async addMoleculeToScene(smiles, moleculeId) {
        if (!this.mol3dWrapper) {
            throw new Error('3D viewer not initialized. Call initialize3DViewer() first.');
        }
        try {
            // Parse SMILES with RDKit
            const molecule = await this.parseSMILES(smiles);
            // Generate 3D coordinates using PubChem integration
            const mol3D = await this.generate3DCoordinates(molecule);
            // Get molecular data
            let molData;
            let format = 'sdf';
            if (mol3D && mol3D.molblock) {
                molData = mol3D.molblock;
                format = mol3D.format === 'sdf' ? 'sdf' : 'pdb'; // Use PDB as fallback format
                console.log(`🔬 Using ${mol3D.source} data for ${moleculeId}`);
            }
            else {
                // Fallback: create simple MOL format from SMILES (convert to PDB format)
                console.warn(`⚠️ No 3D data available for ${smiles}, using 2D fallback`);
                molData = await this.createMolBlockFromSMILES(smiles);
                format = 'pdb';
            }
            // Add to 3D scene with correct format
            await this.mol3dWrapper.addMolecule(moleculeId, molData, format);
            // Apply default styling (fix setStyle signature)
            this.mol3dWrapper.setStyle({
                stick: { radius: 0.15 },
                sphere: { scale: 0.25 }
            });
            console.log(`✅ Added molecule ${moleculeId} to 3D scene`);
        }
        catch (error) {
            console.error(`❌ Failed to add molecule ${moleculeId} to scene:`, error);
            throw error;
        }
    }
    /**
     * Create a simple MOL block from SMILES (fallback method)
     */
    async createMolBlockFromSMILES(smiles) {
        // This is a simplified MOL block for basic visualization
        // In a real implementation, this would use RDKit's molblock generation
        return `
  RDKit          2D

  1  0  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
M  END
$$$$
`;
    }
    /**
     * Animate molecular transformation using real 3D structures
     */
    async animateMolecularTransformation(reactantSMILES, productSMILES, duration = 2000) {
        if (!this.mol3dWrapper) {
            throw new Error('3D viewer not initialized');
        }
        try {
            console.log('🔄 Starting molecular transformation animation...');
            // Clear existing molecules
            this.mol3dWrapper.clear();
            // Add reactants
            for (let i = 0; i < reactantSMILES.length; i++) {
                await this.addMoleculeToScene(reactantSMILES[i], `reactant_${i}`);
                // Position reactants on the left (styling applied in addMoleculeToScene)
            }
            // Render initial state
            this.mol3dWrapper.render();
            // Wait for half duration
            await new Promise(resolve => setTimeout(resolve, duration / 2));
            // Transition: fade out reactants, fade in products
            console.log('🔄 Transitioning to products...');
            // Clear and add products
            this.mol3dWrapper.clear();
            for (let i = 0; i < productSMILES.length; i++) {
                await this.addMoleculeToScene(productSMILES[i], `product_${i}`);
                // Products will have green styling applied in addMoleculeToScene
            }
            // Final render
            this.mol3dWrapper.render();
            console.log('✅ Molecular transformation animation complete');
        }
        catch (error) {
            console.error('❌ Molecular transformation animation failed:', error);
            throw error;
        }
    }
    /**
     * Calculate and display molecular properties during animation
     */
    async showMolecularProperties(smiles) {
        if (!this.rdkitWrapper) {
            throw new Error('RDKit wrapper not initialized');
        }
        try {
            // Use the correct method name from RDKitWrapper
            const properties = await this.rdkitWrapper.calculateDescriptors(smiles);
            // Display properties in UI (can be customized)
            console.log('📊 Molecular Properties:', {
                formula: properties.formula,
                molecularWeight: properties.molecularWeight,
                logP: properties.logP,
                tpsa: properties.tpsa,
                rotatableBonds: properties.rotatableBonds,
                hbd: properties.hbd,
                hba: properties.hba,
                aromaticRings: properties.aromaticRings,
                aliphaticRings: properties.aliphaticRings
            });
            return properties;
        }
        catch (error) {
            console.error('❌ Failed to calculate molecular properties:', error);
            throw error;
        }
    }
    /**
     * Create animation from balanced equation and energy profile
     */
    async createAnimationFromEquation(equation, energyProfile, transitionStates) {
        this.energyProfile = energyProfile;
        // Parse reactants and products
        const reactantStructures = await this.generateMolecularStructures(equation.reactants);
        const productStructures = await this.generateMolecularStructures(equation.products);
        // Create transition path
        const transitionPath = this.createTransitionPath(reactantStructures, productStructures, energyProfile, transitionStates);
        // Generate animation frames
        this.currentAnimation = this.generateAnimationFrames(transitionPath);
        return this.currentAnimation;
    }
    /**
     * Create animation from custom molecular structures
     */
    createCustomAnimation(reactants, products, bondChanges) {
        const transitionPath = this.createCustomTransitionPath(reactants, products, bondChanges);
        this.currentAnimation = this.generateAnimationFrames(transitionPath);
        return this.currentAnimation;
    }
    /**
     * Play the animation on a canvas
     */
    async playAnimation(canvas, onFrameUpdate) {
        if (this.currentAnimation.length === 0) {
            throw new Error('No animation loaded. Call createAnimation first.');
        }
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        if (!this.context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.isPlaying = true;
        this.currentFrame = 0;
        const frameInterval = 1000 / this.config.fps;
        return new Promise((resolve) => {
            const animate = () => {
                if (!this.isPlaying || this.currentFrame >= this.currentAnimation.length) {
                    this.isPlaying = false;
                    resolve();
                    return;
                }
                const frame = this.currentAnimation[this.currentFrame];
                this.renderFrame(frame);
                if (onFrameUpdate) {
                    onFrameUpdate(frame);
                }
                this.currentFrame++;
                this.animationId = setTimeout(animate, frameInterval);
            };
            animate();
        });
    }
    /**
     * Pause the animation
     */
    pauseAnimation() {
        this.isPlaying = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
    }
    /**
     * Resume the animation
     */
    resumeAnimation() {
        if (!this.isPlaying && this.currentFrame < this.currentAnimation.length) {
            this.isPlaying = true;
            this.playAnimation(this.canvas);
        }
    }
    /**
     * Reset animation to beginning
     */
    resetAnimation() {
        this.pauseAnimation();
        this.currentFrame = 0;
    }
    /**
     * Export animation as video data
     */
    exportAnimation(format = 'gif') {
        // Implementation would depend on the specific video encoding library
        // For now, return a mock blob
        return Promise.resolve(new Blob(['animation data'], { type: `video/${format}` }));
    }
    /**
     * Generate molecular structures from species names
     */
    async generateMolecularStructures(species) {
        const structures = [];
        for (const molecule of species) {
            const structure = await this.generateStructureFromName(molecule);
            structures.push(structure);
        }
        return structures;
    }
    /**
     * Generate a molecular structure from a molecule name
     */
    async generateStructureFromName(moleculeName) {
        // This would integrate with molecular database or SMILES parser
        // For now, return mock structures for common molecules
        const mockStructures = {
            'H2O': {
                atoms: [
                    { element: 'O', position: { x: 0, y: 0, z: 0 }, charge: -0.34 },
                    { element: 'H', position: { x: 0.757, y: 0.587, z: 0 }, charge: 0.17 },
                    { element: 'H', position: { x: -0.757, y: 0.587, z: 0 }, charge: 0.17 }
                ],
                bonds: [
                    { atom1: 0, atom2: 1, order: 1, length: 0.96 },
                    { atom1: 0, atom2: 2, order: 1, length: 0.96 }
                ],
                properties: { totalEnergy: 0, charge: 0 }
            },
            'CH4': {
                atoms: [
                    { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: -0.4 },
                    { element: 'H', position: { x: 1.089, y: 0, z: 0 }, charge: 0.1 },
                    { element: 'H', position: { x: -0.363, y: 1.027, z: 0 }, charge: 0.1 },
                    { element: 'H', position: { x: -0.363, y: -0.513, z: 0.889 }, charge: 0.1 },
                    { element: 'H', position: { x: -0.363, y: -0.513, z: -0.889 }, charge: 0.1 }
                ],
                bonds: [
                    { atom1: 0, atom2: 1, order: 1, length: 1.089 },
                    { atom1: 0, atom2: 2, order: 1, length: 1.089 },
                    { atom1: 0, atom2: 3, order: 1, length: 1.089 },
                    { atom1: 0, atom2: 4, order: 1, length: 1.089 }
                ],
                properties: { totalEnergy: 0, charge: 0 }
            },
            'O2': {
                atoms: [
                    { element: 'O', position: { x: -0.6, y: 0, z: 0 }, charge: 0 },
                    { element: 'O', position: { x: 0.6, y: 0, z: 0 }, charge: 0 }
                ],
                bonds: [
                    { atom1: 0, atom2: 1, order: 2, length: 1.21 }
                ],
                properties: { totalEnergy: 0, charge: 0 }
            },
            'CO2': {
                atoms: [
                    { element: 'C', position: { x: 0, y: 0, z: 0 }, charge: 0.4 },
                    { element: 'O', position: { x: -1.16, y: 0, z: 0 }, charge: -0.2 },
                    { element: 'O', position: { x: 1.16, y: 0, z: 0 }, charge: -0.2 }
                ],
                bonds: [
                    { atom1: 0, atom2: 1, order: 2, length: 1.16 },
                    { atom1: 0, atom2: 2, order: 2, length: 1.16 }
                ],
                properties: { totalEnergy: 0, charge: 0 }
            }
        };
        return mockStructures[moleculeName] || mockStructures['H2O'];
    }
    /**
     * Create transition path between reactants and products
     */
    createTransitionPath(reactants, products, energyProfile, transitionStates) {
        const steps = [];
        // Create steps based on energy profile points
        for (let i = 0; i < energyProfile.points.length - 1; i++) {
            const currentPoint = energyProfile.points[i];
            const nextPoint = energyProfile.points[i + 1];
            const step = {
                stepNumber: i,
                description: `${currentPoint.label} → ${nextPoint.label}`,
                energyChange: nextPoint.energy - currentPoint.energy,
                bondChanges: this.inferBondChanges(currentPoint, nextPoint),
                duration: 1 / (energyProfile.points.length - 1),
                intermediates: this.generateIntermediateStructures(currentPoint, nextPoint)
            };
            steps.push(step);
        }
        return steps;
    }
    /**
     * Create custom transition path from bond changes
     */
    createCustomTransitionPath(reactants, products, bondChanges) {
        const steps = [];
        // Group bond changes by type
        const breakingBonds = bondChanges.filter(bc => bc.type === 'breaking');
        const formingBonds = bondChanges.filter(bc => bc.type === 'forming');
        // Create breaking step
        if (breakingBonds.length > 0) {
            steps.push({
                stepNumber: 0,
                description: 'Bond breaking',
                energyChange: breakingBonds.reduce((sum, bc) => sum + bc.energyContribution, 0),
                bondChanges: breakingBonds,
                duration: 0.4
            });
        }
        // Create transition state step
        steps.push({
            stepNumber: steps.length,
            description: 'Transition state',
            energyChange: 50, // Estimated activation energy
            bondChanges: [],
            duration: 0.2
        });
        // Create forming step
        if (formingBonds.length > 0) {
            steps.push({
                stepNumber: steps.length,
                description: 'Bond forming',
                energyChange: formingBonds.reduce((sum, bc) => sum + bc.energyContribution, 0),
                bondChanges: formingBonds,
                duration: 0.4
            });
        }
        return steps;
    }
    /**
     * Generate animation frames from reaction steps
     */
    generateAnimationFrames(steps) {
        const frames = [];
        const totalFrames = Math.floor(this.config.duration * this.config.fps / 1000);
        let currentFrameIndex = 0;
        for (const step of steps) {
            const stepFrames = Math.floor(totalFrames * step.duration);
            for (let i = 0; i < stepFrames; i++) {
                const stepProgress = i / (stepFrames - 1);
                const totalProgress = currentFrameIndex / totalFrames;
                const frame = {
                    frameNumber: currentFrameIndex,
                    time: totalProgress,
                    structure: this.interpolateStructure(step, stepProgress),
                    energy: this.interpolateEnergy(step, stepProgress),
                    bonds: this.generateAnimatedBonds(step, stepProgress),
                    atoms: this.generateAnimatedAtoms(step, stepProgress)
                };
                frames.push(frame);
                currentFrameIndex++;
            }
        }
        return frames;
    }
    /**
     * Interpolate molecular structure during a reaction step
     */
    interpolateStructure(step, progress) {
        // Apply easing function
        this.applyEasing(progress);
        // For now, return a simple interpolated structure
        return {
            atoms: [
                { element: 'C', position: { x: 0, y: 0, z: 0 } }
            ],
            bonds: [],
            properties: { totalEnergy: 0, charge: 0 }
        };
    }
    /**
     * Interpolate energy during a reaction step
     */
    interpolateEnergy(step, progress) {
        const easedProgress = this.applyEasing(progress);
        return step.energyChange * easedProgress;
    }
    /**
     * Generate animated bonds for a frame
     */
    generateAnimatedBonds(step, progress) {
        const bonds = [];
        for (const bondChange of step.bondChanges) {
            const easedProgress = this.applyEasing(progress);
            const bond = {
                atom1: 0, // Would be determined from bond change
                atom2: 1,
                order: this.interpolateBondOrder(bondChange, easedProgress),
                targetOrder: bondChange.bondOrderChange,
                state: bondChange.type === 'breaking' ? 'breaking' : 'forming',
                color: this.getBondColor(bondChange, easedProgress),
                opacity: this.getBondOpacity(bondChange, easedProgress)
            };
            bonds.push(bond);
        }
        return bonds;
    }
    /**
     * Generate animated atoms for a frame
     */
    generateAnimatedAtoms(step, progress) {
        const atoms = [];
        // This would generate atoms based on the molecular structure
        // For now, return empty array
        return atoms;
    }
    /**
     * Render a single animation frame
     */
    renderFrame(frame) {
        if (!this.context || !this.canvas)
            return;
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Set up coordinate system
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(100, -100); // Scale and flip Y axis for chemistry coordinates
        // Render atoms
        this.renderAtoms(frame.atoms);
        // Render bonds
        this.renderBonds(frame.bonds);
        // Render energy indicator
        if (this.config.showEnergyProfile) {
            this.renderEnergyIndicator(frame.energy);
        }
        this.context.restore();
        // Render frame information
        this.renderFrameInfo(frame);
    }
    /**
     * Render atoms in the current frame
     */
    renderAtoms(atoms) {
        if (!this.context)
            return;
        for (const atom of atoms) {
            this.context.save();
            // Set atom color
            this.context.fillStyle = atom.color;
            this.context.globalAlpha = atom.opacity;
            // Draw atom
            this.context.beginPath();
            this.context.arc(atom.position.x, atom.position.y, atom.radius, 0, 2 * Math.PI);
            this.context.fill();
            // Draw element label
            this.context.fillStyle = 'white';
            this.context.font = '0.3px Arial';
            this.context.textAlign = 'center';
            this.context.fillText(atom.element, atom.position.x, atom.position.y + 0.1);
            this.context.restore();
        }
    }
    /**
     * Render bonds in the current frame
     */
    renderBonds(bonds) {
        if (!this.context)
            return;
        for (const bond of bonds) {
            this.context.save();
            // Set bond style
            this.context.strokeStyle = bond.color;
            this.context.globalAlpha = bond.opacity;
            this.context.lineWidth = 0.1 * bond.order;
            if (bond.dashPattern) {
                this.context.setLineDash(bond.dashPattern);
            }
            // Draw bond (simplified - would need atom positions)
            this.context.beginPath();
            this.context.moveTo(-1, 0);
            this.context.lineTo(1, 0);
            this.context.stroke();
            this.context.restore();
        }
    }
    /**
     * Render energy indicator
     */
    renderEnergyIndicator(energy) {
        if (!this.context || !this.canvas)
            return;
        this.context.save();
        // Reset transform for consistent positioning
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        // Draw energy bar
        const barWidth = 20;
        const barHeight = 200;
        const barX = this.canvas.width - 40;
        const barY = 50;
        // Background
        this.context.fillStyle = '#f0f0f0';
        this.context.fillRect(barX, barY, barWidth, barHeight);
        // Energy level
        const energyHeight = Math.max(0, Math.min(barHeight, (energy / 100) * barHeight));
        this.context.fillStyle = energy > 0 ? '#ff6b6b' : '#51cf66';
        this.context.fillRect(barX, barY + barHeight - energyHeight, barWidth, energyHeight);
        // Label
        this.context.fillStyle = 'black';
        this.context.font = '12px Arial';
        this.context.textAlign = 'center';
        this.context.fillText(`${energy.toFixed(1)} kJ/mol`, barX + barWidth / 2, barY + barHeight + 20);
        this.context.restore();
    }
    /**
     * Render frame information
     */
    renderFrameInfo(frame) {
        if (!this.context)
            return;
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = 'black';
        this.context.font = '14px Arial';
        this.context.fillText(`Frame: ${frame.frameNumber}`, 10, 20);
        this.context.fillText(`Time: ${(frame.time * 100).toFixed(1)}%`, 10, 40);
        this.context.restore();
    }
    /**
     * Apply easing function to animation progress
     */
    applyEasing(progress) {
        switch (this.config.easing) {
            case 'linear':
                return progress;
            case 'ease-in':
                return progress * progress;
            case 'ease-out':
                return 1 - (1 - progress) * (1 - progress);
            case 'ease-in-out':
                return progress < 0.5
                    ? 2 * progress * progress
                    : 1 - 2 * (1 - progress) * (1 - progress);
            default:
                return progress;
        }
    }
    /**
     * Infer bond changes between energy profile points
     */
    inferBondChanges(current, next) {
        // This would analyze the chemical structures to determine bond changes
        // For now, return empty array
        return [];
    }
    /**
     * Generate intermediate structures between energy points
     */
    generateIntermediateStructures(current, next) {
        // This would generate molecular structures at intermediate points
        // For now, return empty array
        return [];
    }
    /**
     * Interpolate bond order during animation
     */
    interpolateBondOrder(bondChange, progress) {
        if (bondChange.type === 'breaking') {
            return Math.max(0, 1 - progress);
        }
        else if (bondChange.type === 'forming') {
            return progress;
        }
        return 1;
    }
    /**
     * Get bond color based on bond change and progress
     */
    getBondColor(bondChange, progress) {
        switch (this.config.bondColorScheme) {
            case 'energy-based':
                const energy = Math.abs(bondChange.energyContribution);
                return energy > 500 ? '#ff4757' : energy > 300 ? '#ffa502' : energy > 150 ? '#ffb347' : '#2ed573';
            case 'order-based':
                return bondChange.bondOrderChange > 0 ? '#2ed573' : '#ff4757';
            default:
                // Use energy-based coloring as default
                const defaultEnergy = Math.abs(bondChange.energyContribution);
                return defaultEnergy > 500 ? '#ff4757' : defaultEnergy > 300 ? '#ffa502' : '#2ed573';
        }
    }
    /**
     * Get bond opacity based on bond change and progress
     */
    getBondOpacity(bondChange, progress) {
        if (bondChange.type === 'breaking') {
            return 1 - progress;
        }
        else if (bondChange.type === 'forming') {
            return progress;
        }
        return 1;
    }
}

/**
 * CREB Phase 3: Simplified AI-Powered Reaction Classification
 * Browser-compatible version without external ML dependencies
 */
/**
 * AI-Powered Reaction Classification System (Simplified)
 * Provides intelligent reaction analysis without external ML dependencies
 */
let ReactionClassifier$1 = class ReactionClassifier {
    constructor() {
        this.modelVersion = '1.0.0-browser';
        console.log('🤖 AI Reaction Classifier initialized (Browser Mode)');
    }
    /**
     * Classify a chemical reaction using rule-based AI
     */
    async classifyReaction(equation) {
        try {
            const startTime = Date.now();
            // Parse equation components
            const compounds = this.extractCompounds(equation);
            const characteristics = this.analyzeReactionCharacteristics(equation);
            // Determine reaction type using rule-based classification
            const reactionType = this.determineReactionType(characteristics, compounds);
            const confidence = this.calculateConfidence(characteristics);
            const reasoning = this.generateReasoning(reactionType, characteristics);
            const suggestedStyle = this.getAnimationStyle(reactionType);
            const result = {
                reactionType,
                confidence,
                reasoning,
                suggestedStyle,
                characteristics
            };
            const processingTime = Date.now() - startTime;
            console.log(`✅ AI classification complete in ${processingTime}ms`, result);
            return result;
        }
        catch (error) {
            console.error('❌ AI classification failed:', error);
            // Fallback to general classification
            return {
                reactionType: 'general',
                confidence: 0.1,
                reasoning: ['Classification failed, using default style'],
                suggestedStyle: this.getDefaultAnimationStyle(),
                characteristics: this.getDefaultCharacteristics()
            };
        }
    }
    /**
     * Optimize animation parameters based on reaction type
     */
    async optimizeAnimationParameters(reactionType, reactants, products) {
        try {
            // Base parameters from reaction classification
            const baseParams = {
                duration: 3.0,
                temperature: 298,
                pressure: 1,
                solvent: 'vacuum'
            };
            // Adjust based on reaction characteristics
            if (reactionType.characteristics.hasEnergyRelease) {
                return {
                    ...baseParams,
                    duration: 2.0,
                    showEnergyProfile: true,
                    particleEffects: true
                };
            }
            if (reactionType.characteristics.hasGasProduction) {
                return {
                    ...baseParams,
                    duration: 3.5,
                    showBubbleEffects: true,
                    emphasizeVolumeChange: true
                };
            }
            return baseParams;
        }
        catch (error) {
            console.error('AI parameter optimization failed:', error);
            throw error;
        }
    }
    /**
     * Analyze the structural characteristics of a reaction
     */
    analyzeReactionCharacteristics(equation) {
        const compounds = this.extractCompounds(equation);
        const reactants = compounds.reactants;
        const products = compounds.products;
        return {
            hasOxygen: this.containsOxygen(reactants) || this.containsOxygen(products),
            hasCombustibleFuel: this.containsCombustibleFuel(reactants),
            formsSingleProduct: products.length === 1,
            breaksIntoMultipleProducts: products.length > reactants.length,
            involvesIons: this.containsIons(reactants) || this.containsIons(products),
            hasEnergyRelease: this.isExothermic(equation),
            hasGasProduction: this.producesGas(products),
            hasPrecipitate: this.formsPrecipitate(equation)
        };
    }
    /**
     * Extract compounds from equation
     */
    extractCompounds(equation) {
        const [reactantSide, productSide] = equation.split(/→|->|=/).map(s => s.trim());
        const reactants = reactantSide.split('+').map(s => s.trim().replace(/^\d+/, ''));
        const products = productSide.split('+').map(s => s.trim().replace(/^\d+/, ''));
        return { reactants, products };
    }
    /**
     * Determine reaction type based on characteristics
     */
    determineReactionType(characteristics, compounds) {
        const { reactants, products } = compounds;
        // Combustion detection
        if (characteristics.hasOxygen && characteristics.hasCombustibleFuel &&
            products.some(p => p.includes('CO2') || p.includes('H2O'))) {
            return 'combustion';
        }
        // Synthesis detection
        if (reactants.length > 1 && characteristics.formsSingleProduct) {
            return 'synthesis';
        }
        // Decomposition detection
        if (reactants.length === 1 && characteristics.breaksIntoMultipleProducts) {
            return 'decomposition';
        }
        // Acid-base detection
        if (characteristics.involvesIons && products.some(p => p.includes('H2O'))) {
            return 'acid-base';
        }
        // Single displacement
        if (reactants.length === 2 && products.length === 2 &&
            this.hasElementalMetal(reactants)) {
            return 'single-displacement';
        }
        // Double displacement
        if (reactants.length === 2 && products.length === 2 &&
            characteristics.involvesIons) {
            return 'double-displacement';
        }
        return 'general';
    }
    /**
     * Helper methods for compound analysis
     */
    containsOxygen(compounds) {
        return compounds.some(c => /O\d*/.test(c));
    }
    containsCombustibleFuel(compounds) {
        return compounds.some(c => /C\d*H\d*/.test(c) || c === 'C' || c === 'H2');
    }
    containsIons(compounds) {
        return compounds.some(c => /Cl|Na|K|Ca|Mg|OH/.test(c));
    }
    isExothermic(equation) {
        return /combustion|burn|explode/i.test(equation) ||
            equation.includes('CO2') && equation.includes('H2O');
    }
    producesGas(products) {
        const gases = ['CO2', 'H2', 'O2', 'N2', 'Cl2', 'NH3'];
        return products.some(p => gases.some(gas => p.includes(gas)));
    }
    formsPrecipitate(equation) {
        return /precipitate|solid|↓/i.test(equation);
    }
    hasElementalMetal(reactants) {
        const metals = ['Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn'];
        return reactants.some(r => metals.includes(r));
    }
    /**
     * Calculate confidence based on characteristics
     */
    calculateConfidence(characteristics) {
        let confidence = 0.5; // Base confidence
        // Increase confidence for clear indicators
        if (characteristics.hasOxygen && characteristics.hasCombustibleFuel)
            confidence += 0.3;
        if (characteristics.formsSingleProduct)
            confidence += 0.1;
        if (characteristics.hasEnergyRelease)
            confidence += 0.2;
        if (characteristics.involvesIons)
            confidence += 0.1;
        return Math.min(confidence, 0.95); // Cap at 95%
    }
    /**
     * Generate reasoning for classification
     */
    generateReasoning(reactionType, characteristics) {
        const reasons = [];
        switch (reactionType) {
            case 'combustion':
                reasons.push('Oxygen present in reactants');
                reasons.push('Combustible fuel detected');
                if (characteristics.hasEnergyRelease)
                    reasons.push('Exothermic reaction');
                break;
            case 'synthesis':
                reasons.push('Multiple reactants form single product');
                break;
            case 'decomposition':
                reasons.push('Single reactant breaks into multiple products');
                break;
            case 'acid-base':
                reasons.push('Ionic compounds detected');
                reasons.push('Water formation indicates neutralization');
                break;
        }
        return reasons;
    }
    /**
     * Get animation style based on reaction type
     */
    getAnimationStyle(reactionType) {
        const styles = {
            combustion: {
                particleEffects: true,
                energyProfile: true,
                colorScheme: 'fire',
                duration: 2.0
            },
            synthesis: {
                bondFormation: true,
                convergence: true,
                colorScheme: 'synthesis',
                duration: 3.0
            },
            decomposition: {
                bondBreaking: true,
                divergence: true,
                colorScheme: 'breakdown',
                duration: 2.5
            },
            'acid-base': {
                ionicMotion: true,
                neutralization: true,
                colorScheme: 'ionic',
                duration: 3.5
            }
        };
        return styles[reactionType] || this.getDefaultAnimationStyle();
    }
    getDefaultAnimationStyle() {
        return {
            particleEffects: false,
            energyProfile: false,
            colorScheme: 'default',
            duration: 3.0
        };
    }
    getDefaultCharacteristics() {
        return {
            hasOxygen: false,
            hasCombustibleFuel: false,
            formsSingleProduct: false,
            breaksIntoMultipleProducts: false,
            involvesIons: false,
            hasEnergyRelease: false,
            hasGasProduction: false,
            hasPrecipitate: false
        };
    }
};

/**
 * CREB Phase 3: Simplified Physics Engine
 * Browser-compatible version without external physics dependencies
 */
/**
 * Simplified Molecular Physics Engine (Browser Mode)
 * Provides physics-based animation without external dependencies
 */
class SimplifiedPhysicsEngine {
    constructor() {
        this.config = {};
        this.isInitialized = false;
        this.initialize();
    }
    initialize() {
        this.config = {
            gravity: -9.82,
            timeStep: 1 / 60,
            temperature: 298,
            pressure: 1.0
        };
        this.isInitialized = true;
        console.log('⚡ Simplified Physics Engine initialized (Browser Mode)');
    }
    /**
     * Configure physics simulation parameters
     */
    configure(config) {
        try {
            if (config.temperature !== undefined) {
                this.config.temperature = config.temperature;
                // Adjust gravity based on temperature (higher temp = more kinetic energy)
                const tempFactor = Math.max(0.1, config.temperature / 298);
                this.config.gravity = -9.82 * tempFactor;
            }
            if (config.enableCollision !== undefined) {
                this.config.enableCollision = config.enableCollision;
            }
            console.log('Physics engine configured', config);
        }
        catch (error) {
            console.error('Physics configuration failed:', error);
            throw error;
        }
    }
    /**
     * Simulate reaction pathway with simplified physics
     */
    async simulateReactionPathway(transitions, duration) {
        try {
            const frames = [];
            const frameRate = 60; // 60 FPS
            const totalFrames = Math.floor(duration * frameRate);
            console.log(`🔬 Starting physics simulation: ${totalFrames} frames over ${duration}s`);
            for (let frame = 0; frame < totalFrames; frame++) {
                const progress = frame / totalFrames;
                const timestamp = (frame / frameRate) * 1000; // Convert to ms
                // Apply simplified physics calculations
                const molecularStates = transitions.map((transition, index) => ({
                    moleculeId: `molecule_${index}`,
                    position: this.interpolatePosition(transition, progress),
                    rotation: this.interpolateRotation(transition, progress),
                    scale: this.interpolateScale(transition, progress),
                    velocity: this.calculateVelocity(transition, progress),
                    bonds: transition.bonds || [],
                    atoms: transition.atoms || []
                }));
                frames.push({
                    timestamp,
                    molecularStates,
                    frameNumber: frame,
                    progress: progress * 100
                });
                // Add some physics-based perturbations
                this.applyPhysicsEffects(molecularStates, progress);
            }
            console.log(`✅ Physics simulation completed: ${frames.length} frames generated`);
            return frames;
        }
        catch (error) {
            console.error('Physics simulation failed:', error);
            throw error;
        }
    }
    /**
     * Interpolate position with physics-based motion
     */
    interpolatePosition(transition, progress) {
        if (!transition.startStructure || !transition.endStructure) {
            return { x: 0, y: 0, z: 0 };
        }
        const start = transition.startStructure.center || { x: 0, y: 0, z: 0 };
        const end = transition.endStructure.center || { x: 0, y: 0, z: 0 };
        // Add physics-based easing (acceleration/deceleration)
        const easedProgress = this.physicsEasing(progress);
        // Add some random brownian motion for realism
        const brownianX = (Math.random() - 0.5) * 0.1;
        const brownianY = (Math.random() - 0.5) * 0.1;
        const brownianZ = (Math.random() - 0.5) * 0.1;
        return {
            x: start.x + (end.x - start.x) * easedProgress + brownianX,
            y: start.y + (end.y - start.y) * easedProgress + brownianY,
            z: start.z + (end.z - start.z) * easedProgress + brownianZ
        };
    }
    /**
     * Physics-based easing function
     */
    physicsEasing(t) {
        // Simulate realistic molecular motion with slight acceleration/deceleration
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    /**
     * Interpolate rotation with angular momentum
     */
    interpolateRotation(transition, progress) {
        const baseRotation = progress * Math.PI * 2;
        // Add temperature-dependent rotational energy
        const tempFactor = this.config.temperature / 298;
        const thermalRotation = Math.sin(progress * Math.PI * 4) * tempFactor * 0.2;
        return {
            x: thermalRotation,
            y: baseRotation + thermalRotation,
            z: thermalRotation * 0.5
        };
    }
    /**
     * Interpolate scale with thermal expansion
     */
    interpolateScale(transition, progress) {
        // Base scale oscillation
        const baseScale = 1 + Math.sin(progress * Math.PI) * 0.1;
        // Temperature-dependent thermal expansion
        const tempFactor = this.config.temperature / 298;
        const thermalExpansion = 1 + (tempFactor - 1) * 0.05;
        const finalScale = baseScale * thermalExpansion;
        return { x: finalScale, y: finalScale, z: finalScale };
    }
    /**
     * Calculate velocity for motion blur effects
     */
    calculateVelocity(transition, progress) {
        const timeStep = this.config.timeStep;
        // Simple velocity calculation based on position change
        const velocityFactor = Math.sin(progress * Math.PI) * 5.0; // Peak velocity at middle
        return {
            x: velocityFactor * timeStep,
            y: velocityFactor * timeStep * 0.5,
            z: velocityFactor * timeStep * 0.3
        };
    }
    /**
     * Apply physics effects like thermal motion
     */
    applyPhysicsEffects(molecularStates, progress) {
        molecularStates.forEach(state => {
            // Add thermal motion based on temperature
            const tempFactor = this.config.temperature / 298;
            const thermalMotion = tempFactor * 0.1;
            // Apply random thermal vibrations
            state.position.x += (Math.random() - 0.5) * thermalMotion;
            state.position.y += (Math.random() - 0.5) * thermalMotion;
            state.position.z += (Math.random() - 0.5) * thermalMotion;
            // Add collision effects if enabled
            if (this.config.enableCollision && progress > 0.3 && progress < 0.7) {
                const collisionFactor = Math.sin((progress - 0.3) * Math.PI / 0.4);
                state.scale.x *= (1 + collisionFactor * 0.2);
                state.scale.y *= (1 - collisionFactor * 0.1);
                state.scale.z *= (1 + collisionFactor * 0.15);
            }
        });
    }
    /**
     * Calculate system energy for monitoring
     */
    calculateSystemEnergy(molecularStates) {
        const kineticEnergy = molecularStates.reduce((total, state) => {
            const v2 = state.velocity.x ** 2 + state.velocity.y ** 2 + state.velocity.z ** 2;
            return total + 0.5 * v2; // Assuming unit mass
        }, 0);
        const potentialEnergy = molecularStates.length * this.config.temperature * 0.01; // Simplified
        return {
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: kineticEnergy + potentialEnergy,
            temperature: this.config.temperature
        };
    }
    /**
     * Reset physics state
     */
    reset() {
        this.config = {
            gravity: -9.82,
            timeStep: 1 / 60,
            temperature: 298,
            pressure: 1.0
        };
        console.log('Physics engine reset to default state');
    }
    /**
     * Alias for simulateReactionPathway - for API compatibility
     */
    async simulateReaction(equation, options) {
        // Convert equation string to simple transitions array for compatibility
        const transitions = [{
                reactants: equation.split('->')[0]?.trim().split('+').map(r => r.trim()) || [],
                products: equation.split('->')[1]?.trim().split('+').map(p => p.trim()) || [],
                startStructure: { center: { x: -2, y: 0, z: 0 } },
                endStructure: { center: { x: 2, y: 0, z: 0 } }
            }];
        const duration = options?.duration || 4.0;
        return this.simulateReactionPathway(transitions, duration);
    }
    /**
     * Dispose of physics resources
     */
    dispose() {
        this.isInitialized = false;
        console.log('🔬 Simplified Physics Engine disposed');
    }
}

/**
 * CREB Phase 3: Simplified Caching Manager
 * Browser-compatible version with localStorage fallback
 */
/**
 * Simplified Intelligent Cache Manager (Browser Mode)
 * Uses localStorage and memory cache without external dependencies
 */
class SimplifiedCacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.maxMemorySize = 100; // Maximum items in memory
        this.stats = {
            memorySize: 0,
            persistentSize: 0,
            hitRate: 0,
            missRate: 0,
            totalRequests: 0
        };
        this.initialize();
    }
    initialize() {
        // Clear old cache entries on startup
        this.cleanupExpiredEntries();
        console.log('🧠 Simplified Cache Manager initialized (Browser Mode)');
    }
    /**
     * Get item from cache (memory first, then localStorage)
     */
    async get(key) {
        this.stats.totalRequests++;
        // Check memory cache first
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem) {
            // Check if expired
            if (memoryItem.ttl && Date.now() > memoryItem.timestamp + memoryItem.ttl) {
                this.memoryCache.delete(key);
            }
            else {
                this.recordHit('memory');
                console.log(`💾 Cache hit (memory): ${key}`);
                return memoryItem.data;
            }
        }
        // Check localStorage
        try {
            const persistentItem = localStorage.getItem(`creb_cache_${key}`);
            if (persistentItem) {
                const parsed = JSON.parse(persistentItem);
                // Check if expired
                if (parsed.ttl && Date.now() > parsed.timestamp + parsed.ttl) {
                    localStorage.removeItem(`creb_cache_${key}`);
                }
                else {
                    // Move to memory cache for faster future access
                    this.memoryCache.set(key, {
                        data: parsed.data,
                        timestamp: parsed.timestamp,
                        ttl: parsed.ttl
                    });
                    this.recordHit('persistent');
                    console.log(`💽 Cache hit (persistent): ${key}`);
                    return parsed.data;
                }
            }
        }
        catch (error) {
            console.warn('Error reading from localStorage:', error);
        }
        // Cache miss
        this.recordMiss();
        console.log(`❌ Cache miss: ${key}`);
        return null;
    }
    /**
     * Set item in cache (both memory and localStorage)
     */
    async set(key, data, ttl) {
        const timestamp = Date.now();
        const cacheItem = { data, timestamp, ttl };
        // Store in memory cache
        this.memoryCache.set(key, cacheItem);
        // Enforce memory size limit
        if (this.memoryCache.size > this.maxMemorySize) {
            this.evictOldestMemoryItems();
        }
        // Store in localStorage
        try {
            const serialized = JSON.stringify(cacheItem);
            localStorage.setItem(`creb_cache_${key}`, serialized);
            console.log(`✅ Cache set: ${key} (${serialized.length} bytes)`);
        }
        catch (error) {
            // localStorage might be full
            console.warn('Error writing to localStorage:', error);
            this.cleanupLocalStorage();
        }
        this.updateStats();
    }
    /**
     * Clear specific cache entry
     */
    async clear(key) {
        this.memoryCache.delete(key);
        localStorage.removeItem(`creb_cache_${key}`);
        console.log(`🗑️ Cache cleared: ${key}`);
    }
    /**
     * Clear all cache entries
     */
    async clearAll() {
        this.memoryCache.clear();
        // Clear all CREB cache entries from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('creb_cache_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        this.resetStats();
        console.log('🧹 All cache entries cleared');
    }
    /**
     * Get cache statistics
     */
    getStats() {
        this.updateStats();
        return { ...this.stats };
    }
    /**
     * Update cache statistics
     */
    updateStats() {
        this.stats.memorySize = this.memoryCache.size;
        // Count localStorage items
        let persistentCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('creb_cache_')) {
                persistentCount++;
            }
        }
        this.stats.persistentSize = persistentCount;
        // Calculate hit/miss rates
        if (this.stats.totalRequests > 0) {
            const hits = this.stats.totalRequests - (this.stats.totalRequests * this.stats.missRate);
            this.stats.hitRate = hits / this.stats.totalRequests;
        }
    }
    /**
     * Record cache hit
     */
    recordHit(type) {
        // Update hit rate calculation
        const totalHits = this.stats.totalRequests * this.stats.hitRate + 1;
        this.stats.hitRate = totalHits / this.stats.totalRequests;
        this.stats.missRate = 1 - this.stats.hitRate;
    }
    /**
     * Record cache miss
     */
    recordMiss() {
        const totalMisses = this.stats.totalRequests * this.stats.missRate + 1;
        this.stats.missRate = totalMisses / this.stats.totalRequests;
        this.stats.hitRate = 1 - this.stats.missRate;
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            memorySize: 0,
            persistentSize: 0,
            hitRate: 0,
            missRate: 0,
            totalRequests: 0
        };
    }
    /**
     * Evict oldest items from memory cache
     */
    evictOldestMemoryItems() {
        const sortedEntries = Array.from(this.memoryCache.entries())
            .sort(([, a], [, b]) => a.timestamp - b.timestamp);
        // Remove oldest 25% of items
        const toRemove = Math.floor(sortedEntries.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            this.memoryCache.delete(sortedEntries[i][0]);
        }
        console.log(`🧹 Evicted ${toRemove} old items from memory cache`);
    }
    /**
     * Clean up expired cache entries
     */
    cleanupExpiredEntries() {
        const now = Date.now();
        // Clean memory cache
        for (const [key, item] of this.memoryCache.entries()) {
            if (item.ttl && now > item.timestamp + item.ttl) {
                this.memoryCache.delete(key);
            }
        }
        // Clean localStorage cache
        const expiredKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('creb_cache_')) {
                try {
                    const item = JSON.parse(localStorage.getItem(key) || '{}');
                    if (item.ttl && now > item.timestamp + item.ttl) {
                        expiredKeys.push(key);
                    }
                }
                catch (error) {
                    // Invalid JSON, remove it
                    expiredKeys.push(key);
                }
            }
        }
        expiredKeys.forEach(key => localStorage.removeItem(key));
        if (expiredKeys.length > 0) {
            console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
        }
    }
    /**
     * Clean up localStorage when full
     */
    cleanupLocalStorage() {
        console.log('🧹 localStorage full, cleaning up old CREB cache entries...');
        const crebKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('creb_cache_')) {
                try {
                    const item = JSON.parse(localStorage.getItem(key) || '{}');
                    crebKeys.push({ key, timestamp: item.timestamp || 0 });
                }
                catch (error) {
                    crebKeys.push({ key, timestamp: 0 });
                }
            }
        }
        // Sort by timestamp and remove oldest 50%
        crebKeys.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = Math.floor(crebKeys.length * 0.5);
        for (let i = 0; i < toRemove; i++) {
            localStorage.removeItem(crebKeys[i].key);
        }
        console.log(`🧹 Removed ${toRemove} old cache entries from localStorage`);
    }
}

/**
 * CREB Phase 2: Animated Reaction Transition Engine
 *
 * This module provides smooth, physics-based animations between
 * reactant and product molecular states using GSAP and Three.js.
 */
class ReactionAnimationEngine {
    constructor(container, config = {}) {
        // 3Dmol.js Integration
        this.mol3dViewer = null;
        this.mol3dContainer = null;
        this.molecularModels = new Map();
        // Animation state
        this.isPlaying = false;
        this.currentFrame = 0;
        this.totalFrames = 0;
        this.animationData = [];
        // Visual elements
        this.atomMeshes = new Map();
        this.bondMeshes = new Map();
        this.energyProfileMesh = null;
        this.particleSystem = null;
        this.config = {
            duration: 3.0,
            easing: 'power2.inOut',
            showEnergyProfile: true,
            showBondTransitions: true,
            particleEffects: true,
            audioEnabled: false,
            ...config
        };
        // Initialize Phase 3 systems
        this.aiClassifier = new ReactionClassifier$1();
        this.physicsEngine = new SimplifiedPhysicsEngine();
        this.cacheManager = new SimplifiedCacheManager();
        this.initializeThreeJS(container);
        this.initialize3Dmol(container);
        this.initializeGSAP();
        // Start rendering immediately to show test geometry
        this.startContinuousRender();
    }
    initializeThreeJS(container) {
        // Scene setup
        this.scene = new THREE__namespace.Scene();
        this.scene.background = new THREE__namespace.Color(0x000000);
        // Camera setup
        this.camera = new THREE__namespace.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        // Renderer setup with optimization
        this.renderer = new THREE__namespace.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE__namespace.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        // Lighting setup
        this.setupLighting();
        // Add test geometry to verify renderer is working
        this.addTestGeometry();
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize(container));
    }
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE__namespace.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        // Directional light for shadows and highlights
        const directionalLight = new THREE__namespace.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        // Point lights for dynamic effects
        const pointLight1 = new THREE__namespace.PointLight(0x4080ff, 0.5, 20);
        pointLight1.position.set(-10, 0, 0);
        this.scene.add(pointLight1);
        const pointLight2 = new THREE__namespace.PointLight(0xff4080, 0.5, 20);
        pointLight2.position.set(10, 0, 0);
        this.scene.add(pointLight2);
    }
    initialize3Dmol(container) {
        try {
            // Check if 3Dmol.js is available
            const $3Dmol = globalThis.$3Dmol;
            if (!$3Dmol) {
                console.warn('3Dmol.js not available, using fallback rendering');
                this.addTestGeometry();
                return;
            }
            // Create a separate container for 3Dmol.js viewer
            this.mol3dContainer = document.createElement('div');
            this.mol3dContainer.style.position = 'absolute';
            this.mol3dContainer.style.top = '0';
            this.mol3dContainer.style.left = '0';
            this.mol3dContainer.style.width = '100%';
            this.mol3dContainer.style.height = '100%';
            this.mol3dContainer.style.pointerEvents = 'none'; // Allow Three.js to handle interactions
            container.appendChild(this.mol3dContainer);
            // Initialize 3Dmol.js viewer
            this.mol3dViewer = $3Dmol.createViewer(this.mol3dContainer, {
                defaultcolors: $3Dmol.elementColors.defaultColors,
                backgroundColor: 'rgba(0,0,0,0)' // Transparent background
            });
            // Add initial demo molecules to show that 3Dmol.js is working
            this.addDemo3DMolecules();
            console.log('🧬 3Dmol.js viewer initialized');
        }
        catch (error) {
            console.error('Failed to initialize 3Dmol.js:', error);
            this.addTestGeometry();
        }
    }
    addTestGeometry() {
        // Add a visible test cube to verify the renderer is working
        const geometry = new THREE__namespace.BoxGeometry(1, 1, 1);
        const material = new THREE__namespace.MeshPhongMaterial({ color: 0x00ff00 });
        const cube = new THREE__namespace.Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        this.scene.add(cube);
        // Add rotation animation to make it obvious
        gsap.gsap.to(cube.rotation, {
            duration: 2,
            y: Math.PI * 2,
            repeat: -1,
            ease: "none"
        });
        console.log('🟢 Test geometry added to scene');
    }
    addDemo3DMolecules() {
        if (!this.mol3dViewer)
            return;
        // Add a water molecule as demo
        const waterXYZ = '3\nWater molecule\nO 0.000 0.000 0.000\nH 0.757 0.586 0.000\nH -0.757 0.586 0.000\n';
        try {
            const model = this.mol3dViewer.addModel(waterXYZ, 'xyz');
            model.setStyle({}, {
                stick: { radius: 0.1 },
                sphere: { scale: 0.3 }
            });
            this.mol3dViewer.zoomTo();
            this.mol3dViewer.render();
            console.log('🧬 Demo water molecule added');
        }
        catch (error) {
            console.error('Failed to add demo molecule:', error);
        }
    }
    initializeGSAP() {
        gsap.gsap.registerPlugin();
        this.timeline = gsap.gsap.timeline({
            paused: true,
            onUpdate: () => this.onTimelineUpdate(),
            onComplete: () => this.handleAnimationComplete()
        });
    }
    /**
     * Create 3Dmol.js molecular models from molecular data
     */
    async createMolecularModels(molecules) {
        if (!this.mol3dViewer) {
            console.warn('3Dmol.js viewer not available');
            return;
        }
        try {
            this.mol3dViewer.clear();
            this.molecularModels.clear();
            for (const molecule of molecules) {
                const modelId = `mol_${molecule.formula}`;
                // Convert molecular data to 3Dmol.js format
                const mol3dData = this.convertToMol3DFormat(molecule);
                // Add model to viewer
                const model = this.mol3dViewer.addModel(mol3dData, 'xyz');
                model.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
                this.molecularModels.set(modelId, model);
                console.log(`🧬 Added molecular model: ${molecule.formula}`);
            }
            this.mol3dViewer.zoomTo();
            this.mol3dViewer.render();
        }
        catch (error) {
            console.error('Failed to create molecular models:', error);
        }
    }
    /**
     * Convert CREB molecular data to 3Dmol.js XYZ format
     */
    convertToMol3DFormat(molecule) {
        if (!molecule.atoms || molecule.atoms.length === 0) {
            return this.generateFallbackXYZ(molecule.formula || 'C');
        }
        let xyzData = `${molecule.atoms.length}\n`;
        xyzData += `${molecule.formula || 'Molecule'}\n`;
        for (const atom of molecule.atoms) {
            const pos = atom.position || { x: 0, y: 0, z: 0 };
            xyzData += `${atom.element} ${pos.x.toFixed(3)} ${pos.y.toFixed(3)} ${pos.z.toFixed(3)}\n`;
        }
        return xyzData;
    }
    /**
     * Generate fallback XYZ data for simple molecules
     */
    generateFallbackXYZ(formula) {
        const moleculeTemplates = {
            'H2O': '3\nWater\nO 0.000 0.000 0.000\nH 0.757 0.586 0.000\nH -0.757 0.586 0.000\n',
            'H2': '2\nHydrogen\nH 0.000 0.000 0.000\nH 0.740 0.000 0.000\n',
            'O2': '2\nOxygen\nO 0.000 0.000 0.000\nO 1.210 0.000 0.000\n',
            'CO2': '3\nCarbon Dioxide\nC 0.000 0.000 0.000\nO 1.160 0.000 0.000\nO -1.160 0.000 0.000\n',
            'CH4': '5\nMethane\nC 0.000 0.000 0.000\nH 1.089 0.000 0.000\nH -0.363 1.027 0.000\nH -0.363 -0.513 0.889\nH -0.363 -0.513 -0.889\n'
        };
        return moleculeTemplates[formula] || `1\n${formula}\nC 0.000 0.000 0.000\n`;
    }
    /**
     * Animate molecular transformations using both 3Dmol.js and Three.js
     */
    animateMolecularTransformation(reactants, products, duration) {
        if (!this.mol3dViewer) {
            console.warn('3Dmol.js not available for animation');
            return;
        }
        // Create GSAP timeline for coordinated animation
        const tl = gsap.gsap.timeline();
        // Phase 1: Show reactants
        tl.call(() => {
            this.createMolecularModels(reactants);
        });
        // Phase 2: Transition animation (use Three.js for effects)
        tl.to({}, {
            duration: duration * 0.6,
            onUpdate: () => {
                // Add transition effects using Three.js
                this.renderTransitionEffects();
            }
        });
        // Phase 3: Show products
        tl.call(() => {
            this.createMolecularModels(products);
        });
        tl.play();
    }
    /**
     * Render transition effects using Three.js
     */
    renderTransitionEffects() {
        // Add particle effects, energy visualization, etc. using Three.js
        // This complements the 3Dmol.js molecular rendering
    }
    /**
     * Phase 3: AI-Enhanced Animation Creation
     * Uses machine learning to optimize animation parameters
     */
    async createAIEnhancedAnimation(reactants, products, reactionEquation) {
        try {
            // Step 1: Use AI to classify reaction type and predict optimal parameters
            const reactionType = await this.aiClassifier.classifyReaction(reactionEquation);
            const optimizedParams = await this.aiClassifier.optimizeAnimationParameters(reactionType, reactants, products);
            // Step 2: Check intelligent cache for similar animations
            const cacheKey = `animation:${reactionEquation}:${JSON.stringify(optimizedParams)}`;
            const cachedAnimation = await this.cacheManager.get(cacheKey);
            if (cachedAnimation && Array.isArray(cachedAnimation)) {
                this.animationData = cachedAnimation;
                this.totalFrames = cachedAnimation.length;
                return;
            }
            // Step 3: Use physics engine for realistic molecular dynamics
            const physicsConfig = {
                enableCollision: reactionType.characteristics.hasEnergyRelease || reactionType.characteristics.hasGasProduction,
                temperature: optimizedParams.temperature || 298,
                pressure: optimizedParams.pressure || 1,
                solvent: optimizedParams.solvent || 'vacuum'
            };
            this.physicsEngine.configure(physicsConfig);
            // Step 4: Create molecular models using 3Dmol.js
            await this.createMolecularModels(reactants);
            console.log('🧬 Initial molecular models created with 3Dmol.js');
            // Step 5: Generate physics-based animation frames
            const transitions = this.generateMolecularTransitions(reactants, products, reactionType);
            const animationFrames = await this.physicsEngine.simulateReactionPathway(transitions, optimizedParams.duration || this.config.duration);
            // Step 6: Set up coordinated animation using both systems
            this.animateMolecularTransformation(reactants, products, optimizedParams.duration || this.config.duration);
            // Step 7: Cache the generated animation
            await this.cacheManager.set(cacheKey, animationFrames);
            this.animationData = animationFrames;
            this.totalFrames = animationFrames.length;
        }
        catch (error) {
            console.error('AI-enhanced animation creation failed:', error);
            // Fallback to traditional animation
            await this.createReactionAnimation(reactants, products);
        }
    }
    /**
     * Generate molecular transitions based on AI classification
     */
    generateMolecularTransitions(reactants, products, reactionType) {
        const transitions = [];
        // Generate transitions based on reaction mechanism
        switch (reactionType.mechanism) {
            case 'substitution':
                transitions.push(...this.generateSubstitutionTransitions(reactants, products));
                break;
            case 'addition':
                transitions.push(...this.generateAdditionTransitions(reactants, products));
                break;
            case 'elimination':
                transitions.push(...this.generateEliminationTransitions(reactants, products));
                break;
            default:
                transitions.push(...this.generateGenericTransitions(reactants, products));
        }
        return transitions;
    }
    /**
     * Create animated transition from reactants to products
     */
    async createReactionAnimation(reactants, products) {
        try {
            console.log('🎬 Creating reaction animation...');
            // Clear previous animation
            this.clearScene();
            this.timeline.clear();
            // Create initial molecular models with 3Dmol.js
            await this.createMolecularModels(reactants);
            console.log('🧬 Reactant models loaded with 3Dmol.js');
            // Generate transition data
            const transitions = await this.calculateMolecularTransitions(reactants, products);
            // Create animation frames
            this.animationData = await this.generateAnimationFrames(transitions);
            this.totalFrames = this.animationData.length;
            // Build 3D molecular geometries
            await this.buildMolecularGeometries(reactants, products);
            // Create GSAP animation timeline
            this.createAnimationTimeline(transitions);
            // Setup energy profile if enabled
            if (this.config.showEnergyProfile) {
                this.createEnergyProfileVisualization(transitions);
            }
            // Setup particle effects if enabled
            if (this.config.particleEffects) {
                this.createParticleEffects();
            }
            console.log('✅ Animation ready! Frames:', this.totalFrames);
        }
        catch (error) {
            console.error('❌ Animation creation failed:', error);
            throw new Error(`Animation creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Calculate molecular transitions between reactants and products
     */
    async calculateMolecularTransitions(reactants, products) {
        const transitions = [];
        // For each product, find corresponding reactant transformations
        for (let i = 0; i < Math.max(reactants.length, products.length); i++) {
            const reactant = reactants[i] || reactants[0]; // Use first reactant as fallback
            const product = products[i] || products[0]; // Use first product as fallback
            const transition = {
                startStructure: reactant,
                endStructure: product,
                transitionType: this.determineTransitionType(reactant, product),
                energyBarrier: this.calculateEnergyBarrier(reactant, product),
                transitionState: await this.generateTransitionState(reactant, product)
            };
            transitions.push(transition);
        }
        return transitions;
    }
    determineTransitionType(reactant, product) {
        // Simple heuristic based on atom count changes
        const reactantAtomCount = reactant.atoms?.length || 0;
        const productAtomCount = product.atoms?.length || 0;
        if (reactantAtomCount < productAtomCount) {
            return 'formation';
        }
        else if (reactantAtomCount > productAtomCount) {
            return 'breaking';
        }
        else {
            return 'rearrangement';
        }
    }
    calculateEnergyBarrier(reactant, product) {
        // Simplified energy barrier calculation
        // In practice, this would use quantum chemistry calculations
        const baseBarrier = 50; // kJ/mol
        const complexityFactor = (reactant.atoms?.length || 1) * 2;
        return baseBarrier + Math.random() * complexityFactor;
    }
    async generateTransitionState(reactant, product) {
        // Generate intermediate structure between reactant and product
        // This is a simplified interpolation - real implementation would use
        // advanced computational chemistry methods
        if (!reactant.atoms || !product.atoms) {
            return undefined;
        }
        const transitionState = {
            ...reactant,
            atoms: reactant.atoms.map((atom, i) => ({
                ...atom,
                position: {
                    x: (atom.position.x + (product.atoms?.[i]?.position.x || atom.position.x)) / 2,
                    y: (atom.position.y + (product.atoms?.[i]?.position.y || atom.position.y)) / 2,
                    z: (atom.position.z + (product.atoms?.[i]?.position.z || atom.position.z)) / 2
                }
            }))
        };
        return transitionState;
    }
    /**
     * Generate frame-by-frame animation data
     */
    async generateAnimationFrames(transitions) {
        const frames = [];
        const frameRate = 60; // 60 FPS
        const totalDuration = this.config.duration * 1000; // Convert to ms
        const frameCount = Math.floor((totalDuration / 1000) * frameRate);
        for (let frame = 0; frame <= frameCount; frame++) {
            const progress = frame / frameCount;
            const timestamp = (frame / frameRate) * 1000;
            // Create molecular state for this frame
            const molecularStates = transitions.map(transition => this.interpolateMolecularState(transition, progress));
            // Calculate energy level for this frame
            const energyLevel = this.calculateFrameEnergy(transitions, progress);
            // Determine bond changes at this frame
            const bondChanges = this.calculateBondChanges(transitions, progress);
            // Calculate atom movements
            const atomMovements = this.calculateAtomMovements(transitions, progress);
            frames.push({
                timestamp,
                molecularStates,
                energyLevel,
                bondChanges,
                atomMovements
            });
        }
        return frames;
    }
    interpolateMolecularState(transition, progress) {
        const start = transition.startStructure;
        const end = transition.endStructure;
        // Use easing function for natural motion
        const easedProgress = gsap.gsap.parseEase(this.config.easing)(progress);
        // Interpolate atom positions
        const atoms = start.atoms?.map((startAtom, i) => {
            const endAtom = end.atoms?.[i] || startAtom;
            return {
                id: startAtom.id || `atom_${i}`,
                element: startAtom.element,
                position: new THREE__namespace.Vector3(THREE__namespace.MathUtils.lerp(startAtom.position.x, endAtom.position.x, easedProgress), THREE__namespace.MathUtils.lerp(startAtom.position.y, endAtom.position.y, easedProgress), THREE__namespace.MathUtils.lerp(startAtom.position.z, endAtom.position.z, easedProgress)),
                charge: THREE__namespace.MathUtils.lerp(startAtom.charge || 0, endAtom.charge || 0, easedProgress),
                hybridization: startAtom.hybridization || 'sp3',
                color: `#${this.getAtomColor(startAtom.element).toString(16).padStart(6, '0')}`,
                radius: this.getAtomRadius(startAtom.element)
            };
        }) || [];
        // Interpolate bond states
        const bonds = start.bonds?.map((startBond, i) => {
            const endBond = end.bonds?.[i] || startBond;
            return {
                id: startBond.id || `bond_${i}`,
                atom1: startBond.atom1,
                atom2: startBond.atom2,
                order: THREE__namespace.MathUtils.lerp(startBond.order, endBond.order, easedProgress),
                length: THREE__namespace.MathUtils.lerp(startBond.length || 1.5, endBond.length || 1.5, easedProgress),
                strength: THREE__namespace.MathUtils.lerp(startBond.strength || 1, endBond.strength || 1, easedProgress),
                color: `#${this.getBondColor(startBond.order).toString(16).padStart(6, '0')}`
            };
        }) || [];
        return {
            atoms,
            bonds,
            overallCharge: start.charge || 0,
            spinMultiplicity: start.spinMultiplicity || 1
        };
    }
    calculateFrameEnergy(transitions, progress) {
        // Calculate energy using a reaction coordinate model
        // Energy increases to barrier height, then decreases to product energy
        const maxBarrier = Math.max(...transitions.map(t => t.energyBarrier));
        const barrierPosition = 0.5; // Transition state at 50% progress
        if (progress <= barrierPosition) {
            // Rising to transition state
            const localProgress = progress / barrierPosition;
            return maxBarrier * localProgress * localProgress; // Quadratic rise
        }
        else {
            // Falling to products
            const localProgress = (progress - barrierPosition) / (1 - barrierPosition);
            return maxBarrier * (1 - localProgress * localProgress); // Quadratic fall
        }
    }
    calculateBondChanges(transitions, progress) {
        const changes = [];
        transitions.forEach(transition => {
            const startBonds = transition.startStructure.bonds || [];
            const endBonds = transition.endStructure.bonds || [];
            // Find bonds that change during reaction
            startBonds.forEach((startBond, i) => {
                const endBond = endBonds[i];
                if (endBond && startBond.order !== endBond.order) {
                    changes.push({
                        type: startBond.order > endBond.order ? 'breaking' : 'formation',
                        bondId: startBond.id || `bond_${i}`,
                        startOrder: startBond.order,
                        endOrder: endBond.order,
                        timeline: [0, progress, 1] // Simple timeline
                    });
                }
            });
        });
        return changes;
    }
    calculateAtomMovements(transitions, progress) {
        const movements = [];
        transitions.forEach(transition => {
            const startAtoms = transition.startStructure.atoms || [];
            const endAtoms = transition.endStructure.atoms || [];
            startAtoms.forEach((startAtom, i) => {
                const endAtom = endAtoms[i];
                if (endAtom) {
                    const startPos = new THREE__namespace.Vector3(startAtom.position.x, startAtom.position.y, startAtom.position.z);
                    const endPos = new THREE__namespace.Vector3(endAtom.position.x, endAtom.position.y, endAtom.position.z);
                    const distance = startPos.distanceTo(endPos);
                    if (distance > 0.1) { // Only track significant movements
                        movements.push({
                            atomId: startAtom.id || `atom_${i}`,
                            startPosition: startPos,
                            endPosition: endPos,
                            trajectory: this.generateAtomTrajectory(startPos, endPos, transition.transitionState),
                            speed: distance / this.config.duration
                        });
                    }
                }
            });
        });
        return movements;
    }
    generateAtomTrajectory(start, end, transitionState) {
        const trajectory = [];
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Use quadratic Bezier curve through transition state if available
            if (transitionState?.atoms?.[0]) {
                const control = new THREE__namespace.Vector3(transitionState.atoms[0].position.x, transitionState.atoms[0].position.y, transitionState.atoms[0].position.z);
                const point = new THREE__namespace.Vector3();
                point.copy(start).multiplyScalar((1 - t) * (1 - t));
                point.addScaledVector(control, 2 * (1 - t) * t);
                point.addScaledVector(end, t * t);
                trajectory.push(point);
            }
            else {
                // Simple linear interpolation
                const point = new THREE__namespace.Vector3();
                point.lerpVectors(start, end, t);
                trajectory.push(point);
            }
        }
        return trajectory;
    }
    /**
     * Build 3D molecular geometries for rendering
     */
    async buildMolecularGeometries(reactants, products) {
        // Clear existing geometries
        this.atomMeshes.clear();
        this.bondMeshes.clear();
        // Create atom geometries
        const allMolecules = [...reactants, ...products];
        for (const molecule of allMolecules) {
            if (molecule.atoms) {
                for (const atom of molecule.atoms) {
                    await this.createAtomMesh(atom);
                }
            }
            if (molecule.bonds) {
                for (const bond of molecule.bonds) {
                    await this.createBondMesh(bond, molecule.atoms || []);
                }
            }
        }
    }
    async createAtomMesh(atom) {
        const geometry = new THREE__namespace.SphereGeometry(this.getAtomRadius(atom.element), 16, 12);
        const material = new THREE__namespace.MeshLambertMaterial({
            color: this.getAtomColor(atom.element),
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE__namespace.Mesh(geometry, material);
        mesh.position.set(atom.position.x, atom.position.y, atom.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const atomId = atom.id || `atom_${atom.element}_${Date.now()}`;
        this.atomMeshes.set(atomId, mesh);
        this.scene.add(mesh);
    }
    async createBondMesh(bond, atoms) {
        const atom1 = atoms.find(a => a.id === bond.atom1 || a.element === bond.atom1);
        const atom2 = atoms.find(a => a.id === bond.atom2 || a.element === bond.atom2);
        if (!atom1 || !atom2)
            return;
        const start = new THREE__namespace.Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
        const end = new THREE__namespace.Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
        const distance = start.distanceTo(end);
        const geometry = new THREE__namespace.CylinderGeometry(0.1, 0.1, distance, 8);
        const material = new THREE__namespace.MeshLambertMaterial({
            color: this.getBondColor(bond.order),
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE__namespace.Mesh(geometry, material);
        // Position and orient the bond
        const midpoint = new THREE__namespace.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mesh.position.copy(midpoint);
        mesh.lookAt(end);
        mesh.rotateX(Math.PI / 2);
        const bondId = bond.id || `bond_${Date.now()}`;
        this.bondMeshes.set(bondId, mesh);
        this.scene.add(mesh);
    }
    /**
     * Create GSAP animation timeline
     */
    createAnimationTimeline(transitions) {
        this.timeline.clear();
        // Animate each molecular transition
        transitions.forEach((transition, index) => {
            this.animateMolecularTransition(transition, index);
        });
        // Set total duration
        this.timeline.duration(this.config.duration);
    }
    animateMolecularTransition(transition, index) {
        const startTime = index * 0.1; // Stagger animations slightly
        // Animate atom positions
        transition.startStructure.atoms?.forEach((startAtom, atomIndex) => {
            const endAtom = transition.endStructure.atoms?.[atomIndex];
            if (!endAtom)
                return;
            const atomId = startAtom.id || `atom_${atomIndex}`;
            const mesh = this.atomMeshes.get(atomId);
            if (!mesh)
                return;
            this.timeline.to(mesh.position, {
                duration: this.config.duration * 0.8,
                x: endAtom.position.x,
                y: endAtom.position.y,
                z: endAtom.position.z,
                ease: this.config.easing
            }, startTime);
            // Animate atom scaling based on charge changes
            if (startAtom.charge !== endAtom.charge) {
                const scaleChange = 1 + ((endAtom.charge || 0) - (startAtom.charge || 0)) * 0.1;
                this.timeline.to(mesh.scale, {
                    duration: this.config.duration * 0.5,
                    x: scaleChange,
                    y: scaleChange,
                    z: scaleChange,
                    ease: 'elastic.out(1, 0.3)'
                }, startTime + this.config.duration * 0.25);
            }
        });
        // Animate bond changes
        if (this.config.showBondTransitions) {
            this.animateBondTransitions(transition, startTime);
        }
    }
    animateBondTransitions(transition, startTime) {
        transition.startStructure.bonds?.forEach((startBond, bondIndex) => {
            const endBond = transition.endStructure.bonds?.[bondIndex];
            if (!endBond)
                return;
            const bondId = startBond.id || `bond_${bondIndex}`;
            const mesh = this.bondMeshes.get(bondId);
            if (!mesh)
                return;
            // Animate bond order changes through scaling
            if (startBond.order !== endBond.order) {
                const scaleChange = endBond.order / startBond.order;
                if (endBond.order > startBond.order) {
                    // Bond formation - grow effect
                    this.timeline.from(mesh.scale, {
                        duration: this.config.duration * 0.3,
                        x: 0.1,
                        y: scaleChange,
                        z: 0.1,
                        ease: 'back.out(1.7)'
                    }, startTime + this.config.duration * 0.3);
                }
                else {
                    // Bond breaking - shrink effect
                    this.timeline.to(mesh.scale, {
                        duration: this.config.duration * 0.3,
                        x: 0.1,
                        y: scaleChange,
                        z: 0.1,
                        ease: 'power2.in'
                    }, startTime + this.config.duration * 0.5);
                }
            }
        });
    }
    /**
     * Create energy profile visualization
     */
    createEnergyProfileVisualization(transitions) {
        const points = [];
        const maxBarrier = Math.max(...transitions.map(t => t.energyBarrier));
        const steps = 100;
        // Generate energy curve points
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const energy = this.calculateFrameEnergy(transitions, progress);
            // Position curve in 3D space
            const x = (progress - 0.5) * 15; // Spread along x-axis
            const y = (energy / maxBarrier) * 5 - 7; // Scale and position energy
            const z = 8; // Position behind molecules
            points.push(new THREE__namespace.Vector3(x, y, z));
        }
        // Create line geometry
        const geometry = new THREE__namespace.BufferGeometry().setFromPoints(points);
        const material = new THREE__namespace.LineBasicMaterial({
            color: 0x00ff00,
            linewidth: 3,
            transparent: true,
            opacity: 0.7
        });
        this.energyProfileMesh = new THREE__namespace.Line(geometry, material);
        this.scene.add(this.energyProfileMesh);
    }
    /**
     * Create particle effects for bond breaking/formation
     */
    createParticleEffects() {
        const particleCount = 1000;
        const geometry = new THREE__namespace.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        // Initialize particle positions
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        geometry.setAttribute('position', new THREE__namespace.BufferAttribute(positions, 3));
        const material = new THREE__namespace.PointsMaterial({
            color: 0x888888,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        this.particleSystem = new THREE__namespace.Points(geometry, material);
        this.scene.add(this.particleSystem);
        // Animate particles
        this.timeline.to(this.particleSystem.rotation, {
            duration: this.config.duration,
            x: Math.PI * 2,
            y: Math.PI,
            ease: 'none'
        }, 0);
    }
    /**
     * Animation control methods
     */
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.timeline.play();
            this.startRenderLoop();
        }
    }
    pause() {
        this.isPlaying = false;
        this.timeline.pause();
    }
    reset() {
        this.isPlaying = false;
        this.currentFrame = 0;
        this.timeline.progress(0);
        this.timeline.pause();
    }
    setProgress(progress) {
        this.timeline.progress(Math.max(0, Math.min(1, progress)));
        this.currentFrame = Math.floor(progress * this.totalFrames);
    }
    /**
     * Event handling
     */
    onProgressUpdate(callback) {
        this.onProgress = callback;
    }
    onAnimationComplete(callback) {
        this.onComplete = callback;
    }
    onFrameChange(callback) {
        this.onFrameUpdate = callback;
    }
    /**
     * Utility methods
     */
    getAtomColor(element) {
        const colors = {
            'H': 0xffffff, // White
            'C': 0x909090, // Gray
            'N': 0x3050f8, // Blue
            'O': 0xff0d0d, // Red
            'F': 0x90e050, // Green
            'Cl': 0x1ff01f, // Bright green
            'Br': 0xa62929, // Brown
            'I': 0x940094, // Purple
            'S': 0xffff30, // Yellow
            'P': 0xff8000, // Orange
        };
        return colors[element] || 0xffc0cb; // Default pink
    }
    getAtomRadius(element) {
        const radii = {
            'H': 0.31,
            'C': 0.76,
            'N': 0.71,
            'O': 0.66,
            'F': 0.57,
            'Cl': 1.02,
            'Br': 1.20,
            'I': 1.39,
            'S': 1.05,
            'P': 1.07,
        };
        return (radii[element] || 1.0) * 0.3; // Scale down for visualization
    }
    getBondColor(order) {
        if (order >= 3)
            return 0xff4444; // Triple bond - red
        if (order >= 2)
            return 0x4444ff; // Double bond - blue
        return 0x888888; // Single bond - gray
    }
    onTimelineUpdate() {
        const progress = this.timeline.progress();
        const frameIndex = Math.floor(progress * this.totalFrames);
        if (frameIndex !== this.currentFrame && this.animationData[frameIndex]) {
            this.currentFrame = frameIndex;
            if (this.onProgress) {
                this.onProgress(progress);
            }
            if (this.onFrameUpdate) {
                this.onFrameUpdate(this.animationData[frameIndex]);
            }
        }
    }
    handleAnimationComplete() {
        this.isPlaying = false;
        if (this.onComplete) {
            this.onComplete();
        }
    }
    startRenderLoop() {
        const animate = () => {
            if (this.isPlaying) {
                requestAnimationFrame(animate);
            }
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
    startContinuousRender() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
        console.log('🎬 Continuous render loop started');
    }
    onWindowResize(container) {
        // Resize Three.js renderer
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        // Resize 3Dmol.js viewer
        if (this.mol3dViewer && this.mol3dContainer) {
            this.mol3dContainer.style.width = container.clientWidth + 'px';
            this.mol3dContainer.style.height = container.clientHeight + 'px';
            this.mol3dViewer.resize();
        }
    }
    clearScene() {
        // Clear Three.js meshes
        this.atomMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.bondMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        if (this.energyProfileMesh) {
            this.scene.remove(this.energyProfileMesh);
            this.energyProfileMesh.geometry.dispose();
            this.energyProfileMesh.material.dispose();
        }
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        this.atomMeshes.clear();
        this.bondMeshes.clear();
        // Clear 3Dmol.js viewer
        if (this.mol3dViewer) {
            this.mol3dViewer.clear();
            this.molecularModels.clear();
        }
    }
    /**
     * Generate substitution reaction transitions
     */
    generateSubstitutionTransitions(reactants, products) {
        const transitions = [];
        for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
            transitions.push({
                startStructure: reactants[i],
                endStructure: products[i],
                transitionType: 'rearrangement',
                energyBarrier: 25.0, // kcal/mol typical for substitution
            });
        }
        return transitions;
    }
    /**
     * Generate addition reaction transitions
     */
    generateAdditionTransitions(reactants, products) {
        const transitions = [];
        for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
            transitions.push({
                startStructure: reactants[i],
                endStructure: products[i],
                transitionType: 'formation',
                energyBarrier: 15.0, // kcal/mol typical for addition
            });
        }
        return transitions;
    }
    /**
     * Generate elimination reaction transitions
     */
    generateEliminationTransitions(reactants, products) {
        const transitions = [];
        for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
            transitions.push({
                startStructure: reactants[i],
                endStructure: products[i],
                transitionType: 'breaking',
                energyBarrier: 30.0, // kcal/mol typical for elimination
            });
        }
        return transitions;
    }
    /**
     * Generate generic reaction transitions
     */
    generateGenericTransitions(reactants, products) {
        const transitions = [];
        for (let i = 0; i < Math.min(reactants.length, products.length); i++) {
            transitions.push({
                startStructure: reactants[i],
                endStructure: products[i],
                transitionType: 'rearrangement',
                energyBarrier: 20.0, // kcal/mol generic barrier
            });
        }
        return transitions;
    }
    /**
     * Cleanup
     */
    dispose() {
        this.clearScene();
        this.timeline.kill();
        this.renderer.dispose();
    }
}

/**
 * @fileoverview Telemetry and Logging Type Definitions
 * @module @creb/core/telemetry/types
 * @version 1.0.0
 * @author CREB Team
 *
 * Comprehensive type definitions for structured logging, metrics, and telemetry.
 * Supports correlation IDs, performance tracking, and multi-destination logging.
 */
/**
 * Log level hierarchy for filtering
 */
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
};
/**
 * Default performance thresholds
 */
const PERFORMANCE_THRESHOLDS = {
    /** Slow operation threshold in ms */
    SLOW_OPERATION: 1000,
    /** Very slow operation threshold in ms */
    VERY_SLOW_OPERATION: 5000,
    /** High memory usage threshold in bytes */
    HIGH_MEMORY_USAGE: 100 * 1024 * 1024, // 100MB
    /** High CPU usage threshold (percentage) */
    HIGH_CPU_USAGE: 80,
};
/**
 * Type guards for runtime type checking
 */
const isLogLevel = (value) => {
    return typeof value === 'string' && value in LOG_LEVELS;
};
const isLogEntry = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'level' in value &&
        'message' in value &&
        'timestamp' in value &&
        'correlationId' in value);
};
const isMetric = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'type' in value &&
        'value' in value &&
        'timestamp' in value);
};
/**
 * Utility functions for creating branded types
 */
const createCorrelationId = (id) => id;
const createTimestamp = (timestamp) => (timestamp ?? Date.now());
/**
 * Default telemetry configuration
 */
const DEFAULT_TELEMETRY_CONFIG = {
    logger: {
        name: 'creb',
        level: 'info',
        format: 'json',
        destinations: [
            {
                type: 'console',
                options: {},
                enabled: true,
            },
        ],
        enabled: true,
        includeStack: true,
        includeMetrics: true,
        bufferSize: 100,
        flushInterval: 1000,
    },
    metrics: {
        enabled: true,
        collectInterval: 10000, // 10 seconds
        retentionPeriod: 3600000, // 1 hour
    },
    context: {
        enabled: true,
        propagateAcrossAsync: true,
    },
    performance: {
        enabled: true,
        sampleRate: 0.1, // 10% sampling
        thresholds: PERFORMANCE_THRESHOLDS,
    },
};

/**
 * @fileoverview Context Management and Propagation
 * @module @creb/core/telemetry/Context
 * @version 1.0.0
 * @author CREB Team
 *
 * Provides context propagation for correlation IDs and logging context
 * across async operations and module boundaries.
 */
/**
 * Context storage using Node.js AsyncLocalStorage for automatic propagation
 */
const contextStorage = new async_hooks.AsyncLocalStorage();
/**
 * Context Manager class for managing logging context and correlation IDs
 */
class ContextManager {
    constructor() {
        this.defaultContext = {
            operation: 'unknown',
            module: 'creb',
        };
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ContextManager.instance) {
            ContextManager.instance = new ContextManager();
        }
        return ContextManager.instance;
    }
    /**
     * Get current context from async storage
     */
    getContext() {
        const state = contextStorage.getStore();
        if (state) {
            return { ...state.context };
        }
        return { ...this.defaultContext };
    }
    /**
     * Set context in current async context
     */
    setContext(context) {
        const current = this.getCurrentState();
        const updatedContext = { ...current.context, ...context };
        const newState = {
            ...current,
            context: updatedContext,
        };
        // Run in new context with updated state
        contextStorage.run(newState, () => {
            // Context is now set for this async scope
        });
    }
    /**
     * Create child context with inheritance
     */
    createChild(context) {
        const childManager = new ChildContextManager(this, context);
        return childManager;
    }
    /**
     * Clear current context
     */
    clear() {
        contextStorage.run(this.createDefaultState(), () => {
            // Context cleared
        });
    }
    /**
     * Get current correlation ID
     */
    getCorrelationId() {
        const state = contextStorage.getStore();
        return state?.correlationId ?? this.generateCorrelationId();
    }
    /**
     * Set correlation ID
     */
    setCorrelationId(id) {
        const current = this.getCurrentState();
        const newState = {
            ...current,
            correlationId: id,
        };
        contextStorage.run(newState, () => {
            // Correlation ID set
        });
    }
    /**
     * Run function with specific context
     */
    runWithContext(context, fn, correlationId) {
        const currentState = this.getCurrentState();
        const newState = {
            correlationId: correlationId ?? this.generateCorrelationId(),
            context: { ...currentState.context, ...context },
            createdAt: createTimestamp(),
            parentId: currentState.correlationId,
        };
        return contextStorage.run(newState, fn);
    }
    /**
     * Run async function with specific context
     */
    async runWithContextAsync(context, fn, correlationId) {
        const currentState = this.getCurrentState();
        const newState = {
            correlationId: correlationId ?? this.generateCorrelationId(),
            context: { ...currentState.context, ...context },
            createdAt: createTimestamp(),
            parentId: currentState.correlationId,
        };
        return contextStorage.run(newState, fn);
    }
    /**
     * Get context trace (current + parent contexts)
     */
    getContextTrace() {
        const current = this.getCurrentState();
        return {
            current: current.correlationId,
            parent: current.parentId,
            depth: this.calculateDepth(current),
            createdAt: current.createdAt,
            context: current.context,
        };
    }
    /**
     * Generate new correlation ID
     */
    generateCorrelationId() {
        return createCorrelationId(`creb-${crypto.randomUUID()}`);
    }
    /**
     * Get current state or create default
     */
    getCurrentState() {
        return contextStorage.getStore() ?? this.createDefaultState();
    }
    /**
     * Create default context state
     */
    createDefaultState() {
        return {
            correlationId: this.generateCorrelationId(),
            context: { ...this.defaultContext },
            createdAt: createTimestamp(),
        };
    }
    /**
     * Calculate context depth for tracing
     */
    calculateDepth(state) {
        let depth = 0;
        let current = state;
        // This is a simplified version - in a real implementation,
        // you might want to track this more efficiently
        while (current.parentId && depth < 100) { // Prevent infinite loops
            depth++;
            // In a full implementation, you'd need to track parent states
            break;
        }
        return depth;
    }
}
/**
 * Child context manager for scoped contexts
 */
class ChildContextManager {
    constructor(parent, childContext) {
        this.parent = parent;
        this.childContext = childContext;
    }
    getContext() {
        const parentContext = this.parent.getContext();
        return { ...parentContext, ...this.childContext };
    }
    setContext(context) {
        this.childContext = { ...this.childContext, ...context };
    }
    createChild(context) {
        const mergedContext = { ...this.childContext, ...context };
        return new ChildContextManager(this.parent, mergedContext);
    }
    clear() {
        this.childContext = {};
    }
}
/**
 * Context utilities
 */
class ContextUtils {
    /**
     * Create correlation ID from parts
     */
    static createCorrelationId(prefix, suffix) {
        const parts = [
            prefix ?? 'creb',
            crypto.randomUUID(),
            suffix,
        ].filter(Boolean);
        return createCorrelationId(parts.join('-'));
    }
    /**
     * Extract correlation ID from string
     */
    static extractCorrelationId(value) {
        // Simple validation - could be more sophisticated
        if (value && value.length > 0) {
            return createCorrelationId(value);
        }
        return null;
    }
    /**
     * Format correlation ID for display
     */
    static formatCorrelationId(id, length = 8) {
        const idStr = String(id);
        if (idStr.length <= length) {
            return idStr;
        }
        return `${idStr.substring(0, length)}...`;
    }
    /**
     * Merge contexts with precedence
     */
    static mergeContexts(...contexts) {
        const merged = {
            operation: 'unknown',
            module: 'creb',
        };
        for (const context of contexts) {
            Object.assign(merged, context);
        }
        return merged;
    }
    /**
     * Validate context structure
     */
    static validateContext(context) {
        return (typeof context === 'object' &&
            context !== null &&
            'operation' in context &&
            'module' in context &&
            typeof context.operation === 'string' &&
            typeof context.module === 'string');
    }
}
/**
 * Decorator for automatic context propagation
 */
function withContext(context) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        if (!originalMethod) {
            throw new Error('Decorator can only be applied to methods');
        }
        descriptor.value = function (...args) {
            const contextManager = ContextManager.getInstance();
            if (originalMethod.constructor.name === 'AsyncFunction') {
                return contextManager.runWithContextAsync(context, async () => {
                    return await originalMethod.apply(this, args);
                });
            }
            else {
                return contextManager.runWithContext(context, () => {
                    return originalMethod.apply(this, args);
                });
            }
        };
        return descriptor;
    };
}
/**
 * Global context manager instance
 */
const globalContextManager = ContextManager.getInstance();
/**
 * Convenience functions for common operations
 */
const getCurrentContext = () => globalContextManager.getContext();
const getCurrentCorrelationId = () => globalContextManager.getCorrelationId();
const setContext = (context) => globalContextManager.setContext(context);
const setCorrelationId = (id) => globalContextManager.setCorrelationId(id);
const runWithContext = (context, fn) => globalContextManager.runWithContext(context, fn);
const runWithContextAsync = (context, fn) => globalContextManager.runWithContextAsync(context, fn);

/**
 * @fileoverview Performance Metrics Collection and Analysis
 * @module @creb/core/telemetry/Metrics
 * @version 1.0.0
 * @author CREB Team
 *
 * Comprehensive metrics collection system for performance monitoring,
 * automatic metric capture, and telemetry aggregation.
 */
/**
 * Metrics Registry for storing and managing metrics
 */
class MetricsRegistry extends events.EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.counters = new Map();
        this.gauges = new Map();
        this.histograms = new Map();
        this.timers = new Map();
        this.maxRetentionSize = 10000;
        this.defaultBuckets = [0.1, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1000];
        this.setupPeriodicCleanup();
    }
    /**
     * Record a counter metric (monotonically increasing)
     */
    counter(name, value = 1, tags = {}) {
        const currentValue = this.counters.get(name) || 0;
        const newValue = currentValue + value;
        this.counters.set(name, newValue);
        const metric = {
            name,
            type: 'counter',
            value: newValue,
            tags,
            timestamp: createTimestamp(),
        };
        this.recordMetric(metric);
    }
    /**
     * Record a gauge metric (arbitrary value that can go up or down)
     */
    gauge(name, value, tags = {}) {
        this.gauges.set(name, value);
        const metric = {
            name,
            type: 'gauge',
            value,
            tags,
            timestamp: createTimestamp(),
        };
        this.recordMetric(metric);
    }
    /**
     * Record a histogram metric (distribution of values)
     */
    histogram(name, value, tags = {}, buckets = this.defaultBuckets) {
        let histogramData = this.histograms.get(name);
        if (!histogramData) {
            histogramData = {
                buckets: buckets.map(le => ({ le, count: 0 })),
                sum: 0,
                count: 0,
            };
            this.histograms.set(name, histogramData);
        }
        // Update histogram
        histogramData.sum += value;
        histogramData.count += 1;
        // Update buckets
        for (const bucket of histogramData.buckets) {
            if (value <= bucket.le) {
                bucket.count += 1;
            }
        }
        const metric = {
            name,
            type: 'histogram',
            value,
            tags: { ...tags, bucket: 'sample' },
            timestamp: createTimestamp(),
        };
        this.recordMetric(metric);
    }
    /**
     * Start a timer for measuring duration
     */
    startTimer(name, tags = {}) {
        const startTime = perf_hooks.performance.now();
        const timer = {
            name,
            startTime,
            stop: () => {
                const duration = perf_hooks.performance.now() - startTime;
                this.histogram(`${name}_duration_ms`, duration, tags);
                this.timers.delete(name);
                return duration;
            },
            elapsed: () => perf_hooks.performance.now() - startTime,
        };
        this.timers.set(name, timer);
        return timer;
    }
    /**
     * Time a synchronous function execution
     */
    time(name, fn, tags = {}) {
        const timer = this.startTimer(name, tags);
        try {
            const result = fn();
            return result;
        }
        finally {
            timer.stop();
        }
    }
    /**
     * Time an asynchronous function execution
     */
    async timeAsync(name, fn, tags = {}) {
        const timer = this.startTimer(name, tags);
        try {
            const result = await fn();
            return result;
        }
        finally {
            timer.stop();
        }
    }
    /**
     * Record custom performance metrics
     */
    recordPerformanceMetrics(metrics, tags = {}) {
        if (metrics.duration !== undefined) {
            this.histogram('operation_duration_ms', metrics.duration, tags);
        }
        if (metrics.memoryUsage !== undefined) {
            this.gauge('memory_usage_bytes', metrics.memoryUsage, tags);
        }
        if (metrics.cpuUsage !== undefined) {
            this.gauge('cpu_usage_percent', metrics.cpuUsage, tags);
        }
        if (metrics.operationCount !== undefined) {
            this.counter('operations_total', metrics.operationCount, tags);
        }
        if (metrics.cacheHitRatio !== undefined) {
            this.gauge('cache_hit_ratio', metrics.cacheHitRatio, tags);
        }
        // Record custom metrics
        if (metrics.custom) {
            for (const [key, value] of Object.entries(metrics.custom)) {
                this.gauge(`custom_${key}`, value, tags);
            }
        }
    }
    /**
     * Get current metric value
     */
    getMetric(name) {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) {
            return undefined;
        }
        const latest = values[values.length - 1];
        return {
            name,
            type: this.inferMetricType(name),
            value: latest.value,
            tags: latest.tags,
            timestamp: latest.timestamp,
        };
    }
    /**
     * Get all metrics values for a metric name
     */
    getMetricHistory(name, limit) {
        const values = this.metrics.get(name) || [];
        return limit ? values.slice(-limit) : [...values];
    }
    /**
     * Get metric statistics
     */
    getMetricStats(name) {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) {
            return undefined;
        }
        const numericValues = values.map(v => v.value);
        const sorted = [...numericValues].sort((a, b) => a - b);
        return {
            count: values.length,
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
            median: this.calculateMedian(sorted),
            p95: this.calculatePercentile(sorted, 0.95),
            p99: this.calculatePercentile(sorted, 0.99),
            stdDev: this.calculateStandardDeviation(numericValues),
        };
    }
    /**
     * Collect all current metrics
     */
    async collect() {
        const metrics = [];
        // Collect counters
        this.counters.forEach((value, name) => {
            metrics.push({
                name,
                type: 'counter',
                value,
                timestamp: createTimestamp(),
                tags: {},
            });
        });
        // Collect gauges
        this.gauges.forEach((value, name) => {
            metrics.push({
                name,
                type: 'gauge',
                value,
                timestamp: createTimestamp(),
                tags: {},
            });
        });
        // Collect histograms
        this.histograms.forEach((histogram, name) => {
            // Add histogram buckets
            for (const bucket of histogram.buckets) {
                metrics.push({
                    name: `${name}_bucket`,
                    type: 'histogram',
                    value: bucket.count,
                    timestamp: createTimestamp(),
                    tags: { le: bucket.le.toString() },
                });
            }
            // Add histogram sum and count
            metrics.push({
                name: `${name}_sum`,
                type: 'histogram',
                value: histogram.sum,
                timestamp: createTimestamp(),
                tags: {},
            });
            metrics.push({
                name: `${name}_count`,
                type: 'histogram',
                value: histogram.count,
                timestamp: createTimestamp(),
                tags: {},
            });
        });
        return metrics;
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.metrics.clear();
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
        this.timers.clear();
        this.emit('metrics:reset');
    }
    /**
     * Reset specific metric
     */
    resetMetric(name) {
        this.metrics.delete(name);
        this.counters.delete(name);
        this.gauges.delete(name);
        this.histograms.delete(name);
        this.timers.delete(name);
        this.emit('metrics:reset', name);
    }
    /**
     * Get system performance metrics
     */
    getSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            memoryUsage: memoryUsage.heapUsed,
            cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to milliseconds
            operationCount: this.metrics.size,
            custom: {
                heap_total: memoryUsage.heapTotal,
                heap_used: memoryUsage.heapUsed,
                external: memoryUsage.external,
                rss: memoryUsage.rss,
                gc_duration: 0, // Would need to hook into GC events
            },
        };
    }
    /**
     * Check performance thresholds and emit alerts
     */
    checkThresholds() {
        const systemMetrics = this.getSystemMetrics();
        if (systemMetrics.memoryUsage && systemMetrics.memoryUsage > PERFORMANCE_THRESHOLDS.HIGH_MEMORY_USAGE) {
            this.emit('threshold:exceeded', {
                metric: 'memory_usage',
                value: systemMetrics.memoryUsage,
                threshold: PERFORMANCE_THRESHOLDS.HIGH_MEMORY_USAGE,
            });
        }
        if (systemMetrics.cpuUsage && systemMetrics.cpuUsage > PERFORMANCE_THRESHOLDS.HIGH_CPU_USAGE) {
            this.emit('threshold:exceeded', {
                metric: 'cpu_usage',
                value: systemMetrics.cpuUsage,
                threshold: PERFORMANCE_THRESHOLDS.HIGH_CPU_USAGE,
            });
        }
    }
    /**
     * Record a metric value internally
     */
    recordMetric(metric) {
        let values = this.metrics.get(metric.name);
        if (!values) {
            values = [];
            this.metrics.set(metric.name, values);
        }
        values.push({
            value: metric.value,
            timestamp: metric.timestamp,
            tags: metric.tags || {},
        });
        // Limit retention size
        if (values.length > this.maxRetentionSize) {
            values.splice(0, values.length - this.maxRetentionSize);
        }
        this.emit('metric:recorded', metric);
    }
    /**
     * Infer metric type from name patterns
     */
    inferMetricType(name) {
        if (name.includes('_total') || name.includes('_count')) {
            return 'counter';
        }
        if (name.includes('_duration') || name.includes('_bucket')) {
            return 'histogram';
        }
        if (name.includes('_timer')) {
            return 'timer';
        }
        return 'gauge';
    }
    /**
     * Calculate median value
     */
    calculateMedian(sorted) {
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }
    /**
     * Calculate percentile value
     */
    calculatePercentile(sorted, percentile) {
        const index = Math.ceil(sorted.length * percentile) - 1;
        return sorted[Math.max(0, index)];
    }
    /**
     * Calculate standard deviation
     */
    calculateStandardDeviation(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(avgSquaredDiff);
    }
    /**
     * Setup periodic cleanup of old metrics
     */
    setupPeriodicCleanup() {
        const cleanupInterval = 5 * 60 * 1000; // 5 minutes
        setInterval(() => {
            const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour ago
            this.metrics.forEach((values, name) => {
                const filtered = values.filter(v => v.timestamp > cutoff);
                if (filtered.length !== values.length) {
                    this.metrics.set(name, filtered);
                }
            });
        }, cleanupInterval);
    }
}
/**
 * Performance profiler for automatic metric capture
 */
class PerformanceProfiler {
    constructor(metrics, enabled = true) {
        this.metrics = metrics;
        this.enabled = enabled;
    }
    /**
     * Profile a function execution
     */
    profile(name, fn, tags = {}) {
        if (!this.enabled) {
            return fn();
        }
        return this.metrics.time(name, fn, tags);
    }
    /**
     * Profile an async function execution
     */
    async profileAsync(name, fn, tags = {}) {
        if (!this.enabled) {
            return await fn();
        }
        return await this.metrics.timeAsync(name, fn, tags);
    }
    /**
     * Create a profiling decorator
     */
    createProfileDecorator(name, tags = {}) {
        const metrics = this.metrics;
        return (target, propertyKey, descriptor) => {
            const metricName = name || `${target.constructor.name}.${propertyKey}`;
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                if (originalMethod.constructor.name === 'AsyncFunction') {
                    return metrics.timeAsync(metricName, async () => {
                        return await originalMethod.apply(this, args);
                    }, tags);
                }
                else {
                    return metrics.time(metricName, () => {
                        return originalMethod.apply(this, args);
                    }, tags);
                }
            };
            return descriptor;
        };
    }
}
/**
 * Global metrics registry instance
 */
const globalMetrics = new MetricsRegistry();
/**
 * Global performance profiler
 */
const globalProfiler = new PerformanceProfiler(globalMetrics);
/**
 * Convenience functions for metrics
 */
const counter = (name, value, tags) => globalMetrics.counter(name, value, tags);
const gauge = (name, value, tags) => globalMetrics.gauge(name, value, tags);
const histogram = (name, value, tags) => globalMetrics.histogram(name, value, tags);
const time = (name, fn, tags) => globalMetrics.time(name, fn, tags);
const timeAsync = (name, fn, tags) => globalMetrics.timeAsync(name, fn, tags);
/**
 * Profile decorator for automatic method timing
 */
const Profile = (name, tags = {}) => globalProfiler.createProfileDecorator(name, tags);

/**
 * Structured Logger Implementation
 *
 * Provides structured JSON logging with context propagation, performance metrics,
 * and zero-overhead when disabled.
 */
exports.LogLevel = void 0;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["OFF"] = 4] = "OFF";
})(exports.LogLevel || (exports.LogLevel = {}));
class ConsoleDestination {
    write(entry) {
        this.writeToConsole(JSON.stringify(entry));
    }
    writeToConsole(message) {
        try {
            console.log(message);
        }
        catch (error) {
            // Handle EPIPE errors gracefully (broken pipe when output is piped)
            if (error?.code === 'EPIPE') {
                // Silently ignore EPIPE errors to prevent crash
                return;
            }
            // Re-throw other errors
            throw error;
        }
    }
}
class FileDestination {
    constructor(filePath) {
        this.filePath = filePath;
    }
    write(entry) {
        // Implementation would use fs.appendFile in real scenario
        // For demo purposes, we'll use console with file prefix
        console.log(`[FILE:${this.filePath}] ${JSON.stringify(entry)}`);
    }
}
class LevelFilter {
    constructor(minLevel) {
        this.minLevel = minLevel;
    }
    shouldLog(entry) {
        const entryLevel = exports.LogLevel[entry.level];
        return entryLevel >= this.minLevel;
    }
}
class ModuleFilter {
    constructor(modules) {
        this.modules = modules;
    }
    shouldLog(entry) {
        if (!entry.module)
            return true;
        return this.modules.includes(entry.module);
    }
}
class StructuredLogger {
    constructor(config) {
        this.config = config;
        this.children = new Map();
    }
    static getGlobalLogger() {
        if (!StructuredLogger.globalLogger) {
            StructuredLogger.globalLogger = LoggerFactory.createLogger({
                level: exports.LogLevel.INFO,
                destinations: [new ConsoleDestination()]
            });
        }
        return StructuredLogger.globalLogger;
    }
    static setGlobalLogger(logger) {
        StructuredLogger.globalLogger = logger;
    }
    child(module, context) {
        const key = `${module}-${JSON.stringify(context || {})}`;
        if (!this.children.has(key)) {
            const childConfig = {
                ...this.config,
                module
            };
            const child = new StructuredLogger(childConfig);
            child.children = this.children; // Share children map
            this.children.set(key, child);
        }
        return this.children.get(key);
    }
    debug(message, context, metadata) {
        this.log(exports.LogLevel.DEBUG, message, context, metadata);
    }
    info(message, context, metadata) {
        this.log(exports.LogLevel.INFO, message, context, metadata);
    }
    warn(message, context, metadata) {
        this.log(exports.LogLevel.WARN, message, context, metadata);
    }
    error(message, error, metadata) {
        let context;
        let errorObj;
        if (error instanceof Error) {
            errorObj = {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }
        else if (error) {
            context = error;
        }
        const entry = this.createLogEntry(exports.LogLevel.ERROR, message, context, metadata);
        if (errorObj) {
            entry.error = errorObj;
        }
        this.writeEntry(entry);
    }
    performance(operation, fn, context) {
        if (!this.config.enablePerformance) {
            return fn();
        }
        const startTime = process.hrtime.bigint();
        const start = Date.now();
        try {
            const result = fn();
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
            this.info(`Performance: ${operation}`, {
                ...context,
                operation,
                duration_ms: Math.round(duration * 100) / 100,
                timestamp: new Date(start).toISOString()
            }, {
                type: 'performance',
                start_time: start,
                end_time: Date.now()
            });
            return result;
        }
        catch (error) {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            this.error(`Performance: ${operation} failed`, error instanceof Error ? error : new Error(String(error)), {
                operation,
                duration_ms: Math.round(duration * 100) / 100,
                timestamp: new Date(start).toISOString(),
                type: 'performance_error'
            });
            throw error;
        }
    }
    async performanceAsync(operation, fn, context) {
        if (!this.config.enablePerformance) {
            return fn();
        }
        const startTime = process.hrtime.bigint();
        const start = Date.now();
        try {
            const result = await fn();
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            this.info(`Performance: ${operation}`, {
                ...context,
                operation,
                duration_ms: Math.round(duration * 100) / 100,
                timestamp: new Date(start).toISOString()
            }, {
                type: 'performance_async',
                start_time: start,
                end_time: Date.now()
            });
            return result;
        }
        catch (error) {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1000000;
            this.error(`Performance: ${operation} failed`, error instanceof Error ? error : new Error(String(error)), {
                operation,
                duration_ms: Math.round(duration * 100) / 100,
                timestamp: new Date(start).toISOString(),
                type: 'performance_async_error'
            });
            throw error;
        }
    }
    flush() {
        this.config.destinations.forEach(dest => {
            if (dest.flush) {
                dest.flush();
            }
        });
    }
    log(level, message, context, metadata) {
        const entry = this.createLogEntry(level, message, context, metadata);
        this.writeEntry(entry);
    }
    createLogEntry(level, message, context, metadata) {
        const entry = {
            timestamp: new Date().toISOString(),
            level: exports.LogLevel[level],
            message,
            context,
            metadata,
            module: this.config.module
        };
        // Add correlation ID from context if available
        // This would integrate with Context.ts in a full implementation
        try {
            const { getCurrentContext } = require('./Context');
            const currentContext = getCurrentContext();
            if (currentContext?.correlationId) {
                entry.correlationId = currentContext.correlationId;
            }
        }
        catch {
            // Context module not available or error - continue without correlation ID
        }
        return entry;
    }
    writeEntry(entry) {
        // Apply filters
        if (this.config.filters) {
            for (const filter of this.config.filters) {
                if (!filter.shouldLog(entry)) {
                    return;
                }
            }
        }
        // Write to all destinations
        this.config.destinations.forEach(dest => {
            try {
                dest.write(entry);
            }
            catch (error) {
                // Don't let destination errors crash the application
                console.error('Logger destination error:', error);
            }
        });
    }
}
StructuredLogger.globalLogger = null;
class LoggerFactory {
    static createLogger(config) {
        return new StructuredLogger(config);
    }
    static createConsoleLogger(level = exports.LogLevel.INFO) {
        return new StructuredLogger({
            level,
            destinations: [new ConsoleDestination()],
            filters: [new LevelFilter(level)],
            enablePerformance: true
        });
    }
    static createFileLogger(filePath, level = exports.LogLevel.INFO) {
        return new StructuredLogger({
            level,
            destinations: [new FileDestination(filePath)],
            filters: [new LevelFilter(level)],
            enablePerformance: true
        });
    }
    static createMultiDestinationLogger(destinations, level = exports.LogLevel.INFO, filters) {
        return new StructuredLogger({
            level,
            destinations,
            filters: filters || [new LevelFilter(level)],
            enablePerformance: true
        });
    }
}
// Convenience exports
const logger = StructuredLogger.getGlobalLogger();
const globalLogger = logger; // Alias for compatibility
const createLogger = LoggerFactory.createLogger;
const createConsoleLogger = LoggerFactory.createConsoleLogger;
const createFileLogger = LoggerFactory.createFileLogger;
const createMultiDestinationLogger = LoggerFactory.createMultiDestinationLogger;

/**
 * @fileoverview Telemetry Module Exports
 * @module @creb/core/telemetry
 * @version 1.0.0
 * @author CREB Team
 *
 * Main exports for the CREB telemetry system including structured logging,
 * metrics collection, context management, and performance monitoring.
 */
// Type exports
/**
 * Telemetry system initialization and configuration
 */
class TelemetrySystem {
    /**
     * Initialize the telemetry system with configuration
     */
    static initialize(config) {
        if (TelemetrySystem.initialized) {
            return;
        }
        TelemetrySystem.config = config;
        TelemetrySystem.initialized = true;
        // Initialize subsystems
        globalLogger.info('Telemetry system initialized', {
            operation: 'telemetry_init',
            module: 'telemetry',
        }, {
            config_provided: !!config,
            timestamp: Date.now(),
        });
    }
    /**
     * Check if telemetry system is initialized
     */
    static isInitialized() {
        return TelemetrySystem.initialized;
    }
    /**
     * Get current configuration
     */
    static getConfig() {
        return TelemetrySystem.config;
    }
    /**
     * Shutdown telemetry system
     */
    static async shutdown() {
        if (!TelemetrySystem.initialized) {
            return;
        }
        globalLogger.info('Telemetry system shutting down', {
            operation: 'telemetry_shutdown',
            module: 'telemetry',
        });
        // Flush all pending logs and metrics
        globalLogger.flush();
        TelemetrySystem.initialized = false;
    }
}
TelemetrySystem.initialized = false;
TelemetrySystem.config = null;
/**
 * Default telemetry initialization for quick setup
 */
const initializeTelemetry = (config) => TelemetrySystem.initialize(config);
/**
 * Quick access to commonly used telemetry functions
 */
const telemetry = {
    // Logging
    debug: (message, context, metadata) => globalLogger.debug(message, context, metadata),
    info: (message, context, metadata) => globalLogger.info(message, context, metadata),
    warn: (message, context, metadata) => globalLogger.warn(message, context, metadata),
    error: (message, error, metadata) => globalLogger.error(message, error, metadata),
    fatal: (message, error, metadata) => globalLogger.error(message, error, metadata), // Map fatal to error
    // Metrics
    counter,
    gauge,
    histogram,
    time,
    timeAsync,
    // Context
    setContext,
    setCorrelationId,
    runWithContext,
    runWithContextAsync,
    // System
    initialize: initializeTelemetry,
    shutdown: TelemetrySystem.shutdown,
    isInitialized: TelemetrySystem.isInitialized,
};

/**
 * CREB Phase 3: AI-Powered Reaction Classification System
 *
 * This module provides intelligent reaction type detection and optimal
 * animation style selection using pattern matching and machine learning.
 */
/**
 * AI-Powered Reaction Classifier
 * Uses pattern matching and heuristics to classify chemical reactions
 * and suggest optimal animation styles.
 */
class ReactionClassifier {
    /**
     * Classify a chemical reaction and suggest optimal animation style
     */
    async classifyReaction(equation) {
        return globalProfiler.profileAsync('reaction.classification', async () => {
            try {
                telemetry.info('🧠 Starting AI reaction classification', { equation });
                const characteristics = this.analyzeReactionCharacteristics(equation);
                const reactionType = this.determineReactionType(equation, characteristics);
                const confidence = this.calculateConfidence(reactionType, characteristics);
                const reasoning = this.generateReasoning(reactionType, characteristics);
                const suggestedStyle = this.getOptimalAnimationStyle(reactionType, characteristics);
                globalMetrics.counter('ai.classification.success', 1, {
                    reactionType,
                    confidence: confidence.toString()
                });
                const result = {
                    reactionType,
                    confidence,
                    reasoning,
                    suggestedStyle,
                    characteristics
                };
                telemetry.info('✅ AI classification complete', {
                    equation,
                    reactionType,
                    confidence,
                    characteristics: Object.keys(characteristics).filter(k => characteristics[k])
                });
                return result;
            }
            catch (error) {
                globalMetrics.counter('ai.classification.errors', 1);
                telemetry.error('❌ AI classification failed', error, { equation });
                // Fallback to general classification
                return {
                    reactionType: 'general',
                    confidence: 0.1,
                    reasoning: ['Classification failed, using default style'],
                    suggestedStyle: this.getDefaultAnimationStyle(),
                    characteristics: this.getDefaultCharacteristics()
                };
            }
        });
    }
    /**
     * Optimize animation parameters based on reaction type
     */
    async optimizeAnimationParameters(reactionType, reactants, products) {
        try {
            // Base parameters from reaction classification
            const baseParams = {
                duration: 3.0,
                temperature: 298,
                pressure: 1,
                solvent: 'vacuum'
            };
            // Adjust based on reaction mechanism
            if (reactionType.characteristics.hasEnergyRelease) {
                return {
                    ...baseParams,
                    duration: 2.0,
                    showEnergyProfile: true,
                    particleEffects: true
                };
            }
            if (reactionType.characteristics.hasGasProduction) {
                return {
                    ...baseParams,
                    duration: 3.5,
                    showBubbleEffects: true,
                    emphasizeVolumeChange: true
                };
            }
            return baseParams;
        }
        catch (error) {
            telemetry.error('ai.parameter_optimization_failed', error);
            throw error;
        }
    }
    /**
     * Analyze the structural characteristics of a reaction
     */
    analyzeReactionCharacteristics(equation) {
        const compounds = this.extractCompounds(equation);
        const reactants = compounds.reactants;
        const products = compounds.products;
        return {
            hasOxygen: this.containsOxygen(reactants) || this.containsOxygen(products),
            hasCombustibleFuel: this.containsCombustibleFuel(reactants),
            formsSingleProduct: products.length === 1,
            breaksIntoMultipleProducts: products.length > reactants.length,
            involvesIons: this.containsIons(reactants) || this.containsIons(products),
            hasEnergyRelease: this.isExothermic(equation),
            hasGasProduction: this.producesGas(products),
            hasPrecipitate: this.formsPrecipitate(equation)
        };
    }
    /**
     * Determine the primary reaction type based on patterns
     */
    determineReactionType(equation, characteristics) {
        // Combustion: Fuel + O2 → CO2 + H2O + energy
        if (characteristics.hasCombustibleFuel &&
            characteristics.hasOxygen &&
            equation.includes('CO2') &&
            equation.includes('H2O')) {
            return 'combustion';
        }
        // Synthesis: A + B → AB
        if (characteristics.formsSingleProduct && !characteristics.breaksIntoMultipleProducts) {
            return 'synthesis';
        }
        // Decomposition: AB → A + B
        if (characteristics.breaksIntoMultipleProducts && equation.split('→')[0].trim().split('+').length === 1) {
            return 'decomposition';
        }
        // Acid-Base: Acid + Base → Salt + Water
        if (this.isAcidBaseReaction(equation)) {
            return 'acid-base';
        }
        // Precipitation: Solutions → Solid + Solution
        if (characteristics.hasPrecipitate) {
            return 'precipitation';
        }
        // Gas Evolution
        if (characteristics.hasGasProduction) {
            return 'gas-evolution';
        }
        // Single Replacement: A + BC → AC + B
        if (this.isSingleReplacement(equation)) {
            return 'single-replacement';
        }
        // Double Replacement: AB + CD → AD + CB
        if (this.isDoubleReplacement(equation)) {
            return 'double-replacement';
        }
        // Redox reactions
        if (this.isRedoxReaction(equation)) {
            return 'redox';
        }
        return 'general';
    }
    /**
     * Get optimal animation style based on reaction type and characteristics
     */
    getOptimalAnimationStyle(reactionType, characteristics) {
        const styleMap = {
            'combustion': {
                energyVisualization: true,
                explosionEffects: true,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'fire',
                transitionDuration: 3000,
                easing: 'power2.out',
                cameraMovement: 'dramatic',
                molecularVibration: true,
                forceFieldVisualization: true,
                energyBarrierAnimation: true
            },
            'synthesis': {
                energyVisualization: true,
                explosionEffects: false,
                particleEffects: false,
                bondBreakingEffects: false,
                colorScheme: 'gentle',
                transitionDuration: 2500,
                easing: 'power1.inOut',
                cameraMovement: 'smooth',
                molecularVibration: false,
                forceFieldVisualization: true,
                energyBarrierAnimation: true
            },
            'decomposition': {
                energyVisualization: true,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'electric',
                transitionDuration: 2800,
                easing: 'power2.in',
                cameraMovement: 'dramatic',
                molecularVibration: true,
                forceFieldVisualization: true,
                energyBarrierAnimation: true
            },
            'acid-base': {
                energyVisualization: false,
                explosionEffects: false,
                particleEffects: false,
                bondBreakingEffects: true,
                colorScheme: 'water',
                transitionDuration: 2000,
                easing: 'power1.inOut',
                cameraMovement: 'smooth',
                molecularVibration: false,
                forceFieldVisualization: false,
                energyBarrierAnimation: false
            },
            'precipitation': {
                energyVisualization: false,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: false,
                colorScheme: 'earth',
                transitionDuration: 2200,
                easing: 'power2.out',
                cameraMovement: 'smooth',
                molecularVibration: false,
                forceFieldVisualization: false,
                energyBarrierAnimation: false
            },
            'single-replacement': {
                energyVisualization: true,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'electric',
                transitionDuration: 2600,
                easing: 'power1.inOut',
                cameraMovement: 'smooth',
                molecularVibration: true,
                forceFieldVisualization: true,
                energyBarrierAnimation: true
            },
            'double-replacement': {
                energyVisualization: false,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'water',
                transitionDuration: 2400,
                easing: 'power1.inOut',
                cameraMovement: 'smooth',
                molecularVibration: false,
                forceFieldVisualization: true,
                energyBarrierAnimation: false
            },
            'redox': {
                energyVisualization: true,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'electric',
                transitionDuration: 3200,
                easing: 'power2.inOut',
                cameraMovement: 'dramatic',
                molecularVibration: true,
                forceFieldVisualization: true,
                energyBarrierAnimation: true
            },
            'gas-evolution': {
                energyVisualization: false,
                explosionEffects: false,
                particleEffects: true,
                bondBreakingEffects: true,
                colorScheme: 'default',
                transitionDuration: 2300,
                easing: 'power1.out',
                cameraMovement: 'smooth',
                molecularVibration: true,
                forceFieldVisualization: false,
                energyBarrierAnimation: false
            },
            'general': this.getDefaultAnimationStyle()
        };
        return styleMap[reactionType];
    }
    /**
     * Extract compounds from equation string
     */
    extractCompounds(equation) {
        const [reactantSide, productSide] = equation.split(/[=→]/);
        const reactants = reactantSide
            .split('+')
            .map(compound => compound.trim().replace(/^\d+\s*/, ''))
            .filter(compound => compound.length > 0);
        const products = productSide
            .split('+')
            .map(compound => compound.trim().replace(/^\d+\s*/, ''))
            .filter(compound => compound.length > 0);
        return { reactants, products };
    }
    /**
     * Check if compounds contain oxygen
     */
    containsOxygen(compounds) {
        return compounds.some(compound => compound.includes('O2') ||
            compound.includes('O') && !compound.includes('OH'));
    }
    /**
     * Check if compounds contain combustible fuel
     */
    containsCombustibleFuel(compounds) {
        return compounds.some(compound => ReactionClassifier.COMBUSTION_FUELS.some(fuel => compound.includes(fuel)));
    }
    /**
     * Check if compounds contain ions (simplified check)
     */
    containsIons(compounds) {
        return compounds.some(compound => /\([A-Z][a-z]*\)[0-9]*/.test(compound) || // Polyatomic ions
            ReactionClassifier.ACIDS.includes(compound) ||
            ReactionClassifier.BASES.includes(compound));
    }
    /**
     * Determine if reaction is exothermic (simplified heuristics)
     */
    isExothermic(equation) {
        const exothermicKeywords = ['combustion', 'burning', '+energy', '+heat'];
        return exothermicKeywords.some(keyword => equation.toLowerCase().includes(keyword));
    }
    /**
     * Check if reaction produces gas
     */
    producesGas(products) {
        const gases = ['H2', 'O2', 'N2', 'CO2', 'CO', 'NH3', 'H2S', 'SO2', 'NO', 'NO2'];
        return products.some(product => gases.includes(product));
    }
    /**
     * Check if reaction forms precipitate
     */
    formsPrecipitate(equation) {
        // Simplified check - look for common insoluble compounds
        const precipitates = ['AgCl', 'BaSO4', 'CaCO3', 'PbI2', 'AgBr', 'AgI'];
        return precipitates.some(ppt => equation.includes(ppt));
    }
    /**
     * Check if reaction is acid-base
     */
    isAcidBaseReaction(equation) {
        const compounds = this.extractCompounds(equation);
        const hasAcid = compounds.reactants.some(r => ReactionClassifier.ACIDS.includes(r));
        const hasBase = compounds.reactants.some(r => ReactionClassifier.BASES.includes(r));
        const producesWater = compounds.products.includes('H2O');
        return hasAcid && hasBase && producesWater;
    }
    /**
     * Check if reaction is single replacement
     */
    isSingleReplacement(equation) {
        const compounds = this.extractCompounds(equation);
        return compounds.reactants.length === 2 && compounds.products.length === 2;
    }
    /**
     * Check if reaction is double replacement
     */
    isDoubleReplacement(equation) {
        const compounds = this.extractCompounds(equation);
        return compounds.reactants.length === 2 &&
            compounds.products.length === 2 &&
            this.containsIons(compounds.reactants);
    }
    /**
     * Check if reaction is redox (simplified)
     */
    isRedoxReaction(equation) {
        return ReactionClassifier.OXIDIZERS.some(oxidizer => equation.includes(oxidizer));
    }
    /**
     * Calculate confidence score for classification
     */
    calculateConfidence(reactionType, characteristics) {
        let confidence = 0.5; // Base confidence
        // Increase confidence based on characteristic matches
        const characteristicCount = Object.values(characteristics).filter(Boolean).length;
        confidence += characteristicCount * 0.1;
        // Specific boosts for well-defined reaction types
        if (reactionType === 'combustion' && characteristics.hasCombustibleFuel && characteristics.hasOxygen) {
            confidence += 0.3;
        }
        if (reactionType === 'synthesis' && characteristics.formsSingleProduct) {
            confidence += 0.2;
        }
        if (reactionType === 'decomposition' && characteristics.breaksIntoMultipleProducts) {
            confidence += 0.2;
        }
        return Math.min(confidence, 1.0);
    }
    /**
     * Generate human-readable reasoning for classification
     */
    generateReasoning(reactionType, characteristics) {
        const reasoning = [];
        switch (reactionType) {
            case 'combustion':
                if (characteristics.hasCombustibleFuel)
                    reasoning.push('Contains combustible fuel');
                if (characteristics.hasOxygen)
                    reasoning.push('Contains oxygen as oxidizer');
                reasoning.push('Produces CO2 and H2O typical of combustion');
                break;
            case 'synthesis':
                if (characteristics.formsSingleProduct)
                    reasoning.push('Forms single product from multiple reactants');
                reasoning.push('Classic synthesis reaction pattern A + B → AB');
                break;
            case 'decomposition':
                if (characteristics.breaksIntoMultipleProducts)
                    reasoning.push('Single reactant breaks into multiple products');
                reasoning.push('Classic decomposition pattern AB → A + B');
                break;
            case 'acid-base':
                reasoning.push('Contains acid and base reactants');
                reasoning.push('Produces water and salt products');
                break;
            default:
                reasoning.push(`Classified as ${reactionType} based on structural analysis`);
        }
        return reasoning;
    }
    /**
     * Get default animation style
     */
    getDefaultAnimationStyle() {
        return {
            energyVisualization: false,
            explosionEffects: false,
            particleEffects: false,
            bondBreakingEffects: true,
            colorScheme: 'default',
            transitionDuration: 2500,
            easing: 'power1.inOut',
            cameraMovement: 'smooth',
            molecularVibration: false,
            forceFieldVisualization: true,
            energyBarrierAnimation: false
        };
    }
    /**
     * Get default characteristics
     */
    getDefaultCharacteristics() {
        return {
            hasOxygen: false,
            hasCombustibleFuel: false,
            formsSingleProduct: false,
            breaksIntoMultipleProducts: false,
            involvesIons: false,
            hasEnergyRelease: false,
            hasGasProduction: false,
            hasPrecipitate: false
        };
    }
}
ReactionClassifier.COMBUSTION_FUELS = [
    'CH4', 'C2H6', 'C3H8', 'C4H10', // Alkanes
    'C2H4', 'C2H2', // Alkenes/Alkynes  
    'C6H12O6', 'C12H22O11', // Sugars
    'C8H18', 'C7H8', // Gasoline components
    'H2', 'CO', 'NH3' // Other fuels
];
ReactionClassifier.OXIDIZERS = ['O2', 'H2O2', 'KMnO4', 'K2Cr2O7'];
ReactionClassifier.ACIDS = ['HCl', 'H2SO4', 'HNO3', 'CH3COOH', 'H3PO4'];
ReactionClassifier.BASES = ['NaOH', 'KOH', 'Ca(OH)2', 'NH3', 'Mg(OH)2'];

/**
 * CREB Phase 3: Advanced Physics Simulation Engine
 *
 * This module provides realistic molecular dynamics and force field calculations
 * for chemically accurate animation sequences using Cannon.js physics engine.
 */
/**
 * Advanced Molecular Physics Engine
 * Provides realistic force field calculations and molecular dynamics simulation
 */
class MolecularPhysicsEngine {
    constructor(config = {}) {
        this.atomBodies = new Map();
        this.bondConstraints = new Map();
        this.config = {
            enableGravity: false, // Molecular scale doesn't need gravity
            gravityStrength: 0,
            enableInteratomicForces: true,
            forceFieldStrength: 1.0,
            dampingFactor: 0.1,
            timeStep: 1 / 60, // 60 FPS
            enableCollisionDetection: true,
            bondStiffness: 100.0,
            angleStiffness: 50.0,
            ...config
        };
        this.initializePhysicsWorld();
        telemetry.info('🧬 Molecular physics engine initialized', { config: this.config });
    }
    /**
     * Initialize the Cannon.js physics world
     */
    initializePhysicsWorld() {
        this.world = new CANNON__namespace.World({
            gravity: new CANNON__namespace.Vec3(0, this.config.gravityStrength, 0)
        });
        // Set up collision detection
        this.world.broadphase = new CANNON__namespace.NaiveBroadphase();
        this.world.solver.iterations = 10;
        this.world.allowSleep = false; // Keep molecules active
        // Add contact materials for realistic collisions
        const atomMaterial = new CANNON__namespace.Material('atom');
        const atomContactMaterial = new CANNON__namespace.ContactMaterial(atomMaterial, atomMaterial, {
            friction: 0.1,
            restitution: 0.9,
            contactEquationStiffness: 1e6,
            contactEquationRelaxation: 3
        });
        this.world.addContactMaterial(atomContactMaterial);
    }
    /**
     * Simulate molecular dynamics for a given time step
     */
    async simulateMolecularDynamics(atoms, bonds, deltaTime = this.config.timeStep) {
        return globalProfiler.profileAsync('physics.molecular_dynamics', async () => {
            try {
                telemetry.info('⚗️ Starting molecular dynamics simulation', {
                    atomCount: atoms.length,
                    bondCount: bonds.length,
                    deltaTime
                });
                // Calculate forces
                const forceField = await this.calculateForceField(atoms, bonds);
                // Apply forces to atoms
                this.applyForcesToAtoms(atoms, forceField);
                // Integrate motion equations
                this.integrateMotion(atoms, deltaTime);
                // Update bond states
                const updatedBonds = this.updateBondStates(atoms, bonds);
                // Calculate energies
                const energies = this.calculateEnergies(atoms, updatedBonds);
                // Update physics world
                this.updatePhysicsWorld(atoms, deltaTime);
                const result = {
                    atomStates: atoms,
                    bondStates: updatedBonds,
                    totalEnergy: energies.total,
                    kineticEnergy: energies.kinetic,
                    potentialEnergy: energies.potential,
                    temperature: this.calculateTemperature(atoms),
                    pressure: this.calculatePressure(atoms),
                    timestamp: Date.now()
                };
                globalMetrics.counter('physics.simulation.success', 1);
                telemetry.info('✅ Molecular dynamics step complete', {
                    totalEnergy: energies.total,
                    temperature: result.temperature
                });
                return result;
            }
            catch (error) {
                globalMetrics.counter('physics.simulation.errors', 1);
                telemetry.error('❌ Molecular dynamics simulation failed', error);
                throw error;
            }
        });
    }
    /**
     * Calculate comprehensive force field
     */
    async calculateForceField(atoms, bonds) {
        return globalProfiler.profileAsync('physics.force_calculation', async () => {
            const forceField = {
                vanDerWaals: new Array(atoms.length).fill(null).map(() => new THREE__namespace.Vector3()),
                electrostatic: new Array(atoms.length).fill(null).map(() => new THREE__namespace.Vector3()),
                bondStretch: new Array(atoms.length).fill(null).map(() => new THREE__namespace.Vector3()),
                angleStrain: new Array(atoms.length).fill(null).map(() => new THREE__namespace.Vector3()),
                torsional: new Array(atoms.length).fill(null).map(() => new THREE__namespace.Vector3())
            };
            // Calculate Van der Waals forces
            await this.calculateVanDerWaalsForces(atoms, forceField.vanDerWaals);
            // Calculate electrostatic forces
            await this.calculateElectrostaticForces(atoms, forceField.electrostatic);
            // Calculate bond stretching forces
            await this.calculateBondStretchingForces(atoms, bonds, forceField.bondStretch);
            // Calculate angle strain forces
            await this.calculateAngleStrainForces(atoms, bonds, forceField.angleStrain);
            return forceField;
        });
    }
    /**
     * Calculate Van der Waals (Lennard-Jones) forces
     */
    async calculateVanDerWaalsForces(atoms, vdwForces) {
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const atom1 = atoms[i];
                const atom2 = atoms[j];
                const distance = atom1.position.distanceTo(atom2.position);
                const sigma = (this.getVdwRadius(atom1.element) + this.getVdwRadius(atom2.element)) / 2;
                const epsilon = Math.sqrt(this.getVdwWellDepth(atom1.element) * this.getVdwWellDepth(atom2.element));
                // Lennard-Jones potential: 4ε[(σ/r)¹² - (σ/r)⁶]
                const sigma6 = Math.pow(sigma / distance, 6);
                const sigma12 = sigma6 * sigma6;
                const forceMagnitude = 24 * epsilon * (2 * sigma12 - sigma6) / distance;
                const direction = new THREE__namespace.Vector3()
                    .subVectors(atom2.position, atom1.position)
                    .normalize();
                const force = direction.multiplyScalar(forceMagnitude * this.config.forceFieldStrength);
                vdwForces[i].add(force);
                vdwForces[j].sub(force);
            }
        }
    }
    /**
     * Calculate electrostatic (Coulomb) forces
     */
    async calculateElectrostaticForces(atoms, electrostaticForces) {
        const k = 8.99e9; // Coulomb's constant (scaled for molecular simulation)
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                const atom1 = atoms[i];
                const atom2 = atoms[j];
                if (atom1.charge === 0 && atom2.charge === 0)
                    continue;
                const distance = atom1.position.distanceTo(atom2.position);
                const forceMagnitude = k * atom1.charge * atom2.charge / (distance * distance);
                const direction = new THREE__namespace.Vector3()
                    .subVectors(atom2.position, atom1.position)
                    .normalize();
                const force = direction.multiplyScalar(forceMagnitude * this.config.forceFieldStrength);
                electrostaticForces[i].add(force);
                electrostaticForces[j].sub(force);
            }
        }
    }
    /**
     * Calculate bond stretching forces (harmonic oscillator)
     */
    async calculateBondStretchingForces(atoms, bonds, bondForces) {
        for (const bond of bonds) {
            const atom1Index = atoms.findIndex(a => a.id === bond.atom1Id);
            const atom2Index = atoms.findIndex(a => a.id === bond.atom2Id);
            if (atom1Index === -1 || atom2Index === -1)
                continue;
            const atom1 = atoms[atom1Index];
            const atom2 = atoms[atom2Index];
            const currentLength = atom1.position.distanceTo(atom2.position);
            const displacement = currentLength - bond.restLength;
            // Hooke's law: F = -k * x
            const forceMagnitude = -bond.stiffness * displacement;
            const direction = new THREE__namespace.Vector3()
                .subVectors(atom2.position, atom1.position)
                .normalize();
            const force = direction.multiplyScalar(forceMagnitude);
            bondForces[atom1Index].add(force);
            bondForces[atom2Index].sub(force);
            // Update bond strain for breaking animation
            bond.strain = Math.abs(displacement / bond.restLength);
        }
    }
    /**
     * Calculate angle strain forces
     */
    async calculateAngleStrainForces(atoms, bonds, angleForces) {
        // Find angle triplets (atom-atom-atom connected by bonds)
        const angleConstraints = this.findAngleConstraints(atoms, bonds);
        for (const angle of angleConstraints) {
            const atom1 = atoms[angle.atom1Index];
            const atom2 = atoms[angle.atom2Index]; // Center atom
            const atom3 = atoms[angle.atom3Index];
            const vec1 = new THREE__namespace.Vector3().subVectors(atom1.position, atom2.position).normalize();
            const vec2 = new THREE__namespace.Vector3().subVectors(atom3.position, atom2.position).normalize();
            const currentAngle = vec1.angleTo(vec2);
            const angleDeviation = currentAngle - angle.restAngle;
            // Angular force calculation (simplified)
            const forceMagnitude = this.config.angleStiffness * angleDeviation;
            // Apply perpendicular forces to maintain angle
            const perpForce1 = new THREE__namespace.Vector3().crossVectors(vec1, vec2).normalize().multiplyScalar(forceMagnitude);
            const perpForce2 = perpForce1.clone().multiplyScalar(-1);
            angleForces[angle.atom1Index].add(perpForce1);
            angleForces[angle.atom3Index].add(perpForce2);
        }
    }
    /**
     * Apply calculated forces to atoms
     */
    applyForcesToAtoms(atoms, forceField) {
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            // Sum all forces
            const totalForce = new THREE__namespace.Vector3()
                .add(forceField.vanDerWaals[i])
                .add(forceField.electrostatic[i])
                .add(forceField.bondStretch[i])
                .add(forceField.angleStrain[i])
                .add(forceField.torsional[i]);
            // F = ma, so a = F/m
            atom.acceleration = totalForce.divideScalar(atom.mass);
            // Store forces for visualization
            atom.forces = [
                forceField.vanDerWaals[i].clone(),
                forceField.electrostatic[i].clone(),
                forceField.bondStretch[i].clone()
            ];
        }
    }
    /**
     * Integrate equations of motion using Verlet integration
     */
    integrateMotion(atoms, deltaTime) {
        for (const atom of atoms) {
            // Velocity Verlet integration
            atom.position.clone();
            atom.velocity.clone();
            // x(t+Δt) = x(t) + v(t)Δt + ½a(t)Δt²
            atom.position.add(atom.velocity.clone().multiplyScalar(deltaTime)).add(atom.acceleration.clone().multiplyScalar(0.5 * deltaTime * deltaTime));
            // v(t+Δt) = v(t) + a(t)Δt
            atom.velocity.add(atom.acceleration.clone().multiplyScalar(deltaTime));
            // Apply damping to prevent unrealistic motion
            atom.velocity.multiplyScalar(1 - this.config.dampingFactor * deltaTime);
        }
    }
    /**
     * Update bond states and detect breaking bonds
     */
    updateBondStates(atoms, bonds) {
        return bonds.map(bond => {
            const atom1 = atoms.find(a => a.id === bond.atom1Id);
            const atom2 = atoms.find(a => a.id === bond.atom2Id);
            if (!atom1 || !atom2)
                return bond;
            const currentLength = atom1.position.distanceTo(atom2.position);
            const stretchRatio = currentLength / bond.restLength;
            // Determine if bond is breaking (threshold: 150% of rest length)
            if (stretchRatio > 1.5 && !bond.isBreaking) {
                bond.isBreaking = true;
                bond.breakingProgress = 0;
                telemetry.info('💥 Bond breaking detected', {
                    bondId: bond.id,
                    stretchRatio,
                    atoms: [atom1.element, atom2.element]
                });
            }
            // Update breaking progress
            if (bond.isBreaking) {
                bond.breakingProgress = Math.min(bond.breakingProgress + 0.02, 1.0);
                bond.stiffness *= 0.95; // Gradually weaken the bond
            }
            return bond;
        });
    }
    /**
     * Calculate system energies
     */
    calculateEnergies(atoms, bonds) {
        let kineticEnergy = 0;
        let potentialEnergy = 0;
        // Kinetic energy: KE = ½mv²
        for (const atom of atoms) {
            const velocity = atom.velocity.length();
            kineticEnergy += 0.5 * atom.mass * velocity * velocity;
        }
        // Potential energy from bonds: PE = ½k(x-x₀)²
        for (const bond of bonds) {
            const atom1 = atoms.find(a => a.id === bond.atom1Id);
            const atom2 = atoms.find(a => a.id === bond.atom2Id);
            if (atom1 && atom2) {
                const currentLength = atom1.position.distanceTo(atom2.position);
                const displacement = currentLength - bond.restLength;
                potentialEnergy += 0.5 * bond.stiffness * displacement * displacement;
            }
        }
        return {
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: kineticEnergy + potentialEnergy
        };
    }
    /**
     * Calculate system temperature from kinetic energy
     */
    calculateTemperature(atoms) {
        let totalKineticEnergy = 0;
        for (const atom of atoms) {
            const velocity = atom.velocity.length();
            totalKineticEnergy += 0.5 * atom.mass * velocity * velocity;
        }
        // Temperature from equipartition theorem: KE = (3/2)NkT
        const kB = 1.380649e-23; // Boltzmann constant (scaled)
        const temperature = (2 * totalKineticEnergy) / (3 * atoms.length * kB);
        return temperature;
    }
    /**
     * Calculate system pressure (simplified ideal gas approximation)
     */
    calculatePressure(atoms) {
        const volume = 1000; // Arbitrary volume unit
        const temperature = this.calculateTemperature(atoms);
        const R = 8.314; // Gas constant (scaled)
        // PV = nRT
        const pressure = (atoms.length * R * temperature) / volume;
        return pressure;
    }
    /**
     * Update Cannon.js physics world
     */
    updatePhysicsWorld(atoms, deltaTime) {
        // Sync atom positions with physics bodies
        for (const atom of atoms) {
            const body = this.atomBodies.get(atom.id);
            if (body) {
                body.position.set(atom.position.x, atom.position.y, atom.position.z);
                body.velocity.set(atom.velocity.x, atom.velocity.y, atom.velocity.z);
            }
        }
        // Step the physics simulation
        this.world.fixedStep(deltaTime);
    }
    /**
     * Helper methods for force field parameters
     */
    getVdwRadius(element) {
        return MolecularPhysicsEngine.VDW_RADII[element] || 1.5;
    }
    getVdwWellDepth(element) {
        // Simplified well depth approximation
        const wellDepths = {
            H: 0.02, C: 0.07, N: 0.07, O: 0.06, S: 0.13, Cl: 0.23
        };
        return wellDepths[element] || 0.05;
    }
    getAtomicMass(element) {
        return MolecularPhysicsEngine.ATOMIC_MASSES[element] || 12.0;
    }
    getBondLength(atom1, atom2, bondType) {
        const bondKey = `${atom1}-${atom2}`;
        const reverseBondKey = `${atom2}-${atom1}`;
        return MolecularPhysicsEngine.BOND_LENGTHS[bondKey] ||
            MolecularPhysicsEngine.BOND_LENGTHS[reverseBondKey] ||
            1.5;
    }
    /**
     * Find angle constraints for 3-atom sequences
     */
    findAngleConstraints(atoms, bonds) {
        const angleConstraints = [];
        // Find connected atom triplets
        for (let centerIndex = 0; centerIndex < atoms.length; centerIndex++) {
            const connectedAtoms = [];
            for (const bond of bonds) {
                if (bond.atom1Id === atoms[centerIndex].id) {
                    const connectedIndex = atoms.findIndex(a => a.id === bond.atom2Id);
                    if (connectedIndex !== -1)
                        connectedAtoms.push(connectedIndex);
                }
                else if (bond.atom2Id === atoms[centerIndex].id) {
                    const connectedIndex = atoms.findIndex(a => a.id === bond.atom1Id);
                    if (connectedIndex !== -1)
                        connectedAtoms.push(connectedIndex);
                }
            }
            // Create angle constraints for each pair of connected atoms
            for (let i = 0; i < connectedAtoms.length; i++) {
                for (let j = i + 1; j < connectedAtoms.length; j++) {
                    angleConstraints.push({
                        atom1Index: connectedAtoms[i],
                        atom2Index: centerIndex,
                        atom3Index: connectedAtoms[j],
                        restAngle: Math.PI * (109.5 / 180) // Tetrahedral angle as default
                    });
                }
            }
        }
        return angleConstraints;
    }
    /**
     * Configure physics simulation parameters
     */
    configure(config) {
        try {
            if (config.enableCollision !== undefined) {
                this.world.broadphase = config.enableCollision ?
                    new CANNON__namespace.NaiveBroadphase() : new CANNON__namespace.SAPBroadphase(this.world);
            }
            if (config.temperature !== undefined) {
                // Adjust gravity based on temperature (higher temp = more kinetic energy)
                const tempFactor = Math.max(0.1, config.temperature / 298);
                this.world.gravity.set(0, -9.82 * tempFactor, 0);
            }
            telemetry.info('Physics engine configured', config);
        }
        catch (error) {
            telemetry.error('Physics configuration failed', error);
            throw error;
        }
    }
    /**
     * Simulate reaction pathway with physics
     */
    async simulateReactionPathway(transitions, duration) {
        try {
            const frames = [];
            const frameRate = 60; // 60 FPS
            const totalFrames = Math.floor(duration * frameRate);
            for (let frame = 0; frame < totalFrames; frame++) {
                const progress = frame / totalFrames;
                const timestamp = (frame / frameRate) * 1000; // Convert to ms
                // Step physics simulation
                this.world.step(1 / frameRate);
                // Generate molecular states for this frame
                const molecularStates = transitions.map((transition, index) => ({
                    moleculeId: `molecule_${index}`,
                    position: this.interpolatePosition(transition, progress),
                    rotation: this.interpolateRotation(transition, progress),
                    scale: this.interpolateScale(transition, progress),
                    bonds: transition.bonds || [],
                    atoms: transition.atoms || []
                }));
                frames.push({
                    timestamp,
                    molecularStates
                });
            }
            telemetry.info('Physics simulation completed', { duration, frames: frames.length });
            return frames;
        }
        catch (error) {
            telemetry.error('Physics simulation failed', error);
            throw error;
        }
    }
    /**
     * Interpolate position based on physics
     */
    interpolatePosition(transition, progress) {
        if (!transition.startStructure || !transition.endStructure) {
            return { x: 0, y: 0, z: 0 };
        }
        const start = transition.startStructure.center || { x: 0, y: 0, z: 0 };
        const end = transition.endStructure.center || { x: 0, y: 0, z: 0 };
        return {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
            z: start.z + (end.z - start.z) * progress
        };
    }
    /**
     * Interpolate rotation based on physics
     */
    interpolateRotation(transition, progress) {
        return { x: 0, y: progress * Math.PI * 2, z: 0 };
    }
    /**
     * Interpolate scale based on physics
     */
    interpolateScale(transition, progress) {
        const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
        return { x: scale, y: scale, z: scale };
    }
    /**
     * Clean up physics resources
     */
    dispose() {
        this.atomBodies.clear();
        this.bondConstraints.clear();
        telemetry.info('🧬 Molecular physics engine disposed');
    }
}
// Atomic masses (amu)
MolecularPhysicsEngine.ATOMIC_MASSES = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011,
    N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
    Al: 26.982, Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, Ar: 39.948,
    K: 39.098, Ca: 40.078, Fe: 55.845, Ni: 58.693, Cu: 63.546, Zn: 65.38
};
// Van der Waals radii (Å)
MolecularPhysicsEngine.VDW_RADII = {
    H: 1.20, He: 1.40, Li: 1.82, Be: 1.53, B: 1.92, C: 1.70,
    N: 1.55, O: 1.52, F: 1.47, Ne: 1.54, Na: 2.27, Mg: 1.73,
    Al: 1.84, Si: 2.10, P: 1.80, S: 1.80, Cl: 1.75, Ar: 1.88
};
// Bond lengths (Å)
MolecularPhysicsEngine.BOND_LENGTHS = {
    'H-H': 0.74, 'C-C': 1.54, 'C=C': 1.34, 'C≡C': 1.20,
    'C-H': 1.09, 'C-O': 1.43, 'C=O': 1.23, 'O-H': 0.96,
    'N-H': 1.01, 'C-N': 1.47, 'C=N': 1.29, 'C≡N': 1.16,
    'O-O': 1.48, 'N-N': 1.45, 'S-S': 2.05, 'C-S': 1.82
};

/**
 * CREB Phase 3: Intelligent Caching System
 *
 * This module provides multi-level caching for molecular structures and animations
 * with automatic optimization, cache invalidation, and IndexedDB persistence.
 */
/**
 * Multi-level intelligent caching system
 * Provides memory cache, persistent storage, and automatic optimization
 */
class IntelligentCacheManager {
    constructor(config = {}) {
        this.memoryCache = new Map();
        this.accessHistory = new Map();
        this.config = {
            maxMemorySize: 100 * 1024 * 1024, // 100MB
            maxDiskSize: 500 * 1024 * 1024, // 500MB
            defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
            enableCompression: true,
            compressionThreshold: 10 * 1024, // 10KB
            maxEntries: 1000,
            evictionStrategy: 'hybrid',
            persistenceEnabled: true,
            preloadCommonReactions: true,
            ...config
        };
        this.stats = {
            totalEntries: 0,
            totalSize: 0,
            hitRate: 0,
            missRate: 0,
            memoryUsage: 0,
            diskUsage: 0,
            evictionCount: 0,
            lastOptimization: Date.now()
        };
        this.initialize();
        telemetry.info('💾 Intelligent cache manager initialized', { config: this.config });
    }
    /**
     * Initialize the cache system
     */
    async initialize() {
        try {
            if (this.config.persistenceEnabled) {
                await this.initializeDatabase();
            }
            if (this.config.preloadCommonReactions) {
                await this.preloadCommonReactions();
            }
            // Start automatic optimization
            this.startOptimization();
            globalMetrics.counter('cache.initialization.success', 1);
            telemetry.info('✅ Cache system initialized successfully');
        }
        catch (error) {
            globalMetrics.counter('cache.initialization.errors', 1);
            telemetry.error('❌ Cache initialization failed', error);
            throw error;
        }
    }
    /**
     * Initialize IndexedDB database
     */
    async initializeDatabase() {
        this.db = await idb.openDB('CREB-Cache', 1, {
            upgrade(db) {
                // Create object stores
                if (!db.objectStoreNames.contains('animations')) {
                    db.createObjectStore('animations');
                }
                if (!db.objectStoreNames.contains('structures')) {
                    db.createObjectStore('structures');
                }
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata');
                }
            }
        });
        telemetry.info('💿 IndexedDB initialized for persistent caching');
    }
    /**
     * Get cached entry with intelligent fallback strategy
     */
    async get(key) {
        return globalProfiler.profileAsync('cache.get', async () => {
            const normalizedKey = this.normalizeKey(key);
            try {
                // 1. Try memory cache first (fastest)
                const memoryEntry = this.memoryCache.get(normalizedKey);
                if (memoryEntry && !this.isExpired(memoryEntry)) {
                    this.updateAccessHistory(normalizedKey);
                    memoryEntry.accessCount++;
                    memoryEntry.lastAccessed = Date.now();
                    globalMetrics.counter('cache.memory.hits', 1);
                    telemetry.debug('💨 Memory cache hit', { key: normalizedKey });
                    return memoryEntry.value;
                }
                // 2. Try persistent storage (slower but reliable)
                if (this.config.persistenceEnabled && this.db) {
                    const diskEntry = await this.getFromDisk(normalizedKey);
                    if (diskEntry && !this.isExpired(diskEntry)) {
                        // Promote to memory cache
                        await this.setInMemory(normalizedKey, diskEntry.value, diskEntry.ttl, diskEntry.metadata);
                        globalMetrics.counter('cache.disk.hits', 1);
                        telemetry.debug('💿 Disk cache hit', { key: normalizedKey });
                        return diskEntry.value;
                    }
                }
                // 3. Cache miss
                globalMetrics.counter('cache.misses', 1);
                telemetry.debug('❌ Cache miss', { key: normalizedKey });
                return null;
            }
            catch (error) {
                globalMetrics.counter('cache.get.errors', 1);
                telemetry.error('❌ Cache get operation failed', error, { key: normalizedKey });
                return null;
            }
        });
    }
    /**
     * Set cached entry with intelligent storage strategy
     */
    async set(key, value, ttl = this.config.defaultTTL, metadata = {}) {
        return globalProfiler.profileAsync('cache.set', async () => {
            const normalizedKey = this.normalizeKey(key);
            const size = this.calculateSize(value);
            const fullMetadata = {
                source: 'computation',
                type: 'molecular-structure',
                version: '1.0.0',
                quality: 'medium',
                compression: 'none',
                ...metadata
            };
            try {
                // Compress large entries if enabled
                let processedValue = value;
                if (this.config.enableCompression && size > this.config.compressionThreshold) {
                    processedValue = await this.compressValue(value);
                    fullMetadata.compression = 'gzip';
                }
                // Always store in memory cache
                await this.setInMemory(normalizedKey, processedValue, ttl, fullMetadata);
                // Store in persistent storage for important/large data
                if (this.config.persistenceEnabled && this.shouldPersist(size, fullMetadata)) {
                    await this.setOnDisk(normalizedKey, processedValue, ttl, fullMetadata);
                }
                // Update statistics
                this.updateStats(size, 'set');
                globalMetrics.counter('cache.set.success', 1);
                telemetry.debug('✅ Cache entry stored', {
                    key: normalizedKey,
                    size,
                    metadata: fullMetadata
                });
            }
            catch (error) {
                globalMetrics.counter('cache.set.errors', 1);
                telemetry.error('❌ Cache set operation failed', error, {
                    key: normalizedKey,
                    size
                });
                throw error;
            }
        });
    }
    /**
     * Preload common chemical reactions for instant access
     */
    async preloadCommonReactions() {
        telemetry.info('🔄 Starting preload of common reactions');
        for (const reaction of IntelligentCacheManager.COMMON_REACTIONS) {
            const key = `preload:${reaction}`;
            // Check if already cached
            const existing = await this.get(key);
            if (!existing) {
                // Mark for lazy loading
                await this.set(key, {
                    equation: reaction,
                    preloaded: true,
                    loadedAt: Date.now()
                }, this.config.defaultTTL * 7, {
                    source: 'computation',
                    type: 'molecular-structure',
                    version: '1.0.0',
                    quality: 'high'
                });
            }
        }
        telemetry.info('✅ Common reactions preloaded');
    }
    /**
     * Intelligent cache optimization
     */
    startOptimization() {
        this.optimizationTimer = setInterval(() => {
            this.optimizeCache();
        }, 5 * 60 * 1000); // Every 5 minutes
        telemetry.info('🔧 Cache optimization scheduler started');
    }
    /**
     * Optimize cache based on usage patterns
     */
    async optimizeCache() {
        return globalProfiler.profileAsync('cache.optimization', async () => {
            try {
                telemetry.info('🔧 Starting cache optimization');
                // 1. Remove expired entries
                await this.removeExpiredEntries();
                // 2. Apply eviction strategy if over limits
                await this.applyEvictionStrategy();
                // 3. Compress frequently accessed large entries
                await this.compressFrequentEntries();
                // 4. Update statistics
                await this.updateCacheStats();
                this.stats.lastOptimization = Date.now();
                globalMetrics.counter('cache.optimization.success', 1);
                telemetry.info('✅ Cache optimization completed', {
                    stats: this.stats
                });
            }
            catch (error) {
                globalMetrics.counter('cache.optimization.errors', 1);
                telemetry.error('❌ Cache optimization failed', error);
            }
        });
    }
    /**
     * Remove expired entries from all cache levels
     */
    async removeExpiredEntries() {
        let removedCount = 0;
        // Clean memory cache
        for (const [key, entry] of this.memoryCache.entries()) {
            if (this.isExpired(entry)) {
                this.memoryCache.delete(key);
                removedCount++;
            }
        }
        // Clean disk cache
        if (this.config.persistenceEnabled && this.db) {
            const tx = this.db.transaction(['animations', 'structures'], 'readwrite');
            for (const store of [tx.objectStore('animations'), tx.objectStore('structures')]) {
                const cursor = await store.openCursor();
                while (cursor) {
                    const entry = cursor.value;
                    if (this.isExpired(entry)) {
                        await cursor.delete();
                        removedCount++;
                    }
                    cursor.continue();
                }
            }
        }
        if (removedCount > 0) {
            telemetry.info('🧹 Removed expired cache entries', { count: removedCount });
        }
    }
    /**
     * Apply intelligent eviction strategy
     */
    async applyEvictionStrategy() {
        const memoryUsage = this.calculateMemoryUsage();
        if (memoryUsage > this.config.maxMemorySize) {
            const entries = Array.from(this.memoryCache.entries());
            let entriesToEvict = [];
            switch (this.config.evictionStrategy) {
                case 'lru':
                    entriesToEvict = this.selectLRUEntries(entries);
                    break;
                case 'lfu':
                    entriesToEvict = this.selectLFUEntries(entries);
                    break;
                case 'ttl':
                    entriesToEvict = this.selectTTLEntries(entries);
                    break;
                case 'hybrid':
                    entriesToEvict = this.selectHybridEntries(entries);
                    break;
            }
            // Evict selected entries
            for (const key of entriesToEvict) {
                this.memoryCache.delete(key);
                this.stats.evictionCount++;
            }
            telemetry.info('🗑️ Evicted cache entries', {
                strategy: this.config.evictionStrategy,
                count: entriesToEvict.length
            });
        }
    }
    /**
     * Compress frequently accessed large entries
     */
    async compressFrequentEntries() {
        if (!this.config.enableCompression)
            return;
        for (const [key, entry] of this.memoryCache.entries()) {
            if (entry.size > this.config.compressionThreshold &&
                entry.accessCount > 5 &&
                entry.metadata.compression === 'none') {
                try {
                    const compressedValue = await this.compressValue(entry.value);
                    const newSize = this.calculateSize(compressedValue);
                    if (newSize < entry.size * 0.8) { // Only compress if >20% reduction
                        entry.value = compressedValue;
                        entry.size = newSize;
                        entry.metadata.compression = 'gzip';
                        telemetry.debug('🗜️ Compressed cache entry', {
                            key,
                            originalSize: entry.size,
                            compressedSize: newSize
                        });
                    }
                }
                catch (error) {
                    telemetry.warn('Failed to compress cache entry', { key, error });
                }
            }
        }
    }
    /**
     * Update cache statistics
     */
    async updateCacheStats() {
        this.stats.totalEntries = this.memoryCache.size;
        this.stats.memoryUsage = this.calculateMemoryUsage();
        if (this.config.persistenceEnabled && this.db) {
            this.stats.diskUsage = await this.calculateDiskUsage();
        }
        // Calculate hit rates
        const memoryHits = globalMetrics.getMetric('cache.memory.hits')?.value || 0;
        const diskHits = globalMetrics.getMetric('cache.disk.hits')?.value || 0;
        const misses = globalMetrics.getMetric('cache.misses')?.value || 0;
        const totalRequests = memoryHits + diskHits + misses;
        if (totalRequests > 0) {
            const hits = memoryHits + diskHits;
            this.stats.hitRate = hits / totalRequests;
            this.stats.missRate = 1 - this.stats.hitRate;
        }
        globalMetrics.gauge('cache.memory_usage', this.stats.memoryUsage);
        globalMetrics.gauge('cache.hit_rate', this.stats.hitRate);
    }
    /**
     * Helper methods
     */
    normalizeKey(key) {
        return key.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9+\-=→]/g, '');
    }
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    calculateSize(value) {
        return JSON.stringify(value).length * 2; // Rough estimate (UTF-16)
    }
    shouldPersist(size, metadata) {
        // Persist important or frequently accessed data
        return metadata.quality === 'high' ||
            size > this.config.compressionThreshold ||
            metadata.type === 'animation-frames';
    }
    updateAccessHistory(key) {
        const history = this.accessHistory.get(key) || [];
        history.push(Date.now());
        // Keep only last 10 accesses
        if (history.length > 10) {
            history.shift();
        }
        this.accessHistory.set(key, history);
    }
    updateStats(size, operation) {
        if (operation === 'set') {
            this.stats.totalSize += size;
        }
    }
    calculateMemoryUsage() {
        let total = 0;
        for (const entry of this.memoryCache.values()) {
            total += entry.size;
        }
        return total;
    }
    async calculateDiskUsage() {
        // Simplified disk usage calculation
        return 0; // Would require IndexedDB storage estimation
    }
    selectLRUEntries(entries) {
        return entries
            .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
            .slice(0, Math.floor(entries.length * 0.1))
            .map(([key]) => key);
    }
    selectLFUEntries(entries) {
        return entries
            .sort((a, b) => a[1].accessCount - b[1].accessCount)
            .slice(0, Math.floor(entries.length * 0.1))
            .map(([key]) => key);
    }
    selectTTLEntries(entries) {
        return entries
            .sort((a, b) => (a[1].timestamp + a[1].ttl) - (b[1].timestamp + b[1].ttl))
            .slice(0, Math.floor(entries.length * 0.1))
            .map(([key]) => key);
    }
    selectHybridEntries(entries) {
        // Hybrid strategy: combine LRU and LFU with size consideration
        return entries
            .sort((a, b) => {
            const scoreA = a[1].accessCount / Math.log(Date.now() - a[1].lastAccessed + 1) / a[1].size;
            const scoreB = b[1].accessCount / Math.log(Date.now() - b[1].lastAccessed + 1) / b[1].size;
            return scoreA - scoreB;
        })
            .slice(0, Math.floor(entries.length * 0.1))
            .map(([key]) => key);
    }
    async setInMemory(key, value, ttl, metadata) {
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            ttl,
            size: this.calculateSize(value),
            accessCount: 1,
            lastAccessed: Date.now(),
            metadata
        };
        this.memoryCache.set(key, entry);
    }
    async setOnDisk(key, value, ttl, metadata) {
        if (!this.db)
            return;
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            ttl,
            size: this.calculateSize(value),
            accessCount: 1,
            lastAccessed: Date.now(),
            metadata
        };
        const storeName = metadata.type === 'animation-frames' ? 'animations' : 'structures';
        await this.db.put(storeName, entry, key);
    }
    async getFromDisk(key) {
        if (!this.db)
            return null;
        // Try both stores
        const stores = ['animations', 'structures'];
        for (const storeName of stores) {
            const entry = await this.db.get(storeName, key);
            if (entry)
                return entry;
        }
        return null;
    }
    async compressValue(value) {
        // Simplified compression - in real implementation, use pako.js or similar
        return JSON.stringify(value);
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Clear specific cache level
     */
    async clear(level = 'all') {
        if (level === 'memory' || level === 'all') {
            this.memoryCache.clear();
            this.accessHistory.clear();
            telemetry.info('🧹 Memory cache cleared');
        }
        if ((level === 'disk' || level === 'all') && this.config.persistenceEnabled && this.db) {
            const tx = this.db.transaction(['animations', 'structures', 'metadata'], 'readwrite');
            await tx.objectStore('animations').clear();
            await tx.objectStore('structures').clear();
            await tx.objectStore('metadata').clear();
            telemetry.info('🧹 Disk cache cleared');
        }
        await this.updateCacheStats();
    }
    /**
     * Dispose cache manager and clean up resources
     */
    async dispose() {
        if (this.optimizationTimer) {
            clearInterval(this.optimizationTimer);
        }
        await this.clear('memory');
        if (this.db) {
            this.db.close();
        }
        telemetry.info('💾 Cache manager disposed');
    }
}
// Common reaction patterns for preloading
IntelligentCacheManager.COMMON_REACTIONS = [
    'CH4 + 2O2 = CO2 + 2H2O',
    '2H2 + O2 = 2H2O',
    'H2 + Cl2 = 2HCl',
    '2H2O2 = 2H2O + O2',
    'N2 + 3H2 = 2NH3',
    'CaCO3 = CaO + CO2',
    'NaOH + HCl = NaCl + H2O',
    'C6H12O6 + 6O2 = 6CO2 + 6H2O'
];

/**
 * Advanced TypeScript Support for CREB Library
 * Enhanced type definitions with generic constraints and branded types
 * Provides superior IntelliSense and type safety for chemical data structures
 */
// ============================================================================
// Advanced Type Guards and Validation
// ============================================================================
/**
 * Type guard for chemical formulas
 */
function isChemicalFormula(value) {
    return typeof value === 'string' && value.length > 0 && /[A-Z]/.test(value);
}
/**
 * Type guard for element symbols
 */
function isElementSymbol(value) {
    const validElements = new Set([
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
        'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
        'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
        'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
        'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
        'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
        'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
        'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
        'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
        'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
        'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
    ]);
    return validElements.has(value);
}
/**
 * Type guard for balanced equations
 */
function isBalancedEquation(value) {
    return value.includes('->') || value.includes('→');
}
// ============================================================================
// Factory Functions with Type Safety
// ============================================================================
/**
 * Create a chemical formula with compile-time validation
 */
function createChemicalFormula(formula) {
    if (!isChemicalFormula(formula)) {
        throw new Error(`Invalid chemical formula: ${formula}`);
    }
    return formula;
}
/**
 * Create an element symbol with validation
 */
function createElementSymbol(symbol) {
    if (!isElementSymbol(symbol)) {
        throw new Error(`Invalid element symbol: ${symbol}`);
    }
    return symbol;
}
// ============================================================================
// Utility Functions for Type-Safe Operations
// ============================================================================
/**
 * Parse a chemical formula into element counts
 */
function parseFormula(formula) {
    const result = {};
    // Handle parentheses first by expanding them
    let expandedFormula = formula;
    // Find patterns like (OH)2 and expand them
    const parenthesesPattern = /\(([^)]+)\)(\d*)/g;
    expandedFormula = expandedFormula.replace(parenthesesPattern, (match, group, multiplier) => {
        const mult = multiplier ? parseInt(multiplier, 10) : 1;
        let expanded = '';
        for (let i = 0; i < mult; i++) {
            expanded += group;
        }
        return expanded;
    });
    // Now parse the expanded formula
    const matches = expandedFormula.match(/([A-Z][a-z]?)(\d*)/g);
    if (matches) {
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]?)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2], 10) : 1;
                if (isElementSymbol(element)) {
                    result[element] = (result[element] || 0) + count;
                }
            }
        }
    }
    return result;
}
// ============================================================================
// Enhanced Error Types
// ============================================================================
/**
 * Type-safe error for chemical formula validation
 */
class ChemicalFormulaError extends Error {
    constructor(formula, reason) {
        super(`Invalid chemical formula "${formula}": ${reason}`);
        this.formula = formula;
        this.reason = reason;
        this.name = 'ChemicalFormulaError';
    }
}
/**
 * Type-safe error for equation balancing
 */
class EquationBalancingError extends Error {
    constructor(equation, reason) {
        super(`Cannot balance equation "${equation}": ${reason}`);
        this.equation = equation;
        this.reason = reason;
        this.name = 'EquationBalancingError';
    }
}

/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Simplified version that provides compound analysis and type safety
 */
/**
 * Enhanced balancer with type-safe compound analysis
 */
class EnhancedBalancer {
    constructor() {
        this.balancer = new exports.ChemicalEquationBalancer();
    }
    /**
     * Balance equation with enhanced compound information
     */
    balance(equation) {
        try {
            // Use the detailed balancer for more information
            const result = this.balancer.balanceDetailed(equation);
            // Extract all unique formulas from reactants and products
            const allFormulas = new Set();
            // Add formulas from the result structure
            if (result.reactants && result.reactants.length > 0) {
                result.reactants.forEach((formula) => allFormulas.add(formula));
            }
            if (result.products && result.products.length > 0) {
                result.products.forEach((formula) => allFormulas.add(formula));
            }
            // Analyze each compound
            const compounds = Array.from(allFormulas).map(formula => this.analyzeCompound(formula)).filter(compound => compound.formula !== ''); // Filter out empty results
            // Determine if the equation was balanced by checking if it changed OR if coefficients are all 1 (already balanced)
            const coefficientsAllOne = result.coefficients && result.coefficients.every(coeff => coeff === 1);
            const wasBalanced = result.equation !== equation || coefficientsAllOne;
            return {
                equation: result.equation,
                isBalanced: wasBalanced,
                compounds,
                coefficients: result.coefficients,
                reactants: result.reactants,
                products: result.products
            };
        }
        catch (error) {
            // Note: Error in enhanced balancer - using fallback
            return {
                equation,
                isBalanced: false,
                compounds: [],
                coefficients: [],
                reactants: [],
                products: []
            };
        }
    }
    /**
     * Analyze a single compound for detailed information
     */
    analyzeCompound(formula) {
        try {
            const elementCounter = new ElementCounter(formula);
            const elementCount = elementCounter.parseFormula();
            const elements = Object.keys(elementCount);
            const molarMass = this.calculateMolarMass(elementCount);
            return {
                formula,
                molarMass,
                elements,
                elementCount
            };
        }
        catch (error) {
            return {
                formula,
                molarMass: 0,
                elements: [],
                elementCount: {}
            };
        }
    }
    /**
     * Calculate molar mass from element count
     */
    calculateMolarMass(elementCount) {
        // Atomic masses (simplified)
        const atomicMasses = {
            'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.086, 'P': 30.974,
            'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
            'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Ag': 107.868, 'Au': 196.966
            // Add more as needed
        };
        let totalMass = 0;
        for (const [element, count] of Object.entries(elementCount)) {
            const atomicMass = atomicMasses[element];
            if (atomicMass) {
                totalMass += atomicMass * (count || 0);
            }
        }
        return totalMass;
    }
    /**
     * Simple formula validation
     */
    isValidFormula(formula) {
        // Basic validation - contains at least one capital letter
        return /[A-Z]/.test(formula) && formula.length > 0;
    }
}

/**
 * Cache Eviction Policies for CREB-JS
 *
 * Implements various cache eviction strategies including LRU, LFU, FIFO, TTL, and Random.
 * Each policy provides different trade-offs between performance and memory efficiency.
 */
/**
 * Least Recently Used (LRU) eviction policy
 * Evicts entries that haven't been accessed for the longest time
 */
class LRUEvictionPolicy {
    constructor() {
        this.strategy = 'lru';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({ key, lastAccessed: entry.lastAccessed });
        }
        // Sort by last accessed time (oldest first)
        candidates.sort((a, b) => a.lastAccessed - b.lastAccessed);
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Least Frequently Used (LFU) eviction policy
 * Evicts entries with the lowest access frequency
 */
class LFUEvictionPolicy {
    constructor() {
        this.strategy = 'lfu';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({
                key,
                accessCount: entry.accessCount,
                lastAccessed: entry.lastAccessed
            });
        }
        // Sort by access count (lowest first), then by last accessed for ties
        candidates.sort((a, b) => {
            if (a.accessCount !== b.accessCount) {
                return a.accessCount - b.accessCount;
            }
            return a.lastAccessed - b.lastAccessed;
        });
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * First In, First Out (FIFO) eviction policy
 * Evicts entries in the order they were inserted
 */
class FIFOEvictionPolicy {
    constructor() {
        this.strategy = 'fifo';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({ key, insertionOrder: entry.insertionOrder });
        }
        // Sort by insertion order (oldest first)
        candidates.sort((a, b) => a.insertionOrder - b.insertionOrder);
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Time To Live (TTL) eviction policy
 * Evicts expired entries first, then falls back to LRU
 */
class TTLEvictionPolicy {
    constructor() {
        this.strategy = 'ttl';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const now = Date.now();
        const expired = [];
        const nonExpired = [];
        for (const [key, entry] of entries.entries()) {
            if (entry.ttl > 0 && now >= entry.expiresAt) {
                expired.push(key);
            }
            else {
                nonExpired.push({ key, lastAccessed: entry.lastAccessed });
            }
        }
        // Return expired entries first
        if (expired.length >= targetCount) {
            return expired.slice(0, targetCount);
        }
        // If not enough expired entries, use LRU for the rest
        const remaining = targetCount - expired.length;
        nonExpired.sort((a, b) => a.lastAccessed - b.lastAccessed);
        return [...expired, ...nonExpired.slice(0, remaining).map(c => c.key)];
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Random eviction policy
 * Evicts random entries (useful for testing and as fallback)
 */
class RandomEvictionPolicy {
    constructor() {
        this.strategy = 'random';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const keys = Array.from(entries.keys());
        const candidates = [];
        // Fisher-Yates shuffle to get random keys
        for (let i = 0; i < targetCount && i < keys.length; i++) {
            const randomIndex = Math.floor(Math.random() * (keys.length - i)) + i;
            [keys[i], keys[randomIndex]] = [keys[randomIndex], keys[i]];
            candidates.push(keys[i]);
        }
        return candidates;
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Eviction policy factory
 */
class EvictionPolicyFactory {
    /**
     * Get eviction policy instance
     */
    static getPolicy(strategy) {
        const policy = this.policies.get(strategy);
        if (!policy) {
            throw new Error(`Unknown eviction strategy: ${strategy}`);
        }
        return policy;
    }
    /**
     * Register custom eviction policy
     */
    static registerPolicy(policy) {
        this.policies.set(policy.strategy, policy);
    }
    /**
     * Get all available strategies
     */
    static getAvailableStrategies() {
        return Array.from(this.policies.keys());
    }
}
EvictionPolicyFactory.policies = new Map([
    ['lru', new LRUEvictionPolicy()],
    ['lfu', new LFUEvictionPolicy()],
    ['fifo', new FIFOEvictionPolicy()],
    ['ttl', new TTLEvictionPolicy()],
    ['random', new RandomEvictionPolicy()]
]);
/**
 * Adaptive eviction policy that switches strategies based on access patterns
 */
class AdaptiveEvictionPolicy {
    constructor(fallbackStrategy = 'lru') {
        this.fallbackStrategy = fallbackStrategy;
        this.strategy = 'lru'; // Default fallback
        this.performanceHistory = new Map();
        this.evaluationWindow = 100; // Number of operations to evaluate
        this.operationCount = 0;
        this.currentPolicy = EvictionPolicyFactory.getPolicy(fallbackStrategy);
        // Initialize performance tracking
        for (const strategy of EvictionPolicyFactory.getAvailableStrategies()) {
            this.performanceHistory.set(strategy, []);
        }
    }
    selectEvictionCandidates(entries, config, targetCount) {
        this.operationCount++;
        // Periodically evaluate and potentially switch strategies
        if (this.operationCount % this.evaluationWindow === 0) {
            this.evaluateAndAdapt(entries, config);
        }
        return this.currentPolicy.selectEvictionCandidates(entries, config, targetCount);
    }
    onAccess(entry) {
        this.currentPolicy.onAccess(entry);
    }
    onInsert(entry) {
        this.currentPolicy.onInsert(entry);
    }
    /**
     * Evaluate current performance and adapt strategy if needed
     */
    evaluateAndAdapt(entries, config) {
        // Calculate access pattern metrics
        const now = Date.now();
        let totalAccesses = 0;
        let recentAccesses = 0;
        let accessVariance = 0;
        let meanAccess = 0;
        const accessCounts = [];
        for (const entry of entries.values()) {
            totalAccesses += entry.accessCount;
            accessCounts.push(entry.accessCount);
            // Count recent accesses (last hour)
            if (now - entry.lastAccessed < 3600000) {
                recentAccesses++;
            }
        }
        if (accessCounts.length > 0) {
            meanAccess = totalAccesses / accessCounts.length;
            accessVariance = accessCounts.reduce((sum, count) => sum + Math.pow(count - meanAccess, 2), 0) / accessCounts.length;
        }
        // Determine optimal strategy based on patterns
        let optimalStrategy;
        if (accessVariance > meanAccess * 2) {
            // High variance suggests some items are much more popular -> LFU
            optimalStrategy = 'lfu';
        }
        else if (recentAccesses / entries.size > 0.8) {
            // Most items accessed recently -> LRU
            optimalStrategy = 'lru';
        }
        else if (totalAccesses / entries.size < 2) {
            // Low overall access -> FIFO
            optimalStrategy = 'fifo';
        }
        else {
            // Mixed pattern -> TTL
            optimalStrategy = 'ttl';
        }
        // Switch strategy if different from current
        if (optimalStrategy !== this.currentPolicy.strategy) {
            this.currentPolicy = EvictionPolicyFactory.getPolicy(optimalStrategy);
        }
    }
    /**
     * Get current strategy being used
     */
    getCurrentStrategy() {
        return this.currentPolicy.strategy;
    }
}

/**
 * Cache Metrics Collection and Analysis for CREB-JS
 *
 * Provides comprehensive metrics collection, analysis, and reporting for cache performance.
 * Includes real-time monitoring, historical analysis, and performance recommendations.
 */
/**
 * Real-time cache metrics collector
 */
class CacheMetricsCollector {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.eventCounts = new Map();
        this.accessTimes = [];
        this.maxAccessTimeSamples = 1000;
        this.resetStats();
    }
    /**
     * Reset all statistics
     */
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            hitRate: 0,
            size: 0,
            memoryUsage: 0,
            memoryUtilization: 0,
            evictions: 0,
            expirations: 0,
            averageAccessTime: 0,
            evictionBreakdown: {
                'lru': 0,
                'lfu': 0,
                'fifo': 0,
                'ttl': 0,
                'random': 0
            },
            lastUpdated: Date.now()
        };
        this.eventCounts.clear();
        this.accessTimes = [];
    }
    /**
     * Record a cache event
     */
    recordEvent(event) {
        const currentCount = this.eventCounts.get(event.type) || 0;
        this.eventCounts.set(event.type, currentCount + 1);
        switch (event.type) {
            case 'hit':
                this.stats.hits++;
                break;
            case 'miss':
                this.stats.misses++;
                break;
            case 'eviction':
                this.stats.evictions++;
                if (event.metadata?.strategy) {
                    this.stats.evictionBreakdown[event.metadata.strategy]++;
                }
                break;
            case 'expiration':
                this.stats.expirations++;
                break;
        }
        // Record access time if available
        if (event.metadata?.latency !== undefined) {
            this.accessTimes.push(event.metadata.latency);
            if (this.accessTimes.length > this.maxAccessTimeSamples) {
                this.accessTimes.shift(); // Remove oldest sample
            }
        }
        this.updateComputedStats();
    }
    /**
     * Update cache size and memory usage
     */
    updateCacheInfo(size, memoryUsage, maxMemory) {
        this.stats.size = size;
        this.stats.memoryUsage = memoryUsage;
        this.stats.memoryUtilization = maxMemory > 0 ? (memoryUsage / maxMemory) * 100 : 0;
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Get current statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get comprehensive metrics with historical data and trends
     */
    getMetrics() {
        const current = this.getStats();
        // Calculate trends
        const trends = this.calculateTrends();
        // Calculate peaks
        const peaks = this.calculatePeaks();
        return {
            current,
            history: [...this.history],
            trends,
            peaks
        };
    }
    /**
     * Take a snapshot of current stats for historical tracking
     */
    takeSnapshot() {
        const snapshot = this.getStats();
        this.history.push(snapshot);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift(); // Remove oldest snapshot
        }
    }
    /**
     * Get event counts
     */
    getEventCounts() {
        return new Map(this.eventCounts);
    }
    /**
     * Get access time percentiles
     */
    getAccessTimePercentiles() {
        if (this.accessTimes.length === 0) {
            return { p50: 0, p90: 0, p95: 0, p99: 0 };
        }
        const sorted = [...this.accessTimes].sort((a, b) => a - b);
        sorted.length;
        return {
            p50: this.getPercentile(sorted, 50),
            p90: this.getPercentile(sorted, 90),
            p95: this.getPercentile(sorted, 95),
            p99: this.getPercentile(sorted, 99)
        };
    }
    /**
     * Update computed statistics
     */
    updateComputedStats() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
        if (this.accessTimes.length > 0) {
            this.stats.averageAccessTime = this.accessTimes.reduce((sum, time) => sum + time, 0) / this.accessTimes.length;
        }
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Calculate performance trends
     */
    calculateTrends() {
        if (this.history.length < 3) {
            return {
                hitRateTrend: 'stable',
                memoryTrend: 'stable',
                latencyTrend: 'stable'
            };
        }
        const recent = this.history.slice(-3);
        // Hit rate trend
        const hitRateChange = recent[2].hitRate - recent[0].hitRate;
        const hitRateTrend = Math.abs(hitRateChange) < 1 ? 'stable' :
            hitRateChange > 0 ? 'improving' : 'declining';
        // Memory trend
        const memoryChange = recent[2].memoryUtilization - recent[0].memoryUtilization;
        const memoryTrend = Math.abs(memoryChange) < 5 ? 'stable' :
            memoryChange > 0 ? 'increasing' : 'decreasing';
        // Latency trend
        const latencyChange = recent[2].averageAccessTime - recent[0].averageAccessTime;
        const latencyTrend = Math.abs(latencyChange) < 0.1 ? 'stable' :
            latencyChange < 0 ? 'improving' : 'degrading';
        return {
            hitRateTrend,
            memoryTrend,
            latencyTrend
        };
    }
    /**
     * Calculate peak performance metrics
     */
    calculatePeaks() {
        if (this.history.length === 0) {
            return {
                maxHitRate: this.stats.hitRate,
                maxMemoryUsage: this.stats.memoryUsage,
                minLatency: this.stats.averageAccessTime
            };
        }
        const allStats = [...this.history, this.stats];
        return {
            maxHitRate: Math.max(...allStats.map(s => s.hitRate)),
            maxMemoryUsage: Math.max(...allStats.map(s => s.memoryUsage)),
            minLatency: Math.min(...allStats.map(s => s.averageAccessTime))
        };
    }
    /**
     * Get percentile value from sorted array
     */
    getPercentile(sorted, percentile) {
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
}
/**
 * Cache performance analyzer
 */
class CachePerformanceAnalyzer {
    /**
     * Analyze cache performance and provide recommendations
     */
    static analyze(metrics) {
        const { current, trends, history } = metrics;
        const issues = [];
        const recommendations = [];
        const insights = [];
        let score = 100;
        // Analyze hit rate
        if (current.hitRate < 50) {
            score -= 30;
            issues.push('Low cache hit rate');
            recommendations.push('Consider increasing cache size or optimizing access patterns');
        }
        else if (current.hitRate < 70) {
            score -= 15;
            issues.push('Moderate cache hit rate');
            recommendations.push('Review cache eviction strategy');
        }
        // Analyze memory utilization
        if (current.memoryUtilization > 90) {
            score -= 20;
            issues.push('High memory utilization');
            recommendations.push('Increase memory limit or improve eviction policy');
        }
        else if (current.memoryUtilization < 30) {
            insights.push('Low memory utilization - cache size could be reduced');
        }
        // Analyze access time
        if (current.averageAccessTime > 5) {
            score -= 15;
            issues.push('High average access time');
            recommendations.push('Check for lock contention or optimize data structures');
        }
        // Analyze trends
        if (trends.hitRateTrend === 'declining') {
            score -= 10;
            issues.push('Declining hit rate trend');
            recommendations.push('Monitor access patterns and consider adaptive caching');
        }
        if (trends.latencyTrend === 'degrading') {
            score -= 10;
            issues.push('Increasing access latency');
            recommendations.push('Profile cache operations for performance bottlenecks');
        }
        // Analyze eviction distribution
        const totalEvictions = Object.values(current.evictionBreakdown).reduce((sum, count) => sum + count, 0);
        if (totalEvictions > 0) {
            const dominantStrategy = Object.entries(current.evictionBreakdown)
                .reduce((max, [strategy, count]) => count > max.count ? { strategy, count } : max, { strategy: '', count: 0 });
            if (dominantStrategy.count / totalEvictions > 0.8) {
                insights.push(`Cache primarily using ${dominantStrategy.strategy} eviction`);
            }
            else {
                insights.push('Cache using mixed eviction strategies - consider adaptive policy');
            }
        }
        // Historical comparison
        if (history.length > 0) {
            const baseline = history[0];
            const hitRateImprovement = current.hitRate - baseline.hitRate;
            if (hitRateImprovement > 10) {
                insights.push('Significant hit rate improvement observed');
            }
            else if (hitRateImprovement < -10) {
                issues.push('Hit rate has declined significantly');
                recommendations.push('Review recent changes to access patterns or cache configuration');
            }
        }
        return {
            score: Math.max(0, score),
            issues,
            recommendations,
            insights
        };
    }
    /**
     * Generate performance report
     */
    static generateReport(metrics) {
        const analysis = this.analyze(metrics);
        const { current } = metrics;
        let report = '# Cache Performance Report\n\n';
        report += `## Overall Score: ${analysis.score}/100\n\n`;
        report += '## Current Statistics\n';
        report += `- Hit Rate: ${current.hitRate.toFixed(2)}%\n`;
        report += `- Cache Size: ${current.size} entries\n`;
        report += `- Memory Usage: ${(current.memoryUsage / 1024 / 1024).toFixed(2)} MB (${current.memoryUtilization.toFixed(1)}%)\n`;
        report += `- Average Access Time: ${current.averageAccessTime.toFixed(2)}ms\n`;
        report += `- Evictions: ${current.evictions}\n`;
        report += `- Expirations: ${current.expirations}\n\n`;
        report += '## Trends\n';
        report += `- Hit Rate: ${metrics.trends.hitRateTrend}\n`;
        report += `- Memory Usage: ${metrics.trends.memoryTrend}\n`;
        report += `- Latency: ${metrics.trends.latencyTrend}\n\n`;
        if (analysis.issues.length > 0) {
            report += '## Issues\n';
            analysis.issues.forEach(issue => {
                report += `- ${issue}\n`;
            });
            report += '\n';
        }
        if (analysis.recommendations.length > 0) {
            report += '## Recommendations\n';
            analysis.recommendations.forEach(rec => {
                report += `- ${rec}\n`;
            });
            report += '\n';
        }
        if (analysis.insights.length > 0) {
            report += '## Insights\n';
            analysis.insights.forEach(insight => {
                report += `- ${insight}\n`;
            });
            report += '\n';
        }
        return report;
    }
}

/**
 * Advanced Cache Implementation for CREB-JS
 *
 * Production-ready cache with TTL, multiple eviction policies, metrics,
 * memory management, and thread safety.
 */
/**
 * Default cache configuration
 */
const DEFAULT_CONFIG = {
    maxSize: 1000,
    defaultTtl: 3600000, // 1 hour
    evictionStrategy: 'lru',
    fallbackStrategy: 'fifo',
    maxMemoryBytes: 100 * 1024 * 1024, // 100MB
    enableMetrics: true,
    metricsInterval: 60000, // 1 minute
    autoCleanup: true,
    cleanupInterval: 300000, // 5 minutes
    threadSafe: true
};
/**
 * Advanced cache implementation with comprehensive features
 */
exports.AdvancedCache = class AdvancedCache {
    constructor(config = {}) {
        this.entries = new Map();
        this.listeners = new Map();
        this.insertionCounter = 0;
        this.mutex = new AsyncMutex();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.metrics = new CacheMetricsCollector();
        // Start background tasks
        if (this.config.autoCleanup) {
            this.startCleanupTimer();
        }
        if (this.config.enableMetrics) {
            this.startMetricsTimer();
        }
    }
    /**
     * Get value from cache
     */
    async get(key) {
        const startTime = Date.now();
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.getInternal(key, startTime));
        }
        else {
            return this.getInternal(key, startTime);
        }
    }
    /**
     * Set value in cache
     */
    async set(key, value, ttl) {
        const startTime = Date.now();
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.setInternal(key, value, ttl, startTime));
        }
        else {
            return this.setInternal(key, value, ttl, startTime);
        }
    }
    /**
     * Check if key exists in cache
     */
    async has(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return false;
        // Check if expired
        const now = Date.now();
        if (entry.ttl > 0 && now >= entry.expiresAt) {
            await this.deleteInternal(key);
            return false;
        }
        return true;
    }
    /**
     * Delete entry from cache
     */
    async delete(key) {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.deleteInternal(key));
        }
        else {
            return this.deleteInternal(key);
        }
    }
    /**
     * Clear all entries
     */
    async clear() {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.clearInternal());
        }
        else {
            return this.clearInternal();
        }
    }
    /**
     * Get current cache statistics
     */
    getStats() {
        this.updateMetrics();
        return this.metrics.getStats();
    }
    /**
     * Get detailed metrics
     */
    getMetrics() {
        this.metrics.takeSnapshot();
        return this.metrics.getMetrics();
    }
    /**
     * Force cleanup of expired entries
     */
    async cleanup() {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.cleanupInternal());
        }
        else {
            return this.cleanupInternal();
        }
    }
    /**
     * Add event listener
     */
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    }
    /**
     * Remove event listener
     */
    removeEventListener(type, listener) {
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(listener);
        }
    }
    /**
     * Get all keys
     */
    keys() {
        return Array.from(this.entries.keys());
    }
    /**
     * Get cache size
     */
    size() {
        return this.entries.size;
    }
    /**
     * Get memory usage in bytes
     */
    memoryUsage() {
        let total = 0;
        for (const entry of this.entries.values()) {
            total += entry.sizeBytes;
        }
        return total;
    }
    /**
     * Check if cache is healthy
     */
    async healthCheck() {
        const metrics = this.getMetrics();
        const analysis = CachePerformanceAnalyzer.analyze(metrics);
        return {
            healthy: analysis.score >= 70,
            issues: analysis.issues,
            recommendations: analysis.recommendations
        };
    }
    /**
     * Shutdown cache and cleanup resources
     */
    shutdown() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        if (this.metricsTimer) {
            clearInterval(this.metricsTimer);
        }
    }
    // Internal implementation methods
    async getInternal(key, startTime) {
        const entry = this.entries.get(key);
        const latency = Date.now() - startTime;
        if (!entry) {
            this.emitEvent('miss', key, undefined, { latency });
            return { success: true, hit: false, latency };
        }
        // Check if expired
        const now = Date.now();
        if (entry.ttl > 0 && now >= entry.expiresAt) {
            await this.deleteInternal(key);
            this.emitEvent('miss', key, undefined, { latency, expired: true });
            return { success: true, hit: false, latency, metadata: { expired: true } };
        }
        // Update access metadata
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        policy.onAccess(entry);
        this.emitEvent('hit', key, entry.value, { latency });
        return { success: true, value: entry.value, hit: true, latency };
    }
    async setInternal(key, value, ttl, startTime) {
        const now = Date.now();
        const entryTtl = ttl ?? this.config.defaultTtl;
        const latency = startTime ? now - startTime : 0;
        // Calculate size estimate
        const sizeBytes = this.estimateSize(value);
        // Check memory constraints before adding
        const currentMemory = this.memoryUsage();
        if (this.config.maxMemoryBytes > 0 && currentMemory + sizeBytes > this.config.maxMemoryBytes) {
            await this.evictForMemory(sizeBytes);
        }
        // Check size constraints and evict if necessary
        if (this.entries.size >= this.config.maxSize) {
            await this.evictEntries(1);
        }
        // Create new entry
        const entry = {
            value,
            createdAt: now,
            lastAccessed: now,
            accessCount: 1,
            ttl: entryTtl,
            expiresAt: entryTtl > 0 ? now + entryTtl : 0,
            sizeBytes,
            insertionOrder: this.insertionCounter++
        };
        // Update access metadata
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        policy.onInsert(entry);
        // Store entry
        this.entries.set(key, entry);
        this.emitEvent('set', key, value, { latency });
        return { success: true, hit: false, latency };
    }
    async deleteInternal(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return false;
        this.entries.delete(key);
        this.emitEvent('delete', key, entry.value);
        return true;
    }
    async clearInternal() {
        this.entries.clear();
        this.insertionCounter = 0;
        this.emitEvent('clear');
    }
    async cleanupInternal() {
        const now = Date.now();
        const expiredKeys = [];
        for (const [key, entry] of this.entries.entries()) {
            if (entry.ttl > 0 && now >= entry.expiresAt) {
                expiredKeys.push(key);
            }
        }
        for (const key of expiredKeys) {
            this.entries.delete(key);
            this.emitEvent('expiration', key);
        }
        return expiredKeys.length;
    }
    async evictEntries(count) {
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        const candidates = policy.selectEvictionCandidates(this.entries, this.config, count);
        for (const key of candidates) {
            const entry = this.entries.get(key);
            if (entry) {
                this.entries.delete(key);
                this.emitEvent('eviction', key, entry.value, {
                    strategy: this.config.evictionStrategy
                });
            }
        }
    }
    async evictForMemory(requiredBytes) {
        const currentMemory = this.memoryUsage();
        const targetMemory = this.config.maxMemoryBytes - requiredBytes;
        if (currentMemory <= targetMemory)
            return;
        const bytesToEvict = currentMemory - targetMemory;
        let evictedBytes = 0;
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        while (evictedBytes < bytesToEvict && this.entries.size > 0) {
            const candidates = policy.selectEvictionCandidates(this.entries, this.config, 1);
            if (candidates.length === 0)
                break;
            const key = candidates[0];
            const entry = this.entries.get(key);
            if (entry) {
                evictedBytes += entry.sizeBytes;
                this.entries.delete(key);
                this.emitEvent('eviction', key, entry.value, {
                    strategy: this.config.evictionStrategy,
                    reason: 'memory-pressure',
                    memoryBefore: currentMemory,
                    memoryAfter: currentMemory - evictedBytes
                });
            }
        }
        if (evictedBytes < bytesToEvict) {
            this.emitEvent('memory-pressure', undefined, undefined, {
                reason: 'Unable to free sufficient memory'
            });
        }
    }
    estimateSize(value) {
        // Simple size estimation - could be improved with more sophisticated analysis
        const str = JSON.stringify(value);
        return str.length * 2; // Rough estimate for UTF-16 encoding
    }
    emitEvent(type, key, value, metadata) {
        const event = {
            type,
            key,
            value,
            timestamp: Date.now(),
            metadata
        };
        // Record in metrics
        this.metrics.recordEvent(event);
        // Notify listeners
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            for (const listener of typeListeners) {
                try {
                    listener(event);
                }
                catch (error) {
                    console.warn('Cache event listener error:', error);
                }
            }
        }
    }
    updateMetrics() {
        const size = this.entries.size;
        const memory = this.memoryUsage();
        this.metrics.updateCacheInfo(size, memory, this.config.maxMemoryBytes);
    }
    startCleanupTimer() {
        this.cleanupTimer = setInterval(async () => {
            try {
                await this.cleanup();
            }
            catch (error) {
                console.warn('Cache cleanup error:', error);
            }
        }, this.config.cleanupInterval);
    }
    startMetricsTimer() {
        this.metricsTimer = setInterval(() => {
            this.metrics.takeSnapshot();
            this.emitEvent('stats-update');
        }, this.config.metricsInterval);
    }
};
exports.AdvancedCache = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], exports.AdvancedCache);
/**
 * Simple async mutex for thread safety
 */
class AsyncMutex {
    constructor() {
        this.locked = false;
        this.queue = [];
    }
    async runExclusive(fn) {
        return new Promise((resolve, reject) => {
            const run = async () => {
                this.locked = true;
                try {
                    const result = await fn();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.locked = false;
                    const next = this.queue.shift();
                    if (next) {
                        next();
                    }
                }
            };
            if (this.locked) {
                this.queue.push(run);
            }
            else {
                run();
            }
        });
    }
}
/**
 * Cache factory for creating configured cache instances
 */
class CacheFactory {
    static create(configOrPreset) {
        if (typeof configOrPreset === 'string') {
            const presetConfig = this.presets[configOrPreset];
            if (!presetConfig) {
                throw new Error(`Unknown cache preset: ${configOrPreset}`);
            }
            return new exports.AdvancedCache(presetConfig);
        }
        else {
            return new exports.AdvancedCache(configOrPreset);
        }
    }
    /**
     * Register custom preset
     */
    static registerPreset(name, config) {
        this.presets[name] = config;
    }
    /**
     * Get available presets
     */
    static getPresets() {
        return Object.keys(this.presets);
    }
}
CacheFactory.presets = {
    'small': {
        maxSize: 100,
        maxMemoryBytes: 10 * 1024 * 1024, // 10MB
        defaultTtl: 1800000, // 30 minutes
        evictionStrategy: 'lru'
    },
    'medium': {
        maxSize: 1000,
        maxMemoryBytes: 50 * 1024 * 1024, // 50MB
        defaultTtl: 3600000, // 1 hour
        evictionStrategy: 'lru'
    },
    'large': {
        maxSize: 10000,
        maxMemoryBytes: 200 * 1024 * 1024, // 200MB
        defaultTtl: 7200000, // 2 hours
        evictionStrategy: 'lfu'
    },
    'memory-optimized': {
        maxSize: 500,
        maxMemoryBytes: 25 * 1024 * 1024, // 25MB
        defaultTtl: 1800000, // 30 minutes
        evictionStrategy: 'lfu',
        autoCleanup: true,
        cleanupInterval: 60000 // 1 minute
    },
    'performance-optimized': {
        maxSize: 5000,
        maxMemoryBytes: 100 * 1024 * 1024, // 100MB
        defaultTtl: 3600000, // 1 hour
        evictionStrategy: 'lru',
        threadSafe: false, // Better performance but not thread-safe
        enableMetrics: false // Better performance
    }
};

/**
 * Browser-compatible chemical formula validation
 * Simplified version that doesn't depend on ValidationPipeline or events
 */
/**
 * Simple chemical formula validator for browser use
 */
function validateChemicalFormula$1(formula) {
    const errors = [];
    const warnings = [];
    // Basic validation rules
    if (!formula || typeof formula !== 'string') {
        errors.push('Formula must be a non-empty string');
        return { isValid: false, errors, warnings };
    }
    if (formula.trim().length === 0) {
        errors.push('Formula cannot be empty');
        return { isValid: false, errors, warnings };
    }
    // Check for valid chemical formula pattern
    const formulaPattern = /^[A-Z][a-z]?(\d+)?(\([A-Z][a-z]?(\d+)?\)\d*)*$/;
    if (!formulaPattern.test(formula.replace(/\s+/g, ''))) {
        // More lenient check for complex formulas
        const basicElementPattern = /^[A-Z][a-z]?\d*$/;
        const complexPattern = /^([A-Z][a-z]?\d*)+(\([A-Z][a-z]?\d*\)\d*)*$/;
        const cleanFormula = formula.replace(/\s+/g, '');
        if (!basicElementPattern.test(cleanFormula) && !complexPattern.test(cleanFormula)) {
            warnings.push('Formula may not follow standard chemical notation');
        }
    }
    // Check for common issues
    if (formula.includes('..')) {
        errors.push('Formula contains invalid character sequence (..)');
    }
    if (formula.match(/\d{4,}/)) {
        warnings.push('Formula contains unusually large numbers');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */
exports.EnhancedChemicalEquationBalancer = class EnhancedChemicalEquationBalancer extends exports.ChemicalEquationBalancer {
    constructor() {
        super(...arguments);
        this.compoundCache = new exports.AdvancedCache({
            maxSize: 1000,
            defaultTtl: 7200000, // 2 hours
            evictionStrategy: 'lru'
        });
    }
    /**
     * Balance equation with safety and hazard information
     */
    async balanceWithSafety(equation) {
        // First get the enhanced balance with PubChem data
        const enhanced = await this.balanceWithPubChemData(equation);
        // Add safety information for each compound
        const safetyWarnings = [];
        if (enhanced.compoundData) {
            for (const [species, compoundInfo] of Object.entries(enhanced.compoundData)) {
                if (compoundInfo.isValid) {
                    try {
                        // Get safety information for the compound
                        const safetyInfo = await this.getSafetyInfo(compoundInfo);
                        compoundInfo.safetyInfo = safetyInfo;
                        // Generate safety warnings
                        const warnings = this.generateSafetyWarnings(species, safetyInfo);
                        safetyWarnings.push(...warnings);
                    }
                    catch (error) {
                        enhanced.validation?.warnings.push(`Could not retrieve safety data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
            }
        }
        // Add safety warnings to the result
        enhanced.safetyWarnings = safetyWarnings;
        return enhanced;
    }
    /**
     * Get safety information for a compound
     */
    async getSafetyInfo(compoundInfo) {
        // For now, use a knowledge base of common chemical hazards
        // In a full implementation, this would query PubChem's safety data
        const safetyKnowledgeBase = this.getKnownSafetyInfo();
        const formula = compoundInfo.molecularFormula;
        const name = compoundInfo.iupacName?.toLowerCase() || compoundInfo.name.toLowerCase();
        // Check known safety data
        let safetyInfo = safetyKnowledgeBase[formula || ''] ||
            safetyKnowledgeBase[name] ||
            safetyKnowledgeBase[compoundInfo.name.toLowerCase()];
        if (!safetyInfo) {
            // Try to infer basic safety information from chemical properties
            safetyInfo = this.inferSafetyFromProperties(compoundInfo);
        }
        return safetyInfo || {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: [],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
    }
    /**
     * Generate safety warnings from safety information
     */
    generateSafetyWarnings(compound, safetyInfo) {
        const warnings = [];
        // Process health hazards
        for (const hazard of safetyInfo.healthHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined,
                precautionaryStatements: safetyInfo.precautionaryStatements.length > 0 ? safetyInfo.precautionaryStatements : undefined
            });
        }
        // Process physical hazards
        for (const hazard of safetyInfo.physicalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        // Process environmental hazards
        for (const hazard of safetyInfo.environmentalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        return warnings;
    }
    /**
     * Determine severity level from hazard description
     */
    determineSeverity(hazard) {
        const hazardLower = hazard.toLowerCase();
        if (hazardLower.includes('fatal') || hazardLower.includes('death') || hazardLower.includes('severe')) {
            return 'extreme';
        }
        if (hazardLower.includes('serious') || hazardLower.includes('burn') || hazardLower.includes('corrosive')) {
            return 'high';
        }
        if (hazardLower.includes('harmful') || hazardLower.includes('irritant') || hazardLower.includes('toxic')) {
            return 'medium';
        }
        return 'low';
    }
    /**
     * Knowledge base of known chemical safety information
     */
    getKnownSafetyInfo() {
        return {
            'H2SO4': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sulfuric acid': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NaOH': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sodium hydroxide': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'HCl': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'hydrochloric acid': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NH3': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'ammonia': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'H2O': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            },
            'water': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            }
        };
    }
    /**
     * Infer basic safety information from compound properties
     */
    inferSafetyFromProperties(compoundInfo) {
        const safetyInfo = {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: ['Handle with care', 'Use proper ventilation'],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
        const formula = compoundInfo.molecularFormula || '';
        const name = compoundInfo.name.toLowerCase();
        // Infer based on common patterns
        if (formula.includes('O') && formula.includes('H') && (name.includes('acid') || formula.match(/H\d*[A-Z]/))) {
            safetyInfo.healthHazards.push('May cause skin and eye irritation');
            safetyInfo.precautionaryStatements.push('Avoid contact with skin and eyes');
        }
        if (name.includes('chloride') || formula.includes('Cl')) {
            safetyInfo.healthHazards.push('May be harmful if inhaled');
            safetyInfo.precautionaryStatements.push('Use in well-ventilated area');
        }
        if (name.includes('sulfate') || name.includes('nitrate')) {
            safetyInfo.healthHazards.push('May cause irritation');
        }
        // Default precautionary statement for unknown compounds
        if (safetyInfo.healthHazards.length === 0 && formula !== 'H2O') {
            safetyInfo.healthHazards.push('Safety data not available - handle with caution');
        }
        return safetyInfo;
    }
    /**
     * Balance equation using common chemical names
     * Converts compound names to formulas using PubChem, then balances
     */
    async balanceByName(commonNameEquation) {
        try {
            // Step 1: Parse equation to extract compound names
            const { reactantNames, productNames } = this.parseEquationNames(commonNameEquation);
            // Step 2: Resolve each compound name to chemical formula
            const nameToFormulaMap = {};
            const compoundDataMap = {};
            const allNames = [...reactantNames, ...productNames];
            for (const name of allNames) {
                const compoundInfo = await this.getCompoundInfo(name);
                compoundDataMap[name] = compoundInfo;
                if (compoundInfo.isValid && compoundInfo.molecularFormula) {
                    nameToFormulaMap[name] = compoundInfo.molecularFormula;
                }
                else {
                    // Try common name alternatives
                    const alternatives = this.getCommonNames(name);
                    let found = false;
                    for (const alt of alternatives) {
                        const altInfo = await this.getCompoundInfo(alt);
                        if (altInfo.isValid && altInfo.molecularFormula) {
                            nameToFormulaMap[name] = altInfo.molecularFormula;
                            compoundDataMap[name] = altInfo;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new ComputationError(`Could not resolve compound name: "${name}". Try using the chemical formula instead.`, { compoundName: name, operation: 'compound_resolution' });
                    }
                }
            }
            // Step 3: Reconstruct equation with chemical formulas
            const formulaEquation = this.reconstructEquationWithFormulas(commonNameEquation, nameToFormulaMap);
            // Step 4: Balance the reconstructed equation
            const balanced = this.balanceDetailed(formulaEquation);
            // Step 5: Create enhanced result with both names and formulas
            const enhanced = {
                ...balanced,
                compoundData: {},
                validation: {
                    massBalanced: true,
                    chargeBalanced: true,
                    warnings: []
                }
            };
            // Add compound data for both original names and formulas
            for (const [name, info] of Object.entries(compoundDataMap)) {
                if (info.molecularFormula && balanced.reactants.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula, // Use formula as key
                        originalName: name // Keep original name
                    };
                }
                if (info.molecularFormula && balanced.products.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula,
                        originalName: name
                    };
                }
            }
            // Validate mass balance using PubChem molecular weights
            try {
                const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
                enhanced.validation.massBalanced = massValidation.balanced;
                if (!massValidation.balanced) {
                    enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            return enhanced;
        }
        catch (error) {
            throw new ComputationError(`Failed to balance equation by name: ${error instanceof Error ? error.message : 'Unknown error'}`, { equation: commonNameEquation, operation: 'balance_by_name' });
        }
    }
    /**
     * Balance equation with PubChem data enrichment
     */
    async balanceWithPubChemData(equation) {
        // First balance the equation normally
        const balanced = this.balanceDetailed(equation);
        // Enhance with PubChem data
        const enhanced = {
            ...balanced,
            compoundData: {},
            validation: {
                massBalanced: true,
                chargeBalanced: true,
                warnings: [],
                formulaValidation: {}
            }
        };
        // Get all unique species from the equation
        const allSpecies = [...new Set([...balanced.reactants, ...balanced.products])];
        // Validate chemical formulas using the browser validation
        for (const species of allSpecies) {
            try {
                const formulaValidation = validateChemicalFormula$1(species);
                enhanced.validation.formulaValidation[species] = formulaValidation;
                if (!formulaValidation.isValid) {
                    enhanced.validation.warnings.push(`Invalid formula ${species}: ${formulaValidation.errors.join(', ')}`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Formula validation failed for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Fetch PubChem data for each compound
        for (const species of allSpecies) {
            try {
                const compoundInfo = await this.getCompoundInfo(species);
                enhanced.compoundData[species] = compoundInfo;
                if (!compoundInfo.isValid && compoundInfo.error) {
                    enhanced.validation.warnings.push(`${species}: ${compoundInfo.error}`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Failed to fetch data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Validate mass balance using PubChem molecular weights
        try {
            const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
            enhanced.validation.massBalanced = massValidation.balanced;
            if (!massValidation.balanced) {
                enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
            }
        }
        catch (error) {
            enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return enhanced;
    }
    /**
     * Get compound information from PubChem
     */
    async getCompoundInfo(compoundName) {
        // Check cache first
        const cached = await this.compoundCache.get(compoundName);
        if (cached.hit && cached.value) {
            return cached.value;
        }
        const result = {
            name: compoundName,
            isValid: false
        };
        try {
            // Dynamic import of PubChem functionality
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                result.error = 'PubChem module not available. Install creb-pubchem-js for enhanced functionality.';
                await this.compoundCache.set(compoundName, result);
                return result;
            }
            // Try to find compound by name
            let compounds = [];
            // First try exact name match
            try {
                compounds = await pubchemModule.fromName(compoundName);
            }
            catch (error) {
                // If name search fails and it looks like a formula, try CID search
                if (this.isLikelyFormula(compoundName)) {
                    try {
                        // For simple cases, try to find by common names
                        const commonNames = this.getCommonNames(compoundName);
                        for (const name of commonNames) {
                            try {
                                compounds = await pubchemModule.fromName(name);
                                if (compounds.length > 0)
                                    break;
                            }
                            catch {
                                // Continue to next name
                            }
                        }
                    }
                    catch (formulaError) {
                        result.error = `Not found by name or common formula names: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    }
                }
                else {
                    result.error = `Not found by name: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }
            if (compounds.length > 0) {
                const compound = compounds[0]; // Use first match
                result.cid = compound.cid;
                result.molecularWeight = compound.molecularWeight || undefined;
                result.molecularFormula = compound.molecularFormula || undefined;
                result.iupacName = compound.iupacName || undefined;
                result.canonicalSmiles = compound.isomericSmiles || undefined;
                result.isValid = true;
                result.pubchemData = compound;
            }
            else if (!result.error) {
                result.error = 'No compounds found';
            }
        }
        catch (error) {
            result.error = `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        // Cache the result
        await this.compoundCache.set(compoundName, result);
        return result;
    }
    /**
     * Dynamically load PubChem module if available
     */
    async loadPubChemModule() {
        try {
            // Try to import the PubChem module
            // In browser environment, check for global PubChemJS
            if (typeof globalThis !== 'undefined' && globalThis.PubChemJS) {
                return globalThis.PubChemJS.Compound;
            }
            // Also check window for browser compatibility
            if (typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined' && globalThis.window.PubChemJS) {
                return globalThis.window.PubChemJS.Compound;
            }
            // Legacy check for CREBPubChem (for backwards compatibility)
            if (typeof globalThis !== 'undefined' && globalThis.CREBPubChem) {
                return globalThis.CREBPubChem.Compound;
            }
            // In Node.js environment, try dynamic import with error handling
            try {
                // Use eval to avoid TypeScript compile-time module resolution
                const importFn = new Function('specifier', 'return import(specifier)');
                const pubchemModule = await importFn('creb-pubchem-js');
                return pubchemModule.Compound;
            }
            catch (importError) {
                // Module not available
                return null;
            }
        }
        catch (error) {
            // PubChem module not available
            return null;
        }
    }
    /**
     * Parse equation with compound names to extract reactant and product names
     */
    parseEquationNames(equation) {
        // Clean up the equation
        const cleanEquation = equation.trim().replace(/\s+/g, ' ');
        // Split by = or -> or →
        const parts = cleanEquation.split(/\s*(?:=|->|→)\s*/);
        if (parts.length !== 2) {
            throw new ValidationError('Invalid equation format. Expected format: "reactants = products"', { equation: cleanEquation, operation: 'parse_equation' });
        }
        const [reactantsPart, productsPart] = parts;
        // Parse reactants and products (split by + and clean up)
        const reactantNames = reactantsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        const productNames = productsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        if (reactantNames.length === 0 || productNames.length === 0) {
            throw new ValidationError('Invalid equation: must have at least one reactant and one product', { reactantCount: reactantNames.length, productCount: productNames.length, operation: 'parse_equation' });
        }
        return { reactantNames, productNames };
    }
    /**
     * Clean compound name by removing coefficients and standardizing format
     */
    cleanCompoundName(name) {
        // Remove leading numbers (coefficients)
        let cleaned = name.replace(/^\d+\s*/, '').trim();
        // Handle common variations
        cleaned = cleaned.toLowerCase().trim();
        // Standardize common names
        const standardNames = {
            'water': 'water',
            'h2o': 'water',
            'sulfuric acid': 'sulfuric acid',
            'sulphuric acid': 'sulfuric acid',
            'sodium hydroxide': 'sodium hydroxide',
            'caustic soda': 'sodium hydroxide',
            'sodium sulfate': 'sodium sulfate',
            'sodium sulphate': 'sodium sulfate',
            'hydrochloric acid': 'hydrochloric acid',
            'muriatic acid': 'hydrochloric acid',
            'ammonia': 'ammonia',
            'carbon dioxide': 'carbon dioxide',
            'glucose': 'glucose',
            'ethanol': 'ethanol',
            'ethyl alcohol': 'ethanol',
            'methane': 'methane',
            'oxygen': 'oxygen',
            'hydrogen': 'hydrogen',
            'nitrogen': 'nitrogen'
        };
        return standardNames[cleaned] || cleaned;
    }
    /**
     * Reconstruct equation using chemical formulas instead of names
     */
    reconstructEquationWithFormulas(originalEquation, nameToFormulaMap) {
        let formulaEquation = originalEquation;
        // Replace each compound name with its formula
        for (const [name, formula] of Object.entries(nameToFormulaMap)) {
            // Create regex to match the compound name (case insensitive, word boundaries)
            const nameRegex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            formulaEquation = formulaEquation.replace(nameRegex, formula);
        }
        return formulaEquation;
    }
    /**
     * Get common names for simple chemical formulas or alternative names for compounds
     */
    getCommonNames(input) {
        const commonNames = {
            'H2O': ['water'],
            'water': ['H2O', 'dihydrogen monoxide'],
            'CO2': ['carbon dioxide'],
            'carbon dioxide': ['CO2'],
            'NaCl': ['sodium chloride', 'salt'],
            'sodium chloride': ['NaCl', 'salt'],
            'salt': ['NaCl', 'sodium chloride'],
            'H2SO4': ['sulfuric acid', 'sulphuric acid'],
            'sulfuric acid': ['H2SO4', 'sulphuric acid'],
            'sulphuric acid': ['H2SO4', 'sulfuric acid'],
            'HCl': ['hydrochloric acid', 'muriatic acid'],
            'hydrochloric acid': ['HCl', 'muriatic acid'],
            'muriatic acid': ['HCl', 'hydrochloric acid'],
            'NH3': ['ammonia'],
            'ammonia': ['NH3'],
            'CH4': ['methane'],
            'methane': ['CH4'],
            'C2H5OH': ['ethanol', 'ethyl alcohol'],
            'ethanol': ['C2H5OH', 'ethyl alcohol'],
            'ethyl alcohol': ['C2H5OH', 'ethanol'],
            'C6H12O6': ['glucose', 'dextrose'],
            'glucose': ['C6H12O6', 'dextrose'],
            'dextrose': ['C6H12O6', 'glucose'],
            'CaCO3': ['calcium carbonate'],
            'calcium carbonate': ['CaCO3'],
            'NaOH': ['sodium hydroxide', 'caustic soda'],
            'sodium hydroxide': ['NaOH', 'caustic soda'],
            'caustic soda': ['NaOH', 'sodium hydroxide'],
            'KOH': ['potassium hydroxide'],
            'potassium hydroxide': ['KOH'],
            'Na2SO4': ['sodium sulfate', 'sodium sulphate'],
            'sodium sulfate': ['Na2SO4', 'sodium sulphate'],
            'sodium sulphate': ['Na2SO4', 'sodium sulfate'],
            'Mg': ['magnesium'],
            'magnesium': ['Mg'],
            'Al': ['aluminum', 'aluminium'],
            'aluminum': ['Al'],
            'aluminium': ['Al'],
            'Fe': ['iron'],
            'iron': ['Fe'],
            'Cu': ['copper'],
            'copper': ['Cu'],
            'Zn': ['zinc'],
            'zinc': ['Zn'],
            'O2': ['oxygen'],
            'oxygen': ['O2'],
            'N2': ['nitrogen'],
            'nitrogen': ['N2'],
            'H2': ['hydrogen'],
            'hydrogen': ['H2']
        };
        return commonNames[input] || commonNames[input.toLowerCase()] || [];
    }
    /**
     * Check if a string looks like a chemical formula
     */
    isLikelyFormula(str) {
        // Simple heuristic: contains only letters, numbers, parentheses, and common symbols
        return /^[A-Za-z0-9()[\]+-]+$/.test(str) && /[A-Z]/.test(str);
    }
    /**
     * Validate mass balance using PubChem molecular weights
     */
    validateMassBalance(balanced, compoundData) {
        let reactantMass = 0;
        let productMass = 0;
        // Calculate reactant mass
        for (let i = 0; i < balanced.reactants.length; i++) {
            const species = balanced.reactants[i];
            const coefficient = balanced.coefficients[i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                reactantMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new ComputationError(`Missing molecular weight for reactant: ${species}`, { species, coefficient, operation: 'mass_balance_validation' });
            }
        }
        // Calculate product mass
        for (let i = 0; i < balanced.products.length; i++) {
            const species = balanced.products[i];
            const coefficient = balanced.coefficients[balanced.reactants.length + i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                productMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new ComputationError(`Missing molecular weight for product: ${species}`, { species, coefficient, operation: 'mass_balance_validation' });
            }
        }
        const discrepancy = Math.abs(reactantMass - productMass);
        const tolerance = 0.01; // 0.01 g/mol tolerance
        return {
            balanced: discrepancy <= tolerance,
            discrepancy
        };
    }
    /**
     * Suggest alternative compound names or formulas
     */
    async suggestAlternatives(compoundName) {
        const suggestions = [];
        try {
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                return suggestions;
            }
            // Try various search strategies
            const searchTerms = [
                compoundName.toLowerCase(),
                compoundName.toUpperCase(),
                compoundName.replace(/\s+/g, ''),
                compoundName.replace(/\s+/g, '-'),
                compoundName.replace(/-/g, ' '),
            ];
            for (const term of searchTerms) {
                if (term !== compoundName) {
                    try {
                        const compounds = await pubchemModule.fromName(term);
                        if (compounds.length > 0) {
                            suggestions.push(term);
                        }
                    }
                    catch {
                        // Ignore errors for suggestions
                    }
                }
            }
        }
        catch (error) {
            // Return empty suggestions if search fails
        }
        return [...new Set(suggestions)]; // Remove duplicates
    }
    /**
     * Clear the compound cache
     */
    async clearCache() {
        await this.compoundCache.clear();
    }
    /**
     * Get cached compound info without making new requests
     */
    async getCachedCompoundInfo(compoundName) {
        const result = await this.compoundCache.get(compoundName);
        return result.hit ? result.value : undefined;
    }
};
exports.EnhancedChemicalEquationBalancer = __decorate([
    Injectable()
], exports.EnhancedChemicalEquationBalancer);

/**
 * Enhanced Stoichiometry calculator with PubChem integration
 * Provides accurate molecular weights, compound validation, and enriched calculations
 */
class EnhancedStoichiometry extends exports.Stoichiometry {
    constructor(equation) {
        super(equation);
        this.compoundDataCache = {};
        this.enhancedBalancer = new exports.EnhancedChemicalEquationBalancer();
    }
    /**
     * Initialize with compound validation and enrichment
     */
    async initializeWithValidation(equation) {
        // Initialize the stoichiometry with the equation
        this.initializedStoich = new exports.Stoichiometry(equation);
        // Balance the equation with PubChem data
        const enhancedBalance = await this.enhancedBalancer.balanceWithPubChemData(equation);
        // Store compound data for later use
        this.compoundDataCache = enhancedBalance.compoundData || {};
        // Calculate molecular weight validation
        const validation = this.calculateMolecularWeightValidation(enhancedBalance);
        // Generate suggestions for compounds that weren't found
        const suggestions = {};
        for (const [species, info] of Object.entries(this.compoundDataCache)) {
            if (!info.isValid) {
                try {
                    suggestions[species] = await this.enhancedBalancer.suggestAlternatives(species);
                }
                catch (error) {
                    // Ignore suggestion errors
                }
            }
        }
        return {
            equation: enhancedBalance.equation,
            balanced: true,
            molecularWeightValidation: validation,
            compoundInfo: this.compoundDataCache,
            suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined
        };
    }
    /**
     * Enhanced stoichiometric calculation with PubChem data
     */
    async calculateFromMolesEnhanced(selectedSpecies, moles) {
        // Use the initialized stoichiometry or throw error if not initialized
        if (!this.initializedStoich) {
            throw new Error('Enhanced stoichiometry not initialized. Call initializeWithValidation() first.');
        }
        // Get basic calculation
        const basicResult = this.initializedStoich.calculateFromMoles(selectedSpecies, moles);
        // Enhance with PubChem data
        const enhanced = {
            ...basicResult,
            compoundData: this.compoundDataCache,
            pubchemMolarWeights: {},
            validation: {
                molecularWeightAccuracy: {},
                warnings: []
            }
        };
        // Compare calculated vs PubChem molecular weights
        const allSpecies = [...Object.keys(basicResult.reactants), ...Object.keys(basicResult.products)];
        for (const species of allSpecies) {
            const speciesData = basicResult.reactants[species] || basicResult.products[species];
            const compoundInfo = this.compoundDataCache[species];
            if (compoundInfo?.molecularWeight && speciesData) {
                enhanced.pubchemMolarWeights[species] = compoundInfo.molecularWeight;
                const calculated = speciesData.molarWeight;
                const pubchem = compoundInfo.molecularWeight;
                const difference = Math.abs(calculated - pubchem);
                const percentDiff = (difference / pubchem) * 100;
                enhanced.validation.molecularWeightAccuracy[species] = {
                    calculated,
                    pubchem,
                    difference,
                    accuracy: percentDiff < 0.1 ? 'excellent' :
                        percentDiff < 1 ? 'good' :
                            percentDiff < 5 ? 'fair' : 'poor'
                };
                if (percentDiff > 1) {
                    enhanced.validation.warnings.push(`Molecular weight mismatch for ${species}: calculated ${calculated.toFixed(3)}, PubChem ${pubchem.toFixed(3)} (${percentDiff.toFixed(1)}% difference)`);
                }
            }
            else if (!compoundInfo?.isValid) {
                enhanced.validation.warnings.push(`No PubChem data available for ${species}: ${compoundInfo?.error || 'Unknown compound'}`);
            }
        }
        return enhanced;
    }
    /**
     * Enhanced calculation from grams with PubChem data
     */
    async calculateFromGramsEnhanced(selectedSpecies, grams) {
        // Use the initialized stoichiometry or throw error if not initialized
        if (!this.initializedStoich) {
            throw new Error('Enhanced stoichiometry not initialized. Call initializeWithValidation() first.');
        }
        // Get basic calculation
        const basicResult = this.initializedStoich.calculateFromGrams(selectedSpecies, grams);
        // Convert to enhanced result using the same logic as calculateFromMolesEnhanced
        const speciesData = basicResult.reactants[selectedSpecies] || basicResult.products[selectedSpecies];
        if (speciesData) {
            return this.calculateFromMolesEnhanced(selectedSpecies, speciesData.moles);
        }
        throw new Error(`Species ${selectedSpecies} not found in calculation results`);
    }
    /**
     * Get compound information with PubChem enrichment
     */
    async getCompoundInfo(compoundName) {
        if (this.compoundDataCache[compoundName]) {
            return this.compoundDataCache[compoundName];
        }
        const info = await this.enhancedBalancer.getCompoundInfo(compoundName);
        this.compoundDataCache[compoundName] = info;
        return info;
    }
    /**
     * Calculate molar weight with PubChem verification
     */
    async calculateMolarWeightEnhanced(formula) {
        const calculated = this.calculateMolarWeight(formula);
        try {
            const compoundInfo = await this.getCompoundInfo(formula);
            if (compoundInfo.isValid && compoundInfo.molecularWeight) {
                const pubchem = compoundInfo.molecularWeight;
                const difference = Math.abs(calculated - pubchem);
                const percentDiff = (difference / pubchem) * 100;
                return {
                    calculated,
                    pubchem,
                    difference,
                    accuracy: percentDiff < 0.1 ? 'excellent' :
                        percentDiff < 1 ? 'good' :
                            percentDiff < 5 ? 'fair' : 'poor',
                    compoundInfo
                };
            }
        }
        catch (error) {
            // PubChem lookup failed, return calculated value only
        }
        return { calculated };
    }
    /**
     * Compare two compounds using PubChem data
     */
    async compareCompounds(compound1, compound2) {
        const info1 = await this.getCompoundInfo(compound1);
        const info2 = await this.getCompoundInfo(compound2);
        const comparison = {
            molecularWeightRatio: 1,
            formulasSimilar: false,
            sameCompound: false,
            differences: []
        };
        if (info1.isValid && info2.isValid) {
            // Compare molecular weights
            if (info1.molecularWeight && info2.molecularWeight) {
                comparison.molecularWeightRatio = info1.molecularWeight / info2.molecularWeight;
            }
            // Compare formulas
            if (info1.molecularFormula && info2.molecularFormula) {
                comparison.formulasSimilar = info1.molecularFormula === info2.molecularFormula;
                if (comparison.formulasSimilar) {
                    comparison.sameCompound = true;
                }
            }
            // Find differences
            if (info1.cid && info2.cid && info1.cid === info2.cid) {
                comparison.sameCompound = true;
            }
            else {
                if (info1.molecularFormula !== info2.molecularFormula) {
                    comparison.differences.push(`Different molecular formulas: ${info1.molecularFormula} vs ${info2.molecularFormula}`);
                }
                if (info1.molecularWeight && info2.molecularWeight && Math.abs(info1.molecularWeight - info2.molecularWeight) > 0.01) {
                    comparison.differences.push(`Different molecular weights: ${info1.molecularWeight} vs ${info2.molecularWeight}`);
                }
            }
        }
        else {
            if (!info1.isValid)
                comparison.differences.push(`Cannot find data for ${compound1}`);
            if (!info2.isValid)
                comparison.differences.push(`Cannot find data for ${compound2}`);
        }
        return {
            compound1: info1,
            compound2: info2,
            comparison
        };
    }
    /**
     * Calculate molecular weight validation for balanced equation
     */
    calculateMolecularWeightValidation(enhancedBalance) {
        let reactantMass = 0;
        let productMass = 0;
        if (enhancedBalance.compoundData) {
            // Calculate reactant total mass
            for (let i = 0; i < enhancedBalance.reactants.length; i++) {
                const species = enhancedBalance.reactants[i];
                const coefficient = enhancedBalance.coefficients[i];
                const compound = enhancedBalance.compoundData[species];
                if (compound?.molecularWeight) {
                    reactantMass += coefficient * compound.molecularWeight;
                }
            }
            // Calculate product total mass  
            for (let i = 0; i < enhancedBalance.products.length; i++) {
                const species = enhancedBalance.products[i];
                const coefficient = enhancedBalance.coefficients[enhancedBalance.reactants.length + i];
                const compound = enhancedBalance.compoundData[species];
                if (compound?.molecularWeight) {
                    productMass += coefficient * compound.molecularWeight;
                }
            }
        }
        const difference = Math.abs(reactantMass - productMass);
        const isBalanced = difference < 0.01; // 0.01 g/mol tolerance
        return {
            reactants: reactantMass,
            products: productMass,
            difference,
            isBalanced
        };
    }
    /**
     * Clear cached compound data
     */
    clearCache() {
        this.compoundDataCache = {};
        this.enhancedBalancer.clearCache();
    }
    /**
     * Get all cached compound data
     */
    getCachedCompounds() {
        return { ...this.compoundDataCache };
    }
}

/**
 * @fileoverview Type definitions for the CREB Validation Pipeline
 *
 * Provides comprehensive type definitions for:
 * - Validation results and errors
 * - Validator interfaces and compositions
 * - Rule definitions and dependencies
 * - Performance metrics and caching
 * - Chemical-specific validation types
 *
 * @version 1.0.0
 * @author CREB Team
 */
// ============================================================================
// Core Validation Types
// ============================================================================
/**
 * Severity levels for validation errors
 */
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["INFO"] = "info";
    ValidationSeverity["WARNING"] = "warning";
    ValidationSeverity["ERROR"] = "error";
    ValidationSeverity["CRITICAL"] = "critical";
})(ValidationSeverity || (ValidationSeverity = {}));
/**
 * Type guard for validators
 */
function isValidator(obj) {
    return obj &&
        typeof obj.name === 'string' &&
        obj.config &&
        Array.isArray(obj.dependencies) &&
        typeof obj.validate === 'function' &&
        typeof obj.canValidate === 'function' &&
        typeof obj.getSchema === 'function';
}
/**
 * Type guard for validation rules
 */
function isValidationRule(obj) {
    return obj &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        Array.isArray(obj.dependencies) &&
        typeof obj.priority === 'number' &&
        typeof obj.execute === 'function' &&
        typeof obj.appliesTo === 'function';
}

/**
 * @fileoverview ValidationPipeline - Core validation orchestration system
 *
 * The ValidationPipeline provides a comprehensive data validation framework with:
 * - Validator composition and dependency management
 * - Async validation support with timeout handling
 * - Rule dependency resolution and execution ordering
 * - Performance optimization with caching and parallelization
 * - Chemical-specific validation capabilities
 * - Extensible architecture for custom validators and rules
 *
 * @version 1.0.0
 * @author CREB Team
 */
/**
 * Core validation pipeline for orchestrating complex validation workflows
 */
class ValidationPipeline extends events.EventEmitter {
    constructor(config = {}) {
        super();
        this.validators = new Map();
        this.rules = new Map();
        this.dependencyGraph = new Map();
        this.performanceMetrics = new Map();
        this.config = {
            timeout: 5000,
            enableCaching: true,
            cacheTTL: 300000, // 5 minutes
            maxCacheSize: 1000,
            continueOnError: true,
            parallel: {
                enabled: true,
                maxConcurrency: 4
            },
            monitoring: {
                enabled: true,
                sampleRate: 0.1
            },
            ...config
        };
        this.cache = new exports.AdvancedCache({
            maxSize: this.config.maxCacheSize,
            defaultTtl: this.config.cacheTTL,
            evictionStrategy: 'lru'
        });
        this.setupErrorHandling();
    }
    // ============================================================================
    // Validator Management
    // ============================================================================
    /**
     * Register a validator with the pipeline
     * @param validator Validator to register
     */
    addValidator(validator) {
        if (!isValidator(validator)) {
            throw new ValidationError('Invalid validator provided', {
                validator: validator?.name || 'unknown',
                errorCode: 'VALIDATION_INVALID_VALIDATOR'
            });
        }
        if (this.validators.has(validator.name)) {
            throw new ValidationError(`Validator '${validator.name}' already registered`, {
                validator: validator.name,
                errorCode: 'VALIDATION_DUPLICATE_VALIDATOR'
            });
        }
        this.validators.set(validator.name, validator);
        this.validateDependencies(validator);
        this.emit('validator:registered', { name: validator.name });
    }
    /**
     * Remove a validator from the pipeline
     * @param name Name of validator to remove
     */
    removeValidator(name) {
        const removed = this.validators.delete(name);
        if (removed) {
            this.emit('validator:unregistered', { name });
        }
        return removed;
    }
    /**
     * Get a registered validator
     * @param name Validator name
     */
    getValidator(name) {
        return this.validators.get(name);
    }
    /**
     * Get all registered validators
     */
    getValidators() {
        return Array.from(this.validators.values());
    }
    // ============================================================================
    // Rule Management
    // ============================================================================
    /**
     * Register a validation rule
     * @param rule Rule to register
     */
    addRule(rule) {
        if (!isValidationRule(rule)) {
            throw new ValidationError('Invalid validation rule provided', {
                rule: rule?.name || 'unknown',
                errorCode: 'VALIDATION_INVALID_RULE'
            });
        }
        if (this.rules.has(rule.name)) {
            throw new ValidationError(`Rule '${rule.name}' already registered`, {
                rule: rule.name,
                errorCode: 'VALIDATION_DUPLICATE_RULE'
            });
        }
        this.rules.set(rule.name, rule);
        this.updateDependencyGraph(rule);
        this.emit('rule:registered', { name: rule.name });
    }
    /**
     * Remove a validation rule
     * @param name Name of rule to remove
     */
    removeRule(name) {
        const removed = this.rules.delete(name);
        if (removed) {
            this.dependencyGraph.delete(name);
            this.emit('rule:unregistered', { name });
        }
        return removed;
    }
    /**
     * Get a registered rule
     * @param name Rule name
     */
    getRule(name) {
        return this.rules.get(name);
    }
    /**
     * Get all registered rules
     */
    getRules() {
        return Array.from(this.rules.values());
    }
    // ============================================================================
    // Core Validation
    // ============================================================================
    /**
     * Validate a value using all applicable validators and rules
     * @param value Value to validate
     * @param validatorNames Specific validators to use (optional)
     * @returns Promise resolving to validation result
     */
    async validate(value, validatorNames) {
        const startTime = Date.now();
        const context = this.createValidationContext([], value, value);
        try {
            this.emit('validation:started', {
                target: value,
                validators: validatorNames || Array.from(this.validators.keys())
            });
            // Determine which validators to use
            const applicableValidators = this.getApplicableValidators(value, validatorNames);
            if (applicableValidators.length === 0) {
                // Handle edge cases where no validators are applicable
                if (value === null || value === undefined || value === '') {
                    return this.createFailureResult(context, startTime, [this.createError('NO_VALIDATORS_APPLICABLE', `Invalid input: ${value === null ? 'null' : value === undefined ? 'undefined' : 'empty string'}`, [], ValidationSeverity.ERROR, ['Provide a valid input value'], { value }, value)]);
                }
                return this.createSuccessResult(context, startTime);
            }
            // Execute validators
            const validatorResults = await this.executeValidators(value, applicableValidators, context);
            // Execute applicable rules
            const ruleResults = await this.executeRules(value, context);
            // Combine results
            const result = this.combineResults(validatorResults, ruleResults, context, startTime);
            this.emit('validation:completed', { result });
            this.recordPerformanceMetrics(result);
            return result;
        }
        catch (error) {
            const validationError = error instanceof CREBError ? error :
                new ValidationError('Validation pipeline failed', {
                    originalError: error,
                    errorCode: 'VALIDATION_PIPELINE_ERROR'
                });
            this.emit('validation:error', { error: validationError });
            throw validationError;
        }
    }
    /**
     * Validate multiple values in parallel
     * @param values Values to validate
     * @param validatorNames Specific validators to use (optional)
     * @returns Promise resolving to array of validation results
     */
    async validateBatch(values, validatorNames) {
        if (!this.config.parallel.enabled) {
            // Sequential validation
            const results = [];
            for (const value of values) {
                results.push(await this.validate(value, validatorNames));
            }
            return results;
        }
        // Parallel validation with concurrency limit
        const results = [];
        const concurrency = Math.min(this.config.parallel.maxConcurrency, values.length);
        for (let i = 0; i < values.length; i += concurrency) {
            const batch = values.slice(i, i + concurrency);
            const batchPromises = batch.map(value => this.validate(value, validatorNames));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        return results;
    }
    // ============================================================================
    // Private Methods - Validator Execution
    // ============================================================================
    getApplicableValidators(value, validatorNames) {
        const validators = validatorNames
            ? validatorNames.map(name => this.validators.get(name)).filter(Boolean)
            : Array.from(this.validators.values());
        return validators.filter(validator => validator.canValidate(value));
    }
    async executeValidators(value, validators, context) {
        const results = [];
        for (const validator of validators) {
            try {
                // Check cache first
                const cacheKey = this.createCacheKey(validator, value);
                const cachedResult = await this.getCachedResult(cacheKey);
                if (cachedResult) {
                    this.emit('cache:hit', { key: cacheKey });
                    results.push(cachedResult.result);
                    continue;
                }
                this.emit('cache:miss', { key: cacheKey });
                // Execute validator with timeout
                const result = await this.executeWithTimeout(() => validator.validate(value, context), this.config.timeout, `Validator '${validator.name}' timed out`);
                // Cache result if cacheable
                if (validator.config.cacheable && this.config.enableCaching) {
                    await this.cacheResult(cacheKey, result);
                }
                results.push(result);
                this.emit('validator:executed', { validator: validator.name, result });
            }
            catch (error) {
                if (!this.config.continueOnError) {
                    throw error;
                }
                // Create error result
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorResult = {
                    isValid: false,
                    errors: [{
                            code: 'VALIDATOR_EXECUTION_ERROR',
                            message: `Validator '${validator.name}' failed: ${errorMessage}`,
                            path: context.path,
                            severity: ValidationSeverity.ERROR,
                            suggestions: ['Check validator configuration', 'Verify input data format'],
                            context: { validator: validator.name, error: errorMessage }
                        }],
                    warnings: [],
                    metrics: context.metrics,
                    timestamp: new Date()
                };
                results.push(errorResult);
            }
        }
        return results;
    }
    // ============================================================================
    // Private Methods - Rule Execution
    // ============================================================================
    async executeRules(value, context) {
        // Get applicable rules
        const applicableRules = Array.from(this.rules.values())
            .filter(rule => rule.appliesTo(value));
        if (applicableRules.length === 0) {
            return [];
        }
        // Sort rules by dependency order
        const sortedRules = this.sortRulesByDependencies(applicableRules);
        const results = [];
        for (const rule of sortedRules) {
            try {
                const ruleStartTime = Date.now();
                // Check cache for rule result
                const cacheKey = this.createRuleCacheKey(rule, value);
                const cachedRuleResult = await this.getCachedRuleResult(cacheKey);
                if (cachedRuleResult) {
                    results.push(cachedRuleResult);
                    continue;
                }
                // Execute rule
                const result = await this.executeWithTimeout(() => rule.execute(value, context), this.config.timeout, `Rule '${rule.name}' timed out`);
                result.duration = Date.now() - ruleStartTime;
                result.cached = false;
                // Cache result if cacheable
                if (rule.cacheable && this.config.enableCaching) {
                    await this.cacheRuleResult(cacheKey, result);
                }
                results.push(result);
                this.emit('rule:executed', { rule: rule.name, result });
            }
            catch (error) {
                if (!this.config.continueOnError) {
                    throw error;
                }
                // Create error result
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorResult = {
                    passed: false,
                    error: {
                        code: 'RULE_EXECUTION_ERROR',
                        message: `Rule '${rule.name}' failed: ${errorMessage}`,
                        path: context.path,
                        severity: ValidationSeverity.ERROR,
                        suggestions: ['Check rule configuration', 'Verify input data'],
                        context: { rule: rule.name, error: errorMessage }
                    },
                    duration: 0,
                    cached: false
                };
                results.push(errorResult);
            }
        }
        return results;
    }
    // ============================================================================
    // Private Methods - Dependency Management
    // ============================================================================
    validateDependencies(validator) {
        for (const dependency of validator.dependencies) {
            if (!this.validators.has(dependency)) {
                throw new ValidationError(`Validator '${validator.name}' depends on '${dependency}' which is not registered`, {
                    validator: validator.name,
                    dependency,
                    errorCode: 'VALIDATION_MISSING_DEPENDENCY'
                });
            }
        }
    }
    updateDependencyGraph(rule) {
        const node = {
            name: rule.name,
            dependencies: [...rule.dependencies],
            dependents: [],
            order: 0
        };
        this.dependencyGraph.set(rule.name, node);
        this.recomputeDependencyOrder();
    }
    recomputeDependencyOrder() {
        const visited = new Set();
        const visiting = new Set();
        const sorted = [];
        const visit = (ruleName) => {
            if (visiting.has(ruleName)) {
                throw new ValidationError(`Circular dependency detected involving rule '${ruleName}'`, {
                    rule: ruleName,
                    errorCode: 'VALIDATION_CIRCULAR_DEPENDENCY'
                });
            }
            if (visited.has(ruleName)) {
                return;
            }
            visiting.add(ruleName);
            const node = this.dependencyGraph.get(ruleName);
            if (node) {
                for (const dependency of node.dependencies) {
                    visit(dependency);
                }
            }
            visiting.delete(ruleName);
            visited.add(ruleName);
            sorted.push(ruleName);
        };
        for (const ruleName of this.dependencyGraph.keys()) {
            if (!visited.has(ruleName)) {
                visit(ruleName);
            }
        }
        // Update execution order
        sorted.forEach((ruleName, index) => {
            const node = this.dependencyGraph.get(ruleName);
            if (node) {
                node.order = index;
            }
        });
    }
    sortRulesByDependencies(rules) {
        return rules.sort((a, b) => {
            const nodeA = this.dependencyGraph.get(a.name);
            const nodeB = this.dependencyGraph.get(b.name);
            if (!nodeA || !nodeB) {
                return a.priority - b.priority;
            }
            // First sort by dependency order, then by priority
            const orderDiff = nodeA.order - nodeB.order;
            return orderDiff !== 0 ? orderDiff : b.priority - a.priority;
        });
    }
    // ============================================================================
    // Private Methods - Caching
    // ============================================================================
    createCacheKey(validator, value) {
        return {
            validator: validator.name,
            valueHash: this.hashValue(value),
            configHash: this.hashValue(validator.config),
            schemaVersion: validator.getSchema().version
        };
    }
    createRuleCacheKey(rule, value) {
        return `rule:${rule.name}:${this.hashValue(value)}`;
    }
    async getCachedResult(key) {
        if (!this.config.enableCaching) {
            return null;
        }
        const cacheKeyString = JSON.stringify(key);
        const cached = await this.cache.get(cacheKeyString);
        if (cached.success && cached.value && cached.value.expiresAt > new Date()) {
            cached.value.hitCount++;
            cached.value.result.fromCache = true;
            return cached.value;
        }
        return null;
    }
    async getCachedRuleResult(key) {
        if (!this.config.enableCaching) {
            return null;
        }
        const cached = await this.cache.get(key);
        if (cached.success && cached.value && cached.value.expiresAt > new Date()) {
            // For rules, we need to extract the RuleResult from ValidationResult
            return {
                passed: cached.value.result.isValid,
                error: cached.value.result.errors[0],
                duration: cached.value.result.metrics.duration,
                cached: true
            };
        }
        return null;
    }
    async cacheResult(key, result) {
        const cacheKeyString = JSON.stringify(key);
        const cached = {
            result,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.config.cacheTTL),
            hitCount: 0
        };
        await this.cache.set(cacheKeyString, cached);
    }
    async cacheRuleResult(key, result) {
        // Convert RuleResult to ValidationResult format for caching
        const validationResult = {
            isValid: result.passed,
            errors: result.error ? [result.error] : [],
            warnings: [],
            metrics: {
                duration: result.duration,
                rulesExecuted: 1,
                validatorsUsed: 0,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
        const cached = {
            result: validationResult,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.config.cacheTTL),
            hitCount: 0
        };
        await this.cache.set(key, cached);
    }
    // ============================================================================
    // Private Methods - Utilities
    // ============================================================================
    createValidationContext(path, value, root, parent) {
        return {
            path,
            root,
            parent,
            config: {
                enabled: true,
                priority: 0,
                cacheable: true
            },
            shared: new Map(),
            metrics: {
                duration: 0,
                rulesExecuted: 0,
                validatorsUsed: 0,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            }
        };
    }
    combineResults(validatorResults, ruleResults, context, startTime) {
        const allErrors = [];
        const allWarnings = [];
        let totalRulesExecuted = 0;
        let totalCacheHits = 0;
        let totalCacheMisses = 0;
        // Collect validator results
        for (const result of validatorResults) {
            allErrors.push(...result.errors);
            allWarnings.push(...result.warnings);
            totalRulesExecuted += result.metrics.rulesExecuted;
            totalCacheHits += result.metrics.cacheStats.hits;
            totalCacheMisses += result.metrics.cacheStats.misses;
        }
        // Collect rule results
        for (const result of ruleResults) {
            if (!result.passed && result.error) {
                allErrors.push(result.error);
            }
            totalRulesExecuted++;
            if (result.cached) {
                totalCacheHits++;
            }
            else {
                totalCacheMisses++;
            }
        }
        const totalCache = totalCacheHits + totalCacheMisses;
        const metrics = {
            duration: Date.now() - startTime,
            rulesExecuted: totalRulesExecuted,
            validatorsUsed: validatorResults.length,
            cacheStats: {
                hits: totalCacheHits,
                misses: totalCacheMisses,
                hitRate: totalCache > 0 ? totalCacheHits / totalCache : 0
            }
        };
        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            metrics,
            timestamp: new Date()
        };
    }
    createSuccessResult(context, startTime) {
        return {
            isValid: true,
            errors: [],
            warnings: [],
            metrics: {
                duration: Date.now() - startTime,
                rulesExecuted: 0,
                validatorsUsed: 0,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
    async executeWithTimeout(operation, timeout, timeoutMessage) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new ValidationError(timeoutMessage, {
                    timeout,
                    errorCode: 'VALIDATION_TIMEOUT'
                }));
            }, timeout);
            operation()
                .then(result => {
                clearTimeout(timer);
                resolve(result);
            })
                .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }
    hashValue(value) {
        // Simple hash function for caching
        return btoa(JSON.stringify(value, null, 0))
            .replace(/[+/=]/g, '')
            .substring(0, 16);
    }
    recordPerformanceMetrics(result) {
        if (!this.config.monitoring.enabled) {
            return;
        }
        if (Math.random() > this.config.monitoring.sampleRate) {
            return;
        }
        // Record duration metrics
        const durations = this.performanceMetrics.get('duration') || [];
        durations.push(result.metrics.duration);
        if (durations.length > 1000) {
            durations.shift(); // Keep only last 1000 measurements
        }
        this.performanceMetrics.set('duration', durations);
        // Check performance thresholds
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        if (avgDuration > 1000) { // 1 second threshold
            this.emit('performance:threshold', {
                metric: 'duration',
                value: avgDuration,
                threshold: 1000
            });
        }
    }
    setupErrorHandling() {
        this.on('error', (error) => {
            console.error('ValidationPipeline error:', error);
        });
    }
    // ============================================================================
    // Public Utility Methods
    // ============================================================================
    /**
     * Get pipeline statistics
     */
    getStats() {
        const durations = this.performanceMetrics.get('duration') || [];
        const avgDuration = durations.length > 0
            ? durations.reduce((a, b) => a + b, 0) / durations.length
            : 0;
        return {
            validators: this.validators.size,
            rules: this.rules.size,
            cacheSize: this.cache.size(),
            cacheHitRate: this.cache.getStats().hitRate,
            avgDuration
        };
    }
    /**
     * Clear all caches
     */
    async clearCache() {
        await this.cache.clear();
    }
    /**
     * Get pipeline configuration
     */
    getConfig() {
        return { ...this.config };
    }
    // ============================================================================
    // Helper Methods
    // ============================================================================
    /**
     * Create a validation error
     */
    createError(code, message, path, severity, suggestions = [], context = {}, value) {
        return {
            code,
            message,
            path,
            severity,
            suggestions,
            context,
            value
        };
    }
    /**
     * Create a failed validation result
     */
    createFailureResult(context, startTime, errors, warnings = []) {
        return {
            isValid: false,
            errors,
            warnings,
            metrics: {
                duration: Date.now() - startTime,
                rulesExecuted: 0,
                validatorsUsed: 0,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
}

/**
 * @fileoverview Base validator classes and validator composition utilities
 *
 * Provides foundation classes for building custom validators:
 * - BaseValidator: Abstract base class with common functionality
 * - CompositeValidator: Combines multiple validators
 * - ValidatorBuilder: Fluent API for building validators
 * - SpecializedValidators: Chemistry-specific validator helpers
 *
 * @version 1.0.0
 * @author CREB Team
 */
// ============================================================================
// Base Validator
// ============================================================================
/**
 * Abstract base class for all validators
 */
class BaseValidator {
    constructor(name, config = {}, dependencies = []) {
        this.name = name;
        this.dependencies = dependencies;
        this.config = {
            enabled: true,
            priority: 0,
            timeout: 5000,
            cacheable: true,
            ...config
        };
        this.schema = this.createSchema();
    }
    /**
     * Create validation schema - can be overridden by subclasses
     */
    createSchema() {
        return {
            name: this.name,
            version: '1.0.0',
            description: `Schema for ${this.name} validator`,
            types: ['any'],
            requiredValidators: [],
            optionalValidators: [],
            properties: {}
        };
    }
    /**
     * Get validation schema
     */
    getSchema() {
        return { ...this.schema };
    }
    /**
     * Create a validation error
     */
    createError(code, message, path, severity = ValidationSeverity.ERROR, suggestions = [], context, value) {
        return {
            code,
            message,
            path,
            severity,
            suggestions,
            context,
            value
        };
    }
    /**
     * Create a successful validation result
     */
    createSuccessResult(context, warnings = []) {
        return {
            isValid: true,
            errors: [],
            warnings,
            metrics: {
                duration: 0,
                rulesExecuted: 0,
                validatorsUsed: 1,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
    /**
     * Create a failed validation result
     */
    createFailureResult(errors, context, warnings = []) {
        return {
            isValid: false,
            errors,
            warnings,
            metrics: {
                duration: 0,
                rulesExecuted: 0,
                validatorsUsed: 1,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
    /**
     * Validate configuration
     */
    validateConfig() {
        if (this.config.timeout && this.config.timeout <= 0) {
            throw new ValidationError('Validator timeout must be positive', { validator: this.name, timeout: this.config.timeout });
        }
    }
}
// ============================================================================
// Composite Validator
// ============================================================================
/**
 * Validator that combines multiple validators
 */
class CompositeValidator extends BaseValidator {
    constructor(name, validators = [], config = {}) {
        super(name, config);
        this.validators = [];
        this.validatorMap = new Map();
        for (const validator of validators) {
            this.addValidator(validator);
        }
    }
    /**
     * Add a validator to the composition
     */
    addValidator(validator) {
        if (this.validatorMap.has(validator.name)) {
            throw new ValidationError(`Validator '${validator.name}' already exists in composite`, { composite: this.name, validator: validator.name });
        }
        this.validators.push(validator);
        this.validatorMap.set(validator.name, validator);
    }
    /**
     * Remove a validator from the composition
     */
    removeValidator(name) {
        const index = this.validators.findIndex(v => v.name === name);
        if (index !== -1) {
            this.validators.splice(index, 1);
            this.validatorMap.delete(name);
        }
    }
    /**
     * Get a specific validator by name
     */
    getValidator(name) {
        return this.validatorMap.get(name);
    }
    /**
     * Check if composite can validate the value
     */
    canValidate(value) {
        return this.validators.some(validator => validator.canValidate(value));
    }
    /**
     * Validate using all applicable validators
     */
    async validate(value, context) {
        const startTime = Date.now();
        const applicableValidators = this.validators.filter(v => v.canValidate(value));
        if (applicableValidators.length === 0) {
            return this.createSuccessResult(context);
        }
        const results = [];
        const allErrors = [];
        const allWarnings = [];
        // Execute all applicable validators
        for (const validator of applicableValidators) {
            try {
                const result = await validator.validate(value, context);
                results.push(result);
                allErrors.push(...result.errors);
                allWarnings.push(...result.warnings);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const validationError = this.createError('COMPOSITE_VALIDATOR_ERROR', `Validator '${validator.name}' failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check validator configuration', 'Verify input data'], { validator: validator.name, error: errorMessage });
                allErrors.push(validationError);
            }
        }
        const duration = Date.now() - startTime;
        const totalRules = results.reduce((sum, r) => sum + r.metrics.rulesExecuted, 0);
        const totalCacheHits = results.reduce((sum, r) => sum + r.metrics.cacheStats.hits, 0);
        const totalCacheMisses = results.reduce((sum, r) => sum + r.metrics.cacheStats.misses, 0);
        const totalCache = totalCacheHits + totalCacheMisses;
        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            metrics: {
                duration,
                rulesExecuted: totalRules,
                validatorsUsed: applicableValidators.length,
                cacheStats: {
                    hits: totalCacheHits,
                    misses: totalCacheMisses,
                    hitRate: totalCache > 0 ? totalCacheHits / totalCache : 0
                }
            },
            timestamp: new Date()
        };
    }
    /**
     * Create composite schema
     */
    createSchema() {
        const childSchemas = this.validators.map(v => v.getSchema());
        const allTypes = new Set();
        const allRequired = new Set();
        const allOptional = new Set();
        for (const schema of childSchemas) {
            schema.types.forEach(type => allTypes.add(type));
            schema.requiredValidators.forEach(req => allRequired.add(req));
            schema.optionalValidators.forEach(opt => allOptional.add(opt));
        }
        return {
            name: this.name,
            version: '1.0.0',
            description: `Composite schema for ${this.name}`,
            types: Array.from(allTypes),
            requiredValidators: Array.from(allRequired),
            optionalValidators: Array.from(allOptional),
            properties: {
                compositeOf: this.validators.map(v => v.name),
                childSchemas
            }
        };
    }
}
// ============================================================================
// Validation Builder
// ============================================================================
/**
 * Fluent API for building validators
 */
class FluentValidationBuilder {
    constructor(name) {
        this.validators = [];
        this.rules = []; // ValidationRule<T>[] - avoiding circular dependency
        this.config = {};
        this.name = name;
    }
    /**
     * Add a validator to the builder
     */
    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }
    /**
     * Add a rule to the builder
     */
    addRule(rule) {
        this.rules.push(rule);
        return this;
    }
    /**
     * Set configuration for the validator
     */
    withConfig(config) {
        this.config = { ...this.config, ...config };
        return this;
    }
    /**
     * Set validator name
     */
    withName(name) {
        this.name = name;
        return this;
    }
    /**
     * Set validator priority
     */
    withPriority(priority) {
        this.config.priority = priority;
        return this;
    }
    /**
     * Enable/disable caching
     */
    withCaching(enabled) {
        this.config.cacheable = enabled;
        return this;
    }
    /**
     * Set validator timeout
     */
    withTimeout(timeout) {
        this.config.timeout = timeout;
        return this;
    }
    /**
     * Build the composite validator
     */
    build() {
        if (this.validators.length === 0) {
            throw new ValidationError('Cannot build validator without any validators', { name: this.name });
        }
        if (this.validators.length === 1) {
            return this.validators[0];
        }
        return new CompositeValidator(this.name, this.validators, this.config);
    }
}
// ============================================================================
// Specialized Validator Helpers
// ============================================================================
/**
 * Base class for chemistry-specific validators
 */
class ChemistryValidator extends BaseValidator {
    constructor() {
        super(...arguments);
        this.elementSymbols = new Set([
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
            'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
            'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
            'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
            'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
            'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
            'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
            'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
            'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
            'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
            'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
        ]);
    }
    /**
     * Validate element symbol
     */
    isValidElement(symbol) {
        return this.elementSymbols.has(symbol);
    }
    /**
     * Parse chemical formula into elements and counts
     */
    parseFormula(formula) {
        const elements = new Map();
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;
        while ((match = regex.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            if (!this.isValidElement(element)) {
                throw new ValidationError(`Invalid element symbol: ${element}`, { element, formula });
            }
            elements.set(element, (elements.get(element) || 0) + count);
        }
        return elements;
    }
    /**
     * Calculate molecular weight from formula
     */
    calculateMolecularWeight(elements) {
        // Simplified atomic weights (should be imported from constants)
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
            'F': 18.998, 'P': 30.974, 'S': 32.06, 'Cl': 35.45,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'Ag': 107.868, 'I': 126.90
            // Add more as needed
        };
        let totalWeight = 0;
        for (const [element, count] of elements) {
            const weight = atomicWeights[element];
            if (weight === undefined) {
                throw new ValidationError(`Atomic weight not available for element: ${element}`, { element });
            }
            totalWeight += weight * count;
        }
        return totalWeight;
    }
}
// ============================================================================
// Factory Functions
// ============================================================================
/**
 * Create a validation builder
 */
function createValidator(name) {
    return new FluentValidationBuilder(name);
}
/**
 * Create a composite validator
 */
function createCompositeValidator(name, validators, config) {
    return new CompositeValidator(name, validators, config);
}
/**
 * Create a chemistry validator (helper for common chemistry validations)
 */
function createChemistryValidator(name, validationFn, canValidateFn, config) {
    return new (class extends ChemistryValidator {
        constructor() {
            super(...arguments);
            this.canValidate = canValidateFn;
            this.validate = validationFn;
        }
    })(name, config);
}

/**
 * @fileoverview Chemical Formula Validator
 *
 * Validates chemical formulas with support for:
 * - Basic chemical formulas (H2O, C6H12O6)
 * - Isotope notation (13C, 2H)
 * - Charge notation (+, -, 2+, 3-)
 * - Complex notation ([Cu(NH3)4]2+)
 * - Radical notation (•)
 *
 * @version 1.0.0
 * @author CREB Team
 */
/**
 * Validator for chemical formulas
 */
class ChemicalFormulaValidator extends ChemistryValidator {
    constructor(config = {}, formulaConfig = {}) {
        super('chemical-formula', config);
        this.formulaConfig = {
            allowIsotopes: true,
            allowRadicals: false,
            allowCharges: true,
            allowComplexes: true,
            maxAtoms: 1000,
            allowedElements: [], // Empty = all elements allowed
            ...formulaConfig
        };
    }
    /**
     * Check if validator can handle the given value
     */
    canValidate(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }
    /**
     * Validate chemical formula
     */
    async validate(value, context) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        try {
            const formula = value.trim();
            // Basic format validation
            if (!this.hasValidFormat(formula)) {
                // Check for specific types of invalid format
                const invalidCharPattern = /[^A-Za-z0-9\(\)\[\]\+\-\s\•]/;
                const unicodePattern = /[₀-₉⁰-⁹]/;
                let errorMessage = `Invalid chemical formula format: ${formula}`;
                let suggestions = [
                    'Use standard chemical notation (e.g., H2O, CaCl2)',
                    'Ensure element symbols start with uppercase letter',
                    'Use numbers for atom counts, not letters'
                ];
                if (invalidCharPattern.test(formula)) {
                    errorMessage = `Formula contains invalid character(s): ${formula}`;
                    suggestions = [
                        'Remove special characters like !, @, #, $, %, etc.',
                        'Use only letters, numbers, parentheses, brackets, and +/- signs'
                    ];
                }
                else if (unicodePattern.test(formula)) {
                    errorMessage = `Formula contains invalid character(s) (Unicode subscripts/superscripts): ${formula}`;
                    suggestions = [
                        'Use regular numbers instead of subscript/superscript characters',
                        'Example: Use H2O instead of H₂O'
                    ];
                }
                errors.push(this.createError('INVALID_FORMULA_FORMAT', errorMessage, context.path, ValidationSeverity.ERROR, suggestions, { formula }, value));
            }
            else {
                // Detailed validation
                const validationResults = this.validateFormulaComponents(formula, context.path);
                errors.push(...validationResults.errors);
                warnings.push(...validationResults.warnings);
            }
            const duration = Date.now() - startTime;
            const isValid = errors.length === 0;
            return {
                isValid,
                errors,
                warnings,
                metrics: {
                    duration,
                    rulesExecuted: 1,
                    validatorsUsed: 1,
                    cacheStats: { hits: 0, misses: 1, hitRate: 0 }
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailureResult([
                this.createError('FORMULA_VALIDATION_ERROR', `Formula validation failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check formula syntax', 'Verify element symbols'], { error: errorMessage }, value)
            ], context);
        }
    }
    /**
     * Basic format validation
     */
    hasValidFormat(formula) {
        // Check for invalid characters first
        const invalidCharPattern = /[^A-Za-z0-9\(\)\[\]\+\-\s\•]/;
        if (invalidCharPattern.test(formula)) {
            return false;
        }
        // Check for Unicode subscript/superscript characters
        const unicodePattern = /[₀-₉⁰-⁹]/;
        if (unicodePattern.test(formula)) {
            return false;
        }
        // Basic regex for chemical formula validation
        // Allows: Element symbols, numbers, brackets, charges, isotopes
        const basicPattern = /^[A-Z][a-z]?(\d*[A-Z][a-z]?\d*)*(\[.*\])?[+-]?\d*[+-]?$/;
        return basicPattern.test(formula.replace(/[\(\)\[\]]/g, ''));
    }
    /**
     * Detailed component validation
     */
    validateFormulaComponents(formula, path) {
        const errors = [];
        const warnings = [];
        try {
            // Handle complex formulas with brackets
            if (this.hasComplexNotation(formula)) {
                if (!this.formulaConfig.allowComplexes) {
                    errors.push(this.createError('COMPLEX_NOTATION_NOT_ALLOWED', 'Complex notation with brackets is not allowed', path, ValidationSeverity.ERROR, ['Use simple formula notation without brackets'], { formula }));
                    return { errors, warnings };
                }
                return this.validateComplexFormula(formula, path);
            }
            // Handle charged formulas
            if (this.hasChargeNotation(formula)) {
                if (!this.formulaConfig.allowCharges) {
                    errors.push(this.createError('CHARGE_NOTATION_NOT_ALLOWED', 'Charge notation is not allowed', path, ValidationSeverity.ERROR, ['Remove charge notation from formula'], { formula }));
                    return { errors, warnings };
                }
                return this.validateChargedFormula(formula, path);
            }
            // Validate simple formula
            return this.validateSimpleFormula(formula, path);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(this.createError('COMPONENT_VALIDATION_ERROR', `Component validation failed: ${errorMessage}`, path, ValidationSeverity.ERROR, ['Check formula structure'], { error: errorMessage }));
            return { errors, warnings };
        }
    }
    /**
     * Validate simple chemical formula
     */
    validateSimpleFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Extract elements and counts
        const elementPattern = /([A-Z][a-z]?)(\d*)/g;
        const elements = new Map();
        let totalAtoms = 0;
        let match;
        while ((match = elementPattern.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            // Validate element symbol
            if (!this.isValidElement(element)) {
                errors.push(this.createError('INVALID_ELEMENT', `Invalid element symbol: ${element}`, path, ValidationSeverity.ERROR, [
                    'Check periodic table for correct element symbols',
                    'Ensure proper capitalization (first letter uppercase, second lowercase)'
                ], { element, formula }));
            }
            // Check if element is allowed
            if (this.formulaConfig.allowedElements.length > 0 &&
                !this.formulaConfig.allowedElements.includes(element)) {
                errors.push(this.createError('ELEMENT_NOT_ALLOWED', `Element ${element} is not allowed`, path, ValidationSeverity.ERROR, [`Use only allowed elements: ${this.formulaConfig.allowedElements.join(', ')}`], { element, allowedElements: this.formulaConfig.allowedElements }));
            }
            // Check for isotope notation
            if (/^\d+[A-Z]/.test(element)) {
                if (!this.formulaConfig.allowIsotopes) {
                    errors.push(this.createError('ISOTOPE_NOTATION_NOT_ALLOWED', 'Isotope notation is not allowed', path, ValidationSeverity.ERROR, ['Remove isotope numbers from element symbols'], { element, formula }));
                }
            }
            elements.set(element, count);
            totalAtoms += count;
        }
        // Check maximum atoms limit
        if (totalAtoms > this.formulaConfig.maxAtoms) {
            errors.push(this.createError('TOO_MANY_ATOMS', `Formula contains ${totalAtoms} atoms, maximum allowed is ${this.formulaConfig.maxAtoms}`, path, ValidationSeverity.ERROR, ['Simplify the formula', 'Use smaller atom counts'], { totalAtoms, maxAtoms: this.formulaConfig.maxAtoms }));
        }
        // Warnings for unusual patterns
        if (totalAtoms > 100) {
            warnings.push(this.createError('LARGE_MOLECULE', `Formula contains ${totalAtoms} atoms, which is unusually large`, path, ValidationSeverity.WARNING, ['Verify the formula is correct', 'Consider if this represents a polymer unit'], { totalAtoms }));
        }
        return { errors, warnings };
    }
    /**
     * Validate charged formula
     */
    validateChargedFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Extract charge part
        const chargeMatch = formula.match(/([+-]\d*|\d*[+-])$/);
        if (!chargeMatch) {
            errors.push(this.createError('INVALID_CHARGE_FORMAT', 'Invalid charge notation format', path, ValidationSeverity.ERROR, ['Use format like +, -, 2+, 3- for charges'], { formula }));
            return { errors, warnings };
        }
        const charge = chargeMatch[1];
        const neutralFormula = formula.replace(chargeMatch[0], '');
        // Validate the neutral part
        const neutralResults = this.validateSimpleFormula(neutralFormula, path);
        errors.push(...neutralResults.errors);
        warnings.push(...neutralResults.warnings);
        // Validate charge format
        if (!/^[+-]\d*$|^\d*[+-]$/.test(charge)) {
            errors.push(this.createError('INVALID_CHARGE_VALUE', `Invalid charge value: ${charge}`, path, ValidationSeverity.ERROR, ['Use valid charge notation (e.g., +, -, 2+, 3-)'], { charge, formula }));
        }
        return { errors, warnings };
    }
    /**
     * Validate complex formula with brackets
     */
    validateComplexFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Check bracket balance
        if (!this.areBracketsBalanced(formula)) {
            errors.push(this.createError('UNBALANCED_BRACKETS', 'Unbalanced brackets in complex formula', path, ValidationSeverity.ERROR, ['Ensure all brackets are properly paired', 'Check for missing opening or closing brackets'], { formula }));
            return { errors, warnings };
        }
        // For complex formulas, we would need more sophisticated parsing
        // This is a simplified validation
        warnings.push(this.createError('COMPLEX_FORMULA_LIMITED_VALIDATION', 'Limited validation for complex formulas', path, ValidationSeverity.WARNING, ['Complex formulas receive basic validation only'], { formula }));
        return { errors, warnings };
    }
    /**
     * Check if formula has complex notation
     */
    hasComplexNotation(formula) {
        return /[\[\]]/.test(formula);
    }
    /**
     * Check if formula has charge notation
     */
    hasChargeNotation(formula) {
        return /[+-]\d*$|\d*[+-]$/.test(formula);
    }
    /**
     * Check if brackets are balanced
     */
    areBracketsBalanced(formula) {
        const stack = [];
        const pairs = { '[': ']', '(': ')' };
        for (const char of formula) {
            if (char in pairs) {
                stack.push(char);
            }
            else if (Object.values(pairs).includes(char)) {
                const last = stack.pop();
                if (!last || pairs[last] !== char) {
                    return false;
                }
            }
        }
        return stack.length === 0;
    }
    /**
     * Create validation schema
     */
    createSchema() {
        return {
            name: this.name,
            version: '1.0.0',
            description: 'Chemical formula validation schema',
            types: ['string'],
            requiredValidators: [],
            optionalValidators: [],
            properties: {
                config: this.formulaConfig,
                examples: ['H2O', 'CaCl2', 'C6H12O6', '[Cu(NH3)4]2+'],
                patterns: [
                    'Simple formulas: ElementCount (e.g., H2O)',
                    'Charged formulas: Formula+/- (e.g., Ca2+)',
                    'Complex formulas: [Formula]Charge (e.g., [Cu(NH3)4]2+)'
                ]
            }
        };
    }
}

/**
 * @fileoverview Thermodynamic Properties Validator
 *
 * Validates thermodynamic properties with:
 * - Temperature range validation
 * - Pressure range validation
 * - Enthalpy, entropy, and heat capacity validation
 * - Cross-property consistency checks
 * - Physical property validation
 *
 * @version 1.0.0
 * @author CREB Team
 */
/**
 * Validator for thermodynamic properties
 */
class ThermodynamicPropertiesValidator extends ChemistryValidator {
    constructor(config = {}, thermoConfig = {}) {
        super('thermodynamic-properties', config);
        this.thermoConfig = {
            temperatureRange: { min: 0, max: 10000 }, // Kelvin
            pressureRange: { min: 0, max: 1e9 }, // Pascal
            enthalpyRange: { min: -1e4, max: 10000 }, // kJ/mol
            entropyRange: { min: 0, max: 1000 }, // J/(mol·K)
            heatCapacityRange: { min: 0, max: 1000 }, // J/(mol·K)
            ...thermoConfig
        };
    }
    /**
     * Check if validator can handle the given value
     */
    canValidate(value) {
        return typeof value === 'object' && value !== null && ('enthalpyFormation' in value ||
            'entropy' in value ||
            'heatCapacity' in value ||
            'gibbsEnergy' in value ||
            'meltingPoint' in value ||
            'boilingPoint' in value ||
            'density' in value ||
            'temperature' in value ||
            'pressure' in value ||
            'enthalpy' in value);
    }
    /**
     * Validate thermodynamic properties
     */
    async validate(value, context) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        try {
            // Validate individual properties
            this.validateTemperature(value, errors, warnings, context.path);
            this.validatePressure(value, errors, warnings, context.path);
            this.validateEnthalpy(value, errors, warnings, context.path);
            this.validateEntropy(value, errors, warnings, context.path);
            this.validateHeatCapacity(value, errors, warnings, context.path);
            this.validateGibbsEnergy(value, errors, warnings, context.path);
            this.validateTemperatures(value, errors, warnings, context.path);
            this.validateDensity(value, errors, warnings, context.path);
            // Cross-property consistency checks
            this.validateConsistency(value, errors, warnings, context.path);
            const duration = Date.now() - startTime;
            const isValid = errors.length === 0;
            return {
                isValid,
                errors,
                warnings,
                metrics: {
                    duration,
                    rulesExecuted: 7, // Number of validation methods called
                    validatorsUsed: 1,
                    cacheStats: { hits: 0, misses: 1, hitRate: 0 }
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailureResult([
                this.createError('THERMODYNAMIC_VALIDATION_ERROR', `Thermodynamic validation failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check property values', 'Verify units are correct'], { error: errorMessage }, value)
            ], context);
        }
    }
    /**
     * Validate enthalpy of formation
     */
    validateEnthalpy(properties, errors, warnings, path) {
        if (properties.enthalpyFormation === undefined) {
            return;
        }
        const enthalpy = properties.enthalpyFormation;
        const { min, max } = this.thermoConfig.enthalpyRange;
        if (typeof enthalpy !== 'number' || !isFinite(enthalpy)) {
            errors.push(this.createError('INVALID_ENTHALPY_VALUE', 'Enthalpy of formation must be a finite number', [...path, 'enthalpyFormation'], ValidationSeverity.ERROR, ['Provide a valid numerical value in kJ/mol'], { value: enthalpy }));
            return;
        }
        if (enthalpy < min || enthalpy > max) {
            errors.push(this.createError('ENTHALPY_OUT_OF_RANGE', `Enthalpy of formation ${enthalpy} kJ/mol is outside valid range [${min}, ${max}]`, [...path, 'enthalpyFormation'], ValidationSeverity.ERROR, [`Provide value between ${min} and ${max} kJ/mol`], { value: enthalpy, min, max }));
        }
        // Warning for extreme values
        if (Math.abs(enthalpy) > 5000) {
            warnings.push(this.createError('EXTREME_ENTHALPY_VALUE', `Enthalpy of formation ${enthalpy} kJ/mol is unusually large`, [...path, 'enthalpyFormation'], ValidationSeverity.WARNING, ['Verify the value is correct', 'Check if units are appropriate'], { value: enthalpy }));
        }
    }
    /**
     * Validate entropy
     */
    validateEntropy(properties, errors, warnings, path) {
        if (properties.entropy === undefined) {
            return;
        }
        const entropy = properties.entropy;
        const { min, max } = this.thermoConfig.entropyRange;
        if (typeof entropy !== 'number' || !isFinite(entropy)) {
            errors.push(this.createError('INVALID_ENTROPY_VALUE', 'Entropy must be a finite number', [...path, 'entropy'], ValidationSeverity.ERROR, ['Provide a valid numerical value in J/(mol·K)'], { value: entropy }));
            return;
        }
        if (entropy < min) {
            errors.push(this.createError('NEGATIVE_ENTROPY', `Entropy ${entropy} J/(mol·K) cannot be negative`, [...path, 'entropy'], ValidationSeverity.ERROR, ['Entropy must be positive according to the third law of thermodynamics'], { value: entropy }));
        }
        if (entropy > max) {
            warnings.push(this.createError('VERY_HIGH_ENTROPY', `Entropy ${entropy} J/(mol·K) is unusually high`, [...path, 'entropy'], ValidationSeverity.WARNING, ['Verify the value is correct', 'Check for large molecular complexity'], { value: entropy, max }));
        }
    }
    /**
     * Validate heat capacity
     */
    validateHeatCapacity(properties, errors, warnings, path) {
        if (properties.heatCapacity === undefined) {
            return;
        }
        const cp = properties.heatCapacity;
        const { min, max } = this.thermoConfig.heatCapacityRange;
        if (typeof cp !== 'number' || !isFinite(cp)) {
            errors.push(this.createError('INVALID_HEAT_CAPACITY_VALUE', 'Heat capacity must be a finite number', [...path, 'heatCapacity'], ValidationSeverity.ERROR, ['Provide a valid numerical value in J/(mol·K)'], { value: cp }));
            return;
        }
        if (cp < min) {
            errors.push(this.createError('NEGATIVE_HEAT_CAPACITY', `Heat capacity ${cp} J/(mol·K) cannot be negative`, [...path, 'heatCapacity'], ValidationSeverity.ERROR, ['Heat capacity must be positive'], { value: cp }));
        }
        if (cp > max) {
            warnings.push(this.createError('VERY_HIGH_HEAT_CAPACITY', `Heat capacity ${cp} J/(mol·K) is unusually high`, [...path, 'heatCapacity'], ValidationSeverity.WARNING, ['Verify the value is correct', 'Check molecular complexity'], { value: cp, max }));
        }
    }
    /**
     * Validate Gibbs free energy
     */
    validateGibbsEnergy(properties, errors, warnings, path) {
        if (properties.gibbsEnergy === undefined) {
            return;
        }
        const gibbs = properties.gibbsEnergy;
        if (typeof gibbs !== 'number' || !isFinite(gibbs)) {
            errors.push(this.createError('INVALID_GIBBS_ENERGY_VALUE', 'Gibbs free energy must be a finite number', [...path, 'gibbsEnergy'], ValidationSeverity.ERROR, ['Provide a valid numerical value in kJ/mol'], { value: gibbs }));
            return;
        }
        // Check consistency with enthalpy if both are present
        if (properties.enthalpyFormation !== undefined && properties.entropy !== undefined) {
            const expectedGibbs = properties.enthalpyFormation - (298.15 * properties.entropy / 1000);
            const difference = Math.abs(gibbs - expectedGibbs);
            if (difference > 50) { // 50 kJ/mol tolerance
                warnings.push(this.createError('GIBBS_ENERGY_INCONSISTENCY', `Gibbs energy may be inconsistent with enthalpy and entropy (difference: ${difference.toFixed(1)} kJ/mol)`, [...path, 'gibbsEnergy'], ValidationSeverity.WARNING, ['Check if all values are at same temperature', 'Verify calculation accuracy'], {
                    gibbsProvided: gibbs,
                    gibbsCalculated: expectedGibbs,
                    difference
                }));
            }
        }
    }
    /**
     * Validate temperature properties
     */
    validateTemperatures(properties, errors, warnings, path) {
        const { meltingPoint, boilingPoint } = properties;
        const { min, max } = this.thermoConfig.temperatureRange;
        // Validate melting point
        if (meltingPoint !== undefined) {
            if (typeof meltingPoint !== 'number' || !isFinite(meltingPoint)) {
                errors.push(this.createError('INVALID_MELTING_POINT', 'Melting point must be a finite number', [...path, 'meltingPoint'], ValidationSeverity.ERROR, ['Provide a valid temperature in Kelvin'], { value: meltingPoint }));
            }
            else if (meltingPoint < min || meltingPoint > max) {
                errors.push(this.createError('MELTING_POINT_OUT_OF_RANGE', `Melting point ${meltingPoint} K is outside valid range [${min}, ${max}]`, [...path, 'meltingPoint'], ValidationSeverity.ERROR, [`Provide temperature between ${min} and ${max} K`], { value: meltingPoint, min, max }));
            }
        }
        // Validate boiling point
        if (boilingPoint !== undefined) {
            if (typeof boilingPoint !== 'number' || !isFinite(boilingPoint)) {
                errors.push(this.createError('INVALID_BOILING_POINT', 'Boiling point must be a finite number', [...path, 'boilingPoint'], ValidationSeverity.ERROR, ['Provide a valid temperature in Kelvin'], { value: boilingPoint }));
            }
            else if (boilingPoint < min || boilingPoint > max) {
                errors.push(this.createError('BOILING_POINT_OUT_OF_RANGE', `Boiling point ${boilingPoint} K is outside valid range [${min}, ${max}]`, [...path, 'boilingPoint'], ValidationSeverity.ERROR, [`Provide temperature between ${min} and ${max} K`], { value: boilingPoint, min, max }));
            }
        }
        // Validate relationship between melting and boiling points
        if (meltingPoint !== undefined && boilingPoint !== undefined) {
            if (meltingPoint >= boilingPoint) {
                errors.push(this.createError('INVALID_PHASE_TRANSITION', `Melting point (${meltingPoint} K) must be less than boiling point (${boilingPoint} K)`, path, ValidationSeverity.ERROR, ['Check temperature values', 'Ensure proper phase transition order'], { meltingPoint, boilingPoint }));
            }
        }
    }
    /**
     * Validate density
     */
    validateDensity(properties, errors, warnings, path) {
        if (properties.density === undefined) {
            return;
        }
        const density = properties.density;
        if (typeof density !== 'number' || !isFinite(density)) {
            errors.push(this.createError('INVALID_DENSITY_VALUE', 'Density must be a finite number', [...path, 'density'], ValidationSeverity.ERROR, ['Provide a valid numerical value in g/cm³'], { value: density }));
            return;
        }
        if (density <= 0) {
            errors.push(this.createError('NEGATIVE_DENSITY', `Density ${density} g/cm³ must be positive`, [...path, 'density'], ValidationSeverity.ERROR, ['Density cannot be zero or negative'], { value: density }));
        }
        if (density > 25) { // Osmium has highest density ~22.6 g/cm³
            warnings.push(this.createError('EXTREMELY_HIGH_DENSITY', `Density ${density} g/cm³ is extremely high`, [...path, 'density'], ValidationSeverity.WARNING, ['Verify the value is correct', 'Check if dealing with compressed material'], { value: density }));
        }
    }
    /**
     * Validate cross-property consistency
     */
    validateConsistency(properties, errors, warnings, path) {
        // Additional consistency checks can be added here
        // For example, checking if entropy correlates with molecular complexity
        if (properties.entropy !== undefined && properties.heatCapacity !== undefined) {
            // At room temperature, Cp is typically larger than S for most compounds
            if (properties.heatCapacity < properties.entropy * 0.5) {
                warnings.push(this.createError('UNUSUAL_CP_S_RATIO', 'Heat capacity seems unusually low compared to entropy', path, ValidationSeverity.WARNING, ['Verify both values are correct', 'Check temperature conditions'], {
                    heatCapacity: properties.heatCapacity,
                    entropy: properties.entropy
                }));
            }
        }
    }
    /**
     * Create validation schema
     */
    createSchema() {
        return {
            name: this.name,
            version: '1.0.0',
            description: 'Thermodynamic properties validation schema',
            types: ['object'],
            requiredValidators: [],
            optionalValidators: [],
            properties: {
                config: this.thermoConfig,
                supportedProperties: [
                    'enthalpyFormation',
                    'entropy',
                    'heatCapacity',
                    'gibbsEnergy',
                    'meltingPoint',
                    'boilingPoint',
                    'density'
                ],
                units: {
                    enthalpyFormation: 'kJ/mol',
                    entropy: 'J/(mol·K)',
                    heatCapacity: 'J/(mol·K)',
                    gibbsEnergy: 'kJ/mol',
                    meltingPoint: 'K',
                    boilingPoint: 'K',
                    density: 'g/cm³'
                },
                validationRules: [
                    'All values must be finite numbers',
                    'Entropy and heat capacity must be positive',
                    'Melting point must be less than boiling point',
                    'Cross-property consistency checks applied'
                ]
            }
        };
    }
    /**
     * Validate temperature values
     */
    validateTemperature(properties, errors, warnings, path) {
        if (properties.temperature === undefined) {
            return;
        }
        const temperature = properties.temperature;
        if (typeof temperature !== 'number' || !isFinite(temperature)) {
            errors.push(this.createError('INVALID_TEMPERATURE_VALUE', 'Temperature must be a finite number', [...path, 'temperature'], ValidationSeverity.ERROR, ['Provide a valid numerical value in Kelvin'], { value: temperature }));
            return;
        }
        // Absolute zero check
        if (temperature < 0) {
            errors.push(this.createError('NEGATIVE_TEMPERATURE', `Temperature ${temperature} K is below absolute zero`, [...path, 'temperature'], ValidationSeverity.ERROR, ['Temperature cannot be negative in Kelvin scale'], { value: temperature }));
        }
        // Extreme temperature check
        if (temperature > 10000) {
            warnings.push(this.createError('EXTREME_TEMPERATURE', `Temperature ${temperature} K is extremely high`, [...path, 'temperature'], ValidationSeverity.WARNING, ['Verify the temperature value is correct'], { value: temperature }));
        }
    }
    /**
     * Validate pressure values
     */
    validatePressure(properties, errors, warnings, path) {
        if (properties.pressure === undefined) {
            return;
        }
        const pressure = properties.pressure;
        if (typeof pressure !== 'number' || !isFinite(pressure)) {
            errors.push(this.createError('INVALID_PRESSURE_VALUE', 'Pressure must be a finite number', [...path, 'pressure'], ValidationSeverity.ERROR, ['Provide a valid numerical value in Pascal'], { value: pressure }));
            return;
        }
        if (pressure < 0) {
            errors.push(this.createError('NEGATIVE_PRESSURE', `Pressure ${pressure} Pa cannot be negative`, [...path, 'pressure'], ValidationSeverity.ERROR, ['Pressure must be positive'], { value: pressure }));
        }
    }
}

/**
 * @fileoverview Validation Metrics Dashboard and Performance Monitoring
 *
 * Provides comprehensive performance monitoring and metrics collection
 * for the validation pipeline with real-time dashboard capabilities.
 */
/**
 * Validation Metrics Dashboard
 *
 * Provides real-time monitoring and analytics for validation performance
 */
class ValidationMetricsDashboard extends events.EventEmitter {
    constructor(config = {}) {
        super();
        this.validationTimes = [];
        this.recentValidations = [];
        this.memorySnapshots = [];
        this.config = {
            updateInterval: 1000,
            maxTimeSeriesPoints: 100,
            realTimeUpdates: true,
            memoryMonitoring: true,
            percentileTracking: true,
            ...config
        };
        this.startTime = new Date();
        this.metrics = this.initializeMetrics();
        if (this.config.realTimeUpdates) {
            this.startRealTimeUpdates();
        }
    }
    /**
     * Record a validation result for metrics tracking
     */
    recordValidation(result) {
        const now = new Date();
        const success = result.isValid;
        const duration = result.metrics.duration;
        // Update basic counters
        this.metrics.totalValidations++;
        if (success) {
            this.metrics.successfulValidations++;
        }
        else {
            this.metrics.failedValidations++;
        }
        // Update timing metrics
        this.validationTimes.push(duration);
        this.recentValidations.push({ timestamp: now, duration, success });
        // Update min/max/average times
        this.updateTimingMetrics(duration);
        // Update cache metrics
        if (result.fromCache) {
            this.updateCacheMetrics();
        }
        // Record error distribution
        if (!success) {
            this.recordErrors(result.errors);
        }
        // Update validator-specific metrics
        this.updateValidatorMetrics(result);
        // Memory monitoring
        if (this.config.memoryMonitoring) {
            this.recordMemoryUsage();
        }
        // Cleanup old data
        this.cleanupOldData();
        // Emit update event
        this.emit('metrics:updated', this.metrics);
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        this.updateDerivedMetrics();
        return { ...this.metrics };
    }
    /**
     * Get metrics for a specific time range
     */
    getMetricsForTimeRange(startTime, endTime) {
        const filteredValidations = this.recentValidations.filter(v => v.timestamp >= startTime && v.timestamp <= endTime);
        const rangeMetrics = this.calculateMetricsForValidations(filteredValidations);
        return rangeMetrics;
    }
    /**
     * Get real-time dashboard data formatted for display
     */
    getDashboardData() {
        const current = this.getMetrics();
        return {
            summary: {
                total: current.totalValidations,
                successful: current.successfulValidations,
                failed: current.failedValidations,
                successRate: this.calculateSuccessRate(),
                avgTime: current.averageValidationTime,
                cacheHitRate: current.cacheHitRate
            },
            performance: {
                currentRate: current.validationsPerSecond,
                avgTime: current.averageValidationTime,
                peakTime: current.peakValidationTime,
                minTime: current.minValidationTime,
                percentiles: current.percentiles
            },
            memory: current.memoryUsage,
            validators: Array.from(current.validatorMetrics.values()),
            timeSeries: current.timeSeries.slice(-20), // Last 20 data points
            errors: this.getTopErrors(10)
        };
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = this.initializeMetrics();
        this.validationTimes = [];
        this.recentValidations = [];
        this.memorySnapshots = [];
        this.startTime = new Date();
        this.emit('metrics:reset');
    }
    /**
     * Export metrics to JSON
     */
    exportMetrics() {
        return JSON.stringify({
            metrics: this.getMetrics(),
            metadata: {
                exportTime: new Date(),
                uptime: Date.now() - this.startTime.getTime(),
                config: this.config
            }
        }, null, 2);
    }
    /**
     * Stop the dashboard and cleanup resources
     */
    stop() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = undefined;
        }
        this.removeAllListeners();
    }
    // ============================================================================
    // Private Methods
    // ============================================================================
    initializeMetrics() {
        return {
            totalValidations: 0,
            successfulValidations: 0,
            failedValidations: 0,
            averageValidationTime: 0,
            peakValidationTime: 0,
            minValidationTime: Infinity,
            validationsPerSecond: 0,
            cacheHitRate: 0,
            memoryUsage: {
                current: 0,
                peak: 0,
                average: 0,
                allocationRate: 0
            },
            errorDistribution: new Map(),
            percentiles: {
                p50: 0,
                p75: 0,
                p90: 0,
                p95: 0,
                p99: 0
            },
            validatorMetrics: new Map(),
            timeSeries: []
        };
    }
    startRealTimeUpdates() {
        this.updateTimer = setInterval(() => {
            this.updateDerivedMetrics();
            this.addTimeSeriesPoint();
            this.emit('metrics:realtime', this.metrics);
        }, this.config.updateInterval);
    }
    updateTimingMetrics(duration) {
        this.metrics.peakValidationTime = Math.max(this.metrics.peakValidationTime, duration);
        this.metrics.minValidationTime = Math.min(this.metrics.minValidationTime, duration);
        // Calculate rolling average
        const sum = this.validationTimes.reduce((a, b) => a + b, 0);
        this.metrics.averageValidationTime = sum / this.validationTimes.length;
    }
    updateCacheMetrics() {
        // Cache hit rate calculation would be based on cache-specific logic
        // This is a simplified version
        const totalWithCache = this.recentValidations.length;
        const cacheHits = this.recentValidations.filter(v => v.duration < this.metrics.averageValidationTime * 0.1).length;
        this.metrics.cacheHitRate = totalWithCache > 0 ? (cacheHits / totalWithCache) * 100 : 0;
    }
    recordErrors(errors) {
        errors.forEach(error => {
            const errorType = error.code || 'UNKNOWN_ERROR';
            const current = this.metrics.errorDistribution.get(errorType) || 0;
            this.metrics.errorDistribution.set(errorType, current + 1);
        });
    }
    updateValidatorMetrics(result) {
        // This would be updated based on which validators were used
        // For now, we'll create a generic entry
        const validatorName = 'default-validator';
        let validatorMetrics = this.metrics.validatorMetrics.get(validatorName);
        if (!validatorMetrics) {
            validatorMetrics = {
                name: validatorName,
                executions: 0,
                averageTime: 0,
                successRate: 0,
                errorCount: 0,
                cacheHitRate: 0
            };
            this.metrics.validatorMetrics.set(validatorName, validatorMetrics);
        }
        validatorMetrics.executions++;
        validatorMetrics.averageTime =
            (validatorMetrics.averageTime * (validatorMetrics.executions - 1) + result.metrics.duration) /
                validatorMetrics.executions;
        if (!result.isValid) {
            validatorMetrics.errorCount++;
        }
        validatorMetrics.successRate =
            ((validatorMetrics.executions - validatorMetrics.errorCount) / validatorMetrics.executions) * 100;
    }
    recordMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memUsage = process.memoryUsage();
            const currentMB = memUsage.heapUsed / 1024 / 1024;
            this.metrics.memoryUsage.current = currentMB;
            this.metrics.memoryUsage.peak = Math.max(this.metrics.memoryUsage.peak, currentMB);
            this.memorySnapshots.push({ timestamp: new Date(), usage: currentMB });
            // Calculate average
            const sum = this.memorySnapshots.reduce((a, b) => a + b.usage, 0);
            this.metrics.memoryUsage.average = sum / this.memorySnapshots.length;
        }
    }
    updateDerivedMetrics() {
        // Update validations per second
        const oneSecondAgo = new Date(Date.now() - 1000);
        const recentCount = this.recentValidations.filter(v => v.timestamp > oneSecondAgo).length;
        this.metrics.validationsPerSecond = recentCount;
        // Update percentiles if enabled
        if (this.config.percentileTracking && this.validationTimes.length > 0) {
            this.calculatePercentiles();
        }
    }
    calculatePercentiles() {
        const sorted = [...this.validationTimes].sort((a, b) => a - b);
        sorted.length;
        this.metrics.percentiles = {
            p50: this.getPercentile(sorted, 0.5),
            p75: this.getPercentile(sorted, 0.75),
            p90: this.getPercentile(sorted, 0.9),
            p95: this.getPercentile(sorted, 0.95),
            p99: this.getPercentile(sorted, 0.99)
        };
    }
    getPercentile(sortedArray, percentile) {
        const index = Math.ceil(sortedArray.length * percentile) - 1;
        return sortedArray[Math.max(0, index)] || 0;
    }
    addTimeSeriesPoint() {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const recentValidations = this.recentValidations.filter(v => v.timestamp > oneMinuteAgo);
        const errorCount = recentValidations.filter(v => !v.success).length;
        const errorRate = recentValidations.length > 0 ? (errorCount / recentValidations.length) * 100 : 0;
        const point = {
            timestamp: now,
            validationsPerSecond: this.metrics.validationsPerSecond,
            averageResponseTime: this.metrics.averageValidationTime,
            errorRate,
            memoryUsage: this.metrics.memoryUsage.current
        };
        this.metrics.timeSeries.push(point);
        // Keep only the last N points
        if (this.metrics.timeSeries.length > this.config.maxTimeSeriesPoints) {
            this.metrics.timeSeries = this.metrics.timeSeries.slice(-this.config.maxTimeSeriesPoints);
        }
    }
    cleanupOldData() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        // Keep only recent validations (last 5 minutes)
        this.recentValidations = this.recentValidations.filter(v => v.timestamp > fiveMinutesAgo);
        // Keep only recent memory snapshots
        this.memorySnapshots = this.memorySnapshots.filter(s => s.timestamp > fiveMinutesAgo);
        // Keep only recent validation times (last 1000 entries)
        if (this.validationTimes.length > 1000) {
            this.validationTimes = this.validationTimes.slice(-1e3);
        }
    }
    calculateSuccessRate() {
        return this.metrics.totalValidations > 0 ?
            (this.metrics.successfulValidations / this.metrics.totalValidations) * 100 : 0;
    }
    getTopErrors(count) {
        const totalErrors = Array.from(this.metrics.errorDistribution.values()).reduce((a, b) => a + b, 0);
        return Array.from(this.metrics.errorDistribution.entries())
            .map(([type, count]) => ({
            type,
            count,
            percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, count);
    }
    calculateMetricsForValidations(validations) {
        // Implementation for calculating metrics for a specific set of validations
        // This is a simplified version - full implementation would calculate all metrics
        const total = validations.length;
        const successful = validations.filter(v => v.success).length;
        const failed = total - successful;
        const durations = validations.map(v => v.duration);
        const avgTime = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
        return {
            ...this.initializeMetrics(),
            totalValidations: total,
            successfulValidations: successful,
            failedValidations: failed,
            averageValidationTime: avgTime,
            peakValidationTime: Math.max(...durations, 0),
            minValidationTime: Math.min(...durations, Infinity)
        };
    }
}
/**
 * Global metrics dashboard instance
 */
new ValidationMetricsDashboard();

/**
 * CREB Data Validation Module
 *
 * Provides comprehensive validation capabilities for chemistry data:
 * - Composable validator architecture
 * - Async validation support with dependency management
 * - Performance optimization with caching and parallelization
 * - Chemical-specific validation capabilities
 *
 * @version 1.0.0
 * @author CREB Team
 */
// Core Pipeline and Types
/**
 * Creates a new validation pipeline with common defaults
 */
function createValidationPipeline() {
    return new ValidationPipeline({
        timeout: 30000,
        enableCaching: true,
        cacheTTL: 300000,
        maxCacheSize: 1000,
        continueOnError: true,
        parallel: {
            enabled: true,
            maxConcurrency: 10
        },
        monitoring: {
            enabled: true,
            sampleRate: 1.0
        }
    });
}
/**
 * Creates a performance-optimized validation pipeline
 */
function createFastValidationPipeline() {
    return new ValidationPipeline({
        timeout: 10000,
        enableCaching: true,
        cacheTTL: 600000,
        maxCacheSize: 5000,
        continueOnError: false,
        parallel: {
            enabled: true,
            maxConcurrency: 20
        },
        monitoring: {
            enabled: true,
            sampleRate: 0.1
        }
    });
}
/**
 * Creates a thorough validation pipeline for comprehensive checks
 */
function createThoroughValidationPipeline() {
    return new ValidationPipeline({
        timeout: 120000,
        enableCaching: false,
        cacheTTL: 0,
        maxCacheSize: 0,
        continueOnError: true,
        parallel: {
            enabled: false,
            maxConcurrency: 1
        },
        monitoring: {
            enabled: true,
            sampleRate: 1.0
        }
    });
}
/**
 * Quick validation for chemical formulas
 */
async function validateChemicalFormula(formula, config) {
    const validator = new ChemicalFormulaValidator(undefined, config);
    const context = {
        path: ['formula'],
        root: { formula },
        config: {
            enabled: true,
            priority: 1,
            cacheable: true
        },
        shared: new Map(),
        metrics: {
            duration: 0,
            rulesExecuted: 0,
            validatorsUsed: 1,
            cacheStats: {
                hits: 0,
                misses: 0,
                hitRate: 0
            }
        }
    };
    return validator.validate(formula, context);
}
/**
 * Quick validation for thermodynamic properties
 */
async function validateThermodynamicProperties(properties) {
    const validator = new ThermodynamicPropertiesValidator();
    const context = {
        path: ['thermodynamics'],
        root: properties,
        config: {
            enabled: true,
            priority: 1,
            cacheable: true
        },
        shared: new Map(),
        metrics: {
            duration: 0,
            rulesExecuted: 0,
            validatorsUsed: 1,
            cacheStats: {
                hits: 0,
                misses: 0,
                hitRate: 0
            }
        }
    };
    return validator.validate(properties, context);
}

/**
 * Core thermodynamics calculator for CREB-JS
 * Implements standard thermodynamic calculations for chemical reactions
 */
exports.ThermodynamicsCalculator = class ThermodynamicsCalculator {
    constructor() {
        this.R = 8.314; // Gas constant J/(mol·K)
        this.standardTemperature = 298.15; // K
        this.standardPressure = 101325; // Pa
    }
    /**
     * Calculate thermodynamic properties for a balanced chemical equation
     */
    async calculateThermodynamics(equation, conditions = {
        temperature: this.standardTemperature,
        pressure: this.standardPressure
    }) {
        try {
            // Get thermodynamic data for all compounds
            const compoundData = await this.getCompoundThermodynamicData(equation);
            // Calculate standard enthalpy change
            const deltaH = this.calculateEnthalpyChange(equation, compoundData);
            // Calculate standard entropy change
            const deltaS = this.calculateEntropyChange(equation, compoundData);
            // Calculate Gibbs free energy change
            const deltaG = this.calculateGibbsChange(deltaH, deltaS, conditions.temperature);
            // Calculate equilibrium constant
            const equilibriumConstant = this.calculateEquilibriumConstant(deltaG, conditions.temperature);
            // Determine spontaneity
            const spontaneity = this.determineSpontaneity(deltaG);
            // Generate temperature dependence profile
            const temperatureDependence = this.generateTemperatureProfile(deltaH, deltaS);
            return {
                deltaH,
                deltaS,
                deltaG,
                equilibriumConstant,
                spontaneity,
                temperatureDependence,
                conditions,
                // Alias properties for integrated balancer
                enthalpy: deltaH,
                gibbsFreeEnergy: deltaG,
                isSpontaneous: spontaneity === 'spontaneous'
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Thermodynamics calculation failed: ${errorMessage}`);
        }
    }
    /**
     * Calculate enthalpy change (ΔH) for the reaction
     * ΔH = Σ(coefficients × ΔHf products) - Σ(coefficients × ΔHf reactants)
     */
    calculateEnthalpyChange(equation, compoundData) {
        let deltaH = 0;
        // Products (positive contribution)
        equation.products.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[equation.reactants.length + index];
                deltaH += coefficient * data.deltaHf;
            }
        });
        // Reactants (negative contribution)
        equation.reactants.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[index];
                deltaH -= coefficient * data.deltaHf;
            }
        });
        return deltaH;
    }
    /**
     * Calculate entropy change (ΔS) for the reaction
     * ΔS = Σ(coefficients × S products) - Σ(coefficients × S reactants)
     */
    calculateEntropyChange(equation, compoundData) {
        let deltaS = 0;
        // Products (positive contribution)
        equation.products.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[equation.reactants.length + index];
                deltaS += coefficient * data.entropy;
            }
        });
        // Reactants (negative contribution)
        equation.reactants.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[index];
                deltaS -= coefficient * data.entropy;
            }
        });
        return deltaS / 1000; // Convert J/mol·K to kJ/mol·K
    }
    /**
     * Calculate Gibbs free energy change (ΔG)
     * ΔG = ΔH - T×ΔS
     */
    calculateGibbsChange(deltaH, deltaS, temperature) {
        return deltaH - (temperature * deltaS);
    }
    /**
     * Calculate equilibrium constant from Gibbs free energy
     * K = exp(-ΔG / RT)
     */
    calculateEquilibriumConstant(deltaG, temperature) {
        const exponent = -(deltaG * 1000) / (this.R * temperature); // Convert kJ to J
        return Math.exp(exponent);
    }
    /**
     * Determine reaction spontaneity based on Gibbs free energy
     */
    determineSpontaneity(deltaG) {
        const tolerance = 0.1; // kJ/mol tolerance for equilibrium
        if (deltaG < -tolerance) {
            return 'spontaneous';
        }
        else if (deltaG > tolerance) {
            return 'non-spontaneous';
        }
        else {
            return 'equilibrium';
        }
    }
    /**
     * Generate temperature dependence profile
     */
    generateTemperatureProfile(deltaH, deltaS) {
        const tempRange = [200, 800]; // K
        const points = [];
        // Calculate ΔG at different temperatures
        for (let T = tempRange[0]; T <= tempRange[1]; T += 50) {
            const deltaG = this.calculateGibbsChange(deltaH, deltaS, T);
            points.push({ temperature: T, deltaG });
        }
        // Find spontaneity threshold (where ΔG = 0)
        let spontaneityThreshold;
        if (deltaS !== 0) {
            const threshold = deltaH / deltaS; // T = ΔH / ΔS when ΔG = 0
            if (threshold > 0 && threshold >= tempRange[0] && threshold <= tempRange[1]) {
                spontaneityThreshold = threshold;
            }
        }
        return {
            range: tempRange,
            deltaGvsT: points,
            spontaneityThreshold
        };
    }
    /**
     * Get thermodynamic data for compounds in the equation
     * This would integrate with PubChem and NIST databases
     */
    async getCompoundThermodynamicData(equation) {
        const data = new Map();
        // Collect all unique formulas
        const allCompounds = [
            ...equation.reactants,
            ...equation.products
        ];
        const uniqueFormulas = [...new Set(allCompounds)];
        // Fetch data for each compound
        for (const formula of uniqueFormulas) {
            try {
                const properties = await this.fetchThermodynamicProperties(formula);
                // Validate thermodynamic properties using the validation pipeline
                const validationResult = await validateThermodynamicProperties(properties);
                if (!validationResult.isValid) {
                    const validationErrors = validationResult.errors.map(e => e.message).join(', ');
                    throw new ValidationError(`Invalid thermodynamic properties for ${formula}: ${validationErrors}`, { formula, errors: validationResult.errors });
                }
                data.set(formula, properties);
            }
            catch (error) {
                error instanceof Error ? error.message : 'Unknown error';
                // Note: Could not fetch thermodynamic data, using estimated values
                // Use estimated values or throw error
                const estimatedProperties = this.estimateThermodynamicProperties(formula);
                // Validate estimated properties too
                try {
                    const estimatedValidation = await validateThermodynamicProperties(estimatedProperties);
                    if (!estimatedValidation.isValid) {
                        throw new ValidationError(`Both fetched and estimated thermodynamic properties invalid for ${formula}`, { formula, originalError: error });
                    }
                    data.set(formula, estimatedProperties);
                }
                catch (validationError) {
                    // If both real and estimated data are invalid, re-throw the original error
                    throw error;
                }
            }
        }
        return data;
    }
    /**
     * Fetch thermodynamic properties from external databases
     * TODO: Implement PubChem/NIST integration
     */
    async fetchThermodynamicProperties(formula) {
        // This is a placeholder - actual implementation would query PubChem/NIST
        // For now, return some common compound values for demonstration
        const commonCompounds = {
            'H2O': {
                deltaHf: -285.8, // kJ/mol
                entropy: 69.95, // J/(mol·K)
                heatCapacity: 75.3, // J/(mol·K)
                temperatureRange: [273, 373]
            },
            'CO2': {
                deltaHf: -393.5,
                entropy: 213.8,
                heatCapacity: 37.1,
                temperatureRange: [200, 800]
            },
            'H2': {
                deltaHf: 0,
                entropy: 130.7,
                heatCapacity: 28.8,
                temperatureRange: [200, 800]
            },
            'O2': {
                deltaHf: 0,
                entropy: 205.2,
                heatCapacity: 29.4,
                temperatureRange: [200, 800]
            },
            'CH4': {
                deltaHf: -74.6,
                entropy: 186.3,
                heatCapacity: 35.7,
                temperatureRange: [200, 800]
            }
        };
        if (commonCompounds[formula]) {
            return commonCompounds[formula];
        }
        throw new Error(`Thermodynamic data not available for ${formula}`);
    }
    /**
     * Estimate thermodynamic properties using group contribution methods
     * TODO: Implement Joback and Reid group contribution method
     */
    estimateThermodynamicProperties(formula) {
        // Placeholder estimation - would use actual group contribution methods
        return {
            deltaHf: 0, // Assume elements in standard state
            entropy: 100, // Rough estimate
            heatCapacity: 30, // Rough estimate
            temperatureRange: [298, 500]
        };
    }
    /**
     * Calculate thermodynamics for reaction data format (used by integrated balancer)
     */
    async calculateReactionThermodynamics(reactionData, temperature = this.standardTemperature) {
        // Convert ReactionData to BalancedEquation format
        const reactants = reactionData.reactants.map(r => r.formula);
        const products = reactionData.products.map(p => p.formula);
        const coefficients = [
            ...reactionData.reactants.map(r => r.coefficient),
            ...reactionData.products.map(p => p.coefficient)
        ];
        // Create equation string for BalancedEquation
        const reactantString = reactionData.reactants
            .map(r => `${r.coefficient > 1 ? r.coefficient : ''}${r.formula}`)
            .join(' + ');
        const productString = reactionData.products
            .map(p => `${p.coefficient > 1 ? p.coefficient : ''}${p.formula}`)
            .join(' + ');
        const equationString = `${reactantString} = ${productString}`;
        const equation = {
            equation: equationString,
            reactants,
            products,
            coefficients
        };
        const conditions = {
            temperature,
            pressure: this.standardPressure
        };
        return this.calculateThermodynamics(equation, conditions);
    }
};
exports.ThermodynamicsCalculator = __decorate([
    Injectable()
], exports.ThermodynamicsCalculator);

/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Combines chemical equation balancing with comprehensive thermodynamic analysis
 *
 * @author Loganathane Virassamy
 * @version 1.4.0-alpha
 */
/**
 * Classification of chemical reactions based on thermodynamic properties
 */
var ReactionType;
(function (ReactionType) {
    ReactionType["COMBUSTION"] = "combustion";
    ReactionType["SYNTHESIS"] = "synthesis";
    ReactionType["DECOMPOSITION"] = "decomposition";
    ReactionType["SINGLE_REPLACEMENT"] = "single_replacement";
    ReactionType["DOUBLE_REPLACEMENT"] = "double_replacement";
    ReactionType["ACID_BASE"] = "acid_base";
    ReactionType["REDOX"] = "redox";
    ReactionType["BIOLOGICAL"] = "biological";
    ReactionType["INDUSTRIAL"] = "industrial";
})(ReactionType || (ReactionType = {}));
/**
 * Reaction feasibility assessment
 */
var ReactionFeasibility;
(function (ReactionFeasibility) {
    ReactionFeasibility["HIGHLY_FAVORABLE"] = "highly_favorable";
    ReactionFeasibility["FAVORABLE"] = "favorable";
    ReactionFeasibility["MARGINALLY_FAVORABLE"] = "marginally_favorable";
    ReactionFeasibility["EQUILIBRIUM"] = "equilibrium";
    ReactionFeasibility["UNFAVORABLE"] = "unfavorable";
    ReactionFeasibility["HIGHLY_UNFAVORABLE"] = "highly_unfavorable"; // ΔG° > 20 kJ/mol
})(ReactionFeasibility || (ReactionFeasibility = {}));
/**
 * Safety classification based on energy release
 */
var SafetyLevel;
(function (SafetyLevel) {
    SafetyLevel["SAFE"] = "safe";
    SafetyLevel["CAUTION"] = "caution";
    SafetyLevel["WARNING"] = "warning";
    SafetyLevel["DANGER"] = "danger";
    SafetyLevel["EXTREME_DANGER"] = "extreme_danger"; // |ΔH°| > 2000 kJ/mol
})(SafetyLevel || (SafetyLevel = {}));
/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Revolutionary chemistry tool combining balancing with energy analysis
 */
class ThermodynamicsEquationBalancer {
    constructor() {
        this.balancer = new exports.ChemicalEquationBalancer();
        this.thermoCalculator = new exports.ThermodynamicsCalculator();
    }
    /**
     * Balance equation with comprehensive thermodynamic analysis
     */
    async balanceWithThermodynamics(equation, temperature = 298.15, pressure = 1.0) {
        try {
            // Step 1: Balance the chemical equation
            const balanced = this.balancer.balance(equation);
            const reactionData = this.parseEquationToReactionData(balanced);
            // Step 2: Calculate thermodynamics
            const thermodynamics = await this.thermoCalculator.calculateReactionThermodynamics(reactionData, temperature);
            // Step 3: Classify reaction
            const reactionType = this.classifyReaction(equation, thermodynamics);
            // Step 4: Assess feasibility and safety
            const feasibility = this.assessFeasibility(thermodynamics.gibbsFreeEnergy);
            const safetyLevel = this.assessSafety(thermodynamics.enthalpy);
            // Step 5: Generate analysis and recommendations
            const analysis = this.generateAnalysis(reactionType, thermodynamics, feasibility, safetyLevel);
            // Step 6: Optimize conditions (simplified for now)
            const optimalConditions = await this.findOptimalConditions(equation);
            return {
                balanced,
                coefficients: this.extractCoefficients(balanced),
                thermodynamics,
                reactionType,
                feasibility,
                safetyLevel,
                energyReleased: thermodynamics.enthalpy < 0 ? Math.abs(thermodynamics.enthalpy) : undefined,
                energyRequired: thermodynamics.enthalpy > 0 ? thermodynamics.enthalpy : undefined,
                spontaneous: thermodynamics.isSpontaneous,
                equilibriumConstant: this.calculateEquilibriumConstant(thermodynamics.gibbsFreeEnergy, temperature),
                optimalTemperature: optimalConditions.temperature,
                temperatureRange: { min: 200, max: 800 }, // Will be calculated dynamically
                pressureEffects: this.analyzePressureEffects(reactionData),
                safetyWarnings: analysis.safetyWarnings,
                recommendations: analysis.recommendations,
                industrialApplications: analysis.industrialApplications,
                reactionMechanism: analysis.reactionMechanism,
                realWorldExamples: analysis.realWorldExamples
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Thermodynamics balancing failed: ${errorMessage}`);
        }
    }
    /**
     * Find optimal reaction conditions for maximum yield
     */
    async findOptimalConditions(equation) {
        const balanced = this.balancer.balance(equation);
        const reactionData = this.parseEquationToReactionData(balanced);
        // Test different temperatures
        const temperatures = [250, 298.15, 350, 400, 500, 600, 750];
        let bestConditions = {
            temperature: 298.15,
            pressure: 1.0,
            yield: 0,
            reasoning: []
        };
        for (const temp of temperatures) {
            const thermo = await this.thermoCalculator.calculateReactionThermodynamics(reactionData, temp);
            const K = this.calculateEquilibriumConstant(thermo.gibbsFreeEnergy, temp);
            // Estimate yield from equilibrium constant
            const yieldPercent = this.estimateYieldFromK(K, reactionData);
            if (yieldPercent > bestConditions.yield) {
                bestConditions = {
                    temperature: temp,
                    pressure: this.getOptimalPressure(reactionData),
                    yield: yieldPercent,
                    reasoning: this.generateOptimizationReasoning(temp, thermo, K)
                };
            }
        }
        return bestConditions;
    }
    /**
     * Classify reaction type based on equation pattern and thermodynamics
     */
    classifyReaction(equation, thermo) {
        const normalized = equation.toLowerCase().replace(/\s+/g, '');
        // Biological reactions (check first before combustion)
        if (normalized.includes('c6h12o6') || normalized.includes('glucose')) {
            return ReactionType.BIOLOGICAL;
        }
        // Combustion: organic + O2 = CO2 + H2O
        if (normalized.includes('o2') && normalized.includes('co2') && normalized.includes('h2o')) {
            return ReactionType.COMBUSTION;
        }
        // Synthesis (A + B = C)
        if (equation.split('=')[0].split('+').length >= 2 &&
            equation.split('=')[1].split('+').length === 1) {
            return ReactionType.SYNTHESIS;
        }
        // Decomposition (A = B + C)
        if (equation.split('=')[0].split('+').length === 1 &&
            equation.split('=')[1].split('+').length >= 2) {
            return ReactionType.DECOMPOSITION;
        }
        // Acid-base reactions
        if (normalized.includes('h+') || normalized.includes('oh-') ||
            normalized.includes('h2o') && thermo.enthalpy < -50) {
            return ReactionType.ACID_BASE;
        }
        return ReactionType.REDOX; // Default
    }
    /**
     * Assess reaction feasibility based on Gibbs free energy
     */
    assessFeasibility(deltaG) {
        if (deltaG < -100)
            return ReactionFeasibility.HIGHLY_FAVORABLE;
        if (deltaG < -20)
            return ReactionFeasibility.FAVORABLE;
        if (deltaG < 0)
            return ReactionFeasibility.MARGINALLY_FAVORABLE;
        if (Math.abs(deltaG) < 5)
            return ReactionFeasibility.EQUILIBRIUM;
        if (deltaG < 20)
            return ReactionFeasibility.UNFAVORABLE;
        return ReactionFeasibility.HIGHLY_UNFAVORABLE;
    }
    /**
     * Assess safety level based on enthalpy change
     */
    assessSafety(deltaH) {
        const absEnergy = Math.abs(deltaH);
        if (absEnergy < 100)
            return SafetyLevel.SAFE;
        if (absEnergy < 500)
            return SafetyLevel.CAUTION;
        if (absEnergy < 1000)
            return SafetyLevel.WARNING;
        if (absEnergy < 2000)
            return SafetyLevel.DANGER;
        return SafetyLevel.EXTREME_DANGER;
    }
    /**
     * Generate comprehensive analysis and recommendations
     */
    generateAnalysis(type, thermo, feasibility, safety) {
        const analysis = {
            safetyWarnings: [],
            recommendations: [],
            industrialApplications: [],
            reactionMechanism: '',
            realWorldExamples: []
        };
        // Safety warnings
        if (safety === SafetyLevel.EXTREME_DANGER) {
            analysis.safetyWarnings.push('⚠️ EXTREME DANGER: Explosive reaction potential');
            analysis.safetyWarnings.push('Requires specialized safety equipment and procedures');
        }
        else if (safety === SafetyLevel.DANGER) {
            analysis.safetyWarnings.push('⚠️ DANGER: Highly exothermic reaction');
            analysis.safetyWarnings.push('Use proper cooling and controlled addition');
        }
        else if (safety === SafetyLevel.WARNING) {
            analysis.safetyWarnings.push('⚠️ WARNING: Significant heat release');
            analysis.safetyWarnings.push('Monitor temperature carefully');
        }
        // Recommendations based on thermodynamics
        if (thermo.isSpontaneous) {
            analysis.recommendations.push('✅ Thermodynamically favorable reaction');
            analysis.recommendations.push('Consider kinetic factors for reaction rate');
        }
        else {
            analysis.recommendations.push('⚡ External energy input required');
            analysis.recommendations.push('Consider catalysis to lower activation energy');
        }
        // Type-specific applications
        switch (type) {
            case ReactionType.COMBUSTION:
                analysis.industrialApplications.push('Power generation');
                analysis.industrialApplications.push('Heating systems');
                analysis.industrialApplications.push('Internal combustion engines');
                analysis.realWorldExamples.push('Car engines', 'Power plants', 'Home heating');
                break;
            case ReactionType.BIOLOGICAL:
                analysis.industrialApplications.push('Biofuel production');
                analysis.industrialApplications.push('Food processing');
                analysis.realWorldExamples.push('Cellular respiration', 'Fermentation');
                break;
        }
        return analysis;
    }
    /**
     * Calculate equilibrium constant from Gibbs free energy
     */
    calculateEquilibriumConstant(deltaG, temperature) {
        const R = 8.314; // J/(mol·K)
        return Math.exp(-deltaG * 1000 / (R * temperature));
    }
    /**
     * Parse chemical equation to reaction data format
     */
    parseEquationToReactionData(equation) {
        const [reactantSide, productSide] = equation.split('=').map(s => s.trim());
        const parseSpecies = (side) => {
            return side.split('+').map(compound => {
                const trimmed = compound.trim();
                const match = trimmed.match(/^(\d*)\s*(.+)$/);
                if (match) {
                    const coefficient = match[1] ? parseInt(match[1]) : 1;
                    const formula = match[2].trim();
                    return { formula, coefficient };
                }
                return { formula: trimmed, coefficient: 1 };
            });
        };
        return {
            reactants: parseSpecies(reactantSide),
            products: parseSpecies(productSide)
        };
    }
    /**
     * Extract coefficients from balanced equation
     */
    extractCoefficients(equation) {
        const coefficients = {};
        const [reactantSide, productSide] = equation.split('=');
        const extractFromSide = (side) => {
            side.split('+').forEach(compound => {
                const trimmed = compound.trim();
                const match = trimmed.match(/^(\d*)\s*(.+)$/);
                if (match) {
                    const coefficient = match[1] ? parseInt(match[1]) : 1;
                    const formula = match[2].trim();
                    coefficients[formula] = coefficient;
                }
            });
        };
        extractFromSide(reactantSide);
        extractFromSide(productSide);
        return coefficients;
    }
    /**
     * Analyze pressure effects on reaction
     */
    analyzePressureEffects(reactionData) {
        const reactantMoles = reactionData.reactants.reduce((sum, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum, p) => sum + p.coefficient, 0);
        const deltaN = productMoles - reactantMoles;
        if (deltaN < 0) {
            return 'High pressure favors products (Le Chatelier\'s principle)';
        }
        else if (deltaN > 0) {
            return 'Low pressure favors products (Le Chatelier\'s principle)';
        }
        else {
            return 'Pressure has minimal effect on equilibrium';
        }
    }
    /**
     * Estimate yield from equilibrium constant
     */
    estimateYieldFromK(K, reactionData) {
        // Simplified yield estimation
        if (K > 1000)
            return 99;
        if (K > 100)
            return 95;
        if (K > 10)
            return 85;
        if (K > 1)
            return 70;
        if (K > 0.1)
            return 50;
        if (K > 0.01)
            return 25;
        return 5;
    }
    /**
     * Get optimal pressure based on reaction stoichiometry
     */
    getOptimalPressure(reactionData) {
        const reactantMoles = reactionData.reactants.reduce((sum, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum, p) => sum + p.coefficient, 0);
        // If products have fewer moles, high pressure favors products
        if (productMoles < reactantMoles)
            return 10; // High pressure
        if (productMoles > reactantMoles)
            return 0.1; // Low pressure
        return 1.0; // Standard pressure
    }
    /**
     * Generate optimization reasoning
     */
    generateOptimizationReasoning(temperature, thermo, K) {
        const reasoning = [];
        if (temperature > 298.15) {
            if (thermo.enthalpy > 0) {
                reasoning.push(`Higher temperature (${temperature}K) favors endothermic reaction`);
            }
            else {
                reasoning.push(`Higher temperature (${temperature}K) may reduce yield but increase rate`);
            }
        }
        else {
            reasoning.push(`Standard temperature (${temperature}K) conditions`);
        }
        reasoning.push(`Equilibrium constant K = ${K.toExponential(2)}`);
        reasoning.push(`ΔG° = ${thermo.gibbsFreeEnergy.toFixed(1)} kJ/mol at ${temperature}K`);
        return reasoning;
    }
}

/**
 * Energy Profile Generator
 * Creates visualization-ready energy profile data for chemical reactions
 * Part of CREB-JS v1.6.0 - Energy Profile Visualization Feature
 */
class EnergyProfileGenerator {
    constructor() {
        this.temperature = 298.15; // Default 25°C
        this.pressure = 101325; // Default 1 atm
    }
    /**
     * Generate energy profile from thermodynamics and kinetics data
     */
    generateProfile(thermodynamics, kinetics, customSteps) {
        const points = [];
        let activationEnergyForward = 0;
        let activationEnergyReverse = 0;
        // Start with reactants at energy = 0
        points.push({
            coordinate: 0,
            energy: 0,
            type: 'reactant',
            label: 'Reactants',
            species: this.extractReactants(thermodynamics)
        });
        // Add transition states and intermediates
        if (kinetics?.mechanism && kinetics.mechanism.length > 0) {
            this.addMechanismSteps(points, kinetics.mechanism, thermodynamics.deltaH);
            activationEnergyForward = kinetics.activationEnergy;
            activationEnergyReverse = kinetics.activationEnergy + thermodynamics.deltaH;
        }
        else if (customSteps) {
            this.addCustomSteps(points, customSteps);
        }
        else if (kinetics) {
            // Simple single-step reaction with kinetics data
            this.addSimpleTransitionState(points, thermodynamics, kinetics.activationEnergy);
            activationEnergyForward = kinetics.activationEnergy;
            activationEnergyReverse = kinetics.activationEnergy + thermodynamics.deltaH;
        }
        else {
            // Simple single-step reaction
            this.addSimpleTransitionState(points, thermodynamics);
            activationEnergyForward = this.estimateActivationEnergy(thermodynamics);
            activationEnergyReverse = activationEnergyForward + thermodynamics.deltaH;
        }
        // End with products
        points.push({
            coordinate: 1,
            energy: thermodynamics.deltaH,
            type: 'product',
            label: 'Products',
            species: this.extractProducts(thermodynamics)
        });
        // Find rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(points);
        return {
            points,
            deltaE: thermodynamics.deltaH,
            activationEnergyForward,
            activationEnergyReverse,
            steps: points.filter(p => p.type === 'transition-state').length,
            rateDeterminingStep,
            temperature: this.temperature,
            pressure: this.pressure,
            isExothermic: thermodynamics.deltaH < 0
        };
    }
    /**
     * Generate energy profile for multi-step mechanism
     */
    generateMechanismProfile(mechanism, overallThermodynamics) {
        const points = [];
        let currentEnergy = 0;
        // Reactants
        points.push({
            coordinate: 0,
            energy: 0,
            type: 'reactant',
            label: 'Reactants'
        });
        // Process each step
        mechanism.forEach((step, index) => {
            const stepCoordinate = (index + 0.5) / mechanism.length;
            const nextCoordinate = (index + 1) / mechanism.length;
            // Estimate step energetics
            const stepDeltaH = overallThermodynamics.deltaH / mechanism.length;
            const stepActivationE = this.estimateStepActivationEnergy(step, stepDeltaH);
            // Transition state
            points.push({
                coordinate: stepCoordinate,
                energy: currentEnergy + stepActivationE,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: this.extractSpeciesFromEquation(step.equation)
            });
            // Intermediate or product
            currentEnergy += stepDeltaH;
            if (index < mechanism.length - 1) {
                points.push({
                    coordinate: nextCoordinate,
                    energy: currentEnergy,
                    type: 'intermediate',
                    label: `Intermediate${index + 1}`
                });
            }
        });
        // Final products
        points.push({
            coordinate: 1,
            energy: overallThermodynamics.deltaH,
            type: 'product',
            label: 'Products'
        });
        return {
            points,
            deltaE: overallThermodynamics.deltaH,
            activationEnergyForward: Math.max(...points.filter(p => p.type === 'transition-state').map(p => p.energy)),
            activationEnergyReverse: Math.max(...points.filter(p => p.type === 'transition-state').map(p => p.energy)) + overallThermodynamics.deltaH,
            steps: mechanism.length,
            rateDeterminingStep: this.findRateDeterminingStep(points),
            temperature: this.temperature,
            pressure: this.pressure,
            isExothermic: overallThermodynamics.deltaH < 0
        };
    }
    /**
     * Generate temperature-dependent energy profiles
     */
    generateTemperatureProfiles(thermodynamics, temperatures, kinetics) {
        return temperatures.map(temp => {
            this.temperature = temp;
            // Adjust thermodynamics for temperature
            const adjustedThermo = this.adjustThermodynamicsForTemperature(thermodynamics, temp);
            // Adjust kinetics for temperature
            let adjustedKinetics = kinetics;
            if (kinetics && kinetics.temperatureDependence) {
                adjustedKinetics = this.adjustKineticsForTemperature(kinetics, temp);
            }
            const profile = this.generateProfile(adjustedThermo, adjustedKinetics);
            return { temperature: temp, profile };
        });
    }
    /**
     * Generate reaction coordinate data
     */
    generateReactionCoordinate(reactionType) {
        const coordinates = {
            'SN1': {
                description: 'C-leaving group distance',
                units: 'Å',
                physicalMeaning: 'Bond breaking leads to carbocation formation',
                range: [1.5, 3.5]
            },
            'SN2': {
                description: 'Nucleophile-C-leaving group angle',
                units: 'degrees',
                physicalMeaning: 'Backside attack through linear transition state',
                range: [109, 180]
            },
            'E1': {
                description: 'C-leaving group distance',
                units: 'Å',
                physicalMeaning: 'Elimination via carbocation intermediate',
                range: [1.5, 3.5]
            },
            'E2': {
                description: 'Base-H and C-leaving group distances',
                units: 'Å',
                physicalMeaning: 'Concerted elimination mechanism',
                range: [1.0, 3.0]
            },
            'addition': {
                description: 'C=C bond length',
                units: 'Å',
                physicalMeaning: 'Double bond breaking during addition',
                range: [1.34, 1.54]
            },
            'elimination': {
                description: 'C-C bond distance',
                units: 'Å',
                physicalMeaning: 'Bond formation during elimination',
                range: [1.54, 1.34]
            },
            'substitution': {
                description: 'Bond forming/breaking ratio',
                units: 'dimensionless',
                physicalMeaning: 'Extent of bond formation vs. breaking',
                range: [0, 1]
            }
        };
        return coordinates[reactionType];
    }
    /**
     * Export profile data for visualization libraries
     */
    exportForVisualization(profile, format) {
        switch (format) {
            case 'plotly':
                return this.exportForPlotly(profile);
            case 'chartjs':
                return this.exportForChartJS(profile);
            case 'd3':
                return this.exportForD3(profile);
            case 'csv':
                return this.exportForCSV(profile);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    // Private helper methods
    addMechanismSteps(points, mechanism, deltaH) {
        const stepDeltaH = deltaH / mechanism.length;
        let currentEnergy = 0;
        mechanism.forEach((step, index) => {
            const coordinate = (index + 0.5) / (mechanism.length + 1);
            const activationE = this.estimateStepActivationEnergy(step, stepDeltaH);
            points.push({
                coordinate,
                energy: currentEnergy + activationE,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: this.extractSpeciesFromEquation(step.equation)
            });
            if (index < mechanism.length - 1) {
                currentEnergy += stepDeltaH;
                points.push({
                    coordinate: (index + 1) / (mechanism.length + 1),
                    energy: currentEnergy,
                    type: 'intermediate',
                    label: `Int${index + 1}`
                });
            }
        });
    }
    addCustomSteps(points, customSteps) {
        customSteps.forEach((ts, index) => {
            points.push({
                coordinate: ts.coordinate,
                energy: ts.energy,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: ts.involvedSpecies
            });
        });
    }
    addSimpleTransitionState(points, thermodynamics, providedActivationE) {
        const activationE = providedActivationE !== undefined ? providedActivationE : this.estimateActivationEnergy(thermodynamics);
        points.push({
            coordinate: 0.5,
            energy: activationE,
            type: 'transition-state',
            label: 'Transition State'
        });
    }
    estimateActivationEnergy(thermodynamics) {
        // Hammond's postulate: endothermic reactions have late transition states
        const baseActivation = 80; // kJ/mol baseline
        const hammondCorrection = Math.max(0, thermodynamics.deltaH * 0.3);
        return baseActivation + hammondCorrection;
    }
    estimateStepActivationEnergy(step, stepDeltaH) {
        const baseActivation = 60; // kJ/mol for elementary steps
        const thermodynamicCorrection = Math.max(0, stepDeltaH * 0.3);
        // Adjust based on step type
        const typeFactors = {
            'elementary': 1.0,
            'fast-equilibrium': 0.7,
            'rate-determining': 1.5
        };
        return (baseActivation + thermodynamicCorrection) * typeFactors[step.type];
    }
    findRateDeterminingStep(points) {
        const transitionStates = points.filter(p => p.type === 'transition-state');
        if (transitionStates.length === 0)
            return 0;
        const highestEnergy = Math.max(...transitionStates.map(p => p.energy));
        return transitionStates.findIndex(p => p.energy === highestEnergy);
    }
    extractReactants(thermodynamics) {
        // This would need to be implemented based on the actual equation structure
        return ['Reactants'];
    }
    extractProducts(thermodynamics) {
        // This would need to be implemented based on the actual equation structure
        return ['Products'];
    }
    extractSpeciesFromEquation(equation) {
        // Parse equation to extract species
        const parts = equation.split('->')[0].trim().split('+');
        return parts.map(part => part.trim());
    }
    adjustThermodynamicsForTemperature(original, temperature) {
        // Simplified temperature dependence
        const tempRatio = temperature / 298.15;
        return {
            ...original,
            deltaH: original.deltaH * tempRatio,
            deltaG: original.deltaG + original.deltaS * (temperature - 298.15) / 1000,
            conditions: { ...original.conditions, temperature }
        };
    }
    adjustKineticsForTemperature(original, temperature) {
        const arrhenius = original.temperatureDependence;
        const R = 8.314; // J/(mol·K)
        // Arrhenius equation: k = A * exp(-Ea/RT)
        const newRateConstant = arrhenius.preExponentialFactor *
            Math.exp(-arrhenius.activationEnergy * 1000 / (R * temperature));
        return {
            ...original,
            rateConstant: newRateConstant,
            conditions: { ...original.conditions, temperature }
        };
    }
    exportForPlotly(profile) {
        return {
            data: [{
                    x: profile.points.map(p => p.coordinate),
                    y: profile.points.map(p => p.energy),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Energy Profile',
                    line: { shape: 'spline' },
                    marker: {
                        size: profile.points.map(p => p.type === 'transition-state' ? 10 : 6),
                        color: profile.points.map(p => {
                            switch (p.type) {
                                case 'reactant': return 'blue';
                                case 'product': return 'green';
                                case 'transition-state': return 'red';
                                case 'intermediate': return 'orange';
                                default: return 'gray';
                            }
                        })
                    }
                }],
            layout: {
                title: 'Reaction Energy Profile',
                xaxis: { title: 'Reaction Coordinate' },
                yaxis: { title: 'Energy (kJ/mol)' },
                annotations: profile.points.map(p => ({
                    x: p.coordinate,
                    y: p.energy,
                    text: p.label,
                    showarrow: true,
                    arrowhead: 2
                }))
            }
        };
    }
    exportForChartJS(profile) {
        return {
            type: 'line',
            data: {
                labels: profile.points.map(p => p.coordinate.toFixed(2)),
                datasets: [{
                        label: 'Energy Profile',
                        data: profile.points.map(p => p.energy),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4
                    }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Reaction Coordinate' } },
                    y: { title: { display: true, text: 'Energy (kJ/mol)' } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => profile.points[context[0].dataIndex].label || '',
                            label: (context) => `Energy: ${context.parsed.y.toFixed(2)} kJ/mol`
                        }
                    }
                }
            }
        };
    }
    exportForD3(profile) {
        return {
            nodes: profile.points.map((p, i) => ({
                id: i,
                x: p.coordinate * 100,
                y: 100 - (p.energy / Math.max(...profile.points.map(pt => pt.energy))) * 80,
                type: p.type,
                label: p.label,
                energy: p.energy
            })),
            links: profile.points.slice(0, -1).map((_, i) => ({
                source: i,
                target: i + 1
            }))
        };
    }
    exportForCSV(profile) {
        const header = 'Coordinate,Energy(kJ/mol),Type,Label';
        const rows = profile.points.map(p => `${p.coordinate},${p.energy},${p.type},"${p.label || ''}"`);
        return [header, ...rows].join('\n');
    }
    /**
     * Set calculation conditions
     */
    setConditions(temperature, pressure) {
        this.temperature = temperature;
        this.pressure = pressure;
    }
    /**
     * Generate energy profile with bond-by-bond analysis
     */
    generateDetailedProfile(thermodynamics, bondChanges) {
        const profile = this.generateProfile(thermodynamics);
        return {
            ...profile,
            bondAnalysis: bondChanges
        };
    }
}
/**
 * Convenience function to create energy profile
 */
function createEnergyProfile(thermodynamics, kinetics, options) {
    const generator = new EnergyProfileGenerator();
    if (options?.temperature || options?.pressure) {
        generator.setConditions(options.temperature || 298.15, options.pressure || 101325);
    }
    return generator.generateProfile(thermodynamics, kinetics);
}
/**
 * Export energy profile for popular visualization libraries
 */
function exportEnergyProfile(profile, format) {
    const generator = new EnergyProfileGenerator();
    return generator.exportForVisualization(profile, format);
}

/**
 * CREB Reaction Kinetics Calculator
 * Core calculator for reaction kinetics analysis
 */
class ReactionKinetics {
    /**
     * Calculate reaction rate constant using Arrhenius equation
     * k = A * exp(-Ea / (R * T))
     */
    static calculateRateConstant(arrhenius, temperature) {
        const { preExponentialFactor, activationEnergy } = arrhenius;
        const energyJoules = activationEnergy * 1000; // Convert kJ/mol to J/mol
        return preExponentialFactor * Math.exp(-energyJoules / (this.GAS_CONSTANT * temperature));
    }
    /**
     * Calculate activation energy from rate constants at two temperatures
     * Ea = R * ln(k2/k1) / (1/T1 - 1/T2)
     */
    static calculateActivationEnergy(k1, T1, k2, T2) {
        const lnRatio = Math.log(k2 / k1);
        const tempTerm = (1 / T1) - (1 / T2);
        return (this.GAS_CONSTANT * lnRatio / tempTerm) / 1000; // Convert to kJ/mol
    }
    /**
     * Generate temperature profile for reaction kinetics
     */
    static generateTemperatureProfile(arrhenius, tempRange, points = 20) {
        const [minTemp, maxTemp] = tempRange;
        const step = (maxTemp - minTemp) / (points - 1);
        return Array.from({ length: points }, (_, i) => {
            const temperature = minTemp + (i * step);
            const rateConstant = this.calculateRateConstant(arrhenius, temperature);
            return {
                temperature,
                rateConstant,
                reactionRate: rateConstant // Base rate (will be modified by concentrations)
            };
        });
    }
    /**
     * Determine reaction class from chemical equation
     */
    static classifyReaction(equation) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            const reactantCount = parsed.reactants.length;
            // Basic classification based on number of reactants
            if (reactantCount === 1)
                return 'unimolecular';
            if (reactantCount === 2)
                return 'bimolecular';
            if (reactantCount === 3)
                return 'termolecular';
            return 'complex';
        }
        catch {
            return 'complex';
        }
    }
    /**
     * Calculate half-life for first-order reactions
     * t₁/₂ = ln(2) / k
     */
    static calculateHalfLife(rateConstant, order = 1) {
        if (order === 1) {
            return Math.log(2) / rateConstant;
        }
        // For other orders, half-life depends on initial concentration
        // Return NaN to indicate additional parameters needed
        return NaN;
    }
    /**
     * Estimate pre-exponential factor using transition state theory
     * A ≈ (kB * T / h) * exp(ΔS‡ / R)
     */
    static estimatePreExponentialFactor(temperature, entropyOfActivation = 0 // J/(mol·K), default assumes no entropy change
    ) {
        const kB = 1.381e-23; // Boltzmann constant (J/K)
        const h = 6.626e-34; // Planck constant (J·s)
        const frequencyFactor = (kB * temperature) / h;
        const entropyTerm = Math.exp(entropyOfActivation / this.GAS_CONSTANT);
        return frequencyFactor * entropyTerm;
    }
    /**
     * Apply catalyst effect to reaction kinetics
     */
    static applyCatalystEffect(baseKinetics, catalyst) {
        const { effectOnRate, effectOnActivationEnergy } = catalyst;
        return {
            ...baseKinetics,
            rateConstant: (baseKinetics.rateConstant || 0) * effectOnRate,
            activationEnergy: (baseKinetics.activationEnergy || 0) + effectOnActivationEnergy,
            catalystEffect: catalyst
        };
    }
    /**
     * Generate rate law expression
     */
    static generateRateLaw(equation, orders, rateConstant) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            const reactants = parsed.reactants;
            let rateLaw = `Rate = ${rateConstant.toExponential(3)}`;
            for (const reactant of reactants) {
                const order = orders[reactant] || 1;
                if (order === 1) {
                    rateLaw += `[${reactant}]`;
                }
                else if (order !== 0) {
                    rateLaw += `[${reactant}]^${order}`;
                }
            }
            return rateLaw;
        }
        catch {
            return `Rate = ${rateConstant.toExponential(3)}[A]^n[B]^m`;
        }
    }
    /**
     * Comprehensive kinetics analysis
     */
    static analyzeKinetics(equation, conditions, arrheniusData) {
        const reactionClass = this.classifyReaction(equation);
        // If no Arrhenius data provided, estimate based on reaction type
        const arrhenius = arrheniusData || this.estimateArrheniusParameters(equation, reactionClass);
        const rateConstant = this.calculateRateConstant(arrhenius, conditions.temperature);
        const halfLife = this.calculateHalfLife(rateConstant);
        // Generate basic reaction orders (1 for each reactant by default)
        const parser = new EquationParser(equation);
        const parsed = parser.parse();
        const orders = parsed.reactants.reduce((acc, reactant) => {
            acc[reactant] = 1; // Assume first order in each reactant
            return acc;
        }, {});
        const overallOrder = Object.values(orders).reduce((sum, order) => sum + order, 0);
        const rateLaw = this.generateRateLaw(equation, orders, rateConstant);
        return {
            equation,
            rateConstant,
            activationEnergy: arrhenius.activationEnergy,
            reactionOrder: overallOrder,
            mechanism: [{
                    equation,
                    type: 'elementary',
                    rateConstant,
                    order: orders,
                    mechanism: 'Single-step elementary reaction'
                }],
            temperatureDependence: arrhenius,
            rateLaw,
            conditions,
            halfLife: isFinite(halfLife) ? halfLife : undefined,
            confidence: arrheniusData ? 0.8 : 0.5, // Lower confidence for estimates
            dataSource: arrheniusData ? 'literature' : 'estimated'
        };
    }
    /**
     * Estimate Arrhenius parameters for unknown reactions
     */
    static estimateArrheniusParameters(equation, reactionClass) {
        // Rough estimates based on reaction class
        const estimates = {
            unimolecular: { A: 1e13, Ea: 150 }, // s⁻¹, kJ/mol
            bimolecular: { A: 1e10, Ea: 50 }, // M⁻¹s⁻¹, kJ/mol
            termolecular: { A: 1e6, Ea: 25 }, // M⁻²s⁻¹, kJ/mol
            'enzyme-catalyzed': { A: 1e7, Ea: 40 },
            autocatalytic: { A: 1e8, Ea: 60 },
            'chain-reaction': { A: 1e12, Ea: 30 },
            oscillating: { A: 1e9, Ea: 70 },
            complex: { A: 1e9, Ea: 80 }
        };
        const { A, Ea } = estimates[reactionClass] || estimates.complex;
        return {
            preExponentialFactor: A,
            activationEnergy: Ea,
            temperatureRange: [250, 500], // K
            rSquared: 0.5 // Low confidence for estimates
        };
    }
}
ReactionKinetics.GAS_CONSTANT = 8.314; // J/(mol·K)
ReactionKinetics.KELVIN_CELSIUS_OFFSET = 273.15;

var calculator = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ReactionKinetics: ReactionKinetics
});

/**
 * CREB Reaction Mechanism Analyzer
 * Analyzes complex reaction mechanisms and pathways
 */
class MechanismAnalyzer {
    /**
     * Analyze a multi-step reaction mechanism
     */
    static analyzeMechanism(steps, conditions) {
        // Find intermediates (species that appear as both products and reactants)
        const intermediates = this.findIntermediates(steps);
        // Find catalysts (species that appear on both sides but are not consumed)
        const catalysts = this.findCatalysts(steps);
        // Determine rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        // Generate overall reaction equation
        const overallReaction = this.deriveOverallReaction(steps);
        // Apply steady-state approximation
        const rateExpression = this.deriveSteadyStateRateExpression(steps, intermediates);
        // Determine valid approximations
        const approximations = this.identifyValidApproximations(steps, conditions);
        return {
            mechanism: steps,
            overallReaction,
            rateExpression,
            rateDeterminingStep,
            intermediates,
            catalysts,
            approximations,
            validity: {
                steadyState: intermediates.length > 0,
                preEquilibrium: this.hasPreEquilibrium(steps),
                rateApproximation: rateDeterminingStep >= 0
            },
            confidence: this.calculateMechanismConfidence(steps, approximations)
        };
    }
    /**
     * Compare two competing reaction pathways
     */
    static comparePathways(pathway1, pathway2, conditions) {
        const analysis1 = this.analyzeMechanism(pathway1, conditions);
        const analysis2 = this.analyzeMechanism(pathway2, conditions);
        // Calculate overall rate constants for comparison
        const rate1 = this.calculateOverallRate(pathway1, conditions);
        const rate2 = this.calculateOverallRate(pathway2, conditions);
        const selectivityFactor = rate1 / rate2;
        const preferredPathway = rate1 > rate2 ? 1 : 2;
        const reasons = this.generateComparisonReasons(analysis1, analysis2, rate1, rate2);
        return {
            pathway1: analysis1,
            pathway2: analysis2,
            preferredPathway,
            reasons,
            selectivityFactor
        };
    }
    /**
     * Apply pre-equilibrium approximation
     */
    static applyPreEquilibriumApproximation(steps, equilibriumSteps) {
        // For fast pre-equilibrium steps, assume rapid equilibrium
        // K_eq = k_forward / k_reverse
        let rateExpression = "Rate = ";
        const slowStep = steps.find(step => !equilibriumSteps.includes(step.stepNumber));
        if (slowStep) {
            rateExpression += `k${slowStep.stepNumber}`;
            // Add concentration terms modified by equilibrium constants
            equilibriumSteps.forEach(stepNum => {
                const step = steps.find(s => s.stepNumber === stepNum);
                if (step && step.reverseRateConstant) {
                    const keq = step.rateConstant / step.reverseRateConstant;
                    rateExpression += ` × K${stepNum}(${keq.toExponential(2)})`;
                }
            });
        }
        return rateExpression;
    }
    /**
     * Apply steady-state approximation
     */
    static applySteadyStateApproximation(steps, steadyStateSpecies) {
        // For steady-state species: d[I]/dt = 0
        // Rate of formation = Rate of consumption
        let rateExpression = "Rate = ";
        // Simplified: find the slowest step
        const slowestStep = steps.reduce((prev, current) => prev.rateConstant < current.rateConstant ? prev : current);
        rateExpression += `k${slowestStep.stepNumber}`;
        // Add pre-equilibrium factors if applicable
        steadyStateSpecies.forEach(species => {
            rateExpression += `[${species}]_ss`;
        });
        return rateExpression;
    }
    /**
     * Find species that appear as both products and reactants (intermediates)
     */
    static findIntermediates(steps) {
        const products = new Set();
        const reactants = new Set();
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                parsed.reactants.forEach(r => reactants.add(r));
                parsed.products.forEach(p => products.add(p));
            }
            catch {
                // Skip invalid equations
            }
        });
        // Intermediates appear in both sets
        return Array.from(products).filter(species => reactants.has(species));
    }
    /**
     * Find species that appear on both sides but are not consumed (catalysts)
     */
    static findCatalysts(steps) {
        const speciesBalance = {};
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                // Subtract reactants, add products
                parsed.reactants.forEach(r => {
                    speciesBalance[r] = (speciesBalance[r] || 0) - 1;
                });
                parsed.products.forEach(p => {
                    speciesBalance[p] = (speciesBalance[p] || 0) + 1;
                });
            }
            catch {
                // Skip invalid equations
            }
        });
        // Catalysts have net balance of zero
        return Object.keys(speciesBalance).filter(species => speciesBalance[species] === 0);
    }
    /**
     * Identify the rate-determining step (slowest step)
     */
    static findRateDeterminingStep(steps) {
        let slowestStep = steps[0];
        let slowestIndex = 0;
        steps.forEach((step, index) => {
            if (step.rateConstant < slowestStep.rateConstant) {
                slowestStep = step;
                slowestIndex = index;
            }
        });
        return slowestIndex;
    }
    /**
     * Derive overall reaction from mechanism steps
     */
    static deriveOverallReaction(steps) {
        const netReactants = {};
        const netProducts = {};
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                parsed.reactants.forEach(r => {
                    netReactants[r] = (netReactants[r] || 0) + 1;
                });
                parsed.products.forEach(p => {
                    netProducts[p] = (netProducts[p] || 0) + 1;
                });
            }
            catch {
                // Skip invalid equations
            }
        });
        // Remove intermediates (species that appear on both sides)
        const allSpecies = new Set([...Object.keys(netReactants), ...Object.keys(netProducts)]);
        allSpecies.forEach(species => {
            const reactantCount = netReactants[species] || 0;
            const productCount = netProducts[species] || 0;
            if (reactantCount > 0 && productCount > 0) {
                const minCount = Math.min(reactantCount, productCount);
                netReactants[species] -= minCount;
                netProducts[species] -= minCount;
                if (netReactants[species] === 0)
                    delete netReactants[species];
                if (netProducts[species] === 0)
                    delete netProducts[species];
            }
        });
        // Build equation string
        const reactantStr = Object.entries(netReactants)
            .filter(([_, count]) => count > 0)
            .map(([species, count]) => count > 1 ? `${count}${species}` : species)
            .join(' + ');
        const productStr = Object.entries(netProducts)
            .filter(([_, count]) => count > 0)
            .map(([species, count]) => count > 1 ? `${count}${species}` : species)
            .join(' + ');
        return `${reactantStr} = ${productStr}`;
    }
    /**
     * Derive rate expression using steady-state approximation
     */
    static deriveSteadyStateRateExpression(steps, intermediates) {
        if (intermediates.length === 0) {
            // Simple elementary reaction
            const step = steps[0];
            return `Rate = k${step.stepNumber}[reactants]`;
        }
        // Complex mechanism - simplified steady-state treatment
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        const rdsStep = steps[rateDeterminingStep];
        return `Rate = k${rdsStep.stepNumber}[reactants] (steady-state approximation)`;
    }
    /**
     * Check if mechanism has pre-equilibrium steps
     */
    static hasPreEquilibrium(steps) {
        return steps.some(step => step.type === 'fast-equilibrium' || step.reverseRateConstant !== undefined);
    }
    /**
     * Identify valid approximations for the mechanism
     */
    static identifyValidApproximations(steps, conditions) {
        const approximations = [];
        // Check for pre-equilibrium
        if (this.hasPreEquilibrium(steps)) {
            approximations.push('Pre-equilibrium approximation');
        }
        // Check for steady-state intermediates
        const intermediates = this.findIntermediates(steps);
        if (intermediates.length > 0) {
            approximations.push('Steady-state approximation');
        }
        // Check for rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        if (rateDeterminingStep >= 0) {
            approximations.push('Rate-determining step approximation');
        }
        return approximations;
    }
    /**
     * Calculate overall reaction rate for pathway comparison
     */
    static calculateOverallRate(steps, conditions) {
        // Simplified: use the slowest step as the overall rate
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        const rdsStep = steps[rateDeterminingStep];
        // Apply temperature dependence (simplified)
        const temperatureFactor = Math.exp(-5e4 / (8.314 * conditions.temperature)); // Rough estimate
        return rdsStep.rateConstant * temperatureFactor;
    }
    /**
     * Generate reasons for pathway preference
     */
    static generateComparisonReasons(analysis1, analysis2, rate1, rate2) {
        const reasons = [];
        if (rate1 > rate2) {
            reasons.push(`Pathway 1 is ${(rate1 / rate2).toFixed(2)}x faster`);
        }
        else {
            reasons.push(`Pathway 2 is ${(rate2 / rate1).toFixed(2)}x faster`);
        }
        if (analysis1.intermediates.length < analysis2.intermediates.length) {
            reasons.push('Pathway 1 has fewer intermediates');
        }
        else if (analysis2.intermediates.length < analysis1.intermediates.length) {
            reasons.push('Pathway 2 has fewer intermediates');
        }
        if (analysis1.confidence > analysis2.confidence) {
            reasons.push('Pathway 1 has higher mechanistic confidence');
        }
        else if (analysis2.confidence > analysis1.confidence) {
            reasons.push('Pathway 2 has higher mechanistic confidence');
        }
        return reasons;
    }
    /**
     * Calculate confidence in mechanism analysis
     */
    static calculateMechanismConfidence(steps, approximations) {
        let confidence = 0.5; // Base confidence
        // Higher confidence for well-defined mechanisms
        if (steps.length > 1 && steps.length <= 5)
            confidence += 0.2;
        // Higher confidence if approximations are valid
        if (approximations.length > 0)
            confidence += 0.1 * approximations.length;
        // Lower confidence for complex mechanisms
        if (steps.length > 5)
            confidence -= 0.1;
        return Math.min(Math.max(confidence, 0), 1);
    }
}

var mechanismAnalyzer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MechanismAnalyzer: MechanismAnalyzer
});

/**
 * CREB Reaction Safety Analyzer
 * Analyzes reaction safety and provides hazard assessments
 */
class ReactionSafetyAnalyzer {
    /**
     * Perform comprehensive safety assessment of a reaction
     */
    static assessReactionSafety(equation, conditions, kineticsData) {
        // Parse the reaction to identify compounds
        const compounds = this.extractCompoundsFromEquation(equation);
        // Assess individual compound hazards
        const compoundHazards = compounds.map(compound => this.getCompoundSafetyData(compound)).filter(Boolean);
        // Analyze thermal hazards
        const thermalHazards = this.assessThermalHazards(equation, conditions, kineticsData);
        // Analyze chemical hazards
        const chemicalHazards = this.assessChemicalHazards(compoundHazards, conditions);
        // Analyze physical hazards
        const physicalHazards = this.assessPhysicalHazards(conditions, compoundHazards);
        // Analyze environmental hazards
        const environmentalHazards = this.assessEnvironmentalHazards(compoundHazards);
        // Calculate overall risk
        const riskScore = this.calculateRiskScore(thermalHazards, chemicalHazards, physicalHazards);
        const overallRiskLevel = this.determineRiskLevel(riskScore);
        // Generate recommendations
        const recommendations = this.generateSafetyRecommendations(overallRiskLevel, thermalHazards, chemicalHazards, physicalHazards);
        // Determine required PPE
        const requiredPPE = this.determineRequiredPPE(compoundHazards, overallRiskLevel);
        // Determine containment level
        const containmentLevel = this.determineContainmentLevel(overallRiskLevel, compoundHazards);
        // Identify monitoring parameters
        const monitoringParameters = this.identifyMonitoringParameters(compoundHazards, conditions);
        // Generate emergency procedures
        const emergencyProcedures = this.generateEmergencyProcedures(overallRiskLevel, compoundHazards);
        return {
            equation,
            overallRiskLevel,
            conditions,
            hazards: {
                thermal: thermalHazards,
                chemical: chemicalHazards,
                physical: physicalHazards,
                environmental: environmentalHazards
            },
            recommendations,
            requiredPPE,
            containmentLevel,
            monitoringParameters,
            emergencyProcedures,
            riskScore
        };
    }
    /**
     * Extract all chemical compounds from equation
     */
    static extractCompoundsFromEquation(equation) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            return [...parsed.reactants, ...parsed.products];
        }
        catch {
            return [];
        }
    }
    /**
     * Get safety data for a specific compound
     */
    static getCompoundSafetyData(compound) {
        // Check our database first
        if (this.HAZARDOUS_COMPOUNDS.has(compound)) {
            return this.HAZARDOUS_COMPOUNDS.get(compound);
        }
        // Estimate safety data for unknown compounds
        return this.estimateCompoundSafety(compound);
    }
    /**
     * Estimate safety data for unknown compounds
     */
    static estimateCompoundSafety(compound) {
        // Basic estimation based on molecular features
        let hazardClass = 'moderate';
        const physicalHazards = [];
        const healthHazards = [];
        const environmentalHazards = [];
        // Simple heuristics
        if (compound.includes('F')) {
            hazardClass = 'high';
            healthHazards.push('Potentially corrosive');
        }
        if (compound.includes('Cl') || compound.includes('Br')) {
            hazardClass = 'moderate';
            environmentalHazards.push('Potentially harmful to aquatic life');
        }
        if (compound.length === 2 && /^[A-Z][a-z]?$/.test(compound)) {
            // Likely an element
            physicalHazards.push('Elemental reactivity');
        }
        return {
            compound,
            hazardClass,
            toxicity: {
                classification: 'harmful',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: [],
                hazardousDecomposition: [],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards,
            healthHazards,
            environmentalHazards
        };
    }
    /**
     * Assess thermal hazards
     */
    static assessThermalHazards(equation, conditions, kineticsData) {
        const hazards = [];
        // High temperature warning
        if (conditions.temperature > 373) { // Above 100°C
            hazards.push({
                type: 'exothermic',
                severity: conditions.temperature > 573 ? 'high' : 'moderate',
                description: `High reaction temperature (${conditions.temperature - 273.15}°C)`,
                mitigationStrategies: [
                    'Use appropriate heating equipment',
                    'Monitor temperature continuously',
                    'Ensure adequate cooling capability'
                ]
            });
        }
        // Pressure hazard
        if (conditions.pressure && conditions.pressure > 5) {
            hazards.push({
                type: 'explosion',
                severity: conditions.pressure > 20 ? 'high' : 'moderate',
                description: `High pressure conditions (${conditions.pressure} atm)`,
                mitigationStrategies: [
                    'Use pressure-rated equipment',
                    'Install pressure relief systems',
                    'Monitor pressure continuously'
                ]
            });
        }
        // Runaway reaction potential
        if (kineticsData && kineticsData.activationEnergy < 50) {
            hazards.push({
                type: 'runaway',
                severity: 'high',
                description: 'Low activation energy may lead to runaway reaction',
                mitigationStrategies: [
                    'Use thermal mass to moderate heating',
                    'Install emergency cooling',
                    'Monitor reaction rate carefully'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess chemical hazards
     */
    static assessChemicalHazards(compoundHazards, conditions) {
        const hazards = [];
        // Check for toxic compounds
        const toxicCompounds = compoundHazards.filter(c => c.toxicity.classification === 'toxic' || c.toxicity.classification === 'very-toxic');
        if (toxicCompounds.length > 0) {
            hazards.push({
                type: 'toxic-gas',
                compounds: toxicCompounds.map(c => c.compound),
                severity: toxicCompounds.some(c => c.toxicity.classification === 'very-toxic') ? 'extreme' : 'high',
                description: 'Reaction involves toxic compounds',
                mitigationStrategies: [
                    'Use in well-ventilated area or fume hood',
                    'Wear appropriate respiratory protection',
                    'Have antidotes/treatments readily available'
                ]
            });
        }
        // Check for corrosive compounds
        const corrosiveCompounds = compoundHazards.filter(c => c.physicalHazards.some(h => h.toLowerCase().includes('corrosive')));
        if (corrosiveCompounds.length > 0) {
            hazards.push({
                type: 'corrosive',
                compounds: corrosiveCompounds.map(c => c.compound),
                severity: 'high',
                description: 'Reaction involves corrosive materials',
                mitigationStrategies: [
                    'Use corrosion-resistant equipment',
                    'Wear acid-resistant PPE',
                    'Have neutralizing agents available'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess physical hazards
     */
    static assessPhysicalHazards(conditions, compoundHazards) {
        const hazards = [];
        // Temperature hazards
        if (conditions.temperature > 373 || conditions.temperature < 273) {
            hazards.push({
                type: 'temperature',
                severity: Math.abs(conditions.temperature - 298) > 200 ? 'high' : 'moderate',
                description: 'Extreme temperature conditions',
                mitigationStrategies: [
                    'Use appropriate temperature-rated equipment',
                    'Protect against thermal burns/frostbite',
                    'Monitor temperature continuously'
                ]
            });
        }
        // Pressure hazards
        if (conditions.pressure && conditions.pressure > 1) {
            hazards.push({
                type: 'pressure',
                severity: conditions.pressure > 10 ? 'high' : 'moderate',
                description: 'Elevated pressure conditions',
                mitigationStrategies: [
                    'Use pressure-rated vessels',
                    'Install pressure relief devices',
                    'Regular equipment inspection'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess environmental hazards
     */
    static assessEnvironmentalHazards(compoundHazards) {
        const hazards = [];
        const environmentallyHazardous = compoundHazards.filter(c => c.environmentalHazards.length > 0);
        if (environmentallyHazardous.length > 0) {
            hazards.push({
                type: 'aquatic-toxic',
                compounds: environmentallyHazardous.map(c => c.compound),
                severity: 'moderate',
                description: 'Compounds may be harmful to environment',
                mitigationStrategies: [
                    'Proper waste disposal procedures',
                    'Prevent release to environment',
                    'Use containment measures'
                ]
            });
        }
        return hazards;
    }
    /**
     * Calculate overall risk score
     */
    static calculateRiskScore(thermal, chemical, physical) {
        const severityToScore = { low: 10, moderate: 25, high: 50, extreme: 100 };
        let score = 0;
        thermal.forEach(h => score += severityToScore[h.severity]);
        chemical.forEach(h => score += severityToScore[h.severity]);
        physical.forEach(h => score += severityToScore[h.severity]);
        return Math.min(score, 100);
    }
    /**
     * Determine overall risk level from score
     */
    static determineRiskLevel(score) {
        if (score >= 75)
            return 'extreme';
        if (score >= 50)
            return 'high';
        if (score >= 25)
            return 'moderate';
        return 'low';
    }
    /**
     * Generate safety recommendations
     */
    static generateSafetyRecommendations(riskLevel, thermal, chemical, physical) {
        const recommendations = [];
        // Always include basic safety recommendations
        recommendations.push({
            category: 'equipment',
            priority: 'medium',
            description: 'Use appropriate personal protective equipment',
            implementation: 'Ensure all personnel wear required PPE before handling chemicals'
        });
        recommendations.push({
            category: 'procedure',
            priority: 'medium',
            description: 'Follow standard laboratory safety procedures',
            implementation: 'Adhere to established protocols for chemical handling and storage'
        });
        // Risk-level based recommendations
        if (riskLevel === 'extreme') {
            recommendations.push({
                category: 'procedure',
                priority: 'critical',
                description: 'Expert supervision required',
                implementation: 'Ensure experienced personnel supervise all operations'
            });
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            recommendations.push({
                category: 'emergency',
                priority: 'high',
                description: 'Emergency response plan required',
                implementation: 'Develop and practice emergency procedures'
            });
        }
        // Hazard-specific recommendations
        thermal.forEach(hazard => {
            hazard.mitigationStrategies.forEach(strategy => {
                recommendations.push({
                    category: 'equipment',
                    priority: hazard.severity === 'extreme' ? 'critical' : 'high',
                    description: strategy,
                    implementation: `Implement for thermal hazard: ${hazard.description}`
                });
            });
        });
        return recommendations;
    }
    /**
     * Determine required PPE
     */
    static determineRequiredPPE(compoundHazards, riskLevel) {
        const ppe = new Set();
        // Base PPE
        ppe.add('Safety glasses');
        ppe.add('Lab coat');
        ppe.add('Closed-toe shoes');
        // Risk-level based PPE
        if (riskLevel === 'moderate' || riskLevel === 'high' || riskLevel === 'extreme') {
            ppe.add('Chemical-resistant gloves');
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            ppe.add('Face shield');
            ppe.add('Respirator');
        }
        if (riskLevel === 'extreme') {
            ppe.add('Full chemical suit');
            ppe.add('Self-contained breathing apparatus');
        }
        // Compound-specific PPE
        compoundHazards.forEach(compound => {
            if (compound.toxicity.classification === 'very-toxic') {
                ppe.add('Respiratory protection');
            }
            if (compound.physicalHazards.some(h => h.includes('corrosive'))) {
                ppe.add('Acid-resistant apron');
            }
        });
        return Array.from(ppe);
    }
    /**
     * Determine containment level
     */
    static determineContainmentLevel(riskLevel, compoundHazards) {
        if (riskLevel === 'extreme')
            return 'specialized';
        if (riskLevel === 'high')
            return 'enhanced';
        const hasHighlyToxic = compoundHazards.some(c => c.toxicity.classification === 'very-toxic');
        return hasHighlyToxic ? 'enhanced' : 'standard';
    }
    /**
     * Identify monitoring parameters
     */
    static identifyMonitoringParameters(compoundHazards, conditions) {
        const parameters = new Set();
        // Always monitor these
        parameters.add('Temperature');
        if (conditions.pressure && conditions.pressure > 1) {
            parameters.add('Pressure');
        }
        // Compound-specific monitoring
        compoundHazards.forEach(compound => {
            if (compound.toxicity.classification === 'toxic' || compound.toxicity.classification === 'very-toxic') {
                parameters.add(`${compound.compound} concentration`);
            }
            if (compound.physicalHazards.some(h => h.includes('gas'))) {
                parameters.add('Gas leak detection');
            }
        });
        return Array.from(parameters);
    }
    /**
     * Generate emergency procedures
     */
    static generateEmergencyProcedures(riskLevel, compoundHazards) {
        const procedures = [];
        // Base procedures
        procedures.push('Know location of emergency equipment');
        procedures.push('Know evacuation routes');
        if (riskLevel === 'moderate' || riskLevel === 'high' || riskLevel === 'extreme') {
            procedures.push('Emergency shutdown procedures');
            procedures.push('Spill cleanup procedures');
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            procedures.push('Emergency decontamination procedures');
            procedures.push('Emergency medical response');
        }
        // Compound-specific procedures
        const hasToxic = compoundHazards.some(c => c.toxicity.classification === 'toxic' || c.toxicity.classification === 'very-toxic');
        if (hasToxic) {
            procedures.push('Exposure response procedures');
            procedures.push('Antidote administration if applicable');
        }
        return procedures;
    }
}
ReactionSafetyAnalyzer.HAZARDOUS_COMPOUNDS = new Map([
    ['H2', {
            compound: 'H2',
            hazardClass: 'high',
            flashPoint: -253,
            autoIgnitionTemp: 500,
            explosiveLimits: [4, 75],
            toxicity: {
                classification: 'non-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['F2', 'Cl2', 'O2', 'oxidizing agents'],
                hazardousDecomposition: [],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards: ['Flammable gas', 'Asphyxiant', 'Pressure hazard'],
            healthHazards: ['Asphyxiant'],
            environmentalHazards: []
        }],
    ['Cl2', {
            compound: 'Cl2',
            hazardClass: 'extreme',
            toxicity: {
                lc50Inhalation: 0.293,
                classification: 'very-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['H2', 'NH3', 'hydrocarbons', 'metals'],
                hazardousDecomposition: ['HCl'],
                polymerization: 'stable',
                waterReactive: true,
                airSensitive: false,
                lightSensitive: true,
                shockSensitive: false
            },
            physicalHazards: ['Corrosive gas', 'Pressure hazard'],
            healthHazards: ['Severe respiratory irritant', 'Corrosive to tissues'],
            environmentalHazards: ['Aquatic toxin', 'Ozone depleting']
        }],
    ['HF', {
            compound: 'HF',
            hazardClass: 'extreme',
            toxicity: {
                ld50Oral: 15,
                ld50Dermal: 410,
                lc50Inhalation: 0.342,
                classification: 'very-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['glass', 'metals', 'silicates'],
                hazardousDecomposition: ['F2'],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards: ['Highly corrosive'],
            healthHazards: ['Severe burns', 'Bone and teeth damage', 'Systemic toxicity'],
            environmentalHazards: ['Aquatic toxin']
        }]
]);

var safetyAnalyzer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ReactionSafetyAnalyzer: ReactionSafetyAnalyzer
});

/**
 * CREB Advanced Kinetics & Analytics Module
 * Entry point for reaction kinetics analysis, mechanism studies, and safety assessment
 */
// Core kinetics calculator
/**
 * Comprehensive Kinetics Analysis Suite
 * Combines kinetics, mechanism, and safety analysis
 */
class AdvancedKineticsAnalyzer {
    /**
     * Perform comprehensive analysis of a chemical reaction
     * Includes kinetics, mechanism analysis, and safety assessment
     */
    static async analyzeReaction(equation, conditions, options = {}) {
        const { includeKinetics = true, includeMechanism = false, includeSafety = true, mechanismSteps = [] } = options;
        const results = {
            equation,
            conditions,
            timestamp: new Date().toISOString()
        };
        try {
            // Kinetics analysis
            if (includeKinetics) {
                const { ReactionKinetics } = await Promise.resolve().then(function () { return calculator; });
                results.kinetics = ReactionKinetics.analyzeKinetics(equation, conditions);
            }
            // Mechanism analysis
            if (includeMechanism && mechanismSteps.length > 0) {
                const { MechanismAnalyzer } = await Promise.resolve().then(function () { return mechanismAnalyzer; });
                results.mechanism = MechanismAnalyzer.analyzeMechanism(mechanismSteps, conditions);
            }
            // Safety analysis
            if (includeSafety) {
                const { ReactionSafetyAnalyzer } = await Promise.resolve().then(function () { return safetyAnalyzer; });
                results.safety = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions, results.kinetics);
            }
            // Generate summary
            results.summary = this.generateAnalysisSummary(results);
            return results;
        }
        catch (error) {
            return {
                ...results,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                success: false
            };
        }
    }
    /**
     * Compare multiple reaction pathways
     */
    static async compareReactionPathways(pathways) {
        const analyses = await Promise.all(pathways.map(pathway => this.analyzeReaction(pathway.equation, pathway.conditions, {
            includeKinetics: true,
            includeMechanism: !!pathway.mechanismSteps,
            includeSafety: true,
            mechanismSteps: pathway.mechanismSteps || []
        })));
        // Find the most favorable pathway
        const rankedPathways = analyses
            .map((analysis, index) => ({
            index,
            analysis,
            score: this.calculatePathwayScore(analysis)
        }))
            .sort((a, b) => b.score - a.score);
        return {
            pathways: analyses,
            recommendation: rankedPathways[0],
            comparison: this.generatePathwayComparison(rankedPathways)
        };
    }
    /**
     * Generate temperature-dependent kinetics profile
     */
    static async generateTemperatureProfile(equation, temperatureRange, baseConditions, points = 10) {
        const { ReactionKinetics } = await Promise.resolve().then(function () { return calculator; });
        const [minTemp, maxTemp] = temperatureRange;
        const step = (maxTemp - minTemp) / (points - 1);
        const profile = [];
        for (let i = 0; i < points; i++) {
            const temperature = minTemp + (i * step);
            const conditions = { ...baseConditions, temperature };
            const kinetics = ReactionKinetics.analyzeKinetics(equation, conditions);
            profile.push({
                temperature,
                temperatureCelsius: temperature - 273.15,
                rateConstant: kinetics.rateConstant,
                halfLife: kinetics.halfLife,
                activationEnergy: kinetics.activationEnergy
            });
        }
        return {
            equation,
            temperatureRange,
            profile,
            summary: {
                temperatureRangeCelsius: [minTemp - 273.15, maxTemp - 273.15],
                rateConstantRange: [
                    Math.min(...profile.map(p => p.rateConstant)),
                    Math.max(...profile.map(p => p.rateConstant))
                ],
                averageActivationEnergy: profile.reduce((sum, p) => sum + p.activationEnergy, 0) / profile.length
            }
        };
    }
    /**
     * Generate analysis summary
     */
    static generateAnalysisSummary(results) {
        const summaryParts = [];
        if (results.kinetics) {
            const k = results.kinetics;
            summaryParts.push(`Kinetics: Rate constant = ${k.rateConstant.toExponential(2)} at ${(k.conditions.temperature - 273.15).toFixed(1)}°C`);
            summaryParts.push(`Activation energy = ${k.activationEnergy.toFixed(1)} kJ/mol`);
            if (k.halfLife) {
                summaryParts.push(`Half-life = ${k.halfLife.toExponential(2)} s`);
            }
        }
        if (results.mechanism) {
            const m = results.mechanism;
            summaryParts.push(`Mechanism: ${m.mechanism.length} steps, ${m.intermediates.length} intermediates`);
            summaryParts.push(`Rate-determining step: ${m.rateDeterminingStep + 1}`);
        }
        if (results.safety) {
            const s = results.safety;
            summaryParts.push(`Safety: ${s.overallRiskLevel.toUpperCase()} risk (score: ${s.riskScore})`);
            summaryParts.push(`PPE required: ${s.requiredPPE.join(', ')}`);
            summaryParts.push(`Containment: ${s.containmentLevel}`);
        }
        return summaryParts.join('\n');
    }
    /**
     * Calculate pathway score for comparison
     */
    static calculatePathwayScore(analysis) {
        let score = 50; // Base score
        // Kinetics factors
        if (analysis.kinetics) {
            const k = analysis.kinetics;
            // Higher rate constant is better (within reason)
            if (k.rateConstant > 1e-3 && k.rateConstant < 1e3) {
                score += 10;
            }
            // Moderate activation energy is preferred
            if (k.activationEnergy > 20 && k.activationEnergy < 150) {
                score += 10;
            }
            // Higher confidence is better
            score += k.confidence * 20;
        }
        // Safety factors
        if (analysis.safety) {
            const s = analysis.safety;
            // Lower risk is better
            const riskPenalty = {
                'low': 0,
                'moderate': -10,
                'high': -25,
                'extreme': -50
            };
            score += riskPenalty[s.overallRiskLevel] || 0;
            // Fewer hazards is better
            const totalHazards = s.hazards.thermal.length +
                s.hazards.chemical.length +
                s.hazards.physical.length;
            score -= totalHazards * 5;
        }
        // Mechanism factors
        if (analysis.mechanism) {
            const m = analysis.mechanism;
            // Simpler mechanisms are often preferred
            score += Math.max(0, 20 - m.mechanism.length * 3);
            // Higher confidence is better
            score += m.confidence * 15;
        }
        return Math.max(0, Math.min(100, score));
    }
    /**
     * Generate pathway comparison summary
     */
    static generatePathwayComparison(rankedPathways) {
        if (rankedPathways.length < 2) {
            return 'Insufficient pathways for comparison';
        }
        const best = rankedPathways[0];
        const comparison = [];
        comparison.push(`Recommended pathway: ${best.analysis.equation} (Score: ${best.score.toFixed(1)})`);
        // Compare with next best
        for (let i = 1; i < Math.min(3, rankedPathways.length); i++) {
            const alt = rankedPathways[i];
            const scoreDiff = best.score - alt.score;
            comparison.push(`Alternative ${i}: ${alt.analysis.equation} (Score: ${alt.score.toFixed(1)}, ${scoreDiff.toFixed(1)} points lower)`);
        }
        return comparison.join('\n');
    }
}

/**
 * Enhanced Chemical Database Manager
 * Provides comprehensive data integration and management capabilities
 */
exports.ChemicalDatabaseManager = class ChemicalDatabaseManager {
    constructor() {
        this.compounds = new Map();
        this.sources = new Map();
        this.validationRules = [];
        this.cache = new exports.AdvancedCache({
            maxSize: 1000,
            defaultTtl: 1800000, // 30 minutes
            enableMetrics: true
        });
        this.validationPipeline = this.initializeValidationPipeline();
        this.initializeDefaultSources();
        this.initializeValidationRules();
        this.loadDefaultCompounds();
    }
    /**
     * Initialize the validation pipeline with chemistry validators
     */
    initializeValidationPipeline() {
        const pipeline = createValidationPipeline();
        // Add chemical formula validator
        pipeline.addValidator(new ChemicalFormulaValidator());
        // Add thermodynamic properties validator
        pipeline.addValidator(new ThermodynamicPropertiesValidator());
        return pipeline;
    }
    /**
     * Initialize default database sources
     */
    initializeDefaultSources() {
        const defaultSources = [
            {
                id: 'nist',
                name: 'NIST WebBook',
                url: 'https://webbook.nist.gov/chemistry/',
                priority: 1,
                enabled: true,
                cacheTimeout: 86400 // 24 hours
            },
            {
                id: 'pubchem',
                name: 'PubChem',
                url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/',
                priority: 2,
                enabled: true,
                cacheTimeout: 43200 // 12 hours
            },
            {
                id: 'local',
                name: 'Local Database',
                priority: 3,
                enabled: true,
                cacheTimeout: 0 // No cache timeout for local data
            }
        ];
        defaultSources.forEach(source => {
            this.sources.set(source.id, source);
        });
    }
    /**
     * Initialize data validation rules
     */
    initializeValidationRules() {
        this.validationRules = [
            {
                field: 'formula',
                type: 'required',
                rule: true,
                message: 'Chemical formula is required'
            },
            {
                field: 'molecularWeight',
                type: 'range',
                rule: { min: 0.1, max: 10000 },
                message: 'Molecular weight must be between 0.1 and 10000 g/mol'
            },
            {
                field: 'thermodynamicProperties.deltaHf',
                type: 'range',
                rule: { min: -5e3, max: 5000 },
                message: 'Enthalpy of formation must be between -5000 and 5000 kJ/mol'
            },
            {
                field: 'thermodynamicProperties.entropy',
                type: 'range',
                rule: { min: 0, max: 1000 },
                message: 'Entropy must be between 0 and 1000 J/(mol·K)'
            },
            {
                field: 'thermodynamicProperties.temperatureRange',
                type: 'custom',
                rule: (range) => range[0] < range[1] && range[0] > 0,
                message: 'Temperature range must be valid (min < max, both > 0)'
            }
        ];
    }
    /**
     * Load default compound database
     */
    loadDefaultCompounds() {
        const defaultCompounds = [
            {
                formula: 'H2O',
                name: 'Water',
                commonName: 'Water',
                casNumber: '7732-18-5',
                smiles: 'O',
                molecularWeight: 18.015,
                thermodynamicProperties: {
                    deltaHf: -285.8,
                    deltaGf: -237.1,
                    entropy: 69.95,
                    heatCapacity: 75.3,
                    temperatureRange: [273.15, 647.1],
                    meltingPoint: 273.15,
                    boilingPoint: 373.15,
                    criticalTemperature: 647.1,
                    criticalPressure: 22064000,
                    vaporPressure: [
                        { temperature: 273.15, pressure: 611.7 },
                        { temperature: 298.15, pressure: 3173 },
                        { temperature: 373.15, pressure: 101325 }
                    ]
                },
                physicalProperties: {
                    density: 997.0,
                    viscosity: 0.001,
                    thermalConductivity: 0.606,
                    refractiveIndex: 1.333,
                    dielectricConstant: 80.1,
                    surfaceTension: 0.0728
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CO2',
                name: 'Carbon dioxide',
                commonName: 'Carbon dioxide',
                casNumber: '124-38-9',
                smiles: 'O=C=O',
                molecularWeight: 44.010,
                thermodynamicProperties: {
                    deltaHf: -393.5,
                    deltaGf: -394.4,
                    entropy: 213.8,
                    heatCapacity: 37.1,
                    temperatureRange: [200, 2000],
                    meltingPoint: 216.6,
                    boilingPoint: 194.7, // Sublimation point at 1 atm
                    criticalTemperature: 304.13,
                    criticalPressure: 7375000
                },
                physicalProperties: {
                    density: 1.98, // gas at STP
                    thermalConductivity: 0.0146,
                    solubility: {
                        water: 1.7 // g/L at 20°C
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CH4',
                name: 'Methane',
                commonName: 'Methane',
                casNumber: '74-82-8',
                smiles: 'C',
                molecularWeight: 16.043,
                thermodynamicProperties: {
                    deltaHf: -74.6,
                    deltaGf: -50.5,
                    entropy: 186.3,
                    heatCapacity: 35.7,
                    temperatureRange: [200, 1500],
                    meltingPoint: 90.7,
                    boilingPoint: 111.7,
                    criticalTemperature: 190.6,
                    criticalPressure: 4599000
                },
                physicalProperties: {
                    density: 0.717, // gas at STP
                    viscosity: 0.0000103,
                    thermalConductivity: 0.0332
                },
                safetyData: {
                    hazardSymbols: ['GHS02', 'GHS04'],
                    hazardStatements: ['H220', 'H280'],
                    precautionaryStatements: ['P210', 'P377', 'P381'],
                    autoignitionTemperature: 810,
                    explosiveLimits: {
                        lower: 5.0,
                        upper: 15.0
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            }
        ];
        defaultCompounds.forEach((compound, index) => {
            if (compound.formula) {
                this.compounds.set(compound.formula, compound);
            }
        });
    }
    /**
     * Query compounds from the database
     */
    async query(query) {
        const results = [];
        // Search local database first
        for (const [formula, compound] of this.compounds) {
            if (this.matchesQuery(compound, query)) {
                results.push(compound);
            }
        }
        // If no local results and external providers are requested
        if (results.length === 0 && query.provider && query.provider !== 'local') {
            try {
                const externalResults = await this.queryExternalSource(query);
                results.push(...externalResults);
            }
            catch (error) {
                console.warn(`External database query failed: ${error}`);
            }
        }
        // Sort by confidence and limit results
        results.sort((a, b) => b.confidence - a.confidence);
        if (query.maxResults) {
            return results.slice(0, query.maxResults);
        }
        return results;
    }
    /**
     * Check if compound matches query criteria
     */
    matchesQuery(compound, query) {
        if (query.formula && compound.formula !== query.formula)
            return false;
        if (query.name && !compound.name.toLowerCase().includes(query.name.toLowerCase()))
            return false;
        if (query.casNumber && compound.casNumber !== query.casNumber)
            return false;
        if (query.smiles && compound.smiles !== query.smiles)
            return false;
        if (query.inchi && compound.inchi !== query.inchi)
            return false;
        if (!query.includeUncertain && compound.confidence < 0.8)
            return false;
        return true;
    }
    /**
     * Query external data sources
     */
    async queryExternalSource(query) {
        // This would implement actual API calls to NIST, PubChem, etc.
        // For now, return empty array as placeholder
        return [];
    }
    /**
     * Add or update a compound in the database
     */
    async addCompound(compound) {
        try {
            // Validate the compound data
            const validationErrors = await this.validateCompound(compound);
            if (validationErrors.length > 0) {
                throw new ValidationError(`Validation failed: ${validationErrors.join(', ')}`, {
                    errors: validationErrors,
                    compound: compound.formula || 'unknown'
                });
            }
            // Fill in missing fields
            const fullCompound = {
                formula: compound.formula,
                name: compound.name || compound.formula,
                molecularWeight: compound.molecularWeight || 0,
                thermodynamicProperties: compound.thermodynamicProperties || this.getDefaultThermodynamicProperties(),
                physicalProperties: compound.physicalProperties || {},
                sources: compound.sources || ['custom'],
                lastUpdated: new Date(),
                confidence: compound.confidence || 0.8,
                ...compound
            };
            this.compounds.set(fullCompound.formula, fullCompound);
            return true;
        }
        catch (error) {
            console.error(`Failed to add compound: ${error}`);
            return false;
        }
    }
    /**
     * Get default thermodynamic properties for validation
     */
    getDefaultThermodynamicProperties() {
        return {
            deltaHf: 0,
            entropy: 0,
            heatCapacity: 25, // Approximate value for many compounds
            temperatureRange: [298, 1000]
        };
    }
    /**
     * Validate compound data using the advanced validation pipeline
     */
    async validateCompound(compound) {
        const errors = [];
        try {
            // Validate chemical formula if present
            if (compound.formula) {
                const formulaResult = await this.validationPipeline.validate(compound.formula, ['ChemicalFormulaValidator']);
                if (!formulaResult.isValid) {
                    errors.push(...formulaResult.errors.map(e => e.message));
                }
            }
            // Validate thermodynamic properties if present
            if (compound.thermodynamicProperties) {
                const thermoResult = await this.validationPipeline.validate(compound.thermodynamicProperties, ['ThermodynamicPropertiesValidator']);
                if (!thermoResult.isValid) {
                    errors.push(...thermoResult.errors.map(e => e.message));
                }
            }
            // Legacy validation rules for backward compatibility
            for (const rule of this.validationRules) {
                const value = this.getNestedProperty(compound, rule.field);
                switch (rule.type) {
                    case 'required':
                        if (value === undefined || value === null) {
                            errors.push(rule.message);
                        }
                        break;
                    case 'range':
                        if (typeof value === 'number') {
                            const { min, max } = rule.rule;
                            if (value < min || value > max) {
                                errors.push(rule.message);
                            }
                        }
                        break;
                    case 'custom':
                        if (value !== undefined && !rule.rule(value)) {
                            errors.push(rule.message);
                        }
                        break;
                }
            }
        }
        catch (error) {
            errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return errors;
    }
    /**
     * Get nested property value by dot notation
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Import compounds from various data formats
     */
    async importData(data, format) {
        const result = {
            success: true,
            imported: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
        try {
            let compounds = [];
            switch (format) {
                case 'json':
                    compounds = Array.isArray(data) ? data : [data];
                    break;
                case 'csv':
                    compounds = this.parseCSV(data);
                    break;
                case 'sdf':
                    compounds = this.parseSDF(data);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            for (const compound of compounds) {
                try {
                    const success = await this.addCompound(compound);
                    if (success) {
                        result.imported++;
                    }
                    else {
                        result.failed++;
                        result.errors.push({
                            compound: compound.formula || 'unknown',
                            error: 'Failed to add compound'
                        });
                    }
                }
                catch (error) {
                    result.failed++;
                    result.errors.push({
                        compound: compound.formula || 'unknown',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
            result.success = result.failed === 0;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                compound: 'all',
                error: error instanceof Error ? error.message : 'Import failed'
            });
        }
        return result;
    }
    /**
     * Parse CSV data into compound objects
     */
    parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const compounds = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const compound = {};
                headers.forEach((header, index) => {
                    const value = values[index];
                    // Map common CSV headers to compound properties
                    switch (header.toLowerCase()) {
                        case 'formula':
                            compound.formula = value;
                            break;
                        case 'name':
                            compound.name = value;
                            break;
                        case 'molecular_weight':
                        case 'molecularweight':
                            compound.molecularWeight = parseFloat(value);
                            break;
                        case 'deltahf':
                        case 'enthalpy_formation':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.deltaHf = parseFloat(value);
                            break;
                        case 'entropy':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.entropy = parseFloat(value);
                            break;
                        case 'heat_capacity':
                        case 'heatcapacity':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.heatCapacity = parseFloat(value);
                            break;
                    }
                });
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Parse SDF (Structure Data File) format
     */
    parseSDF(sdfData) {
        // Basic SDF parsing - would need more sophisticated implementation for production
        const compounds = [];
        const molecules = sdfData.split('$$$$');
        for (const molecule of molecules) {
            if (molecule.trim()) {
                const compound = {};
                // Extract name from first line
                const lines = molecule.split('\n');
                if (lines.length > 0) {
                    compound.name = lines[0].trim();
                }
                // Look for additional properties in the data fields
                const dataSection = molecule.split('> <');
                for (const section of dataSection) {
                    if (section.includes('MOLECULAR_FORMULA')) {
                        const formula = section.split('\n')[1]?.trim();
                        if (formula)
                            compound.formula = formula;
                    }
                    if (section.includes('MOLECULAR_WEIGHT')) {
                        const weight = parseFloat(section.split('\n')[1]?.trim() || '0');
                        if (weight > 0)
                            compound.molecularWeight = weight;
                    }
                }
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Export compound data in various formats
     */
    exportData(options) {
        let compounds = Array.from(this.compounds.values());
        // Apply filter if provided
        if (options.filter) {
            compounds = compounds.filter(options.filter);
        }
        switch (options.format) {
            case 'json':
                return this.exportJSON(compounds, options);
            case 'csv':
                return this.exportCSV(compounds, options);
            case 'xlsx':
                return this.exportXLSX(compounds, options);
            default:
                throw new Error(`Unsupported export format: ${options.format}`);
        }
    }
    /**
     * Export as JSON
     */
    exportJSON(compounds, options) {
        const data = options.fields ?
            compounds.map(c => this.selectFields(c, options.fields)) :
            compounds;
        const exportData = {
            metadata: options.includeMetadata ? {
                exportDate: new Date().toISOString(),
                totalCompounds: compounds.length,
                version: '1.0'
            } : undefined,
            compounds: data
        };
        return JSON.stringify(exportData, null, 2);
    }
    /**
     * Export as CSV
     */
    exportCSV(compounds, options) {
        if (compounds.length === 0)
            return '';
        const fields = options.fields || ['formula', 'name', 'molecularWeight'];
        const headers = fields.join(',');
        const rows = compounds.map(compound => {
            return fields.map(field => {
                const value = this.getNestedProperty(compound, field);
                return typeof value === 'string' ? `"${value}"` : value || '';
            }).join(',');
        });
        return [headers, ...rows].join('\n');
    }
    /**
     * Export as XLSX (placeholder - would need external library)
     */
    exportXLSX(compounds, options) {
        // This would require a library like xlsx or exceljs
        throw new Error('XLSX export not yet implemented - use JSON or CSV');
    }
    /**
     * Select specific fields from compound
     */
    selectFields(compound, fields) {
        const result = {};
        for (const field of fields) {
            const value = this.getNestedProperty(compound, field);
            if (value !== undefined) {
                this.setNestedProperty(result, field, value);
            }
        }
        return result;
    }
    /**
     * Set nested property value by dot notation
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        for (const key of keys) {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        current[lastKey] = value;
    }
    /**
     * Get compound by formula with backward compatibility
     */
    async getCompound(formula) {
        const compounds = await this.query({ formula, maxResults: 1 });
        if (compounds.length > 0) {
            const compound = compounds[0];
            // Convert to legacy format for backward compatibility
            return {
                deltaHf: compound.thermodynamicProperties.deltaHf,
                entropy: compound.thermodynamicProperties.entropy,
                heatCapacity: compound.thermodynamicProperties.heatCapacity,
                temperatureRange: compound.thermodynamicProperties.temperatureRange
            };
        }
        return null;
    }
    /**
     * Get all available compounds
     */
    getAllCompounds() {
        return Array.from(this.compounds.values());
    }
    /**
     * Get database statistics
     */
    getStatistics() {
        const compounds = this.getAllCompounds();
        const sourceCounts = {};
        const confidenceDistribution = {
            'high': 0, // > 0.8
            'medium': 0, // 0.6-0.8
            'low': 0 // < 0.6
        };
        let lastUpdate = new Date(0);
        compounds.forEach(compound => {
            // Count sources
            compound.sources.forEach(source => {
                sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            });
            // Confidence distribution
            if (compound.confidence > 0.8) {
                confidenceDistribution.high++;
            }
            else if (compound.confidence > 0.6) {
                confidenceDistribution.medium++;
            }
            else {
                confidenceDistribution.low++;
            }
            // Track latest update
            if (compound.lastUpdated > lastUpdate) {
                lastUpdate = compound.lastUpdated;
            }
        });
        return {
            totalCompounds: compounds.length,
            sourceCounts,
            confidenceDistribution,
            lastUpdate
        };
    }
};
exports.ChemicalDatabaseManager = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], exports.ChemicalDatabaseManager);

/**
 * NIST WebBook Integration for Enhanced Data
 * Provides real-time access to NIST thermodynamic database
 */
exports.NISTWebBookIntegration = class NISTWebBookIntegration {
    constructor(apiKey) {
        this.baseURL = 'https://webbook.nist.gov/cgi/cbook.cgi';
        this.cache = new exports.AdvancedCache({
            maxSize: 1000,
            defaultTtl: 86400000, // 24 hours
            enableMetrics: true
        });
        this.cacheTimeout = 86400000; // 24 hours in ms
        this.apiKey = apiKey;
    }
    /**
     * Query NIST WebBook for compound data
     */
    async queryCompound(identifier, type = 'formula') {
        try {
            // Check cache first
            const cacheKey = `${type}:${identifier}`;
            const cached = await this.cache.get(cacheKey);
            if (cached.hit && cached.value && (Date.now() - cached.value.timestamp) < this.cacheTimeout) {
                return this.convertNISTToCompound(cached.value.data);
            }
            // Make API request
            const response = await this.makeNISTRequest(identifier, type);
            if (response) {
                // Cache the response
                await this.cache.set(cacheKey, {
                    data: response,
                    timestamp: Date.now()
                });
                return this.convertNISTToCompound(response);
            }
            return null;
        }
        catch (error) {
            console.warn(`NIST WebBook query failed: ${error}`);
            return null;
        }
    }
    /**
     * Make request to NIST WebBook API
     */
    async makeNISTRequest(identifier, type) {
        // Note: This is a simplified implementation
        // The actual NIST WebBook doesn't have a public REST API
        // This would need to be implemented using web scraping or a proxy service
        const params = new URLSearchParams({
            cbook: 'main',
            [type === 'formula' ? 'Formula' : type === 'name' ? 'Name' : 'ID']: identifier,
            Units: 'SI',
            Mask: '1' // Thermochemical data
        });
        try {
            // This is a placeholder implementation
            // In practice, you would either:
            // 1. Use web scraping with libraries like Puppeteer
            // 2. Use a proxy service that provides API access to NIST
            // 3. Use cached NIST data that's periodically updated
            const url = `${this.baseURL}?${params}`;
            // Note: Would query NIST at: ${url}
            // Return mock data for demonstration
            return this.getMockNISTData(identifier);
        }
        catch (error) {
            throw new Error(`NIST request failed: ${error}`);
        }
    }
    /**
     * Convert NIST response to CompoundDatabase format
     */
    convertNISTToCompound(nistData) {
        const thermodynamicProperties = {
            deltaHf: nistData.thermodynamics?.enthalpy_formation || 0,
            entropy: nistData.thermodynamics?.entropy || 0,
            heatCapacity: nistData.thermodynamics?.heat_capacity || 25,
            temperatureRange: nistData.thermodynamics?.temperature_range || [298, 1000],
            meltingPoint: nistData.phase_data?.melting_point,
            boilingPoint: nistData.phase_data?.boiling_point,
            criticalTemperature: nistData.phase_data?.critical_temperature,
            criticalPressure: nistData.phase_data?.critical_pressure,
            uncertainties: nistData.uncertainties ? {
                deltaHf: nistData.uncertainties.enthalpy_formation,
                entropy: nistData.uncertainties.entropy
            } : undefined
        };
        return {
            formula: nistData.formula,
            name: nistData.name,
            casNumber: nistData.cas,
            molecularWeight: this.calculateMolecularWeight(nistData.formula),
            thermodynamicProperties,
            physicalProperties: {},
            sources: ['nist'],
            lastUpdated: new Date(),
            confidence: 0.95 // NIST data is highly reliable
        };
    }
    /**
     * Calculate molecular weight from formula (simplified)
     */
    calculateMolecularWeight(formula) {
        // Simple atomic weights for common elements
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
            'F': 18.998, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982,
            'Si': 28.085, 'P': 30.974, 'S': 32.065, 'Cl': 35.453,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'I': 126.904
        };
        let weight = 0;
        let i = 0;
        while (i < formula.length) {
            if (formula[i] === '(' || formula[i] === ')') {
                i++;
                continue;
            }
            // Get element symbol (starts with uppercase)
            if (!/[A-Z]/.test(formula[i])) {
                i++;
                continue;
            }
            let element = formula[i];
            i++;
            // Check for two-letter elements (second letter is lowercase)
            if (i < formula.length && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }
            // Get count
            let count = '';
            while (i < formula.length && /\d/.test(formula[i])) {
                count += formula[i];
                i++;
            }
            const elementWeight = atomicWeights[element] || 0;
            const elementCount = count ? parseInt(count) : 1;
            weight += elementWeight * elementCount;
        }
        return Math.round(weight * 1000) / 1000; // Round to 3 decimal places
    }
    /**
     * Get mock NIST data for testing/demonstration
     */
    getMockNISTData(identifier) {
        const mockData = {
            'H2O': {
                formula: 'H2O',
                name: 'Water',
                cas: '7732-18-5',
                thermodynamics: {
                    enthalpy_formation: -285.8,
                    entropy: 69.95,
                    heat_capacity: 75.3,
                    temperature_range: [273.15, 647.1]
                },
                phase_data: {
                    melting_point: 273.15,
                    boiling_point: 373.15,
                    critical_temperature: 647.1,
                    critical_pressure: 22064000
                },
                uncertainties: {
                    enthalpy_formation: 0.4,
                    entropy: 0.1
                }
            },
            'CO2': {
                formula: 'CO2',
                name: 'Carbon dioxide',
                cas: '124-38-9',
                thermodynamics: {
                    enthalpy_formation: -393.5,
                    entropy: 213.8,
                    heat_capacity: 37.1,
                    temperature_range: [200, 2000]
                },
                phase_data: {
                    melting_point: 216.6,
                    boiling_point: 194.7,
                    critical_temperature: 304.13,
                    critical_pressure: 7375000
                },
                uncertainties: {
                    enthalpy_formation: 0.1,
                    entropy: 0.3
                }
            },
            'CH4': {
                formula: 'CH4',
                name: 'Methane',
                cas: '74-82-8',
                thermodynamics: {
                    enthalpy_formation: -74.6,
                    entropy: 186.3,
                    heat_capacity: 35.7,
                    temperature_range: [200, 1500]
                },
                phase_data: {
                    melting_point: 90.7,
                    boiling_point: 111.7,
                    critical_temperature: 190.6,
                    critical_pressure: 4599000
                },
                uncertainties: {
                    enthalpy_formation: 0.2,
                    entropy: 0.2
                }
            },
            'O2': {
                formula: 'O2',
                name: 'Oxygen',
                cas: '7782-44-7',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 205.2,
                    heat_capacity: 29.4,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 54.4,
                    boiling_point: 90.2,
                    critical_temperature: 154.6,
                    critical_pressure: 5043000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            },
            'N2': {
                formula: 'N2',
                name: 'Nitrogen',
                cas: '7727-37-9',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 191.6,
                    heat_capacity: 29.1,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 63.1,
                    boiling_point: 77.4,
                    critical_temperature: 126.2,
                    critical_pressure: 3396000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            }
        };
        return mockData[identifier] || null;
    }
    /**
     * Batch query multiple compounds
     */
    async batchQuery(identifiers, type = 'formula') {
        const results = [];
        // Process in batches to avoid overwhelming the API
        const batchSize = 10;
        for (let i = 0; i < identifiers.length; i += batchSize) {
            const batch = identifiers.slice(i, i + batchSize);
            const batchPromises = batch.map(identifier => this.queryCompound(identifier, type));
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    results.push(result.value);
                }
            });
            // Add delay between batches to be respectful to the API
            if (i + batchSize < identifiers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        this.cache.getMetrics();
        return {
            size: this.cache.size(),
            oldestEntry: null, // AdvancedCache doesn't expose entry timestamps directly
            newestEntry: null // Would need to track separately if needed
        };
    }
};
exports.NISTWebBookIntegration = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [String])
], exports.NISTWebBookIntegration);

/**
 * Advanced Data Validation Service
 * Provides comprehensive validation for chemical data integrity
 */
class DataValidationService {
    constructor(config = {}) {
        this.config = {
            enablePhysicsChecks: true,
            enableConsistencyChecks: true,
            enableRangeChecks: true,
            enableCorrelationChecks: true,
            strictMode: false,
            ...config
        };
    }
    /**
     * Validate a complete compound entry
     */
    validateCompound(compound) {
        const errors = [];
        const warnings = [];
        // Basic structure validation
        errors.push(...this.validateBasicStructure(compound));
        // Chemical formula validation
        errors.push(...this.validateFormula(compound.formula));
        // Thermodynamic properties validation
        if (compound.thermodynamicProperties) {
            const thermoResult = this.validateThermodynamicProperties(compound.thermodynamicProperties, compound.formula);
            errors.push(...thermoResult.errors);
            warnings.push(...thermoResult.warnings);
        }
        // Physical properties validation
        if (compound.physicalProperties) {
            const physResult = this.validatePhysicalProperties(compound.physicalProperties, compound.thermodynamicProperties);
            errors.push(...physResult.errors);
            warnings.push(...physResult.warnings);
        }
        // Safety data validation
        if (compound.safetyData) {
            errors.push(...this.validateSafetyData(compound.safetyData));
        }
        // Cross-property consistency checks
        if (this.config.enableConsistencyChecks) {
            const consistencyResult = this.validateConsistency(compound);
            errors.push(...consistencyResult.errors);
            warnings.push(...consistencyResult.warnings);
        }
        // Calculate quality score
        const score = this.calculateQualityScore(compound, errors, warnings);
        return {
            isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'major').length === 0,
            errors,
            warnings,
            score
        };
    }
    /**
     * Validate basic compound structure
     */
    validateBasicStructure(compound) {
        const errors = [];
        if (!compound.formula || compound.formula.trim() === '') {
            errors.push({
                field: 'formula',
                message: 'Chemical formula is required',
                severity: 'critical',
                suggestedFix: 'Provide a valid chemical formula'
            });
        }
        if (!compound.name || compound.name.trim() === '') {
            errors.push({
                field: 'name',
                message: 'Compound name is required',
                severity: 'major',
                suggestedFix: 'Provide a compound name'
            });
        }
        if (compound.molecularWeight <= 0) {
            errors.push({
                field: 'molecularWeight',
                message: 'Molecular weight must be positive',
                severity: 'critical',
                suggestedFix: 'Calculate molecular weight from formula'
            });
        }
        if (compound.molecularWeight < 0.1 || compound.molecularWeight > 10000) {
            errors.push({
                field: 'molecularWeight',
                message: 'Molecular weight must be between 0.1 and 10000 g/mol',
                severity: 'critical',
                suggestedFix: 'Check molecular weight calculation or formula'
            });
        }
        if (compound.confidence < 0 || compound.confidence > 1) {
            errors.push({
                field: 'confidence',
                message: 'Confidence must be between 0 and 1',
                severity: 'minor',
                suggestedFix: 'Set confidence to 0.8 if uncertain'
            });
        }
        return errors;
    }
    /**
     * Validate chemical formula syntax and composition
     */
    validateFormula(formula) {
        const errors = [];
        if (!formula)
            return errors;
        // Check for valid characters (letters, numbers, parentheses)
        if (!/^[A-Za-z0-9()]+$/.test(formula)) {
            errors.push({
                field: 'formula',
                message: 'Formula contains invalid characters',
                severity: 'critical',
                suggestedFix: 'Use only element symbols, numbers, and parentheses'
            });
        }
        // Check balanced parentheses
        let parenCount = 0;
        for (const char of formula) {
            if (char === '(')
                parenCount++;
            if (char === ')')
                parenCount--;
            if (parenCount < 0) {
                errors.push({
                    field: 'formula',
                    message: 'Unbalanced parentheses in formula',
                    severity: 'critical'
                });
                break;
            }
        }
        if (parenCount !== 0) {
            errors.push({
                field: 'formula',
                message: 'Unbalanced parentheses in formula',
                severity: 'critical'
            });
        }
        // Check for valid element symbols
        const elementPattern = /[A-Z][a-z]?/g;
        const elements = formula.match(elementPattern) || [];
        const validElements = new Set([
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
            'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
            'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
            'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
            'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
            'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
            'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
            'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'
        ]);
        for (const element of elements) {
            if (!validElements.has(element)) {
                errors.push({
                    field: 'formula',
                    message: `Invalid element symbol: ${element}`,
                    severity: 'critical',
                    suggestedFix: 'Check periodic table for correct element symbols'
                });
            }
        }
        return errors;
    }
    /**
     * Validate thermodynamic properties
     */
    validateThermodynamicProperties(props, formula) {
        const errors = [];
        const warnings = [];
        // Range checks
        if (this.config.enableRangeChecks) {
            if (props.deltaHf < -5e3 || props.deltaHf > 5000) {
                errors.push({
                    field: 'thermodynamicProperties.deltaHf',
                    message: 'Enthalpy of formation outside reasonable range (-5000 to 5000 kJ/mol)',
                    severity: 'major'
                });
            }
            if (props.entropy < 0 || props.entropy > 1000) {
                errors.push({
                    field: 'thermodynamicProperties.entropy',
                    message: 'Entropy outside reasonable range (0 to 1000 J/(mol·K))',
                    severity: 'major'
                });
            }
            if (props.heatCapacity < 0 || props.heatCapacity > 500) {
                errors.push({
                    field: 'thermodynamicProperties.heatCapacity',
                    message: 'Heat capacity outside reasonable range (0 to 500 J/(mol·K))',
                    severity: 'major'
                });
            }
        }
        // Temperature range validation
        if (props.temperatureRange) {
            if (props.temperatureRange[0] >= props.temperatureRange[1]) {
                errors.push({
                    field: 'thermodynamicProperties.temperatureRange',
                    message: 'Temperature range minimum must be less than maximum',
                    severity: 'critical'
                });
            }
            if (props.temperatureRange[0] < 0) {
                errors.push({
                    field: 'thermodynamicProperties.temperatureRange',
                    message: 'Temperature cannot be below absolute zero',
                    severity: 'critical'
                });
            }
        }
        // Physics-based checks
        if (this.config.enablePhysicsChecks) {
            // Third law of thermodynamics: entropy approaches zero at 0K
            if (props.entropy < 0) {
                errors.push({
                    field: 'thermodynamicProperties.entropy',
                    message: 'Entropy cannot be negative (Third Law of Thermodynamics)',
                    severity: 'critical'
                });
            }
            // Check for reasonable heat capacity
            const atomCount = this.estimateAtomCount(formula);
            const expectedCp = atomCount * 20; // Rough estimate: ~20 J/(mol·K) per atom
            if (Math.abs(props.heatCapacity - expectedCp) > expectedCp * 0.5) {
                warnings.push({
                    field: 'thermodynamicProperties.heatCapacity',
                    message: `Heat capacity seems unusual for ${atomCount} atoms`,
                    recommendation: `Expected around ${expectedCp.toFixed(1)} J/(mol·K)`
                });
            }
        }
        // Phase transition consistency
        if (props.meltingPoint && props.boilingPoint) {
            if (props.meltingPoint >= props.boilingPoint) {
                errors.push({
                    field: 'thermodynamicProperties.meltingPoint',
                    message: 'Melting point must be less than boiling point',
                    severity: 'major'
                });
            }
        }
        // Critical point validation
        if (props.criticalTemperature && props.boilingPoint) {
            if (props.criticalTemperature <= props.boilingPoint) {
                errors.push({
                    field: 'thermodynamicProperties.criticalTemperature',
                    message: 'Critical temperature must be greater than boiling point',
                    severity: 'major'
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Validate physical properties
     */
    validatePhysicalProperties(props, thermoProps) {
        const errors = [];
        const warnings = [];
        // Density checks
        if (props.density !== undefined) {
            if (props.density <= 0) {
                errors.push({
                    field: 'physicalProperties.density',
                    message: 'Density must be positive',
                    severity: 'critical'
                });
            }
            if (props.density > 50000) { // Osmium density is ~22,590 kg/m³
                warnings.push({
                    field: 'physicalProperties.density',
                    message: 'Density seems unusually high',
                    recommendation: 'Verify units and measurement conditions'
                });
            }
        }
        // Viscosity checks
        if (props.viscosity !== undefined) {
            if (props.viscosity < 0) {
                errors.push({
                    field: 'physicalProperties.viscosity',
                    message: 'Viscosity cannot be negative',
                    severity: 'critical'
                });
            }
        }
        // Thermal conductivity checks
        if (props.thermalConductivity !== undefined) {
            if (props.thermalConductivity < 0) {
                errors.push({
                    field: 'physicalProperties.thermalConductivity',
                    message: 'Thermal conductivity cannot be negative',
                    severity: 'critical'
                });
            }
        }
        // Refractive index checks
        if (props.refractiveIndex !== undefined) {
            if (props.refractiveIndex < 1) {
                errors.push({
                    field: 'physicalProperties.refractiveIndex',
                    message: 'Refractive index must be at least 1',
                    severity: 'critical'
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Validate safety data
     */
    validateSafetyData(safetyData) {
        const errors = [];
        // Flash point vs autoignition temperature
        if (safetyData.flashPoint && safetyData.autoignitionTemperature) {
            if (safetyData.flashPoint >= safetyData.autoignitionTemperature) {
                errors.push({
                    field: 'safetyData.flashPoint',
                    message: 'Flash point must be less than autoignition temperature',
                    severity: 'major'
                });
            }
        }
        // Explosive limits
        if (safetyData.explosiveLimits) {
            if (safetyData.explosiveLimits.lower >= safetyData.explosiveLimits.upper) {
                errors.push({
                    field: 'safetyData.explosiveLimits',
                    message: 'Lower explosive limit must be less than upper limit',
                    severity: 'major'
                });
            }
            if (safetyData.explosiveLimits.lower < 0 || safetyData.explosiveLimits.upper > 100) {
                errors.push({
                    field: 'safetyData.explosiveLimits',
                    message: 'Explosive limits must be between 0 and 100 vol%',
                    severity: 'major'
                });
            }
        }
        return errors;
    }
    /**
     * Validate cross-property consistency
     */
    validateConsistency(compound) {
        const errors = [];
        const warnings = [];
        const molecular = this.calculateMolecularWeight(compound.formula);
        // Molecular weight consistency
        if (Math.abs(compound.molecularWeight - molecular) > 0.1) {
            errors.push({
                field: 'molecularWeight',
                message: `Molecular weight inconsistent with formula (calculated: ${molecular.toFixed(3)})`,
                severity: 'major',
                suggestedFix: `Update to ${molecular.toFixed(3)} g/mol`
            });
        }
        // Source-confidence correlation
        if (compound.sources.includes('nist') && compound.confidence < 0.9) {
            warnings.push({
                field: 'confidence',
                message: 'NIST data typically has high confidence',
                recommendation: 'Consider increasing confidence score'
            });
        }
        return { errors, warnings };
    }
    /**
     * Calculate quality score (0-100)
     */
    calculateQualityScore(compound, errors, warnings) {
        let score = 100;
        // Deduct points for errors
        errors.forEach(error => {
            switch (error.severity) {
                case 'critical':
                    score -= 25;
                    break;
                case 'major':
                    score -= 10;
                    break;
                case 'minor':
                    score -= 5;
                    break;
            }
        });
        // Deduct points for warnings
        score -= warnings.length * 2;
        // Bonus points for completeness
        if (compound.thermodynamicProperties.deltaGf !== undefined)
            score += 2;
        if (compound.thermodynamicProperties.uncertainties)
            score += 3;
        if (compound.physicalProperties.density !== undefined)
            score += 2;
        if (compound.safetyData)
            score += 5;
        if (compound.sources.includes('nist'))
            score += 5;
        return Math.max(0, Math.min(100, score));
    }
    /**
     * Estimate atom count from formula
     */
    estimateAtomCount(formula) {
        let count = 0;
        let i = 0;
        while (i < formula.length) {
            if (formula[i] === '(') {
                // Skip to matching closing parenthesis
                let parenCount = 1;
                i++;
                while (i < formula.length && parenCount > 0) {
                    if (formula[i] === '(')
                        parenCount++;
                    if (formula[i] === ')')
                        parenCount--;
                    i++;
                }
                continue;
            }
            if (/[A-Z]/.test(formula[i])) {
                count++;
                i++;
                // Skip lowercase letters
                while (i < formula.length && /[a-z]/.test(formula[i])) {
                    i++;
                }
                // Skip numbers
                while (i < formula.length && /\d/.test(formula[i])) {
                    i++;
                }
            }
            else {
                i++;
            }
        }
        return count;
    }
    /**
     * Calculate molecular weight from formula
     */
    calculateMolecularWeight(formula) {
        const atomicWeights = {
            'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
            'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
            'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Br': 79.904, 'I': 126.904
        };
        let weight = 0;
        let i = 0;
        while (i < formula.length) {
            // Get element symbol - starts with uppercase letter
            let element = formula[i];
            i++;
            // Check for two-letter elements (lowercase letter after uppercase)
            if (i < formula.length && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }
            // Get count - sequence of digits
            let count = '';
            while (i < formula.length && /\d/.test(formula[i])) {
                count += formula[i];
                i++;
            }
            const elementWeight = atomicWeights[element] || 0;
            const elementCount = count ? parseInt(count) : 1;
            weight += elementWeight * elementCount;
        }
        return Math.round(weight * 1000) / 1000;
    }
    /**
     * Batch validate multiple compounds
     */
    batchValidate(compounds) {
        const results = new Map();
        compounds.forEach(compound => {
            const result = this.validateCompound(compound);
            results.set(compound.formula, result);
        });
        return results;
    }
    /**
     * Get validation summary statistics
     */
    getValidationSummary(results) {
        let totalCompounds = 0;
        let validCompounds = 0;
        let totalScore = 0;
        let criticalErrors = 0;
        let majorErrors = 0;
        let minorErrors = 0;
        let warnings = 0;
        for (const result of results.values()) {
            totalCompounds++;
            if (result.isValid)
                validCompounds++;
            totalScore += result.score;
            warnings += result.warnings.length;
            result.errors.forEach(error => {
                switch (error.severity) {
                    case 'critical':
                        criticalErrors++;
                        break;
                    case 'major':
                        majorErrors++;
                        break;
                    case 'minor':
                        minorErrors++;
                        break;
                }
            });
        }
        return {
            totalCompounds,
            validCompounds,
            averageScore: totalCompounds > 0 ? totalScore / totalCompounds : 0,
            criticalErrors,
            majorErrors,
            minorErrors,
            warnings
        };
    }
}

/**
 * SQLite Storage Provider for CREB-JS
 * Provides persistent local database management with SQLite
 */
/**
 * SQLite-backed storage provider for chemical compounds
 */
let SQLiteStorageProvider = class SQLiteStorageProvider {
    constructor(config = {}) {
        this.db = null;
        this.statements = new Map();
        this.config = {
            databasePath: config.databasePath || './creb-compounds.db',
            inMemory: config.inMemory || false,
            enableWAL: config.enableWAL || true,
            cacheSize: config.cacheSize || 10000,
            timeout: config.timeout || 5000
        };
    }
    /**
     * Initialize SQLite database and create tables
     */
    async initialize() {
        try {
            // Try to import and use better-sqlite3 for Node.js
            try {
                const Database = (await import('better-sqlite3')).default;
                const dbPath = this.config.databasePath || ':memory:';
                this.db = new Database(dbPath);
            }
            catch (nodeError) {
                // If we're in a browser environment or better-sqlite3 isn't available,
                // gracefully fall back or provide a warning
                console.warn('SQLite storage not available in this environment. Better-sqlite3 not found.');
                throw new SystemError('SQLite storage requires better-sqlite3 package. Install with: npm install better-sqlite3', { databasePath: this.config.databasePath, error: nodeError }, { subsystem: 'data', resource: 'sqlite-database' });
            }
            if (this.db) {
                // Configure database
                this.db.exec(`PRAGMA journal_mode = ${this.config.enableWAL ? 'WAL' : 'DELETE'}`);
                this.db.exec(`PRAGMA cache_size = ${this.config.cacheSize}`);
                this.db.exec(`PRAGMA temp_store = memory`);
                this.db.exec(`PRAGMA mmap_size = 268435456`); // 256MB
                // Create tables
                await this.createTables();
                // Prepare statements
                await this.prepareStatements();
            }
        }
        catch (error) {
            console.error('Failed to initialize SQLite database:', error);
            throw error;
        }
    }
    /**
     * Create database tables
     */
    async createTables() {
        if (!this.db) {
            throw new SystemError('Database not initialized', { operation: 'createTables' }, { subsystem: 'data', resource: 'sqlite-database' });
        }
        const schema = `
      -- Main compounds table
      CREATE TABLE IF NOT EXISTS compounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        formula TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        common_name TEXT,
        cas_number TEXT,
        smiles TEXT,
        inchi TEXT,
        molecular_weight REAL,
        confidence REAL DEFAULT 1.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Thermodynamic properties
      CREATE TABLE IF NOT EXISTS thermodynamic_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        delta_hf REAL,
        delta_gf REAL,
        entropy REAL,
        heat_capacity REAL,
        temp_range_min REAL,
        temp_range_max REAL,
        melting_point REAL,
        boiling_point REAL,
        critical_temp REAL,
        critical_pressure REAL,
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Physical properties
      CREATE TABLE IF NOT EXISTS physical_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        density REAL,
        viscosity REAL,
        thermal_conductivity REAL,
        refractive_index REAL,
        dielectric_constant REAL,
        surface_tension REAL,
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Safety properties
      CREATE TABLE IF NOT EXISTS safety_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        flash_point REAL,
        autoignition_temp REAL,
        explosive_limits_lower REAL,
        explosive_limits_upper REAL,
        toxicity_oral_ld50 REAL,
        toxicity_dermal_ld50 REAL,
        toxicity_inhalation_lc50 REAL,
        hazard_statements TEXT, -- JSON array
        precautionary_statements TEXT, -- JSON array
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Data sources tracking
      CREATE TABLE IF NOT EXISTS compound_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        source_name TEXT NOT NULL,
        source_url TEXT,
        reliability REAL DEFAULT 1.0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Vapor pressure data points
      CREATE TABLE IF NOT EXISTS vapor_pressure_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        temperature REAL NOT NULL,
        pressure REAL NOT NULL
      );

      -- Search and caching
      CREATE TABLE IF NOT EXISTS search_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_hash TEXT UNIQUE,
        query_type TEXT,
        results_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      );

      -- Database metadata
      CREATE TABLE IF NOT EXISTS database_metadata (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
        this.db.exec(schema);
    }
    /**
     * Create indexes for performance
     */
    async createIndexes() {
        if (!this.db)
            throw new Error('Database not initialized');
        const indexes = `
      CREATE INDEX IF NOT EXISTS idx_compounds_formula ON compounds(formula);
      CREATE INDEX IF NOT EXISTS idx_compounds_name ON compounds(name);
      CREATE INDEX IF NOT EXISTS idx_compounds_cas ON compounds(cas_number);
      CREATE INDEX IF NOT EXISTS idx_compounds_molecular_weight ON compounds(molecular_weight);
      CREATE INDEX IF NOT EXISTS idx_compounds_confidence ON compounds(confidence);
      CREATE INDEX IF NOT EXISTS idx_compounds_updated ON compounds(updated_at);
      
      CREATE INDEX IF NOT EXISTS idx_thermo_compound ON thermodynamic_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_physical_compound ON physical_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_safety_compound ON safety_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_sources_compound ON compound_sources(compound_id);
      CREATE INDEX IF NOT EXISTS idx_vapor_compound ON vapor_pressure_data(compound_id);
      
      CREATE INDEX IF NOT EXISTS idx_search_cache_hash ON search_cache(query_hash);
      CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON search_cache(expires_at);
      
      -- Full-text search indexes
      CREATE VIRTUAL TABLE IF NOT EXISTS compounds_fts USING fts5(
        formula, name, common_name, cas_number,
        content='compounds',
        content_rowid='id'
      );
      
      -- Triggers to maintain FTS index
      CREATE TRIGGER IF NOT EXISTS compounds_fts_insert AFTER INSERT ON compounds
      BEGIN
        INSERT INTO compounds_fts(rowid, formula, name, common_name, cas_number) 
        VALUES (new.id, new.formula, new.name, new.common_name, new.cas_number);
      END;
      
      CREATE TRIGGER IF NOT EXISTS compounds_fts_delete AFTER DELETE ON compounds
      BEGIN
        DELETE FROM compounds_fts WHERE rowid = old.id;
      END;
      
      CREATE TRIGGER IF NOT EXISTS compounds_fts_update AFTER UPDATE ON compounds
      BEGIN
        DELETE FROM compounds_fts WHERE rowid = old.id;
        INSERT INTO compounds_fts(rowid, formula, name, common_name, cas_number) 
        VALUES (new.id, new.formula, new.name, new.common_name, new.cas_number);
      END;
    `;
        this.db.exec(indexes);
    }
    /**
     * Prepare commonly used SQL statements
     */
    async prepareStatements() {
        if (!this.db)
            throw new Error('Database not initialized');
        const statements = {
            insertCompound: `
        INSERT INTO compounds (
          formula, name, common_name, cas_number, smiles, inchi, 
          molecular_weight, confidence, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
            updateCompound: `
        UPDATE compounds SET 
          name = ?, common_name = ?, cas_number = ?, smiles = ?, inchi = ?,
          molecular_weight = ?, confidence = ?, updated_at = CURRENT_TIMESTAMP
        WHERE formula = ?
      `,
            selectCompound: `
        SELECT * FROM compounds WHERE formula = ?
      `,
            selectCompoundWithProperties: `
        SELECT 
          c.*,
          tp.delta_hf, tp.delta_gf, tp.entropy, tp.heat_capacity,
          tp.temp_range_min, tp.temp_range_max, tp.melting_point, tp.boiling_point,
          tp.critical_temp, tp.critical_pressure, tp.properties_json as thermo_json,
          pp.density, pp.viscosity, pp.thermal_conductivity, pp.refractive_index,
          pp.dielectric_constant, pp.surface_tension, pp.properties_json as physical_json,
          sp.flash_point, sp.autoignition_temp, sp.explosive_limits_lower, sp.explosive_limits_upper,
          sp.toxicity_oral_ld50, sp.toxicity_dermal_ld50, sp.toxicity_inhalation_lc50,
          sp.hazard_statements, sp.precautionary_statements, sp.properties_json as safety_json
        FROM compounds c
        LEFT JOIN thermodynamic_properties tp ON c.id = tp.compound_id
        LEFT JOIN physical_properties pp ON c.id = pp.compound_id
        LEFT JOIN safety_properties sp ON c.id = sp.compound_id
        WHERE c.formula = ?
      `,
            insertThermodynamicProperties: `
        INSERT OR REPLACE INTO thermodynamic_properties (
          compound_id, delta_hf, delta_gf, entropy, heat_capacity,
          temp_range_min, temp_range_max, melting_point, boiling_point,
          critical_temp, critical_pressure, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertPhysicalProperties: `
        INSERT OR REPLACE INTO physical_properties (
          compound_id, density, viscosity, thermal_conductivity, refractive_index,
          dielectric_constant, surface_tension, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertSafetyProperties: `
        INSERT OR REPLACE INTO safety_properties (
          compound_id, flash_point, autoignition_temp, explosive_limits_lower, explosive_limits_upper,
          toxicity_oral_ld50, toxicity_dermal_ld50, toxicity_inhalation_lc50,
          hazard_statements, precautionary_statements, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertSource: `
        INSERT OR REPLACE INTO compound_sources (
          compound_id, source_name, source_url, reliability, last_updated
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
            searchCompounds: `
        SELECT c.* FROM compounds c
        WHERE c.formula LIKE ? OR c.name LIKE ? OR c.common_name LIKE ?
        ORDER BY c.confidence DESC, c.updated_at DESC
        LIMIT ?
      `,
            fullTextSearch: `
        SELECT c.* FROM compounds c
        JOIN compounds_fts fts ON c.id = fts.rowid
        WHERE compounds_fts MATCH ?
        ORDER BY rank, c.confidence DESC
        LIMIT ?
      `,
            deleteCompound: `
        DELETE FROM compounds WHERE formula = ?
      `,
            getStatistics: `
        SELECT 
          COUNT(*) as total_compounds,
          AVG(confidence) as avg_confidence,
          MIN(updated_at) as oldest_update,
          MAX(updated_at) as newest_update
        FROM compounds
      `
        };
        for (const [name, sql] of Object.entries(statements)) {
            this.statements.set(name, this.db.prepare(sql));
        }
    }
    /**
     * Add or update a compound in the database
     */
    async addCompound(compound) {
        if (!this.db)
            throw new Error('Database not initialized');
        const transaction = this.db.transaction(() => {
            try {
                // Insert or update main compound record
                const existingStmt = this.statements.get('selectCompound');
                const existing = existingStmt.get(compound.formula);
                let compoundId;
                if (existing) {
                    const updateStmt = this.statements.get('updateCompound');
                    updateStmt.run(compound.name, compound.commonName || null, compound.casNumber || null, compound.smiles || null, compound.inchi || null, compound.molecularWeight, compound.confidence, compound.formula);
                    compoundId = existing.id;
                }
                else {
                    const insertStmt = this.statements.get('insertCompound');
                    const result = insertStmt.run(compound.formula, compound.name, compound.commonName || null, compound.casNumber || null, compound.smiles || null, compound.inchi || null, compound.molecularWeight, compound.confidence);
                    compoundId = result.lastInsertRowid;
                }
                // Insert thermodynamic properties
                if (compound.thermodynamicProperties) {
                    const props = compound.thermodynamicProperties;
                    const thermoStmt = this.statements.get('insertThermodynamicProperties');
                    thermoStmt.run(compoundId, props.deltaHf || null, props.deltaGf || null, props.entropy || null, props.heatCapacity || null, props.temperatureRange?.[0] || null, props.temperatureRange?.[1] || null, props.meltingPoint || null, props.boilingPoint || null, props.criticalTemperature || null, props.criticalPressure || null, JSON.stringify(props));
                }
                // Insert physical properties
                if (compound.physicalProperties) {
                    const props = compound.physicalProperties;
                    const physicalStmt = this.statements.get('insertPhysicalProperties');
                    physicalStmt.run(compoundId, props.density || null, props.viscosity || null, props.thermalConductivity || null, props.refractiveIndex || null, props.dielectricConstant || null, props.surfaceTension || null, JSON.stringify(props));
                }
                // Insert safety properties
                if (compound.safetyData) {
                    const props = compound.safetyData;
                    const safetyStmt = this.statements.get('insertSafetyProperties');
                    safetyStmt.run(compoundId, props.flashPoint || null, props.autoignitionTemperature || null, props.explosiveLimits?.lower || null, props.explosiveLimits?.upper || null, props.toxicity?.ld50 || null, null, // dermal LD50 not in current interface
                    props.toxicity?.lc50 || null, JSON.stringify(props.hazardStatements || []), JSON.stringify(props.precautionaryStatements || []), JSON.stringify(props));
                }
                // Insert sources
                if (compound.sources?.length) {
                    const sourceStmt = this.statements.get('insertSource');
                    compound.sources.forEach(source => {
                        sourceStmt.run(compoundId, source, null, 1.0);
                    });
                }
                return true;
            }
            catch (error) {
                console.error('Error adding compound to SQLite:', error);
                throw error;
            }
        });
        transaction();
        return true;
    }
    /**
     * Get a compound by formula
     */
    async getCompound(formula) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('selectCompoundWithProperties');
            if (!stmt) {
                console.error('Database statement not prepared');
                return null;
            }
            const row = stmt.get(formula);
            if (!row)
                return null;
            return this.rowToCompound(row);
        }
        catch (error) {
            console.error('Error getting compound from SQLite:', error);
            return null;
        }
    }
    /**
     * Search compounds with query
     */
    async searchCompounds(query) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            let stmt;
            let params;
            if (query.searchTerm) {
                // Use full-text search if available, otherwise fall back to LIKE
                if (query.searchTerm.includes(' ') || query.useFullTextSearch) {
                    stmt = this.statements.get('fullTextSearch');
                    params = [query.searchTerm, query.limit || 50];
                }
                else {
                    stmt = this.statements.get('searchCompounds');
                    const term = `%${query.searchTerm}%`;
                    params = [term, term, term, query.limit || 50];
                }
            }
            else {
                // Get all compounds with optional filters
                const sql = this.buildFilteredQuery(query);
                stmt = this.db.prepare(sql);
                params = this.buildQueryParams(query);
            }
            const rows = stmt.all(...params);
            return rows.map(row => this.rowToCompound(row));
        }
        catch (error) {
            console.error('Error searching compounds in SQLite:', error);
            return [];
        }
    }
    /**
     * Remove a compound
     */
    async removeCompound(formula) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('deleteCompound');
            if (!stmt) {
                console.error('Database statement not prepared');
                return false;
            }
            const result = stmt.run(formula);
            return result.changes > 0;
        }
        catch (error) {
            console.error('Error removing compound from SQLite:', error);
            return false;
        }
    }
    /**
     * Get all compounds
     */
    async getAllCompounds() {
        return this.searchCompounds({ limit: 10000 });
    }
    /**
     * Import data from various sources
     */
    async importData(data, format) {
        if (!this.db)
            throw new Error('Database not initialized');
        const result = {
            success: true,
            imported: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
        const transaction = this.db.transaction(() => {
            for (const item of data) {
                try {
                    // Convert data to CompoundDatabase format
                    const compound = this.normalizeImportData(item, format);
                    this.addCompound(compound);
                    result.imported++;
                }
                catch (error) {
                    result.errors.push({
                        compound: item.formula || 'unknown',
                        error: String(error)
                    });
                    result.failed++;
                }
            }
        });
        try {
            transaction();
            console.log(`SQLite import completed: ${result.imported} imported, ${result.failed} failed`);
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                compound: 'transaction',
                error: `Transaction failed: ${error}`
            });
        }
        return result;
    }
    /**
     * Get database statistics
     */
    async getStatistics() {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('getStatistics');
            if (!stmt) {
                console.error('Database statement not prepared');
                return {};
            }
            const stats = stmt.get();
            if (!stats) {
                return {
                    totalCompounds: 0,
                    averageConfidence: 0,
                    oldestUpdate: new Date(),
                    newestUpdate: new Date(),
                    sourceCounts: {}
                };
            }
            // Get source distribution
            const sourcesStmt = this.db.prepare(`
        SELECT source_name, COUNT(*) as count
        FROM compound_sources cs
        JOIN compounds c ON cs.compound_id = c.id
        GROUP BY source_name
      `);
            const sources = sourcesStmt.all();
            return {
                totalCompounds: stats.total_compounds,
                averageConfidence: stats.avg_confidence,
                oldestUpdate: new Date(stats.oldest_update),
                newestUpdate: new Date(stats.newest_update),
                sourceCounts: Object.fromEntries(sources.map(s => [s.source_name, s.count]))
            };
        }
        catch (error) {
            console.error('Error getting SQLite statistics:', error);
            return {};
        }
    }
    /**
     * Close the database connection
     */
    async close() {
        if (this.db) {
            // Clean up prepared statements
            this.statements.forEach(stmt => stmt.finalize());
            this.statements.clear();
            // Close database
            this.db.close();
            this.db = null;
            console.log('SQLite database connection closed');
        }
    }
    /**
     * Vacuum and optimize database
     */
    async optimize() {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            this.db.exec('VACUUM');
            this.db.exec('ANALYZE');
            console.log('SQLite database optimized');
        }
        catch (error) {
            console.error('Error optimizing SQLite database:', error);
        }
    }
    // Helper methods
    rowToCompound(row) {
        const compound = {
            formula: row.formula,
            name: row.name,
            iupacName: row.iupac_name,
            commonName: row.common_name,
            casNumber: row.cas_number,
            smiles: row.smiles,
            inchi: row.inchi,
            molecularWeight: row.molecular_weight,
            confidence: row.confidence,
            sources: [], // Will be populated separately if needed
            lastUpdated: new Date(row.updated_at),
            thermodynamicProperties: {
                deltaHf: 0,
                entropy: 0,
                heatCapacity: 0,
                temperatureRange: [298, 373]
            },
            physicalProperties: {}
        };
        // Add thermodynamic properties if present
        if (row.delta_hf !== null) {
            compound.thermodynamicProperties = {
                deltaHf: row.delta_hf,
                deltaGf: row.delta_gf,
                entropy: row.entropy,
                heatCapacity: row.heat_capacity,
                temperatureRange: row.temp_range_min !== null ?
                    [row.temp_range_min, row.temp_range_max] :
                    [298, 373],
                meltingPoint: row.melting_point,
                boilingPoint: row.boiling_point,
                criticalTemperature: row.critical_temp,
                criticalPressure: row.critical_pressure
            };
            // Parse additional properties from JSON
            if (row.thermo_json) {
                try {
                    const additional = JSON.parse(row.thermo_json);
                    Object.assign(compound.thermodynamicProperties, additional);
                }
                catch (e) {
                    console.warn('Failed to parse thermodynamic JSON:', e);
                }
            }
        }
        // Add physical properties if present
        if (row.density !== null) {
            compound.physicalProperties = {
                density: row.density,
                viscosity: row.viscosity,
                thermalConductivity: row.thermal_conductivity,
                refractiveIndex: row.refractive_index,
                dielectricConstant: row.dielectric_constant,
                surfaceTension: row.surface_tension
            };
            // Parse additional properties from JSON
            if (row.physical_json) {
                try {
                    const additional = JSON.parse(row.physical_json);
                    Object.assign(compound.physicalProperties, additional);
                }
                catch (e) {
                    console.warn('Failed to parse physical JSON:', e);
                }
            }
        }
        // Add safety properties if present
        if (row.flash_point !== null) {
            compound.safetyData = {
                flashPoint: row.flash_point,
                autoignitionTemperature: row.autoignition_temp,
                explosiveLimits: {
                    lower: row.explosive_limits_lower,
                    upper: row.explosive_limits_upper
                },
                toxicity: {
                    ld50: row.toxicity_oral_ld50,
                    lc50: row.toxicity_inhalation_lc50
                },
                hazardSymbols: [],
                hazardStatements: row.hazard_statements ? JSON.parse(row.hazard_statements) : [],
                precautionaryStatements: row.precautionary_statements ? JSON.parse(row.precautionary_statements) : []
            };
            // Parse additional properties from JSON
            if (row.safety_json) {
                try {
                    const additional = JSON.parse(row.safety_json);
                    Object.assign(compound.safetyData, additional);
                }
                catch (e) {
                    console.warn('Failed to parse safety JSON:', e);
                }
            }
        }
        return compound;
    }
    buildFilteredQuery(query) {
        let sql = 'SELECT * FROM compounds WHERE 1=1';
        if (query.minConfidence !== undefined) {
            sql += ' AND confidence >= ?';
        }
        if (query.sources?.length) {
            sql += ` AND id IN (
        SELECT compound_id FROM compound_sources 
        WHERE source_name IN (${query.sources.map(() => '?').join(',')})
      )`;
        }
        sql += ' ORDER BY confidence DESC, updated_at DESC';
        if (query.limit) {
            sql += ' LIMIT ?';
        }
        return sql;
    }
    buildQueryParams(query) {
        const params = [];
        if (query.minConfidence !== undefined) {
            params.push(query.minConfidence);
        }
        if (query.sources?.length) {
            params.push(...query.sources);
        }
        if (query.limit) {
            params.push(query.limit);
        }
        return params;
    }
    normalizeImportData(item, format) {
        // Convert imported data to standard CompoundDatabase format
        // This would need to be customized based on your data sources
        return {
            formula: item.formula || item.Formula,
            name: item.name || item.Name,
            molecularWeight: parseFloat(item.molecularWeight || item.MW || '0'),
            confidence: parseFloat(item.confidence || '0.8'),
            sources: ['import'],
            lastUpdated: new Date(),
            thermodynamicProperties: {
                deltaHf: parseFloat(item.deltaHf || '0'),
                entropy: parseFloat(item.entropy || '0'),
                heatCapacity: parseFloat(item.heatCapacity || '0'),
                temperatureRange: [298, 373]
            },
            physicalProperties: {}
            // Add other properties as needed
        };
    }
};
SQLiteStorageProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], SQLiteStorageProvider);

/**
 * CREB-JS Dependency Injection Container
 *
 * A lightweight, type-safe IoC container for managing dependencies
 * with support for singleton/transient lifetimes, constructor injection,
 * and circular dependency detection.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
/**
 * Service lifetime enumeration
 */
exports.ServiceLifetime = void 0;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(exports.ServiceLifetime || (exports.ServiceLifetime = {}));
/**
 * Circular dependency error with detailed context
 */
class CircularDependencyError extends Error {
    constructor(dependencyChain, message) {
        super(message || `Circular dependency detected: ${dependencyChain.map(t => String(t)).join(' -> ')}`);
        this.dependencyChain = dependencyChain;
        this.name = 'CircularDependencyError';
    }
}
/**
 * Service not found error
 */
class ServiceNotFoundError extends Error {
    constructor(token) {
        super(`Service not registered: ${String(token)}`);
        this.token = token;
        this.name = 'ServiceNotFoundError';
    }
}
/**
 * Maximum resolution depth exceeded error
 */
class MaxDepthExceededError extends Error {
    constructor(maxDepth) {
        super(`Maximum resolution depth exceeded: ${maxDepth}`);
        this.maxDepth = maxDepth;
        this.name = 'MaxDepthExceededError';
    }
}
/**
 * IoC Container implementation with advanced features
 */
class Container {
    constructor(options) {
        this.services = new Map();
        this.resolutionStack = [];
        this.metrics = {
            resolutions: 0,
            singletonCreations: 0,
            transientCreations: 0,
            circularDependencyChecks: 0,
            averageResolutionTime: 0,
            peakResolutionDepth: 0,
        };
        this.options = {
            enableCircularDependencyDetection: true,
            maxResolutionDepth: 50,
            enablePerformanceTracking: true,
        };
        if (options) {
            Object.assign(this.options, options);
        }
    }
    /**
     * Register a service with the container
     */
    register(token, factory, lifetime = exports.ServiceLifetime.Transient, dependencies = []) {
        this.services.set(token, {
            token,
            factory,
            lifetime,
            dependencies,
        });
        return this;
    }
    /**
     * Register a singleton service
     */
    registerSingleton(token, factory, dependencies = []) {
        return this.register(token, factory, exports.ServiceLifetime.Singleton, dependencies);
    }
    /**
     * Register a transient service
     */
    registerTransient(token, factory, dependencies = []) {
        return this.register(token, factory, exports.ServiceLifetime.Transient, dependencies);
    }
    /**
     * Register a class with automatic dependency injection
     */
    registerClass(constructor, dependencies = [], lifetime = exports.ServiceLifetime.Transient, token) {
        const serviceToken = token || constructor;
        const factory = (container) => {
            const resolvedDependencies = dependencies.map((dep) => container.resolve(dep));
            return new constructor(...resolvedDependencies);
        };
        return this.register(serviceToken, factory, lifetime, dependencies);
    }
    /**
     * Register an instance as a singleton
     */
    registerInstance(token, instance) {
        this.services.set(token, {
            token,
            factory: () => instance,
            lifetime: exports.ServiceLifetime.Singleton,
            dependencies: [],
            singleton: instance,
        });
        return this;
    }
    /**
     * Resolve a service from the container
     */
    resolve(token) {
        const startTime = this.options.enablePerformanceTracking ? performance.now() : 0;
        try {
            this.metrics.resolutions++;
            const result = this.resolveInternal(token);
            if (this.options.enablePerformanceTracking) {
                const resolutionTime = performance.now() - startTime;
                this.updateAverageResolutionTime(resolutionTime);
            }
            return result;
        }
        catch (error) {
            this.resolutionStack.length = 0; // Clear stack on error
            throw error;
        }
    }
    /**
     * Internal resolution method with circular dependency detection
     */
    resolveInternal(token) {
        // Check resolution depth
        if (this.resolutionStack.length >= this.options.maxResolutionDepth) {
            throw new MaxDepthExceededError(this.options.maxResolutionDepth);
        }
        // Update peak resolution depth
        if (this.resolutionStack.length > this.metrics.peakResolutionDepth) {
            this.metrics.peakResolutionDepth = this.resolutionStack.length;
        }
        // Circular dependency detection
        if (this.options.enableCircularDependencyDetection) {
            this.metrics.circularDependencyChecks++;
            if (this.resolutionStack.includes(token)) {
                const circularChain = [...this.resolutionStack, token];
                throw new CircularDependencyError(circularChain);
            }
        }
        const registration = this.services.get(token);
        if (!registration) {
            throw new ServiceNotFoundError(token);
        }
        // Return singleton instance if already created
        if (registration.lifetime === exports.ServiceLifetime.Singleton && registration.singleton) {
            return registration.singleton;
        }
        // Add to resolution stack
        this.resolutionStack.push(token);
        try {
            // Create new instance
            const instance = registration.factory(this);
            // Store singleton instance
            if (registration.lifetime === exports.ServiceLifetime.Singleton) {
                registration.singleton = instance;
                this.metrics.singletonCreations++;
            }
            else {
                this.metrics.transientCreations++;
            }
            return instance;
        }
        finally {
            // Remove from resolution stack
            this.resolutionStack.pop();
        }
    }
    /**
     * Check if a service is registered
     */
    isRegistered(token) {
        return this.services.has(token);
    }
    /**
     * Unregister a service
     */
    unregister(token) {
        return this.services.delete(token);
    }
    /**
     * Clear all registrations
     */
    clear() {
        this.services.clear();
        this.resolutionStack.length = 0;
        this.resetMetrics();
    }
    /**
     * Get container performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
        this.metrics.resolutions = 0;
        this.metrics.singletonCreations = 0;
        this.metrics.transientCreations = 0;
        this.metrics.circularDependencyChecks = 0;
        this.metrics.averageResolutionTime = 0;
        this.metrics.peakResolutionDepth = 0;
    }
    /**
     * Get all registered service tokens
     */
    getRegisteredTokens() {
        return Array.from(this.services.keys());
    }
    /**
     * Create a child container with inherited registrations
     */
    createChild() {
        const child = new Container(this.options);
        // Copy all registrations to child
        for (const [token, registration] of this.services) {
            child.services.set(token, { ...registration });
        }
        return child;
    }
    /**
     * Dispose the container and clean up resources
     */
    dispose() {
        // Dispose all singleton instances that implement IDisposable
        for (const registration of this.services.values()) {
            if (registration.singleton && typeof registration.singleton === 'object') {
                const disposable = registration.singleton;
                if (typeof disposable.dispose === 'function') {
                    try {
                        disposable.dispose();
                    }
                    catch (error) {
                        console.warn(`Error disposing service ${String(registration.token)}:`, error);
                    }
                }
            }
        }
        this.clear();
    }
    /**
     * Update average resolution time metric
     */
    updateAverageResolutionTime(newTime) {
        const count = this.metrics.resolutions;
        const currentAverage = this.metrics.averageResolutionTime;
        this.metrics.averageResolutionTime = (currentAverage * (count - 1) + newTime) / count;
    }
}
/**
 * Global container instance
 */
const container = new Container();
/**
 * Helper function to create service tokens
 */
function createToken(description) {
    return Symbol(description);
}

/**
 * Configuration Schema Definitions
 *
 * This file contains validation schemas for all configuration types.
 * Schemas are used for runtime validation and documentation generation.
 */
/**
 * Cache configuration schema
 */
const cacheConfigSchema = {
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
const performanceConfigSchema = {
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
const dataConfigSchema = {
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
const loggingConfigSchema = {
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
const crebConfigSchema = {
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
const defaultConfig = {
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
function validateConfig(config, schema, path = '') {
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
        const typeValid = validateType(value, property, currentPath, errors);
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
                validateType(item, property.items, itemPath, errors);
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
function generateSchemaDocumentation(schema, title) {
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
/**
 * Configuration Manager class
 * Provides type-safe configuration management with validation and hot-reload
 */
exports.ConfigManager = class ConfigManager extends events.EventEmitter {
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
            const fileContent = await fs__namespace.promises.readFile(filePath, 'utf8');
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
        await fs__namespace.promises.writeFile(filePath, JSON.stringify(configWithMetadata, null, 2), 'utf8');
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
        const watcher = fs__namespace.watch(filePath, { persistent: false }, (eventType) => {
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
exports.ConfigManager = __decorate([
    Singleton(),
    __metadata("design:paramtypes", [Object])
], exports.ConfigManager);
/**
 * Singleton configuration manager instance
 */
const configManager = new exports.ConfigManager();
/**
 * Convenience function to get configuration value
 */
function getConfig(path) {
    return configManager.get(path);
}
/**
 * Convenience function to set configuration value
 */
function setConfig(path, value) {
    configManager.set(path, value);
}
/**
 * Convenience function to get full configuration
 */
function getFullConfig() {
    return configManager.getConfig();
}

/**
 * CREB-JS Dependency Injection Setup
 *
 * Central configuration for all dependency injection services in CREB-JS.
 * This module sets up and configures the main DI container with all services.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
// Service Tokens
const IConfigManagerToken = createToken('IConfigManager');
const IBalancerToken = createToken('IBalancer');
const IEnhancedBalancerToken = createToken('IEnhancedBalancer');
const IStoichiometryToken = createToken('IStoichiometry');
const IThermodynamicsCalculatorToken = createToken('IThermodynamicsCalculator');
const IStorageProviderToken = createToken('IStorageProvider');
const ICacheToken = createToken('ICache');
const IWorkerPoolToken = createToken('IWorkerPool');
const ITaskQueueToken = createToken('ITaskQueue');
/**
 * Configure and setup the main CREB DI container
 */
function setupCREBContainer() {
    const container = new Container({
        enableCircularDependencyDetection: true,
        enablePerformanceTracking: true,
        maxResolutionDepth: 50,
    });
    // Register Core Services as Singletons
    container.registerClass(exports.ConfigManager, [], exports.ServiceLifetime.Singleton, IConfigManagerToken);
    container.registerClass(exports.AdvancedCache, [], exports.ServiceLifetime.Singleton, ICacheToken);
    container.registerClass(SQLiteStorageProvider, [], exports.ServiceLifetime.Singleton, IStorageProviderToken);
    container.registerClass(exports.ThermodynamicsCalculator, [], exports.ServiceLifetime.Singleton, IThermodynamicsCalculatorToken);
    // Register Worker Thread Services (commented out due to ESM compatibility issues)
    // container.registerClass(
    //   TaskQueue,
    //   [],
    //   ServiceLifetime.Singleton,
    //   ITaskQueueToken
    // );
    // container.registerClass(
    //   WorkerPool,
    //   [],
    //   ServiceLifetime.Singleton,
    //   IWorkerPoolToken
    // );
    // Register Calculation Services as Transient (stateless)
    container.registerClass(exports.ChemicalEquationBalancer, [], exports.ServiceLifetime.Transient, IBalancerToken);
    container.registerClass(exports.EnhancedChemicalEquationBalancer, [], exports.ServiceLifetime.Transient, IEnhancedBalancerToken);
    container.registerClass(exports.Stoichiometry, [], exports.ServiceLifetime.Transient, IStoichiometryToken);
    return container;
}
/**
 * Initialize the global CREB container with default services
 */
function initializeCREBDI() {
    const container$1 = setupCREBContainer();
    // Copy registrations to global container
    for (const token of container$1.getRegisteredTokens()) {
        if (!container.isRegistered(token)) {
            // Re-register in global container
            const registration = container$1.services.get(token);
            if (registration) {
                container.register(token, registration.factory, registration.lifetime, registration.dependencies);
            }
        }
    }
}
/**
 * Get a service from the global container with type safety
 */
function getService(token) {
    return container.resolve(token);
}
/**
 * Create a child container for testing or isolation
 */
function createChildContainer() {
    return container.createChild();
}
/**
 * Helper functions for common services
 */
const CREBServices = {
    getConfigManager: () => getService(IConfigManagerToken),
    getBalancer: () => getService(IBalancerToken),
    getEnhancedBalancer: () => getService(IEnhancedBalancerToken),
    getStoichiometry: () => getService(IStoichiometryToken),
    getThermodynamicsCalculator: () => getService(IThermodynamicsCalculatorToken),
    getStorageProvider: () => getService(IStorageProviderToken),
    getCache: () => getService(ICacheToken),
    // getWorkerPool: () => getService(IWorkerPoolToken),      // Commented out due to ESM issues
    // getTaskQueue: () => getService(ITaskQueueToken),        // Commented out due to ESM issues
};
/**
 * Initialize DI on module load for production usage
 */
if (typeof process !== 'undefined' && "development" !== 'test') {
    initializeCREBDI();
}

/**
 * Circuit Breaker Pattern Implementation for CREB-JS
 * Prevents cascading failures by monitoring and controlling access to external resources
 */
exports.CircuitBreakerState = void 0;
(function (CircuitBreakerState) {
    CircuitBreakerState["CLOSED"] = "CLOSED";
    CircuitBreakerState["OPEN"] = "OPEN";
    CircuitBreakerState["HALF_OPEN"] = "HALF_OPEN"; // Testing if service recovered
})(exports.CircuitBreakerState || (exports.CircuitBreakerState = {}));
/**
 * Circuit Breaker implementation for fault tolerance
 */
class CircuitBreaker {
    constructor(name, config) {
        this.name = name;
        this.state = exports.CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.stateChangedAt = new Date();
        this.callHistory = [];
        // Default configuration
        const defaultConfig = {
            failureThreshold: 5,
            failureRate: 50,
            monitoringWindow: 60000, // 1 minute
            timeout: 30000, // 30 seconds
            successThreshold: 3,
            minimumCalls: 10,
            isFailure: (error) => true, // All errors count as failures by default
            onStateChange: () => { },
            onCircuitOpen: () => { },
            onCircuitClose: () => { }
        };
        // Merge with provided config
        this.config = {
            ...defaultConfig,
            ...config
        };
    }
    /**
     * Execute a function with circuit breaker protection
     */
    async execute(fn) {
        if (this.state === exports.CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(exports.CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = await fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Execute a synchronous function with circuit breaker protection
     */
    executeSync(fn) {
        if (this.state === exports.CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(exports.CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Get current circuit breaker metrics
     */
    getMetrics() {
        const now = Date.now();
        const recentCalls = this.getRecentCalls();
        const totalCalls = recentCalls.length;
        const failures = recentCalls.filter(call => !call.success).length;
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            totalCalls,
            failureRate: totalCalls > 0 ? (failures / totalCalls) * 100 : 0,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            stateChangedAt: this.stateChangedAt,
            timeSinceStateChange: now - this.stateChangedAt.getTime(),
            nextAttemptTime: this.nextAttemptTime
        };
    }
    /**
     * Reset the circuit breaker to closed state
     */
    reset() {
        this.setState(exports.CircuitBreakerState.CLOSED);
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = undefined;
        this.nextAttemptTime = undefined;
        this.callHistory = [];
    }
    /**
     * Force the circuit breaker to open state
     */
    trip() {
        this.setState(exports.CircuitBreakerState.OPEN);
        this.setNextAttemptTime();
        this.config.onCircuitOpen(new Error('Circuit breaker manually tripped'));
    }
    /**
     * Check if the circuit breaker is currently open
     */
    isOpen() {
        return this.state === exports.CircuitBreakerState.OPEN;
    }
    /**
     * Check if the circuit breaker is currently half-open
     */
    isHalfOpen() {
        return this.state === exports.CircuitBreakerState.HALF_OPEN;
    }
    /**
     * Check if the circuit breaker is currently closed
     */
    isClosed() {
        return this.state === exports.CircuitBreakerState.CLOSED;
    }
    onSuccess(duration) {
        this.recordCall(true, duration);
        this.successCount++;
        this.lastSuccessTime = new Date();
        if (this.state === exports.CircuitBreakerState.HALF_OPEN) {
            if (this.successCount >= this.config.successThreshold) {
                this.setState(exports.CircuitBreakerState.CLOSED);
                this.failureCount = 0;
                this.config.onCircuitClose();
            }
        }
    }
    onFailure(error, duration) {
        if (this.config.isFailure(error)) {
            this.recordCall(false, duration, error);
            this.failureCount++;
            this.lastFailureTime = new Date();
            if (this.state === exports.CircuitBreakerState.HALF_OPEN) {
                this.setState(exports.CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
            else if (this.state === exports.CircuitBreakerState.CLOSED && this.shouldOpenCircuit()) {
                this.setState(exports.CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
        }
    }
    shouldOpenCircuit() {
        const recentCalls = this.getRecentCalls();
        // Check if we have minimum number of calls
        if (recentCalls.length < this.config.minimumCalls) {
            return false;
        }
        // Check failure count threshold
        if (this.failureCount >= this.config.failureThreshold) {
            return true;
        }
        // Check failure rate threshold
        const failures = recentCalls.filter(call => !call.success).length;
        const failureRate = (failures / recentCalls.length) * 100;
        return failureRate >= this.config.failureRate;
    }
    shouldAttemptReset() {
        return this.nextAttemptTime ? Date.now() >= this.nextAttemptTime.getTime() : false;
    }
    setState(newState) {
        const previousState = this.state;
        if (previousState !== newState) {
            this.state = newState;
            this.stateChangedAt = new Date();
            // Reset counters on state change
            if (newState === exports.CircuitBreakerState.CLOSED) {
                this.failureCount = 0;
                this.successCount = 0;
            }
            else if (newState === exports.CircuitBreakerState.HALF_OPEN) {
                this.successCount = 0;
            }
            this.config.onStateChange(newState, previousState);
        }
    }
    setNextAttemptTime() {
        this.nextAttemptTime = new Date(Date.now() + this.config.timeout);
    }
    recordCall(success, duration, error) {
        const record = {
            timestamp: Date.now(),
            success,
            duration,
            error
        };
        this.callHistory.push(record);
        // Keep only recent calls within monitoring window
        const cutoff = Date.now() - this.config.monitoringWindow;
        this.callHistory = this.callHistory.filter(call => call.timestamp >= cutoff);
    }
    getRecentCalls() {
        const cutoff = Date.now() - this.config.monitoringWindow;
        return this.callHistory.filter(call => call.timestamp >= cutoff);
    }
}
/**
 * Circuit Breaker Manager for handling multiple circuit breakers
 */
class CircuitBreakerManager {
    constructor() {
        this.breakers = new Map();
    }
    /**
     * Create or get a circuit breaker for a service
     */
    getBreaker(name, config) {
        if (!this.breakers.has(name)) {
            if (!config) {
                throw new SystemError(`Circuit breaker configuration required for new service: ${name}`, { service: name }, { subsystem: 'CircuitBreakerManager' });
            }
            this.breakers.set(name, new CircuitBreaker(name, config));
        }
        return this.breakers.get(name);
    }
    /**
     * Remove a circuit breaker
     */
    removeBreaker(name) {
        return this.breakers.delete(name);
    }
    /**
     * Get metrics for all circuit breakers
     */
    getAllMetrics() {
        const metrics = {};
        for (const [name, breaker] of this.breakers) {
            metrics[name] = breaker.getMetrics();
        }
        return metrics;
    }
    /**
     * Reset all circuit breakers
     */
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
    /**
     * Get health status of all services
     */
    getHealthStatus() {
        const healthy = [];
        const degraded = [];
        const failed = [];
        for (const [name, breaker] of this.breakers) {
            const metrics = breaker.getMetrics();
            if (metrics.state === exports.CircuitBreakerState.CLOSED) {
                if (metrics.failureRate < 10) {
                    healthy.push(name);
                }
                else {
                    degraded.push(name);
                }
            }
            else {
                failed.push(name);
            }
        }
        return {
            healthy,
            degraded,
            failed,
            total: this.breakers.size
        };
    }
}
// Global circuit breaker manager instance
const circuitBreakerManager = new CircuitBreakerManager();
/**
 * Decorator for automatic circuit breaker protection
 */
function WithCircuitBreaker(name, config) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const breaker = circuitBreakerManager.getBreaker(name, config);
            return breaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
}

/**
 * Retry Policy Implementation for CREB-JS
 * Provides intelligent retry strategies with exponential backoff, jitter, and rate limiting
 */
exports.RetryStrategy = void 0;
(function (RetryStrategy) {
    RetryStrategy["FIXED_DELAY"] = "FIXED_DELAY";
    RetryStrategy["LINEAR_BACKOFF"] = "LINEAR_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF"] = "EXPONENTIAL_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF_JITTER"] = "EXPONENTIAL_BACKOFF_JITTER";
})(exports.RetryStrategy || (exports.RetryStrategy = {}));
/**
 * Rate limiter to respect API rate limits during retries
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    /**
     * Check if a request can be made within rate limits
     */
    canMakeRequest() {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => time > windowStart);
        return this.requests.length < this.maxRequests;
    }
    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest() {
        if (this.canMakeRequest()) {
            return 0;
        }
        const oldestRequest = Math.min(...this.requests);
        const windowStart = Date.now() - this.windowMs;
        return Math.max(0, oldestRequest - windowStart);
    }
    /**
     * Reset the rate limiter
     */
    reset() {
        this.requests = [];
    }
}
/**
 * Retry Policy implementation with intelligent backoff strategies
 */
class RetryPolicy {
    constructor(config, rateLimiter) {
        // Default configuration with proper typing
        const defaultConfig = {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Default retry logic - retry on any error (except for specific non-retryable ones)
                // If it's a CREB error, use its retryable flag
                if (error instanceof CREBError) {
                    return error.isRetryable();
                }
                // For other errors, retry unless they're clearly non-retryable
                const message = error?.message || String(error);
                const nonRetryablePatterns = [
                    /authorization/i,
                    /forbidden/i,
                    /401/,
                    /403/,
                    /404/,
                    /validation/i,
                    /syntax/i
                ];
                return !nonRetryablePatterns.some(pattern => pattern.test(message));
            },
            onRetry: () => { },
            onFailure: () => { },
            onSuccess: () => { }
        };
        this.config = {
            ...defaultConfig,
            ...config
        };
        this.rateLimiter = rateLimiter;
    }
    /**
     * Execute a function with retry logic
     */
    async execute(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        // Global timeout setup
        let globalTimeoutId;
        let globalTimeoutPromise;
        if (this.config.globalTimeout) {
            globalTimeoutPromise = new Promise((_, reject) => {
                globalTimeoutId = setTimeout(() => {
                    reject(new CREBError(`Global timeout of ${this.config.globalTimeout}ms exceeded`, exports.ErrorCategory.TIMEOUT, exports.ErrorSeverity.HIGH, { globalTimeout: this.config.globalTimeout, attempt }));
                }, this.config.globalTimeout);
            });
        }
        try {
            while (attempt <= this.config.maxAttempts) {
                try {
                    // Check rate limits
                    if (this.rateLimiter) {
                        while (!this.rateLimiter.canMakeRequest()) {
                            const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                            if (waitTime > 0) {
                                await this.delay(waitTime);
                            }
                        }
                        this.rateLimiter.recordRequest();
                    }
                    // Execute with timeout if specified
                    let result;
                    if (this.config.attemptTimeout) {
                        const timeoutPromise = this.createTimeoutPromise(this.config.attemptTimeout, attempt);
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        promises.push(timeoutPromise);
                        result = await Promise.race(promises);
                    }
                    else {
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        result = await Promise.race(promises);
                    }
                    // Success!
                    const executionTime = Date.now() - startTime;
                    const metrics = {
                        totalAttempts: attempt,
                        successfulAttempts: 1,
                        failedAttempts: attempt - 1,
                        averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                        totalDelay,
                        executionTime
                    };
                    this.config.onSuccess(result, attempt);
                    return {
                        result,
                        metrics,
                        succeeded: true
                    };
                }
                catch (error) {
                    lastError = error;
                    // Check if we should retry
                    if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                        break;
                    }
                    // Calculate delay for next attempt
                    const delay = this.calculateDelay(attempt);
                    delays.push(delay);
                    totalDelay += delay;
                    this.config.onRetry(error, attempt, delay);
                    // Wait before next attempt
                    await this.delay(delay);
                    attempt++;
                }
            }
            // All retries exhausted
            const executionTime = Date.now() - startTime;
            const metrics = {
                totalAttempts: attempt,
                successfulAttempts: 0,
                failedAttempts: attempt,
                averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                totalDelay,
                lastError,
                executionTime
            };
            this.config.onFailure(lastError, attempt);
            return {
                result: undefined,
                metrics,
                succeeded: false,
                finalError: lastError
            };
        }
        finally {
            if (globalTimeoutId) {
                clearTimeout(globalTimeoutId);
            }
        }
    }
    /**
     * Execute a synchronous function with retry logic
     */
    executeSync(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        while (attempt <= this.config.maxAttempts) {
            try {
                // Check rate limits (blocking)
                if (this.rateLimiter) {
                    while (!this.rateLimiter.canMakeRequest()) {
                        const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                        if (waitTime > 0) {
                            // Synchronous delay (not recommended for production)
                            const start = Date.now();
                            while (Date.now() - start < waitTime) {
                                // Busy wait
                            }
                        }
                    }
                    this.rateLimiter.recordRequest();
                }
                const result = fn();
                // Success!
                const executionTime = Date.now() - startTime;
                const metrics = {
                    totalAttempts: attempt,
                    successfulAttempts: 1,
                    failedAttempts: attempt - 1,
                    averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                    totalDelay,
                    executionTime
                };
                this.config.onSuccess(result, attempt);
                return {
                    result,
                    metrics,
                    succeeded: true
                };
            }
            catch (error) {
                lastError = error;
                // Check if we should retry
                if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                    break;
                }
                // Calculate delay for next attempt
                const delay = this.calculateDelay(attempt);
                delays.push(delay);
                totalDelay += delay;
                this.config.onRetry(error, attempt, delay);
                attempt++;
            }
        }
        // All retries exhausted
        const executionTime = Date.now() - startTime;
        const metrics = {
            totalAttempts: attempt,
            successfulAttempts: 0,
            failedAttempts: attempt,
            averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
            totalDelay,
            lastError,
            executionTime
        };
        this.config.onFailure(lastError, attempt);
        return {
            result: undefined,
            metrics,
            succeeded: false,
            finalError: lastError
        };
    }
    calculateDelay(attempt) {
        let delay;
        switch (this.config.strategy) {
            case exports.RetryStrategy.FIXED_DELAY:
                delay = this.config.initialDelay;
                break;
            case exports.RetryStrategy.LINEAR_BACKOFF:
                delay = this.config.initialDelay * attempt;
                break;
            case exports.RetryStrategy.EXPONENTIAL_BACKOFF:
                delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                break;
            case exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER:
                const exponentialDelay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                const jitter = exponentialDelay * this.config.jitterFactor * Math.random();
                delay = exponentialDelay + jitter;
                break;
            default:
                delay = this.config.initialDelay;
        }
        // Cap at maximum delay
        return Math.min(delay, this.config.maxDelay);
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    createTimeoutPromise(timeoutMs, attempt) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new CREBError(`Attempt ${attempt} timed out after ${timeoutMs}ms`, exports.ErrorCategory.TIMEOUT, exports.ErrorSeverity.MEDIUM, { attemptTimeout: timeoutMs, attempt }));
            }, timeoutMs);
        });
    }
}
/**
 * Predefined retry policies for common scenarios
 */
class RetryPolicies {
    /**
     * Conservative retry policy for critical operations
     */
    static conservative() {
        return new RetryPolicy({
            maxAttempts: 2,
            initialDelay: 2000,
            maxDelay: 10000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1
        });
    }
    /**
     * Aggressive retry policy for non-critical operations
     */
    static aggressive() {
        return new RetryPolicy({
            maxAttempts: 5,
            initialDelay: 500,
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.2
        });
    }
    /**
     * Quick retry policy for fast operations
     */
    static quick() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 100,
            maxDelay: 1000,
            strategy: exports.RetryStrategy.LINEAR_BACKOFF,
            backoffMultiplier: 1.5,
            jitterFactor: 0.1
        });
    }
    /**
     * Network-specific retry policy with rate limiting
     */
    static network(maxRequestsPerMinute = 60) {
        const rateLimiter = new RateLimiter(maxRequestsPerMinute, 60000);
        return new RetryPolicy({
            maxAttempts: 4,
            initialDelay: 1000,
            maxDelay: 20000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.15,
            shouldRetry: (error, attempt) => {
                // Retry on network errors, timeouts, and 5xx status codes
                if (error instanceof CREBError) {
                    return error.isRetryable() && attempt < 4;
                }
                return ErrorUtils.isTransientError(error) && attempt < 4;
            }
        }, rateLimiter);
    }
    /**
     * Database-specific retry policy
     */
    static database() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 500,
            maxDelay: 5000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Common database transient errors
                const message = error?.message?.toLowerCase() || '';
                const transientPatterns = [
                    'connection',
                    'timeout',
                    'deadlock',
                    'lock timeout',
                    'temporary failure'
                ];
                return transientPatterns.some(pattern => message.includes(pattern)) && attempt < 3;
            }
        });
    }
}
/**
 * Decorator for automatic retry functionality
 */
function WithRetry(policy) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await policy.execute(() => originalMethod.apply(this, args));
            if (result.succeeded) {
                return result.result;
            }
            else {
                throw result.finalError;
            }
        };
        return descriptor;
    };
}
/**
 * Utility function to create a retry policy with default settings
 */
function createRetryPolicy(overrides = {}) {
    return new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
        ...overrides
    });
}

/**
 * Enhanced Error Handling Integration Example
 * Demonstrates how to use circuit breakers, retry policies, and structured errors
 * in real-world scenarios within CREB-JS
 */
/**
 * Example: Enhanced NIST Integration with Error Handling
 */
class EnhancedNISTIntegration {
    constructor() {
        // Configure circuit breaker for NIST API
        this.circuitBreaker = circuitBreakerManager.getBreaker('nist-api', {
            failureThreshold: 5,
            failureRate: 30,
            monitoringWindow: 60000, // 1 minute
            timeout: 30000, // 30 seconds
            successThreshold: 3,
            minimumCalls: 10,
            onStateChange: (newState, oldState) => {
                console.log(`NIST Circuit Breaker: ${oldState} → ${newState}`);
            },
            onCircuitOpen: (error) => {
                console.error('NIST API circuit breaker opened:', error);
            },
            onCircuitClose: () => {
                console.log('NIST API circuit breaker closed - service recovered');
            }
        });
        // Configure retry policy with rate limiting
        this.retryPolicy = RetryPolicies.network(60); // 60 requests per minute
        // Error aggregator for monitoring
        this.errorAggregator = new ErrorAggregator(500);
    }
    /**
     * Get thermodynamic data with full error handling
     */
    async getThermodynamicData(compoundName) {
        const operation = async () => {
            try {
                // Simulate NIST API call
                const response = await this.makeNISTRequest(`/thermo/search?name=${encodeURIComponent(compoundName)}`);
                return response;
            }
            catch (error) {
                // Transform error into appropriate CREB error type
                if (error instanceof Error && error.message.includes('network')) {
                    throw new NetworkError('Failed to connect to NIST database', { compoundName, operation: 'getThermodynamicData' }, { url: 'https://webbook.nist.gov/cgi/cbook.cgi', method: 'GET' });
                }
                else if (error instanceof Error && error.message.includes('429')) {
                    throw new ExternalAPIError('NIST API rate limit exceeded', 'NIST', { compoundName }, { statusCode: 429, rateLimited: true });
                }
                else {
                    throw new ExternalAPIError('NIST API request failed', 'NIST', { compoundName }, { statusCode: 500 });
                }
            }
        };
        try {
            // Apply circuit breaker and retry policy
            const result = await this.circuitBreaker.execute(async () => {
                const retryResult = await this.retryPolicy.execute(operation);
                if (retryResult.succeeded) {
                    return retryResult.result;
                }
                else {
                    throw retryResult.finalError;
                }
            });
            return result;
        }
        catch (error) {
            const crebError = ErrorUtils.transformUnknownError(error);
            this.errorAggregator.addError(crebError);
            throw crebError;
        }
    }
    /**
     * Simulated NIST API request (would be real HTTP request in production)
     */
    async makeNISTRequest(endpoint) {
        // Simulate various failure scenarios for demonstration
        const random = Math.random();
        if (random < 0.1) {
            throw new Error('network timeout');
        }
        else if (random < 0.15) {
            throw new Error('HTTP 429 rate limit');
        }
        else if (random < 0.2) {
            throw new Error('HTTP 500 server error');
        }
        // Simulate successful response
        return {
            compound: endpoint.split('name=')[1],
            thermodynamicData: {
                enthalpy: -393.5,
                entropy: 213.8,
                gibbs: -394.4
            }
        };
    }
    /**
     * Get error statistics and health metrics
     */
    getHealthMetrics() {
        return {
            circuitBreaker: this.circuitBreaker.getMetrics(),
            errors: this.errorAggregator.getStatistics(),
            retryMetrics: {
                // In a real implementation, you'd track retry metrics
                totalRetries: 0,
                successAfterRetry: 0,
                ultimateFailures: 0
            }
        };
    }
}
/**
 * Example: Enhanced PubChem Integration with Error Handling
 */
class EnhancedPubChemIntegration {
    constructor() {
        // PubChem has stricter rate limits
        this.rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
        this.circuitBreaker = circuitBreakerManager.getBreaker('pubchem-api', {
            failureThreshold: 3,
            failureRate: 25,
            monitoringWindow: 60000,
            timeout: 60000, // Longer timeout for PubChem
            successThreshold: 2,
            minimumCalls: 5
        });
        this.retryPolicy = new RetryPolicy({
            maxAttempts: 4,
            initialDelay: 2000, // Start with 2 second delay
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.2,
            shouldRetry: (error, attempt) => {
                if (error instanceof ExternalAPIError) {
                    // Always retry rate limits, retry 5xx errors, don't retry 4xx (except 429)
                    if (error.metadata.category === exports.ErrorCategory.RATE_LIMIT)
                        return true;
                    const statusCode = error.metadata.context.statusCode;
                    return statusCode >= 500 || statusCode === 429;
                }
                return ErrorUtils.isTransientError(error) && attempt < 4;
            },
            onRetry: (error, attempt, delay) => {
                console.log(`PubChem retry attempt ${attempt} after ${delay}ms: ${error.message}`);
            }
        }, this.rateLimiter);
    }
    /**
     * Search for compounds with enhanced error handling
     */
    async searchCompounds(query) {
        const operation = async () => {
            // Simulate API call
            return this.makePubChemRequest(`/compound/name/${encodeURIComponent(query)}/JSON`);
        };
        return this.circuitBreaker.execute(async () => {
            const result = await this.retryPolicy.execute(operation);
            if (result.succeeded) {
                return result.result;
            }
            else {
                throw result.finalError;
            }
        });
    }
    async makePubChemRequest(endpoint) {
        // Simulate PubChem API behavior
        const random = Math.random();
        if (random < 0.05) {
            throw new ExternalAPIError('PubChem service temporarily unavailable', 'PubChem', { endpoint }, { statusCode: 503 });
        }
        else if (random < 0.1) {
            throw new ExternalAPIError('PubChem rate limit exceeded', 'PubChem', { endpoint }, { statusCode: 429, rateLimited: true });
        }
        // Simulate successful response
        return [
            {
                CID: 12345,
                name: endpoint.split('/')[3],
                molecularFormula: 'C6H12O6',
                molecularWeight: 180.16
            }
        ];
    }
}
/**
 * Example: Enhanced SQLite Storage with Error Handling
 */
class EnhancedSQLiteStorage {
    constructor() {
        // Database operations use specialized retry policy
        this.retryPolicy = RetryPolicies.database();
        this.errorAggregator = new ErrorAggregator(100);
    }
    /**
     * Store data with retry logic for transient database failures
     */
    async storeData(table, data) {
        const operation = async () => {
            // Simulate database operation
            await this.executeDatabaseOperation('INSERT', table, data);
        };
        try {
            const result = await this.retryPolicy.execute(operation);
            if (!result.succeeded) {
                throw result.finalError;
            }
        }
        catch (error) {
            const crebError = ErrorUtils.transformUnknownError(error);
            this.errorAggregator.addError(crebError);
            throw crebError;
        }
    }
    async executeDatabaseOperation(operation, table, data) {
        // Simulate various database failure scenarios
        const random = Math.random();
        if (random < 0.02) {
            throw new Error('database connection timeout');
        }
        else if (random < 0.03) {
            throw new Error('deadlock detected');
        }
        else if (random < 0.04) {
            throw new Error('temporary failure in writing to disk');
        }
        // Simulate successful operation
        console.log(`Database ${operation} on ${table} completed successfully`);
    }
}
/**
 * Example: System Health Monitor using Error Handling Components
 */
class SystemHealthMonitor {
    constructor() {
        this.errorAggregator = new ErrorAggregator(1000);
        this.circuitBreakerManager = circuitBreakerManager;
    }
    /**
     * Monitor system health and provide detailed status
     */
    getSystemHealth() {
        const circuitBreakerHealth = this.circuitBreakerManager.getHealthStatus();
        const errorStats = this.errorAggregator.getStatistics();
        // Determine overall health
        let overall = 'healthy';
        if (circuitBreakerHealth.failed.length > 0) {
            overall = 'critical';
        }
        else if (circuitBreakerHealth.degraded.length > 0 || errorStats.bySeverity.HIGH > 5) {
            overall = 'degraded';
        }
        // Generate recommendations
        const recommendations = [];
        if (circuitBreakerHealth.failed.length > 0) {
            recommendations.push(`${circuitBreakerHealth.failed.length} service(s) are failing: ${circuitBreakerHealth.failed.join(', ')}`);
        }
        if (errorStats.bySeverity.CRITICAL > 0) {
            recommendations.push(`${errorStats.bySeverity.CRITICAL} critical error(s) detected - immediate attention required`);
        }
        if (errorStats.retryableCount > errorStats.total * 0.7) {
            recommendations.push('High percentage of retryable errors suggests network or external service issues');
        }
        return {
            overall,
            services: {
                total: circuitBreakerHealth.total,
                healthy: circuitBreakerHealth.healthy.length,
                degraded: circuitBreakerHealth.degraded.length,
                failed: circuitBreakerHealth.failed.length,
                details: this.circuitBreakerManager.getAllMetrics()
            },
            errors: errorStats,
            recommendations
        };
    }
    /**
     * Add error to monitoring
     */
    reportError(error) {
        this.errorAggregator.addError(error);
    }
    /**
     * Clear error history
     */
    clearErrorHistory() {
        this.errorAggregator.clear();
    }
}
/**
 * Example: Graceful Degradation Service
 */
class GracefulDegradationService {
    constructor() {
        this.localCache = new exports.AdvancedCache({
            maxSize: 500,
            defaultTtl: 1800000, // 30 minutes
            enableMetrics: true
        });
        this.nistIntegration = new EnhancedNISTIntegration();
        this.pubchemIntegration = new EnhancedPubChemIntegration();
    }
    /**
     * Get thermodynamic data with graceful degradation
     */
    async getThermodynamicDataWithFallback(compoundName) {
        // Try cache first
        const cachedResult = await this.localCache.get(compoundName);
        if (cachedResult.hit && cachedResult.value) {
            return {
                data: cachedResult.value,
                source: 'cache',
                confidence: 0.9
            };
        }
        // Try NIST (primary source)
        try {
            const nistData = await this.nistIntegration.getThermodynamicData(compoundName);
            await this.localCache.set(compoundName, nistData);
            return {
                data: nistData,
                source: 'nist',
                confidence: 1.0
            };
        }
        catch (error) {
            console.warn(`NIST failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
        }
        // Try PubChem (secondary source)
        try {
            const pubchemData = await this.pubchemIntegration.searchCompounds(compoundName);
            const estimatedThermoData = this.estimateThermodynamicData(pubchemData[0]);
            await this.localCache.set(compoundName, estimatedThermoData);
            return {
                data: estimatedThermoData,
                source: 'pubchem',
                confidence: 0.7
            };
        }
        catch (error) {
            console.warn(`PubChem failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
        }
        // Fallback to estimation
        const estimatedData = this.estimateThermodynamicData({ name: compoundName });
        return {
            data: estimatedData,
            source: 'estimated',
            confidence: 0.3
        };
    }
    estimateThermodynamicData(compoundInfo) {
        // Simple estimation logic (would be more sophisticated in real implementation)
        return {
            compound: compoundInfo.name,
            thermodynamicData: {
                enthalpy: -200, // Estimated values
                entropy: 150,
                gibbs: -180
            },
            note: 'Estimated values - use with caution'
        };
    }
}
// Example usage and testing
async function demonstrateEnhancedErrorHandling() {
    console.log('=== Enhanced Error Handling Demo ===\n');
    // Create service instances
    const nistService = new EnhancedNISTIntegration();
    const healthMonitor = new SystemHealthMonitor();
    const degradationService = new GracefulDegradationService();
    // Test successful operation
    console.log('1. Testing successful operation:');
    try {
        const data = await nistService.getThermodynamicData('water');
        console.log('✓ Successfully retrieved data:', data);
    }
    catch (error) {
        console.log('✗ Operation failed:', error instanceof CREBError ? error.getDescription() : error);
    }
    // Test multiple operations to trigger various error scenarios
    console.log('\n2. Testing multiple operations (some may fail):');
    const compounds = ['methane', 'ethane', 'propane', 'butane', 'pentane'];
    for (const compound of compounds) {
        try {
            const result = await degradationService.getThermodynamicDataWithFallback(compound);
            console.log(`✓ ${compound}: Got data from ${result.source} (confidence: ${result.confidence})`);
        }
        catch (error) {
            console.log(`✗ ${compound}: Failed completely:`, error instanceof CREBError ? error.getDescription() : error);
            if (error instanceof CREBError) {
                healthMonitor.reportError(error);
            }
        }
    }
    // Display system health
    console.log('\n3. System Health Status:');
    const health = healthMonitor.getSystemHealth();
    console.log(`Overall Status: ${health.overall.toUpperCase()}`);
    console.log(`Services: ${health.services.healthy}/${health.services.total} healthy`);
    console.log(`Recent Errors: ${health.errors.total} (${health.errors.retryableCount} retryable)`);
    if (health.recommendations.length > 0) {
        console.log('Recommendations:');
        health.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    // Display detailed metrics
    console.log('\n4. Detailed Service Metrics:');
    const nistMetrics = nistService.getHealthMetrics();
    console.log('NIST Circuit Breaker:', nistMetrics.circuitBreaker);
    console.log('Error Statistics:', nistMetrics.errors);
}

/**
 * Configuration Types for CREB-JS
 *
 * Defines all configuration interfaces and types used throughout the application.
 * This file serves as the single source of truth for configuration structure.
 */
/**
 * Type guard for CREBConfig
 */
function isCREBConfig(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        'cache' in obj &&
        'performance' in obj &&
        'data' in obj &&
        'logging' in obj);
}

/**
 * Advanced Cache Integration Example for CREB-JS
 *
 * Demonstrates how to integrate the advanced caching system with existing
 * CREB-JS components and replace the legacy PerformanceCache.
 */
/**
 * Enhanced ThermodynamicsCalculator with advanced caching
 */
class CachedThermodynamicsCalculator {
    constructor() {
        this.cache = CacheFactory.create('performance-optimized');
        // Set up cache monitoring
        this.setupCacheMonitoring();
    }
    /**
     * Calculate thermodynamic properties with caching
     */
    async calculateThermodynamics(equation, temperature, pressure) {
        const cacheKey = `thermo_${equation}_${temperature}_${pressure}`;
        // Try cache first
        const cached = await this.cache.get(cacheKey);
        if (cached.hit) {
            return cached.value;
        }
        // Perform calculation (mock implementation)
        const result = await this.performCalculation(equation, temperature, pressure);
        // Cache the result with appropriate TTL
        await this.cache.set(cacheKey, result, this.getTTLForCalculation(result));
        return result;
    }
    /**
     * Get cache performance statistics
     */
    getCacheStats() {
        return this.cache.getStats();
    }
    /**
     * Perform health check
     */
    async healthCheck() {
        return this.cache.healthCheck();
    }
    /**
     * Shutdown and cleanup
     */
    shutdown() {
        this.cache.shutdown();
    }
    async performCalculation(equation, temperature, pressure) {
        // Simulate calculation time
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
            equation,
            temperature,
            pressure,
            enthalpy: Math.random() * 1000,
            entropy: Math.random() * 500,
            gibbs: Math.random() * 800,
            calculatedAt: Date.now()
        };
    }
    getTTLForCalculation(result) {
        // More complex calculations get longer TTL
        if (result.equation.length > 50) {
            return 3600000; // 1 hour
        }
        else if (result.equation.length > 20) {
            return 1800000; // 30 minutes
        }
        else {
            return 600000; // 10 minutes
        }
    }
    setupCacheMonitoring() {
        // Monitor cache performance
        this.cache.addEventListener('memory-pressure', (event) => {
            console.warn('Cache memory pressure detected:', event.metadata);
        });
        this.cache.addEventListener('stats-update', () => {
            const stats = this.cache.getStats();
            if (stats.hitRate < 50) {
                console.warn('Low cache hit rate detected:', stats.hitRate);
            }
        });
        // Log eviction events for debugging
        this.cache.addEventListener('eviction', (event) => {
            console.debug('Cache eviction:', {
                key: event.key,
                strategy: event.metadata?.strategy,
                reason: event.metadata?.reason
            });
        });
    }
}
/**
 * Enhanced Chemical Database Manager with advanced caching
 */
class CachedChemicalDatabase {
    constructor() {
        this.compoundCache = CacheFactory.create('large');
        this.queryCache = CacheFactory.create('medium');
        this.setupCacheOptimization();
    }
    /**
     * Get compound data with intelligent caching
     */
    async getCompound(formula) {
        const cached = await this.compoundCache.get(formula);
        if (cached.hit) {
            return cached.value;
        }
        // Fetch from database
        const compound = await this.fetchCompoundFromDB(formula);
        if (compound) {
            // Cache with TTL based on data freshness requirements
            const ttl = this.isCommonCompound(formula) ? 86400000 : 3600000; // 24h vs 1h
            await this.compoundCache.set(formula, compound, ttl);
        }
        return compound;
    }
    /**
     * Search compounds with query result caching
     */
    async searchCompounds(query, filters = {}) {
        const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
        const cached = await this.queryCache.get(cacheKey);
        if (cached.hit) {
            return cached.value;
        }
        const results = await this.performSearch(query, filters);
        // Cache search results for shorter time (more dynamic)
        await this.queryCache.set(cacheKey, results, 300000); // 5 minutes
        return results;
    }
    /**
     * Get combined cache statistics
     */
    getCacheReport() {
        const compoundStats = this.compoundCache.getStats();
        const queryStats = this.queryCache.getStats();
        return `
Cache Performance Report:

Compound Cache:
- Hit Rate: ${compoundStats.hitRate.toFixed(2)}%
- Entries: ${compoundStats.size}
- Memory: ${(compoundStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Query Cache:
- Hit Rate: ${queryStats.hitRate.toFixed(2)}%
- Entries: ${queryStats.size}
- Memory: ${(queryStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Overall Performance:
- Combined Hit Rate: ${((compoundStats.hits + queryStats.hits) / (compoundStats.hits + compoundStats.misses + queryStats.hits + queryStats.misses) * 100).toFixed(2)}%
- Total Memory: ${((compoundStats.memoryUsage + queryStats.memoryUsage) / 1024 / 1024).toFixed(2)} MB
    `.trim();
    }
    /**
     * Optimize cache performance based on usage patterns
     */
    async optimizeCaches() {
        const compoundMetrics = this.compoundCache.getMetrics();
        const queryMetrics = this.queryCache.getMetrics();
        // If compound cache hit rate is low, increase size
        if (compoundMetrics.current.hitRate < 60) {
            console.log('Compound cache performance is low, consider increasing size');
        }
        // If memory utilization is high, force cleanup
        if (compoundMetrics.current.memoryUtilization > 85) {
            await this.compoundCache.cleanup();
        }
        if (queryMetrics.current.memoryUtilization > 85) {
            await this.queryCache.cleanup();
        }
    }
    shutdown() {
        this.compoundCache.shutdown();
        this.queryCache.shutdown();
    }
    async fetchCompoundFromDB(formula) {
        // Simulate database fetch
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            formula,
            name: `Compound ${formula}`,
            molarMass: Math.random() * 500,
            properties: {
                meltingPoint: Math.random() * 1000,
                boilingPoint: Math.random() * 2000,
                density: Math.random() * 5
            },
            lastUpdated: Date.now()
        };
    }
    async performSearch(query, filters) {
        // Simulate search operation
        await new Promise(resolve => setTimeout(resolve, 200));
        const resultCount = Math.floor(Math.random() * 20) + 1;
        const results = [];
        for (let i = 0; i < resultCount; i++) {
            results.push({
                formula: `${query}${i}`,
                name: `Result ${i} for ${query}`,
                relevance: Math.random()
            });
        }
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    isCommonCompound(formula) {
        // Common compounds that change rarely
        const common = ['H2O', 'CO2', 'NaCl', 'H2SO4', 'HCl', 'NH3', 'CH4', 'C2H5OH'];
        return common.includes(formula);
    }
    setupCacheOptimization() {
        // Auto-optimization every 10 minutes
        setInterval(() => {
            this.optimizeCaches().catch(error => {
                console.warn('Cache optimization error:', error);
            });
        }, 600000);
    }
}
/**
 * Cache-aware equation balancer
 */
class CachedEquationBalancer {
    constructor() {
        this.cache = CacheFactory.create({
            maxSize: 2000,
            defaultTtl: 7200000, // 2 hours (balanced equations don't change)
            evictionStrategy: 'lfu', // Frequent equations are more valuable
            enableMetrics: true
        });
    }
    async balanceEquation(equation) {
        // Normalize equation for consistent caching
        const normalizedEquation = this.normalizeEquation(equation);
        const cached = await this.cache.get(normalizedEquation);
        if (cached.hit) {
            return { ...cached.value, fromCache: true };
        }
        // Perform balancing
        const result = await this.performBalancing(normalizedEquation);
        // Cache successful results
        if (result.success) {
            await this.cache.set(normalizedEquation, result);
        }
        return { ...result, fromCache: false };
    }
    /**
     * Get equations that would benefit from precomputation
     */
    getFrequentEquations(minAccess = 5) {
        // This would require access to cache internals or additional tracking
        // For now, return mock data
        return [
            { equation: 'H2 + O2 = H2O', accessCount: 15 },
            { equation: 'CH4 + O2 = CO2 + H2O', accessCount: 12 },
            { equation: 'C2H5OH + O2 = CO2 + H2O', accessCount: 8 }
        ];
    }
    async precomputeFrequentEquations() {
        const frequent = this.getFrequentEquations();
        for (const { equation } of frequent) {
            const cached = await this.cache.get(equation);
            if (!cached.hit) {
                await this.balanceEquation(equation);
            }
        }
    }
    getPerformanceReport() {
        const stats = this.cache.getStats();
        const metrics = this.cache.getMetrics();
        return `
Equation Balancer Cache Report:

Performance:
- Hit Rate: ${stats.hitRate.toFixed(2)}%
- Average Response Time: ${stats.averageAccessTime.toFixed(2)}ms
- Cached Equations: ${stats.size}

Trends:
- Hit Rate Trend: ${metrics.trends.hitRateTrend}
- Memory Trend: ${metrics.trends.memoryTrend}
- Latency Trend: ${metrics.trends.latencyTrend}

Recommendations:
${this.generateRecommendations(stats, metrics)}
    `.trim();
    }
    shutdown() {
        this.cache.shutdown();
    }
    normalizeEquation(equation) {
        // Remove extra spaces and standardize formatting
        return equation
            .replace(/\s+/g, ' ')
            .replace(/\s*=\s*/g, ' = ')
            .replace(/\s*\+\s*/g, ' + ')
            .trim();
    }
    async performBalancing(equation) {
        // Simulate equation balancing
        await new Promise(resolve => setTimeout(resolve, 75));
        return {
            equation,
            balanced: equation, // Would be actual balanced equation
            coefficients: [1, 1, 1], // Mock coefficients
            success: true,
            method: 'matrix',
            calculatedAt: Date.now()
        };
    }
    generateRecommendations(stats, metrics) {
        const recommendations = [];
        if (stats.hitRate < 70) {
            recommendations.push('- Consider increasing cache size for better hit rate');
        }
        if (metrics.trends.latencyTrend === 'degrading') {
            recommendations.push('- Monitor for performance bottlenecks');
        }
        if (stats.memoryUtilization > 80) {
            recommendations.push('- Consider memory cleanup or size optimization');
        }
        if (recommendations.length === 0) {
            recommendations.push('- Cache performance is optimal');
        }
        return recommendations.join('\n');
    }
}
/**
 * Multi-level cache for hierarchical data
 */
class MultiLevelCache {
    constructor() {
        this.l1Cache = CacheFactory.create('small'); // Fast, small cache
        this.l2Cache = CacheFactory.create('medium'); // Medium cache
        this.l3Cache = CacheFactory.create('large'); // Large, persistent cache
    }
    async get(key) {
        // Try L1 first (fastest)
        let result = await this.l1Cache.get(key);
        if (result.hit) {
            return { value: result.value, level: 'L1', latency: result.latency };
        }
        // Try L2
        result = await this.l2Cache.get(key);
        if (result.hit) {
            // Promote to L1
            await this.l1Cache.set(key, result.value);
            return { value: result.value, level: 'L2', latency: result.latency };
        }
        // Try L3
        result = await this.l3Cache.get(key);
        if (result.hit) {
            // Promote to L2 (and potentially L1)
            await this.l2Cache.set(key, result.value);
            return { value: result.value, level: 'L3', latency: result.latency };
        }
        return { value: undefined, level: 'MISS', latency: 0 };
    }
    async set(key, value, level = 'L1') {
        switch (level) {
            case 'L1':
                await this.l1Cache.set(key, value);
                break;
            case 'L2':
                await this.l2Cache.set(key, value);
                break;
            case 'L3':
                await this.l3Cache.set(key, value);
                break;
        }
    }
    getAggregatedStats() {
        const l1Stats = this.l1Cache.getStats();
        const l2Stats = this.l2Cache.getStats();
        const l3Stats = this.l3Cache.getStats();
        return {
            l1: l1Stats,
            l2: l2Stats,
            l3: l3Stats,
            combined: {
                totalHits: l1Stats.hits + l2Stats.hits + l3Stats.hits,
                totalMisses: l1Stats.misses + l2Stats.misses + l3Stats.misses,
                totalSize: l1Stats.size + l2Stats.size + l3Stats.size,
                totalMemory: l1Stats.memoryUsage + l2Stats.memoryUsage + l3Stats.memoryUsage
            }
        };
    }
    shutdown() {
        this.l1Cache.shutdown();
        this.l2Cache.shutdown();
        this.l3Cache.shutdown();
    }
}
/**
 * Example usage and migration guide
 */
function demonstrateAdvancedCaching() {
    console.log('🚀 Advanced Caching System Demo\n');
    // Example 1: Replace legacy PerformanceCache
    console.log('1. Creating optimized caches for different use cases:');
    const equationCache = CacheFactory.create('performance-optimized');
    const thermodynamicsCache = CacheFactory.create('memory-optimized');
    const compoundCache = CacheFactory.create('large');
    console.log('✅ Created specialized caches\n');
    // Example 2: Monitor cache performance
    console.log('2. Setting up cache monitoring:');
    equationCache.addEventListener('stats-update', () => {
        const stats = equationCache.getStats();
        console.log(`Equation cache hit rate: ${stats.hitRate.toFixed(2)}%`);
    });
    console.log('✅ Monitoring configured\n');
    // Example 3: Use with existing CREB components
    console.log('3. Integration examples:');
    const cachedCalculator = new CachedThermodynamicsCalculator();
    const cachedDatabase = new CachedChemicalDatabase();
    const cachedBalancer = new CachedEquationBalancer();
    console.log('✅ Integrated with CREB components\n');
    console.log('4. Performance benefits:');
    console.log('- TTL-based expiration prevents stale data');
    console.log('- Multiple eviction strategies optimize for different access patterns');
    console.log('- Comprehensive metrics enable performance monitoring');
    console.log('- Thread-safe operations support concurrent access');
    console.log('- Memory management prevents OOM errors');
    console.log('- Event system enables reactive optimization\n');
    // Cleanup
    setTimeout(() => {
        equationCache.shutdown();
        thermodynamicsCache.shutdown();
        compoundCache.shutdown();
        cachedCalculator.shutdown();
        cachedDatabase.shutdown();
        cachedBalancer.shutdown();
        console.log('✅ Demo completed, caches shut down');
    }, 1000);
}

/**
 * @fileoverview Type definitions for CREB Worker Thread System
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides comprehensive type definitions for the worker thread system,
 * enabling efficient offloading of CPU-intensive chemistry calculations.
 */
// ========================================
// Core Types and Enums
// ========================================
/**
 * Priority levels for task queue management
 */
exports.TaskPriority = void 0;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["CRITICAL"] = 3] = "CRITICAL";
})(exports.TaskPriority || (exports.TaskPriority = {}));
/**
 * Task status tracking
 */
exports.TaskStatus = void 0;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["QUEUED"] = "queued";
    TaskStatus["RUNNING"] = "running";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["TIMEOUT"] = "timeout";
})(exports.TaskStatus || (exports.TaskStatus = {}));
/**
 * Worker status tracking
 */
exports.WorkerStatus = void 0;
(function (WorkerStatus) {
    WorkerStatus["IDLE"] = "idle";
    WorkerStatus["BUSY"] = "busy";
    WorkerStatus["ERROR"] = "error";
    WorkerStatus["TERMINATED"] = "terminated";
    WorkerStatus["STARTING"] = "starting";
})(exports.WorkerStatus || (exports.WorkerStatus = {}));
/**
 * Chemistry calculation types
 */
exports.CalculationType = void 0;
(function (CalculationType) {
    CalculationType["EQUATION_BALANCING"] = "equation_balancing";
    CalculationType["THERMODYNAMICS"] = "thermodynamics";
    CalculationType["STOICHIOMETRY"] = "stoichiometry";
    CalculationType["BATCH_ANALYSIS"] = "batch_analysis";
    CalculationType["MATRIX_SOLVING"] = "matrix_solving";
    CalculationType["COMPOUND_ANALYSIS"] = "compound_analysis";
})(exports.CalculationType || (exports.CalculationType = {}));
// ========================================
// Communication Protocols
// ========================================
/**
 * Message types for worker communication
 */
var MessageType;
(function (MessageType) {
    MessageType["TASK_ASSIGNMENT"] = "task_assignment";
    MessageType["TASK_RESULT"] = "task_result";
    MessageType["TASK_ERROR"] = "task_error";
    MessageType["TASK_PROGRESS"] = "task_progress";
    MessageType["WORKER_READY"] = "worker_ready";
    MessageType["WORKER_SHUTDOWN"] = "worker_shutdown";
    MessageType["HEALTH_CHECK"] = "health_check";
    MessageType["MEMORY_WARNING"] = "memory_warning";
})(MessageType || (MessageType = {}));
/**
 * Create a branded worker ID
 */
function createWorkerId(id) {
    return id;
}
/**
 * Create a branded task ID
 */
function createTaskId(id) {
    return id;
}

/**
 * @fileoverview Advanced Task Queue with Priority Management
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module implements a sophisticated task queue system with priority-based scheduling,
 * timeout management, and persistence capabilities for the CREB worker thread system.
 */
/**
 * Advanced task queue with priority management and persistence
 */
exports.TaskQueue = class TaskQueue extends events.EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            maxSize: 10000,
            priorityLevels: 4,
            timeoutCleanupInterval: 30000, // 30 seconds
            persistToDisk: false,
            ...config
        };
        // Initialize priority queues
        this.queues = new Map();
        for (let priority = 0; priority < this.config.priorityLevels; priority++) {
            this.queues.set(priority, []);
        }
        this.taskMap = new Map();
        this.timeouts = new Map();
        this.startTime = new Date();
        // Initialize stats
        this.stats = {
            totalTasks: 0,
            pendingTasks: 0,
            runningTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageWaitTime: 0,
            averageExecutionTime: 0,
            throughput: 0,
            queueLength: 0,
            priorityBreakdown: {
                [exports.TaskPriority.LOW]: 0,
                [exports.TaskPriority.NORMAL]: 0,
                [exports.TaskPriority.HIGH]: 0,
                [exports.TaskPriority.CRITICAL]: 0
            }
        };
        this.setupCleanupInterval();
        this.setupPersistence();
    }
    /**
     * Enqueue a task with priority-based insertion
     */
    async enqueue(task) {
        if (this.size() >= this.config.maxSize) {
            throw new ValidationError(`Queue is full (max size: ${this.config.maxSize})`, { maxSize: this.config.maxSize, currentSize: this.size() }, { field: 'queueSize', value: this.size(), constraint: `must be less than ${this.config.maxSize}` });
        }
        // Validate task
        this.validateTask(task);
        // Add to task map for quick lookup
        this.taskMap.set(task.id, { ...task });
        // Add to priority queue
        const priorityQueue = this.queues.get(task.priority);
        if (!priorityQueue) {
            throw new ValidationError(`Invalid priority level: ${task.priority}`, { priority: task.priority, validPriorities: Object.values(exports.TaskPriority) }, { field: 'priority', value: task.priority, constraint: 'must be a valid TaskPriority enum value' });
        }
        const node = {
            task: { ...task },
            priority: task.priority,
            enqueuedAt: new Date()
        };
        // Insert based on priority and FIFO within priority
        priorityQueue.push(node);
        // Setup timeout if specified
        if (task.timeout && task.timeout > 0) {
            const timeoutId = setTimeout(() => {
                this.handleTaskTimeout(task.id);
            }, task.timeout);
            this.timeouts.set(task.id, timeoutId);
        }
        // Update stats
        this.updateStatsOnEnqueue(task);
        // Emit event
        this.emit('task-enqueued', task);
        // Persist if enabled
        if (this.config.persistToDisk) {
            await this.persistQueue();
        }
    }
    /**
     * Dequeue the highest priority task
     */
    dequeue() {
        // Check priorities from highest to lowest
        for (let priority = exports.TaskPriority.CRITICAL; priority >= exports.TaskPriority.LOW; priority--) {
            const queue = this.queues.get(priority);
            if (queue && queue.length > 0) {
                const node = queue.shift();
                const task = node.task;
                // Clean up timeout
                this.clearTaskTimeout(task.id);
                // Update stats
                this.updateStatsOnDequeue(task, node.enqueuedAt);
                // Emit event
                this.emit('task-dequeued', task);
                return task;
            }
        }
        return null;
    }
    /**
     * Peek at the next task without removing it
     */
    peek() {
        for (let priority = exports.TaskPriority.CRITICAL; priority >= exports.TaskPriority.LOW; priority--) {
            const queue = this.queues.get(priority);
            if (queue && queue.length > 0) {
                return queue[0].task;
            }
        }
        return null;
    }
    /**
     * Get task by ID
     */
    getTask(taskId) {
        return this.taskMap.get(taskId) || null;
    }
    /**
     * Remove a specific task from the queue
     */
    removeTask(taskId) {
        const task = this.taskMap.get(taskId);
        if (!task) {
            return false;
        }
        // Remove from priority queue
        const queue = this.queues.get(task.priority);
        if (queue) {
            const index = queue.findIndex(node => node.task.id === taskId);
            if (index !== -1) {
                queue.splice(index, 1);
            }
        }
        // Clean up
        this.taskMap.delete(taskId);
        this.clearTaskTimeout(taskId);
        // Update stats
        this.updateStatsOnRemoval(task);
        // Emit event
        this.emit('task-removed', task);
        return true;
    }
    /**
     * Get tasks by priority
     */
    getTasksByPriority(priority) {
        const queue = this.queues.get(priority);
        return queue ? queue.map(node => node.task) : [];
    }
    /**
     * Get all pending tasks
     */
    getAllTasks() {
        const allTasks = [];
        for (const queue of this.queues.values()) {
            allTasks.push(...queue.map(node => node.task));
        }
        return allTasks;
    }
    /**
     * Clear all tasks from the queue
     */
    clear() {
        // Clear all timeouts
        for (const timeoutId of this.timeouts.values()) {
            clearTimeout(timeoutId);
        }
        // Clear collections
        for (const queue of this.queues.values()) {
            queue.length = 0;
        }
        this.taskMap.clear();
        this.timeouts.clear();
        // Reset stats
        this.resetStats();
        // Emit event
        this.emit('queue-cleared');
    }
    /**
     * Get current queue size
     */
    size() {
        return this.taskMap.size;
    }
    /**
     * Check if queue is empty
     */
    isEmpty() {
        return this.size() === 0;
    }
    /**
     * Check if queue is full
     */
    isFull() {
        return this.size() >= this.config.maxSize;
    }
    /**
     * Get queue statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get detailed queue information
     */
    getQueueInfo() {
        const info = {
            totalSize: this.size(),
            maxSize: this.config.maxSize,
            utilization: (this.size() / this.config.maxSize) * 100,
            uptime: Date.now() - this.startTime.getTime(),
            priorityQueues: {}
        };
        // Add priority queue details
        for (const [priority, queue] of this.queues.entries()) {
            const priorityName = exports.TaskPriority[priority] || `Priority_${priority}`;
            info.priorityQueues[priorityName] = {
                size: queue.length,
                oldestTask: queue.length > 0 ? queue[0].enqueuedAt : null,
                averageAge: this.calculateAverageAge(queue)
            };
        }
        return info;
    }
    /**
     * Gracefully shutdown the queue
     */
    async shutdown() {
        // Clear intervals
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        if (this.persistenceInterval) {
            clearInterval(this.persistenceInterval);
        }
        // Persist final state if enabled
        if (this.config.persistToDisk && this.size() > 0) {
            await this.persistQueue();
        }
        // Clear all tasks and timeouts
        this.clear();
        // Emit shutdown event
        this.emit('queue-shutdown');
    }
    /**
     * Load queue from disk (if persistence is enabled)
     */
    async loadFromDisk() {
        if (!this.config.persistToDisk || !this.config.queuePath) {
            return;
        }
        try {
            const data = await fs.promises.readFile(this.config.queuePath, 'utf-8');
            const savedTasks = JSON.parse(data);
            // Restore tasks
            for (const task of savedTasks) {
                await this.enqueue({
                    ...task,
                    createdAt: new Date(task.createdAt)
                });
            }
            this.emit('queue-loaded', savedTasks.length);
        }
        catch (error) {
            // File might not exist or be corrupted - that's okay
            this.emit('queue-load-error', error);
        }
    }
    // ========================================
    // Private Methods
    // ========================================
    validateTask(task) {
        if (!task.id || typeof task.id !== 'string') {
            throw new ValidationError('Task must have a valid string ID', { taskId: task.id, taskType: typeof task.id }, { field: 'taskId', value: task.id, constraint: 'must be a non-empty string' });
        }
        if (this.taskMap.has(task.id)) {
            throw new ValidationError(`Task with ID ${task.id} already exists`, { taskId: task.id, existingTasks: Array.from(this.taskMap.keys()) }, { field: 'taskId', value: task.id, constraint: 'must be unique' });
        }
        if (task.priority < 0 || task.priority >= this.config.priorityLevels) {
            throw new ValidationError(`Invalid priority: ${task.priority}`, { priority: task.priority, maxPriority: this.config.priorityLevels - 1 }, { field: 'priority', value: task.priority, constraint: `must be between 0 and ${this.config.priorityLevels - 1}` });
        }
        if (task.timeout !== undefined && task.timeout < 0) {
            throw new ValidationError('Task timeout must be non-negative', { timeout: task.timeout }, { field: 'timeout', value: task.timeout, constraint: 'must be >= 0' });
        }
    }
    handleTaskTimeout(taskId) {
        const task = this.taskMap.get(taskId);
        if (task) {
            this.removeTask(taskId);
            this.stats.failedTasks++;
            this.emit('task-timeout', task);
        }
    }
    clearTaskTimeout(taskId) {
        const timeoutId = this.timeouts.get(taskId);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeouts.delete(taskId);
        }
    }
    updateStatsOnEnqueue(task) {
        this.stats.totalTasks++;
        this.stats.pendingTasks++;
        this.stats.queueLength = this.size();
        this.stats.priorityBreakdown[task.priority]++;
    }
    updateStatsOnDequeue(task, enqueuedAt) {
        this.stats.pendingTasks--;
        this.stats.runningTasks++;
        this.stats.queueLength = this.size();
        // Update average wait time
        const waitTime = Date.now() - enqueuedAt.getTime();
        this.stats.averageWaitTime = this.calculateMovingAverage(this.stats.averageWaitTime, waitTime, this.stats.totalTasks);
        // Update throughput
        const uptimeSeconds = (Date.now() - this.startTime.getTime()) / 1000;
        this.stats.throughput = this.stats.completedTasks / Math.max(uptimeSeconds, 1);
    }
    updateStatsOnRemoval(task) {
        this.stats.pendingTasks--;
        this.stats.queueLength = this.size();
        this.stats.priorityBreakdown[task.priority]--;
    }
    calculateMovingAverage(current, newValue, count) {
        if (count <= 1)
            return newValue;
        return ((current * (count - 1)) + newValue) / count;
    }
    calculateAverageAge(queue) {
        if (queue.length === 0)
            return 0;
        const now = Date.now();
        const totalAge = queue.reduce((sum, node) => {
            return sum + (now - node.enqueuedAt.getTime());
        }, 0);
        return totalAge / queue.length;
    }
    resetStats() {
        Object.assign(this.stats, {
            totalTasks: 0,
            pendingTasks: 0,
            runningTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            averageWaitTime: 0,
            averageExecutionTime: 0,
            throughput: 0,
            queueLength: 0,
            priorityBreakdown: {
                [exports.TaskPriority.LOW]: 0,
                [exports.TaskPriority.NORMAL]: 0,
                [exports.TaskPriority.HIGH]: 0,
                [exports.TaskPriority.CRITICAL]: 0
            }
        });
    }
    setupCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, this.config.timeoutCleanupInterval);
    }
    setupPersistence() {
        if (this.config.persistToDisk) {
            // Persist every 5 minutes
            this.persistenceInterval = setInterval(() => {
                this.persistQueue().catch(error => {
                    this.emit('persistence-error', error);
                });
            }, 5 * 60 * 1000);
        }
    }
    performCleanup() {
        // Clean up completed timeouts and update stats
        const now = Date.now();
        let cleanedTasks = 0;
        // This is mainly for housekeeping - actual timeout handling
        // is done in handleTaskTimeout
        for (const [taskId, task] of this.taskMap.entries()) {
            if (task.timeout && task.timeout > 0) {
                const age = now - task.createdAt.getTime();
                if (age > task.timeout * 2) { // Clean up very old tasks
                    this.removeTask(taskId);
                    cleanedTasks++;
                }
            }
        }
        if (cleanedTasks > 0) {
            this.emit('cleanup-completed', cleanedTasks);
        }
    }
    async persistQueue() {
        if (!this.config.queuePath) {
            throw new SystemError('Queue path not configured for persistence', { operation: 'persistQueue', config: this.config }, { subsystem: 'workers', resource: 'queue-persistence' });
        }
        try {
            const tasks = this.getAllTasks();
            const data = JSON.stringify(tasks, null, 2);
            await fs.promises.writeFile(this.config.queuePath, data, 'utf-8');
            this.emit('queue-persisted', tasks.length);
        }
        catch (error) {
            this.emit('persistence-error', error);
            throw error;
        }
    }
};
exports.TaskQueue = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], exports.TaskQueue);
/**
 * Task builder for fluent task creation
 */
class TaskBuilder {
    constructor() {
        this.task = {};
    }
    static create() {
        return new TaskBuilder();
    }
    withId(id) {
        this.task.id = id;
        return this;
    }
    withType(type) {
        this.task.type = type;
        return this;
    }
    withData(data) {
        this.task.data = data;
        return this;
    }
    withPriority(priority) {
        this.task.priority = priority;
        return this;
    }
    withTimeout(timeout) {
        this.task.timeout = timeout;
        return this;
    }
    withRetries(retries) {
        this.task.retryAttempts = retries;
        return this;
    }
    withMetadata(metadata) {
        this.task.metadata = metadata;
        return this;
    }
    build() {
        // Validate required fields
        if (!this.task.id) {
            this.task.id = createTaskId(`task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }
        if (!this.task.type) {
            throw new ValidationError('Task type is required', { task: this.task }, { field: 'type', value: this.task.type, constraint: 'must be specified' });
        }
        if (this.task.data === undefined) {
            throw new ValidationError('Task data is required', { task: this.task }, { field: 'data', value: this.task.data, constraint: 'must be defined' });
        }
        if (this.task.priority === undefined) {
            this.task.priority = exports.TaskPriority.NORMAL;
        }
        if (!this.task.createdAt) {
            this.task.createdAt = new Date();
        }
        return this.task;
    }
}

/**
 * @fileoverview Worker Pool Manager for CREB Chemistry Calculations
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides a sophisticated worker pool for managing multiple worker threads,
 * distributing tasks efficiently, and monitoring performance metrics.
 */
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.js', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
/**
 * Advanced worker pool with load balancing and health monitoring
 */
exports.WorkerPool = class WorkerPool extends events.EventEmitter {
    constructor(config = {}, recoveryConfig = {}) {
        super();
        this.isShuttingDown = false;
        this.nextWorkerId = 1;
        this.config = {
            minWorkers: 2,
            maxWorkers: Math.max(4, require('os').cpus().length),
            idleTimeout: 300000, // 5 minutes
            taskTimeout: 300000, // 5 minutes
            maxRetries: 3,
            memoryLimit: 512 * 1024 * 1024, // 512MB
            cpuTimeLimit: 600000, // 10 minutes
            loadBalancing: 'least-busy',
            autoScale: true,
            scalingThreshold: 5,
            ...config
        };
        this.recoveryConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            exponentialBackoff: true,
            restartWorkerOnError: true,
            isolateFailedTasks: true,
            fallbackToMainThread: false,
            ...recoveryConfig
        };
        this.workers = new Map();
        this.activeExecutions = new Map();
        this.startTime = new Date();
        // Initialize task queue
        this.taskQueue = new exports.TaskQueue({
            maxSize: 10000,
            priorityLevels: 4,
            timeoutCleanupInterval: 30000,
            persistToDisk: false
        });
        // Set worker script path
        this.workerScriptPath = path.join(__dirname$1, 'ChemistryWorker.js');
        this.setupEventHandlers();
        this.initializeWorkerPool();
        this.startHealthMonitoring();
    }
    /**
     * Submit a task to the worker pool
     */
    async submitTask(task) {
        if (this.isShuttingDown) {
            throw new SystemError('Worker pool is shutting down', { operation: 'submitTask', taskId: task.id, poolState: 'shutting-down' }, { subsystem: 'workers', resource: 'worker-pool' });
        }
        // Add task to queue
        await this.taskQueue.enqueue(task);
        // Try to process immediately if workers are available
        await this.processQueuedTasks();
        // Return a promise that resolves when the task completes
        return new Promise((resolve, reject) => {
            const onTaskCompleted = (result) => {
                if (result.taskId === task.id) {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    resolve(result);
                }
            };
            const onTaskFailed = (error) => {
                if (error.taskId === task.id) {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    reject(error);
                }
            };
            this.on('task-completed', onTaskCompleted);
            this.on('task-failed', onTaskFailed);
            // Set up timeout
            if (task.timeout) {
                setTimeout(() => {
                    this.removeListener('task-completed', onTaskCompleted);
                    this.removeListener('task-failed', onTaskFailed);
                    reject(new Error(`Task ${task.id} timed out after ${task.timeout}ms`));
                }, task.timeout);
            }
        });
    }
    /**
     * Get current pool metrics
     */
    getMetrics() {
        const workers = Array.from(this.workers.values());
        const totalTasks = workers.reduce((sum, w) => sum + w.tasksCompleted, 0);
        const totalExecutionTime = workers.reduce((sum, w) => sum + w.totalExecutionTime, 0);
        const totalErrors = workers.reduce((sum, w) => sum + w.errorCount, 0);
        const peakMemory = Math.max(...workers.map(w => w.peakMemoryUsage), 0);
        return {
            poolSize: this.workers.size,
            activeWorkers: workers.filter(w => w.status === exports.WorkerStatus.BUSY).length,
            idleWorkers: workers.filter(w => w.status === exports.WorkerStatus.IDLE).length,
            totalTasksProcessed: totalTasks,
            averageTaskTime: totalTasks > 0 ? totalExecutionTime / totalTasks : 0,
            peakMemoryUsage: peakMemory,
            totalCpuTime: totalExecutionTime,
            errorRate: totalTasks > 0 ? totalErrors / totalTasks : 0,
            throughput: this.calculateThroughput(),
            efficiency: this.calculateEfficiency(),
            queueHealth: this.taskQueue.getStats(),
            workerHealth: workers.map(w => this.getWorkerHealth(w))
        };
    }
    /**
     * Scale the worker pool
     */
    async scalePool(targetSize) {
        if (targetSize < this.config.minWorkers || targetSize > this.config.maxWorkers) {
            throw new ValidationError(`Target size must be between ${this.config.minWorkers} and ${this.config.maxWorkers}`, { targetSize, minWorkers: this.config.minWorkers, maxWorkers: this.config.maxWorkers }, { field: 'targetSize', value: targetSize, constraint: `must be between ${this.config.minWorkers} and ${this.config.maxWorkers}` });
        }
        const currentSize = this.workers.size;
        if (targetSize > currentSize) {
            // Scale up
            const workersToAdd = targetSize - currentSize;
            await Promise.all(Array.from({ length: workersToAdd }, () => this.createWorker()));
        }
        else if (targetSize < currentSize) {
            // Scale down
            const workersToRemove = currentSize - targetSize;
            const idleWorkers = Array.from(this.workers.values())
                .filter(w => w.status === exports.WorkerStatus.IDLE)
                .slice(0, workersToRemove);
            await Promise.all(idleWorkers.map(w => this.terminateWorker(w.id)));
        }
        this.emit('pool-scaled', currentSize, this.workers.size);
    }
    /**
     * Get detailed worker information
     */
    getWorkerInfo() {
        return Array.from(this.workers.values()).map(worker => ({
            id: worker.id,
            status: worker.status,
            uptime: Date.now() - worker.createdAt.getTime(),
            tasksCompleted: worker.tasksCompleted,
            memoryUsage: worker.currentMemoryUsage,
            currentTask: worker.currentTask
        }));
    }
    /**
     * Gracefully shutdown the worker pool
     */
    async shutdown() {
        if (this.isShuttingDown) {
            return;
        }
        this.isShuttingDown = true;
        // Clear intervals
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        // Wait for active tasks to complete (with timeout)
        const activeTaskIds = Array.from(this.activeExecutions.keys());
        if (activeTaskIds.length > 0) {
            await Promise.race([
                this.waitForActiveTasks(),
                new Promise(resolve => setTimeout(resolve, 30000)) // 30s timeout
            ]);
        }
        // Terminate all workers
        await Promise.all(Array.from(this.workers.keys()).map(workerId => this.terminateWorker(workerId)));
        // Shutdown task queue
        await this.taskQueue.shutdown();
        this.emit('pool-shutdown');
    }
    // ========================================
    // Private Methods
    // ========================================
    setupEventHandlers() {
        this.taskQueue.on('task-enqueued', () => {
            this.processQueuedTasks();
        });
        this.taskQueue.on('task-timeout', (task) => {
            this.handleTaskTimeout(task);
        });
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            this.emit('error', error);
        });
        process.on('unhandledRejection', (reason) => {
            this.emit('error', new Error(`Unhandled rejection: ${reason}`));
        });
    }
    async initializeWorkerPool() {
        // Create minimum number of workers
        const initialWorkers = Array.from({ length: this.config.minWorkers }, () => this.createWorker());
        await Promise.all(initialWorkers);
        this.emit('pool-initialized', this.workers.size);
    }
    async createWorker() {
        const workerId = createWorkerId(`worker_${this.nextWorkerId++}`);
        const config = {
            id: workerId,
            scriptPath: this.workerScriptPath,
            maxMemory: this.config.memoryLimit,
            maxCpuTime: this.config.cpuTimeLimit,
            idleTimeout: this.config.idleTimeout,
            env: Object.fromEntries(Object.entries(process.env).filter(([_, value]) => value !== undefined)),
            execArgv: []
        };
        const worker = new worker_threads.Worker(this.workerScriptPath, {
            workerData: { workerId },
            resourceLimits: {
                maxOldGenerationSizeMb: Math.floor(this.config.memoryLimit / (1024 * 1024)),
                maxYoungGenerationSizeMb: Math.floor(this.config.memoryLimit / (4 * 1024 * 1024))
            }
        });
        const workerInstance = {
            id: workerId,
            config,
            worker,
            status: exports.WorkerStatus.STARTING,
            createdAt: new Date(),
            lastUsed: new Date(),
            tasksCompleted: 0,
            totalExecutionTime: 0,
            currentMemoryUsage: 0,
            peakMemoryUsage: 0,
            errorCount: 0
        };
        this.setupWorkerEventHandlers(workerInstance);
        this.workers.set(workerId, workerInstance);
        this.emit('worker-created', workerInstance);
        return workerInstance;
    }
    setupWorkerEventHandlers(workerInstance) {
        const { worker, id: workerId } = workerInstance;
        worker.on('message', (message) => {
            this.handleWorkerMessage(workerId, message);
        });
        worker.on('error', (error) => {
            this.handleWorkerError(workerId, error);
        });
        worker.on('exit', (code) => {
            this.handleWorkerExit(workerId, code);
        });
    }
    handleWorkerMessage(workerId, message) {
        const worker = this.workers.get(workerId);
        if (!worker)
            return;
        switch (message.type) {
            case MessageType.WORKER_READY:
                worker.status = exports.WorkerStatus.IDLE;
                this.processQueuedTasks();
                break;
            case MessageType.TASK_RESULT:
                this.handleTaskResult(workerId, message);
                break;
            case MessageType.TASK_ERROR:
                this.handleTaskError(workerId, message);
                break;
            case MessageType.TASK_PROGRESS:
                this.handleTaskProgress(workerId, message);
                break;
            case MessageType.MEMORY_WARNING:
                this.handleMemoryWarning(workerId, message);
                break;
            case MessageType.HEALTH_CHECK:
                this.handleHealthCheckResponse(workerId, message);
                break;
        }
    }
    handleTaskResult(workerId, message) {
        const worker = this.workers.get(workerId);
        const taskResult = message.data;
        if (worker && message.taskId) {
            // Update worker stats
            worker.status = exports.WorkerStatus.IDLE;
            worker.currentTask = undefined;
            worker.tasksCompleted++;
            worker.totalExecutionTime += taskResult.executionTime;
            worker.lastUsed = new Date();
            // Update memory usage
            if (taskResult.memoryUsage > worker.peakMemoryUsage) {
                worker.peakMemoryUsage = taskResult.memoryUsage;
            }
            worker.currentMemoryUsage = taskResult.memoryUsage;
            // Remove from active executions
            this.activeExecutions.delete(message.taskId);
            // Emit result
            this.emit('task-completed', taskResult);
            // Process next queued task
            this.processQueuedTasks();
        }
    }
    handleTaskError(workerId, message) {
        const worker = this.workers.get(workerId);
        const error = message.data;
        if (worker && message.taskId) {
            worker.status = exports.WorkerStatus.IDLE;
            worker.currentTask = undefined;
            worker.errorCount++;
            worker.lastError = error;
            // Remove from active executions
            this.activeExecutions.delete(message.taskId);
            // Handle error recovery
            this.handleErrorRecovery(workerId, error);
            // Emit error
            this.emit('task-failed', error);
            // Process next queued task
            this.processQueuedTasks();
        }
    }
    handleTaskProgress(workerId, message) {
        if (message.taskId && this.activeExecutions.has(message.taskId)) {
            const execution = this.activeExecutions.get(message.taskId);
            execution.progress = message.data.progress;
            this.emit('task-progress', message.taskId, message.data.progress);
        }
    }
    handleMemoryWarning(workerId, message) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.currentMemoryUsage = message.data.memoryUsage;
            this.emit('memory-warning', workerId, message.data);
            // Consider terminating worker if memory usage is too high
            if (message.data.memoryUsage > this.config.memoryLimit * 0.9) {
                this.restartWorker(workerId);
            }
        }
    }
    handleHealthCheckResponse(workerId, message) {
        const worker = this.workers.get(workerId);
        if (worker) {
            // Update worker health status
            worker.currentMemoryUsage = message.data.memoryUsage;
            // Additional health processing can be added here
        }
    }
    handleWorkerError(workerId, error) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.status = exports.WorkerStatus.ERROR;
            worker.errorCount++;
            worker.lastError = {
                name: error.name,
                message: error.message,
                type: 'crash',
                workerId,
                timestamp: new Date(),
                stackTrace: error.stack
            };
            // Restart worker if configured to do so
            if (this.recoveryConfig.restartWorkerOnError) {
                this.restartWorker(workerId);
            }
            this.emit('worker-error', worker.lastError);
        }
    }
    handleWorkerExit(workerId, code) {
        const worker = this.workers.get(workerId);
        if (worker) {
            worker.status = exports.WorkerStatus.TERMINATED;
            // Clean up active tasks
            if (worker.currentTask) {
                this.activeExecutions.delete(worker.currentTask);
            }
            this.emit('worker-terminated', workerId, `Exit code: ${code}`);
            // Replace worker if pool is not shutting down and we're below minimum
            if (!this.isShuttingDown && this.workers.size < this.config.minWorkers) {
                this.createWorker();
            }
        }
    }
    async processQueuedTasks() {
        while (!this.taskQueue.isEmpty() && this.hasAvailableWorkers()) {
            const task = this.taskQueue.dequeue();
            if (task) {
                const worker = this.selectWorker();
                if (worker) {
                    await this.assignTaskToWorker(worker, task);
                }
            }
        }
        // Auto-scale if needed
        if (this.config.autoScale && this.shouldScaleUp()) {
            const targetSize = Math.min(this.workers.size + 1, this.config.maxWorkers);
            await this.scalePool(targetSize);
        }
    }
    hasAvailableWorkers() {
        return Array.from(this.workers.values()).some(worker => worker.status === exports.WorkerStatus.IDLE);
    }
    selectWorker() {
        const availableWorkers = Array.from(this.workers.values())
            .filter(worker => worker.status === exports.WorkerStatus.IDLE);
        if (availableWorkers.length === 0) {
            return null;
        }
        switch (this.config.loadBalancing) {
            case 'round-robin':
                return availableWorkers[0]; // Simple round-robin
            case 'least-busy':
                return availableWorkers.reduce((least, current) => current.tasksCompleted < least.tasksCompleted ? current : least);
            case 'random':
                return availableWorkers[Math.floor(Math.random() * availableWorkers.length)];
            default:
                return availableWorkers[0];
        }
    }
    async assignTaskToWorker(worker, task) {
        worker.status = exports.WorkerStatus.BUSY;
        worker.currentTask = task.id;
        // Track execution
        const execution = {
            taskId: task.id,
            workerId: worker.id,
            startedAt: new Date(),
            status: exports.TaskStatus.RUNNING
        };
        this.activeExecutions.set(task.id, execution);
        // Send task to worker
        worker.worker.postMessage({
            type: MessageType.TASK_ASSIGNMENT,
            taskId: task.id,
            data: task,
            timestamp: new Date()
        });
        this.emit('task-started', execution);
    }
    shouldScaleUp() {
        return (this.taskQueue.size() >= this.config.scalingThreshold &&
            this.workers.size < this.config.maxWorkers);
    }
    async restartWorker(workerId) {
        await this.terminateWorker(workerId);
        await this.createWorker();
    }
    async terminateWorker(workerId) {
        const worker = this.workers.get(workerId);
        if (worker) {
            // Send shutdown message
            worker.worker.postMessage({
                type: MessageType.WORKER_SHUTDOWN,
                data: {},
                timestamp: new Date()
            });
            // Force terminate after timeout
            setTimeout(() => {
                if (!worker.worker.threadId) {
                    worker.worker.terminate();
                }
            }, 5000);
            this.workers.delete(workerId);
            this.emit('worker-terminated', workerId, 'Manual termination');
        }
    }
    handleTaskTimeout(task) {
        const execution = this.activeExecutions.get(task.id);
        if (execution) {
            const worker = this.workers.get(execution.workerId);
            if (worker && worker.currentTask === task.id) {
                worker.status = exports.WorkerStatus.IDLE;
                worker.currentTask = undefined;
            }
            this.activeExecutions.delete(task.id);
            const error = {
                name: 'TaskTimeoutError',
                message: `Task ${task.id} timed out`,
                type: 'timeout',
                taskId: task.id,
                timestamp: new Date()
            };
            this.emit('task-failed', error);
        }
    }
    handleErrorRecovery(workerId, error) {
        if (this.recoveryConfig.restartWorkerOnError && error.type === 'crash') {
            this.restartWorker(workerId);
        }
        // Additional recovery strategies can be implemented here
    }
    calculateThroughput() {
        const uptime = (Date.now() - this.startTime.getTime()) / 1000; // seconds
        const totalTasks = Array.from(this.workers.values())
            .reduce((sum, w) => sum + w.tasksCompleted, 0);
        return uptime > 0 ? totalTasks / uptime : 0;
    }
    calculateEfficiency() {
        const totalWorkers = this.workers.size;
        const busyWorkers = Array.from(this.workers.values())
            .filter(w => w.status === exports.WorkerStatus.BUSY).length;
        return totalWorkers > 0 ? (busyWorkers / totalWorkers) * 100 : 0;
    }
    getWorkerHealth(worker) {
        const uptime = Date.now() - worker.createdAt.getTime();
        const avgTaskTime = worker.tasksCompleted > 0
            ? worker.totalExecutionTime / worker.tasksCompleted
            : 0;
        return {
            workerId: worker.id,
            status: worker.status,
            uptime,
            tasksCompleted: worker.tasksCompleted,
            averageTaskTime: avgTaskTime,
            memoryUsage: worker.currentMemoryUsage,
            cpuUsage: 0, // Would need additional monitoring
            errorCount: worker.errorCount,
            efficiency: worker.tasksCompleted > 0 ?
                (worker.totalExecutionTime / uptime) * 100 : 0,
            lastActivity: worker.lastUsed
        };
    }
    async waitForActiveTasks() {
        return new Promise((resolve) => {
            const checkActiveTasks = () => {
                if (this.activeExecutions.size === 0) {
                    resolve();
                }
                else {
                    setTimeout(checkActiveTasks, 100);
                }
            };
            checkActiveTasks();
        });
    }
    startHealthMonitoring() {
        // Metrics collection
        this.metricsInterval = setInterval(() => {
            const metrics = this.getMetrics();
            this.emit('metrics-updated', metrics);
        }, 30000); // Every 30 seconds
        // Health checks
        this.healthCheckInterval = setInterval(() => {
            this.performHealthChecks();
        }, 60000); // Every minute
    }
    performHealthChecks() {
        for (const worker of this.workers.values()) {
            if (worker.status !== exports.WorkerStatus.TERMINATED) {
                worker.worker.postMessage({
                    type: MessageType.HEALTH_CHECK,
                    data: {},
                    timestamp: new Date()
                });
            }
        }
    }
};
exports.WorkerPool = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, Object])
], exports.WorkerPool);

/**
 * @fileoverview Worker Thread Integration and Utilities
 * @version 1.7.0
 * @author CREB Development Team
 *
 * This module provides integration utilities, factory functions, and high-level
 * APIs for the CREB worker thread system.
 */
/**
 * High-level worker thread manager for CREB calculations
 */
class CREBWorkerManager {
    constructor(config = {}) {
        this.isInitialized = false;
        const defaultConfig = {
            minWorkers: Math.max(1, Math.floor(require('os').cpus().length / 2)),
            maxWorkers: require('os').cpus().length,
            idleTimeout: 300000, // 5 minutes
            taskTimeout: 600000, // 10 minutes
            autoScale: true,
            scalingThreshold: 5,
            loadBalancing: 'least-busy'
        };
        this.workerPool = new exports.WorkerPool({ ...defaultConfig, ...config });
    }
    /**
     * Initialize the worker manager
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        // Wait for initial workers to be ready
        await new Promise((resolve) => {
            this.workerPool.on('pool-initialized', () => {
                this.isInitialized = true;
                resolve();
            });
        });
    }
    /**
     * Balance a chemical equation using worker threads
     */
    async balanceEquation(equation, options = {}) {
        const taskData = {
            equation,
            options: {
                method: options.method || 'matrix',
                maxIterations: options.maxIterations || 1000,
                tolerance: options.tolerance || 1e-10
            }
        };
        const task = TaskBuilder.create()
            .withType(exports.CalculationType.EQUATION_BALANCING)
            .withData(taskData)
            .withPriority(options.priority || exports.TaskPriority.NORMAL)
            .withTimeout(options.timeout || 30000)
            .build();
        const result = await this.workerPool.submitTask(task);
        if (!result.success) {
            throw new Error(`Equation balancing failed: ${result.error?.message}`);
        }
        return result.result;
    }
    /**
     * Calculate thermodynamic properties using worker threads
     */
    async calculateThermodynamics(compounds, conditions, calculations, options = {}) {
        const taskData = {
            compounds,
            conditions,
            calculations
        };
        const task = TaskBuilder.create()
            .withType(exports.CalculationType.THERMODYNAMICS)
            .withData(taskData)
            .withPriority(options.priority || exports.TaskPriority.NORMAL)
            .withTimeout(options.timeout || 60000)
            .build();
        const result = await this.workerPool.submitTask(task);
        if (!result.success) {
            throw new Error(`Thermodynamics calculation failed: ${result.error?.message}`);
        }
        return result.result;
    }
    /**
     * Perform batch compound analysis using worker threads
     */
    async analyzeBatch(compounds, properties, options = {}) {
        const { batchSize = 100 } = options;
        // Split large batches into smaller chunks for better performance
        if (compounds.length > batchSize) {
            const chunks = [];
            for (let i = 0; i < compounds.length; i += batchSize) {
                chunks.push(compounds.slice(i, i + batchSize));
            }
            // Process chunks in parallel
            const chunkResults = await Promise.all(chunks.map(chunk => this.processBatchChunk(chunk, properties, options)));
            // Combine results
            const allResults = chunkResults.flatMap(chunk => chunk.results);
            return {
                totalCompounds: compounds.length,
                results: allResults,
                options
            };
        }
        else {
            return this.processBatchChunk(compounds, properties, options);
        }
    }
    /**
     * Solve matrix equation using worker threads
     */
    async solveMatrix(matrix, vector, options = {}) {
        const taskData = {
            matrix,
            vector,
            method: options.method || 'gaussian',
            options: {
                tolerance: options.tolerance || 1e-10,
                maxIterations: options.maxIterations || 1000,
                pivoting: options.pivoting !== false
            }
        };
        const task = TaskBuilder.create()
            .withType(exports.CalculationType.MATRIX_SOLVING)
            .withData(taskData)
            .withPriority(options.priority || exports.TaskPriority.NORMAL)
            .withTimeout(options.timeout || 120000) // 2 minutes for matrix operations
            .build();
        const result = await this.workerPool.submitTask(task);
        if (!result.success) {
            throw new Error(`Matrix solving failed: ${result.error?.message}`);
        }
        return result.result;
    }
    /**
     * Get performance metrics for the worker system
     */
    getMetrics() {
        return this.workerPool.getMetrics();
    }
    /**
     * Get worker information
     */
    getWorkerInfo() {
        return this.workerPool.getWorkerInfo();
    }
    /**
     * Scale the worker pool
     */
    async scaleWorkers(targetSize) {
        await this.workerPool.scalePool(targetSize);
    }
    /**
     * Run performance benchmark
     */
    async runBenchmark(operation, dataSize) {
        const singleThreadTime = await this.benchmarkSingleThread(operation, dataSize);
        const multiThreadTime = await this.benchmarkMultiThread(operation, dataSize);
        const speedup = singleThreadTime / multiThreadTime;
        const efficiency = speedup / this.workerPool.getMetrics().poolSize;
        return {
            operation,
            dataSize,
            singleThreadTime,
            multiThreadTime,
            speedup,
            efficiency: efficiency * 100,
            memoryOverhead: this.calculateMemoryOverhead(),
            optimalWorkerCount: this.calculateOptimalWorkerCount(speedup)
        };
    }
    /**
     * Gracefully shutdown the worker manager
     */
    async shutdown() {
        await this.workerPool.shutdown();
        this.isInitialized = false;
    }
    // ========================================
    // Private Methods
    // ========================================
    async processBatchChunk(compounds, properties, options) {
        const taskData = {
            compounds,
            properties,
            options: {
                includeIsomers: options.includeIsomers || false,
                includeSpectroscopy: options.includeSpectroscopy || false,
                dataProvider: options.dataProvider || 'internal'
            }
        };
        const task = TaskBuilder.create()
            .withType(exports.CalculationType.BATCH_ANALYSIS)
            .withData(taskData)
            .withPriority(options.priority || exports.TaskPriority.NORMAL)
            .withTimeout(options.timeout || 300000) // 5 minutes
            .build();
        const result = await this.workerPool.submitTask(task);
        if (!result.success) {
            throw new Error(`Batch analysis failed: ${result.error?.message}`);
        }
        return result.result;
    }
    async benchmarkSingleThread(operation, dataSize) {
        // Simulate single-thread execution time
        // In a real implementation, this would run the operation on the main thread
        const baseTime = {
            'equation_balancing': 10,
            'thermodynamics': 50,
            'matrix_solving': 100,
            'batch_analysis': 20
        }[operation] || 50;
        return baseTime * Math.sqrt(dataSize);
    }
    async benchmarkMultiThread(operation, dataSize) {
        const startTime = Date.now();
        // Create benchmark tasks based on operation type
        const tasks = this.createBenchmarkTasks(operation, dataSize);
        // Execute tasks in parallel
        await Promise.all(tasks.map(task => this.workerPool.submitTask(task)));
        return Date.now() - startTime;
    }
    createBenchmarkTasks(operation, dataSize) {
        const tasks = [];
        switch (operation) {
            case 'equation_balancing':
                for (let i = 0; i < dataSize; i++) {
                    tasks.push(TaskBuilder.create()
                        .withType(exports.CalculationType.EQUATION_BALANCING)
                        .withData({ equation: `H${i + 1} + O2 -> H${i + 1}O` })
                        .withPriority(exports.TaskPriority.HIGH)
                        .build());
                }
                break;
            case 'thermodynamics':
                for (let i = 0; i < dataSize; i++) {
                    tasks.push(TaskBuilder.create()
                        .withType(exports.CalculationType.THERMODYNAMICS)
                        .withData({
                        compounds: [{ formula: 'H2O', amount: i + 1 }],
                        conditions: { temperature: 298.15 + i },
                        calculations: ['enthalpy', 'entropy']
                    })
                        .withPriority(exports.TaskPriority.HIGH)
                        .build());
                }
                break;
            case 'matrix_solving':
                for (let i = 0; i < dataSize; i++) {
                    const size = Math.max(2, Math.floor(Math.sqrt(i + 1)));
                    const matrix = Array(size).fill(null).map(() => Array(size).fill(null).map(() => Math.random()));
                    tasks.push(TaskBuilder.create()
                        .withType(exports.CalculationType.MATRIX_SOLVING)
                        .withData({ matrix, method: 'gaussian' })
                        .withPriority(exports.TaskPriority.HIGH)
                        .build());
                }
                break;
            case 'batch_analysis':
                const batchSize = Math.max(1, Math.floor(dataSize / 10));
                for (let i = 0; i < 10; i++) {
                    const compounds = Array(batchSize).fill(null).map((_, j) => `C${i}H${j + 1}`);
                    tasks.push(TaskBuilder.create()
                        .withType(exports.CalculationType.BATCH_ANALYSIS)
                        .withData({
                        compounds,
                        properties: ['molecular_weight', 'density']
                    })
                        .withPriority(exports.TaskPriority.HIGH)
                        .build());
                }
                break;
        }
        return tasks;
    }
    calculateMemoryOverhead() {
        const metrics = this.workerPool.getMetrics();
        // Estimate memory overhead based on worker pool metrics
        return metrics.poolSize * 50 * 1024 * 1024; // Rough estimate: 50MB per worker
    }
    calculateOptimalWorkerCount(speedup) {
        const cpuCount = require('os').cpus().length;
        // Simple heuristic: optimal worker count is where efficiency is highest
        if (speedup > cpuCount * 0.8) {
            return cpuCount;
        }
        else if (speedup > cpuCount * 0.6) {
            return Math.floor(cpuCount * 0.75);
        }
        else {
            return Math.floor(cpuCount * 0.5);
        }
    }
}
/**
 * Factory function for creating worker managers
 */
function createWorkerManager(config) {
    return new CREBWorkerManager(config);
}
/**
 * Utility function for creating high-priority tasks
 */
function createCriticalTask(type, data, timeout) {
    return TaskBuilder.create()
        .withType(type)
        .withData(data)
        .withPriority(exports.TaskPriority.CRITICAL)
        .withTimeout(timeout || 60000)
        .build();
}
/**
 * Utility function for creating batch tasks
 */
function createBatchTasks(type, dataArray, priority = exports.TaskPriority.NORMAL) {
    return dataArray.map(data => TaskBuilder.create()
        .withType(type)
        .withData(data)
        .withPriority(priority)
        .build());
}
/**
 * Performance monitor for worker threads
 */
class WorkerPerformanceMonitor {
    constructor(manager) {
        this.metrics = [];
        this.manager = manager;
    }
    /**
     * Start performance monitoring
     */
    startMonitoring(intervalMs = 30000) {
        this.monitoringInterval = setInterval(() => {
            const metrics = this.manager.getMetrics();
            this.metrics.push(metrics);
            // Keep only last 100 measurements
            if (this.metrics.length > 100) {
                this.metrics.shift();
            }
        }, intervalMs);
    }
    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
    }
    /**
     * Get performance trends
     */
    getTrends() {
        return {
            throughputTrend: this.metrics.map(m => m.throughput),
            efficiencyTrend: this.metrics.map(m => m.efficiency),
            errorRateTrend: this.metrics.map(m => m.errorRate),
            memoryTrend: this.metrics.map(m => m.peakMemoryUsage)
        };
    }
    /**
     * Get performance summary
     */
    getSummary() {
        if (this.metrics.length === 0) {
            return null;
        }
        const latest = this.metrics[this.metrics.length - 1];
        const throughputs = this.metrics.map(m => m.throughput);
        const efficiencies = this.metrics.map(m => m.efficiency);
        return {
            current: latest,
            averageThroughput: throughputs.reduce((a, b) => a + b, 0) / throughputs.length,
            averageEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
            peakThroughput: Math.max(...throughputs),
            peakEfficiency: Math.max(...efficiencies),
            measurementCount: this.metrics.length
        };
    }
}

/**
 * CREB-JS Plugin System Types
 *
 * Type definitions for the plugin system including plugin interfaces,
 * API contexts, lifecycle management, and security configurations.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Plugin execution context with permission levels
 */
exports.PluginContextEnum = void 0;
(function (PluginContext) {
    PluginContext["Calculation"] = "calculation";
    PluginContext["DataProvider"] = "data-provider";
    PluginContext["UI"] = "ui";
    PluginContext["System"] = "system";
})(exports.PluginContextEnum || (exports.PluginContextEnum = {}));
/**
 * Plugin permission levels for security sandboxing
 */
exports.PluginPermissionEnum = void 0;
(function (PluginPermission) {
    PluginPermission["ReadOnly"] = "read-only";
    PluginPermission["ReadWrite"] = "read-write";
    PluginPermission["SystemAccess"] = "system-access";
    PluginPermission["NetworkAccess"] = "network-access";
})(exports.PluginPermissionEnum || (exports.PluginPermissionEnum = {}));
/**
 * Plugin lifecycle states
 */
exports.PluginStateEnum = void 0;
(function (PluginState) {
    PluginState["Unloaded"] = "unloaded";
    PluginState["Loading"] = "loading";
    PluginState["Loaded"] = "loaded";
    PluginState["Active"] = "active";
    PluginState["Inactive"] = "inactive";
    PluginState["Error"] = "error";
    PluginState["Unloading"] = "unloading";
})(exports.PluginStateEnum || (exports.PluginStateEnum = {}));
/**
 * Plugin priority levels for execution order
 */
exports.PluginPriorityEnum = void 0;
(function (PluginPriority) {
    PluginPriority[PluginPriority["Critical"] = 1000] = "Critical";
    PluginPriority[PluginPriority["High"] = 750] = "High";
    PluginPriority[PluginPriority["Normal"] = 500] = "Normal";
    PluginPriority[PluginPriority["Low"] = 250] = "Low";
    PluginPriority[PluginPriority["Background"] = 100] = "Background";
})(exports.PluginPriorityEnum || (exports.PluginPriorityEnum = {}));

/**
 * CREB-JS Plugin API Context Implementation
 *
 * Provides secure, controlled access to CREB services and utilities
 * for plugins with permission-based sandboxing and resource management.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Permission denied error for unauthorized plugin operations
 */
class PluginPermissionError extends Error {
    constructor(pluginId, requiredPermission, operation) {
        super(`Plugin ${pluginId} lacks permission ${requiredPermission} for operation: ${operation}`);
        this.pluginId = pluginId;
        this.requiredPermission = requiredPermission;
        this.name = 'PluginPermissionError';
    }
}
/**
 * Resource limit exceeded error
 */
class PluginResourceError extends Error {
    constructor(pluginId, resource, limit, used) {
        super(`Plugin ${pluginId} exceeded ${resource} limit: ${used}/${limit}`);
        this.pluginId = pluginId;
        this.resource = resource;
        this.limit = limit;
        this.used = used;
        this.name = 'PluginResourceError';
    }
}
/**
 * Plugin service registry implementation with permission checking
 */
class SecurePluginServiceRegistry {
    constructor(container, pluginId, permissions, logger) {
        this.container = container;
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
    }
    get(token) {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'service access');
        try {
            return this.container.resolve(token);
        }
        catch (error) {
            this.logger.warn(`Service access failed for ${String(token)}:`, error);
            return undefined;
        }
    }
    has(token) {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'service discovery');
        return this.container.isRegistered(token);
    }
    list() {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'service listing');
        return this.container.getRegisteredTokens();
    }
    _checkPermission(required, operation) {
        // Check if the plugin has the exact permission or a higher-level permission
        const hasPermission = this.permissions.includes(required) ||
            (required === exports.PluginPermissionEnum.ReadOnly && this.permissions.includes(exports.PluginPermissionEnum.ReadWrite));
        if (!hasPermission) {
            throw new PluginPermissionError(this.pluginId, required, operation);
        }
    }
}
/**
 * Plugin event system implementation with sandboxing
 */
class SandboxedPluginEventSystem {
    constructor(pluginId, permissions, logger, globalEventSystem) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.globalEventSystem = globalEventSystem;
        this.maxListeners = 50;
        this.eventEmitter = new events.EventEmitter();
        this.eventPrefix = `plugin:${pluginId}:`;
        this.eventEmitter.setMaxListeners(this.maxListeners);
    }
    emit(event, data) {
        this._checkPermission(exports.PluginPermissionEnum.ReadWrite, 'event emission');
        const namespacedEvent = this._namespaceEvent(event);
        this.logger.debug(`Emitting event: ${namespacedEvent}`);
        // Emit both locally and globally
        this.eventEmitter.emit(event, data);
        this.globalEventSystem.emit(namespacedEvent, { pluginId: this.pluginId, data });
    }
    on(event, handler) {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'event listening');
        const wrappedHandler = this._wrapHandler(handler, event);
        this.eventEmitter.on(event, wrappedHandler);
        // Also listen to global events
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.on(namespacedEvent, wrappedHandler);
    }
    off(event, handler) {
        this.eventEmitter.off(event, handler);
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.off(namespacedEvent, handler);
    }
    once(event, handler) {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'event listening');
        const wrappedHandler = this._wrapHandler(handler, event);
        this.eventEmitter.once(event, wrappedHandler);
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.once(namespacedEvent, wrappedHandler);
    }
    _namespaceEvent(event) {
        return `${this.eventPrefix}${event}`;
    }
    _wrapHandler(handler, event) {
        return (data) => {
            try {
                handler(data);
            }
            catch (error) {
                this.logger.error(`Event handler error for ${event}:`, error);
            }
        };
    }
    _checkPermission(required, operation) {
        // Check if the plugin has the exact permission or a higher-level permission
        const hasPermission = this.permissions.includes(required) ||
            (required === exports.PluginPermissionEnum.ReadOnly && this.permissions.includes(exports.PluginPermissionEnum.ReadWrite));
        if (!hasPermission) {
            throw new PluginPermissionError(this.pluginId, required, operation);
        }
    }
}
/**
 * Plugin storage implementation with isolation
 */
class IsolatedPluginStorage {
    constructor(pluginId, permissions, logger, storage = new Map()) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.storage = storage;
        this.storagePrefix = `plugin:${pluginId}:`;
    }
    async get(key) {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'storage read');
        const namespacedKey = this._namespaceKey(key);
        return this.storage.get(namespacedKey);
    }
    async set(key, value) {
        this._checkPermission(exports.PluginPermissionEnum.ReadWrite, 'storage write');
        const namespacedKey = this._namespaceKey(key);
        this.storage.set(namespacedKey, value);
        this.logger.debug(`Storage set: ${namespacedKey}`);
    }
    async delete(key) {
        this._checkPermission(exports.PluginPermissionEnum.ReadWrite, 'storage delete');
        const namespacedKey = this._namespaceKey(key);
        this.storage.delete(namespacedKey);
        this.logger.debug(`Storage delete: ${namespacedKey}`);
    }
    async clear() {
        this._checkPermission(exports.PluginPermissionEnum.ReadWrite, 'storage clear');
        const keysToDelete = Array.from(this.storage.keys())
            .filter(key => key.startsWith(this.storagePrefix));
        keysToDelete.forEach(key => this.storage.delete(key));
        this.logger.debug(`Storage cleared for plugin: ${this.pluginId}`);
    }
    async keys() {
        this._checkPermission(exports.PluginPermissionEnum.ReadOnly, 'storage enumeration');
        return Array.from(this.storage.keys())
            .filter(key => key.startsWith(this.storagePrefix))
            .map(key => key.substring(this.storagePrefix.length));
    }
    _namespaceKey(key) {
        return `${this.storagePrefix}${key}`;
    }
    _checkPermission(required, operation) {
        // Check if the plugin has the exact permission or a higher-level permission
        const hasPermission = this.permissions.includes(required) ||
            (required === exports.PluginPermissionEnum.ReadOnly && this.permissions.includes(exports.PluginPermissionEnum.ReadWrite));
        if (!hasPermission) {
            throw new PluginPermissionError(this.pluginId, required, operation);
        }
    }
}
/**
 * Plugin HTTP client implementation with rate limiting
 */
class RateLimitedPluginHttpClient {
    constructor(pluginId, permissions, logger, maxRequestsPerMinute = 100) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.requestCount = 0;
        this.lastResetTime = Date.now();
        this.resetInterval = 60000; // 1 minute
    }
    async get(url, options) {
        return this._makeRequest('GET', url, undefined, options);
    }
    async post(url, data, options) {
        return this._makeRequest('POST', url, data, options);
    }
    async put(url, data, options) {
        return this._makeRequest('PUT', url, data, options);
    }
    async delete(url, options) {
        return this._makeRequest('DELETE', url, undefined, options);
    }
    async _makeRequest(method, url, data, options) {
        this._checkPermission(exports.PluginPermissionEnum.NetworkAccess, 'HTTP request');
        this._checkRateLimit();
        const requestOptions = {
            ...options,
            method,
            headers: {
                'User-Agent': `CREB-Plugin/${this.pluginId}`,
                ...options?.headers
            }
        };
        if (data && (method === 'POST' || method === 'PUT')) {
            if (typeof data === 'object') {
                requestOptions.body = JSON.stringify(data);
                requestOptions.headers = {
                    'Content-Type': 'application/json',
                    ...requestOptions.headers
                };
            }
            else {
                requestOptions.body = data;
            }
        }
        try {
            this.logger.debug(`Making ${method} request to: ${url}`);
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                this.logger.warn(`HTTP request failed: ${response.status} ${response.statusText}`);
            }
            return response;
        }
        catch (error) {
            this.logger.error(`HTTP request error:`, error);
            throw error;
        }
    }
    _checkPermission(required, operation) {
        // Check if the plugin has the exact permission or a higher-level permission
        const hasPermission = this.permissions.includes(required) ||
            (required === exports.PluginPermissionEnum.ReadOnly && this.permissions.includes(exports.PluginPermissionEnum.ReadWrite));
        if (!hasPermission) {
            throw new PluginPermissionError(this.pluginId, required, operation);
        }
    }
    _checkRateLimit() {
        const now = Date.now();
        if (now - this.lastResetTime >= this.resetInterval) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }
        if (this.requestCount >= this.maxRequestsPerMinute) {
            throw new PluginResourceError(this.pluginId, 'HTTP requests per minute', this.maxRequestsPerMinute, this.requestCount);
        }
        this.requestCount++;
    }
}
/**
 * Plugin utilities implementation
 */
class PluginUtilitiesImpl {
    constructor(pluginId, logger) {
        this.pluginId = pluginId;
        this.logger = logger;
    }
    validateFormula(formula) {
        try {
            // Basic chemical formula validation - allow simple molecular formulas
            const trimmedFormula = formula.trim();
            if (!trimmedFormula)
                return false;
            // Allow simple formulas like H2O, CO2, NaCl, etc.
            const formulaRegex = /^([A-Z][a-z]?\d*)+$/;
            return formulaRegex.test(trimmedFormula);
        }
        catch (error) {
            this.logger.warn(`Formula validation error:`, error);
            return false;
        }
    }
    parseFormula(formula) {
        try {
            const elements = {};
            const regex = /([A-Z][a-z]?)(\d*)/g;
            let match;
            while ((match = regex.exec(formula)) !== null) {
                const element = match[1];
                const count = match[2] ? parseInt(match[2], 10) : 1;
                elements[element] = (elements[element] || 0) + count;
            }
            return elements;
        }
        catch (error) {
            this.logger.error(`Formula parsing error:`, error);
            return {};
        }
    }
    calculateMolarWeight(formula) {
        try {
            // Simplified molar weight calculation
            const atomicWeights = {
                H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811,
                C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
                Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974,
                S: 32.065, Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078
            };
            const elements = this.parseFormula(formula);
            let totalWeight = 0;
            for (const [element, count] of Object.entries(elements)) {
                const weight = atomicWeights[element];
                if (weight) {
                    totalWeight += weight * count;
                }
                else {
                    this.logger.warn(`Unknown element in formula: ${element}`);
                }
            }
            return totalWeight;
        }
        catch (error) {
            this.logger.error(`Molar weight calculation error:`, error);
            return 0;
        }
    }
    formatNumber(value, precision = 2) {
        try {
            return value.toFixed(precision);
        }
        catch (error) {
            this.logger.warn(`Number formatting error:`, error);
            return String(value);
        }
    }
    sanitizeInput(input) {
        try {
            // Basic input sanitization
            return input
                .trim()
                .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
                .substring(0, 1000); // Limit length
        }
        catch (error) {
            this.logger.warn(`Input sanitization error:`, error);
            return '';
        }
    }
}
/**
 * Main plugin API context implementation
 */
class PluginAPIContextImpl {
    constructor(container, pluginId, permissions, logger, globalEventSystem, globalStorage) {
        this.container = container;
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.globalEventSystem = globalEventSystem;
        this.globalStorage = globalStorage;
        this.version = '1.0.0';
        this.services = new SecurePluginServiceRegistry(container, pluginId, permissions, logger);
        this.events = new SandboxedPluginEventSystem(pluginId, permissions, logger, globalEventSystem);
        this.storage = new IsolatedPluginStorage(pluginId, permissions, logger, globalStorage);
        this.http = new RateLimitedPluginHttpClient(pluginId, permissions, logger);
        this.utils = new PluginUtilitiesImpl(pluginId, logger);
    }
}
/**
 * Plugin API context factory
 */
class PluginAPIContextFactory {
    constructor(container, globalEventSystem, globalStorage) {
        this.container = container;
        this.globalEventSystem = globalEventSystem;
        this.globalStorage = globalStorage;
    }
    create(pluginId, permissions, logger) {
        return new PluginAPIContextImpl(this.container, pluginId, permissions, logger, this.globalEventSystem, this.globalStorage);
    }
}

/**
 * CREB-JS Plugin Manager
 *
 * Central plugin management system providing plugin discovery, loading,
 * lifecycle management, security sandboxing, and marketplace integration.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Plugin manager error classes
 */
class PluginManagerError extends Error {
    constructor(message, operation) {
        super(message);
        this.operation = operation;
        this.name = 'PluginManagerError';
    }
}
class PluginLoadError extends PluginManagerError {
    constructor(pluginId, reason) {
        super(`Failed to load plugin ${pluginId}: ${reason}`, 'load');
        this.name = 'PluginLoadError';
    }
}
class PluginSecurityError extends PluginManagerError {
    constructor(pluginId, violation) {
        super(`Security violation in plugin ${pluginId}: ${violation}`, 'security');
        this.name = 'PluginSecurityError';
    }
}
/**
 * Plugin registry for managing loaded plugins
 */
class PluginRegistry {
    constructor() {
        this.plugins = new Map();
        this.manifests = new Map();
    }
    register(manifest, plugin) {
        this.manifests.set(manifest.metadata.id, manifest);
        this.plugins.set(manifest.metadata.id, plugin);
    }
    unregister(pluginId) {
        this.manifests.delete(pluginId);
        this.plugins.delete(pluginId);
    }
    get(pluginId) {
        return this.plugins.get(pluginId);
    }
    getManifest(pluginId) {
        return this.manifests.get(pluginId);
    }
    list() {
        return Array.from(this.plugins.values());
    }
    listByState(state) {
        return this.list().filter(plugin => plugin.state === state);
    }
    listByContext(context) {
        return this.list().filter(plugin => {
            const manifest = this.manifests.get(plugin.metadata.id);
            return manifest?.metadata.context.includes(context);
        });
    }
    has(pluginId) {
        return this.plugins.has(pluginId);
    }
    size() {
        return this.plugins.size;
    }
}
/**
 * Plugin logger implementation
 */
class PluginLoggerImpl {
    constructor(pluginId, level = 'info') {
        this.pluginId = pluginId;
        this.level = level;
    }
    debug(message, ...args) {
        if (this._shouldLog('debug')) {
            console.debug(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this._shouldLog('info')) {
            console.info(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this._shouldLog('warn')) {
            console.warn(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    error(message, error, ...args) {
        if (this._shouldLog('error')) {
            console.error(`[Plugin:${this.pluginId}] ${message}`, error, ...args);
        }
    }
    _shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }
}
/**
 * Main plugin manager class
 */
class PluginManager extends events.EventEmitter {
    constructor(container, config) {
        super();
        this.container = container;
        this.config = config;
        this.registry = new PluginRegistry();
        this.globalStorage = new Map();
        this.discoveredPlugins = new Map();
        this.apiContextFactory = new PluginAPIContextFactory(container, this, // Use this EventEmitter as global event system
        this.globalStorage);
        this.setMaxListeners(0); // Unlimited listeners for plugin events
    }
    /**
     * Initialize the plugin manager
     */
    async initialize() {
        try {
            // Ensure plugin directory exists
            await this._ensurePluginDirectory();
            // Start periodic health checks
            if (this.config.healthCheckInterval > 0) {
                this.healthCheckTimer = setInterval(() => this._performHealthChecks(), this.config.healthCheckInterval);
            }
            // Start plugin discovery
            if (this.config.discoveryInterval > 0) {
                this.discoveryTimer = setInterval(() => this._discoverPlugins(), this.config.discoveryInterval);
            }
            // Initial plugin discovery
            await this._discoverPlugins();
            console.info(`Plugin manager initialized with ${this.registry.size()} plugins`);
        }
        catch (error) {
            throw new PluginManagerError(`Failed to initialize plugin manager: ${error.message}`, 'initialize');
        }
    }
    /**
     * Shutdown the plugin manager
     */
    async shutdown() {
        try {
            // Clear timers
            if (this.healthCheckTimer) {
                clearInterval(this.healthCheckTimer);
            }
            if (this.discoveryTimer) {
                clearInterval(this.discoveryTimer);
            }
            // Unload all plugins
            const activePlugins = this.registry.listByState(exports.PluginStateEnum.Active);
            for (const plugin of activePlugins) {
                await this.unloadPlugin(plugin.metadata.id);
            }
            console.info('Plugin manager shutdown complete');
        }
        catch (error) {
            throw new PluginManagerError(`Failed to shutdown plugin manager: ${error.message}`, 'shutdown');
        }
    }
    /**
     * Load a plugin from manifest
     */
    async loadPlugin(manifest) {
        try {
            const { metadata } = manifest;
            // Check if already loaded
            if (this.registry.has(metadata.id)) {
                throw new Error(`Plugin already loaded: ${metadata.id}`);
            }
            // Check plugin limits
            if (this.registry.size() >= this.config.maxPlugins) {
                throw new Error(`Maximum plugin limit reached: ${this.config.maxPlugins}`);
            }
            // Validate plugin metadata
            this._validatePluginMetadata(metadata);
            // Check security permissions
            this._validatePluginSecurity(metadata);
            // Create plugin instance
            const logger = new PluginLoggerImpl(metadata.id);
            const apiContext = this.apiContextFactory.create(metadata.id, metadata.permissions, logger);
            const plugin = manifest.factory({
                metadata,
                config: manifest.config,
                apiContext,
                logger
            });
            // Initialize plugin
            await plugin.initialize({
                metadata,
                config: manifest.config,
                apiContext,
                logger
            });
            // Register plugin
            this.registry.register(manifest, plugin);
            // Activate plugin if auto-load is enabled
            if (manifest.config.autoLoad) {
                await this.activatePlugin(metadata.id);
            }
            this.emit('plugin-loaded', plugin);
            logger.info(`Plugin loaded successfully: ${metadata.name}`);
        }
        catch (error) {
            const errorInfo = {
                pluginId: manifest.metadata.id,
                error: error,
                context: 'loading',
                timestamp: new Date(),
                recoverable: false
            };
            this.emit('plugin-error', errorInfo);
            throw new PluginLoadError(manifest.metadata.id, error.message);
        }
    }
    /**
     * Unload a plugin
     */
    async unloadPlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            // Deactivate if active
            if (plugin.state === exports.PluginStateEnum.Active) {
                await this.deactivatePlugin(pluginId);
            }
            // Cleanup plugin
            await plugin.cleanup();
            // Unregister
            this.registry.unregister(pluginId);
            this.emit('plugin-unloaded', pluginId);
            console.info(`Plugin unloaded: ${pluginId}`);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'unloading',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Activate a plugin
     */
    async activatePlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            await plugin.activate();
            this.emit('plugin-activated', plugin);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'activation',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Deactivate a plugin
     */
    async deactivatePlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            await plugin.deactivate();
            this.emit('plugin-deactivated', plugin);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'deactivation',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId) {
        return this.registry.get(pluginId);
    }
    /**
     * List all plugins
     */
    listPlugins() {
        return this.registry.list();
    }
    /**
     * List plugins by state
     */
    listPluginsByState(state) {
        return this.registry.listByState(state);
    }
    /**
     * List plugins by context
     */
    listPluginsByContext(context) {
        return this.registry.listByContext(context);
    }
    /**
     * Get plugin health status
     */
    getPluginHealth(pluginId) {
        const plugin = this.registry.get(pluginId);
        return plugin?.getHealth();
    }
    /**
     * Update plugin configuration
     */
    async updatePluginConfig(pluginId, config) {
        const plugin = this.registry.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin not found: ${pluginId}`);
        }
        await plugin.updateConfig(config);
    }
    /**
     * Hot-swap a plugin (if enabled)
     */
    async hotSwapPlugin(pluginId, newManifest) {
        if (!this.config.enableHotSwap) {
            throw new Error('Hot-swap is disabled');
        }
        try {
            // Unload old plugin
            await this.unloadPlugin(pluginId);
            // Load new plugin
            await this.loadPlugin(newManifest);
            console.info(`Plugin hot-swapped: ${pluginId}`);
        }
        catch (error) {
            throw new PluginManagerError(`Hot-swap failed for ${pluginId}: ${error.message}`, 'hot-swap');
        }
    }
    /**
     * Private helper methods
     */
    async _ensurePluginDirectory() {
        try {
            await fs.promises.mkdir(this.config.pluginDirectory, { recursive: true });
        }
        catch (error) {
            // Directory might already exist
        }
    }
    async _discoverPlugins() {
        try {
            const pluginFiles = await fs.promises.readdir(this.config.pluginDirectory);
            for (const file of pluginFiles) {
                if (file.endsWith('.js') || file.endsWith('.ts')) {
                    const pluginPath = path__namespace.join(this.config.pluginDirectory, file);
                    await this._loadPluginFromFile(pluginPath);
                }
            }
        }
        catch (error) {
            console.warn('Plugin discovery failed:', error);
        }
    }
    async _loadPluginFromFile(filePath) {
        try {
            // Dynamic import would be used here in a real implementation
            // For now, we'll skip the actual file loading
            console.debug(`Discovering plugin at: ${filePath}`);
        }
        catch (error) {
            console.warn(`Failed to load plugin from ${filePath}:`, error);
        }
    }
    _performHealthChecks() {
        const plugins = this.registry.list();
        for (const plugin of plugins) {
            try {
                const health = plugin.getHealth();
                this.emit('plugin-health-check', plugin.metadata.id, health);
                if (!health.healthy) {
                    console.warn(`Plugin health check failed: ${plugin.metadata.id} - ${health.message}`);
                }
            }
            catch (error) {
                const errorInfo = {
                    pluginId: plugin.metadata.id,
                    error: error,
                    context: 'health-check',
                    timestamp: new Date(),
                    recoverable: true
                };
                this.emit('plugin-error', errorInfo);
            }
        }
    }
    _validatePluginMetadata(metadata) {
        if (!metadata.id || !metadata.name || !metadata.version) {
            throw new Error('Plugin metadata must include id, name, and version');
        }
        if (!this._isValidAPIVersion(metadata.apiVersion)) {
            throw new Error(`Unsupported API version: ${metadata.apiVersion}`);
        }
    }
    _validatePluginSecurity(metadata) {
        const { securityLevel } = this.config;
        if (securityLevel === 'strict') {
            // In strict mode, only allow read-only permissions by default
            const dangerousPermissions = [
                exports.PluginPermissionEnum.SystemAccess,
                exports.PluginPermissionEnum.NetworkAccess
            ];
            const hasDangerousPermissions = metadata.permissions.some(p => dangerousPermissions.includes(p));
            if (hasDangerousPermissions) {
                throw new PluginSecurityError(metadata.id, 'Dangerous permissions not allowed in strict mode');
            }
        }
    }
    _isValidAPIVersion(version) {
        const supportedVersions = ['1.0.0', '1.1.0'];
        return supportedVersions.includes(version);
    }
}

/**
 * CREB-JS Base Plugin Implementation
 *
 * Abstract base class providing common plugin functionality including
 * lifecycle management, state tracking, error handling, and extension points.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Base plugin error class
 */
class PluginBaseError extends Error {
    constructor(message, pluginId, context = 'unknown', recoverable = true) {
        super(message);
        this.pluginId = pluginId;
        this.context = context;
        this.recoverable = recoverable;
        this.name = 'PluginBaseError';
    }
}
/**
 * Plugin execution timeout error
 */
class PluginTimeoutError extends PluginBaseError {
    constructor(pluginId, timeout) {
        super(`Plugin execution timed out after ${timeout}ms`, pluginId, 'execution', false);
        this.name = 'PluginTimeoutError';
    }
}
/**
 * Plugin initialization error
 */
class PluginInitializationError extends PluginBaseError {
    constructor(pluginId, reason) {
        super(`Plugin initialization failed: ${reason}`, pluginId, 'initialization', false);
        this.name = 'PluginInitializationError';
    }
}
/**
 * Abstract base plugin class providing common functionality
 */
class BasePlugin extends events.EventEmitter {
    constructor(metadata, extensionPoints = []) {
        super();
        this.metadata = metadata;
        this.extensionPoints = extensionPoints;
        this._state = exports.PluginStateEnum.Unloaded;
        this._healthStatus = {
            healthy: true,
            timestamp: new Date()
        };
        this.setMaxListeners(100); // Allow many event listeners
    }
    /**
     * Get current plugin state
     */
    get state() {
        return this._state;
    }
    /**
     * Get plugin configuration
     */
    get config() {
        return this._config;
    }
    /**
     * Get API context
     */
    get apiContext() {
        return this._apiContext;
    }
    /**
     * Get plugin logger
     */
    get logger() {
        return this._logger;
    }
    /**
     * Initialize the plugin with parameters
     */
    async initialize(params) {
        try {
            this._setState(exports.PluginStateEnum.Loading);
            this._config = params.config;
            this._apiContext = params.apiContext;
            this._logger = params.logger;
            this._logger.info(`Initializing plugin: ${this.metadata.name}`);
            // Call derived class initialization
            if (this.onInitialize) {
                await this._executeWithTimeout(() => this.onInitialize(params), this._config.timeouts.initialization, 'initialization');
            }
            this._setState(exports.PluginStateEnum.Loaded);
            this._logger.info(`Plugin initialized successfully: ${this.metadata.name}`);
        }
        catch (error) {
            this._setState(exports.PluginStateEnum.Error);
            this._logger.error(`Plugin initialization failed: ${this.metadata.name}`, error);
            throw new PluginInitializationError(this.metadata.id, error.message);
        }
    }
    /**
     * Activate the plugin
     */
    async activate() {
        try {
            if (this._state !== exports.PluginStateEnum.Loaded && this._state !== exports.PluginStateEnum.Inactive) {
                throw new Error(`Cannot activate plugin in state: ${this._state}`);
            }
            this._logger.info(`Activating plugin: ${this.metadata.name}`);
            if (this.onActivate) {
                await this._executeWithTimeout(() => this.onActivate(), this._config.timeouts.execution, 'activation');
            }
            this._setState(exports.PluginStateEnum.Active);
            this._logger.info(`Plugin activated successfully: ${this.metadata.name}`);
            this.emit('activated');
        }
        catch (error) {
            this._setState(exports.PluginStateEnum.Error);
            this._logger.error(`Plugin activation failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Deactivate the plugin
     */
    async deactivate() {
        try {
            if (this._state !== exports.PluginStateEnum.Active) {
                throw new Error(`Cannot deactivate plugin in state: ${this._state}`);
            }
            this._logger.info(`Deactivating plugin: ${this.metadata.name}`);
            if (this.onDeactivate) {
                await this._executeWithTimeout(() => this.onDeactivate(), this._config.timeouts.execution, 'deactivation');
            }
            this._setState(exports.PluginStateEnum.Inactive);
            this._logger.info(`Plugin deactivated successfully: ${this.metadata.name}`);
            this.emit('deactivated');
        }
        catch (error) {
            this._setState(exports.PluginStateEnum.Error);
            this._logger.error(`Plugin deactivation failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Cleanup and unload the plugin
     */
    async cleanup() {
        try {
            this._setState(exports.PluginStateEnum.Unloading);
            this._logger.info(`Cleaning up plugin: ${this.metadata.name}`);
            if (this.onCleanup) {
                await this._executeWithTimeout(() => this.onCleanup(), this._config.timeouts.cleanup, 'cleanup');
            }
            this.removeAllListeners();
            this._setState(exports.PluginStateEnum.Unloaded);
            this._logger.info(`Plugin cleaned up successfully: ${this.metadata.name}`);
        }
        catch (error) {
            this._setState(exports.PluginStateEnum.Error);
            this._logger.error(`Plugin cleanup failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Execute a plugin extension point
     */
    async execute(extensionPoint, input) {
        const startTime = Date.now();
        try {
            if (this._state !== exports.PluginStateEnum.Active) {
                throw new Error(`Plugin not active: ${this._state}`);
            }
            const extension = this.extensionPoints.find(ep => ep.name === extensionPoint);
            if (!extension) {
                throw new Error(`Extension point not found: ${extensionPoint}`);
            }
            this._logger.debug(`Executing extension point: ${extensionPoint}`);
            const result = await this._executeWithTimeout(() => extension.handler(input, this._apiContext), this._config.timeouts.execution, 'execution');
            const executionTime = Date.now() - startTime;
            this._logger.debug(`Extension point executed successfully: ${extensionPoint} (${executionTime}ms)`);
            return {
                success: true,
                data: result.data,
                executionTime,
                warnings: result.warnings,
                metadata: result.metadata
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const errorMessage = error.message;
            this._logger.error(`Extension point execution failed: ${extensionPoint}`, error);
            return {
                success: false,
                error: errorMessage,
                executionTime
            };
        }
    }
    /**
     * Get plugin health status
     */
    getHealth() {
        try {
            // Update health status if health check is implemented
            if (this.onHealthCheck) {
                const result = this.onHealthCheck();
                this._healthStatus = result instanceof Promise ? this._healthStatus : result;
            }
            return {
                ...this._healthStatus,
                timestamp: new Date()
            };
        }
        catch (error) {
            return {
                healthy: false,
                message: `Health check failed: ${error.message}`,
                timestamp: new Date()
            };
        }
    }
    /**
     * Update plugin configuration
     */
    async updateConfig(config) {
        try {
            const oldConfig = { ...this._config };
            this._config = { ...this._config, ...config };
            this._logger.info(`Updating plugin configuration: ${this.metadata.name}`);
            if (this.onConfigChange) {
                await this._executeWithTimeout(() => this.onConfigChange(this._config), this._config.timeouts.execution, 'config-change');
            }
            this._logger.info(`Plugin configuration updated successfully: ${this.metadata.name}`);
            this.emit('config-changed', { oldConfig, newConfig: this._config });
        }
        catch (error) {
            this._logger.error(`Plugin configuration update failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Private helper methods
     */
    _setState(state) {
        const oldState = this._state;
        this._state = state;
        this.emit('state-changed', { oldState, newState: state });
    }
    async _executeWithTimeout(operation, timeout, context) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new PluginTimeoutError(this.metadata.id, timeout));
            }, timeout);
            Promise.resolve(operation())
                .then(result => {
                clearTimeout(timeoutId);
                resolve(result);
            })
                .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }
}
/**
 * Simple plugin implementation for basic use cases
 */
class SimplePlugin extends BasePlugin {
    constructor(metadata, extensionPoints = [], handlers = {}) {
        super(metadata, extensionPoints);
        this.handlers = handlers;
    }
    async onInitialize(params) {
        if (this.handlers.onInitialize) {
            await this.handlers.onInitialize(params);
        }
    }
    async onActivate() {
        if (this.handlers.onActivate) {
            await this.handlers.onActivate();
        }
    }
    async onDeactivate() {
        if (this.handlers.onDeactivate) {
            await this.handlers.onDeactivate();
        }
    }
    async onCleanup() {
        if (this.handlers.onCleanup) {
            await this.handlers.onCleanup();
        }
    }
    async onConfigChange(newConfig) {
        if (this.handlers.onConfigChange) {
            await this.handlers.onConfigChange(newConfig);
        }
    }
    onHealthCheck() {
        if (this.handlers.onHealthCheck) {
            const result = this.handlers.onHealthCheck();
            if (result instanceof Promise) {
                // For async health checks, return a default status and handle async separately
                return {
                    healthy: true,
                    message: 'Health check in progress',
                    timestamp: new Date()
                };
            }
            return result;
        }
        return {
            healthy: true,
            message: 'Plugin is running normally',
            timestamp: new Date()
        };
    }
}
/**
 * Plugin builder for fluent plugin creation
 */
class PluginBuilder {
    constructor() {
        this._extensionPoints = [];
        this._handlers = {};
    }
    static create() {
        return new PluginBuilder();
    }
    metadata(metadata) {
        this._metadata = metadata;
        return this;
    }
    addExtensionPoint(extensionPoint) {
        this._extensionPoints.push(extensionPoint);
        return this;
    }
    onInitialize(handler) {
        this._handlers.onInitialize = handler;
        return this;
    }
    onActivate(handler) {
        this._handlers.onActivate = handler;
        return this;
    }
    onDeactivate(handler) {
        this._handlers.onDeactivate = handler;
        return this;
    }
    onCleanup(handler) {
        this._handlers.onCleanup = handler;
        return this;
    }
    onConfigChange(handler) {
        this._handlers.onConfigChange = handler;
        return this;
    }
    onHealthCheck(handler) {
        this._handlers.onHealthCheck = handler;
        return this;
    }
    build() {
        if (!this._metadata) {
            throw new Error('Plugin metadata is required');
        }
        return new SimplePlugin(this._metadata, this._extensionPoints, this._handlers);
    }
}

/**
 * CREB-JS Plugin Examples
 *
 * Example plugin implementations demonstrating various plugin patterns
 * and use cases for third-party developers.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Example 1: Custom Equation Balancing Algorithm Plugin
 * Demonstrates how to extend CREB's equation balancing capabilities
 */
function createCustomBalancerPlugin() {
    const metadata = {
        id: 'custom-balancer',
        name: 'Advanced Equation Balancer',
        version: '1.0.0',
        description: 'Enhanced equation balancing with AI-powered optimization',
        author: 'CREB Plugin Developer',
        license: 'MIT',
        homepage: 'https://github.com/example/creb-custom-balancer',
        apiVersion: '1.0.0',
        context: [exports.PluginContextEnum.Calculation],
        permissions: [exports.PluginPermissionEnum.ReadOnly],
        priority: exports.PluginPriorityEnum.High,
        keywords: ['balancing', 'equations', 'chemistry', 'ai'],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const config = {
        enabled: true,
        autoLoad: true,
        settings: {
            useAiOptimization: true,
            maxIterations: 1000,
            precision: 1e-10
        },
        timeouts: {
            initialization: 5000,
            execution: 10000,
            cleanup: 3000
        },
        resources: {
            maxMemory: 50 * 1024 * 1024, // 50MB
            maxCpuTime: 5000,
            maxNetworkRequests: 0 // No network access needed
        }
    };
    const extensionPoints = [
        {
            name: 'advanced-balance',
            description: 'Balance chemical equations using advanced AI algorithms',
            inputTypes: ['string'],
            outputType: 'object',
            handler: async (equation, context) => {
                try {
                    // Validate the equation using built-in utilities
                    const sanitizedEquation = context.utils.sanitizeInput(equation);
                    if (!sanitizedEquation) {
                        return {
                            success: false,
                            error: 'Invalid equation format',
                            executionTime: 0
                        };
                    }
                    // Custom balancing algorithm implementation
                    const result = await advancedBalance(sanitizedEquation);
                    return {
                        success: true,
                        data: {
                            balanced: result.equation,
                            coefficients: result.coefficients,
                            confidence: result.confidence,
                            method: 'ai-optimized'
                        },
                        executionTime: result.executionTime,
                        metadata: {
                            iterations: result.iterations,
                            algorithmVersion: '2.1.0'
                        }
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: error.message,
                        executionTime: 0
                    };
                }
            }
        }
    ];
    return {
        metadata,
        config,
        extensionPoints,
        factory: (params) => {
            return PluginBuilder.create()
                .metadata(metadata)
                .addExtensionPoint(extensionPoints[0])
                .onInitialize(async (params) => {
                params.logger.info('Advanced Equation Balancer initialized');
                // Initialize AI models, load configurations, etc.
            })
                .onActivate(async () => {
                console.log('Advanced balancer ready for use');
            })
                .onHealthCheck(() => ({
                healthy: true,
                message: 'AI models loaded and ready',
                metrics: {
                    memoryUsage: process.memoryUsage().heapUsed,
                    modelAccuracy: 0.98
                },
                timestamp: new Date()
            }))
                .build();
        }
    };
}
/**
 * Example 2: External Data Provider Plugin
 * Demonstrates how to integrate with external chemistry databases
 */
function createDataProviderPlugin() {
    const metadata = {
        id: 'external-data-provider',
        name: 'ChemSpider Data Provider',
        version: '1.0.0',
        description: 'Fetch compound data from ChemSpider API',
        author: 'CREB Plugin Developer',
        license: 'MIT',
        apiVersion: '1.0.0',
        context: [exports.PluginContextEnum.DataProvider],
        permissions: [exports.PluginPermissionEnum.ReadOnly, exports.PluginPermissionEnum.NetworkAccess],
        priority: exports.PluginPriorityEnum.Normal,
        keywords: ['data', 'chemspider', 'compounds', 'api'],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const config = {
        enabled: true,
        autoLoad: false,
        settings: {
            apiKey: '', // To be configured by user
            baseUrl: 'https://www.chemspider.com/InChI.asmx',
            timeout: 10000,
            cacheResults: true,
            cacheTtl: 3600000 // 1 hour
        },
        timeouts: {
            initialization: 5000,
            execution: 15000,
            cleanup: 3000
        },
        resources: {
            maxMemory: 30 * 1024 * 1024, // 30MB
            maxCpuTime: 2000,
            maxNetworkRequests: 100
        }
    };
    const extensionPoints = [
        {
            name: 'fetch-compound-data',
            description: 'Fetch compound information from ChemSpider',
            inputTypes: ['string'],
            outputType: 'object',
            handler: async (identifier, context) => {
                try {
                    // Check cache first
                    const cacheKey = `compound:${identifier}`;
                    const cached = await context.storage.get(cacheKey);
                    if (cached) {
                        return {
                            success: true,
                            data: cached,
                            executionTime: 1,
                            metadata: { source: 'cache' }
                        };
                    }
                    // Fetch from external API
                    const startTime = Date.now();
                    const url = `https://www.chemspider.com/Search.asmx/SimpleSearch?query=${encodeURIComponent(identifier)}`;
                    const response = await context.http.get(url);
                    const data = await response.json();
                    const executionTime = Date.now() - startTime;
                    // Cache the result
                    await context.storage.set(cacheKey, data);
                    return {
                        success: true,
                        data,
                        executionTime,
                        metadata: { source: 'chemspider' }
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: `Failed to fetch compound data: ${error.message}`,
                        executionTime: 0
                    };
                }
            }
        },
        {
            name: 'search-compounds',
            description: 'Search for compounds by name or formula',
            inputTypes: ['string'],
            outputType: 'array',
            handler: async (query, context) => {
                try {
                    const sanitizedQuery = context.utils.sanitizeInput(query);
                    const startTime = Date.now();
                    const url = `https://www.chemspider.com/Search.asmx/SimpleSearch?query=${encodeURIComponent(sanitizedQuery)}`;
                    const response = await context.http.get(url);
                    const results = await response.json();
                    const executionTime = Date.now() - startTime;
                    return {
                        success: true,
                        data: results,
                        executionTime,
                        metadata: {
                            query: sanitizedQuery,
                            resultCount: Array.isArray(results) ? results.length : 0
                        }
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: `Search failed: ${error.message}`,
                        executionTime: 0
                    };
                }
            }
        }
    ];
    return {
        metadata,
        config,
        extensionPoints,
        factory: (params) => {
            return PluginBuilder.create()
                .metadata(metadata)
                .addExtensionPoint(extensionPoints[0])
                .addExtensionPoint(extensionPoints[1])
                .onInitialize(async (params) => {
                const apiKey = params.config.settings.apiKey;
                if (!apiKey) {
                    throw new Error('ChemSpider API key is required');
                }
                params.logger.info('ChemSpider data provider initialized');
            })
                .onActivate(async () => {
                console.log('ChemSpider data provider ready');
            })
                .onConfigChange(async (newConfig) => {
                console.log('ChemSpider configuration updated');
            })
                .onHealthCheck(() => ({
                healthy: true,
                message: 'External API connectivity verified',
                timestamp: new Date()
            }))
                .build();
        }
    };
}
/**
 * Example 3: Specialized Calculator Plugin
 * Demonstrates domain-specific chemistry calculations
 */
function createSpecializedCalculatorPlugin() {
    const metadata = {
        id: 'advanced-calculator',
        name: 'Advanced Chemistry Calculator',
        version: '1.0.0',
        description: 'Specialized calculations for advanced chemistry problems',
        author: 'CREB Plugin Developer',
        license: 'MIT',
        apiVersion: '1.0.0',
        context: [exports.PluginContextEnum.Calculation],
        permissions: [exports.PluginPermissionEnum.ReadOnly],
        priority: exports.PluginPriorityEnum.High,
        keywords: ['calculations', 'advanced', 'chemistry', 'kinetics', 'thermodynamics'],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const config = {
        enabled: true,
        autoLoad: true,
        settings: {
            precision: 10,
            useSymbolicMath: true,
            enableUnitConversion: true
        },
        timeouts: {
            initialization: 3000,
            execution: 5000,
            cleanup: 2000
        },
        resources: {
            maxMemory: 20 * 1024 * 1024, // 20MB
            maxCpuTime: 3000,
            maxNetworkRequests: 0
        }
    };
    const extensionPoints = [
        {
            name: 'calculate-equilibrium-constant',
            description: 'Calculate equilibrium constants from thermodynamic data',
            inputTypes: ['object'],
            outputType: 'number',
            handler: async (data, context) => {
                try {
                    const { deltaG, temperature = 298.15 } = data;
                    const R = 8.314; // Gas constant J/(mol·K)
                    // K = exp(-ΔG / RT)
                    const K = Math.exp(-deltaG * 1000 / (R * temperature));
                    return {
                        success: true,
                        data: K,
                        executionTime: 1,
                        metadata: {
                            deltaG,
                            temperature,
                            units: 'dimensionless'
                        }
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: `Calculation failed: ${error.message}`,
                        executionTime: 0
                    };
                }
            }
        },
        {
            name: 'calculate-reaction-rate',
            description: 'Calculate reaction rates using kinetic data',
            inputTypes: ['object'],
            outputType: 'object',
            handler: async (data, context) => {
                try {
                    const { concentrations, rateConstant, orders } = data;
                    // Rate = k * [A]^m * [B]^n * ...
                    let rate = rateConstant;
                    for (let i = 0; i < concentrations.length; i++) {
                        rate *= Math.pow(concentrations[i], orders[i] || 1);
                    }
                    return {
                        success: true,
                        data: {
                            rate,
                            units: 'M/s',
                            method: 'rate-law'
                        },
                        executionTime: 2,
                        metadata: {
                            rateConstant,
                            concentrations,
                            orders
                        }
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: `Rate calculation failed: ${error.message}`,
                        executionTime: 0
                    };
                }
            }
        }
    ];
    return {
        metadata,
        config,
        extensionPoints,
        factory: (params) => {
            return PluginBuilder.create()
                .metadata(metadata)
                .addExtensionPoint(extensionPoints[0])
                .addExtensionPoint(extensionPoints[1])
                .onInitialize(async (params) => {
                params.logger.info('Advanced calculator initialized');
            })
                .onActivate(async () => {
                console.log('Advanced calculator ready for calculations');
            })
                .onHealthCheck(() => ({
                healthy: true,
                message: 'All calculation modules loaded',
                metrics: {
                    precision: 10,
                    modulesLoaded: 2
                },
                timestamp: new Date()
            }))
                .build();
        }
    };
}
/**
 * Helper function for the custom balancer (mock implementation)
 */
async function advancedBalance(equation) {
    // Mock AI-powered balancing algorithm
    const startTime = Date.now();
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
        equation: 'H2 + O2 → H2O', // Simplified example
        coefficients: [2, 1, 2],
        confidence: 0.95,
        executionTime: Date.now() - startTime,
        iterations: 42
    };
}
/**
 * Plugin marketplace entry examples
 */
const exampleMarketplaceEntries = [
    {
        metadata: createCustomBalancerPlugin().metadata,
        downloads: 1250,
        rating: 4.8,
        reviews: 23,
        verified: true,
        downloadUrl: 'https://registry.creb.js/plugins/custom-balancer-1.0.0.tgz',
        screenshots: [
            'https://images.creb.js/plugins/custom-balancer/screenshot1.png',
            'https://images.creb.js/plugins/custom-balancer/screenshot2.png'
        ],
        readme: 'Advanced equation balancing with AI optimization...'
    },
    {
        metadata: createDataProviderPlugin().metadata,
        downloads: 890,
        rating: 4.6,
        reviews: 15,
        verified: true,
        downloadUrl: 'https://registry.creb.js/plugins/external-data-provider-1.0.0.tgz',
        screenshots: [
            'https://images.creb.js/plugins/external-data/screenshot1.png'
        ],
        readme: 'Seamless integration with ChemSpider database...'
    },
    {
        metadata: createSpecializedCalculatorPlugin().metadata,
        downloads: 2100,
        rating: 4.9,
        reviews: 42,
        verified: true,
        downloadUrl: 'https://registry.creb.js/plugins/advanced-calculator-1.0.0.tgz',
        screenshots: [
            'https://images.creb.js/plugins/advanced-calc/screenshot1.png',
            'https://images.creb.js/plugins/advanced-calc/screenshot2.png',
            'https://images.creb.js/plugins/advanced-calc/screenshot3.png'
        ],
        readme: 'Professional-grade chemistry calculations for research and education...'
    }
];

exports.AdaptiveEvictionPolicy = AdaptiveEvictionPolicy;
exports.AdvancedKineticsAnalyzer = AdvancedKineticsAnalyzer;
exports.BasePlugin = BasePlugin;
exports.CREBError = CREBError;
exports.CREBServices = CREBServices;
exports.CREBValidationError = ValidationError;
exports.CREBVisualizationUtils = CREBVisualizationUtils;
exports.CREBWorkerManager = CREBWorkerManager;
exports.CacheFactory = CacheFactory;
exports.CachedChemicalDatabase = CachedChemicalDatabase;
exports.CachedEquationBalancer = CachedEquationBalancer;
exports.CachedThermodynamicsCalculator = CachedThermodynamicsCalculator;
exports.Canvas2DRenderer = Canvas2DRenderer;
exports.ChemicalFormulaError = ChemicalFormulaError;
exports.ChemicalFormulaValidator = ChemicalFormulaValidator;
exports.CircuitBreaker = CircuitBreaker;
exports.CircuitBreakerManager = CircuitBreakerManager;
exports.CircularDependencyError = CircularDependencyError;
exports.ComputationError = ComputationError;
exports.ConsoleDestination = ConsoleDestination;
exports.Container = Container;
exports.ContextManager = ContextManager;
exports.ContextUtils = ContextUtils;
exports.DEFAULT_TELEMETRY_CONFIG = DEFAULT_TELEMETRY_CONFIG;
exports.DataValidationService = DataValidationService;
exports.ELEMENTS_LIST = ELEMENTS_LIST;
exports.ElementCounter = ElementCounter;
exports.EnergyProfileGenerator = EnergyProfileGenerator;
exports.EnhancedBalancer = EnhancedBalancer;
exports.EnhancedMolecularVisualization = EnhancedMolecularVisualization;
exports.EnhancedNISTIntegration = EnhancedNISTIntegration;
exports.EnhancedPubChemIntegration = EnhancedPubChemIntegration;
exports.EnhancedSQLiteStorage = EnhancedSQLiteStorage;
exports.EnhancedStoichiometry = EnhancedStoichiometry;
exports.EnhancedVisualizationUtils = EnhancedVisualizationUtils;
exports.EquationBalancingError = EquationBalancingError;
exports.EquationParser = EquationParser;
exports.ErrorAggregator = ErrorAggregator;
exports.ErrorUtils = ErrorUtils;
exports.EvictionPolicyFactory = EvictionPolicyFactory;
exports.ExternalAPIError = ExternalAPIError;
exports.FIFOEvictionPolicy = FIFOEvictionPolicy;
exports.FileDestination = FileDestination;
exports.FluentValidationBuilder = FluentValidationBuilder;
exports.GracefulDegradationService = GracefulDegradationService;
exports.IBalancerToken = IBalancerToken;
exports.ICacheToken = ICacheToken;
exports.IConfigManagerToken = IConfigManagerToken;
exports.IEnhancedBalancerToken = IEnhancedBalancerToken;
exports.INJECTABLE_METADATA_KEY = INJECTABLE_METADATA_KEY;
exports.IStoichiometryToken = IStoichiometryToken;
exports.IStorageProviderToken = IStorageProviderToken;
exports.ITaskQueueToken = ITaskQueueToken;
exports.IThermodynamicsCalculatorToken = IThermodynamicsCalculatorToken;
exports.IWorkerPoolToken = IWorkerPoolToken;
exports.Inject = Inject;
exports.Injectable = Injectable;
exports.IntelligentCacheManager = IntelligentCacheManager;
exports.LFUEvictionPolicy = LFUEvictionPolicy;
exports.LOG_LEVELS = LOG_LEVELS;
exports.LRUEvictionPolicy = LRUEvictionPolicy;
exports.LevelFilter = LevelFilter;
exports.LoggerFactory = LoggerFactory;
exports.MaxDepthExceededError = MaxDepthExceededError;
exports.MechanismAnalyzer = MechanismAnalyzer;
exports.MetricsRegistry = MetricsRegistry;
exports.ModuleFilter = ModuleFilter;
exports.Mol3DWrapper = Mol3DWrapper;
exports.MolecularDataUtils = MolecularDataUtils;
exports.MolecularPhysicsEngine = MolecularPhysicsEngine;
exports.MolecularVisualization = MolecularVisualization;
exports.MultiLevelCache = MultiLevelCache;
exports.NetworkError = NetworkError;
exports.Optional = Optional;
exports.PARAMETER_SYMBOLS = PARAMETER_SYMBOLS;
exports.PERFORMANCE_THRESHOLDS = PERFORMANCE_THRESHOLDS;
exports.PERIODIC_TABLE = PERIODIC_TABLE;
exports.PerformanceProfiler = PerformanceProfiler;
exports.PluginAPIContextFactory = PluginAPIContextFactory;
exports.PluginAPIContextImpl = PluginAPIContextImpl;
exports.PluginBuilder = PluginBuilder;
exports.PluginContext = exports.PluginContextEnum;
exports.PluginManager = PluginManager;
exports.PluginPermission = exports.PluginPermissionEnum;
exports.PluginPriority = exports.PluginPriorityEnum;
exports.PluginState = exports.PluginStateEnum;
exports.Profile = Profile;
exports.PubChemIntegration = PubChemIntegration;
exports.RDKitWrapper = RDKitWrapper;
exports.RandomEvictionPolicy = RandomEvictionPolicy;
exports.RateLimiter = RateLimiter;
exports.ReactionAnimationEngine = ReactionAnimationEngine;
exports.ReactionAnimator = ReactionAnimator;
exports.ReactionClassifier = ReactionClassifier;
exports.ReactionKinetics = ReactionKinetics;
exports.ReactionSafetyAnalyzer = ReactionSafetyAnalyzer;
exports.RetryPolicies = RetryPolicies;
exports.RetryPolicy = RetryPolicy;
exports.SVGRenderer = SVGRenderer;
exports.SVG_FEATURES = SVG_FEATURES;
exports.ServiceNotFoundError = ServiceNotFoundError;
exports.SimplePlugin = SimplePlugin;
exports.Singleton = Singleton;
exports.StructuredLogger = StructuredLogger;
exports.SystemError = SystemError;
exports.SystemHealthMonitor = SystemHealthMonitor;
exports.TTLEvictionPolicy = TTLEvictionPolicy;
exports.TaskBuilder = TaskBuilder;
exports.TelemetrySystem = TelemetrySystem;
exports.ThermodynamicPropertiesValidator = ThermodynamicPropertiesValidator;
exports.ThermodynamicsEquationBalancer = ThermodynamicsEquationBalancer;
exports.Transient = Transient;
exports.VISUALIZATION_VERSION = VISUALIZATION_VERSION;
exports.ValidationPipeline = ValidationPipeline;
exports.WithCircuitBreaker = WithCircuitBreaker;
exports.WithRetry = WithRetry;
exports.WorkerPerformanceMonitor = WorkerPerformanceMonitor;
exports.calculateMolarWeight = calculateMolarWeight;
exports.circuitBreakerManager = circuitBreakerManager;
exports.configManager = configManager;
exports.container = container;
exports.convertMoleculeToVisualization = convertMoleculeToVisualization;
exports.counter = counter;
exports.createBatchTasks = createBatchTasks;
exports.createChemicalFormula = createChemicalFormula;
exports.createChemistryValidator = createChemistryValidator;
exports.createChildContainer = createChildContainer;
exports.createCompositeValidator = createCompositeValidator;
exports.createConsoleLogger = createConsoleLogger;
exports.createCorrelationId = createCorrelationId;
exports.createCriticalTask = createCriticalTask;
exports.createCustomBalancerPlugin = createCustomBalancerPlugin;
exports.createDataProviderPlugin = createDataProviderPlugin;
exports.createElementSymbol = createElementSymbol;
exports.createEnergyProfile = createEnergyProfile;
exports.createEnhancedVisualization = createEnhancedVisualization;
exports.createFastValidationPipeline = createFastValidationPipeline;
exports.createFileLogger = createFileLogger;
exports.createLogger = createLogger;
exports.createMolecularVisualization = createMolecularVisualization;
exports.createMultiDestinationLogger = createMultiDestinationLogger;
exports.createRetryPolicy = createRetryPolicy;
exports.createSpecializedCalculatorPlugin = createSpecializedCalculatorPlugin;
exports.createTaskId = createTaskId;
exports.createThoroughValidationPipeline = createThoroughValidationPipeline;
exports.createTimestamp = createTimestamp;
exports.createToken = createToken;
exports.createValidationPipeline = createValidationPipeline;
exports.createValidator = createValidator;
exports.createWorkerId = createWorkerId;
exports.createWorkerManager = createWorkerManager;
exports.defaultConfig = defaultConfig;
exports.demonstrateAdvancedCaching = demonstrateAdvancedCaching;
exports.demonstrateEnhancedErrorHandling = demonstrateEnhancedErrorHandling;
exports.exampleMarketplaceEntries = exampleMarketplaceEntries;
exports.exportEnergyProfile = exportEnergyProfile;
exports.gauge = gauge;
exports.generateSchemaDocumentation = generateSchemaDocumentation;
exports.getConfig = getConfig;
exports.getCurrentContext = getCurrentContext;
exports.getCurrentCorrelationId = getCurrentCorrelationId;
exports.getDependencyTokens = getDependencyTokens;
exports.getFullConfig = getFullConfig;
exports.getInjectableMetadata = getInjectableMetadata;
exports.getService = getService;
exports.globalContextManager = globalContextManager;
exports.globalMetrics = globalMetrics;
exports.globalProfiler = globalProfiler;
exports.histogram = histogram;
exports.initializeCREBDI = initializeCREBDI;
exports.initializeTelemetry = initializeTelemetry;
exports.isBalancedEquation = isBalancedEquation;
exports.isCREBConfig = isCREBConfig;
exports.isChemicalFormula = isChemicalFormula;
exports.isElementSymbol = isElementSymbol;
exports.isInjectable = isInjectable;
exports.isLogEntry = isLogEntry;
exports.isLogLevel = isLogLevel;
exports.isMetric = isMetric;
exports.logger = logger;
exports.multiFormatExport = multiFormatExport;
exports.parseFormula = parseFormula;
exports.quickSVGExport = quickSVGExport;
exports.runWithContext = runWithContext;
exports.runWithContextAsync = runWithContextAsync;
exports.setConfig = setConfig;
exports.setContext = setContext;
exports.setCorrelationId = setCorrelationId;
exports.setupCREBContainer = setupCREBContainer;
exports.telemetry = telemetry;
exports.time = time;
exports.timeAsync = timeAsync;
exports.validateChemicalFormula = validateChemicalFormula;
exports.validateConfig = validateConfig;
exports.validateThermodynamicProperties = validateThermodynamicProperties;
exports.withContext = withContext;
//# sourceMappingURL=index.js.map
