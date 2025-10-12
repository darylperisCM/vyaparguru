-- Add unique constraint on user_id in subscriptions table
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Backfill missing subscriptions for users who have profiles but no subscriptions
INSERT INTO public.subscriptions (user_id, trial_ends_at, status, plan_name)
SELECT 
  p.user_id,
  now() + interval '3 days' as trial_ends_at,
  'trial' as status,
  'VyaparGuru - व्यापार गुरु' as plan_name
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s WHERE s.user_id = p.user_id
);