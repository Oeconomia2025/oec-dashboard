import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { DisclaimerModal } from "@/components/disclaimer-modal";
import { liveCoinWatchSyncService } from "@/services/live-coin-watch-sync";
import Dashboard from "@/pages/dashboard";
import { Portfolio } from "@/pages/portfolio";
import Analytics from "@/pages/analytics";
import Swap from "@/pages/swap";
import Liquidity from "@/pages/liquidity";
import Lend from "@/pages/lend";
import TokenDetail from "@/pages/token-detail";
import TokenDetailDynamic from "@/pages/token-detail-dynamic";
import Staking from "@/pages/staking";
import Governance from "@/pages/governance";
import Learn from "@/pages/learn";
import LiveCoinWatch from "@/pages/live-coin-watch";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/swap" component={Swap} />
      <Route path="/liquidity" component={Liquidity} />
      <Route path="/lend" component={Lend} />
      <Route path="/token/:id" component={TokenDetail} />
      <Route path="/coin/:code" component={TokenDetailDynamic} />
      <Route path="/staking" component={Staking} />
      <Route path="/governance" component={Governance} />
      <Route path="/learn" component={Learn} />
      <Route path="/live-coin-watch" component={LiveCoinWatch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize Live Coin Watch sync for production environment
    liveCoinWatchSyncService.initializeProductionSync().catch(error => {
      console.warn('Could not initialize production sync:', error);
    });

    // Cleanup on unmount
    return () => {
      liveCoinWatchSyncService.stopSync();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <DisclaimerModal />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
