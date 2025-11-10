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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const tables = body.tables || [
      'content_services',
      'content_case_studies', 
      'content_blog_posts',
      'content_pages',
      'master_knowledge'
    ];

    let totalProcessed = 0;
    const results = [];

    console.log(`RAG Indexer: Processing ${tables.length} tables`);

    // Generate embeddings using OpenAI
    const generateEmbedding = async (text: string) => {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
          dimensions: 768,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${await response.text()}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    };

    for (const table of tables) {
      console.log(`Processing table: ${table}`);
      
      // Fetch data from the RAG view
      const { data: records, error: fetchError } = await supabase
        .from(`${table}_view_for_rag`)
        .select('id, source_id, title, content, metadata');

      if (fetchError) {
        console.error(`Error fetching from ${table}_view_for_rag:`, fetchError);
        results.push({ table, error: fetchError.message, processed: 0 });
        continue;
      }

      console.log(`Found ${records?.length || 0} records in ${table}`);

      let processed = 0;
      for (const record of records || []) {
        try {
          // Upsert document into ai.documents
          const { data: docId, error: upsertError } = await supabase.rpc('ai.upsert_document', {
            p_source_table: table,
            p_source_id: String(record.source_id || record.id),
            p_title: record.title || '',
            p_content: record.content || '',
            p_metadata: record.metadata || {}
          });

          if (upsertError) {
            console.error(`Upsert error for ${record.id}:`, upsertError);
            continue;
          }

          // Generate embedding
          const embedding = await generateEmbedding(record.content || record.title || '');

          // Update with embedding
          const { error: updateError } = await supabase
            .from('ai.documents')
            .update({ embedding })
            .eq('source_table', table)
            .eq('source_id', record.source_id || record.id);

          if (updateError) {
            console.error(`Embedding update error for ${record.id}:`, updateError);
            continue;
          }

          processed++;
          totalProcessed++;

          // Rate limiting: small delay between requests
          if (processed % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error(`Error processing record ${record.id}:`, err);
        }
      }

      results.push({ table, processed, total: records?.length || 0 });
    }

    console.log(`RAG Indexer complete: ${totalProcessed} documents processed`);

    return new Response(
      JSON.stringify({
        success: true,
        totalProcessed,
        results,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('RAG indexer error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to index content for RAG'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
