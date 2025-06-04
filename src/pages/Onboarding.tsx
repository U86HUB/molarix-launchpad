
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import OnboardingClinicInfo from "@/components/onboarding/OnboardingClinicInfo";
import OnboardingBrandSettings from "@/components/onboarding/OnboardingBrandSettings";
import OnboardingCompliance from "@/components/onboarding/OnboardingCompliance";
import OnboardingTemplateSelection from "@/components/onboarding/OnboardingTemplateSelection";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import WorkflowProgress, { WorkflowStep } from "@/components/ui/workflow-progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboardingSubmission } from "@/hooks/useOnboardingSubmission";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'clinic',
      label: 'Clinic Info',
      description: 'Basic clinic details',
      status: activeStep === 'clinic' ? 'current' : (progress > 25 ? 'completed' : 'upcoming'),
    },
    {
      id: 'brand',
      label: 'Branding',
      description: 'Logo and style',
      status: activeStep === 'brand' ? 'current' : (progress > 50 ? 'completed' : 'upcoming'),
    },
    {
      id: 'compliance',
      label: 'Compliance',
      description: 'Privacy settings',
      status: activeStep === 'compliance' ? 'current' : (progress > 75 ? 'completed' : 'upcoming'),
    },
    {
      id: 'templates',
      label: 'Templates',
      description: 'Choose design',
      status: activeStep === 'templates' ? 'current' : (progress === 100 ? 'completed' : 'upcoming'),
    },
  ];

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
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('onboardingTitle') || 'Welcome to Molarix'}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {t('onboardingSubtitle') || 'Complete the setup to get started with your dental clinic portal'}
          </p>
        </div>

        <WorkflowProgress steps={workflowSteps} className="mb-8" />

        <Progress value={progress} className="h-2 mb-8" />

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('onboardingStepTitle') || 'Clinic Onboarding'}</CardTitle>
            <CardDescription>
              {t('onboardingStepDescription') || 'Complete all steps to set up your clinic portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === "clinic" || isSubmitting}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('back') || 'Back'}
              </Button>
              
              <Button 
                onClick={handleNext}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
