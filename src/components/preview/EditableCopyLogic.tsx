
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSaveCopy } from "@/hooks/useSaveCopy";
import { useAutosave } from "@/hooks/useAutosave";
import { GeneratedCopy } from "@/types/copy";

interface UseEditableCopyLogicProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
  onMarkSaved?: () => void;
}

export const useEditableCopyLogic = ({
  generatedCopy,
  sessionId,
  onCopyUpdated,
  onMarkSaved
}: UseEditableCopyLogicProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy>(generatedCopy);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { toast } = useToast();
  const { saveCopy, loading } = useSaveCopy();
  
  // Auto-save hook for drafts
  const { isSaving, lastSaved, saveNow } = useAutosave({
    sessionId,
    draftData: editedCopy,
    enabled: isEditing,
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
      saveNow();
    }
  };

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  const handleRestoreVersion = (restoredCopy: GeneratedCopy) => {
    setEditedCopy(restoredCopy);
    setIsEditing(true);
    toast({
      title: "Version Restored",
      description: "The selected version has been restored. Click 'Publish Changes' to save it.",
    });
  };

  return {
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
  };
};
