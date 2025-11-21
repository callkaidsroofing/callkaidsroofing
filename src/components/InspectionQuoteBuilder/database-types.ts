/**
 * Database types for InspectionQuoteBuilder
 * These match the Supabase schema exactly
 */

export interface DatabaseLineItem {
  description: string;
  area?: string;
  quantity: number;
  unit: string;
  priority?: 'Must Do' | 'Recommended' | 'Optional';
  labour_cost: number;
  material_cost: number;
  markup_percent: number;
  notes?: string;
  subtotal: number;
  gst: number;
  total: number;
}

export interface DatabaseInspectionReport {
  id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  site_address: string;
  suburb?: string;
  property_type?: string;
  roof_type?: string;
  roof_material?: string;
  roof_age?: number;
  roof_area_sqm?: number;
  ridge_length_lm?: number;
  valley_length_lm?: number;
  gutter_length_lm?: number;
  tile_count?: number;
  roof_pitch?: string;
  condition_ridge?: string;
  condition_valleys?: string;
  condition_tiles?: string;
  condition_gutters?: string;
  condition_flashing?: string;
  condition_leaks?: boolean;
  inspector_notes?: string;
  safety_notes?: string;
  status: 'draft' | 'completed' | 'submitted';
  inspection_date?: string;
  inspection_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseQuote {
  id?: string;
  inspection_report_id?: string;
  quote_number?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  site_address: string;
  document_type?: 'multi_option' | 'simple';
  primary_service?: string;
  line_items: DatabaseLineItem[];
  subtotal: number;
  gst: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
  valid_until?: string;
}

/**
 * Type guard to validate DatabaseLineItem
 */
export function isDatabaseLineItem(item: any): item is DatabaseLineItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.description === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unit === 'string' &&
    typeof item.labour_cost === 'number' &&
    typeof item.material_cost === 'number' &&
    typeof item.markup_percent === 'number' &&
    typeof item.subtotal === 'number' &&
    typeof item.gst === 'number' &&
    typeof item.total === 'number'
  );
}

/**
 * Safely parse line items from database
 */
export function parseLineItems(data: unknown): DatabaseLineItem[] {
  if (!Array.isArray(data)) {
    console.warn('Line items is not an array:', data);
    return [];
  }

  return data.filter((item): item is DatabaseLineItem => {
    const isValid = isDatabaseLineItem(item);
    if (!isValid) {
      console.warn('Invalid line item structure:', item);
    }
    return isValid;
  });
}
