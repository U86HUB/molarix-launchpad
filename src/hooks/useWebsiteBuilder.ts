
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website, Section } from '@/types/website';

type SectionType = "hero" | "about" | "services" | "testimonials" | "contact" | "features" | "gallery" | "team";
type WebsiteStatus = "draft" | "published" | "archived";

function isValidSectionType(type: string): type is SectionType {
  return ["hero", "about", "services", "testimonials", "contact", "features", "gallery", "team"].includes(type);
}

function isValidWebsiteStatus(status: string): status is WebsiteStatus {
  return ["draft", "published", "archived"].includes(status);
}

export const useWebsiteBuilder = (websiteId?: string) => {
  const { toast } = useToast();
  const [website, setWebsite] = useState<Website | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch website and sections
  const fetchWebsiteData = async () => {
    if (!websiteId) return;

    try {
      setLoading(true);

      // Fetch website
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .single();

      if (websiteError) throw websiteError;
      
      // Cast the website data to proper types
      const typedWebsite: Website = {
        ...websiteData,
        status: isValidWebsiteStatus(websiteData.status) ? websiteData.status : 'draft'
      };
      setWebsite(typedWebsite);

      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('website_id', websiteId)
        .eq('is_visible', true)
        .order('position');

      if (sectionsError) throw sectionsError;
      
      // Cast the sections data to proper types
      const typedSections: Section[] = (sectionsData || []).map(section => ({
        ...section,
        type: isValidSectionType(section.type) ? section.type : 'hero'
      }));
      setSections(typedSections);

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

  // Add new section
  const addSection = async (type: Section['type']) => {
    if (!websiteId) return;

    try {
      setSaving(true);
      
      const newPosition = sections.length;
      const { data, error } = await supabase
        .from('sections')
        .insert({
          website_id: websiteId,
          type,
          position: newPosition,
          settings: {},
          is_visible: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to proper Section type
      const typedSection: Section = {
        ...data,
        type: isValidSectionType(data.type) ? data.type : 'hero'
      };

      setSections(prev => [...prev, typedSection]);
      toast({
        title: "Section Added",
        description: `${type} section has been added to your website.`,
      });

    } catch (error: any) {
      console.error('Error adding section:', error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Update section
  const updateSection = async (sectionId: string, updates: Partial<Section>) => {
    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to proper Section type
      const typedSection: Section = {
        ...data,
        type: isValidSectionType(data.type) ? data.type : 'hero'
      };

      setSections(prev => 
        prev.map(section => 
          section.id === sectionId ? { ...section, ...typedSection } : section
        )
      );

    } catch (error: any) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete section
  const deleteSection = async (sectionId: string) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.filter(section => section.id !== sectionId));
      
      toast({
        title: "Section Removed",
        description: "Section has been removed from your website.",
      });

    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to remove section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Reorder sections
  const reorderSections = async (newSections: Section[]) => {
    try {
      setSaving(true);

      // Update positions for all sections
      const updates = newSections.map((section, index) => ({
        id: section.id,
        position: index,
      }));

      for (const update of updates) {
        await supabase
          .from('sections')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      setSections(newSections);

    } catch (error: any) {
      console.error('Error reordering sections:', error);
      toast({
        title: "Error",
        description: "Failed to reorder sections",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
