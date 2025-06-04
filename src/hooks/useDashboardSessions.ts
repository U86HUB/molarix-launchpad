
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardSession {
  id: string;
  clinic_name: string;
  created_at: string;
  last_updated: string;
  completion_score: number | null;
  selected_template: string;
  logo_url?: string;
  primary_color?: string;
}

export const useDashboardSessions = () => {
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select('id, clinic_name, created_at, last_updated, completion_score, selected_template, logo_url, primary_color')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load your websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('onboarding_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    refreshSessions: fetchSessions,
    deleteSession
  };
};
