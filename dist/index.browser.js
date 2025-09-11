import { EventEmitter as EventEmitter$1 } from 'events';

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
var ErrorCategory;
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
})(ErrorCategory || (ErrorCategory = {}));
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (ErrorSeverity = {}));
/**
 * Base CREB Error class with enhanced context and metadata
 */
class CREBError extends Error {
    constructor(message, category, severity = ErrorSeverity.MEDIUM, context = {}, options = {}) {
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
            ErrorCategory.NETWORK,
            ErrorCategory.TIMEOUT,
            ErrorCategory.RATE_LIMIT,
            ErrorCategory.EXTERNAL_API
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
        super(message, ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, {
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
 * Computation Error - for calculation failures
 */
class ComputationError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, ErrorCategory.COMPUTATION, ErrorSeverity.MEDIUM, {
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _Reflect = {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var hasRequired_Reflect;

function require_Reflect () {
	if (hasRequired_Reflect) return _Reflect;
	hasRequired_Reflect = 1;
	var Reflect;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof globalThis === "object" ? globalThis :
	            typeof commonjsGlobal === "object" ? commonjsGlobal :
	                typeof self === "object" ? self :
	                    typeof this === "object" ? this :
	                        sloppyModeThis();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect !== "undefined") {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter, root);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                if (previous)
	                    previous(key, value);
	            };
	        }
	        function functionThis() {
	            try {
	                return Function("return this;")();
	            }
	            catch (_) { }
	        }
	        function indirectEvalThis() {
	            try {
	                return (void 0, eval)("(function() { return this; })()");
	            }
	            catch (_) { }
	        }
	        function sloppyModeThis() {
	            return functionThis() || indirectEvalThis();
	        }
	    })(function (exporter, root) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : undefined;
	        var metadataRegistry = GetOrCreateMetadataRegistry();
	        var metadataProvider = CreateMetadataProvider(metadataRegistry);
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    throw new TypeError();
	                if (IsNull(attributes))
	                    attributes = undefined;
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsConstructor(target))
	                    throw new TypeError();
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    throw new TypeError();
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            var provider = GetMetadataProvider(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(provider))
	                return false;
	            return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        throw new TypeError();
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        throw new TypeError();
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return true;
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryHasMetadata(MetadataKey, parent, P);
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ false);
	            if (IsUndefined(provider))
	                return false;
	            return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryGetMetadata(MetadataKey, parent, P);
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ false);
	            if (IsUndefined(provider))
	                return;
	            return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ true);
	            provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                return ownKeys;
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                return ownKeys;
	            if (ownKeys.length <= 0)
	                return parentKeys;
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var provider = GetMetadataProvider(O, P, /*create*/ false);
	            if (!provider) {
	                return [];
	            }
	            return provider.OrdinaryOwnMetadataKeys(O, P);
	        }
	        // 6 ECMAScript Data Types and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                return 1 /* Null */;
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = "string" ;
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    throw new TypeError();
	                return result;
	            }
	            return OrdinaryToPrimitive(input);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            var valueOf, result, toString_2; {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument);
	            if (IsSymbol(key))
	                return key;
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        function SameValueZero(x, y) {
	            return x === y || x !== x && y !== y;
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                return undefined;
	            if (!IsCallable(func))
	                throw new TypeError();
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                throw new TypeError(); // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                throw new TypeError();
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                f.call(iterator);
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                return proto;
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                return proto;
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                return proto;
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                return proto;
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                return proto;
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // Global metadata registry
	        // - Allows `import "reflect-metadata"` and `import "reflect-metadata/no-conflict"` to interoperate.
	        // - Uses isolated metadata if `Reflect` is frozen before the registry can be installed.
	        /**
	         * Creates a registry used to allow multiple `reflect-metadata` providers.
	         */
	        function CreateMetadataRegistry() {
	            var fallback;
	            if (!IsUndefined(registrySymbol) &&
	                typeof root.Reflect !== "undefined" &&
	                !(registrySymbol in root.Reflect) &&
	                typeof root.Reflect.defineMetadata === "function") {
	                // interoperate with older version of `reflect-metadata` that did not support a registry.
	                fallback = CreateFallbackProvider(root.Reflect);
	            }
	            var first;
	            var second;
	            var rest;
	            var targetProviderMap = new _WeakMap();
	            var registry = {
	                registerProvider: registerProvider,
	                getProvider: getProvider,
	                setProvider: setProvider,
	            };
	            return registry;
	            function registerProvider(provider) {
	                if (!Object.isExtensible(registry)) {
	                    throw new Error("Cannot add provider to a frozen registry.");
	                }
	                switch (true) {
	                    case fallback === provider: break;
	                    case IsUndefined(first):
	                        first = provider;
	                        break;
	                    case first === provider: break;
	                    case IsUndefined(second):
	                        second = provider;
	                        break;
	                    case second === provider: break;
	                    default:
	                        if (rest === undefined)
	                            rest = new _Set();
	                        rest.add(provider);
	                        break;
	                }
	            }
	            function getProviderNoCache(O, P) {
	                if (!IsUndefined(first)) {
	                    if (first.isProviderFor(O, P))
	                        return first;
	                    if (!IsUndefined(second)) {
	                        if (second.isProviderFor(O, P))
	                            return first;
	                        if (!IsUndefined(rest)) {
	                            var iterator = GetIterator(rest);
	                            while (true) {
	                                var next = IteratorStep(iterator);
	                                if (!next) {
	                                    return undefined;
	                                }
	                                var provider = IteratorValue(next);
	                                if (provider.isProviderFor(O, P)) {
	                                    IteratorClose(iterator);
	                                    return provider;
	                                }
	                            }
	                        }
	                    }
	                }
	                if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
	                    return fallback;
	                }
	                return undefined;
	            }
	            function getProvider(O, P) {
	                var providerMap = targetProviderMap.get(O);
	                var provider;
	                if (!IsUndefined(providerMap)) {
	                    provider = providerMap.get(P);
	                }
	                if (!IsUndefined(provider)) {
	                    return provider;
	                }
	                provider = getProviderNoCache(O, P);
	                if (!IsUndefined(provider)) {
	                    if (IsUndefined(providerMap)) {
	                        providerMap = new _Map();
	                        targetProviderMap.set(O, providerMap);
	                    }
	                    providerMap.set(P, provider);
	                }
	                return provider;
	            }
	            function hasProvider(provider) {
	                if (IsUndefined(provider))
	                    throw new TypeError();
	                return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
	            }
	            function setProvider(O, P, provider) {
	                if (!hasProvider(provider)) {
	                    throw new Error("Metadata provider not registered.");
	                }
	                var existingProvider = getProvider(O, P);
	                if (existingProvider !== provider) {
	                    if (!IsUndefined(existingProvider)) {
	                        return false;
	                    }
	                    var providerMap = targetProviderMap.get(O);
	                    if (IsUndefined(providerMap)) {
	                        providerMap = new _Map();
	                        targetProviderMap.set(O, providerMap);
	                    }
	                    providerMap.set(P, provider);
	                }
	                return true;
	            }
	        }
	        /**
	         * Gets or creates the shared registry of metadata providers.
	         */
	        function GetOrCreateMetadataRegistry() {
	            var metadataRegistry;
	            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
	                metadataRegistry = root.Reflect[registrySymbol];
	            }
	            if (IsUndefined(metadataRegistry)) {
	                metadataRegistry = CreateMetadataRegistry();
	            }
	            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
	                Object.defineProperty(root.Reflect, registrySymbol, {
	                    enumerable: false,
	                    configurable: false,
	                    writable: false,
	                    value: metadataRegistry
	                });
	            }
	            return metadataRegistry;
	        }
	        function CreateMetadataProvider(registry) {
	            // [[Metadata]] internal slot
	            // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	            var metadata = new _WeakMap();
	            var provider = {
	                isProviderFor: function (O, P) {
	                    var targetMetadata = metadata.get(O);
	                    if (IsUndefined(targetMetadata))
	                        return false;
	                    return targetMetadata.has(P);
	                },
	                OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata,
	                OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata,
	                OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata,
	                OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys,
	                OrdinaryDeleteMetadata: OrdinaryDeleteMetadata,
	            };
	            metadataRegistry.registerProvider(provider);
	            return provider;
	            function GetOrCreateMetadataMap(O, P, Create) {
	                var targetMetadata = metadata.get(O);
	                var createdTargetMetadata = false;
	                if (IsUndefined(targetMetadata)) {
	                    if (!Create)
	                        return undefined;
	                    targetMetadata = new _Map();
	                    metadata.set(O, targetMetadata);
	                    createdTargetMetadata = true;
	                }
	                var metadataMap = targetMetadata.get(P);
	                if (IsUndefined(metadataMap)) {
	                    if (!Create)
	                        return undefined;
	                    metadataMap = new _Map();
	                    targetMetadata.set(P, metadataMap);
	                    if (!registry.setProvider(O, P, provider)) {
	                        targetMetadata.delete(P);
	                        if (createdTargetMetadata) {
	                            metadata.delete(O);
	                        }
	                        throw new Error("Wrong provider for target.");
	                    }
	                }
	                return metadataMap;
	            }
	            // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	            function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return false;
	                return ToBoolean(metadataMap.has(MetadataKey));
	            }
	            // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	            function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return undefined;
	                return metadataMap.get(MetadataKey);
	            }
	            // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	            function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	                metadataMap.set(MetadataKey, MetadataValue);
	            }
	            // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	            function OrdinaryOwnMetadataKeys(O, P) {
	                var keys = [];
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return keys;
	                var keysObj = metadataMap.keys();
	                var iterator = GetIterator(keysObj);
	                var k = 0;
	                while (true) {
	                    var next = IteratorStep(iterator);
	                    if (!next) {
	                        keys.length = k;
	                        return keys;
	                    }
	                    var nextValue = IteratorValue(next);
	                    try {
	                        keys[k] = nextValue;
	                    }
	                    catch (e) {
	                        try {
	                            IteratorClose(iterator);
	                        }
	                        finally {
	                            throw e;
	                        }
	                    }
	                    k++;
	                }
	            }
	            function OrdinaryDeleteMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return false;
	                if (!metadataMap.delete(MetadataKey))
	                    return false;
	                if (metadataMap.size === 0) {
	                    var targetMetadata = metadata.get(O);
	                    if (!IsUndefined(targetMetadata)) {
	                        targetMetadata.delete(P);
	                        if (targetMetadata.size === 0) {
	                            metadata.delete(targetMetadata);
	                        }
	                    }
	                }
	                return true;
	            }
	        }
	        function CreateFallbackProvider(reflect) {
	            var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
	            var metadataOwner = new _WeakMap();
	            var provider = {
	                isProviderFor: function (O, P) {
	                    var metadataPropertySet = metadataOwner.get(O);
	                    if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
	                        return true;
	                    }
	                    if (getOwnMetadataKeys(O, P).length) {
	                        if (IsUndefined(metadataPropertySet)) {
	                            metadataPropertySet = new _Set();
	                            metadataOwner.set(O, metadataPropertySet);
	                        }
	                        metadataPropertySet.add(P);
	                        return true;
	                    }
	                    return false;
	                },
	                OrdinaryDefineOwnMetadata: defineMetadata,
	                OrdinaryHasOwnMetadata: hasOwnMetadata,
	                OrdinaryGetOwnMetadata: getOwnMetadata,
	                OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
	                OrdinaryDeleteMetadata: deleteMetadata,
	            };
	            return provider;
	        }
	        /**
	         * Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
	         * then this module's metadata provider is assigned to the object.
	         */
	        function GetMetadataProvider(O, P, Create) {
	            var registeredProvider = metadataRegistry.getProvider(O, P);
	            if (!IsUndefined(registeredProvider)) {
	                return registeredProvider;
	            }
	            if (Create) {
	                if (metadataRegistry.setProvider(O, P, metadataProvider)) {
	                    return metadataProvider;
	                }
	                throw new Error("Illegal state.");
	            }
	            return undefined;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            var Map = /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (SameValueZero(key, this._cacheKey)) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (!SameValueZero(this._cacheKey, key)) {
	                        this._cacheIndex = -1;
	                        for (var i = 0; i < this._keys.length; i++) {
	                            if (SameValueZero(this._keys[i], key)) {
	                                this._cacheIndex = i;
	                                break;
	                            }
	                        }
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            return Map;
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            var Set = /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.keys(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	            return Set;
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    key = "@@WeakMap@@" + CreateUUID();
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        return undefined;
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    buffer[i] = Math.random() * 0xff | 0;
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    var array = new Uint8Array(size);
	                    if (typeof crypto !== "undefined") {
	                        crypto.getRandomValues(array);
	                    }
	                    else if (typeof msCrypto !== "undefined") {
	                        msCrypto.getRandomValues(array);
	                    }
	                    else {
	                        FillRandomBytes(array, size);
	                    }
	                    return array;
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        result += "-";
	                    if (byte < 16)
	                        result += "0";
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect || (Reflect = {}));
	return _Reflect;
}

require_Reflect();

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
let ChemicalEquationBalancer = class ChemicalEquationBalancer {
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
ChemicalEquationBalancer = __decorate([
    Injectable()
], ChemicalEquationBalancer);

/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
let Stoichiometry = class Stoichiometry {
    constructor(equation) {
        this.reactants = [];
        this.products = [];
        this.coefficients = [];
        this.balancer = new ChemicalEquationBalancer();
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
Stoichiometry = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [String])
], Stoichiometry);

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
        this.balancer = new ChemicalEquationBalancer();
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
let AdvancedCache = class AdvancedCache {
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
AdvancedCache = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], AdvancedCache);
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
class ValidationMetricsDashboard extends EventEmitter$1 {
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
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */
let EnhancedChemicalEquationBalancer = class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
    constructor() {
        super(...arguments);
        this.compoundCache = new AdvancedCache({
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
        // Validate chemical formulas using the validation pipeline
        for (const species of allSpecies) {
            try {
                const formulaValidation = await validateChemicalFormula(species);
                enhanced.validation.formulaValidation[species] = formulaValidation;
                if (!formulaValidation.isValid) {
                    enhanced.validation.warnings.push(`Invalid formula ${species}: ${formulaValidation.errors.map(e => e.message).join(', ')}`);
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
EnhancedChemicalEquationBalancer = __decorate([
    Injectable()
], EnhancedChemicalEquationBalancer);

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
 * Browser-compatible CREB-JS entry point
 * This file exclu// Reaction Animation System (browser-compatible)
export { ReactionAnimator } from './visualization/ReactionAnimation';

// Phase 2: Advanced Animation Engine (browser-compatible)
export { ReactionAnimationEngine } from './animation/ReactionAnimationEngine';

// 3D Visualization System (browser-compatible)
export { Mol3DWrapper } from './visualization/Mol3DWrapper';
export { PubChemIntegration } from './visualization/PubChemIntegration';
export { RDKitWrapper } from './visualization/RDKitWrapper';s Node.js-specific functionality to ensure browser compatibility
 */
// Core chemistry functionality (browser-compatible)
function convertMoleculeToVisualization(molecule) {
    const atoms = molecule.elements.map((element, index) => ({
        element,
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2
    }));
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
// Simple factory function that can be tree-shaken if not used
function createMolecularVisualization(container, options = {}) {
    return new MolecularVisualization({ container, ...options });
}
// Browser polyfill for EventEmitter
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
            return true;
        }
        return false;
    }
    removeListener(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
        return this;
    }
    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        }
        else {
            this.events = {};
        }
        return this;
    }
}

export { Canvas2DRenderer, ChemicalEquationBalancer, ChemicalFormulaError, ELEMENTS_LIST, ElementCounter, EnhancedBalancer, EnhancedChemicalEquationBalancer, EquationBalancingError, EquationParser, EventEmitter, MolecularVisualization, PARAMETER_SYMBOLS, PERIODIC_TABLE, ReactionAnimator, SVGRenderer, Stoichiometry, calculateMolarWeight, convertMoleculeToVisualization, createChemicalFormula, createElementSymbol, createMolecularVisualization, isBalancedEquation, isChemicalFormula, isElementSymbol, parseFormula };
//# sourceMappingURL=index.browser.js.map
