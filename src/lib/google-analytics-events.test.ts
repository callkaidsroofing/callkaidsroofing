// Assumption: Tests simulate the browser global to validate analytics helpers.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  trackConversion,
  trackEvent,
  trackFormSubmission,
  trackPhoneCall,
  trackQuoteRequest,
} from './google-analytics-events';

const stubWindowWithGtag = () => {
  const gtag = vi.fn();
  vi.stubGlobal('window', { gtag } as unknown as Window);
  return gtag;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('google-analytics-events', () => {
  it('does not throw when gtag is unavailable', () => {
    expect(() => trackEvent('view_hero', 'engagement')).not.toThrow();
    expect(() => trackConversion('AW-123456789')).not.toThrow();
    expect(() => trackQuoteRequest()).not.toThrow();
    expect(() => trackPhoneCall()).not.toThrow();
    expect(() => trackFormSubmission('quick-quote')).not.toThrow();
  });

  it('forwards tracking data to gtag when available', () => {
    const gtag = stubWindowWithGtag();

    trackEvent('view_hero', 'engagement', 'homepage', 1);
    trackConversion('AW-123456789/abcdEFghIjkLMnoP', 2500, 'AUD');
    trackQuoteRequest('Roof Restoration');
    trackPhoneCall();
    trackFormSubmission('quick-quote');

    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'view_hero', {
      event_category: 'engagement',
      event_label: 'homepage',
      value: 1,
    });
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'conversion', {
      send_to: 'AW-123456789/abcdEFghIjkLMnoP',
      value: 2500,
      currency: 'AUD',
    });
    expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'quote_request', {
      event_category: 'lead_generation',
      event_label: 'Roof Restoration',
      value: undefined,
    });
    expect(gtag).toHaveBeenNthCalledWith(4, 'event', 'phone_call', {
      event_category: 'contact',
      event_label: 'header_phone',
      value: undefined,
    });
    expect(gtag).toHaveBeenNthCalledWith(5, 'event', 'form_submission', {
      event_category: 'lead_generation',
      event_label: 'quick-quote',
      value: undefined,
    });
  });
});
