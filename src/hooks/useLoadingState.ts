import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

/**
 * Hook to manage multiple loading states
 * Useful for components with multiple async operations
 */
export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  const resetLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    resetLoading,
    loadingStates,
  };
};