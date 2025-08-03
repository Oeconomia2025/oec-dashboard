import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { usePriceHistory } from "@/hooks/use-token-data";
import type { PriceHistory } from "@shared/schema";

interface PriceChartProps {
  contractAddress: string;
}

export function PriceChart({ contractAddress }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const { data: priceHistory, isLoading } = usePriceHistory(contractAddress, timeframe);

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem * 1000);
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
      return [`$${Number(value).toFixed(6)}`, 'Price'];
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
      <Card className="crypto-card p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Price Chart</h2>
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
              <p className="text-gray-400">No price data available</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
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
                  stroke="var(--crypto-green)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--crypto-green)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
