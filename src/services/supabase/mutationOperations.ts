
import { supabase } from '@/integrations/supabase/client';
import { BaseSupabaseOperations, SupabaseOperationConfig } from './baseOperations';
import { ErrorService } from '../errorService';

export interface InsertOptions {
  select?: string;
  component?: string;
  successMessage?: string;
}

export interface UpdateOptions {
  select?: string;
  component?: string;
  successMessage?: string;
}

export interface DeleteOptions {
  component?: string;
  successMessage?: string;
}

export class MutationOperations {
  static async insert<T>(
    table: string,
    data: Partial<T>,
    options?: InsertOptions
  ): Promise<T | null> {
    const config: SupabaseOperationConfig = {
      operation: 'create record',
      component: options?.component,
      userMessage: `Failed to create ${table} record`,
    };

    const queryFn = async () => {
      return supabase.from(table as any).insert(data).select(options?.select || '*').single();
    };

    const result = await BaseSupabaseOperations.executeQuery(queryFn, config);

    if (result && options?.successMessage) {
      ErrorService.success('create record', options.successMessage, options.component);
    }

    return result as T;
  }

  static async update<T>(
    table: string,
    filters: Record<string, any>,
    updates: Partial<T>,
    options?: UpdateOptions
  ): Promise<T | null> {
    const config: SupabaseOperationConfig = {
      operation: 'update record',
      component: options?.component,
      userMessage: `Failed to update ${table} record`,
    };

    const queryFn = async () => {
      let query = supabase.from(table as any).update(updates);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      if (options?.select) {
        return query.select(options.select).single();
      }

      return query;
    };

    const result = await BaseSupabaseOperations.executeQuery(queryFn, config);

    if (result && options?.successMessage) {
      ErrorService.success('update record', options.successMessage, options.component);
    }

    return result as T;
  }

  static async delete(
    table: string,
    filters: Record<string, any>,
    options?: DeleteOptions
  ): Promise<boolean> {
    const config: SupabaseOperationConfig = {
      operation: 'delete record',
      component: options?.component,
      userMessage: `Failed to delete ${table} record`,
    };

    const queryFn = async () => {
      let query = supabase.from(table as any).delete();

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      return query;
    };

    const result = await BaseSupabaseOperations.executeQuery(queryFn, config);

    if (result !== null && options?.successMessage) {
      ErrorService.success('delete record', options.successMessage, options.component);
    }

    return result !== null;
  }
}
