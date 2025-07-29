import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Info, Zap } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { useNetworkStatus } from "@/hooks/use-token-data";
import { TONE_TOKEN_CONFIG } from "@shared/schema";
import type { TokenData, NetworkStatus } from "@shared/schema";

interface TokenInfoPanelProps {
  tokenData?: TokenData;
  isLoading: boolean;
}

export function TokenInfoPanel({ tokenData, isLoading }: TokenInfoPanelProps) {
  const { copyToClipboard } = useCopyToClipboard();
  const { data: networkStatus, isLoading: networkLoading } = useNetworkStatus();

  if (isLoading || networkLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="crypto-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const contractAddress = tokenData?.contractAddress || TONE_TOKEN_CONFIG.contractAddress;
  const operationsWallet = TONE_TOKEN_CONFIG.operationsWallet;

  return (
    <div className="space-y-6">
      {/* Contract Information */}
      <Card className="crypto-card p-6 border">
        <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Contract Address</label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="bg-[var(--crypto-dark)] px-3 py-2 rounded text-sm font-mono flex-1 text-white">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contractAddress)}
                className="text-crypto-blue hover:text-crypto-blue/80 p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Operations Wallet</label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="bg-[var(--crypto-dark)] px-3 py-2 rounded text-sm font-mono flex-1 text-white">
                {operationsWallet.slice(0, 6)}...{operationsWallet.slice(-3)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(operationsWallet)}
                className="text-crypto-blue hover:text-crypto-blue/80 p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-crypto-green">BSC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Decimals</span>
            <span>18</span>
          </div>
        </div>
      </Card>

      {/* Fee Structure */}
      <Card className="crypto-card p-6 border">
        <h3 className="text-lg font-semibold mb-4">Fee Structure</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Buy/Sell Fee</span>
            <span className="text-crypto-red">{TONE_TOKEN_CONFIG.buyFee}%</span>
          </div>
          <div className="bg-[var(--crypto-dark)] rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">→ Liquidity</span>
              <span className="text-crypto-blue">{TONE_TOKEN_CONFIG.liquidityFee}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">→ Operations</span>
              <span className="text-crypto-gold">{TONE_TOKEN_CONFIG.operationsFee}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Fees auto-convert to BNB/WBNB
          </div>
        </div>
      </Card>

      {/* Network Status */}
      <Card className="crypto-card p-6 border">
        <h3 className="text-lg font-semibold mb-4">BSC Network</h3>
        {networkStatus ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Price</span>
              <span className="text-crypto-green">{networkStatus.gasPrice} Gwei</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Block Number</span>
              <span>{networkStatus.blockNumber.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Health</span>
              <span className={`flex items-center gap-1 ${networkStatus.isHealthy ? 'text-crypto-green' : 'text-crypto-red'}`}>
                <div className={`w-2 h-2 rounded-full ${networkStatus.isHealthy ? 'bg-crypto-green' : 'bg-crypto-red'}`} />
                {networkStatus.isHealthy ? 'Healthy' : 'Issues'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4" />
              <span>Unable to fetch network status</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
