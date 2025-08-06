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
    // Extract timeframe from path
    const timeframe = event.path.split('/').pop();
    
    if (!timeframe) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Timeframe is required' }),
      };
    }

    // Fetch ETH historical data from database
    const historicalData = await db
      .select()
      .from(schema.priceHistoryData)
      .where(and(
        eq(schema.priceHistoryData.tokenCode, 'ETH'),
        eq(schema.priceHistoryData.timeframe, timeframe)
      ))
      .orderBy(schema.priceHistoryData.timestamp);

    // Transform data to match expected format
    const formattedData = historicalData.map(record => ({
      timestamp: record.timestamp,
      price: record.price
    }));

    // If no data found, return empty array
    if (formattedData.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedData),
    };
  } catch (error) {
    console.error('Error fetching ETH historical data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to fetch ETH historical data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};