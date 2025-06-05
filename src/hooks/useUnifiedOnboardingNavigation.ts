
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UnifiedOnboardingData } from "./useUnifiedOnboardingData";
import { useUnifiedOnboardingValidation } from "./useUnifiedOnboardingValidation";
import { UseUnifiedOnboardingNavigationResult } from "@/types/onboarding";

export const useUnifiedOnboardingNavigation = (): UseUnifiedOnboardingNavigationResult => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { toast } = useToast();
  const { canProceed } = useUnifiedOnboardingValidation();

  const getProgressPercentage = (): number => {
    return (currentStep / 3) * 100;
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return "Clinic Information";
      case 2:
        return "Website Setup";
      case 3:
        return "Preferences";
      default:
        return "";
    }
  };

  const handleNext = (
    onboardingData: UnifiedOnboardingData, 
    onSubmit: () => void
  ): void => {
    if (!canProceed(currentStep, onboardingData)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    currentStep,
    getProgressPercentage,
    getStepTitle,
    handleNext,
    handleBack,
    canProceed,
  };
};
