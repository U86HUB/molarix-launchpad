
import { useState } from "react";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { useOnboardingExecution } from "@/hooks/onboarding/useOnboardingExecution";
import { useOnboardingValidationGuards } from "@/hooks/onboarding/useOnboardingValidationGuards";
import { useOnboardingSubmissionFlow } from "@/hooks/onboarding/useOnboardingSubmissionFlow";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
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

  const {
    canExecute,
    startExecution,
    endExecution,
    isExecuting
  } = useOnboardingExecution();

  const {
    validateBeforeSubmission,
    validateStateChecks
  } = useOnboardingValidationGuards();

  const {
    submissionInProgress,
    executeSubmission
  } = useOnboardingSubmissionFlow();

  // Combined loading state
  const isSubmitting = isCreating || isInitializing || submissionInProgress || isExecuting;

  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ): Promise<void> => {
    const websiteName = onboardingData.website.name.trim();

    // Multiple layer validation
    if (!validateStateChecks(submissionInProgress, isCreating, isInitializing)) {
      return;
    }

    // TODO: Get user from auth context
    const user = { id: 'temp-user-id' }; // This should come from useAuth
    
    if (!validateBeforeSubmission(onboardingData, user, canCreate)) {
      return;
    }

    if (!canExecute(websiteName, user.id)) {
      return;
    }

    // Start execution
    const executionId = startExecution(websiteName);
    startCreation(websiteName);
    
    try {
      await executeSubmission(
        onboardingData,
        existingClinics,
        executionId,
        async (websiteData: WebsiteInitializationData) => {
          setLastWebsiteData(websiteData);
          await initializeWebsite(websiteData);
        },
        (websiteId: string) => {
          completeCreation(websiteId);
        }
      );
    } finally {
      endExecution(executionId);
      
      if (!createdWebsiteId) {
        resetCreation();
      }
    }
  };

  const retryInitialization = (): void => {
    if (lastWebsiteData) {
      console.log('🔄 Retrying website initialization with stored data:', lastWebsiteData.websiteId);
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
