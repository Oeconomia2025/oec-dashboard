import type { Handler } from '@netlify/functions';
import { db } from './lib/shared/db.js';
import { liveCoinWatchCoins } from './lib/shared/schema';
import { desc } from 'drizzle-orm';

export const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    // Get all coins ordered by market cap (highest first)
    const coins = await db
      .select()
      .from(liveCoinWatchCoins)
      .orderBy(desc(liveCoinWatchCoins.cap));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coins,
        lastUpdated: coins.length > 0 ? coins[0].lastUpdated : null,
        isServiceRunning: false, // Netlify functions are stateless
      }),
    };
  } catch (error) {
    console.error('Error fetching Live Coin Watch data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Failed to fetch Live Coin Watch data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};