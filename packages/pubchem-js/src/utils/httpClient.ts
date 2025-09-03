/**
 * HTTP client for PubChem API with caching and rate limiting
 */

import { HTTPClientOptions, CacheOptions } from '../types/index';
import { DEFAULT_CONFIG } from './constants';

// Cache implementation
class Cache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? DEFAULT_CONFIG.cache.ttl,
      maxSize: options.maxSize ?? DEFAULT_CONFIG.cache.maxSize,
      persistent: options.persistent ?? DEFAULT_CONFIG.cache.persistent,
    };

    // Load from localStorage if persistent
    if (this.options.persistent && typeof localStorage !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('pubchem-cache');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data);
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private saveToStorage(): void {
    if (this.options.persistent && typeof localStorage !== 'undefined') {
      try {
        const data = Array.from(this.cache.entries());
        localStorage.setItem('pubchem-cache', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save cache to localStorage:', error);
      }
    }
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    // Enforce max size
    if (this.cache.size >= this.options.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    if (this.options.persistent && typeof localStorage !== 'undefined') {
      localStorage.removeItem('pubchem-cache');
    }
  }
}

// Rate limiter implementation
class RateLimiter {
  private lastRequest = 0;
  private queue: Array<() => void> = [];
  private processing = false;

  constructor(private delay: number) {}

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequest;

      if (timeSinceLastRequest < this.delay) {
        await this.sleep(this.delay - timeSinceLastRequest);
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastRequest = Date.now();
        await fn();
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Custom error classes
export class PubChemHTTPError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `HTTP ${status}: ${statusText}`);
    this.name = 'PubChemHTTPError';
  }
}

export class PubChemTimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message);
    this.name = 'PubChemTimeoutError';
  }
}

export class PubChemNotFoundError extends Error {
  constructor(message = 'No results found') {
    super(message);
    this.name = 'PubChemNotFoundError';
  }
}

// Main HTTP client
export class HTTPClient {
  private cache: Cache;
  private rateLimiter: RateLimiter;
  private options: Required<HTTPClientOptions>;

  constructor(options: HTTPClientOptions = {}) {
    this.options = {
      baseURL: options.baseURL ?? DEFAULT_CONFIG.baseURL,
      timeout: options.timeout ?? DEFAULT_CONFIG.timeout,
      retries: options.retries ?? DEFAULT_CONFIG.retries,
      rateLimitDelay: options.rateLimitDelay ?? DEFAULT_CONFIG.rateLimitDelay,
    };

    this.cache = new Cache();
    this.rateLimiter = new RateLimiter(this.options.rateLimitDelay);
  }

  async get<T>(url: string, useCache = true): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.options.baseURL}${url}`;
    const cacheKey = fullUrl;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Make request with rate limiting
    const result = await this.rateLimiter.throttle(() => this.makeRequest<T>(fullUrl));

    // Cache successful results
    if (useCache && result) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  private async makeRequest<T>(url: string, attempt = 1): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PubChem-JS/1.0.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new PubChemNotFoundError(`Resource not found: ${url}`);
        }
        throw new PubChemHTTPError(response.status, response.statusText);
      }

      const data: any = await response.json();

      // Check for PubChem API errors in response
      if (data.Fault) {
        throw new Error(`PubChem API Error: ${data.Fault.Message}`);
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new PubChemTimeoutError();
      }

      // Retry on network errors
      if (attempt < this.options.retries && this.isRetryableError(error)) {
        await this.sleep(1000 * attempt); // Exponential backoff
        return this.makeRequest<T>(url, attempt + 1);
      }

      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    return (
      error instanceof PubChemTimeoutError ||
      (error instanceof PubChemHTTPError && error.status >= 500) ||
      error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND'
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.cache.clear();
  }
}
