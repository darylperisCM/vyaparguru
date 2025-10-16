import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { action, userId, subscriptionId } = await req.json();

    console.log(`Razorpay subscription action: ${action}`);

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
      console.log('Razorpay subscription created');

      // Get existing trial_ends_at from database (set by database trigger)
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('trial_ends_at')
        .eq('user_id', userId)
        .single();

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
        console.error('Failed to update subscription in DB:', updateError);
        throw updateError;
      }

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
      if (!subscriptionId) {
        throw new Error('subscriptionId is required');
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
        throw new Error(`Failed to cancel subscription: ${error}`);
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
      if (!subscriptionId) {
        throw new Error('subscriptionId is required');
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
        throw new Error(`Failed to check status: ${error}`);
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

  } catch (error) {
    console.error('Error in razorpay-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
