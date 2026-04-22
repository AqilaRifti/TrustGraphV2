import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

// Moralis integration - in production, you'd use the Moralis SDK with API key
// For demo, we provide a structure that can be easily wired to real Moralis calls

export const moralisRouter = createRouter({
  getTokenPrice: publicQuery
    .input(z.object({ address: z.string(), chain: z.string().optional().default("0x38") }))
    .query(async ({ input }) => {
      // In production: const price = await Moralis.EvmApi.token.getTokenPrice({ address: input.address, chain: input.chain });
      return {
        usdPrice: 0.00123,
        nativePrice: 0.000001,
        exchangeName: "PancakeSwap",
        exchangeAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        tokenAddress: input.address,
        tokenLogo: null,
        tokenSymbol: "MOCK",
        tokenName: "Mock Token",
      };
    }),

  getTokenTransfers: publicQuery
    .input(
      z.object({
        address: z.string(),
        chain: z.string().optional().default("0x38"),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ input }) => {
      return {
        total: 150,
        page: 0,
        pageSize: input.limit,
        result: Array.from({ length: Math.min(input.limit, 10) }, (_, i) => ({
          transactionHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          address: input.address,
          blockTimestamp: new Date(Date.now() - i * 3600000).toISOString(),
          blockNumber: (40000000 + i).toString(),
          blockHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          toAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          fromAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          value: (Math.random() * 1000000).toFixed(0),
        })),
      };
    }),

  getWalletTokenBalances: publicQuery
    .input(
      z.object({
        address: z.string(),
        chain: z.string().optional().default("0x38"),
      })
    )
    .query(async ({ input }) => {
      return {
        address: input.address,
        balance: (Math.random() * 10).toFixed(4),
        tokens: Array.from({ length: 5 }, (_, i) => ({
          tokenAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          symbol: ["CAKE", "BUSD", "USDT", "WBNB", "DAI"][i],
          name: ["PancakeSwap", "Binance USD", "Tether USD", "Wrapped BNB", "Dai Stablecoin"][i],
          logo: null,
          thumbnail: null,
          decimals: 18,
          balance: (Math.random() * 10000).toFixed(2),
          usdPrice: [3.5, 1.0, 1.0, 300, 1.0][i],
          usdValue: (Math.random() * 5000).toFixed(2),
          nativeToken: i === 3,
        })),
      };
    }),

  getTokenMetadata: publicQuery
    .input(
      z.object({
        addresses: z.array(z.string()),
        chain: z.string().optional().default("0x38"),
      })
    )
    .query(async ({ input }) => {
      return input.addresses.map((addr) => ({
        tokenAddress: addr,
        name: `Token ${addr.slice(0, 6)}`,
        symbol: addr.slice(0, 4).toUpperCase(),
        logo: null,
        logoHash: null,
        thumbnail: null,
        decimals: 18,
        totalSupply: (Math.random() * 1000000000).toFixed(0),
        totalSupplyFormatted: (Math.random() * 1000000000).toFixed(0),
        fullyDilutedValuation: (Math.random() * 1000000).toFixed(0),
        blockNumber: "40000000",
        validated: Math.random() > 0.5 ? 1 : 0,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        tokenOverrides: null,
        malicious: null,
      }));
    }),
});
