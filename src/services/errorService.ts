
import { toast } from "@/hooks/use-toast";

export interface ErrorContext {
  operation: string;
  component?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  userMessage?: string;
  severity?: 'low' | 'medium' | 'high';
}

export class ErrorService {
  static handle(
    error: any,
    context: ErrorContext,
    options: ErrorOptions = {}
  ): void {
    const {
      showToast = true,
      logToConsole = true,
      userMessage,
      severity = 'medium'
    } = options;

    // Enhanced error logging
    if (logToConsole) {
      const logData = {
        error: error?.message || error,
        code: error?.code,
        severity,
        context: {
          operation: context.operation,
          component: context.component,
          userId: context.userId,
          timestamp: new Date().toISOString(),
          ...context.additionalData
        }
      };

      if (severity === 'high') {
        console.error(`🚨 CRITICAL: ${context.operation} failed:`, logData);
      } else if (severity === 'medium') {
        console.error(`⚠️ ERROR: ${context.operation} failed:`, logData);
      } else {
        console.warn(`ℹ️ WARNING: ${context.operation} issue:`, logData);
      }
    }

    // User-friendly toast notifications
    if (showToast) {
      const title = severity === 'high' ? 'Critical Error' : 'Error';
      const description = userMessage || this.getDefaultMessage(context.operation);
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  }

  static success(
    operation: string,
    message?: string,
    component?: string
  ): void {
    console.log(`✅ SUCCESS: ${operation} completed`, {
      operation,
      component,
      timestamp: new Date().toISOString()
    });
    
    if (message) {
      toast({
        title: "Success",
        description: message,
      });
    }
  }

  private static getDefaultMessage(operation: string): string {
    const messages: Record<string, string> = {
      'fetch': 'Failed to load data. Please try again.',
      'create': 'Failed to create item. Please try again.',
      'update': 'Failed to update item. Please try again.',
      'delete': 'Failed to delete item. Please try again.',
      'upload': 'Failed to upload file. Please try again.',
      'save': 'Failed to save changes. Please try again.',
    };

    const baseOperation = operation.toLowerCase().split(' ')[0];
    return messages[baseOperation] || `Failed to ${operation.toLowerCase()}. Please try again.`;
  }
}
