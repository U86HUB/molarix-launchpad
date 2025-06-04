
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import PreviewHeader from "@/components/preview/PreviewHeader";
import PreviewLoadingState from "@/components/preview/PreviewLoadingState";
import PreviewErrorState from "@/components/preview/PreviewErrorState";
import InfoBanner from "@/components/preview/InfoBanner";
import AiCopyPreviewContent from "@/components/preview/AiCopyPreviewContent";
import { useAiCopyPreviewLogic } from "@/components/preview/AiCopyPreviewLogic";

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const sessionId = searchParams.get("sessionId");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  const {
    currentCopy,
    sessionData,
    loading,
    showInfoBanner,
    infoBannerMessage,
    noCopyFound,
    isStreaming,
    streamingContent,
    hasUnsavedChanges,
    exportAsJson,
    handleRegenerate,
    handleGenerateNewVersion,
    handleCopyUpdated,
    hideInfoBanner,
    stopGeneration,
    markSaved
  } = useAiCopyPreviewLogic({ sessionId, isEditMode });

  const handleBack = () => {
    window.history.back();
  };

  // Show loading state
  if (loading) {
    return <PreviewLoadingState isInitializing={true} />;
  }

  // Show error state when no session data
  if (!sessionData) {
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

        <InfoBanner message={infoBannerMessage} show={showInfoBanner} />

        <AiCopyPreviewContent
          noCopyFound={noCopyFound}
          isEditMode={isEditMode}
          sessionId={sessionId}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          loading={loading}
          currentCopy={currentCopy}
          hasUnsavedChanges={hasUnsavedChanges}
          onRegenerate={handleRegenerate}
          onGenerateNewVersion={handleGenerateNewVersion}
          onCopyUpdated={handleCopyUpdated}
          onMarkSaved={markSaved}
        />
      </div>
    </div>
  );
};

export default AiCopyPreview;
