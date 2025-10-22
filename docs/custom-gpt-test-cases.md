# CKR-GEM v4.0 Custom GPT Test Cases

Comprehensive test suite for validating all 25 CRM actions.

---

## Testing Strategy

### Test Levels
1. **Smoke Tests** (5 min): Basic connectivity and authentication
2. **Core Workflow Tests** (15 min): Most common operations (actions 1-10)
3. **Advanced Feature Tests** (20 min): Complex operations (actions 11-25)
4. **Integration Tests** (15 min): Multi-step workflows
5. **Error Handling Tests** (10 min): Edge cases and validation

### Expected Outcomes
- ✅ **Pass**: Action executes correctly, returns expected data
- ⚠️ **Warning**: Action works but response unexpected (investigate)
- ❌ **Fail**: Error returned, action didn't execute (debug immediately)

---

## Smoke Tests (5 minutes)

### Test S1: Authentication
```
You: "Test connection"
Expected: GPT responds without auth errors
Result: [ ] Pass [ ] Fail
```

### Test S2: Simple Read-Only Query
```
You: "How many leads do we have in total?"
Expected: GPT calls SearchLeadsAdvanced (live), returns count
Result: [ ] Pass [ ] Fail
```

### Test S3: Dry-Run Safety Check
```
You: "Add a test lead: Test User, Berwick, roof restoration, 0400 000 000"
Expected: 
- GPT calls InsertLeadRecord (dry-run)
- Shows preview
- Asks for confirmation
- Does NOT create lead yet
Result: [ ] Pass [ ] Fail
```

---

## Core CRM Operations (Actions 1-10)

### Test 1: InsertLeadRecord

**Scenario**: Capture new lead from phone call

```
You: "Add a new lead:
- Name: Emma Wilson
- Suburb: Cranbourne
- Service: Roof restoration
- Phone: 0423 456 789
- Email: emma.w@example.com
- Source: Phone call
- Message: Interested in full restoration, mentioned small leak"

Expected Workflow:
1. GPT calls InsertLeadRecord (dry-run)
2. Shows preview with all fields
3. Estimates AI score (likely 7-8/10 due to leak mention)
4. Asks: "Should I add this lead?"
5. User: "Yes"
6. GPT calls InsertLeadRecord (live)
7. Returns leadId and actual AI score

Expected Response Fields:
- leadId (UUID)
- aiScore (number 0-10)
- status (should be "new")

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 2: UpdateLeadStatus

**Scenario**: Move lead through pipeline

```
Prerequisites: Note the leadId from Test 1 (e.g., "abc-123-def")

You: "Update lead [leadId] to 'contacted' status with note: Called client, inspection scheduled for Monday 10am"

Expected Workflow:
1. GPT calls UpdateLeadStatus (dry-run)
2. Shows current status → new status change
3. Shows note preview
4. Asks: "Should I update this lead?"
5. User: "Yes"
6. GPT calls UpdateLeadStatus (live)
7. Confirms update

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 3: InsertJobRecord

**Scenario**: Create job from accepted quote

```
Prerequisites: You need a leadId and quoteId (use dummy: "quote-test-123")

You: "Create a job for lead [leadId], quote quote-test-123, scheduled for 2025-11-15 at 123 Main St, Cranbourne VIC 3806"

Expected Workflow:
1. GPT validates date (not in past, not public holiday)
2. Calls InsertJobRecord (dry-run)
3. Shows preview with all fields
4. Asks confirmation
5. Creates job (live)
6. Returns jobId

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 4: UpdateJobStatus

**Scenario**: Mark job as in progress

```
Prerequisites: Note jobId from Test 3

You: "Update job [jobId] to 'in_progress' status"

Expected Workflow:
1. Calls UpdateJobStatus (dry-run)
2. Shows status change
3. Confirms
4. Updates (live)

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 5: UploadInspectionForm

**Scenario**: Submit field inspection data

