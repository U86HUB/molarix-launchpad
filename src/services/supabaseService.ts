
import { supabase } from '@/integrations/supabase/client';
import { ErrorService } from './errorService';

export interface SupabaseOperationConfig {
  operation: string;
  component?: string;
  userMessage?: string;
  throwOnError?: boolean;
}

export class SupabaseService {
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

  static async fetchMany<T>(
    table: string,
    filters?: Record<string, any>,
    options?: {
      select?: string;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      component?: string;
    }
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

    const result = await this.executeQuery(queryFn, config);
    return (result as T[]) || [];
  }

  static async fetchOne<T>(
    table: string,
    filters: Record<string, any>,
    options?: {
      select?: string;
      component?: string;
      required?: boolean;
    }
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

    const result = await this.executeQuery(queryFn, config);
    return result as T;
  }

  static async insert<T>(
    table: string,
    data: Partial<T>,
    options?: {
      select?: string;
      component?: string;
      successMessage?: string;
    }
  ): Promise<T | null> {
    const config: SupabaseOperationConfig = {
      operation: 'create record',
      component: options?.component,
      userMessage: `Failed to create ${table} record`,
    };

    const queryFn = async () => {
      return supabase.from(table as any).insert(data).select(options?.select || '*').single();
    };

    const result = await this.executeQuery(queryFn, config);

    if (result && options?.successMessage) {
      ErrorService.success('create record', options.successMessage, options.component);
    }

    return result as T;
  }

  static async update<T>(
    table: string,
    filters: Record<string, any>,
    updates: Partial<T>,
    options?: {
      select?: string;
      component?: string;
      successMessage?: string;
    }
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
        query = query.select(options.select);
        return query.single();
      }

      return query;
    };

    const result = await this.executeQuery(queryFn, config);

    if (result && options?.successMessage) {
      ErrorService.success('update record', options.successMessage, options.component);
    }

    return result as T;
  }

  static async delete(
    table: string,
    filters: Record<string, any>,
    options?: {
      component?: string;
      successMessage?: string;
    }
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

    const result = await this.executeQuery(queryFn, config);

    if (result !== null && options?.successMessage) {
      ErrorService.success('delete record', options.successMessage, options.component);
    }

    return result !== null;
  }
}
