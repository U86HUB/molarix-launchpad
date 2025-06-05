
import { useEffect, useState } from 'react';
import { Website, Section } from '@/types/website';
import { Eye, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import FloatingToolbar from './FloatingToolbar';
import DraggableSection from './DraggableSection';
import SectionWithCopy from './SectionWithCopy';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';

interface WebsitePreviewProps {
  website: Website;
  sections: Section[];
  onReorderSections?: (newSections: Section[]) => void;
  onAddSection?: (type: Section['type']) => void;
}

const WebsitePreview = ({ 
  website, 
  sections, 
  onReorderSections, 
  onAddSection 
}: WebsitePreviewProps) => {
  console.log('WebsitePreview rendering:', {
    websiteId: website.id,
    sectionsCount: sections.length,
    sections: sections.map(s => ({ id: s.id, type: s.type, copyId: s.copy_id }))
  });

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
    console.log('WebsitePreview: Setting up CSS variables for website:', website.id);
    
    // Apply dynamic CSS variables for the selected colors and fonts
    const root = document.documentElement;
    
    if (website.primary_color) {
      root.style.setProperty('--preview-primary', website.primary_color);
      console.log('Set primary color:', website.primary_color);
    } else {
      // Set default primary color if none specified
      root.style.setProperty('--preview-primary', '#4f46e5');
    }

    if (website.font_style && website.font_style !== 'default') {
      root.style.setProperty('--preview-font', website.font_style);
      console.log('Set font style:', website.font_style);
    } else {
      root.style.setProperty('--preview-font', 'Inter, system-ui, sans-serif');
    }

    return () => {
      root.style.removeProperty('--preview-primary');
      root.style.removeProperty('--preview-font');
    };
  }, [website.primary_color, website.font_style, website.id]);

  const handleSectionReorder = (draggedId: string, targetId: string, position: 'before' | 'after') => {
    if (!onReorderSections) return;

    console.log('Reordering sections:', { draggedId, targetId, position });

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

    console.log('Rendering section:', {
      sectionId: section.id,
      sectionType: section.type,
      isActive,
      copyMode,
      isVisible: section.is_visible
    });

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

  const visibleSections = sections
    .filter(section => section.is_visible)
    .sort((a, b) => a.position - b.position);

  console.log('Visible sections to render:', visibleSections.map(s => ({ 
    id: s.id, 
    type: s.type, 
    position: s.position,
    copyId: s.copy_id 
  })));

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
          {visibleSections.length === 0 ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="text-center max-w-md mx-auto px-4">
                <Eye className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Sections Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Your website is ready to be built! Add sections from the left panel to see your website come to life.
                </p>
                {onAddSection && (
                  <Button 
                    onClick={() => onAddSection('hero')}
                    size="lg"
                    className="gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Section
                  </Button>
                )}
              </div>
            </div>
          ) : (
            visibleSections.map(renderSection)
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
