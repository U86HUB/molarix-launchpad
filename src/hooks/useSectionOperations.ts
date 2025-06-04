
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/website';
import { transformSectionData } from '@/utils/websiteBuilderUtils';

export const useSectionOperations = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchSections = async (websiteId: string) => {
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('website_id', websiteId)
        .eq('is_visible', true)
        .order('position');

      if (sectionsError) throw sectionsError;
      
      const typedSections: Section[] = (sectionsData || []).map(transformSectionData);
      setSections(typedSections);
      
      return typedSections;
    } catch (error: any) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  };

  const addSection = async (websiteId: string, type: Section['type']) => {
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

      const typedSection = transformSectionData(data);
      setSections(prev => [...prev, typedSection]);
      
      toast({
        title: "Section Added",
        description: `${type} section has been added to your website.`,
      });

      return typedSection;
    } catch (error: any) {
      console.error('Error adding section:', error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

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

      const typedSection = transformSectionData(data);
      setSections(prev => 
        prev.map(section => 
          section.id === sectionId ? { ...section, ...typedSection } : section
        )
      );

      return typedSection;
    } catch (error: any) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

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
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const reorderSections = async (newSections: Section[]) => {
    try {
      setSaving(true);

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
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    sections,
    setSections,
    saving,
    fetchSections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
  };
};
