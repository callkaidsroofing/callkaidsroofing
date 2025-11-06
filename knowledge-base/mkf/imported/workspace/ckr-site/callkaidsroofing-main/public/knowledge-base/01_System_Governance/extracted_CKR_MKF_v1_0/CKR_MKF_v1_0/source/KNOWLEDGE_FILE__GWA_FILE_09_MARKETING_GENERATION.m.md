KNOWLEDGE FILE: GWA_FILE_09_MARKETING_GENERATION.md
| GWA ID: GWA-09 | GWA Name: Marketing Content Engine |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Marketing | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To generate timely, relevant, and proof-driven draft content for various marketing channels (e.g., Meta, Google Business Profile) by leveraging recently completed projects and approved marketing formulas, ensuring a consistent and high-quality content pipeline.
1.2. Trigger Mechanism
 * Primary Trigger: A user command, such as "Draft a Facebook post for job [ID]," or "Generate 3 ad variants for the Pakenham case study."
 * Secondary Trigger: Can be initiated as a final step of GWA-03: Project Closeout.
1.3. Success Metrics
 * Variant Quality: Generates three distinct and brand-aligned copy variants as per the KF_01 standard.
 * Content Relevance: The generated content accurately and persuasively reflects the details of the selected project.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: marketingContentAgent
2.2. Required Tools:
 * @Google Drive (Read from Completed Jobs archive and KF_08)
2.3. Input Schema:
 * { "jobId": "string", "channel": "string (e.g., Meta, GBP)" }
2.4. Output Schema:
 * { "status": "Drafts Ready", "channel": "string", "drafts": [ { "variant": "A", "copy": "string" }, { "variant": "B", "copy": "string" }, { "variant": "C", "copy": "string" } ], "suggestedImageUrl": "string" }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive jobId and target channel as input.
 * TOOL CALL (@Google Drive): Access the project folder for the specified jobId.
 * DATA RETRIEVAL: Retrieve the job's core details (Suburb, Job Type, Problem/Solution narrative) and select the most visually compelling "after" photo.
 * KNOWLEDGE RETRIEVAL: Access KF_06 to retrieve the core ad copy formulas (PAS, AIDA, BAB) and platform-specific templates.
 * RESPONSE GENERATION:
   * Variant 1 (PAS): Pass the job data and the PAS formula to the Generative Core. Prompt it to write compelling ad copy focusing on the Problem (clientProblem), Agitating it, and presenting our work as the Solution.
   * Variant 2 (AIDA): Pass the job data and the AIDA formula to the Generative Core. Prompt it to grab Attention (with the photo), build Interest (with process details), create Desire (with the outcome), and call to Action.
   * Variant 3 (Trust): Pass the job data and a trust-based angle to the Generative Core. Prompt it to write copy that emphasizes the warranty, our insured status, and the "Proof In Every Roof" philosophy.
 * ASSEMBLY: Compile the three generated copy variants and the URL of the suggested "after" photo into the final JSON output object.
 * END: Present the drafts to the user for review and posting.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_06 (for marketing formulas and templates), KF_08 (as a source for case study data), KF_01 (for brand rules).
 * Downstream GWA Triggers: None.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | Job data is incomplete (e.g., no clear narrative). | Halt workflow. Alert user: "Cannot generate marketing content for [jobId] because the project narrative is incomplete. Please update job notes." |
