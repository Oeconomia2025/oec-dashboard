import type { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export const handler: Handler = async (event) => {
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
    // Extract token code from path (e.g., /api/live-coin-watch/token/ETH)
    const pathParts = event.path.split('/');
    const tokenCode = pathParts[pathParts.length - 1];
    
    if (!tokenCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Token code is required' }),
      };
    }

    // Fetch token data from database
    const [tokenData] = await db
      .select()
      .from(schema.liveCoinWatchCoins)
      .where(eq(schema.liveCoinWatchCoins.code, tokenCode))
      .limit(1);

    if (!tokenData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: `Token ${tokenCode} not found` }),
      };
    }

    // Transform database data to match expected API format
    const response = {
      id: `0x2170ed0880ac9a755fd29b2de584394ba5d4a17f`, // BSC ETH contract
      code: tokenData.code,
      name: tokenData.name,
      symbol: tokenData.code,
      contractAddress: tokenData.code === 'ETH' ? '0x2170ed0880ac9a755fd29b2de584394ba5d4a17f' : '',
      network: 'BSC',
      price: tokenData.rate,
      priceChange24h: tokenData.deltaDay ? (tokenData.rate * tokenData.deltaDay / 100) : 0,
      priceChangePercent24h: tokenData.deltaDay || 0,
      marketCap: tokenData.cap || 0,
      volume24h: tokenData.volume || 0,
      totalSupply: tokenData.code === 'ETH' ? 120300000 : 0,
      circulatingSupply: tokenData.code === 'ETH' ? 120300000 : 0,
      lastUpdated: tokenData.lastUpdated?.toISOString() || new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error fetching Live Coin Watch token data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to fetch token data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};