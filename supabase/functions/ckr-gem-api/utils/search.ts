import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

export interface SearchFilters {
  suburbs?: string[];
  services?: string[];
  status?: string[];
  aiScoreMin?: number;
  aiScoreMax?: number;
  dateRange?: { start: string; end: string };
  source?: string[];
  hasEmail?: boolean;
  urgency?: string[];
}

export interface SearchOptions {
  sortBy?: 'created_at' | 'ai_score' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function buildLeadSearchQuery(
  supabase: SupabaseClient,
  filters: SearchFilters,
  options: SearchOptions = {}
) {
  const {
    sortBy = 'created_at',
    sortOrder = 'desc',
    limit = 50,
    offset = 0
  } = options;

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' });

  // Apply merge status filter - only show active leads by default
  query = query.eq('merge_status', 'active');

  // Apply filters
  if (filters.suburbs && filters.suburbs.length > 0) {
    query = query.in('suburb', filters.suburbs);
  }

  if (filters.services && filters.services.length > 0) {
    query = query.in('service', filters.services);
  }

  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters.source && filters.source.length > 0) {
    query = query.in('source', filters.source);
  }

  if (filters.urgency && filters.urgency.length > 0) {
    query = query.in('urgency', filters.urgency);
  }

  if (filters.aiScoreMin !== undefined) {
    query = query.gte('ai_score', filters.aiScoreMin);
  }

  if (filters.aiScoreMax !== undefined) {
    query = query.lte('ai_score', filters.aiScoreMax);
  }

  if (filters.hasEmail !== undefined) {
    if (filters.hasEmail) {
      query = query.not('email', 'is', null);
    } else {
      query = query.is('email', null);
    }
  }

  if (filters.dateRange) {
    if (filters.dateRange.start) {
      query = query.gte('created_at', filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      query = query.lte('created_at', filters.dateRange.end);
    }
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  return query;
}