```
Prerequisites: Have a leadId ready

You: "Upload inspection for lead [leadId]:
- Roof type: Tile
- Roof area: 180 square metres
- Ridge caps: 30 metres
- Valleys: 2
- Condition: Fair - surface wear, some broken tiles
- Leaks: Yes
- Recommended works: Full restoration including cleaning, painting, ridge cap rebedding"

Expected Workflow:
1. GPT validates data (area > 0, logical values)
2. Calls UploadInspectionForm (dry-run)
3. Shows complete preview
4. Confirms
5. Creates inspection report (live)
6. Returns inspectionReportId

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 6: FetchJobDetails

**Scenario**: Retrieve comprehensive job info (READ-ONLY)

```
Prerequisites: Use jobId from Test 3

You: "Show me details for job [jobId]"

Expected Workflow:
1. GPT calls FetchJobDetails (live - no dry-run needed)
2. Returns job details with related lead, quote, inspection

Expected Response:
- Job status
- Scheduled date
- Site address
- Lead info (name, contact)
- Quote info (if available)
- Inspection report (if available)

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 7: GenerateQuoteDraft

**Scenario**: Create tiered quote from inspection

```
Prerequisites: Use inspectionReportId from Test 5

You: "Generate a premium tier quote for inspection [inspectionReportId], client name Emma Wilson, site address 123 Main St, Cranbourne VIC 3806"

Expected Workflow:
1. GPT calls FetchJobDetails to get inspection data
2. Calls GenerateQuoteDraft (dry-run)
3. Shows complete quote breakdown:
   - Line items with prices
   - Subtotal
   - GST
   - Total
   - Warranty terms
   - Timeline estimate
4. Asks confirmation
5. Creates quote (live)
6. Returns quoteId

Expected Line Items (for premium tier):
- Roof pressure wash & cleaning
- Premium paint (2 coats)
- Ridge cap rebedding
- Valley iron replacement (if applicable)
- Tile replacements
- Labour

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 8: SendQuoteToClient

**Scenario**: Email quote PDF to client

```
Prerequisites: Use quoteId from Test 7

You: "Send quote [quoteId] to emma.w@example.com with message: Hi Emma, here's your premium restoration quote as discussed."

Expected Workflow:
1. GPT validates email format
2. Calls SendQuoteToClient (dry-run)
3. Shows preview:
   - To: emma.w@example.com
   - Subject: Quote from Call Kaids Roofing
   - Message preview
   - Attachment: PDF quote
4. Asks confirmation
5. Sends email (live)
6. Returns quoteEmailId for tracking

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 9: RecordClientResponse

**Scenario**: Log client's quote decision

```
Prerequisites: Use quoteId from Test 7

You: "Client accepted quote [quoteId], they said 'Yes, let's go ahead with the premium option'"

Expected Workflow:
1. GPT calls RecordClientResponse (dry-run)
2. Shows response type: accepted
3. Shows feedback: "Yes, let's go ahead..."
4. Confirms
5. Records response (live)
6. Updates lead status to 'won'

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 10: ArchiveCompletedJob

**Scenario**: Mark job complete, trigger case study

```
Prerequisites: Use jobId from Test 3 (update to 'completed' first if needed)

You: "Archive job [jobId] as completed"

Expected Workflow:
1. GPT verifies job is in 'completed' status
2. Calls ArchiveCompletedJob (dry-run)
3. Shows what will happen:
   - Job marked as archived
   - Final photos requested
   - Testimonial request flagged
4. Confirms
5. Archives (live)
6. Suggests: "Should I create a case study from this job?"

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

---

## Advanced Lead Management (Actions 11-15)

### Test 11: BatchImportLeads

**Scenario**: Import multiple leads at once

