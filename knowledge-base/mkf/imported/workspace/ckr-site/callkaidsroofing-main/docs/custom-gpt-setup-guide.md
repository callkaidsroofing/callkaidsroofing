# CKR-GEM v4.0 Custom GPT Setup Guide

Complete guide to configuring your Custom GPT for Call Kaids Roofing CRM operations.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ OpenAI ChatGPT Plus or Enterprise account ($20/month)
- ✅ Access to Supabase project with CKR-GEM API deployed
- ✅ `GPT_PROXY_KEY` from Supabase secrets (get from project dashboard)
- ✅ Files from this repository:
  - `ckr-gem-openapi-v4.yaml` (API specification)
  - `ckr-gem-system-prompt-v4.txt` (GPT instructions)

---

## Step 1: Create Custom GPT

1. Navigate to [ChatGPT](https://chat.openai.com/)
2. Click your **profile icon** (bottom left)
3. Select **My GPTs**
4. Click **Create a GPT** button
5. Switch to **Configure** tab (important: skip the "Create" tab)

---

## Step 2: Basic Configuration

### Name
```
CKR-GEM v4.0
```

### Description
```
Autonomous operations assistant for Call Kaids Roofing. Manages leads, quotes, jobs, and automation workflows through 25 CRM actions with intelligent dry-run safety checks.
```

### Instructions

1. Open `ckr-gem-system-prompt-v4.txt` from this repository
2. **Copy the entire file contents** (Ctrl+A, Ctrl+C)
3. **Paste into the Instructions field**

*The system prompt is ~5,000 words and defines the GPT's personality, workflows, and safety rules.*

### Profile Picture (Optional)

Upload the Call Kaids Roofing logo:
- Use `call-kaids-square-logo.jpg` from the project
- Or create a simple blue icon with "CKR" text

### Conversation Starters

Add these 4 starters to guide users:

```
1. "Add a new lead from Berwick"
2. "Show me hot leads from last week"
3. "Generate a premium quote for inspection #12345"
4. "Search for all pending quotes in Cranbourne"
```

---

## Step 3: Configure Actions (API Integration)

This is the most critical step - it connects your GPT to the CRM API.

### 3.1: Import Schema

1. In the Configure tab, scroll to **Actions** section
2. Click **Create new action**
3. You'll see a schema editor - click **Import from URL or Schema**
4. Open `ckr-gem-openapi-v4.yaml` from this repository
5. **Copy the entire YAML contents**
6. **Paste into the import dialog**
7. Click **Import**

OpenAI will automatically parse the schema and create:
- 1 API endpoint (`/ckr-gem-api`)
- 25 available operations (all routed through `executeCRMAction`)

### 3.2: Verify Schema Import

After importing, you should see:

**Available Actions:**
- `executeCRMAction` - Execute a CRM action

**Servers:**
- `https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1`

If you see any errors, check that:
- YAML formatting is valid (no tabs, consistent indentation)
- Server URL matches your Supabase project URL

---

## Step 4: Authentication Setup

This authenticates the GPT with your Supabase backend.

### 4.1: Get Your API Key

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Find or create secret named `GPT_PROXY_KEY`
4. Copy the value (keep this secure!)

*If `GPT_PROXY_KEY` doesn't exist, create it:*
```bash
# In Supabase dashboard, add new secret:
Name: GPT_PROXY_KEY
Value: Generate a secure random string (min 32 characters)
Example: ckr_gem_v4_prod_a8f3d2e5c9b1...
```

### 4.2: Configure Authentication

1. In the Actions section, find **Authentication**
2. Select **API Key** from the dropdown
3. Fill in the fields:

**Auth Type:** `API Key`

**API Key:** Paste your `GPT_PROXY_KEY` value

**Custom Header Name:** `x-api-key`

*(This must be exactly `x-api-key` - lowercase, with hyphen)*

4. Click **Save** (bottom right)

---

## Step 5: Capabilities

Configure what external tools the GPT can access.

### Enable These:

✅ **Code Interpreter**
- Useful for: Analyzing exported CSV data, calculating metrics, generating reports

✅ **Web Browsing**
- Useful for: Checking Melbourne weather forecasts, BOM data, public holidays

### Disable These:

❌ **DALL-E Image Generation**
- Reason: Brand policy requires real jobsite photos only, no AI-generated imagery

### File Uploads

Leave default (enabled) - allows users to:
- Upload inspection photos for context
- Import lead CSVs for batch operations
- Share quote PDFs for comparison

---

## Step 6: Additional Settings

### Privacy & Sharing

**Visibility Options:**

1. **Only me** (Recommended for testing)
   - Private GPT, only you can access
   - Best for initial testing and debugging

2. **Anyone with a link** (For team deployment)
   - Generate shareable link
   - Team members can use without GPT creation access
   - Still requires your OpenAI org to pay for usage

3. **Public** (Not recommended for business tools)
   - Listed in GPT Store
   - Exposes your business workflows
   - Anyone can use (with rate limits)

**Recommendation:** Start with "Only me", switch to "Anyone with a link" after testing.

### User Data Policy

If sharing with team:
- Check: "Do not train on user conversations"
- Reason: Protects client privacy, business data

---

## Step 7: Testing & Validation

Before deploying to your team, run these test cases.

### Test 1: Authentication Check
```
User: "Test connection"
Expected: GPT responds (connection successful if no auth errors)
```

### Test 2: Read-Only Action (Safe)
```
User: "Search for leads in Berwick"
Expected: 
- GPT calls SearchLeadsAdvanced (live mode)
- Returns table of leads or "No leads found"
- No confirmation required (read-only)
```

### Test 3: Destructive Action (Dry-Run Safety)
```
User: "Add a new lead: John Smith, Berwick, roof restoration, 0412 345 678"
Expected:
- GPT calls InsertLeadRecord with mode='dry-run'
- Shows preview of what WOULD be created
- Asks: "Should I proceed with this action?"
- Does NOT create lead yet

User: "Yes"
Expected:
- GPT calls InsertLeadRecord with mode='live'
- Creates lead and returns ID
- Confirms: "Lead created with ID: abc-123"
```

### Test 4: Complex Workflow
```
User: "Show me all hot leads from last week, then create follow-up tasks for any that haven't been contacted"
Expected:
- GPT calls SearchLeadsAdvanced (filters: aiScoreMin=8, dateRange, status=new)
- Shows results
- For each uncontacted lead, calls CreateLeadTask (dry-run first)
- Asks confirmation before creating tasks
- Executes tasks in batch
```

### Test 5: Error Handling
```
User: "Add a lead in Paris"
Expected:
- GPT validates suburb against service area
- Responds: "Paris is outside our service area (50km radius of Clyde North). Did you mean Pakenham?"
- Does not call API with invalid data
```

---

## Step 8: Monitoring & Debugging

### View API Call Logs

**In Supabase:**
1. Go to **Edge Functions** → **Logs**
2. Filter by function: `ckr-gem-api`
3. Look for entries with your API calls

**In System Audit Table:**
```sql
SELECT * FROM system_audit 
WHERE action_type IN ('InsertLeadRecord', 'SearchLeadsAdvanced', ...)
ORDER BY created_at DESC 
LIMIT 50;
```

### Common Issues & Fixes

#### Issue: "Authentication failed"
**Cause:** API key mismatch or expired
**Fix:**
1. Verify `GPT_PROXY_KEY` in Supabase secrets matches GPT config
2. Check custom header name is exactly `x-api-key`
3. Regenerate key if suspected compromise

#### Issue: "Action not found: [ActionName]"
**Cause:** Schema import incomplete or action name mismatch
**Fix:**
1. Re-import `ckr-gem-openapi-v4.yaml`
2. Verify action names match exactly (case-sensitive)
3. Check server URL is correct in schema

#### Issue: GPT ignores dry-run rule, executes immediately
**Cause:** System prompt not emphasizing safety rules
**Fix:**
1. Re-paste `ckr-gem-system-prompt-v4.txt`
2. Test with a destructive action like InsertLeadRecord
3. Verify GPT asks for confirmation before live mode

#### Issue: "Rate limit exceeded"
**Cause:** Too many requests in 60-second window
**Fix:**
1. Check `rate_limits` table in Supabase:
   ```sql
   SELECT * FROM rate_limits WHERE api_key = '[your_key]';
   ```
2. Wait 60 seconds or adjust `RATE_LIMITS` in `ckr-gem-api/utils/rateLimit.ts`

#### Issue: GPT returns empty results for valid searches
**Cause:** No data in database or incorrect filters
**Fix:**
1. Verify data exists: `SELECT * FROM leads LIMIT 10;`
2. Check filters (e.g., suburb spelling, date ranges)
3. Review Edge Function logs for SQL errors

---

## Step 9: Team Deployment

Once testing is complete, share with your team.

### Option A: Share Link (Recommended)

1. In GPT settings, set visibility to **Anyone with a link**
2. Click **Copy link** button
3. Share link with team members via:
   - Email: "Use this GPT to manage leads and quotes"
   - Slack: Pin in #operations channel
   - Notion: Add to onboarding docs

**Benefits:**
- Team members don't need GPT creation access
- Usage tracked under your OpenAI account
- Easy to revoke by changing visibility

### Option B: Duplicate for Team Members

If team members have ChatGPT Plus:
1. Export your GPT configuration (download as JSON)
2. Team members import and create their own instances
3. Each uses their own API key for isolated tracking

**Benefits:**
- Distributed usage costs
- Independent customization
- Better audit trails per user

---

## Step 10: Advanced Configuration (Optional)

### Custom Rate Limits

If you need higher throughput, adjust in `supabase/functions/ckr-gem-api/utils/rateLimit.ts`:

```typescript
const RATE_LIMITS = {
  SearchLeadsAdvanced: { limit: 100, window: 60 }, // 100/min instead of 60/min
  InsertLeadRecord: { limit: 50, window: 60 },    // 50/min instead of 30/min
  // ... adjust as needed
};
```

Then redeploy Edge Function:
```bash
supabase functions deploy ckr-gem-api
```

### Multi-Environment Setup

For staging vs. production:

1. Create separate Custom GPTs:
   - `CKR-GEM v4.0 [STAGING]`
   - `CKR-GEM v4.0 [PROD]`

2. Use different API keys:
   - `GPT_PROXY_KEY_STAGING`
   - `GPT_PROXY_KEY_PROD`

3. Point to different Supabase projects in OpenAPI schema

### Webhook Notifications

To notify external systems (Slack, SMS) when hot leads arrive:

1. Add webhook URL to Supabase secrets: `SLACK_WEBHOOK_URL`
2. Modify `NotifyTeamAboutHotLead` handler to call webhook
3. GPT will trigger Slack alerts automatically

---

## Next Steps

1. ✅ Complete all test cases (see `docs/custom-gpt-test-cases.md`)
2. ✅ Train team on conversation patterns (share example workflows)
3. ✅ Monitor usage in Supabase audit logs
4. ✅ Iterate on system prompt based on real usage
5. ✅ Expand to Phase 3 actions (Financial, Field Ops, Marketing)

---

## Support & Troubleshooting

### Documentation
- **OpenAPI Spec**: `ckr-gem-openapi-v4.yaml` (API reference)
- **System Prompt**: `ckr-gem-system-prompt-v4.txt` (behavior guide)
- **Test Cases**: `docs/custom-gpt-test-cases.md` (validation scenarios)
- **Integration Docs**: `SYSTEM_INTEGRATION.md` (architecture overview)

### Logs & Debugging
- **Supabase Edge Logs**: Real-time API call monitoring
- **System Audit Table**: Historical action log with user tracking
- **Rate Limits Table**: Request throttling status

### Getting Help
- **OpenAI GPT Issues**: [OpenAI Help Center](https://help.openai.com/)
- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **CKR-GEM Issues**: Check `SYSTEM_INTEGRATION.md` or contact development team

---

## Security Best Practices

1. **Rotate API Keys Regularly**
   - Change `GPT_PROXY_KEY` every 90 days
   - Update in both Supabase and GPT config

2. **Monitor Unusual Activity**
   - Watch `system_audit` for unexpected actions
   - Set up alerts for high-rate API usage

3. **Limit Team Access**
   - Only share GPT link with authorized staff
   - Revoke access for former employees immediately

4. **Backup Critical Data**
   - Export leads/quotes regularly via `ExportLeadsToCSV`
   - Store backups outside Supabase (S3, Google Drive)

5. **Test Before Deploying Changes**
   - Always use "Only me" visibility when testing schema updates
   - Run full test suite before sharing with team

---

## Changelog

**v4.0 (Current)**
- 25 CRM actions across 4 categories
- Mandatory dry-run safety for destructive operations
- Advanced lead intelligence (search, merge, timeline)
- Quote versioning and job conflict checking
- Export and automation workflows

**Future Enhancements (Phase 3)**
- Financial actions: Invoice generation, payment tracking
- Field operations: Material ordering, time tracking
- Marketing automation: Campaign management, ROI tracking

---

*Custom GPT setup complete! You now have an AI assistant that can autonomously manage your entire roofing CRM through natural language.*
