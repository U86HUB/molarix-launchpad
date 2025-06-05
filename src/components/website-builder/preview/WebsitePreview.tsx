
import { useEffect, useState } from 'react';
import { Website, Section } from '@/types/website';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import FloatingToolbar from './FloatingToolbar';
import DraggableSection from './DraggableSection';
import SectionWithCopy from './SectionWithCopy';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';

interface WebsitePreviewProps {
  website: Website;
  sections: Section[];
  onReorderSections?: (newSections: Section[]) => void;
}

const WebsitePreview = ({ website, sections, onReorderSections }: WebsitePreviewProps) => {
  const {
    activeSection,
    viewMode,
    copyMode,
    previewRef,
    setViewMode,
    setCopyMode,
    registerSection,
    scrollToSection,
  } = usePreviewInteractions(sections);

  useEffect(() => {
    // Apply dynamic CSS variables for the selected colors and fonts
    const root = document.documentElement;
    
    if (website.primary_color) {
      root.style.setProperty('--preview-primary', website.primary_color);
    }

    if (website.font_style && website.font_style !== 'default') {
      root.style.setProperty('--preview-font', website.font_style);
    } else {
      root.style.setProperty('--preview-font', 'Inter, system-ui, sans-serif');
    }

    return () => {
      root.style.removeProperty('--preview-primary');
      root.style.removeProperty('--preview-font');
    };
  }, [website.primary_color, website.font_style]);

  const handleSectionReorder = (draggedId: string, targetId: string, position: 'before' | 'after') => {
    if (!onReorderSections) return;

    const draggedSection = sections.find(s => s.id === draggedId);
    const targetSection = sections.find(s => s.id === targetId);
    
    if (!draggedSection || !targetSection) return;

    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedId);
    const targetIndex = newSections.findIndex(s => s.id === targetId);

    // Remove dragged section
    newSections.splice(draggedIndex, 1);

    // Calculate new position
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    const adjustedIndex = draggedIndex < targetIndex ? insertIndex - 1 : insertIndex;

    // Insert at new position
    newSections.splice(adjustedIndex, 0, draggedSection);

    // Update positions
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      position: index,
    }));

    onReorderSections(updatedSections);
  };

  const renderSection = (section: Section) => {
    const isActive = activeSection === section.id;

    return (
      <DraggableSection
        key={section.id}
        section={section}
        isActive={isActive}
        isVisible={section.is_visible}
        onRegister={registerSection}
        onReorder={handleSectionReorder}
      >
        <SectionWithCopy
          section={section}
          copyMode={copyMode}
          isActive={isActive}
        />
      </DraggableSection>
    );
  };

  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Sections Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add sections from the left panel to see your website preview
          </p>
        </div>
      </div>
    );
  }

  const visibleSections = sections
    .filter(section => section.is_visible)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col relative">
      {/* Floating Toolbar */}
      <FloatingToolbar
        sections={sections}
        activeSection={activeSection}
        viewMode={viewMode}
        copyMode={copyMode}
        onViewModeChange={setViewMode}
        onCopyModeChange={setCopyMode}
        onScrollToSection={scrollToSection}
      />

      {/* Preview Content */}
      <div 
        ref={previewRef}
        className={cn(
          "flex-1 overflow-auto bg-white dark:bg-gray-900 transition-all duration-300",
          viewMode === 'mobile' && "max-w-sm mx-auto border-x border-gray-300"
        )}
        style={{ fontFamily: 'var(--preview-font)' }}
      >
        <div className="min-h-full">
          {visibleSections.map(renderSection)}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
