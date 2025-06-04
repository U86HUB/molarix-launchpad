
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, RefreshCw, Download, Square } from "lucide-react";

interface PreviewHeaderProps {
  clinicName?: string;
  isStreaming: boolean;
  loading: boolean;
  hasCurrentCopy: boolean;
  onBack: () => void;
  onRegenerate: () => void;
  onStop: () => void;
  onExport: () => void;
}

const PreviewHeader = ({
  clinicName,
  isStreaming,
  loading,
  hasCurrentCopy,
  onBack,
  onRegenerate,
  onStop,
  onExport
}: PreviewHeaderProps) => {
  return (
    <div className="mb-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI-Generated Copy Preview
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-generated content for {clinicName || 'your clinic'}
          </p>
        </div>
        <div className="flex gap-2">
          {isStreaming ? (
            <Button
              variant="outline"
              onClick={onStop}
              className="text-red-600 hover:text-red-700"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onExport}
            disabled={!hasCurrentCopy || isStreaming}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewHeader;
