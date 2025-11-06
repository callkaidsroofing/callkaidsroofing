KNOWLEDGE FILE: GWA_FILE_07_CASE_STUDY_DRAFTING.md
| GWA ID: GWA-07 | GWA Name: Proof Package Assembly |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Marketing | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To assist in the creation of new, structured case studies for KF_08 by automatically gathering, consolidating, and formatting all relevant data from a completed job, significantly reducing the manual effort required to build marketing assets.
1.2. Trigger Mechanism
 * Primary Trigger: A user command, such as "Create a case study draft for job [ID]," or "Run GWA-07 for the latest Berwick job."
 * Secondary Trigger: Can be suggested as an optional next step after GWA-03: Project Closeout is completed for a noteworthy project.
1.3. Success Metrics
 * Time Savings: Reduces the time to create a case study draft by over 90%.
 * Data Completeness: The generated draft correctly pulls all required fields (narrative, photos, materials, testimonial).
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: caseStudyDraftingAgent
2.2. Required Tools:
 * @Google Drive (Read from archived project folders)
2.3. Input Schema:
 * { "jobId": "string" }
2.4. Output Schema:
 * { "status": "Draft Ready", "caseStudyId": "string", "draftJson": { ... } }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive jobId as input.
 * TOOL CALL (@Google Drive): Locate the project folder for jobId within the Completed Jobs/ archive.
 * DATA RETRIEVAL: Systematically retrieve the following assets from the folder:
   * Job details (Suburb, Job Type, Date) from a project info file.
   * Client testimonial from any feedback emails saved in the folder.
   * List of materials used from the original quote file.
   * Filenames of all images in the "Before Photos" and "After Photos" sub-folders.
 * NARRATIVE GENERATION: Access the original quote and any job notes. Pass this information to the Generative Core to draft the clientProblem, diagnosticFindings, and solutionProvided narrative sections, adhering to the style in KF_08.
 * JSON ASSEMBLY: Structure all retrieved and generated data into the strict JSON format required by KF_08_CASE_STUDIES.json.
 * VALIDATION: Programmatically validate the generated JSON to ensure it matches the required schema (e.g., all required fields are present, arrays are correctly formatted).
 * END: Return the final JSON object to the user as a complete, ready-to-review draft. Present it within a code block for easy copying.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_08 (for the JSON schema and as a source of style examples for the narrative), KF_02 (to validate material item IDs).
 * Downstream GWA Triggers: None.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | A required asset (e.g., "After Photos" folder, testimonial) is missing. | Continue workflow but populate the missing field in the JSON with a placeholder like "clientTestimonial": "NULL - Awaiting client feedback.". Add a warning to the final output highlighting the missing data. |
| 5 | Generated JSON fails validation. | Halt workflow. Report error to the user: "Failed to generate valid JSON for case study. Please review job data for [jobId] for inconsistencies." |
