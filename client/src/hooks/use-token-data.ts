import { useQuery } from "@tanstack/react-query";
import type { TokenData, Transaction, Holder, NetworkStatus, PriceHistory } from "@shared/schema";

export function useTokenData(contractAddress: string) {
  return useQuery<TokenData>({
    queryKey: ["/api/token", contractAddress],
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!contractAddress,
    retry: false, // Don't retry failed requests in production
    staleTime: 60000, // Cache for 1 minute
  });
}

export function useTransactions(contractAddress: string) {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions", contractAddress],
    refetchInterval: 30000,
    enabled: !!contractAddress,
    retry: false,
    staleTime: 60000,
  });
}

export function useTopHolders(contractAddress: string) {
  return useQuery<Holder[]>({
    queryKey: ["/api/holders", contractAddress],
    refetchInterval: 60000, // Refresh every minute
    enabled: !!contractAddress,
    retry: false,
    staleTime: 120000,
  });
}

export function useNetworkStatus() {
  return useQuery<NetworkStatus>({
    queryKey: ["/api/network-status"],
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: false,
    staleTime: 30000,
  });
}

export function usePriceHistory(contractAddress: string, timeframe: string = "1D") {
  return useQuery<PriceHistory[]>({
    queryKey: ["/api/price-history", contractAddress, timeframe],
    refetchInterval: 60000, // Refresh every minute
    enabled: !!contractAddress,
    retry: false,
    staleTime: 120000,
  });
}
