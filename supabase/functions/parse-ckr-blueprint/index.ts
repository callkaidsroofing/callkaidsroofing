import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { filePath } = await req.json();
    
    if (!filePath) {
      throw new Error('No file path provided');
    }

    console.log(`[Blueprint Parser] Processing file: ${filePath}`);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('knowledge-uploads')
      .download(filePath);

    if (downloadError) throw downloadError;

    console.log(`[Blueprint Parser] File downloaded, size: ${fileData.size} bytes`);

    // For now, create a processing job - actual parsing will be implemented in next iteration
    const { data: jobData, error: jobError } = await supabase
      .from('embedding_jobs')
      .insert({
        job_type: 'blueprint_parse',
        source_path: filePath,
        total_chunks: 0,
        processed_chunks: 0,
        failed_chunks: 0,
        status: 'pending',
        error_log: {
          file_path: filePath,
          file_size: fileData.size,
          initiated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (jobError) throw jobError;

    console.log(`[Blueprint Parser] Job created: ${jobData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blueprint queued for processing',
        job_id: jobData.id,
        summary: {
          kf_files: 0,
          workflows: 0,
          processed_chunks: 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('[Blueprint Parser] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
