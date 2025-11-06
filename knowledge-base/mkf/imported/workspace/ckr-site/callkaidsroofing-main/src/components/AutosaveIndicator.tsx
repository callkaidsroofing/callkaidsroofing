import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutosaveIndicatorProps {
  isSaving: boolean;
  lastSaved?: Date;
  error?: boolean;
}

export const AutosaveIndicator = ({
  isSaving,
  lastSaved,
  error,
}: AutosaveIndicatorProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSaving || error || lastSaved) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, error, lastSaved]);

  if (!show) return null;

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return 'a while ago';
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg',
        'transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
        error
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-card border border-border'
      )}
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Saving draft...</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Failed to save</span>
        </>
      ) : lastSaved ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Saved</span>
            <span className="text-xs text-muted-foreground">
              {getTimeAgo(lastSaved)}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
};