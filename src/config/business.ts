export const BUSINESS = {
  name: 'Call Kaids Roofing',
  owner: 'Kaidyn Brownlie',
  structure: 'Sole Trader',
  abn: '39 475 055 075',
  abnCompact: '39475055075',
  licence: 'CDB-U 66867',
  website: 'https://callkaidsroofing.com.au',
  slogan: 'Proof In Every Roof',
  phone: {
    display: '0435 900 709',
    href: 'tel:0435900709',
    smsHref: 'sms:0435900709',
    e164: '+61435900709',
  },
  email: {
    primary: 'info@callkaidsroofing.com.au',
    secondary: 'callkaidsroofing@outlook.com',
  },
  location: {
    hq: 'Clyde North, VIC',
    hqSuburb: 'Clyde North',
    state: 'VIC',
    region: 'South-East Melbourne',
    serviceRadiusKm: 50,
    geo: {
      latitude: '-38.1167',
      longitude: '145.3333',
    },
  },
  insurance: {
    provider: 'Bizcover',
    publicLiability: '$20,000,000 AUD',
    policyNumber: 'BZ21061CMB',
    certificateAvailability: 'Certificate of currency available on request',
  },
  googleBusiness: {
    profileUrl: 'https://share.google/iLV2PcH9tfdx3Vvdj',
    reviewUrl: 'https://g.page/r/CRALjo9XGKdBEBM/review',
    ratingSnapshot: {
      rating: 5.0,
      reviewCount: 21,
      asOf: 'Mar 2026',
    },
  },
} as const;

export const CLAIMS = {
  warranty: {
    workmanship: {
      standardYears: 10,
      minorRepairs: '5-7 years',
      patchJobs: 'none',
      quoteText:
        '10-year workmanship warranty on standard labour. Material warranties as per manufacturer specifications.',
      certificates: 'on request',
      transferability: 'unconfirmed',
    },
    products: {
      ircRoofRefreshYears: 10,
      ircRoofProtectYears: 15,
      ircPlatinumProtectYears: 20,
    },
  },
  proof: {
    photoDocumentation: 'Before, process, and after photo documentation where practical',
    reviewCountNeedsLiveVerification: true,
    jobsCompletedNeedsProof: true,
  },
  reviews: {
    rating: 5.0,
    count: 21,
    asOf: 'Mar 2026',
  },
} as const;

export const SERVICE_AREA_SUBURBS = [
  'Berwick',
  'Pakenham',
  'Narre Warren',
  'Cranbourne',
  'Clyde North',
  'Officer',
  'Beaconsfield',
  'Hampton Park',
  'Hallam',
  'Lynbrook',
  'Lyndhurst',
  'Rowville',
  'Keysborough',
  'Noble Park',
  'Doveton',
  'Eumemmerring',
  'Dandenong South',
  'Endeavour Hills',
  'Lysterfield South',
] as const;

export const BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: BUSINESS.name,
  description:
    'Owner-operated roofing services across South-East Melbourne, including roof restorations, repairs, roof painting, gutter work, leak detection, and roof inspections.',
  url: BUSINESS.website,
  telephone: BUSINESS.phone.e164,
  email: BUSINESS.email.primary,
  image: `${BUSINESS.website}/lovable-uploads/call-kaids-logo-main.png`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.location.hqSuburb,
    addressRegion: 'VIC',
    addressCountry: 'AU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.location.geo.latitude,
    longitude: BUSINESS.location.geo.longitude,
  },
  identifier: `ABN ${BUSINESS.abn}`,
  areaServed: SERVICE_AREA_SUBURBS.map((name) => ({
    '@type': 'City',
    name,
  })),
  founder: {
    '@type': 'Person',
    name: BUSINESS.owner,
    jobTitle: 'Owner-Operator',
  },
  sameAs: [BUSINESS.googleBusiness.profileUrl],
} as const;

export function formatAbn(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11) {
    return value;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
}

export function getPublicWarrantySummary(): string {
  return `${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work, with manufacturer product warranties available by coating system.`;
}
