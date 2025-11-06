KNOWLEDGE FILE: GWA_FILE_13_LEAD_NURTURE.md
| GWA ID: GWA-13 | GWA Name: Lead Nurture Assistant |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Sales | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To process an ongoing conversation with a potential lead, provide a concise summary of the key points, and prepare the next logical follow-up action to intelligently nurture the lead towards a quote.
1.2. Trigger Mechanism
 * Primary Trigger: Invoked exclusively by GWA-12: Intelligent Triage & Dispatch when it classifies an input file or screenshot as a lead_conversation.
1.3. Success Metrics
 * Summary Quality: The generated summary accurately captures the lead's main concerns and current stage in the sales funnel.
 * Action Relevance: The suggested next action (e.g., draft email, create task) is the most logical next step in the sales process.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: leadNurtureAgent
2.2. Required Tools:
 * @Gmail (Create Draft)
 * @Utilities (Task management system API)
2.3. Input Schema:
 * { "conversationText": "string", "clientName": "string" }
2.4. Output Schema:
 * { "status": "Action Prepared", "leadSummary": "string", "suggestedAction": { "actionType": "string (e.g., 'DRAFT_EMAIL', 'CREATE_TASK')", "actionId": "string" } }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive conversationText and clientName from GWA-12.
 * SUMMARIZATION: Pass the full conversationText to the Generative Core. Prompt it to: "Summarize the following sales conversation. Identify the client's primary pain points, key questions, any stated objections (especially regarding price), and their overall sentiment. Output a concise, bullet-pointed summary."
 * NEXT-ACTION DETERMINATION: Pass the generated summary to the Generative Core. Prompt it to: "Based on this summary, determine the single most effective next action to move this lead forward. Choose from: DRAFT_EMAIL or CREATE_TASK. If the next step is a simple response, choose email. If it requires a phone call or a research action, choose task."
 * CONDITIONAL ACTION:
   * IF the determined action is DRAFT_EMAIL, generate the email content based on the conversation context (e.g., answering their specific question about warranties) and create a draft using the @Gmail tool.
   * IF the determined action is CREATE_TASK, generate the task details (e.g., "Call [Client Name] to discuss their concerns about project timelines. Key points to cover: ...") and create the task using the @Utilities tool.
 * END: Return the final JSON output, providing the conversation summary and confirming the suggested action that has been prepared.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_09 (for email tone and structure), KF_01 (for brand principles).
 * Upstream GWA: This GWA is almost always triggered by GWA-12.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 2 | The conversation text is too short or lacks context for a meaningful summary. | Halt workflow. Create a simple task for the user: "Review conversation with [Client Name]. The context was insufficient for automated analysis. Please determine the next step manually." |
