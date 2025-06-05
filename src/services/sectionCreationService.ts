
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/website';
import { sectionTemplates } from '@/data/sectionTemplates';

export class SectionCreationService {
  static async createDefaultSections(websiteId: string, templateType: string): Promise<void> {
    // Define default sections based on template type
    const defaultSectionTypes: Section['type'][] = [
      'hero',
      'about', 
      'services',
      'testimonials',
      'contact'
    ];

    const sectionsToCreate = defaultSectionTypes.map((type, index) => ({
      website_id: websiteId,
      type,
      position: index,
      settings: this.getDefaultSectionSettings(type, templateType),
      is_visible: true,
    }));

    const { error } = await supabase
      .from('sections')
      .insert(sectionsToCreate);

    if (error) {
      console.error('Error creating default sections:', error);
      throw error;
    }

    console.log('Created default sections for website:', websiteId);
  }

  private static getDefaultSectionSettings(type: Section['type'], templateType: string): Record<string, any> {
    const template = sectionTemplates.find(t => t.type === type);
    if (!template) return {};

    // Template-specific default settings
    const baseSettings = { ...template.defaultSettings };

    // Customize based on template type
    switch (templateType) {
      case 'template-a':
        if (type === 'hero') {
          baseSettings.backgroundStyle = 'gradient';
        }
        break;
      case 'template-b':
        if (type === 'hero') {
          baseSettings.backgroundStyle = 'image';
        }
        break;
      case 'template-c':
        if (type === 'hero') {
          baseSettings.backgroundStyle = 'solid';
        }
        break;
    }

    return baseSettings;
  }
}
