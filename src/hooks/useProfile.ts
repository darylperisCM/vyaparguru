import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  mobile_number: string;
  email: string | null;
  age: number;
  location: string | null;
  created_at: string;
  updated_at: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async (): Promise<void> => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useProfile] Fetching profile for user ${user.id.substring(0, 8)}***`);

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[useProfile] Database error:', profileError);
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }
      
      if (!data) {
        console.warn('[useProfile] No profile found, user may need to complete setup');
        setError('Profile not found. Please complete your profile setup.');
      } else {
        console.log('[useProfile] Profile loaded successfully');
      }
      
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useProfile] Error fetching profile:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🚨 NEW: Function to update profile
  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
    if (!user || !profile) {
      console.error('[useProfile] Cannot update profile: user or profile not available');
      return false;
    }

    try {
      console.log(`[useProfile] Updating profile for user ${user.id.substring(0, 8)}***`);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('[useProfile] Update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      setProfile(data);
      console.log('[useProfile] Profile updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useProfile] Error updating profile:', errorMessage);
      setError(errorMessage);
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};

// 🚨 NEW: Helper hook for Google Ads enhanced conversion data
export const useGoogleAdsUserData = () => {
  const { profile } = useProfile();
  const { user } = useAuth();

  // Format user data for Google Ads enhanced conversions
  const getEnhancedConversionData = () => {
    if (!profile && !user) return null;

    return {
      email: profile?.email || user?.email || '',
      phone_number: profile?.mobile_number || '',
      address: {
        first_name: profile?.name?.split(' ')[0] || '',
        last_name: profile?.name?.split(' ').slice(1).join(' ') || '',
        country: 'IN', // India
        postal_code: profile?.location || ''
      }
    };
  };

  // Check if we have sufficient data for enhanced conversions
  const hasEnhancedData = () => {
    const email = profile?.email || user?.email;
    const phone = profile?.mobile_number;
    const name = profile?.name;
    
    return !!(email || phone || name);
  };

  return {
    enhancedConversionData: getEnhancedConversionData(),
    hasEnhancedData: hasEnhancedData(),
    profile,
    user
  };
};

// 🚨 NEW: Helper hook for validation
export const useProfileValidation = () => {
  const { profile } = useProfile();

  const isProfileComplete = () => {
    if (!profile) return false;
    
    return !!(
      profile.name &&
      profile.mobile_number &&
      profile.email &&
      profile.age
    );
  };

  const getMissingFields = () => {
    if (!profile) return ['name', 'mobile_number', 'email', 'age'];
    
    const missing: string[] = [];
    if (!profile.name) missing.push('name');
    if (!profile.mobile_number) missing.push('mobile_number');
    if (!profile.email) missing.push('email');
    if (!profile.age) missing.push('age');
    
    return missing;
  };

  return {
    isComplete: isProfileComplete(),
    missingFields: getMissingFields(),
    completionPercentage: profile ? 
      Math.round(((4 - getMissingFields().length) / 4) * 100) : 0
  };
};
