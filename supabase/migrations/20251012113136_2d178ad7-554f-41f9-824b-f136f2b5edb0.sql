-- Step 1: Delete duplicate profiles, keeping only the most recent one per phone number
DELETE FROM public.profiles
WHERE id IN (
  SELECT p.id
  FROM public.profiles p
  INNER JOIN (
    SELECT mobile_number, MAX(created_at) as max_created_at
    FROM public.profiles
    GROUP BY mobile_number
    HAVING COUNT(*) > 1
  ) duplicates ON p.mobile_number = duplicates.mobile_number
  WHERE p.created_at < duplicates.max_created_at
);

-- Step 2: Delete subscriptions for users that no longer have profiles
DELETE FROM public.subscriptions
WHERE user_id NOT IN (SELECT user_id FROM public.profiles);

-- Step 3: Create phone_auth table for MSG91 OTP management
CREATE TABLE IF NOT EXISTS public.phone_auth (
  phone_number TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  otp_hash TEXT,
  otp_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.phone_auth ENABLE ROW LEVEL SECURITY;

-- Service role only policy (used by edge functions)
CREATE POLICY "Service role only" ON public.phone_auth
  USING (auth.role() = 'service_role');

-- Step 4: Add unique index on profiles mobile_number
CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_number_idx 
ON public.profiles(mobile_number);

-- Step 5: Add trigger for updated_at
CREATE TRIGGER update_phone_auth_updated_at
  BEFORE UPDATE ON public.phone_auth
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();