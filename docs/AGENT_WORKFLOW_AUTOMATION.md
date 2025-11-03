# Agent Workflow Automation Guide

## Overview
Complete automation playbook for CKR-GEM Agentic Workers integration with Lovable portal.

## GWA_01: Lead Capture & Qualification

### Trigger
New lead submitted via web form → `leads` table INSERT

### Agent Actions
1. Extract key information (service type, urgency indicators, suburb)
2. Check suburb against service area list
3. Analyze message sentiment and urgency
4. Score lead (0-100)
5. Tag lead (e.g., "hot_lead", "roof_restoration", "price_shopping")

### Portal Integration
```typescript
// Automatic via database trigger
CREATE TRIGGER trigger_analyze_new_lead
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION notify_agent_lead_created();

// Agent webhook callback updates lead
await supabase.from('leads').update({
  ai_score: 85,
  ai_tags: ['hot_lead', 'roof_restoration'],
  urgency: 'high',
  sentiment: 'positive',
  service_area_match: true
}).eq('id', leadId);
```

### Expected Outcome
- Lead scored within 60 seconds
- Urgency badge appears in Leads Pipeline
- High-scoring leads trigger notification

---

## GWA_03: Project Closeout Automation

### Trigger
Job status changed to "completed" → `jobs` table UPDATE

### Agent Actions
1. Compile job data (service type, suburb, completion date)
2. Generate final invoice PDF
3. Generate warranty certificate (7-10 year workmanship)
4. Create maintenance guide specific to service type
5. Draft thank-you email with review request

### Portal Integration
```typescript
// Triggered when job marked complete
const { generateCloseout } = useAgenticWorker();

await generateCloseout(jobId);

// Agent returns closeout pack
const closeoutPack = {
  invoice_url: 'https://storage.../invoice.pdf',
  warranty_url: 'https://storage.../warranty.pdf',
  maintenance_guide_url: 'https://storage.../maintenance.pdf',
  email_draft: {
    subject: 'Your Roof Restoration - Complete!',
    body: '...',
    review_request_link: 'https://g.page/...'
  }
};

// Store in database
await supabase.from('jobs').update({
  closeout_pack: closeoutPack,
  closeout_sent_at: new Date().toISOString()
}).eq('id', jobId);
```

### Expected Outcome
- Complete closeout pack generated in < 2 minutes
- Professional thank-you email drafted
- Review request included

---

## GWA_06: Quote Follow-up Sequence

### Trigger
Daily cron job checks for quotes sent > 7 days ago with no response

### Agent Actions
1. Query `quotes` table for follow-up candidates
2. For each quote:
   - Review original quote details
   - Draft personalized follow-up email (no-pressure tone)
   - Suggest alternative pricing tiers if applicable
3. Queue drafts for human review

