
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

// Global tracking to prevent multiple instances
const globalCreationTracker = new Set<string>();
const recentCreations = new Map<string, { websiteId: string; timestamp: number }>();

export const useWebsiteCreationGuard = (): WebsiteCreationGuard => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdWebsiteId, setCreatedWebsiteId] = useState<string | null>(null);
  const creationTracker = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  const canCreate = (websiteName: string): boolean => {
    console.log('🔍 useWebsiteCreationGuard.canCreate() called for:', websiteName);
    console.log('🔍 Current isCreating state:', isCreating);
    
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
    
    // Check local tracker
    if (creationTracker.current.has(normalizedName)) {
      console.warn('🚫 Website with this name already being created (local tracker), blocking duplicate');
      toast({
        title: "Duplicate Creation Blocked",
        description: "A website with this name is already being created.",
        variant: "destructive",
      });
      return false;
    }

    // Check global tracker
    if (globalCreationTracker.has(normalizedName)) {
      console.warn('🚫 Website with this name already being created (global tracker), blocking duplicate');
      toast({
        title: "Duplicate Creation Blocked",
        description: "A website with this name is already being created globally.",
        variant: "destructive",
      });
      return false;
    }

    // Check recent creations (within last 10 seconds)
    const recent = recentCreations.get(normalizedName);
    if (recent && (Date.now() - recent.timestamp) < 10000) {
      console.warn('🚫 Website with this name was recently created, blocking duplicate');
      toast({
        title: "Recently Created",
        description: "A website with this name was recently created.",
        variant: "destructive",
      });
      return false;
    }

    // Store in localStorage for cross-tab protection
    const recentWebsiteKey = `recent_website_${normalizedName}`;
    const storedData = localStorage.getItem(recentWebsiteKey);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (Date.now() - parsed.timestamp < 10000) {
        console.warn('🚫 Website with this name was recently created (localStorage), blocking duplicate');
        toast({
          title: "Recently Created",
          description: "A website with this name was recently created.",
          variant: "destructive",
        });
        return false;
      }
    }

    console.log('✅ Website creation allowed for:', normalizedName);
    return true;
  };

  const startCreation = (websiteName: string): void => {
    console.log('🔒 Starting website creation guard for:', websiteName);
    const normalizedName = websiteName.trim().toLowerCase();
    
    setIsCreating(true);
    setCreatedWebsiteId(null);
    creationTracker.current.add(normalizedName);
    globalCreationTracker.add(normalizedName);
    
    // Store in localStorage with timestamp
    const recentWebsiteKey = `recent_website_${normalizedName}`;
    localStorage.setItem(recentWebsiteKey, JSON.stringify({
      timestamp: Date.now(),
      name: websiteName
    }));
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
    globalCreationTracker.clear();
    
    // Clean up old localStorage entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recent_website_')) {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Date.now() - parsed.timestamp > 60000) { // Clean up after 1 minute
            localStorage.removeItem(key);
          }
        }
      }
    });
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
