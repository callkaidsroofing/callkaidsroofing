import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { corsHeaders } from '../_shared/cors.ts';

interface RoofSegment {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: {
    areaMeters2: number;
    sunshineQuantiles: number[];
    groundAreaMeters2: number;
  };
}

interface SolarApiResponse {
  name: string;
  center: { latitude: number; longitude: number };
  imageryDate: { year: number; month: number; day: number };
  imageryQuality: string;
  solarPotential: {
    maxArrayPanelsCount: number;
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    panelLifetimeYears: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    wholeRoofStats: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
    roofSegmentStats: RoofSegment[];
    solarPanels: any[];
    solarPanelConfigs: any[];
  };
}

async function geocodeAddress(address: string, apiKey: string) {
  console.log('Geocoding address:', address);
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  const response = await fetch(geocodeUrl);
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Geocoding failed: ${data.status}. Could not find address.`);
  }
  
  const { lat, lng } = data.results[0].geometry.location;
  console.log('Geocoded to:', { lat, lng });
  return { latitude: lat, longitude: lng };
}

async function getSolarData(latitude: number, longitude: number, apiKey: string): Promise<SolarApiResponse> {
  console.log('Fetching Solar API data for:', { latitude, longitude });
  const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=HIGH&key=${apiKey}`;
  
  const response = await fetch(solarUrl);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Solar API error:', response.status, errorText);
    throw new Error(`Solar API failed: ${response.status}. ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Solar API response received with', data.solarPotential?.roofSegmentStats?.length || 0, 'roof segments');
  return data;
}

function calculateRoofMetrics(solarData: SolarApiResponse, address: string, latitude: number, longitude: number) {
  const { solarPotential, imageryDate, imageryQuality } = solarData;
  const segments = solarPotential.roofSegmentStats || [];
  
  // Calculate total area and average pitch
  const totalArea = segments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0);
  const avgPitch = segments.length > 0 
    ? segments.reduce((sum, seg) => sum + seg.pitchDegrees, 0) / segments.length 
    : 0;
  
  // Estimate roof features based on segments
  const totalRidgeLength = Math.sqrt(totalArea) * 0.8;
  const totalHipLength = Math.sqrt(totalArea) * 1.5;
  const totalValleyLength = segments.length > 2 ? Math.sqrt(totalArea) * 0.4 : 0;
  const perimeterLength = Math.sqrt(totalArea) * 4;
  
  return {
    address,
    latitude,
    longitude,
    totalPitchedArea: parseFloat(totalArea.toFixed(2)),
    predominantPitch: parseFloat(avgPitch.toFixed(1)),
    roofSegments: segments.map((seg, idx) => ({
      id: `segment-${idx + 1}`,
      area: parseFloat(seg.stats.areaMeters2.toFixed(2)),
      pitch: parseFloat(seg.pitchDegrees.toFixed(1)),
      azimuth: parseFloat(seg.azimuthDegrees.toFixed(1)),
    })),
    features: {
      perimeter: [
        { id: 'eave-total', length: parseFloat((perimeterLength * 0.6).toFixed(2)), type: 'Eave' },
        { id: 'gable-total', length: parseFloat((perimeterLength * 0.3).toFixed(2)), type: 'Barge/Gable' },
        { id: 'abutment-total', length: parseFloat((perimeterLength * 0.1).toFixed(2)), type: 'Wall Abutment' }
      ],
      hips: Array.from({ length: Math.max(2, segments.length) }, (_, i) => ({
        id: `hip-${i + 1}`,
        length: parseFloat((totalHipLength / Math.max(2, segments.length)).toFixed(2))
      })),
      ridges: [{ 
        id: 'ridge-main', 
        length: parseFloat(totalRidgeLength.toFixed(2))
      }],
      valleys: totalValleyLength > 0 ? [{
        id: 'valley-main',
        length: parseFloat(totalValleyLength.toFixed(2))
      }] : []
    },
    imageryDate: imageryDate ? `${imageryDate.year}-${String(imageryDate.month).padStart(2, '0')}-${String(imageryDate.day).padStart(2, '0')}` : null,
    imageryQuality,
    solarPanelCapacityWatts: solarPotential.panelCapacityWatts || null,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { address, saveToDatabase } = await req.json();
    if (!address) {
      throw new Error('Address is required.');
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('Google Maps API key is not configured.');
    }

    console.log('Processing roof measurement for:', address);
    
    // Step 1: Geocode the address
    const { latitude, longitude } = await geocodeAddress(address, GOOGLE_API_KEY);
    
    // Step 2: Get Solar API data
    const solarData = await getSolarData(latitude, longitude, GOOGLE_API_KEY);
    
    // Step 3: Calculate metrics
    const measurements = calculateRoofMetrics(solarData, address, latitude, longitude);

    // Step 4: Optionally save to database
    if (saveToDatabase) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const authHeader = req.headers.get('authorization');
      let userId = null;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      }

      const { data: savedMeasurement, error: dbError } = await supabase
        .from('roof_measurements')
        .insert({
          address: measurements.address,
          latitude: measurements.latitude,
          longitude: measurements.longitude,
          total_area_m2: measurements.totalPitchedArea,
          predominant_pitch: measurements.predominantPitch,
          roof_segments: measurements.roofSegments,
          perimeter_features: measurements.features.perimeter,
          hips: measurements.features.hips,
          ridges: measurements.features.ridges,
          valleys: measurements.features.valleys,
          imagery_date: measurements.imageryDate,
          imagery_quality: measurements.imageryQuality,
          solar_panel_capacity_watts: measurements.solarPanelCapacityWatts,
          created_by: userId,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database save error:', dbError);
      } else {
        console.log('Measurement saved to database:', savedMeasurement.id);
        measurements.savedId = savedMeasurement.id;
      }
    }

    return new Response(JSON.stringify(measurements), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in get-roof-data:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Ensure Google Solar API and Geocoding API are enabled in your Google Cloud Console and billing is active.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
