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
    // DISABLED: No sync to eliminate Replit usage consumption
    console.log('🚫 Sync disabled - app running in cache-only mode via Netlify functions');
    console.log('📊 All data served from database cache, no API calls made');
    this.isInitialized = true;
    return;
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