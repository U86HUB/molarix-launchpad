
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
          {sections.map((section) => (
            <DraggableSection
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              isVisible={true}
              onRegister={registerSection}
              onReorder={handleReorder}
            >
              <div 
                className="p-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleSectionClickInternal(section.id)}
              >
                <h3 className="font-medium text-gray-900">{section.type}</h3>
                <p className="text-sm text-gray-500">Click to edit this section</p>
              </div>
            </DraggableSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
