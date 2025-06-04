import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { GeneratedCopy } from "@/types/copy";
import { supabase } from "@/integrations/supabase/client";
import { useSavedCopy } from "@/hooks/useSavedCopy";
import { useStreamingCopy } from "@/hooks/useStreamingCopy";
import PreviewHeader from "@/components/preview/PreviewHeader";
import PreviewLoadingState from "@/components/preview/PreviewLoadingState";
import PreviewErrorState from "@/components/preview/PreviewErrorState";
import PreviewContent from "@/components/preview/PreviewContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentCopy, setCurrentCopy] = useState<GeneratedCopy | null>(null);
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showInfoBanner, setShowInfoBanner] = useState(false);
  const [infoBannerMessage, setInfoBannerMessage] = useState("");

  const sessionId = searchParams.get("sessionId");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  // Load saved copy first (preferring drafts in edit mode)
  const { copy: savedCopy, loading: savedCopyLoading, noCopyFound } = useSavedCopy({
    sessionId,
    preferDraft: isEditMode
  });

  // Streaming copy generation (only triggered if no saved copy)
  const {
    streamingContent,
    isStreaming,
    error: streamingError,
    hasUnsavedChanges,
    startGeneration,
    regenerateVersion,
    stopGeneration,
    markSaved
  } = useStreamingCopy(sessionId, { skipGenerationIfCopyExists: true });

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No session ID provided",
        variant: "destructive",
      });
      setSessionLoading(false);
      return;
    }

    const fetchSessionData = async () => {
      try {
        const { data: session, error: sessionError } = await supabase
          .from('onboarding_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessionError) {
          console.error('Error fetching session data:', sessionError);
          toast({
            title: "Error",
            description: "Failed to load session data",
            variant: "destructive",
          });
          return;
        }

        setSessionData(session);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setSessionLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, toast]);

  // Handle saved copy loading results
  useEffect(() => {
    if (!savedCopyLoading) {
      if (savedCopy) {
        setCurrentCopy(savedCopy);
        setInfoBannerMessage("Draft loaded from your last edit.");
        setShowInfoBanner(true);
        // Hide banner after 3 seconds
        setTimeout(() => setShowInfoBanner(false), 3000);
      } else if (noCopyFound && isEditMode) {
        // Only auto-generate if in edit mode and no saved copy exists
        setInfoBannerMessage("Generating content for the first time…");
        setShowInfoBanner(true);
        startGeneration(sessionId!);
      }
    }
  }, [savedCopy, savedCopyLoading, noCopyFound, isEditMode, startGeneration, sessionId]);

  // Handle streaming completion
  useEffect(() => {
    if (!isStreaming && streamingContent && !streamingError) {
      try {
        const parsedCopy = JSON.parse(streamingContent);
        setCurrentCopy(parsedCopy);
        setShowInfoBanner(false);
      } catch (error) {
        console.error('Error parsing streamed content:', error);
        toast({
          title: "Error",
          description: "Failed to parse generated content",
          variant: "destructive",
        });
      }
    }
  }, [isStreaming, streamingContent, streamingError, toast]);

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
    setInfoBannerMessage("Regenerating content…");
    setShowInfoBanner(true);
    startGeneration(sessionId!);
  };

  const handleGenerateNewVersion = () => {
    regenerateVersion(sessionId!);
  };

  const handleCopyUpdated = (updatedCopy: GeneratedCopy) => {
    setCurrentCopy(updatedCopy);
  };

  const handleBack = () => {
    window.history.back();
  };

  const loading = sessionLoading || savedCopyLoading;

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

        {showInfoBanner && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{infoBannerMessage}</AlertDescription>
          </Alert>
        )}

        {noCopyFound && !isEditMode ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No content found yet. Please generate content first in editing mode.</p>
            <button 
              onClick={() => window.location.href = `/ai-copy-preview?sessionId=${sessionId}&mode=edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Editing Mode
            </button>
          </div>
        ) : (
          <PreviewContent
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            loading={loading}
            currentCopy={currentCopy}
            sessionId={sessionId}
            hasUnsavedChanges={hasUnsavedChanges}
            onRegenerate={handleRegenerate}
            onGenerateNewVersion={handleGenerateNewVersion}
            onCopyUpdated={handleCopyUpdated}
            onMarkSaved={markSaved}
          />
        )}
      </div>
    </div>
  );
};

export default AiCopyPreview;
