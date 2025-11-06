KNOWLEDGE FILE: GWA_FILE_03_PROJECT_CLOSEOUT.md
| GWA ID: GWA-03 | GWA Name: Project Closeout & Proof Package |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Operations | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To automate the critical post-job administrative and marketing tasks, ensuring a consistent and professional project completion experience for the client, while simultaneously capturing and preparing "proof" for marketing channels.
1.2. Trigger Mechanism
 * Primary Trigger: A user command, such as "Close out job [ID]," "Run GWA-03 for [Client Name]."
 * Autonomous Trigger: When a job's status is changed to 'Complete' in the master project tracker.
1.3. Success Metrics
 * Closeout Consistency: All five core actions (photo check, invoice email, GBP post, review request, archive) are completed for 100% of jobs.
 * Marketing Pipeline: Number of GBP posts drafted per week.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: projectCloseoutAgent
2.2. Required Tools:
 * @Google Drive (Read, Move/Archive Folder)
 * @Gmail (Create Draft, Schedule Send)
 * @Utilities (Google Business Profile API)
2.3. Input Schema:
 * { "jobId": "string" }
2.4. Output Schema:
 * { "status": "Success", "jobId": "string", "actionsCompleted": ["photo_verified", "invoice_drafted", "gbp_post_drafted", "review_request_scheduled", "folder_archived"] }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive jobId as input.
 * TOOL CALL (@Google Drive): Access the client's project folder in the "Active Jobs" directory.
 * VALIDATION: Verify that the folder contains a sub-folder named "After Photos" and that it contains at least one image file.
 * RESPONSE GENERATION (Invoice): Access KF_09 for the "Project Completion & Final Invoice" email template. Draft the email, attaching the final invoice PDF from the job folder and a curated selection of the best "after" photos.
 * TOOL CALL (@Gmail): Create a draft of the final invoice email.
 * RESPONSE GENERATION (GBP): Access KF_06 for the Google Business Profile post template. Generate a draft post including the suburb, service performed, and a high-quality "after" photo.
 * TOOL CALL (@Utilities): Save the generated text and photo as a draft post in the Google Business Profile dashboard.
 * RESPONSE GENERATION (Review): Access KF_06 for the "5-Star Review Request" email template.
 * TOOL CALL (@Gmail): Use the "Schedule Send" feature to queue the review request email to be sent to the client in 3 days' time.
 * TOOL CALL (@Google Drive): Move the entire project folder from Active Jobs/ to Completed Jobs/[Year]/[Month]/.
 * END: Return the final JSON output, confirming all closeout actions have been successfully executed.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_09 (Email Templates), KF_06 (Marketing Templates), KF_07 (Warranty Information), KF_08 (Job data can be used to trigger GWA-07).
 * Downstream GWA Triggers: Can trigger GWA-07: Case Study Generation Assistant.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | No "After Photos" found in the project folder. | Halt workflow. Create a high-priority task for the Project Manager: "CRITICAL: Job [jobId] marked complete but no 'After Photos' found. Cannot proceed with closeout. Please upload photos." |
