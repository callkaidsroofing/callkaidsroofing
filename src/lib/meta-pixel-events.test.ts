// Assumption: Tests stub fbq to ensure Meta Pixel helpers behave without a browser.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackContact, trackLead, trackQuoteRequest } from './meta-pixel-events';

const stubWindowWithFbq = () => {
  const fbq = vi.fn();
  vi.stubGlobal('window', { fbq } as unknown as Window);
  return fbq;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('meta-pixel-events', () => {
  it('silently exits when fbq is unavailable', () => {
    expect(() => trackQuoteRequest()).not.toThrow();
    expect(() => trackContact()).not.toThrow();
    expect(() => trackLead()).not.toThrow();
  });

  it('dispatches tracking events when fbq exists', () => {
    const fbq = stubWindowWithFbq();

    trackQuoteRequest('Roof Cleaning');
    trackContact();
    trackLead(1800, 'AUD');

    expect(fbq).toHaveBeenNthCalledWith(1, 'track', 'SubmitApplication', {
      content_name: 'Quote Request',
      content_category: 'Roof Cleaning',
    });
    expect(fbq).toHaveBeenNthCalledWith(2, 'track', 'Contact');
    expect(fbq).toHaveBeenNthCalledWith(3, 'track', 'Lead', {
      value: 1800,
      currency: 'AUD',
    });
  });
});
