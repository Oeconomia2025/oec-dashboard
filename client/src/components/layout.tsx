import { useState, ReactNode, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Settings, 
  Activity, 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  ArrowUpDown, 
  Bell,
  Menu,
  X,
  Lock,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Vote,
  MessageCircle,
  ExternalLink,
  Globe,
  BookOpen,
  MoreHorizontal,
  Droplets
} from "lucide-react";
import { SiX, SiMedium, SiYoutube, SiDiscord, SiGithub, SiTelegram } from "react-icons/si";
import { WalletConnect } from "@/components/wallet-connect";
import { useTheme } from "@/components/theme-provider";

interface LayoutProps {
  children: ReactNode;
}

// Page information for each route
const pageInfo = {
  '/': {
    title: 'Dashboard',
    description: 'Real-time overview of OEC token metrics and performance'
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Advanced market analysis and trading insights'
  },
  '/staking': {
    title: 'Staking',
    description: 'Earn rewards by staking your OEC tokens'
  },
  '/portfolio': {
    title: 'Portfolio',
    description: 'Track your DeFi positions and asset performance'
  },
  '/swap': {
    title: 'Token Swap',
    description: 'Trade tokens instantly on the Oeconomia ecosystem'
  },
  '/liquidity': {
    title: 'Liquidity Pools',
    description: 'Provide liquidity to earn fees and rewards'
  },
  '/governance': {
    title: 'Governance',
    description: 'Participate in decentralized decision-making and protocol governance'
  },
  '/learn': {
    title: 'Learn',
    description: 'Educational resources about Oeconomia ecosystem and blockchain technology'
  }
} as const;

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage to persist state across navigation
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });
  const [location, navigate] = useLocation();
  const isNavigatingRef = useRef(false);
  const lockedCollapsedStateRef = useRef<boolean | null>(null);
  
  // Get current page info
  const currentPageInfo = pageInfo[location as keyof typeof pageInfo] || pageInfo['/'];

  // Persist collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Monitor collapsed state changes and prevent unwanted expansion during navigation
  useEffect(() => {
    // If we have a locked state during navigation, enforce it immediately
    if (lockedCollapsedStateRef.current !== null && sidebarCollapsed !== lockedCollapsedStateRef.current) {
      console.log('Enforcing locked collapsed state:', lockedCollapsedStateRef.current);
      // Use multiple approaches to ensure the state sticks
      setSidebarCollapsed(lockedCollapsedStateRef.current);
      // Also update localStorage immediately
      localStorage.setItem('sidebar-collapsed', lockedCollapsedStateRef.current.toString());
      // Force a re-render in the next tick
      setTimeout(() => {
        if (lockedCollapsedStateRef.current !== null) {
          setSidebarCollapsed(lockedCollapsedStateRef.current);
        }
      }, 0);
    }
  }, [sidebarCollapsed]);

  // Clear navigation flag and unlock state when location changes
  useEffect(() => {
    if (isNavigatingRef.current) {
      setTimeout(() => {
        isNavigatingRef.current = false;
        lockedCollapsedStateRef.current = null; // Unlock the state
        console.log('Navigation completed, unlocking state');
      }, 100);
    }
  }, [location]);

  const handleNavigation = (path: string) => {
    // Store and lock the current collapsed state BEFORE any navigation
    const wasCollapsed = sidebarCollapsed;
    console.log('Navigation clicked, current collapsed state:', wasCollapsed);
    
    // On mobile, just navigate and close sidebar
    if (window.innerWidth < 1024) {
      navigate(path);
      setSidebarOpen(false);
      return;
    }
    
    // On desktop, prevent any state changes during navigation
    lockedCollapsedStateRef.current = wasCollapsed;
    isNavigatingRef.current = true;
    console.log('Locking collapsed state to:', wasCollapsed);
    
    // Force the current state to localStorage before navigation
    localStorage.setItem('sidebar-collapsed', wasCollapsed.toString());
    
    // Navigate to the path
    navigate(path);
    
    // Immediately after navigation, force the state back
    setTimeout(() => {
      console.log('Post-navigation: forcing state back to', wasCollapsed);
      setSidebarCollapsed(wasCollapsed);
      localStorage.setItem('sidebar-collapsed', wasCollapsed.toString());
    }, 1);
  };

  const toggleCollapsed = () => {
    isNavigatingRef.current = false; // Clear navigation flag
    const newState = !sidebarCollapsed;
    console.log('Toggle clicked, changing from', sidebarCollapsed, 'to', newState);
    setSidebarCollapsed(newState);
    // Immediately save to localStorage to prevent reset
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };

  // Debug: Monitor all state changes
  useEffect(() => {
    console.log('sidebarCollapsed state changed to:', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/', active: location === '/' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics', active: location === '/analytics' },
    { icon: Wallet, label: 'Portfolio', path: '/portfolio', active: location === '/portfolio' },
    { icon: ArrowUpDown, label: 'Swap', path: '/swap', active: location === '/swap' },
    { icon: Droplets, label: 'Pools', path: '/liquidity', active: location === '/liquidity' },
    { icon: Lock, label: 'Staking', path: '/staking', active: location === '/staking' },
    { icon: Vote, label: 'Governance', path: '/governance', active: location === '/governance' },
    { icon: BookOpen, label: 'Learn', path: '/learn', active: location === '/learn' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-48'} bg-gray-950 border-r border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-xl shadow-black/70`}>
        <div className="sticky top-0 z-10 bg-gray-950 flex items-center justify-between h-20 px-4 border-b border-gray-700">
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
              onClick={toggleCollapsed}
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
        
        <div className="sticky top-20 bg-gray-950 z-10 border-b border-gray-700">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg text-left transition-colors group relative ${
                      item.active 
                        ? 'text-white font-medium shadow-lg transition-all duration-200' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    style={item.active ? { background: 'linear-gradient(45deg, #00d4ff, #ff00ff)' } : {}}
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
        
        {/* Social Media Icons - Sticky at bottom */}
        <div className="sticky bottom-0 bg-gray-950 border-t border-gray-700 p-4">
          <div className={`flex ${sidebarCollapsed ? 'flex-col space-y-3' : 'flex-wrap gap-3'} justify-center`}>
            {/* Telegram - Placeholder */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-200 opacity-50 cursor-not-allowed"
              title="Telegram - Coming Soon"
              disabled
            >
              <SiTelegram className="w-5 h-5 text-gray-400" />
            </button>
            
            {/* Twitter/X */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
              title="Twitter/X"
              onClick={() => window.open('https://x.com/Oeconomia2025', '_blank')}
            >
              <SiX className="w-5 h-5 text-white group-hover:text-white" />
            </button>
            
            {/* Medium */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
              title="Medium"
              onClick={() => window.open('https://medium.com/@oeconomia2025', '_blank')}
            >
              <svg className="w-8 h-8 text-white group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6" cy="12" r="4"/>
                <ellipse cx="15" cy="12" rx="2.5" ry="4"/>
                <ellipse cx="21" cy="12" rx="1.5" ry="3"/>
              </svg>
            </button>
            
            {/* YouTube */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
              title="YouTube"
              onClick={() => window.open('https://www.youtube.com/@Oeconomia2025', '_blank')}
            >
              <SiYoutube className="w-5 h-5 text-white group-hover:text-white" />
            </button>
            
            {/* Discord */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
              title="Discord"
              onClick={() => window.open('https://discord.com/invite/XSgZgeVD', '_blank')}
            >
              <SiDiscord className="w-5 h-5 text-white group-hover:text-white" />
            </button>
            
            {/* GitHub */}
            <button
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
              title="GitHub"
              onClick={() => window.open('https://github.com/Oeconomia2025', '_blank')}
            >
              <SiGithub className="w-5 h-5 text-white group-hover:text-white" />
            </button>
          </div>
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
        <header className="sticky top-0 z-30 bg-gray-950 border-b border-gray-700 px-6 h-20 flex items-center shadow-xl shadow-black/70">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-white">{currentPageInfo.title}</h1>
                <p className="text-sm text-muted-foreground hidden md:block">{currentPageInfo.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="max-w-xs">
                <WalletConnect />
              </div>
              <button
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
                onClick={() => window.open('https://oeconomia.tech/', '_blank')}
                title="Visit Oeconomia Website"
              >
                <Globe className="w-5 h-5 text-white group-hover:text-white" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/settings')}
                className="p-2"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
          
          {/* Footer */}
          <footer className="border-t border-gray-700 mt-8 py-6 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Oeconomia. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}