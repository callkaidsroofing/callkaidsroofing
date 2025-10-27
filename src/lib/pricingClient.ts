import { supabase } from "@/integrations/supabase/client";
import { parseKF02, type KF02, type Service } from "./kf02";

let cachedPricing: { version: string; model: KF02; hash: string } | null = null;

/**
 * Fetch latest KF_02 pricing model from Supabase
 * @param force - Bypass cache and fetch fresh data
 * @returns Validated KF02 model
 */
export async function fetchLatestPricing(force = false): Promise<KF02> {
  if (cachedPricing && !force) {
    console.log(`[Pricing] Using cached KF_02 v${cachedPricing.version}`);
    return cachedPricing.model;
  }

  console.log("[Pricing] Fetching latest KF_02 from Supabase...");
  
  const { data, error } = await supabase
    .from('v_pricing_latest')
    .select('json, version, hash')
    .single();

  if (error) {
    throw new Error(`Failed to fetch pricing model: ${error.message}`);
  }

  if (!data) {
    throw new Error("No active pricing model found in database");
  }

  // Validate with Zod schema
  const model = parseKF02(data.json);
  
  cachedPricing = { 
    version: data.version, 
    model, 
    hash: data.hash 
  };
  
  console.log(`[Pricing] Loaded KF_02 v${data.version} (hash: ${data.hash.substring(0, 8)}...)`);
  
  return model;
}

/**
 * Get cached pricing version without fetching
 */
export function getCachedPricingVersion(): string | null {
  return cachedPricing?.version ?? null;
}

/**
 * Get cached pricing hash for ETag validation
 */
export function getCachedPricingHash(): string | null {
  return cachedPricing?.hash ?? null;
}

/**
 * Clear pricing cache (call after admin updates pricing)
 */
export function invalidatePricingCache(): void {
  console.log("[Pricing] Cache invalidated");
  cachedPricing = null;
}

/**
 * Get service by code from cached pricing
 */
export function getCachedService(serviceCode: string): Service | undefined {
  if (!cachedPricing) return undefined;
  return cachedPricing.model.KF_02_PRICING_MODEL.services.find(
    s => s.serviceCode === serviceCode
  );
}

/**
 * Get all services from cached pricing
 */
export function getCachedServices(): Service[] {
  if (!cachedPricing) return [];
  return cachedPricing.model.KF_02_PRICING_MODEL.services;
}
