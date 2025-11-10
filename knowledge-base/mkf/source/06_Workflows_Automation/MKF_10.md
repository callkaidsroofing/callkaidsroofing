# Financial Reporting (GWA-10)

*Updated:* 31 Oct 2025

Operational summary imported from GWA file. See unabridged source below.

## Unabridged Source — KNOWLEDGE_FILE__GWA_FILE_10_FINANCIAL_REPORTING.md

```
KNOWLEDGE FILE: GWA_FILE_10_FINANCIAL_REPORTING.md
| GWA ID: GWA-10 | GWA Name: Financial Health Monitor |
|---|---|
| Version: 1.0 | Last Updated: 2025-10-08 |
| Owner: CKR Management | Status: Active |
SECTION 1: GWA OVERVIEW
1.1. Objective
To automate the generation of a monthly financial performance report, providing leadership with a clear, data-driven overview of profitability, quoting accuracy, and cost variances without the need for manual spreadsheet analysis.
1.2. Trigger Mechanism
 * Primary Trigger: An autonomous, scheduled trigger on the 2nd business day of each month to analyze the previous month's performance.
 * Manual Trigger: User can command, "Run the monthly financial report for September 2025."
1.3. Success Metrics
 * Accuracy: All financial calculations are 100% accurate based on the source data.
 * Insight Quality: The generated summary successfully identifies the most profitable job types and the largest cost variances.
SECTION 2: TECHNICAL SPECIFICATION (LangChain Agent)
2.1. Agent Name: financialReportingAgent
2.2. Required Tools:
 * @Google Drive (Read access to master project tracker and quote/invoice files)
 * GWA-14 (To potentially pull data from external accounting software like Xero)
2.3. Input Schema:
 * { "reportingMonth": "string (YYYY-MM)" }
2.4. Output Schema:
 * { "status": "Success", "reportMonth": "string", "reportUrl": "string" } (URL to a generated Google Doc/Sheet)
SECTION 3: LOGICAL WORKFLOW (CHAIN OF THOUGHT)
 * START: Receive reportingMonth as input.
 * TOOL CALL (@Google Drive): Scan the master project tracker and identify all jobs marked 'Complete' within the specified month.
 * DATA AGGREGATION: For each completed job, retrieve:
   * The final invoice amount (Total Revenue).
   * The itemized list of materials and labour from the original quote (Quoted Costs).
   * Any logged actual costs or variations.
 * COST CALCULATION: Using KF_02, look up the baseCost for every material and labour item to calculate the true cost of goods sold (COGS) for each job.
 * ANALYSIS:
   * Calculate Gross Profit and Profit Margin for each job (Revenue - COGS).
   * Calculate the average Profit Margin by Job Type (e.g., Tile Restoration, Metal Painting, Minor Repair).
   * Calculate the "Quoted vs. Actual Cost Variance" for each job and flag any variance greater than 10%.
 * REPORT GENERATION: Create a new Google Doc or Sheet. Structure the analyzed data with clear headings, tables, and charts. Use the Generative Core to write a high-level executive summary: "For [reportingMonth], a total of [X] jobs were completed. The most profitable service was [Job Type] with an average margin of [Y]%. The largest cost variance was found in [Job ID], which requires review."
 * END: Return the final JSON output, providing a direct link to the generated report.
SECTION 4: DEPENDENCIES & INTEGRATIONS
 * Required Knowledge Files: KF_02 (as the master source for all baseCost data).
 * Downstream GWA Triggers: This agent relies on GWA-14 if it needs to access external financial systems.
SECTION 5: ERROR HANDLING & FALLBACKS
| Step | Error Condition | Fallback Action |
|---|---|---|
| 3 | A completed job is missing its final invoice file. | Flag the job in the final report with a note: "Profitability could not be calculated for [Job ID] due to a missing final invoice." Continue processing other jobs. |

```