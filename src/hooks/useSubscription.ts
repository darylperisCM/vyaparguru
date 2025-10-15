import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  trial_ends_at: string | null;
  next_billing_date: string | null;
  rzp_subscription_id: string | null;
  plan_name: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();

    // Set up real-time subscription
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchSubscription = async (retryCount = 0) => {
    if (!user) {
      console.log('[useSubscription] No user, skipping fetch');
      return;
    }

    console.log('[useSubscription] Fetching subscription for user:', user.id, `(attempt ${retryCount + 1})`);

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('[useSubscription] Query result:', { data, error });

      if (error) throw error;
      
      // If no subscription found and we haven't exceeded retry limit
      if (!data && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 500; // 500ms, 1000ms, 2000ms
        console.log(`[useSubscription] No subscription found, retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        
        setTimeout(() => {
          fetchSubscription(retryCount + 1);
        }, delay);
        return;
      }
      
      setSubscription(data);
      setLoading(false); // Set loading to false when data is received
      console.log('[useSubscription] Subscription set:', data);
    } catch (error) {
      console.error('[useSubscription] Error fetching subscription:', error);
      setLoading(false); // Also set loading to false on error
    }
  };

  const isInTrial = subscription?.status === 'trial';
  const isActive = subscription?.status === 'active';
  const isPendingPayment = subscription?.status === 'pending_payment';
  const isExpired = subscription?.status === 'expired' || subscription?.status === 'payment_failed';
  const isCancelled = subscription?.status === 'cancelled';

  const trialEndsAt = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
  const nextBillingDate = subscription?.next_billing_date ? new Date(subscription.next_billing_date) : null;

  const daysUntilTrialEnd = trialEndsAt 
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const hasAccess = isInTrial || isActive;

  console.log('[useSubscription] Current state:', {
    subscriptionExists: !!subscription,
    status: subscription?.status,
    isInTrial,
    isActive,
    hasAccess,
    trialEndsAt: subscription?.trial_ends_at,
    daysUntilTrialEnd
  });

  return {
    subscription,
    loading,
    isInTrial,
    isActive,
    isPendingPayment,
    isExpired,
    isCancelled,
    hasAccess,
    trialEndsAt,
    nextBillingDate,
    daysUntilTrialEnd,
    refetch: fetchSubscription
  };
};
