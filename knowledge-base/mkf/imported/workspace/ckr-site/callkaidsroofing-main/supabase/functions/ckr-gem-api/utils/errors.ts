export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: any): {
  success: false;
  error: string;
  message: string;
  status: number;
  details?: any;
} {
  console.error('Error:', error);
  
  if (error instanceof APIError) {
    return {
      success: false,
      error: error.code,
      message: error.message,
      status: error.status
    };
  }
  
  // Validation errors (Zod)
  if (error.name === 'ZodError') {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid input parameters',
      status: 400,
      details: error.errors
    };
  }
  
  // Rate limit errors
  if (error.message?.includes('Rate limit exceeded')) {
    return {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: error.message,
      status: 429
    };
  }
  
  // Database errors
  if (error.code) {
    return {
      success: false,
      error: 'DATABASE_ERROR',
      message: `Database operation failed: ${error.message}`,
      status: 500,
      details: { code: error.code }
    };
  }
  
  // Generic error
  return {
    success: false,
    error: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred',
    status: 500
  };
}
