
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";

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
  try {
    let clinicId = onboardingData.clinic.selectedClinicId;

    // Step 1: Create clinic if not using existing one
    if (!onboardingData.clinic.skipClinic) {
      const clinicResult = await createClinic(onboardingData.clinic, userId);
      if (!clinicResult.success) {
        return { success: false, error: clinicResult.error };
      }
      clinicId = clinicResult.clinicId;
    }

    if (!clinicId) {
      return { success: false, error: 'Clinic ID is required to continue' };
    }

    // Step 2: Create website
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    if (!websiteResult.success) {
      return { success: false, error: websiteResult.error };
    }

    // Step 3: Create onboarding session
    const sessionResult = await createOnboardingSession(
      onboardingData,
      clinicId,
      existingClinics,
      userId
    );

    // Note: Session creation failure is not critical, website was created successfully
    if (!sessionResult.success) {
      console.warn('Session creation failed but website was created:', sessionResult.error);
    }

    return { 
      success: true, 
      websiteId: websiteResult.websiteId 
    };
  } catch (error: any) {
    console.error('Onboarding orchestration error:', error);
    return { success: false, error: error.message };
  }
};
