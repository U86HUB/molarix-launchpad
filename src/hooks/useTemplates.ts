
import { useState, useEffect } from 'react';
import { Template, SectionTemplate } from '@/types/website';
import { TemplateService } from '@/services/templateService';
import { useToast } from '@/hooks/use-toast';

export const useTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sectionTemplates, setSectionTemplates] = useState<SectionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const fetchedTemplates = await TemplateService.fetchAllTemplates();
      setTemplates(fetchedTemplates);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectionTemplates = async () => {
    try {
      setIsLoading(true);
      const fetchedSections = await TemplateService.fetchTemplateSections();
      
      // If no sections found in the database, use the local data
      if (fetchedSections.length === 0) {
        // We'll use the existing local data from sectionTemplates.ts
        const { sectionTemplates } = await import('@/data/sectionTemplates');
        setSectionTemplates(sectionTemplates);
      } else {
        setSectionTemplates(fetchedSections);
      }
    } catch (err: any) {
      setError(err);
      // Fallback to local data on error
      const { sectionTemplates } = await import('@/data/sectionTemplates');
      setSectionTemplates(sectionTemplates);
      
      toast({
        title: "Warning",
        description: "Using local template data",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load all template data on component mount
    fetchTemplates();
    fetchSectionTemplates();
  }, []);

  return {
    templates,
    sectionTemplates,
    isLoading,
    error,
    refresh: () => {
      fetchTemplates();
      fetchSectionTemplates();
    }
  };
};
