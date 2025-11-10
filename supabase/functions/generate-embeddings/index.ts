import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateEmbeddingsRequest {
  docIds?: string[];
  batchSize?: number;
}

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
    
    const { docIds, batchSize = 10 }: GenerateEmbeddingsRequest = await req.json();

    console.log('Starting embedding generation...');

    // Fetch documents without embeddings
    let query = supabase
      .from('master_knowledge')
      .select('doc_id, title, category, content')
      .is('embedding', null)
      .eq('active', true);

    if (docIds && docIds.length > 0) {
      query = query.in('doc_id', docIds);
    }

    const { data: documents, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching documents:', fetchError);
      throw fetchError;
    }

    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No documents need embeddings',
          processed: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${documents.length} documents to process`);

    const results = {
      total: documents.length,
      processed: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process in batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} documents)`);

      await Promise.all(
        batch.map(async (doc) => {
          try {
            // Generate embedding
            const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: `${doc.title}\n\n${doc.content}`,
                dimensions: 768,
              }),
            });

            if (!embeddingResponse.ok) {
              const errorText = await embeddingResponse.text();
              throw new Error(`OpenAI API error: ${errorText}`);
            }

            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.data[0].embedding;

            // Update document with embedding
            const { error: updateError } = await supabase
              .from('master_knowledge')
              .update({ 
                embedding,
                updated_at: new Date().toISOString()
              })
              .eq('doc_id', doc.doc_id);

            if (updateError) {
              throw updateError;
            }

            results.processed++;
            console.log(`✓ Generated embedding for ${doc.doc_id} (${doc.title})`);
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              doc_id: doc.doc_id,
              title: doc.title,
              error: error.message,
            });
            console.error(`✗ Failed to generate embedding for ${doc.doc_id}:`, error);
          }
        })
      );

      // Small delay between batches to respect rate limits
      if (i + batchSize < documents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Embedding generation complete: ${results.processed} processed, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Generate embeddings error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate embeddings'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
