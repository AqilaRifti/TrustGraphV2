import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { tokens, trustScores, riskFlags, alerts, wallets } from "@db/schema";
import { eq, desc, ilike, or, sql, inArray } from "drizzle-orm";
import { MOCK_TOKENS, MOCK_TRUST_SCORES, MOCK_RISK_FLAGS, MOCK_WALLETS } from "./mock-data.js";

export const tokenRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        tier: z.string().optional(),
        sortBy: z.enum(["score", "mcap", "holders", "change"]).optional().default("score"),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, tier, sortBy = "score", limit = 50, offset = 0 } = input || {};

      let dbTokens: typeof MOCK_TOKENS = [];
      let dbScores: typeof MOCK_TRUST_SCORES = [];
      let dbFlags: typeof MOCK_RISK_FLAGS = [];

      try {
        // Build base query
        let conditions = undefined;
        if (search) {
          conditions = or(
            ilike(tokens.name, `%${search}%`),
            ilike(tokens.symbol, `%${search}%`),
            ilike(tokens.address, `%${search}%`)
          );
        }

        dbTokens = await db.select().from(tokens).where(conditions).limit(limit).offset(offset).orderBy(desc(tokens.createdAt)) as any;

        if (dbTokens.length === 0) {
          // Use mock data
          dbTokens = MOCK_TOKENS.filter(t => {
            if (search) {
              const q = search.toLowerCase();
              return t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q) || t.address.toLowerCase().includes(q);
            }
            return true;
          }) as any;
        }

        const tokenAddresses = dbTokens.map((t: any) => t.address);
        dbScores = tokenAddresses.length > 0
          ? await db.select().from(trustScores).where(inArray(trustScores.tokenAddress, tokenAddresses)) as any
          : [];

        if (dbScores.length === 0) {
          dbScores = MOCK_TRUST_SCORES.filter(s => tokenAddresses.includes(s.tokenAddress)) as any;
        }

        dbFlags = tokenAddresses.length > 0
          ? await db.select().from(riskFlags).where(inArray(riskFlags.tokenAddress, tokenAddresses)) as any
          : [];

        if (dbFlags.length === 0) {
          dbFlags = MOCK_RISK_FLAGS.filter(f => tokenAddresses.includes(f.tokenAddress)) as any;
        }
      } catch (e) {
        // Fallback to mock data on any error
        dbTokens = MOCK_TOKENS as any;
        dbScores = MOCK_TRUST_SCORES as any;
        dbFlags = MOCK_RISK_FLAGS as any;
      }

      // Combine data
      const combined = dbTokens.map((token: any) => {
        const score = dbScores.find((s: any) => s.tokenAddress === token.address);
        const flags = dbFlags.filter((f: any) => f.tokenAddress === token.address);
        const metadata = (token.metadata || {}) as Record<string, any>;

        return {
          token,
          trust_score: score || null,
          market_cap: metadata.market_cap || 0,
          holder_count: metadata.holder_count || 0,
          price_change_24h: metadata.price_change_24h || 0,
          liquidity_usd: metadata.liquidity_usd || 0,
          volume_24h: metadata.volume_24h || 0,
          risk_flag_count: flags.length,
        };
      });

      // Filter by tier if specified
      let filtered = combined;
      if (tier && tier !== "all") {
        filtered = combined.filter((c: any) => c.trust_score?.tier === tier);
      }

      // Sort
      filtered.sort((a: any, b: any) => {
        switch (sortBy) {
          case "score": return (b.trust_score?.score || 0) - (a.trust_score?.score || 0);
          case "mcap": return b.market_cap - a.market_cap;
          case "holders": return b.holder_count - a.holder_count;
          case "change": return b.price_change_24h - a.price_change_24h;
          default: return 0;
        }
      });

      return filtered;
    }),

  getByAddress: publicQuery
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();

      try {
        const token = await db.select().from(tokens).where(eq(tokens.address, input.address)).limit(1);

        if (token.length === 0) {
          // Check mock data
          const mockToken = MOCK_TOKENS.find(t => t.address.toLowerCase() === input.address.toLowerCase());
          if (!mockToken) return null;

          const mockScore = MOCK_TRUST_SCORES.find(s => s.tokenAddress.toLowerCase() === input.address.toLowerCase());
          const mockFlags = MOCK_RISK_FLAGS.filter(f => f.tokenAddress.toLowerCase() === input.address.toLowerCase());
          const mockWallet = MOCK_WALLETS.find(w => w.address.toLowerCase() === mockToken.deployer.toLowerCase());
          const metadata = mockToken.metadata || {};

          return {
            token: mockToken,
            trust_score: mockScore || null,
            risk_flags: mockFlags,
            deployer_wallet: mockWallet || null,
            holder_count: metadata.holder_count || 0,
            top_holders: metadata.top_holders || [],
            liquidity_usd: metadata.liquidity_usd || 0,
            market_cap: metadata.market_cap || 0,
            price_change_24h: metadata.price_change_24h || 0,
            volume_24h: metadata.volume_24h || 0,
          };
        }

        const score = await db.select().from(trustScores).where(eq(trustScores.tokenAddress, input.address)).limit(1);
        const flags = await db.select().from(riskFlags).where(eq(riskFlags.tokenAddress, input.address));
        const wallet = await db.select().from(wallets).where(eq(wallets.address, token[0].deployer)).limit(1);
        const metadata = (token[0].metadata || {}) as Record<string, any>;

        return {
          token: token[0],
          trust_score: score[0] || null,
          risk_flags: flags,
          deployer_wallet: wallet[0] || null,
          holder_count: metadata.holder_count || 0,
          top_holders: metadata.top_holders || [],
          liquidity_usd: metadata.liquidity_usd || 0,
          market_cap: metadata.market_cap || 0,
          price_change_24h: metadata.price_change_24h || 0,
          volume_24h: metadata.volume_24h || 0,
        };
      } catch (e) {
        // Fallback to mock data
        const mockToken = MOCK_TOKENS.find(t => t.address.toLowerCase() === input.address.toLowerCase());
        if (!mockToken) return null;

        const mockScore = MOCK_TRUST_SCORES.find(s => s.tokenAddress.toLowerCase() === input.address.toLowerCase());
        const mockFlags = MOCK_RISK_FLAGS.filter(f => f.tokenAddress.toLowerCase() === input.address.toLowerCase());
        const mockWallet = MOCK_WALLETS.find(w => w.address.toLowerCase() === mockToken.deployer.toLowerCase());
        const metadata = mockToken.metadata || {};

        return {
          token: mockToken,
          trust_score: mockScore || null,
          risk_flags: mockFlags,
          deployer_wallet: mockWallet || null,
          holder_count: metadata.holder_count || 0,
          top_holders: metadata.top_holders || [],
          liquidity_usd: metadata.liquidity_usd || 0,
          market_cap: metadata.market_cap || 0,
          price_change_24h: metadata.price_change_24h || 0,
          volume_24h: metadata.volume_24h || 0,
        };
      }
    }),

  stats: publicQuery.query(async () => {
    try {
      const db = getDb();
      const [tokenCount] = await db.select({ count: sql<number>`count(*)::int` }).from(tokens);
      const [flagCount] = await db.select({ count: sql<number>`count(*)::int` }).from(riskFlags);
      const [walletCount] = await db.select({ count: sql<number>`count(*)::int` }).from(wallets);
      const [alertCount] = await db.select({ count: sql<number>`count(*)::int` }).from(alerts).where(eq(alerts.read, false));

      if (tokenCount.count === 0) {
        return {
          tokens_scored: MOCK_TOKENS.length,
          rugs_detected: MOCK_RISK_FLAGS.length,
          wallets_tracked: MOCK_WALLETS.length,
          active_alerts: 3,
        };
      }

      return {
        tokens_scored: tokenCount.count,
        rugs_detected: flagCount.count,
        wallets_tracked: walletCount.count,
        active_alerts: alertCount.count,
      };
    } catch (e) {
      return {
        tokens_scored: MOCK_TOKENS.length,
        rugs_detected: MOCK_RISK_FLAGS.length,
        wallets_tracked: MOCK_WALLETS.length,
        active_alerts: 3,
      };
    }
  }),
});
