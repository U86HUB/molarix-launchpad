
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";

export interface OnboardingResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

// Track active creations to prevent duplicates
const activeCreations = new Map<string, Promise<OnboardingResult>>();

export const executeOnboardingFlow = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  const creationKey = `${userId}-${onboardingData.website.name.trim().toLowerCase()}`;
  
  // Check if this exact creation is already in progress
  if (activeCreations.has(creationKey)) {
    console.warn('🚫 Duplicate onboarding flow detected, returning existing promise');
    return activeCreations.get(creationKey)!;
  }

  // Create the promise and store it
  const creationPromise = executeOnboardingFlowInternal(onboardingData, existingClinics, userId);
  activeCreations.set(creationKey, creationPromise);

  try {
    const result = await creationPromise;
    return result;
  } finally {
    // Clean up the active creation tracking
    activeCreations.delete(creationKey);
  }
};

const executeOnboardingFlowInternal = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  console.log('🔄 Executing onboarding flow for website:', onboardingData.website.name);
  
  try {
    let clinicId = onboardingData.clinic.selectedClinicId;

    // Step 1: Create clinic if not using existing one
    if (!onboardingData.clinic.skipClinic) {
      console.log('🏥 Creating new clinic...');
      const clinicResult = await createClinic(onboardingData.clinic, userId);
      if (!clinicResult.success) {
        console.error('❌ Clinic creation failed:', clinicResult.error);
        return { success: false, error: clinicResult.error };
      }
      clinicId = clinicResult.clinicId;
      console.log('✅ Clinic created with ID:', clinicId);
    }

    if (!clinicId) {
      return { success: false, error: 'Clinic ID is required to continue' };
    }

    // Step 2: Create website
    console.log('🌐 Creating website...');
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    if (!websiteResult.success) {
      console.error('❌ Website creation failed:', websiteResult.error);
      return { success: false, error: websiteResult.error };
    }

    console.log('✅ Website created with ID:', websiteResult.websiteId);

    // Step 3: Create onboarding session (non-critical)
    try {
      const sessionResult = await createOnboardingSession(
        onboardingData,
        clinicId,
        existingClinics,
        userId
      );

      if (!sessionResult.success) {
        console.warn('⚠️ Session creation failed but website was created:', sessionResult.error);
      }
    } catch (sessionError) {
      console.warn('⚠️ Session creation error (non-critical):', sessionError);
    }

    return { 
      success: true, 
      websiteId: websiteResult.websiteId 
    };
  } catch (error: any) {
    console.error('❌ Onboarding orchestration error:', error);
    return { success: false, error: error.message };
  }
};
