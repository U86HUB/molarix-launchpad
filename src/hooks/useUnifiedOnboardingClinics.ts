
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UseUnifiedOnboardingClinicsResult } from "@/types/onboarding";

export const useUnifiedOnboardingClinics = (): UseUnifiedOnboardingClinicsResult => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [existingClinics, setExistingClinics] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (user) {
      checkExistingClinics();
      checkIfOnboardingCompleted();
    }
  }, [user]);

  const checkExistingClinics = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data: clinics, error } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('created_by', user.id);

      if (error) {
        handleSupabaseError(
          error,
          {
            operation: 'fetch existing clinics',
            table: 'clinics',
            userId: user.id
          }
        );
        return;
      }

      setExistingClinics(clinics || []);
      console.log('Found existing clinics:', clinics?.length || 0);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      handleSupabaseError(
        error,
        {
          operation: 'fetch existing clinics',
          userId: user.id
        }
      );
    }
  };

  const checkIfOnboardingCompleted = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data: sessions, error } = await supabase
        .from('onboarding_sessions')
        .select('id, completion_score')
        .eq('created_by', user.id)
        .eq('completion_score', 100)
        .limit(1);

      if (error) {
        handleSupabaseError(
          error,
          {
            operation: 'check onboarding completion',
            table: 'onboarding_sessions',
            userId: user.id
          }
        );
        return;
      }
      
      if (sessions && sessions.length > 0) {
        console.log('User has completed onboarding, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      handleSupabaseError(
        error,
        {
          operation: 'check onboarding status',
          userId: user.id
        }
      );
    }
  };

  return {
    existingClinics,
    checkExistingClinics,
  };
};
