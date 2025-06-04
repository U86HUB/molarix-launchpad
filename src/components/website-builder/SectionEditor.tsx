
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/types/website';
import { useSectionEditor } from '@/hooks/useSectionEditor';
import SectionHeader from './SectionHeader';
import SectionSettingsForm from './SectionSettingsForm';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
  isUpdating: boolean;
  isActive?: boolean;
  onScrollTo?: () => void;
}

const SectionEditor = ({ 
  section, 
  onUpdate, 
  onDelete, 
  isUpdating, 
  isActive = false,
  onScrollTo 
}: SectionEditorProps) => {
  const {
    settings,
    isEditing,
    handleSettingsChange,
    handleVisibilityToggle,
    handleDelete,
    toggleEditing,
  } = useSectionEditor({ section, onUpdate, onDelete });

  return (
    <Card 
      className={`transition-all duration-200 ${
        !section.is_visible ? 'opacity-60 bg-gray-50' : ''
      } ${
        isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={onScrollTo}
    >
      <SectionHeader
        section={section}
        isUpdating={isUpdating}
        isActive={isActive}
        onVisibilityToggle={handleVisibilityToggle}
        onToggleEditing={toggleEditing}
        onDelete={handleDelete}
      />

      {isEditing && (
        <CardContent className="animate-fade-in">
          <SectionSettingsForm
            section={section}
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default SectionEditor;
