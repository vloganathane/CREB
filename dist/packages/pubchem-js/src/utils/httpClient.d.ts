/**
 * HTTP client for PubChem API with caching and rate limiting
 */
import { HTTPClientOptions } from '../types/index';
export declare class PubChemHTTPError extends Error {
    status: number;
    statusText: string;
    constructor(status: number, statusText: string, message?: string);
}
export declare class PubChemTimeoutError extends Error {
    constructor(message?: string);
}
export declare class PubChemNotFoundError extends Error {
    constructor(message?: string);
}
export declare class HTTPClient {
    private cache;
    private rateLimiter;
    private options;
    constructor(options?: HTTPClientOptions);
    /**
     * Get the base URL for API requests
     */
    getBaseURL(): string;
    get<T>(url: string, useCache?: boolean): Promise<T>;
    private makeRequest;
    private isRetryableError;
    private sleep;
    clearCache(): void;
}
//# sourceMappingURL=httpClient.d.ts.map