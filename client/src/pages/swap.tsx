import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePriceHistory, useTokenData } from "@/hooks/use-token-data";

import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  AlertTriangle,
  BarChart3
} from "lucide-react";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  price: number;
  balance?: number;
}

interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  exchangeRate: number;
  priceImpact: number;
  minimumReceived: string;
  fee: number;
  route: string[];
}

function SwapContent() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState("");
  const [isSlippageCustom, setIsSlippageCustom] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState("1D");
  const [activeTab, setActiveTab] = useState("Swap");

  // Mock token list - in real implementation, this would come from API
  const tokens: Token[] = [
    {
      symbol: "OEC",
      name: "Oeconomia",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      logo: "/oec-logo.png",
      price: 0.15,
      balance: 1250.50
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      price: 1.00,
      balance: 485.25
    },
    {
      symbol: "BNB",
      name: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      price: 645.50,
      balance: 2.15
    },
    {
      symbol: "WETH",
      name: "Wrapped Ethereum",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      decimals: 18,
      logo: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
      price: 3850.75,
      balance: 0.085
    },
    {
      symbol: "BTCB",
      name: "Bitcoin BEP2",
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      decimals: 18,
      logo: "https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png",
      price: 98500.25,
      balance: 0.0015
    }
  ];

  // Format number with commas and smart decimals
  const formatNumber = (num: number, decimals = 2): string => {
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(6).replace(/\.?0+$/, '');
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: decimals 
    });
  };

  // Simulate getting swap quote
  const getSwapQuote = async (from: Token, to: Token, amount: string) => {
    if (!amount || parseFloat(amount) === 0) return null;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const inputAmount = parseFloat(amount);
    const exchangeRate = to.price / from.price;
    const outputAmount = inputAmount * exchangeRate;
    const priceImpact = Math.random() * 2; // 0-2% random impact
    const fee = inputAmount * 0.003; // 0.3% fee
    const minimumReceived = outputAmount * (1 - slippage / 100);
    
    const mockQuote: SwapQuote = {
      inputAmount: amount,
      outputAmount: outputAmount.toString(),
      exchangeRate,
      priceImpact,
      minimumReceived: minimumReceived.toString(),
      fee,
      route: [from.symbol, to.symbol]
    };
    
    setQuote(mockQuote);
    setIsLoading(false);
  };

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setQuote(null);
  };

  const handleSwapExecution = async () => {
    if (!fromToken || !toToken || !fromAmount) return;
    
    setIsLoading(true);
    
    // Simulate swap execution
    setTimeout(() => {
      setFromAmount("");
      setQuote(null);
      setIsLoading(false);
      // Here you would integrate with actual swap contract
    }, 2000);
  };

  // Handle amount change
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      getSwapQuote(fromToken, toToken, fromAmount);
    } else {
      setQuote(null);
    }
  }, [fromToken, toToken, fromAmount, slippage]);

  // Get price history for the selected token pair
  const chartContractAddress = fromToken?.address || "0x55d398326f99059fF775485246999027B3197955"; // Default to USDT
  const { data: priceHistory, isLoading: chartLoading } = usePriceHistory(chartContractAddress, chartTimeframe);
  const { data: tokenData } = useTokenData(chartContractAddress);

  // Set initial tokens
  useEffect(() => {
    setFromToken(tokens[1]); // USDT
    setToToken(tokens[0]); // OEC
  }, []);

  // Chart formatting functions
  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem * 1000);
    switch (chartTimeframe) {
      case "1H":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "1D":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "7D":
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case "30D":
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'price') {
      return [`$${Number(value).toFixed(6)}`, 'Price'];
    }
    return [value, name];
  };

  const chartTimeframes = [
    { key: "1H", label: "1H" },
    { key: "1D", label: "24H" },
    { key: "7D", label: "7D" },
    { key: "30D", label: "30D" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Token Swap</h1>
        <p className="text-gray-400">Trade tokens instantly on the Oeconomia ecosystem</p>
      </div>

      <div className={`grid gap-6 ${showChart ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Main Swap Interface */}
        <div className={showChart ? 'xl:col-span-2' : 'lg:col-span-2'}>
          <Card className="crypto-card border h-full">
            <CardHeader className="pb-3">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 bg-[var(--crypto-dark)] rounded-lg p-1">
                  {["Swap", "Limit", "Buy", "Sell"].map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(tab)}
                      className={
                        activeTab === tab
                          ? "bg-crypto-blue hover:bg-crypto-blue/80 text-white px-4 py-2"
                          : "text-gray-400 hover:text-white px-4 py-2"
                      }
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChart(!showChart)}
                    className={`text-gray-400 hover:text-white ${showChart ? 'text-crypto-blue' : ''}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 relative">
              {/* Settings Panel */}
              {showSettings && (
                <Card className="bg-[var(--crypto-dark)] border-[var(--crypto-border)]">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Slippage Tolerance</label>
                      <div className="flex space-x-2 mb-2">
                        {[0.1, 0.5, 1.0].map((value) => (
                          <Button
                            key={value}
                            variant={slippage === value && !isSlippageCustom ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSlippage(value);
                              setIsSlippageCustom(false);
                            }}
                            className="text-xs"
                          >
                            {value}%
                          </Button>
                        ))}
                        <div className="flex items-center space-x-1">
                          <Input
                            type="number"
                            placeholder="Custom"
                            value={customSlippage}
                            onChange={(e) => {
                              setCustomSlippage(e.target.value);
                              if (e.target.value) {
                                setSlippage(parseFloat(e.target.value));
                                setIsSlippageCustom(true);
                              }
                            }}
                            className="w-20 h-8 text-xs"
                          />
                          <span className="text-xs text-gray-400">%</span>
                        </div>
                      </div>
                      {slippage > 5 && (
                        <div className="flex items-center space-x-1 text-yellow-500 text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>High slippage tolerance</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* From Token */}
              <div className="bg-[var(--crypto-dark)] rounded-lg p-4 border border-[var(--crypto-border)] mb-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">
                    {activeTab === "Buy" ? "Buy" : activeTab === "Sell" ? "Sell" : "From"}
                  </span>
                  {fromToken && (
                    <span className="text-gray-400 text-sm">
                      Balance: {formatNumber(10000, 2)} {fromToken.symbol}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent border-none text-2xl font-bold text-white placeholder-gray-500 p-0 h-auto focus-visible:ring-0"
                  />
                  <Select value={fromToken?.symbol || ""} onValueChange={(value) => {
                    const token = tokens.find(t => t.symbol === value);
                    if (token) setFromToken(token);
                  }}>
                    <SelectTrigger className="w-auto bg-[var(--crypto-card)] border-[var(--crypto-border)] text-white">
                      <SelectValue placeholder="Select token">
                        {fromToken && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-green flex items-center justify-center text-xs font-bold">
                              {fromToken.symbol.charAt(0)}
                            </div>
                            <span>{fromToken.symbol}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-green flex items-center justify-center text-xs font-bold">
                              {token.symbol.charAt(0)}
                            </div>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fromToken && (
                  <div className="text-right text-gray-400 text-sm mt-2">
                    ≈ ${formatNumber((parseFloat(fromAmount) || 0) * fromToken.price, 2)}
                  </div>
                )}
              </div>

              {/* Swap Arrow - Overlapping the borders */}
              <div className="relative flex justify-center -my-6 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwapTokens}
                  className="bg-[var(--crypto-card)] border-2 border-[var(--crypto-border)] rounded-full w-12 h-12 p-0 hover:bg-[var(--crypto-card)]/80 shadow-lg"
                >
                  <ArrowUpDown className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              {/* To Token */}
              <div className="bg-[var(--crypto-dark)] rounded-lg p-4 border border-[var(--crypto-border)] mt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">
                    {activeTab === "Buy" ? "For" : activeTab === "Sell" ? "For" : "To"}
                  </span>
                  {toToken && (
                    <span className="text-gray-400 text-sm">
                      Balance: {formatNumber(5000, 2)} {toToken.symbol}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    value={quote?.outputAmount || ""}
                    readOnly
                    placeholder="0.0"
                    className="flex-1 bg-transparent border-none text-2xl font-bold text-white placeholder-gray-500 p-0 h-auto focus-visible:ring-0"
                  />
                  <Select value={toToken?.symbol || ""} onValueChange={(value) => {
                    const token = tokens.find(t => t.symbol === value);
                    if (token) setToToken(token);
                  }}>
                    <SelectTrigger className="w-auto bg-[var(--crypto-card)] border-[var(--crypto-border)] text-white">
                      <SelectValue placeholder="Select token">
                        {toToken && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-green flex items-center justify-center text-xs font-bold">
                              {toToken.symbol.charAt(0)}
                            </div>
                            <span>{toToken.symbol}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-green flex items-center justify-center text-xs font-bold">
                              {token.symbol.charAt(0)}
                            </div>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {toToken && quote && (
                  <div className="text-right text-gray-400 text-sm mt-2">
                    ≈ ${formatNumber(parseFloat(quote.outputAmount) * toToken.price, 2)}
                  </div>
                )}
              </div>

              {/* Quote and Trade Information */}
              {quote && (
                <div className="bg-[var(--crypto-card)] rounded-lg p-4 border border-[var(--crypto-border)] space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="text-white">
                      1 {fromToken?.symbol} = {formatNumber(quote.exchangeRate, 6)} {toToken?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Price Impact</span>
                    <span className="text-green-400">&lt; 0.01%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white">~$2.50</span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <Button
                onClick={handleSwapExecution}
                disabled={!fromToken || !toToken || !fromAmount || isLoading}
                className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-6 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : !fromToken || !toToken ? (
                  "Select Tokens"
                ) : !fromAmount ? (
                  "Enter Amount"
                ) : (
                  `${activeTab} ${fromToken.symbol}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Price Chart */}
        {showChart && (
          <div className="xl:col-span-2">
            <Card className="crypto-card border h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>Price Chart</span>
                    {fromToken && toToken && (
                      <div className="text-sm text-gray-400">
                        {fromToken.symbol}/{toToken.symbol}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {chartTimeframes.map((tf) => (
                      <Button
                        key={tf.key}
                        variant={chartTimeframe === tf.key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setChartTimeframe(tf.key)}
                        className={chartTimeframe === tf.key ? "bg-crypto-blue hover:bg-crypto-blue/80 text-xs" : "text-gray-400 hover:text-white text-xs"}
                      >
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {chartLoading ? (
                  <div className="w-full h-full bg-[var(--crypto-dark)] rounded-lg border border-[var(--crypto-border)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-crypto-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Loading price data...</p>
                    </div>
                  </div>
                ) : !priceHistory || priceHistory.length === 0 ? (
                  <div className="w-full h-full bg-[var(--crypto-dark)] rounded-lg border border-[var(--crypto-border)] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg font-medium mb-2">No Price Data</p>
                      <p className="text-gray-500 text-sm">
                        {fromToken && toToken
                          ? `Price data for ${fromToken.symbol}/${toToken.symbol} not available`
                          : 'Select tokens to view chart'
                        }
                      </p>
                      {fromToken && toToken && (
                        <div className="mt-4 space-y-2 text-left max-w-xs mx-auto">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Current Rate:</span>
                            <span className="text-white">
                              1 {fromToken.symbol} = {formatNumber(toToken.price / fromToken.price, 6)} {toToken.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">24h Change:</span>
                            <span className="text-green-400">+0.12%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">24h Volume:</span>
                            <span className="text-white">$24.3M</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--crypto-border)" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatXAxis}
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={['dataMin * 0.99', 'dataMax * 1.01']}
                          tickFormatter={(value) => `$${value.toFixed(6)}`}
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <Tooltip 
                          formatter={formatTooltip}
                          labelFormatter={(value) => new Date(value * 1000).toLocaleString()}
                          contentStyle={{
                            backgroundColor: 'var(--crypto-card)',
                            border: '1px solid var(--crypto-border)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#00D2FF" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, stroke: '#00D2FF', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Trading Pair Stats Overlay */}
                    {fromToken && toToken && (
                      <div className="absolute top-4 right-4 bg-[var(--crypto-card)]/90 backdrop-blur-sm rounded-lg p-3 border border-[var(--crypto-border)]">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center min-w-[160px]">
                            <span className="text-gray-400">Current Rate:</span>
                            <span className="text-white font-medium">
                              1 {fromToken.symbol} = {formatNumber(toToken.price / fromToken.price, 6)} {toToken.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">24h Change:</span>
                            <span className={`font-medium ${
                              tokenData?.priceChangePercent24h && tokenData.priceChangePercent24h >= 0 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {tokenData?.priceChangePercent24h 
                                ? `${tokenData.priceChangePercent24h >= 0 ? '+' : ''}${tokenData.priceChangePercent24h.toFixed(2)}%`
                                : '+0.12%'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">24h Volume:</span>
                            <span className="text-white font-medium">
                              {tokenData?.volume24h 
                                ? `$${formatNumber(tokenData.volume24h)}`
                                : '$24.3M'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">{fromToken.symbol} Price:</span>
                            <span className="text-white font-medium">
                              ${formatNumber(fromToken.price, 6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Market Stats */}
          <Card className="crypto-card border">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Market Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">24h Volume</span>
                  <span className="text-white font-medium">$2.85M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Total Liquidity</span>
                  <span className="text-white font-medium">$18.9M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Active Pairs</span>
                  <span className="text-white font-medium">247</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Card className="crypto-card border">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Safety Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">MEV Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Slippage Control</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Price Impact Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">Contract Verification</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History Preview */}
          <Card className="crypto-card border">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Swaps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">USDT → OEC</span>
                  </div>
                  <span className="text-green-400">+125.50 OEC</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">BNB → USDT</span>
                  </div>
                  <span className="text-green-400">+645.00 USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">OEC → WETH</span>
                  </div>
                  <span className="text-green-400">+0.085 WETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Swap() {
  return (
    <Layout>
      <SwapContent />
    </Layout>
  );
}