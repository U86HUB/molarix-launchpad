
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { globalWebsiteCache } from "@/services/globalWebsiteCache";

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
  
  console.log(`🔄 [${executionId}] createWebsite() called`);
  console.log(`🔍 [${executionId}] Website name: "${websiteName}"`);
  console.log(`🔍 [${executionId}] Clinic ID: ${clinicId}`);
  console.log(`🔍 [${executionId}] User ID: ${userId}`);

  // Check global cache first
  if (globalWebsiteCache.hasActiveCreation(websiteName, userId)) {
    console.warn(`🚫 [${executionId}] Duplicate website creation blocked by global cache`);
    const existingPromise = globalWebsiteCache.getActiveCreation(websiteName, userId);
    if (existingPromise) {
      console.log(`🔄 [${executionId}] Returning existing website creation promise`);
      return existingPromise;
    }
  }

  // Check for recent database entries (within last 10 seconds)
  try {
    const { data: existingWebsites, error: checkError } = await supabase
      .from('websites')
      .select('id, name, created_at')
      .eq('name', websiteName)
      .eq('clinic_id', clinicId)
      .eq('created_by', userId)
      .gte('created_at', new Date(Date.now() - 10000).toISOString());

    if (checkError) {
      console.error(`❌ [${executionId}] Error checking for existing websites:`, checkError);
    } else if (existingWebsites && existingWebsites.length > 0) {
      console.warn(`🚫 [${executionId}] Recent website with same name found:`, existingWebsites[0]);
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
  
  // Cache it globally
  globalWebsiteCache.setActiveCreation(websiteName, userId, creationPromise, executionId);

  return creationPromise;
};

const executeWebsiteCreation = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string,
  executionId: string
): Promise<WebsiteCreationResult> => {
  try {
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

    if (websiteError) {
      console.error(`❌ [${executionId}] Website creation error:`, websiteError);
      
      // Check if it's a duplicate key error
      if (websiteError.code === '23505') {
        console.log(`🔍 [${executionId}] Duplicate key error, checking for existing website...`);
        const { data: existingWebsite } = await supabase
          .from('websites')
          .select('id')
          .eq('name', websiteData.name.trim())
          .eq('clinic_id', clinicId)
          .eq('created_by', userId)
          .single();
        
        if (existingWebsite) {
          console.log(`✅ [${executionId}] Found existing website with ID: ${existingWebsite.id}`);
          return { success: true, websiteId: existingWebsite.id };
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
    return { success: true, websiteId: website.id };
  } catch (error: any) {
    console.error(`❌ [${executionId}] Error creating website:`, error);
    return { success: false, error: error.message };
  }
};
