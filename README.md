# CosPharm Pricing Engine - Admin Portal

## Overview

The **CosPharm Pricing Engine** is an admin-only web portal designed to manage pricing rules, promotions, and discount structures for pharmaceutical distribution. This solution addresses the key objections raised by the Sage 200 Evolution implementation consultant:

1. **Sales staff never leave Sage 200 Evolution** - All order entry happens within Sage
2. **Admin-only web interface** - Only authorized personnel (Finance/Marketing) access the portal
3. **API-driven pricing** - Real-time price calculations via Sage Web Services API integration

## Architecture

```
┌─────────────────────┐
│  Sage 200 Evolution │
│   (Sales Staff)     │
│  - Create Orders    │
│  - Get Pricing      │
└──────────┬──────────┘
           │ API Call
           ▼
┌─────────────────────┐
│  Pricing Engine API │
│  - Calculate Price  │
│  - Apply Discounts  │
│  - Return Breakdown │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐       ┌─────────────────────┐
│    PostgreSQL DB    │◄──────┤   Admin Portal      │
│  - Products         │       │  (Finance/Marketing)│
│  - Customers        │       │  - Manage Prices    │
│  - Promotions       │       │  - Add Promotions   │
│  - Discount Rules   │       │  - View Reports     │
└─────────────────────┘       └─────────────────────┘
```

## Key Features

### Admin Portal Features
- **Dashboard** - Overview of pricing rules and active promotions
- **Price Management** - Update base prices (SEP) for ~4,700 SKUs
- **Discount Rules** - Configure product-specific discounts
- **Promotions** - Create time-bound promotional campaigns with start/end dates
- **Log Fees** - Manage customer-specific discount tables
- **Bulk Upload** - Import price updates via CSV/Excel
- **Reports** - View sales and discount analysis

### Pricing Calculation Logic
Sequential discount application:
```
Base Price (SEP)
  ↓ Apply Product Discount
Price After Product Discount
  ↓ Apply Promotion (if active)
Price After Promotion
  ↓ Apply Customer Log Fee
Final Price
```

### Business Rules
1. **Timing Rules** - Handle quote expiry, price list changes, and promotion windows
2. **Price Locking** - Define which price applies when quotes convert to orders
3. **Audit Trail** - All price calculations and changes are logged
4. **API Response Time** - <500ms for real-time Sage integration

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Wouter (routing)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Backend**: Express + tRPC
- **Database**: PostgreSQL + Drizzle ORM
- **Hosting**: Render (cloud-hosted)
- **Integration**: Sage 200 Evolution Web Services API

## Installation

### Prerequisites
- Node.js 22+
- pnpm 10+
- PostgreSQL database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/dudleypeacockqa/cospharm-pricing-engine.git
cd cospharm-pricing-engine
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database and Sage API credentials:
```
DATABASE_URL=postgresql://user:password@host:5432/database
SAGE_API_URL=https://your-sage-server/api
SAGE_API_KEY=your-api-key
```

4. **Run database migrations**
```bash
pnpm db:push
```

5. **Seed initial data (optional)**
```bash
pnpm seed:populate
```

6. **Start development server**
```bash
pnpm dev
```

The portal will be available at `http://localhost:5000`

## Deployment to Render

This application is configured for deployment on Render using the included `render.yaml` blueprint.

### Automatic Deployment
1. Connect your GitHub repository to Render
2. Render will automatically detect `render.yaml` and create:
   - Web service for the application
   - PostgreSQL database
3. Configure environment variables in Render dashboard
4. Deploy!

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Price Calculation
```
POST /api/pricing/calculate
{
  "customerId": "string",
  "productId": "string",
  "quantity": number,
  "quoteDate": "ISO date string (optional)"
}

Response:
{
  "basePrice": number,
  "productDiscount": number,
  "promotionDiscount": number,
  "logFeeDiscount": number,
  "finalPrice": number,
  "breakdown": { ... },
  "appliedPromotion": "string (optional)"
}
```

### Active Promotions
```
GET /api/promotions/active

Response: Array of active promotions
```

## User Roles

### Admin (Finance/Marketing)
- Full access to admin portal
- Manage prices, discounts, promotions
- View all reports
- Configure system settings

### Sales Staff (via Sage)
- No direct portal access
- Work entirely within Sage 200 Evolution
- Pricing automatically calculated via API
- See price breakdown in Sage order screen

## Key Differentiators

### vs. Original MVP
- ❌ **Removed**: Customer-facing portal for order entry
- ✅ **Added**: Admin-only focus with clear messaging
- ✅ **Enhanced**: Emphasis on Sage integration and API-driven pricing

### vs. Manual Excel Process
- ⚡ Automated calculations in <500ms
- 📊 Complete audit trail and transparency
- ✅ 99.9% accuracy guarantee
- 📈 Scales effortlessly to any catalog size

### vs. Sage Native Pricing
- 🎯 Purpose-built for sequential discount logic
- 🔄 Upgrade-safe (no direct ERP customization)
- 📱 Modern web interface for admin tasks
- 🔍 Advanced reporting and analytics

## Support

For questions or issues, contact:
- **Developer**: Dudley Peacock, ERP Success Systems
- **Implementation**: Uriel Patsanza (Sage 200 Evolution Consultant)

## License

MIT
