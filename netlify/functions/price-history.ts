import type { Handler } from '@netlify/functions';
import { coinGeckoApiService } from './lib/services/coingecko-api';
import type { PriceHistory } from './lib/shared/schema';

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

    // Generate mock price history based on timeframe
    const generatePriceHistory = (timeframe: string): PriceHistory[] => {
      const basePrice = 0.999;
      const now = Math.floor(Date.now() / 1000);
      const data: PriceHistory[] = [];
      
      let intervals: number;
      let timeStep: number;
      
      switch (timeframe) {
        case '1H':
          intervals = 60;
          timeStep = 60; // 1 minute intervals
          break;
        case '1D':
          intervals = 288;
          timeStep = 300; // 5 minute intervals
          break;
        case '7D':
          intervals = 168;
          timeStep = 3600; // 1 hour intervals
          break;
        case '30D':
          intervals = 720;
          timeStep = 3600; // 1 hour intervals
          break;
        default:
          intervals = 288;
          timeStep = 300;
      }
      
      for (let i = intervals; i >= 0; i--) {
        const timestamp = now - (i * timeStep);
        const variance = (Math.random() - 0.5) * 0.002; // ±0.1% variance
        const price = basePrice + variance;
        
        data.push({
          timestamp,
          price: Math.max(0.995, Math.min(1.005, price)), // Keep within reasonable bounds
        });
      }
      
      return data;
    };

    const priceHistory = generatePriceHistory(timeframe);

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