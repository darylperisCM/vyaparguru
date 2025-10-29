import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IndustryProgress {
  [industryId: string]: {
    vocabProgress: number;
    scenarioProgress: number;
    overallProgress: number;
    learnedVocabItems: Set<string>;
    completedScenarios: Set<string>;
  };
}

export function useIndustryProgress(
  vocabularyData: Record<string, any[]>,
  scenarioData: Record<string, any[]>
) {
  const { toast } = useToast();
  const [progress, setProgress] = useState<IndustryProgress>({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Fetch vocabulary progress
      const { data: vocabProgress, error: vocabError } = await supabase
        .from('industry_vocab_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_learned', true);

      if (vocabError) throw vocabError;

      // Fetch scenario progress
      const { data: scenarioProgress, error: scenarioError } = await supabase
        .from('industry_scenario_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (scenarioError) throw scenarioError;

      // Calculate progress for each industry
      const calculatedProgress: IndustryProgress = {};

      Object.keys(vocabularyData).forEach(industryId => {
        const learnedVocab = vocabProgress?.filter(v => v.industry_id === industryId) || [];
        const completedScenarios = scenarioProgress?.filter(s => s.industry_id === industryId) || [];

        const totalVocab = vocabularyData[industryId]?.length || 0;
        const totalScenarios = scenarioData[industryId]?.length || 0;

        const vocabProgressPercent = totalVocab > 0 
          ? (learnedVocab.length / totalVocab) * 50 
          : 0;
        
        const scenarioProgressPercent = totalScenarios > 0 
          ? (completedScenarios.length / totalScenarios) * 50 
          : 0;

        calculatedProgress[industryId] = {
          vocabProgress: vocabProgressPercent,
          scenarioProgress: scenarioProgressPercent,
          overallProgress: Math.round(vocabProgressPercent + scenarioProgressPercent),
          learnedVocabItems: new Set(learnedVocab.map(v => v.vocab_item)),
          completedScenarios: new Set(completedScenarios.map(s => s.scenario_id))
        };
      });

      setProgress(calculatedProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        title: "Error",
        description: "Failed to load your progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markVocabularyLearned = async (industryId: string, vocabItemId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('industry_vocab_progress')
        .upsert({
          user_id: userId,
          industry_id: industryId,
          vocab_item: vocabItemId,
          is_learned: true
        }, {
          onConflict: 'user_id,industry_id,vocab_item'
        });

      if (error) throw error;

      // Reload progress
      await loadProgress();

      toast({
        title: "Progress Saved",
        description: "Vocabulary marked as learned"
      });
    } catch (error) {
      console.error('Error marking vocabulary:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  const markScenarioCompleted = async (industryId: string, scenarioId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('industry_scenario_progress')
        .upsert({
          user_id: userId,
          industry_id: industryId,
          scenario_id: scenarioId,
          is_completed: true
        }, {
          onConflict: 'user_id,industry_id,scenario_id'
        });

      if (error) throw error;

      // Reload progress
      await loadProgress();

      toast({
        title: "Scenario Completed",
        description: "Your progress has been saved"
      });
    } catch (error) {
      console.error('Error marking scenario:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  const isVocabularyLearned = (industryId: string, vocabItemId: string): boolean => {
    return progress[industryId]?.learnedVocabItems?.has(vocabItemId) || false;
  };

  const isScenarioCompleted = (industryId: string, scenarioId: string): boolean => {
    return progress[industryId]?.completedScenarios?.has(scenarioId) || false;
  };

  const getIndustryProgress = (industryId: string) => {
    return progress[industryId] || {
      vocabProgress: 0,
      scenarioProgress: 0,
      overallProgress: 0,
      learnedVocabItems: new Set(),
      completedScenarios: new Set()
    };
  };

  return {
    progress,
    loading,
    markVocabularyLearned,
    markScenarioCompleted,
    isVocabularyLearned,
    isScenarioCompleted,
    getIndustryProgress,
    refreshProgress: loadProgress
  };
}
