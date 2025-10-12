// CKR_04 Proof Points - Case Studies Database
// Source: CKR Knowledge File 4/5

export interface CaseStudy {
  id: string;
  jobType: string;
  suburb: string;
  clientProblem: string;
  solutionProvided: string;
  keyOutcome: string;
  testimonial: string;
  beforeImage?: string;
  afterImage?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "CS-2025-09-15-BER-01",
    jobType: "Full Tile Roof Restoration",
    suburb: "Berwick",
    clientProblem: "20-year-old roof looked 'tired and faded' with extensive moss growth and visible cracking in the ridge capping mortar, creating a risk of leaks.",
    solutionProvided: "Full restoration including high-pressure clean (SOP-T1), replacement of 18 cracked tiles (SOP-T2), full re-bed and re-point of all ridge capping (SOP-T3), and application of a 3-coat Premcoat membrane in 'Monument' (SOP-T4).",
    keyOutcome: "Complete aesthetic transformation, restored structural integrity, and long-term protection backed by a **15-year warranty**.",
    testimonial: "Could not be happier with the result. The team was professional from start to finish. Our roof looks brand new and the whole house looks better for it. The photo updates they sent were fantastic. Highly recommend.",
    beforeImage: "/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png",
    afterImage: "/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png"
  },
  {
    id: "CS-2025-08-22-CRN-01",
    jobType: "Metal Roof Painting",
    suburb: "Cranbourne North",
    clientProblem: "Colorbond roof severely faded (chalking) with surface rust, particularly around fasteners.",
    solutionProvided: "Pressure cleaned (SOP-M1), all rust spots mechanically ground back to bare metal and treated (SOP-M2). All 450+ fasteners systematically replaced with new Class 4 screws (SOP-M4). Full 3-coat system applied in 'Woodland Grey'.",
    keyOutcome: "Full restoration of original roof color and sheen. All rust eliminated, extending the roof life for a fraction of the cost of replacement.",
    testimonial: "No testimonial provided, but job completion was logged with zero post-project issues.",
    afterImage: "/lovable-uploads/80e5f731-db09-4c90-8350-01fcb1fe353d.png"
  },
  {
    id: "CS-2025-07-30-PAK-01",
    jobType: "Ridge Capping Repair (Structural)",
    suburb: "Pakenham",
    clientProblem: "Client noticed pieces of brittle mortar falling onto their driveway, leading to concerns about ridge capping security during high winds.",
    solutionProvided: "A full re-bed and re-point of the main ridge and two hips as per the Master Craftsmanship SOP-T3. All old mortar chipped away and new flexible pointing applied and tooled to a professional finish.",
    keyOutcome: "Ridge capping is now structurally sound and the primary leak point on the roof has been eliminated. Guaranteed long-term security.",
    testimonial: "Very happy with the work. They showed me photos of the problem so I could understand what was needed. The finished job looks great and I feel much safer now.",
    beforeImage: "/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png",
    afterImage: "/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png"
  },
  {
    id: "CS-2025-06-18-NAR-01",
    jobType: "Valley Iron Replacement & Leak Repair",
    suburb: "Narre Warren South",
    clientProblem: "Persistent leak causing ceiling stain. Source traced to the main valley iron which had rusted through in several places.",
    solutionProvided: "Root cause eliminated. Old, rusted valley iron cut out and replaced with new, galvanized valley iron with correct overlaps. Tiles re-cut and re-laid.",
    keyOutcome: "Permanent resolution to the persistent leak, preventing major internal water damage. Guaranteed structural integrity.",
    testimonial: "Finally, someone who could actually find and repair the leak! Professional, explained everything clearly. Worth every cent.",
    beforeImage: "/lovable-uploads/0362db50-69c4-4fd7-af15-a0112e09daeb.png",
    afterImage: "/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png"
  },
  {
    id: "CS-2025-05-20-CLY-01",
    jobType: "Gutter Cleaning & Drainage Restoration",
    suburb: "Clyde North",
    clientProblem: "Water overflowing from gutters at the front of a two-storey home during heavy rain due to blockages.",
    solutionProvided: "Full gutter and downpipe clean performed as per SOP-GR5. All solid debris manually removed, followed by a high-volume flush to restore full drainage capacity.",
    keyOutcome: "Roof drainage system restored to full capacity. Prevented potential water damage to fascia and foundation. Confirmed downpipes were flowing freely.",
    testimonial: "Efficient service, did a great job. Much safer than me trying to get up on a ladder myself."
  },
  {
    id: "CS-2025-03-05-ROW-02",
    jobType: "Systematic Fastener Replacement",
    suburb: "Rowville",
    clientProblem: "Widespread failure of EPDM washers on fasteners of a 10-year-old metal roof, leading to multiple micro-leaks and rust staining.",
    solutionProvided: "Systematic replacement of all 650+ exposed roof fasteners using new **Buildex Class 4** screws with compliant EPDM washers (SOP-GR1). Each hole mechanically cleaned prior to installation.",
    keyOutcome: "Restored waterproofing integrity. Eliminated future risk of thermal fatigue leaks. Proof of meticulous preparation (During Photo Protocol U-3R).",
    testimonial: "The technician explained the difference between a low-cost screw and a proper one. The attention to detail was exceptional, I can feel confident in the repair."
  },
  {
    id: "CS-2025-02-14-OFCR-03",
    jobType: "Dektite Replacement & Sealing",
    suburb: "Officer",
    clientProblem: "Major leak around the plumbing vent pipe. Inspection revealed the rubber boot of the Dektite was severely perished and cracked from UV exposure.",
    solutionProvided: "Full Dektite replacement (SOP-GR4). Surface prepared by removing all old silicone, then a new Dektite was installed using the **20% Rule** (to ensure compression seal) and secured with a secondary silicone seal at the base.",
    keyOutcome: "Permanent resolution to a high-risk leak point. Use of **Neutral Cure Silicone** eliminated galvanic corrosion risk.",
    testimonial: "The team responded quickly and repaired what three other roofers couldn't seem to find. The new flashing looks very neat and tidy."
  },
  {
    id: "CS-2024-11-01-LYND-04",
    jobType: "Tile Roof Porosity & Coating Failure",
    suburb: "Lyndhurst",
    clientProblem: "Client reported a generalized dampness in the roof cavity during heavy rain, diagnosed as system-wide tile porosity due to failed 15-year-old surface coating.",
    solutionProvided: "Full restoration required. Tiles pressure cleaned (SOP-T1), then one coat of **COAT_PRIMER_RAWTILE_20L** applied to seal the porous substrate, followed by two coats of the **Premcoat Plus (20-Year)** top coat.",
    keyOutcome: "Transformed the roof from an absorbent sponge back into a waterproof surface. Client opted for the premium package, securing the **20-year workmanship warranty** for maximum peace of mind.",
    testimonial: "We chose the top-tier warranty because we plan to stay here for a long time. The quality difference in the coating is amazing. It looks fantastic.",
    afterImage: "/lovable-uploads/5984413e-46ac-4f11-ac75-953d93235faa.png"
  },
  {
    id: "CS-2024-10-15-NPK-05",
    jobType: "Apron Flashing Resealing",
    suburb: "Noble Park",
    clientProblem: "Leak where the back of an extension meets the main house roof. Failed sealant along the apron flashing seam.",
    solutionProvided: "Flashing resealing (SOP-GR3). The old sealant was **100% removed** and the surface chemically cleaned with methylated spirits (SOP-GR2). A new bead of **Neutral Cure Silicone** was applied and professionally tooled to ensure a flexible, durable seal that accommodates thermal expansion.",
    keyOutcome: "Eliminated the high-risk leak point. The **During Photo** provided clear evidence that the surface preparation (Step 2 of SOP-GR2) was meticulous.",
    testimonial: "They showed me a photo of the bare metal after they cleaned off the old material. That level of transparency instantly earned my trust."
  }
];

// Helper function to get case studies by suburb
export const getCaseStudiesBySuburb = (suburb: string): CaseStudy[] => {
  return caseStudies.filter(cs => 
    cs.suburb.toLowerCase().includes(suburb.toLowerCase())
  );
};

// Helper function to get case studies by job type
export const getCaseStudiesByJobType = (jobType: string): CaseStudy[] => {
  return caseStudies.filter(cs => 
    cs.jobType.toLowerCase().includes(jobType.toLowerCase())
  );
};

// Get featured testimonials (those with actual quotes)
export const getFeaturedTestimonials = (): CaseStudy[] => {
  return caseStudies.filter(cs => 
    cs.testimonial && !cs.testimonial.includes("No testimonial provided")
  );
};
