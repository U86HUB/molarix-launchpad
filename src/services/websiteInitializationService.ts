
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/website';
import { sectionTemplates } from '@/data/sectionTemplates';

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
      await this.createDefaultSections(data.websiteId, data.templateType);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Allow users to see progress

      // Step 2: Apply template and styling
      this.updateProgress(2, "Applying selected template and color scheme…");
      await this.applyTemplateSettings(data.websiteId, data);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Generate AI content
      this.updateProgress(3, "Generating AI-powered content…");
      await this.generateInitialContent(data.websiteId, data.clinicData);
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

  private async createDefaultSections(websiteId: string, templateType: string): Promise<void> {
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

  private getDefaultSectionSettings(type: Section['type'], templateType: string): Record<string, any> {
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

  private async applyTemplateSettings(websiteId: string, data: WebsiteInitializationData): Promise<void> {
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

  private async generateInitialContent(websiteId: string, clinicData?: WebsiteInitializationData['clinicData']): Promise<void> {
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
        const content = this.generateSectionContent(section.type, clinicData);
        
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

  private generateSectionContent(sectionType: Section['type'], clinicData?: WebsiteInitializationData['clinicData']): any {
    const clinicName = clinicData?.name || 'Your Practice';
    
    switch (sectionType) {
      case 'hero':
        return {
          headline: `Welcome to ${clinicName}`,
          subheadline: 'Providing exceptional dental care with a personal touch',
          ctaText: 'Schedule Appointment',
          ctaLink: '#contact'
        };

      case 'about':
        return {
          title: 'About Our Practice',
          content: `At ${clinicName}, we are committed to providing the highest quality dental care in a comfortable and welcoming environment. Our experienced team uses the latest technology and techniques to ensure you receive the best possible treatment.`,
          highlights: [
            'Experienced professional team',
            'State-of-the-art equipment',
            'Comfortable, modern facility',
            'Personalized treatment plans'
          ]
        };

      case 'services':
        return {
          title: 'Our Services',
          services: [
            {
              name: 'General Dentistry',
              description: 'Comprehensive dental care including cleanings, fillings, and preventive treatments.',
              icon: 'tooth'
            },
            {
              name: 'Cosmetic Dentistry',
              description: 'Enhance your smile with teeth whitening, veneers, and aesthetic treatments.',
              icon: 'smile'
            },
            {
              name: 'Restorative Dentistry',
              description: 'Restore damaged teeth with crowns, bridges, and dental implants.',
              icon: 'repair'
            }
          ]
        };

      case 'testimonials':
        return {
          title: 'What Our Patients Say',
          testimonials: [
            {
              name: 'Sarah Johnson',
              text: 'The entire team at this practice is fantastic. They made me feel comfortable throughout my treatment.',
              rating: 5
            },
            {
              name: 'Michael Chen',
              text: 'Professional, friendly, and thorough. I highly recommend this dental practice.',
              rating: 5
            },
            {
              name: 'Lisa Rodriguez',
              text: 'Outstanding service and care. The best dental experience I\'ve ever had.',
              rating: 5
            }
          ]
        };

      case 'contact':
        return {
          title: 'Contact Us',
          address: clinicData?.address || '123 Main Street, City, State 12345',
          phone: clinicData?.phone || '(555) 123-4567',
          email: clinicData?.email || 'info@yourpractice.com',
          hours: {
            'Monday - Friday': '8:00 AM - 6:00 PM',
            'Saturday': '9:00 AM - 3:00 PM',
            'Sunday': 'Closed'
          }
        };

      default:
        return {
          title: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
          content: 'Content will be customized for your practice.'
        };
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
