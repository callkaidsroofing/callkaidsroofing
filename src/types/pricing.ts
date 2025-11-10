export interface PricingFileInfo {
  fileId: string;
  version: string;
  description: string;
  lastUpdated: string;
  currency: string;
}

export interface FinancialConstants {
  constantsId: string;
  materialMarkup: {
    value: number;
    description: string;
  };
  contingency: {
    value: number;
    description: string;
  };
  profitMargin: {
    value: number;
    description: string;
  };
  gst: {
    value: number;
    description: string;
  };
  lastUpdated: string;
}

export interface SupplierInfo {
  preferredSupplier: string;
  supplierCode: string | null;
}

export interface VersionHistory {
  date: string;
  cost: number;
}

export interface PricingItem {
  itemId: string;
  itemName: string;
  itemCategory: string;
  unitOfMeasure: string;
  baseCost: number;
  supplierInfo: SupplierInfo;
  usageNotes: string;
  qualityTier: string;
  versionHistory: VersionHistory[];
}

export interface PricingModel {
  fileInfo: PricingFileInfo;
  financialConstants: FinancialConstants;
  labour: PricingItem[];
  tileMaterials: PricingItem[];
  metalMaterials: PricingItem[];
  paintAndCoatings: PricingItem[];
  overheadsAndRepairs: PricingItem[];
}

export type PricingCategory = 
  | 'labour' 
  | 'tileMaterials' 
  | 'metalMaterials' 
  | 'paintAndCoatings' 
  | 'overheadsAndRepairs';

export const categoryLabels: Record<PricingCategory, string> = {
  labour: 'Labour',
  tileMaterials: 'Tile Materials',
  metalMaterials: 'Metal Materials',
  paintAndCoatings: 'Paint & Coatings',
  overheadsAndRepairs: 'Overheads & Repairs'
};
