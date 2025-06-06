
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";

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
  console.log(`🔍 [${executionId}] User ID: ${userId}`);
  console.log(`🔍 [${executionId}] Website name: "${websiteName}"`);
  console.log(`🔍 [${executionId}] Call stack:`, new Error().stack?.split('\n').slice(0, 5).join('\n'));
  
  // Check if this exact creation is already active
  if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
    console.warn(`🚫 [${executionId}] Duplicate onboarding flow blocked - already in progress`);
    globalWebsiteCache.debugState();
    
    const existingPromise = globalWebsiteCache.getActiveCreation(websiteName, userId);
    if (existingPromise) {
      console.log(`🔄 [${executionId}] Returning existing onboarding promise`);
      return existingPromise;
    }
  }

  // Create the execution promise
  const executionPromise = executeOnboardingFlowInternal(
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

const executeOnboardingFlowInternal = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string,
  executionId: string
): Promise<OnboardingResult> => {
  console.log(`🔄 [${executionId}] Internal execution START`);
  
  try {
    let clinicId = onboardingData.clinic.selectedClinicId;

    // Step 1: Create clinic if not using existing one
    if (!onboardingData.clinic.skipClinic) {
      console.log(`🏥 [${executionId}] Creating new clinic...`);
      const clinicResult = await createClinic(onboardingData.clinic, userId);
      if (!clinicResult.success) {
        console.error(`❌ [${executionId}] Clinic creation failed:`, clinicResult.error);
        return { success: false, error: clinicResult.error };
      }
      clinicId = clinicResult.clinicId;
      console.log(`✅ [${executionId}] Clinic created with ID: ${clinicId}`);
    } else {
      console.log(`🏥 [${executionId}] Using existing clinic ID: ${clinicId}`);
    }

    if (!clinicId) {
      return { success: false, error: 'Clinic ID is required to continue' };
    }

    // Step 2: Create website with enhanced logging
    console.log(`🌐 [${executionId}] Creating website...`);
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    if (!websiteResult.success) {
      console.error(`❌ [${executionId}] Website creation failed:`, websiteResult.error);
      return { success: false, error: websiteResult.error };
    }

    console.log(`✅ [${executionId}] Website created with ID: ${websiteResult.websiteId}`);

    // Step 3: Create onboarding session (non-critical)
    try {
      const sessionResult = await createOnboardingSession(
        onboardingData,
        clinicId,
        existingClinics,
        userId
      );

      if (!sessionResult.success) {
        console.warn(`⚠️ [${executionId}] Session creation failed but website was created:`, sessionResult.error);
      }
    } catch (sessionError) {
      console.warn(`⚠️ [${executionId}] Session creation error (non-critical):`, sessionError);
    }

    console.log(`🎉 [${executionId}] Onboarding flow completed successfully`);
    return { 
      success: true, 
      websiteId: websiteResult.websiteId 
    };
  } catch (error: any) {
    console.error(`❌ [${executionId}] Onboarding orchestration error:`, error);
    return { success: false, error: error.message };
  }
};
