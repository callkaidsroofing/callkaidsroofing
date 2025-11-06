// Assumption: Meta Pixel is configured elsewhere and this tracker only runs in the browser.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { FbqFunction } from '@/lib/meta-pixel-events';

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

export const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.fbq) {
        const fbq: FbqFunction = (...args: unknown[]) => {
          (fbq.q = fbq.q || []).push(args);
        };
        window.fbq = fbq;
      }

      if (!window.fbq.loaded) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);

        window.fbq('init', 'YOUR_PIXEL_ID_HERE');
        window.fbq('track', 'PageView');
        window.fbq.loaded = true;
      }
    }
  }, []);

  return null;
};
