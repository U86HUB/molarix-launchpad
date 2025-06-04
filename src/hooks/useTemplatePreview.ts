
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

export const useTemplatePreview = () => {
  const [searchParams] = useSearchParams();
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

  return {
    sessionId,
    sessionData,
    selectedTemplate,
    setSelectedTemplate,
    loading,
    copy,
    copyLoading,
    noPublishedCopyFound
  };
};
