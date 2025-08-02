import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  AlertTriangle
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
  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setQuote(null);
  };

  // Handle amount change
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      getSwapQuote(fromToken, toToken, fromAmount);
    } else {
      setQuote(null);
    }
  }, [fromToken, toToken, fromAmount, slippage]);

  // Set initial tokens
  useEffect(() => {
    setFromToken(tokens[1]); // USDT
    setToToken(tokens[0]); // OEC
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Token Swap</h1>
        <p className="text-gray-400">Trade tokens instantly on the Oeconomia ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Swap Interface */}
        <div className="lg:col-span-2">
          <Card className="crypto-card border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Swap Tokens</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
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
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <Card className="bg-[var(--crypto-dark)] border-[var(--crypto-border)]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Select
                        value={fromToken?.symbol || ""}
                        onValueChange={(value) => {
                          const token = tokens.find(t => t.symbol === value);
                          setFromToken(token || null);
                        }}
                      >
                        <SelectTrigger className="w-40 bg-transparent border-none p-0 h-auto">
                          <SelectValue>
                            {fromToken && (
                              <div className="flex items-center space-x-2">
                                <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                                <span className="font-medium">{fromToken.symbol}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center space-x-2">
                                <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
                                <span>{token.symbol}</span>
                                <span className="text-gray-400 text-sm">{token.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        className="text-right text-xl font-medium bg-transparent border-none p-0 h-auto"
                      />
                    </div>
                    {fromToken && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>${formatNumber(fromToken.price)}</span>
                        <div className="flex items-center space-x-2">
                          <span>Balance: {formatNumber(fromToken.balance || 0)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFromAmount((fromToken.balance || 0).toString())}
                            className="text-xs text-crypto-blue hover:text-crypto-blue-light p-1 h-auto"
                          >
                            MAX
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwap}
                  className="rounded-full bg-[var(--crypto-card)] hover:bg-[var(--crypto-dark)] border border-[var(--crypto-border)]"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
                <Card className="bg-[var(--crypto-dark)] border-[var(--crypto-border)]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Select
                        value={toToken?.symbol || ""}
                        onValueChange={(value) => {
                          const token = tokens.find(t => t.symbol === value);
                          setToToken(token || null);
                        }}
                      >
                        <SelectTrigger className="w-40 bg-transparent border-none p-0 h-auto">
                          <SelectValue>
                            {toToken && (
                              <div className="flex items-center space-x-2">
                                <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                                <span className="font-medium">{toToken.symbol}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center space-x-2">
                                <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
                                <span>{token.symbol}</span>
                                <span className="text-gray-400 text-sm">{token.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-right">
                        {isLoading ? (
                          <div className="text-xl font-medium text-gray-400">...</div>
                        ) : quote ? (
                          <div className="text-xl font-medium">
                            {formatNumber(parseFloat(quote.outputAmount))}
                          </div>
                        ) : (
                          <div className="text-xl font-medium text-gray-400">0.0</div>
                        )}
                      </div>
                    </div>
                    {toToken && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>${formatNumber(toToken.price)}</span>
                        <span>Balance: {formatNumber(toToken.balance || 0)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Swap Quote Details */}
              {quote && !isLoading && (
                <Card className="bg-[var(--crypto-dark)] border-[var(--crypto-border)]">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Exchange Rate</span>
                      <span className="text-white">
                        1 {fromToken?.symbol} = {formatNumber(quote.exchangeRate, 6)} {toToken?.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price Impact</span>
                      <span className={`${quote.priceImpact > 3 ? 'text-red-400' : quote.priceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {quote.priceImpact > 0.01 ? '+' : ''}{formatNumber(quote.priceImpact, 2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trading Fee</span>
                      <span className="text-white">{formatNumber(quote.fee, 4)} {fromToken?.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Minimum Received</span>
                      <span className="text-white">
                        {formatNumber(parseFloat(quote.minimumReceived))} {toToken?.symbol}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Swap Button */}
              <Button 
                className="w-full bg-gradient-to-r from-crypto-blue to-purple-600 hover:from-crypto-blue-light hover:to-purple-700 text-white font-medium py-3"
                disabled={!fromToken || !toToken || !fromAmount || isLoading || parseFloat(fromAmount) === 0}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Getting Quote...</span>
                  </div>
                ) : !fromToken || !toToken ? (
                  "Select Tokens"
                ) : !fromAmount || parseFloat(fromAmount) === 0 ? (
                  "Enter Amount"
                ) : (
                  `Swap ${fromToken.symbol} for ${toToken.symbol}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

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