import { Alchemy, Network, TokenBalanceType } from 'alchemy-sdk';

export interface AlchemyTokenData {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  logo?: string;
}

export interface AlchemyTransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timeStamp: string;
  asset: string;
  category: string;
  rawContract?: {
    address: string;
    decimal: string;
  };
}

export interface AlchemyNetworkStatus {
  blockNumber: number;
  gasPrice: number;
  isHealthy: boolean;
  chainId: number;
}

export class AlchemyApiService {
  private alchemy: Alchemy;

  constructor() {
    if (!process.env.ALCHEMY_API_KEY) {
      throw new Error('ALCHEMY_API_KEY environment variable is required');
    }

    this.alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.BNB_MAINNET, // BSC network
    });
  }

  async getTokenBalance(contractAddress: string, walletAddress: string): Promise<string> {
    try {
      const tokenBalances = await this.alchemy.core.getTokenBalances(walletAddress, [contractAddress]);
      
      if (tokenBalances.tokenBalances && tokenBalances.tokenBalances.length > 0) {
        return tokenBalances.tokenBalances[0].tokenBalance || '0';
      }
      return '0';
    } catch (error) {
      console.error('Error fetching token balance from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllTokenBalances(walletAddress: string): Promise<AlchemyTokenData[]> {
    try {
      const tokenBalances = await this.alchemy.core.getTokenBalances(walletAddress, { type: TokenBalanceType.ERC20 });
      const tokens: AlchemyTokenData[] = [];

      for (const tokenBalance of tokenBalances.tokenBalances) {
        if (tokenBalance.tokenBalance && tokenBalance.contractAddress) {
          try {
            const metadata = await this.alchemy.core.getTokenMetadata(tokenBalance.contractAddress);
            
            tokens.push({
              contractAddress: tokenBalance.contractAddress,
              name: metadata.name || 'Unknown Token',
              symbol: metadata.symbol || 'UNKNOWN',
              decimals: metadata.decimals || 18,
              balance: tokenBalance.tokenBalance,
              logo: metadata.logo || undefined,
            });
          } catch (metadataError) {
            // Skip tokens where we can't get metadata
            console.warn(`Could not get metadata for token ${tokenBalance.contractAddress}`);
          }
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error fetching all token balances from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAssetTransfers(contractAddress: string, limit: number = 20): Promise<AlchemyTransactionData[]> {
    try {
      const transfers = await this.alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toBlock: 'latest',
        contractAddresses: [contractAddress],
        category: ['erc20' as any, 'external' as any],
        withMetadata: true,
        maxCount: limit,
      });

      return transfers.transfers.map((transfer) => ({
        hash: transfer.hash,
        from: transfer.from,
        to: transfer.to || '',
        value: transfer.value?.toString() || '0',
        blockNumber: parseInt(transfer.blockNum, 16),
        timeStamp: new Date(transfer.metadata?.blockTimestamp || Date.now()).toISOString(),
        asset: transfer.asset || contractAddress,
        category: transfer.category,
        rawContract: transfer.rawContract ? {
          address: transfer.rawContract.address || contractAddress,
          decimal: transfer.rawContract.decimal || '18',
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching asset transfers from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNetworkStatus(): Promise<AlchemyNetworkStatus> {
    try {
      const [blockNumber, gasPrice] = await Promise.all([
        this.alchemy.core.getBlockNumber(),
        this.alchemy.core.getGasPrice(),
      ]);

      return {
        blockNumber,
        gasPrice: parseInt(gasPrice.toString()) / 1e9, // Convert to Gwei
        isHealthy: true,
        chainId: 56, // BSC chain ID
      };
    } catch (error) {
      console.error('Error fetching network status from Alchemy:', error);
      return {
        blockNumber: 0,
        gasPrice: 5,
        isHealthy: false,
        chainId: 56,
      };
    }
  }

  async getTokenMetadata(contractAddress: string) {
    try {
      const metadata = await this.alchemy.core.getTokenMetadata(contractAddress);
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        logo: metadata.logo,
      };
    } catch (error) {
      console.error('Error fetching token metadata from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransactionReceipt(txHash: string) {
    try {
      return await this.alchemy.core.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error fetching transaction receipt from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLatestBlock() {
    try {
      return await this.alchemy.core.getBlock('latest');
    } catch (error) {
      console.error('Error fetching latest block from Alchemy:', error);
      throw new Error(`Alchemy API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const alchemyApiService = new AlchemyApiService();