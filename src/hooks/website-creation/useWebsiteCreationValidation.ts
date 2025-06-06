
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWebsiteCreationValidation = () => {
  const { toast } = useToast();

  const validateLocalStorage = useCallback((websiteName: string): boolean => {
    const normalizedName = websiteName.trim().toLowerCase();
    const recentWebsiteKey = `recent_website_${normalizedName}`;
    const storedData = localStorage.getItem(recentWebsiteKey);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Date.now() - parsed.timestamp < 15000) {
          console.warn('🚫 Website with this name was recently created (localStorage), blocking duplicate');
          toast({
            title: "Recently Created",
            description: "A website with this name was recently created.",
            variant: "destructive",
          });
          return false;
        }
      } catch (e) {
        localStorage.removeItem(recentWebsiteKey);
      }
    }

    return true;
  }, [toast]);

  const validateCreationState = useCallback((isCreating: boolean, isLocked: boolean): boolean => {
    if (isLocked) {
      console.warn('🚫 Creation blocked - instance is locked');
      toast({
        title: "Creation in Progress",
        description: "Please wait for the current website creation to complete.",
        variant: "default",
      });
      return false;
    }

    if (isCreating) {
      console.warn('🚫 Website creation already in progress, blocking duplicate request');
      toast({
        title: "Creation in Progress",
        description: "Please wait for the current website creation to complete.",
        variant: "default",
      });
      return false;
    }

    return true;
  }, [toast]);

  return {
    validateLocalStorage,
    validateCreationState
  };
};
