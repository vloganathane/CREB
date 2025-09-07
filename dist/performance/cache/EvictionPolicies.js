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
export class LRUEvictionPolicy {
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
export class LFUEvictionPolicy {
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
export class FIFOEvictionPolicy {
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
export class TTLEvictionPolicy {
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
export class RandomEvictionPolicy {
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
export class EvictionPolicyFactory {
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
export class AdaptiveEvictionPolicy {
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
//# sourceMappingURL=EvictionPolicies.js.map