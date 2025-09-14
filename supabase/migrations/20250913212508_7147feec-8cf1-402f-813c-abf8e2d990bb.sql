-- Create admin profile for the existing user account
-- This will allow the existing user to access the admin dashboard
INSERT INTO public.admin_profiles (user_id, email, full_name, role)
SELECT 
  id, 
  email, 
  'Kaidyn Brownlie - Call Kaids Roofing', 
  'admin'
FROM auth.users 
WHERE email = 'info@callkaidsroofing.com.au'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_profiles WHERE user_id = auth.users.id
);