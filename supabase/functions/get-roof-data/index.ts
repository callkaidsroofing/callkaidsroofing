import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

function calculateRoofMetrics(geoJson: any): object {
  console.log('Processing roof data for address:', geoJson.address);
  // Simulated measurements based on Google Solar API structure
  return {
    totalPitchedArea: 159.79,
    predominantPitch: 22.6,
    features: {
      perimeter: [
        { id: 'line-barge', length: 17.07, type: 'Barge/Gable' },
        { id: 'line-top-eave', length: 6.40, type: 'Eave' },
        { id: 'line-corner-eave', length: 4.57, type: 'Eave' },
        { id: 'line-bottom-eave', length: 7.01, type: 'Eave' },
        { id: 'line-abutment', length: 8.23, type: 'Wall Abutment' }
      ],
      hips: [
        { id: 'line-hip-1', length: 4.57 },
        { id: 'line-hip-2', length: 4.57 },
        { id: 'line-hip-3', length: 6.10 },
        { id: 'line-hip-4', length: 5.18 },
        { id: 'line-hip-5', length: 5.18 }
      ],
      ridges: [{ id: 'line-ridge-1', length: 3.96 }],
      valleys: [{ id: 'line-valley-1', length: 6.10 }]
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    if (!address) {
      throw new Error('Address is required.');
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('Google Maps API key is not configured.');
    }

    console.log('Fetching roof data for:', address);
    
    // Mock response for now - in production this would call Google Solar API
    const mockGeoJsonData = { address, data: 'mock 3D mesh data' };
    const measurements = calculateRoofMetrics(mockGeoJsonData);

    return new Response(JSON.stringify(measurements), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in get-roof-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
