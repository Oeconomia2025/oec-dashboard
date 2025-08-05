import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { PriceChart } from "@/components/price-chart";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Activity, Plus, Copy, Check } from "lucide-react";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  address?: string;
  description?: string;
  website?: string;
  totalSupply?: number;
  circulatingSupply?: number;
}

export default function TokenDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const tokenId = params.id as string;
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Mock token data - in real app this would come from API
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  
  useEffect(() => {
    // Simulate API call to get token data
    const mockTokenData: Record<string, TokenData> = {
      "1": {
        id: "1",
        name: "Tether USD",
        symbol: "USDT",
        logo: "https://s2.coinmarketcap.com/static/img/coins/32x32/825.png",
        price: 1.0001,
        change24h: 0.01,
        volume24h: 28500000,
        marketCap: 73200000000,
        holders: 1250000,
        address: "0x55d398326f99059fF775485246999027B3197955",
        description: "Tether (USDT) is a blockchain-based cryptocurrency whose cryptocoins in circulation are backed by an equivalent amount of traditional fiat currencies, like the dollar, the euro or the Japanese yen.",
        website: "https://tether.to/",
        totalSupply: 73200000000,
        circulatingSupply: 73180000000
      },
      "2": {
        id: "2",
        name: "Binance Coin",
        symbol: "BNB",
        logo: "https://s2.coinmarketcap.com/static/img/coins/32x32/1839.png",
        price: 612.45,
        change24h: 2.8,
        volume24h: 890000000,
        marketCap: 88400000000,
        holders: 850000,
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        description: "Binance Coin (BNB) is the native cryptocurrency of the Binance ecosystem. It powers the Binance exchange and can be used for trading fee discounts.",
        website: "https://www.binance.com/",
        totalSupply: 200000000,
        circulatingSupply: 144000000
      },
      "3": {
        id: "3",
        name: "Wrapped BNB",
        symbol: "WBNB",
        logo: "https://s2.coinmarketcap.com/static/img/coins/32x32/7192.png",
        price: 612.45,
        change24h: 2.8,
        volume24h: 450000000,
        marketCap: 12300000000,
        holders: 420000,
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        description: "Wrapped BNB (WBNB) is the wrapped version of BNB on Binance Smart Chain, enabling BNB to be used in DeFi protocols.",
        website: "https://www.binance.com/",
        totalSupply: 200000000,
        circulatingSupply: 144000000
      },
      "4": {
        id: "4",
        name: "Binance USD",
        symbol: "BUSD",
        logo: "https://s2.coinmarketcap.com/static/img/coins/32x32/4687.png",
        price: 1.0002,
        change24h: -0.02,
        volume24h: 125000000,
        marketCap: 8900000000,
        holders: 320000,
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        description: "Binance USD (BUSD) is a stable coin pegged to USD that combines the stability of the dollar with blockchain technology.",
        website: "https://www.binance.com/en/busd",
        totalSupply: 8900000000,
        circulatingSupply: 8900000000
      },
      "5": {
        id: "5",
        name: "PancakeSwap",
        symbol: "CAKE",
        logo: "https://s2.coinmarketcap.com/static/img/coins/32x32/7186.png",
        price: 3.24,
        change24h: 5.2,
        volume24h: 42000000,
        marketCap: 890000000,
        holders: 185000,
        address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
        description: "PancakeSwap (CAKE) is the native token of PancakeSwap, a decentralized exchange (DEX) running on Binance Smart Chain.",
        website: "https://pancakeswap.finance/",
        totalSupply: 280000000,
        circulatingSupply: 274000000
      }
    };
    
    const token = mockTokenData[tokenId];
    if (token) {
      setTokenData(token);
    }
  }, [tokenId]);

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

  if (!tokenData) {
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
      pageLogo={tokenData.logo}
      pageWebsite={tokenData.website}
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
                tokenData.change24h >= 0 ? 'text-crypto-green' : 'text-red-400'
              }`}>
                {tokenData.change24h >= 0 ? (
                  <TrendingUp className="w-2 h-2" />
                ) : (
                  <TrendingDown className="w-2 h-2" />
                )}
                <span className="font-medium">
                  {tokenData.change24h >= 0 ? '+' : ''}{tokenData.change24h}%
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
                {formatLargeNumber(tokenData.holders)}
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
              <PriceChart contractAddress={tokenData.address || "0x55d398326f99059fF775485246999027B3197955"} />
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
                    {tokenData.address ? (
                      <button
                        onClick={() => copyToClipboard(tokenData.address!)}
                        className="flex items-center space-x-2 text-white font-mono text-sm hover:text-crypto-blue transition-colors cursor-pointer group"
                        title="Click to copy full contract address"
                      >
                        <span>{`${tokenData.address.slice(0, 6)}...${tokenData.address.slice(-4)}`}</span>
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

              {/* Description */}
              {tokenData.description && (
                <Card className="crypto-card p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-white text-lg">About</CardTitle>
                  </CardHeader>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {tokenData.description}
                  </p>
                </Card>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}