import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebsiteCreationGuard {
  isCreating: boolean;
  createdWebsiteId: string | null;
  canCreate: (websiteName: string) => boolean;
  startCreation: (websiteName: string) => void;
  completeCreation: (websiteId: string) => void;
  resetCreation: () => void;
}

// Enhanced global tracking with better isolation
const globalCreationTracker = new Map<string, {
  timestamp: number;
  websiteId?: string;
  status: 'creating' | 'completed' | 'failed';
}>();

const recentCreations = new Map<string, { websiteId: string; timestamp: number }>();

export const useWebsiteCreationGuard = (): WebsiteCreationGuard => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdWebsiteId, setCreatedWebsiteId] = useState<string | null>(null);
  const creationTracker = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  // Add instance-level state tracking
  const instanceState = useRef<{
    currentWebsiteName: string | null;
    creationStartTime: number | null;
    isLocked: boolean;
  }>({
    currentWebsiteName: null,
    creationStartTime: null,
    isLocked: false
  });

  const canCreate = useCallback((websiteName: string): boolean => {
    console.log('🔍 useWebsiteCreationGuard.canCreate() called for:', websiteName);
    console.log('🔍 Current guard state:', { 
      isCreating, 
      isLocked: instanceState.current.isLocked,
      currentWebsiteName: instanceState.current.currentWebsiteName 
    });
    
    // Instance-level checks first
    if (instanceState.current.isLocked) {
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

    const normalizedName = websiteName.trim().toLowerCase();
    
    // Check if same website is being created in this instance
    if (instanceState.current.currentWebsiteName === normalizedName) {
      console.warn('🚫 Same website already being created in this instance:', normalizedName);
      toast({
        title: "Duplicate Creation Blocked",
        description: "This website is already being created.",
        variant: "destructive",
      });
      return false;
    }

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

    // Check global tracker with enhanced status checking
    const globalEntry = globalCreationTracker.get(normalizedName);
    if (globalEntry) {
      const timeSinceStart = Date.now() - globalEntry.timestamp;
      if (globalEntry.status === 'creating' && timeSinceStart < 30000) {
        console.warn('🚫 Website with this name already being created globally:', normalizedName);
        toast({
          title: "Duplicate Creation Blocked",
          description: "A website with this name is already being created globally.",
          variant: "destructive",
        });
        return false;
      } else if (globalEntry.status === 'completed' && timeSinceStart < 10000) {
        console.warn('🚫 Website with this name was recently completed:', normalizedName);
        toast({
          title: "Recently Created",
          description: "A website with this name was recently created.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Check recent creations (within last 15 seconds)
    const recent = recentCreations.get(normalizedName);
    if (recent && (Date.now() - recent.timestamp) < 15000) {
      console.warn('🚫 Website with this name was recently created, blocking duplicate');
      toast({
        title: "Recently Created",
        description: "A website with this name was recently created.",
        variant: "destructive",
      });
      return false;
    }

    // Store in localStorage for cross-tab protection with enhanced data
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
        // Invalid stored data, remove it
        localStorage.removeItem(recentWebsiteKey);
      }
    }

    console.log('✅ Website creation allowed for:', normalizedName);
    return true;
  }, [isCreating, toast]);

  const startCreation = useCallback((websiteName: string): void => {
    console.log('🔒 Starting website creation guard for:', websiteName);
    const normalizedName = websiteName.trim().toLowerCase();
    const now = Date.now();
    
    // Lock the instance immediately
    instanceState.current = {
      currentWebsiteName: normalizedName,
      creationStartTime: now,
      isLocked: true
    };
    
    setIsCreating(true);
    setCreatedWebsiteId(null);
    creationTracker.current.add(normalizedName);
    
    // Update global tracker with status
    globalCreationTracker.set(normalizedName, {
      timestamp: now,
      status: 'creating'
    });
    
    // Store in localStorage with enhanced tracking
    const recentWebsiteKey = `recent_website_${normalizedName}`;
    localStorage.setItem(recentWebsiteKey, JSON.stringify({
      timestamp: now,
      name: websiteName,
      status: 'creating'
    }));
  }, []);

  const completeCreation = useCallback((websiteId: string): void => {
    console.log('✅ Website creation completed with ID:', websiteId);
    const currentName = instanceState.current.currentWebsiteName;
    
    setIsCreating(false);
    setCreatedWebsiteId(websiteId);
    
    if (currentName) {
      // Update global tracker status
      const existing = globalCreationTracker.get(currentName);
      if (existing) {
        globalCreationTracker.set(currentName, {
          ...existing,
          websiteId,
          status: 'completed'
        });
      }
      
      // Add to recent creations
      recentCreations.set(currentName, {
        websiteId,
        timestamp: Date.now()
      });
      
      // Update localStorage
      const recentWebsiteKey = `recent_website_${currentName}`;
      localStorage.setItem(recentWebsiteKey, JSON.stringify({
        timestamp: Date.now(),
        name: currentName,
        websiteId,
        status: 'completed'
      }));
    }
    
    // Keep instance locked briefly to prevent immediate re-creation
    setTimeout(() => {
      instanceState.current.isLocked = false;
      console.log('🔓 Instance creation lock released');
    }, 2000);
  }, []);

  const resetCreation = useCallback((): void => {
    console.log('🔄 Resetting website creation guard');
    const currentName = instanceState.current.currentWebsiteName;
    
    setIsCreating(false);
    setCreatedWebsiteId(null);
    creationTracker.current.clear();
    
    // Reset instance state
    instanceState.current = {
      currentWebsiteName: null,
      creationStartTime: null,
      isLocked: false
    };
    
    // Update global tracker if there was a current creation
    if (currentName) {
      const existing = globalCreationTracker.get(currentName);
      if (existing) {
        globalCreationTracker.set(currentName, {
          ...existing,
          status: 'failed'
        });
      }
    }
    
    // Clean up old localStorage entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recent_website_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Date.now() - parsed.timestamp > 60000) { // Clean up after 1 minute
              localStorage.removeItem(key);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      }
    });
    
    // Clean up old global tracker entries
    for (const [key, value] of globalCreationTracker.entries()) {
      if (Date.now() - value.timestamp > 60000) {
        globalCreationTracker.delete(key);
      }
    }
  }, []);

  return {
    isCreating,
    createdWebsiteId,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  };
};
