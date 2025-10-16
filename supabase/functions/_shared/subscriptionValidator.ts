import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface SubscriptionValidationResult {
  user: any;
  subscription: any;
  hasAccess: boolean;
}

export async function validateSubscriptionAccess(
  authHeader: string | null
): Promise<SubscriptionValidationResult> {
  
  // Step 1: Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }

  // Step 2: Initialize Supabase client with service role
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Step 3: Verify JWT and get user
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    console.error('Invalid auth token:', userError?.message);
    throw new Error('INVALID_TOKEN');
  }

  // Step 4: Fetch user's subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('id, status, trial_ends_at, next_billing_date, cancelled_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subError) {
    console.error('Error fetching subscription:', subError.message);
    throw new Error('SUBSCRIPTION_CHECK_FAILED');
  }

  // Step 5: No subscription found
  if (!subscription) {
    throw new Error('NO_SUBSCRIPTION');
  }

  // Step 6: Validate subscription status
  const now = new Date();
  
  // Check if in valid trial period
  const isInTrial = subscription.status === 'trial' && 
    subscription.trial_ends_at &&
    new Date(subscription.trial_ends_at) > now;
  
  // Check if active paid subscription
  const isActive = subscription.status === 'active';
  
  // Check if subscription is cancelled but still valid until end date
  const isCancelledButValid = subscription.status === 'cancelled' &&
    subscription.next_billing_date &&
    new Date(subscription.next_billing_date) > now;

  const hasAccess = isInTrial || isActive || isCancelledButValid;

  if (!hasAccess) {
    const errorCode = subscription.status === 'trial' ? 'TRIAL_EXPIRED' : 'SUBSCRIPTION_EXPIRED';
    throw new Error(errorCode);
  }

  return {
    user,
    subscription,
    hasAccess: true
  };
}

// Error message generator
export function getSubscriptionErrorResponse(errorCode: string): {
  message: string;
  requiresSubscription: boolean;
  subscriptionStatus?: string;
} {
  const errorMessages: Record<string, any> = {
    AUTHENTICATION_REQUIRED: {
      message: 'Please sign in to access VyaparGuru premium features',
      requiresSubscription: true
    },
    INVALID_TOKEN: {
      message: 'Your session has expired. Please sign in again',
      requiresSubscription: true
    },
    NO_SUBSCRIPTION: {
      message: 'No subscription found. Start your free 3-day trial to access premium features',
      requiresSubscription: true,
      subscriptionStatus: 'none'
    },
    TRIAL_EXPIRED: {
      message: 'Your 3-day trial has ended. Subscribe now to continue using VyaparGuru',
      requiresSubscription: true,
      subscriptionStatus: 'expired'
    },
    SUBSCRIPTION_EXPIRED: {
      message: 'Your subscription has expired. Renew now to restore access',
      requiresSubscription: true,
      subscriptionStatus: 'expired'
    },
    SUBSCRIPTION_CHECK_FAILED: {
      message: 'Unable to verify subscription. Please try again',
      requiresSubscription: true
    }
  };

  return errorMessages[errorCode] || {
    message: 'Access denied. Please check your subscription status',
    requiresSubscription: true
  };
}
