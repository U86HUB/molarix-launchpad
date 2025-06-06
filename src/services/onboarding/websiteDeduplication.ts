
import { supabase } from "@/integrations/supabase/client";
import { WebsiteCreationResult } from "./websiteOperations";

// Global deduplication cache for createWebsite calls
const websiteCreationCache = (() => {
  const cache = new Map<string, Promise<WebsiteCreationResult>>();
  
  const getCacheKey = (websiteName: string, userId: string): string => {
    return `${userId}:${websiteName.trim().toLowerCase()}`;
  };
  
  const set = (websiteName: string, userId: string, promise: Promise<WebsiteCreationResult>): Promise<WebsiteCreationResult> => {
    const key = getCacheKey(websiteName, userId);
    console.log(`🔒 [CACHE] Storing createWebsite promise for: ${key}`);
    
    cache.set(key, promise);
    
    // Auto-cleanup on completion
    promise.finally(() => {
      setTimeout(() => {
        if (cache.get(key) === promise) {
          cache.delete(key);
          console.log(`🧹 [CACHE] Cleaned up createWebsite cache for: ${key}`);
        }
      }, 10000); // 10 second cleanup delay
    });
    
    return promise;
  };
  
  const get = (websiteName: string, userId: string): Promise<WebsiteCreationResult> | undefined => {
    const key = getCacheKey(websiteName, userId);
    return cache.get(key);
  };
  
  const has = (websiteName: string, userId: string): boolean => {
    const key = getCacheKey(websiteName, userId);
    return cache.has(key);
  };
  
  return { set, get, has };
})();

export const checkForExistingWebsite = async (
  websiteName: string,
  clinicId: string,
  userId: string,
  executionId: string
): Promise<WebsiteCreationResult | null> => {
  try {
    const { data: existingWebsites, error: checkError } = await supabase
      .from('websites')
      .select('id, name, created_at')
      .eq('name', websiteName)
      .eq('clinic_id', clinicId)
      .eq('created_by', userId)
      .gte('created_at', new Date(Date.now() - 30000).toISOString());

    if (checkError) {
      console.error(`❌ [${executionId}] Error checking for existing websites:`, checkError);
      return null;
    }
    
    if (existingWebsites && existingWebsites.length > 0) {
      console.warn(`🚫 [${executionId}] Recent website with same name found:`, existingWebsites[0]);
      console.log(`🔍 [${executionId}] Existing website age:`, Date.now() - new Date(existingWebsites[0].created_at).getTime(), 'ms');
      
      return { 
        success: true, 
        websiteId: existingWebsites[0].id,
        error: 'Website with this name was recently created'
      };
    }
  } catch (error) {
    console.error(`❌ [${executionId}] Error during duplicate check:`, error);
  }
  
  return null;
};

export { websiteCreationCache };
