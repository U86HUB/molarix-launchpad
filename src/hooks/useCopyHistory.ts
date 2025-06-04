
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GeneratedCopy } from '@/types/copy';

interface CopyHistoryItem {
  id: string;
  data: GeneratedCopy;
  created_at: string;
  type: string;
}

export const useCopyHistory = (sessionId: string) => {
  const [history, setHistory] = useState<CopyHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user || !sessionId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_generated_copy')
        .select('id, data, created_at, type')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching copy history:', error);
      toast({
        title: "Error",
        description: "Failed to load copy history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ai_generated_copy')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "History item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [sessionId, user]);

  return {
    history,
    loading,
    refreshHistory: fetchHistory,
    deleteHistoryItem
  };
};
