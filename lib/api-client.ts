/**
 * API Client
 * 
 * Centralized API client for making HTTP requests
 * - Automatic authentication token handling
 * - Request/response interceptors
 * - Error handling and retry logic
 * - Request timeout handling
 */

import { API_CONFIG } from './config';
import { getAuthTokens, clearAuthTokens } from './secure-storage';
import { logger } from './logger';
import { handleError } from './error-handler';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { token } = await getAuthTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: T;
    try {
      data = isJson ? await response.json() : (await response.text() as unknown as T);
    } catch (error) {
      logger.error('Failed to parse response', error);
      throw new Error('Failed to parse response');
    }

    if (!response.ok) {
      const error: ApiError = {
        message: (data as any)?.message || `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        code: (data as any)?.code,
        details: data,
      };

      // Handle 401 Unauthorized - clear tokens
      if (response.status === 401) {
        await clearAuthTokens();
      }

      throw error;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { headers: customHeaders = {}, params, timeout, signal } = options;
    const authHeaders = await this.getAuthHeaders();
    const headers = { ...authHeaders, ...customHeaders };

    const url = this.buildURL(endpoint, params);

    const controller = new AbortController();
    const timeoutId = timeout
      ? setTimeout(() => controller.abort(), timeout)
      : setTimeout(() => controller.abort(), this.timeout);

    // Combine abort signals if both provided
    const abortSignal = signal
      ? (() => {
          const combined = new AbortController();
          signal.addEventListener('abort', () => combined.abort());
          controller.signal.addEventListener('abort', () => combined.abort());
          return combined.signal;
        })()
      : controller.signal;

    try {
      const response = await fetch(url, {
        method,
        headers,
        signal: abortSignal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
          statusCode: 408,
        } as ApiError;
      }

      if (error.statusCode) {
        // Already an ApiError
        throw error;
      }

      // Network or other error
      throw {
        message: error.message || 'Network request failed',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const headers = { ...options.headers };
    
    // Handle FormData (for file uploads)
    if (body instanceof FormData) {
      delete headers['Content-Type']; // Let browser set it with boundary
    }

    const response = await fetch(this.buildURL(endpoint, options.params), {
      method: 'POST',
      headers: await this.getAuthHeaders().then(auth => ({ ...auth, ...headers })),
      body: body instanceof FormData ? body : JSON.stringify(body),
      signal: options.signal,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const headers = { ...options.headers };
    
    if (body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(this.buildURL(endpoint, options.params), {
      method: 'PUT',
      headers: await this.getAuthHeaders().then(auth => ({ ...auth, ...headers })),
      body: body instanceof FormData ? body : JSON.stringify(body),
      signal: options.signal,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }
}

// Export singleton instance
export const api = new ApiClient();
export const apiClient = api; // Alias for compatibility
