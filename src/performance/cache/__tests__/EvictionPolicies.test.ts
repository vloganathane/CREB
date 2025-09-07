/**
 * Eviction Policies Tests for CREB-JS
 * 
 * Tests for all eviction policy implementations
 */

import { 
  LRUEvictionPolicy, 
  LFUEvictionPolicy, 
  FIFOEvictionPolicy, 
  TTLEvictionPolicy, 
  RandomEvictionPolicy,
  AdaptiveEvictionPolicy,
  EvictionPolicyFactory 
} from '../EvictionPolicies';
import { CacheEntry, AdvancedCacheConfig } from '../types';

describe('Eviction Policies', () => {
  const mockConfig: AdvancedCacheConfig = {
    maxSize: 10,
    defaultTtl: 3600000,
    evictionStrategy: 'lru',
    maxMemoryBytes: 100 * 1024 * 1024,
    enableMetrics: true,
    metricsInterval: 60000,
    autoCleanup: true,
    cleanupInterval: 300000,
    threadSafe: true
  };

  describe('LRU Eviction Policy', () => {
    let policy: LRUEvictionPolicy;

    beforeEach(() => {
      policy = new LRUEvictionPolicy();
    });

    test('should evict least recently used entries', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      entries.set('key1', createMockEntry('value1', now - 1000)); // Oldest
      entries.set('key2', createMockEntry('value2', now - 500));
      entries.set('key3', createMockEntry('value3', now - 100));  // Newest
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 1);
      expect(candidates).toEqual(['key1']);
    });

    test('should evict multiple entries in LRU order', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      entries.set('key1', createMockEntry('value1', now - 1000));
      entries.set('key2', createMockEntry('value2', now - 800));
      entries.set('key3', createMockEntry('value3', now - 600));
      entries.set('key4', createMockEntry('value4', now - 400));
      entries.set('key5', createMockEntry('value5', now - 200));
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 3);
      expect(candidates).toEqual(['key1', 'key2', 'key3']);
    });

    test('should update access metadata on access', () => {
      const entry = createMockEntry('value', Date.now() - 1000);
      const originalAccess = entry.lastAccessed;
      const originalCount = entry.accessCount;
      
      policy.onAccess(entry);
      
      expect(entry.lastAccessed).toBeGreaterThan(originalAccess);
      expect(entry.accessCount).toBe(originalCount + 1);
    });

    test('should update access metadata on insert', () => {
      const entry = createMockEntry('value', 0);
      entry.accessCount = 0;
      
      policy.onInsert(entry);
      
      expect(entry.lastAccessed).toBeGreaterThan(0);
      expect(entry.accessCount).toBe(1);
    });
  });

  describe('LFU Eviction Policy', () => {
    let policy: LFUEvictionPolicy;

    beforeEach(() => {
      policy = new LFUEvictionPolicy();
    });

    test('should evict least frequently used entries', () => {
      const entries = new Map<string, CacheEntry>();
      
      entries.set('key1', createMockEntryWithAccess('value1', 5)); // High frequency
      entries.set('key2', createMockEntryWithAccess('value2', 1)); // Low frequency
      entries.set('key3', createMockEntryWithAccess('value3', 3)); // Medium frequency
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 1);
      expect(candidates).toEqual(['key2']);
    });

    test('should use last accessed time for tie-breaking', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      // Same access count, different last accessed times
      const entry1 = createMockEntryWithAccess('value1', 2);
      entry1.lastAccessed = now - 1000; // Older
      
      const entry2 = createMockEntryWithAccess('value2', 2);
      entry2.lastAccessed = now - 500; // Newer
      
      entries.set('key1', entry1);
      entries.set('key2', entry2);
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 1);
      expect(candidates).toEqual(['key1']); // Older access time wins tie
    });
  });

  describe('FIFO Eviction Policy', () => {
    let policy: FIFOEvictionPolicy;

    beforeEach(() => {
      policy = new FIFOEvictionPolicy();
    });

    test('should evict first inserted entries', () => {
      const entries = new Map<string, CacheEntry>();
      
      entries.set('key1', createMockEntryWithOrder('value1', 1)); // First
      entries.set('key2', createMockEntryWithOrder('value2', 3)); // Third
      entries.set('key3', createMockEntryWithOrder('value3', 2)); // Second
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 2);
      expect(candidates).toEqual(['key1', 'key3']); // Insertion order 1, 2
    });
  });

  describe('TTL Eviction Policy', () => {
    let policy: TTLEvictionPolicy;

    beforeEach(() => {
      policy = new TTLEvictionPolicy();
    });

    test('should prioritize expired entries', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      // Expired entry
      const expiredEntry = createMockEntry('value1', now - 1000);
      expiredEntry.ttl = 500;
      expiredEntry.expiresAt = now - 500;
      
      // Non-expired entry
      const validEntry = createMockEntry('value2', now - 500);
      validEntry.ttl = 1000;
      validEntry.expiresAt = now + 500;
      
      entries.set('expired', expiredEntry);
      entries.set('valid', validEntry);
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 1);
      expect(candidates).toEqual(['expired']);
    });

    test('should fall back to LRU for non-expired entries', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      // All entries are non-expired
      entries.set('key1', createMockEntryWithTTL('value1', now - 1000, now + 1000)); // Older access
      entries.set('key2', createMockEntryWithTTL('value2', now - 500, now + 1000));  // Newer access
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 1);
      expect(candidates).toEqual(['key1']); // LRU fallback
    });

    test('should return expired entries first, then LRU', () => {
      const entries = new Map<string, CacheEntry>();
      const now = Date.now();
      
      // One expired
      const expiredEntry = createMockEntry('value1', now - 1000);
      expiredEntry.ttl = 500;
      expiredEntry.expiresAt = now - 500;
      
      // Two non-expired
      const validEntry1 = createMockEntryWithTTL('value2', now - 800, now + 1000); // Older
      const validEntry2 = createMockEntryWithTTL('value3', now - 400, now + 1000); // Newer
      
      entries.set('expired', expiredEntry);
      entries.set('valid1', validEntry1);
      entries.set('valid2', validEntry2);
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 2);
      expect(candidates).toEqual(['expired', 'valid1']); // Expired first, then LRU
    });
  });

  describe('Random Eviction Policy', () => {
    let policy: RandomEvictionPolicy;

    beforeEach(() => {
      policy = new RandomEvictionPolicy();
    });

    test('should return requested number of candidates', () => {
      const entries = new Map<string, CacheEntry>();
      
      for (let i = 0; i < 10; i++) {
        entries.set(`key${i}`, createMockEntry(`value${i}`, Date.now()));
      }
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 3);
      expect(candidates).toHaveLength(3);
      
      // Should be valid keys
      candidates.forEach(key => {
        expect(entries.has(key)).toBe(true);
      });
    });

    test('should handle more candidates requested than available', () => {
      const entries = new Map<string, CacheEntry>();
      
      entries.set('key1', createMockEntry('value1', Date.now()));
      entries.set('key2', createMockEntry('value2', Date.now()));
      
      const candidates = policy.selectEvictionCandidates(entries, mockConfig, 5);
      expect(candidates).toHaveLength(2); // Only 2 available
    });
  });

  describe('Adaptive Eviction Policy', () => {
    let policy: AdaptiveEvictionPolicy;

    beforeEach(() => {
      policy = new AdaptiveEvictionPolicy();
    });

    test('should start with fallback strategy', () => {
      expect(policy.getCurrentStrategy()).toBe('lru'); // Default fallback
    });

    test('should adapt strategy based on access patterns', () => {
      const entries = new Map<string, CacheEntry>();
      
      // Create entries with high access variance (should suggest LFU)
      entries.set('popular', createMockEntryWithAccess('value1', 100));
      entries.set('unpopular1', createMockEntryWithAccess('value2', 1));
      entries.set('unpopular2', createMockEntryWithAccess('value3', 1));
      entries.set('unpopular3', createMockEntryWithAccess('value4', 1));
      
      // Simulate evaluation trigger (normally happens after many operations)
      const originalEvaluationWindow = (policy as any).evaluationWindow;
      (policy as any).evaluationWindow = 1; // Force immediate evaluation
      (policy as any).operationCount = 0;
      
      policy.selectEvictionCandidates(entries, mockConfig, 1);
      
      // Should adapt to LFU due to high variance
      expect(policy.getCurrentStrategy()).toBe('lfu');
      
      // Restore original evaluation window
      (policy as any).evaluationWindow = originalEvaluationWindow;
    });
  });

  describe('Eviction Policy Factory', () => {
    test('should provide all standard policies', () => {
      const strategies = EvictionPolicyFactory.getAvailableStrategies();
      expect(strategies).toContain('lru');
      expect(strategies).toContain('lfu');
      expect(strategies).toContain('fifo');
      expect(strategies).toContain('ttl');
      expect(strategies).toContain('random');
    });

    test('should return correct policy instances', () => {
      expect(EvictionPolicyFactory.getPolicy('lru')).toBeInstanceOf(LRUEvictionPolicy);
      expect(EvictionPolicyFactory.getPolicy('lfu')).toBeInstanceOf(LFUEvictionPolicy);
      expect(EvictionPolicyFactory.getPolicy('fifo')).toBeInstanceOf(FIFOEvictionPolicy);
      expect(EvictionPolicyFactory.getPolicy('ttl')).toBeInstanceOf(TTLEvictionPolicy);
      expect(EvictionPolicyFactory.getPolicy('random')).toBeInstanceOf(RandomEvictionPolicy);
    });

    test('should allow custom policy registration', () => {
      class CustomPolicy {
        readonly strategy = 'custom' as any;
        selectEvictionCandidates = jest.fn().mockReturnValue(['key1']);
        onAccess = jest.fn();
        onInsert = jest.fn();
      }
      
      const customPolicy = new CustomPolicy();
      EvictionPolicyFactory.registerPolicy(customPolicy as any);
      
      const retrieved = EvictionPolicyFactory.getPolicy('custom' as any);
      expect(retrieved).toBe(customPolicy);
      
      const strategies = EvictionPolicyFactory.getAvailableStrategies();
      expect(strategies).toContain('custom');
    });

    test('should throw for unknown strategy', () => {
      expect(() => {
        EvictionPolicyFactory.getPolicy('nonexistent' as any);
      }).toThrow('Unknown eviction strategy: nonexistent');
    });
  });
});

// Helper functions for creating mock cache entries
function createMockEntry(value: any, lastAccessed: number): CacheEntry {
  return {
    value,
    createdAt: Date.now(),
    lastAccessed,
    accessCount: 1,
    ttl: 0,
    expiresAt: 0,
    sizeBytes: JSON.stringify(value).length * 2,
    insertionOrder: 0
  };
}

function createMockEntryWithAccess(value: any, accessCount: number): CacheEntry {
  return {
    value,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    accessCount,
    ttl: 0,
    expiresAt: 0,
    sizeBytes: JSON.stringify(value).length * 2,
    insertionOrder: 0
  };
}

function createMockEntryWithOrder(value: any, insertionOrder: number): CacheEntry {
  return {
    value,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    accessCount: 1,
    ttl: 0,
    expiresAt: 0,
    sizeBytes: JSON.stringify(value).length * 2,
    insertionOrder
  };
}

function createMockEntryWithTTL(value: any, lastAccessed: number, expiresAt: number): CacheEntry {
  return {
    value,
    createdAt: Date.now(),
    lastAccessed,
    accessCount: 1,
    ttl: 1000,
    expiresAt,
    sizeBytes: JSON.stringify(value).length * 2,
    insertionOrder: 0
  };
}
