# Mini Banking App 💰

A simple banking application built with React and NestJS. Transfer money, exchange currencies, and get real-time notifications.

## What's Inside

- **User registration & authentication** - Create an account and log in
- **Multi-currency accounts** - USD and EUR accounts for each user
- **Money transfers** - Send money to other users by email
- **Currency exchange** - Convert between USD and EUR
- **Transaction history** - View all your transactions
- **Real-time updates** - Get instant notifications via WebSocket

## Tech Stack

**Frontend:** React, TypeScript, Vite, React Query, Tailwind CSS  
**Backend:** NestJS, PostgreSQL, Prisma, WebSocket, JWT

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
cd backend-nest

# Install dependencies
npm install

# Create .env file
DATABASE_URL="postgresql://user:password@localhost:5432/bank_db"
JWT_SECRET="your-secret-key-here"
CLIENT_URL="http://localhost:5173"
PORT=4000

# Run migrations
npm run prisma:migrate
npm run prisma:generate

# Start dev server
npm run start:dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
VITE_API_URL=http://localhost:4000

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and register a new account.

## User Management

**Approach: User Registration**

Users register themselves through the app. When you create an account:
- You get two accounts automatically: USD ($1000) and EUR (€500)
- A JWT token is generated for authentication
- You can start transferring money right away

## Database Design

The app uses a **double-entry ledger system** to ensure financial integrity:

- Every transaction creates at least 2 ledger entries
- The sum of all entries for a transaction always equals zero
- Account balance = sum of all ledger entries for that account

This ensures that money is never created or destroyed, only moved between accounts.



## Key Features

### Atomic Operations
All balance updates use atomic SQL operations to prevent race conditions:

### Real-time Notifications
- WebSocket connection for instant updates
- Toast notifications when you receive money
- Automatic cache invalidation

### Security
- Passwords are hashed with bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- CORS configured

## API Endpoints

**Auth:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

**Accounts:**
- `GET /accounts` - List user accounts
- `GET /accounts/:id/balance` - Get account balance

**Transactions:**
- `POST /transactions/transfer` - Transfer money
- `POST /transactions/exchange` - Exchange currency
- `GET /transactions` - Get transaction history

**WebSocket:**
- `WS /ws?token=<JWT>` - Real-time updates

## Design Decisions

1. **Registration over pre-seeded users** - More realistic, allows testing with multiple accounts
2. **Double-entry ledger** - Industry standard for financial systems, ensures data integrity
3. **WebSocket for real-time** - Better UX than polling
4. **React Query** - Handles caching and synchronization automatically
5. **Raw SQL for balance checks** - Ensures atomicity and prevents race conditions

## Known Limitations

- Fixed exchange rate (0.92) - In production, use a real exchange rate API



## Project Structure

```
bank/
├── backend-nest/     # NestJS backend
├── frontend/         # React frontend
├── README.md         # This file
├── DATABASE.md       # Database documentation
└── DEPLOYMENT.md     # Deployment guide
```

## 🌐 Deployment Links

- [Frontend (Vercel)](https://bank-nest-application.vercel.app)
- [Backend (Render)](https://bank-nest-application.onrender.com)
- > ⚠️ The backend hosted on Render (Free Tier) goes to sleep after ~15 minutes of inactivity and may take up to a minute to wake up on the next request.

