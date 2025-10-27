import { z } from "zod";

// ============= Zod Schemas =============

export const LabourSchema = z.object({
  code: z.string(),
  description: z.string(),
  unit: z.string(),
  baseCost: z.number().nonnegative(),
  validFrom: z.string().optional(),
  validTo: z.string().nullable().optional()
});

export const MaterialSchema = z.object({
  code: z.string(),
  description: z.string(),
  unit: z.string(),
  baseCost: z.number().nonnegative(),
  yield: z.object({ 
    unit: z.string(), 
    value: z.number().positive() 
  }).optional()
});

export const ServiceSchema = z.object({
  serviceCode: z.string(),
  category: z.string(),
  displayName: z.string(),
  unit: z.string(),
  roofType: z.array(z.string()).optional(),
  composition: z.object({
    labour: z.record(z.number()).optional(),
    materials: z.record(z.number()).optional()
  }).optional(),
  baseRate: z.number().nonnegative().optional(),
  addOnRate: z.number().nonnegative().optional(),
  timePerUnitHr: z.number().nonnegative().optional(),
  defaultWarrantyYears: z.array(z.number()).optional(),
  allowanceDefault: z.number().optional(),
  metadata: z.record(z.any()).optional()
}).refine(s => s.baseRate !== undefined || s.addOnRate !== undefined, {
  message: "Service must have baseRate or addOnRate"
});

export const LogicSchema = z.object({
  calculationRules: z.object({
    sequence: z.array(z.string()),
    discountPolicies: z.object({
      promoMax: z.number().min(0).max(1),
      stacking: z.enum(["allowed", "disallowed"]),
      exemptServices: z.array(z.string())
    }),
    tierProfiles: z.record(z.object({
      warranty: z.string(),
      markup: z.number().positive()
    })),
    regionalModifiers: z.array(z.object({
      region: z.string(),
      uplift: z.number().positive()
    }))
  })
});

export const KF02Schema = z.object({
  KF_02_PRICING_MODEL: z.object({
    version: z.string(),
    currency: z.string(),
    constants: z.object({
      gstRate: z.number(),
      profitMarginTarget: z.number(),
      materialMarkup: z.number(),
      contingencyBuffer: z.number(),
      travelAllowancePerKm: z.number(),
      crewSizeDefault: z.number(),
      dayHours: z.number(),
      weatherRiskFactor: z.number(),
      roundTo: z.number(),
      freeRadiusKm: z.number()
    }),
    conversions: z.object({
      cap_effective_cover_mm_default: z.number(),
      caps_per_m_default: z.number(),
      waste: z.object({
        pointing: z.number(),
        mortar: z.number(),
        paint: z.number()
      })
    }),
    throughput: z.record(z.number()),
    labour: z.array(LabourSchema),
    materials: z.array(MaterialSchema),
    services: z.array(ServiceSchema),
    logic: LogicSchema,
    governance: z.object({
      author: z.string(),
      approvedDate: z.string(),
      nextReview: z.string(),
      changelog: z.array(z.string()),
      roles: z.object({
        approve: z.array(z.string()),
        edit: z.array(z.string()),
        read: z.array(z.string())
      })
    })
  })
});

// ============= Type Inference =============

export type KF02 = z.infer<typeof KF02Schema>;
export type Labour = z.infer<typeof LabourSchema>;
export type Material = z.infer<typeof MaterialSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Logic = z.infer<typeof LogicSchema>;

// ============= Parsing & Validation =============

export function parseKF02(json: unknown): KF02 {
  return KF02Schema.parse(json);
}

// ============= Calculation Helpers =============

export type Line = { code: string; qty: number; rate: number };
export type Totals = { exGST: number; GST: number; incGST: number };

/**
 * Calculate totals with GST and rounding
 * @param lines - Array of line items with code, quantity, and rate
 * @param gstRate - GST rate (e.g., 0.10 for 10%)
 * @param contingency - Contingency buffer (e.g., 0.05 for 5%)
 * @param roundTo - Round final total to nearest value (e.g., 5 for $5)
 */
export function calcTotals(
  lines: Line[], 
  gstRate: number, 
  contingency = 0, 
  roundTo = 5
): Totals {
  const ex = lines.reduce((s, l) => s + l.qty * l.rate, 0) * (1 + contingency);
  const gst = ex * gstRate;
  const incRaw = ex + gst;
  const inc = Math.round(incRaw / roundTo) * roundTo;
  return { 
    exGST: parseFloat(ex.toFixed(2)), 
    GST: parseFloat(gst.toFixed(2)), 
    incGST: inc 
  };
}

/**
 * Get service rate by service code
 * @param kf02 - Parsed KF_02 pricing model
 * @param serviceCode - Service code (e.g., "REPOINT_CAP")
 * @returns Base rate or add-on rate, or undefined if not found
 */
export function serviceRate(kf02: KF02, serviceCode: string): number | undefined {
  const s = kf02.KF_02_PRICING_MODEL.services.find(x => x.serviceCode === serviceCode);
  return s?.baseRate ?? s?.addOnRate;
}

/**
 * Get service by code
 * @param kf02 - Parsed KF_02 pricing model
 * @param serviceCode - Service code (e.g., "REPOINT_CAP")
 */
export function getService(kf02: KF02, serviceCode: string): Service | undefined {
  return kf02.KF_02_PRICING_MODEL.services.find(s => s.serviceCode === serviceCode);
}

/**
 * Get regional modifier by region name
 * @param kf02 - Parsed KF_02 pricing model
 * @param region - Region name (e.g., "Metro", "Outer-SE", "Rural")
 */
export function getRegionalModifier(kf02: KF02, region: string): number {
  const modifier = kf02.KF_02_PRICING_MODEL.logic.calculationRules.regionalModifiers.find(
    r => r.region === region
  );
  return modifier?.uplift ?? 1.0;
}

/**
 * Get tier profile markup
 * @param kf02 - Parsed KF_02 pricing model
 * @param tierProfile - Tier profile name (e.g., "REPAIR", "RESTORE", "PREMIUM")
 */
export function getTierMarkup(kf02: KF02, tierProfile: string): number {
  const profile = kf02.KF_02_PRICING_MODEL.logic.calculationRules.tierProfiles[tierProfile];
  return profile?.markup ?? 1.0;
}
