import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  Award,
  Star,
  Crown,
  Zap,
  Target,
  Trophy,
  Medal,
  Flame,
  Calculator,
  BarChart3,
  PieChart,
  Percent,
  ChevronDown,
  ChevronUp
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

// Achievement badges system
const achievementBadges = [
  {
    id: 'first-stake',
    name: 'First Stake',
    description: 'Stake tokens for the first time',
    icon: Star,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/50',
    requirement: 'Stake any amount',
    earned: true
  },
  {
    id: 'diamond-hands',
    name: 'Diamond Hands',
    description: 'Stake for 30+ days continuously',
    icon: Crown,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400/50',
    requirement: '30 days staking',
    earned: true
  },
  {
    id: 'whale-staker',
    name: 'Whale Staker',
    description: 'Stake 10,000+ OEC tokens',
    icon: Trophy,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
    borderColor: 'border-purple-400/50',
    requirement: '10,000+ OEC staked',
    earned: false
  },
  {
    id: 'yield-farmer',
    name: 'Yield Farmer',
    description: 'Participate in all available pools',
    icon: Target,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400/50',
    requirement: 'Stake in all 4 pools',
    earned: false
  },
  {
    id: 'reward-collector',
    name: 'Reward Collector',
    description: 'Claim 100+ OEC in rewards',
    icon: Medal,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/20',
    borderColor: 'border-amber-400/50',
    requirement: '100+ OEC claimed',
    earned: true
  },
  {
    id: 'long-term-holder',
    name: 'Long Term Holder',
    description: 'Stake for 180+ days',
    icon: Flame,
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400/50',
    requirement: '180 days staking',
    earned: false
  }
];

// Pool-specific achievements
const getPoolAchievements = (poolId: number, userStaked: number, stakingDays: number = 0) => {
  const achievements = [];
  
  if (userStaked > 0) {
    achievements.push({
      id: `pool-${poolId}-participant`,
      name: 'Pool Participant',
      description: 'Active staker in this pool',
      icon: CheckCircle,
      color: 'text-green-400',
      earned: true
    });
  }
  
  if (userStaked >= 1000) {
    achievements.push({
      id: `pool-${poolId}-high-staker`,
      name: 'High Staker',
      description: '1,000+ OEC staked',
      icon: Award,
      color: 'text-blue-400',
      earned: true
    });
  }
  
  if (stakingDays >= 30) {
    achievements.push({
      id: `pool-${poolId}-veteran`,
      name: 'Pool Veteran',
      description: '30+ days in pool',
      icon: Crown,
      color: 'text-purple-400',
      earned: true
    });
  }
  
  return achievements;
};

