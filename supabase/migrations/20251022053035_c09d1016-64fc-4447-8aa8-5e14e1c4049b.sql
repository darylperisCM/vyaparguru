-- Fix missing RLS policies on conversion_events and user_events tables
-- These tables had RLS enabled but no policies, allowing no access to anyone

-- Add policies for conversion_events
CREATE POLICY "Users can view own conversion events"
  ON public.conversion_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to conversion_events"
  ON public.conversion_events FOR ALL
  USING (auth.role() = 'service_role');

-- Add policies for user_events  
CREATE POLICY "Users can view own events"
  ON public.user_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to user_events"
  ON public.user_events FOR ALL
  USING (auth.role() = 'service_role');