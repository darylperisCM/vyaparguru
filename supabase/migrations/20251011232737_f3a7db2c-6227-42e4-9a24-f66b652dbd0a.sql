-- Update subscriptions table with Razorpay-specific columns
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS razorpay_plan_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS next_billing_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;

-- Create subscription_events table for audit trail
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  razorpay_event_id text,
  event_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_events
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- RLS policy for users to view their own subscription events
CREATE POLICY "Users can view their own subscription events"
ON public.subscription_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE subscriptions.id = subscription_events.subscription_id
    AND subscriptions.user_id = auth.uid()
  )
);

-- RLS policy for users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Function to auto-create subscription with 3-day trial on user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create subscription with 3-day trial for new user
  INSERT INTO public.subscriptions (user_id, trial_ends_at, status, plan_name)
  VALUES (
    NEW.user_id,
    now() + interval '3 days',
    'trial',
    'Business English Pro - Monthly'
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create subscription when profile is created
DROP TRIGGER IF EXISTS on_profile_created_subscription ON public.profiles;
CREATE TRIGGER on_profile_created_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Add index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription_id ON public.subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);