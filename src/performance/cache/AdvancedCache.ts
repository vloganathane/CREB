/**
 * Advanced Cache Implementation for CREB-JS
 * 
 * Production-ready cache with TTL, multiple eviction policies, metrics,
 * memory management, and thread safety.
 */

import { 
  IAdvancedCache, 
  CacheEntry, 
  AdvancedCacheConfig, 
  CacheResult, 
  CacheStats, 
  CacheMetrics,
  CacheEvent,
  CacheEventType,
  CacheEventListener,
  EvictionStrategy
} from './types';
import { EvictionPolicyFactory } from './EvictionPolicies';
import { CacheMetricsCollector, CachePerformanceAnalyzer } from './CacheMetrics';
import { Injectable } from '../../core/decorators/Injectable';

/**
 * Default cache configuration
 */
const DEFAULT_CONFIG: AdvancedCacheConfig = {
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
@Injectable()
export class AdvancedCache<T = any> implements IAdvancedCache<T> {
  private entries = new Map<string, CacheEntry<T>>();
  private config: AdvancedCacheConfig;
  private metrics: CacheMetricsCollector;
  private listeners = new Map<CacheEventType, Set<CacheEventListener<T>>>();
  private insertionCounter = 0;
  private cleanupTimer?: NodeJS.Timeout;
  private metricsTimer?: NodeJS.Timeout;
  private mutex = new AsyncMutex();

  constructor(config: Partial<AdvancedCacheConfig> = {}) {
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
  async get(key: string): Promise<CacheResult<T>> {
    const startTime = Date.now();
    
    if (this.config.threadSafe) {
      return this.mutex.runExclusive(() => this.getInternal(key, startTime));
    } else {
      return this.getInternal(key, startTime);
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: T, ttl?: number): Promise<CacheResult<void>> {
    const startTime = Date.now();
    
    if (this.config.threadSafe) {
      return this.mutex.runExclusive(() => this.setInternal(key, value, ttl, startTime));
    } else {
      return this.setInternal(key, value, ttl, startTime);
    }
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    const entry = this.entries.get(key);
    if (!entry) return false;
    
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
  async delete(key: string): Promise<boolean> {
    if (this.config.threadSafe) {
      return this.mutex.runExclusive(() => this.deleteInternal(key));
    } else {
      return this.deleteInternal(key);
    }
  }

  /**
   * Clear all entries
   */
  async clear(): Promise<void> {
    if (this.config.threadSafe) {
      return this.mutex.runExclusive(() => this.clearInternal());
    } else {
      return this.clearInternal();
    }
  }

  /**
   * Get current cache statistics
   */
  getStats(): CacheStats {
    this.updateMetrics();
    return this.metrics.getStats();
  }

  /**
   * Get detailed metrics
   */
  getMetrics(): CacheMetrics {
    this.metrics.takeSnapshot();
    return this.metrics.getMetrics();
  }

  /**
   * Force cleanup of expired entries
   */
  async cleanup(): Promise<number> {
    if (this.config.threadSafe) {
      return this.mutex.runExclusive(() => this.cleanupInternal());
    } else {
      return this.cleanupInternal();
    }
  }

  /**
   * Add event listener
   */
  addEventListener(type: CacheEventType, listener: CacheEventListener<T>): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(type: CacheEventType, listener: CacheEventListener<T>): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.entries.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.entries.size;
  }

  /**
   * Get memory usage in bytes
   */
  memoryUsage(): number {
    let total = 0;
    for (const entry of this.entries.values()) {
      total += entry.sizeBytes;
    }
    return total;
  }

  /**
   * Check if cache is healthy
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
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
  shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
    }
  }

  // Internal implementation methods

  private async getInternal(key: string, startTime: number): Promise<CacheResult<T>> {
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

  private async setInternal(key: string, value: T, ttl?: number, startTime?: number): Promise<CacheResult<void>> {
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
    const entry: CacheEntry<T> = {
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

  private async deleteInternal(key: string): Promise<boolean> {
    const entry = this.entries.get(key);
    if (!entry) return false;
    
    this.entries.delete(key);
    this.emitEvent('delete', key, entry.value);
    return true;
  }

  private async clearInternal(): Promise<void> {
    this.entries.clear();
    this.insertionCounter = 0;
    this.emitEvent('clear');
  }

  private async cleanupInternal(): Promise<number> {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
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

  private async evictEntries(count: number): Promise<void> {
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

  private async evictForMemory(requiredBytes: number): Promise<void> {
    const currentMemory = this.memoryUsage();
    const targetMemory = this.config.maxMemoryBytes - requiredBytes;
    
    if (currentMemory <= targetMemory) return;
    
    const bytesToEvict = currentMemory - targetMemory;
    let evictedBytes = 0;
    let evictedCount = 0;
    
    const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
    
    while (evictedBytes < bytesToEvict && this.entries.size > 0) {
      const candidates = policy.selectEvictionCandidates(this.entries, this.config, 1);
      if (candidates.length === 0) break;
      
      const key = candidates[0];
      const entry = this.entries.get(key);
      if (entry) {
        evictedBytes += entry.sizeBytes;
        evictedCount++;
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

  private estimateSize(value: T): number {
    // Simple size estimation - could be improved with more sophisticated analysis
    const str = JSON.stringify(value);
    return str.length * 2; // Rough estimate for UTF-16 encoding
  }

  private emitEvent(type: CacheEventType, key?: string, value?: T, metadata?: any): void {
    const event: CacheEvent<T> = {
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
        } catch (error) {
          console.warn('Cache event listener error:', error);
        }
      }
    }
  }

  private updateMetrics(): void {
    const size = this.entries.size;
    const memory = this.memoryUsage();
    this.metrics.updateCacheInfo(size, memory, this.config.maxMemoryBytes);
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(async () => {
      try {
        await this.cleanup();
      } catch (error) {
        console.warn('Cache cleanup error:', error);
      }
    }, this.config.cleanupInterval);
  }

  private startMetricsTimer(): void {
    this.metricsTimer = setInterval(() => {
      this.metrics.takeSnapshot();
      this.emitEvent('stats-update');
    }, this.config.metricsInterval);
  }
}

/**
 * Simple async mutex for thread safety
 */
class AsyncMutex {
  private locked = false;
  private queue: Array<() => void> = [];

  async runExclusive<R>(fn: () => R | Promise<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      const run = async () => {
        this.locked = true;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.locked = false;
          const next = this.queue.shift();
          if (next) {
            next();
          }
        }
      };

      if (this.locked) {
        this.queue.push(run);
      } else {
        run();
      }
    });
  }
}

/**
 * Cache factory for creating configured cache instances
 */
export class CacheFactory {
  private static presets: Record<string, Partial<AdvancedCacheConfig>> = {
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
   * Create cache with preset configuration
   */
  static create<T = any>(preset: keyof typeof CacheFactory.presets): AdvancedCache<T>;
  static create<T = any>(config: Partial<AdvancedCacheConfig>): AdvancedCache<T>;
  static create<T = any>(configOrPreset: keyof typeof CacheFactory.presets | Partial<AdvancedCacheConfig>): AdvancedCache<T> {
    if (typeof configOrPreset === 'string') {
      const presetConfig = this.presets[configOrPreset];
      if (!presetConfig) {
        throw new Error(`Unknown cache preset: ${configOrPreset}`);
      }
      return new AdvancedCache<T>(presetConfig);
    } else {
      return new AdvancedCache<T>(configOrPreset);
    }
  }

  /**
   * Register custom preset
   */
  static registerPreset(name: string, config: Partial<AdvancedCacheConfig>): void {
    this.presets[name] = config;
  }

  /**
   * Get available presets
   */
  static getPresets(): string[] {
    return Object.keys(this.presets);
  }
}
