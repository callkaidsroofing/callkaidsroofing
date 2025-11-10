import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessUploadRequest {
  uploadId: string;
  category?: string;
  docType?: string;
  priority?: number;
  autoEmbed?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { uploadId, category, docType, priority, autoEmbed = true }: ProcessUploadRequest = await req.json();

    console.log(`Processing upload: ${uploadId}`);

    // Get upload record
    const { data: upload, error: uploadError } = await supabase
      .from('knowledge_uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (uploadError || !upload) {
      throw new Error('Upload not found');
    }

    // Update status to processing
    await supabase
      .from('knowledge_uploads')
      .update({ 
        status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', uploadId);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('knowledge-uploads')
      .download(upload.file_path);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    // Read file content
    let content = await fileData.text();
    console.log(`File content length: ${content.length} chars`);

    // AI-powered content analysis for smart categorization
    let detectedCategory = category;
    let detectedDocType = docType;
    let detectedPriority = priority;

    if (!category || !docType) {
      console.log('Running AI analysis for categorization...');
      
      // Extract metadata from content structure
      const lines = content.split('\n');
      const title = lines.find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || upload.original_filename;
      const firstParagraph = lines.find(l => l.trim().length > 50)?.trim() || '';

      // Smart categorization based on content analysis
      const analysisPrompt = `Analyze this document and suggest categorization:

Title: ${title}
First paragraph: ${firstParagraph}

Suggest:
1. category: ${!category ? 'one of: system, brand, web_design, marketing, operations, compliance, service_areas, integration, case_studies, proof, workflows, support' : category}
2. doc_type: ${!docType ? 'one of: mkf, gwa, sop, faq, service, suburb, case_study, testimonial, blog, knowledge, template' : docType}
3. priority: ${!priority ? 'number 65-100 (100=critical system, 85=featured content, 75=standard, 65=supporting)' : priority}

Return ONLY valid JSON: {"category": "...", "doc_type": "...", "priority": 75}`;

      // Simple heuristic categorization if AI fails
      if (!detectedCategory) {
        if (content.includes('MKF_') || content.includes('Master Knowledge')) detectedCategory = 'system';
        else if (content.includes('GWA_') || content.includes('workflow')) detectedCategory = 'workflows';
        else if (content.includes('suburb') || content.includes('distance from base')) detectedCategory = 'service_areas';
        else if (content.includes('service') || content.includes('pricing')) detectedCategory = 'operations';
        else if (content.includes('FAQ') || content.includes('frequently asked')) detectedCategory = 'support';
        else if (content.includes('case study') || content.includes('testimonial')) detectedCategory = 'proof';
        else detectedCategory = 'marketing';
      }

      if (!detectedDocType) {
        if (content.includes('MKF_')) detectedDocType = 'mkf';
        else if (content.includes('GWA_')) detectedDocType = 'gwa';
        else if (content.includes('FAQ')) detectedDocType = 'faq';
        else if (content.includes('suburb')) detectedDocType = 'suburb';
        else if (content.includes('service')) detectedDocType = 'service';
        else detectedDocType = 'knowledge';
      }

      if (!detectedPriority) {
        if (detectedCategory === 'system') detectedPriority = 100;
        else if (detectedCategory === 'brand') detectedPriority = 90;
        else if (detectedDocType === 'service') detectedPriority = 85;
        else if (detectedCategory === 'operations' || detectedCategory === 'service_areas') detectedPriority = 80;
        else detectedPriority = 75;
      }
    }

    console.log(`Detected: category=${detectedCategory}, doc_type=${detectedDocType}, priority=${detectedPriority}`);

    // Parse content into documents (split by H1 headers or process as single doc)
    const documents: Array<{
      doc_id: string;
      title: string;
      content: string;
      subcategory?: string;
    }> = [];

    // Split by H1 headers for multi-doc files
    const h1Sections = content.split(/^# /m).filter(s => s.trim());
    
    if (h1Sections.length > 1) {
      // Multi-document file
      h1Sections.forEach((section, idx) => {
        const lines = section.split('\n');
        const title = lines[0]?.trim() || `Document ${idx + 1}`;
        const docContent = lines.slice(1).join('\n').trim();
        
        if (docContent.length > 50) {
          const docId = `${detectedDocType}_${title.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_${Date.now()}_${idx}`;
          documents.push({
            doc_id: docId,
            title,
            content: docContent,
          });
        }
      });
    } else {
      // Single document
      const lines = content.split('\n');
      const title = lines.find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || upload.original_filename.replace(/\.[^.]+$/, '');
      
      const docId = `${detectedDocType}_${title.replace(/[^a-z0-9]/gi, '_').substring(0, 40)}_${Date.now()}`;
      documents.push({
        doc_id: docId,
        title,
        content: content.trim(),
      });
    }

    console.log(`Parsed into ${documents.length} document(s)`);

    // Insert documents into master_knowledge
    const generatedDocIds: string[] = [];
    
    for (const doc of documents) {
      // Generate embedding if auto-embed enabled and OpenAI key available
      let embedding = null;
      if (autoEmbed && openaiApiKey) {
        try {
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

          if (embeddingResponse.ok) {
            const embeddingData = await embeddingResponse.json();
            embedding = embeddingData.data[0].embedding;
            console.log(`✓ Generated embedding for ${doc.doc_id}`);
          }
        } catch (error) {
          console.warn(`Failed to generate embedding for ${doc.doc_id}:`, error);
        }
      }

      // Insert into master_knowledge
      const { error: insertError } = await supabase
        .from('master_knowledge')
        .insert({
          doc_id: doc.doc_id,
          title: doc.title,
          category: detectedCategory,
          subcategory: doc.subcategory || null,
          doc_type: detectedDocType,
          content: doc.content,
          embedding,
          priority: detectedPriority,
          version: 1,
          source: 'upload',
          metadata: {
            original_filename: upload.original_filename,
            upload_id: uploadId,
            uploaded_at: new Date().toISOString(),
          },
          active: true,
        });

      if (insertError) {
        console.error(`Failed to insert ${doc.doc_id}:`, insertError);
        throw insertError;
      }

      generatedDocIds.push(doc.doc_id);
      console.log(`✓ Inserted ${doc.doc_id}`);
    }

    // Update upload record with completion
    await supabase
      .from('knowledge_uploads')
      .update({
        status: 'completed',
        processing_completed_at: new Date().toISOString(),
        detected_category: detectedCategory,
        detected_doc_type: detectedDocType,
        detected_priority: detectedPriority,
        doc_count: documents.length,
        generated_doc_ids: generatedDocIds,
      })
      .eq('id', uploadId);

    console.log(`✓ Processing complete: ${documents.length} documents created`);

    return new Response(
      JSON.stringify({
        success: true,
        uploadId,
        documentsCreated: documents.length,
        docIds: generatedDocIds,
        category: detectedCategory,
        docType: detectedDocType,
        embeddingsGenerated: autoEmbed && openaiApiKey,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Process upload error:', error);

    // Update upload record with error
    if (error.uploadId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase
        .from('knowledge_uploads')
        .update({
          status: 'failed',
          processing_completed_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', error.uploadId);
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process knowledge upload'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
