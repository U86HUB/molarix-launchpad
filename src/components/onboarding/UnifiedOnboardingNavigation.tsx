
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
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className="flex items-center gap-2"
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
