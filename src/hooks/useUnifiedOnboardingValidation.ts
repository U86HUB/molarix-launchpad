
import { UnifiedOnboardingData, UseUnifiedOnboardingValidationResult } from "@/types/onboarding";

export const useUnifiedOnboardingValidation = (): UseUnifiedOnboardingValidationResult => {
  const canProceed = (
    currentStep: number, 
    onboardingData: UnifiedOnboardingData
  ): boolean => {
    switch (currentStep) {
      case 1:
        return onboardingData.clinic.skipClinic || 
               (Boolean(onboardingData.clinic.name) && Boolean(onboardingData.clinic.email));
      case 2:
        return Boolean(onboardingData.website.name) && Boolean(onboardingData.website.selectedTemplate);
      case 3:
        return Boolean(onboardingData.preferences.toneOfVoice);
      default:
        return false;
    }
  };

  return { canProceed };
};
