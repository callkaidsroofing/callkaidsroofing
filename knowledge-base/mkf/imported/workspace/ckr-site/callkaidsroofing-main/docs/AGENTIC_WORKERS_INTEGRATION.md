# Agentic Workers Integration Guide

## Overview
Complete integration guide for connecting the CKR-GEM Agentic Workers agent with the Lovable internal portal.

## Environment Setup

### Required Secrets
Add these to your Lovable project (Settings → Secrets):

```
AGENTIC_WORKERS_API_KEY=your_agent_api_key
AGENTIC_WORKERS_WEBHOOK_SECRET=your_webhook_secret
AGENTIC_WORKERS_AGENT_ID=ckr-gem-agent-id
AGENTIC_WORKERS_BASE_URL=https://api.agenticworkers.com/v1
```

### Supabase Configuration
Already configured:
- Project ID: `vlnkzpyeppfdmresiaoh`
- Edge functions ready for agent integration
- Database tables support agent workflows

## Authentication Flow

### Portal → Agent
```typescript
const response = await fetch(`${AGENTIC_WORKERS_BASE_URL}/agents/${AGENT_ID}/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AGENTIC_WORKERS_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: userMessage,
    context: {
      lead_id: leadId,
      user_role: 'inspector'
    }
  })
});
```

### Agent → Portal (Webhooks)
```typescript
// Edge function: agentic-workers-webhook
const signature = req.headers.get('X-Agent-Signature');
const isValid = await verifySignature(signature, body, WEBHOOK_SECRET);

if (!isValid) {
  return new Response('Unauthorized', { status: 401 });
}

// Process webhook payload
const { event_type, data } = await req.json();
```

## Real-Time Communication Patterns

### 1. Synchronous Queries
Used for: Immediate AI assistance in UI
```typescript
// Example: Lead analysis button
const analyzeResult = await agentQuery({
  type: 'analyze_lead',
  lead_data: leadData
});
```

### 2. Asynchronous Jobs
Used for: Long-running tasks (quote generation, content creation)
```typescript
// Submit job
const jobId = await agentJobSubmit({
  type: 'generate_quote',
  inspection_id: inspectionId
});

// Poll for result
const result = await agentJobResult(jobId);
```

### 3. Webhook Triggers
Used for: Automated workflows (follow-ups, scoring)
```sql
-- Database trigger
CREATE TRIGGER notify_agent_new_lead
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION notify_agentic_worker('lead_created', NEW.id);
```

## Error Handling

### Rate Limiting
```typescript
try {
  const response = await agentQuery(data);
} catch (error) {
  if (error.status === 429) {
    toast.error('AI assistant is busy. Please try again in a moment.');
    // Implement exponential backoff
  }
}
```

### Fallback Strategies
```typescript
const analyzeWithFallback = async (leadData) => {
  try {
    return await agentQuery({ type: 'analyze_lead', data: leadData });
  } catch (error) {
    console.error('Agent unavailable:', error);
    // Fallback to rule-based scoring
    return ruleBa sedLeadScore(leadData);
  }
};
```

## Integration Checklist

### Phase 1: Basic Setup ✓
- [ ] Add API keys to project secrets
- [ ] Deploy `agentic-workers-proxy` edge function
- [ ] Create `useAgenticWorker` React hook
- [ ] Test basic query/response

### Phase 2: Lead Intelligence ✓
- [ ] Implement GWA_12 (Intelligent Triage)
- [ ] Implement GWA_13 (Lead Nurture)
- [ ] Add webhook for new leads
- [ ] Display AI insights in Lead Detail

### Phase 3: Quote Automation ✓
- [ ] Implement GWA_07 (Quote Assistance)
- [ ] Add "AI Suggest" to Quote Builder
- [ ] Connect inspection data to agent
- [ ] Pre-fill quote from agent response

### Phase 4: Follow-up Automation ✓
- [ ] Implement GWA_06 (Quote Follow-up)
- [ ] Implement GWA_03 (Project Closeout)
- [ ] Set up daily cron job
- [ ] Queue drafts for review

### Phase 5: Content Pipeline ✓
- [ ] Implement GWA_09 (Marketing Generation)
- [ ] Add "Generate Posts" to completed jobs
- [ ] Preview in Marketing Studio
- [ ] Schedule posts automatically

## Security Best Practices

1. **API Key Management**
   - Store in environment variables only
   - Rotate every 90 days
   - Use separate keys for dev/prod

2. **Webhook Verification**
   - Always verify signatures
   - Reject unsigned requests
   - Log all webhook events

3. **Data Sanitization**
   - Strip PII unless required
   - Validate all inputs
   - Sanitize agent outputs

4. **Rate Limiting**
   - Max 10 requests/minute per user
   - Implement request queuing
   - Cache common responses

## Monitoring & Logging

### Log All Agent Interactions
```typescript
await supabase.from('ai_actions').insert({
  action_type: 'agent_query',
  input_data: { query: userQuery },
  output_data: { response: agentResponse },
  user_id: userId,
  execution_time_ms: executionTime
});
```

### Track Performance Metrics
- Average response time
- Success rate
- Token usage
- Error frequency

## Troubleshooting

### Agent Not Responding
1. Check API key is valid
2. Verify edge function deployed
3. Check function logs: `supabase functions logs agentic-workers-proxy`
4. Test with curl

### Webhook Failures
1. Verify webhook URL in Agentic Workers dashboard
2. Check signature verification logic
3. Ensure clock sync (webhooks expire after 5 min)
4. Test with manual webhook trigger

### Off-Brand Responses
1. Review agent knowledge base (KF_01, KF_09)
2. Update system prompt with brand guidelines
3. Use temperature=0.3 for consistency
4. Add more training examples

## Next Steps

1. Complete Phase 1 setup (1-2 hours)
2. Test with GWA_12 (Lead Triage) first
3. Gradually expand to other workflows
4. Monitor performance and iterate
5. Document learnings for team
