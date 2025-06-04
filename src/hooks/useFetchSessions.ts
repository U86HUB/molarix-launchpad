
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSession } from '@/types/dashboard';

export const useFetchSessions = () => {
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🔄 Fetching sessions for user:', user.id);
      
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select(`
          id, 
          clinic_name, 
          created_at, 
          last_updated, 
          completion_score, 
          selected_template, 
          logo_url, 
          primary_color, 
          clinic_id,
          clinic:clinics(
            id,
            name,
            address,
            phone,
            email,
            logo_url
          )
        `)
        .order('last_updated', { ascending: false });

      if (error) throw error;

      console.log('✅ Sessions fetched successfully:', data?.length || 0);
      console.log('📋 Sessions data:', data?.map(s => ({ id: s.id, clinic_name: s.clinic_name, clinic_id: s.clinic_id })));

      setSessions(data || []);
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load your websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    setSessions,
    refreshSessions: fetchSessions,
  };
};
