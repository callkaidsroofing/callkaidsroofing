// JSON Parser for Schema and Configuration Files
export async function parseJSON<T = unknown>(filePath: string): Promise<T | null> {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error parsing JSON from ${filePath}:`, error);
    return null;
  }
}

export interface MKFIndex {
  files: {
    id: string;
    name: string;
    description: string;
    version: string;
    lastUpdated: string;
  }[];
}

export interface CaseStudySchema {
  uid: string;
  title: string;
  service: string;
  location: string;
  completedDate: string;
  beforeImages: string[];
  afterImages: string[];
  description: string;
  results: Record<string, string>;
  testimonial: string;
}

export interface QuoteSchema {
  uid: string;
  leadUID: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  gst: number;
  total: number;
  validUntil: string;
}

export async function parseMKFIndex(): Promise<MKFIndex | null> {
  return parseJSON<MKFIndex>('/knowledge-base/mkf_index.json');
}

export async function parseCaseStudySchema(): Promise<CaseStudySchema | null> {
  return parseJSON<CaseStudySchema>('/knowledge-base/mkf_case_study_schema.json');
}

export async function parseQuoteSchema(): Promise<QuoteSchema | null> {
  return parseJSON<QuoteSchema>('/knowledge-base/mkf_quote_schema.json');
}