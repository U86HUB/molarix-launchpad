
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GeneratedCopy } from '@/types/copy';

export const useSaveCopy = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveCopy = async (sessionId: string, copy: GeneratedCopy) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save copy.",
        variant: "destructive",
      });
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ai_generated_copy')
        .insert({
          session_id: sessionId,
          type: 'complete_copy',
          data: copy as any, // Type assertion to handle Json compatibility
          created_by: user.id
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Copy saved successfully!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error saving copy:', error);
      toast({
        title: "Error",
        description: "Failed to save copy. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getSavedCopy = async (sessionId: string) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const { data, error } = await supabase
        .from('ai_generated_copy')
        .select('*')
        .eq('session_id', sessionId)
        .eq('type', 'complete_copy')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { success: true, copy: data?.data as unknown as GeneratedCopy || null };
    } catch (error: any) {
      console.error('Error getting saved copy:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    saveCopy,
    getSavedCopy,
    loading
  };
};
