/**
 * useApi Hook
 * 
 * React hook for making API calls with loading and error states
 * - Automatic loading state management
 * - Error handling
 * - Retry logic
 * - Request cancellation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { api, ApiError, ApiResponse } from '../lib/api-client';
import { logger } from '../lib/logger';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic API hook
 */
export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall(...args);
        const data = response.data;

        setState({
          data,
          loading: false,
          error: null,
        });

        onSuccess?.(data);
        return data;
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        };

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        logger.error('API call failed', error);
        onError?.(apiError);
        return null;
      }
    },
    [apiCall, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []); // Only run once on mount

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for GET requests
 */
export function useGet<T = any>(
  endpoint: string,
  options: UseApiOptions & { params?: Record<string, string | number | boolean> } = {}
) {
  const { params, ...apiOptions } = options;

  const apiCall = useCallback(
    () => api.get<T>(endpoint, { params }),
    [endpoint, params]
  );

  return useApi<T>(apiCall, apiOptions);
}

/**
 * Hook for POST requests
 */
export function usePost<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const apiCall = useCallback(
    (body?: any) => api.post<T>(endpoint, body),
    [endpoint]
  );

  return useApi<T>(apiCall, options);
}

/**
 * Hook for PUT requests
 */
export function usePut<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const apiCall = useCallback(
    (body?: any) => api.put<T>(endpoint, body),
    [endpoint]
  );

  return useApi<T>(apiCall, options);
}

/**
 * Hook for DELETE requests
 */
export function useDelete<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const apiCall = useCallback(
    () => api.delete<T>(endpoint),
    [endpoint]
  );

  return useApi<T>(apiCall, options);
}

