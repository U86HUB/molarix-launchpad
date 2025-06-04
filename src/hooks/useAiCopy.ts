
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy } from '@/types/copy';

interface UseAiCopyProps {
  sessionId: string | null;
  useDraft: boolean;
}

export const useAiCopy = ({ sessionId, useDraft }: UseAiCopyProps) => {
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchCopy = async () => {
      try {
        setLoading(true);
        
        // First try the preferred type (draft if useDraft is true, otherwise published)
        const preferredType = useDraft ? 'draft' : 'published';
        
        const { data: preferredData, error: preferredError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', preferredType)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (preferredError) {
          console.error(`Error fetching ${preferredType} AI copy:`, preferredError);
        }

        if (preferredData) {
          setCopy(preferredData.data as unknown as GeneratedCopy);
          return;
        }

        // If useDraft is true and no draft found, try published as fallback
        if (useDraft) {
          const { data: publishedData, error: publishedError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('session_id', sessionId)
            .eq('type', 'published')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (publishedError) {
            console.error('Error fetching published AI copy:', publishedError);
          }

          if (publishedData) {
            setCopy(publishedData.data as unknown as GeneratedCopy);
          } else {
            setCopy(null);
          }
        } else {
          setCopy(null);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load copy data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCopy();
  }, [sessionId, useDraft, toast]);

  return { copy, loading };
};
