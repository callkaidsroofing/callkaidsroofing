import { supabase } from '@/integrations/supabase/client';
import type { LeadFilterState } from '@/components/LeadFilters';

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  suburb: string;
  service: string;
  status: string;
  message: string | null;
  source: string;
  urgency: string | null;
  ai_score: number | null;
  created_at: string;
  updated_at: string;
}

export async function fetchPipelineLeads(filters: LeadFilterState) {
  let query = supabase
    .from('leads')
    .select('*')
    .eq('merge_status', 'active')
    .order('created_at', { ascending: false });

  if (filters.status && filters.status !== '' && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.service && filters.service !== '' && filters.service !== 'all') {
    query = query.eq('service', filters.service);
  }
  if (filters.source && filters.source !== '' && filters.source !== 'all') {
    query = query.eq('source', filters.source);
  }
  if (filters.suburb && filters.suburb !== '') {
    query = query.ilike('suburb', `%${filters.suburb}%`);
  }
  if (filters.dateFrom && filters.dateFrom !== '') {
    query = query.gte('created_at', filters.dateFrom);
  }
  if (filters.dateTo && filters.dateTo !== '') {
    query = query.lte('created_at', filters.dateTo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as LeadRecord[];
}

export async function updateLeadStage(leadId: string, newStage: string) {
  const timestamp = new Date().toISOString();
  const { error } = await supabase
    .from('leads')
    .update({ status: newStage, updated_at: timestamp })
    .eq('id', leadId);

  if (error) throw error;

  await supabase.from('lead_notes').insert({
    lead_id: leadId,
    note_type: 'status_change',
    content: `Status changed to ${newStage}`,
    created_at: timestamp,
  });
}

export function buildQuoteBuilderPath(leadId: string) {
  return `/admin/tools/inspection-quote?leadId=${leadId}`;
}
