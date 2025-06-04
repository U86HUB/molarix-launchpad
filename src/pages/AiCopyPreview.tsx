
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStreamingCopy } from "@/hooks/useStreamingCopy";
import { GeneratedCopy } from "@/types/copy";
import PreviewHeader from "@/components/preview/PreviewHeader";
import PreviewLoadingState from "@/components/preview/PreviewLoadingState";
import PreviewErrorState from "@/components/preview/PreviewErrorState";
import PreviewContent from "@/components/preview/PreviewContent";

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentCopy, setCurrentCopy] = useState<GeneratedCopy | null>(null);

  const sessionId = searchParams.get("sessionId");

  const {
    sessionData,
    generatedCopy,
    streamingContent,
    isStreaming,
    loading,
    generateCopyWithStreaming,
    stopGeneration
  } = useStreamingCopy();

  // Update current copy when generated copy changes
  useEffect(() => {
    if (generatedCopy) {
      setCurrentCopy(generatedCopy);
    }
  }, [generatedCopy]);

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No session ID provided",
        variant: "destructive",
      });
      return;
    }

    generateCopyWithStreaming(sessionId);
  }, [sessionId, toast]);

  const exportAsJson = () => {
    if (!currentCopy) return;
    
    const dataStr = JSON.stringify(currentCopy, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sessionData?.clinic_name || 'clinic'}-copy.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Copy exported as JSON file",
    });
  };

  const handleRegenerate = () => {
    if (sessionId) {
      generateCopyWithStreaming(sessionId);
    }
  };

  const handleCopyUpdated = (updatedCopy: GeneratedCopy) => {
    setCurrentCopy(updatedCopy);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Show initializing state when loading and not streaming
  if (loading && !isStreaming) {
    return <PreviewLoadingState isInitializing={true} />;
  }

  // Show error state when no session data and not loading
  if (!sessionData && !loading) {
    return <PreviewErrorState onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PreviewHeader
          clinicName={sessionData?.clinic_name}
          isStreaming={isStreaming}
          loading={loading}
          hasCurrentCopy={!!currentCopy}
          onBack={handleBack}
          onRegenerate={handleRegenerate}
          onStop={stopGeneration}
          onExport={exportAsJson}
        />

        {loading ? (
          <PreviewLoadingState />
        ) : (
          <PreviewContent
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            loading={loading}
            currentCopy={currentCopy}
            sessionId={sessionId}
            onRegenerate={handleRegenerate}
            onCopyUpdated={handleCopyUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default AiCopyPreview;
