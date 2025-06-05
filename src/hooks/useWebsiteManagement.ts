
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/website';
import { handleSupabaseError, handleOperationSuccess } from '@/utils/errorHandling';

interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching websites and clinics for user:', user.id);

      // Fetch clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (clinicsError) {
        handleSupabaseError(
          clinicsError,
          {
            operation: 'fetch clinics',
            table: 'clinics',
            userId: user.id
          }
        );
        return;
      }

      setClinics(clinicsData || []);
      console.log('Fetched clinics:', clinicsData?.length || 0);

      // Fetch websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select(`
          *,
          clinics!inner(name)
        `)
        .eq('created_by', user.id)
        .order('updated_at', { ascending: false });

      if (websitesError) {
        handleSupabaseError(
          websitesError,
          {
            operation: 'fetch websites',
            table: 'websites',
            userId: user.id
          }
        );
        return;
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

      setWebsites(typedWebsites);
      console.log('Fetched websites:', typedWebsites.length);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      handleSupabaseError(
        error,
        {
          operation: 'fetch data',
          userId: user.id
        },
        'Failed to load your data. Please refresh the page.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteCreate = async (websiteData: {
    name: string;
    clinicId: string;
    templateType: string;
    primaryColor: string;
    fontStyle: string;
  }) => {
    if (!user) return false;

    try {
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
          created_by: user.id,
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
            userId: user.id,
            additionalData: websiteData
          }
        );
        return false;
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

      setWebsites(prev => [newWebsite, ...prev]);
      
      handleOperationSuccess(
        'create website',
        `Website "${data.name}" has been created successfully.`
      );

      return true;

    } catch (error: any) {
      console.error('Error creating website:', error);
      handleSupabaseError(
        error,
        {
          operation: 'create website',
          table: 'websites',
          userId: user.id,
          additionalData: websiteData
        },
        'Failed to create website. Please try again.'
      );
      return false;
    }
  };

  const handleWebsiteDelete = async (websiteId: string) => {
    if (!user) return false;

    try {
      console.log('Deleting website:', websiteId);

      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId)
        .eq('created_by', user.id);

      if (error) {
        handleSupabaseError(
          error,
          {
            operation: 'delete website',
            table: 'websites',
            userId: user.id,
            additionalData: { websiteId }
          }
        );
        return false;
      }

      setWebsites(prev => prev.filter(website => website.id !== websiteId));
      
      handleOperationSuccess(
        'delete website',
        'Website has been deleted successfully.'
      );

      return true;

    } catch (error: any) {
      console.error('Error deleting website:', error);
      handleSupabaseError(
        error,
        {
          operation: 'delete website',
          table: 'websites',
          userId: user.id,
          additionalData: { websiteId }
        },
        'Failed to delete website. Please try again.'
      );
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    websites,
    clinics,
    loading,
    handleWebsiteCreate,
    handleWebsiteDelete,
    refreshData: fetchData,
  };
};
