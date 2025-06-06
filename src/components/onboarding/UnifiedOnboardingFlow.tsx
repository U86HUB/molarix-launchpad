
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebsiteInitializationLoader from "../website-builder/WebsiteInitializationLoader";
import UnifiedOnboardingHeader from "./UnifiedOnboardingHeader";
import UnifiedOnboardingProgress from "./UnifiedOnboardingProgress";
import UnifiedOnboardingStepsRenderer from "./UnifiedOnboardingStepsRenderer";
import UnifiedOnboardingNavigation from "./UnifiedOnboardingNavigation";
import { useUnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { useUnifiedOnboardingSubmission } from "@/hooks/useUnifiedOnboardingSubmission";
import { useUnifiedOnboardingNavigation } from "@/hooks/useUnifiedOnboardingNavigation";
import { useUnifiedOnboardingClinics } from "@/hooks/useUnifiedOnboardingClinics";
import { usePageRenderGuard } from "@/hooks/usePageRenderGuard";

const UnifiedOnboardingFlow = () => {
  const renderGuard = usePageRenderGuard('UnifiedOnboardingFlow');
  const submissionTracker = useRef<{
    hasSubmitted: boolean;
    submissionTime: number | null;
  }>({
    hasSubmitted: false,
    submissionTime: null
  });
  
  const {
    onboardingData,
    updateClinicData,
    updateWebsiteData,
    updatePreferencesData,
  } = useUnifiedOnboardingData();

  const {
    isSubmitting,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    submitOnboarding,
    retryInitialization,
  } = useUnifiedOnboardingSubmission();

  const {
    currentStep,
    getProgressPercentage,
    getStepTitle,
    handleNext,
    handleBack,
    canProceed,
  } = useUnifiedOnboardingNavigation();

  const { existingClinics } = useUnifiedOnboardingClinics();

  // Log render information for debugging
  useEffect(() => {
    console.log('🔍 UnifiedOnboardingFlow render:', {
      renderCount: renderGuard.renderCount,
      currentStep,
      isSubmitting,
      isInitializing,
      websiteName: onboardingData.website.name,
      hasSubmitted: submissionTracker.current.hasSubmitted
    });
  }, [renderGuard.renderCount, currentStep, isSubmitting, isInitializing, onboardingData.website.name]);

  // Cleanup on unmount to prevent stale submissions
  useEffect(() => {
    return () => {
      console.log('🧹 UnifiedOnboardingFlow unmounting, resetting submission tracker');
      submissionTracker.current = {
        hasSubmitted: false,
        submissionTime: null
      };
    };
  }, []);

  const handleSubmit = () => {
    console.log('🔄 UnifiedOnboardingFlow.handleSubmit() called');
    console.log('🔍 Current render count:', renderGuard.renderCount);
    console.log('🔍 Submission tracker state:', submissionTracker.current);
    
    // Additional guard against rapid submissions
    if (renderGuard.isRapidRender()) {
      console.warn('⚠️ Blocked submit during rapid render');
      return;
    }

    // Prevent duplicate submissions
    if (submissionTracker.current.hasSubmitted) {
      const timeSinceSubmission = submissionTracker.current.submissionTime 
        ? Date.now() - submissionTracker.current.submissionTime
        : 0;
      
      console.warn('⚠️ Submission already completed, blocking duplicate. Time since:', timeSinceSubmission, 'ms');
      return;
    }

    // Mark as submitted
    submissionTracker.current = {
      hasSubmitted: true,
      submissionTime: Date.now()
    };
    
    console.log('✅ Proceeding with onboarding submission');
    submitOnboarding(onboardingData, existingClinics);
  };

  const onNext = () => {
    console.log('🔄 UnifiedOnboardingFlow.onNext() called');
    console.log('🔍 Current step:', currentStep);
    console.log('🔍 Render count:', renderGuard.renderCount);
    console.log('🔍 Submission tracker:', submissionTracker.current);
    
    handleNext(onboardingData, handleSubmit);
  };

  const handleRetry = () => {
    console.log('🔄 Explicit retry requested from UnifiedOnboardingFlow');
    
    // Reset submission tracker to allow retry
    submissionTracker.current = {
      hasSubmitted: false,
      submissionTime: null
    };
    
    retryInitialization();
  };

  return (
    <>
      <WebsiteInitializationLoader
        isVisible={isInitializing}
        currentStep={initStep}
        currentMessage={currentMessage}
        isCompleted={!!initCompleted}
        hasError={!!initError}
        onRetry={handleRetry}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <UnifiedOnboardingHeader />

          <UnifiedOnboardingProgress 
            currentStep={currentStep}
            progressPercentage={getProgressPercentage()}
          />

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedOnboardingStepsRenderer
                currentStep={currentStep}
                onboardingData={onboardingData}
                existingClinics={existingClinics}
                updateClinicData={updateClinicData}
                updateWebsiteData={updateWebsiteData}
                updatePreferencesData={updatePreferencesData}
              />

              <UnifiedOnboardingNavigation
                currentStep={currentStep}
                canProceed={canProceed(currentStep, onboardingData)}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={onNext}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UnifiedOnboardingFlow;
