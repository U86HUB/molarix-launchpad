import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { executeOnboardingSteps } from "./onboardingExecutor";
import { validateOnboardingFlow } from "./onboardingFlowValidator";

export interface OnboardingResult {
  success: boolean;
  websiteId?: string;
  error?: string;
  deduplication?: boolean;  // <-- Added this flag to indicate deduplication
}

interface OnboardingExecutionContext {
  id: string;
  startTime: number;
  websiteName: string;
  userId: string;
  isActive: boolean;
}

// Store active executions in memory to prevent duplicates
const activeExecutions = new Map<string, OnboardingExecutionContext>();

// Generate a unique execution ID
const generateExecutionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

// Get execution key from website name and user ID
const getExecutionKey = (websiteName: string, userId: string): string => {
  return `${userId}:${websiteName.trim().toLowerCase()}`;
};

export const executeOnboardingFlow = async (
  onboardingData: UnifiedOnboardingData,
  existingClinics: any[],
  userId: string
): Promise<OnboardingResult> => {
  const websiteName = onboardingData.website.name.trim();
  const executionKey = getExecutionKey(websiteName, userId);
  const executionId = generateExecutionId();
  
  console.log(`🚀 [${executionId}] Starting onboarding flow execution`);
  
  // Check for existing active execution
  const existingExecution = activeExecutions.get(executionKey);
  if (existingExecution && existingExecution.isActive) {
    const now = Date.now();
    const elapsedTime = now - existingExecution.startTime;
    
    // If execution is recent (within last 10 seconds), block duplicate
    if (elapsedTime < 10000) {
      console.warn(`⚠️ [${executionId}] Duplicate execution detected for "${websiteName}" (${elapsedTime}ms old)`);
      console.warn(`⚠️ [${executionId}] Existing execution ID: ${existingExecution.id}`);
      return {
        success: false,
        error: `Another setup for "${websiteName}" is already in progress`
      };
    } else {
      console.log(`⏰ [${executionId}] Existing execution is stale (${elapsedTime}ms), proceeding with new one`);
      // Mark old execution as inactive
      existingExecution.isActive = false;
    }
  }
  
  // Record new execution
  activeExecutions.set(executionKey, {
    id: executionId,
    startTime: Date.now(),
    websiteName,
    userId,
    isActive: true
  });
  
  try {
    // Validate the onboarding data first
    const validationResult = validateOnboardingFlow(onboardingData, existingClinics, userId);
    if (!validationResult.isValid) {
      console.error(`❌ [${executionId}] Onboarding validation failed:`, validationResult.error);
      return { success: false, error: validationResult.error };
    }
    
    // Execute the onboarding steps
    const result = await executeOnboardingSteps(onboardingData, existingClinics, userId, executionId);
    
    // Log result and clean up memory
    if (result.success) {
      console.log(`✅ [${executionId}] Onboarding flow completed successfully`);
    } else {
      console.error(`❌ [${executionId}] Onboarding flow failed:`, result.error);
    }
    
    return result;
  } catch (error: any) {
    console.error(`❌ [${executionId}] Unhandled error in onboarding flow:`, error);
    return { success: false, error: error.message };
  } finally {
    // Clean up execution
    const execution = activeExecutions.get(executionKey);
    if (execution && execution.id === executionId) {
      execution.isActive = false;
      
      // Remove after 30 seconds to allow for debugging
      setTimeout(() => {
        const currentExecution = activeExecutions.get(executionKey);
        if (currentExecution && currentExecution.id === executionId) {
          activeExecutions.delete(executionKey);
          console.log(`🧹 [${executionId}] Cleaned up execution record`);
        }
      }, 30000);
    }
  }
};
