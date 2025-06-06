
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";
import { OnboardingResult } from "./onboardingOrchestrator";
import { SupabaseService } from "../supabaseService";

interface ExistingWebsite {
  id: string;
  name: string;
  created_at: string;
}

export const executeOnboardingSteps = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string,
  executionId: string
): Promise<OnboardingResult> => {
  console.log(`🔄 [${executionId}] Internal execution START`);
  console.warn(`[DEBUG] [${executionId}] executeOnboardingSteps() called from:`, new Error().stack?.split('\n').slice(0, 3).join('\n'));
  
  let cancelled = false;
  let cleanupCalled = false;

  // Set up cancellation handler
  const cancelHandler = () => {
    cancelled = true;
    console.log(`🚫 [${executionId}] Onboarding execution cancelled`);
  };

  const cleanup = () => {
    if (cleanupCalled) return;
    cleanupCalled = true;
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', cancelHandler);
    }
    console.log(`🧹 [${executionId}] Cleanup completed`);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cancelHandler);
  }

  // Check if there's an active onboarding for same user/website combo
  const websiteName = onboardingData.website.name.trim();
  try {
    const result = await SupabaseService.executeQuery(
      () => {
        return SupabaseService.fetchOne('websites', {
          name: websiteName,
          created_by: userId
        }, {
          select: 'id, name, created_at',
          component: 'onboardingExecutor'
        });
      },
      {
        operation: 'check for existing onboarding',
        component: 'onboardingExecutor',
        throwOnError: false
      }
    );

    if (result.data && (result.data as ExistingWebsite).id) {
      const existingWebsite = result.data as ExistingWebsite;
      const creationAge = Date.now() - new Date(existingWebsite.created_at).getTime();
      const isRecent = creationAge < 60000; // Less than 1 minute old
      
      console.log(`🔍 [${executionId}] Found existing website "${websiteName}" (age: ${creationAge}ms)`);
      
      if (isRecent) {
        console.log(`✅ [${executionId}] Recent website already exists, returning early with ID: ${existingWebsite.id}`);
        cleanup();
        return { 
          success: true, 
          websiteId: existingWebsite.id,
          deduplication: true
        };
      }
    }
  } catch (error) {
    console.warn(`⚠️ [${executionId}] Error checking for existing website:`, error);
    // Continue with normal flow if check fails
  }
  
  try {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled before start`);
      cleanup();
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    let clinicId = onboardingData.clinic.selectedClinicId;

    // Step 1: Create clinic if not using existing one
    if (!onboardingData.clinic.skipClinic) {
      if (cancelled) {
        console.log(`🚫 [${executionId}] Onboarding execution was cancelled before clinic creation`);
        cleanup();
        return { success: false, error: 'Onboarding execution was cancelled' };
      }

      console.log(`🏥 [${executionId}] Creating new clinic...`);
      const clinicResult = await createClinic(onboardingData.clinic, userId);
      if (!clinicResult.success) {
        console.error(`❌ [${executionId}] Clinic creation failed:`, clinicResult.error);
        cleanup();
        return { success: false, error: clinicResult.error };
      }
      clinicId = clinicResult.clinicId;
      console.log(`✅ [${executionId}] Clinic created with ID: ${clinicId}`);
    } else {
      console.log(`🏥 [${executionId}] Using existing clinic ID: ${clinicId}`);
    }

    if (!clinicId) {
      cleanup();
      return { success: false, error: 'Clinic ID is required to continue' };
    }

    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled before website creation`);
      cleanup();
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    // Step 2: Create website with enhanced logging and cancellation check
    console.log(`🌐 [${executionId}] Creating website...`);
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled after website creation`);
      cleanup();
      return { success: false, error: 'Onboarding execution was cancelled' };
    }

    if (!websiteResult.success) {
      console.error(`❌ [${executionId}] Website creation failed:`, websiteResult.error);
      cleanup();
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
    cleanup();
    return { 
      success: true, 
      websiteId: websiteResult.websiteId 
    };
  } catch (error: any) {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Onboarding execution was cancelled during error handling`);
      cleanup();
      return { success: false, error: 'Onboarding execution was cancelled' };
    }
    
    console.error(`❌ [${executionId}] Onboarding orchestration error:`, error);
    cleanup();
    return { success: false, error: error.message };
  } finally {
    cleanup();
  }
};
