
import { supabase } from '@/integrations/supabase/client';
import { SectionCreationService } from './sectionCreationService';
import { TemplateSettingsService } from './templateSettingsService';
import { AiCopyCreationService } from './aiCopyCreationService';

export interface InitializationProgress {
  step: number;
  message: string;
  completed: boolean;
}

export interface WebsiteInitializationData {
  websiteId: string;
  templateType: string;
  primaryColor: string;
  fontStyle: string;
  logoUrl?: string;
  clinicData?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export class WebsiteInitializationService {
  private onProgress?: (progress: InitializationProgress) => void;

  constructor(onProgress?: (progress: InitializationProgress) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(step: number, message: string, completed: boolean = false) {
    if (this.onProgress) {
      this.onProgress({ step, message, completed });
    }
  }

  async initializeWebsite(data: WebsiteInitializationData): Promise<boolean> {
    try {
      console.log('Starting website initialization for:', data.websiteId);

      // Step 1: Generate website structure
      this.updateProgress(1, "Generating website structure…");
      await SectionCreationService.createDefaultSections(data.websiteId, data.templateType);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Allow users to see progress

      // Step 2: Apply template and styling
      this.updateProgress(2, "Applying selected template and color scheme…");
      await TemplateSettingsService.applyTemplateSettings(data.websiteId, data);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Generate AI content
      this.updateProgress(3, "Generating AI-powered content…");
      await AiCopyCreationService.generateInitialContent(data.websiteId, data.clinicData);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 4: Finalize layout
      this.updateProgress(4, "Finalizing layout…");
      await this.finalizeWebsiteSetup(data.websiteId);
      await new Promise(resolve => setTimeout(resolve, 500));

      this.updateProgress(4, "Website ready!", true);
      return true;

    } catch (error) {
      console.error('Website initialization failed:', error);
      throw error;
    }
  }

  private async finalizeWebsiteSetup(websiteId: string): Promise<void> {
    // Update website status to indicate it's fully initialized
    const { error } = await supabase
      .from('websites')
      .update({ 
        status: 'draft',
        updated_at: new Date().toISOString() 
      })
      .eq('id', websiteId);

    if (error) {
      console.error('Error finalizing website setup:', error);
      throw error;
    }

    console.log('Finalized website setup for:', websiteId);
  }
}
