import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  DollarSign,
  Coins,
  Calendar,
  Activity,
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";
import { useAccount } from "wagmi";

// Mock data for development - replace with smart contract integration
const mockStakingPools = [
  {
    id: 1,
    name: "OEC Flexible Staking",
    tokenSymbol: "OEC",
    lockPeriod: "Flexible",
    apy: 12.5,
    totalStaked: 25000000,
    userStaked: 1500,
    userRewards: 8.75,
    minStake: 10,
    maxStake: 100000,
    status: "active"
  },
  {
    id: 2,
    name: "OEC 30-Day Lock",
    tokenSymbol: "OEC",
    lockPeriod: "30 Days",
    apy: 18.0,
    totalStaked: 15000000,
    userStaked: 2500,
    userRewards: 15.2,
    minStake: 100,
    maxStake: 50000,
    status: "active"
  },
  {
    id: 3,
    name: "OEC 90-Day Lock",
    tokenSymbol: "OEC",
    lockPeriod: "90 Days",
    apy: 25.0,
    totalStaked: 8000000,
    userStaked: 0,
    userRewards: 0,
    minStake: 500,
    maxStake: 25000,
    status: "active"
  },
  {
    id: 4,
    name: "OEC 180-Day Lock",
    tokenSymbol: "OEC",
    lockPeriod: "180 Days",
    apy: 35.0,
    totalStaked: 5000000,
    userStaked: 5000,
    userRewards: 42.8,
    minStake: 1000,
    maxStake: 10000,
    status: "active"
  }
];

const mockUserStats = {
  totalStaked: 9000,
  totalRewards: 66.75,
  totalValue: 9066.75,
  activePositions: 3
};

