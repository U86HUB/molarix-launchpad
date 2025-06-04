
import { GeneratedCopy } from "@/types/copy";
import EditControls from "./EditControls";
import EditableHomepageSection from "./EditableHomepageSection";
import EditableServicesSection from "./EditableServicesSection";
import EditableAboutSection from "./EditableAboutSection";
import CopyHistoryModal from "./CopyHistoryModal";
import { useEditableCopyLogic } from "./EditableCopyLogic";
import { useEditableCopyActions } from "./EditableCopyActions";

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
  const {
    isEditing,
    editedCopy,
    showHistoryModal,
    loading,
    isSaving,
    lastSaved,
    setEditedCopy,
    setShowHistoryModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleFieldBlur,
    handleViewHistory,
    handleRestoreVersion
  } = useEditableCopyLogic({
    generatedCopy,
    sessionId,
    onCopyUpdated,
    onMarkSaved
  });

  const {
    updateHomepage,
    updateServicesTitle,
    updateServicesIntro,
    updateService,
    updateAboutTitle,
    updateAboutIntro,
    updateAboutMission,
    updateValue
  } = useEditableCopyActions({ setEditedCopy });

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
