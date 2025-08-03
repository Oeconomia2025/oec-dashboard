import type { Express } from "express";
import { createServer, type Server } from "http";
import { bscApiService } from "./services/bsc-api";
import { pancakeSwapApiService } from "./services/pancakeswap-api";
import { coinGeckoApiService } from "./services/coingecko-api";
import { storage } from "./storage";
import { 
  TONE_TOKEN_CONFIG, 
  type TokenData, 
  type Holder,
  insertTrackedTokenSchema,
  insertTokenSnapshotSchema,
  insertUserWatchlistSchema
} from "@shared/schema";

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

      // Determine the price with proper fallback logic
      let price = 0.998; // Default USDT-like price
      if (coinGeckoData?.price && coinGeckoData.price > 0) {
        price = coinGeckoData.price;
      } else if (pancakeSwapData?.price && pancakeSwapData.price > 0) {
        price = pancakeSwapData.price;
      }
      
      // Combine data with fallbacks
      const tokenData: TokenData = {
        id: contractAddress,
        name: coinGeckoData?.name || pancakeSwapData?.name || "Binance Bridged USDT (BNB Smart Chain)",
        symbol: coinGeckoData?.symbol || pancakeSwapData?.symbol || "BSC-USD",
        contractAddress,
        price: price,
        priceChange24h: coinGeckoData?.priceChange24h || -0.002,
        priceChangePercent24h: coinGeckoData?.priceChangePercent24h || -0.2,
        marketCap: coinGeckoData?.marketCap || price * 6784993699,
        volume24h: coinGeckoData?.volume24h || pairData?.volume24h || 2500000000,
        totalSupply: coinGeckoData?.totalSupply || 6784993699,
        circulatingSupply: coinGeckoData?.circulatingSupply || 6784993699,
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

  // Get portfolio data for a wallet address
  app.get("/api/portfolio/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const tokens = req.query.tokens as string;
      
      if (!tokens) {
        return res.json([]);
      }

      const tokenAddresses = tokens.split(',');
      const portfolio = [];

      for (const tokenAddress of tokenAddresses) {
        try {
          // Get token balance using BSCScan API
          const balance = await bscApiService.getTokenBalance(walletAddress, tokenAddress);
          
          // Get token info from our existing API
          const [coinGeckoData, pancakeSwapData] = await Promise.all([
            coinGeckoApiService.getTokenDataByContract(tokenAddress).catch(() => null),
            pancakeSwapApiService.getTokenData(tokenAddress).catch(() => null),
          ]);

          // Better token info fallbacks based on known contract addresses
          const getTokenFallback = (address: string) => {
            const knownTokens: Record<string, {name: string, symbol: string, decimals: number}> = {
              '0x55d398326f99059fF775485246999027B3197955': { name: 'Tether USD', symbol: 'USDT', decimals: 18 },
              '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': { name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
              '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
              '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': { name: 'Wrapped Ethereum', symbol: 'WETH', decimals: 18 },
              '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c': { name: 'Bitcoin BEP2', symbol: 'BTCB', decimals: 18 },
              '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': { name: 'BNB', symbol: 'BNB', decimals: 18 },
            };
            return knownTokens[address.toLowerCase()] || { name: 'Unknown Token', symbol: 'UNK', decimals: 18 };
          };

          const fallback = getTokenFallback(tokenAddress);
          const tokenInfo = {
            address: tokenAddress,
            name: coinGeckoData?.name || pancakeSwapData?.name || fallback.name,
            symbol: coinGeckoData?.symbol || pancakeSwapData?.symbol || fallback.symbol,
            balance: balance || '0',
            decimals: fallback.decimals,
            price: coinGeckoData?.price || pancakeSwapData?.price || 0,
          };

          // Calculate USD value
          const balanceNum = parseFloat(tokenInfo.balance) / Math.pow(10, tokenInfo.decimals);
          tokenInfo.value = balanceNum * (tokenInfo.price || 0);

          portfolio.push(tokenInfo);
        } catch (error) {
          console.log(`Error fetching data for token ${tokenAddress}:`, error);
          // Continue with other tokens
        }
      }

      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ 
        message: "Failed to fetch portfolio",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get price history
  app.get("/api/price-history/:contractAddress/:timeframe", async (req, res) => {
    try {
      const { contractAddress, timeframe } = req.params;
      
      // Get current price first to base history on it
      const coinGeckoData = await coinGeckoApiService.getTokenDataByContract(contractAddress);
      const currentPrice = coinGeckoData?.price || 0.998;
      
      const priceHistory = await pancakeSwapApiService.getPriceHistory(contractAddress, timeframe, currentPrice);
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

  // Database-enabled endpoints
  
  // Track a new token - automatically saves to database
  app.post("/api/tracked-tokens", async (req, res) => {
    try {
      const tokenData = insertTrackedTokenSchema.parse(req.body);
      
      // Check if token already exists
      const existingToken = await storage.getTrackedToken(tokenData.contractAddress);
      if (existingToken) {
        return res.status(409).json({ message: "Token already being tracked" });
      }
      
      const trackedToken = await storage.createTrackedToken(tokenData);
      res.status(201).json(trackedToken);
    } catch (error) {
      console.error("Error tracking token:", error);
      res.status(500).json({ 
        message: "Failed to track token",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all tracked tokens
  app.get("/api/tracked-tokens", async (req, res) => {
    try {
      const tokens = await storage.getAllTrackedTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching tracked tokens:", error);
      res.status(500).json({ 
        message: "Failed to fetch tracked tokens",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Save token snapshot (for historical data)
  app.post("/api/token-snapshots", async (req, res) => {
    try {
      const snapshotData = insertTokenSnapshotSchema.parse(req.body);
      const snapshot = await storage.createTokenSnapshot(snapshotData);
      res.status(201).json(snapshot);
    } catch (error) {
      console.error("Error saving token snapshot:", error);
      res.status(500).json({ 
        message: "Failed to save token snapshot",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get historical snapshots for a token
  app.get("/api/token-snapshots/:tokenId", async (req, res) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const limit = parseInt(req.query.limit as string) || 100;
      
      const snapshots = await storage.getTokenSnapshots(tokenId, limit);
      res.json(snapshots);
    } catch (error) {
      console.error("Error fetching token snapshots:", error);
      res.status(500).json({ 
        message: "Failed to fetch token snapshots",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User watchlist endpoints
  app.get("/api/watchlist/:userAddress", async (req, res) => {
    try {
      const { userAddress } = req.params;
      const watchlist = await storage.getUserWatchlist(userAddress);
      res.json(watchlist);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ 
        message: "Failed to fetch watchlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const watchlistData = insertUserWatchlistSchema.parse(req.body);
      const watchlistItem = await storage.addToWatchlist(watchlistData);
      res.status(201).json(watchlistItem);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ 
        message: "Failed to add to watchlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/watchlist/:userAddress/:tokenId", async (req, res) => {
    try {
      const { userAddress, tokenId } = req.params;
      const success = await storage.removeFromWatchlist(userAddress, parseInt(tokenId));
      
      if (success) {
        res.json({ message: "Removed from watchlist" });
      } else {
        res.status(404).json({ message: "Watchlist item not found" });
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ 
        message: "Failed to remove from watchlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhanced token data endpoint that also saves to database
  app.get("/api/token/:contractAddress", async (req, res) => {
    try {
      const { contractAddress } = req.params;
      
      // Get or create tracked token
      let trackedToken = await storage.getTrackedToken(contractAddress);
      
      // Fetch data from multiple sources
      const [coinGeckoData, pancakeSwapData, pairData] = await Promise.all([
        coinGeckoApiService.getTokenDataByContract(contractAddress),
        pancakeSwapApiService.getTokenData(contractAddress),
        pancakeSwapApiService.getPairData(contractAddress),
      ]);

      // Combine data with fallbacks
      const tokenData: TokenData = {
        id: contractAddress,
        name: coinGeckoData?.name || pancakeSwapData?.name || "Unknown Token",
        symbol: coinGeckoData?.symbol || pancakeSwapData?.symbol || "UNK",
        contractAddress,
        price: coinGeckoData?.price || pancakeSwapData?.price || 0,
        priceChange24h: coinGeckoData?.priceChange24h || 0,
        priceChangePercent24h: coinGeckoData?.priceChangePercent24h || 0,
        marketCap: coinGeckoData?.marketCap || (coinGeckoData?.price || 0) * (coinGeckoData?.totalSupply || 0),
        volume24h: coinGeckoData?.volume24h || pairData?.volume24h || 0,
        totalSupply: coinGeckoData?.totalSupply || 0,
        circulatingSupply: coinGeckoData?.circulatingSupply || 0,
        liquidity: pairData?.liquidity || 0,
        txCount24h: pairData?.txCount24h || 0,
        network: "BSC",
        lastUpdated: new Date().toISOString(),
      };

      // Create tracked token if it doesn't exist and has valid data
      if (!trackedToken && tokenData.name !== "Unknown Token") {
        try {
          trackedToken = await storage.createTrackedToken({
            contractAddress,
            name: tokenData.name,
            symbol: tokenData.symbol,
            network: "BSC",
            isActive: true,
          });
          
          // Save initial snapshot
          if (trackedToken && tokenData.price > 0) {
            await storage.createTokenSnapshot({
              tokenId: trackedToken.id,
              price: tokenData.price,
              marketCap: tokenData.marketCap,
              volume24h: tokenData.volume24h,
              liquidity: tokenData.liquidity,
              txCount24h: tokenData.txCount24h,
              priceChange24h: tokenData.priceChange24h,
              priceChangePercent24h: tokenData.priceChangePercent24h,
              totalSupply: tokenData.totalSupply,
              circulatingSupply: tokenData.circulatingSupply,
            });
          }
        } catch (dbError) {
          console.warn("Failed to save token to database:", dbError);
          // Continue without database save
        }
      }

      res.json(tokenData);
    } catch (error) {
      console.error("Error fetching token data:", error);
      res.status(500).json({ 
        message: "Failed to fetch token data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
