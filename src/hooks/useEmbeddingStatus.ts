import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type EmbeddingJob = Database['public']['Tables']['embedding_jobs']['Row'];

export function useEmbeddingStatus(autoRefresh: boolean = false, refreshInterval: number = 5000) {
  const [jobs, setJobs] = useState<EmbeddingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('embedding_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      setJobs(data || []);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch embedding jobs');
      console.error('Fetch embedding jobs error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    if (autoRefresh) {
      const interval = setInterval(fetchJobs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Real-time subscription for job updates
  useEffect(() => {
    const channel = supabase
      .channel('embedding_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'embedding_jobs',
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActiveJobs = () => jobs.filter((job) => job.status === 'processing' || job.status === 'pending');
  const getCompletedJobs = () => jobs.filter((job) => job.status === 'completed');
  const getFailedJobs = () => jobs.filter((job) => job.status === 'failed');

  const getJobProgress = (job: EmbeddingJob) => {
    if (job.total_chunks === 0) return 0;
    return Math.round((job.processed_chunks / job.total_chunks) * 100);
  };

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    getActiveJobs,
    getCompletedJobs,
    getFailedJobs,
    getJobProgress,
  };
}
