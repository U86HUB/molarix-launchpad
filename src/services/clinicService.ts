
import { supabase } from '@/integrations/supabase/client';

export interface CreateClinicData {
  name: string;
  address?: string;
  userId: string;
}

export const createClinicInDatabase = async ({ name, address, userId }: CreateClinicData) => {
  console.log('Creating clinic in database...');

  // Create the insert payload
  const insertPayload = {
    name: name.trim(),
    address: address?.trim() || null,
    created_by: userId,
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
    console.log('Supabase error:', clinicError);
    throw new Error(clinicError.message);
  }

  if (!clinicData) {
    console.log('No data returned from insert');
    throw new Error('No data returned from clinic creation');
  }

  console.log('Clinic created successfully:', {
    id: clinicData.id,
    name: clinicData.name
  });

  return clinicData;
};
