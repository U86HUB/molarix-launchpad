
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, RefreshCw, Download, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStreamingCopy } from "@/hooks/useStreamingCopy";
import { GeneratedCopy } from "@/types/copy";
import StreamingDisplay from "@/components/preview/StreamingDisplay";
import EditableCopy from "@/components/preview/EditableCopy";

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

  if (loading && !isStreaming) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Initializing AI copy generation...</span>
        </div>
      </div>
    );
  }

  if (!sessionData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Session Not Found</CardTitle>
            <CardDescription>
              The onboarding session could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
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
                AI-generated content for {sessionData?.clinic_name || 'your clinic'}
              </p>
            </div>
            <div className="flex gap-2">
              {isStreaming ? (
                <Button
                  variant="outline"
                  onClick={stopGeneration}
                  className="text-red-600 hover:text-red-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
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
                onClick={exportAsJson}
                disabled={!currentCopy || isStreaming}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>

        {isStreaming && streamingContent ? (
          <div className="space-y-6">
            <StreamingDisplay streamingContent={streamingContent} />
          </div>
        ) : loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : currentCopy && sessionId ? (
          <EditableCopy 
            generatedCopy={currentCopy} 
            sessionId={sessionId}
            onCopyUpdated={handleCopyUpdated}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No copy generated yet</p>
            <Button onClick={handleRegenerate} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCopyPreview;
