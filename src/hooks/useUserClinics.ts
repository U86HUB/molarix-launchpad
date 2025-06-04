
import { useState, useEffect } from 'react';
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
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = async () => {
    console.log('=== FETCHING CLINICS DEBUG START ===');
    
    try {
      // Get the current user from Supabase auth
      console.log('🔄 Getting current user for clinics fetch...');
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 User data for clinics fetch:', { 
        userData: userData?.user ? { 
          id: userData.user.id, 
          email: userData.user.email 
        } : null, 
        userError 
      });

      if (userError) {
        console.log('❌ Error getting user:', userError);
        setLoading(false);
        return;
      }

      if (!userData?.user?.id) {
        console.log('⚠️ No user found, skipping fetch');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      console.log('✅ Valid user ID for clinics fetch:', userId);

      // Now the actual query with user filter
      console.log('🔍 Executing main clinics query...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      console.log('📊 User clinics query result:', { 
        data, 
        error, 
        userIdUsed: userId,
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
  }, []);

  return {
    clinics,
    loading,
    refreshClinics: fetchClinics,
  };
};
