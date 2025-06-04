
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy, OnboardingSession } from '@/types/copy';
import { StreamingService } from '@/services/streamingService';
import { CopyGenerationService } from '@/services/copyGenerationService';
import { useSaveCopy } from '@/hooks/useSaveCopy';

export const useStreamingCopy = () => {
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getSavedCopy } = useSaveCopy();
  
  const streamingService = useRef(new StreamingService());
  const copyGenerationService = useRef(new CopyGenerationService());

  const loadSavedCopy = async (sessionId: string) => {
    const result = await getSavedCopy(sessionId);
    if (result.success && result.copy) {
      setGeneratedCopy(result.copy);
      return true;
    }
    return false;
  };

  const generateCopyWithStreaming = async (sessionId: string, checkSaved: boolean = true) => {
    if (!sessionId) return;

    setLoading(true);

    // Check for saved copy first if requested
    if (checkSaved) {
      const hasSavedCopy = await loadSavedCopy(sessionId);
      if (hasSavedCopy) {
        setLoading(false);
        return;
      }
    }

    setIsStreaming(true);
    setStreamingContent('');
    setGeneratedCopy(null);

    // Cancel any existing request
    streamingService.current.abort();

    const abortController = new AbortController();
    streamingService.current.setAbortController(abortController);

    try {
      const response = await copyGenerationService.current.generateCopy(sessionId, true);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate copy');
      }

      // Handle streaming response
      if (response.data) {
        const finalCopy = await streamingService.current.processStreamingResponse(
          response.data,
          setStreamingContent,
          (sessionData) => {
            if (sessionData) {
              setSessionData(sessionData);
            }
          }
        );

        if (finalCopy) {
          setGeneratedCopy(finalCopy);
          setStreamingContent('');
          
          toast({
            title: "Success",
            description: "Copy generated successfully!",
          });
        } else {
          // Fallback to non-streaming generation
          await generateCopyFallback(sessionId);
        }
      } else {
        // Handle non-streaming response
        setGeneratedCopy(response.copy!);
        setSessionData(response.sessionData!);

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
    }
  };

  const generateCopyFallback = async (sessionId: string) => {
    try {
      const response = await copyGenerationService.current.generateCopy(sessionId, false);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate copy');
      }

      setGeneratedCopy(response.copy!);
      setSessionData(response.sessionData!);

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
    streamingService.current.abort();
    setIsStreaming(false);
    setLoading(false);
    toast({
      title: "Stopped",
      description: "Copy generation stopped",
    });
  };

  return {
    sessionData,
    generatedCopy,
    streamingContent,
    isStreaming,
    loading,
    generateCopyWithStreaming,
    stopGeneration,
    loadSavedCopy
  };
};
