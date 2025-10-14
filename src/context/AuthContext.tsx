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
    
    if (error || !data?.success) {
      throw new Error(data?.error || error?.message || 'Invalid OTP');
    }

    console.log('✅ OTP verified successfully for user:', data.user_id);
    
    // ✅ FIXED: Query by mobile_number instead of user_id
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile_number', phone)  // ✅ Use phone instead of user_id
        .single();
      
      if (profileError || !profile) {
        console.error('Profile query error:', profileError);
        throw new Error('User profile not found');
      }

      console.log('✅ Profile found:', profile);

      // ✅ Create session with the correct user_id from profile
      const mockSession = {
        access_token: `verified_${profile.user_id}`,
        refresh_token: `refresh_${profile.user_id}`,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: {
          id: profile.user_id,  // ✅ Use user_id from profile
          phone: phone,
          email: profile.email,
          user_metadata: {
            name: profile.name,
            mobile_number: phone
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: profile.created_at,
          updated_at: profile.updated_at || profile.created_at
        }
      };

      // ✅ Set the session state manually
      setSession(mockSession);
      setUser(mockSession.user);
      setLoading(false);

      console.log('✅ Session established successfully');
      return { error: null };
      
    } catch (sessionError: any) {
      console.error('Session creation failed:', sessionError);
      return { 
        error: { 
          message: sessionError.message || 'Failed to create session'
        } 
      };
    }
    
  } catch (error: any) {
    console.error('❌ Verify OTP Error:', error);
    return { 
      error: { 
        message: error.message || 'Verification failed'
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
