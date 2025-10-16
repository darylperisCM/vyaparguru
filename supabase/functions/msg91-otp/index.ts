import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const phoneSchema = z.string()
  .regex(/^\+?91?[6-9]\d{9}$/, 'Invalid Indian phone number format');

const otpSchema = z.string()
  .regex(/^\d{4,6}$/, 'OTP must be 4-6 digits');

const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .trim();

const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .optional()
  .or(z.literal(''));

const ageSchema = z.number()
  .int('Age must be an integer')
  .min(13, 'Must be at least 13 years old')
  .max(120, 'Invalid age');

const locationSchema = z.string()
  .max(100, 'Location too long')
  .trim()
  .optional()
  .or(z.literal(''));

const sendOtpSchema = z.object({
  action: z.literal('send-otp'),
  phone: phoneSchema,
  isSignUp: z.boolean().optional(),
});

const verifyOtpSchema = z.object({
  action: z.literal('verify-otp'),
  phone: phoneSchema,
  otp: otpSchema,
  name: nameSchema.optional(),
  email: emailSchema,
  age: z.string().optional(),
  location: locationSchema,
  isSignUp: z.boolean().optional(),
});

interface OTPRequestBody {
  action: 'send-otp' | 'verify-otp';
  phone: string;
  otp?: string;
  name?: string;
  email?: string;
  age?: string;
  location?: string;
  isSignUp?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input based on action
    let validatedData: any;
    try {
      if (rawBody.action === 'send-otp') {
        validatedData = sendOtpSchema.parse(rawBody);
      } else if (rawBody.action === 'verify-otp') {
        validatedData = verifyOtpSchema.parse(rawBody);
        // Convert age string to number if provided
        if (validatedData.age) {
          const ageNum = parseInt(validatedData.age, 10);
          ageSchema.parse(ageNum);
          validatedData.ageNumber = ageNum;
        }
      } else {
        throw new Error('Invalid action. Must be "send-otp" or "verify-otp"');
      }
    } catch (validationError: any) {
      console.error('Input validation failed:', validationError.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid input data',
          details: validationError.errors || validationError.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, phone, otp, name, email, location, isSignUp } = validatedData;
    const ageNumber = validatedData.ageNumber;

    // Sanitize phone number for logging
    const sanitizedPhone = phone?.replace(/\d(?=\d{4})/g, '*') || '***';
    console.log(`OTP Action: ${action} (isSignUp: ${isSignUp})`);

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
      const templateId = Deno.env.get('MSG91_TEMPLATE_ID');
      
      if (!templateId) {
        throw new Error('MSG91_TEMPLATE_ID is not configured');
      }

      // Skip user existence check for sign-up flow
      if (!isSignUp) {
        // For sign-in: Check if user exists
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('user_id')
          .eq('mobile_number', phone)
          .maybeSingle();

        if (!existingProfile) {
          console.log('User not found for sign-in');
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'This phone number is not registered. Please sign up first.',
              action_required: 'signup'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log('User exists, proceeding with OTP send');
      } else {
        console.log('Sign-up flow: Skipping user existence check');
      }

      // Format phone number - ensure consistent format: 91XXXXXXXXXX
      let formattedPhone = phone.startsWith('+91') ? phone.substring(3) : phone;
      // Remove leading 91 if present (in case phone was passed as 91XXXXXXXXXX)
      if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = formattedPhone.substring(2);
      }
      
      console.log('Sending OTP via MSG91');

      const requestBody = {
        mobile: `91${formattedPhone}`,
        template_id: templateId,
      };

      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'authkey': msg91AuthKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('MSG91 API Status:', response.status);

      if (!response.ok || result.type === 'error') {
        const errorMsg = result.message || 'Failed to send OTP';
        console.error('MSG91 Error:', errorMsg);
        
        // Provide helpful error messages
        let userMessage = errorMsg;
        if (errorMsg.toLowerCase().includes('template')) {
          userMessage = 'SMS template not approved. Please check your MSG91 dashboard.';
        } else if (errorMsg.toLowerCase().includes('balance')) {
          userMessage = 'Insufficient SMS balance. Please recharge your MSG91 account.';
        } else if (errorMsg.toLowerCase().includes('dnd')) {
          userMessage = 'Number is on DND. Cannot send OTP to this number.';
        }
        
        throw new Error(userMessage);
      }

      console.log('OTP sent successfully');
      return new Response(
        JSON.stringify({ success: true, message: 'OTP sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify-otp') {
      try {
        if (!otp) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'OTP is required for verification' 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Verify OTP with MSG91 - use same format as send
        let verifyPhone = phone.startsWith('+91') ? phone.substring(3) : phone;
        // Remove leading 91 if present
        if (verifyPhone.startsWith('91') && verifyPhone.length === 12) {
          verifyPhone = verifyPhone.substring(2);
        }
        
        console.log('Verifying OTP with MSG91');
        const verifyResponse = await fetch('https://control.msg91.com/api/v5/otp/verify', {
          method: 'POST',
          headers: {
            'authkey': msg91AuthKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: otp,
            mobile: `91${verifyPhone}`,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok || verifyResult.type !== 'success') {
          console.error('OTP verification failed');
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Incorrect OTP entered. Please try again.',
              details: verifyResult.message 
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Check if user exists (by checking if phone exists in profiles table)
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('user_id')
          .eq('mobile_number', phone)
          .maybeSingle();

        let userId: string;
        let isNewUser = false;
        let accessToken: string;
        let refreshToken: string;

        // Create a regular Supabase client for authentication
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!
        );

        if (existingProfile) {
          // Existing user - generate tokens
          userId = existingProfile.user_id;
          console.log('Existing user found');
          
          // Generate temporary email for internal auth
          const tempEmail = `${userId}@temp.placeholder`;
          const tempPassword = crypto.randomUUID();
          
          // Update user with temporary email and password
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            email: tempEmail,
            password: tempPassword,
            email_confirm: true, // Skip email confirmation
            phone_confirm: true,
          });
          
          // Sign in with EMAIL to get real session tokens
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: tempEmail, // Use email instead of phone
            password: tempPassword,
          });
          
          if (signInError || !signInData.session) {
            console.error('Error signing in existing user:', signInError);
            throw new Error('Failed to create session for existing user');
          }
          
          accessToken = signInData.session.access_token;
          refreshToken = signInData.session.refresh_token;
          console.log('Session created for existing user');
        } else {
          // New user - create auth user
          console.log('Creating new user');
          
          // Generate temporary user ID first
          const tempUserId = crypto.randomUUID();
          const tempEmail = `${tempUserId}@temp.placeholder`;
          const tempPassword = crypto.randomUUID();
          
          // Create user with temporary email
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: tempEmail,
            phone: phone, // Store phone for reference
            password: tempPassword,
            email_confirm: true, // Skip email confirmation
            phone_confirm: true,
          });

          if (createError || !newUser.user) {
            console.error('Error creating user:', createError);
            throw new Error('Failed to create user account');
          }

          userId = newUser.user.id;
          isNewUser = true;
          console.log('New user created');
          
          // Sign in with EMAIL to get real session tokens
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: tempEmail, // Use email instead of phone
            password: tempPassword,
          });
          
