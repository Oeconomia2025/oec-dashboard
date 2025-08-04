import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { useState } from "react";

// Mock pool data inspired by Uniswap's structure
const mockPools = [
  {
    id: 1,
    tokenA: { symbol: "USDT", name: "Tether USD", logo: "🔗" },
    tokenB: { symbol: "BNB", name: "Binance Coin", logo: "🟡" },
    fee: "0.05%",
    volume24h: "$2.4M",
    volume7d: "$18.2M",
    tvl: "$8.9M",
    apr: "12.4%",
    priceChange24h: 2.1,
    network: "BSC"
  },
  {
    id: 2,
    tokenA: { symbol: "OEC", name: "Oeconomia", logo: "🌐" },
    tokenB: { symbol: "USDT", name: "Tether USD", logo: "🔗" },
    fee: "0.30%",
    volume24h: "$567K",
    volume7d: "$4.2M",
    tvl: "$2.1M",
    apr: "24.8%",
    priceChange24h: -1.3,
    network: "BSC"
  },
  {
    id: 3,
    tokenA: { symbol: "WBNB", name: "Wrapped BNB", logo: "🟡" },
    tokenB: { symbol: "BUSD", name: "Binance USD", logo: "💛" },
    fee: "0.25%",
    volume24h: "$1.8M",
    volume7d: "$12.6M",
    tvl: "$5.4M",
    apr: "18.7%",
    priceChange24h: 0.8,
    network: "BSC"
  },
  {
    id: 4,
    tokenA: { symbol: "CAKE", name: "PancakeSwap", logo: "🥞" },
    tokenB: { symbol: "WBNB", name: "Wrapped BNB", logo: "🟡" },
    fee: "0.25%",
    volume24h: "$890K",
    volume7d: "$6.8M",
    tvl: "$3.2M",
    apr: "31.2%",
    priceChange24h: 5.6,
    network: "BSC"
  },
  {
    id: 5,
    tokenA: { symbol: "ETH", name: "Ethereum", logo: "⚪" },
    tokenB: { symbol: "USDT", name: "Tether USD", logo: "🔗" },
    fee: "0.05%",
    volume24h: "$3.1M",
    volume7d: "$21.4M",
    tvl: "$12.8M",
    apr: "8.9%",
    priceChange24h: 1.4,
    network: "BSC"
  }
];

export function PoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("1D");

  const filteredPools = mockPools.filter(pool => 
    pool.tokenA.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tokenB.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tokenA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tokenB.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timeframes = [
    { key: "1H", label: "1H" },
    { key: "1D", label: "1D" },
    { key: "1W", label: "1W" },
    { key: "1M", label: "1M" }
  ];

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
          <p className="text-gray-400">Explore and analyze BSC liquidity pools</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="crypto-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">24H Volume</span>
              <TrendingUp className="w-4 h-4 text-crypto-green" />
            </div>
            <div className="text-2xl font-bold text-crypto-green">$8.7M</div>
            <div className="text-crypto-green text-sm">+16.3%</div>
          </Card>
          
          <Card className="crypto-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total TVL</span>
              <TrendingUp className="w-4 h-4 text-crypto-blue" />
            </div>
            <div className="text-2xl font-bold text-crypto-blue">$32.4M</div>
            <div className="text-crypto-green text-sm">+2.8%</div>
          </Card>
          
          <Card className="crypto-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active Pools</span>
              <div className="w-4 h-4 bg-crypto-purple rounded-full" />
            </div>
            <div className="text-2xl font-bold text-crypto-purple">1,247</div>
            <div className="text-gray-400 text-sm">pools</div>
          </Card>
          
          <Card className="crypto-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg APR</span>
              <TrendingUp className="w-4 h-4 text-crypto-green" />
            </div>
            <div className="text-2xl font-bold text-crypto-green">19.2%</div>
            <div className="text-crypto-green text-sm">+0.4%</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="crypto-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search pools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-crypto-dark border-crypto-border text-white"
                />
              </div>
              
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.key}
                    variant={timeframe === tf.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe(tf.key)}
                    className={timeframe === tf.key ? "bg-crypto-blue hover:bg-crypto-blue/80" : "text-gray-400 hover:text-white"}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-crypto-border text-gray-400 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Badge variant="outline" className="border-crypto-border text-crypto-green">
                BSC Network
              </Badge>
            </div>
          </div>
        </Card>

        {/* Pools Table */}
        <Card className="crypto-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-crypto-border">
                  <th className="text-left p-6 font-medium text-gray-400">#</th>
                  <th className="text-left p-6 font-medium text-gray-400">Pool</th>
                  <th className="text-left p-6 font-medium text-gray-400">Fee</th>
                  <th className="text-left p-6 font-medium text-gray-400">24H Volume</th>
                  <th className="text-left p-6 font-medium text-gray-400">7D Volume</th>
                  <th className="text-left p-6 font-medium text-gray-400">TVL</th>
                  <th className="text-left p-6 font-medium text-gray-400">APR</th>
                  <th className="text-left p-6 font-medium text-gray-400">24H %</th>
                  <th className="text-right p-6 font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPools.map((pool, index) => (
                  <tr 
                    key={pool.id} 
                    className="border-b border-crypto-border hover:bg-crypto-surface/50 transition-colors cursor-pointer"
                  >
                    <td className="p-6">
                      <span className="text-gray-400 font-mono">{index + 1}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center -space-x-2">
                          <div className="w-8 h-8 bg-crypto-surface rounded-full flex items-center justify-center text-sm border-2 border-crypto-dark z-10">
                            {pool.tokenA.logo}
                          </div>
                          <div className="w-8 h-8 bg-crypto-surface rounded-full flex items-center justify-center text-sm border-2 border-crypto-dark">
                            {pool.tokenB.logo}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {pool.tokenA.symbol}/{pool.tokenB.symbol}
                          </div>
                          <div className="text-sm text-gray-400">
                            {pool.tokenA.name} • {pool.tokenB.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="border-crypto-border text-crypto-blue">
                        {pool.fee}
                      </Badge>
                    </td>
                    <td className="p-6 font-mono">{pool.volume24h}</td>
                    <td className="p-6 font-mono text-gray-400">{pool.volume7d}</td>
                    <td className="p-6 font-mono">{pool.tvl}</td>
                    <td className="p-6">
                      <span className="text-crypto-green font-medium">{pool.apr}</span>
                    </td>
                    <td className="p-6">
                      <div className={`flex items-center space-x-1 ${
                        pool.priceChange24h >= 0 ? 'text-crypto-green' : 'text-red-400'
                      }`}>
                        {pool.priceChange24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {pool.priceChange24h >= 0 ? '+' : ''}{pool.priceChange24h}%
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button 
                        size="sm" 
                        className="bg-crypto-blue hover:bg-crypto-blue/80"
                      >
                        Add Liquidity
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No pools found</div>
              <div className="text-sm text-gray-500">Try adjusting your search terms</div>
            </div>
          )}
        </Card>
        
        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Pool data updates every 30 seconds • APR calculations include trading fees and liquidity mining rewards</p>
        </div>
      </div>
    </div>
  );
}