import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileManagerRequest {
  action: 'list' | 'get' | 'create' | 'update' | 'delete' | 're-embed';
  fileId?: string;
  fileKey?: string;
  category?: string;
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, fileId, fileKey, category, title, content, metadata }: FileManagerRequest = await req.json();

    // LIST FILES - Query unified master_knowledge table
    if (action === 'list') {
      let query = supabase
        .from('master_knowledge')
        .select('id, doc_id, title, content, category, subcategory, doc_type, version, supersedes, priority, active, source, created_at, updated_at, metadata, chunk_count, tags, migration_notes')
        .eq('active', true)
        .order('priority', { ascending: false })
        .order('category')
        .order('doc_id');
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data: files, error } = await query;
      
      if (error) throw error;

      // Transform to match expected format (snake_case)
      const allFiles = (files || []).map((f: any) => ({
        id: f.id,
        file_key: f.doc_id,
        title: f.title,
        content: f.content || '',
        category: f.category,
        metadata: {
          ...f.metadata,
          subcategory: f.subcategory,
          docType: f.doc_type,
          source: f.source,
          totalChunks: f.chunk_count,
          tags: f.tags
        },
        version: f.version || 1,
        active: f.active,
        created_at: f.created_at,
        updated_at: f.updated_at
      }));

      return new Response(
        JSON.stringify({ success: true, files: allFiles }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET FILE - Query unified master_knowledge table
    if (action === 'get') {
      if (!fileId) {
        return new Response(
          JSON.stringify({ error: 'fileId required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get from unified master_knowledge (by id or doc_id)
      let { data: file, error } = await supabase
        .from('master_knowledge')
        .select('*')
        .or(`id.eq.${fileId},doc_id.eq.${fileId}`)
        .single();

      if (error || !file) {
        return new Response(
          JSON.stringify({ error: 'File not found in master knowledge' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get versions if exists (legacy only)
      const { data: versions } = await supabase
        .from('knowledge_file_versions')
        .select('*')
        .eq('file_id', fileId)
        .order('version_number', { ascending: false });

      return new Response(
        JSON.stringify({ 
          success: true, 
          file: {
            id: file.id,
            file_key: file.doc_id,
            title: file.title,
            content: file.content || '',
            category: file.category,
            metadata: {
              ...file.metadata,
              subcategory: file.subcategory,
              docType: file.doc_type,
              source: file.source,
              totalChunks: file.chunk_count,
              tags: file.tags,
              supersedes: file.supersedes,
              priority: file.priority,
              migrationNotes: file.migration_notes
            },
            version: file.version || 1,
            active: file.active,
            created_at: file.created_at,
            updated_at: file.updated_at
          },
          versions: versions || [],
          chunkCount: file.chunk_count || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CREATE FILE
    if (action === 'create' && title && content && category) {
      const newFileKey = fileKey || `KF_${Date.now()}`;
      
      const { data: newFile, error: createError } = await supabase
        .from('master_knowledge')
        .insert({
          doc_id: newFileKey,
          title,
          content,
          category,
          doc_type: 'custom',
          source: 'user_created',
          metadata: metadata || {},
          version: 1
        })
        .select()
        .single();

      if (createError) throw createError;

      // Trigger embedding
      const { error: embedError } = await supabase.functions.invoke('embed-knowledge-base', {
        body: {
          documents: [{
            docId: newFileKey,
            title,
            category,
            content,
            metadata
          }],
          batchSize: 1
        }
      });

      if (embedError) {
        console.error('Embedding error:', embedError);
      }

      return new Response(JSON.stringify({ success: true, file: newFile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // UPDATE FILE
    if (action === 'update' && fileId && content) {
      // Get current file
      const { data: currentFile, error: fetchError } = await supabase
        .from('master_knowledge')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      const newVersion = (currentFile.version || 1) + 1;

      // Update file
      const { data: updatedFile, error: updateError } = await supabase
        .from('master_knowledge')
        .update({
          content,
          title: title || currentFile.title,
          category: category || currentFile.category,
          metadata: metadata || currentFile.metadata,
          version: newVersion,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true, file: updatedFile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // RE-EMBED FILE
    if (action === 're-embed' && fileId) {
      const { data: file, error: fileError } = await supabase
        .from('master_knowledge')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      // Trigger re-embedding
      const { data: embedResult, error: embedError } = await supabase.functions.invoke('embed-knowledge-base', {
        body: {
          documents: [{
            docId: file.doc_id,
            title: file.title,
            category: file.category,
            content: file.content,
            metadata: file.metadata
          }],
          batchSize: 1
        }
      });

      if (embedError) throw embedError;

      return new Response(JSON.stringify({ success: true, embedResult }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // DELETE FILE (soft delete)
    if (action === 'delete' && fileId) {
      const { error: deleteError } = await supabase
        .from('master_knowledge')
        .update({ active: false })
        .eq('id', fileId);

      if (deleteError) throw deleteError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('File manager error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
