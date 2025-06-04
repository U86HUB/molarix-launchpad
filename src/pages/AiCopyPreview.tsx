
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { GeneratedCopy } from "@/types/copy";
import { supabase } from "@/integrations/supabase/client";
import PreviewHeader from "@/components/preview/PreviewHeader";
import PreviewLoadingState from "@/components/preview/PreviewLoadingState";
import PreviewErrorState from "@/components/preview/PreviewErrorState";
import PreviewContent from "@/components/preview/PreviewContent";

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
  const [loading, setLoading] = useState(true);
  const [noCopyFound, setNoCopyFound] = useState(false);

  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No session ID provided",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch session data
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

        // First try to get published copy
        const { data: publishedCopy, error: publishedError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', 'published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (publishedError) {
          console.error('Error fetching published copy:', publishedError);
        }

        if (publishedCopy) {
          setCurrentCopy(publishedCopy.data as unknown as GeneratedCopy);
        } else {
          // Try to get any copy (including drafts) as fallback
          const { data: anyCopy, error: anyError } = await supabase
            .from('ai_generated_copy')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (anyError) {
            console.error('Error fetching any copy:', anyError);
          }

          if (anyCopy) {
            setCurrentCopy(anyCopy.data as unknown as GeneratedCopy);
          } else {
            setNoCopyFound(true);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    // Navigate to editing mode for regeneration
    window.location.href = `/ai-copy-preview?sessionId=${sessionId}&mode=edit`;
  };

  const handleCopyUpdated = (updatedCopy: GeneratedCopy) => {
    setCurrentCopy(updatedCopy);
  };

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
          isStreaming={false}
          loading={false}
          hasCurrentCopy={!!currentCopy}
          onBack={handleBack}
          onRegenerate={handleRegenerate}
          onStop={() => {}} // Not needed in preview mode
          onExport={exportAsJson}
        />

        {noCopyFound ? (
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
            isStreaming={false}
            streamingContent={null}
            loading={false}
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
