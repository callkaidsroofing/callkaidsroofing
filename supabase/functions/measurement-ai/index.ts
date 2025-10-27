import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MeasurementRequest {
  address: string;
  lat?: number;
  lng?: number;
}

interface VisionAnalysisRequest {
  mediaId: string;
  analysisType?: 'defects' | 'materials' | 'general';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Roof measurement endpoint
    if (path.includes('/measure/roof')) {
      const body: MeasurementRequest = await req.json();
      console.log('[Measurement AI] Measuring roof for:', body.address);

      // Use Mapbox or Google Maps API for satellite imagery and measurement
      const mapboxToken = Deno.env.get('MAPBOX_API_KEY');
      
      if (!mapboxToken) {
        throw new Error('Mapbox API key not configured');
      }

      // Geocode address if coordinates not provided
      let { lat, lng } = body;
      if (!lat || !lng) {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(body.address)}.json?access_token=${mapboxToken}`;
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();
        
        if (geocodeData.features?.length > 0) {
          [lng, lat] = geocodeData.features[0].center;
        } else {
          throw new Error('Address not found');
        }
      }

      // For now, return mock measurements
      // In production, integrate with actual satellite imagery analysis
      const mockMeasurement = {
        area_m2: 150 + Math.random() * 50,
        pitch_deg: 20 + Math.random() * 15,
        edges: [
          { length: 12.5, angle: 0 },
          { length: 15.2, angle: 90 },
          { length: 12.5, angle: 180 },
          { length: 15.2, angle: 270 }
        ],
        satellite_imagery_url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},18,0/600x400?access_token=${mapboxToken}`,
        confidence: 0.85
      };

      return new Response(
        JSON.stringify(mockMeasurement),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vision analysis endpoint
    if (path.includes('/vision/analyze')) {
      const body: VisionAnalysisRequest = await req.json();
      console.log('[Measurement AI] Analyzing image:', body.mediaId);

      // Fetch media from storage
      const { data: media } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', body.mediaId)
        .single();

      if (!media) {
        throw new Error('Media not found');
      }

      // In production, use OpenAI Vision API or similar
      // For now, return mock analysis
      const mockAnalysis = {
        labels: ['roof', 'tiles', 'ridge caps', 'valley'],
        defects: [
          { type: 'cracked_tile', confidence: 0.92, location: { x: 150, y: 200 } },
          { type: 'loose_pointing', confidence: 0.78, location: { x: 300, y: 150 } }
        ],
        materials: ['concrete_tiles', 'mortar'],
        condition_score: 65,
        recommended_actions: [
          'Replace cracked tiles',
          'Repoint ridge caps',
          'Clean gutters'
        ]
      };

      // Store analysis result
      await supabase.from('image_analyses').insert({
        image_url: media.file_path,
        analysis_type: body.analysisType || 'defects',
        analysis_result: mockAnalysis,
        confidence_score: 0.85
      });

      return new Response(
        JSON.stringify(mockAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Measurement AI] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
