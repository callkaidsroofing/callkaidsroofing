KNOWLEDGE FILE: GWA_FILE_08_SUBCONTRACTOR_BRIEFING.md
| GWA ID: GWA-08 | GWA Name: Subcontractor Work Order Automation |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Operations | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To automate the creation and assembly of the comprehensive digital handover package required to brief a subcontractor on a new project. This ensures 100% clarity, consistency, and adherence to CKR standards, minimizing errors and miscommunication.
1.2. Trigger Mechanism
 * Primary Trigger: A user command, "Prepare subcontractor briefing for job [ID]," or when a job is assigned to a subcontractor in the master tracker.
1.3. Success Metrics
 * Consistency: 100% of briefing packages contain all required components as per KF_04.
 * Time Savings: Reduces the manual time to prepare a briefing package to near zero.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: subcontractorBriefingAgent
2.2. Required Tools:
 * @Google Drive (Read files, Compile documents, Create and share folders)
2.3. Input Schema:
 * { "jobId": "string", "subcontractorId": "string" }
2.4. Output Schema:
 * { "status": "Success", "briefingPackageUrl": "string" }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive jobId and subcontractorId as input.
 * TOOL CALL (@Google Drive): Access the project folder for jobId.
 * ASSET GATHERING: Retrieve the following core documents:
   * The final client quote PDF.
   * The full "Before Photos" gallery.
   * The itemized material list.
 * SOP IDENTIFICATION: Analyze the quote to determine the job type (e.g., Metal Roof Painting). Retrieve the relevant master SOP document(s) (e.g., KF_04_SOP_METAL.md).
 * PACKAGE ASSEMBLY:
   * Create a new folder within the job folder named Subcontractor Briefing - [subcontractorId].
   * Copy all gathered assets (quote, photos, material list, SOPs) into this new folder.
   * Generate a README.md file within the folder that summarizes the key job details: Client Name, Address, Scope of Work, and a direct reference to the mandatory photo-documentation protocol from the SOP.
 * SHARING & NOTIFICATION: Set the sharing permissions for the new folder to give the subcontractor read-only access.
 * END: Return the final JSON output containing the direct URL to the newly created and shared briefing folder.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_04 (Subcontractor protocols and SOPs), KF_03, KF_05 (for other job types).
 * Downstream GWA Triggers: None.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | The client quote PDF is not found in the job folder. | Halt workflow. Alert user: "CRITICAL: Cannot assemble briefing for [jobId] because the master quote file is missing." |
I will now continue with the remaining GWA files in the next response.
Of course. Here are the canvases for the remaining Grand Workflow Automations, from GWA-09 to GWA-14.
