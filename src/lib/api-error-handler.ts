import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Global API Error Handler
 *
 * Centralized error handling for all Supabase API calls and external APIs.
 * Provides consistent error messaging and logging.
 */

export interface APIError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  statusCode?: number;
}

/**
 * Parse Supabase PostgrestError into user-friendly message
 */
export function parseSupabaseError(error: PostgrestError): APIError {
  const apiError: APIError = {
    message: error.message || 'An unexpected database error occurred',
    code: error.code,
    details: error.details,
    hint: error.hint,
  };

  // Map common error codes to user-friendly messages
  switch (error.code) {
    case '23505': // unique_violation
      apiError.message = 'This record already exists. Please check for duplicates.';
      break;
    case '23503': // foreign_key_violation
      apiError.message = 'This record is referenced by other data and cannot be deleted.';
      break;
    case '23502': // not_null_violation
      apiError.message = 'Required field is missing. Please fill in all required fields.';
      break;
    case '42501': // insufficient_privilege
      apiError.message = 'You do not have permission to perform this action.';
      break;
    case 'PGRST116': // Row not found
      apiError.message = 'The requested record was not found.';
      break;
    case 'PGRST301': // JWT expired
      apiError.message = 'Your session has expired. Please log in again.';
      break;
    default:
      if (error.message.includes('timeout')) {
        apiError.message = 'Request timed out. Please try again.';
      } else if (error.message.includes('network')) {
        apiError.message = 'Network error. Please check your connection.';
      }
  }

  return apiError;
}

/**
 * Handle API errors with toast notifications
 */
export function handleAPIError(
  error: unknown,
  context?: string,
  options?: {
    silent?: boolean;
    showDetails?: boolean;
    duration?: number;
  }
): APIError {
  let apiError: APIError;

  // Parse different error types
  if (error && typeof error === 'object' && 'code' in error) {
    // Supabase PostgrestError
    apiError = parseSupabaseError(error as PostgrestError);
  } else if (error instanceof Error) {
    // Standard JavaScript Error
    apiError = {
      message: error.message || 'An unexpected error occurred',
    };
  } else if (typeof error === 'string') {
    // String error
    apiError = {
      message: error,
    };
  } else {
    // Unknown error type
    apiError = {
      message: 'An unexpected error occurred',
      details: JSON.stringify(error),
    };
  }

  // Add context if provided
  const fullMessage = context ? `${context}: ${apiError.message}` : apiError.message;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      context,
      error: apiError,
      originalError: error,
    });
  }

  // Show toast notification unless silent
  if (!options?.silent) {
    toast.error(fullMessage, {
      description: options?.showDetails && apiError.details ? apiError.details : apiError.hint,
      duration: options?.duration || 5000,
    });
  }

  // TODO: Send to error tracking service
  // if (window.Sentry && !options?.silent) {
  //   window.Sentry.captureException(error, {
  //     contexts: {
  //       api: {
  //         context,
  //         parsedError: apiError,
  //       },
  //     },
  //   });
  // }

  return apiError;
}

/**
 * Timeout wrapper for async functions
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  errorMessage: string = 'Request timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        onRetry?.(attempt + 1, error);

        if (process.env.NODE_ENV === 'development') {
          console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    );
  }
  return false;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('timeout') || error.message.includes('timed out');
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: string }).code;
    return code === 'PGRST301' || code === '42501' || code === 'PGRST116';
  }
  return false;
}
