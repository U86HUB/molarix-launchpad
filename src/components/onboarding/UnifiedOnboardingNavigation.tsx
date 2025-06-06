
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface UnifiedOnboardingNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

const UnifiedOnboardingNavigation = ({
  currentStep,
  canProceed,
  isSubmitting,
  onBack,
  onNext
}: UnifiedOnboardingNavigationProps) => {
  console.log('🔍 UnifiedOnboardingNavigation render:', { 
    currentStep, 
    canProceed, 
    isSubmitting,
    timestamp: Date.now()
  });

  const handleNextClick = () => {
    console.log('🔘 Next button clicked at:', Date.now());
    console.log('🔍 Current state before click:', { isSubmitting, canProceed });
    
    if (isSubmitting || !canProceed) {
      console.warn('🚫 Next click blocked - isSubmitting:', isSubmitting, 'canProceed:', canProceed);
      return;
    }
    
    onNext();
  };

  const handleBackClick = () => {
    console.log('🔙 Back button clicked at:', Date.now());
    if (isSubmitting) {
      console.warn('🚫 Back click blocked - isSubmitting:', isSubmitting);
      return;
    }
    onBack();
  };

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={handleBackClick}
        disabled={currentStep === 1 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button 
        onClick={handleNextClick}
        disabled={!canProceed || isSubmitting}
        className="flex items-center gap-2"
        type="button"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {currentStep === 3 
          ? isSubmitting 
            ? 'Creating...' 
            : 'Complete Setup'
          : 'Next Step'}
        {!isSubmitting && currentStep < 3 && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default UnifiedOnboardingNavigation;
