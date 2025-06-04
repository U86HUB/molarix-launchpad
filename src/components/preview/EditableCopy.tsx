
import { GeneratedCopy } from "@/types/copy";
import EditableCopyContainer from "./EditableCopyContainer";

interface EditableCopyProps {
  generatedCopy: GeneratedCopy;
  sessionId: string;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
}

const EditableCopy = ({ generatedCopy, sessionId, onCopyUpdated }: EditableCopyProps) => {
  return (
    <EditableCopyContainer
      generatedCopy={generatedCopy}
      sessionId={sessionId}
      onCopyUpdated={onCopyUpdated}
    />
  );
};

export default EditableCopy;
