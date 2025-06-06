
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";

export interface ValidationResult {
  canProceed: boolean;
  reason?: string;
}

export const validateOnboardingFlow = (
  onboardingData: UnifiedOnboardingData,
  userId: string,
  executionId: string
): ValidationResult => {
  const websiteName = onboardingData.website.name.trim();
  
  console.log(`🔍 [${executionId}] Validating onboarding flow`);
  console.log(`🔍 [${executionId}] User ID: ${userId}`);
  console.log(`🔍 [${executionId}] Website name: "${websiteName}"`);
  
  // Check if this exact creation is already active
  if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
    console.warn(`🚫 [${executionId}] Duplicate onboarding flow blocked - already in progress`);
    globalWebsiteCache.debugState();
    
    return {
      canProceed: false,
      reason: 'Duplicate onboarding flow already in progress'
    };
  }

  return { canProceed: true };
};
