
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
      if (!section.website_id) {
        console.warn('No website_id for section:', section.id);
        return;
      }

      console.log('Fetching copy for section:', {
        sectionId: section.id,
        websiteId: section.website_id,
        copyId: section.copy_id,
        copyMode
      });

      setLoading(true);
      setError(null);

      try {
        let copyData = null;

        // First try to use the linked copy_id if it exists
        if (section.copy_id) {
          console.log('Fetching linked copy by copy_id:', section.copy_id);
          
          const { data: linkedCopy, error: linkedError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('id', section.copy_id)
            .eq('type', copyMode)
            .maybeSingle();

          console.log('Linked copy query result:', { linkedCopy, linkedError });

          if (linkedError) {
            console.error('Error fetching linked copy:', linkedError);
          } else if (linkedCopy) {
            copyData = linkedCopy;
            console.log('Found linked copy:', copyData);
          }
        }

        // If no linked copy found, query by session_id and type
        if (!copyData) {
          console.log('No linked copy found, querying by session_id:', section.website_id);
          
          const { data: matchedCopy, error: matchedError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('session_id', section.website_id)
            .eq('type', copyMode)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log('Session copy query result:', { matchedCopy, matchedError });

          if (matchedError) {
            console.error('Error fetching matched copy:', matchedError);
          } else if (matchedCopy) {
            copyData = matchedCopy;
            console.log('Found session copy:', copyData);

            // Auto-link the copy_id if we found a match
            if (!section.copy_id) {
              console.log('Auto-linking copy to section:', {
                sectionId: section.id,
                copyId: matchedCopy.id
              });
              
              const { error: updateError } = await supabase
                .from('sections')
                .update({ copy_id: matchedCopy.id })
                .eq('id', section.id);

              if (updateError) {
                console.error('Error auto-linking copy:', updateError);
              } else {
                console.log('Successfully auto-linked copy to section');
              }
            }
          }
        }

        if (copyData) {
          console.log('Setting copy data:', copyData.data);
          setCopy(copyData.data as unknown as GeneratedCopy);
        } else {
          console.log('No copy found for section:', section.id);
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
