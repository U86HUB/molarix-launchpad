
import { useState, useEffect, useCallback } from 'react';
import { Section } from '@/types/website';

export const usePreviewInteractions = (sections: Section[]) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-select first section when sections load
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);

    // Find the section element and scroll to it
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  const handleSectionClick = useCallback((sectionId: string) => {
    if (!isScrolling) {
      setActiveSection(sectionId);
    }
  }, [isScrolling]);

  const getNextSection = useCallback(() => {
    if (!activeSection || sections.length === 0) return null;
    
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1].id;
    }
    return null;
  }, [activeSection, sections]);

  const getPreviousSection = useCallback(() => {
    if (!activeSection || sections.length === 0) return null;
    
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      return sections[currentIndex - 1].id;
    }
    return null;
  }, [activeSection, sections]);

  const navigateToNext = useCallback(() => {
    const nextId = getNextSection();
    if (nextId) {
      scrollToSection(nextId);
    }
  }, [getNextSection, scrollToSection]);

  const navigateToPrevious = useCallback(() => {
    const prevId = getPreviousSection();
    if (prevId) {
      scrollToSection(prevId);
    }
  }, [getPreviousSection, scrollToSection]);

  return {
    activeSection,
    setActiveSection,
    isScrolling,
    scrollToSection,
    handleSectionClick,
    navigateToNext,
    navigateToPrevious,
    getNextSection,
    getPreviousSection
  };
};
