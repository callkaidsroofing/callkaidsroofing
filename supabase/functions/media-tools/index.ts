import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Transcribe voice endpoint
    if (path.includes('/transcribe') && req.method === 'POST') {
      const { audioUrl } = await req.json();
      console.log('[Media Tools] Transcribing audio:', audioUrl);

      // In production, use OpenAI Whisper or similar
      // For now, return mock transcription
      const mockTranscription = {
        text: 'Mock transcription: The roof has three broken tiles on the north side and the ridge caps need rebedding.',
        confidence: 0.92,
        duration: 15.5
      };

      return new Response(
        JSON.stringify(mockTranscription),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload file endpoint
    if (path.includes('/upload') && req.method === 'POST') {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const jobId = formData.get('jobId') as string;
      const tags = formData.get('tags') as string;

      if (!file) {
        throw new Error('No file provided');
      }

      console.log('[Media Tools] Uploading file:', file.name);

      // Upload to Supabase storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Create media asset record
      const { data: asset } = await supabase
        .from('media_assets')
        .insert({
          filename: file.name,
          file_path: uploadData.path,
          kind: file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : 'document',
          job_id: jobId || null,
          tags: tags ? tags.split(',').map(t => t.trim()) : [],
          meta: {
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
          },
          uploaded_by: user.id
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({ 
          assetId: asset.id, 
          path: uploadData.path,
          url: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/media/${uploadData.path}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze media endpoint
    if (path.includes('/analyze') && req.method === 'POST') {
      const { mediaId } = await req.json();
      console.log('[Media Tools] Analyzing media:', mediaId);

      // Fetch media
      const { data: media } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', mediaId)
        .single();

      if (!media) {
        throw new Error('Media not found');
      }

      // Extract EXIF data if image
      const analysis: any = {
        filename: media.filename,
        kind: media.kind,
        size_bytes: media.meta?.size,
        tags: media.tags || []
      };

      // Mock EXIF data
      if (media.kind === 'photo') {
        analysis.exif = {
          camera: 'iPhone 13 Pro',
          date_taken: new Date().toISOString(),
          gps: { lat: -38.2, lng: 145.4 }
        };
      }

      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Media Tools] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
