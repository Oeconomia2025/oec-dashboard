import type { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema.js';
import { liveCoinWatchApiService } from './lib/live-coin-watch-api.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

export const handler: Handler = async (event) => {
  // CORS + JSON
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Allow preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // ✅ Allow GET (manual/scheduled) and POST (manual trigger)
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Use GET or POST to trigger sync.' }) };
  }

  try {
    console.log('Starting Live Coin Watch data sync...');
    const coins = await liveCoinWatchApiService.getTopCoins(100);

    const coinNames: Record<string, string> = {
      BTC: 'Bitcoin', ETH: 'Ethereum', XRP: 'XRP', USDT: 'Tether', BNB: 'BNB', SOL: 'Solana',
      USDC: 'USD Coin', TRX: 'TRON', ADA: 'Cardano', DOGE: 'Dogecoin', AVAX: 'Avalanche',
      LINK: 'Chainlink', DOT: 'Polkadot', MATIC: 'Polygon', LTC: 'Litecoin', SHIB: 'Shiba Inu',
      LEO: 'LEO Token', UNI: 'Uniswap', ATOM: 'Cosmos Hub', TON: 'Toncoin'
    };

    const supplyMap: Record<string, { total: number; circulating: number }> = {
      BTC: { total: 21000000, circulating: 19800000 },
      ETH: { total: 120300000, circulating: 120300000 },
      XRP: { total: 100000000000, circulating: 57000000000 },
      USDT:{ total: 119000000000, circulating: 119000000000 },
      BNB: { total: 147220000, circulating: 147220000 },
      SOL: { total: 588000000, circulating: 470000000 },
      USDC:{ total: 25400000000, circulating: 25400000000 },
      ADA: { total: 45000000000, circulating: 36700000000 },
      DOGE:{ total: 150000000000, circulating: 150000000000 },
      LINK:{ total: 1000000000,  circulating: 541000000 },
      DOT: { total: 1210000000,  circulating: 1380000000 },
      LTC: { total: 84000000,    circulating: 74700000 },
      MATIC:{ total: 10000000000, circulating: 9320000000 },
      UNI: { total: 1000000000,  circulating: 754000000 },
    };

    let syncedCount = 0;
    const nowMs = Date.now();

    for (const coin of coins) {
      if (!coin?.code || coin.rate == null) {
        console.warn('Skipping coin with missing data:', coin);
        continue;
      }

      const supply = supplyMap[coin.code] || { total: 0, circulating: 0 };

      // Upsert latest snapshot
      await db
        .insert(schema.liveCoinWatchCoins)
        .values({
          code: coin.code,
          name: coinNames[coin.code] || coin.code,
          rate: coin.rate,
          volume: coin.volume ?? 0,
          cap: coin.cap ?? null,
          deltaHour: coin.delta?.hour ?? null,
          deltaDay: coin.delta?.day ?? null,
          deltaWeek: coin.delta?.week ?? null,
          deltaMonth: coin.delta?.month ?? null,
          deltaQuarter: coin.delta?.quarter ?? null,
          deltaYear: coin.delta?.year ?? null,
          totalSupply: supply.total,
          circulatingSupply: supply.circulating,
          lastUpdated: new Date(),
        })
        .onConflictDoUpdate({
          target: schema.liveCoinWatchCoins.code,
          set: {
            rate: coin.rate,
            volume: coin.volume ?? 0,
            cap: coin.cap ?? null,
            deltaHour: coin.delta?.hour ?? null,
            deltaDay: coin.delta?.day ?? null,
            deltaWeek: coin.delta?.week ?? null,
            deltaMonth: coin.delta?.month ?? null,
            deltaQuarter: coin.delta?.quarter ?? null,
            deltaYear: coin.delta?.year ?? null,
            totalSupply: supply.total,
            circulatingSupply: supply.circulating,
            lastUpdated: new Date(),
          },
        });

      // ✅ Append to historical table for charts
      await db
        .insert(schema.priceHistoryData)
        .values({
          tokenCode: coin.code,             // e.g. 'ETH'
          contractAddress: null,            // fill if you track one
          timestamp: nowMs,                 // bigint in schema (mode:number)
          price: coin.rate ?? 0,
          volume: coin.volume ?? null,
          marketCap: coin.cap ?? null,
          timeframe: '1D',                  // choose the granularity you chart
        })
        .onConflictDoNothing();             // respects your unique index

      syncedCount++;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Synced ${syncedCount} coins`,
        syncedCount,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error syncing Live Coin Watch data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to sync Live Coin Watch data',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
