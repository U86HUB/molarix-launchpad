
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSession } from '@/utils/sessionManager';

export interface CreateClinicData {
  name: string;
  address?: string;
  userId?: string; // Make this optional since we'll get it from session
}

export const createClinicInDatabase = async ({ name, address }: CreateClinicData) => {
  console.log('Creating clinic in database...');

  try {
    // Get current session to ensure user is authenticated
    const { userId } = await getCurrentSession();
    console.log('Current user ID:', userId);

    // Create the insert payload with explicit created_by
    const insertPayload = {
      name: name.trim(),
      address: address?.trim() || null,
      created_by: userId, // Explicitly set created_by for RLS
    };
    
    console.log('Inserting clinic with payload:', insertPayload);

    // Insert with authenticated session
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert(insertPayload)
      .select()
      .single();

    console.log('Clinic insert result:', { 
      data: clinicData, 
      error: clinicError
    });

    if (clinicError) {
      console.error('Supabase error:', clinicError);
      throw new Error(`Database error: ${clinicError.message}`);
    }

    if (!clinicData) {
      console.error('No data returned from insert');
      throw new Error('No data returned from clinic creation');
    }

    console.log('Clinic created successfully:', {
      id: clinicData.id,
      name: clinicData.name,
      created_by: clinicData.created_by
    });

    return clinicData;
  } catch (error: any) {
    console.error('Error in createClinicInDatabase:', error);
    throw error; // Re-throw to be handled by the hook
  }
};
