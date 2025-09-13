-- Bootstrap admin invite for initial setup
INSERT INTO public.admin_invites (
  email, 
  invite_token, 
  invited_by, 
  expires_at
) VALUES (
  'info@callkaidsroofing.com.au',
  gen_random_uuid()::text,
  NULL, -- Bootstrap invite has no inviter
  now() + interval '30 days' -- Longer expiry for bootstrap
);

-- Get the generated invite token for the user
SELECT 
  email,
  invite_token,
  expires_at
FROM public.admin_invites 
WHERE email = 'info@callkaidsroofing.com.au';