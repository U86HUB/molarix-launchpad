
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OrphanedSession {
  id: string;
  clinic_name: string;
  created_at: string;
  last_updated: string;
  created_by: string;
}

export const useOrphanedSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orphanedSessions, setOrphanedSessions] = useState<OrphanedSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrphanedSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Fetching orphaned sessions...');
      
      const { data, error } = await supabase.rpc('get_orphaned_sessions');

      if (error) {
        console.error('Error fetching orphaned sessions:', error);
        throw error;
      }

      console.log('Orphaned sessions found:', data?.length || 0);
      setOrphanedSessions(data || []);
    } catch (error) {
      console.error('Error in fetchOrphanedSessions:', error);
      toast({
        title: "Error",
        description: "Failed to load orphaned websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reassignSessionToClinic = async (sessionId: string, clinicId: string) => {
    if (!user) return false;

    try {
      console.log('Reassigning session', sessionId, 'to clinic', clinicId);
      
      const { data, error } = await supabase.rpc('reassign_session_to_clinic', {
        session_id: sessionId,
        target_clinic_id: clinicId
      });

      if (error) {
        console.error('Error reassigning session:', error);
        throw error;
      }

      if (data === true) {
        toast({
          title: "Success",
          description: "Website has been reassigned to the clinic",
        });
        
        // Remove the session from orphaned list
        setOrphanedSessions(prev => prev.filter(session => session.id !== sessionId));
        return true;
      } else {
        throw new Error('Failed to reassign session');
      }
    } catch (error) {
      console.error('Error in reassignSessionToClinic:', error);
      toast({
        title: "Error",
        description: "Failed to reassign website to clinic",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrphanedSessions();
  }, [user]);

  return {
    orphanedSessions,
    loading,
    fetchOrphanedSessions,
    reassignSessionToClinic,
  };
};
