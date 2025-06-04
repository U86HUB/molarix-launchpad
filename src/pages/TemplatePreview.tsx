
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TemplateRenderer from "@/components/preview/TemplateRenderer";
import { useLanguage } from "@/contexts/LanguageContext";
import { GeneratedCopy } from "@/types/copy";

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

const TemplatePreview = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template-a");
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [copyLoading, setCopyLoading] = useState(true);
  const [noPublishedCopyFound, setNoPublishedCopyFound] = useState(false);

  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No session ID provided",
        variant: "destructive",
      });
      setLoading(false);
      setCopyLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch session data
        const { data: sessionData, error: sessionError } = await supabase
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

        setSessionData(sessionData);
        setSelectedTemplate(sessionData.selected_template || "template-a");

        // Fetch ONLY published copy
        const { data: copyData, error: copyError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .eq('type', 'published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (copyError) {
          console.error('Error fetching copy data:', copyError);
        }

        if (copyData) {
          setCopy(copyData.data as unknown as GeneratedCopy);
        } else {
          setNoPublishedCopyFound(true);
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
        setCopyLoading(false);
      }
    };

    fetchData();
  }, [sessionId, toast]);

  if (loading || copyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading preview...</span>
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

  if (noPublishedCopyFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Published Version Available</CardTitle>
            <CardDescription>
              No published version available yet. Please publish from editing mode first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.href = `/ai-copy-preview?sessionId=${sessionId}&mode=edit`}
              className="w-full"
            >
              Go to Editing Mode
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()} 
              className="w-full"
            >
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Template Preview
                <span className="ml-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  Published
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See how your published clinic content looks with different templates
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <label htmlFor="template-select" className="text-sm font-medium">
                Template:
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template-a">Template A</SelectItem>
                  <SelectItem value="template-b">Template B</SelectItem>
                  <SelectItem value="template-c">Template C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TemplateRenderer 
          sessionData={sessionData}
          selectedTemplate={selectedTemplate}
          aiCopy={copy}
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
