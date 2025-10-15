import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DashboardMetrics {
  translationsToday: number;
  emailsToday: number;
  learningStreak: number;
  loading: boolean;
}

export const useDashboardMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    translationsToday: 0,
    emailsToday: 0,
    learningStreak: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setMetrics({
        translationsToday: 0,
        emailsToday: 0,
        learningStreak: 0,
        loading: false,
      });
      return;
    }

    fetchMetrics();
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      // Get today's date range (start of day to now)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch today's translations count
      const { count: translationsCount, error: translationError } = await supabase
        .from('translation_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', todayISO);

      if (translationError) throw translationError;

      // Fetch today's emails count (from ai_messages where purpose includes email)
      const { count: emailsCount, error: emailError } = await supabase
        .from('ai_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', todayISO)
        .ilike('purpose', '%email%');

      if (emailError) throw emailError;

      // Calculate learning streak
      // Get all unique days user had activity (translations or AI messages)
      const { data: translationDays, error: streakError1 } = await supabase
        .from('translation_events')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100); // Look at last 100 activities

      const { data: aiDays, error: streakError2 } = await supabase
        .from('ai_messages')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (streakError1 || streakError2) {
        console.error('Error fetching streak data');
      }

      // Combine and calculate streak
      const allDates = [
        ...(translationDays || []).map(t => new Date(t.created_at).toDateString()),
        ...(aiDays || []).map(a => new Date(a.created_at).toDateString())
      ];

      const uniqueDates = Array.from(new Set(allDates)).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );

      // Calculate consecutive days from today backwards
      let streak = 0;
      const todayStr = new Date().toDateString();
      
      if (uniqueDates.length > 0 && uniqueDates[0] === todayStr) {
        streak = 1;
        
        for (let i = 1; i < uniqueDates.length; i++) {
          const currentDate = new Date(uniqueDates[i]);
          const prevDate = new Date(uniqueDates[i - 1]);
          const diffDays = Math.round((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }

      setMetrics({
        translationsToday: translationsCount || 0,
        emailsToday: emailsCount || 0,
        learningStreak: streak,
        loading: false,
      });

    } catch (error) {
      console.error('[useDashboardMetrics] Error fetching metrics:', error);
      setMetrics(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...metrics,
    refetch: fetchMetrics,
  };
};
