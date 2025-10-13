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
    console.log('🔍 VyaparGuru - Requesting OTP for:', phone);
    
    const { data, error } = await supabase.functions.invoke('msg91-otp', {
      body: { 
        action: 'send-otp',
        phone 
      }
    });
    
    console.log('🔍 VyaparGuru - Raw response:', { data, error });
    
    // Handle Supabase function errors (non-2xx responses)
    if (error) {
      console.error('🔍 VyaparGuru - Function error:', error);
      
      // Try to get the actual error message from the Edge Function
      let errorMessage = 'Failed to send OTP';
      
      if (error.context && error.context.body) {
        try {
          const errorResponse = await new Response(error.context.body).json();
          console.log('🔍 VyaparGuru - Error response body:', errorResponse);
          errorMessage = errorResponse.error || errorResponse.message || errorMessage;
        } catch (parseError) {
          console.log('🔍 VyaparGuru - Could not parse error body');
        }
      }
      
      return { 
        error: { 
          message: errorMessage,
          originalError: error 
        } 
      };
    }
    
    // Success case
    console.log('✅ VyaparGuru - OTP request successful:', data);
    return { error: null };
    
  } catch (error: any) {
    console.error('💥 VyaparGuru - Exception in requestOtp:', error);
    return { 
      error: { 
        message: 'Network error - please check your connection',
        originalError: error 
      } 
    };
  }
};

const verifyOtp = async (phone: string, otp: string) => {
  try {
    console.log('🔍 VyaparGuru - Verifying OTP for:', { phone, otp });
    
    const { data, error } = await supabase.functions.invoke('msg91-otp', {
      body: { 
        action: 'verify-otp',
        phone,
        otp
      }
    });

    console.log('🔍 VyaparGuru - Verify raw response:', { data, error });

    // Handle Supabase function errors (non-2xx responses)
    if (error) {
      console.error('🔍 VyaparGuru - Verify error:', error);
      
      // Try to get the actual error message from the Edge Function
      let errorMessage = 'OTP verification failed';
      
      if (error.context && error.context.body) {
        try {
          const errorResponse = await new Response(error.context.body).json();
          console.log('🔍 VyaparGuru - Verify error response body:', errorResponse);
          errorMessage = errorResponse.error || errorResponse.message || errorMessage;
        } catch (parseError) {
          console.log('🔍 VyaparGuru - Could not parse verify error body');
        }
      }
      
      return { 
        error: { 
          message: errorMessage,
          originalError: error 
        } 
      };
    }

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
