
import { supabase } from '@/integrations/supabase/client';
import { WebsiteInitializationData } from './websiteInitializationService';

export class TemplateSettingsService {
  static async applyTemplateSettings(websiteId: string, data: WebsiteInitializationData): Promise<void> {
    const updates: any = {
      template_type: data.templateType,
      primary_color: data.primaryColor,
      font_style: data.fontStyle,
      updated_at: new Date().toISOString(),
    };

    // Add logo URL if provided
    if (data.logoUrl) {
      updates.logo_url = data.logoUrl;
    }

    const { error } = await supabase
      .from('websites')
      .update(updates)
      .eq('id', websiteId);

    if (error) {
      console.error('Error applying template settings:', error);
      throw error;
    }

    console.log('Applied template settings for website:', websiteId);
  }
}
