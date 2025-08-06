import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Activity, TrendingUp, TrendingDown, RefreshCw, Database, Wifi, WifiOff, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { LiveCoinWatchDbCoin } from "@shared/schema";

interface LiveCoinWatchResponse {
  coins: LiveCoinWatchDbCoin[];
  lastUpdated: string | null;
  isServiceRunning: boolean;
}

export default function LiveCoinWatch() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [, navigate] = useLocation();

  // Map Live Coin Watch codes to BSC contract addresses for navigation
  const coinContractAddresses: Record<string, string> = {
    'USDT': '0x55d398326f99059ff775485246999027b3197955',
    'BNB': '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    'ETH': '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    'USDC': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    'ADA': '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    'DOGE': '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    'LINK': '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
    'LTC': '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
  };

  const handleRowClick = (coin: LiveCoinWatchDbCoin) => {
    const contractAddress = coinContractAddresses[coin.code];
    if (contractAddress) {
      navigate(`/token/${contractAddress}`);
    }
  };

  // Fetch Live Coin Watch data from database
  const { data: coinData, isLoading, refetch } = useQuery<LiveCoinWatchResponse>({
    queryKey: ["/api/live-coin-watch/coins"],
    refetchInterval: autoRefresh ? 10 * 1000 : false, // Refresh every 10 seconds when auto-refresh is on
    refetchIntervalInBackground: true,
  });

  // Fetch service status
  const { data: statusData } = useQuery<{isRunning: boolean; syncInterval: string}>({
    queryKey: ["/api/live-coin-watch/status"],
    refetchInterval: 5 * 1000, // Check status every 5 seconds
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const formatMarketCap = (cap: number | null) => {
    if (!cap) return "N/A";
    if (cap >= 1000000000) {
      return `$${(cap / 1000000000).toFixed(2)}B`;
    } else if (cap >= 1000000) {
      return `$${(cap / 1000000).toFixed(2)}M`;
    } else if (cap >= 1000) {
      return `$${(cap / 1000).toFixed(2)}K`;
    }
    return `$${cap.toFixed(2)}`;
  };

  const formatPercentage = (percent: number | null) => {
    if (percent === null) return "N/A";
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getChangeColor = (percent: number | null) => {
    if (percent === null) return "text-gray-400";
    return percent >= 0 ? "text-green-400" : "text-red-400";
  };

  const getChangeIcon = (percent: number | null) => {
    if (percent === null) return null;
    return percent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Coin Watch Practice</h1>
              <p className="text-gray-400">Real-time cryptocurrency data from Live Coin Watch API stored in PostgreSQL database</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Now
              </Button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="crypto-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">API Service</p>
                    <div className="flex items-center space-x-2">
                      {statusData?.isRunning ? (
                        <>
                          <Wifi className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">Running</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 font-semibold">Stopped</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="crypto-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Sync Interval</p>
                    <p className="text-white font-semibold">30 seconds</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="crypto-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Last Updated</p>
                    <p className="text-white font-semibold text-sm">
                      {coinData?.lastUpdated 
                        ? new Date(coinData.lastUpdated).toLocaleTimeString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coins Table */}
        <Card className="crypto-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Top 10 Cryptocurrencies (From Database)
              </div>
              <div className="text-sm text-gray-400 font-normal">
                Click supported tokens to view details
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-400">Loading cryptocurrency data...</p>
              </div>
            ) : coinData?.coins && coinData.coins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Coin</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">24h %</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Market Cap</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Volume (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coinData.coins.map((coin, index) => {
                      const hasContractAddress = coinContractAddresses[coin.code];
                      return (
                        <tr 
                          key={coin.code} 
                          className={`border-b border-gray-800/50 transition-colors ${
                            hasContractAddress 
                              ? 'hover:bg-gray-800/50 cursor-pointer hover:border-cyan-500/30' 
                              : 'hover:bg-gray-800/20'
                          }`}
                          onClick={() => hasContractAddress && handleRowClick(coin)}
                        >
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">#{index + 1}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="text-white font-semibold">{coin.name}</div>
                                  <div className="text-gray-400 text-sm uppercase">{coin.code}</div>
                                </div>
                              </div>
                              {hasContractAddress && (
                                <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-white font-semibold">{formatPrice(coin.rate)}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className={`flex items-center justify-end space-x-1 ${getChangeColor(coin.deltaDay)}`}>
                              {getChangeIcon(coin.deltaDay)}
                              <span className="font-medium">{formatPercentage(coin.deltaDay)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-white">{formatMarketCap(coin.cap)}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-white">{formatVolume(coin.volume)}</span>
                              {hasContractAddress && (
                                <div className="text-xs text-cyan-400 opacity-70">
                                  Click to view details
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-2">No cryptocurrency data available</p>
                <p className="text-gray-500 text-sm">Data will appear once the Live Coin Watch API sync service is running</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card className="crypto-card mt-6">
          <CardHeader>
            <CardTitle className="text-white">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">API Integration</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Live Coin Watch API calls every 30 seconds</li>
                  <li>• PostgreSQL database storage with Neon</li>
                  <li>• Drizzle ORM for type-safe database operations</li>
                  <li>• Automatic data synchronization service</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Features</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Real-time data updates</li>
                  <li>• Database persistence for reliability</li>
                  <li>• Service status monitoring</li>
                  <li>• Auto-refresh toggle</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}