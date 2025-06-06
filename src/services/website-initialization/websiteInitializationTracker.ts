
import { globalWebsiteCache } from '@/services/globalWebsiteCache';

interface InitializationEntry {
  timestamp: number;
  promise: Promise<boolean>;
  executionId: string;
  status: 'initializing' | 'completed' | 'failed';
}

const initializingWebsites = new Map<string, InitializationEntry>();

export const getInitializationTracker = () => {
  const hasActiveInitialization = (websiteId: string, executionId: string): boolean => {
    const existingInit = initializingWebsites.get(websiteId);
    
    if (existingInit && existingInit.status === 'initializing') {
      const timeSinceStart = Date.now() - existingInit.timestamp;
      console.warn(`🚫 [${executionId}] Website initialization already in progress for: ${websiteId}`);
      console.log(`⏱️ [${executionId}] Time since start: ${timeSinceStart}ms`);
      console.log(`🔍 [${executionId}] Original execution ID: ${existingInit.executionId}`);
      
      if (timeSinceStart < 60000) {
        return true;
      } else {
        console.log(`🧹 [${executionId}] Cleaning up old initialization promise`);
        initializingWebsites.delete(websiteId);
      }
    }
    
    return false;
  };

  const startTracking = (websiteId: string, promise: Promise<boolean>, executionId: string): void => {
    initializingWebsites.set(websiteId, {
      timestamp: Date.now(),
      promise,
      executionId,
      status: 'initializing'
    });
  };

  const updateStatus = (websiteId: string, executionId: string, status: 'completed' | 'failed'): void => {
    const tracking = initializingWebsites.get(websiteId);
    if (tracking && tracking.executionId === executionId) {
      initializingWebsites.set(websiteId, {
        ...tracking,
        status
      });
    }
  };

  const cleanupTracking = (websiteId: string, executionId: string): void => {
    setTimeout(() => {
      const current = initializingWebsites.get(websiteId);
      if (current && current.executionId === executionId) {
        initializingWebsites.delete(websiteId);
        console.log(`🧹 [${executionId}] Cleaned up initialization tracking for: ${websiteId}`);
      }
    }, 10000);
  };

  const getExistingPromise = (websiteId: string): Promise<boolean> | null => {
    const existing = initializingWebsites.get(websiteId);
    return existing?.promise || null;
  };

  return {
    hasActiveInitialization,
    startTracking,
    updateStatus,
    cleanupTracking,
    getExistingPromise
  };
};
