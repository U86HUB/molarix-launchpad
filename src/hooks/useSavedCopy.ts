
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedCopy } from '@/types/copy';

interface UseSavedCopyProps {
  sessionId: string | null;
  preferDraft?: boolean;
}

export const useSavedCopy = ({ sessionId, preferDraft = false }: UseSavedCopyProps) => {
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [noCopyFound, setNoCopyFound] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setCopy(null);
      setNoCopyFound(false);
      return;
    }

    const fetchCopy = async () => {
      setLoading(true);
      setNoCopyFound(false);
      
      try {
        // First try the preferred type (draft or published)
        const preferredType = preferDraft ? 'draft' : 'published';
        
        const { data: preferredCopy, error: preferredError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', preferredType)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (preferredError) {
          console.error(`Error fetching ${preferredType} copy:`, preferredError);
        }

        if (preferredCopy) {
          setCopy(preferredCopy.data as unknown as GeneratedCopy);
          return;
        }

        // If preferred type not found, try the other type
        const fallbackType = preferDraft ? 'published' : 'draft';
        
        const { data: fallbackCopy, error: fallbackError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', fallbackType)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fallbackError) {
          console.error(`Error fetching ${fallbackType} copy:`, fallbackError);
        }

        if (fallbackCopy) {
          setCopy(fallbackCopy.data as unknown as GeneratedCopy);
        } else {
          // No copy found at all
          setCopy(null);
          setNoCopyFound(true);
        }
      } catch (error) {
        console.error('Error fetching saved copy:', error);
        setCopy(null);
        setNoCopyFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCopy();
  }, [sessionId, preferDraft]);

  return { copy, loading, noCopyFound };
};
