class LiveCoinWatchApiService {
  private apiKey: string;
  private baseUrl = 'https://api.livecoinwatch.com';

  constructor() {
    this.apiKey = process.env.LIVE_COIN_WATCH_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Live Coin Watch API key not found');
    }
  }

  async getTopCoins(limit: number = 10): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('Live Coin Watch API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/coins/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          currency: 'USD',
          sort: 'rank',
          order: 'ascending',
          offset: 0,
          limit,
          meta: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Live Coin Watch API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from Live Coin Watch:', error);
      throw error;
    }
  }

  async getHistoricalData(tokenCode: string, startTime: number, endTime: number): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Live Coin Watch API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/coins/single/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          currency: 'USD',
          code: tokenCode,
          start: startTime,
          end: endTime,
          meta: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Live Coin Watch API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching historical data from Live Coin Watch:', error);
      throw error;
    }
  }
}

export const liveCoinWatchApiService = new LiveCoinWatchApiService();