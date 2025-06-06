
import { globalWebsiteCache } from '@/services/globalWebsiteCache';
import { getInitializationTracker } from './website-initialization/websiteInitializationTracker';
import { executeInitializationSteps } from './website-initialization/websiteInitializationSteps';

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

export class WebsiteInitializationService {
  private progressCallback: (progress: InitializationProgress) => void;
  private tracker = getInitializationTracker();

  constructor(progressCallback: (progress: InitializationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  async initializeWebsite(data: WebsiteInitializationData): Promise<boolean> {
    const executionId = globalWebsiteCache.generateExecutionId();
    
    console.log(`🔄 [${executionId}] WebsiteInitializationService.initializeWebsite() START`);
    console.log(`🔍 [${executionId}] Website ID: ${data.websiteId}`);
    
    // Check if this website is already being initialized
    if (this.tracker.hasActiveInitialization(data.websiteId, executionId)) {
      const existingPromise = this.tracker.getExistingPromise(data.websiteId);
      if (existingPromise) {
        this.progressCallback({
          step: 4,
          message: 'Initialization already in progress',
          completed: false
        });
        return existingPromise;
      }
    }

    // Create and store the initialization promise
    const initPromise = executeInitializationSteps(data, executionId, this.progressCallback);
    this.tracker.startTracking(data.websiteId, initPromise, executionId);

    try {
      const result = await initPromise;
      this.tracker.updateStatus(data.websiteId, executionId, result ? 'completed' : 'failed');
      return result;
    } catch (error: any) {
      console.error(`❌ [${executionId}] Website initialization error:`, error);
      this.tracker.updateStatus(data.websiteId, executionId, 'failed');
      throw error;
    } finally {
      this.tracker.cleanupTracking(data.websiteId, executionId);
    }
  }
}
