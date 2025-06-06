
import { UnifiedOnboardingData, WebsiteInitializationData } from '@/types/onboarding';

interface UseOnboardingSubmissionLogicProps {
  cancelledRef: React.MutableRefObject<boolean>;
  isCompleted: boolean;
  validateStateChecks: (submissionInProgress: boolean, isCreating: boolean, isInitializing: boolean) => boolean;
  validateBeforeSubmission: (onboardingData: UnifiedOnboardingData, user: any, canCreate: boolean) => boolean;
  canExecute: (websiteName: string, userId: string) => boolean;
  startExecution: (websiteName: string) => string;
  startCreation: (websiteName: string) => void;
  completionRef: React.MutableRefObject<string | null>;
  executeSubmission: (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[],
    executionId: string,
    onSuccess: (websiteData: WebsiteInitializationData) => Promise<void>,
    onComplete: (websiteId: string) => void
  ) => Promise<void>;
  endExecution: (executionId: string) => void;
  createdWebsiteId: string | null;
  resetCreation: () => void;
  setLastWebsiteData: (data: WebsiteInitializationData | null) => void;
  initializeWebsite: (data: WebsiteInitializationData) => Promise<void>;
  completeCreation: (websiteId: string) => void;
}

export const useOnboardingSubmissionLogic = ({
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
}: UseOnboardingSubmissionLogicProps) => {
  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ): Promise<void> => {
    const websiteName = onboardingData.website.name.trim();

    console.warn(`[DEBUG] submitOnboarding() called from:`, new Error().stack?.split('\n').slice(0, 5).join('\n'));

    // Check if component is cancelled
    if (cancelledRef.current) {
      console.warn('⚠️ Onboarding submission blocked - component is cancelled');
      return;
    }

    // Check if this submission was already completed
    if (isCompleted) {
      console.warn('⚠️ Onboarding already completed, blocking duplicate submission');
      return;
    }

    // Multiple layer validation
    if (!validateStateChecks(false, false, false)) {
      return;
    }

    // TODO: Get user from auth context
    const user = { id: 'temp-user-id' }; // This should come from useAuth
    
    if (!validateBeforeSubmission(onboardingData, user, true)) {
      return;
    }

    if (!canExecute(websiteName, user.id)) {
      return;
    }

    // Check if cancelled before starting execution
    if (cancelledRef.current) {
      console.warn('⚠️ Onboarding submission blocked - component was cancelled during validation');
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
          // Only store data if this execution is still active and component not cancelled
          if (completionRef.current === executionId && !cancelledRef.current) {
            setLastWebsiteData(websiteData);
            await initializeWebsite(websiteData);
          } else {
            console.warn('⚠️ Execution ID mismatch or component cancelled, skipping website initialization');
          }
        },
        (websiteId: string) => {
          // Only complete if this execution is still active and component not cancelled
          if (completionRef.current === executionId && !cancelledRef.current) {
            completeCreation(websiteId);
          } else {
            console.warn('⚠️ Execution ID mismatch or component cancelled, skipping completion');
          }
        }
      );
    } finally {
      endExecution(executionId);
      
      // Only reset if this execution is still active and no website was created and component not cancelled
      if (completionRef.current === executionId && !createdWebsiteId && !cancelledRef.current) {
        resetCreation();
      }
    }
  };

  return { submitOnboarding };
};
