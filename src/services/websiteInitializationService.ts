
import { supabase } from '@/integrations/supabase/client';

export interface WebsiteInitializationData {
  websiteId: string;
  templateType: string;
  primaryColor: string;
  fontStyle: string;
  clinicData: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  logoUrl?: string;
}

export interface InitializationProgress {
  step: number;
  message: string;
  completed: boolean;
}

// Track websites being initialized to prevent duplicates
const initializingWebsites = new Set<string>();

export class WebsiteInitializationService {
  private progressCallback: (progress: InitializationProgress) => void;

  constructor(progressCallback: (progress: InitializationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  async initializeWebsite(data: WebsiteInitializationData): Promise<boolean> {
    // Check if this website is already being initialized
    if (initializingWebsites.has(data.websiteId)) {
      console.warn('🚫 Website initialization already in progress for:', data.websiteId);
      this.progressCallback({
        step: 4,
        message: 'Initialization already in progress',
        completed: false
      });
      return false;
    }

    try {
      initializingWebsites.add(data.websiteId);
      console.log('🔄 Starting website initialization for:', data.websiteId);

      // Step 1: Verify website exists
      this.progressCallback({
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
        throw new Error('Website not found');
      }

      // Step 2: Apply template settings
      this.progressCallback({
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

      // Step 3: Create default sections if none exist
      this.progressCallback({
        step: 3,
        message: 'Setting up website sections...',
        completed: false
      });

      const { data: existingSections } = await supabase
        .from('sections')
        .select('id')
        .eq('website_id', data.websiteId);

      if (!existingSections || existingSections.length === 0) {
        const defaultSections = [
          { type: 'hero', position: 0 },
          { type: 'about', position: 1 },
          { type: 'services', position: 2 },
          { type: 'contact', position: 3 }
        ];

        // Insert sections one by one to avoid conflicts
        for (const section of defaultSections) {
          try {
            await supabase
              .from('sections')
              .insert({
                website_id: data.websiteId,
                type: section.type,
                position: section.position,
                settings: {},
                is_visible: true
              });
          } catch (sectionError) {
            console.warn(`⚠️ Section ${section.type} creation failed (may already exist):`, sectionError);
          }
        }
      }

      // Step 4: Complete initialization
      this.progressCallback({
        step: 4,
        message: 'Website initialization complete!',
        completed: true
      });

      return true;
    } catch (error) {
      console.error('❌ Website initialization failed:', error);
      this.progressCallback({
        step: 4,
        message: 'Initialization failed',
        completed: false
      });
      throw error;
    } finally {
      // Clean up tracking
      initializingWebsites.delete(data.websiteId);
    }
  }
}
