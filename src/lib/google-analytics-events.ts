// Assumption: Google Analytics helpers run after the gtag snippet initialises on the client.

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

const getGtag = (): GtagFunction | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return typeof window.gtag === 'function' ? window.gtag : undefined;
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

export const trackConversion = (conversionId: string, value?: number, currency = 'AUD') => {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  gtag('event', 'conversion', {
    send_to: conversionId,
    value,
    currency,
  });
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

export type { GtagFunction };
