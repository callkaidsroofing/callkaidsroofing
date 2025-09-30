import { useEffect, useState } from 'react';

interface LocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
}

interface GeographicAnomaly {
  type: 'distance' | 'country' | 'vpn' | 'tor' | 'datacenter';
  severity: 'low' | 'medium' | 'high';
  description: string;
  previousLocation?: LocationData;
  currentLocation: LocationData;
  distance?: number;
}

export const useGeographicAnomalyDetection = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setIsLoading(true);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'Location service error');
        }

        setCurrentLocation({
          ip: data.ip || 'unknown',
          city: data.city || 'unknown',
          region: data.region || 'unknown',
          country: data.country || 'unknown',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          timezone: data.timezone || 'unknown',
          isp: data.org || 'unknown',
          org: data.org || 'unknown',
          asn: data.asn || 'unknown'
        });
      } catch (err) {
        console.warn('Failed to fetch location data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback location data - always set something
        setCurrentLocation({
          ip: 'unknown',
          city: 'unknown',
          region: 'unknown',
          country: 'AU', // Default to Australia for business logic
          latitude: 0,
          longitude: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Melbourne',
          isp: 'unknown',
          org: 'unknown',
          asn: 'unknown'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const detectAnomalies = (previousLocation: LocationData): GeographicAnomaly[] => {
    if (!currentLocation) return [];

    const anomalies: GeographicAnomaly[] = [];

    // Check for country changes
    if (previousLocation.country !== currentLocation.country) {
      anomalies.push({
        type: 'country',
        severity: 'high',
        description: `Country changed from ${previousLocation.country} to ${currentLocation.country}`,
        previousLocation,
        currentLocation
      });
    }

    // Check for unusual distance travel
    if (previousLocation.latitude && previousLocation.longitude && 
        currentLocation.latitude && currentLocation.longitude) {
      const distance = calculateDistance(
        previousLocation.latitude,
        previousLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude
      );

      if (distance > 1000) { // More than 1000km
        anomalies.push({
          type: 'distance',
          severity: distance > 5000 ? 'high' : 'medium',
          description: `Unusual distance travel: ${Math.round(distance)}km`,
          previousLocation,
          currentLocation,
          distance
        });
      }
    }

    // Check for VPN/Proxy indicators
    const vpnIndicators = [
      /vpn|proxy|hosting|cloud|server|datacenter/i.test(currentLocation.isp),
      /vpn|proxy|hosting|cloud|server|datacenter/i.test(currentLocation.org),
      currentLocation.asn.includes('VPN') || currentLocation.asn.includes('PROXY')
    ];

    if (vpnIndicators.some(indicator => indicator)) {
      anomalies.push({
        type: 'vpn',
        severity: 'medium',
        description: `Potential VPN/Proxy usage detected: ${currentLocation.isp}`,
        currentLocation
      });
    }

    // Check for datacenter/hosting provider
    const datacenterIndicators = [
      /amazon|aws|google|microsoft|azure|digitalocean|linode|vultr/i.test(currentLocation.isp),
      /hosting|datacenter|server|cloud/i.test(currentLocation.org)
    ];

    if (datacenterIndicators.some(indicator => indicator)) {
      anomalies.push({
        type: 'datacenter',
        severity: 'high',
        description: `Access from datacenter/hosting provider: ${currentLocation.isp}`,
        currentLocation
      });
    }

    return anomalies;
  };

  const isAustralianLocation = (): boolean => {
    return currentLocation?.country === 'AU';
  };

  const isExpectedBusinessRegion = (): boolean => {
    if (!currentLocation) return false;
    
    // Call Kaids Roofing operates in South East Melbourne
    const expectedRegions = ['Victoria', 'VIC', 'Melbourne'];
    return expectedRegions.some(region => 
      currentLocation.region?.includes(region) || 
      currentLocation.city?.includes('Melbourne')
    );
  };

  return {
    currentLocation,
    isLoading,
    error,
    detectAnomalies,
    isAustralianLocation,
    isExpectedBusinessRegion
  };
};