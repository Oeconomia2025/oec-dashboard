# replit.md

## Overview
This project is a cryptocurrency token dashboard application for the "Oeconomia" (OEC) token on the BSC (Binance Smart Chain) network. Its purpose is to provide comprehensive token analytics, real-time price tracking, holder statistics, transaction monitoring, and integration with popular DeFi platforms like PancakeSwap. The business vision is to create a professional trading interface with intuitive controls, transparent fee disclosure, industry-standard layout, and optimal screen space utilization, making it an essential tool for OEC token holders and traders.

**Current Status (August 2025)**: Dashboard converted from USD to ETH denomination as placeholder for future OEC token integration. All price displays, market data, and portfolio values now show clean numerical ETH amounts without redundant ticker symbols. Successfully implemented Moralis as primary real-time BSC data source without fallback systems, providing authentic blockchain data with optimized polling intervals (5-minute token data, 2-minute transactions, 1-minute network status). Removed all synthetic data generation for pure API-driven experience.

## User Preferences
Preferred communication style: Simple, everyday language.

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
- **External API Integration**: Multiple crypto data sources (CoinGecko, PancakeSwap, BSCScan).
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
- **CoinGecko API**: Market data and token information.
- **PancakeSwap API**: DEX trading data and liquidity information.
- **BSCScan API**: Blockchain transactions and network status.

### UI Libraries
- **Radix UI**: Accessible component primitives.
- **Recharts**: Interactive charting library.
- **Lucide Icons**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.

### Development Tools
- **Vite**: Build tool.
- **TypeScript**: Type safety across the stack.
- **ESBuild**: Fast bundling for production server code.