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

    const { filePath, fileName } = await req.json();
    
    if (!filePath) {
      throw new Error('No file path provided');
    }

    console.log(`[Knowledge Upload] Processing file: ${filePath}`);

    // Create processing job record
    const { data: jobData, error: jobError } = await supabase
      .from('embedding_jobs')
      .insert({
        job_type: 'knowledge_system_upload',
        source_path: filePath,
        total_chunks: 0,
        processed_chunks: 0,
        failed_chunks: 0,
        status: 'pending',
        error_log: {
          file_name: fileName,
          file_path: filePath,
          uploaded_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (jobError) throw jobError;

    console.log(`[Knowledge Upload] Job created: ${jobData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Knowledge system uploaded successfully',
        job_id: jobData.id,
        file_path: filePath,
        file_name: fileName
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Knowledge upload error:', error);
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
