
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";
import { OnboardingResult } from "./onboardingOrchestrator";

export const executeOnboardingSteps = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string,
  executionId: string
): Promise<OnboardingResult> => {
  console.log(`🔄 [${executionId}] Internal execution START`);
  console.warn(`[DEBUG] [${executionId}] executeOnboardingSteps() called from:`, new Error().stack?.split('\n').slice(0, 3).join('\n'));
  
  let cancelled = false;

  // Set up cancellation handler
  const cancelHandler = () => {
    cancelled = true;
    console.log(`🚫 [${executionId}] Onboarding execution cancelled`);
  };

  const cleanup = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', cancelHandler);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cancelHandler);
  }
  
  try {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled before start`);
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    let clinicId = onboardingData.clinic.selectedClinicId;

    // Step 1: Create clinic if not using existing one
    if (!onboardingData.clinic.skipClinic) {
      if (cancelled) {
        console.log(`🚫 [${executionId}] Onboarding execution was cancelled before clinic creation`);
        return { success: false, error: 'Onboarding execution was cancelled' };
      }

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

    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled before website creation`);
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    // Step 2: Create website with enhanced logging and cancellation check
    console.log(`🌐 [${executionId}] Creating website...`);
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled after website creation`);
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    if (!websiteResult.success) {
      console.error(`❌ [${executionId}] Website creation failed:`, websiteResult.error);
      return { success: false, error: websiteResult.error };
    }

    console.log(`✅ [${executionId}] Website created with ID: ${websiteResult.websiteId}`);

    // Step 3: Create onboarding session (non-critical)
    if (!cancelled) {
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
    }

    console.log(`🎉 [${executionId}] Onboarding flow completed successfully`);
    return { 
      success: true, 
      websiteId: websiteResult.websiteId 
    };
  } catch (error: any) {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled during error handling`);
      return { success: false, error: 'Onboarding execution was cancelled' };
    }
    
    console.error(`❌ [${executionId}] Onboarding orchestration error:`, error);
    return { success: false, error: error.message };
  } finally {
    cleanup();
  }
};
