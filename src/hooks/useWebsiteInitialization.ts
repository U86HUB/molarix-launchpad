
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  WebsiteInitializationService, 
  WebsiteInitializationData, 
  InitializationProgress 
} from '@/services/websiteInitializationService';
import { UseWebsiteInitializationResult, WebsiteInitializer } from '@/types/onboarding';

export const useWebsiteInitialization = (): UseWebsiteInitializationResult => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentMessage, setCurrentMessage] = useState<string>('Preparing...');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Track active initializations to prevent duplicates
  const activeInitialization = useRef<{
    websiteId: string | null;
    promise: Promise<void> | null;
  }>({
    websiteId: null,
    promise: null
  });

  const handleProgress = useCallback((progress: InitializationProgress) => {
    setCurrentStep(progress.step);
    setCurrentMessage(progress.message);
    setIsCompleted(progress.completed);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 useWebsiteInitialization unmounting, cleaning up');
      activeInitialization.current = {
        websiteId: null,
        promise: null
      };
    };
  }, []);

  const initializeWebsite: WebsiteInitializer = useCallback(async (data: WebsiteInitializationData): Promise<void> => {
    // Prevent duplicate initialization for the same website
    if (activeInitialization.current.websiteId === data.websiteId) {
      console.warn('🚫 Website initialization already in progress for:', data.websiteId);
      if (activeInitialization.current.promise) {
        return activeInitialization.current.promise;
      }
    }

    // Prevent initialization if already completed
    if (isCompleted) {
      console.warn('🚫 Website initialization already completed, skipping');
      return;
    }

    const initPromise = (async () => {
      try {
        setIsInitializing(true);
        setHasError(false);
        setIsCompleted(false);
        setCurrentStep(1);
        setCurrentMessage('Starting website setup...');

        console.log('🔄 Starting website initialization:', data.websiteId);

        const service = new WebsiteInitializationService(handleProgress);
        const success = await service.initializeWebsite(data);

        if (success) {
          setIsCompleted(true);
          
          // Wait a moment to show completion, then redirect
          setTimeout(() => {
            // Clear active initialization before redirect
            activeInitialization.current = {
              websiteId: null,
              promise: null
            };
            navigate(`/website-builder/${data.websiteId}`);
          }, 2000);

          toast({
            title: "Website Created Successfully",
            description: "Your website has been set up and is ready for customization.",
          });
        }

      } catch (error: any) {
        console.error('❌ Website initialization failed:', error);
        setHasError(true);
        
        toast({
          title: "Setup Failed",
          description: error.message || "Failed to initialize website. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
        // Clear active initialization after completion
        setTimeout(() => {
          activeInitialization.current = {
            websiteId: null,
            promise: null
          };
        }, 5000);
      }
    })();

    // Track the active initialization
    activeInitialization.current = {
      websiteId: data.websiteId,
      promise: initPromise
    };

    return initPromise;
  }, [handleProgress, navigate, toast, isCompleted]);

  const retryInitializeWebsite = useCallback((data: WebsiteInitializationData): void => {
    console.log('🔄 Retry initialization requested for:', data.websiteId);
    
    // Clear any existing state
    setHasError(false);
    setIsCompleted(false);
    activeInitialization.current = {
      websiteId: null,
      promise: null
    };
    
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
