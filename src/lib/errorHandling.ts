import { PostgrestError } from '@supabase/supabase-js';

export interface AppError {
  title: string;
  description: string;
  action?: string;
}

/**
 * Centralized error handling for consistent user-facing error messages
 */
export const handleSupabaseError = (error: PostgrestError | Error | null, context: string): AppError => {
  console.error(`${context}:`, error);

  // Handle Supabase-specific errors
  if (error && 'code' in error) {
    const postgrestError = error as PostgrestError;
    
    // Permission errors
    if (postgrestError.code === 'PGRST301' || postgrestError.code === '42501') {
      return {
        title: 'Permission Denied',
        description: 'You don\'t have permission to perform this action.',
        action: 'Contact your administrator if you believe this is an error.',
      };
    }

    // Row Level Security errors
    if (postgrestError.message?.includes('row-level security')) {
      return {
        title: 'Access Restricted',
        description: 'This data is protected by security policies.',
        action: 'Please sign in or check your permissions.',
      };
    }

    // Unique constraint violations
    if (postgrestError.code === '23505') {
      return {
        title: 'Duplicate Entry',
        description: 'This record already exists.',
        action: 'Please check your data and try again.',
      };
    }

    // Foreign key violations
    if (postgrestError.code === '23503') {
      return {
        title: 'Related Data Missing',
        description: 'Cannot complete this action due to missing related data.',
        action: 'Please ensure all required data exists.',
      };
    }

    // Not found errors
    if (postgrestError.code === 'PGRST116') {
      return {
        title: 'Not Found',
        description: 'The requested data could not be found.',
        action: 'It may have been deleted or you may not have access.',
      };
    }
  }

  // Generic fallback
  return {
    title: 'Error',
    description: error?.message || 'An unexpected error occurred.',
    action: 'Please try again or contact support if the problem persists.',
  };
};

/**
 * Handle file upload errors
 */
export const handleFileUploadError = (error: Error): AppError => {
  console.error('File upload error:', error);

  if (error.message.includes('size')) {
    return {
      title: 'File Too Large',
      description: 'The file exceeds the maximum allowed size.',
      action: 'Please select a smaller file (max 10MB).',
    };
  }

  if (error.message.includes('type') || error.message.includes('format')) {
    return {
      title: 'Invalid File Type',
      description: 'This file type is not supported.',
      action: 'Please upload an image file (JPEG, PNG, WebP).',
    };
  }

  return {
    title: 'Upload Failed',
    description: 'Failed to upload the file.',
    action: 'Please try again or check your internet connection.',
  };
};

/**
 * Handle network errors
 */
export const handleNetworkError = (): AppError => {
  return {
    title: 'Connection Error',
    description: 'Unable to connect to the server.',
    action: 'Please check your internet connection and try again.',
  };
};

/**
 * Validate and sanitize user input
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Australian phone number validation
  const phoneRegex = /^(\+61|0)[2-9][0-9]{8}$|^04[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
};