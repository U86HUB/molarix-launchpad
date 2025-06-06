
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";
import { WebsiteCreationResult } from "./websiteOperations";

export const executeWebsiteCreation = async (
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
