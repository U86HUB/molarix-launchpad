
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/utils/errorHandling';

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
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
