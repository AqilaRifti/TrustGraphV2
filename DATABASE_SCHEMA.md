# TrustGraph Database Schema

## Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ union_id (UQ)   │
│ name            │
│ email           │
│ avatar          │
│ role            │
│ created_at      │
│ updated_at      │
│ last_sign_in_at │
└─────────────────┘

┌─────────────────┐         ┌──────────────────┐
│     tokens      │────────▶│  trust_scores    │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ address (UQ)    │◀────────│ token_address    │
│ name            │         │ score            │
│ symbol          │         │ tier             │
│ deployer        │         │ breakdown        │
│ chain           │         │ ai_explanation   │
│ metadata        │         │ confidence       │
│ created_at      │         │ model_version    │
│ updated_at      │         │ created_at       │
└────────┬────────┘         │ updated_at       │
         │                  └──────────────────┘
         │
         │                  ┌──────────────────┐
         └─────────────────▶│   risk_flags     │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ token_address    │
                            │ flag_type        │
                            │ severity         │
                            │ description      │
                            │ metadata         │
                            │ created_at       │
                            └──────────────────┘

┌─────────────────┐         ┌──────────────────┐
│    wallets      │────────▶│   graph_nodes    │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ address (UQ)    │         │ node_id (UQ)     │
│ first_seen      │         │ type             │
│ total_tokens... │         │ label            │
│ rug_count       │         │ score            │
│ reputation_...  │         │ tier             │
│ cluster_id      │         │ cluster_id       │
│ tags            │         │ tags             │
│ metadata        │         │ metadata         │
│ display_name    │         │ created_at       │
│ created_at      │         └──────────────────┘
│ updated_at      │                  │
└─────────────────┘                  │
                                     │
                            ┌────────▼──────────┐
                            │   graph_edges     │
                            ├───────────────────┤
                            │ id (PK)           │
                            │ source            │
                            │ target            │
                            │ relationship_type │
                            │ label             │
                            │ weight            │
                            │ metadata          │
                            │ created_at        │
                            └───────────────────┘

