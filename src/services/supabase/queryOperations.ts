
import { supabase } from '@/integrations/supabase/client';
import { BaseSupabaseOperations, SupabaseOperationConfig } from './baseOperations';

export interface FetchManyOptions {
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  component?: string;
}

export interface FetchOneOptions {
  select?: string;
  component?: string;
  required?: boolean;
}

export class QueryOperations {
  static async fetchMany<T>(
    table: string,
    filters?: Record<string, any>,
    options?: FetchManyOptions
  ): Promise<T[]> {
    const config: SupabaseOperationConfig = {
      operation: 'fetch records',
      component: options?.component,
      userMessage: `Failed to load ${table}`,
    };

    const queryFn = async () => {
      let query = supabase.from(table as any).select(options?.select || '*');

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? false 
        });
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      return query;
    };

    const result = await BaseSupabaseOperations.executeQuery(queryFn, config);
    return (result as T[]) || [];
  }

  static async fetchOne<T>(
    table: string,
    filters: Record<string, any>,
    options?: FetchOneOptions
  ): Promise<T | null> {
    const config: SupabaseOperationConfig = {
      operation: 'fetch record',
      component: options?.component,
      userMessage: `Failed to load ${table} record`,
      throwOnError: options?.required
    };

    const queryFn = async () => {
      let query = supabase.from(table as any).select(options?.select || '*');

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      return options?.required ? query.single() : query.maybeSingle();
    };

    const result = await BaseSupabaseOperations.executeQuery(queryFn, config);
    return result as T;
  }
}
