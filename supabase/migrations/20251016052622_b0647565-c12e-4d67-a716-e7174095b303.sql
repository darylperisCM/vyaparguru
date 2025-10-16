-- Fix profiles table RLS policies
-- Add explicit INSERT policy for service role only
CREATE POLICY "Service role can insert profiles"
ON public.profiles FOR INSERT
TO service_role
WITH CHECK (true);

-- Prevent regular users from inserting profiles directly
CREATE POLICY "Users cannot insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (false);

-- Prevent profile deletion entirely (business rule)
CREATE POLICY "Profiles cannot be deleted"
ON public.profiles FOR DELETE
USING (false);