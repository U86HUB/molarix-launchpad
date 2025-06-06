
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { executeOnboardingFlow } from '@/services/onboarding/onboardingOrchestrator';
import { handleSupabaseError } from '@/utils/errorHandling';
import { UnifiedOnboardingData, WebsiteInitializationData } from '@/types/onboarding';

export const useOnboardingSubmissionFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissionInProgress, setSubmissionInProgress] = useState(false);

  const executeSubmission = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[],
    executionId: string,
    onSuccess: (websiteData: WebsiteInitializationData) => Promise<void>,
    onComplete: (websiteId: string) => void
  ): Promise<void> => {
    if (!user) return;

    setSubmissionInProgress(true);

    try {
      console.log(`📞 [${executionId}] Calling executeOnboardingFlow...`);
      const result = await executeOnboardingFlow(onboardingData, existingClinics, user.id);
      
      if (!result.success) {
        console.error(`❌ [${executionId}] Onboarding flow failed:`, result.error);
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!result.websiteId) {
        console.error(`❌ [${executionId}] No website ID returned from onboarding flow`);
        return;
      }

      onComplete(result.websiteId);
      console.log(`✅ [${executionId}] Website created successfully with ID: ${result.websiteId}`);

      // Prepare website data for initialization
      const websiteData: WebsiteInitializationData = {
        websiteId: result.websiteId,
        templateType: onboardingData.website.selectedTemplate,
        primaryColor: onboardingData.website.primaryColor,
        fontStyle: onboardingData.website.fontStyle,
        clinicData: {
          name: onboardingData.clinic.name || existingClinics.find(c => c.id === onboardingData.clinic.selectedClinicId)?.name || 'Your Practice',
          address: onboardingData.clinic.address,
          phone: onboardingData.clinic.phone,
          email: onboardingData.clinic.email,
        }
      };
      
      console.log(`🎬 [${executionId}] Starting website initialization...`);
      await onSuccess(websiteData);

    } catch (error: any) {
      console.error(`❌ [${executionId}] Onboarding submission error:`, error);
      handleSupabaseError(
        error,
        {
          operation: 'complete onboarding',
          userId: user.id,
          additionalData: { ...onboardingData, executionId }
        },
        'Failed to complete setup. Please try again or contact support if the problem persists.'
      );
    } finally {
      setSubmissionInProgress(false);
    }
  };

  return {
    submissionInProgress,
    executeSubmission
  };
};
