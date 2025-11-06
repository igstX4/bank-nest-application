# Fix Currency Enum Issue

## Problem
The database has `currency` column as TEXT, but Prisma expects it to be a Currency enum type.

## Solution

### Option 1: Apply the migration (if database is already deployed)

Run this SQL directly in your database:

```sql
-- Create the enum type
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR');

-- Convert existing TEXT values to enum
ALTER TABLE "Account" ALTER COLUMN "currency" TYPE "Currency" USING "currency"::"Currency";
```

### Option 2: Reset and recreate (development only)

If you're in development and can reset the database:

```bash
cd backend-nest
npx prisma migrate reset
npx prisma migrate dev
```

### Option 3: Create new migration

If you need to create a proper migration:

```bash
cd backend-nest
npx prisma migrate dev --name fix_currency_enum
```

Then apply it:
```bash
npx prisma migrate deploy
```

## After fixing

Regenerate Prisma Client:
```bash
npx prisma generate
```

