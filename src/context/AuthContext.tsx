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
      console.log('📱 Requesting OTP for phone:', phone, 'isSignUp:', isSignUp);
      
      const { data, error } = await supabase.functions.invoke('msg91-otp', {
        body: { 
          action: 'send-otp',
          phone: phone,
          isSignUp: isSignUp || false
        }
      });
      
      console.log('📡 Edge function response:', { data, error });
      
      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Failed to send OTP');
      }
      
      if (!data?.success) {
        if (data?.action_required === 'signup') {
          console.log('⚠️ User not registered, redirecting to signup');
          return { 
            error: { 
              message: data.message,
              requiresSignup: true
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

  const verifyOtp = async (
    phone: string, 
    otp: string,
    profileData?: { name: string; email?: string; age?: string; location?: string }
  ) => {
  try {
    console.log('🔍 Verifying OTP for phone:', phone);
    
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
      console.log('Including profile data for new user registration');
    }
    
    const { data, error } = await supabase.functions.invoke('msg91-otp', {
      body: requestBody
    });
    
    if (error || !data?.success) {
      throw new Error(data?.error || error?.message || 'Invalid OTP');
    }

    console.log('✅ OTP verified successfully for user:', data.user_id);
    
    // ✅ DEBUG: Try multiple phone number formats
    console.log('🔍 Looking for profile with phone:', phone);
    
    const phoneVariants = [
      phone,                                          // +918446499017
      phone.replace('+91', ''),                      // 8446499017  
      phone.replace('+', ''),                        // 918446499017
      phone.startsWith('+91') ? phone.substring(3) : phone  // 8446499017
    ];
    
    console.log('🔍 Trying phone variants:', phoneVariants);
    
    let profile = null;
    let profileError = null;
    
    // Try each phone format
    for (const phoneVariant of phoneVariants) {
      console.log('🔍 Trying phone format:', phoneVariant);
      
      const { data: foundProfile, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile_number', phoneVariant)
        .maybeSingle();  // ✅ Use maybeSingle to avoid errors
      
      if (!queryError && foundProfile) {
        profile = foundProfile;
        console.log('✅ Found profile with format:', phoneVariant);
        break;
      } else {
        console.log('❌ No profile found with format:', phoneVariant, queryError);
      }
    }
    
    // ✅ FALLBACK: If no profile found, create basic session anyway
    if (!profile) {
      console.log('⚠️ No profile found in database, creating minimal session');
      
      const minimalUser = {
        id: data.user_id || 'verified_user',
        phone: phone,
        email: '',
        user_metadata: { 
          mobile_number: phone,
          name: 'User' // Default name
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any;

      const minimalSession = {
        access_token: 'verified',
        refresh_token: 'verified',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: minimalUser
      } as any;

      setUser(minimalUser);
      setSession(minimalSession);
      setLoading(false);

      console.log('✅ Minimal session established without profile');
      return { error: null };
    }

    console.log('✅ Profile found:', profile);

    // ✅ Create proper session with profile data
    const userObject = {
      id: profile.user_id,
      phone: phone,
      email: profile.email || '',
      user_metadata: {
        name: profile.name,
        mobile_number: phone,
        age: profile.age,
        location: profile.location
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: profile.created_at,
      updated_at: profile.updated_at || profile.created_at
    } as any;

    const sessionObject = {
      access_token: `verified_${profile.user_id}`,
      refresh_token: `refresh_${profile.user_id}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: userObject
    } as any;

    setUser(userObject);
    setSession(sessionObject);
    setLoading(false);

    console.log('✅ Complete session established successfully');
    return { error: null };
    
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
