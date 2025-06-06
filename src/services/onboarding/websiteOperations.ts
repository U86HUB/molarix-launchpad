
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";
import { websiteCreationCache, checkForExistingWebsite } from "./websiteDeduplication";
import { executeWebsiteCreation } from "./websiteCreationExecutor";

export interface WebsiteCreationResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

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

  // Check for recent database entries
  const existingWebsiteResult = await checkForExistingWebsite(websiteName, clinicId, userId, executionId);
  if (existingWebsiteResult) {
    return existingWebsiteResult;
  }

  // Create the execution promise
  const creationPromise = executeWebsiteCreation(websiteData, clinicId, userId, executionId);
  
  // Cache it in both systems to prevent duplicates
  globalWebsiteCache.setActiveCreation(websiteName, userId, creationPromise, executionId);
  websiteCreationCache.set(websiteName, userId, creationPromise);

  return creationPromise;
};
