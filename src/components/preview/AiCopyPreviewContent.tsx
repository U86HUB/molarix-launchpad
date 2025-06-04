
import { GeneratedCopy } from "@/types/copy";
import PreviewContent from "./PreviewContent";

interface OnboardingSession {
  id: string;
  clinic_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  font_style: string;
  selected_template: string;
}

interface AiCopyPreviewContentProps {
  noCopyFound: boolean;
  isEditMode: boolean;
  sessionId: string | null;
  isStreaming: boolean;
  streamingContent: string;
  loading: boolean;
  currentCopy: GeneratedCopy | null;
  hasUnsavedChanges: boolean;
  onRegenerate: () => void;
  onGenerateNewVersion: () => void;
  onCopyUpdated: (updatedCopy: GeneratedCopy) => void;
  onMarkSaved: () => void;
}

const AiCopyPreviewContent = ({
  noCopyFound,
  isEditMode,
  sessionId,
  isStreaming,
  streamingContent,
  loading,
  currentCopy,
  hasUnsavedChanges,
  onRegenerate,
  onGenerateNewVersion,
  onCopyUpdated,
  onMarkSaved
}: AiCopyPreviewContentProps) => {
  if (noCopyFound && !isEditMode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No content found yet. Please generate content first in editing mode.</p>
        <button 
          onClick={() => window.location.href = `/ai-copy-preview?sessionId=${sessionId}&mode=edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Editing Mode
        </button>
      </div>
    );
  }

  return (
    <PreviewContent
      isStreaming={isStreaming}
      streamingContent={streamingContent}
      loading={loading}
      currentCopy={currentCopy}
      sessionId={sessionId}
      hasUnsavedChanges={hasUnsavedChanges}
      onRegenerate={onRegenerate}
      onGenerateNewVersion={onGenerateNewVersion}
      onCopyUpdated={onCopyUpdated}
      onMarkSaved={onMarkSaved}
    />
  );
};

export default AiCopyPreviewContent;
