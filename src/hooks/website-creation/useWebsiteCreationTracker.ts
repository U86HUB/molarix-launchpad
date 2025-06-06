
import { useRef } from 'react';

interface CreationState {
  currentWebsiteName: string | null;
  creationStartTime: number | null;
  isLocked: boolean;
}

interface CreationEntry {
  timestamp: number;
  websiteId?: string;
  status: 'creating' | 'completed' | 'failed';
}

// Enhanced global tracking with better isolation
const globalCreationTracker = new Map<string, CreationEntry>();
const recentCreations = new Map<string, { websiteId: string; timestamp: number }>();

export const useWebsiteCreationTracker = () => {
  const instanceState = useRef<CreationState>({
    currentWebsiteName: null,
    creationStartTime: null,
    isLocked: false
  });

  const hasActiveCreation = (websiteName: string): boolean => {
    const normalizedName = websiteName.trim().toLowerCase();
    
    // Check instance state
    if (instanceState.current.isLocked) {
      return true;
    }

    if (instanceState.current.currentWebsiteName === normalizedName) {
      return true;
    }

    // Check global tracker
    const globalEntry = globalCreationTracker.get(normalizedName);
    if (globalEntry) {
      const timeSinceStart = Date.now() - globalEntry.timestamp;
      if (globalEntry.status === 'creating' && timeSinceStart < 30000) {
        return true;
      } else if (globalEntry.status === 'completed' && timeSinceStart < 10000) {
        return true;
      }
    }

    // Check recent creations
    const recent = recentCreations.get(normalizedName);
    if (recent && (Date.now() - recent.timestamp) < 15000) {
      return true;
    }

    return false;
  };

  const startTracking = (websiteName: string): void => {
    const normalizedName = websiteName.trim().toLowerCase();
    const now = Date.now();
    
    instanceState.current = {
      currentWebsiteName: normalizedName,
      creationStartTime: now,
      isLocked: true
    };
    
    globalCreationTracker.set(normalizedName, {
      timestamp: now,
      status: 'creating'
    });
  };

  const completeTracking = (websiteName: string, websiteId: string): void => {
    const normalizedName = websiteName.trim().toLowerCase();
    
    const existing = globalCreationTracker.get(normalizedName);
    if (existing) {
      globalCreationTracker.set(normalizedName, {
        ...existing,
        websiteId,
        status: 'completed'
      });
    }
    
    recentCreations.set(normalizedName, {
      websiteId,
      timestamp: Date.now()
    });

    setTimeout(() => {
      instanceState.current.isLocked = false;
    }, 2000);
  };

  const resetTracking = (): void => {
    const currentName = instanceState.current.currentWebsiteName;
    
    instanceState.current = {
      currentWebsiteName: null,
      creationStartTime: null,
      isLocked: false
    };
    
    if (currentName) {
      const existing = globalCreationTracker.get(currentName);
      if (existing) {
        globalCreationTracker.set(currentName, {
          ...existing,
          status: 'failed'
        });
      }
    }

    // Clean up old entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recent_website_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Date.now() - parsed.timestamp > 60000) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      }
    });
    
    for (const [key, value] of globalCreationTracker.entries()) {
      if (Date.now() - value.timestamp > 60000) {
        globalCreationTracker.delete(key);
      }
    }
  };

  return {
    hasActiveCreation,
    startTracking,
    completeTracking,
    resetTracking,
    isLocked: instanceState.current.isLocked,
    currentWebsiteName: instanceState.current.currentWebsiteName
  };
};
