
import { useState, useEffect } from 'react';
import { useEnhancedWebsiteData } from '@/hooks/useEnhancedWebsiteData';
import { useSectionOperations } from '@/hooks/useSectionOperations';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';
import { Section } from '@/types/website';

export const useWebsiteBuilderState = (websiteId: string) => {
  const {
    website,
    sections: loadedSections,
    publishedCopy,
    draftCopy,
    loading,
    error
  } = useEnhancedWebsiteData(websiteId);

  const {
    sections,
    saving,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    setSections
  } = useSectionOperations();

  const [copyMode, setCopyMode] = useState<'draft' | 'published'>('draft');
  const { activeSection } = usePreviewInteractions(sections);

  // Sync loaded sections with section operations
  useEffect(() => {
    if (loadedSections && loadedSections.length > 0) {
      setSections(loadedSections);
    }
  }, [loadedSections, setSections]);

  // Auto-create hero section if none exist and website is loaded
  useEffect(() => {
    const createInitialSection = async () => {
      if (!loading && website && sections.length === 0 && !saving) {
        console.log('No sections found, creating default hero section');
        try {
          await addSection(websiteId, 'hero');
        } catch (error) {
          console.error('Failed to create initial section:', error);
        }
      }
    };

    createInitialSection();
  }, [loading, website, sections.length, addSection, websiteId, saving]);

  const handleAddSection = (type: Section['type']) => {
    addSection(websiteId, type);
  };

  const handleSectionSelect = (sectionId: string) => {
    console.log('Section selected:', sectionId);
  };

  // Choose the appropriate copy based on mode
  const currentCopy = copyMode === 'published' ? publishedCopy : draftCopy;

  return {
    website,
    sections,
    loading,
    error,
    saving,
    copyMode,
    setCopyMode,
    activeSection,
    currentCopy,
    handleAddSection,
    handleSectionSelect,
    updateSection,
    deleteSection,
    reorderSections
  };
};
