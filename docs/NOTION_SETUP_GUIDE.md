# Notion Integration Setup Guide

## Overview
This guide will help you set up Notion as the content authoring layer for Call Kaids Roofing, with automated sync to Supabase every 15 minutes.

---

## Step 1: Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Configure:
   - **Name:** Call Kaids Roofing Sync
   - **Logo:** Upload CKR logo (optional)
   - **Associated workspace:** Select your workspace
   - **Capabilities:** 
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content
4. Click **"Submit"**
5. Copy the **Internal Integration Token** (starts with `secret_`)
   - Save this securely - you'll need it for the sync script

---

## Step 2: Create Notion Databases

### Database 1: Blog Posts

**Create Database:**
1. In Notion, create a new page: "CKR - Blog Posts"
2. Type `/database` and select "Database - Full page"
3. Add the following properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Title | Title | (default) |
| Slug | Text | URL-friendly version (e.g., "roof-restoration-guide") |
| Excerpt | Text | Short summary (150-160 characters) |
| Content | Text | Full blog post content (supports markdown) |
| Category | Select | Options: "Roof Maintenance", "Roof Restoration", "Materials & Products", "How-To Guides", "Industry News" |
| Tags | Multi-select | Options: "SEO", "Berwick", "Cranbourne", "Pakenham", "Tiles", "Valley Irons", "Gutters", "Winter", "Summer" |
| Author | Text | Default: "Kaidyn Brownlie" |
| Publish Date | Date | When to publish |
| Read Time | Number | Estimated minutes to read |
| Featured | Checkbox | Show on homepage? |
| Image URL | URL | Hero image URL (from Supabase Storage) |
| Meta Description | Text | SEO description (150-160 characters) |
| Related Posts | Relation | Link to other blog posts |

