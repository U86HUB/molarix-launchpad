
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, CheckCircle, Download } from "lucide-react";
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

interface CopyVersion {
  id: string;
  data: GeneratedCopy;
  type: 'draft' | 'published';
  created_at: string;
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
  const [copyVersions, setCopyVersions] = useState<CopyVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("latest-draft");
  const [currentCopy, setCurrentCopy] = useState<GeneratedCopy | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [noCopyFound, setNoCopyFound] = useState(false);

  useEffect(() => {
    if (!sessionId || !isOpen) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setNoCopyFound(false);
      
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

        // Fetch all copy versions
        const { data: copyData, error: copyError } = await supabase
          .from('ai_generated_copy')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false });

        if (copyError) {
          console.error('Error fetching copy data:', copyError);
        }

        if (copyData && copyData.length > 0) {
          const versions: CopyVersion[] = copyData.map(item => ({
            id: item.id,
            data: item.data as unknown as GeneratedCopy,
            type: item.type as 'draft' | 'published',
            created_at: item.created_at
          }));
          
          setCopyVersions(versions);
          
          // Set default selection based on available versions
          const latestDraft = versions.find(v => v.type === 'draft');
          const publishedVersion = versions.find(v => v.type === 'published');
          
          if (latestDraft) {
            setSelectedVersion("latest-draft");
            setCurrentCopy(latestDraft.data);
          } else if (publishedVersion) {
            setSelectedVersion("published");
            setCurrentCopy(publishedVersion.data);
          } else if (versions.length > 0) {
            setSelectedVersion(`version-${versions[0].id}`);
            setCurrentCopy(versions[0].data);
          }
        } else {
          setNoCopyFound(true);
          setCopyVersions([]);
          setCurrentCopy(null);
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
  }, [sessionId, isOpen, toast]);

  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId);
    
    if (versionId === "latest-draft") {
      const latestDraft = copyVersions.find(v => v.type === 'draft');
      setCurrentCopy(latestDraft?.data || null);
    } else if (versionId === "published") {
      const publishedVersion = copyVersions.find(v => v.type === 'published');
      setCurrentCopy(publishedVersion?.data || null);
    } else {
      const version = copyVersions.find(v => v.id === versionId.replace('version-', ''));
      setCurrentCopy(version?.data || null);
    }
  };

  const handlePublishDraft = async () => {
    const latestDraft = copyVersions.find(v => v.type === 'draft');
    if (!latestDraft) return;

    setPublishing(true);
    try {
      const { error } = await supabase
        .from('ai_generated_copy')
        .update({ type: 'published' })
        .eq('id', latestDraft.id);

      if (error) {
        throw error;
      }

      // Update local state
      setCopyVersions(prev => 
        prev.map(v => 
          v.id === latestDraft.id 
            ? { ...v, type: 'published' as const }
            : v
        )
      );

      setSelectedVersion("published");

      toast({
        title: "Success!",
        description: "Draft has been published successfully",
      });
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast({
        title: "Error",
        description: "Failed to publish draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleExportVersion = () => {
    if (!currentCopy) return;
    
    const dataStr = JSON.stringify(currentCopy, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sessionData?.clinic_name || 'clinic'}-copy-${dayjs().format('YYYY-MM-DD')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSessionData(null);
    setCurrentCopy(null);
    setCopyVersions([]);
    setNoCopyFound(false);
    setSelectedVersion("latest-draft");
    onClose();
  };

  const getStatusBadge = () => {
    if (selectedVersion === "latest-draft") {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">📝 Draft Version (Unpublished)</Badge>;
    } else if (selectedVersion === "published") {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">✅ Published Version</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">⏳ Historical Version (Read Only)</Badge>;
    }
  };

  const getVersionOptions = () => {
    const options = [];
    
    const latestDraft = copyVersions.find(v => v.type === 'draft');
    const publishedVersion = copyVersions.find(v => v.type === 'published');
    
    if (latestDraft) {
      options.push({ value: "latest-draft", label: "Latest Draft" });
    }
    
    if (publishedVersion) {
      options.push({ value: "published", label: "Published Version" });
    }
    
    // Add older versions if there are more than 2 total versions
    const olderVersions = copyVersions.filter(v => 
      !(v.type === 'draft' && latestDraft?.id === v.id) &&
      !(v.type === 'published' && publishedVersion?.id === v.id)
    );
    
    olderVersions.forEach(version => {
      options.push({
        value: `version-${version.id}`,
        label: `${version.type === 'published' ? 'Published' : 'Draft'} - ${dayjs(version.created_at).format('MMM D, YYYY')}`
      });
    });
    
    return options;
  };

  const showPublishButton = selectedVersion === "latest-draft" && copyVersions.some(v => v.type === 'draft');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">
                {sessionData?.clinic_name || 'Clinic'} Preview
              </DialogTitle>
              {!noCopyFound && !loading && getStatusBadge()}
            </div>
            <div className="flex items-center gap-3">
              {!noCopyFound && !loading && (
                <>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template-a">Template A</SelectItem>
                      <SelectItem value="template-b">Template B</SelectItem>
                      <SelectItem value="template-c">Template C</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedVersion} onValueChange={handleVersionChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getVersionOptions().map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {showPublishButton && (
                    <Button 
                      onClick={handlePublishDraft} 
                      disabled={publishing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {publishing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {publishing ? 'Publishing...' : 'Publish This Draft'}
                    </Button>
                  )}

                  {currentCopy && (
                    <Button onClick={handleExportVersion} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  )}
                </>
              )}
              
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading preview...</span>
              </div>
            </div>
          ) : noCopyFound ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">No Saved Content Found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No saved content found for this session. Please edit and save a draft first.
                </p>
                <Button onClick={handleClose} variant="outline">
                  Close Preview
                </Button>
              </div>
            </div>
          ) : sessionData ? (
            <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg transition-all duration-300">
              <TemplateRenderer 
                sessionData={sessionData}
                selectedTemplate={selectedTemplate}
                aiCopy={currentCopy}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Session not found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
