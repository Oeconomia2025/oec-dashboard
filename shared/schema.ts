import { z } from "zod";

export const tokenDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  contractAddress: z.string(),
  price: z.number(),
  priceChange24h: z.number(),
  priceChangePercent24h: z.number(),
  marketCap: z.number(),
  volume24h: z.number(),
  totalSupply: z.number(),
  circulatingSupply: z.number(),
  liquidity: z.number(),
  txCount24h: z.number(),
  network: z.string(),
  lastUpdated: z.string(),
});

export const transactionSchema = z.object({
  hash: z.string(),
  type: z.enum(['BUY', 'SELL', 'TRANSFER']),
  amount: z.number(),
  amountUSD: z.number(),
  from: z.string(),
  to: z.string(),
  timestamp: z.string(),
  gasUsed: z.number(),
  gasPrice: z.number(),
});

export const holderSchema = z.object({
  address: z.string(),
  balance: z.number(),
  percentage: z.number(),
  rank: z.number(),
});

export const networkStatusSchema = z.object({
  blockNumber: z.number(),
  gasPrice: z.number(),
  isHealthy: z.boolean(),
  lastBlockTime: z.string(),
});

export const priceHistorySchema = z.object({
  timestamp: z.number(),
  price: z.number(),
  volume: z.number(),
});

export const tokenConfigSchema = z.object({
  contractAddress: z.string(),
  operationsWallet: z.string(),
  buyFee: z.number(),
  sellFee: z.number(),
  liquidityFee: z.number(),
  operationsFee: z.number(),
  network: z.enum(['mainnet', 'testnet']),
});

export type TokenData = z.infer<typeof tokenDataSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Holder = z.infer<typeof holderSchema>;
export type NetworkStatus = z.infer<typeof networkStatusSchema>;
export type PriceHistory = z.infer<typeof priceHistorySchema>;
export type TokenConfig = z.infer<typeof tokenConfigSchema>;

// Default TONE token configuration
export const TONE_TOKEN_CONFIG: TokenConfig = {
  contractAddress: "0x55d398326f99059fF775485246999027B3197955", // Using USDT BSC as placeholder until TONE is deployed
  operationsWallet: "0xD02dbe54454F6FE3c2F9F1F096C5460284E418Ed",
  buyFee: 5,
  sellFee: 5,
  liquidityFee: 2,
  operationsFee: 3,
  network: "mainnet",
};
