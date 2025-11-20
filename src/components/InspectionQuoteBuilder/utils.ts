// Utility functions for Inspection & Quote Builder

import {
  InspectionData,
  InspectionReportInsert,
  InspectionReportRow,
  QuoteInsert,
  QuoteRowGenerated,
  ScopeItem,
  GST_RATE,
} from './types';

/**
 * Transform inspection form data to Supabase inspection_reports format
 */
export function transformInspectionToSupabase(data: InspectionData): InspectionReportInsert {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return {
    clientName: data.client_name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || null,
    siteAddress: data.address.trim(),
    suburbPostcode: data.suburb.trim(),
    claddingType: data.roof_type || 'Unknown',
    heightStoreys: data.storey_count || null,
    accessnotes: data.access_difficulty || null,
    pointing: data.ridge_condition || null,
    valleyIrons: data.valley_condition || null,
    brokenTiles: data.tile_condition ? parseInt(data.tile_condition, 10) || 0 : 0,
    guttersDownpipes: data.gutter_condition || null,
    flashings: data.flashing_condition || null,
    internalLeaks: data.leak_status || null,
    overallConditionNotes: data.inspector_notes || null,
    accessNotes: data.safety_notes || null,
    status: 'draft',
    priority: data.urgency_level?.toLowerCase() || 'standard',
    date: data.date || today,
    time: data.time || currentTime,
    inspector: data.inspector || 'System User',
    roofArea: data.roof_area_m2 ?? null,
    ridgeCaps: data.ridge_length_lm ?? null,
    valleyLength: data.valley_length_lm ?? null,
    gutterPerimeter: data.gutter_length_lm ?? null,
    roofPitch: data.roof_pitch || null,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Transform Supabase inspection_reports to form data
 */
export function transformSupabaseToInspection(row: InspectionReportRow): InspectionData {
  const legacyRow = row as Record<string, any>;
  const clientName = legacyRow.client_name ?? row.clientName ?? '';
  const clientPhone = legacyRow.client_phone ?? row.phone ?? '';
  const email = legacyRow.client_email ?? row.email ?? '';
  const siteAddress = legacyRow.site_address ?? row.siteAddress ?? '';
  const suburb = legacyRow.suburb ?? row.suburbPostcode ?? '';
  const roofType = legacyRow.roof_type ?? row.claddingType ?? '';
  const storeys = legacyRow.property_type ?? row.heightStoreys ?? 'Single Storey';
  const access = legacyRow.access_difficulty ?? legacyRow.accessnotes ?? 'Standard';
  const ridge = legacyRow.condition_ridge ?? row.pointing ?? '';
  const valleys = legacyRow.condition_valleys ?? row.valleyIrons ?? '';
  const tileCondition = legacyRow.condition_tiles ?? row.brokenTiles?.toString() ?? '';
  const gutters = legacyRow.condition_gutters ?? row.guttersDownpipes ?? '';
  const flashing = legacyRow.condition_flashing ?? row.flashings ?? '';
  const leakRaw = legacyRow.condition_leaks ?? row.internalLeaks;
  const leakStatus = typeof leakRaw === 'boolean' ? (leakRaw ? 'Yes' : 'No') : leakRaw || '';

  return {
    client_name: clientName,
    phone: clientPhone,
    email,
    address: siteAddress,
    suburb,
    roof_type: roofType,
    storey_count: storeys,
    access_difficulty: access,
    photos_taken: 'Yes',
    urgency_level: 'Standard',
    ridge_condition: ridge,
    valley_condition: valleys,
    tile_condition: tileCondition,
    gutter_condition: gutters,
    flashing_condition: flashing,
    leak_status: leakStatus,
    inspector_notes: legacyRow.inspector_notes ?? row.overallConditionNotes ?? '',
    safety_notes: legacyRow.safety_notes ?? row.accessNotes ?? '',
    date: legacyRow.inspection_date ?? row.date,
    time: legacyRow.inspection_time ?? row.time,
    inspector: legacyRow.inspector ?? row.inspector,
    roof_area_m2: legacyRow.roof_area_sqm ?? row.roofArea ?? undefined,
    ridge_length_lm: legacyRow.ridge_length_lm ?? row.ridgeCaps ?? undefined,
    valley_length_lm: legacyRow.valley_length_lm ?? row.valleyLength ?? undefined,
    gutter_length_lm: legacyRow.gutter_length_lm ?? row.gutterPerimeter ?? undefined,
    tile_count: legacyRow.tile_count ?? row.brokenTiles ?? undefined,
    roof_pitch: legacyRow.roof_pitch ?? row.roofPitch ?? '',
  };
}

/**
 * Calculate pricing for a scope item
 */
export function calculateScopeItemPricing(item: Partial<ScopeItem>): {
  subtotal_ex_gst: number;
  gst_amount: number;
  total_inc_gst: number;
} {
  const qty = item.qty || 0;
  const labour = item.labour || 0;
  const material = item.material || 0;
  const markup = (item.markup || 0) / 100;

  const labourCost = qty * labour;
  const materialCost = qty * material;
  const subtotal_ex_gst = (labourCost + materialCost) * (1 + markup);
  const gst_amount = subtotal_ex_gst * GST_RATE;
  const total_inc_gst = subtotal_ex_gst + gst_amount;

  return {
    subtotal_ex_gst: Math.round(subtotal_ex_gst * 100) / 100,
    gst_amount: Math.round(gst_amount * 100) / 100,
    total_inc_gst: Math.round(total_inc_gst * 100) / 100,
  };
}

/**
 * Calculate total pricing for all scope items
 */
export function calculateTotalPricing(items: ScopeItem[]): {
  subtotal: number;
  gst: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal_ex_gst, 0);
  const gst = items.reduce((sum, item) => sum + item.gst_amount, 0);
  const total = items.reduce((sum, item) => sum + item.total_inc_gst, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Transform scope items to Supabase quotes format
 */
export function transformQuoteToSupabase(
  inspectionData: InspectionData,
  scopeItems: ScopeItem[],
  quoteData: any,
  inspectionReportId?: string,
  existingQuote?: QuoteRowGenerated | null
): QuoteInsert {
  const pricing = calculateTotalPricing(scopeItems);
  const now = new Date().toISOString();
  const quoteNumber = existingQuote?.quote_number || generateQuoteNumber();

  // Transform scope items to line_items format
  const line_items = scopeItems.map(item => ({
    description: item.category,
    area: item.area,
    quantity: item.qty,
    unit: item.unit,
    labour_cost: item.labour,
    material_cost: item.material,
    markup_percent: item.markup,
    notes: item.notes,
    priority: item.priority,
    subtotal: item.subtotal_ex_gst,
    gst: item.gst_amount,
    total: item.total_inc_gst,
  }));

  return {
    quote_number: quoteNumber,
    client_name: inspectionData.client_name.trim() || 'Unknown',
    phone: inspectionData.phone.trim() || 'Not Provided',
    email: inspectionData.email?.trim() || null,
    site_address: inspectionData.address.trim() || 'Not Provided',
    suburb_postcode: inspectionData.suburb.trim() || 'Not Provided',
    inspection_report_id: inspectionReportId || null,
    line_items,
    scope: {
      primary_service: quoteData.primary_service || 'Roof Restoration',
      document_type: quoteData.document_type || 'Multi-Option Quote',
      roof_type: inspectionData.roof_type || 'Not Specified',
    },
    pricing: {
      markup_default: 30,
      gst_rate: GST_RATE,
    },
    subtotal: pricing.subtotal,
    gst: pricing.gst,
    total: pricing.total,
    tier_level: existingQuote?.tier_level || 'standard',
    tier_profile: existingQuote?.tier_profile || null,
    status: existingQuote?.status || 'draft',
    draft: existingQuote?.draft ?? true,
    created_at: existingQuote?.created_at ?? now,
    updated_at: now,
    sent_at: existingQuote?.sent_at ?? null,
  };
}

/**
 * Generate quote number
 */
export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CKR-${year}${month}-${random}`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Validate inspection data
 */
export function validateInspection(data: InspectionData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.client_name?.trim()) errors.push('Client name is required');
  if (!data.phone?.trim()) errors.push('Phone number is required');
  if (!data.address?.trim()) errors.push('Property address is required');
  if (!data.suburb?.trim()) errors.push('Suburb is required');
  if (!data.roof_type?.trim()) errors.push('Roof type is required');

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate quote data
 */
export function validateQuote(scopeItems: ScopeItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (scopeItems.length === 0) {
    errors.push('At least one scope item is required');
  }

  scopeItems.forEach((item, index) => {
    if (!item.category?.trim()) {
      errors.push(`Scope item ${index + 1}: Category is required`);
    }
    if (!item.qty || item.qty <= 0) {
      errors.push(`Scope item ${index + 1}: Quantity must be greater than 0`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
