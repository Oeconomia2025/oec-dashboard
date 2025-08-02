import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { TokenOverview } from "@/components/token-overview";
import { PriceChart } from "@/components/price-chart";
import { TokenInfoPanel } from "@/components/token-info-panel";
import { TransactionsTable } from "@/components/transactions-table";
import { HolderStatistics } from "@/components/holder-statistics";
import { QuickActions } from "@/components/quick-actions";
import { useTokenData } from "@/hooks/use-token-data";
import { TONE_TOKEN_CONFIG } from "@shared/schema";
import { Layout } from "@/components/layout";

export default function Dashboard() {
  const [contractAddress, setContractAddress] = useState(TONE_TOKEN_CONFIG.contractAddress);
  const [inputAddress, setInputAddress] = useState(contractAddress);
  
  const { data: tokenData, isLoading } = useTokenData(contractAddress);

  const handleAddressUpdate = () => {
    if (inputAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setContractAddress(inputAddress);
    }
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
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
    </Layout>
  );
}