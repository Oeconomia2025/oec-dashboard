import type { Handler } from '@netlify/functions';

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

    // For now, return placeholder data until we can implement database access in Netlify functions
    const placeholderData = {
      '1H': [
        { timestamp: Date.now() - 3600000, price: 3600 },
        { timestamp: Date.now() - 1800000, price: 3610 },
        { timestamp: Date.now(), price: 3620 }
      ],
      '1D': [
        { timestamp: Date.now() - 86400000, price: 3500 },
        { timestamp: Date.now() - 43200000, price: 3550 },
        { timestamp: Date.now(), price: 3620 }
      ],
      '7D': [
        { timestamp: Date.now() - 604800000, price: 3300 },
        { timestamp: Date.now() - 302400000, price: 3450 },
        { timestamp: Date.now(), price: 3620 }
      ],
      '30D': [
        { timestamp: Date.now() - 2592000000, price: 3000 },
        { timestamp: Date.now() - 1296000000, price: 3300 },
        { timestamp: Date.now(), price: 3620 }
      ]
    };

    const data = placeholderData[timeframe as keyof typeof placeholderData] || placeholderData['1D'];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
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