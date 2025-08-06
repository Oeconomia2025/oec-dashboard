import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PriceChart } from "@/components/price-chart";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Activity, Plus, Copy, Check, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCryptoData, getCryptoLogo, cleanCoinName } from "@/utils/crypto-logos";
import type { TokenData, LiveCoinWatchDbCoin } from "@shared/schema";

export default function TokenDetailDynamic() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const tokenCode = params.code as string;
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Get dynamic token data from Live Coin Watch API
  const { data: tokenData, isLoading, error } = useQuery<TokenData & {
    deltaHour?: number, 
    deltaWeek?: number, 
    deltaMonth?: number, 
    deltaQuarter?: number, 
    deltaYear?: number,
    logo?: string,
    website?: string
  }>({
    queryKey: [`/api/live-coin-watch/token/${tokenCode}`],
    enabled: !!tokenCode,
    refetchInterval: 15 * 1000, // Refresh every 15 seconds
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "0.00";
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(4);
    if (price >= 0.01) return price.toFixed(6);
    return price.toFixed(8);
  };

  const formatPercentage = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return "0.00%";
    const formatted = Math.abs(percent).toFixed(2);
    return `${percent >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getChangeColor = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return "text-gray-400";
    return percent >= 0 ? "text-crypto-green" : "text-crypto-red";
  };

  if (isLoading || !tokenData) {
    return (
      <Layout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Card className="crypto-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Token Not Found</h2>
            <p className="text-gray-400 mb-4">
              The token "{tokenCode}" was not found in our database.
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation("/liquidity?tab=tokens")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              View Available Tokens
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }



  return (
    <Layout
      tokenLogo={getCryptoLogo(tokenCode, tokenData.symbol)}
      tokenWebsite={tokenData.website}
      tokenTicker={tokenData.symbol || tokenCode}
      tokenName={cleanCoinName(tokenData.name)}
    >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/liquidity?tab=tokens")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tokens
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-crypto-blue" />
            <span className="text-sm text-gray-400">Live Data</span>
          </div>
        </div>



        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="crypto-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="text-lg font-semibold">${formatPrice(tokenData.price)}</p>
                <p className={`text-sm ${getChangeColor(tokenData.priceChangePercent24h)}`}>
                  {formatPercentage(tokenData.priceChangePercent24h)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-crypto-gold" />
            </div>
          </Card>
          
          <Card className="crypto-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-lg font-semibold">${formatNumber(tokenData.marketCap)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-crypto-blue" />
            </div>
          </Card>
          
          <Card className="crypto-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-lg font-semibold">${formatNumber(tokenData.volume24h)}</p>
              </div>
              <Activity className="w-8 h-8 text-crypto-green" />
            </div>
          </Card>
          
          <Card className="crypto-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">24h Change</p>
                <p className={`text-lg font-semibold ${getChangeColor(tokenData.priceChangePercent24h)}`}>
                  {formatPercentage(tokenData.priceChangePercent24h)}
                </p>
              </div>
              {tokenData.priceChangePercent24h >= 0 ? 
                <TrendingUp className="w-8 h-8 text-crypto-green" /> : 
                <TrendingDown className="w-8 h-8 text-crypto-red" />
              }
            </div>
          </Card>
          
          <Card className="crypto-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Network</p>
                <p className="text-lg font-semibold">{tokenData.network}</p>
              </div>
              <Database className="w-8 h-8 text-crypto-purple" />
            </div>
          </Card>
        </div>



        {/* Chart Section */}
        <Card className="crypto-card p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center justify-between">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {tokenData.deltaHour && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">1 Hour</p>
                    <p className={`text-lg font-semibold ${getChangeColor((tokenData.deltaHour - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaHour - 1) * 100)}
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-gray-400">24 Hours</p>
                  <p className={`text-lg font-semibold ${getChangeColor(tokenData.priceChangePercent24h)}`}>
                    {formatPercentage(tokenData.priceChangePercent24h)}
                  </p>
                </div>
                {tokenData.deltaWeek && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">7 Days</p>
                    <p className={`text-lg font-semibold ${getChangeColor((tokenData.deltaWeek - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaWeek - 1) * 100)}
                    </p>
                  </div>
                )}
                {tokenData.deltaMonth && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">30 Days</p>
                    <p className={`text-lg font-semibold ${getChangeColor((tokenData.deltaMonth - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaMonth - 1) * 100)}
                    </p>
                  </div>
                )}
                {tokenData.deltaYear && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">1 Year</p>
                    <p className={`text-lg font-semibold ${getChangeColor((tokenData.deltaYear - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaYear - 1) * 100)}
                    </p>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                Real-time Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <PriceChart contractAddress={tokenData.contractAddress} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setLocation("/liquidity?tab=tokens")}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Liquidity
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => copyToClipboard(tokenData.contractAddress)}
            className="border-crypto-blue text-crypto-blue hover:bg-crypto-blue/10"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Address'}
          </Button>
          
          {tokenData.website && (
            <Button 
              variant="outline"
              onClick={() => window.open(tokenData.website, '_blank')}
              className="border-gray-600 hover:bg-gray-600/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Official Website
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}