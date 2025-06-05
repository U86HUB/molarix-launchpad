
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";

export interface SessionCreationResult {
  success: boolean;
  error?: string;
}

export const createOnboardingSession = async (
  onboardingData: UnifiedOnboardingData,
  clinicId: string,
  existingClinics: any[],
  userId: string
): Promise<SessionCreationResult> => {
  try {
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
        created_by: userId,
        last_updated: new Date().toISOString(),
      });

    if (sessionError) {
      handleSupabaseError(
        sessionError,
        {
          operation: 'create onboarding session',
          table: 'onboarding_sessions',
          userId,
          additionalData: { clinicId }
        },
        'Setup was partially completed but failed to save preferences. You can still access your website.'
      );
      return { success: false, error: sessionError.message };
    }

    console.log('Onboarding session created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating onboarding session:', error);
    return { success: false, error: error.message };
  }
};
