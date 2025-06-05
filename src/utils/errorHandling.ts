
import { toast } from "@/hooks/use-toast";

export interface ErrorContext {
  operation: string;
  table?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export const handleSupabaseError = (
  error: any, 
  context: ErrorContext,
  userMessage?: string
) => {
  // Log detailed error to console for debugging
  console.error(`Supabase ${context.operation} failed:`, {
    error: error.message || error,
    code: error.code,
    table: context.table,
    userId: context.userId,
    timestamp: new Date().toISOString(),
    ...context.additionalData
  });

  // Show user-friendly toast message
  const defaultMessage = `Failed to ${context.operation.toLowerCase()}. Please try again.`;
  
  toast({
    title: "Error",
    description: userMessage || defaultMessage,
    variant: "destructive",
  });

  return false;
};

export const handleOperationSuccess = (
  operation: string,
  successMessage?: string
) => {
  console.log(`Operation successful: ${operation}`);
  
  if (successMessage) {
    toast({
      title: "Success",
      description: successMessage,
    });
  }
};
