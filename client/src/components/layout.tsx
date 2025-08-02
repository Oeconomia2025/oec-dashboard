import { useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { WalletConnect } from "@/components/wallet-connect";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location, navigate] = useLocation();

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/', active: location === '/' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics', active: location === '/analytics' },
    { icon: Wallet, label: 'Portfolio', path: '/portfolio', active: location === '/portfolio' },
    { icon: Users, label: 'Holders', path: '/holders', active: location === '/holders' },
    { icon: Lock, label: 'Staking', path: '/staking', active: location === '/staking' },
    { icon: Zap, label: 'DeFi', path: '/defi', active: location === '/defi' },
    { icon: Bell, label: 'Alerts', path: '/alerts', active: location === '/alerts' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location === '/settings' },
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
                    onClick={() => navigate(item.path)}
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
          {/* Wallet moved to sticky header */}
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
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-crypto-green" />
                <span className="font-medium">Live</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="max-w-xs">
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}