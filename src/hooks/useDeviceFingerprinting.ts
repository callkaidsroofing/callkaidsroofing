import { useEffect, useState } from 'react';

interface DeviceFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
  colorDepth: number;
  deviceMemory?: number;
  hardwareConcurrency: number;
  connectionType?: string;
  fingerprint: string;
}

export const useDeviceFingerprinting = () => {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null);

  useEffect(() => {
    const generateFingerprint = (): DeviceFingerprint => {
      const navigator = window.navigator;
      const screen = window.screen;
      
      const data = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === '1',
        colorDepth: screen.colorDepth,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        connectionType: (navigator as any).connection?.effectiveType,
        fingerprint: ''
      };

      // Generate a hash of all the collected data
      const fingerprintString = JSON.stringify(data);
      data.fingerprint = btoa(fingerprintString).slice(0, 32);

      return data;
    };

    setFingerprint(generateFingerprint());
  }, []);

  const detectAnomalies = (previousFingerprint: DeviceFingerprint): string[] => {
    if (!fingerprint || !previousFingerprint) return [];

    const anomalies: string[] = [];

    // Check for significant changes that might indicate spoofing
    if (fingerprint.platform !== previousFingerprint.platform) {
      anomalies.push('Platform changed');
    }

    if (fingerprint.screenResolution !== previousFingerprint.screenResolution) {
      anomalies.push('Screen resolution changed');
    }

    if (fingerprint.timezone !== previousFingerprint.timezone) {
      anomalies.push('Timezone changed');
    }

    if (fingerprint.hardwareConcurrency !== previousFingerprint.hardwareConcurrency) {
      anomalies.push('Hardware concurrency changed');
    }

    if (fingerprint.deviceMemory !== previousFingerprint.deviceMemory) {
      anomalies.push('Device memory changed');
    }

    return anomalies;
  };

  return {
    fingerprint,
    detectAnomalies
  };
};