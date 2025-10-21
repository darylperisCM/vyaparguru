-- Reset subscription for testing (user_id: 0a0c5679-03ec-4a2f-900f-51df6e475c30)
UPDATE public.subscriptions
SET 
  status = 'trial',
  trial_ends_at = now() + interval '3 days',
  rzp_subscription_id = NULL,
  razorpay_payment_id = NULL,
  razorpay_plan_id = NULL,
  next_billing_date = NULL,
  cancelled_at = now()
WHERE user_id = '0a0c5679-03ec-4a2f-900f-51df6e475c30';