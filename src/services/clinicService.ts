
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/errorHandling';
import { useAuth } from '@/contexts/AuthContext';

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CreateClinicData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CreateClinicResult {
  success: boolean;
  data?: Clinic;
  error?: string;
}

export const clinicService = {
  async fetchClinics(userId: string): Promise<Clinic[]> {
    console.log('Fetching clinics for user:', userId);

    const { data: clinicsData, error: clinicsError } = await supabase
      .from('clinics')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (clinicsError) {
      handleSupabaseError(
        clinicsError,
        {
          operation: 'fetch clinics',
          table: 'clinics',
          userId
        }
      );
      throw clinicsError;
    }

    console.log('Fetched clinics:', clinicsData?.length || 0);
    return clinicsData || [];
  }
};

export const createClinicInDatabase = async (clinicData: CreateClinicData): Promise<CreateClinicResult> => {
  console.log('🏥 createClinicInDatabase called with:', clinicData);

  // Get current user from auth context - we need this to be called from a component context
  // For now, we'll get it from supabase auth directly
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('❌ Auth error or no user:', authError);
    return {
      success: false,
      error: 'User authentication required'
    };
  }

  try {
    const { data, error } = await supabase
      .from('clinics')
      .insert({
        name: clinicData.name,
        address: clinicData.address,
        phone: clinicData.phone,
        email: clinicData.email,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error creating clinic:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ Clinic created successfully:', data);
    return {
      success: true,
      data: data as Clinic
    };
  } catch (error: any) {
    console.error('❌ Unexpected error creating clinic:', error);
    return {
      success: false,
      error: error.message || 'Failed to create clinic'
    };
  }
};
