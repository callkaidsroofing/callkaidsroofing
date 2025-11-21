import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KnowledgeDocument {
  docId: string;
  title: string;
  category: string;
  content: string;
  metadata: Record<string, any>;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function chunkContent(content: string, chunkSize = 1200, overlap = 150): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + chunkSize, content.length);
    const chunk = content.slice(startIndex, endIndex);
    chunks.push(chunk.trim());
    startIndex += chunkSize - overlap;
  }

  return chunks;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { documents, jobId } = await req.json();

    if (!documents || !Array.isArray(documents)) {
      throw new Error('Invalid documents array');
    }

    console.log(`Processing ${documents.length} documents for job ${jobId}`);

    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    // Update job status
    if (jobId) {
      await supabase
        .from('embedding_jobs')
        .update({ 
          status: 'processing',
          total_chunks: documents.length 
        })
        .eq('id', jobId);
    }

    // Process each document
    for (const doc of documents as KnowledgeDocument[]) {
      try {
        // Chunk the content
        const chunks = chunkContent(doc.content);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          
          // Generate embedding
          const embedding = await generateEmbedding(chunk);

          // Insert into master_knowledge
          const { error: insertError } = await supabase
            .from('master_knowledge')
            .insert({
              doc_id: `${doc.docId}_chunk_${i}`,
              title: doc.title,
              category: doc.category,
              content: chunk,
              embedding,
              metadata: {
                ...doc.metadata,
                chunk_index: i,
                total_chunks: chunks.length,
                source_doc: doc.docId
              },
              active: true
            });

          if (insertError) {
            console.error(`Error inserting chunk ${i} for ${doc.docId}:`, insertError);
            errorCount++;
            errors.push({
              docId: doc.docId,
              chunk: i,
              error: insertError.message
            });
          } else {
            successCount++;
          }

          // Update progress
          if (jobId) {
            await supabase
              .from('embedding_jobs')
              .update({ processed_chunks: successCount + errorCount })
              .eq('id', jobId);
          }

          // Rate limiting - wait between API calls
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error: any) {
        console.error(`Error processing document ${doc.docId}:`, error);
        errorCount++;
        errors.push({
          docId: doc.docId,
          error: error.message
        });
      }
    }

    // Finalize job
    if (jobId) {
      await supabase
        .from('embedding_jobs')
        .update({ 
          status: errorCount === 0 ? 'completed' : 'failed',
          metadata: { errors }
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          successful: successCount,
          failed: errorCount,
          totalChunks: successCount + errorCount,
          errors
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Embedding error:', error);
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
