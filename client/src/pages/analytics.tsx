import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ExternalLink,
  Coins,
  ShoppingBag,
  FileText,
  Zap,
  ArrowUpRight,
  Construction
} from "lucide-react";
import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";

interface ProtocolData {
  name: string;
  type: string;
  status: 'active' | 'construction';
  metrics?: {
    health?: string;
    activeUsers?: number;
    borrowers?: number;
    borrowed?: string;
    collateral?: {
      ETH: string;
      BNB: string;
      WBTC: string;
    };
    pools?: {
      ALUD: string;
      ALUR: string;
    };
  };
  icon: any;
  gradient: string;
  description: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};

const formatCurrency = (amount: string): string => {
  const num = parseFloat(amount.replace(/[$,]/g, ''));
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return '$' + (num / 1000).toFixed(0) + 'K';
  }
  return '$' + num.toLocaleString();
};

export default function Analytics() {
  // Mock data for demonstration - in a real app, this would come from APIs
  const protocolsData: ProtocolData[] = [
    {
      name: "Alluria",
      type: "Lending",
      status: 'active',
      icon: Coins,
      gradient: "from-teal-600 to-blue-700",
      description: "Decentralized lending protocol for cross-chain assets",
      metrics: {
        health: "215%",
        activeUsers: 1685,
        borrowers: 755,
        borrowed: "$31,525,622",
        collateral: {
          ETH: "$8,022,350",
          BNB: "$17,510,711", 
          WBTC: "$25,852,920"
        },
        pools: {
          ALUD: "$42,100,250",
          ALUR: "$68,571,665"
        }
      }
    },
    {
      name: "Eloqura",
      type: "AMM Yield Bridge",
      status: 'active',
      icon: Zap,
      gradient: "from-blue-600 to-teal-700",
      description: "Automated market maker with cross-chain yield optimization",
      metrics: {
        health: "128%",
        activeUsers: 892,
        borrowed: "$18,240,133"
      }
    },
    {
      name: "Artivya",
      type: "NFT Marketplace",
      status: 'construction',
      icon: ShoppingBag,
      gradient: "from-purple-600 to-pink-700",
      description: "Next-generation NFT marketplace with advanced trading features"
    },
    {
      name: "Iridescia", 
      type: "Contract Creator",
      status: 'construction',
      icon: FileText,
      gradient: "from-orange-600 to-red-700",
      description: "No-code smart contract deployment and management platform"
    }
  ];

  const { data: ecosystemStats } = useQuery({
    queryKey: ['/api/ecosystem-stats'],
    queryFn: () => ({
      totalValueLocked: "$156,789,123",
      totalUsers: 3247,
      activeProtocols: 2,
      totalTransactions: 45672
    })
  });

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Oeconomia Analytics</h1>
            <p className="text-gray-400">Comprehensive overview of all Oeconomia ecosystem protocols</p>
          </div>

          {/* Ecosystem Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Value Locked</h3>
                <DollarSign className="text-crypto-green w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {ecosystemStats?.totalValueLocked || "$156.8M"}
              </div>
              <div className="text-sm text-crypto-green mt-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.4% this week
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Users</h3>
                <Users className="text-crypto-blue w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {ecosystemStats?.totalUsers ? formatNumber(ecosystemStats.totalUsers) : "3,247"}
              </div>
              <div className="text-sm text-crypto-blue mt-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2% this month
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Active Protocols</h3>
                <Activity className="text-crypto-green w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {ecosystemStats?.activeProtocols || "2"}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                2 in development
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Transactions</h3>
                <TrendingUp className="text-crypto-blue w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {ecosystemStats?.totalTransactions ? formatNumber(ecosystemStats.totalTransactions) : "45.7K"}
              </div>
              <div className="text-sm text-crypto-green mt-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +23.1% today
              </div>
            </Card>
          </div>

          {/* Protocol Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {protocolsData.map((protocol, index) => {
              const IconComponent = protocol.icon;
              return (
                <Card key={index} className={`crypto-card border overflow-hidden bg-gradient-to-br ${protocol.gradient} text-white`}>
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <IconComponent className="w-8 h-8" />
                          <div>
                            <h2 className="text-2xl font-bold">{protocol.name}</h2>
                            <p className="text-blue-100 text-lg">{protocol.type}</p>
                          </div>
                        </div>
                        <p className="text-blue-100 text-sm max-w-sm">{protocol.description}</p>
                      </div>
                      
                      {protocol.status === 'active' && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white border-none">
                          <Activity className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      )}
                    </div>

                    {/* Metrics */}
                    {protocol.metrics ? (
                      <div className="space-y-4">
                        {protocol.metrics.health && (
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Health</span>
                            <span className="font-bold text-xl">{protocol.metrics.health}</span>
                          </div>
                        )}
                        
                        {protocol.metrics.activeUsers && (
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Active Users</span>
                            <span className="font-bold">{formatNumber(protocol.metrics.activeUsers)}</span>
                          </div>
                        )}
                        
                        {protocol.metrics.borrowers && (
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Borrowers</span>
                            <span className="font-bold">{formatNumber(protocol.metrics.borrowers)}</span>
                          </div>
                        )}
                        
                        {protocol.metrics.borrowed && (
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Borrowed</span>
                            <span className="font-bold">{formatCurrency(protocol.metrics.borrowed)}</span>
                          </div>
                        )}

                        {protocol.metrics.collateral && (
                          <div className="mt-6">
                            <h4 className="text-blue-100 mb-3 font-medium">Collateral</h4>
                            <div className="space-y-2">
                              {Object.entries(protocol.metrics.collateral).map(([token, amount]) => (
                                <div key={token} className="flex justify-between items-center">
                                  <span className="text-blue-100">{token}</span>
                                  <span className="font-bold">{formatCurrency(amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {protocol.metrics.pools && (
                          <div className="mt-6">
                            <h4 className="text-blue-100 mb-3 font-medium">Pools</h4>
                            <div className="space-y-2">
                              {Object.entries(protocol.metrics.pools).map(([pool, amount]) => (
                                <div key={pool} className="flex justify-between items-center">
                                  <span className="text-blue-100">{pool} Pool</span>
                                  <span className="font-bold">{formatCurrency(amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <Construction className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                          <p className="text-blue-100">Under Development</p>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6 pt-6 border-t border-blue-200/20">
                      <Button 
                        variant="secondary" 
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                        disabled={protocol.status === 'construction'}
                      >
                        {protocol.status === 'construction' ? (
                          <>
                            <Construction className="w-4 h-4 mr-2" />
                            Under Development
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit {protocol.name}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <Card className="crypto-card p-6 mt-8 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Oeconomia Ecosystem Roadmap</h3>
                <p className="text-gray-400 text-sm">
                  Tracking the development and launch of all Oeconomia protocols. 
                  Active protocols show real-time metrics while those under construction display development status.
                </p>
              </div>
              <Button variant="outline" className="border-crypto-blue text-crypto-blue hover:bg-crypto-blue hover:text-black">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Roadmap
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}