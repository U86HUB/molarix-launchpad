
import React, { useRef } from "react";
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
  // Add click tracking to prevent rapid double-clicks
  const clickTrackingRef = useRef<{
    lastClickTime: number;
    isProcessing: boolean;
  }>({
    lastClickTime: 0,
    isProcessing: false
  });

  console.log('🔍 UnifiedOnboardingNavigation render:', { 
    currentStep, 
    canProceed, 
    isSubmitting,
    isProcessing: clickTrackingRef.current.isProcessing,
    timestamp: Date.now()
  });

  const handleNextClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - clickTrackingRef.current.lastClickTime;
    
    console.log('🔘 Next button clicked at:', now);
    console.log('🔍 Click tracking state:', {
      timeSinceLastClick,
      isProcessing: clickTrackingRef.current.isProcessing,
      isSubmitting,
      canProceed
    });
    
    // Prevent rapid double-clicks (within 1 second)
    if (timeSinceLastClick < 1000) {
      console.warn('🚫 Next click blocked - too rapid, time since last:', timeSinceLastClick, 'ms');
      return;
    }

    // Prevent clicks if already processing
    if (clickTrackingRef.current.isProcessing) {
      console.warn('🚫 Next click blocked - already processing');
      return;
    }

    // Check submission state
    if (isSubmitting || !canProceed) {
      console.warn('🚫 Next click blocked - isSubmitting:', isSubmitting, 'canProceed:', canProceed);
      return;
    }
    
    // Lock processing and update click time
    clickTrackingRef.current = {
      lastClickTime: now,
      isProcessing: true
    };

    console.log('✅ Next click allowed, executing onNext()');
    
    try {
      onNext();
    } finally {
      // Reset processing flag after a delay to prevent rapid succession
      setTimeout(() => {
        clickTrackingRef.current.isProcessing = false;
        console.log('🔓 Next button processing unlocked');
      }, 1000);
    }
  };

  const handleBackClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - clickTrackingRef.current.lastClickTime;
    
    console.log('🔙 Back button clicked at:', now);
    
    // Prevent rapid clicks
    if (timeSinceLastClick < 500) {
      console.warn('🚫 Back click blocked - too rapid');
      return;
    }

    if (isSubmitting) {
      console.warn('🚫 Back click blocked - isSubmitting:', isSubmitting);
      return;
    }

    clickTrackingRef.current.lastClickTime = now;
    onBack();
  };

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={handleBackClick}
        disabled={currentStep === 1 || isSubmitting || clickTrackingRef.current.isProcessing}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button 
        onClick={handleNextClick}
        disabled={!canProceed || isSubmitting || clickTrackingRef.current.isProcessing}
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