          if (signInError || !signInData.session) {
            console.error('Error signing in new user:', signInError);
            throw new Error('Failed to create session for new user');
          }
          
          accessToken = signInData.session.access_token;
          refreshToken = signInData.session.refresh_token;
          console.log('Session tokens generated');

          // CRITICAL: Create profile for new user - this triggers the 3-day trial subscription!
          console.log('Creating user profile');
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              user_id: userId,
              mobile_number: phone,
              name: name || 'User',
              age: ageNumber || 25,
              email: email || null,
              location: location || null,
            });

          if (profileError) {
            console.error('Error creating profile');
            throw new Error('Failed to create user profile');
          }
          
          console.log('Profile created - subscription trigger should fire');
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
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        console.error('Error in verify-otp:', error.message);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message || 'Failed to verify OTP' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    throw new Error('Invalid action');
  } catch (error: any) {
    console.error('Error in msg91-otp function:', error);
    
    // Provide safe error messages - don't leak internal details
    const safeErrorMessage = 
      error.message?.includes('template') || 
      error.message?.includes('balance') ||
      error.message?.includes('DND') ||
      error.message?.includes('registered') ||
      error.message?.includes('Invalid') ||
      error.message?.includes('configured')
        ? error.message
        : 'An error occurred. Please try again or contact support.';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: safeErrorMessage 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
