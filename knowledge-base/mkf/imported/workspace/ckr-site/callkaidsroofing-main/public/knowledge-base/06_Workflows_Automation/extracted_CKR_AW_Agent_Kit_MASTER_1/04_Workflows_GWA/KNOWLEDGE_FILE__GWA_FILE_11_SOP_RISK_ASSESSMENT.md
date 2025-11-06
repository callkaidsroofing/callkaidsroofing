KNOWLEDGE FILE: GWA_FILE_11_SOP_RISK_ASSESSMENT.md
| GWA ID: GWA-11 | GWA Name: SOP Risk Advisor |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Operations | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To fulfill the advanced safety and quality mandate of Directive Epsilon by proactively analyzing real-time external conditions (weather, supply chain) and, when necessary, generating formal proposals for temporary, risk-mitigating modifications to Standard Operating Procedures.
1.2. Trigger Mechanism
 * Primary Trigger: This is an autonomous workflow that runs as a core component of Mandate A: Daily Operational Briefing, specifically after the weather and supply chain data has been retrieved.
1.3. Success Metrics
 * Risk Detection: Successfully identifies 100% of predefined risk conditions (e.g., heatwave, high winds, key material shortage).
 * Proposal Quality: Generated proposals are clear, actionable, and correctly reference the affected SOP.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: sopRiskAssessmentAgent
2.2. Required Tools:
 * @Utilities (Weather APIs, Web Scrapers for supplier news)
 * @Google Drive (Read access to all SOP files)
2.3. Input Schema:
 * { "weatherData": { ... }, "supplyChainAlerts": [ ... ] }
2.4. Output Schema:
 * { "proposals": [ { "proposalTitle": "string", "proposalText": "string" } ] }
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive the latest weather and supply chain data as input.
 * RISK MATRIX ANALYSIS: Programmatically compare the input data against a predefined risk matrix.
   * IF weatherData.temperature > 35°C THEN risk = "HEAT_PAINT_FAIL".
   * IF weatherData.wind_speed > 40km/h THEN risk = "WIND_SAFETY_HAZARD".
   * IF supplyChainAlerts.itemId == "MAT_TILE_FLEXPOINT_10L" THEN risk = "POINTING_MARGIN_RISK".
 * SOP MAPPING: If a risk is identified, retrieve the corresponding SOP file(s) that are affected (e.g., HEAT_PAINT_FAIL maps to KF_04/SOP-M3).
 * PROPOSAL GENERATION: For each identified risk:
   * Pass the full text of the affected SOP and a description of the risk to the Generative Core.
   * Prompt it to: "Generate a formal 'Dynamic SOP Adaptation Proposal'. State the condition, the affected SOP, the risk of inaction, a specific and temporary modification to the procedure, and a clear expiration condition."
 * ASSEMBLY: Collect all generated proposals into a list.
 * END: Return the final JSON output containing the list of proposals, ready to be embedded in the Daily Operational Briefing. If no risks are found, the list will be empty.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_03, KF_04, KF_05 (the master SOP documents).
 * Downstream GWA Triggers: None. The output is consumed by the Mandate A briefing process.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 1 | The weather API fails to return data. | Skip the risk assessment for weather. Add a warning to the Daily Briefing: "Weather data is currently unavailable. Please perform manual checks." |
