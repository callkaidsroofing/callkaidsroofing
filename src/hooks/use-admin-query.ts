import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PostgrestError } from '@supabase/supabase-js';
import { useEffect } from 'react';

/**
 * Standard admin query hook with built-in error handling and loading states
 * Wraps React Query's useQuery with consistent patterns across all admin pages
 */
export function useAdminQuery<TData = unknown, TError = PostgrestError>(
  options: Omit<UseQueryOptions<TData, TError>, 'onSuccess' | 'onError'> & {
    errorMessage?: string;
    successMessage?: string;
  }
) {
  const { toast } = useToast();
  const { errorMessage, successMessage, ...queryOptions } = options;

  const query = useQuery<TData, TError>({
    ...queryOptions,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle error with useEffect (TanStack Query v5 pattern)
  useEffect(() => {
    if (query.error) {
      console.error('Query error:', query.error);
      toast({
        title: 'Error',
        description: errorMessage || 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [query.error, errorMessage, toast]);

  // Handle success with useEffect
  useEffect(() => {
    if (query.isSuccess && successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
      });
    }
  }, [query.isSuccess, successMessage, toast]);

  return query;
}

/**
 * Standard admin mutation hook with built-in error handling and optimistic updates
 * Wraps React Query's useMutation with consistent patterns
 */
export function useAdminMutation<TData = unknown, TError = PostgrestError, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables> & {
    errorMessage?: string;
    successMessage?: string;
    invalidateQueries?: string[];
  }
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { errorMessage, successMessage, invalidateQueries, ...mutationOptions } = options;

  return useMutation<TData, TError, TVariables>({
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      // Invalidate queries
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }

      // Show success toast
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
        });
      }

      // Call original onSuccess
      mutationOptions.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error',
        description: errorMessage || 'Operation failed. Please try again.',
        variant: 'destructive',
      });

      // Call original onError
      mutationOptions.onError?.(error, variables, context);
    },
  });
}

/**
 * Helper to handle loading states consistently
 */
export function getLoadingMessage(isLoading: boolean, customMessage?: string): string | null {
  if (!isLoading) return null;
  return customMessage || 'Loading...';
}

/**
 * Helper to handle error states consistently
 */
export function getErrorMessage(error: unknown, customMessage?: string): string {
  if (customMessage) return customMessage;

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }

  return 'An unexpected error occurred';
}
