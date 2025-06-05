
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebsiteCreationGuard {
  isCreating: boolean;
  createdWebsiteId: string | null;
  canCreate: (websiteName: string) => boolean;
  startCreation: (websiteName: string) => void;
  completeCreation: (websiteId: string) => void;
  resetCreation: () => void;
}

export const useWebsiteCreationGuard = (): WebsiteCreationGuard => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdWebsiteId, setCreatedWebsiteId] = useState<string | null>(null);
  const creationTracker = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  const canCreate = (websiteName: string): boolean => {
    if (isCreating) {
      console.warn('🚫 Website creation already in progress, blocking duplicate request');
      toast({
        title: "Creation in Progress",
        description: "Please wait for the current website creation to complete.",
        variant: "default",
      });
      return false;
    }

    const normalizedName = websiteName.trim().toLowerCase();
    if (creationTracker.current.has(normalizedName)) {
      console.warn('🚫 Website with this name already being created, blocking duplicate');
      toast({
        title: "Duplicate Creation Blocked",
        description: "A website with this name is already being created.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const startCreation = (websiteName: string): void => {
    console.log('🔒 Starting website creation guard for:', websiteName);
    setIsCreating(true);
    setCreatedWebsiteId(null);
    creationTracker.current.add(websiteName.trim().toLowerCase());
  };

  const completeCreation = (websiteId: string): void => {
    console.log('✅ Website creation completed with ID:', websiteId);
    setIsCreating(false);
    setCreatedWebsiteId(websiteId);
  };

  const resetCreation = (): void => {
    console.log('🔄 Resetting website creation guard');
    setIsCreating(false);
    setCreatedWebsiteId(null);
    creationTracker.current.clear();
  };

  return {
    isCreating,
    createdWebsiteId,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  };
};
