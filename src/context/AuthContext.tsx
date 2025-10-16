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
  requestOtp: (phone: string, isSignUp?: boolean) => Promise<{ error: any }>;
  verifyOtp: (phone: string, otp: string, profileData?: { name: string; email?: string; age?: string; location?: string }) => Promise<{ error: any }>;
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

  const requestOtp = async (phone: string, isSignUp?: boolean) => {
    try {
      // Debug logging to track what's being sent
      const isSignUpValue = isSignUp === true;
      console.log('🔍 requestOtp called with:', { phone: phone.replace(/\d(?=\d{4})/g, '*'), isSignUp, computed: isSignUpValue });
      
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'send-otp',
          phone: phone,
          isSignUp: isSignUpValue
        }
      });
      
      if (error) {
        console.error('Edge function error');
        throw new Error(error.message || 'Failed to send OTP');
      }
      
      if (!data?.success) {
        if (data?.action_required === 'signup') {
          console.log('User not registered, redirecting to signup');
          return {
            error: { 
              message: data.message,
              requiresSignup: true
            } 
          };
        }
        
        console.error('MSG91 API error');
        throw new Error(data?.message || 'Failed to send OTP');
      }
      
      console.log('OTP sent successfully');
      return { error: null };
      
    } catch (error: any) {
      console.error('Request OTP Error');
      return {
        error: { 
          message: error.message || 'Failed to send OTP - please try again',
          originalError: error 
        } 
      };
    }
  };

  const verifyOtp = async (
    phone: string, 
    otp: string,
    profileData?: { name: string; email?: string; age?: string; location?: string }
  ) => {
    try {
      console.log('Verifying OTP');
      
      const requestBody: any = {
        action: 'verify-otp',
        phone: phone,
        otp: otp
      };
      
      // Include profile data if provided (for new user sign-ups)
      if (profileData) {
        requestBody.name = profileData.name;
        requestBody.email = profileData.email;
        requestBody.age = profileData.age;
        requestBody.location = profileData.location;
        console.log('Including profile data for new user');
      }
      
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: requestBody
      });
      
      if (error || !data?.success) {
        const errorMessage = data?.error || error?.message || 'Invalid OTP';
        
        // Provide user-friendly error message for OTP mismatch
        if (errorMessage.includes('OTP not match') || errorMessage.includes('Invalid OTP') || errorMessage.toLowerCase().includes('otp')) {
          throw new Error('Incorrect OTP entered. Please try again.');
        }
        
        throw new Error(errorMessage);
      }

      console.log('OTP verified successfully');
      
      // Use the real Supabase auth tokens from the edge function
      if (!data.access_token || !data.refresh_token) {
        throw new Error('No authentication tokens received');
      }

      // Set the real session using Supabase's setSession
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        console.error('Error setting session');
        throw new Error('Failed to establish session');
      }

      console.log('Session established successfully');
      
      // The onAuthStateChange listener will handle setting user and session state
      return { error: null };
      
    } catch (error: any) {
      console.error('Verify OTP Error');
      
      // Provide friendly error message
      let friendlyMessage = error.message || 'Verification failed';
      if (friendlyMessage.includes('OTP not match') || friendlyMessage.includes('Invalid OTP') || friendlyMessage.toLowerCase().includes('otp')) {
        friendlyMessage = 'Incorrect OTP entered. Please try again.';
      }
      
      return { 
        error: { 
          message: friendlyMessage
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
