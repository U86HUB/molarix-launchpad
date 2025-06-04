
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, StopCircle, Download } from "lucide-react";
import PublishButton from "./PublishButton";

interface PreviewHeaderProps {
  clinicName?: string;
  isStreaming: boolean;
  loading: boolean;
  hasCurrentCopy: boolean;
  draftCopyId?: string;
  sessionId?: string;
  isEditMode?: boolean;
  onBack: () => void;
  onRegenerate: () => void;
  onStop: () => void;
  onExport: () => void;
  onPublished?: () => void;
}

const PreviewHeader = ({
  clinicName,
  isStreaming,
  loading,
  hasCurrentCopy,
  draftCopyId,
  sessionId,
  isEditMode = false,
  onBack,
  onRegenerate,
  onStop,
  onExport,
  onPublished
}: PreviewHeaderProps) => {
  return (
    <div className="mb-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Copy Preview
            {isEditMode && (
              <span className="ml-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Editing Mode
              </span>
            )}
          </h1>
          {clinicName && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {clinicName}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditMode && draftCopyId && sessionId && onPublished && (
            <PublishButton 
              draftCopyId={draftCopyId}
              sessionId={sessionId}
              onPublished={onPublished}
            />
          )}
          
          {hasCurrentCopy && (
            <Button onClick={onExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          {isStreaming ? (
            <Button onClick={onStop} variant="destructive">
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button 
              onClick={onRegenerate} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewHeader;
