
// Global singleton promise cache to prevent duplicate website creations
interface WebsiteCreationEntry {
  promise: Promise<any>;
  timestamp: number;
  executionId: string;
  websiteName: string;
  userId: string;
  completed: boolean;
}

class GlobalWebsiteCache {
  private static instance: GlobalWebsiteCache;
  private creationPromises = new Map<string, WebsiteCreationEntry>();
  
  static getInstance(): GlobalWebsiteCache {
    if (!GlobalWebsiteCache.instance) {
      GlobalWebsiteCache.instance = new GlobalWebsiteCache();
    }
    return GlobalWebsiteCache.instance;
  }

  generateExecutionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getCacheKey(websiteName: string, userId: string): string {
    return `${userId}:${websiteName.trim().toLowerCase()}`;
  }

  hasActiveCreation(websiteName: string, userId: string): boolean {
    const key = this.getCacheKey(websiteName, userId);
    const entry = this.creationPromises.get(key);
    
    if (!entry) return false;
    
    // Check if completed
    if (entry.completed) {
      console.log(`🔍 Entry exists but marked as completed for: ${key}`);
      return false;
    }
    
    const age = Date.now() - entry.timestamp;
    if (age > 120000) { // Extended to 2 minutes to handle post-redirect scenarios
      console.log(`🧹 Cleaning up old creation promise for: ${key}, age: ${age}ms`);
      this.creationPromises.delete(key);
      return false;
    }
    
    console.log(`🔍 Active creation found for: ${key}, age: ${age}ms, executionId: ${entry.executionId}`);
    return true;
  }

  getActiveCreation(websiteName: string, userId: string): Promise<any> | null {
    const key = this.getCacheKey(websiteName, userId);
    const entry = this.creationPromises.get(key);
    
    if (!entry) return null;
    
    if (entry.completed) {
      console.log(`🔍 Entry completed, removing from cache: ${key}`);
      this.creationPromises.delete(key);
      return null;
    }
    
    const age = Date.now() - entry.timestamp;
    if (age > 120000) {
      this.creationPromises.delete(key);
      return null;
    }
    
    return entry.promise;
  }

  setActiveCreation(websiteName: string, userId: string, promise: Promise<any>, executionId: string): void {
    const key = this.getCacheKey(websiteName, userId);
    
    console.log(`🔒 [${executionId}] Caching website creation for: ${key}`);
    
    const entry: WebsiteCreationEntry = {
      promise,
      timestamp: Date.now(),
      executionId,
      websiteName,
      userId,
      completed: false
    };
    
    this.creationPromises.set(key, entry);
    
    // Auto-cleanup when promise resolves
    promise.finally(() => {
      setTimeout(() => {
        const current = this.creationPromises.get(key);
        if (current && current.executionId === executionId) {
          // Mark as completed instead of deleting immediately
          current.completed = true;
          console.log(`✅ [${executionId}] Marked website creation as completed: ${key}`);
          
          // Delete after additional delay to prevent immediate re-creation
          setTimeout(() => {
            const stillCurrent = this.creationPromises.get(key);
            if (stillCurrent && stillCurrent.executionId === executionId) {
              this.creationPromises.delete(key);
              console.log(`🧹 [${executionId}] Cleaned up completed website creation cache: ${key}`);
            }
          }, 30000); // 30 second delay after completion
        }
      }, 5000);
    });
  }

  markCompleted(websiteName: string, userId: string, executionId: string): void {
    const key = this.getCacheKey(websiteName, userId);
    const entry = this.creationPromises.get(key);
    
    if (entry && entry.executionId === executionId) {
      entry.completed = true;
      console.log(`✅ [${executionId}] Explicitly marked as completed: ${key}`);
    }
  }

  clearAll(): void {
    console.log('🧹 Clearing all website creation cache');
    this.creationPromises.clear();
  }

  debugState(): void {
    console.log('🔍 Website Creation Cache State:', {
      activeCreations: this.creationPromises.size,
      entries: Array.from(this.creationPromises.entries()).map(([key, entry]) => ({
        key,
        executionId: entry.executionId,
        age: Date.now() - entry.timestamp,
        websiteName: entry.websiteName,
        completed: entry.completed
      }))
    });
  }
}

export const globalWebsiteCache = GlobalWebsiteCache.getInstance();
