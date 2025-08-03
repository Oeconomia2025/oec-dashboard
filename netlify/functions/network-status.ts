import type { Handler } from '@netlify/functions';
import { bscApiService } from './lib/services/bsc-api';

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
    const networkStatus = await bscApiService.getNetworkStatus();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(networkStatus),
    };
  } catch (error) {
    console.error("Error fetching network status:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Failed to fetch network status",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};