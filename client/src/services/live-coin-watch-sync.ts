import { apiRequest } from '@/lib/queryClient';

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
  timestamp: string;
  error?: string;
}

class LiveCoinWatchSyncService {
  private isInitialized = false;
  private syncTimer?: NodeJS.Timeout;

  async initializeProductionSync(): Promise<void> {
    // FORCE NETLIFY FUNCTIONS: Always initialize sync, never depend on Replit
    const isProduction = true; // Force production mode to ensure Netlify function usage
    
    if (this.isInitialized) {
      console.log('Environment: Production (Forced) - Sync already initialized');
      return;
    }

    console.log('🚀 Initializing Live Coin Watch sync for production environment');
    
    try {
      // Trigger initial sync
      await this.triggerSync();
      
      // Set up automatic sync every 5 minutes in production
      this.syncTimer = setInterval(async () => {
        try {
          await this.triggerSync();
        } catch (error) {
          console.warn('Scheduled sync failed:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes
      
      this.isInitialized = true;
      console.log('✅ Production Live Coin Watch sync initialized');
    } catch (error) {
      console.error('Failed to initialize production sync:', error);
    }
  }

  async triggerSync(): Promise<SyncResult> {
    try {
      console.log('🔄 Triggering Live Coin Watch data sync...');
      
      const response = await apiRequest('POST', '/api/live-coin-watch/sync');
      const result = await response.json() as SyncResult;
      
      if (result.success) {
        console.log(`✅ Sync completed: ${result.message}`);
      } else {
        console.warn(`⚠️ Sync warning: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        message: 'Failed to trigger sync',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
      
      console.error('❌ Sync failed:', error);
      return errorResult;
    }
  }

  stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
      this.isInitialized = false;
      console.log('🛑 Live Coin Watch sync stopped');
    }
  }
}

export const liveCoinWatchSyncService = new LiveCoinWatchSyncService();