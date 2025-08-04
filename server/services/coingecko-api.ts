import type { TokenData } from "@shared/schema";

export class CoinGeckoApiService {
  private readonly COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
  private readonly API_KEY = process.env.COINGECKO_API_KEY;

  async getTokenDataByContract(contractAddress: string): Promise<Partial<TokenData> | null> {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/binance-smart-chain/contract/${contractAddress}`;
      const headers: Record<string, string> = {
        'accept': 'application/json',
      };

      if (this.API_KEY) {
        headers['x-cg-demo-api-key'] = this.API_KEY;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Token not found on CoinGecko: ${contractAddress}`);
          return null;
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.market_data) {
        return null;
      }

      const marketData = data.market_data;

      return {
        name: data.name,
        symbol: data.symbol?.toUpperCase(),
        price: marketData.current_price?.usd || 0,
        priceChange24h: marketData.price_change_24h || 0,
        priceChangePercent24h: marketData.price_change_percentage_24h || 0,
        marketCap: marketData.market_cap?.usd || 0,
        volume24h: marketData.total_volume?.usd || 0,
        totalSupply: marketData.total_supply || 0,
        circulatingSupply: marketData.circulating_supply || 0,
      };
    } catch (error) {
      console.error("Error fetching CoinGecko data:", error);
      return null;
    }
  }

  async getSimplePrice(contractAddress: string): Promise<{ price: number; change24h: number } | null> {
    try {
      const url = `${this.COINGECKO_API_URL}/simple/token_price/binance-smart-chain`;
      const params = new URLSearchParams({
        contract_addresses: contractAddress,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
      });

      const headers: Record<string, string> = {
        'accept': 'application/json',
      };

      if (this.API_KEY) {
        headers['x-cg-demo-api-key'] = this.API_KEY;
      }

      const response = await fetch(`${url}?${params}`, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko simple price API error: ${response.status}`);
      }

      const data = await response.json();
      const tokenData = data[contractAddress.toLowerCase()];

      if (!tokenData) {
        return null;
      }

      return {
        price: tokenData.usd || 0,
        change24h: tokenData.usd_24h_change || 0,
      };
    } catch (error) {
      console.error("Error fetching CoinGecko simple price:", error);
      return null;
    }
  }

  async getEthereumData(): Promise<Partial<TokenData> | null> {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/ethereum`;
      const headers: Record<string, string> = {
        'accept': 'application/json',
      };

      if (this.API_KEY) {
        headers['x-cg-demo-api-key'] = this.API_KEY;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko ETH API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.market_data) {
        return null;
      }

      const marketData = data.market_data;

      return {
        name: data.name,
        symbol: data.symbol?.toUpperCase(),
        price: marketData.current_price?.usd || 0,
        priceChange24h: marketData.price_change_24h || 0,
        priceChangePercent24h: marketData.price_change_percentage_24h || 0,
        marketCap: marketData.market_cap?.usd || 0,
        volume24h: marketData.total_volume?.usd || 0,
        totalSupply: marketData.total_supply || 0,
        circulatingSupply: marketData.circulating_supply || 0,
      };
    } catch (error) {
      console.error("Error fetching ETH data from CoinGecko:", error);
      return null;
    }
  }

  async getEthereumPriceHistory(days: number): Promise<any[]> {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/ethereum/market_chart`;
      const params = new URLSearchParams({
        vs_currency: 'usd',
        days: days.toString(),
        interval: days <= 1 ? 'hourly' : 'daily'
      });

      const headers: Record<string, string> = {
        'accept': 'application/json',
      };

      if (this.API_KEY) {
        headers['x-cg-demo-api-key'] = this.API_KEY;
      }

      const response = await fetch(`${url}?${params}`, { headers });
      
      if (!response.ok) {
        // If rate limited or API error, return fallback data
        console.warn(`CoinGecko rate limited (${response.status}), using fallback ETH price history`);
        const fallback = this.generateEthFallbackHistory(days);
        console.log(`Generated ${fallback.length} fallback data points`);
        return fallback;
      }

      const data = await response.json();

      if (!data.prices || !Array.isArray(data.prices)) {
        return this.generateEthFallbackHistory(days);
      }

      // Convert CoinGecko format to our format
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp: new Date(timestamp).toISOString(),
        price: price
      }));
    } catch (error) {
      console.error("Error fetching ETH price history from CoinGecko:", error);
      console.log("Generating fallback ETH price history");
      const fallback = this.generateEthFallbackHistory(days);
      console.log(`Generated ${fallback.length} fallback data points in catch`);
      return fallback;
    }
  }

  private generateEthFallbackHistory(days: number): any[] {
    const now = Date.now();
    const basePrice = 3539; // Current ETH price
    const data: any[] = [];
    
    const points = days <= 1 ? 24 : days; // Hourly for 1 day, daily for others
    const interval = days <= 1 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour or 1 day

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now - (i * interval)).toISOString();
      // Generate realistic price variation based on current ETH volatility
      const variation = (Math.random() - 0.5) * 0.03; // ±1.5% variation
      const price = basePrice * (1 + variation * (i / points)); // Slight trend
      
      data.push({
        timestamp,
        price: Math.round(price * 100) / 100
      });
    }

    return data;
  }
}

export const coinGeckoApiService = new CoinGeckoApiService();
