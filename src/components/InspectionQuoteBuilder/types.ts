// TypeScript types for Inspection & Quote Builder
import type { Database } from '@/integrations/supabase/types';

export interface InspectionData {
  client_name: string;
  phone: string;
  email?: string;
  lead_id?: string;
  address: string;
  suburb: string;
  roof_type: string;
  storey_count: string;
  access_difficulty: string;
  photos_taken: string;
  urgency_level: string;
  ridge_condition: string;
  valley_condition: string;
  tile_condition: string;
  gutter_condition: string;
  flashing_condition: string;
  leak_status: string;
  inspector_notes: string;
  safety_notes: string;
  date?: string;
  time?: string;
  inspector?: string;
  // Measurements
  roof_area_m2?: number;
  ridge_length_lm?: number;
  valley_length_lm?: number;
  gutter_length_lm?: number;
  tile_count?: number;
  roof_pitch?: string;
}

export interface ScopeItem {
  id: string;
  category: string;
  area: string;
  qty: number;
  unit: string;
  priority: 'Must Do' | 'Recommended' | 'Optional';
  labour: number;
  material: number;
  markup: number;
  notes: string;
  subtotal_ex_gst: number;
  gst_amount: number;
  total_inc_gst: number;
}

export interface QuoteData {
  primary_service: string;
  document_type: 'Multi-Option Quote' | 'Simple Quote';
  slogan: string;
  include_findings: boolean;
  include_warranty: boolean;
  include_terms: boolean;
}

export interface LeadContext {
  id?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  suburb?: string | null;
  service?: string | null;
}

export interface PricingPreset {
  label: string;
  unit: string;
  labour: number;
  material: number;
}

export interface PricingPresets {
  [key: string]: PricingPreset;
}

export const PRICING_PRESETS: PricingPresets = {
  RIDGE_REBED: { label: "Ridge Rebedding & Repointing", unit: "lm", labour: 50, material: 10 },
  VALLEY_REPLACE: { label: "Valley Replacement", unit: "lm", labour: 65, material: 40 },
  PRESSURE_WASH: { label: "Pressure Washing", unit: "m²", labour: 6, material: 0 },
  ROOF_PAINT_TILE: { label: "Roof Painting (Tile)", unit: "m²", labour: 35, material: 15 },
  ROOF_PAINT_METAL: { label: "Roof Painting (Metal)", unit: "m²", labour: 30, material: 12 },
  GUTTER_CLEAN: { label: "Gutter Cleaning", unit: "lm", labour: 8, material: 0 },
  TILE_REPLACE: { label: "Tile Replacement", unit: "item", labour: 15, material: 8 },
  FLASHING_REPAIR: { label: "Flashing Repair", unit: "lm", labour: 45, material: 20 },
  LEAK_REPAIR: { label: "Leak Repair", unit: "fixed", labour: 250, material: 50 },
  SARKING_INSTALL: { label: "Sarking Installation", unit: "m²", labour: 25, material: 15 },
  WHIRLYBIRD_INSTALL: { label: "Whirlybird Installation", unit: "item", labour: 180, material: 120 },
  CUSTOM: { label: "Custom Item", unit: "item", labour: 0, material: 0 },
};

export const GST_RATE = 0.1;

export const COMPANY_CONFIG = {
  company_name: "Call Kaids Roofing",
  contact_line: "ABN 39475055075 • 0435 900 709 • callkaidsroofing@outlook.com • SE Melbourne",
  warranty_text: "All roofing works are completed to Australian Standards and backed by a 7–10 year workmanship warranty.",
  primary_color: "#007ACC",
  secondary_color: "#0B3B69",
  dark_color: "#111827",
  background_color: "#F7F8FA",
};

// Supabase table mappings
export type InspectionReportInsert = Database['public']['Tables']['inspection_reports']['Insert'];
export type InspectionReportRow = Database['public']['Tables']['inspection_reports']['Row'];

export interface QuoteRow {
  id?: string;
  quote_number: string;
  client_name: string;
  phone: string;
  email?: string | null;
  site_address: string;
  suburb_postcode: string;
  inspection_report_id?: string | null;
  line_items: any;
  scope: any;
  pricing: any;
  subtotal: number;
  gst: number;
  total: number;
  tier_level: string;
  tier_profile?: string | null;
  status?: string | null;
  draft?: boolean;
  created_at?: string;
  updated_at?: string;
  sent_at?: string | null;
}

export type QuoteInsert = Database['public']['Tables']['quotes']['Insert'];
export type QuoteRowGenerated = Database['public']['Tables']['quotes']['Row'];
export type QuoteInsertWithMeta = QuoteInsert & {
  export_metadata?: Record<string, unknown> | null;
};
