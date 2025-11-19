// Utility functions for Inspection & Quote Builder

import { InspectionData, InspectionReportRow, QuoteRow, ScopeItem, GST_RATE } from './types';

/**
 * Transform inspection form data to Supabase inspection_reports format
 */
export function transformInspectionToSupabase(data: InspectionData): InspectionReportRow {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return {
    clientName: data.client_name,
    phone: data.phone,
    email: data.email || null,
    siteAddress: data.address,
    suburbPostcode: data.suburb,
    date: data.date || today,
    time: data.time || currentTime,
    inspector: data.inspector || 'System User',
    claddingType: data.roof_type,
    heightStoreys: data.storey_count,
    accessnotes: data.access_difficulty,
    pointing: data.ridge_condition,
    valleyIrons: data.valley_condition,
    brokenTiles: data.tile_condition ? parseInt(data.tile_condition) || 0 : 0,
    guttersDownpipes: data.gutter_condition,
    flashings: data.flashing_condition,
    internalLeaks: data.leak_status,
    overallConditionNotes: data.inspector_notes,
    accessNotes: data.safety_notes,
    status: 'draft',
    priority: data.urgency_level?.toLowerCase() || 'standard',
    // Measurements
    roofArea: data.roof_area_m2 || null,
    ridgeCaps: data.ridge_length_lm || null,
    gutterPerimeter: data.gutter_length_lm || null,
    roofPitch: data.roof_pitch || null,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Transform Supabase inspection_reports to form data
 */
export function transformSupabaseToInspection(row: InspectionReportRow): InspectionData {
  return {
    client_name: row.clientName,
    phone: row.phone,
    email: row.email || '',
    address: row.siteAddress,
    suburb: row.suburbPostcode,
    roof_type: row.claddingType,
    storey_count: row.heightStoreys || 'Single Storey',
    access_difficulty: row.accessnotes || 'Standard',
    photos_taken: 'Yes',
    urgency_level: row.priority || 'Standard',
    ridge_condition: row.pointing || '',
    valley_condition: row.valleyIrons || '',
    tile_condition: row.brokenTiles?.toString() || '',
    gutter_condition: row.guttersDownpipes || '',
    flashing_condition: row.flashings || '',
    leak_status: row.internalLeaks || '',
    inspector_notes: row.overallConditionNotes || '',
    safety_notes: row.accessNotes || '',
    date: row.date,
    time: row.time,
    inspector: row.inspector,
    // Measurements
    roof_area_m2: row.roofArea || undefined,
    ridge_length_lm: row.ridgeCaps || undefined,
    valley_length_lm: undefined, // Not stored separately in old schema
    gutter_length_lm: row.gutterPerimeter || undefined,
    tile_count: row.brokenTiles || undefined,
    roof_pitch: row.roofPitch || '',
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
  inspectionReportId?: string
): Omit<QuoteRow, 'id'> {
  const pricing = calculateTotalPricing(scopeItems);
  const now = new Date().toISOString();
  const quoteNumber = generateQuoteNumber();

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
    client_name: inspectionData.client_name || 'Unknown',
    phone: inspectionData.phone || 'Not Provided',
    email: inspectionData.email || null,
    site_address: inspectionData.address || 'Not Provided',
    suburb_postcode: inspectionData.suburb || 'Not Provided',
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
    tier_level: 'standard',
    tier_profile: null,
    status: 'draft',
    draft: true,
    created_at: now,
    updated_at: now,
    sent_at: null,
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
