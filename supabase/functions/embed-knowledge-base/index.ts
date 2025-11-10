import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmbedRequest {
  docId: string;
  title: string;
  category: string;
  content: string;
  metadata?: Record<string, any>;
}

interface BatchEmbedRequest {
  documents: EmbedRequest[];
  batchSize?: number;
}

// Chunk text into smaller pieces for embedding
function chunkText(text: string, maxChars: number = 1200, overlap: number = 150): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChars;
    
    // If not at the end, try to break at a sentence or paragraph
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      
      if (breakPoint > start + maxChars / 2) {
        end = breakPoint + 1;
      }
    }
    
    chunks.push(text.substring(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter out tiny chunks
}

// Generate embedding using Lovable AI Gateway
async function generateEmbedding(text: string, lovableApiKey: string): Promise<number[]> {
  const response = await fetch('https://lovable.app/api/ai-gateway', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-004',
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error: ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
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
    
    const { documents, batchSize = 10 }: BatchEmbedRequest = await req.json();

    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Documents array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${documents.length} documents`);

    const results = {
      successful: 0,
      failed: 0,
      totalChunks: 0,
      errors: [] as any[],
    };

    // Process documents in batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      for (const doc of batch) {
        try {
          console.log(`Processing: ${doc.docId} - ${doc.title}`);

          // Extract section from content (look for markdown headers)
          const chunks = chunkText(doc.content);
          console.log(`  Split into ${chunks.length} chunks`);

          // Process each chunk
          for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex];
            
            // Extract section header if present
            const sectionMatch = chunk.match(/^#{1,3}\s+(.+)$/m);
            const section = sectionMatch ? sectionMatch[1] : null;

            // Generate embedding
            const embedding = await generateEmbedding(chunk, lovableApiKey);

            // Insert into database
            const { error: insertError } = await supabase
              .from('knowledge_chunks')
              .insert({
                doc_id: doc.docId,
                title: doc.title,
                category: doc.category,
                section,
                chunk_index: chunkIndex,
                content: chunk,
                embedding,
                metadata: {
                  ...doc.metadata,
                  chunk_length: chunk.length,
                  total_chunks: chunks.length,
                },
              });

            if (insertError) {
              console.error(`  Chunk ${chunkIndex} error:`, insertError);
              throw insertError;
            }

            results.totalChunks++;
          }

          results.successful++;
          console.log(`  ✓ Completed: ${chunks.length} chunks embedded`);

        } catch (error) {
          console.error(`  ✗ Failed: ${doc.docId}`, error);
          results.failed++;
          results.errors.push({
            docId: doc.docId,
            error: error.message,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Processed ${results.successful}/${documents.length} documents, ${results.totalChunks} total chunks`,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Embedding error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process embeddings'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
