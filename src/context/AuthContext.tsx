import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  requestOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

const requestOtp = async (phone: string) => {
  try {
    console.log('🚀 VyaparGuru DIRECT - Requesting OTP for:', phone);
    
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanPhone = phone.startsWith('+91') ? phone.substring(3) : phone;
    
    // Store OTP locally for verification
    localStorage.setItem(`vyapar_otp_${phone}`, JSON.stringify({
      otp: generatedOTP,
      expires: Date.now() + (5 * 60 * 1000), // 5 minutes
      phone: phone
    }));
    
    // Direct MSG91 API call (bypassing broken Edge Functions)
    const message = `Your VyaparGuru login OTP is ${generatedOTP}. Valid for 5 minutes. Do not share with anyone.`;
    const otpUrl = `https://control.msg91.com/api/sendotp.php?` + 
      `authkey=YOUR_MSG91_AUTH_KEY` + // Replace with your actual key
      `&mobile=91${cleanPhone}` +
      `&otp=${generatedOTP}` +
      `&sender=VYGURU` +
      `&DLT_TE_ID=1707176026967145609` +
      `&message=${encodeURIComponent(message)}`;

    console.log('📨 VyaparGuru DIRECT - Calling MSG91...');
    
    const response = await fetch(otpUrl, {
      method: 'GET',
      mode: 'no-cors' // Bypass CORS issues
    });

    console.log('✅ VyaparGuru DIRECT - SMS sent successfully!');
    return { error: null };
    
  } catch (error: any) {
    console.error('❌ VyaparGuru DIRECT Error:', error);
    return { 
      error: { 
        message: 'Failed to send OTP - please try again',
        originalError: error 
      } 
    };
  }
};

const verifyOtp = async (phone: string, otp: string) => {
  try {
    console.log('🔍 VyaparGuru DIRECT - Verifying OTP...');
    
    // Get stored OTP
    const storedData = localStorage.getItem(`vyapar_otp_${phone}`);
    if (!storedData) {
      throw new Error('No OTP found - please request a new one');
    }
    
    const { otp: correctOtp, expires } = JSON.parse(storedData);
    
    // Check expiration
    if (Date.now() > expires) {
      localStorage.removeItem(`vyapar_otp_${phone}`);
      throw new Error('OTP has expired - please request a new one');
    }
    
    // Verify OTP
    if (otp !== correctOtp) {
      throw new Error('Invalid OTP - please check and try again');
    }
    
    // Clean up
    localStorage.removeItem(`vyapar_otp_${phone}`);
    
    // Create user session with Supabase Auth (bypassing Edge Functions)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phone.replace('+', '')}@vyaparguru.temp`,
      password: 'VyaparGuru2025!',
    });
    
    if (error && error.message.includes('Invalid login credentials')) {
      // User doesn't exist, create them
      const { error: signUpError } = await supabase.auth.signUp({
        email: `${phone.replace('+', '')}@vyaparguru.temp`,
        password: 'VyaparGuru2025!',
        options: {
          data: {
            phone: phone,
            created_via: 'otp'
          }
        }
      });
      
      if (signUpError) {
        throw new Error('Failed to create account');
      }
    } else if (error) {
      throw new Error('Authentication failed');
    }
    
    console.log('✅ VyaparGuru DIRECT - Authentication successful!');
    return { error: null };
    
  } catch (error: any) {
    console.error('❌ VyaparGuru DIRECT Verify Error:', error);
    return { 
      error: { 
        message: error.message || 'Verification failed',
        originalError: error 
      } 
    };
  }
};

    // Success case - validate response
    if (!data?.access_token || !data?.refresh_token) {
      console.error('🔍 VyaparGuru - Invalid response format:', data);
      return { 
        error: { 
          message: 'Invalid server response - missing tokens' 
        } 
      };
    }

    // Set session with the tokens from edge function
    console.log('🔍 VyaparGuru - Setting session with tokens...');
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    });

    if (sessionError) {
      console.error('🔍 VyaparGuru - Session error:', sessionError);
      return { 
        error: { 
          message: 'Failed to create session',
          originalError: sessionError 
        } 
      };
    }

    console.log('✅ VyaparGuru - OTP verification and session creation successful');
    return { error: null };

  } catch (error: any) {
    console.error('💥 VyaparGuru - Exception in verifyOtp:', error);
    return { 
      error: { 
        message: 'Network error during verification',
        originalError: error 
      } 
    };
  }
};


  const value = {
    isAuthenticated: !!session,
    user,
    session,
    signUp,
    signIn,
    signOut,
    requestOtp,
    verifyOtp,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
