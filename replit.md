# replit.md

## Overview

This is a cryptocurrency token dashboard application built for the "Oeconomia" (OEC) token on the BSC (Binance Smart Chain) network. The application provides comprehensive token analytics, real-time price tracking, holder statistics, transaction monitoring, and integration with popular DeFi platforms like PancakeSwap.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Custom components built with Radix UI primitives and shadcn/ui
- **Styling**: Tailwind CSS with custom crypto-themed design system
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the entire stack
- **API Design**: REST API with structured endpoints for token data, transactions, and network status
- **External API Integration**: Multiple crypto data sources (CoinGecko, PancakeSwap, BSCScan)
- **Development Mode**: Vite middleware integration for hot module replacement

### Data Storage
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple
- **Token Tracking**: Persistent storage for tracked tokens and historical snapshots
- **User Watchlists**: Database-backed user preferences and price alerts
- **Historical Data**: Token price and market data snapshots for analytics

## Key Components

### Frontend Components
1. **Dashboard**: Main application interface with token overview and analytics
2. **Token Overview**: Real-time price, market cap, and key metrics display
3. **Price Chart**: Interactive price history charts with multiple timeframes
4. **Transactions Table**: Live transaction feed with filtering and pagination
5. **Holder Statistics**: Top token holders analysis with distribution charts
6. **Token Info Panel**: Contract details, network status, and technical information
7. **Quick Actions**: Direct links to trading platforms and blockchain explorers

### Backend Services
1. **BSC API Service**: Blockchain data from BSCScan API
2. **CoinGecko API Service**: Market data and price information
3. **PancakeSwap API Service**: DEX-specific trading data and pair information
4. **Token Data Aggregation**: Combines multiple data sources with intelligent fallbacks

### Shared Schema
- Zod-based type validation for API responses
- Shared TypeScript types between client and server
- Comprehensive data models for tokens, transactions, holders, and network status

## Data Flow

1. **Client Request**: React components trigger API calls via TanStack Query
2. **Server Processing**: Express routes handle requests and coordinate external API calls
3. **Data Aggregation**: Multiple crypto APIs are called in parallel for comprehensive data
4. **Response Formatting**: Data is validated against Zod schemas and returned to client
5. **Client Updates**: TanStack Query manages caching, refetching, and UI updates
6. **Real-time Updates**: Automatic polling keeps data fresh (15-60 second intervals)

## External Dependencies

### Crypto Data Sources
- **CoinGecko API**: Primary source for market data and token information
- **PancakeSwap API**: DEX trading data and liquidity information
- **BSCScan API**: Blockchain transactions and network status

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Recharts**: Interactive charting library for price history
- **Lucide Icons**: Modern icon library
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production server code

## Deployment Strategy

### Build Process
- **Client**: Vite builds React app to `dist/public`
- **Server**: ESBuild bundles Node.js server to `dist/index.js`
- **Type Checking**: TypeScript compilation check without emission

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **API Keys**: External service authentication (CoinGecko, BSCScan)
- **Network**: BSC mainnet integration with testnet fallback options

### Production Setup
- **Server**: Express serves static files and API routes
- **Database**: Drizzle migrations and schema management
- **Monitoring**: Request logging and error handling middleware

The application follows a modern full-stack TypeScript architecture with emphasis on type safety, real-time data, and user experience. The modular design allows for easy extension with additional crypto data sources and features.