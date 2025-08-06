# replit.md

## Overview
This project is a cryptocurrency token dashboard application for the "Oeconomia" (OEC) token on the BSC (Binance Smart Chain) network. Its purpose is to provide comprehensive token analytics, real-time price tracking, holder statistics, transaction monitoring, and integration with popular DeFi platforms like PancakeSwap. The business vision is to create a professional trading interface with intuitive controls, transparent fee disclosure, industry-standard layout, and optimal screen space utilization, making it an essential tool for OEC token holders and traders.

**Current Status (August 2025)**: Dashboard converted from USD to ETH denomination as placeholder for future OEC token integration. All price displays, market data, and portfolio values now show clean numerical ETH amounts without redundant ticker symbols. Successfully implemented Moralis as primary real-time BSC data source with intelligent fallback system for API rate limits, providing authentic blockchain data with optimized polling intervals (5-minute token data, 2-minute transactions, 1-minute network status). **Token System Complete**: Expanded token list to 10 major BSC tokens (USDT, WBNB, ETH, USDC, BTCB, CAKE, DAI, BUSD, LINK, ADA) with individual token logos from CoinMarketCap. Fixed routing system so each token correctly navigates to its own detail page. Added token logos and website links to navigation header for professional presentation. Implemented graceful handling of Moralis API limits with known token data fallback. Added seamless navigation buttons: "Add Liquidity" on token detail pages and "Go to Swap" in liquidity positions section for improved user flow between DeFi features. Enhanced table interactions with prominent hover effects (40% gray backgrounds, colored borders, shadows) for better user feedback on pools and tokens tables. **Lending Platform Complete**: Implemented comprehensive three-tab lending interface (Deposit, Repay, Redemptions) with full ALUD token integration using hosted logo (https://pub-37d61a7eb7ae45898b46702664710cb2.r2.dev/ALUD.png). Added interactive "Your Positions" sidebar with direct navigation - "Repay" buttons switch to Repay tab with specific position pre-selected, "Add Collateral" buttons switch to Deposit tab with collateral token pre-selected for seamless user experience. **UI Polish Complete (August 2025)**: Standardized all token selector card alignment across lending tabs with center-aligned content, consistent px-4 py-2 padding, and uniform min-w-[140px] width. Added comprehensive Pools tab with Stability Pool (ALUD deposits, 12.5% APY) and ALUR staking (8.7% APY) functionality using correct hosted ALUR logo. Removed chevron from Redemption token selector for cleaner static display. All percentage buttons properly calculate amounts across Deposit, Repay, Redemption, and Pools sections. **Live Coin Watch Integration Complete**: Fully integrated Live Coin Watch API with Neon PostgreSQL database persistence, featuring 30-second automated data sync for top 100 cryptocurrencies, comprehensive practice page at /live-coin-watch with real-time display, service status monitoring, and clickable token rows that navigate to BSC token detail pages for supported coins. **Dynamic Token System Complete (August 2025)**: Created comprehensive dynamic token routing system supporting all Live Coin Watch database tokens. Added new API endpoint `/api/live-coin-watch/token/:code` for real-time individual token data with full TokenData compatibility. Built dynamic token detail pages at `/coin/:code` route with extended performance metrics (1-hour, 7-day, 30-day, yearly changes), professional token logos from CoinMarketCap, official website links, and BSC contract address mapping. Updated Live Coin Watch page so all cryptocurrency rows are now clickable and navigate to detailed token information pages. **Pools Page Integration Complete**: Replaced static token data in Pools page with real-time Live Coin Watch data, featuring proper market cap sorting (BTC #1, DOGE #10), 15-second refresh intervals, and clickable navigation to dynamic token detail pages. API usage optimized at ~2,880 calls/day well within the 10,000 free daily limit. **Logo and Name Cleaning Enhancement (August 2025)**: Implemented comprehensive cryptocurrency logo mapping for 100+ tokens with CoinMarketCap official logos, created centralized crypto utilities with automatic name/code cleaning (removes underscores, fixes formatting), and enhanced all token displays across Pools, Live Coin Watch, and dynamic token detail pages with proper logos and cleaned names for professional presentation. **BSCScan Integration Removed (August 2025)**: Completely removed BSCScan API dependency to eliminate conflicts with other connection integrations. Cleaned up all BSCScan service files, imports, and references across server routes, Netlify functions, and client components. Maintained block explorer links for transaction viewing while making the system more flexible for alternative data sources. **Token Detail Page Redesign Complete (August 2025)**: Completely redesigned token detail pages with streamlined 5-card statistics layout (Current Price, 24h Volume, Market Cap, Circulating Supply, Total Supply), removed redundant token info card and all icons for clean minimalist design, replaced "Live Data" badge with functional "Copy Address" and "Add Liquidity" buttons in header, and integrated authentic cryptocurrency supply data from database instead of placeholder zeros for all major tokens including BTC (21M total, 19.8M circulating), ETH (120.3M), USDT (119B), and others. **Dynamic Chart Colors Complete (August 2025)**: Implemented comprehensive token-specific color mapping system with authentic brand colors for 70+ cryptocurrencies (Bitcoin orange #F7931A, Ethereum blue #627EEA, Tether green #26A17B, Solana purple #9945FF, etc.). Price charts now dynamically display each token's unique brand color with matching gradient effects and active dots, replacing the uniform green charts across all token detail pages, dashboard, and chart components.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Values polished, professional appearance with attention to detail. Prefers centered, sticky elements for important features like alerts and notices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Custom components built with Radix UI primitives and shadcn/ui
- **Styling**: Tailwind CSS with custom crypto-themed design system, utilizing custom gradient color schemes for visual distinction (e.g., cyan-to-magenta for active elements, distinct gradients for staking pools).
- **Build Tool**: Vite
- **UI/UX Decisions**:
    - Professional UI/UX improvements for swap functionality including percentage buttons, highlighted calculation sections with gradient styling, and standardized fee structures.
    - Dynamic page titles and descriptions in the top navigation header for context-aware headers.
    - Unified design system with consistent branding, incorporating a custom gradient for active navigation and wallet buttons.
    - Comprehensive staking interface with distinct gradient color schemes for different pool options.
    - Interactive ROI Calculator and Achievement system with collapsible interfaces and enhanced toggle styling.
    - Clear visual distinction between different DeFi position types (pools vs. farms) using distinct color schemes.
    - One-time popup modal for new visitors warning about DApp development status.
    - Advanced chart interface with responsive 50/50 layout, collapsible sidebar, token-specific color mapping, and area chart with dramatic gradient fade effects (August 2025).

### Backend Architecture
- **Runtime**: Node.js with Express.js server (converted to Netlify serverless functions for production)
- **Language**: TypeScript
- **API Design**: REST API with structured endpoints for token data, transactions, and network status.
- **External API Integration**: Multiple crypto data sources (Live Coin Watch, CoinGecko, PancakeSwap, Moralis).
- **Deployment**: Netlify for static site and serverless function deployment. Build configuration adapted for Netlify's environment.

### Data Storage
- **Database ORM**: Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL-based session storage
- **Data Persistence**: Persistent storage for tracked tokens, historical snapshots, user watchlists, and price alerts.

### System Design Choices
- Focus on real-time data with automatic polling (15-60 second intervals).
- Modular design for extensibility with additional crypto data sources and features.
- Robust error handling with graceful API failure management and app-wide error boundaries.
- State locking mechanism and localStorage persistence for consistent sidebar navigation across pages.

## External Dependencies

### Crypto Data Sources
- **Live Coin Watch API**: Real-time cryptocurrency market data with database persistence. FREE tier provides 10,000 requests/day with 2-second updates. Current usage: ~2,880 calls/day (29% of quota, supports 100 coins per sync).
- **CoinGecko API**: Market data and token information.
- **PancakeSwap API**: DEX trading data and liquidity information.
- **Moralis API**: BSC blockchain data and token analytics.

### UI Libraries
- **Radix UI**: Accessible component primitives.
- **Recharts**: Interactive charting library.
- **Lucide Icons**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.

### Development Tools
- **Vite**: Build tool.
- **TypeScript**: Type safety across the stack.
- **ESBuild**: Fast bundling for production server code.