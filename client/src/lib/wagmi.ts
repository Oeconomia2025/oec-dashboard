import { http, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect, injected } from 'wagmi/connectors'

// WalletConnect project ID - users can get this from https://cloud.walletconnect.com/
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Oeconomia Dashboard',
        description: 'Comprehensive cryptocurrency dashboard for OEC token tracking',
        url: 'https://oeconomia.app',
        icons: ['https://oeconomia.app/icon.png']
      }
    }),
    coinbaseWallet({
      appName: 'Oeconomia Dashboard',
    }),
    injected({
      target: {
        id: 'trust',
        name: 'Trust Wallet',
        provider: (window) => window?.trustWallet,
      },
    }),
    injected({
      target: {
        id: 'rabby',
        name: 'Rabby Wallet',
        provider: (window) => window?.rabby,
      },
    }),
    injected({
      target: {
        id: 'okx',
        name: 'OKX Wallet', 
        provider: (window) => window?.okxwallet,
      },
    }),
    injected({
      target: {
        id: 'binance',
        name: 'Binance Wallet',
        provider: (window) => window?.BinanceChain,
      },
    }),
    injected({
      target: {
        id: 'phantom',
        name: 'Phantom Wallet',
        provider: (window) => window?.phantom?.ethereum,
      },
    }),
    injected({
      target: {
        id: 'safe',
        name: 'Safe Wallet',
        provider: (window) => window?.safe,
      },
    }),
    // Generic injected for any other EVM wallets
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}