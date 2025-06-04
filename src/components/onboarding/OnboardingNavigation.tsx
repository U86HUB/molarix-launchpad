
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { OnboardingData } from "@/pages/Onboarding";

interface OnboardingNavigationProps {
  activeStep: string;
  onboardingData: OnboardingData;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

const OnboardingNavigation = ({
  activeStep,
  onboardingData,
  isSubmitting,
  onBack,
  onNext
}: OnboardingNavigationProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={activeStep === "clinic" || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('back') || 'Back'}
      </Button>
      
      <Button 
        onClick={onNext}
        className="flex items-center gap-2"
        disabled={
          isSubmitting ||
          (activeStep === "clinic" && (!onboardingData.clinic.name || !onboardingData.clinic.email)) ||
          (activeStep === "templates" && !onboardingData.selectedTemplateId)
        }
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {activeStep === "templates" 
          ? isSubmitting 
            ? (t('submitting') || 'Submitting...') 
            : (t('finish') || 'Preview Templates')
          : t('next') || 'Next Step'}
        {!isSubmitting && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
