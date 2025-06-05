
import { supabase } from '@/integrations/supabase/client';
import { ErrorService } from '../errorService';

export interface SupabaseOperationConfig {
  operation: string;
  component?: string;
  userMessage?: string;
  throwOnError?: boolean;
}

export class BaseSupabaseOperations {
  static async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    config: SupabaseOperationConfig
  ): Promise<T | null> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        ErrorService.handle(error, {
          operation: config.operation,
          component: config.component,
        }, {
          userMessage: config.userMessage,
          severity: 'medium'
        });

        if (config.throwOnError) {
          throw error;
        }
        return null;
      }

      console.log(`✅ ${config.operation} successful:`, data);
      return data;
    } catch (error: any) {
      ErrorService.handle(error, {
        operation: config.operation,
        component: config.component,
      }, {
        userMessage: config.userMessage,
        severity: 'high'
      });

      if (config.throwOnError) {
        throw error;
      }
      return null;
    }
  }
}
