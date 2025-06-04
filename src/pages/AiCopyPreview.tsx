
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, RefreshCw, Copy, Check } from "lucide-react";
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

interface HomepageCopy {
  headline: string;
  subheadline: string;
  welcomeMessage: string;
  ctaText: string;
}

interface ServicesCopy {
  title: string;
  intro: string;
  services: Array<{
    name: string;
    description: string;
  }>;
}

const AiCopyPreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [homepageCopy, setHomepageCopy] = useState<HomepageCopy | null>(null);
  const [servicesCopy, setServicesCopy] = useState<ServicesCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingHomepage, setGeneratingHomepage] = useState(false);
  const [generatingServices, setGeneratingServices] = useState(false);
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

    fetchSessionData();
  }, [sessionId, toast]);

  const fetchSessionData = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session data:', error);
        toast({
          title: "Error",
          description: "Failed to load session data",
          variant: "destructive",
        });
        return;
      }

      setSessionData(data);
      // Auto-generate both sections on load
      generateCopy(data, 'homepage');
      generateCopy(data, 'services');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCopy = async (clinicData: OnboardingSession, section: 'homepage' | 'services') => {
    const isHomepage = section === 'homepage';
    const setGenerating = isHomepage ? setGeneratingHomepage : setGeneratingServices;
    
    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { clinicData, section }
      });

      if (error) throw error;

      if (isHomepage) {
        setHomepageCopy(data.copy);
      } else {
        setServicesCopy(data.copy);
      }

      toast({
        title: "Success",
        description: `${isHomepage ? 'Homepage' : 'Services'} copy generated successfully!`,
      });
    } catch (error) {
      console.error('Error generating copy:', error);
      toast({
        title: "Error",
        description: `Failed to generate ${section} copy`,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading session data...</span>
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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI-Generated Copy Preview
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-generated content for {sessionData.clinic_name}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Homepage Copy Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Homepage Copy</CardTitle>
                  <CardDescription>
                    AI-generated homepage content for your clinic
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateCopy(sessionData, 'homepage')}
                  disabled={generatingHomepage}
                >
                  {generatingHomepage ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatingHomepage ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : homepageCopy ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Headline</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(homepageCopy.headline, 'Headline')}
                      >
                        {copiedItems.has('Headline') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h2 className="text-2xl font-bold">{homepageCopy.headline}</h2>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Subheadline</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(homepageCopy.subheadline, 'Subheadline')}
                      >
                        {copiedItems.has('Subheadline') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-lg text-gray-600 dark:text-gray-300">{homepageCopy.subheadline}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Welcome Message</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(homepageCopy.welcomeMessage, 'Welcome Message')}
                      >
                        {copiedItems.has('Welcome Message') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p>{homepageCopy.welcomeMessage}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Call-to-Action</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(homepageCopy.ctaText, 'CTA Text')}
                      >
                        {copiedItems.has('CTA Text') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Button className="font-semibold">{homepageCopy.ctaText}</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No homepage copy generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Copy Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services Copy</CardTitle>
                  <CardDescription>
                    AI-generated services section content
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateCopy(sessionData, 'services')}
                  disabled={generatingServices}
                >
                  {generatingServices ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatingServices ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : servicesCopy ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Section Title</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(servicesCopy.title, 'Services Title')}
                      >
                        {copiedItems.has('Services Title') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h2 className="text-xl font-bold">{servicesCopy.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Introduction</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(servicesCopy.intro, 'Services Intro')}
                      >
                        {copiedItems.has('Services Intro') ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p>{servicesCopy.intro}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {servicesCopy.services.map((service, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{service.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${service.name}: ${service.description}`, `Service ${index + 1}`)}
                            >
                              {copiedItems.has(`Service ${index + 1}`) ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services copy generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiCopyPreview;
