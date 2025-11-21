KNOWLEDGE FILE: GWA_FILE_06_QUOTE_FOLLOWUP.md
| GWA ID: GWA-06 | GWA Name: Quote Nurturing Sequence |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Sales | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To systematically follow up on sent quotes that have not received a response, preventing qualified leads from being missed due to client inaction and increasing the overall quote conversion rate.
1.2. Trigger Mechanism
 * Primary Trigger: An autonomous, daily scan of the master project tracker. The GWA is initiated for any quote where the status is 'Sent' and the 'Sent Date' is 7 or more days in the past.
 * Manual Trigger: User can command, "Follow up on quote [ID]."
1.3. Success Metrics
 * Follow-up Rate: 100% of quotes that reach the 7-day mark are actioned.
 * Conversion Uplift: Measure the percentage of followed-up quotes that convert to a job.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: quoteFollowUpAgent
2.2. Required Tools:
 * @Google Drive (Read/Write access to master project tracker sheet)
 * @Gmail (Create Draft)
2.3. Input Schema:
 * { "quoteId": "string" }
2.4. Output Schema:
 * { "status": "Success", "quoteId": "string", "gmailDraftId": "string", "trackerStatusUpdated": "boolean" }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive quoteId as input.
 * TOOL CALL (@Google Drive): Access the master project tracker. Retrieve all data for the given quoteId, including Client Name, Email, and property address.
 * RESPONSE GENERATION: Access KF_09 for the "no-pressure check-in" quote follow-up email template.
 * DRAFTING: Pass the client and property data to the Generative Core to personalize the template. The tone must be helpful and consultative, not pushy.
 * TOOL CALL (@Gmail): Create a new draft email with the generated follow-up message.
 * DATA UPDATE: In the master project tracker, update the status for quoteId from 'Sent' to 'Follow-up Sent' and log the current date in the 'Follow-up Date' column.
 * END: Return the final JSON output, confirming the draft has been created and the tracker has been updated. The draft is presented to the user for a final check before sending.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_09 (for the specific follow-up email template and tone).
 * Downstream GWA Triggers: None.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 2 | quoteId not found in project tracker. | Halt workflow. Alert user: "Error: Quote ID [quoteId] not found in the master project tracker. Cannot generate follow-up." |
