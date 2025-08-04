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
          <p className="text-gray-400">Live data unavailable on static deployment</p>
          <p className="text-gray-500 text-sm mt-2">Connect to a development environment for real-time token data</p>
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

  const formatPrice = (price: number) => formatNumber(price / 2500);
  const formatMarketCap = (cap: number) => formatNumber(cap / 2500);
  const formatVolume = (vol: number) => formatNumber(vol / 2500);  
  const formatLiquidity = (liq: number) => formatNumber(liq / 2500);
  const formatSupply = (supply: number) => `${formatNumber(supply)} ${tokenData.symbol}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Price Card */}
      <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-200 text-sm font-medium">Current Price</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              tokenData.priceChangePercent24h >= 0 
                ? 'bg-green-600/80 text-white border border-green-500/50' 
                : 'bg-red-600/80 text-white border border-red-500/50'
            }`}>
              {tokenData.priceChangePercent24h >= 0 ? '+' : ''}
              {tokenData.priceChangePercent24h.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold mb-2 text-white drop-shadow-sm">{formatPrice(tokenData.price)}</div>
          <div className="text-sm text-gray-300">
            24h Change: 
            <span className={tokenData.priceChange24h >= 0 ? 'text-green-300' : 'text-red-300'}>
              {tokenData.priceChange24h >= 0 ? '+' : ''}{(tokenData.priceChange24h / 2500).toFixed(6)}
            </span>
          </div>
        </div>
      </Card>

      {/* Market Cap Card */}
      <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-200 text-sm font-medium">Market Cap</h3>
            <BarChart3 className="text-gray-300 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-2 text-white drop-shadow-sm">{formatMarketCap(tokenData.marketCap)}</div>
          <div className="text-sm text-gray-300">
            Total Supply: <span>{formatSupply(tokenData.totalSupply)}</span>
          </div>
        </div>
      </Card>

      {/* Volume Card */}
      <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-200 text-sm font-medium">24h Volume</h3>
            <ArrowUpDown className="text-gray-300 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-2 text-white drop-shadow-sm">{formatVolume(tokenData.volume24h)}</div>
          <div className="text-sm text-gray-300">
            Transactions: <span>{tokenData.txCount24h}</span>
          </div>
        </div>
      </Card>

      {/* Liquidity Card */}
      <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-200 text-sm font-medium">Liquidity Pool</h3>
            <Droplets className="text-gray-300 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-2 text-white drop-shadow-sm">{formatLiquidity(tokenData.liquidity)}</div>
          <div className="text-sm text-gray-300">PancakeSwap V2</div>
        </div>
      </Card>
    </div>
  );
}
