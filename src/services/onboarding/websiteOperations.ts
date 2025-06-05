
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";

export interface WebsiteCreationResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

// Track websites being created to prevent duplicates
const creatingWebsites = new Set<string>();

export const createWebsite = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string
): Promise<WebsiteCreationResult> => {
  const websiteKey = `${userId}-${clinicId}-${websiteData.name.trim().toLowerCase()}`;
  
  // Check if this exact website is already being created
  if (creatingWebsites.has(websiteKey)) {
    console.warn('🚫 Duplicate website creation detected for:', websiteKey);
    return { success: false, error: 'Website creation already in progress' };
  }

  try {
    creatingWebsites.add(websiteKey);
    console.log('🔄 Creating website:', websiteData.name);
    
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
      console.error('❌ Website creation error:', websiteError);
      handleSupabaseError(
        websiteError,
        {
          operation: 'create website during onboarding',
          table: 'websites',
          userId,
          additionalData: { 
            websiteName: websiteData.name,
            clinicId 
          }
        },
        'Failed to create website. Please try again.'
      );
      return { success: false, error: websiteError.message };
    }

    console.log('✅ Website created successfully:', website.id);
    return { success: true, websiteId: website.id };
  } catch (error: any) {
    console.error('❌ Error creating website:', error);
    return { success: false, error: error.message };
  } finally {
    // Clean up tracking
    creatingWebsites.delete(websiteKey);
  }
};
