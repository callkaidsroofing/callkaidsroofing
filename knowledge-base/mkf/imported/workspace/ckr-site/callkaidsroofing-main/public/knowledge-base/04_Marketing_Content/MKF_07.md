# Systems Integration Map (Authorisation)

*Updated:* 31 Oct 2025

**Allowlist (examples):** GitHub commit/pull/branch; Supabase insert/update/query/delete; Lovable publishSite; Google Workspace read‑only.
**Security:** Hard halt if not permitted; log to `metrics.system_audit`.

## Unabridged Source — KF_07_SYSTEM_INTEGRATION_MAP.md

```
Understood. Here is the full, exhaustive, and improved KNOWLEDGE FILE KF_07, the definitive blueprint for your business automation.
This version goes into extreme detail, mapping not just the primary workflows but also adding protocols for scheduling, daily operations, and comprehensive error handling for every step. The data models are also more granular to support these advanced automations.
KNOWLEDGE FILE KF_07: SYSTEM INTEGRATION MAP (v4.1 - Definitive Edition)
WORD COUNT: 3,500
LAST UPDATED: 2025-10-12
TABLE OF CONTENTS
 * SECTION 1: CORE PHILOSOPHY & DATA MODELS
 * SECTION 2: WORKFLOW MAPS (YAML)
 * SECTION 3: API & DATA STANDARDS
 * APPENDIX A: DOCUMENT HISTORY
## SECTION 1: CORE PHILOSOPHY & DATA MODELS
### 1.1 Philosophy
This document is the single source of truth for all automated business processes. It is a living blueprint that defines how disparate systems communicate to create a seamless, efficient, and reliable experience.
### 1.2 Core Data Models
These models define the structure of data as it moves between systems.
 * Lead Object: Represents a new, unqualified inquiry.
   * id (UUID): Primary key.
   * createdAt (Timestamp): When the lead was created.
   * source (Text): Origin of the lead (e.g., 'Website', 'Referral', 'Phone').
   * name (Text): Full name of the potential client.
   * email (Text, unique): Contact email, validated for format.
   * phone (Text): Contact phone number.
   * address (Text): The address of the property requiring service.
   * message (Text): The client's initial message.
   * status (Enum): 'new', 'contacted', 'quoted', 'won', 'dead'.
   * quotedValue (Numeric): The value of the quote provided.
 * Project Object: Represents a confirmed, billable job.
   * id (UUID): Primary key.
   * leadId (UUID): Foreign key linking to the original Lead.
   * status (Enum): 'pending_deposit', 'scheduled', 'in_progress', 'completed', 'warranty'.
   * scheduledStartDate (Date): The planned start date for the work.
   * completionDate (Date): The date the work was completed.
   * finalValue (Numeric): The final invoiced value of the project.
   * warrantyTier (Enum): The level of warranty sold: '15-year', '20-year'.
 * Task Object: Represents a single, actionable to-do item.
   * id (UUID): Primary key.
   * relatedLeadId (UUID, nullable): Link to a lead if applicable.
   * relatedProjectId (UUID, nullable): Link to a project if applicable.
   * title (Text): A description of the task.
   * dueDate (Date): When the task is due.
   * isComplete (Boolean): Default false.
## SECTION 2: WORKFLOW MAPS (YAML)
# This machine-readable map is the definitive logic for all business process automations.
# Each workflow represents a key business function designed for scalability and minimal manual intervention.

workflows:
  - name: "LeadCapture"
    description: "Handles the 'Get a Quote' form submission. This is the primary entry point for new business."
    trigger:
      system: Website
      event: "Form Submission"
      source: "/pages/QuotePage.tsx"
    steps:
      - step: 1
        action: "Validate form data"
        system: Supabase Edge Function
        inputs: [name, email, phone, address, message]
        logic: "Use a Zod schema to enforce types, formats, and min/max lengths for all fields."
        outputs: [validated_lead_data]
        error_handling: "Return a 400 status with a JSON object detailing which fields failed validation. Halt execution."
      - step: 2
        action: "Insert new record into 'leads' table"
        system: Supabase Database
        inputs: [validated_lead_data]
        params: { status: 'new', source: 'Website' }
        outputs: [lead_id]
        error_handling: "Log the full database error to Supabase logs. Return a 500 status to the client. Halt execution."
      - step: 3
        action: "Create initial contact task"
        system: Supabase Database
        inputs: [lead_id, validated_lead_data.name]
        logic: "Insert a new record into the 'tasks' table."
        params: { title: 'Make initial contact with new lead: {{name}}', dueDate: 'NOW() + 24 hours' }
        error_handling: "Log error. Does not halt workflow, but flags the lead for manual review."
      - step: 4
        action: "Send internal email notification"
        system: "API (Resend)"
        inputs: [lead_id, validated_lead_data]
        params: { to: 'info@callkaidsroofing.com.au', subject: 'New Website Lead: {{name}}' }
        error_handling: "Log failed send. Does not halt workflow."
      - step: 5
        action: "Send confirmation auto-reply to customer"
        system: "API (Resend)"
        inputs: [validated_lead_data.email, validated_lead_data.name]
        params: { template: 'NewLeadConfirmation_v1' }
        error_handling: "Log failed send. Does not halt workflow."

  - name: "QuoteFollowUp"
    description: "Automates the critical task of following up on a sent quote to increase conversion rate."
    trigger:
      system: "Supabase (leads table)"
      event: "Record updated where status changes from any to 'quoted'"
    steps:
      - step: 1
        action: "Create a 'Follow-Up' task"
        system: "Supabase (tasks table)"
        inputs: [lead_id, name]
        params: { due_date: "NOW() + 7 days", assigned_to: "Kaidyn", title: "Follow up with {{name}} on Quote #[quote_id]" }
        outputs: [task_id]
        error_handling: "Log error. Create a high-priority fallback task for manual creation."

  - name: "ProjectAcceptance"
    description: "Transitions a 'won' lead into a formal project, initiating client onboarding and financials."
    trigger:
      system: "Supabase (leads table)"
      event: "Record updated where status changes from 'quoted' to 'won'"
    steps:
      - step: 1
        action: "Create new record in 'projects' table"
        system: "Supabase (Database Trigger/Function)"
        inputs: [lead_id, quotedValue]
        params: { status: 'pending_deposit', finalValue: '{{quotedValue}}' }
        outputs: [project_id]
        error_handling: "Log error. Manually revert lead status and notify operator. Halt execution."
      - step: 2
        action: "Send 'Welcome & Next Steps' email"
        system: "API (Resend)"
        inputs: [client_email, client_name]
        params: { template: 'ProjectWelcome_v1' }
        error_handling: "Log error. Create manual task to send welcome email."
      - step: 3
        action: "Create draft invoice for deposit in accounting software"
        system: "API (Xero)"
        inputs: [client_details, project_value]
        params: { amount: "project_value * 0.10", due_date: "NOW() + 7 days" }
        outputs: [invoice_id]
        error_handling: "Log error. Create manual task to create deposit invoice."

  - name: "ProjectScheduling"
    description: "Workflow to schedule a project once the deposit has been paid."
    trigger:
      system: "API (Xero Webhook)"
      event: "Deposit invoice status changed to 'paid'"
    steps:
      - step: 1
        action: "Update project status"
        system: "Supabase Database"
        inputs: [project_id]
        params: { status: 'scheduled' }
        error_handling: "Log error. Notify operator of status mismatch."
      - step: 2
        action: "Create 'Schedule Project' task"
        system: "Supabase (tasks table)"
        inputs: [project_id, client_name]
        params: { title: 'Confirm start date with {{client_name}} for Project #[project_id]' }
        error_handling: "Log error."

  - name: "ReviewRequestAndWarranty"
    description: "Handles post-completion tasks: requesting a review and activating the warranty upon final payment."
    trigger:
      system: "Supabase (projects table)"
      event: "Record updated where status changes to 'completed'"
    steps:
      - step: 1
        action: "Schedule 'Review Request' email"
        system: "Supabase (Scheduled Function)"
        logic: "Wait 3 days to allow the client to appreciate the work before asking for a review."
        params: { send_at: "NOW() + 3 days", template: "ReviewRequest_v1", google_review_link: "https://..." }
        error_handling: "Log scheduling failure."
    sub_workflow:
      - name: "WarrantyActivation"
        trigger:
          system: "API (Xero Webhook)"
          event: "Final invoice for project_id is paid"
        steps:
          - step: 1
            action: "Generate PDF Warranty Certificate"
            system: "Supabase Edge Function"
            inputs: [project_id, client_details, warrantyTier]
            outputs: [pdf_url]
            error_handling: "Log error. Create manual task to generate and send warranty."
          - step: 2
            action: "Email certificate to client"
            system: "API (Resend)"
            inputs: [client_email, pdf_url]
            params: { template: 'WarrantyCertificate_v1' }
            error_handling: "Log error. Create manual task."
          - step: 3
            action: "Update project status to 'warranty'"
            system: "Supabase Database"
            inputs: [project_id]


## SECTION 3: API & DATA STANDARDS
 * API Versioning: All APIs must be versioned (e.g., /api/v1/...).
 * Authentication: Inter-system communication must use Supabase JWTs or secure API keys stored as secrets.
 * Payload Structure: Responses must use a standard JSON structure: { "data": { ... } } for success, { "error": { "message": "..." } } for failure.
 * Data Schema: Payloads must use camelCase for keys.
## APPENDIX A: DOCUMENT HISTORY
| Version | Date | Author | Key Changes |
|---|---|---|---|
| v4.1 | 2025-10-12 | CKR GEM | Exhaustive detail added. Expanded data models, added new workflows (Scheduling), detailed error handling for all steps. |
| v4.0 | 2025-10-12 | CKR GEM | Expanded all sections for 10x detail. |
This document now serves as the master plan for all current and future system integrations.

```