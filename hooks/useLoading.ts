import { useState, useCallback } from "react";

interface UseLoadingOptions {
  initialLoading?: boolean;
  onError?: (error: Error) => void;
}

interface UseLoadingReturn {
  loading: boolean;
  error: Error | null;
  execute: <T>(asyncFn: () => Promise<T>) => Promise<T | undefined>;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

/**
 * Hook for managing loading states and errors for async operations
 * 
 * @example
 * ```tsx
 * const { loading, error, execute } = useLoading();
 * 
 * const handleSubmit = async () => {
 *   const result = await execute(async () => {
 *     return await api.createProduct(data);
 *   });
 *   if (result) {
 *     // Success
 *   }
 * };
 * ```
 */
export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const { initialLoading = false, onError } = options;
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn();
        setLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        
        if (onError) {
          onError(error);
        }
        
        return undefined;
      }
    },
    [onError]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    setLoading,
    setError,
    reset,
  };
}
