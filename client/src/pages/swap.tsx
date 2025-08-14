import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePriceHistory, useTokenData } from "@/hooks/use-token-data";
import { parseUnits, formatUnits } from "viem";
import { useWalletClient } from "wagmi";

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
import { useLocation } from "wouter";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  price: number;
  balance?: number;
}

@@ -76,50 +78,52 @@ function SwapContent() {
  const [limitOrder, setLimitOrder] = useState<LimitOrder>({
    triggerPrice: "",
    expiry: "1 day",
    priceAdjustment: 0
  });
  const [limitOrderType, setLimitOrderType] = useState<'sell' | 'buy'>('sell');
  const [useNegativePercentages, setUseNegativePercentages] = useState(false);

  // Track the original price condition tokens (for stablecoin behavior)
  const [priceConditionTokens, setPriceConditionTokens] = useState<{from: Token | null, to: Token | null}>({
    from: null,
    to: null
  });

  // Buy mode specific state
  const [fiatAmount, setFiatAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Sell mode specific state
  const [sellPercentage, setSellPercentage] = useState<number | null>(null);
  const [swapPercentage, setSwapPercentage] = useState<number | null>(null);

  // Force chart re-creation when tokens change
  const [chartKey, setChartKey] = useState(0);
  const [chartVisible, setChartVisible] = useState(false);
  const [rawQuote, setRawQuote] = useState<any | null>(null);
  const { data: walletClient } = useWalletClient();

  // Helper functions for token selection
  const openTokenModal = (type?: 'from' | 'to' | 'priceCondition') => {
    if (type) {
      setTokenSelectionFor(type);
    }
    setTokenSearchQuery(""); // Clear search when opening modal
    setIsTokenModalOpen(true);
  };

  // Helper functions for network selection
  const openNetworkModal = (type: 'from' | 'to') => {
    setNetworkSelectionFor(type);
    setIsNetworkModalOpen(true);
  };

  const selectToken = (token: Token) => {
    // Force chart recreation by incrementing key
    setChartVisible(false);
    setTimeout(() => {
      setChartKey(prev => prev + 1);
      setChartVisible(true);
    }, 50);

    if (tokenSelectionFor === 'from') {
@@ -246,123 +250,140 @@ function SwapContent() {
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      decimals: 18,
      logo: "https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png",
      price: 98500.25,
      balance: 0.0015
    }
  ];

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(tokenSearchQuery.toLowerCase())
  );

  // Format number with commas and smart decimals
  const formatNumber = (num: number, decimals = 2): string => {
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(6).replace(/\.?0+$/, '');
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: decimals 
    });
  };

  // Fetch real swap quote from 0x API
  const getSwapQuote = async (
    from: Token,
    to: Token,
    amount: string,
    direction: 'from' | 'to' = 'from'
  ) => {
    if (!amount || parseFloat(amount) === 0) return null;

    setIsLoading(true);

    try {
      const amountUnits = parseUnits(
        amount,
        direction === 'from' ? from.decimals : to.decimals
      );
      const url =
        direction === 'from'
          ? `https://bsc.api.0x.org/swap/v1/quote?sellToken=${from.address}&buyToken=${to.address}&sellAmount=${amountUnits}`
          : `https://bsc.api.0x.org/swap/v1/quote?sellToken=${from.address}&buyToken=${to.address}&buyAmount=${amountUnits}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();

      const sellAmount = formatUnits(BigInt(data.sellAmount), from.decimals);
      const buyAmount = formatUnits(BigInt(data.buyAmount), to.decimals);

      if (direction === 'from') {
        setToAmount(buyAmount);
      } else {
        setFromAmount(sellAmount);
      }

      const quoteData: SwapQuote = {
        inputAmount: sellAmount,
        outputAmount: buyAmount,
        exchangeRate: parseFloat(buyAmount) / parseFloat(sellAmount),
        priceImpact: parseFloat(data.estimatedPriceImpact) || 0,
        minimumReceived: buyAmount,
        fee: data.protocolFee ? parseFloat(formatUnits(BigInt(data.protocolFee), from.decimals)) : 0,
        route:
          data.sources?.
            filter((s: any) => parseFloat(s.proportion) > 0).
            map((s: any) => s.name) || [from.symbol, to.symbol]
      };

      setQuote(quoteData);
      setRawQuote(data);
    } catch (err) {
      console.error('Error fetching swap quote:', err);
      setQuote(null);
      setRawQuote(null);
    } finally {
      setIsLoading(false);
    }
 };

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setQuote(null);
  };

  const handleSwapExecution = async () => {
    if (!fromToken || !toToken || (!fromAmount && !toAmount) || !rawQuote || !walletClient) return;

    setIsLoading(true);

    try {
      await walletClient.sendTransaction({
        to: rawQuote.to as `0x${string}`,
        data: rawQuote.data as `0x${string}`,
        value: rawQuote.value ? BigInt(rawQuote.value) : undefined,
      });

      setFromAmount("");
      setToAmount("");
      setQuote(null);
      setRawQuote(null);
    } catch (error) {
      console.error('Swap execution failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle amount changes for both fields
  useEffect(() => {
    if (fromToken && toToken) {
      if (lastEditedField === 'from' && fromAmount) {
        getSwapQuote(fromToken, toToken, fromAmount, 'from');
      } else if (lastEditedField === 'to' && toAmount) {
        getSwapQuote(fromToken, toToken, toAmount, 'to');
      } else {
        setQuote(null);
      }
    } else {
      setQuote(null);
    }
  }, [fromToken, toToken, fromAmount, toAmount, lastEditedField, slippage]);

  // Get price history for the selected token pair
  const chartContractAddress = fromToken?.address || "0x55d398326f99059fF775485246999027B3197955"; // Default to USDT
  const { data: tokenData } = useTokenData(chartContractAddress);
  const { data: priceHistory } = usePriceHistory(chartContractAddress, chartTimeframe);

  // Generate realistic OEC price progression for chart display
  const generateOECPriceHistory = (timeframe: string) => {
    const now = Date.now();
@@ -640,51 +661,51 @@ function SwapContent() {
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

  // Get dynamic color based on token
  const getTokenColor = (token?: Token | null) => {
    if (!token) return "#00D2FF"; // Default crypto blue

    const colorMap: { [key: string]: string } = {
      'BTC': '#F7931A',
      'ETH': '#627EEA', 
      'BNB': '#F3BA2F',
      'USDT': '#26A17B',
      'USDC': '#2775CA',
      'XRP': '#23292F',
      'ADA': '#0033AD',
      'SOL': '#9945FF',
      'DOT': '#E6007A',
      'MATIC': '#8247E5',
      'AVAX': '#E84142',
      'LINK': '#375BD2',
      'UNI': '#FF007A',
      'CAKE': '#D1884F',
      'OEC': '#8B5CF6', // Purple for OEC token
      'WBNB': '#F3BA2F',
      'BUSD': '#F0B90B',
    };

    return colorMap[token.symbol] || "#00D2FF";
  };
