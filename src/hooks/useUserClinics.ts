
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
      // Get the current session from Supabase auth
      console.log('🔄 Getting current session for clinics fetch...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      console.log('🔐 Session data for clinics fetch:', { 
        session: sessionData?.session ? {
          access_token: sessionData.session.access_token ? 'EXISTS' : 'MISSING',
          user_id: sessionData.session.user?.id,
          user_email: sessionData.session.user?.email,
          expires_at: sessionData.session.expires_at
        } : null,
        sessionError 
      });

      if (sessionError) {
        console.log('❌ Error getting session:', sessionError);
        setLoading(false);
        return;
      }

      if (!sessionData?.session?.user?.id) {
        console.log('⚠️ No active session found, skipping fetch');
        setLoading(false);
        return;
      }

      const userId = sessionData.session.user.id;
      console.log('✅ Valid session and user ID for clinics fetch:', userId);

      // RLS policies will automatically filter by authenticated user
      console.log('🔍 Executing clinics query with authenticated session...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Clinics query result:', { 
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
