
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingSubmission } from "@/hooks/useOnboardingSubmission";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingSteps from "@/components/onboarding/OnboardingSteps";
import OnboardingNavigation from "@/components/onboarding/OnboardingNavigation";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export interface OnboardingData {
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  brand: {
    logo: File | null;
    primaryColor: string;
    fontStyle: string;
  };
  compliance: {
    hipaa: boolean;
    gdpr: boolean;
  };
  selectedTemplateId: string | null;
}

const Onboarding = () => {
  const { t } = useLanguage();
  const { submitOnboardingData, isSubmitting } = useOnboardingSubmission();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<string>("clinic");
  const [progress, setProgress] = useState<number>(25);
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    clinic: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
    brand: {
      logo: null,
      primaryColor: "#4f46e5",
      fontStyle: "default",
    },
    compliance: {
      hipaa: false,
      gdpr: false,
    },
    selectedTemplateId: null,
  });

  const updateClinicData = (data: typeof onboardingData.clinic) => {
    setOnboardingData(prev => ({ ...prev, clinic: data }));
  };

  const updateBrandData = (data: typeof onboardingData.brand) => {
    setOnboardingData(prev => ({ ...prev, brand: data }));
  };

  const updateComplianceData = (data: typeof onboardingData.compliance) => {
    setOnboardingData(prev => ({ ...prev, compliance: data }));
  };

  const updateSelectedTemplate = (templateId: string) => {
    setOnboardingData(prev => ({ ...prev, selectedTemplateId: templateId }));
  };

  const handleNext = () => {
    if (activeStep === "clinic") {
      setActiveStep("brand");
      setProgress(50);
    } else if (activeStep === "brand") {
      setActiveStep("compliance");
      setProgress(75);
    } else if (activeStep === "compliance") {
      setActiveStep("templates");
      setProgress(100);
    } else if (activeStep === "templates") {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep === "brand") {
      setActiveStep("clinic");
      setProgress(25);
    } else if (activeStep === "compliance") {
      setActiveStep("brand");
      setProgress(50);
    } else if (activeStep === "templates") {
      setActiveStep("compliance");
      setProgress(75);
    }
  };

  const handleSubmit = async () => {
    const result = await submitOnboardingData(onboardingData);
    
    if (result.success && result.sessionId) {
      // Redirect to template preview page
      navigate(`/template-preview?sessionId=${result.sessionId}`);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Onboarding' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BreadcrumbNav items={breadcrumbItems} />
        
        <OnboardingHeader />

        <OnboardingProgress 
          activeStep={activeStep} 
          progress={progress} 
        />

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('onboardingStepTitle') || 'Clinic Onboarding'}</CardTitle>
            <CardDescription>
              {t('onboardingStepDescription') || 'Complete all steps to set up your clinic portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingSteps
              activeStep={activeStep}
              progress={progress}
              onboardingData={onboardingData}
              updateClinicData={updateClinicData}
              updateBrandData={updateBrandData}
              updateComplianceData={updateComplianceData}
              updateSelectedTemplate={updateSelectedTemplate}
              setActiveStep={setActiveStep}
              setProgress={setProgress}
            />

            <OnboardingNavigation
              activeStep={activeStep}
              onboardingData={onboardingData}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
