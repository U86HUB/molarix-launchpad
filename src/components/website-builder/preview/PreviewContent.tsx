
import React from 'react';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { Section } from '@/types/website';
import DraggableSection from './DraggableSection';
import UnifiedSectionRenderer from './UnifiedSectionRenderer';

interface PreviewContentProps {
  sections: Section[];
  isEditMode: boolean;
  viewMode: 'desktop' | 'mobile';
  activeSection: string | null;
  copyMode: 'draft' | 'published';
  fallbackCopy: any;
  onSectionSelect: (sectionId: string) => void;
  onReorder?: (draggedId: string, targetId: string, position: 'before' | 'after') => void;
  onRegisterSection?: (sectionId: string, element: HTMLElement | null) => void;
}

const PreviewContent = ({ 
  sections,
  isEditMode,
  viewMode,
  activeSection,
  copyMode,
  fallbackCopy,
  onSectionSelect,
  onReorder,
  onRegisterSection
}: PreviewContentProps) => {
  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-500">Add sections from the library to start building your website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm overflow-hidden",
      viewMode === 'mobile' ? "w-full" : "w-full max-w-6xl mx-auto"
    )}>
      {sections
        .sort((a, b) => a.position - b.position)
        .map((section) => (
          isEditMode && onRegisterSection && onReorder ? (
            <DraggableSection
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              isVisible={true}
              onRegister={onRegisterSection}
              onReorder={onReorder}
            >
              <UnifiedSectionRenderer
                section={section}
                copyMode={copyMode}
                fallbackCopy={fallbackCopy}
                isActive={activeSection === section.id}
                onSectionClick={handleSectionClick}
              />
            </DraggableSection>
          ) : (
            <UnifiedSectionRenderer
              key={section.id}
              section={section}
              copyMode={copyMode}
              fallbackCopy={fallbackCopy}
              isActive={activeSection === section.id}
              onSectionClick={handleSectionClick}
            />
          )
        ))}
    </div>
  );
};

export default PreviewContent;
