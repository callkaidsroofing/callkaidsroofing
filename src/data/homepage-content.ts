import { BUSINESS, CLAIMS } from '@/config/business';

/**
 * Homepage Content Data
 * Centralized content for easy updates and consistency
 */

export const heroContent = {
  headline: 'Roof Problems? We Fix Them.',
  subheadline: `${CLAIMS.warranty.workmanship.standardYears}-Year Workmanship • ${BUSINESS.location.region}`,
  slogan: '"Proof In Every Roof"',
  trustSignals: [
    `${CLAIMS.reviews.rating}/5 Google Rating`,
    `${CLAIMS.reviews.count} Google Reviews`,
  ],
  ctaPrimary: {
    text: 'Call Now',
    href: BUSINESS.phone.href,
  },
  ctaSecondary: {
    text: 'Free Quote',
    href: '/quote',
  },
};

export const servicesData = [
  {
    id: 'restoration',
    icon: '🏠',
    title: 'Roof Restoration',
    benefit: 'Restore, protect, and extend service life',
    price: 'From $4,500',
    description: 'Complete roof restoration with high-pressure cleaning, re-bedding, re-pointing, and premium membrane coating.',
    link: '/services/roof-restoration',
  },
  {
    id: 'repairs',
    icon: '🔧',
    title: 'Roof Repairs',
    benefit: 'Fast fixes for leaks & damage',
    price: 'From $350',
    description: 'Emergency leak repairs, tile replacement, valley repairs, and gutter maintenance.',
    link: '/services/roof-repairs',
  },
  {
    id: 'painting',
    icon: '🎨',
    title: 'Roof Painting',
    benefit: 'Refresh & protect with premium coating',
    price: 'From $3,800',
    description: 'Professional roof painting with Dulux AcraTex membrane for maximum UV protection and color longevity.',
    link: '/services/roof-painting',
  },
];

export const whyChooseUsData = [
  {
    icon: 'Shield',
    title: 'Fully Insured',
    description: 'Public liability & WorkCover',
  },
  {
    icon: 'Phone',
    title: 'Owner-Operator',
    description: 'Direct contact—no sales teams',
  },
  {
    icon: 'MapPin',
    title: 'Photo-Backed Reports',
    description: 'Before/after proof with every job',
  },
];

export const serviceAreasData = [
  'Berwick',
  'Narre Warren',
  'Cranbourne',
  'Pakenham',
  'Officer',
  'Beaconsfield',
  'Clyde',
  'Hampton Park',
  'Lyndhurst',
  'Endeavour Hills',
  'Dandenong',
  'Hallam',
  'Keysborough',
  'Noble Park',
];

export const finalCTAContent = {
  headline: 'Free Roof Check This Week',
  description: 'Free quotes • No pressure',
};
