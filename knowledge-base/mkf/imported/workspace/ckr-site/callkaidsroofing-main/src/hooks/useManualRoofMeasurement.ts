import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ManualMeasurementData {
  address: string;
  total_area_m2: number;
  predominant_pitch: number;
  measurement_source: string;
  ridges: Array<{ id: string; length: number }>;
  hips: Array<{ id: string; length: number }>;
  valleys: Array<{ id: string; length: number }>;
  reference_photos?: string[];
  notes?: string;
}

export function useManualRoofMeasurement() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveMeasurement = async (data: ManualMeasurementData) => {
    setIsSaving(true);
    try {
      // Get current user's location (latitude/longitude) - required fields
      // For manual entry, we'll use a geocoding service or default values
      const geocoder = new google.maps.Geocoder();
      
      let latitude = 0;
      let longitude = 0;

      try {
        const geocodeResult = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address: data.address }, (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error('Geocoding failed'));
            }
          });
        });

        if (geocodeResult[0]) {
          latitude = geocodeResult[0].geometry.location.lat();
          longitude = geocodeResult[0].geometry.location.lng();
        }
      } catch (error) {
        console.warn('Geocoding failed, using default coordinates', error);
      }

      const { data: savedData, error } = await supabase
        .from('roof_measurements')
        .insert([
          {
            address: data.address,
            latitude,
            longitude,
            total_area_m2: data.total_area_m2,
            predominant_pitch: data.predominant_pitch,
            ridges: data.ridges,
            hips: data.hips,
            valleys: data.valleys,
            roof_segments: [],
            perimeter_features: [],
            imagery_quality: 'MANUAL_ENTRY',
            imagery_date: new Date().toISOString().split('T')[0],
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Measurement Saved',
        description: 'Manual roof measurement has been saved successfully',
      });

      return savedData;
    } catch (error: any) {
      console.error('Error saving manual measurement:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save measurement',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveMeasurement,
    isSaving,
  };
}
