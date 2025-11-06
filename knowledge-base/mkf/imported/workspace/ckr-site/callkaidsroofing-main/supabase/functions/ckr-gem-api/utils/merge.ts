import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

export type MergeStrategy = 'keep_primary' | 'keep_latest' | 'keep_best_data';

export async function mergeLeads(
  supabase: SupabaseClient,
  primaryLeadId: string,
  duplicateLeadIds: string[],
  strategy: MergeStrategy
) {
  // Fetch all leads
  const { data: leads, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .in('id', [primaryLeadId, ...duplicateLeadIds]);

  if (fetchError || !leads || leads.length === 0) {
    throw new Error('Failed to fetch leads for merging');
  }

  const primaryLead = leads.find(l => l.id === primaryLeadId);
  const duplicates = leads.filter(l => duplicateLeadIds.includes(l.id));

  if (!primaryLead) {
    throw new Error('Primary lead not found');
  }

  // Build merged data based on strategy
  let mergedData: any = { ...primaryLead };
  const retainedFields: Record<string, string> = {};

  switch (strategy) {
    case 'keep_primary':
      // Keep all primary data, just record what we're keeping
      retainedFields.strategy = 'All data from primary lead retained';
      break;

    case 'keep_latest':
      // Use most recent non-null values
      duplicates.forEach(dup => {
        Object.keys(dup).forEach(key => {
          if (dup[key] !== null && mergedData[key] === null) {
            mergedData[key] = dup[key];
            retainedFields[key] = `from duplicate ${dup.id}`;
          } else if (dup[key] !== null && dup.updated_at > mergedData.updated_at) {
            mergedData[key] = dup[key];
            retainedFields[key] = `from duplicate ${dup.id} (more recent)`;
          }
        });
      });
      break;

    case 'keep_best_data':
      // Use highest AI score and most complete data
      const bestLead = [primaryLead, ...duplicates].reduce((best, current) => {
        const bestScore = best.ai_score || 0;
        const currentScore = current.ai_score || 0;
        return currentScore > bestScore ? current : best;
      });

      mergedData = { ...bestLead };
      
      // Fill in any missing fields from other leads
      [primaryLead, ...duplicates].forEach(lead => {
        Object.keys(lead).forEach(key => {
          if (mergedData[key] === null && lead[key] !== null) {
            mergedData[key] = lead[key];
            retainedFields[key] = `from lead ${lead.id}`;
          }
        });
      });
      break;
  }

  // Update primary lead with merged data
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      ...mergedData,
      updated_at: new Date().toISOString(),
      merge_history: [
        ...(primaryLead.merge_history || []),
        {
          merged_at: new Date().toISOString(),
          merged_from: duplicateLeadIds,
          strategy,
          retained_fields: retainedFields
        }
      ]
    })
    .eq('id', primaryLeadId);

  if (updateError) {
    throw new Error(`Failed to update primary lead: ${updateError.message}`);
  }

  // Mark duplicates as merged
  const { error: mergeError } = await supabase
    .from('leads')
    .update({
      merge_status: 'merged',
      merged_into_lead_id: primaryLeadId,
      updated_at: new Date().toISOString()
    })
    .in('id', duplicateLeadIds);

  if (mergeError) {
    throw new Error(`Failed to mark duplicates as merged: ${mergeError.message}`);
  }

  // Transfer notes
  const { data: notes } = await supabase
    .from('lead_notes')
    .select('*')
    .in('lead_id', duplicateLeadIds);

  if (notes && notes.length > 0) {
    const transferNotes = notes.map(note => ({
      ...note,
      id: undefined,
      lead_id: primaryLeadId,
      content: `[Merged from lead] ${note.content}`
    }));

    await supabase.from('lead_notes').insert(transferNotes);
  }

  // Transfer tasks
  const { data: tasks } = await supabase
    .from('lead_tasks')
    .select('*')
    .in('lead_id', duplicateLeadIds);

  if (tasks && tasks.length > 0) {
    await supabase
      .from('lead_tasks')
      .update({ lead_id: primaryLeadId })
      .in('lead_id', duplicateLeadIds);
  }

  return {
    mergedLeadId: primaryLeadId,
    mergedFrom: duplicateLeadIds,
    retainedFields,
    notesTransferred: notes?.length || 0,
    tasksTransferred: tasks?.length || 0
  };
}