export function Staking() {
  const { isConnected } = useAccount();
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  const formatPrice = (price: number) => `$${formatNumber(price)}`;

  const handleStake = async (poolId: number) => {
    if (!stakeAmount || isStaking) return;
    setIsStaking(true);
    // Placeholder for smart contract integration
    setTimeout(() => {
      setIsStaking(false);
      setStakeAmount("");
      // Show success message
    }, 2000);
  };

  const handleUnstake = async (poolId: number) => {
    if (!unstakeAmount || isUnstaking) return;
    setIsUnstaking(true);
    // Placeholder for smart contract integration
    setTimeout(() => {
      setIsUnstaking(false);
      setUnstakeAmount("");
      // Show success message
    }, 2000);
  };

  const handleClaimRewards = async (poolId: number) => {
    if (isClaiming) return;
    setIsClaiming(true);
    // Placeholder for smart contract integration
    setTimeout(() => {
      setIsClaiming(false);
      // Show success message
    }, 2000);
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <Lock className="w-16 h-16 text-crypto-blue mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Staking</h1>
              <p className="text-gray-400 mb-8">Connect your wallet to start earning rewards through staking</p>
              <div className="max-w-xs mx-auto">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Staking</h1>
            <p className="text-gray-400">Earn rewards by staking your OEC tokens</p>
          </div>

          {/* Staking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Staked</h3>
                <Lock className="text-crypto-blue w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(mockUserStats.totalStaked)} OEC
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {formatPrice(mockUserStats.totalStaked * 1.00)} value
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Pending Rewards</h3>
                <Gift className="text-crypto-green w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(mockUserStats.totalRewards)} OEC
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {formatPrice(mockUserStats.totalRewards * 1.00)} value
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Value</h3>
                <DollarSign className="text-crypto-gold w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {formatPrice(mockUserStats.totalValue)}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Staked + Rewards
              </div>
            </Card>

            <Card className="crypto-card p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Active Positions</h3>
                <Activity className="text-crypto-purple w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {mockUserStats.activePositions}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Across {mockStakingPools.length} pools
              </div>
            </Card>
          </div>

          {/* Development Notice */}
          <Card className="crypto-card p-4 border border-amber-500/40 bg-amber-500/5 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-400 mb-1">Development Mode</h3>
                <p className="text-sm text-gray-300">
                  This is a placeholder staking interface ready for smart contract integration. 
                  Current APY rates and pool data are for demonstration purposes only.
                </p>
              </div>
            </div>
          </Card>

          {/* Staking Pools */}
          <Card className="crypto-card p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Staking Pools</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="border-crypto-blue/30 text-crypto-blue hover:bg-crypto-blue/10"
                disabled
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Pool
              </Button>
            </div>

            <div className="space-y-4">
              {mockStakingPools.map((pool) => (
                <Card key={pool.id} className="p-6 border border-crypto-border/40 bg-gradient-to-r from-crypto-blue/5 to-crypto-purple/5 hover:from-crypto-blue/10 hover:to-crypto-purple/10 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-crypto-blue to-crypto-purple rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{pool.name}</h3>
                          <Badge variant="outline" className="border-crypto-green/30 text-crypto-green">
                            {pool.apy}% APY
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{pool.lockPeriod}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Coins className="w-3 h-3" />
                            <span>{formatNumber(pool.totalStaked)} staked</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatNumber(pool.userStaked)} {pool.tokenSymbol}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatNumber(pool.userRewards)} rewards
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <Tabs defaultValue="stake" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                      <TabsTrigger value="stake">Stake</TabsTrigger>
                      <TabsTrigger value="unstake">Unstake</TabsTrigger>
                      <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stake" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Amount to Stake</label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              placeholder={`Min: ${pool.minStake} OEC`}
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleStake(pool.id)}
                              disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake || isStaking}
                              className="bg-crypto-blue hover:bg-crypto-blue/80"
                            >
                              {isStaking ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Stake'}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Min: {pool.minStake} OEC | Max: {formatNumber(pool.maxStake)} OEC
                          </div>
                        </div>
                        <div className="bg-crypto-dark/50 p-4 rounded">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>Estimated Daily Rewards:</span>
                              <span className="text-crypto-green">
                                {stakeAmount ? (parseFloat(stakeAmount) * pool.apy / 365 / 100).toFixed(4) : '0.0000'} OEC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estimated Monthly Rewards:</span>
                              <span className="text-crypto-green">
                                {stakeAmount ? (parseFloat(stakeAmount) * pool.apy / 12 / 100).toFixed(2) : '0.00'} OEC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lock Period:</span>
                              <span>{pool.lockPeriod}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="unstake" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Amount to Unstake</label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              placeholder={`Available: ${formatNumber(pool.userStaked)} OEC`}
                              value={unstakeAmount}
                              onChange={(e) => setUnstakeAmount(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleUnstake(pool.id)}
                              disabled={!unstakeAmount || parseFloat(unstakeAmount) > pool.userStaked || isUnstaking}
                              variant="outline"
                              className="border-crypto-purple/30 text-crypto-purple hover:bg-crypto-purple/10"
                            >
                              {isUnstaking ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Unstake'}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Available: {formatNumber(pool.userStaked)} OEC
                          </div>
                        </div>
                        <div className="bg-crypto-dark/50 p-4 rounded">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>You will receive:</span>
                              <span className="text-crypto-gold">
                                {unstakeAmount ? parseFloat(unstakeAmount).toFixed(2) : '0.00'} OEC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Remaining staked:</span>
                              <span>
                                {unstakeAmount ? (pool.userStaked - parseFloat(unstakeAmount)).toFixed(2) : pool.userStaked.toFixed(2)} OEC
                              </span>
                            </div>
                            {pool.lockPeriod !== "Flexible" && (
                              <div className="text-xs text-amber-400 mt-2">
                                <Info className="w-3 h-3 inline mr-1" />
                                Early unstaking may apply penalties
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rewards" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="bg-crypto-dark/50 p-4 rounded">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-crypto-green mb-2">
                                {formatNumber(pool.userRewards)} OEC
                              </div>
                              <div className="text-sm text-gray-400 mb-4">
                                Available Rewards
                              </div>
                              <Button
                                onClick={() => handleClaimRewards(pool.id)}
                                disabled={pool.userRewards === 0 || isClaiming}
                                className="w-full bg-crypto-green hover:bg-crypto-green/80"
                              >
                                {isClaiming ? (
                                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <Gift className="w-4 h-4 mr-2" />
                                )}
                                Claim Rewards
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-crypto-dark/50 p-4 rounded">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>Total Earned:</span>
                              <span className="text-crypto-green">
                                {formatNumber(pool.userRewards)} OEC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>USD Value:</span>
                              <span className="text-crypto-green">
                                {formatPrice(pool.userRewards * 1.00)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Next Reward:</span>
                              <span>12h 34m</span>
                            </div>
                            <Progress value={65} className="mt-3" />
                            <div className="text-xs text-gray-400 text-center">
                              65% until next reward distribution
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Staking;