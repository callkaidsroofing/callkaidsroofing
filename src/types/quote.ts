/**
 * KF_02 v7.1 Quote Types
 * Enhanced quote line items and metadata for KF_02 pricing model integration
 */

export interface QuoteLineItemKF02 {
  id: string;
  serviceCode: string; // Maps to KF_02 services[].serviceCode
  displayName: string;
  description: string;
  quantity: number;
  unit: string; // lm, m2, each, etc.
  unitRate: number; // After all modifiers applied
  lineTotal: number;
  composition?: {
    labour: Record<string, number>; // LAB_PRIMARY_DAY: 0.04
    materials: Record<string, number>; // MAT_POINTING: 0.33
  };
  materialSpec?: string; // "SupaPoint flexible compound"
  warrantyYears?: [number, number]; // [7, 10]
  sortOrder: number;
}

export interface QuoteMetadataKF02 {
  pricingVersion: string; // "7.1"
  pricingHash: string; // SHA-256 hash
  tierProfile: "REPAIR" | "RESTORE" | "PREMIUM";
  regionalModifier: number; // 1.0, 1.05, 1.10
  contingencyApplied: boolean;
  preferences?: QuotePreferences;
}

export interface QuoteTotalsKF02 {
  subtotal: number;
  gst: number;
  total: number;
  contingencyAmount?: number;
}

export interface QuotePreferences {
  gstDisplay?: "inclusive" | "exclusive";
  clientType?: "homeowner" | "contractor" | "insurance" | "property_manager";
  budgetLevel?: "budget" | "standard" | "premium";
  gutterCleaningPreference?: "free" | "priced" | "auto";
  washPaintPreference?: "combined" | "separate";
  ridgeMeasurement?: "caps" | "lm" | "both";
  specialRequirements?: string;
  region?: "Metro" | "Outer-SE" | "Rural";
}
