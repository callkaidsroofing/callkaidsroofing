-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Grant usage on extensions schema to postgres
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule Notion sync to run every 15 minutes
-- This will call the notion-sync edge function automatically
SELECT cron.schedule(
  'notion-sync-every-15-min',
  '*/15 * * * *',  -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/notion-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Verify the scheduled job was created
SELECT jobid, schedule, command 
FROM cron.job 
WHERE jobname = 'notion-sync-every-15-min';