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
      <Card className="crypto-card crypto-hover p-6 border bg-gradient-to-br from-green-500/25 via-emerald-500/20 to-green-600/15 border-green-500/40 hover:from-green-500/35 hover:via-emerald-500/30 hover:to-green-600/25 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-medium">Current Price</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            tokenData.priceChangePercent24h >= 0 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {tokenData.priceChangePercent24h >= 0 ? '+' : ''}
            {tokenData.priceChangePercent24h.toFixed(1)}%
          </span>
        </div>
        <div className="text-2xl font-bold mb-2">{formatPrice(tokenData.price)}</div>
        <div className="text-sm text-gray-400">
          24h Change: 
          <span className={tokenData.priceChange24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}>
            {tokenData.priceChange24h >= 0 ? '+' : ''}${tokenData.priceChange24h.toFixed(6)}
          </span>
        </div>
      </Card>

      {/* Market Cap Card */}
      <Card className="crypto-card crypto-hover p-6 border bg-gradient-to-br from-blue-500/25 via-cyan-500/20 to-blue-600/15 border-blue-500/40 hover:from-blue-500/35 hover:via-cyan-500/30 hover:to-blue-600/25 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-medium">Market Cap</h3>
          <BarChart3 className="text-blue-400 w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2">{formatMarketCap(tokenData.marketCap)}</div>
        <div className="text-sm text-gray-400">
          Total Supply: <span>{formatSupply(tokenData.totalSupply)}</span>
        </div>
      </Card>

      {/* Volume Card */}
      <Card className="crypto-card crypto-hover p-6 border bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-amber-600/15 border-amber-500/40 hover:from-amber-500/35 hover:via-orange-500/30 hover:to-amber-600/25 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-medium">24h Volume</h3>
          <ArrowUpDown className="text-amber-400 w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2">{formatVolume(tokenData.volume24h)}</div>
        <div className="text-sm text-gray-400">
          Transactions: <span>{tokenData.txCount24h}</span>
        </div>
      </Card>

      {/* Liquidity Card */}
      <Card className="crypto-card crypto-hover p-6 border bg-gradient-to-br from-purple-500/25 via-pink-500/20 to-purple-600/15 border-purple-500/40 hover:from-purple-500/35 hover:via-pink-500/30 hover:to-purple-600/25 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-medium">Liquidity Pool</h3>
          <Droplets className="text-purple-400 w-5 h-5" />
        </div>
        <div className="text-2xl font-bold mb-2">{formatLiquidity(tokenData.liquidity)}</div>
        <div className="text-sm text-gray-400">PancakeSwap V2</div>
      </Card>
    </div>
  );
}
