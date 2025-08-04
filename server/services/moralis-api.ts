class MoralisApiService {
  private baseUrl = 'https://deep-index.moralis.io/api/v2.2';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.MORALIS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Moralis API key not found');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    if (!this.apiKey) {
      throw new Error('Moralis API key not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get token balance for a wallet address
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/erc20/${tokenAddress}/balances`, {
        chain: 'bsc',
        wallet_addresses: [walletAddress],
      });

      return response[0]?.balance || '0';
    } catch (error) {
      console.error('Error fetching token balance from Moralis:', error);
      return '0';
    }
  }

  // Get ERC20 transfers for a token
  async getTokenTransfers(tokenAddress: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/erc20/${tokenAddress}/transfers`, {
        chain: 'bsc',
        limit,
        order: 'DESC',
      });

      return response.result || [];
    } catch (error) {
      console.error('Error fetching token transfers from Moralis:', error);
      return [];
    }
  }

  // Get native balance (BNB) for a wallet
  async getNativeBalance(walletAddress: string): Promise<string> {
    try {
      const response = await this.makeRequest(`/${walletAddress}/balance`, {
        chain: 'bsc',
      });

      return response.balance || '0';
    } catch (error) {
      console.error('Error fetching native balance from Moralis:', error);
      return '0';
    }
  }

  // Get all token balances for a wallet
  async getWalletTokenBalances(walletAddress: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/${walletAddress}/erc20`, {
        chain: 'bsc',
      });

      return response || [];
    } catch (error) {
      console.error('Error fetching wallet token balances from Moralis:', error);
      return [];
    }
  }

  // Get token metadata
  async getTokenMetadata(tokenAddress: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/erc20/metadata`, {
        chain: 'bsc',
        addresses: [tokenAddress],
      });

      return response[0] || null;
    } catch (error) {
      console.error('Error fetching token metadata from Moralis:', error);
      return null;
    }
  }

  // Get block information for network status
  async getLatestBlock(): Promise<any> {
    try {
      // Use dateToBlock to get current block number
      const response = await this.makeRequest('/dateToBlock', {
        chain: 'bsc',
        date: new Date().toISOString()
      });

      return {
        number: response.block || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching latest block from Moralis:', error);
      return null;
    }
  }

  // Get token price from Moralis
  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      const response = await this.makeRequest(`/erc20/${tokenAddress}/price`, {
        chain: 'bsc',
      });

      return response.usdPrice || 0;
    } catch (error) {
      console.error('Error fetching token price from Moralis:', error);
      return 0;
    }
  }
}

export const moralisApiService = new MoralisApiService();