import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type GtagFunction = (...args: unknown[]) => void;

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

// Export tracking functions for use in components
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackConversion = (conversionId: string, value?: number, currency = 'AUD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }
};

export const trackQuoteRequest = (serviceType?: string) => {
  trackEvent('quote_request', 'lead_generation', serviceType);
};

export const trackPhoneCall = () => {
  trackEvent('phone_call', 'contact', 'header_phone');
};

export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submission', 'lead_generation', formType);
};