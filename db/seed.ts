import { getDb } from "../api/queries/connection";
import {
  tokens,
  wallets,
  trustScores,
  riskFlags,
  graphNodes,
  graphEdges,
  alerts,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database with mock data...");

  // ── Wallets ──
  const walletData = [
    { address: "0xdeadbeef1234567890abcdef1234567890abcdef", firstSeen: new Date(Date.now() - 86400000 * 45), totalTokensDeployed: 12, rugCount: 8, reputationScore: 15, clusterId: "scam_cluster_0", tags: ["serial_scammer", "honeypot_deployer"], displayName: "Scammer #1" },
    { address: "0xtrust007777777777777777777777777777777777", firstSeen: new Date(Date.now() - 86400000 * 120), totalTokensDeployed: 5, rugCount: 0, reputationScore: 88, clusterId: "trusted_0", tags: ["trusted_builder", "doxxed"], displayName: "Trusted Dev" },
    { address: "0xlegit9999999999999999999999999999999999", firstSeen: new Date(Date.now() - 86400000 * 200), totalTokensDeployed: 15, rugCount: 0, reputationScore: 92, clusterId: "trusted_0", tags: ["veteran", "multi_cycle"], displayName: "Veteran Dev" },
    { address: "0xscam222222222222222222222222222222222222", firstSeen: new Date(Date.now() - 86400000 * 30), totalTokensDeployed: 20, rugCount: 18, reputationScore: 5, clusterId: "scam_cluster_0", tags: ["serial_scammer"], displayName: "Serial Rugger" },
    { address: "0xnewbie1111111111111111111111111111111111", firstSeen: new Date(Date.now() - 86400000 * 5), totalTokensDeployed: 1, rugCount: 0, reputationScore: 45, clusterId: null, tags: ["new_wallet"], displayName: "New Dev" },
    { address: "0xsuspect33333333333333333333333333333333", firstSeen: new Date(Date.now() - 86400000 * 60), totalTokensDeployed: 8, rugCount: 3, reputationScore: 32, clusterId: "scam_cluster_1", tags: ["suspicious", "soft_rug_history"], displayName: "Suspect Dev" },
    { address: "0xmoderate44444444444444444444444444444444", firstSeen: new Date(Date.now() - 86400000 * 90), totalTokensDeployed: 10, rugCount: 1, reputationScore: 62, clusterId: null, tags: ["mixed_history"], displayName: "Mixed Dev" },
    { address: "0xmixer55555555555555555555555555555555555", firstSeen: null, totalTokensDeployed: 0, rugCount: 0, reputationScore: 10, clusterId: null, tags: ["tornado_cash"], displayName: "Tornado Mixer" },
    { address: "0xbinance666666666666666666666666666666666", firstSeen: null, totalTokensDeployed: 0, rugCount: 0, reputationScore: 95, clusterId: null, tags: ["cex", "binance"], displayName: "Binance Hot Wallet" },
  ];

  for (const w of walletData) {
    await db.insert(wallets).values(w).onConflictDoUpdate({
      target: wallets.address,
      set: w,
    });
  }
  console.log(`✓ Inserted ${walletData.length} wallets`);

  // ── Tokens ──
  const tokenData = [
    { address: "0xpepememe123456789012345678901234567890abc", name: "Pepe on BNB", symbol: "PEPE", deployer: "0xtrust007777777777777777777777777777777777", metadata: { market_cap: 150000, holder_count: 3500, price_change_24h: 12.5, liquidity_usd: 45000, volume_24h: 25000, liquidity_locked: true, sell_tax: 0, top_holders: [{ address: "0xholder1111111111111111111111111111111111", percentage: 5.2 }, { address: "0xholder2222222222222222222222222222222222", percentage: 3.1 }] } },
    { address: "0xdogebnb987654321098765432109876543210fedc", name: "Doge BNB", symbol: "DOGE", deployer: "0xlegit9999999999999999999999999999999999", metadata: { market_cap: 85000, holder_count: 2100, price_change_24h: -3.2, liquidity_usd: 28000, volume_24h: 12000, liquidity_locked: true, sell_tax: 0, top_holders: [{ address: "0xholder3333333333333333333333333333333333", percentage: 4.5 }] } },
    { address: "0xshibamem1122334455667788990011223344556677", name: "Shiba Inu BSC", symbol: "SHIB", deployer: "0xdeadbeef1234567890abcdef1234567890abcdef", metadata: { market_cap: 45000, holder_count: 1200, price_change_24h: 25.8, liquidity_usd: 12000, volume_24h: 45000, liquidity_locked: false, sell_tax: 15, top_holders: [{ address: "0xholder4444444444444444444444444444444444", percentage: 15.2 }, { address: "0xholder5555555555555555555555555555555555", percentage: 8.7 }] } },
    { address: "0xfourmeme999888777666555444333222111000aaaa", name: "FOUR Token", symbol: "FOUR", deployer: "0xmoderate44444444444444444444444444444444", metadata: { market_cap: 200000, holder_count: 5200, price_change_24h: 8.4, liquidity_usd: 75000, volume_24h: 35000, liquidity_locked: true, sell_tax: 2, top_holders: [{ address: "0xholder6666666666666666666666666666666666", percentage: 3.8 }] } },
    { address: "0xfloki6667778889990001112223334445556667778", name: "Floki BNB", symbol: "FLOKI", deployer: "0xtrust007777777777777777777777777777777777", metadata: { market_cap: 120000, holder_count: 4100, price_change_24h: -1.8, liquidity_usd: 38000, volume_24h: 18000, liquidity_locked: true, sell_tax: 0, top_holders: [{ address: "0xholder7777777777777777777777777777777777", percentage: 2.5 }] } },
    { address: "0xscamcoin0000000000000000000000000000000000", name: "Get Rich Quick", symbol: "RICH", deployer: "0xdeadbeef1234567890abcdef1234567890abcdef", metadata: { market_cap: 5000, holder_count: 80, price_change_24h: -95.0, liquidity_usd: 500, volume_24h: 5000, liquidity_locked: false, sell_tax: 25, top_holders: [{ address: "0xholder8888888888888888888888888888888888", percentage: 45.0 }, { address: "0xholder9999999999999999999999999999999999", percentage: 30.0 }] } },
    { address: "0xelonmusk9999999999999999999999999999999999", name: "Elon Mars", symbol: "MARS", deployer: "0xscam222222222222222222222222222222222222", metadata: { market_cap: 8000, holder_count: 150, price_change_24h: -78.5, liquidity_usd: 800, volume_24h: 3000, liquidity_locked: false, sell_tax: 20, top_holders: [{ address: "0xholderaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", percentage: 50.0 }] } },
    { address: "0xcatcoin8888888888888888888888888888888888", name: "Cat Coin", symbol: "CAT", deployer: "0xnewbie1111111111111111111111111111111111", metadata: { market_cap: 35000, holder_count: 980, price_change_24h: 45.2, liquidity_usd: 15000, volume_24h: 8000, liquidity_locked: true, sell_tax: 3, top_holders: [{ address: "0xholderbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", percentage: 8.5 }] } },
    { address: "0xbtcmem7777777777777777777777777777777777", name: "BTC Meme", symbol: "BTCM", deployer: "0xsuspect33333333333333333333333333333333", metadata: { market_cap: 25000, holder_count: 650, price_change_24h: -15.3, liquidity_usd: 8000, volume_24h: 5000, liquidity_locked: false, sell_tax: 10, top_holders: [{ address: "0xholdercccccccccccccccccccccccccccccccccccc", percentage: 12.0 }] } },
    { address: "0xaisprint66666666666666666666666666666666", name: "AI Sprint", symbol: "SPRINT", deployer: "0xmoderate44444444444444444444444444444444", metadata: { market_cap: 180000, holder_count: 4800, price_change_24h: 22.1, liquidity_usd: 60000, volume_24h: 28000, liquidity_locked: true, sell_tax: 1, top_holders: [{ address: "0xholderdddddddddddddddddddddddddddddddddddd", percentage: 4.2 }] } },
  ];

  for (const t of tokenData) {
    await db.insert(tokens).values(t).onConflictDoUpdate({
      target: tokens.address,
      set: t,
    });
  }
  console.log(`✓ Inserted ${tokenData.length} tokens`);

  // ── Trust Scores ──
  const scoreData = [
    { tokenAddress: "0xpepememe123456789012345678901234567890abc", score: 82, tier: "SAFE" as const, breakdown: { dev_wallet_history: 85, token_structure: 80, behavioral_patterns: 78, wallet_graph_analysis: 88, social_signals: 82, anomaly_score: 83 }, aiExplanation: "This token demonstrates strong trust fundamentals. The deployer has a clean reputation with zero rug pulls across 5 previous projects. Liquidity is locked, sell tax is 0%, and holder distribution is healthy with no wallet exceeding 6%. The token has sustained organic growth over multiple days with no suspicious wash trading patterns detected." },
    { tokenAddress: "0xdogebnb987654321098765432109876543210fedc", score: 78, tier: "SAFE" as const, breakdown: { dev_wallet_history: 90, token_structure: 75, behavioral_patterns: 72, wallet_graph_analysis: 80, social_signals: 78, anomaly_score: 80 }, aiExplanation: "Solid project from a veteran developer with 15 previous launches and no rugs. Liquidity is locked and taxes are reasonable. Strong community engagement detected across social channels." },
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", score: 28, tier: "DANGER" as const, breakdown: { dev_wallet_history: 10, token_structure: 20, behavioral_patterns: 15, wallet_graph_analysis: 25, social_signals: 55, anomaly_score: 42 }, aiExplanation: "HIGH RISK: Deployed by a known serial scammer with 8 previous rug pulls. Liquidity is NOT locked. Excessive 15% sell tax functions as a honeypot mechanism. Two wallets control over 23% of supply. Sudden price pump of 25% suggests coordinated wash trading." },
    { tokenAddress: "0xfourmeme999888777666555444333222111000aaaa", score: 71, tier: "MODERATE" as const, breakdown: { dev_wallet_history: 65, token_structure: 75, behavioral_patterns: 70, wallet_graph_analysis: 72, social_signals: 80, anomaly_score: 68 }, aiExplanation: "Moderate risk profile. Developer has mixed history with 1 soft rug out of 10 projects. Liquidity is locked and holder distribution is healthy. Strong social signals and community support." },
    { tokenAddress: "0xfloki6667778889990001112223334445556667778", score: 85, tier: "SAFE" as const, breakdown: { dev_wallet_history: 88, token_structure: 82, behavioral_patterns: 85, wallet_graph_analysis: 86, social_signals: 80, anomaly_score: 88 }, aiExplanation: "Excellent trust score from a proven developer. Clean track record, locked liquidity, healthy holder base with good distribution. Organic growth patterns with no manipulation detected." },
    { tokenAddress: "0xscamcoin0000000000000000000000000000000000", score: 8, tier: "DANGER" as const, breakdown: { dev_wallet_history: 5, token_structure: 8, behavioral_patterns: 5, wallet_graph_analysis: 10, social_signals: 12, anomaly_score: 8 }, aiExplanation: "CONFIRMED SCAM. Deployed by known scammer. 95% price drop indicates completed rug pull. No liquidity locked. Extreme 25% sell tax. Two wallets hold 75% of supply. AVOID COMPLETELY." },
    { tokenAddress: "0xelonmusk9999999999999999999999999999999999", score: 12, tier: "DANGER" as const, breakdown: { dev_wallet_history: 8, token_structure: 12, behavioral_patterns: 10, wallet_graph_analysis: 15, social_signals: 18, anomaly_score: 11 }, aiExplanation: "CRITICAL RISK: Serial scammer deployer with 18 rug pulls. Single wallet holds 50% supply - classic honeypot setup. 78% price drop already occurred. Liquidity was removed within 24 hours of launch." },
    { tokenAddress: "0xcatcoin8888888888888888888888888888888888", score: 55, tier: "MODERATE" as const, breakdown: { dev_wallet_history: 40, token_structure: 65, behavioral_patterns: 58, wallet_graph_analysis: 60, social_signals: 55, anomaly_score: 62 }, aiExplanation: "New developer with limited track record. Liquidity is locked which is positive. Decent holder growth. However, 3% sell tax and relatively concentrated top holder at 8.5% warrant monitoring." },
    { tokenAddress: "0xbtcmem7777777777777777777777777777777777", score: 35, tier: "RISKY" as const, breakdown: { dev_wallet_history: 30, token_structure: 35, behavioral_patterns: 28, wallet_graph_analysis: 40, social_signals: 45, anomaly_score: 38 }, aiExplanation: "ELEVATED RISK: Developer has 3 previous soft rugs. 10% sell tax is concerning. Top holder at 12% suggests potential manipulation. No liquidity lock detected. Price declining -15% suggests early exit pattern." },
    { tokenAddress: "0xaisprint66666666666666666666666666666666", score: 74, tier: "MODERATE" as const, breakdown: { dev_wallet_history: 68, token_structure: 78, behavioral_patterns: 75, wallet_graph_analysis: 72, social_signals: 82, anomaly_score: 74 }, aiExplanation: "Strong project with good fundamentals. Developer has mostly clean history. Locked liquidity, low taxes, and growing community. Slight concern about mixed deployment history but overall positive signals dominate." },
  ];

  for (const s of scoreData) {
    await db.insert(trustScores).values(s).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${scoreData.length} trust scores`);

  // ── Risk Flags ──
  const flagData = [
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", flagType: "known_scammer_deployer", severity: "CRITICAL" as const, description: "Deployer has 8 confirmed rug pulls. Wallet tagged as serial scammer." },
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", flagType: "unlocked_liquidity", severity: "HIGH" as const, description: "Liquidity pool is not locked. Developer can remove liquidity at any time." },
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", flagType: "high_sell_tax", severity: "HIGH" as const, description: "15% sell tax detected. Functions as a honeypot mechanism preventing exit." },
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", flagType: "concentrated_supply", severity: "MEDIUM" as const, description: "Top 2 wallets hold 23.9% of total supply. Risk of market manipulation." },
    { tokenAddress: "0xscamcoin0000000000000000000000000000000000", flagType: "completed_rug_pull", severity: "CRITICAL" as const, description: "Token price dropped 95% from peak. Liquidity was drained by deployer." },
    { tokenAddress: "0xscamcoin0000000000000000000000000000000000", flagType: "honeypot_detected", severity: "CRITICAL" as const, description: "Buy transactions succeed but sell transactions fail or incur extreme fees." },
    { tokenAddress: "0xscamcoin0000000000000000000000000000000000", flagType: "extreme_supply_concentration", severity: "CRITICAL" as const, description: "Two wallets control 75% of total supply." },
    { tokenAddress: "0xelonmusk9999999999999999999999999999999999", flagType: "serial_scammer", severity: "CRITICAL" as const, description: "Deployer has 18 rug pulls out of 20 total projects. Most active scammer in cluster." },
    { tokenAddress: "0xelonmusk9999999999999999999999999999999999", flagType: "whale_control", severity: "CRITICAL" as const, description: "Single wallet holds 50% of supply - instant dump risk." },
    { tokenAddress: "0xelonmusk9999999999999999999999999999999999", flagType: "rapid_liquidity_removal", severity: "HIGH" as const, description: "Liquidity was removed within 24 hours of token launch." },
    { tokenAddress: "0xbtcmem7777777777777777777777777777777777", flagType: "soft_rug_history", severity: "HIGH" as const, description: "Deployer has 3 previous soft rugs (gradual liquidity removal)." },
    { tokenAddress: "0xbtcmem7777777777777777777777777777777777", flagType: "elevated_sell_tax", severity: "MEDIUM" as const, description: "10% sell tax limits exit options and enforces holding." },
    { tokenAddress: "0xbtcmem7777777777777777777777777777777777", flagType: "unlocked_lp", severity: "MEDIUM" as const, description: "Liquidity pool tokens not locked or burned." },
    { tokenAddress: "0xcatcoin8888888888888888888888888888888888", flagType: "new_wallet_deployer", severity: "LOW" as const, description: "First token from this deployer. No reputation history to evaluate." },
  ];

  for (const f of flagData) {
    await db.insert(riskFlags).values(f).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${flagData.length} risk flags`);

  // ── Graph Nodes ──
  const nodeData = [
    { nodeId: "0xdeadbeef1234567890abcdef1234567890abcdef", type: "wallet" as const, label: "Scammer #1", score: 15, tier: "DANGER", clusterId: "scam_cluster_0", tags: ["serial_scammer", "8_rugs"] },
    { nodeId: "0xscam222222222222222222222222222222222222", type: "wallet" as const, label: "Serial Rugger", score: 5, tier: "DANGER", clusterId: "scam_cluster_0", tags: ["18_rugs", "pro_scammer"] },
    { nodeId: "0xsuspect33333333333333333333333333333333", type: "wallet" as const, label: "Suspect Dev", score: 32, tier: "RISKY", clusterId: "scam_cluster_1", tags: ["3_soft_rugs"] },
    { nodeId: "0xtrust007777777777777777777777777777777777", type: "wallet" as const, label: "Trusted Dev", score: 88, tier: "SAFE", clusterId: "trusted_0", tags: ["0_rugs", "doxxed"] },
    { nodeId: "0xlegit9999999999999999999999999999999999", type: "wallet" as const, label: "Veteran Dev", score: 92, tier: "SAFE", clusterId: "trusted_0", tags: ["0_rugs", "veteran"] },
    { nodeId: "0xmoderate44444444444444444444444444444444", type: "wallet" as const, label: "Mixed Dev", score: 62, tier: "MODERATE", clusterId: null, tags: ["1_soft_rug"] },
    { nodeId: "0xnewbie1111111111111111111111111111111111", type: "wallet" as const, label: "New Dev", score: 45, tier: "MODERATE", clusterId: null, tags: ["new_wallet"] },
    { nodeId: "0xbinance666666666666666666666666666666666", type: "cex" as const, label: "Binance", score: 95, tier: "SAFE", clusterId: null, tags: ["cex"] },
    { nodeId: "0xmixer55555555555555555555555555555555555", type: "mixer" as const, label: "Tornado Mixer", score: 10, tier: "DANGER", clusterId: null, tags: ["privacy_pool"] },
    { nodeId: "0xpepememe123456789012345678901234567890abc", type: "token" as const, label: "PEPE", score: 82, tier: "SAFE", clusterId: null, tags: [] },
    { nodeId: "0xshibamem1122334455667788990011223344556677", type: "token" as const, label: "SHIB", score: 28, tier: "DANGER", clusterId: null, tags: [] },
    { nodeId: "0xscamcoin0000000000000000000000000000000000", type: "token" as const, label: "RICH", score: 8, tier: "DANGER", clusterId: null, tags: [] },
  ];

  for (const n of nodeData) {
    await db.insert(graphNodes).values(n).onConflictDoUpdate({
      target: graphNodes.nodeId,
      set: n,
    });
  }
  console.log(`✓ Inserted ${nodeData.length} graph nodes`);

  // ── Graph Edges ──
  const edgeData = [
    { source: "0xdeadbeef1234567890abcdef1234567890abcdef", target: "0xscamcoin0000000000000000000000000000000000", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xdeadbeef1234567890abcdef1234567890abcdef", target: "0xshibamem1122334455667788990011223344556677", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xdeadbeef1234567890abcdef1234567890abcdef", target: "0xscam222222222222222222222222222222222222", relationshipType: "funded", label: "funded", weight: 2 },
    { source: "0xscam222222222222222222222222222222222222", target: "0xelonmusk9999999999999999999999999999999999", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xscam222222222222222222222222222222222222", target: "0xmixer55555555555555555555555555555555555", relationshipType: "mixer_flow", label: "mixer", weight: 1 },
    { source: "0xtrust007777777777777777777777777777777777", target: "0xpepememe123456789012345678901234567890abc", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xtrust007777777777777777777777777777777777", target: "0xfloki6667778889990001112223334445556667778", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xlegit9999999999999999999999999999999999", target: "0xdogebnb987654321098765432109876543210fedc", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xlegit9999999999999999999999999999999999", target: "0xbinance666666666666666666666666666666666", relationshipType: "cex_deposit", label: "cex", weight: 1 },
    { source: "0xsuspect33333333333333333333333333333333", target: "0xbtcmem7777777777777777777777777777777777", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xmoderate44444444444444444444444444444444", target: "0xfourmeme999888777666555444333222111000aaaa", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xmoderate44444444444444444444444444444444", target: "0xaisprint66666666666666666666666666666666", relationshipType: "deployed", label: "deployed", weight: 3 },
    { source: "0xnewbie1111111111111111111111111111111111", target: "0xcatcoin8888888888888888888888888888888888", relationshipType: "deployed", label: "deployed", weight: 3 },
  ];

  for (const e of edgeData) {
    await db.insert(graphEdges).values(e).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${edgeData.length} graph edges`);

  // ── Alerts ──
  const alertData = [
    { tokenAddress: "0xscamcoin0000000000000000000000000000000000", tokenSymbol: "RICH", type: "rug_pull_confirmed", severity: "critical" as const, message: "Confirmed rug pull - 95% price drop, liquidity drained" },
    { tokenAddress: "0xelonmusk9999999999999999999999999999999999", tokenSymbol: "MARS", type: "honeypot_detected", severity: "critical" as const, message: "Honeypot detected - sells blocked, 50% whale holder" },
    { tokenAddress: "0xshibamem1122334455667788990011223344556677", tokenSymbol: "SHIB", type: "scammer_deployed", severity: "critical" as const, message: "Deployed by serial scammer with 8 previous rugs" },
    { tokenAddress: "0xbtcmem7777777777777777777777777777777777", tokenSymbol: "BTCM", type: "unlocked_liquidity", severity: "warning" as const, message: "Liquidity pool is not locked - withdrawal risk" },
    { tokenAddress: "0xaisprint66666666666666666666666666666666", tokenSymbol: "SPRINT", type: "ai_analyzed", severity: "info" as const, message: "AI analysis complete - Moderate risk, 74/100 score" },
  ];

  for (const a of alertData) {
    await db.insert(alerts).values(a).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${alertData.length} alerts`);

  console.log("\n✅ Seed complete! Database populated with mock data.");
  console.log("   Run 'npm run dev' to start the application.");
}

seed().catch(console.error);
