
import { useToast } from '@/hooks/use-toast';
import { UnifiedOnboardingData } from '@/hooks/useUnifiedOnboardingData';

export const useOnboardingValidationGuards = () => {
  const { toast } = useToast();

  const validateBeforeSubmission = (
    onboardingData: UnifiedOnboardingData,
    user: any,
    canCreate: (websiteName: string) => boolean
  ): boolean => {
    const websiteName = onboardingData.website.name.trim();

    // Authentication check
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
        variant: "destructive",
      });
      return false;
    }

    // Creation guard check
    if (!canCreate(websiteName)) {
      console.warn(`🚫 BLOCKED - Creation guard rejected: ${websiteName}`);
      return false;
    }

    return true;
  };

  const validateStateChecks = (
    submissionInProgress: boolean,
    isCreating: boolean,
    isInitializing: boolean
  ): boolean => {
    if (submissionInProgress || isCreating || isInitializing) {
      console.warn(`🚫 BLOCKED - System busy`);
      toast({
        title: "System Busy",
        description: "Please wait for the current operation to complete.",
        variant: "default",
      });
      return false;
    }

    return true;
  };

  return {
    validateBeforeSubmission,
    validateStateChecks
  };
};
