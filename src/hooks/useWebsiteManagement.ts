
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/website';

interface Clinic {
  id: string;
  name: string;
}

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserClinics = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('created_by', user.id);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchWebsites = async () => {
    if (!user) return;

    try {
      const userClinics = await fetchUserClinics();
      setClinics(userClinics);

      if (userClinics.length === 0) {
        setWebsites([]);
        return;
      }

      const clinicIds = userClinics.map(clinic => clinic.id);

      const { data, error } = await supabase
        .from('websites')
        .select(`
          id,
          name,
          template_type,
          status,
          clinic_id,
          created_at,
          updated_at,
          created_by,
          clinics!inner(name)
        `)
        .in('clinic_id', clinicIds)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const transformedWebsites: Website[] = (data || []).map(website => ({
        id: website.id,
        name: website.name,
        template_type: website.template_type,
        status: website.status as 'draft' | 'published' | 'archived',
        clinic_id: website.clinic_id,
        created_at: website.created_at,
        updated_at: website.updated_at,
        created_by: website.created_by,
        clinic: { name: website.clinics.name }
      }));

      setWebsites(transformedWebsites);
    } catch (error: any) {
      console.error('Error fetching websites:', error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteCreate = (newWebsite: Website) => {
    setWebsites([newWebsite, ...websites]);
  };

  const handleWebsiteDelete = async (websiteId: string) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;

      setWebsites(websites.filter(w => w.id !== websiteId));
      
      toast({
        title: "Success",
        description: "Website deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting website:', error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  return {
    websites,
    clinics,
    loading,
    handleWebsiteCreate,
    handleWebsiteDelete,
  };
};
