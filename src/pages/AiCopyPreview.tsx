import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, RefreshCw, Copy, Check, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface GeneratedCopy {
  homepage: {
    headline: string;
    subheadline: string;
    welcomeMessage: string;
    ctaText: string;
  };
  services: {
    title: string;
    intro: string;
    services: Array<{
      name: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    intro: string;
    mission: string;
    values: Array<{
      name: string;
      description: string;
    }>;
  };
}

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

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

    generateCopy();
  }, [sessionId, toast]);

  const generateCopy = async () => {
    if (!sessionId) return;
    
    setGenerating(true);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { sessionId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate copy');
      }

      console.log('Generated copy data:', data);
      setGeneratedCopy(data.copy);
      setSessionData(data.sessionData);

      toast({
        title: "Success",
        description: "Copy generated successfully!",
      });
    } catch (error) {
      console.error('Error generating copy:', error);
      toast({
        title: "Error",
        description: "Failed to generate copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Generating AI copy...</span>
        </div>
      </div>
    );
  }

  if (!sessionData) {
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
                AI-generated content for {sessionData.clinic_name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateCopy}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={exportAsJson}
                disabled={!generatedCopy}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>

        {generating ? (
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-2xl font-bold">{generatedCopy.homepage.headline}</h2>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-300">{generatedCopy.homepage.subheadline}</p>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p>{generatedCopy.homepage.welcomeMessage}</p>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Button className="font-semibold">{generatedCopy.homepage.ctaText}</Button>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold">{generatedCopy.services.title}</h2>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p>{generatedCopy.services.intro}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedCopy.services.services.map((service, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{service.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${service.name}: ${service.description}`, `Service ${index + 1}`)}
                          >
                            {copiedItems.has(`Service ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold">{generatedCopy.about.title}</h2>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p>{generatedCopy.about.intro}</p>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="italic">{generatedCopy.about.mission}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedCopy.about.values.map((value, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{value.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${value.name}: ${value.description}`, `Value ${index + 1}`)}
                          >
                            {copiedItems.has(`Value ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No copy generated yet</p>
            <Button onClick={generateCopy} disabled={generating}>
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
