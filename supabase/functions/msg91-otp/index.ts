import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OTPRequestBody {
  action: 'send-otp' | 'verify-otp';
  phone: string;
  otp?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, otp }: OTPRequestBody = await req.json();
    console.log(`MSG91 OTP Action: ${action} for phone: ${phone}`);

    const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
    if (!msg91AuthKey) {
      throw new Error('MSG91_AUTH_KEY is not configured');
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (action === 'send-otp') {
      // Send OTP via MSG91
      console.log('Sending OTP via MSG91...');
      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'authkey': msg91AuthKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phone.startsWith('+91') ? phone.substring(3) : phone,
          template_id: Deno.env.get('MSG91_TEMPLATE_ID') || 'default',
        }),
      });

      const result = await response.json();
      console.log('MSG91 Send OTP Response:', result);

      if (!response.ok) {
        throw new Error(`MSG91 API Error: ${result.message || 'Failed to send OTP'}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'OTP sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify-otp') {
      if (!otp) {
        throw new Error('OTP is required for verification');
      }

      // Verify OTP with MSG91
      console.log('Verifying OTP with MSG91...');
      const verifyResponse = await fetch('https://control.msg91.com/api/v5/otp/verify', {
        method: 'POST',
        headers: {
          'authkey': msg91AuthKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          mobile: phone.startsWith('+91') ? phone.substring(3) : phone,
        }),
      });

      const verifyResult = await verifyResponse.json();
      console.log('MSG91 Verify OTP Response:', verifyResult);

      if (!verifyResponse.ok || verifyResult.type !== 'success') {
        throw new Error('Invalid OTP');
      }

      // Check if user exists (by checking if phone exists in profiles table)
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('mobile_number', phone)
        .maybeSingle();

      let userId: string;
      let isNewUser = false;

      if (existingProfile) {
        // Existing user - use their user_id
        userId = existingProfile.user_id;
        console.log('Existing user found:', userId);
      } else {
        // New user - create auth user
        console.log('Creating new user...');
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          phone: phone,
          phone_confirm: true,
        });

        if (createError || !newUser.user) {
          console.error('Error creating user:', createError);
          throw new Error('Failed to create user account');
        }

        userId = newUser.user.id;
        isNewUser = true;
        console.log('New user created:', userId);
      }

      // Generate session token
      console.log('Generating session token...');
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: `${userId}@temp.placeholder`, // Placeholder email
        options: {
          redirectTo: `${req.headers.get('origin') || 'http://localhost:8080'}/`,
        }
      });

      if (sessionError || !sessionData) {
        console.error('Error generating session:', sessionError);
        throw new Error('Failed to generate session');
      }

      // Store phone-user mapping
      await supabaseAdmin
        .from('phone_auth')
        .upsert({
          phone_number: phone,
          user_id: userId,
          otp_hash: null,
          otp_expires_at: null,
        });

      return new Response(
        JSON.stringify({
          success: true,
          user_id: userId,
          is_new_user: isNewUser,
          access_token: sessionData.properties.access_token,
          refresh_token: sessionData.properties.refresh_token,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in msg91-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
