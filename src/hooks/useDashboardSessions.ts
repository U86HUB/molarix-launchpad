
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
  clinic_id?: string;
  // Added clinic information
  clinic?: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
  };
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

  const deleteSession = async (sessionId: string) => {
    if (!user) {
      console.error('❌ No user found for deletion');
      return false;
    }

    try {
      console.log('🗑️ Attempting to delete session:', sessionId);
      console.log('👤 User ID:', user.id);

      // First, check if the session exists and belongs to the user
      const { data: existingSession, error: checkError } = await supabase
        .from('onboarding_sessions')
        .select('id, clinic_name, created_by')
        .eq('id', sessionId)
        .single();

      if (checkError) {
        console.error('❌ Error checking session existence:', checkError);
        throw checkError;
      }

      if (!existingSession) {
        console.error('❌ Session not found:', sessionId);
        toast({
          title: "Error",
          description: "Website not found",
          variant: "destructive",
        });
        return false;
      }

      console.log('📋 Found session to delete:', existingSession);

      if (existingSession.created_by !== user.id) {
        console.error('❌ User does not own this session');
        toast({
          title: "Error",
          description: "You don't have permission to delete this website",
          variant: "destructive",
        });
        return false;
      }

      // Delete related AI copy first to avoid foreign key constraints
      console.log('🧹 Cleaning up related AI copy...');
      const { error: copyDeleteError } = await supabase
        .from('ai_generated_copy')
        .delete()
        .eq('session_id', sessionId);

      if (copyDeleteError) {
        console.error('❌ Error deleting related copy:', copyDeleteError);
        // Don't fail the entire operation, just warn
        console.warn('⚠️ Could not delete related copy, continuing with session deletion');
      } else {
        console.log('✅ Related AI copy cleaned up successfully');
      }

      // Proceed with session deletion
      const { data: deleteResult, error: deleteError } = await supabase
        .from('onboarding_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('created_by', user.id)
        .select(); // Get the deleted row for confirmation

      console.log('🔍 Delete operation result:', { deleteResult, deleteError });

      if (deleteError) {
        console.error('❌ Error during deletion:', deleteError);
        throw deleteError;
      }

      // Check if anything was actually deleted
      if (!deleteResult || deleteResult.length === 0) {
        console.error('❌ No rows were deleted - session may not exist or belong to user');
        toast({
          title: "Error",
          description: "Website could not be deleted. It may not exist or you don't have permission.",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Session deleted successfully:', sessionId);
      console.log('📊 Deleted session data:', deleteResult[0]);

      // Immediately update local state to remove the deleted session
      setSessions(prevSessions => {
        const updatedSessions = prevSessions.filter(session => session.id !== sessionId);
        console.log('🔄 Updated local sessions count:', updatedSessions.length);
        return updatedSessions;
      });

      toast({
        title: "Success",
        description: "Website deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
      return false;
    }
  };

  const duplicateSession = async (sessionId: string) => {
    if (!user) return false;

    try {
      console.log('📄 Duplicating session:', sessionId);
      
      const { data, error } = await supabase.rpc('duplicate_session', {
        original_session_id: sessionId
      });

      if (error) throw error;

      console.log('✅ Session duplicated successfully');

      toast({
        title: "Success",
        description: "Website duplicated successfully",
      });

      return true;
    } catch (error) {
      console.error('❌ Error duplicating session:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate website",
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
    deleteSession,
    duplicateSession
  };
};
