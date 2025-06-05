
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  WebsiteInitializationService, 
  WebsiteInitializationData, 
  InitializationProgress 
} from '@/services/websiteInitializationService';
import { UseWebsiteInitializationResult } from '@/types/onboarding';

export const useWebsiteInitialization = (): UseWebsiteInitializationResult => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentMessage, setCurrentMessage] = useState<string>('Preparing...');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleProgress = useCallback((progress: InitializationProgress) => {
    setCurrentStep(progress.step);
    setCurrentMessage(progress.message);
    setIsCompleted(progress.completed);
  }, []);

  const initializeWebsite = useCallback(async (data: WebsiteInitializationData): Promise<void> => {
    try {
      setIsInitializing(true);
      setHasError(false);
      setIsCompleted(false);
      setCurrentStep(1);
      setCurrentMessage('Starting website setup...');

      console.log('Starting website initialization:', data.websiteId);

      const service = new WebsiteInitializationService(handleProgress);
      const success = await service.initializeWebsite(data);

      if (success) {
        setIsCompleted(true);
        
        // Wait a moment to show completion, then redirect
        setTimeout(() => {
          navigate(`/website-builder/${data.websiteId}`);
        }, 2000);

        toast({
          title: "Website Created Successfully",
          description: "Your website has been set up and is ready for customization.",
        });
      }

    } catch (error: any) {
      console.error('Website initialization failed:', error);
      setHasError(true);
      
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to initialize website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  }, [handleProgress, navigate, toast]);

  const retryInitializeWebsite = useCallback((data: WebsiteInitializationData): void => {
    setHasError(false);
    initializeWebsite(data);
  }, [initializeWebsite]);

  return {
    isInitializing,
    currentStep,
    currentMessage,
    isCompleted,
    hasError,
    initializeWebsite,
    retryInitialization: retryInitializeWebsite,
  };
};
