
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWebsiteData } from './useWebsiteData';
import { useSectionOperations } from './useSectionOperations';

export const useWebsiteBuilder = (websiteId?: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const { website, fetchWebsite } = useWebsiteData();
  const { 
    sections, 
    saving, 
    fetchSections, 
    addSection: addSectionOperation,
    updateSection,
    deleteSection,
    reorderSections 
  } = useSectionOperations();

  // Fetch website and sections
  const fetchWebsiteData = async () => {
    if (!websiteId) return;

    try {
      setLoading(true);
      await fetchWebsite(websiteId);
      await fetchSections(websiteId);
    } catch (error: any) {
      console.error('Error fetching website data:', error);
      toast({
        title: "Error",
        description: "Failed to load website data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Wrapper for addSection to include websiteId
  const addSection = async (type: any) => {
    if (!websiteId) return;
    return addSectionOperation(websiteId, type);
  };

  useEffect(() => {
    fetchWebsiteData();
  }, [websiteId]);

  return {
    website,
    sections,
    loading,
    saving,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    refreshWebsite: fetchWebsiteData,
  };
};
