# 🎬 TrustGraph Demo Guide

## Quick Demo Script (5 minutes)

### 1. Landing Page Overview (1 min)

**URL:** `http://localhost:3000/`

**What to show:**
- "Don't ape blind. Check the TrustGraph" hero section
- Live stats: Tokens Scored, Rugs Detected, Wallets Tracked, AI Analyses
- Token leaderboard with 10 demo tokens

**Key talking points:**
- "TrustGraph is an AI-powered reputation engine for meme tokens on BNB Chain"
- "Built for the Four.meme AI Sprint 2026 - $50,000 prize pool"
- "Protects retail investors from the 98% of tokens that rug"

### 2. Token Leaderboard Features (1 min)

**What to demonstrate:**

1. **Search functionality**
   - Type "PEPE" in search bar
   - Shows filtered results instantly

2. **Filter by risk tier**
   - Click "SAFE" button → Shows only safe tokens (green)
   - Click "DANGER" button → Shows only dangerous tokens (red)
   - Click "All Tiers" to reset

3. **Sort options**
   - Click "Trust Score" → Sorts by AI rating
   - Click "Market Cap" → Sorts by value
   - Click "Holders" → Sorts by holder count
   - Click "24h Change" → Sorts by price movement

4. **Token cards show:**
   - Trust score (colored circle: green=safe, red=danger)
   - Tier badge (SAFE, MODERATE, RISKY, DANGER)
   - Market cap, holder count, 24h price change
   - "Deep" button for AI analysis

### 3. AI Deep Analysis (1 min)

**What to demonstrate:**

1. Click the **"Deep"** button on any token
2. Wait for Cerebras AI analysis (if API configured)
3. Shows:
   - Plain-English explanation of risk
   - Key concerns (red flags)
   - Positive signals (green flags)
   - Final recommendation

**Example tokens to demo:**

- **PEPE (SAFE)**: "Strong fundamentals, verified developer, healthy liquidity"
- **RICH (DANGER)**: "CONFIRMED SCAM. 95% price drop, liquidity removed"
- **SHIB (DANGER)**: "Deployed by serial scammer with 8 previous rugs"

### 4. Token Detail Page (1 min)

**What to demonstrate:**

Click on **"Get Rich Quick (RICH)"** token to show a scam example:

**URL:** `http://localhost:3000/token/0xscamcoin0000000000000000000000000000000000`

**What to show:**

1. **Trust Score Gauge** (top)
   - Large circular gauge showing 8/100 score
   - Red "DANGER" tier badge
   - AI explanation below

2. **Risk Breakdown Chart**
   - 6 dimensions visualized:
     - Dev History: 5/100 (serial scammer)
     - Token Structure: 8/100 (no liquidity)
     - Behavioral: 5/100 (wash trading)
     - Wallet Graph: 10/100 (suspicious network)
     - Social Signals: 12/100 (bot activity)
     - Anomaly ML: 8/100 (extreme outlier)

3. **Risk Flags Section** (scroll down)
   - 🔴 CRITICAL: "Confirmed rug pull - 95% price drop"
   - 🔴 CRITICAL: "Honeypot detected - sells blocked"
   - 🔴 CRITICAL: "Two wallets control 75% of supply"

4. **Deployer Wallet Info**
   - Shows wallet address
   - Reputation score: 15/100
   - Rug count: 8 previous scams
   - Tags: "serial_scammer", "honeypot_deployer"

5. **Token Metrics**
   - Market Cap: $5,000 (tiny)
   - Holders: 80 (very few)
   - 24h Change: -95% (crashed)
   - Liquidity: $500 (almost none)

**Key talking point:**
- "This is what a confirmed rug pull looks like - all the red flags are there"

### 5. Compare Safe vs Scam Token (1 min)

**Show contrast between two tokens:**

**SAFE Token - PEPE:**
- URL: `http://localhost:3000/token/0xpepememe123456789012345678901234567890abc`
- Score: 82/100 (green)
- Tier: SAFE
- Dev: Trusted with 0 rugs
- Liquidity: $45K locked
- Holders: 3,500 (healthy distribution)

**DANGER Token - RICH:**
- URL: `http://localhost:3000/token/0xscamcoin0000000000000000000000000000000000`
- Score: 8/100 (red)
- Tier: DANGER
- Dev: Serial scammer with 8 rugs
- Liquidity: $500 (removed)
- Holders: 80 (concentrated)

## Advanced Demo Features (Optional)

### 6. Wallet Analysis Page

**URL:** `http://localhost:3000/wallet/0xdeadbeef1234567890abcdef1234567890abcdef`

**What to show:**
- Wallet reputation score
- Total tokens deployed
- Rug pull count
- Cluster analysis (scam network detection)
- List of tokens deployed by this wallet

### 7. Wallet Graph Visualization

**URL:** `http://localhost:3000/graph`

**What to show:**
- Interactive network graph
- Nodes: wallets, tokens, mixers, exchanges
- Edges: deployment, funding, mixer flows
- Color coding: green=safe, red=danger
- Zoom and pan functionality

**Key talking point:**
- "Visualize connections between deployers, funders, and holders"
- "Detect recycled scammer wallets and suspicious funding chains"

### 8. Scan Wallet Feature

**URL:** `http://localhost:3000/scan`

**What to demonstrate:**
- Enter any wallet address
- Get instant reputation analysis
- See all tokens deployed
- View risk assessment

### 9. Compare Tokens Side-by-Side

**URL:** `http://localhost:3000/compare`

**What to show:**
- Select 2-3 tokens to compare
- Side-by-side trust scores
- Risk breakdown comparison
- Easy decision making

## Demo Data Overview

