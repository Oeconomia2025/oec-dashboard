import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { TokenOverview } from "@/components/token-overview";
import { PriceChart } from "@/components/price-chart";
import { TokenInfoPanel } from "@/components/token-info-panel";
import { VolumeLiquidityAnalytics } from "@/components/volume-liquidity-analytics";
import { HistoricalPerformance } from "@/components/historical-performance";
import { TransactionsTable } from "@/components/transactions-table";
import { HolderStatistics } from "@/components/holder-statistics";
import { QuickActions } from "@/components/quick-actions";
import { useTokenData } from "@/hooks/use-token-data";
import { useQuery } from "@tanstack/react-query";
import { TONE_TOKEN_CONFIG } from "@shared/schema";
import { Layout } from "@/components/layout";
import { formatCryptoData } from "@/utils/crypto-logos";

export default function Dashboard() {
  const [contractAddress, setContractAddress] = useState(TONE_TOKEN_CONFIG.contractAddress);
  const [inputAddress, setInputAddress] = useState(contractAddress);
  const [selectedToken, setSelectedToken] = useState("BTC");
  
  const { data: tokenData, isLoading } = useTokenData(contractAddress);
  
  // Fetch Live Coin Watch data for top cryptocurrencies
  const { data: liveCoinData, isLoading: isLiveCoinLoading } = useQuery({
    queryKey: ['/api/live-coin-watch/coins'],
    refetchInterval: 15000, // Refresh every 15 seconds
  }) as { data: { coins: any[] } | undefined; isLoading: boolean };
  
  // Get selected token data from Live Coin Watch
  const selectedTokenData = liveCoinData?.coins?.find((coin: any) => 
    coin.code === selectedToken
  );

  const handleAddressUpdate = () => {
    if (inputAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setContractAddress(inputAddress);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "0.00";
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(4);
    if (price >= 0.01) return price.toFixed(6);
    return price.toFixed(8);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPercentage = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return "0.00%";
    const formatted = Math.abs(percent).toFixed(2);
    return `${percent >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getChangeColor = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return "text-gray-400";
    return percent >= 0 ? "text-green-400" : "text-red-400";
  };

  const topTokens = liveCoinData?.coins?.slice(0, 10) || [];

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        {/* Market Overview Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Market Dashboard</h1>
              <p className="text-gray-400">Real-time cryptocurrency market data from Live Coin Watch</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Activity className="w-4 h-4 mr-2" />
                Live Data
              </Badge>
              <Button variant="outline" size="sm" disabled>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLiveCoinLoading ? 'animate-spin' : ''}`} />
                Auto-Sync: 15s
              </Button>
            </div>
          </div>

          {/* Top 10 Cryptocurrencies Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {isLiveCoinLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="crypto-card p-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </Card>
              ))
            ) : (
              topTokens.slice(0, 5).map((coin: any, index: number) => {
                const formatted = formatCryptoData(coin);
                return (
                  <Card 
                    key={coin.code} 
                    className={`crypto-card p-4 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 ${
                      selectedToken === coin.code ? 'border-cyan-500 bg-cyan-500/5' : ''
                    }`}
                    onClick={() => setSelectedToken(coin.code)}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={formatted.logo} 
                        alt={formatted.cleanName}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted.cleanCode)}&background=0066cc&color=fff&size=32`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{formatted.cleanCode}</span>
                          <span className="text-xs text-gray-400">#{index + 1}</span>
                        </div>
                        <div className="text-white font-semibold">${formatPrice(coin.rate)}</div>
                        <div className={`flex items-center space-x-1 ${getChangeColor(coin.deltaDay)}`}>
                          {coin.deltaDay >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span className="text-xs font-medium">{formatPercentage(coin.deltaDay)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Token Details */}
        {selectedTokenData && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={formatCryptoData(selectedTokenData).logo} 
                  alt={selectedTokenData.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{formatCryptoData(selectedTokenData).cleanName}</h2>
                  <p className="text-gray-400">{selectedTokenData.code}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="crypto-card p-4">
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-semibold text-lg">${formatPrice(selectedTokenData.rate)}</p>
                </Card>
                <Card className="crypto-card p-4">
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className={`font-semibold text-lg ${getChangeColor(selectedTokenData.deltaDay)}`}>
                    {formatPercentage(selectedTokenData.deltaDay)}
                  </p>
                </Card>
                <Card className="crypto-card p-4">
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white font-semibold text-lg">${formatNumber(selectedTokenData.cap)}</p>
                </Card>
                <Card className="crypto-card p-4">
                  <p className="text-gray-400 text-sm">Volume (24h)</p>
                  <p className="text-white font-semibold text-lg">${formatNumber(selectedTokenData.volume)}</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Token Overview Cards - Use Live Data */}
        <TokenOverview tokenData={selectedTokenData} isLoading={isLiveCoinLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <PriceChart contractAddress={contractAddress} tokenSymbol={selectedTokenData?.code || "BTC"} />
            
            {/* Volume and Liquidity Analytics */}
            <VolumeLiquidityAnalytics contractAddress={contractAddress} />

            {/* Historical Performance Charts */}
            <HistoricalPerformance contractAddress={contractAddress} />
          </div>

          {/* Token Information Panel */}
          <TokenInfoPanel tokenData={selectedTokenData} isLoading={isLiveCoinLoading} />
        </div>

        {/* Recent Transactions Table */}
        <TransactionsTable contractAddress={contractAddress} />

        {/* Holder Statistics */}
        <HolderStatistics contractAddress={contractAddress} tokenData={selectedTokenData} />

        {/* Quick Actions */}
        <QuickActions contractAddress={contractAddress} />

        {/* Contract Address Input - Admin Section */}
        <Card className="crypto-card p-4 mt-8 border border-dashed border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-gray-400 text-sm mb-2 block">Admin: Update Token Contract Address</label>
              <Input
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="0x..."
                className="bg-[var(--crypto-dark)] border-[var(--crypto-border)] text-white"
              />
            </div>
            <Button 
              onClick={handleAddressUpdate}
              className="mt-6 bg-crypto-blue hover:bg-crypto-blue/80"
            >
              Update
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}