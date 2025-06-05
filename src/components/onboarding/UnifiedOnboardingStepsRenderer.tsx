
import React from "react";
import OnboardingClinicStep from "./OnboardingClinicStep";
import OnboardingWebsiteStep from "./OnboardingWebsiteStep";
import OnboardingPreferencesStep from "./OnboardingPreferencesStep";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";

interface UnifiedOnboardingStepsRendererProps {
  currentStep: number;
  onboardingData: UnifiedOnboardingData;
  existingClinics: Array<{ id: string; name: string }>;
  updateClinicData: (data: UnifiedOnboardingData['clinic']) => void;
  updateWebsiteData: (data: UnifiedOnboardingData['website']) => void;
  updatePreferencesData: (data: UnifiedOnboardingData['preferences']) => void;
}

const UnifiedOnboardingStepsRenderer = ({
  currentStep,
  onboardingData,
  existingClinics,
  updateClinicData,
  updateWebsiteData,
  updatePreferencesData
}: UnifiedOnboardingStepsRendererProps) => {
  switch (currentStep) {
    case 1:
      return (
        <OnboardingClinicStep
          clinicData={onboardingData.clinic}
          existingClinics={existingClinics}
          updateClinicData={updateClinicData}
        />
      );
    case 2:
      return (
        <OnboardingWebsiteStep
          websiteData={onboardingData.website}
          updateWebsiteData={updateWebsiteData}
        />
      );
    case 3:
      return (
        <OnboardingPreferencesStep
          preferencesData={onboardingData.preferences}
          updatePreferencesData={updatePreferencesData}
        />
      );
    default:
      return null;
  }
};

export default UnifiedOnboardingStepsRenderer;
