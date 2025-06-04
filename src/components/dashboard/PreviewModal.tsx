
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TemplateRenderer from "@/components/preview/TemplateRenderer";
import { GeneratedCopy } from "@/types/copy";
import dayjs from 'dayjs';

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

interface PreviewModalProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal = ({ sessionId, isOpen, onClose }: PreviewModalProps) => {
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template-a");
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [noPublishedCopyFound, setNoPublishedCopyFound] = useState(false);
  const [publishedDate, setPublishedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !isOpen) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setCopyLoading(true);
      setNoPublishedCopyFound(false);
      
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
          setPublishedDate(copyData.created_at);
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
  }, [sessionId, isOpen, toast]);

  const handleClose = () => {
    setSessionData(null);
    setCopy(null);
    setNoPublishedCopyFound(false);
    setPublishedDate(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">
                {sessionData?.clinic_name || 'Clinic'} Preview
              </DialogTitle>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Published
              </Badge>
            </div>
            <div className="flex items-center gap-3">
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
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Preview only reflects published copy
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading || copyLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading preview...</span>
              </div>
            </div>
          ) : noPublishedCopyFound ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">No Published Version Available</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No published version available yet. Please publish from editing mode first.
                </p>
                <Button onClick={handleClose} variant="outline">
                  Close Preview
                </Button>
              </div>
            </div>
          ) : sessionData ? (
            <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
              <TemplateRenderer 
                sessionData={sessionData}
                selectedTemplate={selectedTemplate}
                aiCopy={copy}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Session not found</p>
            </div>
          )}
        </div>

        {/* Footer with version info */}
        {!loading && !copyLoading && !noPublishedCopyFound && publishedDate && (
          <div className="flex-shrink-0 border-t pt-3">
            <p className="text-xs text-muted-foreground text-center">
              Published Version · {dayjs(publishedDate).format('MMMM D, YYYY')}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