export function Staking() {
  const { isConnected } = useAccount();
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  // ROI Calculator states
  const [calcAmount, setCalcAmount] = useState("1000");
  const [calcDays, setCalcDays] = useState("30");
  const [selectedPool, setSelectedPool] = useState(mockStakingPools[0]);
  
  // Collapsible sections state
  const [isROIExpanded, setIsROIExpanded] = useState(true);
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(true);
  const [expandedPools, setExpandedPools] = useState<Set<number>>(new Set());

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
      // Check for new achievements
      checkForNewAchievements(poolId, parseFloat(stakeAmount));
      // Show success message
    }, 2000);
  };

  const checkForNewAchievements = (poolId: number, amount: number) => {
    // This would integrate with smart contract to update achievement status
    // For now, just log potential achievements
    console.log(`Checking achievements for pool ${poolId} with stake amount ${amount}`);
    
    // Example: Check if user earned "First Stake" badge
    if (amount > 0) {
      console.log('Achievement unlocked: First Stake!');
    }
    
    // Example: Check if user earned "High Staker" badge
    if (amount >= 1000) {
      console.log('Achievement unlocked: High Staker!');
    }
  };

  // ROI Calculator functions
  const calculateROI = (amount: number, apy: number, days: number) => {
    const principal = amount;
    const annualReturn = principal * (apy / 100);
    const dailyReturn = annualReturn / 365;
    const totalReturn = dailyReturn * days;
    const finalAmount = principal + totalReturn;
    
    return {
      principal,
      totalReturn,
      finalAmount,
      dailyReturn,
      percentage: (totalReturn / principal) * 100
    };
  };

  const roiData = calculateROI(
    parseFloat(calcAmount) || 0,
    selectedPool.apy,
    parseInt(calcDays) || 0
  );

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

  const togglePoolExpansion = (poolId: number) => {
    const newExpanded = new Set(expandedPools);
    if (newExpanded.has(poolId)) {
      newExpanded.delete(poolId);
    } else {
      newExpanded.add(poolId);
    }
    setExpandedPools(newExpanded);
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <Lock className="w-16 h-16 text-crypto-blue mx-auto mb-6" />
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
          {/* Staking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-200 text-sm font-medium">Total Staked</h3>
                  <Lock className="text-gray-300 w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  {formatNumber(mockUserStats.totalStaked)} OEC
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {formatPrice(mockUserStats.totalStaked * 1.00)} value
                </div>
              </div>
            </Card>

            <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-200 text-sm font-medium">Pending Rewards</h3>
                  <Gift className="text-gray-300 w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  {formatNumber(mockUserStats.totalRewards)} OEC
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {formatPrice(mockUserStats.totalRewards * 1.00)} value
                </div>
              </div>
            </Card>

            <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-200 text-sm font-medium">Total Value</h3>
                  <DollarSign className="text-gray-300 w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  {formatPrice(mockUserStats.totalValue)}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Staked + Rewards
                </div>
              </div>
            </Card>

            <Card className="p-6 border bg-gradient-to-br from-gray-950 via-gray-950 to-black border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-xl shadow-black/70 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-200 text-sm font-medium">Active Positions</h3>
                  <Activity className="text-gray-300 w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-sm">
                  {mockUserStats.activePositions}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Across {mockStakingPools.length} pools
                </div>
              </div>
            </Card>
          </div>

          {/* ROI Calculator Section */}
          <Card className={`crypto-card p-6 border mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 ${!isROIExpanded ? 'pb-4' : ''}`}>
            <div 
              className={`flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200 ${isROIExpanded ? 'mb-6' : 'mb-0'}`}
              onClick={() => setIsROIExpanded(!isROIExpanded)}
            >
              <div className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-crypto-blue" />
                <h2 className="text-xl font-semibold">Interactive ROI Calculator</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="p-2 h-auto border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-200"
              >
                {isROIExpanded ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </Button>
            </div>
            
            {isROIExpanded && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Controls */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="calc-amount" className="text-sm font-medium mb-2 block">
                    Stake Amount (OEC)
                  </Label>
                  <Input
                    id="calc-amount"
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    placeholder="Enter amount to stake"
                    className="bg-black/30 border-white/20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="calc-days" className="text-sm font-medium mb-2 block">
                    Staking Period (Days)
                  </Label>
                  <Input
                    id="calc-days"
                    type="number"
                    value={calcDays}
                    onChange={(e) => setCalcDays(e.target.value)}
                    placeholder="Enter staking period"
                    className="bg-black/30 border-white/20"
                  />
                  <div className="flex gap-2 mt-2">
                    {[30, 90, 180, 365].map((days) => (
                      <Button
                        key={days}
                        variant="outline"
                        size="sm"
                        onClick={() => setCalcDays(days.toString())}
                        className="text-xs bg-black/20 border-white/20 hover:bg-white/10"
                      >
                        {days}d
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Select Pool
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockStakingPools.map((pool) => (
                      <Button
                        key={pool.id}
                        variant={selectedPool.id === pool.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPool(pool)}
                        className={`text-xs ${
                          selectedPool.id === pool.id
                            ? 'bg-crypto-blue hover:bg-crypto-blue/80'
                            : 'bg-black/20 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {pool.apy}% APY
                        <br />
                        <span className="text-xs opacity-75">{pool.lockPeriod}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ROI Results */}
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-crypto-green" />
                    ROI Breakdown
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Initial Stake:</span>
                      <span className="font-medium">{formatNumber(roiData.principal)} OEC</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Daily Rewards:</span>
                      <span className="font-medium text-crypto-green">
                        {formatNumber(roiData.dailyReturn)} OEC
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Rewards:</span>
                      <span className="font-medium text-crypto-green">
                        {formatNumber(roiData.totalReturn)} OEC
                      </span>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium">Final Amount:</span>
                      <span className="font-bold text-crypto-gold">
                        {formatNumber(roiData.finalAmount)} OEC
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">ROI Percentage:</span>
                      <span className="font-medium text-crypto-blue">
                        +{roiData.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <PieChart className="w-4 h-4 mr-2 text-crypto-purple" />
                    USD Value Estimation
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Value:</span>
                      <span>{formatPrice(roiData.principal * 1.00)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reward Value:</span>
                      <span className="text-crypto-green">{formatPrice(roiData.totalReturn * 1.00)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Value:</span>
                      <span className="text-crypto-gold">{formatPrice(roiData.finalAmount * 1.00)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 bg-black/20 p-3 rounded-lg">
                  <Info className="w-3 h-3 inline mr-1" />
                  Calculations based on current APY rates. Actual returns may vary based on market conditions and smart contract performance.
                </div>
              </div>
              </div>
            )}
          </Card>

          {/* Achievement Badges Section */}
          <Card className={`crypto-card p-6 border mb-8 ${!isAchievementsExpanded ? 'pb-4' : ''}`}>
            <div 
              className={`flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200 ${isAchievementsExpanded ? 'mb-6' : 'mb-0'}`}
              onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-crypto-gold" />
                <h2 className="text-xl font-semibold">Achievement Badges</h2>
                <Badge className="bg-crypto-blue/20 text-crypto-blue border-0">
                  {achievementBadges.filter(badge => badge.earned).length}/{achievementBadges.length} Earned
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="p-2 h-auto border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-200"
              >
                {isAchievementsExpanded ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </Button>
            </div>
            
            {isAchievementsExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievementBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`relative p-4 rounded-lg border transition-all duration-200 ${
                      badge.earned 
                        ? `${badge.bgColor} ${badge.borderColor} hover:scale-105` 
                        : 'bg-gray-800/50 border-gray-600/50 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        badge.earned ? badge.bgColor : 'bg-gray-700/50'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${badge.earned ? badge.color : 'text-gray-500'}`} />
                      </div>
                      <h3 className={`text-sm font-medium mb-1 ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs ${badge.earned ? 'text-gray-300' : 'text-gray-600'}`}>
                        {badge.description}
                      </p>
                      <p className={`text-xs mt-1 ${badge.earned ? 'text-crypto-green' : 'text-gray-500'}`}>
                        {badge.earned ? '✓ Earned' : badge.requirement}
                      </p>
                    </div>
                    
                    {badge.earned && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-crypto-green rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </Card>

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

            <div className="space-y-6">
              {mockStakingPools.map((pool, index) => {
                // Different color schemes for each pool
                const colorSchemes = [
                  {
                    gradient: 'from-blue-500/20 to-cyan-500/20',
                    hoverGradient: 'hover:from-blue-500/30 hover:to-cyan-500/30',
                    border: 'border-blue-500/50',
                    icon: 'from-blue-500 to-cyan-500',
                    badge: 'bg-blue-500/20 text-blue-300'
                  },
                  {
                    gradient: 'from-emerald-500/20 to-teal-500/20',
                    hoverGradient: 'hover:from-emerald-500/30 hover:to-teal-500/30',
                    border: 'border-emerald-500/50',
                    icon: 'from-emerald-500 to-teal-500',
                    badge: 'bg-emerald-500/20 text-emerald-300'
                  },
                  {
                    gradient: 'from-purple-500/20 to-pink-500/20',
                    hoverGradient: 'hover:from-purple-500/30 hover:to-pink-500/30',
                    border: 'border-purple-500/50',
                    icon: 'from-purple-500 to-pink-500',
                    badge: 'bg-purple-500/20 text-purple-300'
                  },
                  {
                    gradient: 'from-amber-500/20 to-orange-500/20',
                    hoverGradient: 'hover:from-amber-500/30 hover:to-orange-500/30',
                    border: 'border-amber-500/50',
                    icon: 'from-amber-500 to-orange-500',
                    badge: 'bg-amber-500/20 text-amber-300'
                  }
                ];
                const scheme = colorSchemes[index % colorSchemes.length];
                const poolAchievements = getPoolAchievements(pool.id, pool.userStaked, 45); // Mock 45 days staking
                
                const isExpanded = expandedPools.has(pool.id);
                
                return (
                <Card key={pool.id} className={`border ${scheme.border} bg-gradient-to-r ${scheme.gradient} ${scheme.hoverGradient} transition-all duration-300 backdrop-blur-sm overflow-hidden`}>
                  <div 
                    className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => togglePoolExpansion(pool.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${scheme.icon} rounded-full flex items-center justify-center shadow-lg`}>
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{pool.name}</h3>
                            <Badge className={`${scheme.badge} border-0 font-semibold shadow-sm`}>
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
                      
                      <div className="flex items-center justify-between">
                        {/* Center: Pool Achievements - Using same alignment logic as liquidity positions */}
                        <div className="flex items-center space-x-6">
                          <div className="text-center min-w-[280px]">
                            {/* Empty spacer to push achievements to center */}
                          </div>
                          <div className="flex items-center space-x-3 min-w-[240px]">
                            <Award className="w-4 h-4 text-crypto-gold" />
                            <span className="text-sm text-crypto-gold">Pool Achievements</span>
                            {poolAchievements.map((achievement) => {
                              const AchievementIcon = achievement.icon;
                              return (
                                <div 
                                  key={achievement.id}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                    achievement.earned
                                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                      : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                                  }`}
                                >
                                  <AchievementIcon className="w-4 h-4" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Right: Staked Amount + Expand */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right min-w-[120px]">
                            <div className="text-lg font-semibold">
                              {formatNumber(pool.userStaked)} {pool.tokenSymbol}
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatNumber(pool.userRewards)} rewards
                            </div>
                          </div>
                          
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-6 bg-black/20">
                      {/* Pool Achievements */}
                      {poolAchievements.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Award className="w-4 h-4 text-crypto-gold" />
                            <span className="text-sm font-medium text-crypto-gold">Pool Achievements</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {poolAchievements.map((achievement) => {
                              const AchievementIcon = achievement.icon;
                              return (
                                <div 
                                  key={achievement.id}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${
                                    achievement.earned
                                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                      : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                                  }`}
                                >
                                  <AchievementIcon className="w-3 h-3" />
                                  <span>{achievement.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                  <Separator className="my-4 bg-white/20" />

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
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
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
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
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
                          <div className="bg-black/30 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
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
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
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
                    </div>
                  )}
                </Card>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Staking;