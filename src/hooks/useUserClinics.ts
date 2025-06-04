
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
    if (!user) {
      console.log('useUserClinics: No user found, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('=== FETCHING CLINICS DEBUG START ===');
    console.log('Current user:', { id: user.id, email: user.email });
    console.log('Fetching clinics for user:', user.id);

    try {
      // First, let's check what we get without the filter to debug RLS
      console.log('🔍 Testing query without RLS filter...');
      const { data: allData, error: allError } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('All clinics query result:', { data: allData, error: allError });

      // Now the actual query with user filter
      console.log('🔍 Executing main clinics query...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      console.log('User clinics query result:', { 
        data, 
        error, 
        userIdUsed: user.id,
        dataLength: data?.length || 0 
      });

      if (error) {
        console.log('❌ Error fetching clinics:', error);
        throw error;
      }

      console.log('✅ Clinics fetched successfully:', data?.length || 0, 'clinics');
      console.log('📋 Clinic details:', data?.map(c => ({ id: c.id, name: c.name, created_by: c.created_by })));
      setClinics(data || []);
    } catch (error) {
      console.error('❌ Error in fetchClinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('=== FETCHING CLINICS DEBUG END ===');
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
