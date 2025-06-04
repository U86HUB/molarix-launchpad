
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy } from '@/types/copy';

export interface CopyVersion {
  id: string;
  data: GeneratedCopy;
  created_at: string;
  type: string;
  versionLabel: string;
}

interface UseCopyHistoryProps {
  sessionId: string | null;
}

export const useCopyHistory = ({ sessionId }: UseCopyHistoryProps) => {
  const [versions, setVersions] = useState<CopyVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchCopyHistory = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching copy history:', error);
          toast({
            title: "Error",
            description: "Failed to load copy history",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const processedVersions: CopyVersion[] = data.map((item, index) => {
            const createdAt = new Date(item.created_at);
            let versionLabel = '';
            
            if (index === 0) {
              versionLabel = item.type === 'draft' ? 'Current Draft' : 'Current Version';
            } else if (item.type === 'complete_copy') {
              versionLabel = `Published Version ${data.length - index}`;
            } else if (item.type === 'draft') {
              versionLabel = `Draft ${data.length - index}`;
            } else {
              versionLabel = `Version ${data.length - index}`;
            }

            return {
              id: item.id,
              data: item.data as unknown as GeneratedCopy,
              created_at: item.created_at,
              type: item.type,
              versionLabel
            };
          });

          setVersions(processedVersions);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load copy history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCopyHistory();
  }, [sessionId, toast]);

  const getVersionDiff = (oldVersion: GeneratedCopy, currentVersion: GeneratedCopy) => {
    const differences: Array<{
      section: string;
      field: string;
      oldValue: string;
      newValue: string;
    }> = [];

    // Compare homepage section
    Object.entries(oldVersion.homepage).forEach(([key, oldValue]) => {
      const newValue = currentVersion.homepage[key as keyof typeof currentVersion.homepage];
      if (oldValue !== newValue) {
        differences.push({
          section: 'Homepage',
          field: key,
          oldValue: oldValue as string,
          newValue: newValue as string
        });
      }
    });

    // Compare services section
    if (oldVersion.services.title !== currentVersion.services.title) {
      differences.push({
        section: 'Services',
        field: 'title',
        oldValue: oldVersion.services.title,
        newValue: currentVersion.services.title
      });
    }

    if (oldVersion.services.intro !== currentVersion.services.intro) {
      differences.push({
        section: 'Services',
        field: 'intro',
        oldValue: oldVersion.services.intro,
        newValue: currentVersion.services.intro
      });
    }

    // Compare about section
    Object.entries(oldVersion.about).forEach(([key, oldValue]) => {
      if (key !== 'values') {
        const newValue = currentVersion.about[key as keyof typeof currentVersion.about];
        if (oldValue !== newValue) {
          differences.push({
            section: 'About',
            field: key,
            oldValue: oldValue as string,
            newValue: newValue as string
          });
        }
      }
    });

    return differences;
  };

  const restoreVersion = (version: CopyVersion): GeneratedCopy => {
    console.log('Restoring version:', version.versionLabel);
    return version.data;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    versions,
    loading,
    getVersionDiff,
    restoreVersion,
    formatDate
  };
};
