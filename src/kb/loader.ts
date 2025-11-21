/**
 * MKF Knowledge Base Loader
 * 
 * Provides typed accessors for all MKF knowledge segments.
 * Implements MKF > KF precedence via mergeWithPrecedence.
 * 
 * Usage:
 *   import { getPricing, getServices, getBranding } from '@/kb/loader';
 *   const pricing = await getPricing();
 *   const services = await getServices();
 */

import { safeMerge } from './mergeWithPrecedence';
import { z } from 'zod';
import {
  Pricing,
  PricingSchema,
  Service,
  ServiceSchema,
  Suburb,
  SuburbSchema,
  SOP,
  SOPSchema,
  EmailTemplate,
  EmailTemplateSchema,
  Branding,
  BrandingSchema,
  UploadsMeta,
  UploadsMetaSchema,
} from './schemas';

// ==================== CACHE ====================
// Simple in-memory cache to avoid repeated parsing
const cache = new Map<string, any>();

/**
 * Load and parse JSON from knowledge base with caching
 */
async function loadJSON<T>(
  mkfPath: string,
  kfPath?: string,
  schema?: any
): Promise<T | null> {
  const cacheKey = `${mkfPath}:${kfPath || 'none'}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    let mkfData: any = null;
    let kfData: any = null;

    // Try loading MKF (primary source)
    try {
      const mkfResponse = await fetch(mkfPath);
      if (mkfResponse.ok) {
        mkfData = await mkfResponse.json();
      }
    } catch (err) {
      console.debug(`[KB] MKF not found: ${mkfPath}`);
    }

    // Try loading KF (fallback source)
    if (kfPath) {
      try {
        const kfResponse = await fetch(kfPath);
        if (kfResponse.ok) {
          kfData = await kfResponse.json();
        }
      } catch (err) {
        console.debug(`[KB] KF not found: ${kfPath}`);
      }
    }

    // Merge with MKF precedence
    const merged = safeMerge(mkfData, kfData);

    // Validate with Zod schema if provided
    const result = schema ? schema.parse(merged) : merged;

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`[KB] Failed to load ${mkfPath}:`, error);
    return null;
  }
}

/**
 * Clear the knowledge base cache
 * Call this when knowledge files are updated
 */
export function clearKBCache(): void {
  cache.clear();
}

// ==================== PRICING (KF02) ====================

export async function getPricing(): Promise<Pricing | null> {
  return loadJSON<Pricing>(
    '/knowledge-base/mkf/pricing/kf02.json',
    '/knowledge-base/legacy/pricing.json',
    PricingSchema
  );
}

export async function getPricingService(code: string): Promise<any | null> {
  const pricing = await getPricing();
  return pricing?.services.find((s) => s.code === code) || null;
}

// ==================== SERVICES ====================

export async function getServices(): Promise<Service[]> {
  const data = await loadJSON<{ services: Service[] }>(
    '/knowledge-base/mkf/services/index.json',
    '/knowledge-base/legacy/services.json'
  );
  return data?.services || [];
}

export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) || null;
}

// ==================== SUBURBS ====================

export async function getSuburbs(): Promise<Suburb[]> {
  const data = await loadJSON<{ suburbs: Suburb[] }>(
    '/knowledge-base/mkf/suburbs/index.json',
    '/knowledge-base/legacy/suburbs.json',
    z.object({ suburbs: z.array(SuburbSchema) })
  );
  return data?.suburbs || [];
}

export async function getSuburb(name: string): Promise<Suburb | null> {
  const suburbs = await getSuburbs();
  return (
    suburbs.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    ) || null
  );
}

export async function getSuburbsByRegion(region: string): Promise<Suburb[]> {
  const suburbs = await getSuburbs();
  return suburbs.filter((s) => s.region === region);
}

// ==================== SOPs ====================

export async function getSOPs(): Promise<SOP[]> {
  const data = await loadJSON<{ sops: SOP[] }>(
    '/knowledge-base/mkf/sops/index.json',
    '/knowledge-base/legacy/sops.json'
  );
  return data?.sops || [];
}

export async function getSOP(id: string): Promise<SOP | null> {
  const sops = await getSOPs();
  return sops.find((s) => s.id === id) || null;
}

export async function getSOPsByCategory(category: string): Promise<SOP[]> {
  const sops = await getSOPs();
  return sops.filter((s) => s.category === category);
}

// ==================== EMAIL TEMPLATES ====================

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const data = await loadJSON<{ templates: EmailTemplate[] }>(
    '/knowledge-base/mkf/email-templates/index.json',
    '/knowledge-base/legacy/email-templates.json'
  );
  return data?.templates || [];
}

export async function getEmailTemplate(
  id: string
): Promise<EmailTemplate | null> {
  const templates = await getEmailTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Render email template with variable substitution
 */
export function renderEmailTemplate(
  template: EmailTemplate,
  variables: Record<string, string>
): { subject: string; body: string } {
  let subject = template.subject;
  let body = template.body;

  // Replace {{variable}} placeholders
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    subject = subject.replace(placeholder, value);
    body = body.replace(placeholder, value);
  });

  // Add footer if enabled
  if (template.footer) {
    body += `\n\n---\nCall Kaids Roofing\nABN 39475055075\n0435 900 709\ncallkaidsroofing@outlook.com`;
  }

  return { subject, body };
}

// ==================== BRANDING ====================

export async function getBranding(): Promise<Branding | null> {
  return loadJSON<Branding>(
    '/knowledge-base/mkf/branding/brand.json',
    '/knowledge-base/legacy/branding.json',
    BrandingSchema
  );
}

// ==================== UPLOADS META ====================

export async function getUploadsMeta(): Promise<UploadsMeta | null> {
  return loadJSON<UploadsMeta>(
    '/knowledge-base/mkf/uploads/meta.json',
    undefined,
    UploadsMetaSchema
  );
}

// ==================== EXPORTS ====================

export const KB = {
  // Pricing
  getPricing,
  getPricingService,

  // Services
  getServices,
  getService,

  // Suburbs
  getSuburbs,
  getSuburb,
  getSuburbsByRegion,

  // SOPs
  getSOPs,
  getSOP,
  getSOPsByCategory,

  // Email Templates
  getEmailTemplates,
  getEmailTemplate,
  renderEmailTemplate,

  // Branding
  getBranding,

  // Meta
  getUploadsMeta,

  // Cache management
  clearCache: clearKBCache,
};

export default KB;
