
import React, { useEffect, useRef, useCallback } from 'react';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';
import { Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';
import { cn } from '@/lib/utils';
import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';

interface WebsitePreviewProps {
  sections: Section[];
  onSectionSelect: (sectionId: string) => void;
  onSectionReorder: (sections: Section[]) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  selectedSectionId?: string;
  isEditMode?: boolean;
  className?: string;
  fallbackCopy?: GeneratedCopy | null;
  copyMode?: 'draft' | 'published';
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  sections,
  onSectionSelect,
  onSectionReorder,
  onSectionUpdate,
  selectedSectionId,
  isEditMode = false,
  className,
  fallbackCopy,
  copyMode = 'draft'
}) => {
  const {
    activeSection,
    setActiveSection,
    viewMode,
    previewRef,
    setViewMode,
    registerSection,
    handleSectionClick
  } = usePreviewInteractions(sections);

  // Sync with external selection
  useEffect(() => {
    if (selectedSectionId && selectedSectionId !== activeSection) {
      setActiveSection(selectedSectionId);
    }
  }, [selectedSectionId, activeSection, setActiveSection]);

  // Notify parent of section selection
  useEffect(() => {
    if (activeSection && activeSection !== selectedSectionId) {
      onSectionSelect(activeSection);
    }
  }, [activeSection, selectedSectionId, onSectionSelect]);

  const handleReorder = useCallback((draggedId: string, targetId: string, position: 'before' | 'after') => {
    const draggedIndex = sections.findIndex(s => s.id === draggedId);
    const targetIndex = sections.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    newSections.splice(insertIndex, 0, draggedSection);
    
    onSectionReorder(newSections);
  }, [sections, onSectionReorder]);

  const handleSectionClickInternal = useCallback((sectionId: string) => {
    handleSectionClick(sectionId);
    onSectionSelect(sectionId);
  }, [handleSectionClick, onSectionSelect]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Viewport Controls */}
      <PreviewHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        copyMode={copyMode}
        hasFallbackCopy={!!fallbackCopy}
      />

      {/* Preview Content */}
      <div 
        ref={previewRef}
        className={cn(
          "flex-1 overflow-auto bg-gray-100 p-4",
          viewMode === 'mobile' && "max-w-sm mx-auto"
        )}
      >
        <PreviewContent
          sections={sections}
          isEditMode={isEditMode}
          viewMode={viewMode}
          activeSection={activeSection}
          copyMode={copyMode}
          fallbackCopy={fallbackCopy}
          onSectionSelect={handleSectionClickInternal}
          onReorder={isEditMode ? handleReorder : undefined}
          onRegisterSection={isEditMode ? registerSection : undefined}
        />
      </div>
    </div>
  );
};

export default WebsitePreview;
