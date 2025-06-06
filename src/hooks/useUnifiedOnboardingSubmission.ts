
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useWebsiteCreationGuard } from "@/hooks/useWebsiteCreationGuard";
import { handleSupabaseError } from "@/utils/errorHandling";
import { executeOnboardingFlow } from "@/services/onboarding/onboardingOrchestrator";
import { UseUnifiedOnboardingSubmissionResult, WebsiteInitializationData, UnifiedOnboardingData } from "@/types/onboarding";

export const useUnifiedOnboardingSubmission = (): UseUnifiedOnboardingSubmissionResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  
  // Add execution tracking to prevent duplicate calls
  const executionRef = useRef<{
    isExecuting: boolean;
    currentWebsiteName: string | null;
    executionId: string | null;
    lastExecution: number;
  }>({
    isExecuting: false,
    currentWebsiteName: null,
    executionId: null,
    lastExecution: 0
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
    const executionId = `${Date.now()}-${Math.random()}`;
    const websiteName = onboardingData.website.name.trim();
    
    console.log('🚀 submitOnboarding() called at:', Date.now(), 'ExecutionID:', executionId);
    console.log('🔍 Current execution state:', executionRef.current);
    console.log('🔍 Current submission state:', { 
      isSubmitting, 
      isCreating, 
      isInitializing, 
      submissionInProgress,
      websiteName 
    });

    // CRITICAL: Check for duplicate execution with strict timing
    const timeSinceLastExecution = Date.now() - executionRef.current.lastExecution;
    if (executionRef.current.isExecuting) {
      console.warn('🚫 Submission already in progress, blocking duplicate execution');
      console.warn('🚫 Current execution ID:', executionRef.current.executionId);
      console.warn('🚫 Current website name:', executionRef.current.currentWebsiteName);
      return;
    }

    // Prevent rapid-fire submissions (within 2 seconds)
    if (timeSinceLastExecution < 2000) {
      console.warn('🚫 Submission blocked - too soon after last execution:', timeSinceLastExecution, 'ms');
      toast({
        title: "Please Wait",
        description: "Please wait a moment before submitting again.",
        variant: "default",
      });
      return;
    }

    // Check if same website is being processed
    if (executionRef.current.currentWebsiteName === websiteName) {
      console.warn('🚫 Same website already being processed:', websiteName);
      return;
    }

    // Prevent multiple simultaneous submissions at all levels
    if (submissionInProgress || isCreating || isInitializing) {
      console.warn('🚫 System busy - blocking submission');
      toast({
        title: "System Busy",
        description: "Please wait for the current operation to complete.",
        variant: "default",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
        variant: "destructive",
      });
      return;
    }

    // Check creation guard before any state changes
    if (!canCreate(websiteName)) {
      console.warn('🚫 Creation blocked by guard for:', websiteName);
      return;
    }

    // LOCK EXECUTION - Set all flags before any async operations
    executionRef.current = {
      isExecuting: true,
      currentWebsiteName: websiteName,
      executionId: executionId,
      lastExecution: Date.now()
    };

    setSubmissionInProgress(true);
    startCreation(websiteName);
    
    console.log('🔄 Starting onboarding submission for user:', user.id, 'Website:', websiteName, 'ExecutionID:', executionId);

    try {
      // Execute the onboarding flow with duplicate protection
      console.log('📞 Calling executeOnboardingFlow...');
      const result = await executeOnboardingFlow(onboardingData, existingClinics, user.id);
      
      if (!result.success) {
        console.error('❌ Onboarding flow failed:', result.error);
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to complete setup. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!result.websiteId) {
        console.error('❌ No website ID returned from onboarding flow');
        return;
      }

      // Mark creation as complete
      completeCreation(result.websiteId);
      console.log('✅ Website created successfully with ID:', result.websiteId);

      // Initialize website with loading screen
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
      
      // Initialize website (this should be the final step)
      await initializeWebsite(websiteData);

    } catch (error: any) {
      console.error('❌ Onboarding submission error:', error);
      handleSupabaseError(
        error,
        {
          operation: 'complete onboarding',
          userId: user.id,
          additionalData: onboardingData
        },
        'Failed to complete setup. Please try again or contact support if the problem persists.'
      );
    } finally {
      // CRITICAL: Reset all states in finally block to ensure cleanup
      console.log('🧹 Cleaning up submission state for execution:', executionId);
      
      setSubmissionInProgress(false);
      
      // Reset execution tracking
      executionRef.current = {
        isExecuting: false,
        currentWebsiteName: null,
        executionId: null,
        lastExecution: Date.now()
      };
      
      // Only reset creation guard if there was an error
      // Let the guard handle its own cleanup on success
      if (!createdWebsiteId) {
        resetCreation();
      }
    }
  };

  // Create a no-parameter retry function with fallback logging
  const retryInitialization = (): void => {
    if (lastWebsiteData) {
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
