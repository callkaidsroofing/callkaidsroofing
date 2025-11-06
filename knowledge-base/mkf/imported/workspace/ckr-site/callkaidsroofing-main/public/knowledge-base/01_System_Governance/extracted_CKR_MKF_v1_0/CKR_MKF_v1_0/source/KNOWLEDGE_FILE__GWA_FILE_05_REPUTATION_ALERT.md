KNOWLEDGE FILE: GWA_FILE_05_REPUTATION_ALERT.md
| GWA ID: GWA-05 | GWA Name: Reputation Management Alert |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Marketing | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To immediately detect, triage, and prepare a professional response to a negative online review, providing the CKR team with the tools and information needed to mitigate public brand damage in near real-time.
1.2. Trigger Mechanism
 * Primary Trigger: This GWA is designed for autonomous operation. It is triggered when an automated scan detects a new review for Call Kaids Roofing on Google with a rating of 1 or 2 stars.
 * Manual Trigger: A user can command, "Negative review alert," or "Run GWA-05 on this review," and provide the text.
1.3. Success Metrics
 * Detection-to-Alert Time: < 15 minutes from review posting to CKR manager receiving a critical alert.
 * Response Quality: The drafted response perfectly adheres to the A-P-A formula in KF_06.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: reputationAlertAgent
2.2. Required Tools:
 * @Utilities (Web scraping or Google Alerts API)
 * @Google Drive (Search client database)
 * @Gmail or a chat integration via GWA-14 (for sending critical alerts)
2.3. Input Schema:
 * { "reviewText": "string", "reviewerName": "string", "reviewRating": "integer" }
2.4. Output Schema:
 * { "status": "Success", "alertSent": "boolean", "matchedClient": { "clientName": "string", "jobId": "string" }, "draftResponse": "string" }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive review data as input.
 * IMMEDIATE ALERT: The first action is to generate a CRITICAL PRIORITY alert for the CKR manager. The alert contains the full review text, the star rating, and the reviewer's name. This is sent via the most immediate channel (e.g., a direct push notification or a message to a dedicated Slack channel via GWA-14).
 * TOOL CALL (@Google Drive): Perform a search across the entire client database (including archived jobs) for a name matching the reviewerName.
 * CONTEXT ASSEMBLY:
   * IF a client match is found, retrieve the jobId and a direct link to their project folder.
   * ELSE, note that no matching client was found in the database.
 * RESPONSE GENERATION: Access KF_06 for the master A-P-A (Acknowledge, Promise Action, take offline) template for negative reviews.
 * DRAFTING: Pass the context and template to the Generative Core to draft a professional, empathetic, and non-defensive public response.
 * END: Present the draft response to the user for immediate review and posting, along with the results of the client database search.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_06 (for the A-P-A response template).
 * Downstream GWA Triggers: None.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | Reviewer name does not match any client record. | Proceed with the workflow. The draft response and internal alert will clearly state: "Warning: Reviewer name does not match any client in the database." |
