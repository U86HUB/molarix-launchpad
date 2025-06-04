
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useStreamingCopy = () => {
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateCopyWithStreaming = async (sessionId: string) => {
    if (!sessionId) return;

    setIsStreaming(true);
    setLoading(true);
    setStreamingContent('');
    setGeneratedCopy(null);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { sessionId, stream: true }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      // Handle streaming response
      if (data instanceof ReadableStream) {
        const reader = data.getReader();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                if (eventData.content) {
                  accumulatedContent += eventData.content;
                  setStreamingContent(accumulatedContent);
                }
                if (eventData.sessionData && !sessionData) {
                  setSessionData(eventData.sessionData);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        // Try to parse the final accumulated content as JSON
        try {
          const finalCopy = JSON.parse(accumulatedContent);
          setGeneratedCopy(finalCopy);
          setStreamingContent('');
          
          toast({
            title: "Success",
            description: "Copy generated successfully!",
          });
        } catch (parseError) {
          console.error('Failed to parse final copy:', parseError);
          // Fallback to non-streaming generation
          await generateCopyFallback(sessionId);
        }
      } else {
        // Handle non-streaming response
        if (!data.success) {
          throw new Error(data.error || 'Failed to generate copy');
        }

        setGeneratedCopy(data.copy);
        setSessionData(data.sessionData);

        toast({
          title: "Success",
          description: "Copy generated successfully!",
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error generating copy:', error);
        toast({
          title: "Error",
          description: "Failed to generate copy. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsStreaming(false);
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const generateCopyFallback = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { sessionId, stream: false }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate copy');
      }

      setGeneratedCopy(data.copy);
      setSessionData(data.sessionData);

      toast({
        title: "Success",
        description: "Copy generated successfully!",
      });
    } catch (error) {
      console.error('Error in fallback generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate copy. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setLoading(false);
      toast({
        title: "Stopped",
        description: "Copy generation stopped",
      });
    }
  };

  return {
    sessionData,
    generatedCopy,
    streamingContent,
    isStreaming,
    loading,
    generateCopyWithStreaming,
    stopGeneration
  };
};
