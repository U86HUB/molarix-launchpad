
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
}

const SectionEditor = ({ section, onUpdate, onDelete, isUpdating }: SectionEditorProps) => {
  const {
    settings,
    isEditing,
    handleSettingsChange,
    handleVisibilityToggle,
    handleDelete,
    toggleEditing,
  } = useSectionEditor({ section, onUpdate, onDelete });

  return (
    <Card className={`${!section.is_visible ? 'opacity-60' : ''}`}>
      <SectionHeader
        section={section}
        isUpdating={isUpdating}
        onVisibilityToggle={handleVisibilityToggle}
        onToggleEditing={toggleEditing}
        onDelete={handleDelete}
      />

      {isEditing && (
        <CardContent>
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
