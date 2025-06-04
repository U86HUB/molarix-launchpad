
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/website';
import { transformWebsiteData, validateWebsiteId } from '@/utils/websiteBuilderUtils';

export const useWebsiteData = () => {
  const { toast } = useToast();
  const [website, setWebsite] = useState<Website | null>(null);

  const fetchWebsite = async (websiteId: string) => {
    console.log('useWebsiteData - fetchWebsite called with ID:', websiteId);
    
    if (!validateWebsiteId(websiteId)) {
      throw new Error('Invalid website ID');
    }

    try {
      console.log('useWebsiteData - Executing query for website:', websiteId);
      
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .single();

      if (websiteError) {
        console.error('useWebsiteData - Database error:', websiteError);
        throw websiteError;
      }
      
      console.log('useWebsiteData - Website data received:', websiteData);
      
      const typedWebsite = transformWebsiteData(websiteData);
      setWebsite(typedWebsite);
      
      return typedWebsite;
    } catch (error: any) {
      console.error('Error fetching website data:', error);
      toast({
        title: "Error",
        description: "Failed to load website data",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    website,
    setWebsite,
    fetchWebsite,
  };
};
