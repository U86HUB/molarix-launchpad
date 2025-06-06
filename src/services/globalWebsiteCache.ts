
// Global singleton promise cache to prevent duplicate website creations
interface WebsiteCreationEntry {
  promise: Promise<any>;
  timestamp: number;
  executionId: string;
  websiteName: string;
  userId: string;
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
    
    const age = Date.now() - entry.timestamp;
    if (age > 60000) { // Clean up after 60 seconds
      this.creationPromises.delete(key);
      return false;
    }
    
    return true;
  }

  getActiveCreation(websiteName: string, userId: string): Promise<any> | null {
    const key = this.getCacheKey(websiteName, userId);
    const entry = this.creationPromises.get(key);
    
    if (!entry) return null;
    
    const age = Date.now() - entry.timestamp;
    if (age > 60000) {
      this.creationPromises.delete(key);
      return null;
    }
    
    return entry.promise;
  }

  setActiveCreation(websiteName: string, userId: string, promise: Promise<any>, executionId: string): void {
    const key = this.getCacheKey(websiteName, userId);
    
    console.log(`🔒 [${executionId}] Caching website creation for: ${key}`);
    
    this.creationPromises.set(key, {
      promise,
      timestamp: Date.now(),
      executionId,
      websiteName,
      userId
    });
    
    // Auto-cleanup when promise resolves
    promise.finally(() => {
      setTimeout(() => {
        const current = this.creationPromises.get(key);
        if (current && current.executionId === executionId) {
          this.creationPromises.delete(key);
          console.log(`🧹 [${executionId}] Cleaned up website creation cache for: ${key}`);
        }
      }, 5000);
    });
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
        websiteName: entry.websiteName
      }))
    });
  }
}

export const globalWebsiteCache = GlobalWebsiteCache.getInstance();
