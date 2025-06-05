
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardSession } from '@/types/dashboard';

const isDebugMode = () => localStorage.getItem('debugMode') === 'true';

export const useDeleteSession = (setSessions: React.Dispatch<React.SetStateAction<DashboardSession[]>>) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteSession = async (sessionId: string) => {
    if (!user) {
      console.error('❌ No user found for deletion');
      return false;
    }

    try {
      if (isDebugMode()) {
        console.log('🗑️ Attempting to delete website:', sessionId);
        console.log('👤 User ID:', user.id);
      }

      // First, check if the website exists and belongs to the user
      const { data: existingWebsite, error: checkError } = await supabase
        .from('websites')
        .select('id, name, created_by')
        .eq('id', sessionId)
        .single();

      if (checkError) {
        if (isDebugMode()) console.error('❌ Error checking website existence:', checkError);
        throw checkError;
      }

      if (!existingWebsite) {
        if (isDebugMode()) console.error('❌ Website not found:', sessionId);
        toast({
          title: "Error",
          description: "Website not found",
          variant: "destructive",
        });
        return false;
      }

      if (isDebugMode()) console.log('📋 Found website to delete:', existingWebsite);

      if (existingWebsite.created_by !== user.id) {
        console.error('❌ User does not own this website');
        toast({
          title: "Error",
          description: "You don't have permission to delete this website",
          variant: "destructive",
        });
        return false;
      }

      // Delete related sections first to avoid foreign key constraints
      if (isDebugMode()) console.log('🧹 Cleaning up related sections...');
      const { error: sectionsDeleteError } = await supabase
        .from('sections')
        .delete()
        .eq('website_id', sessionId);

      if (sectionsDeleteError) {
        console.error('❌ Error deleting related sections:', sectionsDeleteError);
        // Don't fail the entire operation, just warn
        console.warn('⚠️ Could not delete related sections, continuing with website deletion');
      } else if (isDebugMode()) {
        console.log('✅ Related sections cleaned up successfully');
      }

      // Proceed with website deletion
      const { data: deleteResult, error: deleteError } = await supabase
        .from('websites')
        .delete()
        .eq('id', sessionId)
        .eq('created_by', user.id)
        .select();

      if (isDebugMode()) {
        console.log('🔍 Delete operation result:', { deleteResult, deleteError });
      }

      if (deleteError) {
        console.error('❌ Error during deletion:', deleteError);
        throw deleteError;
      }

      // Check if anything was actually deleted
      if (!deleteResult || deleteResult.length === 0) {
        console.error('❌ No rows were deleted - website may not exist or belong to user');
        toast({
          title: "Error",
          description: "Website could not be deleted. It may not exist or you don't have permission.",
          variant: "destructive",
        });
        return false;
      }

      if (isDebugMode()) {
        console.log('✅ Website deleted successfully:', sessionId);
        console.log('📊 Deleted website data:', deleteResult[0]);
      }

      // Immediately update local state to remove the deleted session
      setSessions(prevSessions => {
        const updatedSessions = prevSessions.filter(session => session.id !== sessionId);
        if (isDebugMode()) {
          console.log('🔄 Updated local sessions count:', updatedSessions.length);
        }
        return updatedSessions;
      });

      toast({
        title: "Success",
        description: "Website deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('❌ Error deleting website:', error);
      if (isDebugMode()) {
        console.error('🔍 Detailed deletion error:', {
          error,
          sessionId,
          user_id: user.id,
          timestamp: new Date().toISOString()
        });
      }
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
      return false;
    }
  };

  return { deleteSession };
};
