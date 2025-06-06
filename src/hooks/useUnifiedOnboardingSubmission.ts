
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { handleSupabaseError } from "@/utils/errorHandling";
import { executeOnboardingFlow } from "@/services/onboarding/onboardingOrchestrator";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  
  // Enhanced execution tracking with stricter controls
  const executionRef = useRef<{
    isExecuting: boolean;
    currentWebsiteName: string | null;
    executionId: string | null;
    lastExecution: number;
    submissionCount: number;
  }>({
    isExecuting: false,
    currentWebsiteName: null,
    executionId: null,
    lastExecution: 0,
    submissionCount: 0
  });

  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
  } = useWebsiteInitialization();

  const {
    isCreating,
    createdWebsiteId,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  } = useWebsiteCreationGuard();

  // Combined loading state
  const isSubmitting = isCreating || isInitializing || submissionInProgress || executionRef.current.isExecuting;

  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ): Promise<void> => {
    const executionId = globalWebsiteCache.generateExecutionId();
    const websiteName = onboardingData.website.name.trim();
    
    console.log(`🚀 [${executionId}] submitOnboarding() ENTRY POINT`);
    console.log(`🔍 [${executionId}] Current execution state:`, executionRef.current);
    console.log(`🔍 [${executionId}] Current submission state:`, { 
      isSubmitting, 
      isCreating, 
      isInitializing, 
      submissionInProgress,
      websiteName 
    });

    // CRITICAL: Multiple layer protection against duplicates
    const timeSinceLastExecution = Date.now() - executionRef.current.lastExecution;
    
    // Layer 1: Check if currently executing
    if (executionRef.current.isExecuting) {
      console.warn(`🚫 [${executionId}] BLOCKED - Submission already in progress`);
      console.warn(`🚫 [${executionId}] Current execution: ${executionRef.current.executionId}`);
      return;
    }

    // Layer 2: Prevent rapid-fire submissions (within 3 seconds)
    if (timeSinceLastExecution < 3000) {
      console.warn(`🚫 [${executionId}] BLOCKED - Too soon after last execution: ${timeSinceLastExecution}ms`);
      toast({
        title: "Please Wait",
        description: "Please wait a moment before submitting again.",
        variant: "default",
      });
      return;
    }

    // Layer 3: Check global cache
    if (globalWebsiteCache.hasActiveCreation(websiteName, user?.id || '')) {
      console.warn(`🚫 [${executionId}] BLOCKED - Global cache shows creation in progress`);
      globalWebsiteCache.debugState();
      return;
    }

    // Layer 4: Same website name protection
    if (executionRef.current.currentWebsiteName === websiteName) {
      console.warn(`🚫 [${executionId}] BLOCKED - Same website already being processed: ${websiteName}`);
      return;
    }

    // Layer 5: Multiple state checks
    if (submissionInProgress || isCreating || isInitializing) {
      console.warn(`🚫 [${executionId}] BLOCKED - System busy`);
      toast({
        title: "System Busy",
        description: "Please wait for the current operation to complete.",
        variant: "default",
      });
      return;
    }

    // Layer 6: Authentication check
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
        variant: "destructive",
      });
      return;
    }

    // Layer 7: Creation guard check
    if (!canCreate(websiteName)) {
      console.warn(`🚫 [${executionId}] BLOCKED - Creation guard rejected: ${websiteName}`);
      return;
    }

    // ALL CHECKS PASSED - PROCEED WITH EXECUTION
    executionRef.current = {
      isExecuting: true,
      currentWebsiteName: websiteName,
      executionId: executionId,
      lastExecution: Date.now(),
      submissionCount: executionRef.current.submissionCount + 1
    };

    setSubmissionInProgress(true);
    startCreation(websiteName);
    
    console.log(`🔄 [${executionId}] PROCEEDING with onboarding submission`);
    console.log(`🔍 [${executionId}] Submission count: ${executionRef.current.submissionCount}`);
    console.log(`🔍 [${executionId}] User ID: ${user.id}`);

    try {
      // Execute the onboarding flow with all protections in place
      console.log(`📞 [${executionId}] Calling executeOnboardingFlow...`);
      const result = await executeOnboardingFlow(onboardingData, existingClinics, user.id);
      
      if (!result.success) {
        console.error(`❌ [${executionId}] Onboarding flow failed:`, result.error);
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!result.websiteId) {
        console.error(`❌ [${executionId}] No website ID returned from onboarding flow`);
        return;
      }

      // Mark creation as complete
      completeCreation(result.websiteId);
      console.log(`✅ [${executionId}] Website created successfully with ID: ${result.websiteId}`);

      // Prepare website data for initialization
      const websiteData: WebsiteInitializationData = {
        websiteId: result.websiteId,
        templateType: onboardingData.website.selectedTemplate,
        primaryColor: onboardingData.website.primaryColor,
        fontStyle: onboardingData.website.fontStyle,
        clinicData: {
          name: onboardingData.clinic.name || existingClinics.find(c => c.id === onboardingData.clinic.selectedClinicId)?.name || 'Your Practice',
          address: onboardingData.clinic.address,
          phone: onboardingData.clinic.phone,
          email: onboardingData.clinic.email,
        }
      };
      
      // Store the website data for potential retry
      setLastWebsiteData(websiteData);
      
      // Initialize website (this should trigger the loading screen and redirect)
      console.log(`🎬 [${executionId}] Starting website initialization...`);
      await initializeWebsite(websiteData);

    } catch (error: any) {
      console.error(`❌ [${executionId}] Onboarding submission error:`, error);
      handleSupabaseError(
        error,
        {
          operation: 'complete onboarding',
          userId: user.id,
          additionalData: { ...onboardingData, executionId }
        },
        'Failed to complete setup. Please try again or contact support if the problem persists.'
      );
    } finally {
      // CRITICAL: Reset all states in finally block to ensure cleanup
      console.log(`🧹 [${executionId}] Cleaning up submission state`);
      
      setSubmissionInProgress(false);
      
      // Reset execution tracking with delay to prevent immediate re-submission
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
      
      // Only reset creation guard if there was an error
      if (!createdWebsiteId) {
        resetCreation();
      }
    }
  };

  // Create a no-parameter retry function with fallback logging
  const retryInitialization = (): void => {
    if (lastWebsiteData) {
      console.log('🔄 Retrying website initialization with stored data:', lastWebsiteData.websiteId);
      initializeWebsite(lastWebsiteData);
    } else {
      console.warn("⚠️ Cannot retry: No previous website data available.");
    }
  };

  return {
    isSubmitting,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    submitOnboarding,
    retryInitialization,
  };
};
