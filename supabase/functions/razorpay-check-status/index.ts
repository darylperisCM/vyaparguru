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

serve(async (req) => {
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
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: 'Subscription ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking Razorpay status for subscription: ${subscriptionId}`);

    // Fetch subscription status from Razorpay
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
      console.error('Razorpay API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to check subscription status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayData = await statusResponse.json();
    console.log(`Razorpay subscription status: ${razorpayData.status}`);

    // Update database if status is authenticated or active
    if (razorpayData.status === 'authenticated' || razorpayData.status === 'active') {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          razorpay_payment_id: razorpayData.charge_at ? String(razorpayData.charge_at) : null,
          next_billing_date: razorpayData.current_end ? new Date(razorpayData.current_end * 1000).toISOString() : null
        })
        .eq('rzp_subscription_id', subscriptionId);

      if (updateError) {
        console.error('Failed to update subscription in DB:', updateError);
      } else {
        console.log('✅ Subscription status updated to active in database');
      }
    }

    return new Response(
      JSON.stringify({
        status: razorpayData.status,
        data: razorpayData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred checking subscription status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
