import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  
  const { data: balance } = useBalance({
    address,
  })

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openInExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, '_blank')
      }
    }
  }

  if (isConnected && address) {
    return (
      <Card className="bg-[var(--crypto-card)] border-[var(--crypto-border)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">Connected Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-crypto-blue" />
              <span className="text-sm font-mono">{formatAddress(address)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openInExplorer}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {balance && (
            <div className="text-sm">
              <span className="text-gray-400">Balance: </span>
              <span className="font-medium">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            </div>
          )}
          
          {chain && (
            <div className="text-sm">
              <span className="text-gray-400">Network: </span>
              <span className="font-medium">{chain.name}</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
            className="w-full mt-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--crypto-card)] border-[var(--crypto-border)]">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect to the Oeconomia dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 mt-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              onClick={() => {
                connect({ connector })
                setIsOpen(false)
              }}
              disabled={isPending}
              className="justify-start h-12"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-crypto-blue/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-crypto-blue" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{connector.name}</div>
                  <div className="text-xs text-gray-400">
                    {connector.name === 'MetaMask' && 'Browser extension wallet'}
                    {connector.name === 'Coinbase Wallet' && 'Coinbase wallet app'}
                    {connector.name === 'WalletConnect' && 'Scan with mobile wallet'}
                    {connector.name === 'Trust Wallet' && 'Mobile & browser wallet'}
                    {connector.name === 'Rabby Wallet' && 'Multi-chain browser wallet'}
                    {connector.name === 'OKX Wallet' && 'OKX exchange wallet'}
                    {connector.name === 'Binance Wallet' && 'Binance Chain wallet'}
                    {connector.name === 'Phantom Wallet' && 'Multi-chain wallet'}
                    {connector.name === 'Safe Wallet' && 'Multi-sig smart wallet'}
                    {connector.name === 'Injected' && 'Browser wallet extension'}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-[var(--crypto-dark)] rounded-lg">
          <p className="text-xs text-gray-400">
            Supports MetaMask, Trust Wallet, Rabby, WalletConnect, Coinbase, OKX, Binance, Phantom, Safe, and other EVM wallets.
            Only connect wallets you trust with this application.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}