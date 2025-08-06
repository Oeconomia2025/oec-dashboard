import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { usePriceHistory } from "@/hooks/use-token-data";
import { getTokenColor, getChartGradientId } from "@/utils/token-colors";
import type { PriceHistory } from "@shared/schema";

interface PriceChartProps {
  contractAddress: string;
  tokenSymbol?: string;
  tokenData?: any;
  formatPercentage?: (percent: number | undefined) => string;
  getChangeColor?: (percent: number | undefined) => string;
}

export function PriceChart({ contractAddress, tokenSymbol = "DEFAULT", tokenData, formatPercentage, getChangeColor }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const { data: rawPriceHistory, isLoading, error } = usePriceHistory(contractAddress, timeframe);
  
  // Debug log to see what data we're getting
  console.log("PriceChart Debug:", { 
    contractAddress, 
    tokenSymbol, 
    dataLength: rawPriceHistory?.length, 
    isLoading, 
    error, 
    firstDataPoint: rawPriceHistory?.[0] 
  });
  
  // Get dynamic colors for this token
  const tokenColor = getTokenColor(tokenSymbol);
  const gradientId = getChartGradientId(tokenSymbol);

  // Smooth the data by reducing data points for cleaner curves
  const smoothPriceData = (data: PriceHistory[] | undefined): PriceHistory[] => {
    if (!data || data.length === 0) return [];
    
    // For shorter timeframes, reduce data points more aggressively
    const reductionFactor = timeframe === "1H" ? 3 : timeframe === "1D" ? 5 : 10;
    
    if (data.length <= 20) return data; // Don't reduce if we have few points
    
    return data.filter((_, index) => index % reductionFactor === 0 || index === data.length - 1);
  };

  const priceHistory = smoothPriceData(rawPriceHistory);

  // Calculate evenly spaced Y-axis ticks
  const calculateYTicks = (data: PriceHistory[]) => {
    if (!data || data.length === 0) return [];
    
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1; // 10% padding
    const adjustedMin = minPrice - padding;
    const adjustedMax = maxPrice + padding;
    const range = adjustedMax - adjustedMin;
    const tickCount = 5;
    const step = range / (tickCount - 1);
    
    return Array.from({ length: tickCount }, (_, i) => adjustedMin + (step * i));
  };

  const yTicks = calculateYTicks(priceHistory);

  const formatXAxis = (tickItem: any) => {
    // Handle both timestamp formats: Unix timestamp and ISO string
    const date = typeof tickItem === 'string' ? new Date(tickItem) : new Date(tickItem * 1000);
    switch (timeframe) {
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
      return [`${Number(value).toFixed(2)}`, 'Price'];
    }
    return [value, name];
  };

  const timeframes = [
    { key: "1H", label: "1H" },
    { key: "1D", label: "24H" },
    { key: "7D", label: "7D" },
    { key: "30D", label: "30D" },
  ];

  return (
    <div className="lg:col-span-2">
      <Card className="crypto-card p-4 border bg-crypto-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-6">
            {tokenData && formatPercentage && getChangeColor && (
              <>
                {tokenData.deltaHour && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">1 Hour</p>
                    <p className={`text-sm font-semibold ${getChangeColor((tokenData.deltaHour - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaHour - 1) * 100)}
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-gray-400">24 Hours</p>
                  <p className={`text-sm font-semibold ${getChangeColor(tokenData.priceChangePercent24h)}`}>
                    {formatPercentage(tokenData.priceChangePercent24h)}
                  </p>
                </div>
                {tokenData.deltaWeek && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">7 Days</p>
                    <p className={`text-sm font-semibold ${getChangeColor((tokenData.deltaWeek - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaWeek - 1) * 100)}
                    </p>
                  </div>
                )}
                {tokenData.deltaMonth && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">30 Days</p>
                    <p className={`text-sm font-semibold ${getChangeColor((tokenData.deltaMonth - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaMonth - 1) * 100)}
                    </p>
                  </div>
                )}
                {tokenData.deltaYear && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">1 Year</p>
                    <p className={`text-sm font-semibold ${getChangeColor((tokenData.deltaYear - 1) * 100)}`}>
                      {formatPercentage((tokenData.deltaYear - 1) * 100)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex space-x-2">
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

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        ) : !priceHistory || priceHistory.length === 0 ? (
          <div className="h-80 bg-gradient-to-br from-crypto-green/10 to-crypto-blue/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-crypto-green mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No Historical Data</p>
              <p className="text-gray-500 text-sm">Current price: ${priceHistory?.[0]?.price || 'Loading...'}</p>
            </div>
          </div>
        ) : priceHistory.length === 1 ? (
          <div className="h-80 bg-gradient-to-br from-crypto-green/10 to-crypto-blue/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-crypto-green mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Current Price</p>
              <p className="text-crypto-green text-3xl font-bold">${priceHistory[0].price.toFixed(4)}</p>
              <p className="text-gray-500 text-sm mt-2">Real-time data from Moralis API</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokenColor} stopOpacity={1.0}/>
                    <stop offset="25%" stopColor={tokenColor} stopOpacity={1.0}/>
                    <stop offset="100%" stopColor={tokenColor} stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="chartBackground" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#374151" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#1F2937" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#chartBackground)" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis}
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  domain={['dataMin * 0.9', 'dataMax * 1.1']}
                  ticks={yTicks}
                  tickFormatter={(value) => {
                    // Better formatting based on value range
                    if (value >= 1000) return `${(value/1000).toFixed(1)}k`;
                    if (value >= 100) return value.toFixed(1);
                    if (value >= 1) return value.toFixed(2);
                    return value.toFixed(4);
                  }}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickMargin={12}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => {
                    const date = typeof value === 'string' ? new Date(value) : new Date(value * 1000);
                    return date.toLocaleString();
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--crypto-card)',
                    border: '1px solid var(--crypto-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={tokenColor} 
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: tokenColor }}
                  connectNulls={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
