import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PriceChart } from "@/components/price-chart";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Activity, Plus, Copy, Check } from "lucide-react";
import { useTokenData } from "@/hooks/use-token-data";
import type { TokenData } from "@shared/schema";



export default function TokenDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const tokenId = params.id as string;
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Get real token data from API - use contract address instead of token ID
  const contractAddress = params.contractAddress || "0x55d398326f99059fF775485246999027B3197955";
  const { data: tokenData, isLoading, error } = useTokenData(contractAddress);

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
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <div className="text-lg font-bold text-white mb-1">
                ${formatNumber(tokenData.price, 4)}
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                tokenData.priceChangePercent24h >= 0 ? 'text-crypto-green' : 'text-red-400'
              }`}>
                {tokenData.priceChangePercent24h >= 0 ? (
                  <TrendingUp className="w-2 h-2" />
                ) : (
                  <TrendingDown className="w-2 h-2" />
                )}
                <span className="font-medium">
                  {tokenData.priceChangePercent24h >= 0 ? '+' : ''}{tokenData.priceChangePercent24h.toFixed(2)}%
                </span>
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Market Cap</span>
                <BarChart3 className="w-3 h-3 text-crypto-blue" />
              </div>
              <div className="text-lg font-bold text-crypto-blue">
                ${formatLargeNumber(tokenData.marketCap)}
              </div>
            </Card>
            
            <Card className="crypto-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">24H Volume</span>
                <Activity className="w-3 h-3 text-crypto-green" />
              </div>
              <div className="text-lg font-bold text-crypto-green">
                ${formatLargeNumber(tokenData.volume24h)}
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