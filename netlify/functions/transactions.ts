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
    // Extract contract address from path
    const contractAddress = event.path.split('/').pop();
    
    if (!contractAddress) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Contract address is required' }),
      };
    }

    const limit = parseInt(event.queryStringParameters?.limit || '20');
    const transactions = await bscApiService.getTokenTransactions(contractAddress, limit);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transactions),
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};