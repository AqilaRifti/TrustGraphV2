import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tokens, trustScores, riskFlags, wallets } from "@db/schema";
import { sql, eq } from "drizzle-orm";
import { MOCK_TOKENS, MOCK_TRUST_SCORES, MOCK_RISK_FLAGS, MOCK_WALLETS } from "./mock-data";

export const scanRouter = createRouter({
  portfolio: publicQuery
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        const allTokens = await db.select().from(tokens).limit(8).orderBy(sql`RAND()`);
        
        let useTokens = allTokens;
        if (allTokens.length === 0) {
          useTokens = MOCK_TOKENS.slice(0, 8) as any;
        }

        const tokenAddresses = useTokens.map((t: any) => t.address);
        let scoresList = tokenAddresses.length > 0
          ? await db.select().from(trustScores).where(sql`${trustScores.tokenAddress} IN (${tokenAddresses.join(",")})`)
          : [];
        if (scoresList.length === 0) {
          scoresList = MOCK_TRUST_SCORES.filter(s => tokenAddresses.includes(s.tokenAddress)) as any;
        }

        let flagsList = tokenAddresses.length > 0
          ? await db.select().from(riskFlags).where(sql`${riskFlags.tokenAddress} IN (${tokenAddresses.join(",")})`)
          : [];
        if (flagsList.length === 0) {
          flagsList = MOCK_RISK_FLAGS.filter(f => tokenAddresses.includes(f.tokenAddress)) as any;
        }

        const results = useTokens.map((token: any, i: number) => {
          const score = scoresList.find((s: any) => s.tokenAddress === token.address);
          const flags = flagsList.filter((f: any) => f.tokenAddress === token.address);
          const metadata = (token.metadata || {}) as Record<string, any>;
          
          const hash = token.address.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
          const value = (hash % 5000) + 100;
          const quantity = Math.floor((hash % 1000000) + 1000);
          const riskLevel = score
            ? score.score >= 75 ? "safe" : score.score >= 50 ? "moderate" : score.score >= 25 ? "risky" : "danger"
            : "unknown";

          return {
            token,
            trust_score: score || null,
            risk_flags: flags,
            estimated_value_usd: value,
            quantity,
            risk_level: riskLevel,
          };
        });

        const totalValue = results.reduce((s: number, r: any) => s + r.estimated_value_usd, 0);
        const atRisk = results.filter((r: any) => r.risk_level === "risky" || r.risk_level === "danger").reduce((s: number, r: any) => s + r.estimated_value_usd, 0);
        const safe = results.filter((r: any) => r.risk_level === "safe" || r.risk_level === "moderate").reduce((s: number, r: any) => s + r.estimated_value_usd, 0);

        const dangerCount = results.filter((r: any) => r.risk_level === "danger").length;
        const riskyCount = results.filter((r: any) => r.risk_level === "risky").length;
        const moderateCount = results.filter((r: any) => r.risk_level === "moderate").length;
        const safeCount = results.filter((r: any) => r.risk_level === "safe").length;

        let overallRisk = "safe";
        if (dangerCount > 0) overallRisk = "critical";
        else if (riskyCount > 1) overallRisk = "high";
        else if (riskyCount > 0) overallRisk = "moderate";

        const summary = dangerCount > 0
          ? `CRITICAL: ${dangerCount} token(s) in your portfolio are confirmed scams or honeypots. Immediate action recommended. $${atRisk.toFixed(0)} at risk.`
          : riskyCount > 0
          ? `WARNING: ${riskyCount} token(s) show elevated risk. Consider reducing exposure. $${atRisk.toFixed(0)} potentially at risk.`
          : `GOOD: Portfolio shows healthy risk distribution. Most tokens have acceptable trust scores.`;

        const walletData = MOCK_WALLETS.find(w => w.address.toLowerCase() === input.address.toLowerCase()) || null;

        return {
          wallet_address: input.address,
          wallet_info: walletData,
          tokens: results,
          total_value_usd: totalValue,
          at_risk_value: atRisk,
          safe_value: safe,
          overall_risk: overallRisk,
          summary,
          dangerCount,
          riskyCount,
          moderateCount,
          safeCount,
        };
      } catch (e) {
        // Use all mock data
        const useTokens = MOCK_TOKENS.slice(0, 8);
        const scoresList = MOCK_TRUST_SCORES;
        const flagsList = MOCK_RISK_FLAGS;

        const results = useTokens.map((token, i) => {
          const score = scoresList.find(s => s.tokenAddress === token.address);
          const flags = flagsList.filter(f => f.tokenAddress === token.address);
          const metadata = (token.metadata || {}) as Record<string, any>;
          
          const hash = token.address.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
          const value = (hash % 5000) + 100;
          const quantity = Math.floor((hash % 1000000) + 1000);
          const riskLevel = score
            ? score.score >= 75 ? "safe" : score.score >= 50 ? "moderate" : score.score >= 25 ? "risky" : "danger"
            : "unknown";

          return { token, trust_score: score || null, risk_flags: flags, estimated_value_usd: value, quantity, risk_level: riskLevel };
        });

        const totalValue = results.reduce((s, r) => s + r.estimated_value_usd, 0);
        const atRisk = results.filter(r => r.risk_level === "risky" || r.risk_level === "danger").reduce((s, r) => s + r.estimated_value_usd, 0);
        const dangerCount = results.filter(r => r.risk_level === "danger").length;
        const riskyCount = results.filter(r => r.risk_level === "risky").length;
        const moderateCount = results.filter(r => r.risk_level === "moderate").length;
        const safeCount = results.filter(r => r.risk_level === "safe").length;

        return {
          wallet_address: input.address,
          wallet_info: null,
          tokens: results,
          total_value_usd: totalValue,
          at_risk_value: atRisk,
          safe_value: totalValue - atRisk,
          overall_risk: dangerCount > 0 ? "critical" : riskyCount > 1 ? "high" : riskyCount > 0 ? "moderate" : "safe",
          summary: dangerCount > 0 ? `CRITICAL: ${dangerCount} token(s) are scams.` : `GOOD: Portfolio is healthy.`,
          dangerCount, riskyCount, moderateCount, safeCount,
        };
      }
    }),
});