┌─────────────────┐
│     alerts      │
├─────────────────┤
│ id (PK)         │
│ token_address   │
│ token_symbol    │
│ type            │
│ severity        │
│ message         │
│ read            │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│   favorites     │
├─────────────────┤
│ id (PK)         │
│ token_address   │
│ wallet_address  │
│ created_at      │
└─────────────────┘
```

## Table Descriptions

### Core Tables

#### `tokens`
Stores information about meme tokens on BNB Chain.

**Key Fields:**
- `address` - Unique token contract address
- `deployer` - Wallet address that deployed the token
- `metadata` - JSONB containing market data:
  - `market_cap` - Market capitalization in USD
  - `holder_count` - Number of token holders
  - `liquidity_usd` - Liquidity pool value
  - `price_change_24h` - 24-hour price change percentage
  - `volume_24h` - 24-hour trading volume
  - `top_holders` - Array of largest holders

#### `wallets`
Tracks developer/holder wallet reputation and history.

**Key Fields:**
- `address` - Unique wallet address
- `total_tokens_deployed` - Number of tokens created
- `rug_count` - Number of confirmed rug pulls
- `reputation_score` - 0-100 reputation rating
- `cluster_id` - Scam network cluster identifier
- `tags` - JSONB array of labels (e.g., "serial_scammer", "verified")

#### `trust_scores`
AI-powered trust ratings for tokens.

**Key Fields:**
- `score` - Overall trust score (0-100)
- `tier` - Risk tier: SAFE, MODERATE, RISKY, DANGER
- `breakdown` - JSONB with 6 dimension scores:
  - `dev_history` - Developer reputation (25% weight)
  - `token_structure` - LP, taxes, supply (20% weight)
  - `behavioral` - Wash trading, snipers (20% weight)
  - `wallet_graph` - Network analysis (15% weight)
  - `social_signals` - Community sentiment (10% weight)
  - `anomaly_ml` - ML anomaly detection (10% weight)
- `ai_explanation` - Plain-English risk analysis from Cerebras

#### `risk_flags`
Specific risk indicators detected for tokens.

**Flag Types:**
- `known_scammer_deployer` - Deployed by serial rugger
- `unlocked_liquidity` - LP not locked/burned
- `high_sell_tax` - Excessive sell fees (honeypot)
- `concentrated_supply` - Whale concentration
- `completed_rug_pull` - Confirmed scam
- `honeypot_detected` - Sells blocked/fail
- `soft_rug_history` - Gradual liquidity removal

**Severity Levels:**
- `LOW` - Minor concern
- `MEDIUM` - Moderate risk
- `HIGH` - Significant risk
- `CRITICAL` - Extreme danger

### Graph Tables

#### `graph_nodes`
Nodes in the wallet relationship graph.

**Node Types:**
- `wallet` - Developer/holder wallet
- `token` - Token contract
- `mixer` - Privacy protocol (Tornado Cash)
- `cex` - Centralized exchange

#### `graph_edges`
Relationships between graph nodes.

**Relationship Types:**
- `deployed` - Wallet deployed token
- `funded` - Wallet funded another wallet
- `mixer_flow` - Funds through mixer
- `cex_deposit` - Deposit to exchange

### Supporting Tables

#### `alerts`
Real-time notifications for critical events.

**Alert Types:**
- `rug_pull_confirmed` - Confirmed scam
- `honeypot_detected` - Sell restrictions found
- `scammer_deployed` - Known scammer launched token
- `unlocked_liquidity` - LP unlock detected
- `price_crash` - Significant price drop

#### `favorites`
User bookmarks for tokens (future feature).

#### `users`
Authentication and user management.

## Enums

### `role`
- `user` - Regular user
- `admin` - Administrator

### `tier`
- `SAFE` - Low risk (score 70-100)
- `MODERATE` - Medium risk (score 50-69)
- `RISKY` - High risk (score 30-49)
- `DANGER` - Extreme risk (score 0-29)

### `severity`
- `LOW` - Minor issue
- `MEDIUM` - Moderate concern
- `HIGH` - Serious problem
- `CRITICAL` - Immediate danger

### `alert_severity`
- `info` - Informational
- `warning` - Warning
- `critical` - Critical alert

### `node_type`
- `wallet` - Wallet address
- `token` - Token contract
- `mixer` - Privacy protocol
- `cex` - Exchange

## Indexes

Performance indexes on frequently queried columns:

```sql
CREATE INDEX idx_tokens_address ON tokens(address);
CREATE INDEX idx_tokens_deployer ON tokens(deployer);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_trust_scores_token ON trust_scores(token_address);
CREATE INDEX idx_risk_flags_token ON risk_flags(token_address);
CREATE INDEX idx_alerts_token ON alerts(token_address);
CREATE INDEX idx_alerts_read ON alerts(read);
CREATE INDEX idx_graph_nodes_node_id ON graph_nodes(node_id);
CREATE INDEX idx_graph_edges_source ON graph_edges(source);
CREATE INDEX idx_graph_edges_target ON graph_edges(target);
```

## JSONB Fields

### `tokens.metadata`
```json
{
  "market_cap": 150000,
  "holder_count": 3500,
  "price_change_24h": 12.5,
  "liquidity_usd": 45000,
  "volume_24h": 25000,
  "liquidity_locked": true,
  "sell_tax": 0,
  "top_holders": [
    {
      "address": "0x...",
      "percentage": 5.2
    }
  ]
}
```

### `trust_scores.breakdown`
```json
{
  "dev_wallet_history": 85,
  "token_structure": 80,
  "behavioral_patterns": 78,
  "wallet_graph_analysis": 88,
  "social_signals": 82,
  "anomaly_score": 83
}
```

### `wallets.tags`
```json
["verified", "active", "doxxed"]
```

### `risk_flags.metadata`
```json
{
  "holder_address": "0x...",
  "percentage": 50.0,
  "rug_count": 8
}
```

## Sample Queries

### Get token with full details
```sql
SELECT 
  t.*,
  ts.score,
  ts.tier,
  ts.ai_explanation,
  w.reputation_score,
  w.rug_count,
  COUNT(rf.id) as risk_flag_count
FROM tokens t
LEFT JOIN trust_scores ts ON ts.token_address = t.address
LEFT JOIN wallets w ON w.address = t.deployer
LEFT JOIN risk_flags rf ON rf.token_address = t.address
WHERE t.address = '0x...'
GROUP BY t.id, ts.id, w.id;
```

### Find all tokens by scammer wallets
```sql
SELECT t.*, w.rug_count, w.reputation_score
FROM tokens t
JOIN wallets w ON w.address = t.deployer
WHERE w.rug_count > 0
ORDER BY w.rug_count DESC;
```

### Get wallet network
```sql
SELECT 
  gn1.label as source_label,
  ge.relationship_type,
  gn2.label as target_label,
  ge.weight
FROM graph_edges ge
JOIN graph_nodes gn1 ON gn1.node_id = ge.source
JOIN graph_nodes gn2 ON gn2.node_id = ge.target
WHERE ge.source = '0x...' OR ge.target = '0x...';
```

## Data Flow

1. **Token Launch** → Insert into `tokens`
2. **Developer Check** → Query/insert `wallets`
3. **Trust Analysis** → Insert `trust_scores` with AI explanation
4. **Risk Detection** → Insert `risk_flags` for issues found
5. **Graph Building** → Insert `graph_nodes` and `graph_edges`
6. **Alert Generation** → Insert `alerts` for critical events

## Backup & Maintenance

Supabase handles:
- ✅ Automatic backups (daily)
- ✅ Point-in-time recovery
- ✅ Connection pooling
- ✅ SSL encryption
- ✅ Monitoring & logs

## Scaling Considerations

- Use connection pooling (Supabase Pooler)
- Index JSONB fields if querying frequently
- Consider partitioning `alerts` table by date
- Archive old `risk_flags` after 90 days
- Use materialized views for complex aggregations
