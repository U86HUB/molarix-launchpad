
import { useState, useEffect, useRef } from "react";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { useOnboardingExecution } from "@/hooks/onboarding/useOnboardingExecution";
import { useOnboardingValidationGuards } from "@/hooks/onboarding/useOnboardingValidationGuards";
import { useOnboardingSubmissionFlow } from "@/hooks/onboarding/useOnboardingSubmissionFlow";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const completionRef = useRef<string | null>(null); // Track completion by execution ID
  
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

  // Clean up when initialization completes successfully
  useEffect(() => {
    if (initCompleted && createdWebsiteId && !isCompleted) {
      console.log('🧹 Onboarding completed successfully, cleaning up stored data');
      setIsCompleted(true);
      
      // Clear the stored website data to prevent retries
      setTimeout(() => {
        setLastWebsiteData(null);
        console.log('🧹 Cleared lastWebsiteData after successful completion');
      }, 5000); // Wait 5 seconds to ensure completion
    }
  }, [initCompleted, createdWebsiteId, isCompleted]);

  // Cleanup on unmount to prevent stale state
  useEffect(() => {
    return () => {
      console.log('🧹 useUnifiedOnboardingSubmission unmounting, cleaning up');
      setLastWebsiteData(null);
      setIsCompleted(false);
      completionRef.current = null;
    };
  }, []);

  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ): Promise<void> => {
    const websiteName = onboardingData.website.name.trim();

    // Check if this submission was already completed
    if (isCompleted) {
      console.warn('⚠️ Onboarding already completed, blocking duplicate submission');
      return;
    }

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
    
    // Track this execution as active
    completionRef.current = executionId;
    
    try {
      await executeSubmission(
        onboardingData,
        existingClinics,
        executionId,
        async (websiteData: WebsiteInitializationData) => {
          // Only store data if this execution is still active
          if (completionRef.current === executionId) {
            setLastWebsiteData(websiteData);
            await initializeWebsite(websiteData);
          } else {
            console.warn('⚠️ Execution ID mismatch, skipping website initialization');
          }
        },
        (websiteId: string) => {
          // Only complete if this execution is still active
          if (completionRef.current === executionId) {
            completeCreation(websiteId);
          } else {
            console.warn('⚠️ Execution ID mismatch, skipping completion');
          }
        }
      );
    } finally {
      endExecution(executionId);
      
      // Only reset if this execution is still active and no website was created
      if (completionRef.current === executionId && !createdWebsiteId) {
        resetCreation();
      }
    }
  };

  const retryInitialization = (): void => {
    // Only allow retry if explicitly requested and we have stored data
    if (!lastWebsiteData) {
      console.warn("⚠️ Cannot retry: No previous website data available.");
      return;
    }

    // Prevent retry if already completed
    if (isCompleted) {
      console.warn("⚠️ Cannot retry: Onboarding already completed successfully.");
      return;
    }

    // Prevent retry if currently processing
    if (isSubmitting) {
      console.warn("⚠️ Cannot retry: Submission already in progress.");
      return;
    }

    console.log('🔄 Explicit retry requested for website initialization:', lastWebsiteData.websiteId);
    initializeWebsite(lastWebsiteData);
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
