# Supabase PostgreSQL Setup Guide

This project has been migrated from MySQL to **Supabase PostgreSQL**. Follow these steps to set up your database.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: `trustgraph` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes for provisioning

## 2. Get Your Database Connection String

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll to **Connection String** section
4. Copy the **Connection pooling** URI (recommended for serverless)
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
5. Replace `[YOUR-PASSWORD]` with your actual database password

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## 4. Install Dependencies

```bash
npm install
```

This will install the new `postgres` package (replacing `mysql2`).

## 5. Generate and Run Migrations

Generate the migration files:
```bash
npm run db:generate
```

Push the schema to Supabase:
```bash
npm run db:push
```

This creates all tables, enums, and indexes in your Supabase database.

## 6. Seed Demo Data

Populate your database with demo tokens, wallets, and trust scores:

```bash
npm run db:seed
```

You should see output like:
```
✓ Inserted 9 wallets
✓ Inserted 10 tokens
✓ Inserted 10 trust scores
✓ Inserted 14 risk flags
✓ Inserted 12 graph nodes
✓ Inserted 13 graph edges
✓ Inserted 5 alerts
✅ Seed complete!
```

## 7. Verify in Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `users`
   - `tokens`
   - `wallets`
   - `trust_scores`
   - `risk_flags`
   - `alerts`
   - `graph_nodes`
   - `graph_edges`
   - `favorites`

3. Click on any table to view the seeded data

## 8. Start the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app with live data from Supabase!

## Database Schema Overview

### Tables

**tokens**
- Stores meme token information (address, name, symbol, deployer)
- Metadata includes market cap, holder count, liquidity, etc.

**wallets**
- Developer/holder wallet information
- Tracks reputation score, rug count, cluster analysis

**trust_scores**
- AI-powered trust scores (0-100) for each token
- Tier classification: SAFE, MODERATE, RISKY, DANGER
- Breakdown of 6 scoring dimensions
- AI explanation from Cerebras

**risk_flags**
- Specific risk indicators (honeypot, rug pull, etc.)
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL

**graph_nodes & graph_edges**
- Wallet relationship graph data
- Visualizes connections between deployers, tokens, mixers

**alerts**
- Real-time alerts for critical events
- Unread notification tracking

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Check your DATABASE_URL is correct
2. Verify your database password
3. Ensure your IP is allowed (Supabase allows all by default)
4. Try the direct connection string instead of pooler

### Migration Errors

If migrations fail:
1. Drop all tables in Supabase Table Editor
2. Run `npm run db:push` again
3. Run `npm run db:seed` to repopulate

### Seed Script Errors

If seeding fails:
1. Ensure migrations ran successfully first
2. Check that all enum types were created
3. Verify your connection string is correct

## SQL Schema (for reference)

The complete PostgreSQL schema is in `db/schema.ts`. Key features:

- **Enums**: role, tier, severity, alert_severity, node_type
- **JSONB columns**: For flexible metadata storage
- **Timestamps**: Auto-managed created_at/updated_at
- **Indexes**: On unique fields (address, node_id, union_id)

## Next Steps

1. Configure Cerebras API key for AI analysis
2. Configure Moralis API key for blockchain data
3. Set up Kimi OAuth for authentication
4. Deploy to production (Vercel, Railway, etc.)

## Production Deployment

For production, use Supabase's connection pooling:
- Use the **Transaction** mode pooler for migrations
- Use the **Session** mode pooler for application queries
- Enable SSL mode: `?sslmode=require`

Example production DATABASE_URL:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

## Support

- Supabase Docs: https://supabase.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team/docs/overview
- Project Issues: [Your GitHub repo]
