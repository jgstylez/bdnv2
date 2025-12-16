/**
 * API Client
 * 
 * Centralized API client for all backend communication
 * - Handles authentication tokens
 * - Implements request/response interceptors
 * - Automatic token refresh
 * - Error handling and retry logic
 * - Request caching (optional)
 */

import { logger } from './logger';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from './config';

// Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  skipAuth?: boolean;
}

// Configuration
const API_BASE_URL = API_CONFIG.baseURL;
const DEFAULT_TIMEOUT = API_CONFIG.timeout;
const DEFAULT_RETRIES = API_CONFIG.retries;
const TOKEN_STORAGE_KEY = 'authToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  /**
   * Load tokens from secure storage
   */
  private async loadTokens(): Promise<void> {
    try {
      this.token = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
      this.refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to load tokens from secure storage', error);
    }
  }

  /**
   * Store tokens in secure storage
   */
  async setTokens(token: string, refreshToken?: string): Promise<void> {
    try {
      this.token = token;
      await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
      
      if (refreshToken) {
        this.refreshToken = refreshToken;
        await SecureStore.setItemAsync(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      }
    } catch (error) {
      logger.error('Failed to store tokens in secure storage', error);
      throw error;
    }
  }

  /**
   * Clear tokens from storage
   */
  async clearTokens(): Promise<void> {
    try {
      this.token = null;
      this.refreshToken = null;
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear tokens from secure storage', error);
    }
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      await this.setTokens(data.token, data.refreshToken);
      return data.token;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  /**
   * Build request headers
   */
  private async buildHeaders(config: RequestConfig): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add auth token if available and not skipped
    if (!config.skipAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, response?: Response): ApiError {
    if (response) {
      return {
        message: error.message || 'An error occurred',
        statusCode: response.status,
        code: error.code,
        details: error.details,
      };
    }

    return {
      message: error.message || 'Network error occurred',
      code: 'NETWORK_ERROR',
    };
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      timeout = DEFAULT_TIMEOUT,
      retries = DEFAULT_RETRIES,
      skipAuth = false,
    } = config;

    const url = this.buildURL(endpoint, params);
    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Refresh token if needed (before first attempt or on 401)
        if (!skipAuth && attempt === 0 && this.refreshToken && !this.token) {
          await this.refreshAccessToken();
        }

        const headers = await this.buildHeaders(config);

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestConfig: RequestInit = {
          method,
          headers,
          signal: controller.signal,
        };

        if (body && method !== 'GET') {
          requestConfig.body = JSON.stringify(body);
        }

        logger.debug(`API Request: ${method} ${url}`, { attempt: attempt + 1, body });

        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId);

        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && !skipAuth && this.refreshToken && attempt === 0) {
          logger.info('Token expired, attempting refresh');
          await this.refreshAccessToken();
          // Retry request with new token
          continue;
        }

        const data = await response.json();

        if (!response.ok) {
          const error: ApiError = {
            message: data.message || `HTTP ${response.status}`,
            statusCode: response.status,
            code: data.code,
            details: data.details,
          };
          throw error;
        }

        logger.debug(`API Response: ${method} ${url}`, { status: response.status, data });

        return {
          data: data.data || data,
          message: data.message,
          success: true,
        };
      } catch (error: any) {
        lastError = this.handleError(error, error.response);

        // Don't retry on client errors (4xx) except 401
        if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 401) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        logger.warn(`API request failed, retrying in ${delay}ms`, { attempt: attempt + 1, error: lastError });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: { uri: string; type: string; name: string },
    additionalData?: Record<string, any>,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    // @ts-ignore - FormData append works with file objects
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = await this.buildHeaders(config || {});
    // Remove Content-Type to let browser set it with boundary
    delete headers['Content-Type'];

    const url = this.buildURL(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw this.handleError(data, response);
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true,
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  get: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.post<T>(endpoint, body, config),
  put: <T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.put<T>(endpoint, body, config),
  patch: <T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.patch<T>(endpoint, body, config),
  delete: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.delete<T>(endpoint, config),
  upload: <T>(
    endpoint: string,
    file: { uri: string; type: string; name: string },
    additionalData?: Record<string, any>,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) => apiClient.upload<T>(endpoint, file, additionalData, config),
  setTokens: (token: string, refreshToken?: string) => 
    apiClient.setTokens(token, refreshToken),
  clearTokens: () => apiClient.clearTokens(),
  getToken: () => apiClient.getToken(),
};

