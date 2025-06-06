
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { useOnboardingExecution } from "@/hooks/onboarding/useOnboardingExecution";
import { useOnboardingValidationGuards } from "@/hooks/onboarding/useOnboardingValidationGuards";
import { useOnboardingSubmissionFlow } from "@/hooks/onboarding/useOnboardingSubmissionFlow";
import { useOnboardingState } from "@/hooks/onboarding/useOnboardingState";
import { useOnboardingCompletion } from "@/hooks/onboarding/useOnboardingCompletion";
import { useOnboardingRetry } from "@/hooks/onboarding/useOnboardingRetry";
import { useOnboardingSubmissionLogic } from "@/hooks/onboarding/useOnboardingSubmissionLogic";
import { UseUnifiedOnboardingSubmissionResult, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const {
    lastWebsiteData,
    setLastWebsiteData,
    isCompleted,
    setIsCompleted,
    completionRef,
    cancelledRef
  } = useOnboardingState();
  
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

  useOnboardingCompletion({
    initCompleted,
    createdWebsiteId,
    isCompleted,
    cancelledRef,
    setIsCompleted,
    setLastWebsiteData
  });

  const { retryInitialization } = useOnboardingRetry({
    lastWebsiteData,
    isCompleted,
    isSubmitting,
    cancelledRef,
    initializeWebsite
  });

  const { submitOnboarding } = useOnboardingSubmissionLogic({
    cancelledRef,
    isCompleted,
    validateStateChecks,
    validateBeforeSubmission,
    canExecute,
    startExecution,
    startCreation,
    completionRef,
    executeSubmission,
    endExecution,
    createdWebsiteId,
    resetCreation,
    setLastWebsiteData,
    initializeWebsite,
    completeCreation
  });

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
