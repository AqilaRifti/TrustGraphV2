import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { wallets, tokens, trustScores } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { MOCK_WALLETS, MOCK_TOKENS, MOCK_TRUST_SCORES } from "./mock-data.js";

export const walletRouter = createRouter({
  getByAddress: publicQuery
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const wallet = await db.select().from(wallets).where(eq(wallets.address, input.address)).limit(1);

        if (wallet.length === 0) {
          // Check mock data
          const mockWallet = MOCK_WALLETS.find(w => w.address.toLowerCase() === input.address.toLowerCase());
          if (!mockWallet) {
            return {
              wallet: {
                address: input.address,
                firstSeen: null,
                totalTokensDeployed: 0,
                rugCount: 0,
                reputationScore: 50,
                clusterId: null,
                tags: [],
                metadata: {},
                displayName: `${input.address.slice(0, 6)}...${input.address.slice(-4)}`,
              },
              deployed_tokens: [],
            };
          }

          const deployedTokens = MOCK_TOKENS.filter(t => t.deployer.toLowerCase() === input.address.toLowerCase());
          const tokenAddresses = deployedTokens.map(t => t.address);
          const scores = MOCK_TRUST_SCORES.filter(s => tokenAddresses.includes(s.tokenAddress));

          const tokensWithScores = deployedTokens.map(t => ({
            token: t,
            score: scores.find(s => s.tokenAddress === t.address) || null,
          }));

          return { wallet: mockWallet, deployed_tokens: tokensWithScores };
        }

        const deployedTokens = await db.select().from(tokens).where(eq(tokens.deployer, input.address)).orderBy(desc(tokens.createdAt));
        const tokenAddresses = deployedTokens.map(t => t.address);
        const scores = tokenAddresses.length > 0
          ? await db.select().from(trustScores).where(sql`${trustScores.tokenAddress} IN (${tokenAddresses.join(",")})`)
          : [];

        const tokensWithScores = deployedTokens.map(t => ({
          token: t,
          score: scores.find(s => s.tokenAddress === t.address) || null,
        }));

        return { wallet: wallet[0], deployed_tokens: tokensWithScores };
      } catch (e) {
        // Fallback to mock data
        const mockWallet = MOCK_WALLETS.find(w => w.address.toLowerCase() === input.address.toLowerCase());
        if (!mockWallet) {
          return {
            wallet: {
              address: input.address,
              firstSeen: null,
              totalTokensDeployed: 0,
              rugCount: 0,
              reputationScore: 50,
              clusterId: null,
              tags: [],
              metadata: {},
              displayName: `${input.address.slice(0, 6)}...${input.address.slice(-4)}`,
            },
            deployed_tokens: [],
          };
        }

        const deployedTokens = MOCK_TOKENS.filter(t => t.deployer.toLowerCase() === input.address.toLowerCase());
        const tokenAddresses = deployedTokens.map(t => t.address);
        const scores = MOCK_TRUST_SCORES.filter(s => tokenAddresses.includes(s.tokenAddress));

        const tokensWithScores = deployedTokens.map(t => ({
          token: t,
          score: scores.find(s => s.tokenAddress === t.address) || null,
        }));

        return { wallet: mockWallet, deployed_tokens: tokensWithScores };
      }
    }),
});
