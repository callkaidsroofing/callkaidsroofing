import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      // Load GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      
      // Configure GA
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_location: window.location.href,
        page_title: document.title,
        send_page_view: true
      });
    }
  }, [measurementId]);

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', measurementId, {
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location, measurementId]);

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