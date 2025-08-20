import type { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, eq, and } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

const ALLOWED_TIMEFRAMES = new Set(['1H', '1D', '7D', '30D']); // match what you store

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    const url = new URL(event.rawUrl);
    const token = (url.searchParams.get('token') || '').toUpperCase();
    const timeframe = (url.searchParams.get('timeframe') || '1D').toUpperCase();
    const limit = Math.min(Number(url.searchParams.get('limit') || '500'), 5000); // safety cap

    if (!token || token.length > 10) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Invalid token' }) };
    }
    if (!ALLOWED_TIMEFRAMES.has(timeframe)) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Invalid timeframe' }) };
    }

    // SELECT * FROM price_history_data WHERE token_code=token AND timeframe=timeframe ORDER BY timestamp ASC
    const rows = await db
      .select()
      .from(schema.priceHistoryData)
      .where(and(
        eq(schema.priceHistoryData.tokenCode, token),
        eq(schema.priceHistoryData.timeframe, timeframe),
      ))
      .orderBy(schema.priceHistoryData.timestamp) // ascending for chart
      .limit(limit);

    // Normalize to the shape your chart expects
    const points = rows.map(r => ({
      timestamp: Number(r.timestamp), // unix ms/seconds depending on how you store
      price: r.price,
      volume: r.volume ?? null,
      marketCap: r.marketCap ?? null,
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ token, timeframe, points }) };
  } catch (e) {
    console.error('historical error', e);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Failed to fetch history' }) };
  }
};
