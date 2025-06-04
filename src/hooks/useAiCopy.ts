
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
        
        // Determine the type to fetch based on useDraft parameter
        const copyType = useDraft ? 'draft' : 'published';
        
        const { data, error } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', copyType)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching AI copy:', error);
          toast({
            title: "Error",
            description: "Failed to load copy data",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setCopy(data.data as unknown as GeneratedCopy);
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
