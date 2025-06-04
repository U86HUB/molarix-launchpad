
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

export const useClinic = (clinicId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClinic = async () => {
      if (!clinicId || !user) return;

      try {
        // Using type assertion since TypeScript types haven't been updated yet
        const { data, error } = await supabase
          .from('clinics' as any)
          .select('*')
          .eq('id', clinicId)
          .single();

        if (error) {
          console.error('Error loading clinic:', error);
          toast({
            title: "Error",
            description: "Failed to load clinic data",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setClinic(data as Clinic);
        }
      } catch (error) {
        console.error('Error loading clinic:', error);
        toast({
          title: "Error",
          description: "Failed to load clinic data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClinic();
  }, [clinicId, user, toast]);

  const updateClinic = async (updates: Partial<Clinic>) => {
    if (!clinic) return false;

    try {
      const { error } = await supabase
        .from('clinics' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clinic.id);

      if (error) throw error;

      setClinic({ ...clinic, ...updates });

      toast({
        title: "Saved successfully",
        description: "Clinic information has been updated.",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save clinic information",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    clinic,
    setClinic,
    loading,
    updateClinic,
  };
};