```
You: "Import these leads:
1. Michael Chen, Pakenham, roof painting, 0434 567 890, michael.chen@example.com
2. Lisa Taylor, Berwick, gutter cleaning, 0445 678 901
3. David Brown, Officer, leak detection, 0456 789 012, urgent repair needed"

Expected Workflow:
1. GPT validates all fields
2. Calls BatchImportLeads (dry-run)
3. Shows preview of all 3 leads
4. Notes any duplicates (if applicable)
5. Confirms
6. Imports (live)
7. Reports:
   - Imported count: 3
   - Skipped count: 0 (unless duplicates)
   - AI scores assigned

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 12: SearchLeadsAdvanced

**Scenario**: Find hot leads from last week (READ-ONLY)

```
You: "Show me all hot leads (AI score > 8) from the last 7 days in Berwick and Cranbourne, sorted by score"

Expected Workflow:
1. GPT calculates date range (today - 7 days to today)
2. Calls SearchLeadsAdvanced (live - no dry-run)
3. Returns results in table format:
   - Name
   - Suburb
   - Service
   - AI Score
   - Status
   - Created date

Expected Response:
- Matching leads array
- Pagination info (total count, limit, offset)
- Applied filters summary

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 13: MergeLeadDuplicates

**Scenario**: Combine duplicate lead records

```
Prerequisites: Create 2 test leads with similar names

You: "I have duplicate leads for Emma Wilson. Lead IDs are [lead1] and [lead2]. Merge into [lead1] using best data strategy."

Expected Workflow:
1. GPT validates both leads exist
2. Calls MergeLeadDuplicates (dry-run)
3. Shows merge preview:
   - Primary: lead1
   - Merging: lead2
   - Will preserve: notes, tasks, quotes
   - Field-by-field comparison (phone, email, etc.)
4. Asks: "Should I merge these leads?"
5. Merges (live)
6. Reports:
   - Transferred notes count
   - Transferred tasks count
   - Duplicate marked as merged

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 14: CreateLeadTask

**Scenario**: Add follow-up reminder

```
Prerequisites: Use a leadId

You: "Create a high priority follow-up task for lead [leadId]:
- Title: Follow up on quote
- Description: Client wants to compare with another quote, call back in 3 days
- Due date: 2025-10-25
- Category: follow_up"

Expected Workflow:
1. GPT validates due date (not in past)
2. Calls CreateLeadTask (dry-run)
3. Shows task preview with all fields
4. Confirms
5. Creates task (live)
6. Returns taskId

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 15: FetchLeadTimeline

**Scenario**: Show complete lead history (READ-ONLY)

```
Prerequisites: Use leadId with some activity (from previous tests)

You: "Show me the complete timeline for lead [leadId] including notes, tasks, and quotes"

Expected Workflow:
1. GPT calls FetchLeadTimeline (live)
2. Returns chronological events:
   - Lead created
   - Status changes
   - Notes added
   - Tasks created/completed
   - Quotes sent
   - Job scheduled

Expected Format:
```
Timeline for [Lead Name]:
- Oct 22, 08:30 - Lead created (source: phone_call)
- Oct 22, 09:15 - Status changed: new → contacted
- Oct 22, 10:00 - Note added: "Called client, inspection scheduled"
- Oct 22, 14:30 - Inspection uploaded
- Oct 22, 15:45 - Quote sent (premium tier, $9,405)
- Oct 23, 09:00 - Task created: "Follow up on quote" (due Oct 25)
```

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

---

## Quote & Job Intelligence (Actions 16-20)

### Test 16: CompareQuoteVersions

**Scenario**: Show differences between quote revisions (READ-ONLY)

```
Prerequisites: Create 2 quote versions (clone one and modify)

You: "Compare quote [quoteId1] with quote [quoteId2]"

Expected Workflow:
1. GPT calls CompareQuoteVersions (live)
2. Returns comparison:
   - Total difference ($)
   - Percentage change (%)
   - Line-by-line differences

Expected Output:
```
Quote Comparison:
- Original (v1): $9,405
- Revised (v2): $10,200
- Difference: +$795 (+8.4%)

Changes:
- Roof painting: $3,200 → $3,800 (+$600) [upgraded to Dulux Acratex]
- Ridge rebedding: Added additional 5m (+$195)
```

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 17: FetchQuotesForLead