### Portal Integration
```typescript
// Daily cron trigger (edge function)
export async function runQuoteFollowup() {
  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('status', 'sent')
    .lt('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .is('followup_sent_at', null);

  for (const quote of quotes) {
    const { generateFollowup } = useAgenticWorker();
    const draft = await generateFollowup(quote.id);

    await supabase.from('ai_drafts').insert({
      entity_type: 'quote_followup',
      entity_id: quote.id,
      draft_content: draft.data.email_body,
      status: 'pending_review'
    });
  }
}

// User reviews draft in portal
function ReviewFollowupDrafts() {
  const { data: drafts } = useQuery({
    queryKey: ['ai_drafts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_drafts')
        .select('*')
        .eq('status', 'pending_review')
        .eq('entity_type', 'quote_followup');
      return data;
    }
  });

  const handleApprove = async (draftId: string) => {
    // Send email via Resend
    // Mark draft as sent
    await supabase.from('ai_drafts').update({
      status: 'sent'
    }).eq('id', draftId);
  };

  return (
    <div>
      {drafts?.map(draft => (
        <Card key={draft.id}>
          <CardHeader>
            <CardTitle>Follow-up for Quote {draft.entity_id}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{draft.draft_content}</pre>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleApprove(draft.id)}>Approve & Send</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

### Expected Outcome
- No quotes fall through cracks
- Personalized follow-ups ready for review
- Conversion rate increases

---

## GWA_07: Intelligent Quote Assistant

### Trigger
User clicks "AI Suggest" in Quote Builder

### Agent Actions
1. Fetch inspection report data
2. Analyze roof condition, measurements, materials
3. Reference `pricing_models` table for unit prices
4. Suggest line items with quantities
5. Recommend Good/Better/Best tier based on condition
6. Calculate totals

### Portal Integration
```typescript
// Quote Builder component
function QuoteBuilder({ inspectionId }: { inspectionId: string }) {
  const { suggestQuote, isProcessing } = useAgenticWorker();

  const handleAISuggest = async () => {
    const response = await suggestQuote(inspectionId);

    if (response.success) {
      // Pre-fill form
      form.setValue('line_items', response.data.line_items);
      form.setValue('tier', response.data.tier_recommendation);
      form.setValue('subtotal', response.data.subtotal);
      form.setValue('gst', response.data.gst);
      form.setValue('total_inc_gst', response.data.total_inc_gst);

      toast.success(`AI suggested ${response.data.tier_recommendation} tier`);
    }
  };

  return (
    <Button onClick={handleAISuggest} disabled={isProcessing}>
      <Sparkles className="mr-2 h-4 w-4" />
      AI Suggest Quote
    </Button>
  );
}
```

### Expected Outcome
- Quote generation time reduced from 1+ hour to 10 minutes
- Consistent pricing across quotes
- Reduced manual calculation errors

---

## GWA_08: Document Intelligence

### Trigger
User requests document analysis (inspection photos, competitor quotes, etc.)

### Agent Actions
1. Analyze uploaded document/image
2. Extract relevant data (measurements, pricing, materials)
3. Compare against CKR standards
4. Flag issues or opportunities
5. Suggest actions

### Portal Integration
```typescript
// Document upload component
function DocumentAnalyzer() {
  const { query, isProcessing } = useAgenticWorker();

  const handleAnalyze = async (file: File) => {
    const base64 = await fileToBase64(file);

    const response = await query({
      type: 'analyze_document',
      data: {
        image_base64: base64,
        document_type: 'competitor_quote'
      }
    });

    if (response.success) {
      setAnalysis(response.data);
    }
  };

  return (
    <div>
      <Input type="file" onChange={(e) => handleAnalyze(e.target.files[0])} />
      {analysis && (
        <Card>
          <CardContent>
            <h3>Document Analysis</h3>
            <ul>
              {analysis.insights.map((insight: string) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
            <p>Recommended Action: {analysis.recommended_action}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Expected Outcome
- Instant competitor quote analysis
- Photo-based roof measurements
- Document data extraction

---

## GWA_09: Marketing Content Generator

### Trigger
Job status changed to "completed" → Generate social media content

### Agent Actions
1. Fetch job details (service type, suburb, before/after photos)
2. Generate 3 social media post variants:
   - **PAS** (Problem-Agitate-Solution)
   - **AIDA** (Attention-Interest-Desire-Action)
   - **BAB** (Before-After-Bridge)
3. Generate hashtags (suburb-specific, service-specific)
4. Suggest optimal posting times
5. Optional: Generate blog post draft

### Portal Integration
```typescript
// Triggered when job completed
function JobCompleteActions({ jobId }: { jobId: string }) {
  const { generateContent, isProcessing } = useAgenticWorker();

  const handleGenerateContent = async () => {
    const response = await generateContent(jobId);

    if (response.success) {
      // Store social posts
      for (const variant of response.data.social_variants) {
        await supabase.from('social_posts').insert({
          job_id: jobId,
          platform: 'facebook,instagram',
          content: variant.text,
          hashtags: variant.hashtags,
          framework: variant.framework,
          status: 'draft',
          scheduled_for: variant.suggested_time
        });
      }

      toast.success('Content generated! Review in Marketing Studio');
      navigate('/marketing');
    }
  };

  return (
    <Button onClick={handleGenerateContent} disabled={isProcessing}>
      <Sparkles className="mr-2 h-4 w-4" />
      Generate Marketing Content
    </Button>
  );
}

// Marketing Studio displays drafts
function MarketingStudio() {
  const { data: posts } = useQuery({
    queryKey: ['social_posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('social_posts')
        .select('*, jobs(*)')
        .eq('status', 'draft');
      return data;
    }
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts?.map(post => (
        <Card key={post.id}>
          <CardHeader>
            <Badge>{post.framework}</Badge>
            <CardTitle>{post.jobs.service_type} - {post.jobs.suburb}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
            <div className="mt-2">
              {post.hashtags.map((tag: string) => (
                <Badge key={tag} variant="outline">#{tag}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button>Schedule Post</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

### Expected Outcome
- 3 social posts per completed job
- Consistent brand voice
- Populated content calendar
- 5-7 posts/week (vs 1-2 manually)

---

## GWA_12: Intelligent Lead Triage

### Trigger
New lead created → Immediate analysis

### Agent Actions
1. Parse lead message for urgency keywords ("urgent", "emergency", "ASAP")
2. Analyze sentiment (positive/neutral/negative)
3. Classify service type
4. Score conversion probability (0-100)
5. Recommend next action

### Portal Integration
```typescript
// Webhook automatically enriches lead
// Display in Leads Pipeline

function LeadsPipeline() {
  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('ai_score', { ascending: false });
      return data;
    }
  });

  return (
    <Table>
      {leads?.map(lead => (
        <TableRow key={lead.id} className={lead.urgency === 'high' ? 'bg-red-50' : ''}>
          <TableCell>{lead.name}</TableCell>
          <TableCell>
            <Badge variant={getScoreBadgeVariant(lead.ai_score)}>
              {lead.ai_score}/100
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={lead.urgency === 'high' ? 'destructive' : 'outline'}>
              {lead.urgency}
            </Badge>
          </TableCell>
          <TableCell>
            {lead.ai_tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

### Expected Outcome
- Leads sorted by priority automatically
- High-urgency leads highlighted
- Response time < 5 minutes for hot leads

---

## GWA_13: Lead Nurture & Conversion

### Trigger
User views Lead Detail page

### Agent Actions
1. Analyze full lead history (messages, interactions, quote views)
2. Calculate conversion probability
3. Suggest next best action (call, quote, inspection)
4. Draft personalized response message
5. Identify potential objections

### Portal Integration
```typescript
// Lead Detail page
function LeadDetail({ leadId }: { leadId: string }) {
  const { analyzeLead, isProcessing } = useAgenticWorker();
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    loadLeadInsights();
  }, [leadId]);

  const loadLeadInsights = async () => {
    const response = await analyzeLead({
      id: leadId,
      // Full lead data
    });

    if (response.success) {
      setInsights(response.data);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {/* Lead info */}
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {insights && (
              <>
                <p>Conversion Probability: {insights.conversion_probability}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended: {insights.next_action}
                </p>
                <Separator className="my-4" />
                <h4 className="font-semibold">Suggested Response</h4>
                <Textarea value={insights.suggested_response} rows={6} />
                <Button className="mt-2 w-full">Send Message</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Expected Outcome
- Personalized responses for every lead
- Clear next actions
- Higher conversion rates

---

## Automation Summary

| Workflow | Trigger | Automation Level | Time Saved |
|----------|---------|------------------|------------|
| GWA_01 | Lead submitted | Fully automated | 30 min → 1 min |
| GWA_03 | Job completed | Semi-automated (review) | 2 hours → 15 min |
| GWA_06 | 7 days post-quote | Semi-automated (approve) | 1 hour → 5 min |
| GWA_07 | Quote builder | On-demand | 1 hour → 10 min |
| GWA_08 | Document upload | On-demand | 20 min → 2 min |
| GWA_09 | Job completed | Semi-automated | 1 hour → 10 min |
| GWA_12 | Lead submitted | Fully automated | 15 min → 30 sec |
| GWA_13 | Lead detail view | Fully automated | 10 min → instant |

### Total Time Saved Per Week
**12-15 hours** based on typical job volume (10 leads, 5 quotes, 3 completed jobs)

---

## Next Steps
1. Implement GWA_12 first (high impact, low complexity)
2. Test with real leads for 1 week
3. Add GWA_07 (quote assistance) next
4. Gradually roll out remaining workflows
5. Monitor metrics and refine prompts
6. Train team on reviewing AI drafts
