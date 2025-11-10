import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RagSearchRequest {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
  filterCategory?: string;
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
        JSON.stringify({ error: 'OPENAI_API_KEY not configured. Please add it in Supabase Edge Functions secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { query, matchThreshold = 0.7, matchCount = 5, filterCategory }: RagSearchRequest = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating embedding for query:', query);

    // Generate embedding using OpenAI API
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
        dimensions: 768, // Match pgvector column size
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Embedding API error:', errorText);
      throw new Error(`Failed to generate embedding: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log('Searching knowledge chunks with similarity threshold:', matchThreshold);

    // Search unified master_knowledge using vector similarity
    const { data: results, error: searchError } = await supabase.rpc(
      'search_master_knowledge',
      {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        filter_category: filterCategory || null,
      }
    );

    if (searchError) {
      console.error('Search error:', searchError);
      throw searchError;
    }

    console.log(`Found ${results?.length || 0} matching documents from master_knowledge`);

    // Format context for LLM consumption
    const context = results?.map((doc: any) => ({
      docId: doc.doc_id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      similarity: doc.similarity,
      metadata: doc.metadata
    })) || [];

    // Build context string
    const contextString = context
      .map((c: any) => `[${c.category}] ${c.docId}: ${c.title}\n${c.content}`)
      .join('\n\n--- Document Separator ---\n\n');

    return new Response(
      JSON.stringify({
        success: true,
        query,
        chunks: context,
        context: contextString,
        metadata: {
          totalMatches: results?.length || 0,
          threshold: matchThreshold,
          category: filterCategory,
        },
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('RAG search error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to perform RAG search'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
