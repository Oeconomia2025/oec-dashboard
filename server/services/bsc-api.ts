import type { NetworkStatus, Transaction } from "@shared/schema";

const BSC_API_KEY = process.env.BSCSCAN_API_KEY || "YourBSCScanAPIKey";
const BSC_API_URL = "https://api.bscscan.com/api";

export class BSCApiService {
  private async makeRequest(params: Record<string, string>) {
    const url = new URL(BSC_API_URL);
    url.search = new URLSearchParams({
      ...params,
      apikey: BSC_API_KEY,
    }).toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`BSCScan API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "1") {
      throw new Error(`BSCScan API error: ${data.message}`);
    }

    return data.result;
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      // Get latest block number
      const blockNumber = await this.makeRequest({
        module: "proxy",
        action: "eth_blockNumber",
      });

      // Get current gas price
      const gasPrice = await this.makeRequest({
        module: "proxy",
        action: "eth_gasPrice",
      });

      // Convert hex to decimal and format
      const blockNum = parseInt(blockNumber, 16);
      const gasPriceGwei = Math.round(parseInt(gasPrice, 16) / 1e9);

      return {
        blockNumber: blockNum,
        gasPrice: gasPriceGwei,
        isHealthy: true,
        lastBlockTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching network status:", error);
      return {
        blockNumber: 0,
        gasPrice: 5,
        isHealthy: false,
        lastBlockTime: new Date().toISOString(),
      };
    }
  }

  async getTokenTransactions(contractAddress: string, limit: number = 50): Promise<Transaction[]> {
    try {
      const result = await this.makeRequest({
        module: "account",
        action: "tokentx",
        contractaddress: contractAddress,
        page: "1",
        offset: limit.toString(),
        sort: "desc",
      });

      return result.map((tx: any) => ({
        hash: tx.hash,
        type: this.determineTransactionType(tx),
        amount: parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal)),
        amountUSD: 0, // Would need additional price lookup
        from: tx.from,
        to: tx.to,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        gasUsed: parseInt(tx.gasUsed),
        gasPrice: parseInt(tx.gasPrice),
      }));
    } catch (error) {
      console.error("Error fetching token transactions:", error);
      return [];
    }
  }

  async getTokenHolders(contractAddress: string): Promise<any[]> {
    try {
      // BSCScan doesn't provide a direct holder list API
      // This would typically require a paid plan or different service
      // For now, return empty array - in production, consider using:
      // - Moralis API
      // - Alchemy API  
      // - The Graph Protocol
      console.log("Token holders endpoint not available in free BSCScan tier");
      return [];
    } catch (error) {
      console.error("Error fetching token holders:", error);
      return [];
    }
  }

  private determineTransactionType(tx: any): Transaction['type'] {
    // Simple heuristic - could be improved with DEX router analysis
    if (tx.from.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      return "TRANSFER"; // Mint
    }
    if (tx.to.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      return "TRANSFER"; // Burn
    }
    
    // Check if it's a DEX trade (very basic check)
    const pancakeRouters = [
      "0x10ed43c718714eb63d5aa57b78b54704e256024e", // PancakeSwap V2
      "0x05ff2b0db69458a0750badebc4f9e13add608c7f", // PancakeSwap V1
    ];
    
    if (pancakeRouters.some(router => 
      tx.from.toLowerCase() === router.toLowerCase() || 
      tx.to.toLowerCase() === router.toLowerCase()
    )) {
      return Math.random() > 0.5 ? "BUY" : "SELL"; // Random for demo - needs proper analysis
    }
    
    return "TRANSFER";
  }
}

export const bscApiService = new BSCApiService();
