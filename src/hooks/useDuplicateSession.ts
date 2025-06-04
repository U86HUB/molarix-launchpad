
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDuplicateSession = () => {
  const { toast } = useToast();
  const { user } = useAuth();

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

  return { duplicateSession };
};
