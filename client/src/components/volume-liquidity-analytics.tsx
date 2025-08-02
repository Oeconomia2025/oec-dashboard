import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Droplets, Activity, BarChart3 } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface VolumeData {
  volume24h: number;
  volume7d: number;
  volumeChange24h: number;
  liquidity: number;
  liquidityChange24h: number;
  marketCap: number;
  circulatingSupply: number;
  holders: number;
}

interface VolumeAnalyticsProps {
  contractAddress: string;
}

export function VolumeLiquidityAnalytics({ contractAddress }: VolumeAnalyticsProps) {
  const { data: volumeData, isLoading } = useQuery<VolumeData>({
    queryKey: ["/api/volume-analytics", contractAddress],
    refetchInterval: 30000,
  });

  // Mock data for demonstration
  const mockData: VolumeData = {
    volume24h: 2850000,
    volume7d: 18750000,
    volumeChange24h: 12.5,
    liquidity: 5420000,
    liquidityChange24h: -2.3,
    marketCap: 89750000,
    circulatingSupply: 75000000,
    holders: 12847
  };

  const data = volumeData || mockData;

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = "currency" 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    format?: "currency" | "number" | "percentage";
  }) => {
    const formatValue = () => {
      switch (format) {
        case "currency":
          return formatPrice(value);
        case "number":
          return formatNumber(value);
        case "percentage":
          return `${value.toFixed(2)}%`;
        default:
          return value;
      }
    };

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-crypto-blue/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-crypto-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-lg font-semibold">{formatValue()}</p>
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${
            change >= 0 ? 'text-crypto-green' : 'text-crypto-red'
          }`}>
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="crypto-card p-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        </Card>
        <Card className="crypto-card p-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
      {/* Volume Analytics */}
      <Card className="crypto-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-crypto-blue" />
          <h3 className="text-lg font-semibold">Volume Analytics</h3>
        </div>
        
        <div className="space-y-6">
          <StatCard
            title="24h Volume"
            value={data.volume24h}
            change={data.volumeChange24h}
            icon={Activity}
          />
          
          <StatCard
            title="7d Volume"
            value={data.volume7d}
            icon={BarChart3}
          />
          
          <div className="pt-4 border-t border-crypto-border/30">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Volume/Market Cap</span>
              <span className="font-medium">
                {((data.volume24h / data.marketCap) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Liquidity Analytics */}
      <Card className="crypto-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Droplets className="w-5 h-5 text-crypto-purple" />
          <h3 className="text-lg font-semibold">Liquidity Analytics</h3>
        </div>
        
        <div className="space-y-6">
          <StatCard
            title="Total Liquidity"
            value={data.liquidity}
            change={data.liquidityChange24h}
            icon={Droplets}
          />
          
          <StatCard
            title="Market Cap"
            value={data.marketCap}
            icon={TrendingUp}
          />
          
          <div className="pt-4 border-t border-crypto-border/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block">Circulating</span>
                <span className="font-medium">{formatNumber(data.circulatingSupply)}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Holders</span>
                <span className="font-medium">{formatNumber(data.holders)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}