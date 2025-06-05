
import React from "react";
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

const UnifiedOnboardingFlow = () => {
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

  const handleSubmit = () => {
    submitOnboarding(onboardingData, existingClinics);
  };

  const onNext = () => {
    handleNext(onboardingData, handleSubmit);
  };

  return (
    <>
      <WebsiteInitializationLoader
        isVisible={isInitializing}
        currentStep={initStep}
        currentMessage={currentMessage}
        isCompleted={initCompleted}
        hasError={Boolean(initError)}
        onRetry={() => {
          console.log('Retry initialization requested');
        }}
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
