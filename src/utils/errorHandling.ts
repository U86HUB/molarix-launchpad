
import { ErrorService } from '@/services/errorService';

// Updated interface for backward compatibility that matches what files are using
export interface ErrorContext {
  operation: string;
  table?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

// Adapter function to bridge the old interface to the new one
export const handleSupabaseError = (
  error: any,
  context: ErrorContext,
  userMessage?: string
): void => {
  ErrorService.handle(error, {
    operation: context.operation,
    component: context.table, // Map table to component
    userId: context.userId,
    additionalData: context.additionalData
  }, {
    userMessage,
    showToast: true,
    logToConsole: true
  });
};

export const handleOperationSuccess = (
  operation: string,
  message?: string,
  component?: string
): void => {
  ErrorService.success(operation, message, component);
};

// Legacy interface for backward compatibility
/**
 * @deprecated Use ErrorService.handle instead
 */
export const handleError = handleSupabaseError;

/**
 * @deprecated Use ErrorService.success instead  
 */
export const handleSuccess = handleOperationSuccess;
