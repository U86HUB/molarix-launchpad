
import { globalWebsiteCache } from '@/services/globalWebsiteCache';

// Debug utility to help diagnose website creation issues
export const debugWebsiteCreation = {
  clearAllCaches: () => {
    console.log('🧹 Clearing all website creation caches');
    globalWebsiteCache.clearAll();
    
    // Clear localStorage website entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recent_website_')) {
        localStorage.removeItem(key);
        console.log('🧹 Cleared localStorage key:', key);
      }
    });
  },

  logCurrentState: () => {
    console.log('🔍 === WEBSITE CREATION DEBUG STATE ===');
    globalWebsiteCache.debugState();
    
    // Log localStorage state
    const keys = Object.keys(localStorage);
    const websiteKeys = keys.filter(key => key.startsWith('recent_website_'));
    console.log('🔍 localStorage website entries:', websiteKeys.length);
    websiteKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log(`🔍 ${key}:`, {
            name: parsed.name,
            age: Date.now() - parsed.timestamp,
            status: parsed.status
          });
        } catch (e) {
          console.log(`🔍 ${key}: Invalid data`);
        }
      }
    });
    console.log('🔍 === END DEBUG STATE ===');
  },

  testDuplicateDetection: (websiteName: string, userId: string) => {
    console.log('🧪 Testing duplicate detection for:', { websiteName, userId });
    
    const hasActive = globalWebsiteCache.hasActiveCreation(websiteName, userId);
    console.log('🧪 Global cache has active creation:', hasActive);
    
    const cacheKey = globalWebsiteCache.getCacheKey(websiteName, userId);
    console.log('🧪 Cache key:', cacheKey);
    
    // Test localStorage
    const recentKey = `recent_website_${websiteName.trim().toLowerCase()}`;
    const recentData = localStorage.getItem(recentKey);
    console.log('🧪 Recent localStorage entry:', recentData ? JSON.parse(recentData) : null);
  }
};

// Expose to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).debugWebsiteCreation = debugWebsiteCreation;
}
