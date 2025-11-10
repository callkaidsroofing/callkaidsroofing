import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncEngineRequest {
  action: 'start' | 'stop' | 'status' | 'sync_now';
  ruleId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, ruleId }: SyncEngineRequest = await req.json();

    // GET STATUS
    if (action === 'status') {
      const { data: rules, error } = await supabase
        .from('sync_rules')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        rules,
        engineStatus: 'running'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // SYNC NOW - Execute sync for a specific rule
    if (action === 'sync_now' && ruleId) {
      const { data: rule, error: ruleError } = await supabase
        .from('sync_rules')
        .select('*')
        .eq('id', ruleId)
        .single();

      if (ruleError) throw ruleError;

      // Get all active files in the source category
      const { data: files, error: filesError } = await supabase
        .from('knowledge_files')
        .select('*')
        .eq('category', rule.source_category)
        .eq('active', true);

      if (filesError) throw filesError;

      let syncedCount = 0;
      let errorCount = 0;

      // Sync each file based on rule strategy
      for (const file of files) {
        try {
          if (rule.sync_strategy === 'mirror') {
            // Create/update file in target category
            const { error: upsertError } = await supabase
              .from('knowledge_files')
              .upsert({
                file_key: `${rule.target_category}_${file.file_key}`,
                title: file.title,
                content: file.content,
                category: rule.target_category,
                metadata: {
                  ...file.metadata,
                  synced_from: file.id,
                  synced_at: new Date().toISOString()
                }
              });

            if (upsertError) throw upsertError;
          } else if (rule.sync_strategy === 'merge') {
            // Check if target exists and merge
            const { data: targetFile } = await supabase
              .from('knowledge_files')
              .select('*')
              .eq('category', rule.target_category)
              .eq('file_key', file.file_key)
              .single();

            if (targetFile) {
              // Detect conflict and create resolution if needed
              const { data: conflict } = await supabase.functions.invoke('conflict-detector', {
                body: {
                  fileId: targetFile.id,
                  proposedContent: file.content
                }
              });

              if (conflict?.hasConflict) {
                console.log(`Conflict detected for ${file.file_key}, skipping merge`);
                errorCount++;
                continue;
              }
            }

            // Merge content
            const mergedContent = targetFile 
              ? `${targetFile.content}\n\n--- Synced from ${rule.source_category} ---\n\n${file.content}`
              : file.content;

            const { error: upsertError } = await supabase
              .from('knowledge_files')
              .upsert({
                file_key: file.file_key,
                title: file.title,
                content: mergedContent,
                category: rule.target_category,
                metadata: {
                  ...file.metadata,
                  synced_from: file.id,
                  synced_at: new Date().toISOString()
                }
              });

            if (upsertError) throw upsertError;
          }

          syncedCount++;
        } catch (error) {
          console.error(`Error syncing file ${file.id}:`, error);
          errorCount++;
        }
      }

      // Update rule last_sync
      await supabase
        .from('sync_rules')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', ruleId);

      return new Response(JSON.stringify({ 
        success: true, 
        syncedCount,
        errorCount,
        message: `Synced ${syncedCount} files with ${errorCount} errors`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // START/STOP RULE
    if ((action === 'start' || action === 'stop') && ruleId) {
      const { error: updateError } = await supabase
        .from('sync_rules')
        .update({ active: action === 'start' })
        .eq('id', ruleId);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Rule ${action === 'start' ? 'started' : 'stopped'} successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Sync engine error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
