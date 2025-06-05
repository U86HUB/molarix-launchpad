
import { ErrorService } from '@/services/errorService';

// Re-export for backward compatibility
export const handleSupabaseError = ErrorService.handle;
export const handleOperationSuccess = ErrorService.success;

// Legacy interface for backward compatibility
export interface ErrorContext {
  operation: string;
  table?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

/**
 * @deprecated Use ErrorService.handle instead
 */
export const handleError = ErrorService.handle;

/**
 * @deprecated Use ErrorService.success instead  
 */
export const handleSuccess = ErrorService.success;
