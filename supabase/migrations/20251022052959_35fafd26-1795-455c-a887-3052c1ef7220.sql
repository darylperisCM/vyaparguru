-- Restore missing subscription records for existing users
-- This fixes the issue where users cannot subscribe because their subscription record is missing

INSERT INTO public.subscriptions (user_id, status, trial_ends_at, created_at)
SELECT 
  p.user_id,
  CASE 
    WHEN (p.created_at + interval '3 days') > now() THEN 'trial'
    ELSE 'trial_expired'
  END as status,
  (p.created_at + interval '3 days') as trial_ends_at,
  p.created_at as created_at
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.user_id = s.user_id
WHERE s.id IS NULL  -- Only create for users without subscription records
ON CONFLICT DO NOTHING;