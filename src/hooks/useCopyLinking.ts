
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';

interface CopyLinkingResult {
  copy: GeneratedCopy | null;
  loading: boolean;
  error: string | null;
}

export const useCopyLinking = (
  section: Section,
  copyMode: 'draft' | 'published' = 'draft'
): CopyLinkingResult => {
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCopy = async () => {
      if (!section.website_id) return;

      setLoading(true);
      setError(null);

      try {
        let copyData = null;

        // First try to use the linked copy_id if it exists
        if (section.copy_id) {
          const { data: linkedCopy, error: linkedError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('id', section.copy_id)
            .eq('type', copyMode)
            .maybeSingle();

          if (linkedError) {
            console.error('Error fetching linked copy:', linkedError);
          } else if (linkedCopy) {
            copyData = linkedCopy;
          }
        }

        // If no linked copy found, query by session_id and type
        if (!copyData) {
          const { data: matchedCopy, error: matchedError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('session_id', section.website_id)
            .eq('type', copyMode)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (matchedError) {
            console.error('Error fetching matched copy:', matchedError);
          } else if (matchedCopy) {
            copyData = matchedCopy;

            // Auto-link the copy_id if we found a match
            if (!section.copy_id) {
              await supabase
                .from('sections')
                .update({ copy_id: matchedCopy.id })
                .eq('id', section.id);
            }
          }
        }

        if (copyData) {
          setCopy(copyData.data as unknown as GeneratedCopy);
        } else {
          setCopy(null);
        }
      } catch (err: any) {
        console.error('Error in copy linking:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCopy();
  }, [section.id, section.website_id, section.copy_id, copyMode]);

  return { copy, loading, error };
};
