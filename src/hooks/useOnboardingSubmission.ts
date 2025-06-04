
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { OnboardingData } from "@/pages/Onboarding";

export const useOnboardingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-logos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Logo upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('clinic-logos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const submitOnboardingData = async (data: OnboardingData): Promise<{ success: boolean; sessionId?: string }> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit onboarding data.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsSubmitting(true);
    
    try {
      let logoUrl = null;
      
      // Upload logo if provided
      if (data.brand.logo) {
        logoUrl = await uploadLogo(data.brand.logo);
        if (!logoUrl) {
          throw new Error('Failed to upload logo');
        }
      }

      // Prepare data for database insertion
      const onboardingSession = {
        clinic_name: data.clinic.name,
        address: data.clinic.address,
        phone: data.clinic.phone,
        email: data.clinic.email,
        logo_url: logoUrl,
        primary_color: data.brand.primaryColor,
        font_style: data.brand.fontStyle,
        compliance_flags: {
          hipaa: data.compliance.hipaa,
          gdpr: data.compliance.gdpr
        },
        selected_template: data.selectedTemplateId,
        created_by: user.id
      };

      console.log('Submitting onboarding data:', onboardingSession);

      // Insert data into Supabase
      const { data: insertedData, error } = await supabase
        .from('onboarding_sessions')
        .insert([onboardingSession])
        .select()
        .single();

      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }

      console.log('Successfully inserted onboarding data:', insertedData);

      toast({
        title: "Onboarding Complete!",
        description: "Your clinic setup has been saved successfully.",
      });

      return { success: true, sessionId: insertedData.id };
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      
      toast({
        title: "Error",
        description: "Failed to save your clinic setup. Please try again.",
        variant: "destructive",
      });

      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOnboardingData,
    isSubmitting
  };
};
