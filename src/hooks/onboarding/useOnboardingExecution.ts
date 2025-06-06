
import { useRef } from 'react';
import { globalWebsiteCache } from '@/services/globalWebsiteCache';

interface ExecutionState {
  isExecuting: boolean;
  currentWebsiteName: string | null;
  executionId: string | null;
  lastExecution: number;
  submissionCount: number;
}

export const useOnboardingExecution = () => {
  const executionRef = useRef<ExecutionState>({
    isExecuting: false,
    currentWebsiteName: null,
    executionId: null,
    lastExecution: 0,
    submissionCount: 0
  });

  const canExecute = (websiteName: string, userId: string): boolean => {
    const executionId = globalWebsiteCache.generateExecutionId();
    
    console.log(`🚀 [${executionId}] Checking execution eligibility`);
    console.log(`🔍 [${executionId}] Current execution state:`, executionRef.current);

    const timeSinceLastExecution = Date.now() - executionRef.current.lastExecution;
    
    // Layer 1: Check if currently executing
    if (executionRef.current.isExecuting) {
      console.warn(`🚫 [${executionId}] BLOCKED - Submission already in progress`);
      return false;
    }

    // Layer 2: Prevent rapid-fire submissions (within 3 seconds)
    if (timeSinceLastExecution < 3000) {
      console.warn(`🚫 [${executionId}] BLOCKED - Too soon after last execution: ${timeSinceLastExecution}ms`);
      return false;
    }

    // Layer 3: Check global cache
    if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
      console.warn(`🚫 [${executionId}] BLOCKED - Global cache shows creation in progress`);
      return false;
    }

    // Layer 4: Same website name protection
    if (executionRef.current.currentWebsiteName === websiteName) {
      console.warn(`🚫 [${executionId}] BLOCKED - Same website already being processed: ${websiteName}`);
      return false;
    }

    return true;
  };

  const startExecution = (websiteName: string): string => {
    const executionId = globalWebsiteCache.generateExecutionId();
    
    executionRef.current = {
      isExecuting: true,
      currentWebsiteName: websiteName,
      executionId: executionId,
      lastExecution: Date.now(),
      submissionCount: executionRef.current.submissionCount + 1
    };

    console.log(`🔄 [${executionId}] PROCEEDING with onboarding submission`);
    return executionId;
  };

  const endExecution = (executionId: string): void => {
    console.log(`🧹 [${executionId}] Cleaning up submission state`);
    
    setTimeout(() => {
      executionRef.current = {
        isExecuting: false,
        currentWebsiteName: null,
        executionId: null,
        lastExecution: Date.now(),
        submissionCount: executionRef.current.submissionCount
      };
      console.log(`🔓 [${executionId}] Execution lock released`);
    }, 2000);
  };

  return {
    canExecute,
    startExecution,
    endExecution,
    isExecuting: executionRef.current.isExecuting
  };
};
