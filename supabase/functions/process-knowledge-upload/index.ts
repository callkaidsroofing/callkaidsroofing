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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing knowledge upload: ${file.name}, size: ${file.size} bytes`);

    // Upload to knowledge-uploads bucket
    const fileName = `system-uploads/${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('knowledge-uploads')
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'application/zip',
        upsert: false
      });

    if (uploadError) throw uploadError;

    console.log(`File uploaded to storage: ${fileName}`);

    // Create processing job record
    const { data: jobData, error: jobError } = await supabase
      .from('embedding_jobs')
      .insert({
        source_table: 'knowledge_system_upload',
        total_chunks: 0,
        processed_chunks: 0,
        status: 'pending',
        metadata: {
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (jobError) throw jobError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Knowledge system uploaded successfully',
        job_id: jobData.id,
        file_path: fileName,
        file_name: file.name
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
