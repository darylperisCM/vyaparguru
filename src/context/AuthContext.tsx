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
      const { error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'send-otp',
          phone 
        }
      });
      
      if (error) {
        console.error('Error sending OTP:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error in requestOtp:', error);
      return { error };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'verify-otp',
          phone,
          otp
        }
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        return { error };
      }

      if (!data?.access_token || !data?.refresh_token) {
        return { error: new Error('Invalid response from server') };
      }

      // Set session with the tokens from edge function
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (sessionError) {
        console.error('Error setting session:', sessionError);
        return { error: sessionError };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error in verifyOtp:', error);
      return { error };
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