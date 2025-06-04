
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/pages/Onboarding';

interface SubmissionResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

export const useOnboardingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitOnboardingData = async (data: OnboardingData): Promise<SubmissionResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsSubmitting(true);

    try {
      // First, create the clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: data.clinic.name,
          address: data.clinic.address || null,
          phone: data.clinic.phone || null,
          email: data.clinic.email || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (clinicError) {
        console.error('Error creating clinic:', clinicError);
        throw new Error(clinicError.message);
      }

      // Upload logo if provided
      let logoUrl = null;
      if (data.brand.logo) {
        const fileExt = data.brand.logo.name.split('.').pop();
        const fileName = `${user.id}/${clinicData.id}/logo.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('clinic-logos')
          .upload(fileName, data.brand.logo, { upsert: true });

        if (uploadError) {
          console.error('Error uploading logo:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('clinic-logos')
            .getPublicUrl(fileName);
          logoUrl = publicUrl;
        }
      }

      // Update clinic with logo URL if uploaded
      if (logoUrl) {
        await supabase
          .from('clinics')
          .update({ logo_url: logoUrl })
          .eq('id', clinicData.id);
      }

      // Create the onboarding session linked to the clinic
      const { data: sessionData, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          clinic_id: clinicData.id,
          clinic_name: data.clinic.name,
          address: data.clinic.address || null,
          phone: data.clinic.phone || null,
          email: data.clinic.email || null,
          logo_url: logoUrl,
          primary_color: data.brand.primaryColor,
          font_style: data.brand.fontStyle,
          selected_template: data.selectedTemplateId,
          compliance_flags: data.compliance,
          completion_score: 100,
          created_by: user.id,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw new Error(sessionError.message);
      }

      toast({
        title: "Success!",
        description: "Your clinic has been set up successfully.",
      });

      return {
        success: true,
        sessionId: sessionData.id,
      };

    } catch (error: any) {
      console.error('Submission error:', error);
      
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to set up your clinic. Please try again.",
        variant: "destructive",
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOnboardingData,
    isSubmitting,
  };
};
