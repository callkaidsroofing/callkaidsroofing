import { supabase } from '@/integrations/supabase/client';
import type { LeadFilterState } from '@/components/LeadFilters';

export interface PipelineStage {
  id: string;
  title: string;
  badgeClass: string;
  description?: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new', title: 'New', badgeClass: 'bg-blue-500/10 text-blue-500' },
  {
    id: 'contacted',
    title: 'Contacted',
    badgeClass: 'bg-purple-500/10 text-purple-500',
    description: 'Initial outreach made',
  },
  {
    id: 'qualified',
    title: 'Qualified',
    badgeClass: 'bg-green-500/10 text-green-500',
    description: 'Fit confirmed, awaiting quote',
  },
  {
    id: 'quoted',
    title: 'Quoted',
    badgeClass: 'bg-yellow-500/10 text-yellow-500',
    description: 'Quote delivered to client',
  },
  {
    id: 'won',
    title: 'Won',
    badgeClass: 'bg-emerald-500/10 text-emerald-500',
  },
  { id: 'lost', title: 'Lost', badgeClass: 'bg-red-500/10 text-red-500' },
];

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

export async function noteLeadQuoteLink(
  leadId: string,
  details: { inspectionId?: string | null; quoteId?: string | null }
) {
  const timestamp = new Date().toISOString();
  const summary = [
    details.inspectionId ? `inspection ${details.inspectionId}` : null,
    details.quoteId ? `quote ${details.quoteId}` : null,
  ]
    .filter(Boolean)
    .join(' / ');

  await supabase.from('lead_notes').insert({
    lead_id: leadId,
    note_type: 'pipeline_link',
    content: `Linked to ${summary}`,
    created_at: timestamp,
  });
}

export function buildQuoteBuilderPath(leadId: string) {
  return `/admin/tools/inspection-quote?leadId=${leadId}`;
}
