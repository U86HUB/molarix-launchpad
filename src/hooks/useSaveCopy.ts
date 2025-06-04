
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy } from '@/types/copy';

export const useSaveCopy = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveCopy = async (sessionId: string, copy: GeneratedCopy) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ai_generated_copy')
        .insert({
          session_id: sessionId,
          type: 'complete_copy',
          data: copy
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

      return { success: true, copy: data?.data || null };
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
