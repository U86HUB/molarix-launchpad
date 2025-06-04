
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GeneratedCopy } from '@/types/copy';

export interface CopyVersion {
  id: string;
  data: GeneratedCopy;
  created_at: string;
  type: string;
  versionLabel: string;
}

interface CopyHistoryItem {
  id: string;
  data: GeneratedCopy;
  created_at: string;
  type: string;
}

interface VersionDifference {
  section: string;
  field: string;
  oldValue: string;
  newValue: string;
}

interface UseCopyHistoryParams {
  sessionId: string;
}

export const useCopyHistory = ({ sessionId }: UseCopyHistoryParams) => {
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

      // Transform the data to ensure it's properly typed
      const transformedData: CopyHistoryItem[] = (data || []).map(item => ({
        ...item,
        data: item.data as GeneratedCopy
      }));

      setHistory(transformedData);
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

  // Transform history items to versions with labels
  const versions: CopyVersion[] = history.map((item, index) => ({
    ...item,
    versionLabel: index === 0 ? 'Current Version' : `Version ${history.length - index}`
  }));

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getVersionDiff = (oldCopy: GeneratedCopy, newCopy: GeneratedCopy): VersionDifference[] => {
    const differences: VersionDifference[] = [];

    // Compare homepage fields
    Object.keys(oldCopy.homepage).forEach(key => {
      const field = key as keyof GeneratedCopy['homepage'];
      if (oldCopy.homepage[field] !== newCopy.homepage[field]) {
        differences.push({
          section: 'Homepage',
          field: field,
          oldValue: oldCopy.homepage[field],
          newValue: newCopy.homepage[field]
        });
      }
    });

    // Compare services fields
    if (oldCopy.services.title !== newCopy.services.title) {
      differences.push({
        section: 'Services',
        field: 'title',
        oldValue: oldCopy.services.title,
        newValue: newCopy.services.title
      });
    }

    if (oldCopy.services.intro !== newCopy.services.intro) {
      differences.push({
        section: 'Services',
        field: 'intro',
        oldValue: oldCopy.services.intro,
        newValue: newCopy.services.intro
      });
    }

    // Compare about fields
    if (oldCopy.about.title !== newCopy.about.title) {
      differences.push({
        section: 'About',
        field: 'title',
        oldValue: oldCopy.about.title,
        newValue: newCopy.about.title
      });
    }

    if (oldCopy.about.intro !== newCopy.about.intro) {
      differences.push({
        section: 'About',
        field: 'intro',
        oldValue: oldCopy.about.intro,
        newValue: newCopy.about.intro
      });
    }

    if (oldCopy.about.mission !== newCopy.about.mission) {
      differences.push({
        section: 'About',
        field: 'mission',
        oldValue: oldCopy.about.mission,
        newValue: newCopy.about.mission
      });
    }

    return differences;
  };

  const restoreVersion = (version: CopyVersion): GeneratedCopy => {
    return version.data;
  };

  useEffect(() => {
    fetchHistory();
  }, [sessionId, user]);

  return {
    history,
    versions,
    loading,
    refreshHistory: fetchHistory,
    deleteHistoryItem,
    getVersionDiff,
    restoreVersion,
    formatDate
  };
};