**Share with Integration:**
1. Click **"Share"** (top right)
2. Click **"Invite"**
3. Select **"Call Kaids Roofing Sync"** integration
4. Copy the database URL (you'll need the ID)

---

### Database 2: Services

**Create Database:**
1. Create page: "CKR - Services"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Name | Title | Service name (e.g., "Roof Restoration") |
| Slug | Text | URL slug (e.g., "roof-restoration") |
| Short Description | Text | One-line summary (50-80 characters) |
| Full Description | Text | Detailed service description (supports markdown) |
| Service Category | Select | Options: "Restoration", "Repairs", "Maintenance", "Installation" |
| Features | Multi-select | Options: "10-Year Warranty", "Premium Materials", "Free Quote", "Same-Day Service", "Weekend Availability" |
| Process Steps | Text | JSON array: `[{"step": 1, "title": "Inspection", "description": "..."}]` |
| Pricing Info | Text | JSON: `{"min": 2500, "max": 8000, "unit": "per job", "notes": "Varies by roof size"}` |
| Icon | Text | Lucide icon name (e.g., "Home", "Wrench") |
| Image URL | URL | Service feature image |
| Meta Title | Text | SEO title (50-60 characters) |
| Meta Description | Text | SEO description (150-160 characters) |
| Display Order | Number | Sort order (1, 2, 3...) |
| Featured | Checkbox | Show on homepage? |
| Service Tags | Multi-select | Options: "Tile Roofs", "Metal Roofs", "Emergency", "Residential", "Commercial" |

**Share with Integration** (same as above)

---

### Database 3: Suburbs

**Create Database:**
1. Create page: "CKR - Suburbs"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Name | Title | Suburb name (e.g., "Berwick") |
| Slug | Text | URL slug (e.g., "berwick") |
| Postcode | Text | e.g., "3806" |
| Region | Select | Options: "South East", "East", "Bayside", "Mornington Peninsula" |
| Description | Text | General suburb description |
| Local SEO Content | Text | Suburb-specific content for SEO (300-500 words) |
| Services Available | Multi-select | Options: "Roof Restoration", "Roof Repairs", "Gutter Cleaning", "Leak Detection", "Tile Replacement" |
| Distance from Base | Number | Distance in km from Clyde North |
| Projects Completed | Number | Number of completed jobs in suburb |
| Featured Projects | Relation | Link to Case Studies database |
| Meta Title | Text | SEO title (e.g., "Roof Restoration Berwick | Call Kaids Roofing") |
| Meta Description | Text | SEO description |

**Share with Integration**

---

### Database 4: Case Studies

**Create Database:**
1. Create page: "CKR - Case Studies"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Study ID | Title | e.g., "CS001", "CS002" |
| Suburb | Select | Options: "Berwick", "Cranbourne", "Pakenham", etc. |
| Job Type | Select | Options: "Full Restoration", "Leak Repair", "Valley Iron Replacement", "Ridge Cap Rebedding" |
| Client Problem | Text | Description of the issue (100-150 words) |
| Solution Provided | Text | What was done (150-200 words) |
| Key Outcome | Text | Results/benefits (50-100 words) |
| Before Image | URL | Before photo URL |
| After Image | URL | After photo URL |
| Testimonial | Text | Client quote (optional) |
| Project Date | Date | When job was completed |
| Featured | Checkbox | Show on homepage? |
| Slug | Text | URL slug (e.g., "berwick-roof-restoration-2024") |
| Meta Description | Text | SEO description |

**Share with Integration**

---

### Database 5: Testimonials

**Create Database:**
1. Create page: "CKR - Testimonials"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Client Name | Title | e.g., "Sarah M." or "John & Lisa T." |
| Testimonial Text | Text | Full testimonial quote |
| Rating | Number | 1-5 stars |
| Service Type | Select | Options: "Roof Restoration", "Roof Repairs", "Gutter Cleaning", etc. |
| Suburb | Select | Options: "Berwick", "Cranbourne", etc. |
| Job Date | Date | When service was completed |
| Verified | Checkbox | Verified testimonial? |
| Featured | Checkbox | Show on homepage? |
| Case Study | Relation | Link to related case study (if any) |

**Share with Integration**

---

### Database 6: Knowledge Base (FAQs)

**Create Database:**
1. Create page: "CKR - Knowledge Base"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| Question | Title | e.g., "How long does roof restoration take?" |
| Answer | Text | Detailed answer (supports markdown) |
| Category | Select | Options: "Pricing", "Process", "Materials", "Warranties", "Maintenance" |
| Related Services | Multi-select | Options: "Roof Restoration", "Roof Repairs", etc. |
| Display Order | Number | Sort order within category |
| Featured | Checkbox | Show on main FAQ page? |

**Share with Integration**

---

### Database 7: Knowledge Files (RAG for AI)

**Create Database:**
1. Create page: "CKR - Knowledge Files"
2. Add properties:

| Property Name | Type | Options/Description |
|--------------|------|---------------------|
| File Key | Title | e.g., "KF_01_BRAND_IDENTITY" |
| Title | Text | Human-readable title |
| Category | Select | Options: "Brand", "Operations", "Marketing", "Technical", "Legal" |
| Content | Text | Full content (can be long-form markdown) |
| Version | Number | Version number (1, 2, 3...) |
| Active | Checkbox | Is this file active? |
| Metadata | Text | JSON metadata: `{"tags": ["pricing", "materials"], "last_reviewed": "2025-01-15"}` |

**Share with Integration**

**Pre-populate with:**
- KF_01_BRAND_IDENTITY (brand colors, typography, voice)
- KF_02_PRICING_RULES (service pricing, material costs)
- KF_03_SERVICE_AREAS (suburbs served, distance limits)
- KF_04_STANDARD_RESPONSES (email templates, FAQ answers)

---

## Step 3: Get Database IDs

For each database created:
1. Open the database in Notion
2. Copy the URL (looks like: `https://www.notion.so/abc123def456?v=...`)
3. Extract the ID (the part between `.so/` and `?v=`)
   - Example: `https://www.notion.so/abc123def456?v=xyz` → ID is `abc123def456`
4. Save these IDs - you'll need them for the sync script configuration

---

## Step 4: Configure Sync Script

1. Create a `.env` file in the project root:
   ```bash
   cp scripts/.env.example scripts/.env
   ```

2. Edit `scripts/.env` with your credentials:
   ```bash
   # Notion Configuration
   NOTION_API_KEY=secret_your_integration_token_here
   NOTION_BLOG_POSTS_DB_ID=abc123def456
   NOTION_SERVICES_DB_ID=def456ghi789
   NOTION_SUBURBS_DB_ID=ghi789jkl012
   NOTION_CASE_STUDIES_DB_ID=jkl012mno345
   NOTION_TESTIMONIALS_DB_ID=mno345pqr678
   NOTION_KNOWLEDGE_BASE_DB_ID=pqr678stu901
   NOTION_KNOWLEDGE_FILES_DB_ID=stu901vwx234

   # Supabase Configuration
   SUPABASE_URL=https://vlnkzpyeppfdmresiaoh.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Install Python dependencies:
   ```bash
   cd scripts
   pip install -r requirements.txt
   ```

4. Test the sync manually:
   ```bash
   python notion_supabase_sync.py
   ```

5. Check the output for any errors

---

## Step 5: Schedule Automated Sync

### Option A: Cron Job (Linux/macOS)

1. Edit crontab:
   ```bash
   crontab -e
   ```

2. Add this line (runs every 15 minutes):
   ```bash
   */15 * * * * cd /path/to/project/scripts && /usr/bin/python3 notion_supabase_sync.py >> /var/log/notion_sync.log 2>&1
   ```

### Option B: systemd Timer (Linux)

1. Create service file: `/etc/systemd/system/notion-sync.service`
   ```ini
   [Unit]
   Description=Notion to Supabase Sync
   After=network.target

   [Service]
   Type=oneshot
   WorkingDirectory=/path/to/project/scripts
   ExecStart=/usr/bin/python3 /path/to/project/scripts/notion_supabase_sync.py
   User=your_user
   ```

2. Create timer file: `/etc/systemd/system/notion-sync.timer`
   ```ini
   [Unit]
   Description=Run Notion Sync every 15 minutes

   [Timer]
   OnBootSec=5min
   OnUnitActiveSec=15min

   [Install]
   WantedBy=timers.target
   ```

3. Enable and start:
   ```bash
   sudo systemctl enable notion-sync.timer
   sudo systemctl start notion-sync.timer
   ```

### Option C: GitHub Actions (if using Git)

Create `.github/workflows/notion-sync.yml`:
```yaml
name: Notion Sync
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r scripts/requirements.txt
      - run: python scripts/notion_supabase_sync.py
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## Step 6: Verify Sync

1. Add a test blog post in Notion Blog Posts database
2. Wait 15 minutes (or run sync manually)
3. Check Supabase:
   ```sql
   SELECT * FROM content_blog_posts ORDER BY created_at DESC LIMIT 5;
   ```
4. Verify the blog post appears
5. Check `content_sync_log` table for sync status:
   ```sql
   SELECT * FROM content_sync_log ORDER BY started_at DESC LIMIT 10;
   ```

---

## Troubleshooting

### Sync Script Errors

**Error: "Notion API key invalid"**
- Verify your integration token is correct
- Ensure the integration has access to all databases (click Share → Invite integration)

**Error: "Database not found"**
- Check database IDs in `.env` are correct
- Verify databases are shared with the integration

**Error: "Permission denied on Supabase"**
- Use the service role key (not the anon key)
- Check RLS policies allow service role to insert/update

### Data Not Appearing

1. Check sync logs:
   ```bash
   tail -f /var/log/notion_sync.log
   ```

2. Verify last sync time:
   ```sql
   SELECT table_name, sync_status, records_synced, completed_at 
   FROM content_sync_log 
   ORDER BY started_at DESC 
   LIMIT 10;
   ```

3. Check for errors:
   ```sql
   SELECT table_name, errors 
   FROM content_sync_log 
   WHERE sync_status = 'failed';
   ```

---

## Maintenance

### Updating Notion Schema

If you add new properties to Notion databases:
1. Update the sync script (`notion_supabase_sync.py`)
2. Add corresponding columns to Supabase tables (via migration)
3. Test sync manually before scheduling

### Backup Strategy

Notion databases are backed up automatically by Notion (7-day history).

For Supabase data:
1. Daily automated backups (included in Supabase plan)
2. Manual export via Supabase dashboard: Database → Backups

---

## Next Steps

Once Notion integration is working:
1. ✅ Migrate all existing content from `.ts` files to Notion
2. ✅ Build public website pages that query Supabase `content_*` tables
3. ✅ Implement GWA workflows (Phase 3)
4. ✅ Set up proactive analytics (Phase 4)

---

## Support

**Notion API Docs:** https://developers.notion.com  
**Supabase Docs:** https://supabase.com/docs  
**Project Docs:** See `SYSTEM_INTEGRATION.md`