**Scenario**: Get all quotes for a client (READ-ONLY)

```
Prerequisites: Use leadId with multiple quotes

You: "Show me all quotes for lead [leadId] including line items and email tracking"

Expected Workflow:
1. GPT calls FetchQuotesForLead (live)
2. Returns all quotes with stats:
   - Quote IDs
   - Tiers (essential/premium/prestige)
   - Totals
   - Status (pending/accepted/rejected)
   - Email tracking (opened, clicked)

Expected Summary:
- Total quotes sent: X
- Pending: Y
- Accepted: Z
- Total value: $XX,XXX

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 18: CloneQuote

**Scenario**: Duplicate quote for modifications

```
Prerequisites: Use a quoteId

You: "Clone quote [quoteId] and change tier to prestige, client name to 'Emma Wilson (Prestige Option)'"

Expected Workflow:
1. GPT calls CloneQuote (dry-run)
2. Shows preview:
   - Original quote summary
   - New tier: prestige
   - New client name
   - Price will be recalculated
3. Confirms
4. Creates cloned quote (live)
5. Returns new quoteId

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 19: ScheduleJobWithConflictCheck

**Scenario**: Book job with crew availability check

```
Prerequisites: Use an inspectionReportId

You: "Schedule job for inspection [inspectionReportId] on 2025-11-08, estimated 8 hours, assign to Team A"

Expected Workflow:
1. GPT calls ScheduleJobWithConflictCheck (dry-run)
2. Checks for conflicts:
   - Team A availability
   - Weather forecast
   - Other jobs on same date
3. Shows conflicts (if any) OR confirms availability
4. If conflicts: suggests alternative dates
5. If no conflicts: asks confirmation
6. Schedules (live)

Expected Response (no conflicts):
```
✅ Nov 8th available:
- Team A has capacity
- Weather: Partly cloudy, 15% rain
- No other jobs scheduled

Should I book this?
```

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 20: GenerateJobChecklistFromInspection

**Scenario**: Create detailed work checklist (READ-ONLY)

```
Prerequisites: Use an inspectionReportId

You: "Generate a job checklist for inspection [inspectionReportId] including photos and materials"

Expected Workflow:
1. GPT calls GenerateJobChecklistFromInspection (live)
2. Returns checklist:
   - Task list with descriptions
   - Estimated hours per task
   - Priority levels
   - Materials needed
   - Photos reference

Expected Output:
```
Job Checklist:
1. [HIGH] Roof pressure wash (2h) - Materials: Pressure washer, cleaning solution
2. [HIGH] Ridge cap rebedding (4h) - Materials: SupaPoint mortar, trowel
3. [MED] Tile replacement (1h) - Materials: 7 matching tiles, mortar
4. [HIGH] Roof painting (8h) - Materials: Premcoat sealer, Dulux AcraTex paint
5. [MED] Valley iron replacement (2h) - Materials: Valley iron sheets, sealant

Total estimated hours: 17h (2-3 days)
Materials summary: See detailed list
```

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

---

## Communication & Automation (Actions 21-25)

### Test 21: BulkUpdateLeadStatus

**Scenario**: Update multiple leads at once

```
Prerequisites: Have 3-5 lead IDs in "new" status

You: "Update leads [lead1], [lead2], [lead3] to 'nurture' status with note 'Not ready to proceed, follow up in 2 weeks' and create follow-up tasks"

Expected Workflow:
1. GPT validates all lead IDs exist
2. Calls BulkUpdateLeadStatus (dry-run)
3. Shows preview:
   - 3 leads will be updated
   - Status: new → nurture
   - Note will be added to each
   - 3 tasks will be created (due in 2 weeks)
4. Confirms
5. Updates all (live)
6. Reports:
   - Updated: 3 leads
   - Created: 3 tasks

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 22: ScheduleQuoteFollowup

**Scenario**: Auto-schedule follow-up reminder

```
Prerequisites: Use a quoteId (status: pending)

