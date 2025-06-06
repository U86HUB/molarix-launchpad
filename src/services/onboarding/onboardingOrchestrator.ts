
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { createClinic } from "./clinicOperations";
import { createWebsite } from "./websiteOperations";
import { createOnboardingSession } from "./sessionOperations";

export interface OnboardingResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

// Enhanced tracking with execution metadata and stricter deduplication
const activeCreations = new Map<string, { 
  promise: Promise<OnboardingResult>; 
  timestamp: number;
  callStack: string;
  executionId: string;
  userId: string;
  status: 'active' | 'completed' | 'failed';
}>();

// Global execution lock to prevent cross-instance race conditions
let globalExecutionLock = false;
let globalLockTimestamp = 0;

export const executeOnboardingFlow = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  const executionId = `${Date.now()}-${Math.random()}`;
  const callStack = new Error().stack || 'unknown';
  const websiteName = onboardingData.website.name.trim().toLowerCase();
  
  console.log('🔄 executeOnboardingFlow() called at:', Date.now());
  console.log('🔍 Execution ID:', executionId);
  console.log('🔍 User ID:', userId);
  console.log('🔍 Website name:', websiteName);
  console.log('🔍 Call stack:', callStack.split('\n').slice(0, 3).join('\n'));
  
  const creationKey = `${userId}-${websiteName}`;
  
  // CRITICAL: Check global execution lock first
  if (globalExecutionLock) {
    const lockAge = Date.now() - globalLockTimestamp;
    if (lockAge < 30000) { // 30 second lock
      console.warn('🚫 Global execution lock active, blocking execution');
      console.warn('🔒 Lock age:', lockAge, 'ms');
      return { success: false, error: 'Another onboarding process is currently running' };
    } else {
      console.log('🔓 Releasing stale global lock');
      globalExecutionLock = false;
    }
  }
  
  // Check if this exact creation is already in progress
  const existingCreation = activeCreations.get(creationKey);
  if (existingCreation && existingCreation.status === 'active') {
    const timeSinceStart = Date.now() - existingCreation.timestamp;
    console.warn('🚫 Duplicate onboarding flow detected for:', creationKey);
    console.log('⏱️ Time since start:', timeSinceStart, 'ms');
    console.log('📍 Original execution ID:', existingCreation.executionId);
    console.log('📍 Original call stack:', existingCreation.callStack.split('\n').slice(0, 3).join('\n'));
    console.log('📍 Current execution ID:', executionId);
    console.log('📍 Current call stack:', callStack.split('\n').slice(0, 3).join('\n'));
    
    if (timeSinceStart < 60000) { // Within 60 seconds
      console.log('🔄 Returning existing promise for:', creationKey);
      return existingCreation.promise;
    } else {
      console.log('🧹 Cleaning up old creation promise (timeout)');
      activeCreations.delete(creationKey);
    }
  }

  // Set global lock to prevent other executions
  globalExecutionLock = true;
  globalLockTimestamp = Date.now();
  console.log('🔒 Global execution lock acquired at:', globalLockTimestamp);

  // Create the promise and store it with enhanced metadata
  const creationPromise = executeOnboardingFlowInternal(
    onboardingData, 
    existingClinics, 
    userId, 
    executionId
  );
  
  activeCreations.set(creationKey, {
    promise: creationPromise,
    timestamp: Date.now(),
    callStack,
    executionId,
    userId,
    status: 'active'
  });

  try {
    const result = await creationPromise;
    console.log('✅ Onboarding flow completed for:', creationKey, 'Result:', result);
    
    // Update status
    const tracking = activeCreations.get(creationKey);
    if (tracking) {
      activeCreations.set(creationKey, {
        ...tracking,
        status: result.success ? 'completed' : 'failed'
      });
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ Onboarding flow execution error:', error);
    
    // Update status to failed
    const tracking = activeCreations.get(creationKey);
    if (tracking) {
      activeCreations.set(creationKey, {
        ...tracking,
        status: 'failed'
      });
    }
    
    return { success: false, error: error.message };
  } finally {
    // Release global lock
    globalExecutionLock = false;
    console.log('🔓 Global execution lock released');
    
    // Clean up the active creation tracking after a delay
    setTimeout(() => {
      const current = activeCreations.get(creationKey);
      if (current && current.executionId === executionId) {
        activeCreations.delete(creationKey);
        console.log('🧹 Cleaned up creation tracking for:', creationKey);
      }
    }, 10000); // Keep for 10 seconds to prevent immediate duplicates
  }
};

const executeOnboardingFlowInternal = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string,
  executionId: string
): Promise<OnboardingResult> => {
  console.log('🔄 Executing onboarding flow internal for website:', onboardingData.website.name);
  console.log('🔍 Internal execution ID:', executionId);
  
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
    } else {
      console.log('🏥 Using existing clinic ID:', clinicId);
    }

    if (!clinicId) {
      return { success: false, error: 'Clinic ID is required to continue' };
    }

    // Step 2: Create website with enhanced logging
    console.log('🌐 Creating website with execution ID:', executionId);
    const websiteResult = await createWebsite(onboardingData.website, clinicId, userId);
    if (!websiteResult.success) {
      console.error('❌ Website creation failed for execution:', executionId, 'Error:', websiteResult.error);
      return { success: false, error: websiteResult.error };
    }

    console.log('✅ Website created with ID:', websiteResult.websiteId, 'for execution:', executionId);

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
    console.error('❌ Onboarding orchestration error for execution:', executionId, 'Error:', error);
    return { success: false, error: error.message };
  }
};
