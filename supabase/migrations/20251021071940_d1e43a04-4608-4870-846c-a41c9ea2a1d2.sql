-- Clean up existing subscription records to force fresh start with correct plan
-- This will allow users to create new subscriptions with the correct ₹99 plan
DELETE FROM public.subscriptions 
WHERE status IN ('trial', 'created', 'authenticated')
AND (razorpay_plan_id IS NULL OR razorpay_plan_id != '');

-- Note: This will trigger the database function to recreate trial subscriptions
-- when users sign in again, ensuring they get fresh 3-day trials