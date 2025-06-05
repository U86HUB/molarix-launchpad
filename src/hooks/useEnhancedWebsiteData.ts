
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website, Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';

interface EnhancedWebsiteData {
  website: Website | null;
  sections: Section[];
  publishedCopy: GeneratedCopy | null;
  draftCopy: GeneratedCopy | null;
  loading: boolean;
  error: string | null;
}

export const useEnhancedWebsiteData = (websiteId?: string): EnhancedWebsiteData => {
  const { toast } = useToast();
  const [data, setData] = useState<EnhancedWebsiteData>({
    website: null,
    sections: [],
    publishedCopy: null,
    draftCopy: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!websiteId) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchAllData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        console.log('Enhanced data loading for website:', websiteId);

        // Fetch website data
        const { data: websiteData, error: websiteError } = await supabase
          .from('websites')
          .select('*')
          .eq('id', websiteId)
          .single();

        if (websiteError) {
          throw new Error(`Website error: ${websiteError.message}`);
        }

        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('website_id', websiteId)
          .eq('is_visible', true)
          .order('position');

        if (sectionsError) {
          console.error('Sections error:', sectionsError);
          // Don't throw, sections might not exist yet
        }

        // Fetch AI copy (both published and draft)
        const { data: copyData, error: copyError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', websiteId)
          .order('created_at', { ascending: false });

        if (copyError) {
          console.error('Copy error:', copyError);
          // Don't throw, copy might not exist yet
        }

        // Process copy data
        const publishedCopy = copyData?.find(c => c.type === 'published')?.data as GeneratedCopy || null;
        const draftCopy = copyData?.find(c => c.type === 'draft')?.data as GeneratedCopy || null;

        console.log('Enhanced data loaded:', {
          website: !!websiteData,
          sectionsCount: sectionsData?.length || 0,
          hasPublishedCopy: !!publishedCopy,
          hasDraftCopy: !!draftCopy
        });

        setData({
          website: websiteData as Website,
          sections: (sectionsData || []) as Section[],
          publishedCopy,
          draftCopy,
          loading: false,
          error: null
        });

      } catch (error: any) {
        console.error('Enhanced data loading error:', error);
        const errorMessage = error.message || 'Failed to load website data';
        
        setData(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    fetchAllData();
  }, [websiteId, toast]);

  return data;
};
