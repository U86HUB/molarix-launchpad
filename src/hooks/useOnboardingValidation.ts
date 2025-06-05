
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/errorHandling';

export const useOnboardingValidation = () => {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Checking onboarding status for user:', user.id);

      // Check for existing clinics
      const { data: clinics, error: clinicsError } = await supabase
        .from('clinics')
        .select('id')
        .eq('created_by', user.id)
        .limit(1);

      if (clinicsError) {
        handleSupabaseError(
          clinicsError,
          {
            operation: 'check clinics for onboarding',
            table: 'clinics',
            userId: user.id
          }
        );
        setLoading(false);
        return;
      }

      // Check for completed onboarding sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('onboarding_sessions')
        .select('id, completion_score')
        .eq('created_by', user.id)
        .eq('completion_score', 100)
        .limit(1);

      if (sessionsError) {
        handleSupabaseError(
          sessionsError,
          {
            operation: 'check onboarding sessions',
            table: 'onboarding_sessions',
            userId: user.id
          }
        );
        setLoading(false);
        return;
      }

      const hasClinics = clinics && clinics.length > 0;
      const hasCompletedSessions = sessions && sessions.length > 0;

      console.log('Onboarding status:', {
        hasClinics,
        hasCompletedSessions,
        needsOnboarding: !hasClinics && !hasCompletedSessions
      });

      setHasCompletedOnboarding(hasCompletedSessions);
      setNeedsOnboarding(!hasClinics && !hasCompletedSessions);

    } catch (error: any) {
      console.error('Error checking onboarding status:', error);
      handleSupabaseError(
        error,
        {
          operation: 'check onboarding status',
          userId: user.id
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const markOnboardingCompleted = () => {
    setNeedsOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const resetOnboardingStatus = () => {
    setNeedsOnboarding(true);
    setHasCompletedOnboarding(false);
  };

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setLoading(false);
      setNeedsOnboarding(false);
      setHasCompletedOnboarding(false);
    }
  }, [user]);

  return {
    needsOnboarding,
    hasCompletedOnboarding,
    loading,
    checkOnboardingStatus,
    markOnboardingCompleted,
    resetOnboardingStatus,
  };
};
