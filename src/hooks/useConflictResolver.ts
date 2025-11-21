import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConflictResolution {
  id: string;
  file_id: string;
  conflict_type: string;
  original_content: string;
  proposed_content: string;
  merged_content: string | null;
  ai_recommendation: any;
  ai_conversation: any[];
  resolution_strategy: string | null;
  status: string;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export function useConflictResolver() {
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [currentConflict, setCurrentConflict] = useState<ConflictResolution | null>(null);
  const { toast } = useToast();

  const detectConflict = async (fileId: string, proposedContent: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('conflict-detector', {
        body: { fileId, proposedContent }
      });

      if (error) throw error;
      
      if (data.hasConflict) {
        setCurrentConflict(data.conflict);
        toast({
          title: 'Conflict detected',
          description: 'AI has detected conflicts that need resolution',
          variant: 'default'
        });
      }

      return data;
    } catch (error: any) {
      toast({
        title: 'Error detecting conflicts',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const chatWithResolver = async (
    conflictId: string,
    messages: Array<{ role: string; content: string }>
  ) => {
    try {
      const response = await supabase.functions.invoke('conflict-resolver-chat', {
        body: { conflictId, messages, action: 'chat' }
      });

      return response;
    } catch (error: any) {
      toast({
        title: 'Error in chat',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  const resolveConflict = async (
    conflictId: string,
    strategy: 'keep_original' | 'accept_proposed' | 'merge',
    mergedContent?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('conflict-resolver-chat', {
        body: {
          conflictId,
          messages: [],
          action: 'resolve',
          resolutionStrategy: strategy,
          mergedContent
        }
      });

      if (error) throw error;
      
      toast({
        title: 'Conflict resolved',
        description: 'Changes have been applied and file re-embedded'
      });

      setCurrentConflict(null);
      return true;
    } catch (error: any) {
      toast({
        title: 'Error resolving conflict',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const listPendingConflicts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conflict_resolutions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const conflicts = (data || []).map(c => ({
        ...c,
        ai_conversation: c.ai_conversation as any[],
        ai_recommendation: c.ai_recommendation as any
      })) as ConflictResolution[];
      setConflicts(conflicts);
      return conflicts;
    } catch (error: any) {
      toast({
        title: 'Error loading conflicts',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    conflicts,
    currentConflict,
    detectConflict,
    chatWithResolver,
    resolveConflict,
    listPendingConflicts,
    setCurrentConflict
  };
}
