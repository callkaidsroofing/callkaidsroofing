# Webhook Integration Patterns

## Overview
Bidirectional webhook patterns for Supabase ↔ Agentic Workers communication.

## Supabase → Agentic Workers

### Webhook Triggers

#### 1. New Lead Created (GWA_12)
```sql
-- Database function
CREATE OR REPLACE FUNCTION notify_agent_lead_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://api.agenticworkers.com/v1/webhooks/lead-created',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.agentic_workers_api_key'),
      'Content-Type', 'application/json',
      'X-Webhook-Signature', encode(hmac(NEW.id::text, current_setting('app.webhook_secret'), 'sha256'), 'hex')
    ),
    body := jsonb_build_object(
      'event_type', 'lead.created',
      'lead_id', NEW.id,
      'lead_data', jsonb_build_object(
        'name', NEW.name,
        'phone', NEW.phone,
        'service', NEW.service,
        'suburb', NEW.suburb,
        'message', NEW.message,
        'source', NEW.source
      ),
      'timestamp', NOW()
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER trigger_notify_agent_lead_created
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION notify_agent_lead_created();
```

#### 2. Quote Sent (GWA_06)
```sql
CREATE OR REPLACE FUNCTION notify_agent_quote_sent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND (OLD.status IS NULL OR OLD.status != 'sent') THEN
    PERFORM net.http_post(
      url := 'https://api.agenticworkers.com/v1/webhooks/quote-sent',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.agentic_workers_api_key'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'event_type', 'quote.sent',
        'quote_id', NEW.id,
        'sent_at', NEW.sent_at,
        'client_email', NEW.client_email
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_agent_quote_sent
AFTER UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION notify_agent_quote_sent();
```

#### 3. Job Completed (GWA_03, GWA_09)
```sql
CREATE OR REPLACE FUNCTION notify_agent_job_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM net.http_post(
      url := 'https://api.agenticworkers.com/v1/webhooks/job-completed',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.agentic_workers_api_key'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'event_type', 'job.completed',
        'job_id', NEW.id,
        'completed_at', NEW.completed_at,
        'service_type', NEW.service_type,
        'suburb', NEW.suburb
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_agent_job_completed
AFTER UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION notify_agent_job_completed();
```

## Agentic Workers → Portal

### Webhook Receiver Edge Function

```typescript
// supabase/functions/agentic-workers-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('X-Agent-Signature');
    const body = await req.text();
    const expectedSignature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(body + Deno.env.get('AGENTIC_WORKERS_WEBHOOK_SECRET'))
    );
    
    if (signature !== Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')) {
      return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    }

    const payload = JSON.parse(body);
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Route by event type
    switch (payload.event_type) {
      case 'lead.analyzed':
        await handleLeadAnalyzed(supabase, payload);
        break;
      case 'quote.draft_ready':
        await handleQuoteDraft(supabase, payload);
        break;
      case 'followup.draft_ready':
        await handleFollowupDraft(supabase, payload);
        break;
      case 'content.generated':
        await handleContentGenerated(supabase, payload);
        break;
      default:
        console.warn('Unknown event type:', payload.event_type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleLeadAnalyzed(supabase: any, payload: any) {
  const { lead_id, analysis } = payload.data;
  
  await supabase.from('leads').update({
    ai_score: analysis.score,
    ai_tags: analysis.tags,
    urgency: analysis.urgency,
    sentiment: analysis.sentiment,
    auto_enriched_at: new Date().toISOString()
  }).eq('id', lead_id);

  console.log(`Lead ${lead_id} analyzed: score=${analysis.score}`);
}

async function handleQuoteDraft(supabase: any, payload: any) {
  const { quote_id, draft } = payload.data;
  
  // Store draft for review
  await supabase.from('ai_drafts').insert({
    entity_type: 'quote',
    entity_id: quote_id,
    draft_content: draft,
    status: 'pending_review',
    created_by_agent: true
  });

  console.log(`Quote draft ready for ${quote_id}`);
}

async function handleFollowupDraft(supabase: any, payload: any) {
  const { quote_id, email_draft } = payload.data;
  
  await supabase.from('ai_drafts').insert({
    entity_type: 'followup',
    entity_id: quote_id,
    draft_content: email_draft,
    status: 'pending_review',
    created_by_agent: true
  });

  console.log(`Follow-up draft ready for quote ${quote_id}`);
}

async function handleContentGenerated(supabase: any, payload: any) {
  const { job_id, content } = payload.data;
  
  // Store social media posts
  for (const variant of content.social_variants) {
    await supabase.from('social_posts').insert({
      job_id,
      platform: 'facebook,instagram',
      content: variant.text,
      framework: variant.framework, // PAS, AIDA, BAB
      status: 'draft',
      scheduled_for: variant.suggested_time,
      ai_generated: true
    });
  }

  console.log(`Content generated for job ${job_id}`);
}
```

### Webhook Event Types

| Event Type | Trigger | Payload | Portal Action |
|------------|---------|---------|---------------|
| `lead.analyzed` | GWA_12 completes | `{ lead_id, analysis: { score, tags, urgency, sentiment } }` | Update lead record |
| `quote.draft_ready` | GWA_07 completes | `{ quote_id, draft: { line_items[], totals } }` | Store in ai_drafts table |
| `followup.draft_ready` | GWA_06 completes | `{ quote_id, email_draft: { subject, body } }` | Store in ai_drafts table |
| `content.generated` | GWA_09 completes | `{ job_id, content: { social_variants[], blog_draft } }` | Insert into social_posts |
| `closeout.ready` | GWA_03 completes | `{ job_id, documents: { invoice_url, warranty_url } }` | Update job record |

## Webhook Security

### Signature Verification (HMAC-SHA256)
```typescript
async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(body + secret)
  );
  
  const expectedHex = Array.from(new Uint8Array(expectedSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signature === expectedHex;
}
```

### Rate Limiting
```typescript
const RATE_LIMIT = 100; // requests per minute
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(agentId: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(agentId) || [];
  const recentRequests = requests.filter(t => now - t < 60000);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(agentId, recentRequests);
  return true;
}
```

## Testing Webhooks

### Manual Webhook Trigger (for development)
```bash
curl -X POST https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/agentic-workers-webhook \
  -H "Content-Type: application/json" \
  -H "X-Agent-Signature: your_test_signature" \
  -d '{
    "event_type": "lead.analyzed",
    "data": {
      "lead_id": "test-lead-123",
      "analysis": {
        "score": 85,
        "tags": ["hot_lead", "roof_restoration"],
        "urgency": "high",
        "sentiment": "positive"
      }
    }
  }'
```

### Webhook Debugging Checklist
- [ ] Verify webhook URL is correct in Agentic Workers dashboard
- [ ] Check edge function is deployed: `supabase functions list`
- [ ] View function logs: `supabase functions logs agentic-workers-webhook`
- [ ] Confirm signature secret matches in both systems
- [ ] Test with manual curl request
- [ ] Check database for updated records

## Retry Logic

### Exponential Backoff
```typescript
async function sendWebhookWithRetry(url: string, payload: any, maxRetries = 3) {
  let delay = 1000; // Start with 1 second
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) return response;
      
      if (response.status === 429) {
        // Rate limited, wait longer
        await new Promise(resolve => setTimeout(resolve, delay * 2));
        delay *= 2;
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
```

## Next Steps
1. Deploy `agentic-workers-webhook` edge function
2. Configure webhook URL in Agentic Workers dashboard
3. Test with manual trigger
4. Enable database triggers for automated events
5. Monitor webhook logs for errors
