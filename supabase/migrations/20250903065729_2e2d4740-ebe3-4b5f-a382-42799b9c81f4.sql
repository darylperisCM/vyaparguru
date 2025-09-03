-- Fix RLS UPDATE policies to include WITH CHECK clauses
-- This prevents users from updating records to belong to other users

DROP POLICY IF EXISTS "Users can update their own email drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can update their own scenario progress" ON industry_scenario_progress;  
DROP POLICY IF EXISTS "Users can update their own vocab progress" ON industry_vocab_progress;

-- Email drafts - secure UPDATE policy
CREATE POLICY "Users can update their own email drafts" 
ON email_drafts 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Industry scenario progress - secure UPDATE policy  
CREATE POLICY "Users can update their own scenario progress" 
ON industry_scenario_progress 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Industry vocab progress - secure UPDATE policy
CREATE POLICY "Users can update their own vocab progress" 
ON industry_vocab_progress 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);