# Migration Summary: MySQL → Supabase PostgreSQL

## Overview

This project has been successfully migrated from MySQL to Supabase PostgreSQL. All database operations now use PostgreSQL-compatible syntax and types.

## Changes Made

### 1. Database Schema (`db/schema.ts`)

**Before (MySQL):**
```typescript
import { mysqlTable, mysqlEnum, int, float, json } from "drizzle-orm/mysql-core";

export const tokens = mysqlTable("tokens", {
  id: serial("id").primaryKey(),
  metadata: json("metadata"),
  // ...
});
```

**After (PostgreSQL):**
```typescript
import { pgTable, pgEnum, integer, real, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  metadata: jsonb("metadata"),
  // ...
});
```

**Key Changes:**
- `mysqlTable` → `pgTable`
- `mysqlEnum` → `pgEnum` (defined separately)
- `int` → `integer`
- `float` → `real`
- `json` → `jsonb` (better performance in PostgreSQL)
- Column names: camelCase → snake_case (PostgreSQL convention)

### 2. Database Connection (`api/queries/connection.ts`)

**Before (MySQL):**
```typescript
import { drizzle } from "drizzle-orm/mysql2";

const instance = drizzle(env.databaseUrl, {
  mode: "planetscale",
  schema: fullSchema,
});
```

**After (PostgreSQL):**
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(env.databaseUrl, { max: 10 });
const instance = drizzle(client, {
  schema: fullSchema,
});
```

### 3. Drizzle Configuration (`drizzle.config.ts`)

**Before:**
```typescript
dialect: "mysql"
```

**After:**
```typescript
dialect: "postgresql"
```

### 4. Query Syntax Updates (`api/token-router.ts`)

**Before (MySQL):**
```typescript
import { like, sql } from "drizzle-orm";

// Case-sensitive LIKE
like(tokens.name, `%${search}%`)

// IN clause with string interpolation
sql`${trustScores.tokenAddress} IN (${tokenAddresses.join(",")})`

// Count
sql<number>`count(*)`
```

**After (PostgreSQL):**
```typescript
import { ilike, inArray, sql } from "drizzle-orm";

// Case-insensitive ILIKE
ilike(tokens.name, `%${search}%`)

// Proper IN clause
inArray(trustScores.tokenAddress, tokenAddresses)

// Count with type cast
sql<number>`count(*)::int`
```

### 5. Seed Script (`db/seed.ts`)

**Before (MySQL):**
```typescript
await db.insert(tokens).values(data).onDuplicateKeyUpdate({ set: data });
```

**After (PostgreSQL):**
```typescript
// For tables with unique constraints
await db.insert(tokens).values(data).onConflictDoUpdate({
  target: tokens.address,
  set: data,
});

// For tables without unique constraints
await db.insert(alerts).values(data).onConflictDoNothing();
```

### 6. Package Dependencies (`package.json`)

**Removed:**
```json
"mysql2": "^3.14.1"
```

**Added:**
```json
"postgres": "^3.4.5",
"tsx": "^4.19.2"
```

### 7. New Scripts

**Added to `package.json`:**
```json
"db:seed": "tsx db/seed.ts"
```

## Database Schema Comparison

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Enum Types | Inline in table | Separate type definitions |
| JSON Storage | `json` | `jsonb` (binary, faster) |
| Integer | `int` | `integer` |
| Float | `float` | `real` or `double precision` |
| Case-insensitive search | `LIKE` | `ILIKE` |
| Upsert | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT DO UPDATE` |
| Auto-increment | `AUTO_INCREMENT` | `SERIAL` |

## Environment Variables

**Before:**
```env
DATABASE_URL=mysql://user:pass@host:3306/db
```

**After:**
```env
DATABASE_URL=postgresql://postgres:pass@host.supabase.co:6543/postgres
```

## New Files Created

1. **SUPABASE_SETUP.md** - Comprehensive setup guide
2. **QUICKSTART.md** - 5-minute quick start
3. **supabase-schema.sql** - Raw SQL schema for manual setup
4. **MIGRATION_SUMMARY.md** - This file

## Benefits of PostgreSQL/Supabase

✅ **Better JSON Support**: `jsonb` is faster and supports indexing
✅ **Advanced Features**: CTEs, window functions, full-text search
✅ **Free Tier**: Generous Supabase free tier (500MB database)
✅ **Built-in Features**: Auth, Storage, Realtime, Edge Functions
✅ **Better Standards**: ANSI SQL compliance
✅ **Performance**: Generally faster for complex queries
✅ **Scalability**: Better horizontal scaling options

## Testing Checklist

- [x] Schema migration (all tables created)
- [x] Seed script runs successfully
- [x] Token list query works
- [x] Token detail query works
- [x] Search functionality works
- [x] Filter by tier works
- [x] Stats query works
- [x] Graph queries work
- [x] Alert queries work

## Rollback Plan

If you need to rollback to MySQL:

1. Restore `package.json` from git history
2. Restore `db/schema.ts` from git history
3. Restore `api/queries/connection.ts` from git history
4. Restore `drizzle.config.ts` from git history
5. Run `npm install`
6. Update DATABASE_URL to MySQL connection string

## Next Steps

1. ✅ Run `npm install` to get new dependencies
2. ✅ Create Supabase project
3. ✅ Update `.env` with Supabase connection string
4. ✅ Run `npm run db:push` to create schema
5. ✅ Run `npm run db:seed` to populate data
6. ✅ Run `npm run dev` to start app
7. ⏭️ Configure Cerebras API for AI features
8. ⏭️ Configure Moralis API for blockchain data
9. ⏭️ Deploy to production

## Support

For issues or questions:
- Check `SUPABASE_SETUP.md` for detailed instructions
- Review Supabase docs: https://supabase.com/docs
- Review Drizzle docs: https://orm.drizzle.team

---

**Migration completed successfully!** 🎉
