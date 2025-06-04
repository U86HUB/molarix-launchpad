
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSaveCopy } from "@/hooks/useSaveCopy";
import { useAutosave } from "@/hooks/useAutosave";
import { GeneratedCopy } from "@/types/copy";
import EditControls from "./EditControls";
import EditableHomepageSection from "./EditableHomepageSection";
import EditableServicesSection from "./EditableServicesSection";
import EditableAboutSection from "./EditableAboutSection";
import CopyHistoryModal from "./CopyHistoryModal";

interface EditableCopyContainerProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  hasUnsavedChanges?: boolean;
  isStreaming?: boolean;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
  onGenerateNewVersion?: () => void;
  onMarkSaved?: () => void;
}

const EditableCopyContainer = ({ 
  generatedCopy, 
  sessionId, 
  hasUnsavedChanges = false,
  isStreaming = false,
  onCopyUpdated,
  onGenerateNewVersion,
  onMarkSaved
}: EditableCopyContainerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy>(generatedCopy);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { toast } = useToast();
  const { saveCopy, loading } = useSaveCopy();
  
  // Auto-save hook for drafts
  const { isSaving, lastSaved, saveNow } = useAutosave({
    sessionId,
    draftData: editedCopy,
    enabled: isEditing, // Only auto-save when editing
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCopy(generatedCopy);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCopy(generatedCopy);
  };

  const handleSave = async () => {
    // Save as published copy (type: 'complete_copy')
    const result = await saveCopy(sessionId, editedCopy);
    
    if (result.success) {
      setIsEditing(false);
      onCopyUpdated(editedCopy);
      onMarkSaved?.();
      toast({
        title: "Success",
        description: "Your copy has been published successfully!",
      });
    }
  };

  const handleFieldBlur = () => {
    if (isEditing) {
      saveNow(); // Save immediately on blur
    }
  };

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  const handleRestoreVersion = (restoredCopy: GeneratedCopy) => {
    setEditedCopy(restoredCopy);
    setIsEditing(true); // Put into edit mode but don't auto-save
    toast({
      title: "Version Restored",
      description: "The selected version has been restored. Click 'Publish Changes' to save it.",
    });
  };

  const updateHomepage = (field: keyof GeneratedCopy['homepage'], value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        [field]: value
      }
    }));
  };

  const updateServicesTitle = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        title: value
      }
    }));
  };

  const updateServicesIntro = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        intro: value
      }
    }));
  };

  const updateService = (index: number, field: 'name' | 'description', value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      services: {
        ...prev.services,
        services: prev.services.services.map((service, i) => 
          i === index ? { ...service, [field]: value } : service
        )
      }
    }));
  };

  const updateAboutTitle = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        title: value
      }
    }));
  };

  const updateAboutIntro = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        intro: value
      }
    }));
  };

  const updateAboutMission = (value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        mission: value
      }
    }));
  };

  const updateValue = (index: number, field: 'name' | 'description', value: string) => {
    setEditedCopy(prev => ({
      ...prev,
      about: {
        ...prev.about,
        values: prev.about.values.map((val, i) => 
          i === index ? { ...val, [field]: value } : val
        )
      }
    }));
  };

  const displayCopy = isEditing ? editedCopy : generatedCopy;

  return (
    <div className="space-y-8">
      <EditControls
        isEditing={isEditing}
        loading={loading}
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        isStreaming={isStreaming}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onViewHistory={handleViewHistory}
        onGenerateNewVersion={onGenerateNewVersion}
      />

      <EditableHomepageSection
        homepage={displayCopy.homepage}
        onUpdate={updateHomepage}
        onBlur={handleFieldBlur}
        isEditing={isEditing}
      />

      <EditableServicesSection
        services={displayCopy.services}
        onUpdateTitle={updateServicesTitle}
        onUpdateIntro={updateServicesIntro}
        onUpdateService={updateService}
        onBlur={handleFieldBlur}
        isEditing={isEditing}
      />

      <EditableAboutSection
        about={displayCopy.about}
        onUpdateTitle={updateAboutTitle}
        onUpdateIntro={updateAboutIntro}
        onUpdateMission={updateAboutMission}
        onUpdateValue={updateValue}
        onBlur={handleFieldBlur}
        isEditing={isEditing}
      />

      <CopyHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        sessionId={sessionId}
        currentCopy={displayCopy}
        onRestore={handleRestoreVersion}
      />
    </div>
  );
};

export default EditableCopyContainer;
