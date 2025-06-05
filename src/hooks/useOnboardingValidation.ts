
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/errorHandling';

export interface UseOnboardingValidationResult {
  needsOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  loading: boolean;
  checkOnboardingStatus: () => Promise<void>;
  markOnboardingCompleted: () => void;
  resetOnboardingStatus: () => void;
}

export const useOnboardingValidation = (): UseOnboardingValidationResult => {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkOnboardingStatus = async (): Promise<void> => {
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

      const hasClinics = Boolean(clinics && clinics.length > 0);
      const hasCompletedSessions = Boolean(sessions && sessions.length > 0);

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

  const markOnboardingCompleted = (): void => {
    setNeedsOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const resetOnboardingStatus = (): void => {
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
