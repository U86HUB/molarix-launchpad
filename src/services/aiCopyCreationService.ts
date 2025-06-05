
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/website';
import { WebsiteInitializationData } from './websiteInitializationService';
import { ContentGenerationService } from './contentGenerationService';

export class AiCopyCreationService {
  static async generateInitialContent(websiteId: string, clinicData?: WebsiteInitializationData['clinicData']): Promise<void> {
    // Get the created sections
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('website_id', websiteId)
      .order('position');

    if (sectionsError) {
      console.error('Error fetching sections for content generation:', sectionsError);
      throw sectionsError;
    }

    // Generate basic content for each section
    for (const section of sections || []) {
      try {
        // Type assertion to ensure the section type is properly typed
        const sectionType = section.type as Section['type'];
        const content = ContentGenerationService.generateSectionContent(sectionType, clinicData);
        
        // Create AI copy entry
        const { data: copyData, error: copyError } = await supabase
          .from('ai_generated_copy')
          .insert({
            session_id: websiteId, // Using website_id as session_id for now
            type: section.type,
            data: content,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();

        if (copyError) {
          console.error('Error creating AI copy:', copyError);
          continue; // Don't fail the whole process for one section
        }

        // Link the copy to the section
        await supabase
          .from('sections')
          .update({ copy_id: copyData.id })
          .eq('id', section.id);

      } catch (error) {
        console.error(`Error generating content for section ${section.type}:`, error);
        // Continue with other sections
      }
    }

    console.log('Generated initial content for website:', websiteId);
  }
}
