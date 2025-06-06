
import { useState, useCallback } from 'react';
import { useWebsiteCreationTracker } from './website-creation/useWebsiteCreationTracker';
import { useWebsiteCreationValidation } from './website-creation/useWebsiteCreationValidation';

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

  const {
    hasActiveCreation,
    startTracking,
    completeTracking,
    resetTracking,
    isLocked,
    currentWebsiteName
  } = useWebsiteCreationTracker();

  const {
    validateLocalStorage,
    validateCreationState
  } = useWebsiteCreationValidation();

  const canCreate = useCallback((websiteName: string): boolean => {
    console.log('🔍 useWebsiteCreationGuard.canCreate() called for:', websiteName);
    console.log('🔍 Current guard state:', { isCreating, isLocked, currentWebsiteName });
    
    if (!validateCreationState(isCreating, isLocked)) {
      return false;
    }

    if (hasActiveCreation(websiteName)) {
      return false;
    }

    if (!validateLocalStorage(websiteName)) {
      return false;
    }

    console.log('✅ Website creation allowed for:', websiteName);
    return true;
  }, [isCreating, isLocked, currentWebsiteName, hasActiveCreation, validateCreationState, validateLocalStorage]);

  const startCreation = useCallback((websiteName: string): void => {
    console.log('🔒 Starting website creation guard for:', websiteName);
    const normalizedName = websiteName.trim().toLowerCase();
    const now = Date.now();
    
    setIsCreating(true);
    setCreatedWebsiteId(null);
    startTracking(websiteName);
    
    const recentWebsiteKey = `recent_website_${normalizedName}`;
    localStorage.setItem(recentWebsiteKey, JSON.stringify({
      timestamp: now,
      name: websiteName,
      status: 'creating'
    }));
  }, [startTracking]);

  const completeCreation = useCallback((websiteId: string): void => {
    console.log('✅ Website creation completed with ID:', websiteId);
    
    setIsCreating(false);
    setCreatedWebsiteId(websiteId);
    
    if (currentWebsiteName) {
      completeTracking(currentWebsiteName, websiteId);
      
      const recentWebsiteKey = `recent_website_${currentWebsiteName}`;
      localStorage.setItem(recentWebsiteKey, JSON.stringify({
        timestamp: Date.now(),
        name: currentWebsiteName,
        websiteId,
        status: 'completed'
      }));
    }
  }, [currentWebsiteName, completeTracking]);

  const resetCreation = useCallback((): void => {
    console.log('🔄 Resetting website creation guard');
    
    setIsCreating(false);
    setCreatedWebsiteId(null);
    resetTracking();
  }, [resetTracking]);

  return {
    isCreating,
    createdWebsiteId,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  };
};
