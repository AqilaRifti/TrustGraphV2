# 🚀 Quick Start Guide - Supabase PostgreSQL

Get TrustGraph running with Supabase in 5 minutes!

## Prerequisites

- Node.js 20+
- A Supabase account (free tier works!)

## Step 1: Clone & Install

```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your database password!

## Step 3: Get Connection String

In Supabase Dashboard:
1. **Settings** → **Database**
2. Copy **Connection pooling** string
3. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres.xxxxx:your-password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your connection string:
```env
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Step 5: Setup Database

### Option A: Using Drizzle (Recommended)

```bash
# Push schema to Supabase
npm run db:push

# Seed demo data
npm run db:seed
```

### Option B: Using SQL Editor

1. Open Supabase **SQL Editor**
2. Copy contents of `supabase-schema.sql`
3. Run the SQL
4. Then run: `npm run db:seed`

## Step 6: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173**

## ✅ What You'll See

- **Landing Page**: Token leaderboard with 10 demo tokens
- **Trust Scores**: AI-powered risk ratings (SAFE, MODERATE, RISKY, DANGER)
- **Token Details**: Click any token to see full analysis
- **Wallet Graph**: Visualize deployer relationships
- **Risk Flags**: Real-time scam detection alerts

## 📊 Demo Data Includes

- **10 Tokens**: Mix of safe and scam tokens
- **9 Wallets**: Including verified devs and known scammers
- **10 Trust Scores**: AI explanations from Cerebras
- **14 Risk Flags**: Honeypots, rug pulls, etc.
- **5 Alerts**: Critical warnings
- **Graph Data**: Wallet relationship network

## 🔧 Troubleshooting

### "Connection refused"
- Check your DATABASE_URL is correct
- Verify password has no special characters that need escaping

### "Relation does not exist"
- Run `npm run db:push` first
- Check Supabase Table Editor to verify tables exist

### "Seed script fails"
- Ensure schema was pushed successfully
- Check all enum types were created
- Try dropping all tables and re-running `db:push`

## 📚 Next Steps

1. **Add Real Data**: Configure Moralis API for live blockchain data
2. **Enable AI**: Add Cerebras API key for deep analysis
3. **Authentication**: Set up Kimi OAuth
4. **Deploy**: Push to Vercel/Railway

## 🎯 Key Features to Try

1. **Search Tokens**: Use search bar on landing page
2. **Filter by Tier**: Click SAFE/MODERATE/RISKY/DANGER
3. **Deep Analysis**: Click "Deep" button for AI explanation
4. **Compare Tokens**: Visit `/compare` page
5. **Scan Wallets**: Visit `/scan` page
6. **View Graph**: Visit `/graph` page

## 📖 Full Documentation

See `SUPABASE_SETUP.md` for detailed setup instructions.

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Drizzle ORM: https://orm.drizzle.team
- Project Issues: [Your GitHub]

---

**Built for Four.meme AI Sprint 2026** 🏆
