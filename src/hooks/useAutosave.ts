import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export const useAutosave = ({
  data,
  onSave,
  interval = 30000, // 30 seconds default
  enabled = true,
}: UseAutosaveOptions) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    const currentData = JSON.stringify(data);
    
    // Only save if data has changed
    if (currentData === lastSavedRef.current) return;

    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedRef.current = currentData;
      
      // Silent success - no toast notification for autosave
      console.log('Draft autosaved successfully');
    } catch (error) {
      console.error('Autosave failed:', error);
      toast({
        title: 'Autosave Failed',
        description: 'Failed to save draft. Please save manually.',
        variant: 'destructive',
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled, toast]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, interval, enabled]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (enabled && !isSavingRef.current) {
        save();
      }
    };
  }, [save, enabled]);

  return { save };
};