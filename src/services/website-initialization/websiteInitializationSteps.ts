
import { supabase } from '@/integrations/supabase/client';
import { WebsiteInitializationData, InitializationProgress } from '../websiteInitializationService';

export const executeInitializationSteps = async (
  data: WebsiteInitializationData,
  executionId: string,
  progressCallback: (progress: InitializationProgress) => void
): Promise<boolean> => {
  try {
    console.log(`🔄 [${executionId}] Starting website initialization for: ${data.websiteId}`);

    // Step 1: Verify website exists
    progressCallback({
      step: 1,
      message: 'Verifying website configuration...',
      completed: false
    });

    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', data.websiteId)
      .single();

    if (websiteError || !website) {
      throw new Error(`Website not found: ${websiteError?.message || 'Unknown error'}`);
    }

    console.log(`✅ [${executionId}] Website verified`);

    // Step 2: Apply template settings
    progressCallback({
      step: 2,
      message: 'Applying template settings...',
      completed: false
    });

    const { error: updateError } = await supabase
      .from('websites')
      .update({
        template_type: data.templateType,
        primary_color: data.primaryColor,
        font_style: data.fontStyle,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.websiteId);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ [${executionId}] Template settings applied`);

    // Step 3: Create default sections if none exist
    progressCallback({
      step: 3,
      message: 'Setting up website sections...',
      completed: false
    });

    const { data: existingSections } = await supabase
      .from('sections')
      .select('id, type, position')
      .eq('website_id', data.websiteId)
      .order('position');

    console.log(`🔍 [${executionId}] Existing sections count: ${existingSections?.length || 0}`);

    if (!existingSections || existingSections.length === 0) {
      await createDefaultSections(data.websiteId, executionId);
    } else {
      console.log(`✅ [${executionId}] Website already has sections, skipping creation`);
    }

    // Step 4: Complete initialization
    progressCallback({
      step: 4,
      message: 'Website initialization complete!',
      completed: true
    });

    console.log(`✅ [${executionId}] Website initialization completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ [${executionId}] Website initialization failed:`, error);
    progressCallback({
      step: 4,
      message: 'Initialization failed',
      completed: false
    });
    throw error;
  }
};

const createDefaultSections = async (websiteId: string, executionId: string): Promise<void> => {
  const defaultSections = [
    { type: 'hero', position: 0 },
    { type: 'about', position: 1 },
    { type: 'services', position: 2 },
    { type: 'contact', position: 3 }
  ];

  console.log(`📝 [${executionId}] Creating default sections`);

  for (const section of defaultSections) {
    try {
      const { data: existingSection } = await supabase
        .from('sections')
        .select('id')
        .eq('website_id', websiteId)
        .eq('position', section.position)
        .maybeSingle();

      if (existingSection) {
        console.log(`⚠️ [${executionId}] Section at position ${section.position} already exists, skipping`);
        continue;
      }

      const { error: sectionError } = await supabase
        .from('sections')
        .insert({
          website_id: websiteId,
          type: section.type,
          position: section.position,
          settings: {},
          is_visible: true
        });

      if (sectionError) {
        if (sectionError.code === '23505' && sectionError.message.includes('sections_website_position_unique')) {
          console.warn(`⚠️ [${executionId}] Section ${section.type} position ${section.position} already exists (race condition), continuing`);
        } else {
          console.error(`❌ [${executionId}] Section ${section.type} creation failed:`, sectionError);
        }
      } else {
        console.log(`✅ [${executionId}] Section ${section.type} created successfully`);
      }
    } catch (sectionError) {
      console.warn(`⚠️ [${executionId}] Section ${section.type} creation failed:`, sectionError);
    }
  }
};
