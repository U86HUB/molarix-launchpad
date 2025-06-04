
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, RefreshCw, Copy, Check, Download, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStreamingCopy } from "@/hooks/useStreamingCopy";
import TypingAnimation from "@/components/TypingAnimation";

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const exportAsJson = () => {
    if (!generatedCopy) return;
    
    const dataStr = JSON.stringify(generatedCopy, null, 2);
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
                disabled={!generatedCopy || isStreaming}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>

        {isStreaming && streamingContent ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI is generating your copy...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </CardTitle>
                <CardDescription>
                  Watch as your personalized content is created in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    <TypingAnimation 
                      text={streamingContent} 
                      speed={20}
                      className="text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
        ) : generatedCopy ? (
          <div className="space-y-8">
            {/* Homepage Copy Section */}
            <Card>
              <CardHeader>
                <CardTitle>Homepage Copy</CardTitle>
                <CardDescription>
                  Main homepage content and hero section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Headline</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.homepage.headline, 'Headline')}
                    >
                      {copiedItems.has('Headline') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-3xl font-bold leading-tight">{generatedCopy.homepage.headline}</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Subheadline</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.homepage.subheadline, 'Subheadline')}
                    >
                      {copiedItems.has('Subheadline') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{generatedCopy.homepage.subheadline}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Welcome Message</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.homepage.welcomeMessage, 'Welcome Message')}
                    >
                      {copiedItems.has('Welcome Message') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg leading-relaxed">{generatedCopy.homepage.welcomeMessage}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Call-to-Action</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.homepage.ctaText, 'CTA Text')}
                    >
                      {copiedItems.has('CTA Text') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Button size="lg" className="font-semibold text-lg px-8 py-3">{generatedCopy.homepage.ctaText}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Copy Section */}
            <Card>
              <CardHeader>
                <CardTitle>Services Copy</CardTitle>
                <CardDescription>
                  Services section content and offerings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Section Title</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.services.title, 'Services Title')}
                    >
                      {copiedItems.has('Services Title') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-2xl font-bold">{generatedCopy.services.title}</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Introduction</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.services.intro, 'Services Intro')}
                    >
                      {copiedItems.has('Services Intro') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg leading-relaxed">{generatedCopy.services.intro}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedCopy.services.services.map((service, index) => (
                      <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{service.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${service.name}: ${service.description}`, `Service ${index + 1}`)}
                          >
                            {copiedItems.has(`Service ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Copy Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Copy</CardTitle>
                <CardDescription>
                  About section content and practice values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Section Title</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.about.title, 'About Title')}
                    >
                      {copiedItems.has('About Title') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-2xl font-bold">{generatedCopy.about.title}</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Introduction</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.about.intro, 'About Intro')}
                    >
                      {copiedItems.has('About Intro') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg leading-relaxed">{generatedCopy.about.intro}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Mission Statement</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.about.mission, 'Mission')}
                    >
                      {copiedItems.has('Mission') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg italic leading-relaxed">{generatedCopy.about.mission}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {generatedCopy.about.values.map((value, index) => (
                      <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{value.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${value.name}: ${value.description}`, `Value ${index + 1}`)}
                          >
                            {copiedItems.has(`Value ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Save Your Copy</CardTitle>
                <CardDescription>
                  Export or save your generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={exportAsJson} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download as JSON
                  </Button>
                  <Button variant="outline" className="flex-1" disabled>
                    Save to Project
                    <span className="text-xs ml-2">(Coming Soon)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
