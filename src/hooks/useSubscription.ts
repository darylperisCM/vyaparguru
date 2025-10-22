import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  trial_ends_at: string | null;
  rzp_subscription_id: string | null;
  razorpay_plan_id: string | null;
  razorpay_payment_id: string | null;
  next_billing_date: string | null;
  cancelled_at: string | null;
  created_at: string;
  plan_name: string | null;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  hasAccess: boolean;
  isActive: boolean;
  isInTrial: boolean;
  isExpired: boolean;
  isPendingPayment: boolean;
  daysUntilTrialEnd: number;
  trialEndsAt: Date | null;
  nextBillingDate: Date | null;
  refetch: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async (): Promise<void> => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useSubscription] Fetching subscription for user ${user.id.substring(0, 8)}***`);

      const { data, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscriptionError) {
        console.error('[useSubscription] Database error:', subscriptionError);
        throw new Error(`Failed to fetch subscription: ${subscriptionError.message}`);
      }
      
      // DEFENSIVE CHECK: Warn if user has no subscription record
      if (!data && user) {
        console.error('[useSubscription] ⚠️ CRITICAL WARNING: User has no subscription record! User ID:', user.id.substring(0, 8) + '***');
        console.error('[useSubscription] This should not happen - all users should have subscription records created automatically.');
      }
      
      setSubscription(data);
      console.log('[useSubscription] Subscription loaded:', data?.status || 'No subscription');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useSubscription] Error fetching subscription:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subscription status
  const isActive = subscription?.status === 'active';
  const isInTrial = subscription?.status === 'trial' && 
    subscription?.trial_ends_at && 
    new Date(subscription.trial_ends_at) > new Date();
  
 const isExpired = subscription?.status === 'trial_expired' ||
    (subscription?.status === 'trial' && 
     subscription?.trial_ends_at && 
     new Date(subscription.trial_ends_at) <= new Date());

  
  const isPendingPayment = subscription?.status === 'pending' || 
    subscription?.status === 'payment_failed';
  
  const hasAccess = isActive || isInTrial;

  // Calculate additional fields
  const trialEndsAt = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
  const nextBillingDate = subscription?.next_billing_date ? new Date(subscription.next_billing_date) : null;
  const daysUntilTrialEnd = trialEndsAt 
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // 🚨 IMPORTANT: Return data object, NOT JSX
  return {
    subscription,
    loading,
    error,
    hasAccess,
    isActive,
    isInTrial,
    isExpired,
    isPendingPayment,
    daysUntilTrialEnd,
    trialEndsAt,
    nextBillingDate,
    refetch: fetchSubscription
  };
};
