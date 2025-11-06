import { z } from 'zod';

/**
 * MKF (Master Knowledge Framework) Schemas
 * Per MKF_00: These schemas define the structure of knowledge base data
 * MKF > KF precedence enforced via mergeWithPrecedence utility
 */

// ==================== PRICING (KF02) ====================
export const PricingServiceSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  baseRate: z.number(),
  unit: z.string(),
  category: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const PricingSchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  services: z.array(PricingServiceSchema),
  gstRate: z.number().default(0.1),
  regionalModifiers: z.record(z.number()).optional(),
  tierMarkups: z.record(z.number()).optional(),
});

// ==================== SERVICES ====================
export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
  pricing: z.object({
    from: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

// ==================== SUBURBS ====================
export const SuburbSchema = z.object({
  name: z.string(),
  postcode: z.string(),
  state: z.string().default('VIC'),
  region: z.string(),
  serviceArea: z.boolean().default(true),
  priority: z.number().optional(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

// ==================== SOPs (Standard Operating Procedures) ====================
export const SOPStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.number().optional(), // minutes
  safety: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
});

export const SOPSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  steps: z.array(SOPStepSchema),
  estimatedDuration: z.number(), // hours
  requiredCrew: z.number().default(2),
  safetyRequirements: z.array(z.string()).optional(),
  version: z.string(),
  lastReviewed: z.string(),
});

// ==================== EMAIL TEMPLATES ====================
export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  body: z.string(), // HTML template with {{placeholders}}
  category: z.enum(['quote', 'followup', 'warranty', 'reminder', 'notification']),
  variables: z.array(z.string()).optional(), // List of available {{variables}}
  footer: z.boolean().default(true),
});

// ==================== BRANDING ====================
export const BrandingSchema = z.object({
  companyName: z.string(),
  abn: z.string(),
  phone: z.string(),
  email: z.string(),
  slogan: z.string().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    charcoal: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  logo: z.object({
    main: z.string(),
    square: z.string(),
    slogan: z.string().optional(),
  }),
  serviceArea: z.object({
    region: z.string(),
    warranty: z.string(),
    insurance: z.string(),
  }),
});

// ==================== UPLOADS META ====================
export const UploadsMetaSchema = z.object({
  ingest_log: z.object({
    timestamp: z.string(),
    timezone: z.string(),
    package_name: z.string(),
    package_url: z.string(),
    expected_size_mb: z.number(),
    status: z.string(),
    sha256: z.string(),
    notes: z.array(z.string()),
  }),
  mkf_precedence: z.object({
    rule: z.string(),
    enforcement: z.string(),
    structure: z.record(z.string()),
  }),
});

// ==================== TYPE EXPORTS ====================
export type Pricing = z.infer<typeof PricingSchema>;
export type PricingService = z.infer<typeof PricingServiceSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Suburb = z.infer<typeof SuburbSchema>;
export type SOP = z.infer<typeof SOPSchema>;
export type SOPStep = z.infer<typeof SOPStepSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type UploadsMeta = z.infer<typeof UploadsMetaSchema>;
