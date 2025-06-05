
import { UnifiedOnboardingData } from "./useUnifiedOnboardingData";

export const useUnifiedOnboardingValidation = () => {
  const canProceed = (currentStep: number, onboardingData: UnifiedOnboardingData) => {
    switch (currentStep) {
      case 1:
        return onboardingData.clinic.skipClinic || 
               (onboardingData.clinic.name && onboardingData.clinic.email);
      case 2:
        return onboardingData.website.name && onboardingData.website.selectedTemplate;
      case 3:
        return onboardingData.preferences.toneOfVoice;
      default:
        return false;
    }
  };

  return { canProceed };
};
