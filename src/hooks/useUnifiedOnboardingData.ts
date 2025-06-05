
import { useState } from "react";
import { UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingData = () => {
  const [onboardingData, setOnboardingData] = useState<UnifiedOnboardingData>({
    clinic: {
      name: "",
      address: "",
      phone: "",
      email: "",
      skipClinic: false,
    },
    website: {
      name: "",
      selectedTemplate: "",
      logo: null,
      primaryColor: "#4f46e5",
      fontStyle: "default",
    },
    preferences: {
      toneOfVoice: "professional",
      hipaa: false,
      gdpr: false,
    },
  });

  const updateClinicData = (data: typeof onboardingData.clinic) => {
    setOnboardingData(prev => ({ ...prev, clinic: data }));
  };

  const updateWebsiteData = (data: typeof onboardingData.website) => {
    setOnboardingData(prev => ({ ...prev, website: data }));
  };

  const updatePreferencesData = (data: typeof onboardingData.preferences) => {
    setOnboardingData(prev => ({ ...prev, preferences: data }));
  };

  return {
    onboardingData,
    updateClinicData,
    updateWebsiteData,
    updatePreferencesData,
  };
};

// Re-export the type for backwards compatibility
export type { UnifiedOnboardingData };
