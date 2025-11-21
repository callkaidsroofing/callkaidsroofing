/**
 * CKR Brand Assets
 * Centralized access to all branded images, logos, and proof materials
 */

// Logos
import logoMetallicBlue from '@/assets/brand/logo-metallic-blue.png';
import logoSilverMetallic from '@/assets/brand/logo-silver-metallic.png';
import servicesIconsBlue from '@/assets/brand/services-icons-blue.png';
import servicesOverviewRoof from '@/assets/brand/services-overview-roof.png';

// Proof & Testimonials
import testimonialRobBerwick from '@/assets/proof/testimonial-rob-berwick.png';
import beforeAfterCollage from '@/assets/proof/before-after-collage.png';

export const BRAND_ASSETS = {
  logos: {
    metallicBlue: logoMetallicBlue,
    silverMetallic: logoSilverMetallic,
    servicesIcons: servicesIconsBlue,
  },
  marketing: {
    servicesOverview: servicesOverviewRoof,
  },
  proof: {
    testimonials: {
      robBerwick: testimonialRobBerwick,
    },
    beforeAfter: {
      collage: beforeAfterCollage,
    },
  },
} as const;

export const BRAND_CONSTANTS = {
  phone: '0435 900 709',
  phoneLink: 'tel:0435900709',
  email: 'info@callkaidsroofing.com.au',
  abn: '39475055075',
  slogan: 'Proof In Every Roof', // Always italicized
  website: 'https://callkaidsroofing.com.au',
  colors: {
    primaryElectric: '#007ACC',
    secondaryNavy: '#0B3B69',
    charcoal: '#111827',
  },
} as const;
