
import React, { useEffect, useRef, useCallback } from 'react';
import { usePreviewInteractions } from '@/hooks/usePreviewInteractions';
import { Section } from '@/types/website';
import { Monitor, Smartphone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DraggableSection from './DraggableSection';

interface WebsitePreviewProps {
  sections: Section[];
  onSectionSelect: (sectionId: string) => void;
  onSectionReorder: (sections: Section[]) => void;
  onSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  selectedSectionId?: string;
  isEditMode?: boolean;
  className?: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  sections,
  onSectionSelect,
  onSectionReorder,
  onSectionUpdate,
  selectedSectionId,
  isEditMode = false,
  className
}) => {
  const {
    activeSection,
    setActiveSection,
    viewMode,
    copyMode,
    previewRef,
    setViewMode,
    setCopyMode,
    registerSection,
    scrollToSection,
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

  const handleReorder = useCallback((newSections: Section[]) => {
    onSectionReorder(newSections);
  }, [onSectionReorder]);

  const handleSectionUpdateInternal = useCallback((sectionId: string, updates: Partial<Section>) => {
    onSectionUpdate(sectionId, updates);
  }, [onSectionUpdate]);

  const handleSectionClickInternal = useCallback((sectionId: string) => {
    handleSectionClick(sectionId);
    onSectionSelect(sectionId);
  }, [handleSectionClick, onSectionSelect]);

  if (!sections || sections.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300",
        className
      )}>
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-500">Add sections from the library to start building your website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Viewport Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>

        <Button
          variant={copyMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCopyMode(!copyMode)}
        >
          {copyMode ? 'Exit Copy Mode' : 'Edit Copy'}
        </Button>
      </div>

      {/* Preview Content */}
      <div 
        ref={previewRef}
        className={cn(
          "flex-1 overflow-auto bg-gray-100 p-4",
          viewMode === 'mobile' && "max-w-sm mx-auto"
        )}
      >
        <div className={cn(
          "bg-white rounded-lg shadow-sm overflow-hidden",
          viewMode === 'mobile' ? "w-full" : "w-full max-w-6xl mx-auto"
        )}>
          {sections.map((section, index) => (
            <DraggableSection
              key={section.id}
              section={section}
              index={index}
              sections={sections}
              isSelected={activeSection === section.id}
              isEditMode={isEditMode}
              copyMode={copyMode}
              viewMode={viewMode}
              onSectionClick={handleSectionClickInternal}
              onSectionUpdate={handleSectionUpdateInternal}
              onSectionReorder={handleReorder}
              onRegisterSection={registerSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
