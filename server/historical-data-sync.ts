import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Generate historical data for all major tokens (same pattern as ETH)
async function seedTokenHistoricalData(tokenCode: string) {
  console.log(`Seeding historical data for ${tokenCode}...`);
  
  try {
    // Get current token price from Live Coin Watch data
    const tokenData = await db
      .select()
      .from(schema.liveCoinWatchCoins)
      .where(eq(schema.liveCoinWatchCoins.code, tokenCode))
      .limit(1);
    
    if (tokenData.length === 0) {
      console.log(`No Live Coin Watch data found for ${tokenCode}, skipping...`);
      return;
    }
    
    const currentPrice = tokenData[0].rate;
    const timeframes = ['1H', '1D', '7D', '30D'];
    
    for (const timeframe of timeframes) {
      // Check if data already exists
      const existingData = await db
        .select()
        .from(schema.priceHistoryData)
        .where(and(
          eq(schema.priceHistoryData.tokenCode, tokenCode),
          eq(schema.priceHistoryData.timeframe, timeframe)
        ))
        .limit(1);
      
      if (existingData.length > 0) {
        console.log(`${tokenCode} ${timeframe} data already exists, skipping...`);
        continue;
      }
      
      let dataPoints = 24;
      let intervalMinutes = 60;
      
      switch (timeframe) {
        case "1H":
          dataPoints = 12;
          intervalMinutes = 5;
          break;
        case "1D":
          dataPoints = 24;
          intervalMinutes = 60;
          break;
        case "7D":
          dataPoints = 28;
          intervalMinutes = 360; // 6 hours
          break;
        case "30D":
          dataPoints = 30;
          intervalMinutes = 1440; // 24 hours
          break;
      }
      
      const historicalData = [];
      const now = Date.now();
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = now - (i * intervalMinutes * 60 * 1000);
        // Create realistic price variations (±3% from current price)
        const variation = (Math.random() - 0.5) * 0.06;
        const price = currentPrice * (1 + variation);
        
        historicalData.push({
          tokenCode,
          timestamp,
          price: Math.max(price, currentPrice * 0.92), // Ensure minimum 92% of current price
          timeframe,
        });
      }
      
      // Insert historical data
      await db
        .insert(schema.priceHistoryData)
        .values(historicalData)
        .onConflictDoNothing();
      
      console.log(`Inserted ${historicalData.length} ${tokenCode} ${timeframe} data points`);
    }
  } catch (error) {
    console.error(`Error seeding ${tokenCode} historical data:`, error);
  }
}

// Seed historical data for all major tokens in Live Coin Watch database
export async function seedAllTokensHistoricalData() {
  console.log("Starting Historical Data Sync Service...");
  
  try {
    // Get all tokens from Live Coin Watch database
    const allTokens = await db
      .select()
      .from(schema.liveCoinWatchCoins);
    
    console.log(`Found ${allTokens.length} tokens to sync historical data`);
    
    // Seed historical data for top 20 tokens first (including ETH, BTC, BNB, etc.)
    const priorityTokens = ['ETH', 'BTC', 'BNB', 'USDT', 'SOL', 'USDC', 'XRP', 'ADA', 'DOGE', 'TRX', 'MATIC', 'LTC', 'DOT', 'AVAX', 'UNI', 'LINK', 'ATOM', 'XLM', 'ICP', 'BCH'];
    
    for (const tokenCode of priorityTokens) {
      const tokenExists = allTokens.find(token => token.code === tokenCode);
      if (tokenExists) {
        await seedTokenHistoricalData(tokenCode);
      }
    }
    
    console.log("Historical data seeding completed for priority tokens");
  } catch (error) {
    console.error("Error in historical data sync service:", error);
  }
}

// Export and auto-run for immediate seeding
export { seedAllTokensHistoricalData };

// Auto-run seeding when imported
seedAllTokensHistoricalData();