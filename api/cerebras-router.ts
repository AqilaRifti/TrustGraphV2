import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { cerebrasChatCompletion, generateTrustExplanation, getKeyStats } from "./cerebras-client.js";

export const cerebrasRouter = createRouter({
  analyzeToken: publicQuery
    .input(
      z.object({
        tokenName: z.string(),
        tokenSymbol: z.string(),
        score: z.number(),
        tier: z.string(),
        flags: z.array(
          z.object({
            type: z.string(),
            severity: z.string(),
            description: z.string(),
          })
        ).optional(),
        holderCount: z.number().optional(),
        liquidityUsd: z.number().optional(),
        deployerReputation: z.number().optional(),
        rugCount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generateTrustExplanation(
        input.tokenName,
        input.tokenSymbol,
        input.score,
        input.tier,
        input.flags || [],
        input.holderCount || 0,
        input.liquidityUsd || 0,
        input.deployerReputation || 50,
        input.rugCount || 0
      );
      return result;
    }),

  chat: publicQuery
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          })
        ),
        model: z.string().optional(),
        maxCompletionTokens: z.number().optional(),
        temperature: z.number().optional(),
        topP: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await cerebrasChatCompletion(input.messages, {
        model: input.model,
        maxCompletionTokens: input.maxCompletionTokens,
        temperature: input.temperature,
        topP: input.topP,
      });
      return response;
    }),

  keyStats: publicQuery.query(() => {
    return getKeyStats();
  }),
});
