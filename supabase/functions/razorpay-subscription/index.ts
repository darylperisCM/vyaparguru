import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const uuidSchema = z.string().uuid('Invalid user or subscription ID format');

const actionSchema = z.enum(
  ['create-plan', 'create-subscription', 'cancel-subscription', 'check-status'],
  { errorMap: () => ({ message: 'Invalid action' }) }
);

const createSubscriptionSchema = z.object({
  action: z.literal('create-subscription'),
  userId: uuidSchema,
});

const cancelSubscriptionSchema = z.object({
  action: z.literal('cancel-subscription'),
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

const checkStatusSchema = z.object({
  action: z.literal('check-status'),
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

const createPlanSchema = z.object({
  action: z.literal('create-plan'),
});

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const RAZORPAY_API_URL = 'https://api.razorpay.com/v1';
const PLAN_AMOUNT = 9900; // ₹99 in paise
const TRIAL_PERIOD_DAYS = 3;

interface CreatePlanResponse {
  id: string;
  entity: string;
  interval: number;
  period: string;
  item: {
    id: string;
    amount: number;
    currency: string;
  };
}

interface CreateSubscriptionResponse {
  id: string;
  entity: string;
  status: string;
  customer_id?: string;
  plan_id: string;
  trial_end?: number;
  next_billing_at?: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Extract and verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Invalid auth token:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawBody = await req.json();
    
    // Validate action first
    let action: string;
    try {
      action = actionSchema.parse(rawBody.action);
    } catch (validationError: any) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid action',
          details: validationError.errors || validationError.message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate request body based on action
    let validatedData: any;
    try {
      if (action === 'create-plan') {
        validatedData = createPlanSchema.parse(rawBody);
      } else if (action === 'create-subscription') {
        validatedData = createSubscriptionSchema.parse(rawBody);
        // Verify the userId matches the authenticated user
        if (validatedData.userId !== user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot create subscription for another user' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else if (action === 'cancel-subscription') {
        validatedData = cancelSubscriptionSchema.parse(rawBody);
      } else if (action === 'check-status') {
        validatedData = checkStatusSchema.parse(rawBody);
      }
    } catch (validationError: any) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          details: validationError.errors || validationError.message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId, subscriptionId } = validatedData;

    console.log(`Razorpay subscription action: ${action} by user ${user.id.substring(0, 8)}***`);

    // Create or get plan
    if (action === 'create-plan') {
      const planResponse = await fetch(`${RAZORPAY_API_URL}/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: 'monthly',
          interval: 1,
          item: {
            name: 'VyaparGuru - व्यापार गुरु',
            amount: PLAN_AMOUNT,
            currency: 'INR',
            description: 'Business English learning subscription'
          }
        })
      });

      if (!planResponse.ok) {
        const error = await planResponse.text();
        console.error('Razorpay create plan error:', error);
        throw new Error(`Failed to create plan: ${error}`);
      }

      const plan: CreatePlanResponse = await planResponse.json();
      console.log('Plan created');

      return new Response(JSON.stringify({ planId: plan.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create subscription with trial
    if (action === 'create-subscription') {
      if (!userId) {
        throw new Error('userId is required');
      }

      // First, ensure plan exists or create it
      const listPlansResponse = await fetch(`${RAZORPAY_API_URL}/plans`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
        }
      });

      let planId: string;
      
      if (listPlansResponse.ok) {
        const plansData = await listPlansResponse.json();
        const existingPlan = plansData.items?.find((p: any) => 
          p.item.amount === PLAN_AMOUNT && p.period === 'monthly'
        );

        if (existingPlan) {
          planId = existingPlan.id;
          console.log('Using existing plan');
        } else {
          // Create new plan
          const createPlanResp = await fetch(`${RAZORPAY_API_URL}/plans`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              period: 'monthly',
              interval: 1,
              item: {
                name: 'VyaparGuru - व्यापार गुरु',
                amount: PLAN_AMOUNT,
                currency: 'INR',
              }
            })
          });

          const newPlan = await createPlanResp.json();
          planId = newPlan.id;
          console.log('Created new plan');
        }
      } else {
        throw new Error('Failed to fetch plans from Razorpay');
      }

      // Create subscription (trial is managed by our app, not Razorpay)
      const subscriptionResponse = await fetch(`${RAZORPAY_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          customer_notify: 1,
          total_count: 120, // 10 years of monthly charges
          notes: {
            user_id: userId
          }
        })
      });

      if (!subscriptionResponse.ok) {
        const error = await subscriptionResponse.text();
        console.error('Razorpay create subscription error:', error);
        throw new Error(`Failed to create subscription: ${error}`);
      }

      const subscription: CreateSubscriptionResponse = await subscriptionResponse.json();
      console.log('✅ Razorpay subscription created:', subscription.id);
      console.log('📊 Subscription status:', subscription.status);
      console.log('📅 Next billing:', subscription.next_billing_at);

      // Get existing trial_ends_at from database (set by database trigger)
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('trial_ends_at')
        .eq('user_id', userId)
        .single();
      
      console.log('📝 Updating subscription in database for user:', userId.substring(0, 8) + '***');

      // Update Supabase subscription record with Razorpay subscription ID
      // Keep the trial_ends_at that was set by the database trigger
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          rzp_subscription_id: subscription.id,
          razorpay_plan_id: planId,
          status: 'trial',
          next_billing_date: subscription.next_billing_at ? 
            new Date(subscription.next_billing_at * 1000).toISOString() : null
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('❌ Failed to update subscription in DB:', updateError);
        throw updateError;
      }
      
      console.log('✅ Database updated successfully');

      // Log event
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (subData) {
        await supabase.from('subscription_events').insert({
          subscription_id: subData.id,
          event_type: 'created',
          event_data: subscription
        });
      }

      return new Response(JSON.stringify({ 
        success: true,
        subscriptionId: subscription.id,
        trialEnd: subscription.trial_end
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Cancel subscription
    if (action === 'cancel-subscription') {
      // Verify ownership: user must own the subscription they're trying to cancel
      const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('user_id, rzp_subscription_id')
        .eq('rzp_subscription_id', subscriptionId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching subscription:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify subscription ownership' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!subscription) {
        return new Response(
          JSON.stringify({ error: 'Subscription not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (subscription.user_id !== user.id) {
        console.warn(`User ${user.id.substring(0, 8)}*** attempted to cancel subscription owned by ${subscription.user_id.substring(0, 8)}***`);
        return new Response(
          JSON.stringify({ error: 'You do not have permission to cancel this subscription' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const cancelResponse = await fetch(
        `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cancel_at_cycle_end: 0 })
        }
      );

      if (!cancelResponse.ok) {
        const error = await cancelResponse.text();
        console.error('Razorpay cancel subscription error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to cancel subscription. Please try again or contact support.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const cancelledSub = await cancelResponse.json();

      // Update database
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('rzp_subscription_id', subscriptionId);

      if (updateError) {
        console.error('Failed to update cancelled subscription:', updateError);
        throw updateError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check subscription status
    if (action === 'check-status') {
      // Verify ownership: user must own the subscription they're checking
      const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('user_id, rzp_subscription_id')
        .eq('rzp_subscription_id', subscriptionId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching subscription:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify subscription ownership' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!subscription) {
        return new Response(
          JSON.stringify({ error: 'Subscription not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (subscription.user_id !== user.id) {
        console.warn(`User ${user.id.substring(0, 8)}*** attempted to check subscription owned by ${subscription.user_id.substring(0, 8)}***`);
        return new Response(
          JSON.stringify({ error: 'You do not have permission to view this subscription' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const statusResponse = await fetch(
        `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
          }
        }
      );

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Razorpay check status error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to check subscription status. Please try again or contact support.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const subscriptionData = await statusResponse.json();

      return new Response(JSON.stringify(subscriptionData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in razorpay-subscription:', error);
    
    // Safe error messages for users
    const safeErrorMessage = error.message?.includes('Failed to')
      ? error.message
      : 'An error occurred processing your request. Please try again or contact support.';
    
    return new Response(
      JSON.stringify({ error: safeErrorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
