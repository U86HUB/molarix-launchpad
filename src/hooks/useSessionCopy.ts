
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedCopy } from '@/types/copy';

export const useSessionCopy = (sessionId: string) => {
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setCopy(null);
      return;
    }

    const fetchCopy = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', 'published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching copy:', error);
          setCopy(null);
          return;
        }

        if (data) {
          setCopy(data.data as unknown as GeneratedCopy);
        } else {
          setCopy(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setCopy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCopy();
  }, [sessionId]);

  return { copy, loading };
};
