
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { GeneratedCopy } from "@/types/copy";
import StreamingDisplay from "./StreamingDisplay";
import EditableCopy from "./EditableCopy";

interface PreviewContentProps {
  isStreaming: boolean;
  streamingContent: string | null;
  loading: boolean;
  currentCopy: GeneratedCopy | null;
  sessionId: string | null;
  onRegenerate: () => void;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
}

const PreviewContent = ({
  isStreaming,
  streamingContent,
  loading,
  currentCopy,
  sessionId,
  onRegenerate,
  onCopyUpdated
}: PreviewContentProps) => {
  if (isStreaming && streamingContent) {
    return (
      <div className="space-y-6">
        <StreamingDisplay streamingContent={streamingContent} />
      </div>
    );
  }

  if (loading) {
    return null; // Loading is handled by PreviewLoadingState
  }

  if (currentCopy && sessionId) {
    return (
      <EditableCopy 
        generatedCopy={currentCopy} 
        sessionId={sessionId}
        onCopyUpdated={onCopyUpdated}
      />
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">No copy generated yet</p>
      <Button onClick={onRegenerate} disabled={loading}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Generate Copy
      </Button>
    </div>
  );
};

export default PreviewContent;
