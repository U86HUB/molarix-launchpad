
import { useState } from 'react';
import { Section } from '@/types/website';

interface UseSectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
}

export const useSectionEditor = ({ section, onUpdate, onDelete }: UseSectionEditorProps) => {
  const [settings, setSettings] = useState(section.settings);
  const [isEditing, setIsEditing] = useState(false);

  const handleSettingsChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate(section.id, { settings: newSettings });
  };

  const handleVisibilityToggle = () => {
    onUpdate(section.id, { is_visible: !section.is_visible });
  };

  const handleDelete = () => {
    onDelete(section.id);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return {
    settings,
    isEditing,
    handleSettingsChange,
    handleVisibilityToggle,
    handleDelete,
    toggleEditing,
  };
};
