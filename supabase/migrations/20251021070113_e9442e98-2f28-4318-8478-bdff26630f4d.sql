-- Backfill trial subscriptions for users who have profiles but no subscriptions
-- This handles cases where subscriptions were accidentally deleted
INSERT INTO public.subscriptions (user_id, trial_ends_at, status, plan_name, created_at)
SELECT 
  p.user_id,
  now() + interval '3 days' as trial_ends_at,
  'trial' as status,
  'VyaparGuru - व्यापार गुरु' as plan_name,
  now() as created_at
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s WHERE s.user_id = p.user_id
)
ON CONFLICT (user_id) DO NOTHING;