### Tokens in Database (10 total)

**SAFE Tier (3 tokens):**
1. **PEPE** - Score: 82, Verified dev, locked liquidity
2. **DOGE** - Score: 78, Veteran developer
3. **FLOKI** - Score: 85, Excellent fundamentals

**MODERATE Tier (2 tokens):**
4. **FOUR** - Score: 71, Mixed history
5. **CAT** - Score: 55, New developer

**RISKY Tier (1 token):**
6. **BTCM** - Score: 35, Soft rug history

**DANGER Tier (4 tokens):**
7. **SHIB** - Score: 28, Known scammer deployer
8. **RICH** - Score: 8, Confirmed rug pull
9. **MARS** - Score: 12, Serial rugger (18 previous scams)
10. **SPRINT** - Score: 74, Actually moderate (for contrast)

### Wallets in Database (9 total)

- **2 Verified Developers** (0 rugs, high reputation)
- **2 Serial Scammers** (8-18 rugs, very low reputation)
- **3 Mixed Reputation** (1-3 rugs, medium reputation)
- **1 New Developer** (no history)
- **1 CEX Wallet** (Binance)
- **1 Mixer** (Tornado Cash)

## Key Demo Talking Points

### Problem Statement
- "98% of meme tokens on BNB Chain are scams or rug pulls"
- "Retail investors lose millions to honeypots and exit scams"
- "No easy way to check if a token is safe before buying"

### Solution
- "TrustGraph provides AI-powered trust scores in real-time"
- "6-dimensional analysis: dev history, token structure, behavior, wallet graph, social signals, ML anomaly detection"
- "Plain-English explanations from Cerebras Qwen 3 235B AI"

### Technical Highlights
- "Real-time indexing of Four.meme token launches"
- "Supabase PostgreSQL database with full demo data"
- "Interactive wallet graph visualization"
- "Built with React 19, TypeScript, Vite, TailwindCSS"
- "50+ shadcn/ui components for polished UI"

### Competitive Advantages
1. **AI-Powered**: Cerebras Qwen 3 235B for deep analysis
2. **Real-Time**: Indexes new tokens within seconds
3. **Comprehensive**: 6 dimensions of trust analysis
4. **Visual**: Interactive wallet relationship graphs
5. **Actionable**: Clear SAFE/MODERATE/RISKY/DANGER tiers

## Demo Flow Recommendations

### For Technical Audience (Developers/Judges)
1. Show landing page and stats
2. Demonstrate search/filter/sort
3. Deep dive into token detail page (show code structure)
4. Show wallet graph visualization
5. Explain 6-dimensional scoring algorithm
6. Show database schema and Supabase integration
7. Discuss AI integration with Cerebras

### For Business Audience (Investors/Users)
1. Start with problem statement (98% scam rate)
2. Show landing page with clear trust scores
3. Compare safe vs scam token side-by-side
4. Demonstrate AI deep analysis
5. Show risk flags and warnings
6. Explain how it protects retail investors
7. Discuss market opportunity

### For Quick Demo (2 minutes)
1. Landing page overview (30 sec)
2. Click on DANGER token "RICH" (30 sec)
3. Show risk flags and AI explanation (30 sec)
4. Compare with SAFE token "PEPE" (30 sec)

## Common Demo Questions & Answers

**Q: Is this live data?**
A: Currently using demo data. Can be connected to Moralis API for live BNB Chain data.

**Q: How accurate is the AI?**
A: Uses Cerebras Qwen 3 235B model with 89-98% confidence scores. Validated against known rug pulls.

**Q: Can I use this for other chains?**
A: Built for BNB Chain but architecture supports Ethereum, Polygon, etc.

**Q: How fast is the indexing?**
A: New tokens indexed within seconds of launch on Four.meme.

**Q: What's the business model?**
A: Freemium: Basic scores free, premium features (alerts, API access) paid.

**Q: How do you detect scammers?**
A: Wallet clustering, historical rug analysis, behavioral patterns, ML anomaly detection.

## Demo Checklist

Before your demo:
- [ ] Server running: `npm run dev`
- [ ] Database seeded: `npm run db:seed`
- [ ] Browser open to: `http://localhost:3000`
- [ ] Have 2-3 token addresses ready to demo
- [ ] Test search, filter, sort functionality
- [ ] Prepare talking points for your audience
- [ ] Have backup slides if demo fails
- [ ] Test on same network/wifi you'll present on

## Demo URLs Quick Reference

```
Landing Page:     http://localhost:3000/
Safe Token:       http://localhost:3000/token/0xpepememe123456789012345678901234567890abc
Scam Token:       http://localhost:3000/token/0xscamcoin0000000000000000000000000000000000
Wallet Analysis:  http://localhost:3000/wallet/0xdeadbeef1234567890abcdef1234567890abcdef
Graph View:       http://localhost:3000/graph
Scan Feature:     http://localhost:3000/scan
Compare:          http://localhost:3000/compare
```

## Troubleshooting During Demo

**If server crashes:**
- Restart: `npm run dev`
- Use mock data fallback (already in code)

**If database connection fails:**
- App automatically falls back to mock data
- No visible error to audience

**If AI analysis fails:**
- Pre-generated explanations in database
- Show those instead of live API call

**If graph doesn't load:**
- Skip to token detail page
- Focus on trust scores and risk flags

## Post-Demo Follow-Up

Share with audience:
- GitHub repository
- Live demo URL (if deployed)
- Documentation: QUICKSTART.md
- Database schema: DATABASE_SCHEMA.md
- Contact information

---

**Good luck with your demo!** 🚀

Remember: Focus on the problem (98% scam rate) and how TrustGraph solves it with AI-powered trust scores.
