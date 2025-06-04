
import { supabase } from '@/integrations/supabase/client';
import { GeneratedCopy, OnboardingSession } from '@/types/copy';

export interface CopyGenerationResponse {
  success: boolean;
  copy?: GeneratedCopy;
  sessionData?: OnboardingSession;
  error?: string;
  data?: any;
}

export class CopyGenerationService {
  async generateCopy(sessionId: string, stream: boolean = false): Promise<CopyGenerationResponse> {
    try {
      // Get current user to ensure they can access this session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Authentication required' };
      }

      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { sessionId, stream }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return { success: false, error: error.message };
      }

      if (stream) {
        return { success: true, data };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Failed to generate copy' };
      }

      return {
        success: true,
        copy: data.copy,
        sessionData: data.sessionData
      };
    } catch (error: any) {
      console.error('Error generating copy:', error);
      return { success: false, error: error.message };
    }
  }
}
