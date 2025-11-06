// Assumption: Google Analytics is initialised elsewhere before this tracker runs on the client.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { GtagFunction } from '@/lib/google-analytics-events';

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sendPageView = () => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          send_to: measurementId,
          page_path: `${window.location.pathname}${window.location.search}`,
          page_title: document.title,
        });
      }
    };

    sendPageView();
    window.addEventListener('analytics:loaded', sendPageView);

    return () => {
      window.removeEventListener('analytics:loaded', sendPageView);
    };
  }, [location.pathname, location.search, measurementId]);

  return null;
};
