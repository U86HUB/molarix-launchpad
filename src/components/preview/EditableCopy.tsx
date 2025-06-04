
import { GeneratedCopy } from "@/types/copy";
import EditableCopyContainer from "./EditableCopyContainer";

interface EditableCopyProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  hasUnsavedChanges?: boolean;
  isStreaming?: boolean;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
  onGenerateNewVersion?: () => void;
  onMarkSaved?: () => void;
}

const EditableCopy = ({ 
  generatedCopy, 
  sessionId, 
  hasUnsavedChanges,
  isStreaming,
  onCopyUpdated,
  onGenerateNewVersion,
  onMarkSaved
}: EditableCopyProps) => {
  return (
    <EditableCopyContainer
      generatedCopy={generatedCopy}
      sessionId={sessionId}
      hasUnsavedChanges={hasUnsavedChanges}
      isStreaming={isStreaming}
      onCopyUpdated={onCopyUpdated}
      onGenerateNewVersion={onGenerateNewVersion}
      onMarkSaved={onMarkSaved}
    />
  );
};

export default EditableCopy;
