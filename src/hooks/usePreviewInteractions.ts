
import { useState, useRef, useCallback, useEffect } from 'react';
import { Section } from '@/types/website';

export const usePreviewInteractions = (sections: Section[]) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copyMode, setCopyMode] = useState<'draft' | 'published'>('draft');
  const previewRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  // Register section elements for scroll tracking
  const registerSection = useCallback((sectionId: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current[sectionId] = element;
    } else {
      delete sectionRefs.current[sectionId];
    }
  }, []);

  // Scroll to specific section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && previewRef.current) {
      const container = previewRef.current;
      const elementTop = element.offsetTop;
      const containerTop = container.scrollTop;
      const targetScroll = elementTop - 80; // Offset for header

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  }, []);

  // Handle scroll to update active section
  const handleScroll = useCallback(() => {
    if (!previewRef.current) return;

    const container = previewRef.current;
    const scrollTop = container.scrollTop + 100; // Offset for header

    let currentActiveSection = null;
    let minDistance = Infinity;

    Object.entries(sectionRefs.current).forEach(([sectionId, element]) => {
      const distance = Math.abs(element.offsetTop - scrollTop);
      if (distance < minDistance) {
        minDistance = distance;
        currentActiveSection = sectionId;
      }
    });

    if (currentActiveSection !== activeSection) {
      setActiveSection(currentActiveSection);
    }
  }, [activeSection]);

  // Setup scroll listener
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    activeSection,
    viewMode,
    copyMode,
    previewRef,
    setViewMode,
    setCopyMode,
    registerSection,
    scrollToSection,
  };
};
