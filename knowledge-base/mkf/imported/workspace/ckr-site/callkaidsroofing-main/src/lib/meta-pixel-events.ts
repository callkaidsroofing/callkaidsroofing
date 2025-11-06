// Assumption: Meta Pixel helpers run client-side after the fbq snippet is initialised.

type FbqFunction = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  q?: unknown[];
};

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

const getFbq = (): FbqFunction | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return typeof window.fbq === 'function' ? window.fbq : undefined;
};

export const trackQuoteRequest = (serviceType?: string) => {
  const fbq = getFbq();

  if (!fbq) {
    return;
  }

  fbq('track', 'SubmitApplication', {
    content_name: 'Quote Request',
    content_category: serviceType || 'General',
  });
};

export const trackContact = () => {
  const fbq = getFbq();

  if (!fbq) {
    return;
  }

  fbq('track', 'Contact');
};

export const trackLead = (value?: number, currency = 'AUD') => {
  const fbq = getFbq();

  if (!fbq) {
    return;
  }

  fbq('track', 'Lead', { value, currency });
};

export type { FbqFunction };
