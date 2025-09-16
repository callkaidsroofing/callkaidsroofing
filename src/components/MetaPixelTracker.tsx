import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: any;
  }
}

export const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  useEffect(() => {
    // Initialize Meta Pixel
    if (typeof window !== 'undefined') {
      window.fbq = window.fbq || function() {
        (window.fbq.q = window.fbq.q || []).push(arguments);
      };
      
      if (!window.fbq.loaded) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
        
        window.fbq('init', 'YOUR_PIXEL_ID_HERE'); // Replace with actual pixel ID
        window.fbq('track', 'PageView');
        window.fbq.loaded = true;
      }
    }
  }, []);

  // Track custom events
  const trackEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  // Track lead events
  const trackLead = (value?: number, currency = 'AUD') => {
    trackEvent('Lead', { value, currency });
  };

  // Track contact events
  const trackContact = () => {
    trackEvent('Contact');
  };

  // Track quote requests
  const trackQuoteRequest = (serviceType?: string) => {
    trackEvent('SubmitApplication', { 
      content_name: 'Quote Request',
      content_category: serviceType || 'General'
    });
  };

  return null;
};

// Export tracking functions for use in components
export const trackQuoteRequest = (serviceType?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'SubmitApplication', { 
      content_name: 'Quote Request',
      content_category: serviceType || 'General'
    });
  }
};

export const trackContact = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact');
  }
};

export const trackLead = (value?: number, currency = 'AUD') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', { value, currency });
  }
};