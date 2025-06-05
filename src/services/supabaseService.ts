
// Re-export types and classes for backward compatibility
export { SupabaseOperationConfig } from './supabase/baseOperations';
export { FetchManyOptions, FetchOneOptions } from './supabase/queryOperations';
export { InsertOptions, UpdateOptions, DeleteOptions } from './supabase/mutationOperations';

// Import the operations
import { BaseSupabaseOperations } from './supabase/baseOperations';
import { QueryOperations } from './supabase/queryOperations';
import { MutationOperations } from './supabase/mutationOperations';

// Main service class that combines all operations
export class SupabaseService {
  // Re-export base operations
  static executeQuery = BaseSupabaseOperations.executeQuery;

  // Re-export query operations
  static fetchMany = QueryOperations.fetchMany;
  static fetchOne = QueryOperations.fetchOne;

  // Re-export mutation operations
  static insert = MutationOperations.insert;
  static update = MutationOperations.update;
  static delete = MutationOperations.delete;
}
