
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { handleSupabaseError } from "@/utils/errorHandling";
import { executeOnboardingFlow } from "@/services/onboarding/onboardingOrchestrator";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  
  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
  } = useWebsiteInitialization();

  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting onboarding submission for user:', user.id);

    try {
      // Execute the onboarding flow
      const result = await executeOnboardingFlow(onboardingData, existingClinics, user.id);
      
      if (!result.success) {
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Initialize website with loading screen
      if (result.websiteId) {
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
        
        // Store the website data for potential retry
        setLastWebsiteData(websiteData);
        
        await initializeWebsite(websiteData);
      }

    } catch (error: any) {
      console.error('Onboarding submission error:', error);
      handleSupabaseError(
        error,
        {
          operation: 'complete onboarding',
          userId: user.id,
          additionalData: onboardingData
        },
        'Failed to complete setup. Please try again or contact support if the problem persists.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a no-parameter retry function that uses the stored website data
  const retryInitialization = (): void => {
    if (lastWebsiteData) {
      initializeWebsite(lastWebsiteData);
    }
  };

  return {
    isSubmitting,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    submitOnboarding,
    retryInitialization,
  };
};
