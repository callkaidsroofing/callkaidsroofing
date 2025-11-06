import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError, handleFileUploadError, handleNetworkError, AppError } from '@/lib/errorHandling';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Custom hook for consistent error handling across the application
 */
export const useErrorHandler = () => {
  const { toast } = useToast();

  const showError = (error: AppError) => {
    toast({
      variant: 'destructive',
      title: error.title,
      description: error.description,
    });
    
    if (error.action) {
      console.info('Action required:', error.action);
    }
  };

  const handleError = (error: PostgrestError | Error | null, context: string) => {
    const appError = handleSupabaseError(error, context);
    showError(appError);
  };

  const handleFileError = (error: Error) => {
    const appError = handleFileUploadError(error);
    showError(appError);
  };

  const handleNetwork = () => {
    const appError = handleNetworkError();
    showError(appError);
  };

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  return {
    handleError,
    handleFileError,
    handleNetwork,
    showError,
    showSuccess,
  };
};