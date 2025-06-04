
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Clinic {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useUserClinics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClinics(data || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [user]);

  return {
    clinics,
    loading,
    refreshClinics: fetchClinics,
  };
};
