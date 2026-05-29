import { describe, expect, it } from 'vitest';
import { BUSINESS, CLAIMS, formatAbn, getPublicWarrantySummary } from './business';

describe('business public facts', () => {
  it('uses questionnaire-verified identity and contact details', () => {
    expect(BUSINESS.name).toBe('Call Kaids Roofing');
    expect(BUSINESS.owner).toBe('Kaidyn Brownlie');
    expect(BUSINESS.abn).toBe('39 475 055 075');
    expect(BUSINESS.phone.display).toBe('0435 900 709');
    expect(BUSINESS.phone.href).toBe('tel:0435900709');
    expect(BUSINESS.phone.smsHref).toBe('sms:0435900709');
    expect(BUSINESS.email.primary).toBe('info@callkaidsroofing.com.au');
    expect(BUSINESS.location.hq).toBe('Clyde North, VIC');
    expect(BUSINESS.location.state).toBe('VIC');
    expect(BUSINESS.licence).toBe('CDB-U 66867');
    expect(BUSINESS.insurance.policyNumber).toBe('BZ21061CMB');
  });

  it('keeps workmanship warranties separate from product warranties', () => {
    expect(CLAIMS.warranty.workmanship.standardYears).toBe(10);
    expect(CLAIMS.warranty.workmanship.patchJobs).toBe('none');
    expect(CLAIMS.warranty.products.ircRoofRefreshYears).toBe(10);
    expect(CLAIMS.warranty.products.ircRoofProtectYears).toBe(15);
    expect(CLAIMS.warranty.products.ircPlatinumProtectYears).toBe(20);
    expect(CLAIMS.reviews.rating).toBe(5.0);
    expect(CLAIMS.reviews.count).toBe(21);
    expect(getPublicWarrantySummary()).toContain('10-year workmanship warranty');
    expect(getPublicWarrantySummary()).toContain('manufacturer product warranties');
  });

  it('formats compact ABNs for legacy consumers', () => {
    expect(formatAbn('39475055075')).toBe('39 475 055 075');
    expect(formatAbn('39 475 055 075')).toBe('39 475 055 075');
  });
});
