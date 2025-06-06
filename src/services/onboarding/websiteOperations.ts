
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/errorHandling";
import { UnifiedOnboardingData } from "@/hooks/useUnifiedOnboardingData";

export interface WebsiteCreationResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

// Enhanced tracking with timestamps
const creatingWebsites = new Map<string, { timestamp: number; promise: Promise<WebsiteCreationResult> }>();

export const createWebsite = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string
): Promise<WebsiteCreationResult> => {
  console.log('🔄 createWebsite() called with:', { 
    websiteName: websiteData.name, 
    clinicId, 
    userId,
    timestamp: Date.now()
  });

  const websiteKey = `${userId}-${clinicId}-${websiteData.name.trim().toLowerCase()}`;
  
  // Check if this exact website is already being created
  const existingCreation = creatingWebsites.get(websiteKey);
  if (existingCreation) {
    const timeSinceStart = Date.now() - existingCreation.timestamp;
    console.warn('🚫 Duplicate website creation detected for:', websiteKey, 'Time since start:', timeSinceStart);
    
    if (timeSinceStart < 30000) { // Within 30 seconds
      console.log('🔄 Returning existing promise for:', websiteKey);
      return existingCreation.promise;
    } else {
      console.log('🧹 Cleaning up old creation promise for:', websiteKey);
      creatingWebsites.delete(websiteKey);
    }
  }

  // Check for recent database entries
  try {
    const { data: existingWebsites, error: checkError } = await supabase
      .from('websites')
      .select('id, name, created_at')
      .eq('name', websiteData.name.trim())
      .eq('clinic_id', clinicId)
      .eq('created_by', userId)
      .gte('created_at', new Date(Date.now() - 10000).toISOString()); // Last 10 seconds

    if (checkError) {
      console.error('❌ Error checking for existing websites:', checkError);
    } else if (existingWebsites && existingWebsites.length > 0) {
      console.warn('🚫 Recent website with same name found:', existingWebsites[0]);
      return { 
        success: true, 
        websiteId: existingWebsites[0].id,
        error: 'Website with this name was recently created'
      };
    }
  } catch (error) {
    console.error('❌ Error during duplicate check:', error);
  }

  // Create and store the promise
  const creationPromise = executeWebsiteCreation(websiteData, clinicId, userId, websiteKey);
  creatingWebsites.set(websiteKey, {
    timestamp: Date.now(),
    promise: creationPromise
  });

  try {
    const result = await creationPromise;
    return result;
  } finally {
    // Clean up tracking after a delay
    setTimeout(() => {
      creatingWebsites.delete(websiteKey);
    }, 5000);
  }
};

const executeWebsiteCreation = async (
  websiteData: UnifiedOnboardingData['website'],
  clinicId: string,
  userId: string,
  websiteKey: string
): Promise<WebsiteCreationResult> => {
  try {
    console.log('📝 Executing website creation for:', websiteKey);
    
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
      
      // Check if it's a duplicate key error
      if (websiteError.code === '23505') {
        console.log('🔍 Duplicate key error, checking for existing website...');
        const { data: existingWebsite } = await supabase
          .from('websites')
          .select('id')
          .eq('name', websiteData.name.trim())
          .eq('clinic_id', clinicId)
          .eq('created_by', userId)
          .single();
        
        if (existingWebsite) {
          console.log('✅ Found existing website with ID:', existingWebsite.id);
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
  }
};
