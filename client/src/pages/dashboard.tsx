import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Activity, 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Users, 
  Bell,
  Menu,
  X,
  Lock,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { TokenOverview } from "@/components/token-overview";
import { PriceChart } from "@/components/price-chart";
import { TokenInfoPanel } from "@/components/token-info-panel";
import { TransactionsTable } from "@/components/transactions-table";
import { HolderStatistics } from "@/components/holder-statistics";
import { QuickActions } from "@/components/quick-actions";
import { WalletConnect } from "@/components/wallet-connect";
import { useTokenData } from "@/hooks/use-token-data";
import { TONE_TOKEN_CONFIG } from "@shared/schema";

export default function Dashboard() {
  const [contractAddress, setContractAddress] = useState(TONE_TOKEN_CONFIG.contractAddress);
  const [inputAddress, setInputAddress] = useState(contractAddress);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { data: tokenData, isLoading } = useTokenData(contractAddress);

  const handleAddressUpdate = () => {
    if (inputAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setContractAddress(inputAddress);
    }
  };

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Analytics', active: false },
    { icon: Wallet, label: 'Portfolio', active: false },
    { icon: Users, label: 'Holders', active: false },
    { icon: Lock, label: 'Staking', active: false },
    { icon: Zap, label: 'DeFi', active: false },
    { icon: Bell, label: 'Alerts', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--crypto-dark)] text-white flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-48'} bg-[var(--crypto-card)] border-r border-[var(--crypto-border)] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="sticky top-0 z-10 bg-[var(--crypto-card)] flex items-center justify-between h-16 px-4 border-b border-[var(--crypto-border)]">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/oec-logo.png" 
                alt="Oeconomia Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-bold">Oeconomia</h2>
                <p className="text-xs text-gray-400">OEC Dashboard</p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="sticky top-16 bg-[var(--crypto-card)] z-10 border-b border-[var(--crypto-border)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button 
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg text-left transition-colors group relative ${
                      item.active 
                        ? 'bg-crypto-blue text-black font-medium' 
                        : 'text-gray-400 hover:text-white hover:bg-[var(--crypto-dark)]'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--crypto-dark)] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <WalletConnect />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}





      {/* Main Content */}
      <div className="flex-1 lg:ml-0 relative">
        {/* Sticky Header Navigation */}
        <header className="sticky top-0 z-30 bg-[var(--crypto-card)] border-b border-[var(--crypto-border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Token Dashboard</h1>
                <p className="text-gray-400 text-sm">Real-time OEC analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-crypto-green/20 text-crypto-green border-crypto-green/30">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>



        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Token Overview Cards */}
        <TokenOverview tokenData={tokenData} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <PriceChart contractAddress={contractAddress} />

          {/* Token Information Panel */}
          <TokenInfoPanel tokenData={tokenData} isLoading={isLoading} />
        </div>

        {/* Recent Transactions Table */}
        <TransactionsTable contractAddress={contractAddress} />

        {/* Holder Statistics */}
        <HolderStatistics contractAddress={contractAddress} tokenData={tokenData} />

        {/* Quick Actions */}
        <QuickActions contractAddress={contractAddress} />

        {/* Contract Address Input - Admin Section */}
        <Card className="crypto-card p-4 mt-8 border border-dashed border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-gray-400 text-sm mb-2 block">Admin: Update Token Contract Address</label>
              <Input
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="0x..."
                className="bg-[var(--crypto-dark)] border-[var(--crypto-border)] text-white"
              />
            </div>
            <Button 
              onClick={handleAddressUpdate}
              className="mt-6 bg-crypto-blue hover:bg-crypto-blue/80"
            >
              Update
            </Button>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
