# replit.md

## Overview

This is a cryptocurrency token dashboard application built for the "Oeconomia" (OEC) token on the BSC (Binance Smart Chain) network. The application provides comprehensive token analytics, real-time price tracking, holder statistics, transaction monitoring, and integration with popular DeFi platforms like PancakeSwap.

## Recent Changes (August 2025)

### Navigation & Header System Enhancement
- **Feature Added**: Dynamic page titles and descriptions in top navigation header
- **Implementation**: Centralized page information system with context-aware headers
- **Visual Cleanup**: Removed duplicate page headers from all page bodies for streamlined design
- **Gradient Consistency**: Applied custom cyan-to-magenta gradient (linear-gradient(45deg, #00d4ff, #ff00ff)) to active navigation and wallet buttons
- **Footer Addition**: Added "© 2025 Oeconomia. All rights reserved." footer to all pages
- **User Feedback**: "It all looks very good" - complete satisfaction with unified design system
- **Result**: Professional, cohesive interface with consistent branding and clean information architecture

### Staking DApp Implementation
- **Feature Added**: Comprehensive staking interface with multiple pool options (flexible, 30-day, 90-day, 180-day)
- **Visual Enhancements**: Each pool displays unique gradient color schemes - blue/cyan, emerald/teal, purple/pink, amber/orange
- **Technical Implementation**: Tabbed interface for stake/unstake/rewards with real-time calculations
- **Smart Contract Ready**: All functions prepared for integration when contracts are deployed
- **User Feedback**: "This is reeeeaaally nice looking" - highly positive response to colorful design
- **Result**: Professional staking interface ready for contract integration with excellent visual appeal

### Interactive ROI Calculator & Achievement System
- **ROI Calculator**: Real-time calculations with adjustable amounts, time periods, and pool selection
- **Achievement Badges**: Gamified system with 6 badge types (First Stake, Diamond Hands, Whale Staker, etc.)
- **Collapsible Interface**: Both sections feature prominent toggle buttons with smooth expand/collapse
- **Visual Polish**: Enhanced toggle styling with proper spacing and hover effects
- **User Feedback**: "This is what I wanted. Very well done" - perfect spacing and functionality
- **Result**: Complete interactive staking experience with professional UI/UX design

### Dashboard Analytics Enhancement
- **Feature Added**: Volume & Liquidity Analytics and Historical Performance charts positioned under price chart
- **Layout Optimization**: Aligned analytics components with matching width for cohesive dashboard flow
- **Data Integration**: Comprehensive trading metrics with multiple timeframe support
- **Result**: Enhanced dashboard providing deeper token insights and market analysis

### Portfolio Color Differentiation
- **Feature Updated**: Pool and farm containers now use distinct color schemes
- **Color Implementation**: Pools use teal/cyan gradients, farms use emerald/green gradients
- **Visual Consistency**: Matching badges and action buttons with theme-appropriate colors
- **Result**: Clear visual distinction between different DeFi position types

### Navigation System Enhancement
- **Issue Resolved**: Sidebar navigation was expanding unexpectedly when clicking navigation icons while in collapsed state
- **Solution Implemented**: Multi-layered state protection system with localStorage persistence and navigation state locking
- **Technical Details**: 
  - Added state locking mechanism during navigation using React refs
  - Implemented localStorage synchronization to prevent state resets
  - Enhanced useEffect monitoring to enforce locked states
  - Added immediate post-navigation state restoration callbacks
- **Result**: Sidebar now maintains collapsed state consistently across all page navigation

### Development Disclaimer Modal
- **Feature Added**: One-time popup modal for new visitors warning about DApp development status
- **Implementation**: localStorage-based tracking to show only once per user
- **Content**: Clear messaging about placeholder/demo status with warning not to use real funds
- **Result**: Professional disclaimer system that informs users about development status

### Successful Netlify Deployment & Error Handling
- **Achievement**: Successfully deployed to https://oeconomia.io via Netlify with comprehensive error handling
- **Technical Implementation**: Enhanced React Query error handling with graceful API failure management
- **Error Handling**: App no longer crashes when backend APIs unavailable - shows appropriate "data unavailable" messages
- **Price Chart Enhancement**: Added informative messaging when live price data isn't accessible on static deployment
- **User Feedback**: "It's online! Thank you. It's almost perfect" - successful deployment confirmation
- **Result**: Fully functional static deployment with wallet connectivity and complete UI without crashes

### Light/Dark Mode Toggle Implementation
- **Issue**: Theme toggle button implemented but visual changes not applying despite JavaScript state changes
- **Status**: Theme classes being applied to document root correctly, but CSS variables not updating visually
- **User Feedback**: "It doesn't work still" - toggle not producing visible theme changes
- **Technical Details**: ThemeProvider working, toggle button functional, localStorage persistence working
- **Note**: Considered acceptable limitation per user acknowledgment that "it's okay" if too difficult

### Netlify Build Configuration Resolution (August 2025)
- **Issue Resolved**: Multiple deployment failures due to Vite configuration incompatibility with Netlify's build environment
- **Root Cause**: `import.meta.dirname` syntax and complex Vite config causing "Could not resolve entry module" errors
- **Solution Implemented**: 
  - Created `vite.config.netlify.ts` with simplified configuration using `__dirname`
  - Updated `netlify.toml` to use Netlify-specific build config
  - Removed server build from static deployment process
- **Technical Details**: Netlify environment doesn't support newer Node.js syntax, required backward-compatible approach
- **Result**: Build process now works reliably in Netlify's environment with proper path resolution

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