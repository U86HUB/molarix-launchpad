
import { supabase } from '@/integrations/supabase/client';
import { globalWebsiteCache } from '@/services/globalWebsiteCache';

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

// Enhanced tracking with global cache integration
const initializingWebsites = new Map<string, { 
  timestamp: number; 
  promise: Promise<boolean>;
  executionId: string;
  status: 'initializing' | 'completed' | 'failed';
}>();

export class WebsiteInitializationService {
  private progressCallback: (progress: InitializationProgress) => void;

  constructor(progressCallback: (progress: InitializationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  async initializeWebsite(data: WebsiteInitializationData): Promise<boolean> {
    const executionId = globalWebsiteCache.generateExecutionId();
    
    console.log(`🔄 [${executionId}] WebsiteInitializationService.initializeWebsite() START`);
    console.log(`🔍 [${executionId}] Website ID: ${data.websiteId}`);
    
    // Check if this website is already being initialized
    const existingInit = initializingWebsites.get(data.websiteId);
    if (existingInit && existingInit.status === 'initializing') {
      const timeSinceStart = Date.now() - existingInit.timestamp;
      console.warn(`🚫 [${executionId}] Website initialization already in progress for: ${data.websiteId}`);
      console.log(`⏱️ [${executionId}] Time since start: ${timeSinceStart}ms`);
      console.log(`🔍 [${executionId}] Original execution ID: ${existingInit.executionId}`);
      
      if (timeSinceStart < 60000) { // Within 60 seconds
        this.progressCallback({
          step: 4,
          message: 'Initialization already in progress',
          completed: false
        });
        return existingInit.promise;
      } else {
        console.log(`🧹 [${executionId}] Cleaning up old initialization promise`);
        initializingWebsites.delete(data.websiteId);
      }
    }

    // Create and store the initialization promise
    const initPromise = this.executeInitialization(data, executionId);
    initializingWebsites.set(data.websiteId, {
      timestamp: Date.now(),
      promise: initPromise,
      executionId,
      status: 'initializing'
    });

    try {
      const result = await initPromise;
      
      // Update status
      const tracking = initializingWebsites.get(data.websiteId);
      if (tracking && tracking.executionId === executionId) {
        initializingWebsites.set(data.websiteId, {
          ...tracking,
          status: result ? 'completed' : 'failed'
        });
      }
      
      return result;
    } catch (error: any) {
      console.error(`❌ [${executionId}] Website initialization error:`, error);
      
      // Update status to failed
      const tracking = initializingWebsites.get(data.websiteId);
      if (tracking && tracking.executionId === executionId) {
        initializingWebsites.set(data.websiteId, {
          ...tracking,
          status: 'failed'
        });
      }
      
      throw error;
    } finally {
      // Clean up tracking after a delay
      setTimeout(() => {
        const current = initializingWebsites.get(data.websiteId);
        if (current && current.executionId === executionId) {
          initializingWebsites.delete(data.websiteId);
          console.log(`🧹 [${executionId}] Cleaned up initialization tracking for: ${data.websiteId}`);
        }
      }, 10000);
    }
  }

  private async executeInitialization(data: WebsiteInitializationData, executionId: string): Promise<boolean> {
    try {
      console.log(`🔄 [${executionId}] Starting website initialization for: ${data.websiteId}`);

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
        throw new Error(`Website not found: ${websiteError?.message || 'Unknown error'}`);
      }

      console.log(`✅ [${executionId}] Website verified`);

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

      console.log(`✅ [${executionId}] Template settings applied`);

      // Step 3: Create default sections if none exist
      this.progressCallback({
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
        const defaultSections = [
          { type: 'hero', position: 0 },
          { type: 'about', position: 1 },
          { type: 'services', position: 2 },
          { type: 'contact', position: 3 }
        ];

        console.log(`📝 [${executionId}] Creating default sections`);

        // Insert sections with better error handling
        for (const section of defaultSections) {
          try {
            // Check if section already exists at this position
            const { data: existingSection } = await supabase
              .from('sections')
              .select('id')
              .eq('website_id', data.websiteId)
              .eq('position', section.position)
              .maybeSingle();

            if (existingSection) {
              console.log(`⚠️ [${executionId}] Section at position ${section.position} already exists, skipping`);
              continue;
            }

            const { error: sectionError } = await supabase
              .from('sections')
              .insert({
                website_id: data.websiteId,
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
      } else {
        console.log(`✅ [${executionId}] Website already has sections, skipping creation`);
      }

      // Step 4: Complete initialization
      this.progressCallback({
        step: 4,
        message: 'Website initialization complete!',
        completed: true
      });

      console.log(`✅ [${executionId}] Website initialization completed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ [${executionId}] Website initialization failed:`, error);
      this.progressCallback({
        step: 4,
        message: 'Initialization failed',
        completed: false
      });
      throw error;
    }
  }
}
