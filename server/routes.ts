import type { Express } from "express";
import { createServer, type Server } from "http";
import { bscApiService } from "./services/bsc-api";
import { pancakeSwapApiService } from "./services/pancakeswap-api";
import { coinGeckoApiService } from "./services/coingecko-api";
import { TONE_TOKEN_CONFIG, type TokenData, type Holder } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get comprehensive token data
  app.get("/api/token/:contractAddress", async (req, res) => {
    try {
      const { contractAddress } = req.params;
      
      // Fetch data from multiple sources
      const [coinGeckoData, pancakeSwapData, pairData] = await Promise.all([
        coinGeckoApiService.getTokenDataByContract(contractAddress),
        pancakeSwapApiService.getTokenData(contractAddress),
        pancakeSwapApiService.getPairData(contractAddress),
      ]);

      // Combine data with fallbacks
      const tokenData: TokenData = {
        id: contractAddress,
        name: coinGeckoData?.name || pancakeSwapData?.name || "ThisOne",
        symbol: coinGeckoData?.symbol || pancakeSwapData?.symbol || "TONE",
        contractAddress,
        price: coinGeckoData?.price || pancakeSwapData?.price || 0.0045,
        priceChange24h: coinGeckoData?.priceChange24h || 0,
        priceChangePercent24h: coinGeckoData?.priceChangePercent24h || 0,
        marketCap: coinGeckoData?.marketCap || (coinGeckoData?.price || 0.0045) * 100000000,
        volume24h: coinGeckoData?.volume24h || pairData?.volume24h || 0,
        totalSupply: coinGeckoData?.totalSupply || 100000000,
        circulatingSupply: coinGeckoData?.circulatingSupply || 95000000,
        liquidity: pairData?.liquidity || 0,
        txCount24h: pairData?.txCount24h || 0,
        network: "BSC",
        lastUpdated: new Date().toISOString(),
      };

      res.json(tokenData);
    } catch (error) {
      console.error("Error fetching token data:", error);
      res.status(500).json({ 
        message: "Failed to fetch token data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get recent transactions
  app.get("/api/transactions/:contractAddress", async (req, res) => {
    try {
      const { contractAddress } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const transactions = await bscApiService.getTokenTransactions(contractAddress, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ 
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get top holders
  app.get("/api/holders/:contractAddress", async (req, res) => {
    try {
      const { contractAddress } = req.params;
      
      // BSCScan free tier doesn't provide holder data
      // In production, you'd use Moralis, Alchemy, or similar
      const mockHolders: Holder[] = [
        {
          address: "0x1234567890123456789012345678901234567890",
          balance: 12500000,
          percentage: 12.5,
          rank: 1,
        },
        {
          address: "0x9abcdef0123456789012345678901234567890ab",
          balance: 8200000,
          percentage: 8.2,
          rank: 2,
        },
        {
          address: "0x5678901234567890123456789012345678901234",
          balance: 6100000,
          percentage: 6.1,
          rank: 3,
        },
        {
          address: "0x3456789012345678901234567890123456789012",
          balance: 4500000,
          percentage: 4.5,
          rank: 4,
        },
        {
          address: "0x7890123456789012345678901234567890123456",
          balance: 3200000,
          percentage: 3.2,
          rank: 5,
        },
      ];
      
      res.json(mockHolders);
    } catch (error) {
      console.error("Error fetching holders:", error);
      res.status(500).json({ 
        message: "Failed to fetch holders",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get network status
  app.get("/api/network-status", async (req, res) => {
    try {
      const networkStatus = await bscApiService.getNetworkStatus();
      res.json(networkStatus);
    } catch (error) {
      console.error("Error fetching network status:", error);
      res.status(500).json({ 
        message: "Failed to fetch network status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get price history
  app.get("/api/price-history/:contractAddress/:timeframe", async (req, res) => {
    try {
      const { contractAddress, timeframe } = req.params;
      
      const priceHistory = await pancakeSwapApiService.getPriceHistory(contractAddress, timeframe);
      res.json(priceHistory);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ 
        message: "Failed to fetch price history",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get token configuration
  app.get("/api/token-config", (req, res) => {
    res.json(TONE_TOKEN_CONFIG);
  });

  const httpServer = createServer(app);
  return httpServer;
}
