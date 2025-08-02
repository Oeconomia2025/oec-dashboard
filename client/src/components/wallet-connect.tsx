import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { WalletIcon } from './wallet-icons'

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
      <Card className="bg-gradient-to-br from-[var(--crypto-card)] to-[var(--crypto-dark)] border-crypto-blue/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-crypto-blue flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Connected Wallet
          </CardTitle>
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
            className="w-full mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300"
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
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-crypto-blue/20 to-purple-500/20 border-crypto-blue/30 hover:from-crypto-blue/30 hover:to-purple-500/30 text-white hover:text-white transition-all duration-200"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-[var(--crypto-card)] to-[var(--crypto-dark)] border-crypto-blue/20 shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-crypto-blue to-purple-400 bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect to the Oeconomia dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 mt-6">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              onClick={() => {
                connect({ connector })
                setIsOpen(false)
              }}
              disabled={isPending}
              className="justify-start h-16 border-gray-700 hover:border-crypto-blue/50 hover:bg-crypto-blue/5 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="relative">
                  <WalletIcon wallet={connector.name} className="w-10 h-10" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/10 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-200"></div>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">{connector.name}</div>
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
        
        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--crypto-dark)] to-gray-900/50 rounded-xl border border-gray-700/50">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            🔒 Secure connection to BSC network<br/>
            Supports all major EVM wallets including MetaMask, Trust, Rabby, and more
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}