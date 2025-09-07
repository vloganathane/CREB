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
import { EventEmitter } from 'events';
import { ValidationSeverity, isValidator, isValidationRule } from './types';
import { CREBError, ValidationError as CREBValidationError } from '../../core/errors/CREBError';
import { AdvancedCache } from '../../performance/cache/AdvancedCache';
/**
 * Core validation pipeline for orchestrating complex validation workflows
 */
export class ValidationPipeline extends EventEmitter {
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
        this.cache = new AdvancedCache({
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
            throw new CREBValidationError('Invalid validator provided', {
                validator: validator?.name || 'unknown',
                errorCode: 'VALIDATION_INVALID_VALIDATOR'
            });
        }
        if (this.validators.has(validator.name)) {
            throw new CREBValidationError(`Validator '${validator.name}' already registered`, {
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
            throw new CREBValidationError('Invalid validation rule provided', {
                rule: rule?.name || 'unknown',
                errorCode: 'VALIDATION_INVALID_RULE'
            });
        }
        if (this.rules.has(rule.name)) {
            throw new CREBValidationError(`Rule '${rule.name}' already registered`, {
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
                new CREBValidationError('Validation pipeline failed', {
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
                throw new CREBValidationError(`Validator '${validator.name}' depends on '${dependency}' which is not registered`, {
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
                throw new CREBValidationError(`Circular dependency detected involving rule '${ruleName}'`, {
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
                reject(new CREBValidationError(timeoutMessage, {
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
//# sourceMappingURL=ValidationPipeline.js.map