
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";
import { validateOnboardingFlow } from "./onboardingFlowValidator";
import { executeOnboardingSteps } from "./onboardingExecutor";

export interface OnboardingResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

export const executeOnboardingFlow = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  const executionId = globalWebsiteCache.generateExecutionId();
  const websiteName = onboardingData.website.name.trim();
  
  console.log(`🚀 [${executionId}] executeOnboardingFlow() START`);
  console.log(`🔍 [${executionId}] Call stack:`, new Error().stack?.split('\n').slice(0, 5).join('\n'));
  
  // Validate the onboarding flow
  const validation = validateOnboardingFlow(onboardingData, userId, executionId);
  if (!validation.canProceed) {
    const existingPromise = globalWebsiteCache.getActiveCreation(websiteName, userId);
    if (existingPromise) {
      console.log(`🔄 [${executionId}] Returning existing onboarding promise`);
      return existingPromise;
    }
  }

  // Create the execution promise
  const executionPromise = executeOnboardingSteps(
    onboardingData, 
    existingClinics, 
    userId, 
    executionId
  );

  // Cache the promise to prevent duplicates
  globalWebsiteCache.setActiveCreation(websiteName, userId, executionPromise, executionId);

  try {
    const result = await executionPromise;
    console.log(`✅ [${executionId}] executeOnboardingFlow() SUCCESS:`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [${executionId}] executeOnboardingFlow() ERROR:`, error);
    return { success: false, error: error.message };
  }
};
