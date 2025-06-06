
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";

export interface WebsiteCreationResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

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

export const createWebsite = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string
): Promise<WebsiteCreationResult> => {
  const executionId = globalWebsiteCache.generateExecutionId();
  const websiteName = websiteData.name.trim();
  
  // DEBUG: Log all createWebsite calls with stack trace
  console.warn(`[DEBUG] [${executionId}] createWebsite() called from:`, new Error().stack?.split('\n').slice(0, 5).join('\n'));
  console.log(`🔄 [${executionId}] createWebsite() called`);
  console.log(`🔍 [${executionId}] Website name: "${websiteName}"`);
  console.log(`🔍 [${executionId}] Clinic ID: ${clinicId}`);
  console.log(`🔍 [${executionId}] User ID: ${userId}`);

  // Check global deduplication cache first
  if (websiteCreationCache.has(websiteName, userId)) {
    const existingPromise = websiteCreationCache.get(websiteName, userId);
    if (existingPromise) {
      console.warn(`⚠️ [${executionId}] Returning cached createWebsite promise for: ${websiteName}`);
      return existingPromise;
    }
  }

  // Check global website cache
  if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
    console.warn(`🚫 [${executionId}] Duplicate website creation blocked by global cache`);
    globalWebsiteCache.debugState();
    
    const existingPromise = globalWebsiteCache.getActiveCreation(websiteName, userId);
    if (existingPromise) {
      console.log(`🔄 [${executionId}] Returning existing website creation promise`);
      return existingPromise;
    }
  }

  // Check for recent database entries (within last 30 seconds to catch post-redirect duplicates)
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
    } else if (existingWebsites && existingWebsites.length > 0) {
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

  // Create the execution promise
  const creationPromise = executeWebsiteCreation(websiteData, clinicId, userId, executionId);
  
  // Cache it in both systems to prevent duplicates
  globalWebsiteCache.setActiveCreation(websiteName, userId, creationPromise, executionId);
  websiteCreationCache.set(websiteName, userId, creationPromise);

  return creationPromise;
};

const executeWebsiteCreation = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string,
  executionId: string
): Promise<WebsiteCreationResult> => {
  let cancelled = false;

  // Set up cancellation handler
  const cancelHandler = () => {
    cancelled = true;
    console.log(`🚫 [${executionId}] Website creation cancelled`);
  };

  // Add to global cleanup
  const cleanup = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', cancelHandler);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cancelHandler);
  }

  try {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Website creation was cancelled before execution`);
      return { success: false, error: 'Website creation was cancelled' };
    }

    console.log(`📝 [${executionId}] Executing website creation in database...`);
    
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .insert({
        name: websiteData.name.trim(),
        clinic_id: clinicId,
        template_type: websiteData.selectedTemplate,
        primary_color: websiteData.primaryColor,
        font_style: websiteData.fontStyle,
        status: 'draft',
        created_by: userId,
      })
      .select()
      .single();

    if (cancelled) {
      console.log(`🚫 [${executionId}] Website creation was cancelled during execution`);
      return { success: false, error: 'Website creation was cancelled' };
    }

    if (websiteError) {
      console.error(`❌ [${executionId}] Website creation error:`, websiteError);
      
      // Handle duplicate key constraint violation (23505)
      if (websiteError.code === '23505') {
        console.log(`🔍 [${executionId}] Duplicate key error detected, checking for existing website...`);
        
        try {
          const { data: existingWebsite, error: fetchError } = await supabase
            .from('websites')
            .select('id')
            .eq('name', websiteData.name.trim())
            .eq('clinic_id', clinicId)
            .eq('created_by', userId)
            .maybeSingle();
          
          if (!fetchError && existingWebsite) {
            console.log(`✅ [${executionId}] Found existing website with ID: ${existingWebsite.id}`);
            return { success: true, websiteId: existingWebsite.id };
          }
        } catch (fetchError) {
          console.error(`❌ [${executionId}] Error fetching existing website:`, fetchError);
        }
      }
      
      handleSupabaseError(
        websiteError,
        {
          operation: 'create website during onboarding',
          table: 'websites',
          userId,
          additionalData: { 
            websiteName: websiteData.name,
            clinicId,
            executionId 
          }
        },
        'Failed to create website. Please try again.'
      );
      return { success: false, error: websiteError.message };
    }

    console.log(`✅ [${executionId}] Website created successfully with ID: ${website.id}`);
    console.log(`🔍 [${executionId}] Website creation timestamp:`, website.created_at);
    
    return { success: true, websiteId: website.id };
  } catch (error: any) {
    if (cancelled) {
      console.log(`🚫 [${executionId}] Website creation was cancelled during error handling`);
      return { success: false, error: 'Website creation was cancelled' };
    }
    
    console.error(`❌ [${executionId}] Error creating website:`, error);
    return { success: false, error: error.message };
  } finally {
    cleanup();
  }
};
