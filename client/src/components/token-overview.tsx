import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, BarChart3, ArrowUpDown, Droplets } from "lucide-react";
import type { TokenData } from "@shared/schema";

interface TokenOverviewProps {
  tokenData?: TokenData;
  isLoading: boolean;
}

export function TokenOverview({ tokenData, isLoading }: TokenOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="crypto-card p-6">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="crypto-card p-6 text-center">
          <p className="text-gray-400">Failed to load token data</p>
        </Card>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(5);
    return parseFloat(fixed).toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 5 
    });
  };

  const formatPrice = (price: number) => `$${formatNumber(price)}`;
  const formatMarketCap = (cap: number) => `$${formatNumber(cap)}`;
  const formatVolume = (vol: number) => `$${formatNumber(vol)}`;
  const formatLiquidity = (liq: number) => `$${formatNumber(liq)}`;
  const formatSupply = (supply: number) => `${formatNumber(supply)} ${tokenData.symbol}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Price Card */}
      <Card className="p-6 border bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 border-green-500 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg shadow-green-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-medium">Current Price</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            tokenData.priceChangePercent24h >= 0 
              ? 'bg-white/20 text-white border border-white/30' 
              : 'bg-red-500 text-white border border-red-400'
          }`}>
            {tokenData.priceChangePercent24h >= 0 ? '+' : ''}
            {tokenData.priceChangePercent24h.toFixed(1)}%
          </span>
        </div>
        <div className="text-2xl font-bold mb-2 text-white">{formatPrice(tokenData.price)}</div>
        <div className="text-sm text-white/80">
          24h Change: 
          <span className={tokenData.priceChange24h >= 0 ? 'text-white' : 'text-red-200'}>
            {tokenData.priceChange24h >= 0 ? '+' : ''}${tokenData.priceChange24h.toFixed(6)}
          </span>
        </div>
      </Card>

      {/* Market Cap Card */}
      <Card className="p-6 border bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-600 dark:via-cyan-600 dark:to-blue-700 border-blue-500 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-medium">Market Cap</h3>
          <BarChart3 className="text-white w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2 text-white">{formatMarketCap(tokenData.marketCap)}</div>
        <div className="text-sm text-white/80">
          Total Supply: <span>{formatSupply(tokenData.totalSupply)}</span>
        </div>
      </Card>

      {/* Volume Card */}
      <Card className="p-6 border bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 dark:from-amber-600 dark:via-orange-600 dark:to-amber-700 border-amber-500 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-medium">24h Volume</h3>
          <ArrowUpDown className="text-white w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2 text-white">{formatVolume(tokenData.volume24h)}</div>
        <div className="text-sm text-white/80">
          Transactions: <span>{tokenData.txCount24h}</span>
        </div>
      </Card>

      {/* Liquidity Card */}
      <Card className="p-6 border bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 dark:from-purple-600 dark:via-pink-600 dark:to-purple-700 border-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-medium">Liquidity Pool</h3>
          <Droplets className="text-white w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2 text-white">{formatLiquidity(tokenData.liquidity)}</div>
        <div className="text-sm text-white/80">PancakeSwap V2</div>
      </Card>
    </div>
  );
}
