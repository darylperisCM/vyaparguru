import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      console.error('Missing webhook signature');
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.text();
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return new Response('Unauthorized', { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event.event);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const eventType = event.event;
    const payload = event.payload;
    const subscriptionEntity = payload?.subscription?.entity || payload?.payment?.entity;

    if (!subscriptionEntity) {
      console.log('No subscription entity in payload');
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const rzpSubscriptionId = subscriptionEntity.id || payload?.subscription?.entity?.id;

    // Find subscription in database
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('rzp_subscription_id', rzpSubscriptionId)
      .single();

    if (fetchError || !subscription) {
      console.error('Subscription not found:', rzpSubscriptionId, fetchError);
      return new Response(JSON.stringify({ error: 'Subscription not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle different webhook events
    switch (eventType) {
      case 'subscription.authenticated':
        console.log('Subscription authenticated (first payment successful)');
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            razorpay_payment_id: payload.payment?.entity?.id,
            next_billing_date: subscriptionEntity.next_billing_at ? 
              new Date(subscriptionEntity.next_billing_at * 1000).toISOString() : null
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'authenticated',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      case 'subscription.charged':
        console.log('Subscription charged (recurring payment successful)');
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            razorpay_payment_id: payload.payment?.entity?.id,
            next_billing_date: subscriptionEntity.next_billing_at ? 
              new Date(subscriptionEntity.next_billing_at * 1000).toISOString() : null
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'charged',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      case 'subscription.cancelled':
        console.log('Subscription cancelled');
        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'cancelled',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      case 'subscription.paused':
        console.log('Subscription paused (payment failed)');
        await supabase
          .from('subscriptions')
          .update({
            status: 'paused'
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'paused',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      case 'subscription.completed':
        console.log('Subscription completed');
        await supabase
          .from('subscriptions')
          .update({
            status: 'completed'
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'completed',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      case 'payment.failed':
        console.log('Payment failed');
        await supabase
          .from('subscriptions')
          .update({
            status: 'payment_failed'
          })
          .eq('id', subscription.id);

        await supabase.from('subscription_events').insert({
          subscription_id: subscription.id,
          event_type: 'payment_failed',
          razorpay_event_id: event.id,
          event_data: payload
        });
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in razorpay-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
