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
  registerUser: (phone: string, name: string, email?: string, age?: string, location?: string) => Promise<{ error: any }>; // ✅ FIXED: Added age and location parameters
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

  // ✅ FIXED: Updated function signature and body
  const registerUser = async (phone: string, name: string, email?: string, age?: string, location?: string) => {
    try {
      console.log('👤 Registering new user:', phone, name);
      
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'register-user',
          phone: phone,
          name: name,
          email: email,
          age: age,        // ✅ FIXED: Now properly included
          location: location  // ✅ FIXED: Now properly included
        }
      });
      
      console.log('📡 Registration response:', { data, error });
      
      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Registration failed');
      }
      
      if (!data?.success) {
        console.error('❌ Registration failed:', data);
        throw new Error(data?.message || 'Registration failed');
      }
      
      console.log('✅ User registered successfully');
      return { error: null };
      
    } catch (error: any) {
      console.error('❌ Registration Error:', error);
      return { 
        error: { 
          message: error.message || 'Registration failed - please try again'
        } 
      };
    }
  };

  const requestOtp = async (phone: string) => {
    try {
      console.log('📱 Requesting OTP for phone:', phone);
      
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'send-otp',
          phone: phone
        }
      });
      
      console.log('📡 Edge function response:', { data, error });
      
      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Failed to send OTP');
      }
      
      if (!data?.success) {
        // ✅ Handle unregistered user
        if (data?.action_required === 'signup') {
          console.log('⚠️ User not registered, redirecting to signup');
          return { 
            error: { 
              message: data.message,
              requiresSignup: true  // Flag to redirect to signup page
            } 
          };
        }
        
        console.error('❌ MSG91 API error:', data);
        throw new Error(data?.message || 'Failed to send OTP');
      }
      
      console.log('✅ OTP sent successfully via MSG91');
      return { error: null };
      
    } catch (error: any) {
      console.error('❌ Request OTP Error:', error);
      return { 
        error: { 
          message: error.message || 'Failed to send OTP - please try again',
          originalError: error 
        } 
      };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
  try {
    console.log('🔍 Verifying OTP for phone:', phone);
    
    const { data, error } = await supabase.functions.invoke('msg91-otp', {
      body: { 
        action: 'verify-otp',
        phone: phone,
        otp: otp
      }
    });
    
    console.log('📡 Verify response:', { data, error });
    
    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
    
    if (!data?.success) {
      console.error('❌ Verification failed:', data);
      throw new Error(data?.error || 'Invalid OTP');
    }

    // ✅ OTP verified successfully - now establish session
    console.log('✅ OTP verified, establishing session for user:', data.user_id);
    
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      throw new Error('Failed to establish session');
    }
    
    console.log('✅ Session established successfully');
    return { error: null };
    
  } catch (error: any) {
    console.error('❌ Verify OTP Error:', error);
    return { 
      error: { 
        message: error.message || 'Verification failed',
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
    registerUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
