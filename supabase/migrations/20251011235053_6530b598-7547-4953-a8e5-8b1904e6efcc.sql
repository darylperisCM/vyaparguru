-- Fix the missing trigger and update plan name to "VyaparGuru - व्यापार गुरु"

-- Update the handle_new_user_subscription function with correct plan name
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create subscription with 3-day trial for new user
  INSERT INTO public.subscriptions (user_id, trial_ends_at, status, plan_name)
  VALUES (
    NEW.user_id,
    now() + interval '3 days',
    'trial',
    'VyaparGuru - व्यापार गुरु'
  );
  RETURN NEW;
END;
$function$;

-- Create the missing trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created_subscription ON public.profiles;
CREATE TRIGGER on_profile_created_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Create trial subscriptions for existing users who don't have one
INSERT INTO public.subscriptions (user_id, trial_ends_at, status, plan_name)
SELECT 
  p.user_id,
  now() + interval '3 days' as trial_ends_at,
  'trial' as status,
  'VyaparGuru - व्यापार गुरु' as plan_name
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.user_id = s.user_id
WHERE s.id IS NULL;