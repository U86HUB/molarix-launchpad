
import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export interface AsyncOperation<T = any> {
  operation: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useLoadingStates = () => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});

  const executeAsync = useCallback(async <T>(
    key: string,
    config: AsyncOperation<T>
  ): Promise<T | null> => {
    setStates(prev => ({
      ...prev,
      [key]: { isLoading: true, error: null, data: null }
    }));

    try {
      const result = await config.operation();
      
      setStates(prev => ({
        ...prev,
        [key]: { isLoading: false, error: null, data: result }
      }));

      config.onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      
      setStates(prev => ({
        ...prev,
        [key]: { isLoading: false, error: errorMessage, data: null }
      }));

      config.onError?.(error);
      return null;
    }
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return states[key]?.isLoading ?? false;
  }, [states]);

  const getError = useCallback((key: string): string | null => {
    return states[key]?.error ?? null;
  }, [states]);

  const getData = useCallback((key: string): any => {
    return states[key]?.data ?? null;
  }, [states]);

  const clearState = useCallback((key: string): void => {
    setStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  return {
    executeAsync,
    isLoading,
    getError,
    getData,
    clearState,
    states
  };
};
