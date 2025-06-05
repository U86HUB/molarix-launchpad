
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { handleSupabaseError } from "@/utils/errorHandling";
import { executeOnboardingFlow } from "@/services/onboarding/onboardingOrchestrator";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  
  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
  } = useWebsiteInitialization();

  const {
    isCreating,
    createdWebsiteId,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  } = useWebsiteCreationGuard();

  // Combined loading state
  const isSubmitting = isCreating || isInitializing;

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

    const websiteName = onboardingData.website.name;
    
    // Check if we can proceed with creation
    if (!canCreate(websiteName)) {
      return;
    }

    // Start creation guard
    startCreation(websiteName);
    console.log('🔄 Starting onboarding submission for user:', user.id, 'Website:', websiteName);

    try {
      // Execute the onboarding flow with duplicate protection
      const result = await executeOnboardingFlow(onboardingData, existingClinics, user.id);
      
      if (!result.success) {
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
        resetCreation();
        return;
      }

      if (!result.websiteId) {
        console.error('❌ No website ID returned from onboarding flow');
        resetCreation();
        return;
      }

      // Mark creation as complete
      completeCreation(result.websiteId);
      console.log('✅ Website created successfully with ID:', result.websiteId);

      // Initialize website with loading screen
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

    } catch (error: any) {
      console.error('❌ Onboarding submission error:', error);
      resetCreation();
      handleSupabaseError(
        error,
        {
          operation: 'complete onboarding',
          userId: user.id,
          additionalData: onboardingData
        },
        'Failed to complete setup. Please try again or contact support if the problem persists.'
      );
    }
  };

  // Create a no-parameter retry function with fallback logging
  const retryInitialization = (): void => {
    if (lastWebsiteData) {
      initializeWebsite(lastWebsiteData);
    } else {
      console.warn("⚠️ Cannot retry: No previous website data available.");
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
