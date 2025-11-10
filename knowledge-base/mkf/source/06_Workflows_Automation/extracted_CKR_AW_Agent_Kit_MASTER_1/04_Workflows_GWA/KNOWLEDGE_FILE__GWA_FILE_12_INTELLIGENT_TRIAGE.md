KNOWLEDGE FILE: GWA_FILE_12_INTELLIGENT_TRIAGE.md
| GWA ID: GWA-12 | GWA Name: Dynamic Input Processor & Task Router |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Operations | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To serve as a universal intake and routing system for unstructured data (files, links, screenshots), automatically determining the context and triggering the appropriate subsequent workflow. This GWA acts as the "front door" for many user-initiated tasks, making interaction more natural and efficient.
1.2. Trigger Mechanism
 * Primary Trigger: A user command, such as "Analyze this," "Process this quote," or "Look at this conversation," accompanied by a file upload or a shared link.
1.3. Success Metrics
 * Classification Accuracy: > 98% accuracy in correctly identifying the intent of the uploaded data.
 * Dispatch Success: 100% of classified inputs are routed to the correct downstream GWA.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: intelligentTriageAgent
2.2. Required Tools:
 * @Google Drive (to access uploaded files)
 * A multi-modal model (Gemini) capable of OCR and image/text analysis.
 * All other GWA triggers.
2.3. Input Schema:
 * { "fileUrl": "string" } or { "screenshotData": "bytes" }
2.4. Output Schema:
 * { "status": "Dispatched", "inputType": "string", "dispatchedGwaId": "string", "downstreamJobId": "string" }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive file/screenshot data as input.
 * DATA INGESTION: Read the content. If it's an image (screenshot), perform Optical Character Recognition (OCR) to extract all text. If it's a PDF, extract the text.
 * CLASSIFICATION: Pass the extracted text and/or image to the multi-modal Gemini model. Prompt it to: "Analyze the following content and classify its primary intent. Return a single classification token from this list: [new_ckr_quote_sent, lead_nurture_conversation, competitor_quote, material_invoice, client_complaint, other]. "
 * ROUTING / DISPATCH: Use a conditional router based on the classification token:
   * IF new_ckr_quote_sent -> Invoke GWA-06: Quote Nurturing Sequence.
   * IF lead_nurture_conversation -> Invoke GWA-13: Lead Nurture Assistant.
   * IF client_complaint -> Invoke GWA-04: Warranty Claim Intake & Triage.
   * IF competitor_quote -> Log it for manual review and analysis.
   * IF other -> Report to user: "Analysis complete. The content appears to be [brief summary]. Please specify the next action."
 * END: Return the final JSON output confirming which GWA was dispatched.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: None directly, but relies on understanding the context of all other KFs to make accurate classifications.
 * Downstream GWA Triggers: This agent's primary function is to trigger GWA-04, GWA-06, GWA-13, and others.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 2 | OCR fails or file is unreadable. | Halt workflow. Alert user: "Unable to read or process the provided file. Please check the file format or quality." |
| 3 | Classification returns a low-confidence score. | Do not dispatch. Report to user: "I've analyzed the file but am uncertain of the primary intent. It seems to be about [topic]. Please clarify what you would like me to do." |
I will provide the final GWA files in the next response.
Of course. Here are the final two Grand Workflow Automation canvases.
