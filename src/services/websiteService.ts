
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/website';
import { handleSupabaseError, handleOperationSuccess } from '@/utils/errorHandling';

export interface CreateWebsiteData {
  name: string;
  clinicId: string;
  templateType: string;
  primaryColor: string;
  fontStyle: string;
}

export const websiteService = {
  async fetchWebsites(userId: string): Promise<Website[]> {
    console.log('Fetching websites for user:', userId);

    const { data: websitesData, error: websitesError } = await supabase
      .from('websites')
      .select(`
        *,
        clinics!inner(name)
      `)
      .eq('created_by', userId)
      .order('updated_at', { ascending: false });

    if (websitesError) {
      handleSupabaseError(
        websitesError,
        {
          operation: 'fetch websites',
          table: 'websites',
          userId
        }
      );
      throw websitesError;
    }

    const typedWebsites: Website[] = (websitesData || []).map(website => ({
      id: website.id,
      name: website.name,
      domain: website.domain,
      status: website.status as 'draft' | 'published' | 'archived',
      template_type: website.template_type,
      primary_color: website.primary_color,
      font_style: website.font_style,
      clinic_id: website.clinic_id,
      created_by: website.created_by,
      created_at: website.created_at,
      updated_at: website.updated_at,
      clinic: { name: website.clinics?.name || 'Unknown Clinic' }
    }));

    console.log('Fetched websites:', typedWebsites.length);
    return typedWebsites;
  },

  async createWebsite(websiteData: CreateWebsiteData, userId: string): Promise<Website> {
    console.log('Creating website:', websiteData);

    const { data, error } = await supabase
      .from('websites')
      .insert({
        name: websiteData.name,
        clinic_id: websiteData.clinicId,
        template_type: websiteData.templateType,
        primary_color: websiteData.primaryColor,
        font_style: websiteData.fontStyle,
        status: 'draft',
        created_by: userId,
      })
      .select(`
        *,
        clinics!inner(name)
      `)
      .single();

    if (error) {
      handleSupabaseError(
        error,
        {
          operation: 'create website',
          table: 'websites',
          userId,
          additionalData: websiteData
        }
      );
      throw error;
    }

    const newWebsite: Website = {
      id: data.id,
      name: data.name,
      domain: data.domain,
      status: data.status as 'draft' | 'published' | 'archived',
      template_type: data.template_type,
      primary_color: data.primary_color,
      font_style: data.font_style,
      clinic_id: data.clinic_id,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      clinic: { name: data.clinics?.name || 'Unknown Clinic' }
    };

    handleOperationSuccess(
      'create website',
      `Website "${data.name}" has been created successfully.`
    );

    return newWebsite;
  },

  async deleteWebsite(websiteId: string, userId: string): Promise<void> {
    console.log('Deleting website:', websiteId);

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId)
      .eq('created_by', userId);

    if (error) {
      handleSupabaseError(
        error,
        {
          operation: 'delete website',
          table: 'websites',
          userId,
          additionalData: { websiteId }
        }
      );
      throw error;
    }

    handleOperationSuccess(
      'delete website',
      'Website has been deleted successfully.'
    );
  }
};
