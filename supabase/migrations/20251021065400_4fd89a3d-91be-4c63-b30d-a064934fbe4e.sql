-- Delete old subscription completely for fresh start (user_id: 0a0c5679-03ec-4a2f-900f-51df6e475c30)
DELETE FROM public.subscriptions
WHERE user_id = '0a0c5679-03ec-4a2f-900f-51df6e475c30';

-- The database trigger will automatically create a new trial subscription