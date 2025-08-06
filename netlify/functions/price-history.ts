import type { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Extract contract address and timeframe from path
    const pathParts = event.path.split('/');
    const contractAddress = pathParts[pathParts.length - 2];
    const timeframe = pathParts[pathParts.length - 1] || '1D';
    
    if (!contractAddress) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Contract address is required' }),
      };
    }

    // Try to get real historical data from database first
    const historicalData = await db
      .select()
      .from(schema.priceHistoryData)
      .where(and(
        eq(schema.priceHistoryData.contractAddress, contractAddress.toLowerCase()),
        eq(schema.priceHistoryData.timeframe, timeframe)
      ))
      .orderBy(schema.priceHistoryData.timestamp);

    if (historicalData.length > 0) {
      // Use real historical data
      const priceHistory = historicalData.map(point => ({
        timestamp: point.timestamp,
        price: point.price,
      }));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(priceHistory),
      };
    }

    // Fallback: Generate realistic price history based on known tokens
    const generatePriceHistory = (contractAddress: string, timeframe: string) => {
      const normalizedAddress = contractAddress.toLowerCase();
      const knownTokens: Record<string, any> = {
        "0x55d398326f99059ff775485246999027b3197955": { price: 1.00 },
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": { price: 612.45 },
        "0x2170ed0880ac9a755fd29b2688956bd959f933f8": { price: 3602.42 },
        "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": { price: 0.9992 },
        "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c": { price: 88400.00 },
        "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": { price: 2.57 },
        "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": { price: 1.00 },
        "0xe9e7cea3dedca5984780bafc599bd69add087d56": { price: 1.00 },
        "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd": { price: 18.45 },
        "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47": { price: 0.85 }
      };
      
      const currentPrice = knownTokens[normalizedAddress]?.price || 100;
      const now = Date.now();
      const data = [];
      
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
          intervalMinutes = 6 * 60;
          break;
        case "30D":
          dataPoints = 30;
          intervalMinutes = 24 * 60;
          break;
      }
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = now - (i * intervalMinutes * 60 * 1000);
        const variation = (Math.random() - 0.5) * 0.06; // ±3% variation
        const price = currentPrice * (1 + variation);
        
        data.push({
          timestamp,
          price: Math.max(price, currentPrice * 0.92) // Ensure minimum 92% of current price
        });
      }
      
      return data;
    };

    const priceHistory = generatePriceHistory(contractAddress, timeframe);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(priceHistory),
    };
  } catch (error) {
    console.error("Error fetching price history:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Failed to fetch price history",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};