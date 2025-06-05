import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import OnboardingClinicStep from "./OnboardingClinicStep";
import OnboardingWebsiteStep from "./OnboardingWebsiteStep";
import OnboardingPreferencesStep from "./OnboardingPreferencesStep";
import { handleSupabaseError, handleOperationSuccess } from "@/utils/errorHandling";

export interface UnifiedOnboardingData {
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    skipClinic: boolean;
    selectedClinicId?: string;
  };
  website: {
    name: string;
    selectedTemplate: string;
    logo: File | null;
    primaryColor: string;
    fontStyle: string;
  };
  preferences: {
    toneOfVoice: string;
    hipaa: boolean;
    gdpr: boolean;
  };
}

const UnifiedOnboardingFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingClinics, setExistingClinics] = useState<any[]>([]);
  
  const [onboardingData, setOnboardingData] = useState<UnifiedOnboardingData>({
    clinic: {
      name: "",
      address: "",
      phone: "",
      email: "",
      skipClinic: false,
    },
    website: {
      name: "",
      selectedTemplate: "",
      logo: null,
      primaryColor: "#4f46e5",
      fontStyle: "default",
    },
    preferences: {
      toneOfVoice: "professional",
      hipaa: false,
      gdpr: false,
    },
  });

  // Check if user has existing clinics on mount
  useEffect(() => {
    checkExistingClinics();
    checkIfOnboardingCompleted();
  }, [user]);

  const checkExistingClinics = async () => {
    if (!user) return;

    try {
      const { data: clinics, error } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('created_by', user.id);

      if (error) {
        handleSupabaseError(
          error,
          {
            operation: 'fetch existing clinics',
            table: 'clinics',
            userId: user.id
          }
        );
        return;
      }

      setExistingClinics(clinics || []);
      console.log('Found existing clinics:', clinics?.length || 0);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      handleSupabaseError(
        error,
        {
          operation: 'fetch existing clinics',
          userId: user.id
        }
      );
    }
  };

  const checkIfOnboardingCompleted = async () => {
    if (!user) return;

    try {
      const { data: sessions, error } = await supabase
        .from('onboarding_sessions')
        .select('id, completion_score')
        .eq('created_by', user.id)
        .eq('completion_score', 100)
        .limit(1);

      if (error) {
        handleSupabaseError(
          error,
          {
            operation: 'check onboarding completion',
            table: 'onboarding_sessions',
            userId: user.id
          }
        );
        return;
      }
      
      if (sessions && sessions.length > 0) {
        console.log('User has completed onboarding, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      handleSupabaseError(
        error,
        {
          operation: 'check onboarding status',
          userId: user.id
        }
      );
    }
  };

  const updateClinicData = (data: typeof onboardingData.clinic) => {
    setOnboardingData(prev => ({ ...prev, clinic: data }));
  };

  const updateWebsiteData = (data: typeof onboardingData.website) => {
    setOnboardingData(prev => ({ ...prev, website: data }));
  };

  const updatePreferencesData = (data: typeof onboardingData.preferences) => {
    setOnboardingData(prev => ({ ...prev, preferences: data }));
  };

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.clinic.skipClinic || 
               (onboardingData.clinic.name && onboardingData.clinic.email);
      case 2:
        return onboardingData.website.name && onboardingData.website.selectedTemplate;
      case 3:
        return onboardingData.preferences.toneOfVoice;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!canProceed()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting onboarding submission for user:', user.id);

    try {
      let clinicId = onboardingData.clinic.selectedClinicId;

      // Step 1: Create clinic if not skipped
      if (!onboardingData.clinic.skipClinic) {
        console.log('Creating new clinic:', onboardingData.clinic.name);
        
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .insert({
            name: onboardingData.clinic.name,
            address: onboardingData.clinic.address || null,
            phone: onboardingData.clinic.phone || null,
            email: onboardingData.clinic.email || null,
            created_by: user.id,
          })
          .select()
          .single();

        if (clinicError) {
          handleSupabaseError(
            clinicError,
            {
              operation: 'create clinic during onboarding',
              table: 'clinics',
              userId: user.id,
              additionalData: { clinicName: onboardingData.clinic.name }
            },
            'Failed to create clinic. Please check your information and try again.'
          );
          return;
        }

        clinicId = clinicData.id;
        console.log('Clinic created successfully:', clinicId);
      } else {
        console.log('Using existing clinic:', clinicId);
      }

      if (!clinicId) {
        toast({
          title: "Clinic Required",
          description: "Please select or create a clinic to continue.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Create website
      console.log('Creating website:', onboardingData.website.name);
      
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .insert({
          name: onboardingData.website.name,
          clinic_id: clinicId,
          template_type: onboardingData.website.selectedTemplate,
          primary_color: onboardingData.website.primaryColor,
          font_style: onboardingData.website.fontStyle,
          status: 'draft',
          created_by: user.id,
        })
        .select()
        .single();

      if (websiteError) {
        handleSupabaseError(
          websiteError,
          {
            operation: 'create website during onboarding',
            table: 'websites',
            userId: user.id,
            additionalData: { 
              websiteName: onboardingData.website.name,
              clinicId 
            }
          },
          'Failed to create website. Please try again.'
        );
        return;
      }

      console.log('Website created successfully:', websiteData.id);

      // Step 3: Create onboarding session
      console.log('Creating onboarding session');
      
      const { error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          clinic_id: clinicId,
          clinic_name: onboardingData.clinic.name || existingClinics.find(c => c.id === clinicId)?.name,
          address: onboardingData.clinic.address || null,
          phone: onboardingData.clinic.phone || null,
          email: onboardingData.clinic.email || null,
          primary_color: onboardingData.website.primaryColor,
          font_style: onboardingData.website.fontStyle,
          selected_template: onboardingData.website.selectedTemplate,
          compliance_flags: {
            hipaa: onboardingData.preferences.hipaa,
            gdpr: onboardingData.preferences.gdpr,
            toneOfVoice: onboardingData.preferences.toneOfVoice,
          },
          completion_score: 100,
          created_by: user.id,
          last_updated: new Date().toISOString(),
        });

      if (sessionError) {
        handleSupabaseError(
          sessionError,
          {
            operation: 'create onboarding session',
            table: 'onboarding_sessions',
            userId: user.id,
            additionalData: { clinicId, websiteId: websiteData.id }
          },
          'Setup was partially completed but failed to save preferences. You can still access your website.'
        );
        
        // Still redirect to website builder even if session creation fails
        navigate(`/website-builder/${websiteData.id}`);
        return;
      }

      console.log('Onboarding session created successfully');

      handleOperationSuccess(
        'complete onboarding',
        'Your clinic and website have been set up successfully!'
      );

      // Redirect to website builder
      navigate(`/website-builder/${websiteData.id}`);

    } catch (error: any) {
      console.error('Onboarding submission error:', error);
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
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingClinicStep
            clinicData={onboardingData.clinic}
            existingClinics={existingClinics}
            updateClinicData={updateClinicData}
          />
        );
      case 2:
        return (
          <OnboardingWebsiteStep
            websiteData={onboardingData.website}
            updateWebsiteData={updateWebsiteData}
          />
        );
      case 3:
        return (
          <OnboardingPreferencesStep
            preferencesData={onboardingData.preferences}
            updatePreferencesData={updatePreferencesData}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Clinic Information";
      case 2:
        return "Website Setup";
      case 3:
        return "Preferences";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Molarix
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's get your clinic website set up in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>
              Step 1: Clinic
            </span>
            <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>
              Step 2: Website
            </span>
            <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>
              Step 3: Preferences
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedOnboardingFlow;
