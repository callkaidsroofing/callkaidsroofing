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

    // LIST FILES
    if (action === 'list') {
      const query = supabase
        .from('knowledge_files')
        .select('*')
        .eq('active', true)
        .order('updated_at', { ascending: false });

      if (category) {
        query.eq('category', category);
      }

      const { data: files, error } = await query;

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, files }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET FILE
    if (action === 'get' && fileId) {
      const { data: file, error: fileError } = await supabase
        .from('knowledge_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      // Get version history
      const { data: versions } = await supabase
        .from('knowledge_file_versions')
        .select('*')
        .eq('file_id', fileId)
        .order('version_number', { ascending: false });

      // Get chunk count
      const { count: chunkCount } = await supabase
        .from('knowledge_chunks')
        .select('id', { count: 'exact', head: true })
        .eq('doc_id', file.file_key)
        .eq('active', true);

      return new Response(JSON.stringify({ 
        success: true, 
        file, 
        versions: versions || [], 
        chunkCount: chunkCount || 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // CREATE FILE
    if (action === 'create' && title && content && category) {
      const newFileKey = fileKey || `KF_${Date.now()}`;
      
      const { data: newFile, error: createError } = await supabase
        .from('knowledge_files')
        .insert({
          file_key: newFileKey,
          title,
          content,
          category,
          metadata: metadata || {},
          version: 1
        })
        .select()
        .single();

      if (createError) throw createError;

      // Create initial version
      await supabase
        .from('knowledge_file_versions')
        .insert({
          file_id: newFile.id,
          version_number: 1,
          content,
          change_summary: 'Initial version',
          changed_by: user.id
        });

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
        .from('knowledge_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      const newVersion = (currentFile.version || 1) + 1;

      // Update file
      const { data: updatedFile, error: updateError } = await supabase
        .from('knowledge_files')
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

      // Create version entry
      await supabase
        .from('knowledge_file_versions')
        .insert({
          file_id: fileId,
          version_number: newVersion,
          content,
          change_summary: metadata?.changeSummary || 'Updated content',
          changed_by: user.id
        });

      return new Response(JSON.stringify({ success: true, file: updatedFile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // RE-EMBED FILE
    if (action === 're-embed' && fileId) {
      const { data: file, error: fileError } = await supabase
        .from('knowledge_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      // Trigger re-embedding
      const { data: embedResult, error: embedError } = await supabase.functions.invoke('embed-knowledge-base', {
        body: {
          documents: [{
            docId: file.file_key,
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
        .from('knowledge_files')
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
