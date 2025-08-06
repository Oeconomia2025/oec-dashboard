import type { Handler } from '@netlify/functions';
import { db } from './lib/shared/db.js';
import { liveCoinWatchCoins } from './lib/shared/schema';
import { eq } from 'drizzle-orm';

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
    // Extract token code from path
    const pathParts = event.path.split('/');
    const tokenCode = pathParts[pathParts.length - 1]?.toUpperCase();
    
    if (!tokenCode) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Token code is required' }),
      };
    }

    // Find the token in database
    const [tokenData] = await db
      .select()
      .from(liveCoinWatchCoins)
      .where(eq(liveCoinWatchCoins.code, tokenCode))
      .limit(1);

    if (!tokenData) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Token not found' }),
      };
    }

    // Map to BSC contract addresses for supported tokens
    const contractMapping: Record<string, string> = {
      'BTC': '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      'ETH': '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      'USDT': '0x55d398326f99059ff775485246999027b3197955',
      'USDC': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      'LINK': '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      'ADA': '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    };

    // Convert to TokenData format
    const response = {
      id: contractMapping[tokenCode] || tokenCode,
      name: tokenData.name,
      symbol: tokenData.code,
      contractAddress: contractMapping[tokenCode],
      price: tokenData.rate,
      priceChange24h: tokenData.deltaDay || 0,
      priceChangePercent24h: tokenData.deltaDay || 0,
      marketCap: tokenData.cap || 0,
      volume24h: tokenData.volume || 0,
      totalSupply: 0, // Not available in Live Coin Watch
      circulatingSupply: 0, // Not available in Live Coin Watch
      lastUpdated: tokenData.lastUpdated,
      
      // Extended performance metrics
      performance: {
        hourChange: tokenData.deltaHour || 0,
        dayChange: tokenData.deltaDay || 0,
        weekChange: tokenData.deltaWeek || 0,
        monthChange: tokenData.deltaMonth || 0,
        quarterChange: tokenData.deltaQuarter || 0,
        yearChange: tokenData.deltaYear || 0,
      }
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Failed to fetch token data',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};