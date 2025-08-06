# replit.md

## Overview
This project is a cryptocurrency token dashboard for the "Oeconomia" (OEC) token on the Binance Smart Chain (BSC) network. Its purpose is to provide comprehensive token analytics, real-time price tracking, holder statistics, transaction monitoring, and integration with popular DeFi platforms like PancakeSwap. The business vision is to create a professional trading interface with intuitive controls, transparent fee disclosure, industry-standard layout, and optimal screen space utilization, making it an essential tool for OEC token holders and traders. Key capabilities include a dynamic token system supporting all major cryptocurrencies, a three-tab lending interface, and integrated real-time charting with dynamic, token-specific brand colors.

## User Preferences
Preferred communication style: Simple, everyday language. Appreciates precise visual consistency and polished UI design details.
UI/UX preferences: Values polished, professional appearance with attention to detail. Prefers centered, sticky elements for important features like alerts and notices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom components built with Radix UI primitives and shadcn/ui
- **Styling**: Tailwind CSS with custom crypto-themed design system, utilizing custom gradient color schemes.
- **Build Tool**: Vite
- **UI/UX Decisions**: Professional UI/UX for swap functionality, dynamic page titles, unified design system with consistent branding, comprehensive staking interface with distinct gradient color schemes, interactive ROI Calculator and Achievement system, clear visual distinction between DeFi position types, one-time popup modal for new visitors, and an advanced chart interface with responsive layout, collapsible sidebar, token-specific color mapping, and area chart with gradient fade effects.

### Backend Architecture
- **Runtime**: Node.js with Express.js server (converted to Netlify serverless functions for production)
- **Language**: TypeScript
- **API Design**: REST API with structured endpoints for token data, transactions, and network status.
- **Deployment**: Netlify for static site and serverless function deployment.

### Data Storage
- **Database ORM**: Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL-based session storage
- **Data Persistence**: Persistent storage for tracked tokens, historical snapshots, user watchlists, and price alerts.

### System Design Choices
- Focus on real-time data with automatic polling (15-60 second intervals).
- Modular design for extensibility.
- Robust error handling with graceful API failure management and app-wide error boundaries.
- State locking mechanism and localStorage persistence for consistent sidebar navigation.
- Dynamic token routing system supporting all database tokens.
- Comprehensive crypto logo mapping and name cleaning across all token displays.

## External Dependencies

### Crypto Data Sources
- **Live Coin Watch API**: Real-time cryptocurrency market data with database persistence.
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