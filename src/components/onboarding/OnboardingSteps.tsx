
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import OnboardingClinicInfo from "./OnboardingClinicInfo";
import OnboardingBrandSettings from "./OnboardingBrandSettings";
import OnboardingCompliance from "./OnboardingCompliance";
import OnboardingTemplateSelection from "./OnboardingTemplateSelection";
import { OnboardingData } from "@/pages/Onboarding";

interface OnboardingStepsProps {
  activeStep: string;
  progress: number;
  onboardingData: OnboardingData;
  updateClinicData: (data: OnboardingData['clinic']) => void;
  updateBrandData: (data: OnboardingData['brand']) => void;
  updateComplianceData: (data: OnboardingData['compliance']) => void;
  updateSelectedTemplate: (templateId: string) => void;
  setActiveStep: (step: string) => void;
  setProgress: (progress: number) => void;
}

const OnboardingSteps = ({
  activeStep,
  progress,
  onboardingData,
  updateClinicData,
  updateBrandData,
  updateComplianceData,
  updateSelectedTemplate,
  setActiveStep,
  setProgress
}: OnboardingStepsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeStep} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger 
          value="clinic"
          onClick={() => {
            setActiveStep("clinic");
            setProgress(25);
          }}
          disabled={activeStep !== "clinic" && progress < 50}
        >
          {t('step1') || '1. Clinic Info'}
        </TabsTrigger>
        <TabsTrigger 
          value="brand"
          onClick={() => {
            setActiveStep("brand");
            setProgress(50);
          }}
          disabled={activeStep !== "brand" && progress < 75 && progress !== 50}
        >
          {t('step2') || '2. Branding'}
        </TabsTrigger>
        <TabsTrigger 
          value="compliance"
          onClick={() => {
            setActiveStep("compliance");
            setProgress(75);
          }}
          disabled={activeStep !== "compliance" && progress < 100 && progress !== 75}
        >
          {t('step3') || '3. Compliance'}
        </TabsTrigger>
        <TabsTrigger 
          value="templates"
          onClick={() => {
            setActiveStep("templates");
            setProgress(100);
          }}
          disabled={activeStep !== "templates" && progress !== 100}
        >
          {t('step4') || '4. Templates'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clinic" className="space-y-4">
        <OnboardingClinicInfo 
          clinicData={onboardingData.clinic} 
          updateClinicData={updateClinicData} 
        />
      </TabsContent>

      <TabsContent value="brand" className="space-y-4">
        <OnboardingBrandSettings 
          brandData={onboardingData.brand} 
          updateBrandData={updateBrandData} 
        />
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <OnboardingCompliance 
          complianceData={onboardingData.compliance} 
          updateComplianceData={updateComplianceData} 
        />
      </TabsContent>

      <TabsContent value="templates" className="space-y-4">
        <OnboardingTemplateSelection 
          selectedTemplateId={onboardingData.selectedTemplateId} 
          updateSelectedTemplate={updateSelectedTemplate} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default OnboardingSteps;
