import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

export interface ExportFilters {
  status?: string[];
  dateRange?: { start: string; end: string };
  suburb?: string[];
  service?: string[];
}

export async function exportLeadsToCSV(
  supabase: SupabaseClient,
  filters: ExportFilters,
  includeFields?: string[],
  sortBy: string = 'created_at'
) {
  // Build query
  let query = supabase.from('leads').select('*');

  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters.suburb && filters.suburb.length > 0) {
    query = query.in('suburb', filters.suburb);
  }

  if (filters.service && filters.service.length > 0) {
    query = query.in('service', filters.service);
  }

  if (filters.dateRange) {
    if (filters.dateRange.start) {
      query = query.gte('created_at', filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      query = query.lte('created_at', filters.dateRange.end);
    }
  }

  query = query.order(sortBy, { ascending: false }).limit(1000);

  const { data: leads, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  if (!leads || leads.length === 0) {
    throw new Error('No leads found matching filters');
  }

  // Define default fields if not specified
  const fields = includeFields && includeFields.length > 0 ? includeFields : [
    'name', 'phone', 'email', 'suburb', 'service', 'status', 
    'ai_score', 'source', 'urgency', 'created_at', 'message'
  ];

  // Generate CSV content
  const headers = fields.join(',');
  const rows = leads.map(lead => {
    return fields.map(field => {
      let value = lead[field];
      
      // Format dates
      if (field.includes('_at') && value) {
        value = new Date(value).toLocaleString();
      }
      
      // Escape commas and quotes
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      
      return value ?? '';
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');

  // Upload to Supabase Storage
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `leads_export_${timestamp}_${Date.now()}.csv`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(`exports/${filename}`, csvContent, {
      contentType: 'text/csv',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload CSV: ${uploadError.message}`);
  }

  // Generate public URL with expiration
  const { data: urlData } = await supabase.storage
    .from('media')
    .createSignedUrl(`exports/${filename}`, 3600); // 1 hour expiration

  if (!urlData) {
    throw new Error('Failed to generate download URL');
  }

  return {
    export_url: urlData.signedUrl,
    total_leads: leads.length,
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    file_size: `${Math.ceil(csvContent.length / 1024)} KB`,
    filename
  };
}