You: "Schedule a 3-day follow-up for quote [quoteId] via SMS"

Expected Workflow:
1. GPT calls ScheduleQuoteFollowup (dry-run)
2. Shows preview:
   - Quote: [quoteId]
   - Follow-up method: SMS
   - Due date: [today + 3 days]
3. Confirms
4. Creates task (live)
5. Returns taskId

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 23: TrackQuoteEmailEngagement

**Scenario**: Log email opens/clicks

```
Prerequisites: Use a quoteEmailId (from Test 8)

You: "Track engagement for quote email [quoteEmailId]:
- Opened: Yes, at 2025-10-22 10:30
- Clicked: Yes, at 2025-10-22 10:35
- Clicked link: https://callkaidsroofing.com/warranty"

Expected Workflow:
1. GPT calls TrackQuoteEmailEngagement (dry-run)
2. Shows engagement summary:
   - Opened: ✅
   - Clicked: ✅
   - Links clicked: 1
3. Calculates engagement score (e.g., 8/10)
4. Suggests follow-up: "High engagement, recommend follow-up call within 24h"
5. Confirms
6. Records engagement (live)

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 24: ExportLeadsToCSV

**Scenario**: Export filtered leads (READ-ONLY)

```
You: "Export all leads from October with status 'new' or 'contacted' sorted by AI score"

Expected Workflow:
1. GPT calls ExportLeadsToCSV (live - read-only)
2. Generates CSV with filters:
   - Date range: 2025-10-01 to 2025-10-31
   - Status: new, contacted
   - Sort by: ai_score DESC
3. Uploads to storage
4. Returns download URL (1-hour expiry)
5. Shows stats:
   - Total leads exported: X
   - File size: Y KB
   - Expires at: [timestamp]

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

### Test 25: NotifyTeamAboutHotLead

**Scenario**: Instant alert for high-priority lead

```
Prerequisites: Use a leadId with AI score > 8

You: "Notify team about hot lead [leadId] - reason: AI score 9.2, urgent roof leak repair needed"

Expected Workflow:
1. GPT validates lead exists and AI score is high
2. Calls NotifyTeamAboutHotLead (dry-run)
3. Shows notification preview:
   - Lead: [name]
   - Reason: AI score 9.2, urgent roof leak
   - Will create: High-priority task
   - Will add: System note
4. Confirms
5. Notifies team (live)
6. Optionally sends SMS/Slack alert (if configured)

Result: [ ] Pass [ ] Fail

Notes: _______________________________________
```

---

## Integration Tests (Multi-Step Workflows)

### Integration Test A: Complete Lead-to-Job Flow

```
You: "Walk me through the complete workflow from new lead to scheduled job:
1. Add lead: Sarah Brown, Dandenong, roof restoration, 0467 890 123, sarah.b@example.com
2. Update to contacted
3. Upload inspection
4. Generate premium quote
5. Send quote
6. Record acceptance
7. Create job for Nov 20th"

Expected: GPT executes all 7 steps in sequence, each with dry-run confirmation

Result: [ ] Pass [ ] Fail

Time taken: _______ minutes

Notes: _______________________________________
```

### Integration Test B: Lead Intelligence Workflow

```
You: "Help me manage hot leads:
1. Search for all leads with AI score > 8 from last week
2. For each, check if they have follow-up tasks
3. For any without tasks, create high-priority follow-up tasks due tomorrow"

Expected: GPT chains SearchLeadsAdvanced → FetchLeadTimeline (per lead) → CreateLeadTask (for missing)

Result: [ ] Pass [ ] Fail

Time taken: _______ minutes

Notes: _______________________________________
```

### Integration Test C: Quote Comparison Workflow

```
You: "Compare all quote versions for lead [leadId] and recommend which to send"

Expected: GPT chains FetchQuotesForLead → CompareQuoteVersions (pairwise) → provides recommendation

Result: [ ] Pass [ ] Fail

Time taken: _______ minutes

Notes: _______________________________________
```

---

## Error Handling Tests

