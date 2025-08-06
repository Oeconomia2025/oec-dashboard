import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PriceChart } from "@/components/price-chart";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Activity, Plus, Copy, Check, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTokenData } from "@/hooks/use-token-data";
import type { TokenData, LiveCoinWatchDbCoin } from "@shared/schema";



export default function TokenDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const tokenId = params.id as string;
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Get real token data from API - use the ID from URL params which is the contract address
  const contractAddress = params.id || "0x55d398326f99059fF775485246999027B3197955";
  const { data: tokenData, isLoading, error } = useTokenData(contractAddress);

  // Map contract addresses to Live Coin Watch codes
  const contractToLiveCoinCode: Record<string, string> = {
    '0x55d398326f99059ff775485246999027b3197955': 'USDT',
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'BNB',
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8': 'ETH',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'USDC',
    '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47': 'ADA',
    '0xba2ae424d960c26247dd6c32edc70b295c744c43': 'DOGE',
    '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd': 'LINK',
    '0x4338665cbb7b2485a8855a139b75d5e34ab0db94': 'LTC',
  };

  // Get Live Coin Watch data for enhanced price information
  const liveCoinCode = contractToLiveCoinCode[contractAddress.toLowerCase()];
  const { data: liveCoinData } = useQuery<{coins: LiveCoinWatchDbCoin[], lastUpdated: string | null, isServiceRunning: boolean}>({
    queryKey: ["/api/live-coin-watch/coins"],
    refetchInterval: 15 * 1000, // Refresh every 15 seconds
    enabled: !!liveCoinCode, // Only fetch if we have a matching coin code
  });

  // Find the specific coin data for this token
  const enhancedCoinData = liveCoinData?.coins.find((coin: LiveCoinWatchDbCoin) => coin.code === liveCoinCode);

  // Token logos mapping
  const tokenLogos: { [key: string]: string } = {
    "0x55d398326f99059fF775485246999027B3197955": "https://s2.coinmarketcap.com/static/img/coins/32x32/825.png", // USDT
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": "https://s2.coinmarketcap.com/static/img/coins/32x32/1839.png", // WBNB
    "0x2170ed0880ac9a755fd29b2688956bd959f933f8": "https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png", // ETH
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": "https://s2.coinmarketcap.com/static/img/coins/32x32/3408.png", // USDC
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c": "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png", // BTCB
    "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": "https://s2.coinmarketcap.com/static/img/coins/32x32/7186.png", // CAKE
    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": "https://s2.coinmarketcap.com/static/img/coins/32x32/4943.png", // DAI
    "0xe9e7cea3dedca5984780bafc599bd69add087d56": "https://s2.coinmarketcap.com/static/img/coins/32x32/4687.png", // BUSD
    "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd": "https://s2.coinmarketcap.com/static/img/coins/32x32/1975.png", // LINK
    "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47": "https://s2.coinmarketcap.com/static/img/coins/32x32/2010.png", // ADA
  };

  // Token website links mapping
  const tokenWebsites: { [key: string]: string } = {
    "0x55d398326f99059fF775485246999027B3197955": "https://tether.to/", // USDT
    "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": "https://www.binance.com/en/bnb", // WBNB
    "0x2170ed0880ac9a755fd29b2688956bd959f933f8": "https://ethereum.org/", // ETH
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": "https://www.centre.io/usdc", // USDC
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c": "https://bitcoin.org/", // BTCB
    "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": "https://pancakeswap.finance/", // CAKE
    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": "https://makerdao.com/", // DAI
    "0xe9e7cea3dedca5984780bafc599bd69add087d56": "https://www.binance.com/en/busd", // BUSD
    "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd": "https://chain.link/", // LINK
    "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47": "https://cardano.org/", // ADA
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">Loading token data...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tokenData) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">Token not found</div>
              <Button onClick={() => setLocation("/liquidity?tab=tokens")} variant="outline">
                Back to Tokens
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      pageTitle={tokenData.symbol}
      pageDescription={tokenData.name}
      tokenLogo={tokenLogos[contractAddress.toLowerCase()]}
      tokenWebsite={tokenWebsites[contractAddress.toLowerCase()]}
      contractAddress={contractAddress}
    >
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/liquidity?tab=tokens")}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tokens
              </Button>
              
              <Button 
                onClick={() => setLocation(`/liquidity?create=true&token=${tokenId}`)}
                className="bg-crypto-blue hover:bg-crypto-blue/80 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Liquidity
              </Button>
            </div>
          </div>





          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Price</span>
                <div className="flex items-center space-x-1">
                  {enhancedCoinData && (
                    <Database className="w-3 h-3 text-green-400" title="Live Coin Watch Data" />
                  )}
                  <DollarSign className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                ${formatNumber(enhancedCoinData?.rate || tokenData.price, 4)}
              </div>
              <div className="space-y-1">
                <div className={`flex items-center space-x-1 text-xs ${
                  (enhancedCoinData?.deltaDay ? 
                    ((enhancedCoinData.deltaDay - 1) * 100) >= 0 : 
                    tokenData.priceChangePercent24h >= 0
                  ) ? 'text-crypto-green' : 'text-red-400'
                }`}>
                  {(enhancedCoinData?.deltaDay ? 
                    ((enhancedCoinData.deltaDay - 1) * 100) >= 0 : 
                    tokenData.priceChangePercent24h >= 0
                  ) ? (
                    <TrendingUp className="w-2 h-2" />
                  ) : (
                    <TrendingDown className="w-2 h-2" />
                  )}
                  <span className="font-medium">
                    {enhancedCoinData?.deltaDay ? (
                      `${((enhancedCoinData.deltaDay - 1) * 100) >= 0 ? '+' : ''}${((enhancedCoinData.deltaDay - 1) * 100).toFixed(2)}%`
                    ) : (
                      `${tokenData.priceChangePercent24h >= 0 ? '+' : ''}${tokenData.priceChangePercent24h.toFixed(2)}%`
                    )}
                  </span>
                </div>
                {enhancedCoinData && (
                  <div className="text-xs text-green-400 opacity-70">
                    Live data • {new Date(enhancedCoinData.lastUpdated).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Market Cap</span>
                <div className="flex items-center space-x-1">
                  {enhancedCoinData?.cap && (
                    <Database className="w-3 h-3 text-green-400" title="Live Coin Watch Data" />
                  )}
                  <BarChart3 className="w-3 h-3 text-crypto-blue" />
                </div>
              </div>
              <div className="text-lg font-bold text-crypto-blue">
                ${formatLargeNumber(enhancedCoinData?.cap || tokenData.marketCap)}
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">24H Volume</span>
                <div className="flex items-center space-x-1">
                  {enhancedCoinData?.volume && (
                    <Database className="w-3 h-3 text-green-400" title="Live Coin Watch Data" />
                  )}
                  <Activity className="w-3 h-3 text-crypto-green" />
                </div>
              </div>
              <div className="text-lg font-bold text-crypto-green">
                ${formatLargeNumber(enhancedCoinData?.volume || tokenData.volume24h)}
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Holders</span>
                <Users className="w-3 h-3 text-crypto-purple" />
              </div>
              <div className="text-lg font-bold text-crypto-purple">
                N/A
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Circulating Supply</span>
                <DollarSign className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {tokenData.circulatingSupply ? formatLargeNumber(tokenData.circulatingSupply) : 'N/A'}
              </div>
            </Card>
          </div>

          {/* Live Data Indicator */}
          {enhancedCoinData && (
            <Card className="crypto-card border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-green-400" />
                    <div>
                      <h3 className="text-white font-semibold">Live Coin Watch Data Active</h3>
                      <p className="text-gray-400 text-sm">
                        Real-time pricing data from Live Coin Watch database • Updated every 30 seconds
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-medium">
                      Last synced: {new Date(enhancedCoinData.lastUpdated).toLocaleTimeString()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Service: {liveCoinData?.isServiceRunning ? 'Running' : 'Stopped'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceChart contractAddress={tokenData.contractAddress || "0x55d398326f99059fF775485246999027B3197955"} />
            </div>
            
            <div className="space-y-6">
              {/* Token Info */}
              <Card className="crypto-card p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-white text-lg">Token Information</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Contract</span>
                    {tokenData.contractAddress ? (
                      <button
                        onClick={() => copyToClipboard(tokenData.contractAddress!)}
                        className="flex items-center space-x-2 text-white font-mono text-sm hover:text-crypto-blue transition-colors cursor-pointer group"
                        title="Click to copy full contract address"
                      >
                        <span>{`${tokenData.contractAddress.slice(0, 6)}...${tokenData.contractAddress.slice(-4)}`}</span>
                        {copied ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 group-hover:text-crypto-blue transition-colors" />
                        )}
                      </button>
                    ) : (
                      <span className="text-white font-mono text-sm">N/A</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white">
                      {tokenData.totalSupply ? formatLargeNumber(tokenData.totalSupply) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">BSC</span>
                  </div>
                </div>
              </Card>

              {/* About Section - Static for now since API doesn't provide description */}
              <Card className="crypto-card p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-white text-lg">About</CardTitle>
                </CardHeader>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Real-time {tokenData.name} ({tokenData.symbol}) data powered by Moralis API on the Binance Smart Chain network.
                </p>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}