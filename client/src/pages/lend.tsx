import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import { 
  DollarSign, 
  Settings, 
  Info, 
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calculator,
  Lock,
  Unlock,
  Coins
} from "lucide-react";

interface CollateralToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  price: number;
  balance?: number;
}

interface LendingPosition {
  id: string;
  collateralToken: CollateralToken;
  collateralAmount: number;
  collateralValue: number;
  borrowedAmount: number;
  collateralizationRatio: number;
  liquidationPrice: number;
  interestRate: number;
  isActive: boolean;
}

function LendContent() {
  const { toast } = useToast();
  const [collateralToken, setCollateralToken] = useState<CollateralToken | null>(null);
  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [lastEditedField, setLastEditedField] = useState<'collateral' | 'borrow'>('collateral');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Deposit");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const [collateralizationRatio, setCollateralizationRatio] = useState(150);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [maxBorrowAmount, setMaxBorrowAmount] = useState(0);
  const [positions, setPositions] = useState<LendingPosition[]>([]);

  // Available collateral tokens
  const collateralTokens: CollateralToken[] = [
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      logo: "https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
      price: 67340.00,
      balance: 0.15234
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logo: "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
      price: 645.20,
      balance: 5.432
    },
    {
      symbol: "WETH",
      name: "Wrapped Ethereum",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      decimals: 18,
      logo: "https://tokens.1inch.io/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png",
      price: 3420.50,
      balance: 2.847
    }
  ];

  // Mock existing positions
  useEffect(() => {
    setPositions([
      {
        id: "1",
        collateralToken: collateralTokens[0],
        collateralAmount: 0.05,
        collateralValue: 3367.00,
        borrowedAmount: 2450.00,
        collateralizationRatio: 137.5,
        liquidationPrice: 59000.00,
        interestRate: 3.2,
        isActive: true
      }
    ]);
  }, []);

  // Calculate values when inputs change
  useEffect(() => {
    if (collateralToken && collateralAmount) {
      const collateralValue = parseFloat(collateralAmount) * collateralToken.price;
      const maxBorrow = collateralValue / 1.10; // 110% collateralization minimum
      setMaxBorrowAmount(maxBorrow);
      
      if (lastEditedField === 'collateral') {
        const borrowValue = collateralValue / (collateralizationRatio / 100);
        setBorrowAmount(borrowValue > 0 ? borrowValue.toFixed(2) : "");
      } else if (lastEditedField === 'borrow' && borrowAmount) {
        const borrowValue = parseFloat(borrowAmount);
        const requiredRatio = (collateralValue / borrowValue) * 100;
        setCollateralizationRatio(Math.max(110, requiredRatio));
      }
      
      // Calculate liquidation price
      if (borrowAmount) {
        const liquidationPrice = (parseFloat(borrowAmount) * 1.10) / parseFloat(collateralAmount);
        setLiquidationPrice(liquidationPrice);
      }
    }
  }, [collateralAmount, borrowAmount, collateralToken, lastEditedField, collateralizationRatio]);

  const handleCollateralAmountChange = (value: string) => {
    setCollateralAmount(value);
    setLastEditedField('collateral');
  };

  const handleBorrowAmountChange = (value: string) => {
    setBorrowAmount(value);
    setLastEditedField('borrow');
  };

  const handlePercentageClick = (percentage: number) => {
    if (collateralToken?.balance) {
      const amount = (collateralToken.balance * percentage / 100).toFixed(6);
      setCollateralAmount(amount);
      setLastEditedField('collateral');
    }
  };

  const handleDeposit = async () => {
    if (!collateralToken || !collateralAmount || !borrowAmount) {
      toast({
        title: "Missing Information",
        description: "Please select collateral token and enter amounts.",
        variant: "destructive",
      });
      return;
    }

    if (collateralizationRatio < 110) {
      toast({
        title: "Insufficient Collateralization",
        description: "Collateralization ratio must be at least 110%.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Position Created",
        description: `Successfully deposited ${collateralAmount} ${collateralToken.symbol} and borrowed ${borrowAmount} ALUD.`,
      });
      
      // Add to positions
      const newPosition: LendingPosition = {
        id: Date.now().toString(),
        collateralToken,
        collateralAmount: parseFloat(collateralAmount),
        collateralValue: parseFloat(collateralAmount) * collateralToken.price,
        borrowedAmount: parseFloat(borrowAmount),
        collateralizationRatio,
        liquidationPrice,
        interestRate: 3.2,
        isActive: true
      };
      
      setPositions(prev => [...prev, newPosition]);
      
      // Reset form
      setCollateralAmount("");
      setBorrowAmount("");
      setCollateralizationRatio(150);
    }, 2000);
  };

  const openTokenModal = () => {
    setTokenSearchQuery("");
    setIsTokenModalOpen(true);
  };

  const selectToken = (token: CollateralToken) => {
    setCollateralToken(token);
    setIsTokenModalOpen(false);
  };

  const filteredTokens = collateralTokens.filter(token =>
    token.symbol.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(tokenSearchQuery.toLowerCase())
  );

  const getRatioColor = (ratio: number) => {
    if (ratio < 120) return "text-red-400";
    if (ratio < 150) return "text-yellow-400";
    return "text-green-400";
  };

  const getRatioBackground = (ratio: number) => {
    if (ratio < 120) return "bg-red-500/20";
    if (ratio < 150) return "bg-yellow-500/20";
    return "bg-green-500/20";
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Lend</h1>
            <p className="text-muted-foreground">Deposit collateral and borrow ALUD (Alluria USD)</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Lending Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              {["Deposit", "Repay", "Withdraw"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Deposit Tab */}
            {activeTab === "Deposit" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Create Lending Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Collateral Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Collateral</label>
                      {collateralToken?.balance && (
                        <span className="text-sm text-muted-foreground">
                          Balance: {collateralToken.balance.toFixed(6)} {collateralToken.symbol}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="0.0"
                          value={collateralAmount}
                          onChange={(e) => handleCollateralAmountChange(e.target.value)}
                          className="text-lg h-12"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={openTokenModal}
                        className="h-12 px-4 min-w-[140px]"
                      >
                        {collateralToken ? (
                          <div className="flex items-center space-x-2">
                            <img 
                              src={collateralToken.logo} 
                              alt={collateralToken.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{collateralToken.symbol}</span>
                          </div>
                        ) : (
                          "Select Token"
                        )}
                      </Button>
                    </div>

                    {/* Percentage Buttons */}
                    {collateralToken?.balance && (
                      <div className="flex space-x-2">
                        {[25, 50, 75, 100].map((percentage) => (
                          <Button
                            key={percentage}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePercentageClick(percentage)}
                            className="text-xs"
                          >
                            {percentage}%
                          </Button>
                        ))}
                      </div>
                    )}

                    {collateralToken && collateralAmount && (
                      <div className="text-sm text-muted-foreground">
                        ≈ ${(parseFloat(collateralAmount) * collateralToken.price).toFixed(2)} USD
                      </div>
                    )}
                  </div>

                  {/* Borrow Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Borrow ALUD</label>
                      <span className="text-sm text-muted-foreground">
                        Max: ${maxBorrowAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="0.0"
                          value={borrowAmount}
                          onChange={(e) => handleBorrowAmountChange(e.target.value)}
                          className="text-lg h-12"
                        />
                      </div>
                      <div className="flex items-center h-12 px-4 bg-muted rounded-md min-w-[140px]">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-6 h-6 text-green-400" />
                          <span>ALUD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collateralization Ratio */}
                  {collateralAmount && borrowAmount && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Collateralization Ratio</span>
                        <span className={`text-sm font-bold ${getRatioColor(collateralizationRatio)}`}>
                          {collateralizationRatio.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(collateralizationRatio, 300)} 
                        max={300}
                        className="h-2"
                      />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-red-400">
                          <div>Danger</div>
                          <div>&lt;120%</div>
                        </div>
                        <div className="text-yellow-400">
                          <div>Warning</div>
                          <div>120-150%</div>
                        </div>
                        <div className="text-green-400">
                          <div>Safe</div>
                          <div>&gt;150%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Liquidation Price */}
                  {liquidationPrice > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium">Liquidation Price</span>
                      </div>
                      <span className="text-sm font-bold text-red-400">
                        ${liquidationPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Transaction Details */}
                  {collateralAmount && borrowAmount && (
                    <div className="space-y-3 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">Transaction Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Interest Rate</span>
                          <span>3.2% APR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collateral Value</span>
                          <span>${collateralToken ? (parseFloat(collateralAmount) * collateralToken.price).toFixed(2) : '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Borrowing</span>
                          <span>{borrowAmount} ALUD</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Health Factor</span>
                          <span className={getRatioColor(collateralizationRatio)}>
                            {(collateralizationRatio / 110).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleDeposit}
                    disabled={!collateralToken || !collateralAmount || !borrowAmount || collateralizationRatio < 110 || isLoading}
                    className="w-full h-12 text-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Creating Position...</span>
                      </div>
                    ) : (
                      "Create Lending Position"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Repay and Withdraw tabs placeholder */}
            {(activeTab === "Repay" || activeTab === "Withdraw") && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{activeTab} Position</h3>
                    <p className="text-muted-foreground">Select a position from the sidebar to {activeTab.toLowerCase()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Positions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No active positions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div
                        key={position.id}
                        className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={position.collateralToken.logo} 
                              alt={position.collateralToken.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="font-medium">{position.collateralToken.symbol}</span>
                          </div>
                          <Badge variant={position.collateralizationRatio > 150 ? "default" : position.collateralizationRatio > 120 ? "secondary" : "destructive"}>
                            {position.collateralizationRatio.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Collateral</span>
                            <span>{position.collateralAmount} {position.collateralToken.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Borrowed</span>
                            <span>{position.borrowedAmount.toFixed(2)} ALUD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Liquidation</span>
                            <span className="text-orange-400">${position.liquidationPrice.toFixed(0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Repay
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Add Collateral
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Protocol Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Protocol Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value Locked</span>
                    <span className="font-medium">$24.7M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ALUD Circulating</span>
                    <span className="font-medium">$18.2M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stability Pool</span>
                    <span className="font-medium">$6.5M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Rate</span>
                    <span className="font-medium text-green-400">3.2% APR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Token Selection Modal */}
        <Dialog open={isTokenModalOpen} onOpenChange={setIsTokenModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Collateral Token</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Search tokens..."
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
              />
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredTokens.map((token) => (
                  <button
                    key={token.address}
                    onClick={() => selectToken(token)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={token.logo} 
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${token.price.toLocaleString()}</div>
                      {token.balance && (
                        <div className="text-sm text-muted-foreground">{token.balance}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Modal */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lending Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Collateralization Ratio</label>
                <Select defaultValue="110">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="110">110% (Minimum)</SelectItem>
                    <SelectItem value="120">120% (Conservative)</SelectItem>
                    <SelectItem value="150">150% (Safe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto-Repay Threshold</label>
                <Select defaultValue="disabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="115">115%</SelectItem>
                    <SelectItem value="120">120%</SelectItem>
                    <SelectItem value="125">125%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function Lend() {
  return <LendContent />;
}