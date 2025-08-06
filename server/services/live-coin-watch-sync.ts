import { db } from "../db";
import { liveCoinWatchCoins, type InsertLiveCoinWatchCoin } from "@shared/schema";
import { liveCoinWatchApiService } from "./live-coin-watch-api";
import { eq, desc } from "drizzle-orm";

class LiveCoinWatchSyncService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 30 * 1000; // 30 seconds

  async start() {
    if (this.isRunning) {
      console.log('Live Coin Watch sync service is already running');
      return;
    }

    console.log('Starting Live Coin Watch sync service...');
    this.isRunning = true;

    // Initial sync
    await this.syncData();

    // Set up recurring sync every 30 seconds
    this.intervalId = setInterval(async () => {
      await this.syncData();
    }, this.SYNC_INTERVAL);

    console.log(`Live Coin Watch sync service started with ${this.SYNC_INTERVAL / 1000}s interval`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Live Coin Watch sync service stopped');
  }

  private async syncData() {
    try {
      console.log('Fetching Live Coin Watch data...');
      const coins = await liveCoinWatchApiService.getTopCoins(100);

      for (const coin of coins) {
        // Skip coins without required basic data
        if (!coin.code || !coin.rate) {
          console.warn(`Skipping coin with missing essential data:`, coin);
          continue;
        }

        // Map coin code to full name since API doesn't provide it
        const coinNames: Record<string, string> = {
          'BTC': 'Bitcoin',
          'ETH': 'Ethereum',
          'XRP': 'XRP',
          'USDT': 'Tether',
          'BNB': 'BNB',
          'SOL': 'Solana',
          'USDC': 'USD Coin',
          'TRX': 'TRON',
          'ADA': 'Cardano',
          'DOGE': 'Dogecoin',
          'AVAX': 'Avalanche',
          'LINK': 'Chainlink',
          'DOT': 'Polkadot',
          'MATIC': 'Polygon',
          'LTC': 'Litecoin',
        };

        const coinData: InsertLiveCoinWatchCoin = {
          code: coin.code,
          name: coinNames[coin.code] || coin.code, // Use mapping or code as fallback
          rate: coin.rate,
          volume: coin.volume || 0,
          cap: coin.cap,
          deltaHour: coin.delta?.hour || null,
          deltaDay: coin.delta?.day || null,
          deltaWeek: coin.delta?.week || null,
          deltaMonth: coin.delta?.month || null,
          deltaQuarter: coin.delta?.quarter || null,
          deltaYear: coin.delta?.year || null,
          // Include supply data from Live Coin Watch API
          totalSupply: coin.totalSupply || null,
          circulatingSupply: coin.circulatingSupply || null,
          maxSupply: coin.maxSupply || null,
        };

        // Upsert coin data (insert or update if exists)
        await db
          .insert(liveCoinWatchCoins)
          .values(coinData)
          .onConflictDoUpdate({
            target: liveCoinWatchCoins.code,
            set: {
              name: coinData.name,
              rate: coinData.rate,
              volume: coinData.volume,
              cap: coinData.cap,
              deltaHour: coinData.deltaHour,
              deltaDay: coinData.deltaDay,
              deltaWeek: coinData.deltaWeek,
              deltaMonth: coinData.deltaMonth,
              deltaQuarter: coinData.deltaQuarter,
              deltaYear: coinData.deltaYear,
              // Update supply data from Live Coin Watch API
              totalSupply: coinData.totalSupply,
              circulatingSupply: coinData.circulatingSupply,
              maxSupply: coinData.maxSupply,
              lastUpdated: new Date(),
            },
          });
      }

      console.log(`Successfully synced ${coins.length} coins from Live Coin Watch`);
    } catch (error) {
      console.warn('Live Coin Watch API temporarily unavailable (likely rate limit reached)');
      console.log('Dashboard will continue serving data from database cache');
      // Don't stop the service - just skip this sync and continue with cached data
    }
  }

  async getStoredCoins() {
    try {
      const result = await db.select().from(liveCoinWatchCoins);
      // Sort by market cap in descending order (highest first)
      return result.sort((a, b) => (b.cap || 0) - (a.cap || 0));
    } catch (error) {
      console.error('Error fetching stored coins:', error);
      return [];
    }
  }

  isServiceRunning() {
    return this.isRunning;
  }
}

export const liveCoinWatchSyncService = new LiveCoinWatchSyncService();