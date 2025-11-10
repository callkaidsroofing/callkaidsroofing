import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  category: string;
  roles: string[];
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
    const { documents } = await req.json();

    if (!documents || !Array.isArray(documents)) {
      return new Response(
        JSON.stringify({ error: 'documents array required in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Embedding ${documents.length} knowledge documents`);

    // Chunking configuration
    const CHUNK_SIZE = 1200;
    const CHUNK_OVERLAP = 150;

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

    // Chunk text into segments
    const chunkText = (text: string): string[] => {
      const chunks: string[] = [];
      let start = 0;

      while (start < text.length) {
        const end = Math.min(start + CHUNK_SIZE, text.length);
        chunks.push(text.substring(start, end));
        start += CHUNK_SIZE - CHUNK_OVERLAP;
      }

      return chunks;
    };

    let totalChunks = 0;
    const results = [];

    for (const doc of documents as KnowledgeDoc[]) {
      console.log(`Processing: ${doc.title}`);
      
      const chunks = chunkText(doc.content);
      console.log(`Created ${chunks.length} chunks`);

      let chunkIndex = 0;
      for (const chunk of chunks) {
        try {
          // Create unique ID for this chunk
          const chunkId = `${doc.id}_chunk_${chunkIndex}`;

          // Upsert chunk
          const { data: docId, error: upsertError } = await supabase.rpc('ai.upsert_document', {
            p_source_table: 'knowledge_docs',
            p_source_id: chunkId,
            p_title: `${doc.title} (part ${chunkIndex + 1}/${chunks.length})`,
            p_content: chunk,
            p_metadata: {
              category: doc.category,
              roles: doc.roles,
              parent_doc: doc.id,
              chunk_index: chunkIndex,
              total_chunks: chunks.length
            }
          });

          if (upsertError) {
            console.error(`Upsert error for ${chunkId}:`, upsertError);
            continue;
          }

          // Generate and store embedding
          const embedding = await generateEmbedding(chunk);

          const { error: updateError } = await supabase
            .from('ai.documents')
            .update({ embedding })
            .eq('source_table', 'knowledge_docs')
            .eq('source_id', chunkId);

          if (updateError) {
            console.error(`Embedding error for ${chunkId}:`, updateError);
            continue;
          }

          totalChunks++;
          chunkIndex++;

          // Rate limiting
          if (chunkIndex % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error(`Error processing chunk ${chunkIndex} of ${doc.id}:`, err);
        }
      }

      results.push({
        document: doc.id,
        title: doc.title,
        chunks: chunks.length,
        embedded: chunkIndex
      });
    }

    console.log(`Knowledge docs embedding complete: ${totalChunks} chunks processed`);

    return new Response(
      JSON.stringify({
        success: true,
        totalChunks,
        results
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Embed knowledge docs error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to embed knowledge documents'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
