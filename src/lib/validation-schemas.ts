import { z } from 'zod';

export const inspectionFormSchema = z.object({
  // Section 1: Job & Client Details
  clientName: z.string().min(1, 'Client name is required').max(100),
  phone: z.string().min(1, 'Phone is required').regex(/^(\+61|0)[2-9][0-9]{8}$|^04[0-9]{8}$/, 'Invalid Australian phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  siteAddress: z.string().min(1, 'Site address is required').max(200),
  suburbPostcode: z.string().min(1, 'Suburb/postcode is required').max(100),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  inspector: z.string().min(1, 'Inspector name is required').max(100),

  // Section 2: Roof Identification
  claddingType: z.string().min(1, 'Cladding type is required'),
  tileProfile: z.string().optional(),
  tileColour: z.string().optional(),
  ageApprox: z.string().optional(),

  // Section 3: Quantity Summary
  ridgeCaps: z.number().min(0).optional().nullable(),
  brokenTiles: z.number().min(0).optional().nullable(),
  gableLengthTiles: z.number().min(0).optional().nullable(),
  gableLengthLM: z.number().min(0).optional().nullable(),
  valleyLength: z.number().min(0).optional().nullable(),
  gutterPerimeter: z.number().min(0).optional().nullable(),
  roofArea: z.number().min(0).optional().nullable(),

  // Section 4: Condition Checklist (all optional as they have defaults)
  brokenTilesCaps: z.string().optional(),
  brokenTilesNotes: z.string().optional(),
  pointing: z.string().optional(),
  pointingNotes: z.string().optional(),
  valleyIrons: z.string().optional(),
  valleyIronsNotes: z.string().optional(),
  boxGutters: z.string().optional(),
  boxGuttersNotes: z.string().optional(),
  guttersDownpipes: z.string().optional(),
  guttersDownpipesNotes: z.string().optional(),
  penetrations: z.string().optional(),
  penetrationsNotes: z.string().optional(),
  internalLeaks: z.string().optional(),

  // Section 5: Photos
  brokentilesphoto: z.array(z.string()).optional(),
  pointingphoto: z.array(z.string()).optional(),
  valleyironsphoto: z.array(z.string()).optional(),
  boxguttersphoto: z.array(z.string()).optional(),
  guttersphoto: z.array(z.string()).optional(),
  penetrationsphoto: z.array(z.string()).optional(),
  leaksphoto: z.array(z.string()).optional(),
  beforedefects: z.array(z.string()).optional(),
  duringafter: z.array(z.string()).optional(),

  // Section 6: Recommended Works
  replacebrokentilesqty: z.number().min(0).optional().nullable(),
  replacebrokentilesnotes: z.string().optional(),
  rebedridgeqty: z.number().min(0).optional().nullable(),
  rebedridgenotes: z.string().optional(),
  flexiblerepointingqty: z.number().min(0).optional().nullable(),
  flexiblerepointingnotes: z.string().optional(),
  installvalleyclipsqty: z.number().min(0).optional().nullable(),
  installvalleyclipsnotes: z.string().optional(),
  replacevalleyironsqty: z.number().min(0).optional().nullable(),
  replacevalleyironsnotes: z.string().optional(),
  cleanguttersqty: z.number().min(0).optional().nullable(),
  cleanguttersnotes: z.string().optional(),
  pressurewashqty: z.number().min(0).optional().nullable(),
  pressurewashnotes: z.string().optional(),
  sealpenetrationsqty: z.number().min(0).optional().nullable(),
  sealpenetrationsnotes: z.string().optional(),
  coatingsystemqty: z.number().min(0).optional().nullable(),
  coatingsystemnotes: z.string().optional(),

  // Section 7: Materials & Specs
  pointingColour: z.string().optional(),
  beddingCementSand: z.string().optional(),
  specTileProfile: z.string().optional(),
  specTileColour: z.string().optional(),
  paintSystem: z.string().optional(),
  paintColour: z.string().optional(),
  flashings: z.string().optional(),
  otherMaterials: z.string().optional(),

  // Section 8: Safety & Access
  heightStoreys: z.string().optional(),
  roofPitch: z.string().optional(),
  safetyRailNeeded: z.boolean().optional(),
  accessNotes: z.string().optional(),

  // Section 9: Summary
  overallCondition: z.string().optional(),
  priority: z.string().optional(),
  overallConditionNotes: z.string().optional(),
  status: z.string().optional(),
});

export type InspectionFormData = z.infer<typeof inspectionFormSchema>;
