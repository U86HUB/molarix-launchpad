
import { supabase } from '@/integrations/supabase/client';

export interface LinkedWebsite {
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ClinicDeletionCheck {
  canDelete: boolean;
  linkedWebsites: LinkedWebsite[];
  errorMessage?: string;
}

export const clinicDeletionService = {
  async checkClinicDeletion(clinicId: string): Promise<ClinicDeletionCheck> {
    console.log('Checking clinic deletion prerequisites for:', clinicId);

    try {
      // Check for linked websites
      const { data: linkedWebsites, error } = await supabase
        .from('websites')
        .select('id, name, status')
        .eq('clinic_id', clinicId);

      if (error) {
        console.error('Error checking linked websites:', error);
        return {
          canDelete: false,
          linkedWebsites: [],
          errorMessage: 'Failed to check linked websites'
        };
      }

      const websites = linkedWebsites || [];
      console.log(`Found ${websites.length} linked websites`);

      return {
        canDelete: websites.length === 0,
        linkedWebsites: websites.map(site => ({
          id: site.id,
          name: site.name,
          status: site.status as 'draft' | 'published' | 'archived'
        }))
      };
    } catch (error: any) {
      console.error('Unexpected error during clinic deletion check:', error);
      return {
        canDelete: false,
        linkedWebsites: [],
        errorMessage: 'Failed to verify clinic deletion prerequisites'
      };
    }
  }
};
