
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "./useUnifiedOnboardingData";

export const useUnifiedOnboardingSubmission = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
    retryInitialization,
  } = useWebsiteInitialization();

  const submitOnboarding = async (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to complete onboarding.",
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
      }

      console.log('Onboarding session created successfully');

      // Step 4: Initialize website with loading screen
      await initializeWebsite({
        websiteId: websiteData.id,
        templateType: onboardingData.website.selectedTemplate,
        primaryColor: onboardingData.website.primaryColor,
        fontStyle: onboardingData.website.fontStyle,
        clinicData: {
          name: onboardingData.clinic.name || existingClinics.find(c => c.id === clinicId)?.name || 'Your Practice',
          address: onboardingData.clinic.address,
          phone: onboardingData.clinic.phone,
          email: onboardingData.clinic.email,
        }
      });

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

  return {
    isSubmitting,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    submitOnboarding,
    retryInitialization,
  };
};
