
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedCopy } from "@/types/copy";
import { supabase } from "@/integrations/supabase/client";
import { useSavedCopy } from "@/hooks/useSavedCopy";
import { useStreamingCopy } from "@/hooks/useStreamingCopy";

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

interface UseAiCopyPreviewLogicProps {
  sessionId: string | null;
  isEditMode: boolean;
}

export const useAiCopyPreviewLogic = ({ sessionId, isEditMode }: UseAiCopyPreviewLogicProps) => {
  const { toast } = useToast();
  const [currentCopy, setCurrentCopy] = useState<GeneratedCopy | null>(null);
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showInfoBanner, setShowInfoBanner] = useState(false);
  const [infoBannerMessage, setInfoBannerMessage] = useState("");
  const [draftCopyId, setDraftCopyId] = useState<string | null>(null);

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
        
        // Find the draft copy ID for publishing functionality
        if (isEditMode) {
          fetchDraftCopyId();
        }
        
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

  const fetchDraftCopyId = async () => {
    if (!sessionId) return;
    
    try {
      const { data } = await supabase
        .from('ai_generated_copy')
        .select('id')
        .eq('session_id', sessionId)
        .eq('type', 'draft')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setDraftCopyId(data.id);
      }
    } catch (error) {
      console.error('Error fetching draft copy ID:', error);
    }
  };

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

  const handlePublished = () => {
    setInfoBannerMessage("Content published successfully!");
    setShowInfoBanner(true);
    setTimeout(() => setShowInfoBanner(false), 3000);
    
    // Refresh the draft copy ID since it might have changed
    fetchDraftCopyId();
  };

  const hideInfoBanner = () => {
    setShowInfoBanner(false);
  };

  const loading = sessionLoading || savedCopyLoading;

  return {
    currentCopy,
    sessionData,
    loading,
    showInfoBanner,
    infoBannerMessage,
    noCopyFound,
    isStreaming,
    streamingContent,
    hasUnsavedChanges,
    draftCopyId,
    exportAsJson,
    handleRegenerate,
    handleGenerateNewVersion,
    handleCopyUpdated,
    hideInfoBanner,
    stopGeneration,
    markSaved,
    handlePublished
  };
};
