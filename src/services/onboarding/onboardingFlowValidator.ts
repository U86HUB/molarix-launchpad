
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateOnboardingFlow = (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): ValidationResult => {
  const websiteName = onboardingData.website.name.trim();
  
  console.log(`🔍 Validating onboarding flow`);
  console.log(`🔍 User ID: ${userId}`);
  console.log(`🔍 Website name: "${websiteName}"`);
  
  // Check if this exact creation is already active
  if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
    console.warn(`🚫 Duplicate onboarding flow blocked - already in progress`);
    globalWebsiteCache.debugState();
    
    return {
      isValid: false,
      error: 'Duplicate onboarding flow already in progress'
    };
  }

  return { isValid: true };
};