### Error Test 1: Invalid Suburb

```
You: "Add a lead in Sydney"

Expected: GPT validates suburb against service area, responds with error: "Sydney is outside our 50km service area around Clyde North. Did you mean [closest match]?"

Result: [ ] Pass [ ] Fail
```

### Error Test 2: Invalid Phone Number

```
You: "Add lead: John Doe, Berwick, roof repair, 123456"

Expected: GPT validates phone format, responds: "Phone number '123456' is invalid. Australian mobile numbers should be 04XX XXX XXX or +61 4XX XXX XXX."

Result: [ ] Pass [ ] Fail
```

### Error Test 3: Past Date for Job Scheduling

```
You: "Schedule job for 2020-01-01"

Expected: GPT validates date, responds: "Date 2020-01-01 is in the past. Please provide a future date."

Result: [ ] Pass [ ] Fail
```

### Error Test 4: Missing Required Field

```
You: "Add a new lead named John Smith"

Expected: GPT asks for missing required fields: "I need a few more details: suburb, service, and contact number."

Result: [ ] Pass [ ] Fail
```

### Error Test 5: Non-Existent Record

```
You: "Update lead fake-lead-id-999 to contacted"

Expected: GPT calls API, receives error, responds: "Lead 'fake-lead-id-999' not found. Can you verify the lead ID?"

Result: [ ] Pass [ ] Fail
```

---

## Test Summary

**Smoke Tests:** ____ / 3 passed
**Core Operations (1-10):** ____ / 10 passed
**Advanced Management (11-15):** ____ / 5 passed
**Quote Intelligence (16-20):** ____ / 5 passed
**Automation (21-25):** ____ / 5 passed
**Integration Tests:** ____ / 3 passed
**Error Handling:** ____ / 5 passed

**TOTAL: ____ / 31 tests passed**

**Overall Result:** [ ] ✅ Ready for production [ ] ⚠️ Needs fixes [ ] ❌ Critical failures

---

## Common Failure Patterns & Fixes

### Pattern 1: GPT Skips Dry-Run
**Symptom:** GPT executes destructive actions immediately without confirmation
**Fix:** 
1. Re-paste system prompt emphasizing DRY-RUN FIRST rule
2. Add to conversation: "Remember to always use dry-run mode first for destructive actions"
3. Test again with InsertLeadRecord

### Pattern 2: Invalid JSON in API Calls
**Symptom:** API returns 400 errors, "JSON parse failed"
**Fix:**
1. Check OpenAPI schema imported correctly
2. Verify example payloads in schema are valid
3. Review Edge Function logs for exact error

### Pattern 3: Authentication Fails Intermittently
**Symptom:** Some calls work, others get 401 errors
**Fix:**
1. Verify GPT_PROXY_KEY hasn't expired
2. Check custom header name is exactly `x-api-key`
3. Ensure key is saved in GPT config (not just pasted once)

### Pattern 4: GPT Doesn't Suggest Next Steps
**Symptom:** GPT completes actions but doesn't proactively suggest follow-ups
**Fix:**
1. Check system prompt section "PROACTIVE SUGGESTIONS" is included
2. Manually prompt: "What should I do next?"
3. If still passive, re-paste full system prompt

### Pattern 5: Rate Limit Errors
**Symptom:** "Rate limit exceeded" after several rapid calls
**Fix:**
1. Normal behavior - wait 60 seconds
2. If persistent, adjust RATE_LIMITS in `utils/rateLimit.ts`
3. For testing, temporarily increase limits

---

## Next Steps After Testing

1. **Document failures**: Note which tests failed and why
2. **Fix critical issues**: Address any ❌ fails before deployment
3. **Train team**: Share successful workflows with team members
4. **Monitor production**: Watch first week of real usage closely
5. **Iterate prompts**: Adjust system prompt based on actual conversations
6. **Expand test suite**: Add new tests as you discover edge cases

---

*Testing complete! This GPT is now validated for production use managing Call Kaids Roofing CRM operations.*
