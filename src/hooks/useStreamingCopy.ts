
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy, OnboardingSession } from '@/types/copy';
import { StreamingService } from '@/services/streamingService';
import { CopyGenerationService } from '@/services/copyGenerationService';
import { useSaveCopy } from '@/hooks/useSaveCopy';

interface UseStreamingCopyOptions {
  skipGenerationIfCopyExists?: boolean;
}

export const useStreamingCopy = (sessionId: string | null, options: UseStreamingCopyOptions = {}) => {
  const { skipGenerationIfCopyExists = false } = options;
  
  const [sessionData, setSessionData] = useState<OnboardingSession | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();
  const { getSavedCopy } = useSaveCopy();
  
  const streamingService = useRef(new StreamingService());
  const copyGenerationService = useRef(new CopyGenerationService());

  const loadSavedCopy = async (targetSessionId: string) => {
    const result = await getSavedCopy(targetSessionId);
    if (result.success && result.copy) {
      setGeneratedCopy(result.copy);
      setHasUnsavedChanges(false);
      return true;
    }
    return false;
  };

  const startGeneration = async (targetSessionId?: string) => {
    const sessionIdToUse = targetSessionId || sessionId;
    if (!sessionIdToUse) return;

    // Check if we should skip generation when copy already exists
    if (skipGenerationIfCopyExists && generatedCopy) {
      console.log('Skipping generation: copy already exists');
      toast({
        title: "Info",
        description: "Content already exists. Use regenerate if you want to create new content.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setIsStreaming(true);
    setStreamingContent('');
    setGeneratedCopy(null);

    // Cancel any existing request
    streamingService.current.abort();

    const abortController = new AbortController();
    streamingService.current.setAbortController(abortController);

    try {
      const response = await copyGenerationService.current.generateCopy(sessionIdToUse, true);

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
          setHasUnsavedChanges(false);
          
          toast({
            title: "Success",
            description: "Copy generated successfully!",
          });
        } else {
          // Fallback to non-streaming generation
          await generateCopyFallback(sessionIdToUse);
        }
      } else {
        // Handle non-streaming response
        setGeneratedCopy(response.copy!);
        setSessionData(response.sessionData!);
        setHasUnsavedChanges(false);

        toast({
          title: "Success",
          description: "Copy generated successfully!",
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error generating copy:', error);
        setError(error.message);
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

  const regenerateVersion = async (targetSessionId?: string) => {
    const sessionIdToUse = targetSessionId || sessionId;
    if (!sessionIdToUse) return;

    setLoading(true);
    setError(null);
    setIsStreaming(true);
    setStreamingContent('');

    // Cancel any existing request
    streamingService.current.abort();

    const abortController = new AbortController();
    streamingService.current.setAbortController(abortController);

    try {
      const response = await copyGenerationService.current.generateCopy(sessionIdToUse, true);

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
          setHasUnsavedChanges(true);
          
          toast({
            title: "Success",
            description: "New version generated. Unsaved changes active.",
          });
        } else {
          // Fallback to non-streaming generation
          await generateCopyFallback(sessionIdToUse, true);
        }
      } else {
        // Handle non-streaming response
        setGeneratedCopy(response.copy!);
        setSessionData(response.sessionData!);
        setHasUnsavedChanges(true);

        toast({
          title: "Success",
          description: "New version generated. Unsaved changes active.",
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error regenerating copy:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to regenerate copy. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsStreaming(false);
      setLoading(false);
    }
  };

  const generateCopyFallback = async (targetSessionId: string, isRegeneration = false) => {
    try {
      const response = await copyGenerationService.current.generateCopy(targetSessionId, false);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate copy');
      }

      setGeneratedCopy(response.copy!);
      setSessionData(response.sessionData!);
      setHasUnsavedChanges(isRegeneration);

      toast({
        title: "Success",
        description: isRegeneration 
          ? "New version generated. Unsaved changes active."
          : "Copy generated successfully!",
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

  const markSaved = () => {
    setHasUnsavedChanges(false);
  };

  return {
    sessionData,
    generatedCopy,
    streamingContent,
    isStreaming,
    loading,
    error,
    hasUnsavedChanges,
    startGeneration,
    regenerateVersion,
    stopGeneration,
    loadSavedCopy,
    markSaved
  };
};
