
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";

export interface OnboardingResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

// Enhanced tracking with execution timestamps
const activeCreations = new Map<string, { 
  promise: Promise<OnboardingResult>; 
  timestamp: number;
  callStack: string;
}>();

export const executeOnboardingFlow = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  const callStack = new Error().stack || 'unknown';
  console.log('🔄 executeOnboardingFlow() called at:', Date.now());
  console.log('🔍 Call stack:', callStack.split('\n').slice(0, 5).join('\n'));
  
  const creationKey = `${userId}-${onboardingData.website.name.trim().toLowerCase()}`;
  
  // Check if this exact creation is already in progress
  const existingCreation = activeCreations.get(creationKey);
  if (existingCreation) {
    const timeSinceStart = Date.now() - existingCreation.timestamp;
    console.warn('🚫 Duplicate onboarding flow detected for:', creationKey);
    console.log('⏱️ Time since start:', timeSinceStart, 'ms');
    console.log('📍 Original call stack:', existingCreation.callStack.split('\n').slice(0, 3).join('\n'));
    console.log('📍 Current call stack:', callStack.split('\n').slice(0, 3).join('\n'));
    
    if (timeSinceStart < 30000) { // Within 30 seconds
      console.log('🔄 Returning existing promise for:', creationKey);
      return existingCreation.promise;
    } else {
      console.log('🧹 Cleaning up old creation promise (timeout)');
      activeCreations.delete(creationKey);
    }
  }

  // Create the promise and store it with metadata
  const creationPromise = executeOnboardingFlowInternal(onboardingData, existingClinics, userId);
  activeCreations.set(creationKey, {
    promise: creationPromise,
    timestamp: Date.now(),
    callStack
  });

  try {
    const result = await creationPromise;
    console.log('✅ Onboarding flow completed for:', creationKey, 'Result:', result);
    return result;
  } finally {
    // Clean up the active creation tracking after a delay
    setTimeout(() => {
      const current = activeCreations.get(creationKey);
      if (current && current.timestamp === activeCreations.get(creationKey)?.timestamp) {
        activeCreations.delete(creationKey);
        console.log('🧹 Cleaned up creation tracking for:', creationKey);
      }
    }, 5000);
  }
};

const executeOnboardingFlowInternal = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  console.log('🔄 Executing onboarding flow internal for website:', onboardingData.website.name);
  
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
