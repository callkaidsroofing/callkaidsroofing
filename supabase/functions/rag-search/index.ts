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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { query, matchThreshold = 0.7, matchCount = 5, filterCategory }: RagSearchRequest = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating embedding for query:', query);

    // Generate embedding using Lovable AI Gateway (text-embedding-004)
    const embeddingResponse = await fetch('https://lovable.app/api/ai-gateway', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-004',
        input: query,
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

    // Search knowledge chunks using vector similarity
    const { data: chunks, error: searchError } = await supabase.rpc(
      'search_knowledge_chunks',
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

    console.log(`Found ${chunks?.length || 0} matching chunks`);

    // Format context for LLM consumption
    const context = chunks?.map((chunk: any) => ({
      title: chunk.title,
      category: chunk.category,
      section: chunk.section,
      content: chunk.content,
      similarity: chunk.similarity,
    })) || [];

    // Build context string
    const contextString = context
      .map((c: any) => `[${c.category}] ${c.title}${c.section ? ` - ${c.section}` : ''}\n${c.content}`)
      .join('\n\n---\n\n');

    return new Response(
      JSON.stringify({
        success: true,
        query,
        chunks: context,
        context: contextString,
        metadata: {
          totalMatches: chunks?.length || 0,
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
