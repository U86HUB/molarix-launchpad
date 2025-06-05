
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";

export interface ClinicCreationResult {
  success: boolean;
  clinicId?: string;
  error?: string;
}

export const createClinic = async (
  clinicData: UnifiedOnboardingData['clinic'],
  userId: string
): Promise<ClinicCreationResult> => {
  try {
    console.log('Creating new clinic:', clinicData.name);
    
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicData.name,
        address: clinicData.address || null,
        phone: clinicData.phone || null,
        email: clinicData.email || null,
        created_by: userId,
      })
      .select()
      .single();

    if (clinicError) {
      handleSupabaseError(
        clinicError,
        {
          operation: 'create clinic during onboarding',
          table: 'clinics',
          userId,
          additionalData: { clinicName: clinicData.name }
        },
        'Failed to create clinic. Please check your information and try again.'
      );
      return { success: false, error: clinicError.message };
    }

    console.log('Clinic created successfully:', clinic.id);
    return { success: true, clinicId: clinic.id };
  } catch (error: any) {
    console.error('Error creating clinic:', error);
    return { success: false, error: error.message };
  }
};
