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
  const [showAllWallets, setShowAllWallets] = useState(false)
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

  // Define preferred wallet order and limit
  const preferredWallets = ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet']
  
  // Helper function to get unique, valid connectors
  const getUniqueValidConnectors = () => {
    const validConnectors = connectors.filter(c => 
      c.name && 
      c.name.trim() !== '' && 
      c.name !== 'undefined'
    )
    
    // Remove duplicates by name (keep first occurrence)
    return validConnectors.filter((connector, index, arr) => 
      arr.findIndex(c => c.name === connector.name) === index
    )
  }
  
  const getDisplayedConnectors = () => {
    const uniqueConnectors = getUniqueValidConnectors()
    
    if (showAllWallets) {
      return uniqueConnectors
    }
    
    const preferred = uniqueConnectors.filter(c => preferredWallets.includes(c.name))
    const others = uniqueConnectors.filter(c => !preferredWallets.includes(c.name))
    
    // Show first 6 preferred wallets, fill remaining with others if needed
    return [...preferred, ...others].slice(0, 6)
  }

  const allUniqueConnectors = getUniqueValidConnectors()
  const displayedConnectors = getDisplayedConnectors()
  const hasMoreWallets = displayedConnectors.length < allUniqueConnectors.length

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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:text-white border-blue-500 hover:border-blue-400 border-2 shadow-lg transition-all duration-200 font-medium"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-[var(--crypto-card)] to-[var(--crypto-dark)] border-crypto-blue/20 shadow-xl max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-crypto-blue to-purple-400 bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect to the Oeconomia dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {displayedConnectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              onClick={() => {
                connect({ connector })
                setIsOpen(false)
              }}
              disabled={isPending}
              className="flex-col justify-center items-center h-14 w-full border-gray-700 hover:border-crypto-blue/50 hover:bg-crypto-blue/5 transition-all duration-200 group p-1 bg-white/95 hover:bg-white"
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  <WalletIcon wallet={connector.name} className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/10 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-200"></div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-800 group-hover:text-gray-900 text-xs leading-tight">
                    {connector.name === 'WalletConnect' 
                      ? 'WalletConnect'
                      : connector.name
                          .replace(' Wallet', '')
                          .replace('Wallet', '')
                          .trim()}
                  </div>
                </div>
              </div>
            </Button>
          ))}
          
          {hasMoreWallets && !showAllWallets && (
            <Button
              variant="ghost"
              onClick={() => setShowAllWallets(true)}
              className="col-span-3 w-full text-xs text-gray-400 hover:text-gray-300"
            >
              Other Wallets ({allUniqueConnectors.length - displayedConnectors.length})
            </Button>
          )}
        </div>
        
        {showAllWallets && (
          <div className="mt-3">
            <Button
              variant="ghost"
              onClick={() => setShowAllWallets(false)}
              className="w-full text-xs text-gray-400 hover:text-gray-300"
            >
              Show Less
            </Button>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-gradient-to-r from-[var(--crypto-dark)] to-gray-900/50 rounded-xl border border-gray-700/50">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            🔒 Secure connection to BSC network<br/>
            Supports all major EVM wallets including MetaMask, Trust, Rabby, and more
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}